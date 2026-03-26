const CampgroundModel = require("../models/campground.js");
const {cloudinary} = require("../cloudinary");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;




module.exports.index = async (req,res,next)=>{
    const campGrounds = await CampgroundModel.find({});
    res.render("campgrounds/index.ejs",{campGrounds});
}

module.exports.renderNewForm = (req,res)=>{
    res.render("campgrounds/new.ejs");
}

module.exports.show = async (req,res,next)=>{
    const {id} = req.params ;
    const camp = await CampgroundModel.findById(id).populate({path:"reviews",populate:{path : "author"}}).populate("author");
    if(!camp){
        req.flash("error","Cannot find Campground") ;
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show.ejs",{camp});
}

module.exports.addCampground =async(req,res,next)=>{
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect('/campgrounds/new');
    }



    const campground = req.body.campground ;
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;
    campground.images= req.files.map(obj => ({url:obj.path,filename:obj.filename}));
    
    const camp = new CampgroundModel(campground) ;
    camp.author = req.user._id ;
    await camp.save();
    req.flash("success","Successfully  added") ;
    res.redirect(`/campgrounds/${camp._id}`) ;
}

module.exports.edit = async (req,res,next)=>{
    const id = req.params.id ;
    const camp = await CampgroundModel.findById(id);
    if(!camp) {
        req.flash("error","Cannot find campground") ;
        return res.redirect("/campgrounds") ;
    }
    res.render("campgrounds/edit.ejs",{camp});
}

module.exports.update = async (req,res,next)=>{

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    if (!geoData.features?.length) {
        req.flash('error', 'Could not geocode that location. Please try again and enter a valid location.');
        return res.redirect(`/campgrounds/${req.params.id}/edit`);
    }
    
    const campground = req.body.campground;
    campground.geometry = geoData.features[0].geometry;
    campground.location = geoData.features[0].place_name;

    if(!campground) throw new ExpressError("Invalid Data" , 500);
    const c = await CampgroundModel.findByIdAndUpdate(req.params.id,{...campground});
    const images= req.files.map(obj => ({url:obj.path,filename:obj.filename}));
   
    
    c.images.push(...images) ;
    if(req.body.deleteImages){
        req.body.deleteImages.forEach(async (name)=>{
            await cloudinary.uploader.destroy(name);
        })
        await c.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}});

    }
    await c.save();

    req.flash("success","Updated Succesfully ") ;
    res.redirect(`/campgrounds/${req.params.id}`);
}

module.exports.delete = async (req,res,next)=>{
    const {id} = req.params ;
    await CampgroundModel.findByIdAndDelete(id);
    req.flash("success","Deleted Successfully ") ;
    res.redirect("/campgrounds");

}