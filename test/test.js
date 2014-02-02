
var expect = require('expect.js')
  , Route = require('../route')

var months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun']

var DateParser = {
  compare: function (a, b) {
    return a.getTime() === b.getTime()
  },
  stringify: function (date) {
    return date.getTime()
  },
  parse: function (num) {
    return new Date(+num)
  }
}

var MonthParser = {
  months: months,
  match: new RegExp(months.join('|')),
  stringify: function (num) {
    return months[num]
  },
  parse: function (month) {
    return months.indexOf(month.toLowerCase())
  }
}

describe('Router', function () {
  describe('most basic', function () {
    var r
    beforeEach(function () {
      r = new Route('test', '')
    })
    it('should match the empty route', function () {
      var m = r.match('')
      expect(m).to.be.ok()
      expect(m).to.eql({})
    })
    it('should not match other things', function () {
      var m = r.match('something')
      expect(m).to.not.be.ok()
    })
    it('should not match other complex things', function () {
      var m = r.match('something/else')
      expect(m).to.not.be.ok()
    })
  })

  describe('with two routes', function () {
    var r
    beforeEach(function () {
      r = new Route('test', ['some/thing', 'other/:num'])
    })
    it('should match the first', function () {
      var m = r.match('some/thing')
      expect(m).to.eql({})
    })
    it('should match the second', function () {
      var m = r.match('other/23m')
      expect(m).to.eql({num: '23m'})
    })
    it('should not match another', function () {
      expect(r.match('other')).to.not.be.ok()
    })
  })

  describe('with complex parsing', function () {
    var r
    beforeEach(function () {
      r = new Route('test', {
        match: 'one/:two/:three',
        args: {
          two: Number,
          three: MonthParser
        }
      })
    })
    it('should parse', function () {
      var m = r.match('one/34/jan')
      expect(m).to.eql({
        two: 34,
        three: 0
      })
    })
    it('should serialize', function () {
      var frag = r.toFragment({
        two: 36,
        three: 1
      })
      expect(frag).to.equal('one/36/feb')
    })
  })

  describe('with defaults', function () {
    var r
    beforeEach(function () {
      r = new Route('test', {
        match: ['', 'one/:two/:three'],
        args: {
          two: {
            default: 5,
            type: Number
          },
          three: {
            default: new Date(10000),
            type: DateParser
          }
        }
      })
    })
    it('should fill in the default', function () {
      expect(r.match('')).to.eql({two: 5, three: new Date(10000)})
    })
    it('should override the default', function () {
      expect(r.match('one/12/10')).to.eql({two: 12, three: new Date(10)})
    })

    it('should serialize normally', function () {
      expect(r.toFragment({two: 7, three: new Date(20)})).to.equal('one/7/20')
    })
    it('should serialize default', function () {
      expect(r.toFragment({two: 5, three: new Date(10000)})).to.equal('')
    })
  })
})

