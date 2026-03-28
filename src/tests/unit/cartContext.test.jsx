import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CartProvider } from './contexts/CartContext'
import { useCart } from './hooks/useCart'

// Componente auxiliar para exponer el carrito en los tests
function CartTestConsumer({ product }) {
  const { items, itemCount, total, addItem, removeItem, changeQty, clearCart } = useCart()

  return (
    <div>
      <span data-testid="item-count">{itemCount}</span>
      <span data-testid="total">{total.toFixed(2)}</span>
      <ul>
        {items.map((item) => (
          <li key={item.id} data-testid={`item-${item.id}`}>
            {item.title} — qty: {item.quantity}
          </li>
        ))}
      </ul>

      <button onClick={() => addItem(product)}       data-testid="add-btn">Agregar</button>
      <button onClick={() => removeItem(product.id)} data-testid="remove-btn">Eliminar</button>
      <button onClick={() => changeQty(product.id, 5)} data-testid="qty-btn">Cambiar a 5</button>
      <button onClick={clearCart}                    data-testid="clear-btn">Vaciar</button>
    </div>
  )
}

const mockProduct = { id: 1, title: 'Test Product', price: 10, thumbnail: '' }

function renderWithCart(product = mockProduct) {
  return render(
    <CartProvider>
      <CartTestConsumer product={product} />
    </CartProvider>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
describe('CartContext', () => {
  it('inicia con carrito vacío', () => {
    renderWithCart()
    expect(screen.getByTestId('item-count').textContent).toBe('0')
    expect(screen.getByTestId('total').textContent).toBe('0.00')
  })

  it('agrega un producto correctamente', () => {
    renderWithCart()
    fireEvent.click(screen.getByTestId('add-btn'))

    expect(screen.getByTestId('item-count').textContent).toBe('1')
    expect(screen.getByTestId('item-1')).toBeInTheDocument()
  })

  it('incrementa la cantidad al agregar el mismo producto dos veces', () => {
    renderWithCart()
    fireEvent.click(screen.getByTestId('add-btn'))
    fireEvent.click(screen.getByTestId('add-btn'))

    expect(screen.getByTestId('item-count').textContent).toBe('2')
    expect(screen.getByTestId('item-1').textContent).toContain('qty: 2')
  })

  it('calcula el total correctamente', () => {
    renderWithCart() // precio 10
    fireEvent.click(screen.getByTestId('add-btn'))
    fireEvent.click(screen.getByTestId('add-btn'))

    // 10 * 2 = 20.00
    expect(screen.getByTestId('total').textContent).toBe('20.00')
  })

  it('elimina un producto del carrito', () => {
    renderWithCart()
    fireEvent.click(screen.getByTestId('add-btn'))
    fireEvent.click(screen.getByTestId('remove-btn'))

    expect(screen.getByTestId('item-count').textContent).toBe('0')
  })

  it('cambia la cantidad de un producto', () => {
    renderWithCart()
    fireEvent.click(screen.getByTestId('add-btn'))
    fireEvent.click(screen.getByTestId('qty-btn')) // cambia a 5

    expect(screen.getByTestId('item-count').textContent).toBe('5')
    expect(screen.getByTestId('total').textContent).toBe('50.00')
  })

  it('vacía el carrito correctamente', () => {
    renderWithCart()
    fireEvent.click(screen.getByTestId('add-btn'))
    fireEvent.click(screen.getByTestId('add-btn'))
    fireEvent.click(screen.getByTestId('clear-btn'))

    expect(screen.getByTestId('item-count').textContent).toBe('0')
    expect(screen.queryByTestId('item-1')).not.toBeInTheDocument()
  })

  it('persiste el carrito en localStorage al agregar productos', () => {
    renderWithCart()
    fireEvent.click(screen.getByTestId('add-btn'))

    const stored = JSON.parse(localStorage.getItem('nova_cart'))
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe(1)
  })
})
