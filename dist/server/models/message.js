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
 * Message Schema
 */
var MessageSchema = new _mongoose2.default.Schema({
  from: { type: _mongoose2.default.Schema.ObjectId, ref: "User" },
  toUser: { type: _mongoose2.default.Schema.ObjectId, ref: "User" },
  toGroup: { type: _mongoose2.default.Schema.ObjectId, ref: "Group" },
  content: { type: String, default: '', trim: true },
  state: { type: Number, default: 0 },
  time: { type: Number, default: new Date().getTime() }
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
MessageSchema.methods = {};

/**
 * Statics
 */
MessageSchema.statics = {
  /**
   * Get message
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get: function get(id) {
    return this.findById(id).execAsync().then(function (message) {
      if (message) {
        return message;
      }
      var err = new _APIError2.default('No such message exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    });
  },


  /**
   * List messages in descending order of 'time' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */

  list: function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var criteria = options.query || {};
    var page = options.page || 0;
    var limit = options.limit || 30;
    var sort = options.sort || { time: 1 };
    return this.find(criteria).sort(sort).skip(page * limit).limit(limit).execAsync();
  },
  listCol: function listCol() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var criteria = options.criteria || {};
    var col = options.column || '_id from toUser content time state';
    return this.find(criteria, col).sort({ time: 1 }).execAsync();
  }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('Message', MessageSchema);
module.exports = exports['default'];
//# sourceMappingURL=message.js.map
