
var expect = require('expect.js')
  , mixin = require('../')

function merge(a, b) {
  if (!b) return a
  for (var c in b) {
    a[c] = b[c]
  }
  return a
}

function Awesome(props, state) {
  props._on = props._on || function () { }
  props._off = props._off || function () { }
  props._path = props._path || function () { }
  this.props = merge(this.getDefaultProps(), props)
  this.state = merge(this.getInitialState(), state)
  this.refs = {
    _outlet: { }
  }
}

Awesome.prototype = mixin
Awesome.prototype.setState = function (state) {
  for (var name in state) {
    this.state[name] = state[name]
  }
}

describe('Router', function () {
  describe('simply setup', function () {
    var awe, path
    beforeEach(function () {
      awe = new Awesome({
        _path: function (val) {
          if (arguments.length) path = val
          return path
        }
      })
    })
    describe('#setRouteFromPath', function () {
      it('should load up the index', function () {
        path = ''
        awe.setRouteFromPath()
        expect(awe.state._route).to.equal('')
      })
      it('should load up a simple path', function () {
        path = 'some'
        awe.setRouteFromPath()
        expect(awe.state._route).to.equal('some')
      })
      it('should load up the first part of a complex path', function () {
        path = 'great/thing'
        awe.setRouteFromPath()
        expect(awe.state._route).to.equal('great')
      })
    })

    describe('#goTo', function () {
      it('should set the path', function () {
        path = ''
        awe.goTo('parties')
        expect(path).to.equal('parties')
      })
    })
  })

  describe('somewhat nested', function () {
    var awe, path
    beforeEach(function () {
      awe = new Awesome({
        _baseroute: 'some/thing',
        _path: function (val) {
          if (arguments.length) path = val
          return path
        }
      })
    })

    describe('#setRouteFromPath', function () {
      it('should load up to the index', function () {
        path = 'some/thing'
        awe.setRouteFromPath()
        expect(awe.state._route).to.equal('')
      })

      it('should strip the trailing slash', function () {
        path = 'some/thing/'
        awe.setRouteFromPath()
        expect(awe.state._route).to.equal('')
      })

      it('should load up a simple path', function () {
        path = 'some/thing/else'
        awe.setRouteFromPath()
        expect(awe.state._route).to.equal('else')
      })

      it('should load up a complex path', function () {
        path = 'some/thing/here/is/great'
        awe.setRouteFromPath()
        expect(awe.state._route).to.equal('here')
      })
    })

    describe('#goTo', function () {
      it('should set the index', function () {
        path = 'some/thing/else'
        awe.goTo('')
        expect(path).to.equal('some/thing')
      })

      it('should set a path', function () {
        path = 'some/thing/else'
        awe.goTo('here')
        expect(path).to.equal('some/thing/here')
      })

      it('should set a complex path', function () {
        path = 'some/thing/else'
        awe.goTo('here/is/great')
        expect(path).to.equal('some/thing/here/is/great')
      })
    })
  })

  // TODO: test outlet and things

  // TODO: test global goTo, pass up higher paths
  // TODO: test pathchange, ignore hashes not sharing a base path
  // TODO: refuse bequest, refuse leave... should that be async?
})

