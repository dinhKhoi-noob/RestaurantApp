const randomString = require("randomstring");
const connection = require("../../../models/connection.js");
const router = require("express").Router();
const { nullCheck } = require("../middlewares/rating");

router.post("/", nullCheck, (req, res) => {
    const { comment, post_by, dish_id, point } = req.body;
    const id = randomString.generate(10);
    const insertQuery = `Insert into rating(id,rate_by,dish_id,rate_point,comment) values 
    ('${id}','${post_by}','${dish_id}',${point},'${comment ? comment : null}')`;
    console.log(insertQuery);
    connection.query(insertQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        return res.status(201).json({ success: true, message: "OK" });
    });
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    const selectQuery = `Select * from rating_view where dish_id like '${id}'`;
    connection.query(selectQuery, (err, result) => {
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

router.get("/", (req, res) => {
    const selectQuery = `Select * from rating_view`;
    connection.query(selectQuery, (err, result) => {
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

module.exports = router;
