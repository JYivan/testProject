export function disabledRepeatAction (fn) {
  let fetching = false
  return async function (...args) {
    try {
      if (fetching) {
        return
      } else {
        fetching = true
        const res = await fn.apply(this || {}, args)
        fetching = false
        return res
      }
    } catch (error) {
      fetching = false
      throw error
    }
  }
}
