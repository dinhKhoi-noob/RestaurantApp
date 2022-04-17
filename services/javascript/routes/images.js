const connection = require("../../../models/connection");
const randomString = require("randomstring");
const router = require("express").Router();
const { checkRequestRef } = require("../middlewares/images");

router.post("/:id", checkRequestRef, (req, res) => {
    const { images } = req.body;
    const { id } = req.params;
    let flag = true;
    for (let i = 0; i < images.length && flag; i++) {
        const imageId = randomString.generate(10);
        console.log(`Insert into product_images(id,url,product_id) values('${imageId}','${images[i]}','${id}')`);
        connection.query(
            `Insert into product_images(id,url,product_id) values('${imageId}','${images[i]}','${id}')`,
            (err, result) => {
                if (err) {
                    flag = false;
                }
            }
        );
    }
    if (!flag) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
    return res.status(201).json({ success: true, message: "OK" });
});

router.get("/", (req, res) => {
    const selectQuery = `Select * from product_images where is_active = 0`;
    connection.query(selectQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0) {
            return res.status(400).json({ success: false, message: "Not found" });
        }
        return res.status(200).json({ success: true, message: "OK", result });
    });
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    const selectQuery = `Select * from product_images where is_active = 0 and product_id like '${id}'`;
    console.log(selectQuery);
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

router.patch("/:id", checkRequestRef, (req, res) => {
    const { images } = req.body;
    const { id } = req.params;
    let flag = true;
    const updateQuery = `Update product_images set is_active = 1 where product_id like '${id}'`;
    connection.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        for (let i = 0; i < images.length && flag; i++) {
            const imageId = randomString.generate(10);
            console.log(`Insert into product_images(id,url,product_id) values('${imageId}','${images[i]}','${id}')`);
            connection.query(
                `Insert into product_images(id,url,product_id) values('${imageId}','${images[i]}','${id}')`,
                (err, result) => {
                    if (err) {
                        flag = false;
                    }
                }
            );
        }
    });
    if (!flag) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
    return res.status(201).json({ success: true, message: "OK" });
});

module.exports = router;
