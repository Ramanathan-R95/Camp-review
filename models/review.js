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
    }
}) ;


ReviewSchema.post("findOneAndDelete",async (review)=>{
    const id = review.campground ;
    const camp = await CampgroundModel.findByIdAndUpdate(id,{$pull:{reviews :{$in : [id]}}}) ;




}) ;


const ReviewModel = mongoose.model("Review",ReviewSchema) ;
module.exports = ReviewModel ;