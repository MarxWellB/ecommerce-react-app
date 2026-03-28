import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Navbar from '../../components/Navbar/Navbar'
import CheckoutSummary from '../../components/CheckoutSummary/CheckoutSummary'

import { useCart } from '../../hooks/useCart'

import styles from './Checkout.module.css'
function Checkout() {
  const { items } = useCart()
  const navigate = useNavigate()

  useEffect(() => {
    if (items.length === 0) {
      const timer = setTimeout(() => navigate('/'), 100)
      return () => clearTimeout(timer)
    }
  }, [items, navigate])

  return (
    <div className={styles.page}>
      <Navbar />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.header}>
            <h1 className={styles.title}>Finalizar compra</h1>
            <p className={styles.step}>Resumen y pago</p>
          </div>

          <CheckoutSummary />
        </div>
      </main>
    </div>
  )
}

export default Checkout