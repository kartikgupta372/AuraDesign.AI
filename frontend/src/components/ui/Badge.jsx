import { clsx } from 'clsx'

const variants = {
  default: 'bg-aura-elevated text-aura-muted border-aura-border',
  accent:  'bg-aura-accent/10 text-aura-accent border-aura-accent/30',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warn:    'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error:   'bg-red-500/10 text-red-400 border-red-500/20',
}

export default function Badge({ variant = 'default', className, children }) {
  return (
    <span className={clsx(
      'inline-flex items-center gap-1 text-[10px] font-mono font-medium px-2 py-0.5 rounded border uppercase tracking-wider',
      variants[variant], className
    )}>
      {children}
    </span>
  )
}
