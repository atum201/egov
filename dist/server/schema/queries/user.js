'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userById = exports.user = exports.users = undefined;

var _OutputType = require('../types/OutputType');

var _chatEgov = require('../../models/chatEgov');

var _graphql = require('graphql');

// import User from '../../models/user';
var users = exports.users = {
  type: new _graphql.GraphQLList(_OutputType.UserType),
  args: {
    q: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref) {
    var q = _ref.q;

    var options = JSON.parse(q);
    return _chatEgov.User.list(options).then(function (users) {
      return users;
    }).error(function (e) {});
  }
};

var user = exports.user = {
  type: _OutputType.UserType,
  args: {
    q: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref2) {
    var q = _ref2.q;

    return _chatEgov.User.findOneAsync({ userId: q }).then(function (user) {
      return user;
    }).error(function (e) {});
  }
};

var userById = exports.userById = {
  type: _OutputType.UserType,
  args: {
    q: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref3) {
    var q = _ref3.q;

    return _chatEgov.User.get(q).then(function (user) {
      return user;
    }).error(function (e) {});
  }
};
//# sourceMappingURL=user.js.map
