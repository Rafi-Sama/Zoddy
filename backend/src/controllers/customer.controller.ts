import { Request, Response } from 'express';
import { CustomerModel } from '../models/Customer';
import { catchAsync, ApiError } from '../middleware/errorHandler';

export class CustomerController {
  static getAll = catchAsync(async (req: Request, res: Response) => {
    const { data, total } = await CustomerModel.findAll(req.userId!, req.organizationId, req.query);

    res.status(200).json({
      success: true,
      data,
      metadata: { total, page: parseInt(req.query.page as string) || 1 },
    });
  });

  static getById = catchAsync(async (req: Request, res: Response) => {
    const customer = await CustomerModel.findById(req.params.id, req.userId!);

    if (!customer) {
      throw new ApiError('Customer not found', 404);
    }

    res.status(200).json({ success: true, data: customer });
  });

  static create = catchAsync(async (req: Request, res: Response) => {
    // Check if customer with same phone already exists
    const existingCustomer = await CustomerModel.findByPhone(req.body.phone, req.userId!);
    if (existingCustomer) {
      throw new ApiError('Customer with this phone number already exists', 409);
    }

    const customer = await CustomerModel.create({
      ...req.body,
      user_id: req.userId,
      organization_id: req.organizationId,
    });
    res.status(201).json({ success: true, data: customer });
  });

  static update = catchAsync(async (req: Request, res: Response) => {
    const customer = await CustomerModel.update(req.params.id, req.userId!, req.body);
    res.status(200).json({ success: true, data: customer });
  });

  static delete = catchAsync(async (req: Request, res: Response) => {
    await CustomerModel.delete(req.params.id, req.userId!);
    res.status(200).json({ success: true, message: 'Customer deleted' });
  });
}
