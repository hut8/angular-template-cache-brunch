/**
 * @author john
 * @version 11/9/15 11:18 AM
 */
let tplPath = 'public/js/templates.js'

export default {
  setup: {
    module: 'app',
    tplPath: tplPath
  },
  templates: {
    body: '$templateCache.put("test/path.tpl.html",\n      "<div class="s" class></div>")'
  },
  compile: {
    inHtml: '<div class="s" class></div>',
    path: 'test/path.tpl.html',
    outHtml: 'angular.module("app").run(["$templateCache", $templateCache => {\n  $templateCache.put("test/path.tpl.html",\n      "<div class=s></div>")}])\n  '
  },

  onCompile: {
    files: [{path: tplPath}]
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

