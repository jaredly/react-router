
module.exports = {
  parse: parse,
  stringify: stringify,
  routeToRegExp: routeToRegExp
}

// based on backbone's route to regex method
var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

function routeToRegExp(pattern, args) {
  function replacer(match, name) {
    var type = args[name]
    if (type && type.type) type = type.type
    if (!type || !type.match) {
      return '([^\/]+)'
    }
    if ('string' !== typeof type.match) {
      console.error('Arg type.match must be a string', name, type.match)
      throw new Error('arg type.match must be a string')
    }
    return '(' + type.match + ')'
  }
  pattern = pattern.replace(escapeRegExp, '\\$&')
                .replace(/:(\w+)/g, replacer)
                .replace(/\*\w+/g, '(.*?)');
  return new RegExp('^' + pattern + '$');
}

function parse(name, value, parser) {
  if (!parser) return value
  if (parser.type) parser = parser.type
  if (parser === Date) {
    return new Date(value)
  }
  if (parser === Number) {
    return Number(value)
  }
  if (parser.parse) {
    return parser.parse(value)
  }
  console.warn('Parsing unknown argument type', name, value, parser)
  return value
}

function stringify(name, value, parser) {
  if (!parser) return value + ''
  if (parser.type) parser = parser.type
  if (parser === Date) {
    return new Date(value).getTime()
  }
  if (parser === Number) {
    return value + ''
  }
  if (parser.stringify) {
    return parser.stringify(value)
  }
  console.warn('Stringifying unknown argument type', name, value, parser)
  return value + ''
}
