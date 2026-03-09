const express = require("express") ;
const router = express.Router() ;

const wrapAsync = require("../utilities/WrapAsync.js") ;
const ExpressError = require("../utilities/ExpressError.js") ;
const {isLoggedIn} = require("../middleware.js");

const {campSchema} = require("../valSchema/Schemas.js");
const CampgroundModel = require("../models/campground.js");

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

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("campgrounds/new.ejs");
});

router.get("/:id",wrapAsync(async (req,res,next)=>{
    const {id} = req.params ;
    const camp = await CampgroundModel.findById(id).populate("reviews");
    if(!camp){
        req.flash("error","Cannot find Campground") ;
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs",{camp});
}));


router.post("/",isLoggedIn,campValidate,wrapAsync(async(req,res,next)=>{
    const campground = req.body.campground ;
    const camp = new CampgroundModel(campground) ;
    await camp.save();
    req.flash("success","Successfully  added") ;
    res.redirect(`/campgrounds/${camp._id}`) ;
}));

router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res,next)=>{
    const id = req.params.id ;
    const camp = await CampgroundModel.findById(id);
    if(!camp) {
        req.flash("error","Cannot find campground") ;
        return res.redirect("/campgrounds") ;
    }
    res.render("campgrounds/edit.ejs",{camp});
}));

router.put("/:id",isLoggedIn,campValidate,wrapAsync(async (req,res,next)=>{
    const campground = req.body.campground ;
    if(!campground) throw new ExpressError("Invalid Data" , 500);
    const c = await CampgroundModel.findByIdAndUpdate(req.params.id,{...campground});
    req.flash("success","Updated Succesfully ") ;
    res.redirect(`/campgrounds/${req.params.id}`);
}));

router.delete("/:id",isLoggedIn,wrapAsync(async (req,res,next)=>{
    const {id} = req.params ;
    await CampgroundModel.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully ") ;
    res.redirect("/campgrounds");

})) ;







module.exports = router ;