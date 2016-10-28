const assert = require('assert')
const { isPromise, ensurePromise } = require('../')

describe('ensurePromise', () => {
  function a () {
    return 123
  }
  function b () {
    return { key: 2 }
  }
  function c () {
    throw new Error('errmsg')
  }
  function d () {
    return new Promise(res => {
      res()
    })
  }
  function e () {
    return Promise.resolve(123)
  }
  function f () {
    return Promise.reject(new Error('errmsg'))
  }

  function test (fn, done) {
    const p = ensurePromise(fn)()
    assert.equal(
      isPromise(p),
      true
    )
    return p
  }

  it('should ensure a fn to return a promise', (done) => {
    Promise.resolve()
      .then(() => {
        return test(a).then(v => assert.equal(v, 123))
      })
      .then(() => {
        return test(b).then(v => assert.equal(v.key, 2))
      })
      .then(() => {
        return test(c).catch(e => assert.equal(e.message, 'errmsg'))
      })
      .then(() => {
        return test(d).then(v => assert.equal(v, undefined))
      })
      .then(() => {
        return test(e).then(v => assert.equal(v, 123))
      })
      .then(() => {
        return test(f).catch(e => assert.equal(e.message, 'errmsg'))
      })
      .then(done, done)
  })
})
