const connection = require('../../../models/connection.js');
const nullCheck = (req,res,next) => {
    const {title,date_begin,date_end} = req.body;
    if(!title || !date_begin || !date_end || title==="" ||  date_begin==="" || date_end==="")
        return res.status(400).json({success: false, message:"Please enter all required fields"});
    next();
}

const dateCheck = (req, res, next) => {
    const {date_begin,date_end} = req.body;
    const dateFormat = /^(((\d{4})(-)(0[13578]|10|12)(-)(0[1-9]|[12][0-9]|3[01]))|((\d{4})(-)(0[469]|11)(-)(0[1-9]|[12][0-9]|30))|((\d{4})(-)(02)(-)(0[1-9]|[12][0-9]|2[0-8]))|(([02468][048]00)(-)(02)(-)(29))|(([13579][26]00)(-)(02)(-)(29))|(([0-9][0-9][0][48])(-)(02)(-)(29))|(([0-9][0-9][2468][048])(-)(02)(-)(29))|(([0-9][0-9][13579][26])(-)(02)(-)(29)))(\s)(([0-1][0-9]|2[0-4]):([0-5][0-9]):([0-5][0-9]))$/;
    if(!dateFormat.test(date_begin) || !dateFormat.test(date_end))
        return res.status(400).json({success: false, message:"Invalid input date"});
    next();
}

const titleCheck = (req, res, next) => {
    const title = req.body.title;
    const id = req.params.id;
    try {
        return connection.query(`SELECT visible_id FROM discounts WHERE title='${title}'`,(err,result)=>{
            if(result && result.length > 0)
                if(result[0].visible_id !== id)
                    return res.status(400).json({success: false, message:"Title already existed"});
                else
                    next();
            else
                next();
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal server failed"});
    }
}

module.exports = {
    nullCheck,
    dateCheck,
    titleCheck
};