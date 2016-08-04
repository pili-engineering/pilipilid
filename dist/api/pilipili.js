'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _resourceRouterMiddleware = require('resource-router-middleware');

var _resourceRouterMiddleware2 = _interopRequireDefault(_resourceRouterMiddleware);

var _pili = require('pili');

var _pili2 = _interopRequireDefault(_pili);

var _level = require('level');

var _level2 = _interopRequireDefault(_level);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = (0, _level2.default)('./mydb');
var credentials = new _pili2.default.Credentials("MqF35-H32j1PH8igh-am7aEkduP511g-5-F7j47Z", "BF9QHMKIUQp_Oh4Xk8SwyhmwJ0CO-9n-RJzDgZQr");
var hub = new _pili2.default.Hub(credentials, "NIU7PS");

var pilipilis = [];

db.get("pilipili", function (err, value) {
  if (err) {
    if (err.notFound) {}
  } else {
    pilipilis = JSON.parse(value);
  }
});

exports.default = function (_ref) {
  var config = _ref.config;
  return (0, _resourceRouterMiddleware2.default)({

    /** Property name to store preloaded entity on `request`. */
    id: 'pilipili',

    /** For requests with an `id`, you can auto-load the entity.
     *  Errors terminate the request, success sets `req[id] = data`.
     */
    load: function load(req, id, callback) {
      var pilipili = pilipilis.find(function (pilipili) {
        return pilipili.id === id;
      }),
          err = pilipili ? null : 'Not found';
      callback(err, pilipili);
    },


    /** GET / - List all entities */
    index: function index(_ref2, res) {
      var params = _ref2.params;

      res.json(pilipilis);
    },


    /** POST / - Create a new entity */
    create: function create(_ref3, res) {
      var body = _ref3.body;

      var title = body.title | null;
      var options = {
        title: body.title, // optional, auto-generated as default
        publishKey: null, // optional, auto-generated as default
        publishSecurity: "static" // optional, can be "dynamic" or "static", "dynamic" as default
      };

      hub.createStream(options, function (err, stream) {
        if (!err) {
          pilipilis.push(stream);
          db.put('pilipili', JSON.stringify(pilipilis));
          res.json(stream);
        } else {
          console.log(err + 'error code: ' + err.errorCode + 'http code: ' + err.httpCode);
          res.json({ error: err });
        }
      });
    },


    /** GET /:id - Return a given entity */
    read: function read(_ref4, res) {
      var pilipili = _ref4.pilipili;

      console.log(pilipili);
      res.json(pilipili);
    },


    /** PUT /:id - Update a given entity */
    update: function update(_ref5, res) {
      var pilipili = _ref5.pilipili;
      var body = _ref5.body;

      //for (let key in body) {
      //	if (key!=='id') {
      //		pilipili[key] = body[key];
      //	}
      //}
      res.sendStatus(204);
    },


    /** DELETE /:id - Delete a given entity */
    delete: function _delete(_ref6, res) {
      var pilipili = _ref6.pilipili;

      //pilipilis.splice(pilipilis.indexOf(pilipili), 1);
      //res.sendStatus(204);
      hub.getStream(pilipili.id, function (err, stream) {
        if (!err) {
          console.log(stream);
          stream.delete(function (err, data) {
            if (!err) {
              console.log(data);
              pilipilis.splice(pilipilis.indexOf(pilipili), 1);
              db.put('pilipili', JSON.stringify(pilipilis));
              res.sendStatus(204);
            } else {
              console.log(err + 'error code: ' + err.errorCode + 'http code: ' + err.httpCode);
              res.json({ error: err });
            }
          });
        }
      });
    }
  });
};
//# sourceMappingURL=pilipili.js.map