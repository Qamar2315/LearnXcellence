const express = require("express");
const router = express.Router();
const  {isLogin}  = require('../middlewares/isLogin');
const { isStudent } = require("../middlewares/authorization");
const { isEmailVerified } = require("../middlewares/isEmailVerified");
const { uploadProctoringImage } = require("../middlewares/multer/uploadProctoringImage");
const proctoringController = require("../controllers/proctoringController");

router
  .route("/analyze-image")
  .post(
    isLogin,
    isEmailVerified,
    isStudent,
    uploadProctoringImage.single("proctor_image"),
    proctoringController.analyzeImage
  );

module.exports = router;
