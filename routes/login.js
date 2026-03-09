const express = require("express") ;
const router = express.Router() ;
const User = require("../models/user.js");
const WrapAsync = require("../utilities/WrapAsync.js") ;
const passport = require("passport") ;
const{storeTo} = require("../middleware.js") ;
router.get("/register",(req,res)=>{
    res.render("user/register.ejs") ;
});
router.post("/register",WrapAsync(async(req,res,next)=>{
    try{
    const {username , email , password} = req.body ;
    const user = new User({email,username}) ;
    await User.register(user,password) ;
    req.flash("success","Welcome back") ;
    req.login(user,(err)=>{
        if(err) return next(err) ;
        res.redirect("/campgrounds") ;

    });
    
    



    }
    catch(e){
        req.flash("error",e.message) ;
        res.redirect("/register") ;
    }
}));

router.get("/login",(req,res)=>{
    res.render("user/login.ejs") ;
})

router.post("/login",storeTo,passport.authenticate("local",{failureFlash:true , failureRedirect:"/login"}),(req,res)=>{
    
    req.flash("success","Successfully logged in ") ;
    var url = res.locals.returnTo || "/campgrounds";

    res.redirect(url);
})

router.get("/logout",(req,res,next)=>{
    req.logout(err =>{
        if (err) next(err) ;
        else {
            req.flash("success", "Logged out successfully . ") ;
            res.redirect("/campgrounds") ;
            
        }
    })
})

module.exports = router ;