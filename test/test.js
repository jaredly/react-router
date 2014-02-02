
var expect = require('expect.js')
  , Router = require('../router')

describe('Router', function () {
  describe('matching', function () {
    it('should match the empty route', function (done) {
      new Router('test', '', function (fragment, obj) {
        expect(fragment).to.equal('')
        expect(obj).to.eql({})
        done()
      })
    })
})

