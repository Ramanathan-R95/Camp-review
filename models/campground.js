const mongoose = require("mongoose") ;

const Schema = mongoose.Schema ;

const CampgroundSchema = new Schema({
    title : String,
    price : Number ,
    image : String ,
    description : String ,
    location : String 
}) ;

const CampgroundModel = mongoose.model("Campground",CampgroundSchema) ;

module.exports = CampgroundModel ;