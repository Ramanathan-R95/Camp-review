module.exports.isLoggedIn = (req,res,next) =>{
    if(! req.isAuthenticated()){
        req.session.returnTo  = req.originalUrl ;

        req.flash("error","Try Logging in first") ;
        return res.redirect("/login") ;
    }
    next() ;
}

module.exports.storeTo =(req,res,next)=>{
    if(req.session.returnTo) 
        res.locals.returnTo = req.session.returnTo ;
    next() ;
}