'use strict';

// 標準モジュールのロード
var util = require('util');
var readline = require('readline');
var EventEmitter = require('events').EventEmitter;

// 追加モジュールのロード
var xml2js = require('xml2js');


var JuliusXmlHandler = function (stream) {
  var self = this;

  var rl = readline.createInterface(stream, {});
  var string = '';

  rl.on('line', function (line) {
    if (line.indexOf('<WHYPO') !== -1) {
      xml2js.parseString(line, {strict: false, explicitArray: true}, function (err, data) {
        string = data.WHYPO.$.WORD;
        self.emit('recognition', string);
      });
    }
  });
};

util.inherits(JuliusXmlHandler, EventEmitter);
module.exports = JuliusXmlHandler;

