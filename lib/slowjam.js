// slowjam: ScreenSlow Jam the Code
// Copyright (c) 2014 Jason Huggins <jrhuggins@gmail.com>
// License: MIT

var marked = require('marked')
var coffee = require('coffee-script')
var parse = require('esprima').parse
var generate = require('escodegen').generate
var vm = require('vm')
var fs = require('fs')

isLiterate = coffee.helpers.isLiterate
isCoffee = coffee.helpers.isCoffee
isJavaScript = function (file) {
  return /\.js$/.test(file)
}

marked.setOptions({
  renderer: new marked.Renderer(),
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: true,
  smartLists: true,
  smartypants: false
})

function SlowJam() {
  this.slowness = 1000
  this.log = true
  this.fileName = ''
  this.asMarkdown = ''
  this.asMarkdownTokens = []
  this.asCoffeeScript = ''
  this.asJavaScript = ''
  this.asAST = null
}

SlowJam.prototype.load = function(fileName) {
  if (!fileName) {
    return
  } else {
    this.fileName = fileName
  }

  if (isLiterate(fileName)) {
    this.readLitcoffeeFile()
    this.toMarkdownTokens()
    this.convertMarkdownTokens()
    this.toCoffeeScript()
    this.toJavaScript()
    this.toAST()
    return
  }
  
  if (isCoffee(fileName)) {
    this.readCoffeeFile()
    this.toJavaScript()
    this.toAST()
    return
  }
  
  if (isJavaScript(fileName)) {
    this.readJSFile()
    this.toAST()
    return
  }
}

SlowJam.prototype.readLitcoffeeFile = function() {
  this.asMarkdown = fs.readFileSync(this.fileName, {'encoding':'utf8'})
}

SlowJam.prototype.readCoffeeFile = function() {
  this.asCoffeeScript = fs.readFileSync(this.fileName, {'encoding':'utf8'})
}

SlowJam.prototype.readJSFile = function() {
  this.asJavaScript = fs.readFileSync(this.fileName, {'encoding':'utf8'})
}

SlowJam.prototype.toMarkdownTokens = function() {
  this.asMarkdownTokens = marked.lexer(this.asMarkdown)
}

SlowJam.prototype.convertMarkdownTokens = function() {
  this.asMarkdownTokens.forEach( function(token) {
    if (token.type == 'heading') {
      token.type = 'code'
      token.text = 'h' + token.depth + ' "' + token.text + '"'
    }
  })
}

SlowJam.prototype.toCoffeeScript = function() {
  this.asCoffeeScript = ''
  this.asMarkdownTokens.forEach( function(token) {
    if (token.type == 'code') {
      this.asCoffeeScript = this.asCoffeeScript.concat(token.text + '\n')
    }
  }, this)
}


SlowJam.prototype.toJavaScript = function() {
  this.asJavaScript = coffee.compile(this.asCoffeeScript, {bare:true})
}

SlowJam.prototype.toAST = function() {
  this.asAST = parse(this.asJavaScript)
}

SlowJam.prototype.play = function() {
  if (!this.asAST) {
    return
  }

  var log = this.log

  // Create new copy of AST body
  var body = this.asAST.body.slice(0)


  // Initialize the VM sandbox
  initSandbox = {
    'console': console,    
    'print': console.log,
    'require': require  
  }

  // Create the VM context
  context = vm.createContext(initSandbox)

  // Start playing the code -- one chunk at a time  
  playChunk = function(slowness){
    // Get one chunk from the abstract syntax tree
    code_object = body.shift()

    // Convert the chunk into code
    executable_code = generate(code_object)
    if (log) {
      console.log(executable_code)
    }

    // Execute the code
    vm.runInContext(executable_code,context, this.fileName)

    // After a pause, keep jamming until done...
    if (!body.length) {
      return
    } else {
      setTimeout(playChunk, slowness, slowness)
    }
  }
  
  playChunk(this.slowness)

}

module.exports.SlowJam = SlowJam

