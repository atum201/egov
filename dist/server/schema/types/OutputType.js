'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhanCapType = exports.DonViCap1Type = exports.DonViCap2Type = exports.DonViCap3Type = exports.DonViCap4Type = exports.MemberType = exports.UserType = exports.LoginType = exports.RecentType = exports.MessageType = exports.GroupType = undefined;

var _graphql = require('graphql');

var GroupType = exports.GroupType = new _graphql.GraphQLObjectType({
  name: 'Group',
  fields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    name: { type: _graphql.GraphQLString },
    member: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
    creater: { type: _graphql.GraphQLString },
    createdAt: { type: _graphql.GraphQLString }
  }
});

var MessageType = exports.MessageType = new _graphql.GraphQLObjectType({
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

var RecentType = exports.RecentType = new _graphql.GraphQLObjectType({
  name: "Recent",
  fields: {
    id: { type: _graphql.GraphQLString },
    type: { type: _graphql.GraphQLString },
    last: { type: _graphql.GraphQLString },
    unread: { type: _graphql.GraphQLInt },
    del: { type: _graphql.GraphQLString }
  }
});

var LoginType = exports.LoginType = new _graphql.GraphQLObjectType({
  name: "Login",
  fields: {
    username: { type: _graphql.GraphQLString },
    login: { type: _graphql.GraphQLInt }
  }
});

var UserType = exports.UserType = new _graphql.GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    userId: { type: _graphql.GraphQLString },
    nickName: { type: _graphql.GraphQLString },
    avatar: { type: _graphql.GraphQLString },
    groups: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
    friends: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
    recent: { type: new _graphql.GraphQLList(RecentType) },
    status: { type: _graphql.GraphQLString },
    login: { type: new _graphql.GraphQLList(_graphql.GraphQLInt) },
    first: { type: _graphql.GraphQLInt },
    last: { type: _graphql.GraphQLInt }
  }
});

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
//# sourceMappingURL=OutputType.js.map
