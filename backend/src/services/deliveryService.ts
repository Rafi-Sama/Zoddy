import axios, { AxiosInstance } from 'axios';
import logger from '../utils/logger';
import { ApiError } from '../middleware/errorHandler';
import { DeliveryBooking } from '../types';

/**
 * Base Delivery Provider Interface
 */
interface DeliveryProvider {
  bookDelivery(bookingData: Partial<DeliveryBooking>): Promise<DeliveryBooking>;
  trackDelivery(trackingId: string): Promise<any>;
  cancelDelivery(trackingId: string): Promise<boolean>;
}

/**
 * eCourier Service (Bangladesh)
 * API Docs: https://backoffice.ecourier.com.bd/api-documentation
 */
class ECourierService implements DeliveryProvider {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.ECOURIER_API_URL || 'https://backoffice.ecourier.com.bd/api',
      headers: {
        'API-KEY': process.env.ECOURIER_API_KEY,
        'API-SECRET': process.env.ECOURIER_SECRET,
        'USER-ID': process.env.ECOURIER_USER_ID,
      },
      timeout: 30000, // 30 seconds
    });
  }

  async bookDelivery(bookingData: Partial<DeliveryBooking>): Promise<DeliveryBooking> {
    try {
      const response = await this.client.post('/parcel', {
        recipient_name: bookingData.recipient_name,
        recipient_mobile: bookingData.recipient_phone,
        recipient_address: bookingData.delivery_address,
        package_code: 'GENERAL',
        product_price: bookingData.package_value,
        payment_method: 'COD',
        number_of_item: 1,
        actual_product_price: bookingData.package_value,
        parcel_type: 'Regular',
      });

      logger.info('eCourier booking successful:', response.data);

      return {
        ...bookingData,
        provider: 'ecourier',
        tracking_id: response.data.tracking_code || response.data.parcel_id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as DeliveryBooking;
    } catch (error) {
      logger.error('eCourier booking failed:', error);
      throw new ApiError('Failed to book eCourier delivery', 500);
    }
  }

  async trackDelivery(trackingId: string): Promise<any> {
    try {
      const response = await this.client.get(`/parcel-tracking`, {
        params: { parcel_id: trackingId },
      });

      return response.data;
    } catch (error) {
      logger.error('eCourier tracking failed:', error);
      throw new ApiError('Failed to track eCourier delivery', 500);
    }
  }

  async cancelDelivery(trackingId: string): Promise<boolean> {
    try {
      const response = await this.client.post(`/cancel-parcel`, {
        parcel_id: trackingId,
      });

      return response.data.success || false;
    } catch (error) {
      logger.error('eCourier cancellation failed:', error);
      throw new ApiError('Failed to cancel eCourier delivery', 500);
    }
  }
}

/**
 * RedX Service (Bangladesh)
 * API Docs: https://redx.com.bd/developers
 */
class RedXService implements DeliveryProvider {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.REDX_API_URL || 'https://api.redx.com.bd/v1',
      headers: {
        'API-ACCESS-TOKEN': process.env.REDX_API_KEY,
      },
      timeout: 30000, // 30 seconds
    });
  }

  async bookDelivery(bookingData: Partial<DeliveryBooking>): Promise<DeliveryBooking> {
    try {
      const response = await this.client.post('/parcel', {
        customer_name: bookingData.recipient_name,
        customer_phone: bookingData.recipient_phone,
        delivery_address: bookingData.delivery_address,
        parcel_weight: 0.5, // Default 0.5 kg
        cash_collection_amount: bookingData.package_value,
        merchant_invoice_id: bookingData.order_id,
      });

      logger.info('RedX booking successful:', response.data);

      return {
        ...bookingData,
        provider: 'redx',
        tracking_id: response.data.data?.tracking_id || response.data.tracking_id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as DeliveryBooking;
    } catch (error) {
      logger.error('RedX booking failed:', error);
      throw new ApiError('Failed to book RedX delivery', 500);
    }
  }

  async trackDelivery(trackingId: string): Promise<any> {
    try {
      const response = await this.client.get(`/parcel/track/${trackingId}`);
      return response.data;
    } catch (error) {
      logger.error('RedX tracking failed:', error);
      throw new ApiError('Failed to track RedX delivery', 500);
    }
  }

  async cancelDelivery(trackingId: string): Promise<boolean> {
    try {
      const response = await this.client.put(`/parcel/cancel/${trackingId}`);
      return response.data.success || false;
    } catch (error) {
      logger.error('RedX cancellation failed:', error);
      throw new ApiError('Failed to cancel RedX delivery', 500);
    }
  }
}

/**
 * Pathao Service (Bangladesh)
 * API Docs: https://merchant.pathao.com/api-docs
 */
