'use strict'
import debug from 'debug'
import Minimize from 'minimize'
import promisify from 'es6-promisify-all'
let fs = promisify(require('fs'))


/**
 * @author john
 * @version 11/8/15 3:56 PM
 */

promisify(Minimize.prototype)
let log = debug('angular-template-cache')

const REG_PAT = /^(\sangular[\s\S]+)(\s;)/m
const HEAD = '\nrequire.register("templates", function(exports, require, module) {\n'
const FOOT = '});\n'
const BODY = `${HEAD}$1\n${FOOT}$2`

class AngularTemplateCacheCompiler {

  type = 'template'
  extension = 'tpl.html'
  module = 'app'
  options = {
    htmlmin: {},
    quoteChar: '"'
  }
  compCount = 0

  constructor (config) {
    this.config = config

    if ((config.plugins || {}).angular_templates) Object.assign(this.options, this.config.plugins.angular_templates)

    if (this.options.module) this.module = this.options.module

    this.pathTransform = this.options.pathTransform || this._defaultPathTransform
    this.minimize = new Minimize(this.options.htmlmin)

    this.tplPath = this._setTemplatesPath(config)
    this._setEscapeChars()
    log('options', this.options)
  }

  _setEscapeChars () {
    this.options.bsRegexp = new RegExp('\\\\', 'g');
    this.options.quoteRegexp = new RegExp('\\' + this.options.quoteChar, 'g');
    this.options.nlReplace = '\\n' + this.options.quoteChar + ' +\n' + this.options.quoteChar;
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
    log('url', url)
    let path = this.pathTransform(url.replace(/\\/g, "/"))
    log('path', path)
    return `
angular.module("${this.module}").run(["$templateCache", function($templateCache) {
  ${this.body(path, html)}}
])`
  }

  body (url, html) {
    return `$templateCache.put("${url}",
    "${this.escapeContent(html)}")`
  }

  compile (data, path, callback) {
    log('compile', path)
    this.minimize
      .parseAsync(data)
      .then(minData => callback(null, this.wrapper(path, minData)))
      .catch(err => callback(err, null))
  }

  onCompile () {
    log('onCompile', this.compCount)
    log('tplPath', this.tplPath)

    return fs.readFileAsync(this.tplPath, 'utf-8')
      .then(raw => this.writeModuleReg(raw))
      .then(data => fs.writeFileAsync(this.tplPath, data, 'utf-8'))
      .catch(err => {
        if (this.compCount) {
          this.compCount = 0
          log('err', err)
        } else {
          this.compCount++
          setTimeout(() => this.onCompile(), 1000)
        }
      })
  }

  writeModuleReg (raw) {
    log('raw len', raw.length)

    if (!raw) throw new Error('No data in ' + this.tplPath)

    if (/require.register\(/.test(raw)) throw new Error('Preventing duplication of register wrapper')

    let data = raw.replace(REG_PAT, BODY)
    return data
  }

  escapeContent (content) {
    return content.replace(this.options.bsRegexp, '\\\\').replace(this.options.quoteRegexp, '\\' + this.options.quoteChar).replace(/\r?\n/g, this.options.nlReplace);
  }
}

AngularTemplateCacheCompiler.prototype.brunchPlugin = true
module.exports = AngularTemplateCacheCompiler
export default AngularTemplateCacheCompiler

