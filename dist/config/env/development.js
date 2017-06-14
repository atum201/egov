'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  env: 'development',
  db: process.argv[2] || 'mongodb://localhost:27017/store',
  port: process.argv[3] || 3000
};
module.exports = exports['default'];
//# sourceMappingURL=development.js.map
