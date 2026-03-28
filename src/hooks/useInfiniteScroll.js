import { useEffect, useRef } from 'react'

export function useInfiniteScroll(callback, enabled = true) {
  const ref = useRef(null)

  useEffect(() => {
    if (!enabled) return

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry.isIntersecting) {
          callback()
        }
      },
      {
        rootMargin: '100px',
        threshold: 0,
      }
    )

    const element = ref.current
    if (element) observer.observe(element)

    return () => {
      if (element) observer.unobserve(element)
    }
  }, [callback, enabled])

  return ref
}