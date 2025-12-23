const express = require("express") ;
const app = express() ;
const path = require("path") ;
const mongoose = require("mongoose") ;
const methodOverride = require("method-override");
const CampgroundModel = require("./models/campground.js") ;
const ejsMate = require("ejs-mate") ;

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





app.get("/",(req,res)=>{
    res.render("home.ejs") ;
});

app.get("/campgrounds",async (req,res)=>{
    const campGrounds = await CampgroundModel.find({});

    res.render("campgrounds/index.ejs",{campGrounds});
});

app.get("/campgrounds/new",(req,res)=>{
    res.render("campgrounds/new.ejs");
});

app.get("/campgrounds/:id",async (req,res)=>{
    const {id} = req.params ;
    const camp = await CampgroundModel.findById(id);
    res.render("campgrounds/show.ejs",{camp});
});


app.post("/campgrounds",async(req,res)=>{
    const campground = req.body.campground ;
    const camp = new CampgroundModel(campground) ;
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`) ;
});

app.get("/campgrounds/:id/edit",async (req,res)=>{
    const id = req.params.id ;
    const camp = await CampgroundModel.findById(id);
    res.render("campgrounds/edit.ejs",{camp});
})

app.put("/campgrounds/:id",async (req,res)=>{
    const campground = req.body.campground ;
    const c = await CampgroundModel.findByIdAndUpdate(req.params.id,{...campground});
    res.redirect(`/campgrounds/${req.params.id}`);
})

app.delete("/campgrounds/:id",async (req,res)=>{
    const {id} = req.params ;
    await CampgroundModel.findByIdAndDelete(id);
    res.redirect("/campgrounds");

})


app.listen(3000,()=>{
    console.log("Server Initiated") ;
})