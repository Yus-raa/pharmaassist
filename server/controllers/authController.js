import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import User from "../models/user.js";
import { sendToken } from "../utils/jwtToken.js";
import { generatePasswordResetToken } from "../utils/PasswordToken.js";
import { generateEmailTemplate } from "../utils/forgotPasswordEmailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import {v2 as cloudinary} from "cloudinary";
// REGISTER USER
export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please provide all required fields!", 400));
    }
    if (password?.length < 8 || password?.length > 20) {
        return next(new ErrorHandler("Password must be between 8 and 20 characters!", 400));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler("User already registered with this email!", 400));
    }

    // hashing happens automatically in userSchema.pre('save')
    const user = await User.create({ name, email, password });

    sendToken(user, 201, 'User Registered Successfully', res);
});

// LOGIN USER
export const login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Email and password are required!", 400));
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid email or password!", 400));

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ErrorHandler("Invalid email or password!", 400));
    // hide password
    user.password = undefined;
    sendToken(user, 200, "Login Successful", res);
});

// GET USER DETAILS
export const getUser = catchAsyncError(async (req, res, next) => {
    const { user } = req;
    res.status(200).json({
        success: true,
        user,
    }); 
});

// LOGOUT USER
export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    }).json({
        success: true,
        message: "Logged out successfully",
    });
});

// FORGOT PASSWORD
export const forgotPassword = catchAsyncError(async (req, res, next) => {

    const { email } = req.body;
    const { frontendUrl } = req.query;

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorHandler("User not found with this email!", 404));
    }

    // generate token
    const { resetToken, hashedToken, tokenExpiry } = generatePasswordResetToken();

    // save token in DB
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = tokenExpiry;

    await user.save({ validateBeforeSave: false });

    // reset URL
    const resetPasswordUrl = `${frontendUrl}/password/reset/${resetToken}`;

    const message = generateEmailTemplate(resetPasswordUrl);

    try {

        await sendEmail({
            email: user.email,
            subject: "PharmaAssist Password Recovery",
            message
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully!`
        });

    } catch (error) {

        user.resetPasswordToken = null;
        user.resetPasswordExpire = null;

        await user.save({ validateBeforeSave: false });

        return next(new ErrorHandler("Failed to send email. Please try again later.", 500));
    }

});

// RESET PASSWORD
export const resetPassword = catchAsyncError(async (req, res, next) => {

    const { token } = req.params;

    // hash token from URL
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    // find user with valid token
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler("Invalid or expired password reset token!", 400));
    }

    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new ErrorHandler("Please provide password and confirm password!", 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler("Password and confirm password do not match!", 400));
    }

    if (password?.length < 8 || password?.length > 20) {
        return next(new ErrorHandler("Password must be between 8 and 20 characters!", 400));
    }

    // update password
    user.password = password;

    // clear reset token fields
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    // login user again
    sendToken(user, 200, "Password reset successful", res);

});

// UPDATE PASSWORD
export const updatePassword = catchAsyncError(async (req, res, next) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
        return next(
            new ErrorHandler(
                "Please provide all the required fields!",
                400
            )
        );
    }

    const user = await User.findById(req.user._id).select("+password");

    // Check if current password is correct
    const isPasswordMatch = await user.comparePassword(currentPassword);
    if (!isPasswordMatch) {
        return next(new ErrorHandler("Current password is incorrect!", 400));
    }

    // Validate new password and confirm password
    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler("New password and confirm password do not match!", 400));
    }

    if (newPassword.length < 8 || newPassword.length > 20) {
        return next(new ErrorHandler("New password must be between 8 and 20 characters!", 400));
    }

    // Update password — pre-save middleware will hash it
    user.password = newPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully!"
    });
});

// UPDATE PROFILE
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return next(new ErrorHandler("Please provide both name and email!", 400));
    }

    if(name.trim().length === 0 || email.trim().length === 0) {
        return next(new ErrorHandler("Name and email cannot be empty!", 400));
    }

    const user = req.user;

    // Check if email already exists
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser._id.toString() !== user._id.toString()) {
        return next(new ErrorHandler("Email already in use", 400));
    }

    let avatarData = {};
    if (req.files && req.files.avatar) {
        const {avatar} = req.files;
        if(req.user?.avatar?.public_id) {
            await cloudinary.uploader.destroy(req.user.avatar.public_id);
        }

        const newProfileImage = await cloudinary.uploader.upload(avatar.tempFilePath, {
            folder: "pharmacyApp_avatars",
            width: 150,
            crop: "scale"
        });
        avatarData = {
            public_id: newProfileImage.public_id,
            url: newProfileImage.secure_url,
        };
    }

    

    user.name = name;
    user.email = email;

    if (Object.keys(avatarData).length > 0) {
        user.avatar = avatarData;
    }
    await user.save();

    res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
        user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
        }
    });

});