'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  env: 'production',
  db: process.argv[2] || 'mongodb://localhost:27017/store',
  port: process.argv[3] || 80
};
module.exports = exports['default'];
//# sourceMappingURL=production.js.map
