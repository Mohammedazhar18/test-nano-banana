
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async editImage(imageB64: string, prompt: string): Promise<string> {
    try {
      // Remove data URL prefix if present
      const cleanB64 = imageB64.includes(',') ? imageB64.split(',')[1] : imageB64;
      
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: cleanB64,
                mimeType: 'image/png',
              },
            },
            {
              text: prompt,
            },
          ],
        },
      });

      if (!response.candidates?.[0]?.content?.parts) {
        throw new Error('No image generated in response');
      }

      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }

      throw new Error('No image part found in the model response');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
