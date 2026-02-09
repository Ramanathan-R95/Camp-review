const express = require("express") ;
const app = express() ;
const Joi = require("joi") ;
const path = require("path") ;
const mongoose = require("mongoose") ;
const methodOverride = require("method-override");
const CampgroundModel = require("./models/campground.js") ;
const ejsMate = require("ejs-mate") ;
const wrapAsync = require("./utilities/WrapAsync.js") ;
const ExpressError = require("./utilities/ExpressError.js") ;
const {campSchema} = require("./valSchema/Schemas.js") ;
mongoose.connect("mongodb://127.0.0.1:27017/CampReview")
    .then(()=>{
        console.log("db connected ") ;
    })
    .catch((err)=>{
        console.log(err);
        console.log("db not connected ") ;
    })


app.engine("ejs",ejsMate) ;
app.set("view engine","ejs") ;
app.set("views",path.join(__dirname,"views")) ;
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));



const campValidate = (req,res,next)=>{
    const {error} = campSchema.validate(req.body) ;

    if(error){
        const msg = error.details.map(ele => ele.message).join(",") ;
        next(new ExpressError(msg,400)) ;
        
    }
    else next();}


app.get("/",(req,res)=>{
    res.render("home.ejs") ;
});

app.get("/campgrounds",wrapAsync(async (req,res,next)=>{
    const campGrounds = await CampgroundModel.find({});
    

    res.render("campgrounds/index.ejs",{campGrounds});
}));

app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id",wrapAsync(async (req,res,next)=>{
    const {id} = req.params ;
    const camp = await CampgroundModel.findById(id);
    res.render("campgrounds/show.ejs",{camp});
}));


app.post("/campgrounds",campValidate,wrapAsync(async(req,res,next)=>{
    const campground = req.body.campground ;
    const camp = new CampgroundModel(campground) ;
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`) ;
}));

app.get("/campgrounds/:id/edit",wrapAsync(async (req,res,next)=>{
    const id = req.params.id ;
    const camp = await CampgroundModel.findById(id);
    if(!camp) throw new ExpressError("No camps ",404) ;
    res.render("campgrounds/edit.ejs",{camp});
}));

app.put("/campgrounds/:id",campValidate,wrapAsync(async (req,res,next)=>{
    const campground = req.body.campground ;
    if(!campground) throw new ExpressError("Invalid Data" , 500);
    const c = await CampgroundModel.findByIdAndUpdate(req.params.id,{...campground});
    res.redirect(`/campgrounds/${req.params.id}`);
}));

app.delete("/campgrounds/:id",wrapAsync(async (req,res,next)=>{
    const {id} = req.params ;
    await CampgroundModel.findByIdAndDelete(id);
    res.redirect("/campgrounds");

})) ;

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