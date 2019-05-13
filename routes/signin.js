const main = require('../main');

const md5 = require('md5');
const config = require('../config');

// Some information for queries
const TABLE = 'administrators';

// Some validation messages
const MSG_CANNOT_FIND = 'The administrator hasn\'t been signed up in the system!';
const MSG_INCORRECT_PASSWORD = 'Incorrect password!';

module.exports = {
    signIn: (administrator, callback) => {
        var sql = `SELECT * FROM ${TABLE} WHERE login = "${administrator.login}";`;
        main.db.query(sql, function (err, result) {

            if (err) {
                console.log(err);
                callback({statusCode: main.INTERNAL_SERVER_ERROR, errors:
                    [{ msg: main.INTERNAL_ERROR_MSG }], token: null});
                return;
            }

            if (result.length === 0) {
                callback({statusCode: main.BAD_REQUEST, errors:
                    [{ msg: MSG_CANNOT_FIND }], token: null});
                return;
            }

            if (md5(administrator.password) === result[0].password) {

                const token = main.jwt.sign({
                    login: result[0].login,
                    password: result[0].password
                }, config.KEY,
                    { expiresIn: config.TIME_JWT }
                );

                callback({statusCode: main.OK, errors:
                    [], token: token});

            }
            else {
                callback({statusCode: main.BAD_REQUEST, errors:
                    [{ msg: MSG_INCORRECT_PASSWORD }], token: null});
            }

        });
    }
}
