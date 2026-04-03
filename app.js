require("dotenv").config();
const express = require("express") ;
const sanitizeV5 = require("./utilities/mongoSanitizeV5.js") ;

const app = express();
app.set("query parser","extended");
const Joi = require("joi");
const path = require("path") ;
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const CampgroundModel = require("./models/campground.js") ;
const ReviewModel = require("./models/review.js");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utilities/WrapAsync.js") ;
const ExpressError = require("./utilities/ExpressError.js") ;
const {campSchema,reviewSchema} = require("./valSchema/Schemas.js") ;
const campRoutes = require("./routes/campground.js") ;
const reviewRoutes = require("./routes/review.js") ;
const session = require("express-session") ;
const flash = require("connect-flash");
const User = require("./models/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const userRoutes = require("./routes/user.js");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

mongoose.connect("mongodb://127.0.0.1:27017/CampReview")
    .then(()=>{
        console.log("db connected ");
    })
    .catch((err)=>{
        console.log(err);
        console.log("db not connected ");
    }) 

sessionSchema = {
    name:"session",
    secret : "thisisasecret",
    resave:false,
    saveUninitialized : true,
    cookie:{
        httpOnly : true ,
        // secure:true,
        expires : Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge : 1000 * 60 * 60 * 24 * 7
    }
}
app.engine("ejs",ejsMate);
app.set("view engine","ejs") ;
app.set("views",path.join(__dirname,"views")) ;
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public"))) ;
app.use(sanitizeV5({replaceWith:"_" })) ;

app.use(session(sessionSchema))
app.use(flash());
app.use(helmet())

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.tiles.mapbox.com/",
    // "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    // "https://api.mapbox.com/",
    // "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", // add this
];
const connectSrcUrls = [
    // "https://api.mapbox.com/",
    // "https://a.tiles.mapbox.com/",
    // "https://b.tiles.mapbox.com/",
    // "https://events.mapbox.com/",
    "https://api.maptiler.com/", // add this
];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      connectSrc: ["'self'", ...connectSrcUrls],

      scriptSrc: ["'self'", "'unsafe-inline'", ...scriptSrcUrls],

      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],

      workerSrc: ["'self'", "blob:"],

      objectSrc: [],

      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dhnrl9ygq/",
        "https://images.unsplash.com/",
        "https://api.maptiler.com/",
        "https://picsum.photos/",
        "https://*.picsum.photos/",
        "https://fastly.picsum.photos/"
    ],
      fontSrc: ["'self'", ...fontSrcUrls]
    }
  })
);



app.use(passport.initialize()) ;
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())) ;
passport.serializeUser(User.serializeUser()) ;

passport.deserializeUser(User.deserializeUser()) ;

app.use((req,res,next)=>{
    res.locals.user = req.user ;
    res.locals.msg = req.flash("success") ;
    res.locals.error = req.flash("error") ;
    next();
})


app.use("/",userRoutes) ;
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