'use strict';

var _chatSchema = require('./chatSchema');

var Schema = _interopRequireWildcard(_chatSchema);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var Model = function Model(name, schema) {
  return _mongoose2.default.model(name, Schema[schema || name + "Schema"]);
};

// exports.User = mongoose.model("User",Schema.UserSchema)
// exports.Message = mongoose.model("Message",Schema.MessageSchema)
// exports.Group = mongoose.model("Group",Schema.GroupSchema)
// exports.File = mongoose.model("File",Schema.FileSchema)
// exports.PhanCap = mongoose.model("PhanCap",Schema.PhanCapSchema)

exports.User = Model("User");
exports.Message = Model("Message");
exports.Group = Model("Group");
exports.File = Model("File");
exports.PhanCap = Model("PhanCap");
//# sourceMappingURL=chatEgov.js.map
