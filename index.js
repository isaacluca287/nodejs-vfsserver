#!/usr/bin/env babel-node

require('./helper')
let fs = require('fs').promise
let path = require('path')
let express = require('express')
let PromiseRouter = require('express-promise-router')
let morgan = require('morgan')
let trycatch = require('trycatch')
let bodyParser = require('body-parser')

async function main() {
    let app = express()

    app.use(morgan('dev'))
    app.use((err, req, res, next) => {
        console.error(err.stack);
        res.status(500).end('Something broke!');
    })

    app.get('*', read)
    app.put('*', bodyParser.raw({ type: '*/*' }), create)
    app.post('*', bodyParser.raw({ type: '*/*' }), update)
    app.delete('*', remove)
    // app.get('/hello', read)

    let port = 8000
    await app.listen(port)
    console.log(`LISTENING @ http://127.0.0.1:${port}`)
}

async function routeHandlerName(req, res) {
  res.end("hello\n")
}

async function read(req, res) {
  let filePath = path.join(__dirname, 'files', req.url)
  fs.readFile(filePath).then((result) => {
    res.end(result)
  })
}

async function create(req, res) {
  let filePath = path.join(__dirname, 'files', req.url)
  let data = await fs.open(filePath, "wx")

  // if (req.body !== {}) {
  //   let data = await fs.writeFile(filePath, req.body)
  // }

  res.end("create file okay\n")
}

async function update(req, res) {
  let filePath = path.join(__dirname, 'files', req.url)
  let data = await fs.writeFile(filePath, req.body)
  res.end("update file okay\n")
}

async function remove(req, res) {
  let filePath = path.join(__dirname, 'files', req.url)
  let data = await fs.unlink(filePath)
  res.end("delete file okay\n")
}

main()
