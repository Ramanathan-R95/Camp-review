const express = require("express") ;
const router = express.Router() ;

const wrapAsync = require("../utilities/WrapAsync.js") ;
const ExpressError = require("../utilities/ExpressError.js") ;

const {campSchema} = require("../valSchema/Schemas.js");
const CampgroundModel = require("../models/campground.js") ;

const campValidate = (req,res,next)=>{

    const {error} = campSchema.validate(req.body) ;

    if(error){
        const msg = error.details.map(ele => ele.message).join(",") ;
        next(new ExpressError(msg,400)) ;
        
    }
    else next();}
router.get("/",wrapAsync(async (req,res,next)=>{
    const campGrounds = await CampgroundModel.find({});
    

    res.render("campgrounds/index.ejs",{campGrounds});
}));

router.get("/new",(req,res)=>{
    res.render("campgrounds/new.ejs");
});

router.get("/:id",wrapAsync(async (req,res,next)=>{
    const {id} = req.params ;
    const camp = await CampgroundModel.findById(id).populate("reviews");
    res.render("campgrounds/show.ejs",{camp});
}));


router.post("/",campValidate,wrapAsync(async(req,res,next)=>{
    const campground = req.body.campground ;
    const camp = new CampgroundModel(campground) ;
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`) ;
}));

router.get("/:id/edit",wrapAsync(async (req,res,next)=>{
    const id = req.params.id ;
    const camp = await CampgroundModel.findById(id);
    if(!camp) throw new ExpressError("No camps ",404) ;
    res.render("campgrounds/edit.ejs",{camp});
}));

router.put("/:id",campValidate,wrapAsync(async (req,res,next)=>{
    const campground = req.body.campground ;
    if(!campground) throw new ExpressError("Invalid Data" , 500);
    const c = await CampgroundModel.findByIdAndUpdate(req.params.id,{...campground});
    res.redirect(`/campgrounds/${req.params.id}`);
}));

router.delete("/:id",wrapAsync(async (req,res,next)=>{
    const {id} = req.params ;
    await CampgroundModel.findByIdAndDelete(id);
    res.redirect("/campgrounds");

})) ;







module.exports = router ;