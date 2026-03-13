import api from './axios'

export const recommendationsApi = {
  track:    (data)              => api.post('/recommendations/track', data),
  getPages: (siteType, limit)   => api.get('/recommendations/pages', { params: { siteType, limit } }),
  getProfile: ()                => api.get('/recommendations/profile'),
  getTopSites: (siteType, limit)=> api.get('/recommendations/top-sites', { params: { siteType, limit } }),
}
