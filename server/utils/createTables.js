import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "config", "config.env"),
});

import mongoose from "mongoose";
import { connectDB } from "../database/db.js"; // your connect function
import User from "../models/user.js";
import Product from "../models/product.js";
import Review from "../models/review.js";
import Order from "../models/orders.js";
import OrderItem from "../models/orderItems.js";
import Payment from "../models/payment.js";
import ShippingInfo from "../models/shippingInfo.js";

const SAFE_ADMIN_EMAIL = process.env.INIT_ADMIN_EMAIL || "admin@example.com";
const SAFE_ADMIN_PASS = process.env.INIT_ADMIN_PASSWORD || "Admin@12345"; // change before production
const SEED_DB = (process.env.SEED_DB || "false").toLowerCase() === "true";

async function init() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Initialising model indexes & collections (Model.init())...");
    // Model.init() will create indexes defined in schemas and ensure collection exists
    await Promise.all([
      User.init(),
      Product.init(),
      Review.init(),
      Order.init(),
      OrderItem.init(),
      Payment.init(),
      ShippingInfo.init(),
    ]);

    console.log("Collections and indexes are initialised.");

    // Optionally seed an admin user + sample product if SEED_DB=true
    if (SEED_DB) {
      console.log("SEED_DB is enabled — creating demo data (if not exists)...");

      // create admin user if missing
      const existingAdmin = await User.findOne({ email: SAFE_ADMIN_EMAIL }).exec();
      if (!existingAdmin) {
        const admin = await User.create({
          name: "Admin",
          email: SAFE_ADMIN_EMAIL,
          password: SAFE_ADMIN_PASS,
          role: "admin",
        });
        console.log(`• Admin user created => email: ${SAFE_ADMIN_EMAIL} password: ${SAFE_ADMIN_PASS}`);
      } else {
        console.log("• Admin user already exists (skipping)");
      }

      // create a sample product if none exist
      const productCount = await Product.countDocuments();
      if (productCount === 0) {
        // find any admin to set created_by
        const anyAdmin = await User.findOne({ role: "admin" }).lean();
        const createdBy = anyAdmin ? anyAdmin._id : null;

        const sampleProduct = await Product.create({
          name: "Sample Paracetamol 500mg",
          description: "Sample product for dev/demo. Use this to test orders and AI features.",
          price: 120,
          category: "Pain Relief",
          images: [],
          stock: 100,
          created_by: createdBy || "system",
        });
        console.log("• Sample product created:", sampleProduct._id);
      } else {
        console.log("• Products already exist (skipping sample product)");
      }

      console.log("Demo data seeded.");
    } else {
      console.log("SEED_DB not enabled — no demo data created. (set SEED_DB=true to seed)");
    }

    console.log("Initialization complete — exiting.");
    process.exit(0);
  } catch (err) {
    console.error("Initialization failed:", err);
    process.exit(1);
  }
}

// run only when invoked directly (so importing file elsewhere doesn't execute)
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1].endsWith("createTables.js")) {
  init();
}

export default init;
