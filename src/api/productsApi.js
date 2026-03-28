const BASE_URL = 'https://dummyjson.com'

export async function fetchProducts({ limit = 12, skip = 0, search = '' } = {}) {
  const url = search
    ? `${BASE_URL}/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`
    : `${BASE_URL}/products?limit=${limit}&skip=${skip}`

  const res = await fetch(url)

  if (!res.ok) {
    throw new Error('Error al cargar productos')
  }

  const data = await res.json()

  return {
    products: data.products,
    total: data.total,
    skip: data.skip,
    limit: data.limit,
  }
}

export async function fetchProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`)

  if (!res.ok) {
    throw new Error('Producto no encontrado')
  }

  return res.json()
}

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/products/categories`)

  if (!res.ok) {
    throw new Error('Error al cargar categorías')
  }

  return res.json()
}