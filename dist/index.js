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

var _socket2 = require('socket.io');

var _socket3 = _interopRequireDefault(_socket2);

var _express = require('./config/express');

var _express2 = _interopRequireDefault(_express);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _cors3 = require('./config/cors');

var corsOptions = _interopRequireWildcard(_cors3);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _mongodb = require('mongodb');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

var _synchronous = require('./synchronous');

var _synchronous2 = _interopRequireDefault(_synchronous);

var _Util = require('./server/helpers/Util');

var _chatEgov = require('./server/models/chatEgov');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _graphql = require('graphql');

var _OutputType = require('./server/schema/types/OutputType');

var _message = require('./server/schema/queries/message');

var _group2 = require('./server/schema/queries/group');

var _group3 = _interopRequireDefault(_group2);

var _phancap = require('./server/schema/queries/phancap');

var _phancap2 = _interopRequireDefault(_phancap);

var _user = require('./server/schema/queries/user');

var _user2 = require('./server/schema/mutations/user');

var _user3 = _interopRequireDefault(_user2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var randomVersion = (0, _Util.randomString)(19);
var upload = (0, _multer2.default)({ dest: __dirname + '/public/uploads/' }).any('recfiles');
var uploadUserStruct = (0, _multer2.default)({ dest: __dirname + '/data/' }).single('dsnhansu');
var fileTypeFA = [["fa-file-o", "fa-file-word-o", "fa-file-text-o", "fa-file-pdf-o", "fa-file-powerpoint-o", "fa-file-excel-o", "fa-file-image-o", "fa-file-zip-o"], ["application/msword", "application/rtf", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.spreadsheet"], ['text/plain', 'text/html', 'text/html', 'text/html', 'text/css', 'application/javascript', 'application/json', 'application/xml'], //text
['application/pdf'], //pdf
['application/vnd.ms-powerpoint'], //powerpoint
['application/vnd.ms-excel'], // excel
['image/png', 'image/jpeg', 'image/jpeg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/vnd.microsoft.icon', 'image/tiff', 'image/tiff', 'image/svg+xml', 'image/svg+xml'], // image
['application/zip', 'application/x-rar-compressed', 'application/x-msdownload', 'application/x-msdownload', 'application/vnd.ms-cab-compressed'] // zip
];
var getFileTypeFA = function getFileTypeFA(mimetype) {
  var r = "fa-file-o";
  for (var i = 1; i < fileTypeFA.length; i++) {
    for (var j = 0; j < fileTypeFA[i].length; j++) {
      if (fileTypeFA[i][j] == mimetype) r = fileTypeFA[0][i];
    }
  }return r;
};
var updateRecent = function updateRecent(recent, id, type) {
  var r = [];
  for (var i = 0; i < recent.length; i++) {
    if (recent[i].id == id) r.push(recent[i]);
  }
  if (r.length == 0) {
    recent.push({ id: id, unread: 1, last: new Date().getTime(), type: type || "user" });
  } else if (r.length == 1) {
    var _i = _lodash2.default.findIndex(recent, function (r) {
      return r.id.trim() == id;
    });
    recent[_i].unread = recent[_i].unread + 1;
    recent[_i].last = new Date().getTime();
  } else {
    var last = r[0];
    for (var _i2 = 0; _i2 < r.length; _i2++) {
      if (last.last < r[_i2].last) last = r[_i2];
    }last.unread = last.unread + 1;
    last.last = new Date().getTime();
    _lodash2.default.remove(recent, function (r) {
      return r.id == id;
    });
    recent.push(last);
  }
  return recent.sort(function (r1, r2) {
    return r1.last < r2.last;
  });
};
_express2.default.post('/api/upload', upload, function (req, res) {
  var _loop = function _loop(i) {
    var file = new _chatEgov.File({
      fileName: req.files[i].originalname,
      fileType: req.files[i].mimetype,
      path: req.files[i].path,
      creater: (0, _mongodb.ObjectID)(req.body.from)
    });
    file.saveAsync().then(function (file) {
      var message = new _chatEgov.Message({
        from: req.body ? (0, _mongodb.ObjectID)(req.body.from) : undefined,
        toGroup: req.body.toGroup ? (0, _mongodb.ObjectID)(req.body.toGroup) : undefined,
        toUser: req.body.toUser ? (0, _mongodb.ObjectID)(req.body.toUser) : undefined,
        content: "<a href=\"/download/" + file.id + "\" class=\"fileattach\"><i class=\"fa " + getFileTypeFA(file.fileType) + " fa-3x\"></i>" + file.fileName + "</a>",
        state: 0,
        time: new Date().getTime()
      });
      message.saveAsync().then(function (message) {
        var type = "user";
        if (message.toUser) {
          socker.forEach(function (sk) {
            if (sk.userId == message.toUser || sk.userId == message.from) {
              sk.emit(SOCKET_GET_MESSAGE, message, req.body.temp[i]);
            }
          });
          _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toUser) }).then(function (user) {
            user.recent = updateRecent(user.recent, message.from.toString());
            user.saveAsync();
          });
        }
        if (message.toGroup) {
          // gui tin nhan den cac thanh vien trong group dang online.
          type = "group";
          _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toGroup) }).then(function (group) {
            socker.forEach(function (sk) {
              if (group.member.indexOf(sk.userId) != -1) {
                sk.emit(SOCKET_GET_MESSAGE, message, req.body.temp[i]);
              }
            });
            var idsIn = _lodash2.default.flatMap(group.member, function (m) {
              return (0, _mongodb.ObjectID)(m);
            });
            _chatEgov.User.findAsync({ _id: { $in: idsIn } }).then(function (users) {
              users.forEach(function (user) {
                user.recent = updateRecent(user.recent, message.toGroup.toString(), "group");
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
  };

  for (var i = 0; i < req.files.length; i++) {
    _loop(i);
  };
  res.end();
});
_express2.default.post('/api/updateUserStruct', uploadUserStruct, function (req, res) {
  if (req.file) {
    (function () {
      var d = new Date();
      var day = d.getDate();
      var month = d.getMonth() + 1;
      var year = d.getFullYear();
      var hour = d.getHours();
      var minute = d.getMinutes();
      var filename = day + "-" + month + "-" + year + "_" + hour + "-" + minute + "_" + req.body.username + ".xls";
      var fileUpload = _lodash2.default.last(req.file.path.split("/"));
      var newpath = req.file.path.replace(fileUpload, filename);
      _fs2.default.rename(req.file.path, newpath, function (err) {
        if (err) {
          console.log(err);return;
        }
        (0, _update2.default)(newpath, function (phancapId) {
          res.send("Nguoi dung da duoc cap nhat tai ban ghi " + phancapId);
          randomVersion = phancapId;
        });
      });
    })();
  } else {
    res.send("File ko hop le, xin kiem tra lai");
  }
});
_express2.default.post('/api/synchronous', (0, _cors2.default)(), function (req, res) {
  (0, _synchronous2.default)("http://my.mic.gov.vn/dongbonhansu/dsnhansu.xls").then(function (phancapId) {
    res.send("Nguoi dung da duoc cap nhat tai ban ghi " + phancapId);
    randomVersion = phancapId;
  }).catch(function (error) {
    console.log(error), res.send(error);
  });
});
_express2.default.get('/api/synchronous', (0, _cors2.default)(), function (req, res) {
  console.log("synchronous get");
  (0, _synchronous2.default)("http://my.mic.gov.vn/dongbonhansu/dsnhansu.xls").then(function (phancapId) {
    res.send("Nguoi dung da duoc cap nhat tai ban ghi " + phancapId);
    randomVersion = phancapId;
  }).catch(function (error) {
    console.log(error), res.send(error);
  });
});
_express2.default.get('/download/:idfile', function (req, res) {
  _chatEgov.File.get(req.params.idfile).then(function (file) {
    res.download(file.path, file.fileName);
  }).error(function (e) {});
});

var _socket = void 0;

// import updateGroup from './server/schema/mutations/group';


var userOnline = []; // [id];
var userIds = []; // [userId]
var socker = []; // socket.userid = id;

var CREATE_GROUP = "creat group",
    UPDATE_GROUP = "update group",
    REMOVE_GROUP = "remove group";
var SOCKET_SEND_MESSAGE = "socket send message",
    SOCKET_GET_MESSAGE = "socket get message",
    SOCKET_SEND_TYPING = "socket send typing",
    SOCKET_GET_TYPING = "socket get typing",
    SOCKET_SEND_END_TYPING = "socket send end typing",
    SOCKET_GET_END_TYPING = "socket get end typing",
    SOCKET_SEND_CONNECT = "socket send connect",
    SOCKET_GET_CONNECT = "socket get connect",
    SOCKET_SEND_DISCONECT = "socket send disconnect",
    SOCKET_GET_DISCONNECT = "socket get disconnect",
    SOCKET_SEND_READ_MESSAGE = "socket send read message",
    SOCKET_SEND_DEL_MESSAGE = "scoket send del message",
    SOCKET_GET_READ_MESSAGE = "socket get read message",
    SOCKET_GET_SEND_MESSAGE = "socket get send message",
    SOCKET_GET_DEL_MESSAGE = "socket get del message",
    SOCKET_SEND_UPDATE_GROUP = "socket send update group",
    SOCKET_GET_UPDATE_GROUP = "socket get update group",
    SOCKET_GET_REMOVE_GROUP = "socket get remove group",
    SOCKET_SEND_UPDATE_USER = "socket send update user",
    SOCKET_GET_UPDATE_USER = "socket get update user",
    SOCKET_SEND_LOGIN_STORE = "get login store",
    SOCKET_GET_LOGIN_STORE = "return login store",
    SOCKET_SEND_MANY_LOGIN_STORE = "get many login store",
    SOCKET_GET_MANY_LOGIN_STORE = "return many login store",
    SOCKET_BROADCAST_CONNECT = "socket broadcast connect",
    SOCKET_BROADCAST_DISCONNECT = "socket broadcast disconnect";

var SOCKET_SEND_NOTIFY = "notification mic",
    SOCKET_GET_NOTIFY = "receive notification";

var g = {
  type: new _graphql.GraphQLInputObjectType({
    name: "groupInput",
    fields: {
      id: { type: _graphql.GraphQLString },
      title: { type: _graphql.GraphQLString },
      creater: { type: _graphql.GraphQLString },
      member: { type: new _graphql.GraphQLList(_graphql.GraphQLString) },
      action: { type: _graphql.GraphQLString }
    }
  }) };

var updateGroup = {
  type: _OutputType.GroupType,
  args: {
    g: g
  },
  resolve: function resolve(root, _ref) {
    var g = _ref.g;

    if (g.action === CREATE_GROUP) {
      var _group = new _chatEgov.Group({
        name: g.title || "Nhóm mới",
        creater: g.creater,
        member: g.member || [g.creater]
      });
      return _group.saveAsync().then(function (group) {
        var ids = _lodash2.default.flatMap(group.member, function (m) {
          return (0, _mongodb.ObjectID)(m);
        });
        _chatEgov.User.findAsync({ _id: { $in: ids } }).then(function (users) {
          _lodash2.default.forEach(users, function (user) {
            user.groups.push(group.id);
            user.saveAsync();
          });
        });

        return group;
      });
    }
    if (g.action === UPDATE_GROUP) {
      return _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(g.id) }).then(function (group) {
        var memberOut = [];
        var memberIn = [];
        var member = [];

        if (g.member) {
          memberOut = _lodash2.default.difference(group.member, g.member);
          memberIn = _lodash2.default.difference(g.member, group.member);
          var idsOut = _lodash2.default.flatMap(memberOut, function (m) {
            return (0, _mongodb.ObjectID)(m);
          });
          var idsIn = _lodash2.default.flatMap(memberIn, function (m) {
            return (0, _mongodb.ObjectID)(m);
          });
          // update user out/ in
          _chatEgov.User.findAsync({ _id: { $in: idsOut } }).then(function (users) {
            _lodash2.default.forEach(users, function (user) {
              user.groups.splice(user.groups.indexOf(g.id), 1);
              user.recent.splice(_lodash2.default.findIndex(user.recent, function (r) {
                return r.id == g.id;
              }), 1);
              user.saveAsync();
            });
          });
          _chatEgov.User.findAsync({ _id: { $in: idsIn } }).then(function (users) {
            _lodash2.default.forEach(users, function (user) {
              user.groups.push(g.id); // = _.union(user.groups,g.id);
              user.saveAsync();
            });
          });
          group.member = g.member;
          member = g.member;
        }
        // update group
        group.name = g.title || group.name;
        socker.forEach(function (sk) {
          if (_lodash2.default.indexOf(memberOut, sk.userId) != -1 || _lodash2.default.indexOf(group.member, sk.userId) != -1) sk.emit(SOCKET_GET_UPDATE_GROUP, { group: { id: group._id, member: group.member, creater: group.creater, name: group.name }, leave: memberOut, join: memberIn });
          // else
          //   console.log(memberOut,sk.userId)
        });
        return group.saveAsync();
      });
    }
    if (g.action === REMOVE_GROUP) {
      return _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(g.id) }).then(function (group) {
        if (group) {
          var idsOut = _lodash2.default.flatMap(group.member, function (m) {
            return (0, _mongodb.ObjectID)(m);
          });
          _chatEgov.User.findAsync({ _id: { $in: idsOut } }).then(function (users) {
            _lodash2.default.forEach(users, function (user) {
              user.groups.splice(user.groups.indexOf(g.id), 1);
              user.recent.splice(_lodash2.default.findIndex(user.recent, function (r) {
                return r.id == g.id;
              }), 1);
              user.saveAsync();
            });
          });
          socker.forEach(function (sk) {
            sk.emit(SOCKET_GET_REMOVE_GROUP, g.id);
            if (_lodash2.default.indexOf(group.member, sk.userId) !== -1) sk.emit(SOCKET_GET_REMOVE_GROUP, g.id);
          });
          _chatEgov.Message.findAsync({ toGroup: g.id }).then(function (messages) {
            messages.forEach(function (message) {
              return message.removeAsync();
            });
          });
          group.removeAsync();
          return { id: "0" };
        } else {
          return { id: "-1" };
        }
      });
    }
  }
};

var online = {
  type: new _graphql.GraphQLList(_graphql.GraphQLString),
  resolve: function resolve() {
    return userOnline;
  }
};

var schema = new _graphql.GraphQLSchema({
  query: new _graphql.GraphQLObjectType({
    name: 'Query',
    fields: {
      message: _message.message,
      newMessage: _message.newMessage,
      group: _group3.default,
      user: _user.user,
      users: _user.users,
      login: _user.login,
      logins: _user.logins,
      userById: _user.userById,
      phancap: _phancap2.default,
      online: online
    }
  }),
  mutation: new _graphql.GraphQLObjectType({
    name: 'Mutation',
    fields: {
      updateGroup: updateGroup,
      updateUser: _user3.default
    }
  })
});

_express2.default.use('/graphql',
// cors(corsOptions),
(0, _expressGraphql2.default)(function (req) {
  return {
    schema: schema,
    graphiql: true,
    rootValue: { request: req }
  };
}));
var server = _http2.default.Server(_express2.default);
var io = new _socket3.default(server);

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

_chatEgov.PhanCap.findOne({}).sort({ time: -1 }).execAsync().then(function (phancap) {
  randomVersion = phancap._id.toString();
});

// io.set('origins', '123.30.190.143:7777','10.145.37.72');
// io.set('origins', 'thongtinnoibo.mic.gov.vn','my.thongtinnoibo.mic.gov.vn','my.mic.gov.vn');
// io.set('origins');
io.on('connection', function (socket) {
  _socket = socket;
  socket.on(SOCKET_SEND_CONNECT, function (data) {
    // user {userId}
    _chatEgov.User.findOneAsync({ userId: data.userId }).then(function (user) {
      if (userOnline.indexOf(user.id) == -1) {
        userOnline.push(user.id);
        socket.broadcast.emit(SOCKET_BROADCAST_CONNECT, user.id);
      }

      // log truy cap: moi lan ket noi tinh la 1 lan truy cap.
      if (user.first) {
        var indexstore = (0, _Util.monthdiff)(user.first, new Date().getTime());
        var _login = user.login;
        if (_login.length < indexstore) {
          // có những tháng liền trước đó ko đăng nhập nên ko có dữ liệu.
          // nên tự động thêm vào 0 cho các tháng trước đó.
          for (var i = _login.length; i < indexstore; i++) {
            _login.push(0);
          }
          _login.push(1);
        } else if (_login.length === indexstore) {
          // lần đầu đăng nhập trong tháng mới.
          _login.push(1);
        } else {
          var v = _login[indexstore];
          _login[indexstore] = v + 1;
        }
        _chatEgov.User.updateAsync({ userId: data.userId }, { $set: { login: _login, last: new Date().getTime() } });
      } else {
        // first login.
        user.first = new Date().getTime();
        user.login = [1];
        user.last = new Date().getTime();
        user.saveAsync();
      }

      var timecache = (0, _Util.minutediff)(user.last);
      if (timecache > 15 || !user.last) {// lớn hơn 15 phút, hoặc lần đầu tính là 1 lần đăng nhập mới

      }

      socket.userId = user.id;
      socker.push(socket);
      socket.emit(SOCKET_GET_CONNECT, randomVersion, new Date().getTime());
    });
  });

  socket.on('disconnect', function () {
    var uId = socket.userId;
    _lodash2.default.remove(socker, function (sk) {
      return sk.userId == socket.userId && sk.id == socket.id;
    });
    if (_lodash2.default.findIndex(socker, { userId: uId }) == -1) {
      socket.broadcast.emit(SOCKET_BROADCAST_DISCONNECT, uId);
      _lodash2.default.remove(userOnline, function (id) {
        return id == uId;
      });
    }
  });

  socket.on(SOCKET_SEND_MESSAGE, function (data) {
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
        socker.forEach(function (sk) {
          if ((sk.userId == message.toUser || sk.userId == message.from) && sk.id != socket.id) sk.emit(SOCKET_GET_MESSAGE, message);
        });
        _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toUser) }).then(function (user) {
          if (!user.recent) user.recent = [];
          user.recent = updateRecent(user.recent, message.from.toString());
          user.saveAsync();
        });
      }
      if (message.toGroup) {
        // gui tin nhan den cac thanh vien trong group dang online.
        type = "group";
        _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toGroup) }).then(function (group) {
          socker.forEach(function (sk) {
            if ((data.from == sk.userId || group.member.indexOf(sk.userId) != -1) && sk.id != socket.id) sk.emit(SOCKET_GET_MESSAGE, message);
          });
          var idsIn = _lodash2.default.flatMap(group.member, function (m) {
            return (0, _mongodb.ObjectID)(m);
          });
          _chatEgov.User.findAsync({ _id: { $in: idsIn } }).then(function (users) {
            users.forEach(function (user) {
              user.recent = updateRecent(user.recent, message.toGroup.toString(), "group");
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

  socket.on(SOCKET_SEND_UPDATE_GROUP, function (data) {
    // data: groupId
    _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(data) }).then(function (group) {
      socker.forEach(function (sk) {
        if (group.member.indexOf(sk.userId) != -1 && sk.id != socket.id) sk.emit(SOCKET_GET_UPDATE_GROUP, group);
      });
    });
  });

  socket.on(SOCKET_SEND_UPDATE_USER, function (data) {
    // data: userId.
    _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(data) }).then(function (user) {
      socker.forEach(function (sk) {
        if (sk.id != socket.id) sk.emit(SOCKET_GET_UPDATE_USER, user);
      });
    });
  });

  socket.on(SOCKET_SEND_NOTIFY, function (receiver, data) {
    _chatEgov.User.findAsync({ userId: { $in: receiver } }, { id: 1 }).then(function (ids) {
      socker.forEach(function (sk) {
        ids.forEach(function (is) {
          if (is.id == sk.userId) {
            sk.emit(SOCKET_GET_NOTIFY, data);
          }
        });
      });
    });
  });

  socket.on(SOCKET_SEND_READ_MESSAGE, function (data) {
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
        socker.forEach(function (sk) {
          if (data.id == sk.userId) {
            sk.emit(SOCKET_GET_READ_MESSAGE, data);
          }
        });
      }
    });
  });

  socket.on(SOCKET_SEND_LOGIN_STORE, function (data) {
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
              var index = (0, _Util.monthdiff)(user.first, new Date(year, 12, 1).getTime());
              for (var _j = index; _j > 0; _j--) {
                var k = 0;
                if (k < 12 && typeof user.login[_j] !== 'undefined') result += user.login[_j];
                k++;
              }
            }
          } else {
            var _index = (0, _Util.monthdiff)(user.first, new Date(year, month, 1).getTime());
            if (typeof user.login[_index] !== 'undefined') result = user.login[_index];
          }
        }
      }
      socket.emit(SOCKET_GET_LOGIN_STORE, result);
      console.log(result);
    });
  });

  socket.on(SOCKET_SEND_MANY_LOGIN_STORE, function (data) {
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
                var index = (0, _Util.monthdiff)(user.first, new Date(year, 12, 1).getTime());
                for (var _j2 = index; _j2 > 0; _j2--) {
                  var k = 0;
                  if (k < 12 && typeof user.login[_j2] !== 'undefined') ur.login += user.login[_j2];
                  k++;
                }
              }
            } else {
              var _index2 = (0, _Util.monthdiff)(user.first, new Date(year, month, 1).getTime());
              if (typeof user.login[_index2] !== 'undefined') ur.login = user.login[_index2];
            }
          }
          result.push(ur);
        });
        var ar = result.chunk(150);
        console.log(ar.length, result.length);
        for (var i = 0; i < ar.length; i++) {
          socket.emit(SOCKET_GET_MANY_LOGIN_STORE, ar[i]);
        }
      }
    });
  });

  socket.on(SOCKET_SEND_DEL_MESSAGE, function (data) {
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
        socker.forEach(function (sk) {
          if (data.id == sk.userId) {
            sk.emit(SOCKET_GET_DEL_MESSAGE, data);
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
//# sourceMappingURL=index.js.map
