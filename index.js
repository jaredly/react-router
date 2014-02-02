
var Backbone = require('backbone')
  , _ = require('lodash')
  , $ = window.jQuery

  , Route = require('./route')

Backbone.$ = $

module.exports = {
  getInitialState: function () {
    return {
      _route: this.defaultRoute()
    }
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
    if (!this._routes[name]) {
      console.warn('Route not defined', name)
      return
    }
    var fragment = this._routes[name].toFragment(params)
    Backbone.history.navigate(fragment, {trigger: true})
  },
  onRoute: function (name, params, fragment) {
    this.setState({
      _route: {
        name: name,
        raw: fragment,
        params: params
      }
    })
  },
  setupRoutes: function () {
    var that = this
      , routes = this.routes
      , _routes = this._routes = {}
      , onRoute = this.onRoute.bind(this)
    if ('function' === typeof routes) {
      routes = routes()
    }
    Object.keys(routes).forEach(function (route) {
      _routes[route] = new Route(route, routes[route], onRoute.bind(null, route))
    })
  },
  componentDidMount: function () {
    this.setupRoutes()
    Backbone.history.start()
  }
}

