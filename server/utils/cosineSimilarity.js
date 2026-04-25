// 🔹 Cosine similarity
export const cosineSimilarity = (vecA, vecB) => {
  const length = Math.min(vecA.length, vecB.length);

  let dot = 0, magA = 0, magB = 0;

  for (let i = 0; i < length; i++) {
    dot += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }

  if (magA === 0 || magB === 0) return 0;

  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};