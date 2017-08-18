import path from 'path'

var watching = false
var watchDir = `${process.env.USERPROFILE}\\Saved Games\\Frontier Developments\\Elite Dangerous`
var watchFile = ''
var fs
if (!process.env.IS_WEB) {
  var fs = require('fs')
}

export function watchEliteDangerousLog(cb) {
  if (!/^win/.test(process.platform)) {
    return
  }

  fs.readdir(watchDir, (err, files) => {
    if (err) { throw err }
    var latest
    if (latest = getLatestLogFile(files, watchDir)) {
      watchFileForEvents(`${watchDir}\\${latest}`, cb)
    }
  })
}

export function stopWatching() {
  if (watching) {
    fs.unwatchFile(watchFile)
    watchFile = ''
    watching = false
  }
}

function watchFileForEvents(filename, cb) {
  if (filename && !watching) {
    readFile(filename, cb)
    fs.watchFile(filename, function (curr, prev) {
      watching = true
      watchFile = filename
      if (curr.mtime > prev.mtime) {
        readEvent(filename, cb)
      }
    })
  }
}
function readFile(filename, cb) {
  var events = fs.readFileSync(filename).toString().trim().split('\n')
  events.forEach(item => {
    processEvent(item, cb)
  })
}

function readEvent(filename, cb) {
  fs.readFile(filename, 'utf-8', (err, data) => {
    if (err) throw err
    processEvent(data.trim().split('\n').slice(-1)[0], cb)
  })
}

function processEvent(event, cb) {
  var type = event.split(',')[1].split(':')[1].trim()
  if (type === `"Location"` || type === `"FSDJump"`) {
    var record = JSON.parse(event)
    cb(record)
  }
}

function getLatestLogFile(files, watchDir) {
  var found = []
  if (files.length === 0) return
  files.forEach(function (file) {
    var fi = fs.statSync(`${watchDir}/${file}`)
    if (fi.isFile()) {
      found.push({ "file": file, modified: fi.mtime.getTime() })
    }
  })
  found.sort((a, b) => b.modified - a.modified)
  return found[0].file
}
