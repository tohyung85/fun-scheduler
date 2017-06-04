const db = require('../services/database');
const eventsCollection = db.collection('events');
const organizerOfCollection = db.collection('organizerOf');
const Promise = require('bluebird');

exports.createEvent = function (req, res, next) {
    const event_name = req.body.event_name;
    const event_location = req.body.event_location;
    const user = req.body.user;

    const action = String(function() {
        const db = require('@arangodb').db;
        const event = db._query(`INSERT { title: '${params.event_name}' } INTO events RETURN NEW`).toArray()[0];
        const edge = db._query(`INSERT { _from: 'users/${params.user}', _to: 'events/${event._key}' } INTO organizerOf RETURN NEW`).toArray()[0];
        return {event: event, user: params.user};
    });

    db.transaction({write: ['events', 'organizerOf']}, action, {event_name: event_name, user: user})
        .then(result => {
            res.status(200).send({message: 'event creation success', event_details: result});
        })
}
