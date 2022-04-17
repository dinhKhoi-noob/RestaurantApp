require("dotenv").config();
require("../middlewares/passport");
const userMiddleware = require("../middlewares/user.js");
const passport = require("passport");
const route = require("express").Router();
const connection = require("../../../models/connection.js");
const jwt = require("jsonwebtoken");
const randomString = require("randomstring");
require("dotenv").config();

const { ACCESS_TOKEN_SECRET } = process.env;

const registerToken = id => {
    return jwt.sign(
        {
            userId: id,
            iat: new Date().getTime(),
            exp: new Date().setDate(new Date().getDate() + 3),
        },
        ACCESS_TOKEN_SECRET
    );
};

route.get("/", (req, res) => {
    try {
        connection.query(`Select username, balance, email, address, total_saving from users`, (err, result) => {
            if (!result || result.length <= 0) {
                return res.status(404).json({ success: false, message: "Not found" });
            }
            return res.json({ success: true, message: "Successfully", result });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

route.patch("/expired/:id", (req, res) => {
    try {
        const userId = req.params.id;
        const { nextExpirationSession } = req.body;
        connection.query(
            `Update users set expiration_session = ${nextExpirationSession} where visible_id like '${userId}'`,
            (err, result) => {
                if (err) {
                    return res.status(500).json({ success: false, message: "Internal server failed" });
                }
                return res.json({ success: true });
            }
        );
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server failed" });
    }
});

route.get("/:id", (req, res) => {
    try {
        connection.query(
            `Select username, email, address, avatar, phone,visible_id,role from users where visible_id like '${req.params.id}'`,
            (err, result) => {
                if (!result || result.length <= 0) {
                    return res.status(404).json({ success: false, message: "Not existed" });
                }
                return res.json({
                    success: true,
                    message: "Successfully",
                    user: result[0],
                });
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

route.get("/confirm/:token", (req, res) => {
    try {
        const token = req.params.token;
        const jwt = require("jsonwebtoken");
        const userId = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET).userId;
        console.log(userId);
        connection.query(`Update users set is_confirmed = 1 where visible_id like '${userId}'`, (err, result) => {
            if (err) {
                return res.redirect("/page/auth");
            }
            return res.redirect(`/page/authorization?token=${token}`);
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/page/auth");
    }
});

route.post("/register", userMiddleware.registerMiddleware, async (req, res) => {
    try {
        const bcrypt = require("bcryptjs");
        const { username, password, email, address, phone } = req.body;
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);
        const visibleId = randomString.generate(10);
        let query = `insert into users (visible_id,username,password,email,address,phone,is_logged) values('${visibleId}','${username}','${passwordHashed}','${email}','${address}','${phone}',1)`;
        connection.query(query, (err, result) => {
            if (result) {
                const token = registerToken(visibleId);
                return res.status(201).json({ success: true, message: "OK", uid: visibleId, token });
            }
            if (err) {
                return res
                    .status(500)
                    .json({ success: false, message: "Internal Server Error", uid: visibleId, token });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server failed" });
    }
});

route.post("/login", userMiddleware.loginMiddleware, (req, res) => {
    try {
        const bcrypt = require("bcryptjs");
        const { username, password } = req.body;
        let passwordValid;
        connection.query(`select * from users where username='${username}'`, async (error, result) => {
            if (!result || result.length <= 0) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }
            if (result[0].password) {
                passwordValid = await bcrypt.compare(password, result[0].password);
            }
            if (!passwordValid) {
                return res.status(401).json({ success: false, message: "Invalid email or password" });
            }
            const token = registerToken(result[0].visible_id);
            connection.query(`Update users set is_logged = 1 where visible_id like '${result[0].visible_id}'`);
            return res.status(200).json({ success: true, message: "OK", token, uid: result[0].visible_id });
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server failed" });
    }
});

route.post("/create", userMiddleware.registerMiddleware, async (req, res) => {
    const bcrypt = require("bcryptjs");
    const { username, password, email, address, phone, role } = req.body;
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);
    const visibleId = randomString.generate(10);
    let query = `insert into users (visible_id,username,password,email,address,phone,is_logged,role) values('${visibleId}','${username}','${passwordHashed}','${email}','${address}','${phone}',1,'${role}')`;
    connection.query(query, (err, result) => {
        if (result) {
            const token = registerToken(visibleId);
            return res.status(201).json({ success: true, message: "OK", uid: visibleId, token });
        }
        if (err) {
            return res.status(500).json({ success: false, message: "Internal Server Error", uid: visibleId, token });
        }
    });
});

route.get("/google/callback", passport.authenticate("google", { failureRedirect: "/page/auth/google" }), (req, res) => {
    const user = req.user;
    try {
        const profilePictureType = user.photos[0].value.split("/")[3];
        connection.query(`select * from users where email like '${user._json.email}'`, async (err, result) => {
            if (result.length > 0) {
                console.log(result[0]);
                if (result[0].login_by !== "google") {
                    return res.redirect("/page/auth?existed_email=" + result[0].login_by);
                }
                connection.query(`Update users set is_logged = 1 where visible_id like '${user.id}'`);
                const token = registerToken(user.id);
                return res.redirect(`/page/authorization?token=${token}`);
            }
            connection.query(
                `insert into users(visible_id, username, login_by, email${
                    profilePictureType !== "a" ? ",avatar" : ""
                }) values('${user.id}','${user._json.given_name}','google','${user._json.email}'${
                    profilePictureType !== "a" ? `,'${user.photos[0].value}'` : ""
                })`,
                (err, result) => {
                    if (err) {
                        return res.redirect("/page/auth/google");
                    }
                    connection.query(`select * from users where visible_id like '${user.id}'`, (err, users) => {
                        if (users.length > 0) {
                            connection.query(`Update users set is_logged = 1 where visible_id like '${user.id}'`);
                            const token = registerToken(user.id);
                            return res.redirect(`/page/authorization?token=${token}`);
                        }
                        return res.redirect("/page/auth/google");
                    });
                }
            );
        });
    } catch (error) {
        console.log(error);
        return res.redirect("/page/auth/google");
    }
});

route.get(
    "/facebook/callback",
    passport.authenticate("facebook", { failureRedirect: "/page/auth/facebook" }),
    (req, res) => {
        const user = req.user;
        try {
            connection.query(`select * from users where email like '${user._json.email}'`, (err, result) => {
                if (result.length > 0) {
                    if (result[0].login_by !== "facebook") {
                        return res.redirect("/page/auth?existed_email=" + result[0].login_by);
                    }
                    connection.query(`Update users set is_logged = 1 where visible_id like '${user._json.id}'`);
                    const token = registerToken(user._json.id);
                    return res.redirect(`/page/authorization?token=${token}`);
                }
                connection.query(
                    `insert into users(visible_id, username, email, login_by) values('${user._json.id}','${user._json.name}','${user._json.email}','facebook')`,
                    (err, result) => {
                        if (err) {
                            return res.redirect("/page/auth/facebook");
                        }
                        connection.query(`select * from users where visible_id like '${user.id}'`, (err, users) => {
                            if (users.length > 0) {
                                connection.query(
                                    `Update users set is_logged = 1 where visible_id like '${user._json.id}'`
                                );
                                const token = registerToken(user._json.id);
                                return res.redirect(`/page/authorization?token=${token}`);
                            }
                            return res.redirect("/page/auth/facebook");
                        });
                    }
                );
            });
        } catch (error) {
            console.log(error);
            return res.redirect("/page/auth/facebook");
        }
    }
);

route.post("/verify", passport.authenticate("jwt", { session: false }), (req, res) => {
    if (req.user) {
        console.log(req.user);
        return res.json({ success: true, user: req.user });
    }
    return res.status(401).json({ success: false });
});

route.patch("/loggout/:id", (req, res) => {
    try {
        const userId = req.params.id;
        const latestLoggedIn =
            new Date(Date.now()).toISOString().split("T")[0] +
            new Date(Date.now()).toLocaleString("en-US", { hour12: false }).split(",")[1];
        connection.query(
            `Update users set is_logged = 0, latest_logged_in = '${latestLoggedIn}' where visible_id like '${userId}'`
        );
        return res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server failed" });
    }
});

module.exports = route;
