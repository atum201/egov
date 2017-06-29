"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var dbPort = process.argv[4] || 27017;
var connection = {
	// motcua:"mongodb://motcua:mOtCuAcmOn@localhost:"+dbPort+"/motcua",
	motcua: "mongodb://qlvb:QLVB20119@localhost:" + dbPort + "/qlvb",
	portal: "mongodb://admin:pOrtal123@localhost:" + dbPort + "/portal",
	dvc: "mongodb://admin:Dvc#152*12@localhost:" + dbPort + "/dvc"
};
exports.default = {
	env: 'egov',
	db: connection[process.argv[2]] || 'mongodb://localhost:27017/store',
	port: process.argv[3] || 3000
};
module.exports = exports['default'];
//# sourceMappingURL=egov.js.map
