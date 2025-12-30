import express from 'express';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        // Health check - storage is always available (in-memory)
        return res.json({ ok: true });
    } catch (error) {
        return res.status(503).json({ ok: false, error: error.message });
    }
});

export default router;

