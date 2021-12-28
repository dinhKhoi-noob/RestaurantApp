const connection = require('../../../models/connection.js');
const registerMiddleware = (req,res,next) =>{
    try {
        const {username,password,email} = req.body;
        if(!username || !password || !email || username === "" || password === "" || email === "")
            return res.status(400).json({success:false,message:"Please enter all fields"});
        const sampleEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(!sampleEmail.test(email))
            return res.status(400).json({success:false,message:"Invalid email address"});
        let query = `select username from users where username='${username}'`;
        return connection.query(query,(error,result)=>{
            if(result && result.length > 0)
            {
                return res.status(403).json({success:false,message:"User is already registered"});
            }
            return connection.query(`select email from users where email like '${email}'`,(error,emailResult)=>{
                if(emailResult && emailResult.length > 0){
                    return res.status(403).json({success:false,message:"Email already in use"});
                }
                next();
            })
        });   
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

const loginMiddleware = (req,res,next) =>{
    console.log(req.body);
    const {email,password} = req.body;
    if(!email || !password || email.trim() === "" || password.trim() ==="")
        return res.status(400).json({success:false,message:"Missing email or password"});
    next();
}

module.exports = {
    registerMiddleware,
    loginMiddleware,
}