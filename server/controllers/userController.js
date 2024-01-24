const passport = require("../middlewares/passport-config");
require("dotenv").config({ path: "./server/config/.env" });
const User = require("../models/User");
const ResetToken = require('../models/ResetToken');
const { sendForgetPasswordToken } = require("../config/emailMain");
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secretKey = 'YourSuperSecretKeyHere1234567890';
const asyncErrorHandler = require("../middlewares/asyncErrorHandler")
exports.Register = asyncErrorHandler(async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already taken" });
        }
        const newUser = new User({
            username,
            password
        });
        await newUser.save();
        return res.status(201).json({ message: "User registered successfully" });

    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.resetPassword = asyncErrorHandler(async (req, res) => {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
        return res.status(404).json({ error: 'User Not Found' });
    }

    try {
        let resetToken = await ResetToken.findOne({ userId: user._id });
        if (!resetToken) {
            resetToken = new ResetToken();
            resetToken.userId = user._id;
        }
        resetToken.token = crypto.randomBytes(20).toString('hex');
        resetToken.expirationDate = new Date();
        resetToken.expirationDate.setHours(resetToken.expirationDate.getHours() + 1);
        await resetToken.save();
        sendForgetPasswordToken(user, resetToken.token);
        return res.json({ success: 'Token sent to your email' });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.resetPasswordToken = asyncErrorHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const resetToken = await ResetToken.findOne({ token });
    console.log(resetToken)
    if (!resetToken) {
        return res.status(404).json({ error: 'Invalid or expired token' });
    }
    if (resetToken.expirationDate < new Date()) {
        return res.status(400).json({ error: 'Token has expired' });
    }
    const user = await User.findById(resetToken.userId);
    user.password = password;
    try {
        await user.save();
        await ResetToken.deleteOne({ _id: resetToken._id });

        res.json({ success: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.login = asyncErrorHandler(async (req, res, next) => {
    try {
        passport.authenticate("local", async (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: "Internal Server Error" });
            }
            if (info) {
                return res.status(400).json({ error: info.message });
            }
            req.logIn(user, async (err) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                req.session.user = { username: user.username };
                try {
                    const token = jwt.sign(
                        { username: user.username, _id: user._id, role: user.role, employee: user.employee },
                        secretKey,
                        { expiresIn: '1h' }
                    );
                    return res.json({ token });
                } catch (error) {
                    return res.status(500).json({ error: "Failed to sign JWT token" });
                }
            });
        })(req, res, next);
    } catch (error) {
        return res.status(500).json({ error: "An error occurred while logging in" });
    }
});
exports.profile = asyncErrorHandler(async (req, res) => {
    console.log(req.user._id)
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json({ username: req.user.username, id: req.user.id });
});
exports.logout = asyncErrorHandler(async (req, res) => {
    req.logout(function (err) {
        if (err) {
            console.error('Error during logout:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.clearCookie(secretKey);
        req.session.destroy((err) => {
            if (err) {
                console.error('Error clearing session:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.json({ message: 'Logout successful' });
        });
    });
});