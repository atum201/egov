'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

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
 * Group Schema
 */
var GroupSchema = new _mongoose2.default.Schema({
  name: { type: String, default: '', trim: true },
  member: [{ type: String }],
  creater: { type: _mongoose2.default.Schema.ObjectId, ref: 'User' },
  createdAt: { type: Number, default: new Date().getTime() }
});

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
 * User Schema
 */
var PhanCapSchema = new _mongoose2.default.Schema({
  phanCap: _mongoose2.default.Schema.Types.Mixed,
  time: { type: Number, default: new Date().getTime() }
});

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
      var err = new APIError('No such file exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  list: function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var criteria = options.query || {};
    return this.find(criteria).sort({ createdAt: -1 }).execAsync();
  }
};
GroupSchema.statics = {
  get: function get(id) {
    return this.findById(id).execAsync().then(function (group) {
      if (group) {
        return group;
      }
      var err = new APIError('No such group exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
  list: function list() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var criteria = options.query || {};
    return this.find(criteria).sort({ createdAt: -1 }).execAsync();
  }
};
MessageSchema.statics = {
  get: function get(id) {
    return this.findById(id).execAsync().then(function (message) {
      if (message) {
        return message;
      }
      var err = new APIError('No such message exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
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
PhanCapSchema.statics = {
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
UserSchema.statics = {
  get: function get(id) {
    return this.findById(id).execAsync().then(function (user) {
      if (user) {
        return user;
      }
      var err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
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
      var err = new APIError('No such user exists!', httpStatus.NOT_FOUND);
      return Promise.reject(err);
    });
  },
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

exports.FileSchema = FileSchema;

exports.GroupSchema = GroupSchema;

exports.MessageSchema = MessageSchema;

exports.PhanCapSchema = PhanCapSchema;

exports.UserSchema = UserSchema;
//# sourceMappingURL=chatSchema.js.map
