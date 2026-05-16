import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import Product from "../models/product.js";
import Fuse from "fuse.js";

import { generateEmbedding } from "../utils/generateEmbedding.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

// ==============================
// 🧠 SYMPTOM INTELLIGENCE LAYER
// ==============================
const symptomMap = {
  headache: [
    "migraine",
    "dehydration",
    "stress",
    "fever",
    "pain",
  ],

  fever: [
    "infection",
    "viral",
    "cold",
    "temperature",
  ],

  cough: [
    "cold",
    "allergy",
    "throat infection",
    "flu",
    "dry cough",
  ],

  stomach: [
    "gas",
    "acidity",
    "food poisoning",
    "indigestion",
  ],

  fatigue: [
    "anemia",
    "vitamin deficiency",
    "stress",
    "weakness",
  ],
};

// ==============================
// 🧠 CHAT RAG ENGINE
// ==============================
export const pharmaChatAI =
  catchAsyncError(
    async (req, res) => {

      const { message } = req.body;

      // ==========================
      // VALIDATION
      // ==========================
      if (!message) {
        return res.status(400).json({
          success: false,
          message:
            "Message is required",
        });
      }

      const query =
        message.toLowerCase().trim();

      // ==========================
      // FETCH PRODUCTS
      // ==========================
      const allProducts =
        await Product.find();

      if (
        !allProducts ||
        allProducts.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "No medicines available right now.",
        });
      }

      // ==========================
      // FUZZY SEARCH
      // ==========================
      const fuse = new Fuse(
        allProducts,
        {
          keys: [
            "name",
            "description",
            "symptoms",
            "useCases",
            "category",
          ],

          threshold: 0.3,

          includeScore: true,

          minMatchCharLength: 2,
        }
      );

      const fuzzyResults =
        fuse.search(query);

      // ==========================
      // SYMPTOM EXPANSION
      // ==========================
      let expandedKeywords = [];

      Object.keys(symptomMap).forEach(
        (symptom) => {

          if (
            query.includes(symptom)
          ) {
            expandedKeywords.push(
              symptom
            );

            expandedKeywords.push(
              ...symptomMap[
                symptom
              ]
            );
          }
        }
      );

      expandedKeywords = [
        ...new Set(
          expandedKeywords
        ),
      ];

      // ==========================
      // KEYWORD FILTER
      // ==========================
      const keywordProducts =
        allProducts.filter(
          (p) => {

            const searchableText = `
              ${p.name || ""}
              ${p.description || ""}
              ${(p.symptoms || []).join(
                " "
              )}
              ${(p.useCases || []).join(
                " "
              )}
              ${p.category || ""}
            `.toLowerCase();

            return expandedKeywords.some(
              (keyword) =>
                searchableText.includes(
                  keyword
                )
            );
          }
        );

      // ==========================
      // MERGE + DEDUPE
      // ==========================
      const productMap =
        new Map();

      // FUZZY RESULTS
      fuzzyResults.forEach(
        (result) => {

          // reject weak fuzzy matches
          if (
            result.score > 0.45
          )
            return;

          productMap.set(
            result.item._id.toString(),
            result.item
          );
        }
      );

      // KEYWORD RESULTS
      keywordProducts.forEach(
        (product) => {

          productMap.set(
            product._id.toString(),
            product
          );
        }
      );

      const baseProducts =
        Array.from(
          productMap.values()
        );

      // ==========================
      // 🚫 IMPORTANT FIX
      // NO FALLBACK TO ALL PRODUCTS
      // ==========================
      if (
        baseProducts.length === 0
      ) {

        return res.json({
          success: true,

          data: {
            reply:
              "I couldn't find any relevant medicines for your symptoms/query right now.",

            possibleConditions:
              Object.keys(
                symptomMap
              ).filter((k) =>
                query.includes(k)
              ),

            recommendations: [],

            disclaimer:
              "This AI assistant only suggests medicines when relevant matches are available.",
          },
        });
      }

      // ==========================
      // VECTOR SEARCH
      // ==========================
      const queryEmbedding =
        await generateEmbedding(
          query
        );

      const ranked =
        baseProducts
          .map((p) => {

            if (
              !p.embeddings
            )
              return null;

            let similarity =
              cosineSimilarity(
                queryEmbedding,
                p.embeddings
              );

            // ======================
            // BOOSTING SYSTEM
            // ======================
            let boost = 0;

            // symptom boosts
            (
              p.symptoms || []
            ).forEach((s) => {

              if (
                query.includes(
                  s.toLowerCase()
                )
              ) {
                boost += 0.12;
              }
            });

            // usecase boosts
            (
              p.useCases || []
            ).forEach((u) => {

              if (
                query.includes(
                  u.toLowerCase()
                )
              ) {
                boost += 0.12;
              }
            });

            // category boosts
            if (
              p.category &&
              query.includes(
                p.category.toLowerCase()
              )
            ) {
              boost += 0.08;
            }

            const finalScore =
              similarity + boost;

            return {
              _id: p._id,

              name: p.name,

              description:
                p.description,

              price: p.price,

              category:
                p.category,

              images: p.images,

              symptoms:
                p.symptoms,

              useCases:
                p.useCases,

              score:
                finalScore,
            };
          })

          .filter(Boolean)

          // reject weak vector matches
          .filter(
            (p) => p.score >= 0.35
          )

          .sort(
            (a, b) =>
              b.score - a.score
          );

      // ==========================
      // FINAL SAFETY CHECK
      // ==========================
      if (
        ranked.length === 0
      ) {

        return res.json({
          success: true,

          data: {
            reply:
              "No medically relevant products were found for your query.",

            possibleConditions:
              Object.keys(
                symptomMap
              ).filter((k) =>
                query.includes(k)
              ),

            recommendations: [],

            disclaimer:
              "Please consult a healthcare professional for proper medical advice.",
          },
        });
      }

      // ==========================
      // LIMIT RESULTS
      // ==========================
      const topResults =
        ranked.slice(0, 6);

      // ==========================
      // RESPONSE
      // ==========================
      const response = {

        reply: `I found ${topResults.length} relevant medical option${
          topResults.length > 1
            ? "s"
            : ""
        } based on your symptoms/query.`,

        possibleConditions:
          Object.keys(
            symptomMap
          ).filter((k) =>
            query.includes(k)
          ),

        recommendations: topResults.map((p) => ({
  _id: p._id,
  name: p.name,
  description: p.description,
  price: p.price,
  images: p.images,
  category: p.category,
  symptoms: p.symptoms,
  useCases: p.useCases,
})),

        disclaimer:
          "This is an AI-assisted suggestion and not a medical diagnosis. Please consult a doctor before taking medication.",
      };

      res.json({
        success: true,
        data: response,
      });
    }
  );