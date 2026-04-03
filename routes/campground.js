const express = require("express") ;
const router = express.Router() ;
const wrapAsync = require("../utilities/WrapAsync.js") ;
const {isLoggedIn,campValidate,verifyUser} = require("../middleware.js");
const campgrounds = require("../controllers/campgrounds.js") ;
const multer = require("multer") ;

const {storage} = require("../cloudinary") ;

const upload = multer({
  storage: storage,
});



router.route("/")
    .get(wrapAsync(campgrounds.index))
    .post(isLoggedIn,upload.array("image"), campValidate,wrapAsync(campgrounds.addCampground));
   

router.get("/new",isLoggedIn,campgrounds.renderNewForm);

router.route("/:id")
    .get(wrapAsync(campgrounds.show))
    .put(isLoggedIn,verifyUser,upload.array("image"),campValidate,wrapAsync(campgrounds.update))
    .delete(isLoggedIn,verifyUser,wrapAsync(campgrounds.delete)) ;





router.get("/:id/edit",isLoggedIn,verifyUser,wrapAsync(campgrounds.edit));









module.exports = router ;