const passport = require('passport');
const User = require('../controllers/user_controller');
const env = require('../.env');
const LocalStrategy = require('passport-local');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

// Create local strategy
const localOptions = {usernameField: 'email'}; // Tell local login to look at email property instead of default username property
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
    // Verify this username and password, call done if user found, call false if not
    User.getUser(email)
    .then(
        data => {
            const user = data[0];
            if(!user) return done(null, false);

            User.compareUserPassword(password, user.pwd_hash)
                .then(isMatch => {
                    if(isMatch) return done(null, user);

                    return done(null, false);
                })
        }
    );
});

// Set up options for JWT
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: env.jwtSecret
};

// Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
    User.getUser(payload.sub)
    .then(data => {
        const user = data[0];
        if(user) {
            done(null, user);
        } else {
            done(null, false);
        }
    })
    // See if user id in payload exists in database, if so call done with that user object
    // otherwise call done without user object
});

// Tell Passport to use this strategy
passport.use(jwtLogin);
passport.use(localLogin);
