'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhanCapType = exports.DonViType = undefined;

var _graphql = require('graphql');

var DonViType = exports.DonViType = new _graphql.GraphQLObjectType({
  name: "DonVi",
  fields: function fields() {
    return {
      DonViCon: {
        type: new _graphql.GraphQLList(DonViType),
        resolve: function resolve(DonVi) {
          return DonVi.DonViCon;
        }
      },
      ThanhVien: { type: new _graphql.GraphQLList(_graphql.GraphQLID) },
      TenDonVi: { type: _graphql.GraphQLString }
    };
  }
});

var PhanCapType = exports.PhanCapType = new _graphql.GraphQLObjectType({
  name: 'PhanCap',
  fields: {
    id: { type: new _graphql.GraphQLNonNull(_graphql.GraphQLID) },
    phanCap: { type: DonViType },
    time: { type: _graphql.GraphQLString }
  }
});
//# sourceMappingURL=PhanCapEgovType.js.map
