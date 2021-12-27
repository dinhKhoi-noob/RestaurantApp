const randomString = require('randomstring');
const verify = require('../middlewares/authenticate.js');
const productMiddleware = require('../middlewares/product.js');
const connection = require('../../../models/connection.js');
const route = require("express").Router();

route.post('/',productMiddleware.nullCheck, productMiddleware.referenceCheck, productMiddleware.titleCheck, (req, res) => {
    const {title,price,category_id,root_category,thumbnail,service} = req.body;
    console.log(title,price,category_id,root_category,thumbnail,service);
    try {
        const visibleId = randomString.generate(10);
        connection.query(`INSERT INTO products (visible_id, title, category_id, price,root_category,service,thumbnail) VALUES ('${visibleId}', '${title}', '${category_id}','${price}','${root_category}','${service}','${thumbnail}')`,(err,result)=>{
            if(result) {
                return res.json({success: true,message:"Successfully",visible_id: visibleId});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Internal server error"});
    }
});

route.get('/',(req,res)=>{
    const searchString = req.query.search;
    const discountSearch = req.query.discount ? req.query.discount : 0;
    let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
    let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
    fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
    toIndex = !toIndex?1000:toIndex;
    const queryString = `SELECT visible_id,title,category_id,price,thumbnail,sale_percent FROM products where is_active=1 and on_sale=${discountSearch} ${searchString?` and title LIKE '%${searchString}%' ` :""} limit ${fromIndex},${toIndex}`;
    console.log(queryString)
    try {
        return connection.query(queryString,(err,result)=>{
            if(result && result.length > 0)
                return res.json({success:true,message:"Successfully",result});
            return res.status(404).json({success:false,message:"Not found"})
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
})

route.get('/detail/:id',(req,res)=>{
    const id = req.params.id;
    if(!id || id === '') 
    {
        return res.status(400).json({success:false,message:"Missing parameter"});
    }
    try {
        connection.query(`SELECT visible_id,title,category_id,price,sale_percent,thumbnail FROM products where visible_id = '${id}'`,(err,result)=>{
            if(result && result.length > 0)
            {
                return res.json({success:true,message:"Successfully",result});
            }
            res.status(404).json({success:false,message:"Not found"});
        });   
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
})

route.get('/service', (req, res)=>{
    const service = req.query.service;
    let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
    let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
    fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
    toIndex = !toIndex?1000:toIndex;
    const queryString = `SELECT visible_id,title,category_id,price,sale_percent,thumbnail FROM products where service=${service} and is_active=1 limit ${fromIndex},${toIndex}`;
    // console.log(queryString);
    try {
        return connection.query(queryString,(err,result)=>{
            if(result && result.length > 0)
                return res.json({success:true,message:"Successfully",result});
            return res.status(404).json({success:false,message:"Not found"});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
})

route.get('/all/:id', (req, res)=>{
    const searchString = req.query.search;
    const rootSearch = req.query.root;
    const criteria = (rootSearch === '0' || !rootSearch)?"category_id":"root_category";
    const id = req.params.id;
    let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
    let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
    fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
    toIndex = !toIndex?1000:toIndex;
    const queryString = `SELECT visible_id,title,category_id,price,sale_percent,thumbnail FROM products where is_active=1 ${id!=='all'?`and ${criteria}='${id}'`:""} ${searchString?` and title LIKE '%${searchString}%'` :""}  order by on_sale desc limit ${fromIndex},${toIndex}`;
    console.log(queryString);
    try {
        return connection.query(queryString,(err,result)=>{
            if(result && result.length > 0)
                return res.json({success:true,message:"Successfully",result});
            return res.status(404).json({success:false,message:"Not found"});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
})

route.get('/:id', (req, res)=>{
    const discountSearch = req.query.discount ? req.query.discount : 0;
    const searchString = req.query.search;
    const rootSearch = req.query.root;
    const criteria = (rootSearch === 0 || !rootSearch)?"category_id":"root_category";
    const id = req.params.id;
    let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
    let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
    fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
    toIndex = !toIndex?1000:toIndex;
    const queryString = `SELECT visible_id,title,category_id,price,sale_percent,thumbnail FROM products where ${criteria}='${id}' and is_active=1 and on_sale=${discountSearch} ${searchString?" and title LIKE '%${searchString}% '" :""} limit ${fromIndex},${toIndex}`;
    // console.log(queryString);
    try {
        return connection.query(queryString,(err,result)=>{
            if(result.length > 0)
                return res.json({success:true,message:"Successfully",result});
            return res.status(404).json({success:false,message:"Not found"});
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server error"});
    }
})

route.patch('/:id',productMiddleware.nullCheck,productMiddleware.referenceCheck,productMiddleware.titleCheck,(req,res)=>{
    const {title,price,category_id,root_category} = req.body;
    const id = req.params.id;
    const dateModified = new Date(Date.now()).toISOString().split('T')[0] + new Date(Date.now()).toLocaleString('en-US', { hour12: false }).split(',')[1]
    try {
        connection.query(`UPDATE products SET
            title = '${title}',
            category_id = '${category_id}',
            price = ${price},
            root_category='${root_category}',
            date_modified='${dateModified}'
            WHERE products.visible_id = '${id}'`,
        (err,result)=>{
            if(result) {
                return res.json({success: true,message:"Successfully",visible_id: id});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Internal server error"});
    }
})

route.patch('/sale/:id',productMiddleware.saleCheck,(req,res)=>{
    const {sale_percent,on_sale} = req.body;
    const dateModified = new Date(Date.now()).toISOString().split('T')[0] + new Date(Date.now()).toLocaleString('en-US', { hour12: false }).split(',')[1]
    const id = req.params.id;
    try {
        connection.query(`UPDATE products SET
            sale_percent = ${sale_percent},
            on_sale=${on_sale},
            date_modified='${dateModified}'
            WHERE products.visible_id = '${id}'`,
        (err,result)=>{
            if(result) {
                return res.json({success: true,message:"Successfully",visible_id: id});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Internal server error"});
    }
})

route.delete('/:id',(req,res)=>{
    const id = req.params.id;
    const dateModified = new Date(Date.now()).toISOString().split('T')[0] + new Date(Date.now()).toLocaleString('en-US', { hour12: false }).split(',')[1]
    try {
        connection.query(`UPDATE products SET
            is_active = '0',
            date_modified='${dateModified}'
            WHERE products.visible_id = '${id}'`,
        (err,result)=>{
            if(result) {
                return res.json({success: true,message:"Successfully",visible_id: visibleId});
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Internal server error",visible_id:id});
    }
})

module.exports = route;