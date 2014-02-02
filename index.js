
var Backbone = require('backbone')
  , _ = require('lodash')
  , $ = window.jQuery

  , Route = require('./route')

Backbone.$ = $

module.exports = {
  getInitialState: function () {
    this.createRoutes()
    return {
      _route: this.defaultRoute(),
      _navigations: 0
    }
  },
  createRoutes: function () {
    var routes = this.routes
      , _routes = this._routes = {}
    if ('function' === typeof routes) {
      routes = routes()
    }
    Object.keys(routes).forEach(function (route) {
      _routes[route] = new Route(route, routes[route])
    })
  },
  defaultRoute: function () {
    var found = null
    this._routes.some(function (route) {
      var obj = route.match('')
      if (!obj) return false
      found = {
        name: route.name,
        params: obj,
        raw: ''
      }
      return true
    })
    return found
  },
  /**
   * Returns the route object, which looks like
   * {
   *   name: the name of the route,
   *   raw: the raw /matched/url/stuff
   *   params: {} obj of the parsed params
   * }
   */
  getRoute: function () {
    return this.state._route
  },
  setRoute: function (name, params) {
    params = params || {}
    if (!this._routes[name]) {
      console.warn('Route not defined', name)
      return
    }
    var fragment = this._routes[name].toFragment(params)
    if (fragment === false) {
      console.warn('Invalid params given for route', name, params)
      throw new Error('Invalid params for route ' + name)
    }
    Backbone.history.navigate(fragment, {trigger: false})
    this.onRoute(name, params, fragment)
  },
  onRoute: function (name, params, fragment) {
    this.setState({
      _route: {
        name: name,
        raw: fragment,
        params: params
      },
      _navigations: this.state._navigations + 1
    })
  },
  setupRoutes: function () {
    var that = this
    this._routes.forEach(function (route) {
      route.register(that.onRoute.bind(that, route.name))
    })
  },
  componentDidMount: function () {
    this.setupRoutes()
    Backbone.history.start()
  }
}

