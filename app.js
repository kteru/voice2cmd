'use strict';

var FILE_CONFIG = __dirname + '/config.json';

// 標準モジュールのロード
var util = require('util');
var net = require('net');
var child_process = require("child_process");

// 追加モジュールのロード
var async = require('async');
var JuliusDict = require("./JuliusDict");
var JuliusXmlHandler = require('./JuliusXmlHandler');

// 設定ファイルのロード
var config = require(FILE_CONFIG);

var juliusProc = null;
var cmdProc = null;
var connection = null;
var juliusXmlHandler = null;


function makeDictionary() {
  var juliusDict = new JuliusDict(config.julius.dictPath);

  var vtc = config.voiceToCmds;
  for (var i = 0; vtc.length > i; i++) {
    juliusDict.add(vtc[i].name, vtc[i].voice);
  }

  juliusDict.make();
  util.log('INFO: ' + 'generated dictionary');
}

function startJulius() {
  var cmd  = config.julius.binPath;
  var args = [
    '-C', config.julius.jconfPath,
    '-w', config.julius.dictPath,
    '-module', config.julius.port
  ];
  util.log('INFO: ' + 'starting julius');
  juliusProc = child_process.spawn(cmd, args);
  util.log('SPAWN: ' + cmd + ' ' + args.join(' ') + ' (pid=' + juliusProc.pid + ')');
}

function main() {
  util.log('INFO: ' + 'connecting to julius');

  connection = net.connect({host: '127.0.0.1', port: config.julius.port});

  connection.on('error', function (error) {
    util.log('ERROR: ' + error);
    setTimeout(main, 500);
  });

  connection.on('connect', function () {
    util.log('INFO: ' + 'connected to julius');

    juliusXmlHandler = new JuliusXmlHandler(connection);
    juliusXmlHandler.on('recognition', function (string) {
      util.log('INFO: ' + 'recognized ' + string);

      var vtc = config.voiceToCmds;
      for (var i = 0; vtc.length > i; i++) {
        if (string === vtc[i].name) {
          var cmd  = vtc[i].cmd.split(' ')[0];
          var args = vtc[i].cmd.replace(/[^ ]+ /, '').split(' ');
          cmdProc = child_process.spawn(cmd, args);
          util.log('SPAWN: ' + cmd + ' ' + args.join(' ') + ' (pid=' + cmdProc.pid + ')');
        }
      }
    });
  });
}

async.series([
  makeDictionary(),
  startJulius(),
  main()
]);

