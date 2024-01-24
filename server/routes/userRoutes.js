const express = require("express");
const {
    Register,
    resetPassword,
    resetPasswordToken,
    login,
    profile,
    logout
} = require("../controllers/userController");

const { verifyToken, isAuthenticated } = require("../config/functions")
const { handleValidationErrors, validateUserRegistration, validateUserLogin, validateResetPassowrd, validateChangePassword } = require("../middlewares/validation")
const router = express.Router();
router.route("/register").post(validateUserRegistration, handleValidationErrors, Register);
router.route("/restpassword").post(validateResetPassowrd, handleValidationErrors, resetPassword);
router.route("/changepassword/:token").put(validateChangePassword, handleValidationErrors, resetPasswordToken);
router.route("/login").post(validateUserLogin, handleValidationErrors, login);
router.route("/profile").get(verifyToken, isAuthenticated, profile);
router.route("/logout").get(logout);

module.exports = router;


