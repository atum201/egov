'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongodb = require('mongodb');

var _graphql = require('graphql');

var _OutputType = require('../types/OutputType');

var _constant = require('../../common/constant');

var _variable = require('../../common/variable');

var _chatEgov = require('../../models/chatEgov');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var g = {
  type: new _graphql.GraphQLInputObjectType({
    name: "groupInput",
    fields: {
      id: { type: _graphql.GraphQLString },
      title: { type: _graphql.GraphQLString },
      creater: { type: _graphql.GraphQLString },
      member: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
      action: { type: _graphql.GraphQLString }
    }
  }) };

var updateGroup = {
  type: _OutputType.GroupType,
  args: {
    g: g
  },
  resolve: function resolve(root, _ref) {
    var g = _ref.g;

    if (g.action === _constant.CREATE_GROUP) {
      var group = new _chatEgov.Group({
        name: g.title || "Nhóm mới",
        creater: g.creater,
        member: g.member || [g.creater]
      });
      return group.saveAsync().then(function (group) {
        var ids = _lodash2.default.flatMap(group.member, function (m) {
          return (0, _mongodb.ObjectID)(m);
        });
        _chatEgov.User.findAsync({ _id: { $in: ids } }).then(function (users) {
          _lodash2.default.forEach(users, function (user) {
            user.groups.push(group.id);
            user.saveAsync();
          });
        });

        return group;
      });
    }
    if (g.action === _constant.UPDATE_GROUP) {
      return _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(g.id) }).then(function (group) {
        var memberOut = [];
        var memberIn = [];
        var member = [];

        if (g.member) {
          memberOut = _lodash2.default.difference(group.member, g.member);
          memberIn = _lodash2.default.difference(g.member, group.member);
          var idsOut = _lodash2.default.flatMap(memberOut, function (m) {
            return (0, _mongodb.ObjectID)(m);
          });
          var idsIn = _lodash2.default.flatMap(memberIn, function (m) {
            return (0, _mongodb.ObjectID)(m);
          });
          // update user out/ in
          _chatEgov.User.findAsync({ _id: { $in: idsOut } }).then(function (users) {
            _lodash2.default.forEach(users, function (user) {
              user.groups.splice(user.groups.indexOf(g.id), 1);
              user.recent.splice(_lodash2.default.findIndex(user.recent, function (r) {
                return r.id == g.id;
              }), 1);
              user.saveAsync();
            });
          });
          _chatEgov.User.findAsync({ _id: { $in: idsIn } }).then(function (users) {
            _lodash2.default.forEach(users, function (user) {
              user.groups.push(g.id); // = _.union(user.groups,g.id);
              user.saveAsync();
            });
          });
          group.member = g.member;
          member = g.member;
        }
        // update group
        group.name = g.title || group.name;
        _variable.socker.forEach(function (sk) {
          if (_lodash2.default.indexOf(memberOut, sk.userId) != -1 || _lodash2.default.indexOf(group.member, sk.userId) != -1) sk.emit(_constant.SOCKET_GET_UPDATE_GROUP, { group: { id: group._id, member: group.member, creater: group.creater, name: group.name }, leave: memberOut, join: memberIn });
          // else
          //   console.log(memberOut,sk.userId)
        });
        return group.saveAsync();
      });
    }
    if (g.action === _constant.REMOVE_GROUP) {
      return _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(g.id) }).then(function (group) {
        if (group) {
          var idsOut = _lodash2.default.flatMap(group.member, function (m) {
            return (0, _mongodb.ObjectID)(m);
          });
          _chatEgov.User.findAsync({ _id: { $in: idsOut } }).then(function (users) {
            _lodash2.default.forEach(users, function (user) {
              user.groups.splice(user.groups.indexOf(g.id), 1);
              user.recent.splice(_lodash2.default.findIndex(user.recent, function (r) {
                return r.id == g.id;
              }), 1);
              user.saveAsync();
            });
          });
          _variable.socker.forEach(function (sk) {
            sk.emit(_constant.SOCKET_GET_REMOVE_GROUP, g.id);
            if (_lodash2.default.indexOf(group.member, sk.userId) !== -1) sk.emit(_constant.SOCKET_GET_REMOVE_GROUP, g.id);
          });
          _chatEgov.Message.findAsync({ toGroup: g.id }).then(function (messages) {
            messages.forEach(function (message) {
              return message.removeAsync();
            });
          });
          group.removeAsync();
          return { id: "0" };
        } else {
          return { id: "-1" };
        }
      });
    }
  }
};
exports.default = updateGroup;
module.exports = exports['default'];
//# sourceMappingURL=group.js.map