class PathaoService implements DeliveryProvider {
  private client: AxiosInstance;
  private accessToken: string | null = null;
  private tokenExpiry: number = 0;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.PATHAO_API_URL || 'https://api-hermes.pathao.com/api/v1',
      timeout: 30000, // 30 seconds
    });
  }

  private async getAccessToken(): Promise<string> {
    // Check if token exists and is not expired (with 5 minute buffer)
    const now = Date.now();
    if (this.accessToken && this.tokenExpiry > now + 300000) {
      return this.accessToken;
    }

    try {
      const response = await this.client.post('/issue-token', {
        client_id: process.env.PATHAO_CLIENT_ID,
        client_secret: process.env.PATHAO_CLIENT_SECRET,
        username: process.env.PATHAO_USERNAME,
        password: process.env.PATHAO_PASSWORD,
        grant_type: 'password',
      });

      this.accessToken = response.data.access_token;
      if (!this.accessToken) {
        throw new ApiError('Failed to get access token from Pathao', 500);
      }

      // Set token expiry (default 1 hour if not provided by API)
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = now + (expiresIn * 1000);

      logger.info('Pathao access token refreshed successfully');
      return this.accessToken;
    } catch (error) {
      logger.error('Pathao authentication failed:', error);
      // Reset token on failure
      this.accessToken = null;
      this.tokenExpiry = 0;
      throw new ApiError('Failed to authenticate with Pathao', 500);
    }
  }

  async bookDelivery(bookingData: Partial<DeliveryBooking>): Promise<DeliveryBooking> {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.post(
        '/orders',
        {
          store_id: 1, // Your Pathao store ID
          merchant_order_id: bookingData.order_id,
          recipient_name: bookingData.recipient_name,
          recipient_phone: bookingData.recipient_phone,
          recipient_address: bookingData.delivery_address,
          recipient_city: 1, // Dhaka city ID
          recipient_zone: 1, // Zone ID
          delivery_type: 48, // Normal delivery
          item_type: 2, // Parcel
          item_weight: 0.5,
          amount_to_collect: bookingData.package_value,
          item_description: bookingData.package_description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      logger.info('Pathao booking successful:', response.data);

      return {
        ...bookingData,
        provider: 'pathao',
        tracking_id: response.data.data?.consignment_id || response.data.order_id,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as DeliveryBooking;
    } catch (error) {
      logger.error('Pathao booking failed:', error);
      throw new ApiError('Failed to book Pathao delivery', 500);
    }
  }

  async trackDelivery(trackingId: string): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.get(`/orders/${trackingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error) {
      logger.error('Pathao tracking failed:', error);
      throw new ApiError('Failed to track Pathao delivery', 500);
    }
  }

  async cancelDelivery(trackingId: string): Promise<boolean> {
    try {
      const token = await this.getAccessToken();

      const response = await this.client.put(
        `/orders/${trackingId}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data.success || false;
    } catch (error) {
      logger.error('Pathao cancellation failed:', error);
      throw new ApiError('Failed to cancel Pathao delivery', 500);
    }
  }
}

/**
 * Main Delivery Service - Factory Pattern
 */
export class DeliveryService {
  private static providers: Map<string, DeliveryProvider> = new Map<string, DeliveryProvider>([
    ['ecourier', new ECourierService()],
    ['redx', new RedXService()],
    ['pathao', new PathaoService()],
  ]);

  static async bookDelivery(
    provider: 'ecourier' | 'redx' | 'pathao',
    bookingData: Partial<DeliveryBooking>
  ): Promise<DeliveryBooking> {
    // Validate delivery integration is enabled
    if (process.env.ENABLE_DELIVERY_INTEGRATION !== 'true') {
      throw new ApiError('Delivery integration is currently disabled', 503);
    }

    const deliveryProvider = this.providers.get(provider);

    if (!deliveryProvider) {
      throw new ApiError(`Delivery provider ${provider} not supported`, 400);
    }

    // Validate required booking data
    if (!bookingData.recipient_name || bookingData.recipient_name.trim().length === 0) {
      throw new ApiError('Recipient name is required', 400);
    }

    if (!bookingData.recipient_phone || bookingData.recipient_phone.trim().length === 0) {
      throw new ApiError('Recipient phone is required', 400);
    }

    if (!bookingData.delivery_address || bookingData.delivery_address.trim().length === 0) {
      throw new ApiError('Delivery address is required', 400);
    }

    if (!bookingData.order_id || bookingData.order_id.trim().length === 0) {
      throw new ApiError('Order ID is required', 400);
    }

    if (!bookingData.package_value || bookingData.package_value <= 0) {
      throw new ApiError('Package value must be greater than 0', 400);
    }

    return deliveryProvider.bookDelivery(bookingData);
  }

  static async trackDelivery(provider: 'ecourier' | 'redx' | 'pathao', trackingId: string): Promise<any> {
    const deliveryProvider = this.providers.get(provider);

    if (!deliveryProvider) {
      throw new ApiError(`Delivery provider ${provider} not supported`, 400);
    }

    // Validate tracking ID
    if (!trackingId || trackingId.trim().length === 0) {
      throw new ApiError('Tracking ID is required', 400);
    }

    return deliveryProvider.trackDelivery(trackingId);
  }

  static async cancelDelivery(provider: 'ecourier' | 'redx' | 'pathao', trackingId: string): Promise<boolean> {
    const deliveryProvider = this.providers.get(provider);

    if (!deliveryProvider) {
      throw new ApiError(`Delivery provider ${provider} not supported`, 400);
    }

    // Validate tracking ID
    if (!trackingId || trackingId.trim().length === 0) {
      throw new ApiError('Tracking ID is required', 400);
    }

    return deliveryProvider.cancelDelivery(trackingId);
  }

  static getSupportedProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
