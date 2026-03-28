/**
 * Formatea un número como precio en USD.
 * Ejemplo: 29.99 → "$29.99"
 */
export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price)
}

/**
 * Trunca un texto largo y le pone "..." al final.
 */
export function truncateText(text, maxLength = 60) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '...'
}

/**
 * Genera las estrellas de rating como texto visual.
 * Ejemplo: 4.3 → "★★★★☆"
 */
export function formatRating(rating) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half

  return '★'.repeat(full) + (half ? '⯨' : '') + '☆'.repeat(empty)
}
