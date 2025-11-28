import { Router } from 'express';
import authRoutes from './authRoutes';
import studentRoutes from './studentRoutes';
import teacherRoutes from './teacherRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/students', studentRoutes);
router.use('/teachers', teacherRoutes);

// Health check
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'WeVersity API is running',
        timestamp: new Date().toISOString(),
    });
});

export default router;
