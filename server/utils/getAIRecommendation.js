export async function getAIRecommendation(userPrompt, products) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  const URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${API_KEY}`;

  try {
    // Send relevant fields
    const simplifiedProducts = products.map(p => ({
      id: p._id,
      name: p.name,
      description: p.description,
      category: p.category,
      price: p.price,
      ratings: p.ratings,
    }));

    const geminiPrompt = `
You are an AI assistant for a pharmacy application.

User query:
"${userPrompt}"

Available products:
${JSON.stringify(simplifiedProducts, null, 2)}

Task:
- Return ONLY the most relevant products for the user's need
- Do NOT add new products
- Do NOT modify product data
- Return STRICT JSON array only
- No explanation, no text, only JSON

Example output:
[
  {
    "id": "...",
    "name": "...",
    "description": "...",
    "category": "...",
    "price": 123,
    "ratings": 4.5
  }
]
`;

    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: geminiPrompt }] }],
      }),
    });


    const data = await response.json();

    //
    console.log("RAW GEMINI RESPONSE:", JSON.stringify(data, null, 2));
    //
    const aiText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";

    // Clean markdown if present
    const cleanedText = aiText.replace(/```json|```/g, "").trim();

    if (!cleanedText) {
      throw new Error("Empty AI response");
    }

    let parsed;
    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      throw new Error("Invalid JSON from AI");
    }

    // Safety check
    if (!Array.isArray(parsed)) {
      throw new Error("AI response is not an array");
    }

    return {
      success: true,
      products: parsed,
    };

  } catch (error) {
    console.error("AI Recommendation Error:", error.message);

    // FALLBACK
    return {
      success: false,
      products, // fallback to original filtered products
    };
  }
  console.log("Calling Gemini API...");
}