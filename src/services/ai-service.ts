import { GoogleGenAI } from "@google/genai";
import { APP_CONFIG } from "@/config/config";

/**
 * Service for interacting with Google's Gemini AI
 */
export const aiService = {
  /**
   * Instance of the Google GenAI client
   */
  _genAI: new GoogleGenAI({ apiKey: APP_CONFIG.GEMINI_API_KEY }),

  /**
   * Generate content from the Gemini AI model
   * @param content Text prompt to send to the model
   * @param model Model name to use (defaults to gemini-2.0-flash)
   * @returns The generated content
   */
  async generateContent(content: string, model: string = "gemini-2.0-flash") {
    const response = await this._genAI.models.generateContent({
      model,
      contents: content,
    });
    return response.text || "";
  },

  /**
   * Generate a streaming response from the Gemini AI model
   * @param content Text prompt to send to the model
   * @param model Model name to use (defaults to gemini-2.0-flash)
   * @returns A stream of content chunks
   */
  async generateContentStream(content: string, model: string = "gemini-2.0-flash") {
    const streamingResponse = await this._genAI.models.generateContentStream({
      model,
      contents: content,
    });
    
    return streamingResponse;
  },

  /**
   * Generate a short title based on a conversation starter
   * @param userMessage Initial user message to base the title on
   * @param model Model name to use (defaults to gemini-2.0-flash)
   * @returns A generated title
   */
  async generateChatTitle(userMessage: string, model: string = "gemini-2.0-flash") {
    // Create a prompt to generate a short title
    const prompt = `Generate a very short, concise title (3-5 words max) for a chat that starts with this message: "${userMessage}". 
    The title should capture the essence of what the conversation might be about. 
    Return ONLY the title text without quotes or any other text.`;
    
    // Generate the title using the model
    const response = await this._genAI.models.generateContent({
      model,
      contents: prompt
    });
    
    return response.text || "";
  }
};
