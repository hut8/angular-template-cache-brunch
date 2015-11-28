'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _minimize = require('minimize');

var _minimize2 = _interopRequireDefault(_minimize);

var _es6PromisifyAll = require('es6-promisify-all');

var _es6PromisifyAll2 = _interopRequireDefault(_es6PromisifyAll);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var fs = (0, _es6PromisifyAll2.default)(require('fs'));

/**
 * @author john
 * @version 11/8/15 3:56 PM
 */

(0, _es6PromisifyAll2.default)(_minimize2.default.prototype);
var log = (0, _debug2.default)('angular-template-cache');

var REG_PAT = /^(\sangular[\s\S]+)(\s;)/m;
var HEAD = '\nrequire.register("templates", function(exports, require, module) {\n';
var FOOT = '});\n';
var BODY = HEAD + '$1\n' + FOOT + '$2';

var AngularTemplateCacheCompiler = (function () {
  function AngularTemplateCacheCompiler(config) {
    _classCallCheck(this, AngularTemplateCacheCompiler);

    this.type = 'template';
    this.extension = 'tpl.html';
    this.module = 'app';
    this.options = {
      htmlmin: {},
      quoteChar: '"'
    };
    this.compCount = 0;

    this.config = config;

    if ((config.plugins || {}).angular_templates) Object.assign(this.options, this.config.plugins.angular_templates);

    if (this.options.module) this.module = this.options.module;

    this.pathTransform = this.options.pathTransform || this._defaultPathTransform;
    this.minimize = new _minimize2.default(this.options.htmlmin);

    this.tplPath = this._setTemplatesPath(config);
    this._setEscapeChars();
    log('options', this.options);
  }

  _createClass(AngularTemplateCacheCompiler, [{
    key: '_setEscapeChars',
    value: function _setEscapeChars() {
      this.options.bsRegexp = new RegExp('\\\\', 'g');
      this.options.quoteRegexp = new RegExp('\\' + this.options.quoteChar, 'g');
      this.options.nlReplace = '\\n' + this.options.quoteChar + ' +\n' + this.options.quoteChar;
    }
  }, {
    key: '_setTemplatesPath',
    value: function _setTemplatesPath(config) {
      var tplPath = null;
      try {
        var keys = Object.keys(config.files.templates.joinTo);
        tplPath = (config.paths.public || 'public') + '/' + keys[0];
      } catch (e) {}
      return tplPath;
    }
  }, {
    key: '_defaultPathTransform',
    value: function _defaultPathTransform(path) {
      return path;
    }
  }, {
    key: 'wrapper',
    value: function wrapper(url, html) {
      log('url', url);
      var path = this.pathTransform(url.replace(/\\/g, "/"));
      log('path', path);
      return '\nangular.module("' + this.module + '").run(["$templateCache", function($templateCache) {\n  ' + this.body(path, html) + '}\n])';
    }
  }, {
    key: 'body',
    value: function body(url, html) {
      return '$templateCache.put("' + url + '",\n    "' + this.escapeContent(html) + '")';
    }
  }, {
    key: 'compile',
    value: function compile(data, path, callback) {
      var _this = this;

      log('compile', path);
      this.minimize.parseAsync(data).then(function (minData) {
        return callback(null, _this.wrapper(path, minData));
      }).catch(function (err) {
        return callback(err, null);
      });
    }
  }, {
    key: 'onCompile',
    value: function onCompile() {
      var _this2 = this;

      log('onCompile', this.compCount++);
      log('tplPath', this.tplPath);

      return fs.readFileAsync(this.tplPath, 'utf-8').then(function (raw) {
        return _this2.writeModuleReg(raw);
      }).then(function (data) {
        return fs.writeFileAsync(_this2.tplPath, data, 'utf-8');
      }).catch(function (err) {
        return log('err', err);
      });
    }
  }, {
    key: 'writeModuleReg',
    value: function writeModuleReg(raw) {
      log('raw len', raw.length);

      if (!raw) throw new Error('No data in ' + this.tplPath);

      if (/require.register\(/.test(raw)) throw new Error('Preventing duplication of register wrapper');

      var data = raw.replace(REG_PAT, BODY);
      return data;
    }
  }, {
    key: 'escapeContent',
    value: function escapeContent(content) {
      return content.replace(this.options.bsRegexp, '\\\\').replace(this.options.quoteRegexp, '\\' + this.options.quoteChar).replace(/\r?\n/g, this.options.nlReplace);
    }
  }]);

  return AngularTemplateCacheCompiler;
})();

AngularTemplateCacheCompiler.prototype.brunchPlugin = true;
module.exports = AngularTemplateCacheCompiler;
exports.default = AngularTemplateCacheCompiler;