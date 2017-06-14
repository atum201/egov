'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  env: 'test',
  db: !process.argv.includes('--database') ? 'mongodb://localhost:27017/store' : process.argv[3],
  port: 3000
};
module.exports = exports['default'];
//# sourceMappingURL=test.js.map
