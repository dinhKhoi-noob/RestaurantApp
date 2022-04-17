const checkRequestRef = (req, res, next) => {
    const { id } = req.params;
    const { images } = req.body;
    if (!id || !images || id === "" || images.length === 0) {
        return res.status(400).json({ success: false, message: "Please send at least one image" });
    }
    next();
};

module.exports = { checkRequestRef };
