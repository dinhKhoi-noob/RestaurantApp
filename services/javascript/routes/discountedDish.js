const randomString = require("randomstring");
const connection = require("../../../models/connection.js");
const route = require("express").Router();

route.get("/", (req, res) => {
    try {
        connection.query(
            `
        select d.title as 'discount_title',d.desc as 'discount_desc',d.date_begin,d.date_end,d.date_created,
        dd.visible_id,dd.dish_id,dd.discount_id,dd.sale_percent,
        p.category_id,p.root_category,p.thumbnail,p.price,p.service,p.title,p.description 
        from discounted_dishes as DD 
        inner join products as P 
        inner join discounts as d 
        on DD.dish_id = P.visible_id 
        and d.visible_id = dd.discount_id 
        and CURRENT_TIME BETWEEN d.date_begin AND d.date_end;`,
            (err, result) => {
                if (result && result.length > 0) {
                    return res.json({ success: true, result: result });
                }
                return res.status(404).json({ success: false, message: "Not found" });
            }
        );
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server failed" });
    }
});

route.get("/:id", (req, res) => {
    const id = req.params.id;
    try {
        connection.query(
            `select d.title as 'discount_title',d.desc as 'discount_desc',d.date_begin,d.date_end,d.date_created,
        dd.visible_id,dd.dish_id,dd.discount_id,dd.sale_percent,
        p.category_id,p.root_category,p.thumbnail,p.price,p.service,p.title,p.description 
        from discounted_dishes as DD 
        inner join products as P 
        inner join discounts as d 
        on DD.dish_id = P.visible_id and d.visible_id = dd.discount_id 
        and CURRENT_TIME BETWEEN d.date_begin 
        and d.date_end and dd.visible_id like '${id}';`,
            (err, result) => {
                if (result && result.length > 0) {
                    return res.json({ success: true, dish: result[0] });
                }
                return res.status(404).json({ success: false, message: "Not found" });
            }
        );
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server failed" });
    }
});

route.post("/", (req, res) => {
    const { discount_id, dishes } = req.body;
    try {
        dishes.forEach(dish => {
            const id = randomString.generate(10);
            connection.query(
                `insert into discounted_dises(visible_id,dish_id,discount_id,sale_percent) values('${id}','${dish.id}','${discount_id}',${dish.sale_percent})`
            );
        });
        return res.status(201).json({ success: true });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server failed" });
    }
});

route.patch("/:id", (req, res) => {
    const id = req.params.id;
    const { sale_percent } = req.body;
    try {
        connection.query(`Update discounted_dishes set sale_percent = ${sale_percent} where visible_id like '${id}'`);
        return res.status(201).json({ success: true, id });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server failed" });
    }
});

module.exports = route;
