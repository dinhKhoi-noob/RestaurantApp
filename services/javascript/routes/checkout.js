const connection = require("../../../models/connection.js");
const router = require("express").Router();
const randomString = require("randomstring");

const nullCheck = (req, res, next) => {
    const { total, address, phone, username, orderList } = req.body;
    if (
        total < 0 ||
        !address ||
        !total ||
        !phone ||
        !username ||
        address.trim().length === 0 ||
        phone.trim().length === 0 ||
        username.trim().length === 0 ||
        orderList.length === 0
    ) {
        return res.status(400).json({ success: false, message: "Please enter all required field" });
    }
    next();
};

router.post("/", nullCheck, (req, res) => {
    const orderId = randomString.generate(10);
    const { uid, orderList, total, address, phone, username } = req.body;
    const insertQuery = `Insert into orders(id,user_id,address,phone,full_name,total) values('${orderId}','${uid}','${address}','${phone}','${username}','${total}')`;
    connection.query(insertQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        let flag = true;
        for (let i = 0; i < orderList.length && flag; i++) {
            const orderItemId = randomString.generate(10);
            const { id, price, quantity, images } = orderList[i];
            const insertOrderItemQuery = `INSERT INTO order_items(id,order_id,product_id,price,quantity,thumbnail) 
            values('${orderItemId}','${orderId}','${id}','${price}','${quantity}','${images[0]}')`;
            connection.query(insertOrderItemQuery, (err, result) => {
                if (err) {
                    console.log(err);
                    flag = false;
                }
            });
        }
        if (!flag) {
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        return res.status(201).json({ success: true, message: "OK" });
    });
});

router.get("/", (req, res) => {
    const { date_begin, date_end } = req.query;
    connection.query(
        `Select * from order_view where 1 ${
            date_begin ? `and date_created between '${date_begin}' and '${date_end}'` : ""
        }`,
        (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
            if (result && result.length === 0) {
                return res.status(404).json({ success: false, message: "No results found" });
            }
            return res.status(200).json({ success: true, message: "OK", result });
        }
    );
});

router.get("/:id", (req, res) => {
    const id = req.params.id;
    console.log(`Select * from order_view where user_id like '${id}'`);
    connection.query(`Select * from order_view where user_id like '${id}'`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0) {
            return res.status(404).json({ success: false, message: "No results found" });
        }
        return res.status(200).json({ success: true, message: "OK", result });
    });
});

router.get("/specific/:id", (req, res) => {
    const id = req.params.id;
    console.log(`Select * from order_view where id like '${id}'`);
    connection.query(`Select * from order_view where id like '${id}'`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0) {
            return res.status(404).json({ success: false, message: "No results found" });
        }
        return res.status(200).json({ success: true, message: "OK", result: result[0] });
    });
});

router.get("/item", (req, res) => {
    connection.query(`Select * from order_items`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0) {
            return res.status(404).json({ success: false, message: "No results found" });
        }
        return res.status(200).json({ success: true, message: "OK", result });
    });
});

router.get("/item/:id", (req, res) => {
    const id = req.params.id;
    connection.query(`Select * from order_item_view where id like '${id}'`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0) {
            return res.status(404).json({ success: false, message: "No results found" });
        }
        return res.status(200).json({ success: true, message: "OK", result });
    });
});

router.patch("/:id", nullCheck, (req, res) => {
    const orderId = req.params.id;
    const { orderList, total, address, phone, username } = req.body;
    const updateQuery = `update orders set phone = '${phone}',
            address = '${address}',
            full_name = '${username}',
            total = '${total}'
            where id like '${orderId}' and is_confirm = 1`;
    console.log(updateQuery);
    connection.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        return connection.query(`delete from order_items where order_id like '${orderId}'`, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
            let flag = true;
            for (let i = 0; i < orderList.length && flag; i++) {
                const orderItemId = randomString.generate(10);
                const { id, price, quantity, images } = orderList[i];
                const insertOrderItemQuery = `INSERT INTO order_items(id,order_id,product_id,price,quantity,thumbnail) 
            values('${orderItemId}','${orderId}','${id}','${price}','${quantity}','${images[0]}')`;
                connection.query(insertOrderItemQuery, (err, result) => {
                    if (err) {
                        console.log(err);
                        flag = false;
                    }
                });
            }
            if (!flag) {
                return res.status(500).json({ success: false, message: "Internal server error" });
            }
            return res.status(201).json({ success: true, message: "OK" });
        });
    });
});

router.patch("/status/:id", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const updateQuery = `Update orders set status = '${status}' where id like '${id}'`;
    connection.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        return res.status(201).json({ success: true, message: "OK" });
    });
});

router.patch("/confirm/:id", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updateQuery = `Update orders set is_confirm = ${status} where id like '${id}'`;
    connection.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        return res.status(201).json({ success: true, message: "OK" });
    });
});

module.exports = router;
