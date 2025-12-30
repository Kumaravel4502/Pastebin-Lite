import express from 'express';
import { nanoid } from 'nanoid';
import Paste from '../models/Paste.js';
import { getNow } from '../utils/getNow.js';

const router = express.Router();

// Create paste - POST /api/pastes
router.post('/', async (req, res) => {
  try {
    const { content, ttl_seconds, max_views } = req.body;

    // Validation
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return res.status(400).json({ error: 'content is required and must be a non-empty string' });
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return res.status(400).json({ error: 'ttl_seconds must be an integer >= 1' });
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return res.status(400).json({ error: 'max_views must be an integer >= 1' });
      }
    }

    const id = nanoid(10);
    const now = new Date();

    const paste = new Paste({
      _id: id,
      content: content,
      createdAt: now,
      expiresAt: ttl_seconds ? new Date(now.getTime() + ttl_seconds * 1000) : null,
      maxViews: max_views || null,
      viewCount: 0
    });

    await paste.save();

    const baseUrl = process.env.PUBLIC_BASE_URL || `${req.protocol}://${req.get('host')}`;

    res.status(201).json({
      id: id,
      url: `${baseUrl}/api/paste/${id}`
    });
  } catch (error) {
    console.error('Create paste error:', error);
    res.status(500).json({ error: 'Failed to create paste' });
  }
});

// Get paste API - GET /api/pastes/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const now = getNow(req);

    // Atomic operation: find and update only if constraints are met
    const paste = await Paste.findOneAndUpdate(
      {
        _id: id,
        $and: [
          {
            $or: [
              { expiresAt: null },
              { expiresAt: { $gt: now } }
            ]
          },
          {
            $or: [
              { maxViews: null },
              {
                $expr: { $lt: ['$viewCount', '$maxViews'] }
              }
            ]
          }
        ]
      },
      { $inc: { viewCount: 1 } },
      { new: true }
    );

    if (!paste) {
      return res.status(404).json({ error: 'paste unavailable' });
    }

    const remainingViews = paste.maxViews !== null
      ? Math.max(paste.maxViews - paste.viewCount, 0)
      : null;

    res.json({
      content: paste.content,
      remaining_views: remainingViews,
      expires_at: paste.expiresAt ? paste.expiresAt.toISOString() : null
    });
  } catch (error) {
    console.error('Get paste error:', error);
    res.status(500).json({ error: 'internal server error' });
  }
});

export default router;
