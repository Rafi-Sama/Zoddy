import { Request, Response } from 'express';
import { ProductModel } from '../models/Product';
import { catchAsync, ApiError } from '../middleware/errorHandler';

export class ProductController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { data, total } = await ProductModel.findAll(req.userId!, req.organizationId, req.query);
    res.status(200).json({ success: true, data, metadata: { total } });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const product = await ProductModel.findById(req.params.id, req.userId!);

    if (!product) {
      throw new ApiError('Product not found', 404);
    }

    res.status(200).json({ success: true, data: product });
  });

  static getLowStock = catchAsync(async (req: Request, res: Response) => {
    const products = await ProductModel.getLowStockProducts(req.userId!, req.organizationId);
    res.status(200).json({ success: true, data: products });
  });

  static getStockMovements = catchAsync(async (req: Request, res: Response) => {
    const movements = await ProductModel.getStockMovements(req.params.id, req.userId!);
    res.status(200).json({ success: true, data: movements });
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    // Check if SKU already exists
    const existingProduct = await ProductModel.findBySKU(req.body.sku, req.userId!);
    if (existingProduct) {
      throw new ApiError('Product with this SKU already exists', 409);
    }

    const product = await ProductModel.create({
      ...req.body,
      user_id: req.userId,
      organization_id: req.organizationId
    });
    res.status(201).json({ success: true, data: product });
  });

  static update = catchAsync(async (req: Request, res: Response) => {
    const product = await ProductModel.update(req.params.id, req.userId!, req.body);
    res.status(200).json({ success: true, data: product });
  });

  static updateStock = catchAsync(async (req: Request, res: Response) => {
    const { quantity, type, reason } = req.body;
    const product = await ProductModel.updateStock(
      req.params.id,
      quantity,
      type,
      req.userId!,
      req.organizationId,
      reason
    );
    res.status(200).json({ success: true, data: product });
  });

  static delete = catchAsync(async (req: Request, res: Response) => {
    await ProductModel.delete(req.params.id, req.userId!);
    res.status(200).json({ success: true, message: 'Product deleted' });
  });
}
