'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _OutputType = require('../types/OutputType');

var _chatEgov = require('../../models/chatEgov');

var _mongodb = require('mongodb');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import Group from '../../models/group';
// import User from '../../models/user';
var group = {
  type: new _graphql.GraphQLList(_OutputType.GroupType),
  args: {
    user: {
      type: _graphql.GraphQLString
    }
  },
  resolve: function resolve(root, _ref) {
    var user = _ref.user;

    return _chatEgov.User.findOneAsync({ userId: user }).then(function (user) {
      var ids = _lodash2.default.flatMap(user.groups, function (g) {
        return (0, _mongodb.ObjectID)(g);
      });
      return _chatEgov.Group.findAsync({ _id: { $in: ids } }).then(function (groups) {
        return groups;
      }).error(function (e) {});
    });
  }
};

exports.default = group;
module.exports = exports['default'];
//# sourceMappingURL=group.js.map
