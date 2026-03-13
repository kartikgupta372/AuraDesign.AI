// src/routes/heatmap.routes.js
// Heatmap survey + prediction API

const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const heatmap = require('../tools/heatmap.tool');
const pool = require('../db/pool');

// POST /heatmap/survey — submit a completed gaze session from frontend
// Body: { siteUrl, pageKey, pageUrl, participantId, deviceWidth, deviceHeight, webcamUsed, events: [{x, y, t}] }
router.post('/survey', async (req, res) => {
  try {
    const { siteUrl, pageKey, pageUrl, participantId, deviceWidth, deviceHeight, webcamUsed, events } = req.body;

    if (!siteUrl || !pageKey || !events?.length) {
      return res.status(400).json({ success: false, error: 'siteUrl, pageKey, and events are required' });
    }

    const userId = req.user?.id ?? null; // optional if logged in
    const result = await heatmap.saveGazeSession({
      siteUrl, pageKey, pageUrl, userId,
      participantId, deviceWidth, deviceHeight, webcamUsed, events,
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Survey save error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /heatmap/aggregate — manually trigger aggregation for a page
router.post('/aggregate', authMiddleware, async (req, res) => {
  try {
    const { siteUrl, pageKey } = req.body;
    const result = await heatmap.aggregateHeatmap(siteUrl, pageKey);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /heatmap/predict — generate AI-predicted heatmap
// Body: { siteUrl, pageKey, screenshotPath, domSummary }
router.post('/predict', authMiddleware, async (req, res) => {
  try {
    const { siteUrl, pageKey, screenshotPath, domSummary } = req.body;
    const result = await heatmap.predictHeatmap(siteUrl, pageKey, screenshotPath, domSummary);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /heatmap/:siteUrl/:pageKey — get heatmap data for a page
router.get('/:pageKey', authMiddleware, async (req, res) => {
  try {
    const siteUrl = req.query.siteUrl;
    const { pageKey } = req.params;
    const data = await heatmap.getHeatmap(siteUrl, pageKey);
    if (!data) return res.status(404).json({ success: false, error: 'No heatmap data yet' });
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /heatmap/sessions/:siteUrl — get session count per page for a site
router.get('/sessions/summary', authMiddleware, async (req, res) => {
  try {
    const { siteUrl } = req.query;
    const { rows } = await pool.query(
      `SELECT page_key, COUNT(*) as sessions, MAX(created_at) as last_session
       FROM gaze_sessions WHERE site_url=$1 AND completed=true GROUP BY page_key`,
      [siteUrl]
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
