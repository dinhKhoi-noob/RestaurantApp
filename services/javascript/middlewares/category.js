const connection = require('../../../models/connection.js');

const postCategory = (req,res,next) => {
    try {
        const {title} = req.body;
        console.log(title);
        if(title === "" || !title)
            return res.status(400).json({success:false,message:"Please enter all field"});
        if(req.body.category_id)
        {
            return connection.query(`select visible_id,title,category_id from categories where visible_id='${req.body.category_id}'`,(err,result)=>{
                if(result.length < 1)
                    return res.status(404).json({success:false,message:"Invalid reference"});
                next();
            })
        }
        next();   
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Server Error"});
    }
}
const getCategoryByName = (req, res) =>{
    const name = req.params.name;
    if(!name || name === "")
        return res.status(400).json({success:false,message:"Please enter a name"});   
}
module.exports = {
    postCategory,
    getCategoryByName
};