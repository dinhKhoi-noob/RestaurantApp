const randomString = require("randomstring");
const verify = require("../middlewares/authenticate.js");
const productMiddleware = require("../middlewares/product.js");
const connection = require("../../../models/connection.js");
const route = require("express").Router();

route.post("/", productMiddleware.nullCheck, productMiddleware.titleCheck, (req, res) => {
    const { title, price, category_id, description } = req.body;
    console.log(title, price, category_id);
    try {
        const visibleId = randomString.generate(10);
        console.log(
            `INSERT INTO products (visible_id, title, category_id,price,description) VALUES ('${visibleId}', '${title}', '${category_id}','${price}','${description}')`
        );
        connection.query(
            `INSERT INTO products (visible_id, title, category_id,price,description) VALUES ('${visibleId}', '${title}', '${category_id}','${price}','${description}')`,
            (err, result) => {
                if (result) {
                    return res.json({ success: true, message: "Successfully", id: visibleId });
                }
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// route.get('/',(req,res)=>{
//     const searchString = req.query.search;
//     const discountSearch = req.query.discount ? req.query.discount : 0;
//     let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
//     let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
//     fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
//     toIndex = !toIndex?1000:toIndex;
//     const queryString = `SELECT visible_id,title,category_id,price,thumbnail,sale_percent FROM products where is_active=1 and on_sale=${discountSearch} ${searchString?` and title LIKE '%${searchString}%' ` :""} limit ${fromIndex},${toIndex}`;
//     console.log(queryString)
//     try {
//         return connection.query(queryString,(err,result)=>{
//             if(result && result.length > 0)
//                 return res.json({success:true,message:"Successfully",result});
//             return res.status(404).json({success:false,message:"Not found"})
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:"Internal server error"});
//     }
// })

// route.get('/detail/:id',(req,res)=>{
//     const id = req.params.id;
//     if(!id || id === '')
//     {
//         return res.status(400).json({success:false,message:"Missing parameter"});
//     }
//     try {
//         connection.query(`SELECT visible_id,title,category_id,price,sale_percent,thumbnail FROM products where visible_id = '${id}'`,(err,result)=>{
//             if(result && result.length > 0)
//             {
//                 return res.json({success:true,message:"Successfully",result});
//             }
//             res.status(404).json({success:false,message:"Not found"});
//         });
//     } catch (error) {
//         return res.status(500).json({success:false,message:"Internal server failed"});
//     }
// })

// route.get('/service', (req, res)=>{
//     const service = req.query.service;
//     let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
//     let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
//     fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
//     toIndex = !toIndex?1000:toIndex;
//     const queryString = `SELECT visible_id,title,category_id,price,sale_percent,thumbnail FROM products where service=${service} and is_active=1 limit ${fromIndex},${toIndex}`;
//     // console.log(queryString);
//     try {
//         return connection.query(queryString,(err,result)=>{
//             if(result && result.length > 0)
//                 return res.json({success:true,message:"Successfully",result});
//             return res.status(404).json({success:false,message:"Not found"});
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:"Internal server error"});
//     }
// })

// route.get('/all/:id', (req, res)=>{
//     const searchString = req.query.search;
//     const rootSearch = req.query.root;
//     const criteria = (rootSearch === '0' || !rootSearch)?"category_id":"root_category";
//     const id = req.params.id;
//     let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
//     let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
//     fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
//     toIndex = !toIndex?1000:toIndex;
//     const queryString = `SELECT visible_id,title,category_id,price,sale_percent,thumbnail FROM products where is_active=1 ${id!=='all'?`and ${criteria}='${id}'`:""} ${searchString?` and title LIKE '%${searchString}%'` :""}  order by on_sale desc limit ${fromIndex},${toIndex}`;
//     console.log(queryString);
//     try {
//         return connection.query(queryString,(err,result)=>{
//             if(result && result.length > 0)
//                 return res.json({success:true,message:"Successfully",result});
//             return res.status(404).json({success:false,message:"Not found"});
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:"Internal server error"});
//     }
// })

