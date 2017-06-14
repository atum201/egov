'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _APIError = require('../helpers/APIError');

var _APIError2 = _interopRequireDefault(_APIError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User Schema
 */
var UserSchema = new _mongoose2.default.Schema({
  userId: { type: String, default: '', trim: true },
  nickName: { type: String, default: '', trim: true },
  avatar: { type: String, default: '', trim: true },
  groups: [{ type: String }],
  friends: [{ type: String }],
  recent: [{
    type: { type: String, default: 'user' },
    id: { type: String },
    unread: { type: Number, default: 0 },
    last: { type: Number, default: new Date().getTime() },
    del: { type: Number, default: 0 }
  }],
  status: { type: String, default: '', trim: true },
  login: [{ type: Number }],
  first: { type: Number },
  last: { type: Number },
  createdAt: { type: Number, default: new Date().getTime() }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Statics
 */
UserSchema.statics = {
  /**
   * Get user
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get: function get(id) {
    return this.findById(id).execAsync().then(function (user) {
      if (user) {
        return user;
      }
      var err = new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    });
  },
  updateUser: function updateUser(u) {
    return this.findOne({ userId: u.userId }).execAsync().then(function (user) {
      if (user) {
        user.nickName = u.name;
      }
    });
  },
  findUserId: function findUserId(tk) {
    return this.findOne({ 'userId': tk }).execAsync().then(function (user) {
      if (user) {
        return user;
      }
      var err = new _APIError2.default('No such user exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    });
  },


  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list: function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var query = options.query || {};
    var page = options.page || 0;
    var limit = options.limit || 30;
    var col = options.column || undefined;
    var sort = options.sort || { createdAt: -1 };
    return this.find(query, col).sort(sort).skip(page * limit).limit(limit).execAsync();
  },
  listCol: function listCol() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var query = options.query || {};
    var col = options.column || '_id nickName userId';
    return this.find(query, col).sort({ createdAt: -1 }).execAsync();
  }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('User', UserSchema);
module.exports = exports['default'];
//# sourceMappingURL=user.js.map
