import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { catchAsync } from '../middleware/errorHandler';
import { AIController } from '../controllers/ai.controller';

const router = Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/xml' || file.mimetype === 'text/xml') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and XML files are allowed.'));
    }
  },
});

// All routes require authentication
router.use(authenticate);

// POST /api/v1/ai/extract-from-text - Extract order from messy text
router.post(
  '/extract-from-text',
  [body('text').trim().notEmpty().withMessage('Text is required')],
  validate,
  catchAsync(AIController.extractFromText)
);

// POST /api/v1/ai/extract-from-image - Extract order from image (OCR)
router.post('/extract-from-image', upload.single('image'), catchAsync(AIController.extractFromImage));

// POST /api/v1/ai/parse-xml - Parse XML order data
router.post('/parse-xml', upload.single('xml'), catchAsync(AIController.parseXML));

// POST /api/v1/ai/generate-insights - Generate business insights
router.post(
  '/generate-insights',
  [body('analyticsData').isObject().withMessage('Analytics data is required')],
  validate,
  catchAsync(AIController.generateInsights)
);

export default router;
