import { clsx } from 'clsx'

export default function Input({ label, error, className, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-aura-muted tracking-wide uppercase">{label}</label>}
      <input
        className={clsx(
          'bg-aura-card border border-aura-border rounded-md px-3.5 py-2.5',
          'text-sm text-aura-text placeholder:text-aura-faint font-body',
          'transition-all duration-150 outline-none',
          'focus:border-aura-accent focus:ring-1 focus:ring-aura-accent/30',
          'hover:border-aura-faint',
          error && 'border-aura-error focus:border-aura-error focus:ring-aura-error/30',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-aura-error">{error}</p>}
    </div>
  )
}
