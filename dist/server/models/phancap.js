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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User Schema
 */
var PhanCapSchema = new _mongoose2.default.Schema({
  phanCap: _mongoose2.default.Schema.Types.Mixed,
  time: { type: Number, default: new Date().getTime() }
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
PhanCapSchema.statics = {

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list: function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var criteria = options.criteria || {};
    var page = options.page || 0;
    var limit = options.limit || 30;
    return this.find(criteria).sort({ time: -1 }).skip(page * limit).limit(limit).execAsync();
  },
  getLast: function getLast() {
    return this.findOne({}).sort({ time: -1 }).execAsync();
  }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('PhanCap', PhanCapSchema);
module.exports = exports['default'];
//# sourceMappingURL=phancap.js.map
