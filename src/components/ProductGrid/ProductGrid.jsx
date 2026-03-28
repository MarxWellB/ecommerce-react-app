import ProductCard from '../ProductCard/ProductCard'
import ProductSkeleton from '../Skeleton/ProductSkeleton'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

import styles from './ProductGrid.module.css'

function ProductGrid({ products, isLoading, error, hasMore, onLoadMore }) {
  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore && !isLoading)

  if (error) {
    return (
      <div className={styles.errorState}>
        <span className={styles.errorIcon}>⚠️</span>
        <p>{error}</p>
        <button className="btn-ghost" onClick={onLoadMore}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <section>
      <div className={styles.grid}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {isLoading && products.length === 0 &&
          Array.from({ length: 12 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
      </div>

      {isLoading && products.length > 0 && (
        <div className={styles.loadingMore}>
          <div className={styles.spinner} />
          <span>Cargando más productos</span>
        </div>
      )}

      {!isLoading && products.length === 0 && (
        <div className={styles.emptyState}>
          <p>No hay productos</p>
          <p className={styles.emptyHint}>Prueba otra búsqueda</p>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <p className={styles.endMessage}>
          Total: {products.length}
        </p>
      )}

      <div ref={sentinelRef} className={styles.sentinel} />
    </section>
  )
}

export default ProductGrid