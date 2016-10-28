const assert = require('assert')
const { isPromise } = require('../')

describe('isPromise', () => {
  it('should detect a promise', () => {
    assert.equal(
      isPromise(new Promise(res => {
        res()
      })),
      true
    )
    assert.equal(
      isPromise(Promise.resolve()),
      true
    )
    assert.equal(
      isPromise(Promise.resolve({ key: 2 })),
      true
    )
    assert.equal(
      isPromise(Promise.reject()),
      true
    )
    assert.equal(
      isPromise(Promise.reject(new Error('errmsg'))),
      true
    )
    assert.equal(
      isPromise('string'),
      false
    )
    assert.equal(
      isPromise(123),
      false
    )
  })
})
