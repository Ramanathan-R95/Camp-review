const mongoose = require("mongoose") ;
const {Schema} = mongoose ;
const CampgroundModel = require("./campground.js")
const ReviewSchema = Schema({
    rating :{
        type : Number,
        required : true 
    },
    body : {
        type : String ,
        required : true 
    },
    campground : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "Campground"
    },
    author:{
        type:Schema.Types.ObjectId ,
        ref : "User"
    }
}) ;





const ReviewModel = mongoose.model("Review",ReviewSchema) ;
module.exports = ReviewModel ;