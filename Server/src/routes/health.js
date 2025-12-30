import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        if (mongoose.connection.readyState === 1) {
            return res.json({ ok: true });
        }
        return res.status(503).json({ ok: false, error: 'Database not connected' });
    } catch (error) {
        return res.status(503).json({ ok: false, error: error.message });
    }
});

export default router;

