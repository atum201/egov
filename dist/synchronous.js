'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _chatEgov = require('./server/models/chatEgov');

var _xlsx = require('xlsx');

var _xlsx2 = _interopRequireDefault(_xlsx);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var to_json = function to_json(workbook) {
	var result = {};
	workbook.SheetNames.forEach(function (sheetName) {
		var roa = _xlsx2.default.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
		if (roa.length > 0) {
			result[sheetName] = roa;
		}
	});
	return result;
};
// import User from './server/models/user';
// import PhanCap from './server/models/phancap';

var getData = function getData(url) {
	return new _bluebird2.default(function (resolve, reject) {
		_http2.default.get('http://my.mic.gov.vn/dongbonhansu/dsnhansu.xls', function (res) {
			var statusCode = res.statusCode;
			var contentType = res.headers['content-type'];
			console.log("statusCode: " + statusCode);
			var rawData = [];
			res.on('data', function (chunk) {
				return rawData.push(chunk);
			});
			res.on('end', function () {
				try {
					var workbook = _xlsx2.default.read(Buffer.concat(rawData), { type: "buffer" });
					var wbJSON = to_json(workbook);
					var sheet = Object.keys(wbJSON)[0];
					resolve(wbJSON[sheet]);
				} catch (e) {
					reject(e);
				}
			});
		}).on('error', function (e) {
			reject('getData: ' + e.message);
		});
	});
};
var updateUser = function updateUser(meta) {
	return _bluebird2.default.each(meta, function (val) {
		return checkUser(val).then(function (user) {});
	}).then(function (originalArray) {
		return _bluebird2.default.resolve(originalArray);
	}).catch(function (e) {
		return _bluebird2.default.reject('updateUser: ' + e.message);
	});
};
var checkUser = function checkUser(val) {
	return new _bluebird2.default(function (resolve, reject) {
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
			user.saveAsync().then(function (user) {
				return resolve(user);
			});
		});
	});
};
var updatePhanCap = function updatePhanCap(meta) {
	var phancap = {
		TenDonViCap1: "Bo TT&TT",
		subs: [],
		members: []
	};
	var delUser = [];
	var listUser = [];
	return new _bluebird2.default(function (resolve, reject) {
		_chatEgov.User.listCol({}).then(function (users) {
			(0, _lodash2.default)(meta).forEach(function (val) {
				var userId = _lodash2.default.last(_lodash2.default.last(val.TaiKhoan.split('|')).split());
				var u = _lodash2.default.find(users, { "userId": userId });
				if (/[0-9]-/.test(userId)) {
					var tuId = userId.split('-')[1];
					var tu = _lodash2.default.find(users, { "userId": tuId });
					if (tu && tu.nickName == u.nickName) {
						u = _lodash2.default.find(users, { "userId": tuId });
						delUser.push(userId);
					} else {
						listUser.push(userId);
					}
				} else {
					listUser.push(userId);
				}
				var member = { id: u._id.toString(), nickName: u.nickName, userId: u.userId };
				if (_lodash2.default.has(val, "DonViCap2")) {
					if (_lodash2.default.has(val, "DonViCap3")) {
						if (_lodash2.default.has(val, "DonViCap4")) {
							var dv2 = _lodash2.default.find(phancap.subs, { "TenDonViCap2": val.DonViCap2.trim() });
							if (dv2) {
								var index2 = _lodash2.default.indexOf(phancap.subs, dv2);
								var dv3 = _lodash2.default.find(phancap.subs[index2].subs, { "TenDonViCap3": val.DonViCap3.trim() });
								if (dv3) {
									var index3 = _lodash2.default.indexOf(phancap.subs[index2].subs, dv3);
									var dv4 = _lodash2.default.find(phancap.subs[index2].subs[index3].subs, { "TenDonViCap4": val.DonViCap4.trim() });
									if (dv4) {
										var index4 = _lodash2.default.indexOf(phancap.subs[index2].subs[index3].subs, dv4);
										phancap.subs[index2].subs[index3].subs[index4].members.push(member);
									} else {
										phancap.subs[index2].subs[index3].subs.push({ "TenDonViCap4": val.DonViCap4.trim(), "members": [member] });
									}
								} else {
									phancap.subs[index2].subs.push({ "TenDonViCap3": val.DonViCap3.trim(), "subs": [{ "TenDonViCap4": val.DonViCap4.trim(), "members": [member] }], "members": [] });
								}
							} else {
								phancap.subs.push({ "TenDonViCap2": val.DonViCap2.trim(),
									subs: [{ "TenDonViCap3": val.DonViCap3, "subs": [{ "TenDonViCap4": val.DonViCap4, "members": [member] }], "members": [] }] });
							}
						} else {
							var _dv = _lodash2.default.find(phancap.subs, { "TenDonViCap2": val.DonViCap2.trim() });
							if (_dv) {
								var _index = _lodash2.default.indexOf(phancap.subs, _dv);
								var _dv2 = _lodash2.default.find(phancap.subs[_index].subs, { "TenDonViCap3": val.DonViCap3.trim() });
								if (_dv2) {
									var _index2 = _lodash2.default.indexOf(phancap.subs[_index].subs, _dv2);
									try {
										phancap.subs[_index].subs[_index2].members.push(member);
									} catch (err) {
										nothing = false;
									}
								} else {
									phancap.subs[_index].subs.push({ "TenDonViCap3": val.DonViCap3.trim(), "subs": [], "members": [member] });
								}
							} else {
								phancap.subs.push({ "TenDonViCap2": val.DonViCap2.trim(),
									"subs": [{ "TenDonViCap3": val.DonViCap3.trim(), "subs": [], "members": [member] }],
									"members": [] });
							}
						}
					} else {
						var _dv3 = _lodash2.default.find(phancap.subs, { "TenDonViCap2": val.DonViCap2.trim() });

						if (_dv3) {
							var _index3 = _lodash2.default.indexOf(phancap.subs, _dv3);
							phancap.subs[_index3].members.push(member);
						} else {
							phancap.subs.push({ "TenDonViCap2": val.DonViCap2.trim(), "subs": [], "members": [member] });
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
				resolve(pc._id);
			});
			users.forEach(function (user) {
				if (_lodash2.default.indexOf(listUser, user.userId) == -1) user.removeAsync();
			});
		}).error(function (e) {
			return reject('updatePhanCap: ' + e.message);
		});
	});
};

exports.default = function (url) {
	return new _bluebird2.default(function (resolve, reject) {
		getData(url).then(function (meta) {
			updateUser(meta).then(function (meta) {
				updatePhanCap(meta).then(function (phancapId) {
					return resolve(phancapId);
				}).catch(function (error) {
					return reject(error);
				});
			}).catch(function (error) {
				return reject(error);
			});
		}).catch(function (error) {
			return reject(error);
		});
	});
};

module.exports = exports['default'];
//# sourceMappingURL=synchronous.js.map
