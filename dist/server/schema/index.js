'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var _message = require('./queries/message');

var _group = require('./queries/group');

var _group2 = _interopRequireDefault(_group);

var _user = require('./queries/user');

var _phancapEgov = require('./queries/phancapEgov');

var _phancapEgov2 = _interopRequireDefault(_phancapEgov);

var _user2 = require('./mutations/user');

var _user3 = _interopRequireDefault(_user2);

var _group3 = require('./mutations/group');

var _group4 = _interopRequireDefault(_group3);

var _variable = require('../common/variable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var online = {
  type: new _graphql.GraphQLList(_graphql.GraphQLString),
  resolve: function resolve() {
    return _variable.userOnline;
  }
};

var schema = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      message: _message.message,
      newMessage: _message.newMessage,
      group: _group2.default,
      user: _user.user,
      users: _user.users,
      login: _user.login,
      logins: _user.logins,
      userById: _user.userById,
      phancap: _phancapEgov2.default,
      online: online
    }
  }),
  mutation: new _graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
      updateGroup: _group4.default,
      updateUser: _user3.default
    }
  })
});

exports.default = schema;
module.exports = exports['default'];
//# sourceMappingURL=index.js.map
