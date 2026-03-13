import api from './axios'

export const heatmapApi = {
  submitSurvey: (data)                     => api.post('/heatmap/survey', data),
  predict:      (data)                     => api.post('/heatmap/predict', data),
  getHeatmap:   (pageKey, siteUrl)         => api.get(`/heatmap/${encodeURIComponent(pageKey)}`, { params: { siteUrl } }),
  getSessions:  (siteUrl)                  => api.get('/heatmap/sessions/summary', { params: { siteUrl } }),
}

export const recommendationsApi = {
  track:      (data)                 => api.post('/recommendations/track', data),
  getPages:   (params)               => api.get('/recommendations/pages', { params }),
  getProfile: ()                     => api.get('/recommendations/profile'),
  getTopSites:(params)               => api.get('/recommendations/top-sites', { params }),
}
