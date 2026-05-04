import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { ErrorHandler } from "../middlewares/errorMiddleware.js";
import Product from "../models/product.js";
import Review from "../models/review.js";
import User from "../models/user.js";
import { v2 as cloudinary } from "cloudinary";
// import { getAIRecommendation } from "../utils/getAIRecommendation.js";
import { generateEmbedding } from "../utils/generateEmbedding.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";
import Fuse from "fuse.js";

// ---------------------------
// CREATE PRODUCT
export const createProduct = catchAsyncError(async (req, res, next) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    symptoms,
    useCases
  } = req.body;

  const created_by = req.user._id;

  if (!name || !description || !price || !category || !stock) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  let uploadedImages = [];

  if (req.files && req.files.images) {
    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Pharmacy_Product_Images",
        width: 1000,
        crop: "scale",
      });

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  }

  // Normalize arrays
  const normalizeToArray = (field) => {
    if (!field) return [];
    if (Array.isArray(field)) return field;
    if (typeof field === "string") {
      return field.split(",").map(item => item.trim().toLowerCase());
    }
    return [];
  };

  const normalizedSymptoms = normalizeToArray(symptoms);
  const normalizedUseCases = normalizeToArray(useCases);

  // PRODUCT EMBEDDING
  const textData = `
Product Name: ${name}
Description: ${description}
Category: ${category}
Symptoms: ${normalizedSymptoms.join(", ")}
Use Cases: ${normalizedUseCases.join(", ")}
`;

  const embedding = await generateEmbedding(textData);

  const product = await Product.create({
    name,
    description,
    price,
    category,
    stock,
    images: uploadedImages,
    created_by,
    symptoms: normalizedSymptoms,
    useCases: normalizedUseCases,
    embeddings: embedding,
  });

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    product,
  });
});

// ---------------------------
// FETCH ALL PRODUCTS
export const fetchAllProducts = catchAsyncError(async (req, res, next) => {
  const { availability, price, category, ratings, search } = req.query;

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  // Mongo filter object
  let filter = {};

  // 1 Availability filter
  if (availability === "in-stock") {
    filter.stock = { $gt: 5 };
  } else if (availability === "limited-stock") {
    filter.stock = { $gt: 0, $lte: 5 };
  } else if (availability === "out-of-stock") {
    filter.stock = 0;
  }

  // 2 Price filter (range)
  if (price) {
    const [min, max] = price.split("-");
    filter.price = {};
    if (min) filter.price.$gte = Number(min);
    if (max) filter.price.$lte = Number(max);
  }

  // 3 Category filter
  if (category) {
    filter.category = { $regex: category, $options: "i" }; // case-insensitive
  }

  // 4 Ratings filter
  if (ratings) {
    filter.ratings = { $gte: Number(ratings) };
  }

  // 5 Search (name + description)
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  // Main Query
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalProducts = await Product.countDocuments(filter);

  // New Products (last 30 days)
  const newProducts = await Product.find({
    createdAt: {
      $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  })
    .sort({ createdAt: -1 })
    .limit(8);

  // Top Rated Products
  const topRatedProducts = await Product.find({
    ratings: { $gte: 4.5 },
  })
    .sort({ ratings: -1, createdAt: -1 })
    .limit(8);

  res.status(200).json({
    success: true,
    totalProducts,
    products,
    newProducts,
    topRatedProducts,
  });
});

// ---------------------------
// UPDATE PRODUCT
export const updateProduct = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  // Find product
  let product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Update basic fields (only if provided)
  const { name, description, price, category, stock } = req.body;

  if (name) product.name = name;
  if (description) product.description = description;
  if (price !== undefined) product.price = price;
  if (category) product.category = category;
  if (stock !== undefined) product.stock = stock;

  // Handle image updates (only if new images are provided)
  if (req.files && req.files.images) {
    // delete old images from cloudinary
    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        if (img.public_id) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }
    }

    const images = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images];

    let uploadedImages = [];

    for (const image of images) {
      const result = await cloudinary.uploader.upload(image.tempFilePath, {
        folder: "Pharmacy_Product_Images",
        width: 1000,
        crop: "scale",
      });

      uploadedImages.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    product.images = uploadedImages;
  }

  // Save updated product
  await product.save();

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    product,
  });
});

