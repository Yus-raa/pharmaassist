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

    // Only the buyer can access their order details
    if (order.buyer_id !== req.user._id) {
      return next(
        new ErrorHandler(
          "Unauthorized to access this order.",
          403
        )
      );
    }

    res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      order,
    });
  }
);

// Fetch My Orders
export const fetchMyOrders = catchAsyncError(
  async (req, res, next) => {

    const myOrders = await Order.find({
      buyer_id: req.user._id,
      payment_status: "Paid",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "All your orders fetched successfully.",
      myOrders,
    });
  }
);

// Fetch All Orders (Admin)
export const fetchAllOrders = catchAsyncError(
  async (req, res, next) => {

    const orders = await Order.find({
      payment_status: "Paid",
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      message: "All paid orders fetched successfully.",
      orders,
    });
  }
);

// Update Order Status (Admin)
export const updateOrderStatus = catchAsyncError(
  async (req, res, next) => {

    const { status } = req.body;

    if (!status) {
      return next(
        new ErrorHandler(
          "Please provide order status.",
          400
        )
      );
    }

    const allowedStatuses = [
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return next(
        new ErrorHandler(
          "Invalid order status.",
          400
        )
      );
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorHandler(
          "Order not found.",
          404
        )
      );
    }

    order.order_status = status;

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  }
);

// Delete Order (Admin)
export const deleteOrder = catchAsyncError(
  async (req, res, next) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorHandler(
          "Order not found.",
          404
        )
      );
    }

    await order.deleteOne();

    res.status(200).json({
      success: true,
      message: "Order deleted successfully.",
      order,
    });
  }
);

// Mark Order As Paid
export const markOrderAsPaid = catchAsyncError(
  async (req, res, next) => {

    const { payment_id } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(
        new ErrorHandler(
          "Order not found.",
          404
        )
      );
    }

    // Prevent duplicate payment updates
    if (order.payment_status === "Paid") {
      return next(
        new ErrorHandler(
          "Order is already paid.",
          400
        )
      );
    }

    // UPDATE PAYMENT INFO
    order.payment_status = "Paid";

    order.paid_at = new Date();

    order.payment_id =
      payment_id || "TEST_PAYMENT_ID";

    // REDUCE PRODUCT STOCK
    for (const item of order.order_items) {

      const product = await Product.findById(
        item.product_id
      );

      if (!product) {
        return next(
          new ErrorHandler(
            `Product not found: ${item.product_id}`,
            404
          )
        );
      }

      // Extra safety check
      if (product.stock < item.quantity) {
        return next(
          new ErrorHandler(
            `Insufficient stock for ${product.name}`,
            400
          )
        );
      }

      product.stock -= item.quantity;

      await product.save();
    }

    await order.save();

    res.status(200).json({
      success: true,
      message:
        "Payment successful. Order marked as paid.",

      order,
    });
  }
);