const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const orderMiddleware = require('../middlewares/order.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

route.post('/',orderMiddleware.nullCheck, orderMiddleware.referenceCheck,(req,res)=>{
    const {user_id,date_created} = req.body;
    const visibleId = randomString.generate(10);
    try {
        return connection.query(`INSERT INTO orders (visible_id, user_id) VALUES ('${visibleId}', '${user_id}')`,(err,result)=>{
            if(result)
                return res.json({success: true,message:"Successfully",visible_id: visibleId});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message: "Internal server error"});
    }
})

route.get('/',(req,res)=>{
    try {
        return connection.query(`SELECT visible_id, date_created, user_id FROM orders`,(err,result)=>{
            if(result && result.length > 0)
                return res.json({success:true,message:"Successfully",result});
            return res.status(404).json({success:false,message:"Not found"});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})

route.get('/:id',(req,res)=>{
    const id = req.params.id;
    try {
        return connection.query(`SELECT visible_id, date_created, user_id FROM orders where visible_id='${id}'`,(err,result)=>{
            if(result && result.length > 0)
                return res.json({success:true,message:"Successfully",result});
            return res.status(404).json({success:false,message:"Not found"});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})

module.exports = route;