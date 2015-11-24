/**
 * @author john
 * @version 11/9/15 11:18 AM
 */
let tplPath = 'public/js/templates.js'

export default {
  setup: {
    module: 'app',
    tplPath: tplPath,
    transform: {
      files: {templates: {joinTo: {}}}, plugins: {
        angular_templates: {
          pathTransform (path) {
            return path.replace(/(.*)\.tpl\.html/, '$1')
          }
        }
      }
    }
  },
  templates: {
    body: '$templateCache.put("test/path.tpl.html",\n      "<div class="s" class></div>")'
  },
  compile: {
    inHtml: '<div class="s" class></div>',
    path: 'test/path.tpl.html',
    outHtml: '(function() {\n    angular.module("app").run(["$templateCache", function($templateCache) {\n  $templateCache.put("test/path.tpl.html",\n      "<div class=s></div>")}])\n  })()\n  ',
    err: 'fuck'
  },

  bare: {
    templates: {
      joinTo: {}
    }
  },



  config: {
    npm: {
      enabled: true
    },
    paths: {
      "public": 'public'
    },
    files: {
      javascripts: {
        joinTo: {
          'js/globals.js': /^node_modules\/(jquery|lodash)\//,
          'js/angular.js': /^node_modules\/angular\//,
          'js/nodes.js': /^node_modules\/(?!angular|jquery)/,
          'js/bowers.js': /^bower_components\//,
          'js/app.js': /^app\//
        }
      },
      stylesheets: {
        joinTo: {
          'app.css': /^(node_modules|bower_components|app)/
        }
      },
      templates: {
        joinTo: {
          'js/templates.js': /^app\//
        }
      }
    },
    plugins: {
      angular_templates: {
        module: 'app'
      }
    }
  }
};

