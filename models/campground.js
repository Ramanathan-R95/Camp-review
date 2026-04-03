const mongoose = require("mongoose") ;

const Schema = mongoose.Schema ;
const ReviewModel = require("./review.js");

const ImageSchema = new Schema({
    url:String,
    filename:String
        

});

ImageSchema.virtual("thumbnail").get(function(){
    return this.url.replace("/upload","/upload/w_250");
});
const opts = {toJSON:{virtuals : true}};
const CampgroundSchema = new Schema({
    title : String,
    price : Number ,
    images : [ImageSchema] ,
    description : String ,
    location : String ,
    geometry:{
        type :{
            type:String,
            enum:["Point"],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    reviews : [{type : mongoose.Schema.Types.ObjectId , ref : "Review"}],
    author : {
        type :Schema.Types.ObjectId ,
        ref : "User" 
    }
},opts) ;
CampgroundSchema.post("findOneAndDelete",async (data)=>{
    if(data.reviews) {
        await ReviewModel.deleteMany({_id:{$in:data.reviews}});

    }
    
});
CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.description.substring(0, 20)}...</p>`
});

const CampgroundModel = mongoose.model("Campground",CampgroundSchema) ;

module.exports = CampgroundModel ;