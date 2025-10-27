import { Request, Response } from 'express';
import { verifyWorkOSSession } from '../middleware/auth';
import { UserModel } from '../models/User';
import { ResponseHandler } from '../utils/response';
import { ApiError } from '../middleware/errorHandler';
import { HTTP_STATUS } from '../utils/constants';

export class AuthController {
  static async handleWorkOSCallback(req: Request, res: Response) {
    const { code } = req.body;

    if (!code) {
      throw new ApiError('Authorization code is required', HTTP_STATUS.BAD_REQUEST);
    }

    const { token, user } = await verifyWorkOSSession(code);

    return ResponseHandler.success(
      res,
      { token, user: { id: user.id, email: user.email, first_name: user.first_name, last_name: user.last_name } },
      'Authentication successful'
    );
  }

  static async refreshToken(_req: Request, _res: Response) {
    // TODO: Implement refresh token logic with Redis or database
    throw new ApiError('Refresh token not implemented', HTTP_STATUS.NOT_FOUND);
  }

  static async getCurrentUser(req: Request, res: Response) {
    const user = await UserModel.findById(req.userId!);

    if (!user) {
      throw new ApiError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    return ResponseHandler.success(res, user);
  }

  static async updateProfile(req: Request, res: Response) {
    const user = await UserModel.update(req.userId!, req.body);

    return ResponseHandler.success(res, user, 'Profile updated successfully');
  }

  static async logout(_req: Request, res: Response) {
    // Token is stateless - client should delete it
    // If implementing token blacklist, add logic here
    return ResponseHandler.success(res, null, 'Logged out successfully');
  }
}
