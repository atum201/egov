'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PhancapEgovType = require('../types/PhanCapEgovType');

var _chatEgov = require('../../models/chatEgov');

var _mongodb = require('mongodb');

var _graphql = require('graphql');

var phancap = {
  type: _PhancapEgovType.PhanCapType,
  resolve: function resolve() {
    return _chatEgov.PhanCap.getLast({}).then(function (phancap) {
      return phancap;
    }).error(function (e) {});
  }
};
// import PhanCap from '../../models/phancap'
exports.default = phancap;
module.exports = exports['default'];
//# sourceMappingURL=phancapEgov.js.map
