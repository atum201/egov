'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _env = require('./config/env');

var _env2 = _interopRequireDefault(_env);

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_mongoose2.default);

// connect to mongo db
_mongoose2.default.connect(_env2.default.db, { server: { socketOptions: { keepAlive: 1 } } });
_mongoose2.default.connection.on('error', function () {
  throw new Error('unable to connect to database: ' + _env2.default.db);
});
console.log(_env2.default.db);

(0, _update2.default)('./dist/data/dsnhansu_Mic.xls', function (phancapId) {
  console.log("database initial to phancap document ", phancapId);
});
//# sourceMappingURL=initial.js.map
