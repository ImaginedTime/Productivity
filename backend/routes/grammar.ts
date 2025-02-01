import express from "express";
import { authenticateToken } from "../middleware/auth";
import axios from "axios";

const router = express.Router();

router.post("/correct", authenticateToken, async (req, res) => {
  try {
    const { text } = req.body;
    
    // Using a grammar correction API (example with OpenAI - you can replace with your preferred service)
    const response = await axios.post('YOUR_GRAMMAR_API_ENDPOINT', {
      text,
      // Add any additional parameters your API needs
    });

    res.json({ correctedText: response.data.correctedText });
  } catch (error) {
    res.status(500).json({ message: "Error correcting grammar" });
  }
});

export default router; 