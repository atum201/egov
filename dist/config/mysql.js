'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mysql = require('mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chatEgov = require('../server/models/chatEgov');

var _variable = require('../server/common/variable');

var egovConnectString = _interopRequireWildcard(_variable);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var egovDB = process.argv[2] || 'motcua';
var connection = _mysql2.default.createConnection(egovConnectString[egovDB]);

var phancap = null;

var pushPhanCap = function pushPhanCap(val, id, pc) {
	if (pc.TenDonVi == val.TenDonVi) {
		pc.ThanhVien = pc.ThanhVien || [];
		pc.ThanhVien.push(id);
	} else if (pc.TenDonVi == val.TenDonViCha) {
		var i = _lodash2.default.findIndex(pc.DonViCon, { TenDonVi: val.TenDonVi });
		pc.DonViCon = pc.DonViCon || [];
		if (i != -1) {
			pc.DonViCon[i].ThanhVien = pc.DonViCon[i].ThanhVien || [];
			pc.DonViCon[i].ThanhVien.push(id);
		} else {
			pc.DonViCon.push({ ThanhVien: [id], TenDonVi: val.TenDonVi });
		}
	} else if (pc.DonViCon && pc.DonViCon.length > 0) {
		for (var _i = 0; _i < pc.DonViCon.length; _i++) {
			pc.DonViCon[_i] = pushPhanCap(val, id, pc.DonViCon[_i]);
		}
	}
	return pc;
};
var checkUser = function checkUser(val) {
	return new _bluebird2.default(function (resolve, reject) {
		_chatEgov.User.findOneAsync({ userId: val.Id }).then(function (user) {
			if (user) {
				user.nickName = val.HoTen || "";
				if (val.AnhDaiDien) user.avatar = val.AnhDaiDien;
			} else {
				user = new _chatEgov.User({
					userId: val.Id,
					nickName: val.HoTen || "",
					avatar: val.AnhDaiDien || null });
			}
			user.saveAsync().then(function (user) {
				if (phancap) phancap = pushPhanCap(val, user._id.toString(), phancap);else phancap = { TenDonVi: val.TenDonVi, ThanhVien: [user._id.toString()], DonViCon: [] };
				resolve(user);
			});
		});
	});
};

exports.default = function () {
	return new _bluebird2.default(function (resolve, reject) {
		connection.connect();
		// connection.query('SELECT tree.Id, tree.HoTen, tree.TenDonVi,donvi.ten as TenDonViCha from(SELECT user.taikhoannguoidungid as Id, user.hovaten as HoTen, donvi.id as DonViId, donvi.ten as TenDonVi, donvi.chaid as DonViCha FROM view_tai_khoan_cong_chuc as user JOIN view_co_cau_to_chuc as donvi ON user.coquanquanlyid=donvi.id) as tree LEFT JOIN view_co_cau_to_chuc as donvi ON donvi.id = tree.DonViCha ORDER by donvi.id'
		connection.query(egovConnectString[egovDB].connectionString, function (error, results, fields) {
			if (error) {
				console.log(error);reject(error);
			}
			if (results && results.length > 0) {
				_bluebird2.default.each(results, function (val) {
					return checkUser(val).then(function (user) {});
				}).then(function (originalArray) {
					var phanCap = new _chatEgov.PhanCap({
						phanCap: phancap
					});
					phanCap.saveAsync().then(function (pc) {
						console.log("Nguoi dung da duoc cap nhat tai ban ghi " + pc._id.toString());
						resolve(pc._id.toString());
					});
				}).catch(function (e) {
					console.log(e);reject(e);
				});
			}
		});
		connection.end();
	});
};

module.exports = exports['default'];
//# sourceMappingURL=mysql.js.map
