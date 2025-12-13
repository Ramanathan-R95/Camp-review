const mongoose = require("mongoose") ;
const CampgroundModel = require("../models/campground.js") ;
const cities = require("./cities.js");
const {places,descriptors} = require("./seedHelpers.js");

mongoose.connect("mongodb://127.0.0.1:27017/CampReview")
    .then(()=>{
        console.log("db connected ") ;
    })
    .catch((err)=>{
        console.log(err);
        console.log("db not connected ") ;
    })

const sample = (arr)=>{
    return arr[Math.floor(Math.random()*arr.length)];
}

const seedDb = async ()=>{
    await CampgroundModel.deleteMany({});

    for (let i = 1 ; i < 70 ; i++){
        let num = Math.floor(Math.random()* 1000) ;
        const camp = new CampgroundModel({
            title :`${sample(places)} ${sample(descriptors)}` ,
            location : `${cities[num].city} ${cities[num].state}`
        });
        await camp.save();


    }
}
seedDb().then(()=>{
    mongoose.connection.close();
})