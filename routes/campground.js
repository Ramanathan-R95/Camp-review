const express = require("express") ;
const router = express.Router() ;
const wrapAsync = require("../utilities/WrapAsync.js") ;
const {isLoggedIn,campValidate,verifyUser} = require("../middleware.js");
const CampgroundModel = require("../models/campground.js");




router.get("/",wrapAsync(async (req,res,next)=>{
    const campGrounds = await CampgroundModel.find({});
    res.render("campgrounds/index.ejs",{campGrounds});
}));

router.get("/new",isLoggedIn,(req,res)=>{
    res.render("campgrounds/new.ejs");
});


router.get("/:id",wrapAsync(async (req,res,next)=>{
    const {id} = req.params ;
    const camp = await CampgroundModel.findById(id).populate("reviews").populate("author");
    if(!camp){
        req.flash("error","Cannot find Campground") ;
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs",{camp});
}));


router.post("/",isLoggedIn,campValidate,wrapAsync(async(req,res,next)=>{
    const campground = req.body.campground ;
    
    const camp = new CampgroundModel(campground) ;
    camp.author = req.user._id ;
    await camp.save();
    req.flash("success","Successfully  added") ;
    res.redirect(`/campgrounds/${camp._id}`) ;
}));

router.get("/:id/edit",isLoggedIn,verifyUser,wrapAsync(async (req,res,next)=>{
    const id = req.params.id ;
    const camp = await CampgroundModel.findById(id);
    if(!camp) {
        req.flash("error","Cannot find campground") ;
        return res.redirect("/campgrounds") ;
    }
    res.render("campgrounds/edit.ejs",{camp});
}));

router.put("/:id",isLoggedIn,verifyUser,campValidate,wrapAsync(async (req,res,next)=>{
    
    const campground = req.body.campground;
    

    if(!campground) throw new ExpressError("Invalid Data" , 500);
    const c = await CampgroundModel.findByIdAndUpdate(req.params.id,{...campground});
    req.flash("success","Updated Succesfully ") ;
    res.redirect(`/campgrounds/${req.params.id}`);
}));

router.delete("/:id",isLoggedIn,verifyUser,wrapAsync(async (req,res,next)=>{
    const {id} = req.params ;
    await CampgroundModel.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully ") ;
    res.redirect("/campgrounds");

})) ;







module.exports = router ;