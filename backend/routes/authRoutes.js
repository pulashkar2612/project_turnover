const express = require("express");
const {
  LoginController,
  SignupController,
  VerifyOtpController,
  UpdateController
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", SignupController);
router.post("/verifyOtp", VerifyOtpController);
router.post("/login", LoginController);
router.put('/updateCheckedProducts/:userId', UpdateController);

module.exports = router;
