export const debounce = (func, wait, immediate) => {
  let timeout
  return () => {
    const context = this
    const args = arguments
    const later = () => {
      timeout = null
      if (!immediate) {
        func.apply(context, args)
      }
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    const delay = typeof wait === 'function' ? wait() : wait
    timeout = setTimeout(later, wait)
    if (callNow) {
      func.apply(context, args)
    }
  }
}
