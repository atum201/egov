"use strict";

Object.defineProperty(exports, "__esModule", {
                value: true
});
var CREATE_GROUP = exports.CREATE_GROUP = "creat group",
    UPDATE_GROUP = exports.UPDATE_GROUP = "update group",
    REMOVE_GROUP = exports.REMOVE_GROUP = "remove group";
var SOCKET_SEND_MESSAGE = exports.SOCKET_SEND_MESSAGE = "socket send message",
    SOCKET_GET_MESSAGE = exports.SOCKET_GET_MESSAGE = "socket get message",
    SOCKET_SEND_TYPING = exports.SOCKET_SEND_TYPING = "socket send typing",
    SOCKET_GET_TYPING = exports.SOCKET_GET_TYPING = "socket get typing",
    SOCKET_SEND_END_TYPING = exports.SOCKET_SEND_END_TYPING = "socket send end typing",
    SOCKET_GET_END_TYPING = exports.SOCKET_GET_END_TYPING = "socket get end typing",
    SOCKET_SEND_CONNECT = exports.SOCKET_SEND_CONNECT = "socket send connect",
    SOCKET_GET_CONNECT = exports.SOCKET_GET_CONNECT = "socket get connect",
    SOCKET_SEND_DISCONECT = exports.SOCKET_SEND_DISCONECT = "socket send disconnect",
    SOCKET_GET_DISCONNECT = exports.SOCKET_GET_DISCONNECT = "socket get disconnect",
    SOCKET_SEND_READ_MESSAGE = exports.SOCKET_SEND_READ_MESSAGE = "socket send read message",
    SOCKET_SEND_DEL_MESSAGE = exports.SOCKET_SEND_DEL_MESSAGE = "scoket send del message",
    SOCKET_GET_READ_MESSAGE = exports.SOCKET_GET_READ_MESSAGE = "socket get read message",
    SOCKET_GET_SEND_MESSAGE = exports.SOCKET_GET_SEND_MESSAGE = "socket get send message",
    SOCKET_GET_DEL_MESSAGE = exports.SOCKET_GET_DEL_MESSAGE = "socket get del message",
    SOCKET_SEND_UPDATE_GROUP = exports.SOCKET_SEND_UPDATE_GROUP = "socket send update group",
    SOCKET_GET_UPDATE_GROUP = exports.SOCKET_GET_UPDATE_GROUP = "socket get update group",
    SOCKET_GET_REMOVE_GROUP = exports.SOCKET_GET_REMOVE_GROUP = "socket get remove group",
    SOCKET_SEND_UPDATE_USER = exports.SOCKET_SEND_UPDATE_USER = "socket send update user",
    SOCKET_GET_UPDATE_USER = exports.SOCKET_GET_UPDATE_USER = "socket get update user",
    SOCKET_SEND_LOGIN_STORE = exports.SOCKET_SEND_LOGIN_STORE = "get login store",
    SOCKET_GET_LOGIN_STORE = exports.SOCKET_GET_LOGIN_STORE = "return login store",
    SOCKET_SEND_MANY_LOGIN_STORE = exports.SOCKET_SEND_MANY_LOGIN_STORE = "get many login store",
    SOCKET_GET_MANY_LOGIN_STORE = exports.SOCKET_GET_MANY_LOGIN_STORE = "return many login store",
    SOCKET_BROADCAST_CONNECT = exports.SOCKET_BROADCAST_CONNECT = "socket broadcast connect",
    SOCKET_BROADCAST_DISCONNECT = exports.SOCKET_BROADCAST_DISCONNECT = "socket broadcast disconnect";

var SOCKET_SEND_NOTIFY = exports.SOCKET_SEND_NOTIFY = "notification mic",
    SOCKET_GET_NOTIFY = exports.SOCKET_GET_NOTIFY = "receive notification";

var fileTypeFA = exports.fileTypeFA = [["fa-file-o", "fa-file-word-o", "fa-file-text-o", "fa-file-pdf-o", "fa-file-powerpoint-o", "fa-file-excel-o", "fa-file-image-o", "fa-file-zip-o"], ["application/msword", "application/rtf", "application/vnd.oasis.opendocument.text", "application/vnd.oasis.opendocument.spreadsheet"], ['text/plain', 'text/html', 'text/html', 'text/html', 'text/css', 'application/javascript', 'application/json', 'application/xml'], //text
['application/pdf'], //pdf
['application/vnd.ms-powerpoint'], //powerpoint
['application/vnd.ms-excel'], // excel
['image/png', 'image/jpeg', 'image/jpeg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/vnd.microsoft.icon', 'image/tiff', 'image/tiff', 'image/svg+xml', 'image/svg+xml'], // image
['application/zip', 'application/x-rar-compressed', 'application/x-msdownload', 'application/x-msdownload', 'application/vnd.ms-cab-compressed'] // zip
];
//# sourceMappingURL=constant.js.map
