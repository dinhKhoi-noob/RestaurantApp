const connection = require("../../../models/connection.js");
const router = require("express").Router();
const randomString = require("randomstring");
const { checkPostNewAddress } = require("../middlewares/address");

router.get("/:uid", (req, res) => {
    const { uid } = req.params;
    connection.query(`Select * from address where user_id like '${uid}'`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length < -1) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        return res.status(200).json({ success: true, message: "OK", result });
    });
});

router.post("/:uid", checkPostNewAddress, (req, res) => {
    const { uid } = req.params;
    const { address } = req.body;
    const id = randomString.generate(10);
    connection.query(
        `Insert into address(id,address,user_id) values ('${id}','${address}','${uid}')`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
            return res.status(201).json({ success: true, message: "OK", id });
        }
    );
});

module.exports = router;
