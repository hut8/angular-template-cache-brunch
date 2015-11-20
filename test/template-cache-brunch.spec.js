import Plugin from '../src/template-cache-brunch'
import data from './template-cache-brunch.data'
import Minimize from 'minimize'
import debug from 'debug'
import * as chai from 'chai'
chai.config.includeStack = true;
chai.should()
let log = debug('angular-template-cache')
log.log = console.log.bind(console)

/**
 * @author john
 * @version 11/9/15 3:10 AM
 */


let plugin = new Plugin(data.config)

suite('- Setup')
test('initial class properties', done => {
  let {module, tplPath} = data.setup
  plugin.brunchPlugin.should.eql(true)
  plugin.type.should.eql('template')
  plugin.extension.should.eql('tpl.html')
  plugin.module.should.eql(data.config.plugins.angular_templates.module)
  done()
})

test('default pathTransform', () => {
  plugin.pathTransform('default').should.equal('default')
})

test('custom pathTransform', () => {
  let plugin = new Plugin(data.setup.transform)
  plugin.pathTransform('test.tpl.html').should.eql('test')
})

test('no plugin options', () => {
  let plugin = new Plugin(data.bare)
  plugin.options.should.eql({htmlmin: {}})
})

suite('- Templates')
test('format $templateCache', () => {
  let {inHtml, outHtml, path} = data.compile
  let {body} = data.templates
  let result = plugin.body(path, inHtml)
  result.should.equal(body)
})


suite('- Compile')
test('htmlmin and wrapper template', done => {

  plugin.minimize.should.be.instanceOf(Minimize)

  let {inHtml, outHtml, path} = data.compile

  plugin.compile(inHtml, path, (err, resp) => {
    log(err, resp)
    resp.should.equal(outHtml)
    return done(err)
  })
})

