const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = "YOUR_OPENAI_API_KEY"; // your real key

app.post("/calculate", async (req, res) => {
  const query = req.body.query;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are DISHA CALCULATOR. Solve ALL calculations and return the final answer with a short explanation."
          },
          {
            role: "user",
            content: query
          }
        ]
      })
    });

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });

  } catch (error) {
    res.status(500).json({ error: "AI calculation failed" });
  }
});

app.listen(3000, () => {
  console.log("✅ DISHA AI running at http://localhost:3000");
});
