exports.isPromise = isPromise
exports.ensurePromise = ensurePromise
const { isFunction } = require('util')

exports.throttlePromise = throttlePromise

function isPromise (obj) {
  return obj && isFunction(obj.then)
}
function ensurePromise (fn) {
  return function ensured (...args) {
    let ret
    try {
      ret = fn.call(this, ...args) // mind `this`
    } catch (e) {
      return Promise.reject(e)
    }
    if (isPromise(ret)) return ret
    return Promise.resolve(ret)
  }
}
// https://lodash.com/docs/4.16.4#throttle
// todo: leading=true, trailing=true
function throttlePromise (fn, wait) {
  wait = wait || 0 // fix NaN
  throttled.$currPromise = null
  throttled.$lastTime = -1
  throttled.$lastState = undefined
  throttled.$lastValue = undefined

  function throttled (...args) {
    const { $lastTime, $lastState, $lastValue, $currPromise } = throttled
    console.log(fn.name, 'start')
    if (Date.now() - $lastTime < wait) {
      if ($lastState === 'resolve') {
        return Promise.resolve($lastValue)
      } else if ($lastState === 'reject') {
        return Promise.reject($lastValue)
      }
    }

    console.log(fn.name, '$currPromise', $currPromise)
    if ($currPromise) return $currPromise
    throttled.$lastTime = Date.now()
    throttled.$lastState = undefined
    throttled.$lastValue = undefined

    const promise = fn.call(this, ...args) // mind `this`
      .then(v => {
        throttled.$currPromise = null
        throttled.$lastState = 'resolve'
        throttled.$lastValue = v
        console.log(fn.name, '$lastValue', $lastValue)
        return v
      }, e => {
        throttled.$currPromise = null
        throttled.$lastState = 'reject'
        throttled.$lastValue = e
        return Promise.reject(e)
      })
    throttled.$currPromise = promise
    return promise
  }
  return throttled
}