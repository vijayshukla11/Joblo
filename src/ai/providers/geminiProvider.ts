import { GoogleGenAI } from '@google/genai';
import { IAIProvider } from './baseProvider';
import { AIModelConfig } from '../types';

/**
 * Gemini AI Provider
 * Integrates with @google/genai SDK to generate text and JSON responses.
 */
export class GeminiProvider implements IAIProvider {
  private aiInstance: GoogleGenAI | null = null;
  private defaultModel = 'gemini-2.5-flash';

  constructor() {
    this.initSDK();
  }

  private initSDK() {
    try {
      // Check for available key in Vite env or standard process env
      const apiKey = 
        (import.meta.env?.VITE_GEMINI_API_KEY) || 
        (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

      if (apiKey && apiKey.trim() !== '') {
        // Set up the modern GoogleGenAI instance
        this.aiInstance = new GoogleGenAI({ 
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });
        console.log('[GeminiProvider] GoogleGenAI client initialized successfully.');
      } else {
        console.warn('[GeminiProvider] No API Key provided. Provider will run in MOCK fallback mode.');
      }
    } catch (error) {
      console.error('[GeminiProvider] Error during GoogleGenAI initialization:', error);
    }
  }

  public isAvailable(): boolean {
    return this.aiInstance !== null;
  }

  public async generateText(
    prompt: string,
    systemInstruction?: string,
    config?: Partial<AIModelConfig>
  ): Promise<string> {
    if (!this.aiInstance) {
      throw new Error('Gemini API key is missing or SDK failed to initialize. Cannot execute request.');
    }

    try {
      const model = config?.modelName || this.defaultModel;
      const response = await this.aiInstance.models.generateContent({
        model: model,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: config?.temperature ?? 0.3,
          maxOutputTokens: config?.maxOutputTokens ?? 4096,
        }
      });

      if (!response || !response.text) {
        throw new Error('Empty response received from Gemini.');
      }

      return response.text.trim();
    } catch (err: any) {
      console.error('[GeminiProvider] Text generation failed:', err);
      throw err;
    }
  }

  public async generateStructuredJSON<T>(
    prompt: string,
    systemInstruction?: string,
    config?: Partial<AIModelConfig>
  ): Promise<T> {
    if (!this.aiInstance) {
      throw new Error('Gemini API key is missing. Structured JSON generation unavailable.');
    }

    try {
      const model = config?.modelName || this.defaultModel;
      
      // Request JSON response schema / instructions in prompt
      const jsonPrompt = `${prompt}\n\nIMPORTANT: Return ONLY valid JSON matching the expected fields. Do not warp it in any markdown backticks.`;

      const response = await this.aiInstance.models.generateContent({
        model: model,
        contents: jsonPrompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: config?.temperature ?? 0.1, // low temperature for structured consistency
          maxOutputTokens: config?.maxOutputTokens ?? 4096,
          // Instruct model to output JSON
          responseMimeType: 'application/json'
        }
      });

      const responseText = response.text || '';
      const cleanJson = this.extractJSONString(responseText);
      
      return JSON.parse(cleanJson) as T;
    } catch (err: any) {
      console.error('[GeminiProvider] JSON generation failed, retrying content parsing:', err);
      throw err;
    }
  }

  /**
   * Helper to clean up Markdown-wrapped JSON response from AI model
   */
  private extractJSONString(text: string): string {
    let cleanText = text.trim();
    
    // Remove ```json wrapper if present
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.substring(7);
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.substring(3);
    }
    
    if (cleanText.endsWith('```')) {
      cleanText = cleanText.substring(0, cleanText.length - 3);
    }
    
    return cleanText.trim();
  }
}
