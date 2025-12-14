const express = require("express") ;
const app = express() ;
const path = require("path") ;
const mongoose = require("mongoose") ;
const CampgroundModel = require("./models/campground.js") ;

mongoose.connect("mongodb://127.0.0.1:27017/CampReview")
    .then(()=>{
        console.log("db connected ") ;
    })
    .catch((err)=>{
        console.log(err);
        console.log("db not connected ") ;
    })



app.set("view engine","ejs") ;
app.set("views",path.join(__dirname,"views")) ;

app.get("/",(req,res)=>{
    res.render("home.ejs") ;
});

app.get("/campgrounds",async (req,res)=>{
    const campGrounds = await CampgroundModel.find({});

    res.render("campgrounds/index.ejs",{campGrounds});
})


app.listen(3000,()=>{
    console.log("Server Initiated") ;
})