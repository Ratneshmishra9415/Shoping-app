const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const seedDB = require('./seed');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const productRoutes = require('./routes/product');
const reviewRoutes = require('./routes/review');
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const productapi = require('./routes/api/productapi');
const passport = require("passport");
const LocalStrategy = require('passport-local');
const User = require("./models/User");
const dotenv = require("dotenv").config()



mongoose.connect(process.env.MONGODB_URL)
.then(()=>{console.log("DB connected")})
.catch((err)=>{console.log("error is",err)})

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride('_method'));

let configSession = {
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(configSession));
app.use(flash());




// use static serialize and deserialize of model for passport session support
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));


app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})
app.get('/',(req,res)=>{
  res.render("home");
});

//seedDB();

app.use(productRoutes);
app.use(reviewRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(productapi);


let PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`server is connected at port ${PORT}`)
})