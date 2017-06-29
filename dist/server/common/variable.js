'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
var userOnline = exports.userOnline = []; // [id];
var userIds = exports.userIds = []; // [userId]
var socker = exports.socker = []; // socket.userid = id;
var motcua = exports.motcua = {
	host: '123.31.40.84',
	port: '3306',
	user: 'motcua_cmon',
	password: 'DeM0$cmon',
	database: 'motcua_cmon',
	connectionString: 'SELECT tree.Id, tree.HoTen, tree.TenDonVi,donvi.ten as TenDonViCha from(SELECT user.taikhoannguoidungid as Id, user.hovaten as HoTen, donvi.id as DonViId, donvi.ten as TenDonVi, donvi.chaid as DonViCha FROM view_tai_khoan_cong_chuc as user JOIN view_co_cau_to_chuc as donvi ON user.coquanquanlyid=donvi.id) as tree LEFT JOIN view_co_cau_to_chuc as donvi ON donvi.id = tree.DonViCha ORDER by donvi.id'
};
var portal = exports.portal = {
	host: '123.31.40.84',
	port: '3306',
	user: 'egov_portal_core',
	password: 'Port@l2017',
	database: 'egov_portal_core',
	connectionString: 'SELECT tree.Id, tree.HoTen, tree.TenDonVi,donvi.ten as TenDonViCha from(SELECT user.taikhoannguoidungid as Id, user.hovaten as HoTen, donvi.id as DonViId, donvi.ten as TenDonVi, donvi.chaid as DonViCha FROM view_chat_nguoidung as user JOIN view_chat_tochuc as donvi ON user.coquanquanlyid=donvi.id) as tree LEFT JOIN view_chat_tochuc as donvi ON donvi.id = tree.DonViCha ORDER by donvi.id'
};
var tomcat_cmon = exports.tomcat_cmon = {
	host: '123.31.40.90',
	port: '3306',
	user: 'tomcat_cmon',
	password: 'Qu@ngB1nh$!cmon',
	database: 'tomcat_cmon'
};
//# sourceMappingURL=variable.js.map
