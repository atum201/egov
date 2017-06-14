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
 * Group Schema
 */
var GroupSchema = new _mongoose2.default.Schema({
  name: { type: String, default: '', trim: true },
  member: [{ type: String }],
  creater: { type: _mongoose2.default.Schema.ObjectId, ref: 'User' },
  createdAt: { type: Number, default: new Date().getTime() }
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
GroupSchema.methods = {};

/**
 * Statics
 */
GroupSchema.statics = {
  /**
   * Get group
   * @param {ObjectId} id - The objectId of group.
   * @returns {Promise<User, APIError>}
   */
  get: function get(id) {
    return this.findById(id).execAsync().then(function (group) {
      if (group) {
        return group;
      }
      var err = new _APIError2.default('No such group exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    });
  },


  /**
   * List group in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list: function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var criteria = options.query || {};
    return this.find(criteria).sort({ createdAt: -1 }).execAsync();
  }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('Group', GroupSchema);
module.exports = exports['default'];
//# sourceMappingURL=group.js.map
