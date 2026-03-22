const express = require("express") ;
const router = express.Router() ;
const WrapAsync = require("../utilities/WrapAsync.js") ;
const passport = require("passport") ;
const{storeTo} = require("../middleware.js") ;
const user = require("../controllers/user.js");


router.route("/register")
    .get(user.renderRegisterForm)
    .post(WrapAsync(user.register));


router.route("/login")
    .get(user.renderLoginForm)
    .post(storeTo,passport.authenticate("local",{failureFlash:true , failureRedirect:"/login"}),user.login);

router.get("/logout",user.logout);

module.exports = router ;