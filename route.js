
var Backbone = require('backbone')
  , utils = require('./utils')

module.exports = Route


function findall(rx, str) {
  var found = []
  str.replace(rx, function (match) {
    found.push(match)
    return ''
  })
  return found
}

function mapObj(names, values) {
  var obj = {}
  for (var i=0; i<names.length; i++) {
    obj[names[i]] = values[i]
  }
  return obj
}

function Route(name, config) {
  if ('string' === typeof config) {
    config = {match: [config]}
  }
  if (Array.isArray(config)) {
    config = {match: config}
  }
  if (!Array.isArray(config.match)) {
    config.match = [config.match]
  }
  this.name = name
  this.args = config.args || {}

  this.matchers = config.match.map(function (matcher) {
    var rx = Backbone.Router.prototype._routeToRegExp(matcher)
    var names = []
    matcher.replace(/:(\w+)/g, function (full, name) {
      names.push(name)
    })
    return {
      rx: rx,
      raw: matcher,
      names: names
    }
  })
}

Route.prototype = {
  // register callbacks with Backbone's history
  register: function (onRoute) {
    var that = this
    this.matchers.forEach(function (matcher) {
      Backbone.history.route(matcher.rx, function (fragment) {
        var values = Backbone.Router.prototype._extractParameters(matcher.rx, fragment)
          , obj = that.toObj(matcher.names, values)
        onRoute(obj, fragment)
        Backbone.history.trigger('route', null, that.name, values)
      })
    })
  },

  match: function (fragment) {
    var result
      , that = this
    var valid = this.matchers.some(function (matcher) {
      if (!fragment.match(matcher.rx)) return false
      var values = Backbone.Router.prototype._extractParameters(matcher.rx, fragment)
        , obj = that.toObj(matcher.names, values)
      result = obj
      return true
    })
    return valid && result
  },

  toFragment: function (params) {
    var that = this
    var atDefault = []
      , rest = []
    Object.keys(params).forEach(function (name) {
      var isdef = false
      if (that.args[name] && undefined !== that.args[name].default) {
        if (that.args[name].type && that.args[name].type.compare) {
          isdef = that.args[name].type.compare(params[name], that.args[name].default)
        } else {
          isdef = params[name] === that.args[name].default
        }
      }
      if (isdef) {
        atDefault.push(name)
      } else {
        rest.push(name)
      }
    })
    var found = null
    this.matchers.some(function (matcher) {
      var left = matcher.names.slice()
        , at
      for (var i=0; i<rest.length; i++) {
        at = left.indexOf(rest[i])
        if (at === -1) return false
        left.splice(at, 1)
      }
      if (left.length) return false
      found = matcher
      return true
    })
    if (!found) return false
    return found.raw.replace(/:(\w+)/g, function (full, name) {
      if (undefined === params[name]) return ':' + name
      return utils.stringify(name, params[name], that.args[name])
    })
  },

  toObj: function (names, values) {
    var obj = {}
    for (var i=0; i<names.length; i++) {
      obj[names[i]] = utils.parse(names[i], values[i], this.args[names[i]])
    }
    for (var name in this.args) {
      if (names.indexOf(name) !== -1) continue;
      if (this.args[name].default) {
        obj[name] = this.args[name].default
      }
    }
    return obj
  }
}

