const main = require('../main');

// Some information for queries
const TABLE = 'actors';
const ORDER_BY = 'ORDER BY name, middle_name, last_name ASC';

// Some information for UI
const COLUMNS = ['id', 'name', 'middle_name', 'last_name', 'citizenship'];

// // Validation patterns
// const NAME_PATTERN = /^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?$/;
// const MIDDLE_NAME_PATTERN = /^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?$/;
// const LAST_NAME_PATTERN = /^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?(\,\s[A-Za-z]+\.)?$/;
//
// // Some validation information
// const NAME_MAX = 50;
//
// // Some validation messages
// const MSG_NAME_NOT_EMPTY = "Name is required!";
// const MSG_NAME_MAX = `Name must contain not more than ${NAME_MAX} symbols!`;
// const MSG_NAME_PATTERN = 'Invalid name!';
//
// const MSG_MIDDLE_NAME_MAX = `Middle name must contain not more than ${NAME_MAX} symbols!`;
// const MSG_MIDDLE_NAME_PATTERN = 'Invalid middle name!';
//
// const MSG_LAST_NAME_NOT_EMPTY = "Last name is required!";
// const MSG_LAST_NAME_MAX = `Last name must contain not more than ${NAME_MAX} symbols!`;
// const MSG_LAST_NAME_PATTERN = 'Invalid last name!';
//
// function validateRequest(req) {
//
//     req.check('name')
//         .trim()
//         .notEmpty().withMessage(MSG_NAME_NOT_EMPTY)
//         .isLength({ max: NAME_MAX }).withMessage(MSG_NAME_MAX)
//         .matches(NAME_PATTERN, 'i')
//         .withMessage(MSG_NAME_PATTERN);
//
//     req.check('middle_name')
//         .trim()
//         .isLength({ max: NAME_MAX }).withMessage(MSG_MIDDLE_NAME_MAX)
//
//     if (req.body.middle_name !== '') {
//         req.check('middle_name')
//             .matches(MIDDLE_NAME_PATTERN, 'i')
//             .withMessage(MSG_MIDDLE_NAME_PATTERN);
//     }
//
//     req.check('last_name')
//         .trim()
//         .notEmpty().withMessage(MSG_LAST_NAME_NOT_EMPTY)
//         .isLength({ max: NAME_MAX }).withMessage(MSG_LAST_NAME_MAX)
//         .matches(LAST_NAME_PATTERN, 'i')
//         .withMessage(MSG_LAST_NAME_PATTERN);
//
//     return req.validationErrors();
//
// }

// Some functions for export
module.exports = {

    deleteActor: (actorId, callback) => {
        main.deleteRow(TABLE, `id = ${actorId}`, function (err, statusCode,
            msg) {
            if (err) {
                callback({statusCode: statusCode, errors: [{ msg: msg }]});
            }
            else {
                callback({statusCode: statusCode, errors: []});
            }
        });
    },

    insertActor: (actor, callback) => {
        // const errors = validateRequest(req);
        // if (errors) {
        //     res.status(main.BAD_REQUEST).json({errors: errors});
        // }
        // else {

            if (actor.citizenship !== 'NULL') {
                actor.citizenship = `"${actor.citizenship}"`;
            }

            const newValues = `name = "${actor.name}", middle_name = "${
                actor.middle_name}", last_name = "${
                actor.last_name}", citizenship = ${actor.citizenship}`;

            main.insertRow(TABLE, newValues, function (err, statusCode, msg) {
                if (err) {
                    callback({statusCode: statusCode, errors: [{ msg: msg }]});
                }
                else {
                    callback({statusCode: statusCode, errors: []});
                }
            });

        // }
    },

    updateActor: (actor, actorId, callback) => {
        // const errors = validateRequest(actor);
        // if (errors) {
        //     res.status(main.BAD_REQUEST).json({errors: errors});
        // }
        // else {

            if (actor.citizenship !== 'NULL') {
                actor.citizenship = `"${actor.citizenship}"`;
            }

            const newValues = `name = "${actor.name}", middle_name = "${
                actor.middle_name}", last_name = "${
                actor.last_name}", citizenship = ${actor.citizenship}`;

            main.updateRow(TABLE, newValues, `id = ${actorId}`,
                function (err, statusCode, msg) {
                if (err) {
                    callback({statusCode: statusCode, errors: [{ msg: msg }]});
                }
                else {
                    callback({statusCode: statusCode, errors: []});
                }
            });

        // }
    },

    getActor: (actorId, callback) => {
        main.selectRow(TABLE, `id = ${actorId}`, function (err, statusCode,
            msg, row) {
            if (err) {
                callback({statusCode: statusCode, row: [], errors: [{ msg: msg }]});
            }
            else {
                if (row[0].citizenship === null) {
                    row[0].citizenship = 'NULL';
                }
                callback({statusCode: statusCode, row: row, errors: []});
            }
        });
    },

    getActors: (callback) => {
        main.selectAllRows(TABLE, ORDER_BY, function (err, statusCode, msg, rows) {
            if (err) {
                callback({statusCode: statusCode, rows: [], errors: [{ msg: msg }]});
            }
            else {
                callback({statusCode: statusCode, rows: rows, errors: []});
            }
        });
    }

};
