import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import orderRoutes from './order.routes';
import customerRoutes from './customer.routes';
import productRoutes from './product.routes';
import analyticsRoutes from './analytics.routes';
import aiRoutes from './ai.routes';
import deliveryRoutes from './delivery.routes';
import teamRoutes from './team.routes';

const router = Router();

// Health check routes (public)
router.use('/health', healthRoutes);

// API Routes
router.use('/auth', authRoutes);
router.use('/orders', orderRoutes);
router.use('/customers', customerRoutes);
router.use('/products', productRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/delivery', deliveryRoutes);
router.use('/team', teamRoutes);

export default router;
