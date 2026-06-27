import { brainStormAI } from "../services/ai.service.js";
import Repo from "../models/repo.model.js";

export const brainstorm = async (req, res) => {
  try {
    const { repoId } = req.params;
    const userId = req.user._id;
    const { userInput } = req.body;

    if (!userInput) {
      return res.status(404).json({ message: "User Input is required" });
    }
    const repo = await Repo.findOne({ userId, repoId });
    if (!repo) {
      return res.status(404).json({ message: "Repo not found" });
    }

    const response = await brainStormAI(userInput);

    const cleanedResponse = response
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResponse;

    try {
      parsedResponse = JSON.parse(cleanedResponse);
    } catch (error) {
      return res.status(500).json({
        message: "AI returned invalid JSON",
        rawResponse: cleanedResponse,
      });
    }

    const {
      summary,
      features,
      notes,
      risks,
      futureIdeas,
    } = parsedResponse;
    if (
      typeof summary !== "string" ||
      !Array.isArray(features) ||
      !Array.isArray(notes) ||
      !Array.isArray(risks) ||
      !Array.isArray(futureIdeas)
    ) {
      return res.status(500).json({
        message: "AI response schema invalid",
        rawResponse: parsedResponse,
      });
    }

    return res.status(200).json({
      summary,
      features,
      notes,
      risks,
      futureIdeas,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Output generation failed", error: error.message });
  }
};