// ---------------------------
// DELETE PRODUCT
export const deleteProduct = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  // Find product
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Delete images from Cloudinary (if exist)
  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }
  }

  // Delete product from DB
  await product.deleteOne();

  res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
});

// ---------------------------
// FETCH SINGLE PRODUCT
export const fetchSingleProduct = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  // Find product
  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Fetch reviews for this product
  const reviews = await Review.find({ product_id: productId })
    .populate({
      path: "user_id",
      select: "name avatar", // only required fields
    })
    .sort({ createdAt: -1 });

  // Format reviews (clean response)
  const formattedReviews = reviews.map((r) => ({
    review_id: r._id,
    rating: r.rating,
    comment: r.comment,
    reviewer: {
      id: r.user_id?._id,
      name: r.user_id?.name,
      avatar: r.user_id?.avatar,
    },
  }));

  res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    product,
    reviews: formattedReviews,
  });
});

// ---------------------------
// POST PRODUCT REVIEW
export const postProductReview = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;
  const { rating, comment } = req.body;

  // Validation
  if (!rating || !comment) {
    return next(new ErrorHandler("Please provide rating and comment.", 400));
  }

  // Check product exists
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Check if already reviewed
  let review = await Review.findOne({
    product_id: productId,
    user_id: req.user._id,
  });

  if (review) {
    // Update existing review
    review.rating = rating;
    review.comment = comment;
    await review.save();
  } else {
    // Create new review
    review = await Review.create({
      product_id: productId,
      user_id: req.user._id,
      rating,
      comment,
    });
  }

  // Recalculate product rating
  const reviews = await Review.find({ product_id: productId });

  const avgRating =
    reviews.reduce((acc, item) => acc + item.rating, 0) / reviews.length;

  product.ratings = avgRating.toFixed(1); // rounding
  await product.save();

  res.status(200).json({
    success: true,
    message: "Review submitted successfully",
    review,
    product,
  });
});

// ---------------------------
// DELETE PRODUCT REVIEW
export const deleteReview = catchAsyncError(async (req, res, next) => {
  const { productId } = req.params;

  // Find review
  const review = await Review.findOne({
    product_id: productId,
    user_id: req.user._id,
  });

  if (!review) {
    return next(new ErrorHandler("Review not found.", 404));
  }

  // Delete review
  await review.deleteOne();

  // Recalculate ratings
  const reviews = await Review.find({ product_id: productId });

  let avgRating = 0;

  if (reviews.length > 0) {
    const total = reviews.reduce((acc, item) => acc + item.rating, 0);
    avgRating = total / reviews.length;
    avgRating = Number(avgRating.toFixed(1));
  }

  // Update product rating
  const product = await Product.findByIdAndUpdate(
    productId,
    { ratings: avgRating },
    { new: true }
  );

  res.status(200).json({
    success: true,
    message: "Your review has been deleted.",
    product,
  });
});

