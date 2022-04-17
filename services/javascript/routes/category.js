const randomString = require("randomstring");
const verify = require("../middlewares/authenticate.js");
const categoryMiddleware = require("../middlewares/category.js");
const connection = require("../../../models/connection.js");
const route = require("express").Router();

route.post("/", categoryMiddleware.postCategory, (req, res) => {
    try {
        let { title, category_id } = req.body;
        const visibleId = randomString.generate(10);
        if (!category_id) category_id = visibleId;
        let query = `insert into categories(visible_id,title,category_id) values('${visibleId}','${title}','${category_id}');`;
        connection.query(query, (err, result) => {
            if (result) {
                return res.json({ success: true, message: "Successfully", visible_id: visibleId });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error" });
    }
});
route.get("/", (req, res) => {
    try {
        console.log(`select id,title,root_id,root_title,is_active from category_view order by id`);
        connection.query(`select * from category_view order by id`, (err, result) => {
            if (result && result.length > 0) return res.json({ success: true, message: "Successfully", result });
            return res.status(404).json({ success: false, message: "Not found" });
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
route.get("/:id", (req, res) => {
    try {
        const id = req.params.id;
        console.log(`select * from category_view where id like '${id}'`);
        connection.query(`select * from category_view where id like '${id}'`, (err, result) => {
            if (!result || result.length < 1)
                return res.status(404).json({ success: false, message: "Invalid reference" });
            return res.json({ success: true, message: "Successfully", result: result[0] });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});

route.patch("/:id", (req, res) => {
    const id = req.params.id;
    const { title, root_id } = req.body;
    const updateQuery = `Update categories set title='${title}' ${
        root_id ? ` ,category_id = '${root_id}'` : `,category_id = '${id}'`
    } where visible_id like '${id}'`;
    console.log(updateQuery);
    connection.query(updateQuery, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        return res.status(201).json({ success: true, message: "OK" });
    });
});

route.patch("/status/:id", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    connection.query(`Select * from category_view where id like '${id}'`, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        if (result && result.length === 0) {
            return res.status(400).json({ success: false, message: "Not found category" });
        }
        if (result[0].id === result[0].root_id) {
            return connection.query(
                `Update categories set is_active = '${status}' where category_id like '${id}'`,
                (err, result) => {
                    if (err) {
                        console.log(err);
                        return res.status(500).json({ success: false, message: "Internal server error" });
                    }
                    return res.status(201).json({ success: true, message: "OK" });
                }
            );
        }
        if (result[0].root_active === 1) {
            return res
                .status(400)
                .json({ success: false, message: "Root category was hide, cannot unhide this category" });
        }
        return connection.query(
            `Update categories set is_active = '${status}' where visible_id like '${id}'`,
            (err, result) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ success: false, message: "Internal server error" });
                }
                return res.status(201).json({ success: true, message: "OK" });
            }
        );
    });
});

module.exports = route;
