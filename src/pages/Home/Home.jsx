import { useState } from 'react'

import Navbar from '../../components/Navbar/Navbar'
import SearchBar from '../../components/SearchBar/SearchBar'
import ProductGrid from '../../components/ProductGrid/ProductGrid'
import CartModal from '../../components/CartModal/CartModal'

import { useProducts } from '../../hooks/useProducts'
import { useDebounce } from '../../hooks/useDebounce'

import styles from './Home.module.css'

function Home() {
  const [searchInput, setSearchInput] = useState('')

  const searchQuery = useDebounce(searchInput, 400)

  const { products, isLoading, error, hasMore, loadMore } =
    useProducts(searchQuery)

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.hero}>
            <div>
              <h1 className={styles.heroTitle}>
                Descubre productos
              </h1>

              <p className={styles.heroSub}>
                {products.length > 0 && !searchQuery
                  ? `${products.length}+ disponibles`
                  : searchQuery
                  ? `Resultados: "${searchQuery}"`
                  : 'Cargando'}
              </p>
            </div>

            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
            />
          </div>

          <ProductGrid
            products={products}
            isLoading={isLoading}
            error={error}
            hasMore={hasMore}
            onLoadMore={loadMore}
          />
        </div>
      </main>

      <CartModal />
    </div>
  )
}

export default Home