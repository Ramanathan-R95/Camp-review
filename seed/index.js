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
        console.log("db not connected ");
    })

const sample = (arr)=>{
    return arr[Math.floor(Math.random()*arr.length)];
}

const seedDb = async ()=>{
    await CampgroundModel.deleteMany({});

    for (let i = 1 ; i < 40 ; i++){
        let price = Math.floor(Math.random()*20000) + 1000;
        let num = Math.floor(Math.random()* 1000);
        const camp = new CampgroundModel({
            title :`${sample(places)} ${sample(descriptors)}` ,
            location : `${cities[num].city} ${cities[num].state}`,
            images :[{url:`https://picsum.photos/400?random=${Math.random()}`,filename:`image${Math.floor(Math.random()* 500)}`},
                {url:`https://picsum.photos/400?random=${Math.random()}`,filename:`image${Math.floor(Math.random()* 500)}`}

            ],
            geometry: {
                type: "Point",
                coordinates: [
                    cities[num].longitude,
                    cities[num].latitude,
                ]
            },
            price ,
            description :"Some quick example text to build on the card title and make up the bulk of the cards content.",
            author :'69c4d4fa228b7bb2d3646cde' 
        });
        await camp.save();


    }
}
seedDb().then(()=>{
    mongoose.connection.close();
})