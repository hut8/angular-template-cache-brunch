'use strict'
import debug from 'debug'
import Minimize from 'minimize'
import promisify from 'es6-promisify-all'

/**
 * @author john
 * @version 11/8/15 3:56 PM
 */

promisify(Minimize.prototype)
let log = debug('angular-template-cache')

class AngularTemplateCacheCompiler {

  type = 'template'
  extension = 'tpl.html'
  module = 'app'
  options = {
    htmlmin: {}
  }

  constructor (config) {
    this.config = config
    this.options = this.config.plugins.angular_templates || this.options
    this.pathTransform = this.options.pathTransform || this._defaultPathTransform
    this.minimize = new Minimize(this.options.htmlmin)
    if (this.options.module) this.module = this.options.module
    log('options', this.options)
  }

  _defaultPathTransform (path) {
    return path
  }

  wrapper (url, html) {
    return `angular.module("${this.module}").run(["$templateCache", $templateCache => {
  ${this.body(this.pathTransform(url), html)}}])
  `
  }

  body (url, html) {
    return `$templateCache.put("${url}",
      "${html}")`
  }

  compile (data, path, callback) {
    log('compile', path)
    this.minimize
      .parseAsync(data)
      .then(minData => callback(null, this.wrapper(path, minData)))
      .catch(err => callback(err, null))
  }

}

AngularTemplateCacheCompiler.prototype.brunchPlugin = true
module.exports = AngularTemplateCacheCompiler
export default AngularTemplateCacheCompiler
