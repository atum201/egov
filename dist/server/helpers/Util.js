'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var randomString = exports.randomString = function randomString(L) {
  var s = '';
  while (s.length < L) {
    s += randomchar();
  }return s;
};

var randomchar = exports.randomchar = function randomchar() {
  var n = Math.floor(Math.random() * 62);
  if (n < 10) return n; //1-10
  if (n < 36) return String.fromCharCode(n + 55); //A-Z
  return String.fromCharCode(n + 61); //a-z
};

var minutediff = exports.minutediff = function minutediff(first) {
  var second = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Date().getTime();

  if (first) return (second - first) / (1000 * 60);
  return 0;
};

var daydiff = exports.daydiff = function daydiff(first, second) {
  return (second - first) / (1000 * 60 * 60 * 24);
};

var monthdiff = exports.monthdiff = function monthdiff(first, second) {
  return monthindex(second) - monthindex(first);
};

var monthindex = exports.monthindex = function monthindex(millisecond) {
  var year = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2017;
  var month = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 5;

  var date = new Date(millisecond);
  return (date.getFullYear() - year) * 12 + date.getMonth() - month;
};
//# sourceMappingURL=Util.js.map
