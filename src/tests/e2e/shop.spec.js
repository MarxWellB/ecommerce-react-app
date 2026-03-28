import { test, expect } from '@playwright/test'

// ─────────────────────────────────────────────────────────────────────────────
// Helper: hace login con las credenciales de demo
// ─────────────────────────────────────────────────────────────────────────────
async function loginAsDemo(page) {
  await page.goto('/login')
  await page.getByTestId('email-input').fill('demo@nova.com')
  await page.getByTestId('password-input').fill('demo123')
  await page.getByTestId('login-submit').click()
  // Esperamos a que el navbar esté visible (señal de que el login fue exitoso)
  await page.waitForURL('/')
}

// ─────────────────────────────────────────────────────────────────────────────
test.describe('Flujo de autenticación', () => {
  test('redirige a /login si no hay sesión activa', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL('/login')
  })

  test('muestra error con credenciales incorrectas', async ({ page }) => {
    await page.goto('/login')
    await page.getByTestId('email-input').fill('wrong@email.com')
    await page.getByTestId('password-input').fill('wrongpassword')
    await page.getByTestId('login-submit').click()

    await expect(page.getByTestId('login-error')).toBeVisible()
  })

  test('hace login correctamente con credenciales válidas', async ({ page }) => {
    await loginAsDemo(page)
    await expect(page).toHaveURL('/')
    // El navbar debe mostrar el carrito
    await expect(page.getByTestId('cart-button')).toBeVisible()
  })

  test('el botón de demo rellena las credenciales', async ({ page }) => {
    await page.goto('/login')
    await page.getByText('Usar credenciales de demo →').click()

    await expect(page.getByTestId('email-input')).toHaveValue('demo@nova.com')
    await expect(page.getByTestId('password-input')).toHaveValue('demo123')
  })
})

// ─────────────────────────────────────────────────────────────────────────────
test.describe('Catálogo de productos', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page)
  })

  test('carga y muestra el grid de productos', async ({ page }) => {
    // Esperamos a que al menos una card sea visible
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 10000 })

    const cards = page.getByTestId('product-card')
    await expect(cards).toHaveCount(await cards.count())
    expect(await cards.count()).toBeGreaterThan(0)
  })

  test('el buscador filtra productos correctamente', async ({ page }) => {
    await page.getByTestId('search-input').fill('phone')

    // Esperamos a que los resultados se actualicen
    await page.waitForTimeout(600) // delay del debounce (400ms) + margen
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 8000 })

    // Verificamos que el título del hero refleja la búsqueda
    await expect(page.getByText(/phone/i)).toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
test.describe('Carrito de compras', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page)
    // Esperamos a que los productos carguen
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 10000 })
  })

  test('agregar un producto al carrito actualiza el badge', async ({ page }) => {
    // Al inicio no hay badge
    await expect(page.getByTestId('cart-badge')).not.toBeVisible()

    // Agregamos el primer producto
    await page.getByTestId('add-to-cart-btn').first().click()

    // Ahora el badge debe mostrar "1"
    await expect(page.getByTestId('cart-badge')).toBeVisible()
    await expect(page.getByTestId('cart-badge')).toHaveText('1')
  })

  test('el modal del carrito se abre al hacer clic en el botón', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click()
    await page.getByTestId('cart-button').click()

    await expect(page.getByTestId('cart-modal')).toBeVisible()
    await expect(page.getByTestId('cart-item')).toBeVisible()
  })

  test('cerrar el modal con el overlay funciona', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click()
    await page.getByTestId('cart-button').click()

    // Click fuera del panel (en el overlay)
    await page.getByTestId('cart-overlay').click({ position: { x: 10, y: 10 } })
    await expect(page.getByTestId('cart-modal')).not.toBeVisible()
  })

  test('cerrar el modal con tecla Escape funciona', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click()
    await page.getByTestId('cart-button').click()

    await page.keyboard.press('Escape')
    await expect(page.getByTestId('cart-modal')).not.toBeVisible()
  })

  test('eliminar un producto del carrito funciona', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click()
    await page.getByTestId('cart-button').click()

    await page.getByTestId('remove-item-btn').first().click()

    // El carrito debe quedar vacío
    await expect(page.getByTestId('cart-item')).not.toBeVisible()
  })

  test('vaciar el carrito funciona', async ({ page }) => {
    // Agregamos varios productos
    const addBtns = page.getByTestId('add-to-cart-btn')
    await addBtns.nth(0).click()
    await addBtns.nth(1).click()

    await page.getByTestId('cart-button').click()
    await page.getByTestId('clear-cart-btn').click()

    await expect(page.getByTestId('cart-badge')).not.toBeVisible()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
test.describe('Flujo de checkout', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsDemo(page)
    await expect(page.getByTestId('product-card').first()).toBeVisible({ timeout: 10000 })
  })

  test('el botón de checkout navega a /checkout', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click()
    await page.getByTestId('cart-button').click()
    await page.getByTestId('checkout-btn').click()

    await expect(page).toHaveURL('/checkout')
  })

  test('completa el proceso de pago y muestra mensaje de éxito', async ({ page }) => {
    await page.getByTestId('add-to-cart-btn').first().click()
    await page.getByTestId('cart-button').click()
    await page.getByTestId('checkout-btn').click()

    // Confirmamos el pago
    await page.getByTestId('pay-btn').click()

    // Esperamos el mensaje de éxito (el pago simulado tarda ~2s)
    await expect(page.getByTestId('success-message')).toBeVisible({ timeout: 5000 })

    // El carrito debe estar vacío
    await page.goto('/')
    await expect(page.getByTestId('cart-badge')).not.toBeVisible()
  })
})
