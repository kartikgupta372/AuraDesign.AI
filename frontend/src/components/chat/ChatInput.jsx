import { useRef, useState, useEffect } from 'react'
import { ArrowUp, Globe } from 'lucide-react'
import { clsx } from 'clsx'

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto'
      ref.current.style.height = Math.min(ref.current.scrollHeight, 160) + 'px'
    }
  }, [value])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const submit = () => {
    const text = value.trim()
    if (!text || disabled) return
    onSend(text)
    setValue('')
    if (ref.current) ref.current.style.height = 'auto'
  }

  const pasteUrl = async () => {
    try {
      const text = await navigator.clipboard.readText()
      if (text.startsWith('http')) setValue(text)
    } catch {}
  }

  return (
    <div className="px-4 pb-5 pt-3">
      <div className="max-w-2xl mx-auto">
        <div className={clsx(
          'flex flex-col rounded-2xl bg-aura-card border transition-all duration-150',
          disabled ? 'border-aura-line' : 'border-aura-border hover:border-aura-faint focus-within:border-aura-accent focus-within:shadow-glow-sm'
        )}>
          <textarea
            ref={ref}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask about a design, paste a URL to analyse, or describe what you want to improve…"
            rows={1}
            className="resize-none bg-transparent px-4 pt-3.5 pb-2 text-sm text-aura-text placeholder:text-aura-faint outline-none font-body leading-relaxed disabled:opacity-50 min-h-[52px]"
          />
          <div className="flex items-center justify-between px-3 pb-3">
            <button
              onClick={pasteUrl}
              className="flex items-center gap-1.5 text-xs text-aura-faint hover:text-aura-muted transition-colors px-2 py-1 rounded-md hover:bg-aura-elevated"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Paste URL</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-aura-faint font-mono">⏎ send · ⇧⏎ newline</span>
              <button
                onClick={submit}
                disabled={disabled || !value.trim()}
                className={clsx(
                  'w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-150',
                  value.trim() && !disabled
                    ? 'bg-aura-accent hover:bg-aura-accent-dim text-white shadow-glow-sm'
                    : 'bg-aura-elevated text-aura-faint cursor-not-allowed'
                )}
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-[10px] text-aura-faint mt-2 font-mono">
          Aura analyses design using Fitts's Law · Gestalt · F-Pattern · Visual Hierarchy
        </p>
      </div>
    </div>
  )
}
