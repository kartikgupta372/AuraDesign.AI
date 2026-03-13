import { create } from 'zustand'

export const useUIStore = create((set) => ({
  activeFeature: 'chat',          // 'chat' | 'heatmap' | 'recommendations'
  sidebarCollapsed: false,

  setActiveFeature: (f) => set({ activeFeature: f }),
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),
}))
