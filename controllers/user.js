const User = require("../models/user.js");


module.exports.renderRegisterForm = (req,res)=>{
    res.render("user/register.ejs") ;
}

module.exports.register = async(req,res,next)=>{
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
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("user/login.ejs") ;
}

module.exports.login = (req,res)=>{
    
    req.flash("success","Successfully logged in ") ;
    var url = res.locals.returnTo || "/campgrounds";

    res.redirect(url);
}

module.exports.logout = (req,res,next)=>{
    req.logout(err =>{
        if (err) next(err) ;
        else {
            req.flash("success", "Logged out successfully . ") ;
            res.redirect("/campgrounds") ;
            
        }
    })
}