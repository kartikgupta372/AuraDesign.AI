import { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, Eye, AlertCircle, RefreshCw } from 'lucide-react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { heatmapApi } from '../../api/heatmap.api'
import { useUIStore } from '../../store/uiStore'
import HeatmapGrid from './HeatmapGrid'
import HeatmapStats from './HeatmapStats'
import SurveyPanel from './SurveyPanel'
import Badge from '../ui/Badge'
import Button from '../ui/Button'
import Input from '../ui/Input'

export default function HeatmapView() {
  const [siteUrl, setSiteUrl] = useState('')
  const [pageKey, setPageKey] = useState('/')
  const [submittedUrl, setSubmittedUrl] = useState(null)
  const [showSurvey, setShowSurvey] = useState(false)

  const { data: heatmapData, isLoading, refetch } = useQuery({
    queryKey: ['heatmap', submittedUrl, pageKey],
    queryFn: async () => {
      const res = await heatmapApi.getHeatmap(pageKey, submittedUrl)
      return res.data.data
    },
    enabled: !!submittedUrl,
    retry: false,
  })

  const predictMutation = useMutation({
    mutationFn: () => heatmapApi.predict({ siteUrl: submittedUrl, pageKey }),
    onSuccess: () => refetch(),
  })

  const handleLoad = () => {
    if (!siteUrl.trim()) return
    setSubmittedUrl(siteUrl.trim())
  }

  return (
    <div className="flex h-full bg-aura-void overflow-hidden">
      {/* Left panel */}
      <div className="w-72 border-r border-aura-line bg-aura-surface flex flex-col shrink-0">
        <div className="p-4 border-b border-aura-line">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-aura-accent" />
            <h2 className="font-display font-semibold text-sm text-aura-text">Heatmap Studio</h2>
          </div>
          <div className="flex flex-col gap-2">
            <Input
              placeholder="https://yoursite.com"
              value={siteUrl}
              onChange={e => setSiteUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLoad()}
            />
            <Input
              placeholder="Page key (e.g. /)"
              value={pageKey}
              onChange={e => setPageKey(e.target.value)}
            />
            <Button onClick={handleLoad} size="sm" className="w-full">Load Heatmap</Button>
          </div>
        </div>

        {submittedUrl && (
          <div className="p-4 flex-1 overflow-y-auto">
            <HeatmapStats data={heatmapData} isLoading={isLoading} />

            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                icon={<Eye className="w-3.5 h-3.5" />}
                onClick={() => setShowSurvey(true)}
                className="w-full"
              >
                Run Survey
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={() => predictMutation.mutate()}
                loading={predictMutation.isPending}
                className="w-full"
              >
                AI Predict
              </Button>
            </div>
          </div>
        )}

        {!submittedUrl && (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <Activity className="w-8 h-8 text-aura-faint mx-auto mb-3" />
              <p className="text-xs text-aura-muted">Enter a site URL to view<br />eye-tracking heatmaps</p>
            </div>
          </div>
        )}
      </div>

      {/* Main heatmap view */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {submittedUrl && heatmapData ? (
          <HeatmapGrid data={heatmapData} siteUrl={submittedUrl} />
        ) : (
          <EmptyHeatmap loading={isLoading} hasUrl={!!submittedUrl} />
        )}
      </div>

      {/* Survey modal */}
      {showSurvey && (
        <SurveyPanel
          siteUrl={submittedUrl}
          pageKey={pageKey}
          onClose={() => { setShowSurvey(false); refetch() }}
        />
      )}
    </div>
  )
}

function EmptyHeatmap({ loading, hasUrl }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        {loading ? (
          <div className="flex gap-1.5 justify-center mb-3">
            {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-aura-accent typing-dot" style={{animationDelay:`${i*0.2}s`}} />)}
          </div>
        ) : (
          <div className="w-16 h-16 rounded-2xl bg-aura-card border border-aura-border flex items-center justify-center mx-auto mb-4">
            <Activity className="w-7 h-7 text-aura-faint" />
          </div>
        )}
        <p className="text-sm text-aura-muted">
          {loading ? 'Loading heatmap data…' : hasUrl ? 'No heatmap data yet. Run a survey or use AI Predict.' : 'Select a site to view heatmaps'}
        </p>
      </div>
    </div>
  )
}
