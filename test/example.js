/*

var RouteMixin = require('../')

var MonthParser = {
  months: ['jan', 'feb', 'mar', 'apr', 'may', 'jun'],
  stringify: function (num) {
    return this.months[num]
  },
  parse: function (month) {
    return months.indexOf(month.toLowerCase())
  }
}

var Example = React.createClass({
  routes: {
    home: '',
    time: {
      match: 'time/:time/:num/:month',
      args: {
        time: Date, // or Number, or an object with serialize and deserialize functions
        num: Number,
        month: MonthParser
      }
    },
    person: ':pid',
  },
  render: function () {
    var route = this.getRoute()
    return d.div(
      null,
      d.h1(null, 'Hello!'),
      d.span(null, 'You are on page ' + route.name)
    )
  },
})

var Ex1 = React.createClass({
  mixins: [RouteMixin],
  routes: function () {
    return {
      issues: {
        match: ['', ':page'],
        args: {
          page: {
            type: Number,
            default: this.params.defaultPage
          }
        }
      }
    }
  }
}


*/
