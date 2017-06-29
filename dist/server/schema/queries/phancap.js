'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _OutputType = require('../types/OutputType');

var _chatEgov = require('../../models/chatEgov');

var _mongodb = require('mongodb');

var _graphql = require('graphql');

var convertToGraphQL = function convertToGraphQL(phancap) {
	var phancaptype = {};
	phancaptype.id = (0, _mongodb.ObjectID)(phancap.id).toString();
	phancaptype.phancap = convertDonViCap1(phancap.phanCap);
	phancaptype.time = phancap.time;
	// console.log(phancaptype);
	return phancaptype;
};

var convertToMemberGraphQL = function convertToMemberGraphQL(users) {
	var members = [];
	users.forEach(function (user) {
		members.push({
			id: user.id,
			nickName: user.nickName,
			userId: user.userId
		});
	});
	return members;
};

var convertDonViCap4 = function convertDonViCap4(subs) {
	var r = [];

	subs.forEach(function (sub) {
		r.push({
			members: convertToMemberGraphQL(sub.members),
			TenDonViCap4: sub.TenDonViCap4
		});
	});
	if (r.length > 0) return r;else return undefined;
};

var convertDonViCap3 = function convertDonViCap3(subs) {
	var r = [];

	subs.forEach(function (sub) {
		r.push({
			members: convertToMemberGraphQL(sub.members),
			TenDonViCap3: sub.TenDonViCap3,
			subs: convertDonViCap4(sub.subs) || undefined
		});
	});
	if (r.length > 0) return r;else return undefined;
};

var convertDonViCap2 = function convertDonViCap2(subs) {
	var r = [];

	subs.forEach(function (sub) {
		r.push({
			members: convertToMemberGraphQL(sub.members),
			TenDonViCap2: sub.TenDonViCap2,
			subs: convertDonViCap3(sub.subs) || undefined
		});
	});
	return r;
};

var convertDonViCap1 = function convertDonViCap1(phancap) {
	var r = {};
	// console.log(phancap);
	r.members = convertToMemberGraphQL(phancap.members);
	r.TenDonViCap1 = phancap.TenDonViCap1;
	r.subs = convertDonViCap2(phancap.subs) || undefined;
	return r;
};

var phancap = {
	type: _OutputType.PhanCapType,
	resolve: function resolve() {
		return _chatEgov.PhanCap.getLast({}).then(function (phancap) {
			return convertToGraphQL(phancap);
		}).error(function (e) {});
	}
};

exports.default = phancap;
module.exports = exports['default'];
//# sourceMappingURL=phancap.js.map
