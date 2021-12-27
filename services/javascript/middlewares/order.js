const connection = require('../../../models/connection.js');

const nullCheck = (req, res, next) => {
    const {user_id} = req.body;
    if(!user_id || !date_created)
        return res.status(400).json({success:false,message:"Please enter all required fields"})
    next();
}

const referenceCheck = (req, res, next) => {
    const user_id = req.body.user_id;
    try {
        // console.log(`Select visible_id from users where visible_id='${user_id}'`);
        return connection.query(`Select visible_id from users where visible_id='${user_id}'`,(err,result)=>{
            if(!result || result.length < 1)
                return res.status(400).json({success:false,message:"Invalid user id"})
            next();
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

module.exports = {
    nullCheck,
    referenceCheck,
};