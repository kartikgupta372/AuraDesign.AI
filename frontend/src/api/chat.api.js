import api from './axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3002'

export const chatApi = {
  createSession:  ()          => api.post('/chat/sessions'),
  listSessions:   ()          => api.get('/chat/sessions'),
  getSession:     (threadId)  => api.get(`/chat/sessions/${threadId}`),
  deleteSession:  (sessionId) => api.delete(`/chat/sessions/${sessionId}`),
  getResults:     (sessionId) => api.get(`/chat/sessions/${sessionId}/results`),
  getState:       (threadId)  => api.get(`/chat/sessions/${threadId}/state`),

  // SSE streaming — uses fetch() because EventSource only supports GET
  streamMessage: async (payload, handlers) => {
    const { onStage, onToken, onMessage, onDone, onError, onUserMessage } = handlers

    const res = await fetch(`${BASE}/chat/message`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Request failed' }))
      onError?.(err.error || 'Request failed')
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() // keep incomplete line

      let eventType = null
      for (const line of lines) {
        if (line.startsWith('event: ')) {
          eventType = line.slice(7).trim()
        } else if (line.startsWith('data: ') && eventType) {
          try {
            const data = JSON.parse(line.slice(6))
            switch (eventType) {
              case 'user_message':     onUserMessage?.(data); break
              case 'stage':           onStage?.(data);       break
              case 'token':           onToken?.(data.token); break
              case 'assistant_message': onMessage?.(data);   break
              case 'done':            onDone?.(data);        break
              case 'error':           onError?.(data.error); break
            }
          } catch {}
          eventType = null
        }
      }
    }
  },
}
