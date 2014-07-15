
var _ = require('lodash')
  , d = React.DOM

DEFAULTS = {
  _index: React.createClass({
    render: function () {
      return d.span({className: 'react-router_index'})
    }
  }),
  _error: React.createClass({
    displayName: 'DefaultError',
    render: function () {
      return d.div({className: 'react-router_error'},
                   d.strong({}, 'Error Loading Model:'),
                   this.props.error)
    },
  }),
  _loading: React.createClass({
    render: function () {
      return d.span({className: 'react-router_loading'})
    }
  })
}

module.exports = {

  getDefaultProps: function () {
    return {
      _baseroute: '',
      _on: function (fn) {
        window.addEventListener('hashchange', fn)
      },
      _off: function (fn) {
        window.removeEventListener('hashchange', fn)
      },
      _path: function (path) {
        if (arguments.length === 1) {
          window.location.hash = '#' + path
        } else {
          return window.location.hash.slice(1)
        }
      },
      goTo: function () {throw 'override'}
    }
  },
  getInitialState: function () {
    return {
      _route: ''
    }
  },

  componentWillMount: function () {
    if (this.props.goTo) {
      // I'm not the top router
      var cancel = this.enter && this.enter()
      if (cancel) return
    }

    this.props._on(this.pathchange)

    this.setRouteFromPath()
  },
  componentWillUnmount: function () {
    this.props._off(this.pathchange)
  },

  showTitle: function () {
    var title = this.title
    if ('function' === typeof title) title = title()
    this.setTitle(title)
  },

  componentDidMount: function () {
    // if there are no child routes
    if (!this.refs._outlet && this.title) {
      this.showTitle()
    }
  },
  componentDidUpdate: function () {
    // if there are no child routes
    if (!this.refs._outlet && this.title) {
      this.showTitle()
    }
  },
  setTitle: function (text) {
    document.title = text
  },

  /** Do we need this for something?
  componentDidUpdate: function (oprops, ostate) {
    if (ostate._route === this.state._route) return
  },
  **/

  pathchange: function () {
    this.setRouteFromPath()
  },

  setRouteFromPath: function () {
    // check the current url, if there's information for me there then load
    // that into the _route state
    var path = this.props._path()
    if (path.indexOf(this.props._baseroute) === -1) {
      // left this path. we will soon be destructed.
      return
    }
    var hash = path.slice(this.props._baseroute.length)
    if (hash.length && hash[0] === '/') hash = hash.slice(1)
    var part = hash.split('/', 1)[0]
    this.setState({_route: part})
  },

  goTo: function (route, global, force) {
    var full, part
    if (global) {
      if (route.indexOf(this.props._baseroute) !== 0) {
        return this.props.goTo(route, global, force)
      }
      full = route
      part = route.slice(this.props._baseroute.length).split('/', 1)[0]
    } else {
      if (route.slice(0, 3) === '../' || route === '..') {
        return this.props.goTo(route.slice(3), global, force)
      }
      full = this.props._baseroute
      if (full.length && full[full.length-1] !== '/' && route.length && route[0] !== '/') {
        full += '/'
      }
      full += route
      part = route.split('/', 1)[0]
    }

    var switching = part !== this.state._route
    if (switching && !force) {
      /** Not sure how this should work exactly. It should probably be async....
      if (this.refs._outlet.leave && !this.refs._outlet.leave()) {
        console.log('Routing cancelled by current outlet', this.state._route, route)
        return
      }
      **/
    }
    this.props._path(full)
  },

  outlet: function () {
    var route = this.routes[this.state._route]
      , rname = this.state._route
    if (!route && this.routes['*'] && rname) route = this.routes['*']
    if (!route && (rname || !this.model)) {
      console.log('Invalid router state envountered; no good route here...' + this.state._route)
      this.goTo('')
      return false
    }
    if ('string' === typeof route) {
      this.goTo(route)
      return false
    }
    var args = {}
    // model routes
    if (!rname && this.model) {
      if (this.state.modelLoading) {
        rname = '_loading'
      } else if (this.state.modelError) {
        rname = '_error'
        args.error = this.state.modelError
      } else {
        rname = '_index'
        args.model = this.state.model
      }
      route = this.routes[rname] || DEFAULTS[rname]
    }
    if (Array.isArray(route)) {
      args = _.extend(args, route[1].call(this))
      cls = route[0]
    } else {
      cls = route
    }
    var context = this.props.ctx ? _.extend({}, this.props.ctx) : {}
    if (this.getContext) {
      _.extend(context, this.getContext())
    }
    args.ctx = context
    args.goTo = this.goTo
    args._baseroute = (this.props._baseroute ? this.props._baseroute + '/' : '') + rname
    args.ref = '_outlet'
    args.param = rname

    return cls(args)
  },
}

