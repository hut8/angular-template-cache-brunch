/**
 * @author john
 * @version 11/24/15 7:29 PM
 */


export default {
  raw: `(function() {
  'use strict';
})();

angular.module("app").run(["$templateCache", function($templateCache) {
])
;require('angular');
//# sourceMappingURL=templates.js.map
`,

  out: `(function() {\n  \'use strict\';\n})();\n\nrequire.register("templates", function(exports, require, module) {\n\nangular.module("app").run(["$templateCache", function($templateCache) {\n])\n});\n\n;require(\'angular\');\n//# sourceMappingURL=templates.js.map\n`

}
