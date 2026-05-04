import { pipeline } from "@xenova/transformers";

let extractor = null;

// Load model only once (IMPORTANT)
const loadModel = async () => {
  if (!extractor) {
    console.log("Loading embedding model...");
    extractor = await pipeline(
      "feature-extraction",
      "Xenova/paraphrase-multilingual-MiniLM-L12-v2"
    );
    console.log("Embedding model loaded");
  }
};

export const generateEmbedding = async (text) => {
  try {
    await loadModel();

    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    // Convert tensor → normal JS array
    return Array.from(output.data);

  } catch (error) {
    console.error("Embedding Error:", error.message);
    return null;
  }
};