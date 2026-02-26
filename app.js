const express = require("express") ;
const app = express() ;
const Joi = require("joi") ;
const path = require("path") ;
const mongoose = require("mongoose") ;
const methodOverride = require("method-override");
const CampgroundModel = require("./models/campground.js") ;
const ReviewModel = require("./models/review.js") ;
const ejsMate = require("ejs-mate") ;
const wrapAsync = require("./utilities/WrapAsync.js") ;
const ExpressError = require("./utilities/ExpressError.js") ;
const {campSchema,reviewSchema} = require("./valSchema/Schemas.js") ;
const campRoutes = require("./routes/campground.js") ;
const reviewRoutes = require("./routes/review.js") ;
const session = require("express-session") ;
mongoose.connect("mongodb://127.0.0.1:27017/CampReview") 
    .then(()=>{
        console.log("db connected ");
    })
    .catch((err)=>{
        console.log(err);
        console.log("db not connected ");
    }) 

sessionSchema = {
    secret : "thisisasecret",
    resave:false,
    saveUninitialized : true,
    cookie:{
        httpOnly : true ,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.engine("ejs",ejsMate) ;
app.set("view engine","ejs") ;
app.set("views",path.join(__dirname,"views")) ;
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public"))) ;

app.use(session(sessionSchema))




app.use("/campgrounds",campRoutes) ;
app.use("/campgrounds/:id/review",reviewRoutes) ;

app.get("/",(req,res)=>{
    res.render("home.ejs") ;
});





app.all(/(.*)/,(req,res,next)=>{
    next(new ExpressError("Page not found",404)) ;
});

app.use((err,req,res,next)=>{
    if(!err.message) err.message = "Something went wrong" ;
    if(!err.statusCode) err.statusCode = 500 ;
    res.render("error.ejs",{err}) ;
})


app.listen(3000,()=>{
    console.log("Server Initiated") ;
})