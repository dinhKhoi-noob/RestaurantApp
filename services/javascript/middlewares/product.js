const connection = require('../../../models/connection.js');
const nullCheck = (req,res,next) =>{
    const {title,category_id,price,root_category} = req.body;
    if(!title || !category_id || !price || !root_category || title==="" || category_id ==="" || price === "" || root_category ==="" || price === 0)
        return res.status(400).json({success: false,message:"Please enter all fields"});
    next();
}

const referenceCheck = (req, res, next) =>{
    const {category_id,root_category} = req.body;
    try {
        return connection.query(`select visible_id,title,category_id from categories where visible_id='${category_id}'`,(err,result)=>{
            if(result.length < 1)
                return res.status(404).json({success: false,message:"Invalid category id"});
            return connection.query(`select visible_id,title,category_id from categories where visible_id='${root_category}'`,(err,result)=>{
                if(result.length < 1){
                    return res.status(404).json({success: false,message:"Invalid category id"});
                }
                next();
            })
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({success: false,message:"Internal server error"});
    }
}

const titleCheck = (req, res, next) => {
    try {
        const title = req.body.title;
        return connection.query(`select visible_id from products where title='${title}'`,(err,result)=>{
            if(result && result.length > 0)
                return res.status(400).json({success: false,message:"Title already named"})
            next();
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server error"});
    }
}

const saleCheck = (req, res, next) => {
    const {on_sale,sale_percent} = req.body;
    if(!sale_percent || !on_sale || on_sale <= 0 || on_sale > 100)
        return res.status(400).json({success: false,message:"Please enter all fields"});
    next();
}
module.exports = {
    nullCheck,
    referenceCheck,
    titleCheck,
    saleCheck
};