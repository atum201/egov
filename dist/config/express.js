'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _httpStatus = require('http-status');

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _cors3 = require('./cors');

var corsOption = _interopRequireWildcard(_cors3);

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// parse body params and attache them to req.body

// import routes from '../server/routes';
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.use(_express2.default.static('dist/public'));

// secure apps by setting various HTTP headers
app.use((0, _helmet2.default)());
app.use((0, _cors2.default)());
app.get('/', function (req, res) {
  res.sendfile('dist/public/index.html');
});

// error handler, send stacktrace only during development
// app.use((err, req, res, next) =>		// eslint-disable-line no-unused-vars
//   res.status(err.status).json({
//     message: err.isPublic ? err.message : httpStatus[err.status],
//     stack: config.env === 'development' ? err.stack : {}
//   })
// );

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=express.js.map
