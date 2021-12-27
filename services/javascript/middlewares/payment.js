const connection = require('../../../models/connection.js')

const nullCheck = (req,res,next) => {
    const {order_id,total_payment} = req.body;
    if(order_id === "" || total_payment <= 0 || !order_id || !total_payment)
    {
        return res.status(400).json({success:false,message:"Please enter all required fields"});
    }
    next();
}

const orderCheck = (req,res,next) => {
    const {order_id} = req.body;
    try {
        connection.query(`select visible_id from orders where visible_id='${order_id}'`,(err,result)=>{
            if(!result || result.length <= 0)
            {
                return res.status(400).json({success:false,message:"Invalid order id"});
            }
            next();
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
}

module.exports = {
    nullCheck,
    orderCheck
};