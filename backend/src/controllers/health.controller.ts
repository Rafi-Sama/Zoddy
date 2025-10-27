import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/database';
import { ResponseHandler } from '../utils/response';
import { HTTP_STATUS } from '../utils/constants';
import os from 'os';

export class HealthController {
  /**
   * Basic health check
   */
  static async basic(_req: Request, res: Response) {
    return ResponseHandler.success(
      res,
      {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
      },
      'Zoddy Backend API is running'
    );
  }

  /**
   * Detailed health check with database connectivity
   */
  static async detailed(_req: Request, res: Response) {
    const startTime = Date.now();

    // Check database connectivity
    let databaseStatus = 'disconnected';
    let databaseLatency = 0;

    try {
      const dbStart = Date.now();
      const { error } = await supabaseAdmin.from('users').select('count').limit(1).single();
      databaseLatency = Date.now() - dbStart;

      if (!error || error.code === 'PGRST116') {
        // PGRST116 = no rows, but connection is fine
        databaseStatus = 'connected';
      }
    } catch (error) {
      databaseStatus = 'error';
    }

    const healthData = {
      status: databaseStatus === 'connected' ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '1.0.0',
      services: {
        database: {
          status: databaseStatus,
          latency: `${databaseLatency}ms`,
        },
        workos: {
          status: process.env.WORKOS_API_KEY ? 'configured' : 'not_configured',
        },
        gemini: {
          status: process.env.GEMINI_API_KEY && process.env.ENABLE_AI_PROCESSING === 'true'
            ? 'enabled'
            : 'disabled',
        },
        gmail: {
          status: process.env.GMAIL_CLIENT_ID && process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true'
            ? 'enabled'
            : 'disabled',
        },
        delivery: {
          status: process.env.ENABLE_DELIVERY_INTEGRATION === 'true' ? 'enabled' : 'disabled',
          providers: {
            ecourier: process.env.ECOURIER_API_KEY ? 'configured' : 'not_configured',
            redx: process.env.REDX_API_KEY ? 'configured' : 'not_configured',
            pathao: process.env.PATHAO_CLIENT_ID ? 'configured' : 'not_configured',
          },
        },
      },
      system: {
        platform: os.platform(),
        arch: os.arch(),
        nodeVersion: process.version,
        memory: {
          total: `${Math.round(os.totalmem() / 1024 / 1024)}MB`,
          free: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
          usage: `${Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100}MB`,
        },
        cpu: {
          cores: os.cpus().length,
          load: os.loadavg(),
        },
      },
      responseTime: `${Date.now() - startTime}ms`,
    };

    const statusCode = healthData.status === 'healthy' ? HTTP_STATUS.OK : HTTP_STATUS.SERVICE_UNAVAILABLE;

    return res.status(statusCode).json({
      success: healthData.status === 'healthy',
      data: healthData,
    });
  }

  /**
   * Readiness probe - checks if app is ready to serve traffic
   */
  static async readiness(_req: Request, res: Response) {
    try {
      // Check database connectivity
      const { error } = await supabaseAdmin.from('users').select('count').limit(1).single();

      if (error && error.code !== 'PGRST116') {
        throw new Error('Database not ready');
      }

      // Check required environment variables
      const requiredEnvVars = [
        'SUPABASE_URL',
        'SUPABASE_SERVICE_ROLE_KEY',
        'JWT_SECRET',
        'WORKOS_API_KEY',
      ];

      const missingVars = requiredEnvVars.filter((v) => !process.env[v]);

      if (missingVars.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
      }

      return res.status(HTTP_STATUS.OK).json({
        status: 'ready',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(HTTP_STATUS.SERVICE_UNAVAILABLE).json({
        status: 'not_ready',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Liveness probe - checks if app is alive
   */
  static async liveness(_req: Request, res: Response) {
    return res.status(HTTP_STATUS.OK).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}
