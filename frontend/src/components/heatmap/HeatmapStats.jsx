import Badge from '../ui/Badge'
import Spinner from '../ui/Spinner'

export default function HeatmapStats({ data, isLoading }) {
  if (isLoading) return <div className="flex justify-center py-4"><Spinner /></div>
  if (!data) return (
    <p className="text-xs text-aura-faint text-center py-4">No data yet</p>
  )

  const confidence = data.confidence_level ?? (data.predicted ? 'none' : 'low')
  const confVariant = { high:'success', medium:'warn', low:'warn', none:'default' }[confidence] ?? 'default'

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-aura-muted">Confidence</span>
        <Badge variant={confVariant}>{confidence}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-aura-muted">Sessions</span>
        <span className="text-xs font-mono text-aura-text">{data.session_count ?? 0} / 20</span>
      </div>
      {data.above_fold_pct != null && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-aura-muted">Above fold</span>
          <span className="text-xs font-mono text-aura-text">{data.above_fold_pct}%</span>
        </div>
      )}
      {data.predicted && (
        <div className="mt-1 p-2 rounded-lg bg-yellow-500/5 border border-yellow-500/15">
          <p className="text-[10px] text-yellow-400 font-mono">AI predicted — no real survey data yet</p>
        </div>
      )}
      {(data.session_count ?? 0) > 0 && !data.predicted && (
        <div className="mt-1 p-2 rounded-lg bg-aura-accent/5 border border-aura-accent/15">
          <p className="text-[10px] text-aura-accent font-mono">
            First 3s = 4× weight · Real user data
          </p>
        </div>
      )}
      {/* Session progress to high confidence */}
      <div>
        <div className="flex justify-between text-[10px] text-aura-faint font-mono mb-1">
          <span>To high confidence</span>
          <span>{Math.min(data.session_count ?? 0, 20)}/20</span>
        </div>
        <div className="h-1 bg-aura-card rounded-full overflow-hidden">
          <div
            className="h-full bg-aura-accent rounded-full transition-all"
            style={{ width: `${Math.min(100, ((data.session_count ?? 0) / 20) * 100)}%` }}
          />
        </div>
      </div>
    </div>
  )
}
