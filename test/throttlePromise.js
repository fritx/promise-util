const assert = require('assert')
const { throttlePromise } = require('../')

function isAlmost (t1, t2) {
  return Math.abs(t1 - t2) < 100
}

function keepCall (fn, wait, duration) {
  const start = Date.now()
  return new Promise(res => {
    const id = setInterval(() => {
      fn()
      if (Date.now() - start >= duration) {
        clearInterval(id)
        res()
      }
    }, wait)
  })
}

describe('throttlePromise', function () {

  this.timeout(5000)

  const expected = [0, 1000, 2000]
  const start = Date.now()
  let i = 0

  function f () {
    return new Promise(res => {
      setTimeout(() => {
        res(Date.now() - start)
      }, 1000)
    })
  }

  it('should throttle a promised fn', (done) => {
    const fn = throttlePromise(f)

    function test () {
      fn()
        .then(v => {
          assert.equal(isAlmost(v, expected[i++]), true)
        })
    }

    keepCall(test, 600, 2400)
      .then(done)
  })
})
