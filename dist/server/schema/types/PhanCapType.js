'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhanCapType = exports.DonViCap1Type = exports.DonViCap2Type = exports.DonViCap3Type = exports.DonViCap4Type = exports.MemberType = undefined;

var _graphql = require('graphql');

var MemberType = exports.MemberType = new _graphql.GraphQLObjectType({
  name: 'Member',
  fields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    userId: { type: _graphql.GraphQLString },
    nickName: { type: _graphql.GraphQLString }
  }
});

var DonViCap4Type = exports.DonViCap4Type = new _graphql.GraphQLObjectType({
  name: 'DonViCap4',
  fields: {
    members: { type: new _graphql.GraphQLList(MemberType) },
    TenDonViCap4: { type: _graphql.GraphQLString }
  }
});

var DonViCap3Type = exports.DonViCap3Type = new _graphql.GraphQLObjectType({
  name: 'DonViCap3',
  fields: {
    members: { type: new _graphql.GraphQLList(MemberType) },
    subs: { type: new _graphql.GraphQLList(DonViCap4Type) },
    TenDonViCap3: { type: _graphql.GraphQLString }
  }
});

var DonViCap2Type = exports.DonViCap2Type = new _graphql.GraphQLObjectType({
  name: 'DonViCap2',
  fields: {
    members: { type: new _graphql.GraphQLList(MemberType) },
    subs: { type: new _graphql.GraphQLList(DonViCap3Type) },
    TenDonViCap2: { type: _graphql.GraphQLString }
  }
});

var DonViCap1Type = exports.DonViCap1Type = new _graphql.GraphQLObjectType({
  name: 'DonViCap1',
  fields: {
    members: { type: new _graphql.GraphQLList(MemberType) },
    subs: { type: new _graphql.GraphQLList(DonViCap2Type) },
    TenDonViCap1: { type: _graphql.GraphQLString }
  }
});

var PhanCapType = exports.PhanCapType = new _graphql.GraphQLObjectType({
  name: 'PhanCap',
  fields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    phancap: { type: DonViCap1Type },
    time: { type: _graphql.GraphQLInt }
  }
});
//# sourceMappingURL=PhanCapType.js.map
