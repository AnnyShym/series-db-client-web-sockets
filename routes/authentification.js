const express = require('express');
const md5 = require('md5');
const config = require('../config');

const router = express.Router();

const TABLE = 'administrators';

// Validation patterns
const DIGITS_PATTERN = '[0-9]';
const LOW_LATIN_PATTERN = '[a-z]';
const UP_LATIN_PATTERN = '[A-Z]';

// Some validation information
const LOGIN_MAX = 50;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 20;

// Some validation messages
const MSG_CANNOT_FIND = 'The administrator hasn\'t been signed up in the system!';
const MSG_INCORRECT_PASSWORD = 'Incorrect password!';

const MSG_LOGIN_INCORRECT = 'Login should be a valid email!';
const MSG_LOGIN_MAX = `Login must contain not more than ${LOGIN_MAX} symbols!`;

const MSG_PASSWORD_MIN = `Password must contain at least ${PASSWORD_MIN} symbols!`;
const MSG_PASSWORD_MAX = `Password must contain not more than ${PASSWORD_MAX} symbols!`;
const MSG_PASSWORD_ASCII_ONLY = 'Password may contain only ASCII symbols!';
const MSG_PASSWORD_DIGITS = 'Password must contain at least 1 digital!';
const MSG_PASSWORD_LOW_LATIN = 'Password must contain at least 1 latin lowercase letter!';
const MSG_PASSWORD_UP_LATIN = 'Password must contain at least 1 latin uppercase letter!';

router.post('/signin', function(req, res) {
    var sql = `SELECT * FROM ${TABLE} WHERE login = ${req.body.login};`;
    db.query(sql, function (err, result) {

        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }

        if (result.length == 0) {
            res.status(BAD_REQUEST).json({errors: MSG_CANNOT_FIND});
        }

        if (md5(req.body.password) === result[0].password) {

            const token = jwt.sign({
                login: result[0].login,
                password: result[0].password
            }, config.KEY,
                { expiresIn: config.TIME_JWT }
            );

            res.cookie('auth', token, { httpOnly: true, maxAge: config.TIME_COOKIE });
            res.sendStatus(OK);

        }
        else {
            res.status(BAD_REQUEST).json({errors: MSG_INCORRECT_PASSWORD});
        }

    });
}

function validateRequest(req) {

  req.check('login')
      .trim()
      .isEmail().withMessage(MSG_LOGIN_INCORRECT)
      .isLength({ max: LOGIN_MAX }).withMessage(MSG_LOGIN_MAX)

  req.check('password')
      .isLength({ min: PASSWORD_MIN }).withMessage(MSG_PASSWORD_MIN)
      .isLength({ max: PASSWORD_MAX }).withMessage(MSG_PASSWORD_MAX)
      .isAscii().withMessage(MSG_PASSWORD_ASCII_ONLY)
      .matches(DIGITS_PATTERN).withMessage(MSG_PASSWORD_DIGITS)
      .matches(LOW_LATIN_PATTERN).withMessage(MSG_PASSWORD_LOW_LATIN)
      .matches(UP_LATIN_PATTERN).withMessage(MSG_PASSWORD_UP_LATIN);

  return req.validationErrors();

}

router.post('/signup', function(req, res) {
    const errors = validateRequest(req);
    if (errors) {
        res.status(BAD_REQUEST).json({errors: errors});
    }
    else {

        const newValues = `login = "${req.body.login}", password = "${
            req.body.password}"`;

        insertRow(TABLE, newValues, function (err, statusCode) {
            if (err) {
                console.log(err);
                res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
            }
            else {
                res.sendStatus(statusCode);
            }
        });

    }
}

module.exports = router;
