const db = require('./services/database');
module.exports = function(app) {
    app.get('/', function(req, res){
        const users = db.collection('users');
        users.all().then(cursor => cursor.all()
        ).then(
            data => {
                res.send({status: 200, info: data});
            },
            err => {
                console.error('Failed to execute query:', err);
            }
        )
    });
}
