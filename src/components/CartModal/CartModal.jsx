import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'

import { useCart } from '../../hooks/useCart'
import CartItem from '../CartItem/CartItem'
import { formatPrice } from '../../utils/formatters'

import styles from './CartModal.module.css'

function CartModal() {
  const { items, total, isOpen, closeCart, clearCart } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeCart()
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, closeCart])

  if (!isOpen) return null

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  const modalRoot = document.getElementById('modal-root')
  if (!modalRoot) return null

  return createPortal(
    <div className={styles.overlay} onClick={closeCart}>
      <aside
        className={styles.panel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>
            Carrito
            {items.length > 0 && (
              <span className={styles.count}>{items.length}</span>
            )}
          </h2>

          <button className={styles.closeBtn} onClick={closeCart}>
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <p>Tu carrito está vacío</p>
          </div>
        ) : (
          <>
            <div className={styles.itemsList}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>

            <div className={styles.footer}>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span className={styles.totalAmount}>
                  {formatPrice(total)}
                </span>
              </div>

              <button
                className={`btn-primary ${styles.checkoutBtn}`}
                onClick={handleCheckout}
              >
                Ir a pagar
              </button>

              <button
                className={styles.clearBtn}
                onClick={clearCart}
              >
                Vaciar carrito
              </button>
            </div>
          </>
        )}
      </aside>
    </div>,
    modalRoot
  )
}

export default CartModal