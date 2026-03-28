import { describe, it, expect } from 'vitest'
import { formatPrice, truncateText, formatRating } from '@/utils/formatters'

describe('formatPrice', () => {
  it('formatea un precio en USD correctamente', () => {
    expect(formatPrice(29.99)).toBe('$29.99')
  })

  it('formatea números enteros con dos decimales', () => {
    expect(formatPrice(100)).toBe('$100.00')
  })

  it('formatea cero correctamente', () => {
    expect(formatPrice(0)).toBe('$0.00')
  })
})

describe('truncateText', () => {
  it('no trunca textos cortos', () => {
    expect(truncateText('Hola mundo', 20)).toBe('Hola mundo')
  })

  it('trunca textos largos y agrega puntos suspensivos', () => {
    const result = truncateText('Este es un texto muy largo que debe ser truncado', 20)
    expect(result.endsWith('...')).toBe(true)
    expect(result.length).toBeLessThanOrEqual(23) // 20 chars + '...'
  })

  it('usa 60 como límite por defecto', () => {
    const text   = 'a'.repeat(70)
    const result = truncateText(text)
    expect(result.endsWith('...')).toBe(true)
  })

  it('respeta exactamente el límite especificado', () => {
    const text   = 'a'.repeat(10)
    const result = truncateText(text, 10)
    expect(result).toBe(text) // igual, no trunca
  })
})

describe('formatRating', () => {
  it('devuelve 5 estrellas completas para rating 5', () => {
    expect(formatRating(5)).toBe('★★★★★')
  })

  it('devuelve 0 estrellas completas para rating 0', () => {
    expect(formatRating(0)).toBe('☆☆☆☆☆')
  })

  it('redondea hacia abajo correctamente', () => {
    // 3.4 → 3 estrellas completas
    const result = formatRating(3.4)
    expect(result.match(/★/g)?.length ?? 0).toBe(3)
  })
})
