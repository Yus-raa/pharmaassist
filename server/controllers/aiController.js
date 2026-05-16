import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Product from "../models/product.js";
import Fuse from "fuse.js";
import { generateEmbedding } from "../utils/generateEmbedding.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

// ------------------------------
// 🧠 SYMPTOM INTELLIGENCE LAYER
// ------------------------------
const symptomMap = {
  headache: ["migraine", "dehydration", "stress", "fever"],
  fever: ["infection", "viral", "cold"],
  cough: ["cold", "allergy", "throat infection"],
  stomach: ["gas", "acidity", "food poisoning"],
  fatigue: ["anemia", "vitamin deficiency", "stress"],
};

// ------------------------------
// 🧠 CHAT RAG ENGINE
// ------------------------------
export const pharmaChatAI = catchAsyncError(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
    });
  }

  const query = message.toLowerCase();

  // ============================
  // 1. FETCH ALL PRODUCTS
  // ============================
  const allProducts = await Product.find();

  // ============================
  // 2. FUZZY SEARCH LAYER
  // ============================
  const fuse = new Fuse(allProducts, {
    keys: ["name", "description", "symptoms", "useCases", "category"],
    threshold: 0.35,
  });

  const fuzzyResults = fuse.search(query).map(r => r.item);

  // ============================
  // 3. SYMPTOM EXPANSION LAYER
  // ============================
  let expanded = [];

  Object.keys(symptomMap).forEach((symptom) => {
    if (query.includes(symptom)) {
      expanded.push(...symptomMap[symptom]);
    }
  });

  // ============================
  // 4. KEYWORD FILTER LAYER
  // ============================
  const keywordProducts = allProducts.filter((p) => {
    const text = `
      ${p.name}
      ${p.description}
      ${(p.symptoms || []).join(" ")}
      ${(p.useCases || []).join(" ")}
    `.toLowerCase();

    return expanded.some((w) => text.includes(w));
  });

  // ============================
  // 5. MERGE RESULTS
  // ============================
  const map = new Map();

  [...fuzzyResults, ...keywordProducts].forEach((p) => {
    map.set(p._id.toString(), p);
  });

  let baseProducts = Array.from(map.values());

  if (baseProducts.length === 0) {
    baseProducts = allProducts.slice(0, 10);
  }

  // ============================
  // 6. VECTOR RANKING (YOUR SYSTEM)
  // ============================
  const queryEmbedding = await generateEmbedding(query);

  const ranked = baseProducts
    .map((p) => {
      if (!p.embeddings) return null;

      const similarity = cosineSimilarity(queryEmbedding, p.embeddings);

      // boost logic (VERY IMPORTANT)
      let boost = 0;

      (p.symptoms || []).forEach((s) => {
        if (query.includes(s)) boost += 0.08;
      });

      (p.useCases || []).forEach((u) => {
        if (query.includes(u)) boost += 0.08;
      });

      return {
        _id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        category: p.category,
        images: p.images,
        symptoms: p.symptoms,
        useCases: p.useCases,
        score: similarity + boost,
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  const topResults = ranked.slice(0, 6);

  // ============================
  // 7. RAG RESPONSE FORMAT
  // ============================
  const response = {
    reply: `I found ${topResults.length} relevant medical options based on your symptoms/query.`,

    possibleConditions: Object.keys(symptomMap).filter((k) =>
      query.includes(k)
    ),

    recommendations: topResults.map((p) => ({
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      image: p.images?.[0]?.url,
      symptoms: p.symptoms,
      useCases: p.useCases,
    })),

    disclaimer:
      "This is an AI-assisted suggestion. Please consult a doctor for medical confirmation.",
  };

  res.json({
    success: true,
    data: response,
  });
});