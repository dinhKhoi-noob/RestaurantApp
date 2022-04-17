const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const userRoute = require("./services/javascript/routes/user");
const categoryRoute = require("./services/javascript/routes/category");
const productRoute = require("./services/javascript/routes/product");
const orderRoute = require("./services/javascript/routes/order");
const orderItemRoute = require("./services/javascript/routes/orderItem");
const discountRoute = require("./services/javascript/routes/discount");
const paymentRoute = require("./services/javascript/routes/payment");
const discountDishRoute = require("./services/javascript/routes/discountedDish");
const uploadRoute = require("./services/javascript/routes/upload");
const imageRoute = require("./services/javascript/routes/images");
const ratingRoute = require("./services/javascript/routes/rating");
const addressRoute = require("./services/javascript/routes/address");
const checkoutRoute = require("./services/javascript/routes/checkout");
const cors = require("cors");
const corsOption = {
    origin: [`http://localhost:3000`, "https://agriculture-product-trading-market-ui.vercel.app"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOption));

app.set("view engine", "ejs");
app.use(session({ secret: "cats", resave: true, saveUninitialized: true, cookie: { secure: true } }));
app.use(express.static("public"));
app.use(passport.initialize());
app.use(express.json());
app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/product", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/order_item", orderItemRoute);
app.use("/api/discount", discountRoute);
app.use("/api/payment", paymentRoute);
app.use("/api/discount_dish", discountDishRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/image", imageRoute);
app.use("/api/rate", ratingRoute);
app.use("/api/address", addressRoute);
app.use("/api/checkout", checkoutRoute);
require("./views/pagination")(app);

app.listen(4000, () => {
    console.log("http://localhost:4000/page/index");
});
