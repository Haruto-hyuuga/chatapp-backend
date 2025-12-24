import { GoogleGenAI } from "@google/genai";
import { log, error } from "../utils/logger";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

async function generateConversation(prompt: string): Promise<string> {
  try {
    log("Promt given: " + prompt);
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });
    log("Gemini generateContent Output: ", { Geminiresponse: response });
    return response.text ?? "response-null";
  } catch (err) {
    error("Error getting response from Gemini:", err);
    return "Error generating response from Gemini";
  }
}
// (async () => {
//   const reply = await generateConversation("Hello there gemini fu");
//   console.log(reply);
// })();
