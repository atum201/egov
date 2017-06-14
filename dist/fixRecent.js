'use strict';

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _user = require('./server/models/user');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_mongoose2.default);

// connect to mongo db
_mongoose2.default.connect("mongodb://qlvb:QLVB20119@localhost:6996/qlvb", { server: { socketOptions: { keepAlive: 1 } } });
_mongoose2.default.connection.on('error', function () {
	throw new Error('unable to connect to database: ' + config.db);
});

_user2.default.list({ $where: "this.recent.length > 1" }).then(function (users) {
	console.log("start fix recent", users.length);
	users.forEach(function (user) {
		// if(user.recent && user.length > 0){
		console.log(user.userId);
		var recent = {};
		user.recent.forEach(function (r) {
			if (recent[r.id]) {
				var c = recent[r.id].last > r.last;
				recent[r.id].last = c ? recent[r.id].last : r.last;
				recent[r.id].last = c ? recent[r.id].del : r.del;
				recent[r.id].last = c ? recent[r.id].unread : r.unread;
			} else {
				recent[r.id] = r;
			}
		});
		if (user.userId == 'chtuan') console.log(recent);
		user.recent = Object.keys(recent).map(function (key) {
			return recent[key];
		});
		user.saveAsync();
		// }
	});
}).error(function (e) {
	return console.log(e);
});
//# sourceMappingURL=fixRecent.js.map
