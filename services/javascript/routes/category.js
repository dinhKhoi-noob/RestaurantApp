const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const categoryMiddleware = require('../middlewares/category.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

route.post('/',categoryMiddleware.postCategory, (req, res)=>{
    try {
        let {title,category_id} = req.body;
        const visibleId = randomString.generate(10);
        if(!category_id)
            category_id = visibleId;
        let query = `insert into categories(visible_id,title,category_id) values('${visibleId}','${title}','${category_id}');`;
        connection.query(query,(err,result)=>{
            if(result) {
                return res.json({success: true, message: "Successfully",visible_id: visibleId});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false, message: "Error"});
    }
});
route.get('/',(req, res)=>{
    try {
        connection.query(`select visible_id,title,category_id from categories order by category_id`,(err,result)=>{
            if(result && result.length > 0)
                return res.json({success:true,message: "Successfully",result});
            return res.status(404).json({success:false,message: "Not found"});
        });
    } catch (error) {
        return res.status(500).json({success:false,message: "Internal server error"});
    }
});
route.get('/:id',(req, res)=>{
    try {
        const id = req.params.id;
        connection.query(`select visible_id,title,category_id from categories where visible_id='${id}'`,(err,result)=>{
            if(!result || result.length < 1)
                return res.status(404).json({success:false,message:"Invalid reference"});
            return res.json({success:true,message:"Successfully",result})
        });   
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
})
module.exports = route;