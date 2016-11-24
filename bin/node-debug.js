#!/usr/bin/env node
var DebugServer = require('node-inspector/lib/debug-server').DebugServer;
var config = require('node-inspector/lib/config');
var cp = require('child_process');
var watch = require('watch');
var open = require('open');

var args = ['--debug-brk=' + config.debugPort].concat(process.argv.slice(2));

/*
  Lanch inspector
*/

createInspectorServer();

/*
  Watch file change  
*/

createMonitor(spawn);

/*
  Launches a new process
*/

spawn();

/*
  open a window
*/

open('http://localhost:' + config.webPort + '/debug?port=' + config.debugPort);

function createInspectorServer () {
  var debugServer = new DebugServer();
  debugServer.on('close', function () {
    console.log('[node-debug] session closed');
    process.exit();
  });
  debugServer.start(config);
}

function createMonitor(cb) {
  watch.createMonitor(process.cwd(), {
    ignoreDotFiles: true,
    interval: 1000
  }, function(monitor) {
    monitor.on('created', cb);
    monitor.on('changed', cb);
  });
}

var proc;
function spawn() {
  if (proc) {
    proc.kill();
    console.log('[node-debug] kill child process ' + proc.pid);
  }
  proc = cp.spawn('node', args, {stdio: 'inherit'});
  console.log('[node-debug] fork child process ' + proc.pid);
}
