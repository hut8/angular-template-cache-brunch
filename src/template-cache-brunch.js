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

    if ((config.plugins || {}).angular_templates) this.options = this.config.plugins.angular_templates

    if (this.options.module) this.module = this.options.module

    this.pathTransform = this.options.pathTransform || this._defaultPathTransform
    this.minimize = new Minimize(this.options.htmlmin)

    this.tplPath = this._setTemplatesPath(config)
    log('options', this.options)
  }

  _setTemplatesPath (config) {
    let tplPath = null
    try {
      let keys = Object.keys(config.files.templates.joinTo)
      tplPath = `${config.paths.public || 'public'}/${keys[0]}`
    } catch (e) {}
    return tplPath
  }

  _defaultPathTransform (path) {
    return path
  }

  wrapper (url, html) {
    return `
angular.module("${this.module}").run(["$templateCache", function($templateCache) {
  ${this.body(this.pathTransform(url.replace(/\\/g, "/")), html)}}
])`
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

  onCompile (generatedFiles) {

  }

}

AngularTemplateCacheCompiler.prototype.brunchPlugin = true
module.exports = AngularTemplateCacheCompiler
export default AngularTemplateCacheCompiler
