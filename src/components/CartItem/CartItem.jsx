import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatters'

import styles from './CartItem.module.css'

function CartItem({ item }) {
  const { removeItem, changeQty } = useCart()

  const subtotal = item.price * item.quantity

  return (
    <div className={styles.item} data-testid="cart-item">
      <img src={item.thumbnail} alt={item.title} className={styles.image} />

      <div className={styles.details}>
        <p className={styles.title}>{item.title}</p>
        <p className={styles.unitPrice}>{formatPrice(item.price)} c/u</p>

        <div className={styles.controls}>
          <div className={styles.qty}>
            <button
              className={styles.qtyBtn}
              onClick={() => changeQty(item.id, item.quantity - 1)}
            >
              −
            </button>

            <span className={styles.qtyValue}>{item.quantity}</span>

            <button
              className={styles.qtyBtn}
              onClick={() => changeQty(item.id, item.quantity + 1)}
            >
              +
            </button>
          </div>

          <span className={styles.subtotal}>
            {formatPrice(subtotal)}
          </span>
        </div>
      </div>

      <button
        className={styles.removeBtn}
        onClick={() => removeItem(item.id)}
      >
        ✕
      </button>
    </div>
  )
}

export default CartItem