import { Request, Response } from 'express';
import { AIService } from '../services/aiService';
import { catchAsync, ApiError } from '../middleware/errorHandler';

export class AIController {
  static extractFromText = catchAsync(async (req: Request, res: Response) => {
    const { text } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      throw new ApiError('Text input is required', 400);
    }

    const extractedData = await AIService.extractOrderFromText(text);

    res.status(200).json({
      success: true,
      message: 'Order data extracted successfully',
      data: extractedData,
    });
  });

  static extractFromImage = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError('Image file is required', 400);
    }

    const imageBase64 = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;

    const extractedData = await AIService.extractOrderFromImage(imageBase64, mimeType);

    res.status(200).json({
      success: true,
      message: 'Order data extracted from image successfully',
      data: extractedData,
    });
  });

  static parseXML = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
      throw new ApiError('XML file is required', 400);
    }

    const xmlString = req.file.buffer.toString('utf8');

    const parsedData = await AIService.parseXMLOrder(xmlString);

    res.status(200).json({
      success: true,
      message: 'XML parsed successfully',
      data: parsedData,
    });
  });

  static generateInsights = catchAsync(async (req: Request, res: Response) => {
    const { analyticsData } = req.body;

    if (!analyticsData) {
      throw new ApiError('Analytics data is required', 400);
    }

    const insights = await AIService.generateInsights(analyticsData);

    res.status(200).json({
      success: true,
      message: 'Insights generated successfully',
      data: { insights },
    });
  });
}
