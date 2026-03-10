import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import User from "../models/user.js";
import { sendToken } from "../utils/jwtToken.js";

// REGISTER USER
export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please provide all required fields!", 400));
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
