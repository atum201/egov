'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _env = require('./config/env');

var _env2 = _interopRequireDefault(_env);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _expressEgov = require('./config/expressEgov');

var _expressEgov2 = _interopRequireDefault(_expressEgov);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _util = require('./server/common/util');

var _schema = require('./server/schema');

var _schema2 = _interopRequireDefault(_schema);

var _chatEgov = require('./server/models/chatEgov');

var _mongodb = require('mongodb');

var _constant = require('./server/common/constant');

var _variable = require('./server/common/variable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_env2.default, _env2.default.db);


_expressEgov2.default.use('/graphql',
// cors(corsOptions),
(0, _expressGraphql2.default)(function (req) {
  return {
    schema: _schema2.default,
    graphiql: true,
    rootValue: { request: req }
  };
}));
var server = _http2.default.Server(_expressEgov2.default);
var io = new _socket2.default(server);

// promisify mongoose
_bluebird2.default.promisifyAll(_mongoose2.default);

// connect to mongo db
_mongoose2.default.connect(_env2.default.db, { server: { socketOptions: { keepAlive: 1 } } });
_mongoose2.default.connection.on('error', function () {
  throw new Error('unable to connect to database: ' + _env2.default.db);
});

Array.prototype.chunk = function (n) {
  if (!this.length) {
    return [];
  }
  return [this.slice(0, n)].concat(this.slice(n).chunk(n));
};

// io.set('origins', '123.30.190.143:7777','10.145.37.72');
// io.set('origins', 'thongtinnoibo.mic.gov.vn','my.thongtinnoibo.mic.gov.vn','my.mic.gov.vn');
// io.set('origins');
var randomVersion = "";
_chatEgov.PhanCap.findOne({}).sort({ time: -1 }).execAsync().then(function (phancap) {
  randomVersion = phancap._id.toString();
  console.log(randomVersion);
});

io.on('connection', function (socket) {
  socket.on(_constant.SOCKET_SEND_CONNECT, function (data) {
    // user {userId}
    _chatEgov.User.findOneAsync({ userId: data.userId }).then(function (user) {
      if (_variable.userOnline.indexOf(user.id) == -1) {
        _variable.userOnline.push(user.id);
        socket.broadcast.emit(_constant.SOCKET_BROADCAST_CONNECT, user.id);
      }
      // log truy cap: moi lan ket noi tinh la 1 lan truy cap.
      if (user.first) {
        var indexstore = (0, _util.monthdiff)(user.first, new Date().getTime());
        var login = user.login;
        if (login.length < indexstore) {
          // có những tháng liền trước đó ko đăng nhập nên ko có dữ liệu.
          // nên tự động thêm vào 0 cho các tháng trước đó.
          for (var i = login.length; i < indexstore; i++) {
            login.push(0);
          }
          login.push(1);
        } else if (login.length === indexstore) {
          // lần đầu đăng nhập trong tháng mới.
          login.push(1);
        } else {
          var v = login[indexstore];
          login[indexstore] = v + 1;
        }
        _chatEgov.User.updateAsync({ userId: data.userId }, { $set: { login: login, last: new Date().getTime() } });
      } else {
        // first login.
        user.first = new Date().getTime();
        user.login = [1];
        user.last = new Date().getTime();
        user.saveAsync();
      }
      socket.userId = user.id;
      // console.log("socket connect",socket.id);
      _variable.socker.push(socket);
      // for(let i=0;i<socker.length;i++)
      // console.log("socket "+i,socker[i].id)
      socket.emit(_constant.SOCKET_GET_CONNECT, randomVersion, new Date().getTime());
    });
  });

  socket.on('disconnect', function () {
    var uId = socket.userId;
    console.log("socket disconnect", socket.id);
    _lodash2.default.remove(_variable.socker, function (sk) {
      return sk.userId == socket.userId && sk.id == socket.id;
    });
    if (_lodash2.default.findIndex(_variable.socker, { userId: uId }) == -1) {
      socket.broadcast.emit(_constant.SOCKET_BROADCAST_DISCONNECT, uId);
      _lodash2.default.remove(_variable.userOnline, function (id) {
        return id == uId;
      });
    }
  });

  socket.on(_constant.SOCKET_SEND_MESSAGE, function (data) {
    // data: { from: id, toGroup||toUser: id, content: content };
    var message = new _chatEgov.Message({
      from: data.from ? (0, _mongodb.ObjectID)(data.from) : undefined,
      toGroup: data.toGroup ? (0, _mongodb.ObjectID)(data.toGroup) : undefined,
      toUser: data.toUser ? (0, _mongodb.ObjectID)(data.toUser) : undefined,
      content: data.content,
      state: 0,
      time: new Date().getTime()
    });
    message.saveAsync().then(function (message) {
      var type = "user";
      if (message.toUser) {
        _variable.socker.forEach(function (sk) {
          if ((sk.userId == message.toUser || sk.userId == message.from) && sk.id != socket.id) sk.emit(_constant.SOCKET_GET_MESSAGE, message);
        });
        _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toUser) }).then(function (user) {
          if (!user.recent) user.recent = [];
          user.recent = (0, _util.updateRecent)(user.recent, message.from.toString());
          user.saveAsync();
        });
      }
      if (message.toGroup) {
        // gui tin nhan den cac thanh vien trong group dang online.
        type = "group";
        _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toGroup) }).then(function (group) {
          _variable.socker.forEach(function (sk) {
            if ((data.from == sk.userId || group.member.indexOf(sk.userId) != -1) && sk.id != socket.id) sk.emit(_constant.SOCKET_GET_MESSAGE, message);
          });
          var idsIn = _lodash2.default.flatMap(group.member, function (m) {
            return (0, _mongodb.ObjectID)(m);
          });
          _chatEgov.User.findAsync({ _id: { $in: idsIn } }).then(function (users) {
            users.forEach(function (user) {
              user.recent = (0, _util.updateRecent)(user.recent, message.toGroup.toString(), "group");
              user.saveAsync();
            });
          });
        });
      }
      _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.from) }).then(function (user) {
        if (!user.recent) {
          user.recent = [];
        }
        var rid = message.toGroup || message.toUser;
        var ii = _lodash2.default.findIndex(user.recent, { id: rid });
        if (ii == -1) user.recent.push({ id: rid, last: new Date().getTime(), type: type });
        user.saveAsync();
      });
    });
  });

  socket.on(_constant.SOCKET_SEND_UPDATE_GROUP, function (data) {
    // data: groupId
    _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(data) }).then(function (group) {
      _variable.socker.forEach(function (sk) {
        if (group.member.indexOf(sk.userId) != -1 && sk.id != socket.id) sk.emit(_constant.SOCKET_GET_UPDATE_GROUP, group);
      });
    });
  });

  socket.on(_constant.SOCKET_SEND_UPDATE_USER, function (data) {
    // data: userId.
    _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(data) }).then(function (user) {
      _variable.socker.forEach(function (sk) {
        if (sk.id != socket.id) sk.emit(_constant.SOCKET_GET_UPDATE_USER, user);
      });
    });
  });

  socket.on(_constant.SOCKET_SEND_NOTIFY, function (receiver, data) {
    _chatEgov.User.findAsync({ userId: { $in: receiver } }, { id: 1 }).then(function (ids) {
      _variable.socker.forEach(function (sk) {
        ids.forEach(function (is) {
          if (is.id == sk.userId) {
            sk.emit(_constant.SOCKET_GET_NOTIFY, data);
          }
        });
      });
    });
  });

  socket.on(_constant.SOCKET_SEND_READ_MESSAGE, function (data) {
    // {id:id,boxId:id}

    _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(data.id) }).then(function (user) {
      if (user.recent && user.recent.length > 0) {
        user.recent.forEach(function (r) {
          if (r.id == data.boxId) {
            r.unread = 0;
            r.last = new Date().getTime();
          }
        });
        user.saveAsync();
        _variable.socker.forEach(function (sk) {
          if (data.id == sk.userId) {
            sk.emit(_constant.SOCKET_GET_READ_MESSAGE, data);
          }
        });
      }
    });
  });

  socket.on(_constant.SOCKET_SEND_LOGIN_STORE, function (data) {
    var month = data.month;
    var year = data.year;
    var result = 0;
    _chatEgov.User.findOneAsync({ userId: data.username }).then(function (user) {
      if (user) {
        if (year === "all" || year === '' || year === 'undefined') {
          for (var j = 0; j < user.login.length; j++) {
            result += user.login[j];
          }
        } else {
          if (month === "all" || month === '' || month === 'undefined') {
            var fD = new Date(user.first);
            if (fD.getFullYear <= year) {
              var index = (0, _util.monthdiff)(user.first, new Date(year, 12, 1).getTime());
              for (var _j = index; _j > 0; _j--) {
                var k = 0;
                if (k < 12 && typeof user.login[_j] !== 'undefined') result += user.login[_j];
                k++;
              }
            }
          } else {
            var _index = (0, _util.monthdiff)(user.first, new Date(year, month, 1).getTime());
            if (typeof user.login[_index] !== 'undefined') result = user.login[_index];
          }
        }
      }
      socket.emit(_constant.SOCKET_GET_LOGIN_STORE, result);
      console.log(result);
    });
  });

  socket.on(_constant.SOCKET_SEND_MANY_LOGIN_STORE, function (data) {
    var month = data.month;
    var year = data.year;
    var result = [];
    _chatEgov.User.findAsync({ userId: { $in: data.users } }).then(function (users) {
      if (users) {
        users.forEach(function (user) {
          var ur = { username: user.userId, login: 0 };
          if (year === "all" || year === '' || year === 'undefined') {
            for (var j = 0; j < user.login.length; j++) {
              ur.login += user.login[j];
            }
          } else {
            if (month === "all" || month === '' || month === 'undefined') {
              var fD = new Date(user.first);
              if (fD.getFullYear <= year) {
                var index = (0, _util.monthdiff)(user.first, new Date(year, 12, 1).getTime());
                for (var _j2 = index; _j2 > 0; _j2--) {
                  var k = 0;
                  if (k < 12 && typeof user.login[_j2] !== 'undefined') ur.login += user.login[_j2];
                  k++;
                }
              }
            } else {
              var _index2 = (0, _util.monthdiff)(user.first, new Date(year, month, 1).getTime());
              if (typeof user.login[_index2] !== 'undefined') ur.login = user.login[_index2];
            }
          }
          result.push(ur);
        });
        var ar = result.chunk(150);
        console.log(ar.length, result.length);
        for (var i = 0; i < ar.length; i++) {
          socket.emit(_constant.SOCKET_GET_MANY_LOGIN_STORE, ar[i]);
        }
      }
    });
  });

  socket.on(_constant.SOCKET_SEND_DEL_MESSAGE, function (data) {
    // {id:id,boxId:id}
    _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(data.id) }).then(function (user) {
      if (user.recent && user.recent.length > 0) {
        user.recent.forEach(function (r) {
          if (r.id == data.boxId) {
            r.unread = 0;
            r.last = new Date().getTime();
            r.del = new Date().getTime();
            data.time = new Date().getTime();
          }
        });
        user.saveAsync();
        _variable.socker.forEach(function (sk) {
          if (data.id == sk.userId) {
            sk.emit(_constant.SOCKET_GET_DEL_MESSAGE, data);
          }
        });
      }
    });
  });
});

server.listen(_env2.default.port, function () {
  // debug(`server started on port ${config.port} (${config.env})`);
});

exports.default = server;
module.exports = exports['default'];
//# sourceMappingURL=indexEgov.js.map
