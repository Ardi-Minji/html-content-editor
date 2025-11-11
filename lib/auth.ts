export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const token = localStorage.getItem('authToken')
  return !!token
}

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  
  return localStorage.getItem('authToken')
}

export const logout = (): void => {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('authToken')
  window.location.href = '/login'
}

export const requireAuth = (): boolean => {
  const authenticated = isAuthenticated()
  
  if (!authenticated && typeof window !== 'undefined') {
    window.location.href = '/login'
    return false
  }
  
  return authenticated
}