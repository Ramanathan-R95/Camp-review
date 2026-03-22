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
    .post(isLoggedIn,campValidate,upload.array("image"), wrapAsync(campgrounds.addCampground));
   

router.get("/new",isLoggedIn,campgrounds.renderNewForm);

router.route("/:id")
    .get(wrapAsync(campgrounds.show))
    .put(isLoggedIn,verifyUser,campValidate,upload.array("image"),wrapAsync(campgrounds.update))
    .delete(isLoggedIn,verifyUser,wrapAsync(campgrounds.delete)) ;





router.get("/:id/edit",isLoggedIn,verifyUser,wrapAsync(campgrounds.edit));









module.exports = router ;