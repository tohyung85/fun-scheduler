const jwt = require('jwt-simple');
const User = require('./user_controller');
const env = require('../.env');

function generateTokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({sub: user._key, iat: timestamp}, env.jwtSecret);
}

exports.signin = function(req, res, next) {
    // User has already had email and password auth
    // We just need to give them the token
    // In passport.js done callback called and user passed as parameter. The user model is placed in req
    res.status(200).send({
                message: 'sign in success',
                jwt_token: generateTokenForUser(req.user)
            });
}

exports.signup = function(req, res, next) {
    const email = req.body.email;
    const password = req.body.password;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;

    if(!email || !password) {
        return res.status(422).send({error: 'You must provide an email and password' });
    }

    User.getUser(email)
    .then(data => {
        const user = data[0];
        if(user) return res.status(422).send({error: 'User is already registered'});

        return User.registerUser(email, password, first_name, last_name);
    })
    .then(data => {
        const user = data[0];
        return res.status(200).send({
            message: 'sign up success',
            jwt_token: generateTokenForUser(user)
        });
    })

}
