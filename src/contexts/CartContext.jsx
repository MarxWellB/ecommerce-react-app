import { createContext, useReducer, useEffect, useState } from 'react'
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  calculateTotal,
  countItems,
} from '../utils/cartUtils'
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage'

const ACTIONS = {
  ADD: 'ADD_TO_CART',
  REMOVE: 'REMOVE_FROM_CART',
  UPDATE: 'UPDATE_QUANTITY',
  CLEAR: 'CLEAR_CART',
  HYDRATE: 'HYDRATE_FROM_STORAGE',
}

function cartReducer(state, action) {
  switch (action.type) {
    case ACTIONS.ADD:
      return {
        ...state,
        items: addToCart(state.items, action.payload),
      }

    case ACTIONS.REMOVE:
      return {
        ...state,
        items: removeFromCart(state.items, action.payload),
      }

    case ACTIONS.UPDATE:
      return {
        ...state,
        items: updateQuantity(
          state.items,
          action.payload.id,
          action.payload.quantity
        ),
      }

    case ACTIONS.CLEAR:
      return { ...state, items: [] }

    case ACTIONS.HYDRATE:
      return { ...state, items: action.payload }

    default:
      return state
  }
}

export const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] })
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const saved = getItem(STORAGE_KEYS.CART)
    if (saved?.length > 0) {
      dispatch({ type: ACTIONS.HYDRATE, payload: saved })
    }
  }, [])

  useEffect(() => {
    setItem(STORAGE_KEYS.CART, state.items)
  }, [state.items])

  const total = calculateTotal(state.items)
  const itemCount = countItems(state.items)

  const addItem = (product) =>
    dispatch({ type: ACTIONS.ADD, payload: product })

  const removeItem = (id) =>
    dispatch({ type: ACTIONS.REMOVE, payload: id })

  const changeQty = (id, quantity) =>
    dispatch({
      type: ACTIONS.UPDATE,
      payload: { id, quantity },
    })

  const clearCart = () =>
    dispatch({ type: ACTIONS.CLEAR })

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        total,
        itemCount,
        isOpen,
        addItem,
        removeItem,
        changeQty,
        clearCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}