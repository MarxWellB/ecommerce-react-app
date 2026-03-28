import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useProducts } from '@/hooks/useProducts'
import * as productsApi from '@/api/productsApi'

// Datos simulados que la API devolvería
const mockApiResponse = {
  products: [
    { id: 1, title: 'Product A', price: 10, thumbnail: '', rating: 4 },
    { id: 2, title: 'Product B', price: 20, thumbnail: '', rating: 3 },
  ],
  total: 100,
  skip: 0,
  limit: 12,
}

describe('useProducts', () => {
  beforeEach(() => {
    // Mockeamos fetchProducts para no hacer llamadas HTTP reales
    vi.spyOn(productsApi, 'fetchProducts').mockResolvedValue(mockApiResponse)
  })

  it('carga productos correctamente', async () => {
    const { result } = renderHook(() => useProducts())

    // Al inicio, isLoading debe ser true
    expect(result.current.isLoading).toBe(true)

    // Esperamos a que termine la carga
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.products).toHaveLength(2)
    expect(result.current.products[0].title).toBe('Product A')
  })

  it('hasMore es true si quedan más productos', async () => {
    const { result } = renderHook(() => useProducts())

    await waitFor(() => !result.current.isLoading)

    // total=100, cargamos 2 → hasMore debe ser true
    expect(result.current.hasMore).toBe(true)
  })

  it('hasMore es false cuando ya se cargaron todos los productos', async () => {
    vi.spyOn(productsApi, 'fetchProducts').mockResolvedValue({
      ...mockApiResponse,
      products: [{ id: 1, title: 'Solo este', price: 5, thumbnail: '', rating: 3 }],
      total: 1, // solo hay 1 en total
    })

    const { result } = renderHook(() => useProducts())

    await waitFor(() => !result.current.isLoading)
    expect(result.current.hasMore).toBe(false)
  })

  it('maneja errores de la API y expone el mensaje', async () => {
    vi.spyOn(productsApi, 'fetchProducts').mockRejectedValue(
      new Error('Error de red')
    )

    const { result } = renderHook(() => useProducts())

    await waitFor(() => {
      expect(result.current.error).toBe('Error de red')
    })

    expect(result.current.products).toHaveLength(0)
  })

  it('llama a fetchProducts con el search term correcto', async () => {
    const spy = vi.spyOn(productsApi, 'fetchProducts').mockResolvedValue(mockApiResponse)

    renderHook(() => useProducts('laptop'))

    await waitFor(() => {
      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'laptop' })
      )
    })
  })
})
