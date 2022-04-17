const nullCheck = (req, res, next) => {
    const { post_by, dish_id, point } = req.body;
    console.log(post_by, dish_id, point);
    if (
        !post_by ||
        !dish_id ||
        !point ||
        post_by.trim().length === 0 ||
        dish_id.trim().length === 0 ||
        point === 0 ||
        point > 5
    ) {
        return res.status(400).json({ success: false, message: "Please enter all required fields" });
    }
    next();
};

module.exports = { nullCheck };
