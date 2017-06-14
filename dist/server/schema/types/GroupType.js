'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var GroupType = new _graphql.GraphQLObjectType({
  name: 'Group',
  fields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    name: { type: _graphql.GraphQLString },
    member: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
    creater: { type: _graphql.GraphQLString },
    createdAt: { type: _graphql.GraphQLString }
  }
});

exports.default = GroupType;
module.exports = exports['default'];
//# sourceMappingURL=GroupType.js.map
