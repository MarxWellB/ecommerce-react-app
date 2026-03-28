import { useState } from 'react'

import { useCart } from '../../hooks/useCart'
import { formatPrice, truncateText } from '../../utils/formatters'

import styles from './ProductCard.module.css'

function ProductCard({ product }) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1200)
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100)

  return (
    <article className={styles.card}>
      {product.discountPercentage > 5 && (
        <span className={styles.discountBadge}>
          -{Math.round(product.discountPercentage)}%
        </span>
      )}

      <div className={styles.imageWrapper}>
        <img
          src={product.thumbnail}
          alt={product.title}
          className={styles.image}
        />
      </div>

      <div className={styles.body}>
        <p className={styles.category}>{product.category}</p>

        <h3 className={styles.title}>
          {truncateText(product.title, 50)}
        </h3>

        <div className={styles.rating}>
          <span className={styles.stars}>
            {'★'.repeat(Math.round(product.rating))}
            {'☆'.repeat(5 - Math.round(product.rating))}
          </span>
          <span className={styles.ratingNum}>
            {product.rating.toFixed(1)}
          </span>
        </div>

        <div className={styles.pricing}>
          <span className={styles.price}>
            {formatPrice(discountedPrice)}
          </span>

          {product.discountPercentage > 5 && (
            <span className={styles.originalPrice}>
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        <button
          className={`${styles.addBtn} ${
            added ? styles.addBtnAdded : ''
          }`}
          onClick={handleAddToCart}
        >
          {added ? 'Agregado' : 'Agregar'}
        </button>
      </div>
    </article>
  )
}

export default ProductCard