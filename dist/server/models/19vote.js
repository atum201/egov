"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Clan Model Data 
var ClanSchema = new _mongoose2.default.Schema({
  name: { type: String },
  owner: { type: _mongoose2.default.Schema.ObjectId, ref: "User" },
  symbol: { type: String },
  description: { type: String },
  role: [{
    member: { type: _mongoose2.default.Schema.ObjectId, ref: "User" },
    rule: { type: Number },
    title: { type: String }
  }],
  level: { type: Number },
  member: [{ type: _mongoose2.default.Schema.ObjectId, ref: "User" }],
  inviteMember: [{ type: _mongoose2.default.Schema.ObjectId, ref: "User" }],
  applyMember: [{ type: _mongoose2.default.Schema.ObjectId, ref: "User" }],
  createdAt: { type: Number, default: new Date().getTime() }
});
// User Model Data 
var UserSchema = new _mongoose2.default.Schema({
  account: { type: String },
  password: { type: String },
  name: { type: String },
  clan: [{ type: _mongoose2.default.Schema.ObjectId, ref: "Clan" }],
  nickName: { type: String },
  point: { type: Number },
  winGame: { type: Number },
  totalGame: { type: Number },
  title: [{ type: _mongoose2.default.Schema.ObjectId, ref: "Title" }],
  avatar: { type: String },
  netClub: [{ type: String }],
  slogan: { type: String },
  birthDay: { type: Number },
  provice: { type: String },
  adress: { type: String },
  introduce: { type: String },
  banner: { type: String },
  phone: [{ type: String }],
  createdAt: { type: Number, default: new Date().getTime() }
});
// Rank Model Data 
var RankSchema = new _mongoose2.default.Schema({
  createdAt: { type: Number, default: new Date().getTime() }
});
// Vote Model Data 
var VoteSchema = new _mongoose2.default.Schema({
  createdAt: { type: Number, default: new Date().getTime() }
});
// Match Model Data 
var TurnSchema = new _mongoose2.default.Schema({
  game: [[{ type: Number }]],
  scored: [{ type: Number }]
});
var MatchSchema = new _mongoose2.default.Schema({
  type: { type: String },
  tournament: { type: _mongoose2.default.Schema.ObjectId, ref: "Tournament" },
  user: [{ type: _mongoose2.default.Schema.ObjectId, ref: "User" }],
  index: [{ type: Number }],
  name: [{ type: String }],
  time: { type: Number },
  turn: [TurnSchema],
  scored: [{ type: Number }],
  createdAt: { type: Number, default: new Date().getTime() }
});
//. Tournament Model Data 
var TeamSchema = new _mongoose2.default.Schema({
  name: { type: String },
  member: [{ type: _mongoose2.default.Schema.ObjectId, ref: "User" }]
});
var TournamentSchema = new _mongoose2.default.Schema({
  name: { type: String },
  logo: { type: String },
  banner: { type: String },
  description: { type: String },
  time: [{ type: Number }],
  team: [TeamSchema],
  config: [{ type: Number }],
  mod: [{ type: _mongoose2.default.Schema.ObjectId, ref: "User" }],
  title: [{ type: _mongoose2.default.Schema.ObjectId, ref: "Title" }],
  user: [{ type: _mongoose2.default.Schema.ObjectId, ref: "User" }],
  createdAt: { type: Number, default: new Date().getTime() }
});
var TitleSchema = new _mongoose2.default.Schema({
  name: { type: String },
  description: { type: String },
  time: { type: Number },
  pride: { type: Number },
  tournament: { type: _mongoose2.default.Schema.ObjectId, ref: "Tournament" },
  team: { type: _mongoose2.default.Schema.ObjectId, ref: "Team" },
  user: [{ type: _mongoose2.default.Schema.ObjectId, ref: "User" }],
  createdAt: { type: Number, default: new Date().getTime() }
});
var FileSchema = new _mongoose2.default.Schema({
  fileName: { type: String, default: '', trim: true },
  url: { type: String },
  thumbnail: { type: String },
  fileType: { type: String },
  creater: { type: _mongoose2.default.Schema.ObjectId, ref: 'User' },
  createdAt: { type: Number, default: new Date().getTime() }
});

exports.Tournament = _mongoose2.default.model('19Tournament', TournamentSchema);

exports.Title = _mongoose2.default.model('19Title', TitleSchema);

exports.Team = _mongoose2.default.model('19Team', TeamSchema);

exports.Clan = _mongoose2.default.model('19Clan', ClanSchema);

exports.Match = _mongoose2.default.model('19Match', MatchSchema);

exports.User = _mongoose2.default.model('19User', UserSchema);

exports.Rank = _mongoose2.default.model('19Rank', RankSchema);

exports.Vote = _mongoose2.default.model('19Vote', VoteSchema);

exports.File = _mongoose2.default.model('19File', FileSchema);
//# sourceMappingURL=19vote.js.map
