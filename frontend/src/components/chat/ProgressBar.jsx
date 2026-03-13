import { motion } from 'framer-motion'

const STAGE_LABELS = {
  scraping:           'Scraping pages',
  scraping_done:      'Pages scraped',
  fetching_benchmarks:'Fetching benchmarks',
  benchmarks_ready:   'Benchmarks loaded',
  analyzing_heatmaps: 'Loading heatmap data',
  predicting_heatmap: 'Predicting attention zones',
  heatmaps_loaded:    'Heatmap data ready',
  analyzing_pages:    'Analysing pages',
  cross_page_check:   'Cross-page consistency',
  enhancing_code:     'Enhancing code',
  done:               'Analysis complete',
}

export default function ProgressBar({ stage }) {
  if (!stage) return null
  const label = stage.message || STAGE_LABELS[stage.stage] || stage.stage
  const pct = Math.max(2, stage.progress || 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="shrink-0 px-4 pt-3 pb-0"
    >
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-aura-accent animate-pulse" />
            <span className="text-xs text-aura-muted font-mono">{label}</span>
            {stage.current_page && (
              <span className="text-xs text-aura-faint font-mono">— {stage.current_page}</span>
            )}
          </div>
          <span className="text-xs font-mono text-aura-faint">{pct}%</span>
        </div>
        <div className="h-0.5 bg-aura-line rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-aura-accent progress-glow rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
