/*
 * enables jsdom globally.
 */

var KEYS = require('./keys')

var defaultHtml = '<!doctype html><html><head><meta charset="utf-8">' +
  '</head><body></body></html>'

module.exports = function globalJsdom (html, options) {
  if (html === undefined) {
    html = defaultHtml
  }

  if (options === undefined) {
    options = {}
  }

  // Idempotency
  if (global.navigator &&
    global.navigator.userAgent &&
    global.navigator.userAgent.indexOf('Node.js') > -1 &&
    global.document &&
    typeof global.document.destroy === 'function') {
    return global.document.destroy
  }

  var jsdom = require('jsdom')
  var jsdomInstance = new jsdom.JSDOM(html, options)
  var window = jsdomInstance.window

  KEYS.forEach(function (key) {
    global[key] = window[key]
  })

  global.jsdom = jsdomInstance
  global.document = window.document
  global.window = window
  window.console = global.console
  jsdomInstance.destroy = cleanup

  function cleanup () {
    KEYS.forEach(function (key) { delete global[key] })
  }

  return cleanup
}
