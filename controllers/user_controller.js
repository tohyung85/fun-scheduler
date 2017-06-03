const db = require('../services/database');
const collection = db.collection('users');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');

const genSalt = Promise.promisify(bcrypt.genSalt);
const hash = Promise.promisify(bcrypt.hash);
const compare = Promise.promisify(bcrypt.compare);

exports.getUser = function (email) {
    return db.query(`RETURN DOCUMENT('users/${email}')`).then(cursor => cursor.all());
}

exports.compareUserPassword = function (userPassword, dbPassword) {
    return compare(userPassword, dbPassword)
}

exports.registerUser = function(email, password, first_name, last_name) {
    return genSalt(10)
        .then((salt) => {
            return hash(password, salt, null);
        })
        .then((hash) => {
            const query = `
                INSERT {
                    _key: '${email}',
                    pwd_hash: '${hash}',
                    first_name: '${first_name}',
                    last_name: '${last_name}'
                } INTO users
                RETURN NEW
            `
            return db.query(query);
        })
        .then(cursor => cursor.all());
}
