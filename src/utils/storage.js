/**
 * Helpers para localStorage.
 * Envolverlos en try/catch protege contra:
 * - Modo incógnito con localStorage deshabilitado
 * - Límite de almacenamiento excedido
 */

export function getItem(key) {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch {
    return null
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (error) {
    console.warn('No se pudo guardar en localStorage:', error)
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key)
  } catch {
    // Silencioso: no es crítico si falla
  }
}

// Claves centralizadas para evitar typos
export const STORAGE_KEYS = {
  CART: 'nova_cart',
  AUTH: 'nova_auth',
}
