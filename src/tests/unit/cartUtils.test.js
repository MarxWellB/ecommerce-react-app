import { describe, it, expect } from 'vitest'
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  calculateTotal,
  countItems,
} from '@/utils/cartUtils'

// Producto de ejemplo reutilizable en los tests
const mockProduct = {
  id: 1,
  title: 'Test Product',
  price: 29.99,
  thumbnail: 'https://example.com/img.jpg',
}

const anotherProduct = {
  id: 2,
  title: 'Another Product',
  price: 49.99,
  thumbnail: 'https://example.com/img2.jpg',
}

// ─────────────────────────────────────────────────────────────────────────────
describe('addToCart', () => {
  it('agrega un producto nuevo al carrito con quantity 1', () => {
    const result = addToCart([], mockProduct)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ id: 1, quantity: 1 })
  })

  it('incrementa la cantidad si el producto ya existe', () => {
    const initial = [{ ...mockProduct, quantity: 2 }]
    const result  = addToCart(initial, mockProduct)

    expect(result).toHaveLength(1)
    expect(result[0].quantity).toBe(3)
  })

  it('no muta el array original', () => {
    const initial = [{ ...mockProduct, quantity: 1 }]
    addToCart(initial, anotherProduct)
    // El array original debe seguir igual
    expect(initial).toHaveLength(1)
  })

  it('puede tener múltiples productos diferentes', () => {
    const result = addToCart(
      [{ ...mockProduct, quantity: 1 }],
      anotherProduct
    )
    expect(result).toHaveLength(2)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('removeFromCart', () => {
  it('elimina el producto con el id correcto', () => {
    const items  = [
      { ...mockProduct,    quantity: 1 },
      { ...anotherProduct, quantity: 2 },
    ]
    const result = removeFromCart(items, 1)

    expect(result).toHaveLength(1)
    expect(result[0].id).toBe(2)
  })

  it('devuelve el mismo array si el id no existe', () => {
    const items  = [{ ...mockProduct, quantity: 1 }]
    const result = removeFromCart(items, 999)
    expect(result).toHaveLength(1)
  })

  it('devuelve array vacío si solo había un producto', () => {
    const items  = [{ ...mockProduct, quantity: 1 }]
    const result = removeFromCart(items, 1)
    expect(result).toHaveLength(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('updateQuantity', () => {
  it('actualiza la cantidad del producto correcto', () => {
    const items  = [{ ...mockProduct, quantity: 1 }]
    const result = updateQuantity(items, 1, 5)
    expect(result[0].quantity).toBe(5)
  })

  it('elimina el producto si la nueva cantidad es 0', () => {
    const items  = [{ ...mockProduct, quantity: 1 }]
    const result = updateQuantity(items, 1, 0)
    expect(result).toHaveLength(0)
  })

  it('elimina el producto si la cantidad es negativa', () => {
    const items  = [{ ...mockProduct, quantity: 2 }]
    const result = updateQuantity(items, 1, -1)
    expect(result).toHaveLength(0)
  })

  it('no afecta otros productos al actualizar uno', () => {
    const items = [
      { ...mockProduct,    quantity: 1 },
      { ...anotherProduct, quantity: 3 },
    ]
    const result = updateQuantity(items, 1, 10)
    const other  = result.find((i) => i.id === 2)
    expect(other.quantity).toBe(3)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('calculateTotal', () => {
  it('calcula correctamente con un producto', () => {
    const items = [{ ...mockProduct, quantity: 2 }] // 29.99 * 2 = 59.98
    expect(calculateTotal(items)).toBeCloseTo(59.98)
  })

  it('suma correctamente múltiples productos', () => {
    const items = [
      { ...mockProduct,    quantity: 1 }, // 29.99
      { ...anotherProduct, quantity: 2 }, // 49.99 * 2 = 99.98
    ]
    expect(calculateTotal(items)).toBeCloseTo(129.97)
  })

  it('devuelve 0 para carrito vacío', () => {
    expect(calculateTotal([])).toBe(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('countItems', () => {
  it('cuenta la suma de todas las cantidades', () => {
    const items = [
      { ...mockProduct,    quantity: 3 },
      { ...anotherProduct, quantity: 2 },
    ]
    expect(countItems(items)).toBe(5)
  })

  it('devuelve 0 para carrito vacío', () => {
    expect(countItems([])).toBe(0)
  })
})
