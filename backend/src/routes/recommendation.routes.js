// src/routes/recommendation.routes.js
// Personalized recommendation + page ranking API

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const rec = require('../tools/recommendation.tool');

// POST /recommendations/track — track a user interaction
// Body: { siteUrl, pageKey, actionType, actionData }
router.post('/track', authMiddleware, async (req, res) => {
  try {
    const { siteUrl, pageKey, actionType, actionData } = req.body;
    await rec.trackInteraction(req.user.id, req.body.sessionId, { siteUrl, pageKey, actionType, actionData });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /recommendations/pages — get ranked pages for current user
// Query: ?siteType=ecommerce&limit=10
router.get('/pages', authMiddleware, async (req, res) => {
  try {
    const { siteType, limit } = req.query;
    const pages = await rec.getRankedPages(req.user.id, siteType ?? null, parseInt(limit ?? 10));
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /recommendations/profile — get user's learned preference profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const profile = await rec.getUserProfile(req.user.id);
    res.json({ success: true, data: profile });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /recommendations/top-sites — top ranked sites globally
// Query: ?siteType=saas&limit=5
router.get('/top-sites', authMiddleware, async (req, res) => {
  try {
    const { siteType, limit } = req.query;
    const pages = await rec.getRankedPages(null, siteType ?? null, parseInt(limit ?? 5));
    res.json({ success: true, data: pages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
