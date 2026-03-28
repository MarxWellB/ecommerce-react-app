import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useCart } from '../../hooks/useCart'
import { formatPrice } from '../../utils/formatters'

import styles from './CheckoutSummary.module.css'

const STEPS = {
  SUMMARY: 'summary',
  PROCESSING: 'processing',
  SUCCESS: 'success',
}

function CheckoutSummary() {
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [step, setStep] = useState(STEPS.SUMMARY)

  const shipping = total > 100 ? 0 : 9.99
  const taxes = total * 0.08
  const grandTotal = total + shipping + taxes

  const handlePayment = async () => {
    setStep(STEPS.PROCESSING)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    clearCart()
    setStep(STEPS.SUCCESS)
  }

  if (step === STEPS.PROCESSING) {
    return (
      <div className={styles.centeredState}>
        <div className={styles.processingSpinner} />
        <h2 className={styles.processingTitle}>Procesando pago</h2>
        <p className={styles.processingText}>Espera un momento</p>
      </div>
    )
  }

  if (step === STEPS.SUCCESS) {
    return (
      <div className={styles.centeredState}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Compra realizada</h2>
        <p className={styles.successText}>
          Recibirás confirmación pronto
        </p>
        <p className={styles.orderId}>
          Orden #{Math.random().toString(36).slice(2, 10).toUpperCase()}
        </p>

        <button
          className="btn-primary"
          onClick={() => navigate('/')}
          style={{ marginTop: '24px' }}
        >
          Volver
        </button>
      </div>
    )
  }

  return (
    <div className={styles.layout}>
      <section className={styles.productList}>
        <h2 className={styles.sectionTitle}>Tu pedido</h2>

        {items.map((item) => (
          <div key={item.id} className={styles.orderItem}>
            <img
              src={item.thumbnail}
              alt={item.title}
              className={styles.itemImage}
            />

            <div className={styles.itemInfo}>
              <p className={styles.itemTitle}>{item.title}</p>
              <p className={styles.itemQty}>
                Cantidad: {item.quantity}
              </p>
            </div>

            <p className={styles.itemPrice}>
              {formatPrice(item.price * item.quantity)}
            </p>
          </div>
        ))}
      </section>

      <aside className={styles.priceSummary}>
        <h2 className={styles.sectionTitle}>Resumen</h2>

        <div className={styles.priceRow}>
          <span>Subtotal</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className={styles.priceRow}>
          <span>Envío</span>
          <span className={shipping === 0 ? styles.free : ''}>
            {shipping === 0 ? 'Gratis' : formatPrice(shipping)}
          </span>
        </div>

        <div className={styles.priceRow}>
          <span>Impuestos</span>
          <span>{formatPrice(taxes)}</span>
        </div>

        <div className={styles.divider} />

        <div className={styles.totalRow}>
          <span>Total</span>
          <span className={styles.totalAmount}>
            {formatPrice(grandTotal)}
          </span>
        </div>

        <button
          className={`btn-primary ${styles.payBtn}`}
          onClick={handlePayment}
        >
          Pagar
        </button>

        <button
          className={styles.backBtn}
          onClick={() => navigate('/')}
        >
          Seguir comprando
        </button>
      </aside>
    </div>
  )
}

export default CheckoutSummary