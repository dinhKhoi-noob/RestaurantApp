const connection = require("../../../models/connection");

const nullCheck = (req, res, next) => {
    const {order_id,product_id,quantity} = req.body;
    if(!order_id || !product_id || order_id === "" || product_id === "" || !quantity || quantity < 1)
    {
        return res.status(400).json({success:false,message:"Please enter all required fields"});
    }
    next();
}
const orderCheck = (req,res,next) => {
    const {order_id} = req.body;
    try{
        return connection.query(`select visible_id from orders where visible_id = '${order_id}'`,(err,result)=>{
            if(!result || result.length < 1)
            {
                return res.status(400).json({success:false,message:"Invalid order id"});
            }
            next();
        })
    }
    catch(error){
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
}

const productCheck = (req,res,next) => {
    try {
        const {product_id} = req.body;
        return connection.query(`Select visible_id from products where visible_id = '${product_id}'`,(err,result)=>{
            if(!result || result.length < 1)
            {console.log(`Select visible_id from products where visible_id = '${product_id}'`)
                return res.status(400).json({success:false,message:"Invalid product id"});
            }
            
            next();
        })
    } catch (error) {
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
}
module.exports = {
    productCheck,
    nullCheck,
    orderCheck
};