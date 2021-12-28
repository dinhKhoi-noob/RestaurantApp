require('dotenv').config();
require('../middlewares/passport');
const userMiddleware = require('../middlewares/user.js');
const passport = require('passport');
const route = require("express").Router();
const connection = require('../../../models/connection.js');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');

route.get('/', (req, res)=>{
    try {
        connection.query(`Select username, balance, email, address, total_saving from users`,(err,result)=>{
            if(!result || result.length <= 0){
                return res.status(404).json({success:false,message:"Not found"});
            }
            return res.json({success:true,message:"Successfully",result})
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
})

route.get('/:id', (req, res)=>{
    try {
        connection.query(`Select username, balance, email, address, total_saving from users where visible_id=${req.params.id}`,(err,result)=>{
            if(!result || result.length <= 0){
                return res.status(404).json({success:false,message:"Not found"});
            }
            return res.json({success:true,message:"Successfully",result})
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
})

route.get('/confirm/:token',(req,res)=>{
    try {
        const token = req.params.token;
        const jwt = require('jsonwebtoken');
        const userId = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET).userId;
        console.log(userId);
        connection.query(`Update users set is_confirmed = 1 where visible_id like '${userId}'`,(err,result)=>{
            if(err){
                return res.redirect('/page/auth')
            }
            return res.redirect(`/page/index?uid=${userId}`);
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/page/auth')
    }
})

route.post('/register',userMiddleware.registerMiddleware,async(req,res)=>{
    try {
        const transporter = require('nodemailer').createTransport({
            service: 'gmail',
            auth:{
                user: process.env.GOOGLE_USER,
                pass: process.env.GOOGLE_PASS
            }
        })
        const bcrypt = require('bcryptjs');
        const {username,password,email} = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password,salt);
        const visibleId = randomString.generate(10);
        let query = `insert into users (visible_id,username,password,email) values('${visibleId}','${username}','${passwordHashed}','${email}')`;
        connection.query(query,(err,result) => {
            if(result){
                jwt.sign({
                    userId:visibleId,
                    iat:new Date().getTime(),
                    exp:new Date().setDate(new Date().getDate() + 3)
                },process.env.ACCESS_TOKEN_SECRET,(err,token)=>{
                    transporter.sendMail({
                        from: process.env.GOOGLE_USER,
                        to: email,
                        subject: "Register confirmation",
                        html:`
                            <div>Please click this button to confirm:</div>
                            <br>
                            <a 
                            style="
                                text-decoration:none;
                                padding:3px 30px;
                                color:white;
                                background-color:#0f9dce;
                                border-radius:3px;
                            "
                            href="http://${process.env.express_host}:${process.env.express_port}/api/auth/confirm/${token}"
                            >
                                Confirm
                            </a>
                        `
                    },(err,info)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).json({success:false,message:"Internal server failed"})
                        }
                        return res.json({success:true,message:"Account has been created"});
                    })
                });
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
});

route.post('/login',userMiddleware.loginMiddleware,(req,res)=>{
    try {
        const bcrypt = require('bcryptjs');
        const {email,password} = req.body;
        connection.query(`select * from users where email='${email}'`,async(error,result)=>{
            if(!result || result.length <= 0)
                return res.status(401).json({success:false,message:"Invalid email or password"});
            const passwordValid = await bcrypt.compare(password,result[0].password);
            if(!passwordValid)
            {
                return res.status(401).json({success:false,message:"Invalid email or password"});
            }
            if(result[0].is_confirmed === 0){
                const transporter = require('nodemailer').createTransport({
                    service: 'gmail',
                    auth:{
                        user: process.env.GOOGLE_USER,
                        pass: process.env.GOOGLE_PASS
                    }
                })
                jwt.sign({
                    userId:result[0].visible_id,
                    iat: new Date().getTime(),
                    exp: new Date().setDate(new Date().getDate() + 3)
                },process.env.ACCESS_TOKEN_SECRET,(err,token)=>{
                    transporter.sendMail({
                        from: process.env.GOOGLE_USER,
                        to: email,
                        subject: "Register confirmation",
                        html:`
                            <div>Please click this button to complete your registeration:</div>
                            <br>
                            <a 
                            style="
                                text-decoration:none;
                                padding:3px 30px;
                                color:white;
                                background-color:#0f9dce;
                                border-radius:3px;
                            "
                            href="http://${process.env.express_host}:${process.env.express_port}/api/auth/confirm/${token}"
                            >
                                Confirm
                            </a>
                        `
                    },(err,info)=>{
                        if(err){
                            console.log(err);
                            return res.status(500).json({success:false,message:"Internal server failed"})
                        }
                        return res.status(201).json({success:true,message:"Email has been sent"});
                    })
                });
                return;
            }
            const accessToken = jwt.sign({
                userId:result[0].visible_id,
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 3)
            },process.env.ACCESS_TOKEN_SECRET);
            res.setHeader("user_id",result[0].visible_id);
            res.setHeader('Authorization',accessToken);
            return res.status(200).json({success:true,message:"Login successfully"});
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})

route.get('/google/callback',passport.authenticate('google',{failureRedirect:'/google'}),(req,res)=>{
    const user = req.user;
    try {
        const profilePictureType = user.photos[0].value.split('/')[3];
        connection.query(`select * from users where visible_id like '${user.id}'`,(err,result)=>{
            if(result.length > 0){
                return res.redirect(`/page/index?uid=${user.id}`);
            }
            connection.query(`insert into users(visible_id, username, email${profilePictureType !== 'a'?',avatar':''}) values('${user.id}','${user._json.given_name}','${user._json.email}'${profilePictureType !== 'a'?`,'${user.photos[0].value}'`:''})`,(err,result)=>{
                if(err)
                {
                    return res.redirect('/google');
                }
                connection.query(`select * from users where visible_id like '${user.id}'`,(err,users)=>{
                    if(users.length > 0){
                        return res.redirect(`/page/index?uid=${user.id}`);
                    }
                    return res.redirect('/google');
                })
            })
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/google');
    }
})

route.get('/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/facebook'}),(req,res)=>{
    const user = req.user;
    try {
        connection.query(`select * from users where visible_id like '${user.id}'`,(err,result)=>{
            if(result.length > 0){
                return res.redirect(`/page/index?uid=${user.id}`);
            }
            connection.query(`insert into users(visible_id, username, email) values('${user.id}','${user._json.name}','${user._json.email}')`,(err,result)=>{
                if(err)
                {
                    return res.redirect('/facebook');
                }
                connection.query(`select * from users where visible_id like '${user.id}'`,(err,users)=>{
                    if(users.length > 0){
                        return res.redirect(`/page/index?uid=${user.id}`);
                    }
                    return res.redirect('/facebook');
                })
            })
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/google');
    }
})

route.post('/verify',passport.authenticate('jwt',{session:false}),(req,res)=>{
    if(req.user){
        return res.json({success:true,user:req.user})
    }
    return res.status(401).json({success:false});
})

module.exports = route;
