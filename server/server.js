import app from "./app.js";
import { connectDB } from "./database/db.js";
import { v2 as cloudinary } from "cloudinary";

// CONNECT DB
connectDB();
// CLOUDINARY CONFIGURATION
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});
// START SERVER
app.listen(process.env.PORT, () => {
    console.log(`Server is running on PORT: ${process.env.PORT}`);
});