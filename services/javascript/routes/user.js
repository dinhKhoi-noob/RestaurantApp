require('dotenv').config();
require('../middlewares/passport');
const userMiddleware = require('../middlewares/user.js');
const passport = require('passport');
const route = require("express").Router();
const connection = require('../../../models/connection.js');
const jwt = require('jsonwebtoken');
const randomString = require('randomstring');

const registerToken = (userId) => {
    const accessToken = jwt.sign({
        userId,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 3)
    },process.env.ACCESS_TOKEN_SECRET);
    return accessToken;
}

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

route.patch('/expired/:id',(req,res)=>{
    try {
        const userId = req.params.id;
        const {nextExpirationSession} = req.body;
        connection.query(`Update users set expiration_session = ${nextExpirationSession} where visible_id like '${userId}'`,(err,result)=>{
            if(err){
                return res.status(500).json({success:false,message:"Internal server failed"});
            }
            return res.json({success:true});
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
});

route.get('/:id', (req, res)=>{
    try {
        connection.query(`Select username, email, address, avatar, phone from users where visible_id=${req.params.id}`,(err,result)=>{
            if(!result || result.length <= 0){
                return res.status(404).json({success:false,message:"Not existed"});
            }
            return res.json({success:true,message:"Successfully",user:result[0]})
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
            return res.redirect(`/page/authorization?token=${token}`);
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
        let query = `insert into users (visible_id,username,password,email,is_logged) values('${visibleId}','${username}','${passwordHashed}','${email}',1)`;
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
                        return res.json({success:true,message:"Account has been created",uid:visibleId});
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
        let passwordValid;
        connection.query(`select * from users where email='${email}'`,async(error,result)=>{
            if(!result || result.length <= 0){
                return res.status(401).json({success:false,message:"Invalid email or password"});   
            }
            if(result[0].password){
                passwordValid = await bcrypt.compare(password,result[0].password);
            }
            if(!passwordValid){
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
            connection.query(`Update users set is_logged = 1 where visible_id like '${result[0].visible_id}'`);
            res.setHeader('Authorization',accessToken);
            return res.status(200).json({success:true,message:"Login successfully"});
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})
route.get('/google/callback',passport.authenticate('google',{failureRedirect:'/page/auth/google'}),(req,res)=>{
    const user = req.user;
    try {
        const profilePictureType = user.photos[0].value.split('/')[3];
        connection.query(`select * from users where email like '${user._json.email}'`,async(err,result)=>{
            if(result.length > 0){
                console.log(result[0]);
                if(result[0].login_by !== 'google'){
                    return res.redirect('/page/auth?existed_email='+result[0].login_by);
                }
                connection.query(`Update users set is_logged = 1 where visible_id like '${user.id}'`);
                const token = registerToken(user.id);
                return res.redirect(`/page/authorization?token=${token}`);
            }
            connection.query(`insert into users(visible_id, username, login_by, email${profilePictureType !== 'a'?',avatar':''}) values('${user.id}','${user._json.given_name}','google','${user._json.email}'${profilePictureType !== 'a'?`,'${user.photos[0].value}'`:''})`,(err,result)=>{
                if(err)
                {
                    return res.redirect('/page/auth/google');
                }
                connection.query(`select * from users where visible_id like '${user.id}'`,(err,users)=>{
                    if(users.length > 0){
                        connection.query(`Update users set is_logged = 1 where visible_id like '${user.id}'`)
                        const token = registerToken(user.id);
                        return res.redirect(`/page/authorization?token=${token}`);
                    }
                    return res.redirect('/page/auth/google');
                })
            })
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/page/auth/google');
    }
})

route.get('/facebook/callback',passport.authenticate('facebook',{failureRedirect:'/page/auth/facebook'}),(req,res)=>{
    const user = req.user;
    try {
        connection.query(`select * from users where email like '${user._json.email}'`,(err,result)=>{
            if(result.length > 0){
                if(result[0].login_by !== 'facebook'){
                    return res.redirect('/page/auth?existed_email='+result[0].login_by);
                }
                connection.query(`Update users set is_logged = 1 where visible_id like '${user._json.id}'`)
                const token = registerToken(user._json.id);
                return res.redirect(`/page/authorization?token=${token}`);
            }
            connection.query(`insert into users(visible_id, username, email, login_by) values('${user._json.id}','${user._json.name}','${user._json.email}','facebook')`,(err,result)=>{
                if(err)
                {
                    return res.redirect('/page/auth/facebook');
                }
                connection.query(`select * from users where visible_id like '${user.id}'`,(err,users)=>{
                    if(users.length > 0){
                        connection.query(`Update users set is_logged = 1 where visible_id like '${user._json.id}'`)
                        const token = registerToken(user._json.id);
                        return res.redirect(`/page/authorization?token=${token}`);
                    }
                    return res.redirect('/page/auth/facebook');
                })
            })
        })
    } catch (error) {
        console.log(error);
        return res.redirect('/page/auth/facebook');
    }
})

route.post('/verify',passport.authenticate('jwt',{session:false}),(req,res)=>{
    if(req.user){
        
        return res.json({success:true,user:req.user})
    }
    return res.status(401).json({success:false});
})

route.patch('/loggout/:id',(req,res)=>{
    try {
        const userId = req.params.id;
        const latestLoggedIn = new Date(Date.now()).toISOString().split('T')[0] + new Date(Date.now()).toLocaleString('en-US', { hour12: false }).split(',')[1]
        connection.query(`Update users set is_logged = 0, latest_logged_in = '${latestLoggedIn}' where visible_id like '${userId}'`);
        return res.json({success:true});
    } catch (error) {
        res.status(500).json({success:false,message:"Internal server failed"});
    }
})

module.exports = route;