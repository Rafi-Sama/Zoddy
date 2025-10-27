import { GoogleGenerativeAI } from '@google/generative-ai';
import logger from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';
import { OrderItem } from '../types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export class AIService {
  /**
   * Extract order data from messy text input
   */
  static async extractOrderFromText(messyText: string): Promise<{
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    items: OrderItem[];
    totalAmount?: number;
    notes?: string;
  }> {
    // Validate input
    if (!messyText || messyText.trim().length === 0) {
      throw new ApiError('Text input cannot be empty', 400);
    }

    if (messyText.length > 10000) {
      throw new ApiError('Text input too large (max 10000 characters)', 400);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are an AI assistant for a Bangladesh-based e-commerce business. Extract order information from the following messy text and return it in a structured JSON format.

The text may contain:
- Customer name, phone number (Bangladesh format: +880 or 01X-XXXX-XXXX), and address
- Product/item names with quantities and prices
- Total amount in BDT (Bangladeshi Taka)
- Any additional notes or special instructions

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "customerName": "string or null",
  "customerPhone": "string or null",
  "customerAddress": "string or null",
  "items": [
    {
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "totalAmount": number or null,
  "notes": "string or null"
}

Messy text:
${messyText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response (remove markdown code blocks if present)
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.error('Could not extract JSON from AI response:', text);
        throw new Error('Could not extract JSON from AI response');
      }

      let extractedData;
      try {
        extractedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (parseError) {
        logger.error('Failed to parse JSON from AI response:', parseError);
        throw new Error('Failed to parse AI response as valid JSON');
      }

      // Validate extracted data structure
      if (!extractedData || typeof extractedData !== 'object') {
        throw new Error('Invalid data structure from AI response');
      }

      // Ensure items array exists
      if (!Array.isArray(extractedData.items)) {
        extractedData.items = [];
      }

      logger.info('Successfully extracted order data from text');
      return extractedData;
    } catch (error) {
      logger.error('Error extracting order from text:', error);
      throw new ApiError('Failed to process order text with AI', 500);
    }
  }

  /**
   * Extract order data from image using OCR
   */
  static async extractOrderFromImage(imageBase64: string, mimeType: string): Promise<{
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    items: OrderItem[];
    totalAmount?: number;
    notes?: string;
  }> {
    // Validate input
    if (!imageBase64 || imageBase64.trim().length === 0) {
      throw new ApiError('Image data cannot be empty', 400);
    }

    const validMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validMimeTypes.includes(mimeType.toLowerCase())) {
      throw new ApiError(`Invalid image type. Supported: ${validMimeTypes.join(', ')}`, 400);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

      const prompt = `You are an AI assistant for a Bangladesh-based e-commerce business. Analyze this image and extract order information.

Look for:
- Customer name, phone number (Bangladesh format: +880 or 01X-XXXX-XXXX), and address
- Product/item names with quantities and prices
- Total amount in BDT (Bangladeshi Taka)
- Any additional notes or special instructions

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "customerName": "string or null",
  "customerPhone": "string or null",
  "customerAddress": "string or null",
  "items": [
    {
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "totalAmount": number or null,
  "notes": "string or null"
}`;

      const imageParts = [
        {
          inlineData: {
            data: imageBase64,
            mimeType,
          },
        },
      ];

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.error('Could not extract JSON from AI image response:', text);
        throw new Error('Could not extract JSON from AI response');
      }

      let extractedData;
      try {
        extractedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (parseError) {
        logger.error('Failed to parse JSON from AI image response:', parseError);
        throw new Error('Failed to parse AI response as valid JSON');
      }

      // Validate extracted data structure
      if (!extractedData || typeof extractedData !== 'object') {
        throw new Error('Invalid data structure from AI response');
      }

      // Ensure items array exists
      if (!Array.isArray(extractedData.items)) {
        extractedData.items = [];
      }

      logger.info('Successfully extracted order data from image');
      return extractedData;
    } catch (error) {
      logger.error('Error extracting order from image:', error);
      throw new ApiError('Failed to process order image with AI', 500);
    }
  }

  /**
   * Parse XML order data
   */
  static async parseXMLOrder(xmlString: string): Promise<{
    customerName?: string;
    customerPhone?: string;
    customerAddress?: string;
    items: OrderItem[];
    totalAmount?: number;
    notes?: string;
  }> {
    // Validate input
    if (!xmlString || xmlString.trim().length === 0) {
      throw new ApiError('XML data cannot be empty', 400);
    }

    if (xmlString.length > 50000) {
      throw new ApiError('XML file too large (max 50KB)', 400);
    }

    // Basic XML validation
    if (!xmlString.trim().startsWith('<')) {
      throw new ApiError('Invalid XML format', 400);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are an AI assistant for a Bangladesh-based e-commerce business. Parse this XML data and extract order information.

Return ONLY a valid JSON object with this exact structure (no additional text):
{
  "customerName": "string or null",
  "customerPhone": "string or null",
  "customerAddress": "string or null",
  "items": [
    {
      "name": "string",
      "quantity": number,
      "price": number
    }
  ],
  "totalAmount": number or null,
  "notes": "string or null"
}

XML Data:
${xmlString}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON from the response
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        logger.error('Could not extract JSON from AI XML response:', text);
        throw new Error('Could not extract JSON from AI response');
      }

      let extractedData;
      try {
        extractedData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (parseError) {
        logger.error('Failed to parse JSON from AI XML response:', parseError);
        throw new Error('Failed to parse AI response as valid JSON');
      }

      // Validate extracted data structure
      if (!extractedData || typeof extractedData !== 'object') {
        throw new Error('Invalid data structure from AI response');
      }

      // Ensure items array exists
      if (!Array.isArray(extractedData.items)) {
        extractedData.items = [];
      }

      logger.info('Successfully parsed XML order data');
      return extractedData;
    } catch (error) {
      logger.error('Error parsing XML order:', error);
      throw new ApiError('Failed to parse XML with AI', 500);
    }
  }

  /**
   * Generate business insights from data
   */
  static async generateInsights(analyticsData: any): Promise<string[]> {
    // Validate input
    if (!analyticsData || typeof analyticsData !== 'object') {
      throw new ApiError('Analytics data must be a valid object', 400);
    }

    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `You are a business analyst for a Bangladesh-based e-commerce business. Analyze the following data and provide 3-5 actionable insights.

Analytics Data:
${JSON.stringify(analyticsData, null, 2)}

Provide insights as a JSON array of strings. Each insight should be concise (1-2 sentences) and actionable.
Return ONLY a valid JSON array (no additional text):
["insight 1", "insight 2", "insight 3", ...]`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Extract JSON array from the response
      const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        logger.error('Could not extract JSON array from AI insights response:', text);
        throw new Error('Could not extract JSON from AI response');
      }

      let insights;
      try {
        insights = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } catch (parseError) {
        logger.error('Failed to parse JSON from AI insights response:', parseError);
        throw new Error('Failed to parse AI response as valid JSON');
      }

      // Validate insights is an array
      if (!Array.isArray(insights)) {
        throw new Error('AI response must be an array of insights');
      }

      // Filter out non-string elements and limit to 10 insights max
      const validInsights = insights
        .filter(insight => typeof insight === 'string' && insight.trim().length > 0)
        .slice(0, 10);

      logger.info('Successfully generated business insights');
      return validInsights;
    } catch (error) {
      logger.error('Error generating insights:', error);
      throw new ApiError('Failed to generate insights with AI', 500);
    }
  }
}
