#!/usr/bin/env node
var DebugServer = require('node-inspector/lib/debug-server');
var spawn = require('child_process').spawn;
var open = require('open');

spawn('node', ['--debug-brk'].concat(process.argv.slice(2)));

var debugServer = new DebugServer();

debugServer.on('close', function () {
  console.log('session closed');
  process.exit();
});

debugServer.start({
  webPort: 8080,
  debugPort: 5858
});

open('http://localhost:8080/debug?port=5858');
