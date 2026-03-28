/**
 * Funciones puras para manipular el carrito.
 * Al ser funciones puras (sin efectos secundarios), son muy fáciles de testear.
 */

/**
 * Agrega un producto al carrito.
 * Si ya existe, incrementa su cantidad.
 */
export function addToCart(items, product) {
  const existing = items.find((item) => item.id === product.id)

  if (existing) {
    return items.map((item) =>
      item.id === product.id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    )
  }

  // Producto nuevo: lo agregamos con quantity 1
  return [...items, { ...product, quantity: 1 }]
}

/**
 * Elimina un producto del carrito por su id.
 */
export function removeFromCart(items, productId) {
  return items.filter((item) => item.id !== productId)
}

/**
 * Cambia la cantidad de un producto.
 * Si la cantidad llega a 0, lo elimina automáticamente.
 */
export function updateQuantity(items, productId, quantity) {
  if (quantity <= 0) {
    return removeFromCart(items, productId)
  }

  return items.map((item) =>
    item.id === productId ? { ...item, quantity } : item
  )
}

/**
 * Calcula el precio total del carrito.
 */
export function calculateTotal(items) {
  return items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)
}

/**
 * Cuenta el total de productos en el carrito (suma de cantidades).
 */
export function countItems(items) {
  return items.reduce((count, item) => count + item.quantity, 0)
}
