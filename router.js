const db = require('./services/database');
const User = require('./controllers/user_controller');
const passportService = require('./services/passport');
// Require will run the passport.use(jwtStrategy) and so give passport the configurations
// Note passport is a singleton
// i.e can just do require('./services/passport')
const Authentication = require('./controllers/authentication');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', {session: false}); // Set session false to not use cookie request
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
    app.get('/', requireAuth, function(req, res){
        res.status(200).send('Access granted!');
    });

    app.get('/users/:email', User.getUser);
    app.post('/users/signin', requireSignin, Authentication.signin);
    app.post('/users/signup', Authentication.signup);
}