// route.get('/:id', (req, res)=>{
//     const discountSearch = req.query.discount ? req.query.discount : 0;
//     const searchString = req.query.search;
//     const rootSearch = req.query.root;
//     const criteria = (rootSearch === 0 || !rootSearch)?"category_id":"root_category";
//     const id = req.params.id;
//     let fromIndex = req.query.from < req.query.to ? req.query.from : req.query.to;
//     let toIndex = req.query.from < req.query.to ? req.query.to : req.query.from;
//     fromIndex = (fromIndex<0 || !fromIndex)?0:fromIndex;
//     toIndex = !toIndex?1000:toIndex;
//     const queryString = `SELECT visible_id,title,category_id,price,sale_percent,thumbnail FROM products where ${criteria}='${id}' and is_active=1 and on_sale=${discountSearch} ${searchString?" and title LIKE '%${searchString}% '" :""} limit ${fromIndex},${toIndex}`;
//     // console.log(queryString);
//     try {
//         return connection.query(queryString,(err,result)=>{
//             if(result.length > 0)
//                 return res.json({success:true,message:"Successfully",result});
//             return res.status(404).json({success:false,message:"Not found"});
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:"Internal server error"});
//     }
// })

route.get("/", (req, res) => {
    const { load_all, search } = req.query;
    const getQuery = `Select * from product_view where 1 ${
        load_all ? `` : `and is_active = 0 and category_status = 0`
    } ${search ? ` and title like '%${search}'%` : ""}`;
    console.log(getQuery);
    connection.query(getQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        return res.status(200).json({ success: true, message: "OK", result });
    });
});

route.get("/specific/:id", (req, res) => {
    const id = req.params.id;
    const getQuery = `Select * from product_view where id like '${id}'`;
    console.log(getQuery);
    connection.query(getQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        return res.status(200).json({ success: true, message: "OK", result: result[0] });
    });
});

route.patch("/:id", productMiddleware.nullCheck, (req, res) => {
    const { title, price, category_id, description } = req.body;
    const id = req.params.id;
    const dateModified =
        new Date(Date.now()).toISOString().split("T")[0] +
        new Date(Date.now()).toLocaleString("en-US", { hour12: false }).split(",")[1];
    const selectQuery = `select * from product_view where title like '${title}'`;
    console.log(selectQuery);
    const updateQuery = `UPDATE products SET
            title = '${title}',
            category_id = '${category_id}',
            price = ${price},
            description='${description}',
            date_modified='${dateModified}'
            WHERE visible_id like '${id}'`;
    console.log(updateQuery);
    connection.query(selectQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        console.log(result[0], id);
        if (result && result.length > 0 && result[0].id === id) {
            return connection.query(updateQuery, (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ success: false, message: "Internal server error" });
                }
                if (result) {
                    return res.json({ success: true, message: "Successfully", visible_id: id });
                }
            });
        }
        return res.status(400).json({ success: false, message: "Title already named" });
    });
});

// route.patch("/sale/:id", productMiddleware.saleCheck, (req, res) => {
//     const { sale_percent, on_sale } = req.body;
//     const dateModified =
//         new Date(Date.now()).toISOString().split("T")[0] +
//         new Date(Date.now()).toLocaleString("en-US", { hour12: false }).split(",")[1];
//     const id = req.params.id;
//     try {
//         connection.query(
//             `UPDATE products SET
//             sale_percent = ${sale_percent},
//             on_sale=${on_sale},
//             date_modified='${dateModified}'
//             WHERE products.visible_id = '${id}'`,
//             (err, result) => {
//                 if (result) {
//                     return res.json({ success: true, message: "Successfully", visible_id: id });
//                 }
//             }
//         );
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ success: false, message: "Internal server error" });
//     }
// });

route.patch("/status/:id", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const dateModified =
        new Date(Date.now()).toISOString().split("T")[0] +
        new Date(Date.now()).toLocaleString("en-US", { hour12: false }).split(",")[1];
    const selectQuery = `select * from product_view where id like '${id}'`;
    connection.query(selectQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0 && result[0].category_status === 1) {
            return res
                .status(400)
                .json({ success: false, message: "Category is now hidden, please unhide category first" });
        }
        return connection.query(
            `Update products set is_active = ${status} ,date_modified='${dateModified}' where visible_id like '${id}'`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ success: false, message: "Internal server error" });
                }
                return res.status(201).json({ success: false, message: "OK" });
            }
        );
    });
});

route.delete("/:id", (req, res) => {
    const id = req.params.id;
    const dateModified =
        new Date(Date.now()).toISOString().split("T")[0] +
        new Date(Date.now()).toLocaleString("en-US", { hour12: false }).split(",")[1];
    connection.query(
        `UPDATE products SET
            is_active = '0',
            date_modified='${dateModified}'
            WHERE visible_id = '${id}'`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
            if (result) {
                return res.json({ success: true, message: "Successfully", visible_id: visibleId });
            }
        }
    );
});

module.exports = route;
