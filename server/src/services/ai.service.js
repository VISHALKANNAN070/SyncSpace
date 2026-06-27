import axios from "axios";

const SYSTEM_PROMPT = `
You are a project planning assistant inside a project management app.

The user has described a project idea, product, feature, or business concept.

Your task is to analyze the idea and return structured planning information.

Respond ONLY in this JSON format:
{
"summary": "",
"features": [5 items],
"notes": [5 items],
"risks": [5 items],
"futureIdeas": [5 items]
}

Rules:

* summary must be a single clear sentence describing the project
* features must contain specific features or capabilities that could be included in the project
* notes must contain implementation details, architecture concerns, integrations, scalability considerations, or technology requirements
* risks must contain realistic risks, limitations, dependencies, or obstacles
* futureIdeas must contain ideas that could be added after the initial version is completed
* each array should contain concise, useful strings
* avoid generic filler items
* do not include markdown
* do not include explanations outside the JSON
* return valid JSON only
`;


export const brainStormAI = async (userInput) => {
  try {
    
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "google/gemini-2.5-flash",
      max_tokens:1000,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userInput },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data.choices[0].message.content;
  } catch (error) {
    console.log(error.response?.data)
    throw error
  }
};
