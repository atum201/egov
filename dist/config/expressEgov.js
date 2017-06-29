'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mysql = require('./mysql');

var _mysql2 = _interopRequireDefault(_mysql);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _cors3 = require('./cors');

var corsOption = _interopRequireWildcard(_cors3);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mongodb = require('mongodb');

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _synchronous = require('../synchronous');

var _synchronous2 = _interopRequireDefault(_synchronous);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _chatEgov = require('../server/models/chatEgov');

var _constant = require('../server/common/constant');

var _util = require('../server/common/util');

var _variable = require('../server/common/variable');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// parse body params and attache them to req.body
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: true }));

app.use(_express2.default.static('dist/public'));

// secure apps by setting various HTTP headers
app.use((0, _helmet2.default)());
app.use((0, _cors2.default)());
app.get('/', function (req, res) {
  res.sendfile('dist/public/indexEgov.html');
});

var upload = (0, _multer2.default)({ dest: _path2.default.join(__dirname, '../public/uploads/') }).any('recfiles');

app.post('/api/upload', upload, function (req, res) {
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
        content: "<a href=\"/download/" + file.id + "\" class=\"fileattach\"><i class=\"fa " + (0, _util.getFileTypeFA)(file.fileType) + " fa-3x\"></i>" + file.fileName + "</a>",
        state: 0,
        time: new Date().getTime()
      });
      message.saveAsync().then(function (message) {
        var type = "user";
        if (message.toUser) {
          _variable.socker.forEach(function (sk) {
            if (sk.userId == message.toUser || sk.userId == message.from) {
              sk.emit(_constant.SOCKET_GET_MESSAGE, message, req.body.temp[i]);
            }
          });
          _chatEgov.User.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toUser) }).then(function (user) {
            user.recent = (0, _util.updateRecent)(user.recent, message.from.toString());
            user.saveAsync();
          });
        }
        if (message.toGroup) {
          // gui tin nhan den cac thanh vien trong group dang online.
          type = "group";
          _chatEgov.Group.findOneAsync({ _id: (0, _mongodb.ObjectID)(message.toGroup) }).then(function (group) {
            _variable.socker.forEach(function (sk) {
              if (group.member.indexOf(sk.userId) != -1) {
                sk.emit(_constant.SOCKET_GET_MESSAGE, message, req.body.temp[i]);
              }
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
  };

  for (var i = 0; i < req.files.length; i++) {
    _loop(i);
  };
  res.end();
});

app.get('/download/:idfile', function (req, res) {
  _chatEgov.File.get(req.params.idfile).then(function (file) {
    res.download(file.path, file.fileName);
  }).error(function (e) {});
});
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
        return resolve(user);
      });
    });
  });
};

app.post('/api/dsnguoidung', function (req, res) {
  if (req.body) {
    var listuser = req.body; // [user]
    _bluebird2.default.each(listuser, function (val) {
      return checkUser(val).then(function (user) {});
    }).then(function (originalArray) {
      return res.send(1);
    }).catch(function (e) {
      return res.send(0);
    });
  }
});
app.post('/api/capnhatnguoidung', function (req, res) {
  //{Id:"",update:{}}
  if (req.body) {
    _chatEgov.User.findOneAsync({ userId: req.body.Id }).then(function (user) {
      if (user) {
        user.userId = req.body.update.Id || user.userId;
        user.avatar = req.body.update.AnhDaiDien || user.avatar;
        user.nickName = req.body.update.HoTen || user.nickName;
        user.saveAsync().then(function (u) {
          return res.send("Đã cập nhật người dùng Id:" + req.body.Id);
        });
      } else {
        res.send("Người dùng " + req.body.Id + "không tồn tại.");
      }
    });
  }
});
var handleMember = function handleMember(members, users) {
  var _loop2 = function _loop2(i) {
    var j = _lodash2.default.findIndex(users, function (u) {
      return u.userId == members[i];
    });
    if (j != -1) members.splice(i, 1, users[j]._id.toString());else members.splice(i, 1, undefined);
  };

  for (var i = 0; i < members.length; i++) {
    _loop2(i);
  }
  console.log(members);
  return _lodash2.default.compact(members);
};

var handleDonVi = function handleDonVi(donvi, users) {
  if (donvi.ThanhVien) donvi.ThanhVien = handleMember(donvi.ThanhVien, users);

  if (donvi.DonViCon && donvi.DonViCon.length > 0) {
    for (var i = 0; i < donvi.DonViCon.length; i++) {
      donvi.DonViCon[i] = handleDonVi(donvi.DonViCon[i], users);
    }
  } else {
    donvi.DonViCon = undefined;
  }
  console.log("handleDonVi");
  return donvi;
};
var handle = function handle(phancap) {
  return new _bluebird2.default(function (resolve, reject) {
    _chatEgov.User.findAsync({}, '_id userId').then(function (users) {
      resolve(handleDonVi(phancap, users));
    });
  });
};
app.post('/api/capnhatphancap', function (req, res) {
  if (req.body) {
    console.log(req.body);
    handle(req.body).then(function (phancap) {
      var phanCap = new _chatEgov.PhanCap({
        phanCap: phancap
      });
      phanCap.saveAsync().then(function (pc) {
        console.log(pc._id.toString());
        res.send("Nguoi dung da duoc cap nhat tai ban ghi " + pc._id.toString());
      });
    });
  }
});

app.post('/api/capnhatmysql', function (req, res) {
  (0, _mysql2.default)().then(function (result) {
    res.send(result);
  });
});

exports.default = app;
module.exports = exports['default'];
//# sourceMappingURL=expressEgov.js.map
