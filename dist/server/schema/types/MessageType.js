'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphql = require('graphql');

var MessageType = new _graphql.GraphQLObjectType({
  name: 'Message',
  fields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    from: { type: _graphql.GraphQLString },
    toUser: { type: _graphql.GraphQLString },
    toGroup: { type: _graphql.GraphQLString },
    content: { type: _graphql.GraphQLString },
    state: { type: _graphql.GraphQLInt },
    time: { type: _graphql.GraphQLString }
  }
});

exports.default = MessageType;
module.exports = exports['default'];
//# sourceMappingURL=MessageType.js.map
