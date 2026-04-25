// Simple embedding system

// Medical vocabulary boost
const medicalVocabulary = [
  "pain", "fever", "cough", "cold", "allergy",
  "infection", "inflammation", "antibiotic",
  "analgesic", "tablet", "syrup", "treatment",
  "relief", "medicine", "drug", "dose"
];

// Text cleaning
const preprocess = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean);
};

// Build vocabulary dynamically
const buildVocabulary = (tokens) => {
  return [...new Set([...tokens, ...medicalVocabulary])];
};

// Term Frequency vector
const buildVector = (tokens, vocab) => {
  return vocab.map(word => {
    const count = tokens.filter(t => t === word).length;
    return count;
  });
};

// Normalize vector
const normalize = (vec) => {
  const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
  return vec.map(v => v / magnitude);
};

// MAIN FUNCTION
export const generateEmbedding = (text) => {
  const tokens = preprocess(text);
  const vocab = buildVocabulary(tokens);
  const vector = buildVector(tokens, vocab);
  return normalize(vector);
};

