// src/routes/onboarding.routes.js
const express = require('express')
const router  = express.Router()
const { supabase } = require('../db/pool')
const { authMiddleware } = require('../middleware/auth.middleware')
const scraper = require('../tools/scraper.tool')
const heatmapTool = require('../tools/heatmap.tool')

// ── POST /onboarding/submit ──────────────────────────────────────────────────
router.post('/submit', authMiddleware, async (req, res) => {
  const { intent, url, domain, other_info, run_heatmap } = req.body
  if (!url || !domain) {
    return res.status(400).json({ success: false, error: 'url and domain are required' })
  }

  const onboardingData = {
    intent,
    url: url.trim(),
    domain,
    other_info,
    submitted_at: new Date().toISOString(),
  }

  try {
    // Save onboarding data — this always succeeds fast
    const { error } = await supabase
      .from('users')
      .update({ onboarding_completed: true, onboarding_data: onboardingData })
      .eq('id', req.user.id)

    if (error) throw new Error(error.message)

    // Respond immediately — heatmap runs in background if requested
    res.json({ success: true, data: { onboarding_data: onboardingData, heatmap: null } })

    // Fire-and-forget heatmap setup (doesn't block the response)
    if (run_heatmap) {
      setImmediate(async () => {
        try {
          const pages = await scraper.scrapeWebsite(url.trim(), { maxPages: 1 })
          const homeKey = Object.keys(pages)[0]
          if (homeKey) {
            const pageData = pages[homeKey]
            await heatmapTool.predictHeatmap(
              url.trim(), homeKey,
              pageData.screenshot_url,
              pageData.dom_summary
            )
            console.log(`✅ Initial heatmap generated for ${url.trim()}`)
          }
        } catch (hmErr) {
          console.warn('⚠️  Initial heatmap failed (non-fatal):', hmErr.message)
        }
      })
    }
  } catch (err) {
    console.error('Onboarding submit error:', err.message)
    return res.status(500).json({ success: false, error: err.message })
  }
})

// ── GET /onboarding/status ───────────────────────────────────────────────────
router.get('/status', authMiddleware, async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('onboarding_completed, onboarding_data')
      .eq('id', req.user.id)
      .single()

    if (error) throw new Error(error.message)

    return res.json({
      success: true,
      data: {
        onboarding_completed: user.onboarding_completed ?? false,
        onboarding_data: user.onboarding_data ?? null,
      },
    })
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message })
  }
})

module.exports = router
