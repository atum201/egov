'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var RecentlyType = new _graphql.GraphQLObjectType({
  name: "Recently",
  fields: {
    isUser: { type: _graphql.GraphQLBoolean },
    boxId: { type: _graphql.GraphQLString }
  }
});
var UserType = new _graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    userId: { type: _graphql.GraphQLString },
    nickName: { type: _graphql.GraphQLString },
    avatar: { type: _graphql.GraphQLString },
    groups: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
    friends: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
    recently: { type: new _graphql.GraphQLList(RecentlyType) },
    status: { type: _graphql.GraphQLString },
    first: { type: _graphql.GraphQLInt },
    last: { type: _graphql.GraphQLInt },
    state: { type: _graphql.GraphQLString }
  }
});

exports.default = UserType;
module.exports = exports['default'];
//# sourceMappingURL=UserType.js.map
