import { Request, Response } from 'express';
import { DeliveryService } from '../services/deliveryService';
import { catchAsync, ApiError } from '../middleware/errorHandler';

export class DeliveryController {
  static getProviders = catchAsync(async (_req: Request, res: Response) => {
    const providers = DeliveryService.getSupportedProviders();

    res.status(200).json({
      success: true,
      data: { providers },
    });
  });

  static bookDelivery = catchAsync(async (req: Request, res: Response) => {
    const { provider, ...bookingData } = req.body;

    if (!provider) {
      throw new ApiError('Delivery provider is required', 400);
    }

    const validProviders = ['ecourier', 'redx', 'pathao'];
    if (!validProviders.includes(provider)) {
      throw new ApiError(`Invalid delivery provider. Supported: ${validProviders.join(', ')}`, 400);
    }

    const booking = await DeliveryService.bookDelivery(provider, {
      ...bookingData,
      user_id: req.userId,
      organization_id: req.organizationId,
    });

    res.status(201).json({
      success: true,
      message: 'Delivery booked successfully',
      data: booking,
    });
  });

  static trackDelivery = catchAsync(async (req: Request, res: Response) => {
    const { provider, trackingId } = req.params;

    const validProviders = ['ecourier', 'redx', 'pathao'];
    if (!validProviders.includes(provider)) {
      throw new ApiError(`Invalid delivery provider. Supported: ${validProviders.join(', ')}`, 400);
    }

    const trackingData = await DeliveryService.trackDelivery(
      provider as 'ecourier' | 'redx' | 'pathao',
      trackingId
    );

    res.status(200).json({
      success: true,
      data: trackingData,
    });
  });

  static cancelDelivery = catchAsync(async (req: Request, res: Response) => {
    const { provider, tracking_id } = req.body;

    if (!provider || !tracking_id) {
      throw new ApiError('Provider and tracking ID are required', 400);
    }

    const validProviders = ['ecourier', 'redx', 'pathao'];
    if (!validProviders.includes(provider)) {
      throw new ApiError(`Invalid delivery provider. Supported: ${validProviders.join(', ')}`, 400);
    }

    const result = await DeliveryService.cancelDelivery(provider, tracking_id);

    res.status(200).json({
      success: true,
      message: result ? 'Delivery cancelled successfully' : 'Failed to cancel delivery',
    });
  });
}