// ---------------------------
// AI FILTERING
export const fetchAIFilteredProducts = catchAsyncError(
  async (req, res, next) => {
    const { userPrompt } = req.body;

    if (!userPrompt) {
      return next(new ErrorHandler("Provide a valid prompt.", 400));
    }

    // KEYWORD CLEANING
    const stopWords = new Set([
      "i","me","my","we","you","he","she","it","they",
      "is","am","are","was","were","be","been",
      "a","an","the","and","or","but",
      "of","to","for","from","in","on","at","by",
      "with","about","against","between","into",
      "through","during","before","after",
      "above","below","up","down","out","off",
      "over","under","again","further","then","once",
      "here","there","when","where","why","how",
      "all","any","both","each","few","more","most",
      "other","some","such","no","nor","not","only",
      "own","same","so","than","too","very",

      // pharmacy fillers
      "medicine","medicines","tablet","tablets","syrup",
      "drug","drugs","need","want","give"
    ]);

    const keywords = userPrompt
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter(word => word && !stopWords.has(word));

    // MEDICAL MAP
    const medicalMap = {
      headache: ["pain", "paracetamol", "ibuprofen", "panadol"],
      fever: ["paracetamol", "calpol"],
      pain: ["ibuprofen", "aspirin"],
      cough: ["cough", "dextromethorphan"],
      cold: ["antihistamine", "decongestant"],
      allergy: ["cetirizine", "loratadine"],
      infection: ["antibiotic", "amoxicillin"],
      inflammation: ["ibuprofen", "naproxen"],
      stomach: ["antacid", "omeprazole"],
      immunity: ["vitamin", "vitamin c", "supplement"],
    };

    let expandedKeywords = [...keywords];

    keywords.forEach(word => {
      if (medicalMap[word]) {
        expandedKeywords.push(...medicalMap[word]);
      }
    });

    // FETCH ALL PRODUCTS
    const allProducts = await Product.find();

    // FUZZY SEARCH
    const fuse = new Fuse(allProducts, {
      keys: ["name", "description", "category", "symptoms", "useCases"],
      threshold: 0.3, // tune this (0.2–0.4)
    });

    const fuzzyResults = fuse.search(userPrompt);
    const fuzzyProducts = fuzzyResults.slice(0, 10).map(r => r.item);

    // KEYWORD FILTER
    const keywordProducts = allProducts.filter(product => {
      const text = `
        ${product.name}
        ${product.description}
        ${product.category}
        ${(product.symptoms || []).join(" ")}
        ${(product.useCases || []).join(" ")}
      `.toLowerCase();

      return expandedKeywords.some(word => text.includes(word));
    });

    //  MERGE RESULTS
    const combinedMap = new Map();

    [...fuzzyProducts, ...keywordProducts].forEach(p => {
      combinedMap.set(p._id.toString(), p);
    });

    let baseProducts = Array.from(combinedMap.values());

    // fallback
    if (baseProducts.length === 0) {
      baseProducts = allProducts.slice(0, 50);
    }

    // EMBEDDING RANKING
    const enrichedQuery = `
    User is looking for a medical product.

    Query: ${userPrompt}

    Possible symptoms: ${keywords.join(", ")}
    Medical meaning: ${expandedKeywords.join(", ")}

    Find relevant medicine or healthcare product.
    `;

    const queryEmbedding = await generateEmbedding(enrichedQuery);

    if (!queryEmbedding) {
      return res.status(200).json({
        success: true,
        message: "Fallback results",
        products: baseProducts.slice(0, 10),
      });
    }

    const scoredProducts = baseProducts.map(product => {
      if (!product.embeddings) return null;

      let boost = 0;

    keywords.forEach(k => {
      if ((product.symptoms || []).includes(k)) boost += 0.1;
      if ((product.useCases || []).includes(k)) boost += 0.1;});

    const score = cosineSimilarity(queryEmbedding, product.embeddings) + boost;

      return {
        ...product.toObject(),
        similarity: score,
      };
    }).filter(Boolean);

    scoredProducts.sort((a, b) => b.similarity - a.similarity);

    const SIMILARITY_THRESHOLD = 0.5; // tune this (0.45–0.65)

    const filteredBySimilarity = scoredProducts.filter(
      p => p.similarity >= SIMILARITY_THRESHOLD
    );

    const finalProducts =
      filteredBySimilarity.length > 0
        ? filteredBySimilarity.slice(0, 10)
        : scoredProducts.slice(0, 5); // fallback

    // -----------------------------
    res.status(200).json({
      success: true,
      message: "AI smart search results",
      keywords,
      products: finalProducts,
    });
  }
);