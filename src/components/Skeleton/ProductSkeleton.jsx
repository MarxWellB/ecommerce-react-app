import styles from './ProductSkeleton.module.css'

function ProductSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.image} />

      <div className={styles.body}>
        <div className={`skeleton ${styles.tag}`} />
        <div className={`skeleton ${styles.titleLine}`} />
        <div className={`skeleton ${styles.titleShort}`} />
        <div className={`skeleton ${styles.rating}`} />
        <div className={`skeleton ${styles.price}`} />
        <div className={`skeleton ${styles.button}`} />
      </div>
    </div>
  )
}

export default ProductSkeleton