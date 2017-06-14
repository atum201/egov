"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var whitelist = ["http://123.30.190.143:7777", "http://123.31.10.29:3000", "123.30.190.143:7777", "123.31.10.29:3000", "10.145.37.72", "http://10.145.37.72"];
// let whitelist = ["http://thongtinnoibo.mic.gov.vn","http://my.thongtinnoibo.mic.gov.vn","http://my.mic.gov.vn","thongtinnoibo.mic.gov.vn","my.thongtinnoibo.mic.gov.vn","my.mic.gov.vn"];
// let whitelist = ["http://localhost:3000","http://localhost:3000/graphql","http://localhost:2000"];

exports.default = {
  origin: function origin(_origin, callback) {
    var originIsWhitelisted = whitelist.indexOf(_origin) !== -1;
    callback(originIsWhitelisted ? null : 'Bad Request', originIsWhitelisted);
  }
};
module.exports = exports['default'];
//# sourceMappingURL=cors.js.map
