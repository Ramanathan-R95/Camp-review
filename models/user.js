const mongoose = require("mongoose") ;
const passport = require("passport") ;
const passportLocalMongoose = require("passport-local-mongoose") ;

userSchema = new mongoose.Schema({  
    email :{
        type : String ,
        required : true 
    }
}) ;
userSchema.plugin(passportLocalMongoose.default) ;
module.exports = mongoose.model("User",userSchema ) ;