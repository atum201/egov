'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFileTypeFA = exports.updateRecent = exports.monthindex = exports.monthdiff = exports.daydiff = exports.minutediff = exports.randomchar = exports.randomString = undefined;

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _constant = require('./constant');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

var updateRecent = exports.updateRecent = function updateRecent(recent, id, type) {
  var r = [];
  for (var i = 0; i < recent.length; i++) {
    if (recent[i].id == id) r.push(recent[i]);
  }
  if (r.length == 0) {
    recent.push({ id: id, unread: 1, last: new Date().getTime(), type: type || "user" });
  } else if (r.length == 1) {
    var _i = _lodash2.default.findIndex(recent, function (r) {
      return r.id.trim() == id;
    });
    recent[_i].unread = recent[_i].unread + 1;
    recent[_i].last = new Date().getTime();
  } else {
    var last = r[0];
    for (var _i2 = 0; _i2 < r.length; _i2++) {
      if (last.last < r[_i2].last) last = r[_i2];
    }last.unread = last.unread + 1;
    last.last = new Date().getTime();
    _lodash2.default.remove(recent, function (r) {
      return r.id == id;
    });
    recent.push(last);
  }
  return recent.sort(function (r1, r2) {
    return r1.last < r2.last;
  });
};

var getFileTypeFA = exports.getFileTypeFA = function getFileTypeFA(mimetype) {
  var r = "fa-file-o";
  for (var i = 1; i < _constant.fileTypeFA.length; i++) {
    for (var j = 0; j < _constant.fileTypeFA[i].length; j++) {
      if (_constant.fileTypeFA[i][j] == mimetype) r = _constant.fileTypeFA[0][i];
    }
  }return r;
};
//# sourceMappingURL=util.js.map
