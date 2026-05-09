import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";

import Product from "../models/product.js";
import Order from "../models/orders.js";

import { generatePaymentIntent } from "../utils/generatePaymentIntent.js";


// Place New Order
export const placeNewOrder = catchAsyncError(
  async (req, res, next) => {

    const {
      full_name,
      state,
      city,
      country,
      address,
      pincode,
      phone,
      orderedItems,
    } = req.body;

    // VALIDATION

    if (
      !full_name ||
      !state ||
      !city ||
      !country ||
      !address ||
      !pincode ||
      !phone
    ) {
      return next(
        new ErrorHandler(
          "Please provide complete shipping details.",
          400
        )
      );
    }

    if (!orderedItems || orderedItems.length === 0) {
      return next(new ErrorHandler("No items in cart.", 400));
    }

    // FETCH PRODUCTS

    const productIds = orderedItems.map(
      (item) => item.product_id
    );

    const products = await Product.find({
      _id: { $in: productIds },
    });

    let total_price = 0;

    const finalOrderItems = [];

    // VALIDATE STOCK

    for (const item of orderedItems) {

      const product = products.find(
        (p) => p._id.toString() === item.product_id
      );

      if (!product) {
        return next(
          new ErrorHandler(
            `Product not found: ${item.product_id}`,
            404
          )
        );
      }

      if (product.stock === 0) {
      return next(
        new ErrorHandler(
          `${product.name} is currently out of stock.`,
          400
        )
      );
    }
      
    if (item.quantity > product.stock) {
      return next(
        new ErrorHandler(
          `Only ${product.stock} units available for ${product.name}.`,
          400
        )
      );
    }

      const itemTotal = product.price * item.quantity;

      total_price += itemTotal;

      finalOrderItems.push({
        product_id: product._id,
        name: product.name,

        image:
            product.images?.[0]?.url || "",

        price: product.price,
        quantity: item.quantity,
      });
    }

    // PRICING

    const tax_price = Number(
      (total_price * 0.18).toFixed(2)
    );

    const shipping_price =
      total_price >= 5000 ? 0 : 250;

    total_price =
      total_price +
      tax_price +
      shipping_price;

    // CREATE ORDER

    const order = await Order.create({
      buyer_id: req.user._id,

      order_items: finalOrderItems,

      shipping_info: {
        full_name,
        state,
        city,
        country,
        address,
        pincode,
        phone,
      },

      total_price,
      tax_price,
      shipping_price,
    });

    // STRIPE PAYMENT

    const paymentResponse =
      await generatePaymentIntent(
        order._id,
        total_price
      );

    if (!paymentResponse.success) {
      return next(
        new ErrorHandler(
          "Payment initialization failed",
          500
        )
      );
    }

    // RESPONSE

    res.status(201).json({
      success: true,
      message:
        "Order placed successfully. Proceed to payment.",

      orderId: order._id,

      clientSecret:
        paymentResponse.clientSecret,

      total_price,
    });
  }
);

// Fetch Single Order
export const fetchSingleOrder = catchAsyncError(
  async (req, res, next) => {

    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return next(
        new ErrorHandler("Order not found.", 404)
      );
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      order,
    });
  }
);