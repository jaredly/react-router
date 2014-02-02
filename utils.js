
module.exports = {
  parse: parse,
  stringify: stringify
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
