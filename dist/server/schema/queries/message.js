'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.newMessage = exports.message = undefined;

var _OutputType = require('../types/OutputType');

var _chatEgov = require('../../models/chatEgov');

var _mongodb = require('mongodb');

var _graphql = require('graphql');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var message = exports.message = {
  type: new _graphql.GraphQLList(_OutputType.MessageType),
  args: {
    q: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref) {
    var q = _ref.q;

    var options = JSON.parse(q);
    return _chatEgov.Message.list(options).then(function (messages) {
      return messages;
    }).error(function (e) {});
  }
};

var newMessage = exports.newMessage = {
  type: new _graphql.GraphQLList(_OutputType.MessageType),
  args: {
    u: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(_, _ref2) {
    var u = _ref2.u;

    return _chatEgov.User.findOneAsync({ userId: u }).then(function (user) {
      if (user) {
        var query = [{ toUser: user.id, state: 0 }];
        if (user.groups) {
          for (var i = 0; i < user.groups.length; i++) {
            query.push({ toGroup: user.groups[i], time: { $gt: user.read[i] || 0 } });
            // query.push({"toGroup":ObjectID(user.groups[i]),time:{$gt:user.read[i]||0}});
          }
        }
        console.log(query);
        return _chatEgov.Message.list({ $or: query }).then(function (messages) {
          console.log("abc", messages);return messages;
        }).error(function (e) {});
      } else {
        return {};
      }
    });
  }
};
//# sourceMappingURL=message.js.map
