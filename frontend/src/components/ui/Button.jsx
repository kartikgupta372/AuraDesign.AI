import { clsx } from 'clsx'

const variants = {
  primary:  'bg-aura-accent hover:bg-aura-accent-dim text-white shadow-glow-sm hover:shadow-glow',
  ghost:    'bg-transparent hover:bg-aura-elevated text-aura-muted hover:text-aura-text border border-transparent hover:border-aura-border',
  outline:  'bg-transparent border border-aura-border hover:border-aura-accent text-aura-text hover:text-aura-accent',
  danger:   'bg-transparent hover:bg-red-500/10 text-aura-muted hover:text-aura-error border border-transparent',
}
const sizes = {
  sm: 'text-xs px-2.5 py-1.5 gap-1.5',
  md: 'text-sm px-3.5 py-2 gap-2',
  lg: 'text-sm px-5 py-2.5 gap-2',
}

export default function Button({ variant='primary', size='md', className, children, disabled, loading, icon, ...props }) {
  return (
    <button
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center font-body font-medium rounded-md transition-all duration-150 cursor-pointer select-none',
        'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',
        variants[variant], sizes[size], className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z"/>
        </svg>
      ) : icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </button>
  )
}
