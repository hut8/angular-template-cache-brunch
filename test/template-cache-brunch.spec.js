import Plugin from '../src/template-cache-brunch'
import data from './template-cache-brunch.data'
import onCompileData from './on-compile.data'
import Minimize from 'minimize'
import debug from 'debug'
import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import sinonPromise from 'sinon-stub-promise'
import _ from 'lodash'

let should = chai.should()
chai.use(sinonChai)
sinonPromise(sinon)
let log = debug('angular-template-cache')
log.log = console.log.bind(console)

/**
 * @author john
 * @version 11/9/15 3:10 AM
 */


let plugin = new Plugin(data.config)

suite('- Setup')
test('- initial class properties', done => {
  plugin.brunchPlugin.should.eql(true)
  plugin.type.should.eql('template')
  plugin.extension.should.eql('tpl.html')
  plugin.module.should.eql(data.config.plugins.angular_templates.module)
  done()
})

test('- default pathTransform', () => {
  plugin.pathTransform('default').should.equal('default')
})

test('- custom pathTransform', () => {
  let plugin = new Plugin(data.setup.transform)
  plugin.pathTransform('test.tpl.html').should.eql('test')
})

test('- no plugin options', () => {
  let plugin = new Plugin(data.bare)
  //plugin.options.should.contain({htmlmin: {}})
})

test('- set normal tplPath', () => {
  plugin._setTemplatesPath(data.config).should.eql('public/js/templates.js')
})

test('- tplPath is null on err', () => {
  let plugin = new Plugin(data.bare)
  plugin._setTemplatesPath({})
  should.not.exist(plugin.tplPath)
})

test('- tplPath uses default public', () => {
  let plugin = new Plugin(data.bare)
  let tplPath = plugin._setTemplatesPath({paths: {}, files: {templates: {joinTo: {temps: ''}}}})
  tplPath.should.eql('public/temps')
})

suite('- Templates')
test('- format $templateCache', () => {
  let {inHtml, path} = data.compile
  let {body} = data.templates
  let result = plugin.body(path, inHtml)
  result.should.equal(body)
})


suite('- Compile')
test('- htmlmin and wrapper template', done => {

  plugin.minimize.should.be.instanceOf(Minimize)

  let {inHtml, outHtml, path} = data.compile

  plugin.compile(inHtml, path, (err, resp) => {
    log(err, resp)
    resp.should.equal(outHtml)
    return done(err)
  })
})

test('- err callback on htmlmin#parse', done => {
  let minStub = sinon.stub(plugin.minimize, 'parseAsync').returnsPromise()

  minStub.rejects(new Error('invalid html'))

  plugin.compile(data.compile.err, 'path.tpl.html', (err, resp) => {
    let e = _.attempt(() => {
      err.should.be.instanceOf(Error)
      should.not.exist(resp)
      minStub.restore()
    })
    done(e)
  })
})

suite('- On Compile')
test('- write reg wrapper on template', () => {
  let plugin = new Plugin(data.config)
  let {raw, out} = onCompileData

  let result = plugin.writeModuleReg(raw)
  log('REG RESULT', result)
  result.should.eql(out)
})

test('- onCompile writes a file', () => {
  return plugin.onCompile().should.be.fulfilled
})

test('- does not duplicate require.register', () => {
  let {out} = onCompileData
  plugin.writeModuleReg.bind(plugin, out).should.throw('Preventing duplication of register wrapper')
})
