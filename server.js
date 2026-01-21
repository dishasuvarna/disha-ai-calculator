require("dotenv").config(); // ✅ LOAD .env FIRST

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Read API key
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error("❌ OPENAI_API_KEY is missing");
  process.exit(1); // stop server if key missing
}

// ✅ Health check (important for daily stability)
app.get("/health", (req, res) => {
  res.send("DISHA AI Calculator is running ✅");
});

app.post("/calculate", async (req, res) => {
  const query = req.body.query;

  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "No query provided" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ STABLE & SUPPORTED
        messages: [
          {
            role: "system",
            content:
              "You are DISHA AI Calculator. Solve the calculation and return only the final answer with a very short explanation."
          },
          {
            role: "user",
            content: query
          }
        ],
        max_tokens: 150
      })
    });

    const data = await response.json();

    // ❌ OpenAI-side error
    if (!response.ok) {
      console.error("OpenAI status:", response.status);
      console.error("OpenAI error:", data);
      return res.status(500).json({
        error: "AI service is temporarily unavailable. Try again later."
      });
    }

    // ❌ Safety check
    if (!data.choices || data.choices.length === 0) {
      return res.status(500).json({ error: "No AI response received" });
    }

    res.json({
      result: data.choices[0].message.content.trim()
    });

  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({
      error: "AI calculation failed due to server issue"
    });
  }
});

// ✅ Use PORT from .env
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ DISHA AI running at http://localhost:${PORT}`);
});