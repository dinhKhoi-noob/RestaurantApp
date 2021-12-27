const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const paymentMiddleware = require('../middlewares/payment.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

route.post('/',paymentMiddleware.nullCheck,paymentMiddleware.orderCheck,(req,res)=>{
    const {order_id,total_payment} = req.body;
    try {
        const visible_id = randomString.generate(10);
        connection.query(`INSERT INTO payments (visible_id, order_id, total_payment) VALUES ('${visible_id}', '${order_id}', '${total_payment}')`,(err,result)=>{
            return res.json({success:true,message:"Success",visible_id})
        })
    } catch (error) {
        return res.status(500).json({success:true,message:"Internal server failed"})
    }
})
route.get('/',(req,res)=>{
    try {
        connection.query(`SELECT visible_id,order_id,total_payment FROM payments`,(err,result)=>{
            if(result && result.length > 0)
            {
                return res.json({success:true,message:"Success",result});
            }
            return res.status(404).json({success:false,message:"Not found"});
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})

route.get('/:id',(req,res)=>{
    const id = req.params.id;
    try {
        connection.query(`SELECT visible_id,order_id,total_payment FROM payments where visible_id='${id}'`,(err,result)=>{
            if(result && result.length > 0)
            {
                return res.json({success:true,message:"Success",result});
            }
            return res.status(404).json({success:false,message:"Not found"});
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})
module.exports = route;