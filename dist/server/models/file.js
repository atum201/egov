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
 * File Schema
 */
var FileSchema = new _mongoose2.default.Schema({
  fileName: { type: String, default: '', trim: true },
  path: { type: String },
  fileType: { type: String },
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
FileSchema.methods = {};

/**
 * Statics
 */
FileSchema.statics = {
  /**
   * Get group
   * @param {ObjectId} id - The objectId of group.
   * @returns {Promise<User, APIError>}
   */
  get: function get(id) {
    return this.findById(id).execAsync().then(function (file) {
      if (file) {
        return file;
      }
      var err = new _APIError2.default('No such file exists!', _httpStatus2.default.NOT_FOUND);
      return _bluebird2.default.reject(err);
    });
  },
  list: function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var criteria = options.query || {};
    return this.find(criteria).sort({ createdAt: -1 }).execAsync();
  }
};

/**
 * @typedef User
 */
exports.default = _mongoose2.default.model('File', FileSchema);
module.exports = exports['default'];
//# sourceMappingURL=file.js.map
