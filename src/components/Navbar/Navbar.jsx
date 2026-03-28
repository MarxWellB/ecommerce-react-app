import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'

import styles from './Navbar.module.css'

function Navbar() {
  const { user, logout } = useAuth()
  const { itemCount, openCart } = useCart()

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.logo}>
          <span className={styles.logoMark}>N</span>
          <span className={styles.logoText}>OVA</span>
        </div>

        <div className={styles.actions}>
          {user && (
            <span className={styles.greeting}>
              Hola, <strong>{user.name.split(' ')[0]}</strong>
            </span>
          )}

          <button
            className={styles.cartBtn}
            onClick={openCart}
          >
            <CartIcon />
            {itemCount > 0 && (
              <span className={styles.badge}>
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          <button className={styles.logoutBtn} onClick={logout}>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  )
}

export default Navbar