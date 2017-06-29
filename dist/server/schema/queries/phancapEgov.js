'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PhanCapEgovType = require('../types/PhanCapEgovType');

var _chatEgov = require('../../models/chatEgov');

var _mongodb = require('mongodb');

var _graphql = require('graphql');

var phancap = {
  type: _PhanCapEgovType.PhanCapType,
  resolve: function resolve() {
    return _chatEgov.PhanCap.getLast({}).then(function (phancap) {
      return phancap;
    }).error(function (e) {});
  }
};

exports.default = phancap;
module.exports = exports['default'];
//# sourceMappingURL=phancapEgov.js.map
