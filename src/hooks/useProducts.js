import { useState, useEffect, useCallback, useRef } from 'react'
import { fetchProducts } from '../api/productsApi'

const PAGE_SIZE = 12

export function useProducts(search = '') {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(true)

  const skipRef = useRef(0)
  const isLoadingRef = useRef(false)

  useEffect(() => {
    setProducts([])
    skipRef.current = 0
    setHasMore(true)
    setError(null)
  }, [search])

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || !hasMore) return

    isLoadingRef.current = true
    setIsLoading(true)
    setError(null)

    try {
      const data = await fetchProducts({
        limit: PAGE_SIZE,
        skip: skipRef.current,
        search,
      })

      setProducts((prev) => {
        if (skipRef.current === 0) return data.products
        return [...prev, ...data.products]
      })

      skipRef.current += data.products.length
      setHasMore(skipRef.current < data.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [search, hasMore])

  useEffect(() => {
    loadMore()
  }, [search])

  return { products, isLoading, error, hasMore, loadMore }
}