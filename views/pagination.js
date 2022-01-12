require('../services/javascript/middlewares/passport')
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const passport = require('passport');
module.exports = (app) => {
    app.get('/page/index',(req,res)=>{
        let fileName = "pages/index.ejs";
        let user_id = req.params.user_id;
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            let products;
            let categories;
            let discountingProducts;
            let breakfastDishes;
            let lunchDishes;
            let dinnerDishes;
            if(err)
            {
                return res.render("pages/404.ejs");
            }
            try {
                discountingProducts = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/discount_dish`);
                products = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product`);
                categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`);
                breakfastDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/service?service='breakfast'`);
                lunchDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/service?service='lunch'`);
                dinnerDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/service?service='dinner'`);
            } catch (error) {
                console.log(error);
            }
            return res.render(fileName,{
                data:{
                    products:products?products.data.result:null,
                    categories:categories?categories.data.result:null,
                    discountingProducts:discountingProducts?discountingProducts.data.result:null,
                    breakfast:breakfastDishes?breakfastDishes.data.result:null,
                    lunch:lunchDishes?lunchDishes.data.result:null,
                    dinner:dinnerDishes?dinnerDishes.data.result:null,
                    // user:user?user.data.result:null,
                    // userList:userList?userList.data.result:null
                }
            })
        })
    })

    app.get('/page/discount',(req,res)=>{
        let fileName = 'pages/discount.ejs'
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render('pages/404.ejs')
            }
            const products = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/discount_dish`)
            const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`)
            return res.render(fileName,{
                data:{
                    products:products.data.result,
                    categories:categories.data.result
                }
            })
        })
    })

    app.get('/page/category/:id',(req,res)=>{
        const id = req.params.id;
        const root = req.query.root;
        let fileName = 'pages/category.ejs'
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render('pages/404.ejs')
            }
            try {
                const uri = !root?`http://${process.env.express_host}:${process.env.express_port}/api/product/all/${id}`:`http://${process.env.express_host}:${process.env.express_port}/api/product/all/${id}?root=1`
                const products = await axios.get(uri);
                const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`)
                const currentCategory = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category/${id}`)
                return res.render(fileName,{
                    data:{
                        products:products.data.result,
                        categories:categories.data.result,
                        currentCategory:currentCategory.data.result
                    }
                })   
            } catch (error) {
                return res.render('pages/404.ejs');
            }
        })
    })
    app.get('/page/dish/:id',(req,res)=>{
        const id = req.params.id;
        let fileName = 'pages/dish.ejs'
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render('pages/404.ejs')
            }
            try {
                const response = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/detail/${id}`);
                const dish = response.data.result;
                const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`);
                const relatedDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/all/${dish[0].category_id}`);
                return res.render(fileName,{
                    data:{
                        dish,
                        categories:categories.data.result,
                        relatedDishes:relatedDishes.data.result
                    }
                })   
            } catch (error) {
                return res.render('pages/404.ejs')
            }
        })
    })
    app.get('/page/discount_dish/:id',async(req,res)=>{
        const id = req.params.id;
        let fileName = 'pages/dish.ejs'
        fs.readFile(path.resolve(__dirname,fileName),async(err,data)=>{
            if(err)
            {
                return res.render('pages/404.ejs')
            }
            try {
                const response = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/discount_dish/${id}`);
                console.log(response);
                const dish = response.data.dish;
                const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`);
                const relatedDishes = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/all/${dish.category_id}`);
                
                return res.render(fileName,{
                    data:{
                        dish:[dish],
                        categories:categories.data.result,
                        relatedDishes:relatedDishes.data.result
                    }
                })   
            } catch (error) {
                console.log(error);
                return res.render('pages/404.ejs')
            }
        })
    })
    app.get('/page/checkout/:user_id',async(req,res)=>{
        const userId = req.params.user_id;
        let fileName = 'pages/checkout.ejs';
        try {
            if(userId)
            {
                // const response = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/auth/${userId}`);
                // console.log(response);
                const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`)
                return res.render(fileName,{
                    data:{
                        categories:categories.data.result,
                    }
                })
            }   
        } catch (error) {
            return res.render('pages/404.ejs');
        }
    })

    app.get('/page/search/:id',async(req,res)=>{
        const categoryId = req.params.id;
        const isRoot = req.query.root;
        const searchString = req.query.search;
        try {
            const categories = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/category`);
            try {
                const searchResult = await axios.get(`http://${process.env.express_host}:${process.env.express_port}/api/product/all/${categoryId}?root=${isRoot}&search=${searchString}`);
                return res.render('pages/searchResult.ejs',{
                    data:{
                        searchResult: searchResult.data.result,
                        categories:categories.data.result
                    }
                })
            } catch (error) {
                if(error.response.status === 404){
                    return res.render('pages/searchResult.ejs',{
                        data:{
                            searchResult:[],
                            categories:categories.data.result
                        }
                    })
                }
                return res.render('pages/404.ejs')
            }

        } catch (error) {
            return res.render('pages/404.ejs');
        }
    })

    app.get('/page/auth/facebook',passport.authenticate('facebook',{authType: 'reauthenticate', scope: [ 'email', 'user_location' ]}));
    
    app.get('/page/auth/google',passport.authenticate('google',{scope:['email','profile'],session:false}));

    app.get('/page/authorization',async(req,res)=>{
        res.render('pages/authorization.ejs');
    })

    app.get('/page/auth',(req,res)=>{
        return res.render('pages/authenticate.ejs');
    })
}