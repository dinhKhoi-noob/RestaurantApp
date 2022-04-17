const connection = require("../../../models/connection");

const checkPostNewAddress = (req, res, next) => {
    const { uid } = req.params;
    const { address } = req.body;
    if (!uid || !address || uid === "" || address === "") {
        return res
            .status(BAD_REQUEST.status)
            .json({ success: false, message: "Thông tin không hợp lệ, vui lòng thử lại !" });
    }
    connection.query(`Select visible_id from users where visible_id like '${uid}'`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length < 1) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        return connection.query(
            `Select id from address where address like '${address}' and user_id like '${uid}'`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ success: false, message: "Internal server error" });
                }
                if (result && result.length > 0) {
                    return res
                        .status(400)
                        .json({ success: false, message: "Address is already in existed, please try again" });
                }
                next();
            }
        );
    });
};

module.exports = { checkPostNewAddress };
