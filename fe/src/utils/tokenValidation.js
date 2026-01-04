/**
 * Browser-compatible JWT token validation utility
 * Decodes JWT token and checks expiration without requiring the secret
 */

/**
 * Decode JWT token payload (without verification)
 * @param {string} token - JWT token string
 * @returns {object|null} - Decoded payload or null if invalid
 */
function decodeJWT(token) {
  try {
    if (!token) return null
    
    // JWT format: header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    // Decode base64 payload (second part)
    const payload = parts[1]
    // Replace URL-safe base64 characters and add padding if needed
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4)
    
    // Decode and parse JSON
    const decoded = JSON.parse(atob(padded))
    return decoded
  } catch (error) {
    console.error('Error decoding JWT token:', error)
    return null
  }
}

/**
 * Check if access token is valid (exists and not expired)
 * @returns {object} - { success: boolean, data?: object, error?: string }
 */
export function checkAccessTokenValidity() {
  const accessToken = localStorage.getItem('accessToken')
  
  if (!accessToken) {
    return { success: false, error: 'No access token found' }
  }
  
  const decoded = decodeJWT(accessToken)
  
  if (!decoded) {
    return { success: false, error: 'Invalid token format' }
  }
  
  // Check if token has expiration claim
  if (decoded.exp) {
    const currentTime = Date.now() / 1000 // Convert to seconds
    if (decoded.exp <= currentTime) {
      return { success: false, error: 'Access token expired. Please login again.' }
    }
  }
  
  return { success: true, data: decoded }
}

