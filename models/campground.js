const mongoose = require("mongoose") ;

const Schema = mongoose.Schema ;
const ReviewModel = require("./review.js");

const ImageSchema = new Schema({
    url:String,
    filename:String
        

});

ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_250");
})
const CampgroundSchema = new Schema({
    title : String,
    price : Number ,
    images : [ImageSchema] ,
    description : String ,
    location : String ,
    reviews : [{type : mongoose.Schema.Types.ObjectId , ref : "Review"}],
    author : {
        type :Schema.Types.ObjectId ,
        ref : "User" 
    }
}) ;
CampgroundSchema.post("findOneAndDelete",async (data)=>{
    if(data.reviews) {
        await ReviewModel.deleteMany({_id:{$in:data.reviews}});

    }
    
})
const CampgroundModel = mongoose.model("Campground",CampgroundSchema) ;

module.exports = CampgroundModel ;