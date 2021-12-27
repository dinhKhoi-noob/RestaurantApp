const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const discountMiddleware = require('../middlewares/discount.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

route.post('/',discountMiddleware.nullCheck,discountMiddleware.dateCheck,discountMiddleware.titleCheck,(req,res)=>{
    const {title,date_begin,date_end} = req.body;
    try {
        const visibleId = randomString.generate(10);
        connection.query(`INSERT INTO discounts (visible_id, title, date_begin, date_end) VALUES ('${visibleId}', '${title}', '${date_begin}', '${date_end}')`,(err,result)=>{
            if(result)
                return res.json({success:true,message:"Successfully",visible_id: visibleId});
        })
    } catch (error) {
        return res.status(500).json({success:false,message: "Internal server error"});
    }
})

route.get('/',(req, res)=>{
    try {
        connection.query(`SELECT visible_id,title,date_begin,date_end FROM discounts`,(err,result)=>{
            if(result.length > 0)
                return res.json({success:true,message:"Successfully",result});
            return res.status(400).json({success:false,message:"Not found"});
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal"});
    }
})

route.patch('/:id',discountMiddleware.nullCheck,discountMiddleware.dateCheck,discountMiddleware.titleCheck,(req, res)=>{
    const id = req.params.id;
    const {title,date_begin,date_end} = req.body;
    const dateModified = new Date(Date.now()).toISOString().split('T')[0] + new Date(Date.now()).toLocaleString('en-US', { hour12: false }).split(',')[1]
    try {
        connection.query(`UPDATE discounts SET
            title = '${title}',
            date_begin = '${date_begin}',
            date_end = '${date_end}',
            date_modified= '${dateModified}'
        WHERE discounts.visible_id = '${id}'`,(err,result)=>{
            if(result)
                return res.json({success:true,message:"Successfully",visible_id:id});
        });
    } catch (error) {
        return res.status(500).json({success:false,message: "Internal server error"});
    }
})
module.exports = route;