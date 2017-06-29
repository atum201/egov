'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _chatEgov = require('./server/models/chatEgov');

var _mongodb = require('mongodb');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import User from './server/models/user'
var to_json = function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function (sheetName) {
		console.log(sheetName);
		var roa = _xlsx2.default.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
			result[sheetName] = roa;
		}
	});
	return result;
};
var updateUser = function updateUser(meta) {
	var a = true;
	(0, _lodash2.default)(meta).forEach(function (val) {
		var userId = _lodash2.default.last(_lodash2.default.last(val.TaiKhoan.split('|')).split());
		_chatEgov.User.findOneAsync({ userId: userId }).then(function (user) {
			if (user) {
				user.nickName = val.HoVaTen || "";
				if (val.AnhDaiDien) user.avatar = val.AnhDaiDien;
			} else {
				user = new _chatEgov.User({
					userId: userId,
					nickName: val.HoVaTen || "",
					avatar: val.AnhDaiDien || null });
			}
			user.saveAsync();
		});
	});
};

exports.default = function (filePath, calback) {
	var workbook = _xlsx2.default.readFile(filePath, { type: 'base64', WTF: false });
	var wbJSON = to_json(workbook);
	var sheet = Object.keys(wbJSON)[0];
	updateUser(wbJSON[sheet]);
	setTimeout(function () {
		var phancap = {
			TenDonViCap1: "Bo TT&TT",
			subs: [],
			members: []
		};
		var delUser = [];
		_chatEgov.User.listCol({}).then(function (users) {
			(0, _lodash2.default)(wbJSON[sheet]).forEach(function (val) {
				var userId = _lodash2.default.last(_lodash2.default.last(val.TaiKhoan.split('|')).split());
				var u = _lodash2.default.find(users, { "userId": userId });
				if (/[0-9]-/.test(userId)) {
					var tuId = userId.split('-')[1];
					var tu = _lodash2.default.find(users, { "userId": tuId });
					if (tu && tu.nickName == u.nickName) {
						u = _lodash2.default.find(users, { "userId": tuId });
						delUser.push(userId);
					}
				}
				var member = { id: u._id.toString(), nickName: u.nickName, userId: u.userId };
				if (_lodash2.default.has(val, "TenDonViCap2")) {
					if (_lodash2.default.has(val, "TenDonViCap3")) {
						if (_lodash2.default.has(val, "TenDonViCap4")) {
							var dv2 = _lodash2.default.find(phancap.subs, { "TenDonViCap2": val.TenDonViCap2.trim() });
							if (dv2) {
								var index2 = _lodash2.default.indexOf(phancap.subs, dv2);
								var dv3 = _lodash2.default.find(phancap.subs[index2].subs, { "TenDonViCap3": val.TenDonViCap3.trim() });
								if (dv3) {
									var index3 = _lodash2.default.indexOf(phancap.subs[index2].subs, dv3);
									var dv4 = _lodash2.default.find(phancap.subs[index2].subs[index3].subs, { "TenDonViCap4": val.TenDonViCap4.trim() });
									if (dv4) {
										var index4 = _lodash2.default.indexOf(phancap.subs[index2].subs[index3].subs, dv4);
										phancap.subs[index2].subs[index3].subs[index4].members.push(member);
									} else {
										phancap.subs[index2].subs[index3].subs.push({ "TenDonViCap4": val.TenDonViCap4.trim(), "members": [member] });
									}
								} else {
									phancap.subs[index2].subs.push({ "TenDonViCap3": val.TenDonViCap3.trim(), "subs": [{ "TenDonViCap4": val.TenDonViCap4.trim(), "members": [member] }], "members": [] });
								}
							} else {
								phancap.subs.push({ "TenDonViCap2": val.TenDonViCap2.trim(),
									subs: [{ "TenDonViCap3": val.TenDonViCap3, "subs": [{ "TenDonViCap4": val.TenDonViCap4, "members": [member] }], "members": [] }] });
							}
						} else {
							var _dv = _lodash2.default.find(phancap.subs, { "TenDonViCap2": val.TenDonViCap2.trim() });
							if (_dv) {
								var _index = _lodash2.default.indexOf(phancap.subs, _dv);
								var _dv2 = _lodash2.default.find(phancap.subs[_index].subs, { "TenDonViCap3": val.TenDonViCap3.trim() });
								if (_dv2) {
									var _index2 = _lodash2.default.indexOf(phancap.subs[_index].subs, _dv2);
									try {
										phancap.subs[_index].subs[_index2].members.push(member);
									} catch (err) {
										nothing = false;
									}
								} else {
									phancap.subs[_index].subs.push({ "TenDonViCap3": val.TenDonViCap3.trim(), "subs": [], "members": [member] });
								}
							} else {
								phancap.subs.push({ "TenDonViCap2": val.TenDonViCap2.trim(),
									"subs": [{ "TenDonViCap3": val.TenDonViCap3.trim(), "subs": [], "members": [member] }],
									"members": [] });
							}
						}
					} else {
						var _dv3 = _lodash2.default.find(phancap.subs, { "TenDonViCap2": val.TenDonViCap2.trim() });

						if (_dv3) {
							var _index3 = _lodash2.default.indexOf(phancap.subs, _dv3);
							phancap.subs[_index3].members.push(member);
						} else {
							phancap.subs.push({ "TenDonViCap2": val.TenDonViCap2.trim(), "subs": [], "members": [member] });
						}
					}
				} else {
					phancap.members.push(member);
				}
			});
			var phanCap = new _chatEgov.PhanCap({
				phanCap: phancap
			});
			phanCap.saveAsync().then(function (pc) {
				calback(pc._id);
			});
			users.forEach(function (user) {
				if (_lodash2.default.indexOf(delUser, user.userId) != -1) user.removeAsync();
			});
		}).error(function (e) {
			return console.log(e);
		});
	}, 5000);
};

module.exports = exports['default'];
//# sourceMappingURL=update.js.map
