import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDebounce } from '@/hooks/useDebounce'

describe('useDebounce', () => {
  it('devuelve el valor inicial inmediatamente', () => {
    const { result } = renderHook(() => useDebounce('hello', 300))
    expect(result.current).toBe('hello')
  })

  it('no actualiza el valor hasta que pasa el delay', async () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'inicial' } }
    )

    // Cambiamos el valor
    rerender({ value: 'nuevo' })

    // Antes del delay, sigue siendo 'inicial'
    expect(result.current).toBe('inicial')

    // Avanzamos el timer
    act(() => vi.advanceTimersByTime(300))

    // Ahora se actualiza
    expect(result.current).toBe('nuevo')

    vi.useRealTimers()
  })

  it('cancela el timer anterior si el valor cambia antes del delay', async () => {
    vi.useFakeTimers()

    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 300),
      { initialProps: { value: 'a' } }
    )

    rerender({ value: 'ab' })
    act(() => vi.advanceTimersByTime(150)) // a mitad del delay

    rerender({ value: 'abc' })
    act(() => vi.advanceTimersByTime(300)) // delay completo desde 'abc'

    // Solo se aplica el último valor
    expect(result.current).toBe('abc')

    vi.useRealTimers()
  })
})
