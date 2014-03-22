#!/usr/bin/env node
"use strict";

var 
  progress = require('progress'),
  util = require('util'),
  encode = require('./routes/encode');

var
  bar = new progress('encoding :bar :percent :elapseds elapsed', 10);

console.log(util.inspect(encode()));