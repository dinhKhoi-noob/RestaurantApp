const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const orderItemMiddleware = require('../middlewares/orderItem.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

route.post('/',orderItemMiddleware.nullCheck,orderItemMiddleware.orderCheck,orderItemMiddleware.productCheck,(req,res)=>{
    const {order_id,product_id,quantity} = req.body;
    try {
        const visible_id = randomString.generate(10);
        connection.query(`INSERT INTO order_items (visible_id, order_id, quantity, product_id) VALUES ('${visible_id}', '${order_id}',${quantity}, '${product_id}')`,(err,result)=>{
            return res.json({success:true,message:"Create order item successfully"});
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})

route.get('/:id',(req,res)=>{
    const order_id = req.params.id;
    try {
        connection.query(`select visible_id,product_id,quantity from order_items where order_id='${order_id}'`,(err,result)=>{
            if(result && result.length > 0)
            {
                return res.json({success:true,message:"Success",result})
            }
            console.log(`select visible_id,product_id where order_id='${order_id}'`);
            return res.status(404).json({success:false,message:"Not found"});
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server failed"})
    }
})

module.exports = route;