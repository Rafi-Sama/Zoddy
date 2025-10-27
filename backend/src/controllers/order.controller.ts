import { Request, Response } from 'express';
import { OrderModel } from '../models/Order';
import { ApiResponse } from '../types';
import { catchAsync, ApiError } from '../middleware/errorHandler';

export class OrderController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { data, total } = await OrderModel.findAll(req.userId!, req.organizationId, req.query);

    const limit = Math.max(1, parseInt(req.query.limit as string) || 10);
    const page = Math.max(1, parseInt(req.query.page as string) || 1);

    const response: ApiResponse = {
      success: true,
      data,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    res.status(200).json(response);
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const order = await OrderModel.findById(req.params.id, req.userId!);

    if (!order) {
      throw new ApiError('Order not found', 404);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  });

  static getStats = catchAsync(async (req: Request, res: Response) => {
    const stats = await OrderModel.getOrderStats(
      req.userId!,
      req.organizationId,
      req.query.start_date as string,
      req.query.end_date as string
    );

    res.status(200).json({
      success: true,
      data: stats,
    });
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    const order = await OrderModel.create({
      ...req.body,
      user_id: req.userId,
      organization_id: req.organizationId,
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  });

  static update = catchAsync(async (req: Request, res: Response) => {
    const order = await OrderModel.update(req.params.id, req.userId!, req.body);

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      data: order,
    });
  });

  static delete = catchAsync(async (req: Request, res: Response) => {
    await OrderModel.delete(req.params.id, req.userId!);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully',
    });
  });
}
