
var Backbone = require('backbone')
  , utils = require('./utils')

module.exports = Route

function Route(name, config, onRoute) {
  if ('string' === typeof config) {
    config = {match: config}
  }
  this.name = name
  this.match = config.match
  this.args = config.args || {}
  this.rx = Backbone.Router.prototype._routeToRegExp(config.match)
  this.names = findall(/:\w+/g, config.match)
  var that = this
  Backbone.history.route(this.rx, function (fragment) {
    var values = Backbone.Router.prototype._extractParameters(rx, fragment)
    var obj = that.toObj(values, fragment)
    onRoute(fragment, obj)
    Backbone.history.trigger('route', null, name, args)
  })
}

Route.prototype = {
  toObj: function (values, fragment) {
    var obj = {}
      , name
    for (var i=0; i<this.names.length; i++) {
      name = this.names[i]
      obj[name] = utils.parse(name, values[i], this.args[name])
    }
    return obj
  },
  toFragment: function (params) {
    var that = this
    return route.replace(/:(\w+)/g, function (match) {
      if (undefined === params[match]) return ':' + match
      return utils.stringify(match, params[match], that.args[match])
    })
  }
}

