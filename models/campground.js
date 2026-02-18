const mongoose = require("mongoose") ;

const Schema = mongoose.Schema ;

const CampgroundSchema = new Schema({
    title : String,
    price : Number ,
    image : String ,
    description : String ,
    location : String ,
    reviews : [{type : mongoose.Schema.Types.ObjectId , ref : "Review"}]
}) ;

const CampgroundModel = mongoose.model("Campground",CampgroundSchema) ;

module.exports = CampgroundModel ;