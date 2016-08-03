import resource from 'resource-router-middleware';
import pilipilis from '../models/pilipili';
import Pili from 'pili';

const credentials = new Pili.Credentials("MqF35-H32j1PH8igh-am7aEkduP511g-5-F7j47Z", "BF9QHMKIUQp_Oh4Xk8SwyhmwJ0CO-9n-RJzDgZQr");
const hub = new Pili.Hub(credentials, "NIU7PS");

export default ({ config, db }) => resource({

	/** Property name to store preloaded entity on `request`. */
	id : 'pilipili',

	/** For requests with an `id`, you can auto-load the entity.
	 *  Errors terminate the request, success sets `req[id] = data`.
	 */
	load(req, id, callback) {
		let pilipili = pilipilis.find( pilipili => pilipili.id===id ),
			err = pilipili ? null : 'Not found';
		callback(err, pilipili);
	},

	/** GET / - List all entities */
	index({ params }, res) {
		res.json(pilipilis);
	},

	/** POST / - Create a new entity */
	create({ body }, res) {
    let title = body.title | null;
    var options = {
      title          : body.title,    // optional, auto-generated as default
      publishKey     : null,    // optional, auto-generated as default
      publishSecurity : "static" // optional, can be "dynamic" or "static", "dynamic" as default
    };

    hub.createStream(options, function(err, stream) {
      if (!err) {
        pilipilis.push(stream);
        res.json(stream);
      } else {
        console.log(err + 'error code: ' + err.errorCode + 'http code: ' + err.httpCode);
        res.json({error:err})
      }
    });

	},

	/** GET /:id - Return a given entity */
	read({ pilipili }, res) {
    console.log(pilipili);
		res.json(pilipili);
	},

	/** PUT /:id - Update a given entity */
	update({ pilipili, body }, res) {
		//for (let key in body) {
		//	if (key!=='id') {
		//		pilipili[key] = body[key];
		//	}
		//}
		res.sendStatus(204);
	},

	/** DELETE /:id - Delete a given entity */
	delete({ pilipili }, res) {
    //pilipilis.splice(pilipilis.indexOf(pilipili), 1);
    //res.sendStatus(204);
    hub.getStream(pilipili.id, function(err, stream) {
      if (!err) {
        console.log(stream);
        stream.delete(function(err, data) {
          if (!err) {
            console.log(data);
            pilipilis.splice(pilipilis.indexOf(pilipili), 1);
            res.sendStatus(204);
          } else {
            console.log(err + 'error code: ' + err.errorCode + 'http code: ' + err.httpCode);
            res.json({error:err})
          }

        });
      }
    });

	}
});
