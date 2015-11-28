
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](http://standardjs.com/)
[![Coverage Status](https://coveralls.io/repos/j-walker23/angular-template-cache-brunch/badge.svg?branch=2.0.4&service=github)](https://coveralls.io/github/j-walker23/angular-template-cache-brunch?branch=2.0.4)
[![Build Status](https://travis-ci.org/j-walker23/angular-template-cache-brunch.svg?branch=master)](https://travis-ci.org/j-walker23/angular-template-cache-brunch)
[![Dependency Status](https://david-dm.org/j-walker23/angular-template-cache-brunch.svg)](https://david-dm.org/j-walker23/angular-template-cache-brunch)

# Angular TemplateCache plugin for brunch


Mimics [gulp-angular-templatecache](https://github.com/miickel/gulp-angular-templatecache) behavior for brunch.
For the most part at least.
This compiles all partial templates into one file, using one module, which should be the one main module of your angular app.
Things are much simpler this way when it comes to the cool stuff.

**The reason for the single module it to allow easy integration with npm enabled es6 module oriented brunch configuration.**
This is actually the whole reason why i reinvented the wheel with this brunch plugin.

## Installation
`npm i -S angular-template-cache-brunch`

**NOTE: In order for this plugin to recognize templates, they must have a .tpl.html extension.**

## Usage

### - templates joinTo
Set `joinTo` attribute for `templates` in `brunch-config.coffee`, e.g.

```coffee
templates:
  joinTo:
    'js/templates.js': /^app/
```

### - markup
In your markup, include `js/templates.js`:

```html
<script type="text/javascript" src="js/templates.js"></script>
```

### - angular usage
Use a templateUrl in something like ui.router's awesome state based system

```javascript
angular.module('app').config($stateProvider => {
  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'home.tpl.html'
    })
})
```

### - profit
Run Brunch (e.g. `brunch build`)



## Options

### - module
Default module name is `app`. Configurable in the plugins section of brunch-config.coffee

```coffee
plugins:
  angular_templates:
    module: 'myApp'
```

### - transform path
Optional path transform function

```coffee
plugins:
  angular_templates:
    pathTransform: (path) ->
     path.replace 'my/boring/initial/path', ''
```

### - htmlmin
We use defaults of `npm i -S minimize` for htmlmin of the templates.

```coffee
plugins:
  angular_templates:
    htmlmin:
      empty: true
```

## Example Output
All templates end up as a bunch of angular module getters with a run component injecting $templateCache

```javascript
(function() {
angular.module("app").run(["$templateCache", function($templateCache) {
  $templateCache.put("app/first.tpl.html",
    "<div id=first class=hotshit></div>")}])
})()

(function() {
angular.module("app").run(["$templateCache", $templateCache => {
  $templateCache.put("app/second/deeper.tpl.html",
    "<div id=second class=coolshit></div>")}])
})()
```


## Dev

1. src is a small es6 class with some experimental es7 shit. Uses new babel6 to build.
   Sorry if that pisses someone off. I really wanted to use the class properties for some reason.

2. `npm run build` will build src dir into es5 and stick into `lib`

## Holy shit tests

1. Sadly, this is pretty much my first actual testing of pretty much anything client side i have ever wrote.   
  2. Standard `mocha` setup, i don't like the nested describe/it blocks with global state so the ui is `qunit`  

  1. `npm test` or to watch `npm run bdd`. Uses a nice spec reporter i stole from one of the geniuses in the node community.
   There are so many of them i can't remember which one. 
   
  1. This now includes coveralls and at the mean time has 100% coverage

