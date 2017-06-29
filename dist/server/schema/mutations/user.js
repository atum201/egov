'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _mongodb = require('mongodb');

var _OutputType = require('../types/OutputType');

var _chatEgov = require('../../models/chatEgov');

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ADD_CONTACT = "add contact",
    REMOVE_CONTACT = "remove contact",
    OUT_GROUP = "out group",
    UPDATE_AVATAR = "update avatar";

var u = {
  type: new _graphql.GraphQLInputObjectType({
    name: "userInput",
    fields: {
      id: { type: _graphql.GraphQLString },
      avatar: { type: _graphql.GraphQLString },
      contactId: { type: _graphql.GraphQLString },
      groupId: { type: _graphql.GraphQLString },
      action: { type: _graphql.GraphQLString }
    }
  }) };
var updateUser = {
  type: _OutputType.UserType,
  args: {
    u: u
  },
  resolve: function resolve(root, _ref) {
    var u = _ref.u;

    if (u.action === ADD_CONTACT) {
      return _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(u.id) }).then(function (user) {
        // console.log(user);
        user.friends = user.friends || [];
        // console.log(user);
        user.friends.push(u.contactId);
        // console.log(user);
        return user.saveAsync();
      });
    }
    if (u.action === REMOVE_CONTACT) {
      return _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(u.id) }).then(function (user) {
        user.friends = user.friends || [];
        user.friends.splice(_lodash2.default.indexOf(user.friends, u.contactId), 1);
        return user.saveAsync();
      });
    }
    if (u.action === OUT_GROUP) {
      _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(u.groupId) }).then(function (group) {
        group.member = group.member || [];
        group.member.splice(group.member.indexOf(u.id), 1);
        group.saveAsync();
      });
      return _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(u.id) }).then(function (user) {
        group.member = group.member || [];
        user.groups.splice(user.groups.indexOf(u.groupId), 1);
        return user.saveAsync();
      });
    }
    if (u.action === UPDATE_AVATAR) {
      return _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(u.id) }).then(function (user) {
        user.avatar = u.avatar;
        return user.saveAsync();
      });
    }
  }
};
exports.default = updateUser;
module.exports = exports['default'];
//# sourceMappingURL=user.js.map
