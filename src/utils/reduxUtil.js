export const promiseTypeSuffixes = ['PENDING', 'FULFILLED', 'REJECTED']
export const promiseTypeDelimiter = '_'

const [PENDING, FULFILLED, REJECTED] = promiseTypeSuffixes

export function createAction (type, async = true) {
  return function (target) {
    target.toString = () => type
    if (async) {
      target.pending = `${type}${promiseTypeDelimiter}${PENDING}`
      target.fulfilled = `${type}${promiseTypeDelimiter}${FULFILLED}`
      target.rejected = `${type}${promiseTypeDelimiter}${REJECTED}`
    }
    return target
  }
}
