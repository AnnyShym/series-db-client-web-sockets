const express = require('express');
const router = express.Router();

// Array of possible countries
const COUNTRIES = require('../modules/countries');

// Some information for queries
const TABLE = 'actors';
const ORDER_BY = 'ORDER BY name, middle_name, last_name ASC';

// Some information for UI
const COLUMNS = ['id', 'name', 'middle_name', 'last_name', 'citizenship'];

// Validation patterns
const NAME_PATTERN = /^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?$/;
const MIDDLE_NAME_PATTERN = /^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?$/;
const LAST_NAME_PATTERN = /^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?(\,\s[A-Za-z]+\.)?$/;

// Some validation information
const NAME_MAX = 50;

// Some validation messages
const MSG_NAME_NOT_EMPTY = "Name is required!";
const MSG_NAME_MAX = `Name must contain not more than ${NAME_MAX} symbols!`;
const MSG_NAME_PATTERN = 'Invalid name!';

const MSG_MIDDLE_NAME_MAX = `Middle name must contain not more than ${NAME_MAX} symbols!`;
const MSG_MIDDLE_NAME_PATTERN = 'Invalid middle name!';

const MSG_LAST_NAME_NOT_EMPTY = "Last name is required!";
const MSG_LAST_NAME_MAX = `Last name must contain not more than ${NAME_MAX} symbols!`;
const MSG_LAST_NAME_PATTERN = 'Invalid last name!';

router.get('/countries', function(req, res) {
    res.status(OK).json({countries: COUNTRIES});
});

router.post('/delete/:id', function(req, res) {
    deleteRow(TABLE, `id = ${req.params.id}`, function (err, statusCode) {
        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }
        else {
            res.sendStatus(statusCode);
        }
    });
});

function validateRequest(req) {

  req.check('name')
      .trim()
      .notEmpty().withMessage(MSG_NAME_NOT_EMPTY)
      .isLength({ max: NAME_MAX }).withMessage(MSG_NAME_MAX)
      .matches(NAME_PATTERN, 'i')
      .withMessage(MSG_NAME_PATTERN);

  req.check('middle_name')
      .trim()
      .isLength({ max: NAME_MAX }).withMessage(MSG_MIDDLE_NAME_MAX)

  if (req.body.middle_name != '') {
      req.check('middle_name')
      .matches(MIDDLE_NAME_PATTERN, 'i')
      .withMessage(MSG_MIDDLE_NAME_PATTERN);
  }

  req.check('last_name')
      .trim()
      .notEmpty().withMessage(MSG_LAST_NAME_NOT_EMPTY)
      .isLength({ max: NAME_MAX }).withMessage(MSG_LAST_NAME_MAX)
      .matches(LAST_NAME_PATTERN, 'i')
      .withMessage(MSG_LAST_NAME_PATTERN);

  return req.validationErrors();

}

router.post('/insert', urlencodedParser, function(req, res) {
    const errors = validateRequest(req);
    if (errors) {
        res.status(BAD_REQUEST).json({errors: errors});
    }
    else {

        if (req.body.citizenship != 'NULL') {
            req.body.citizenship = `"${req.body.citizenship}"`;
        }

        const newValues = `name = "${req.body.name}", middle_name = "${
            req.body.middle_name}", last_name = "${
            req.body.last_name}", citizenship = ${req.body.citizenship}`;

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
});

router.post('/update/:id', urlencodedParser, function(req, res) {
    const errors = validateRequest(req);
    if (errors) {
        res.status(BAD_REQUEST).json({errors: errors});
    }
    else {

        if (req.body.citizenship != 'NULL') {
            req.body.citizenship = `"${req.body.citizenship}"`;
        }

        const newValues = `name = "${req.body.name}", middle_name = "${
            req.body.middle_name}", last_name = "${
            req.body.last_name}", citizenship = ${req.body.citizenship}`;

        updateRow(TABLE, newValues, `id = ${req.params.id}`,
            function (err, statusCode) {
            if (err) {
                console.log(err);
                res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
            }
            else {
                res.sendStatus(statusCode);
            }
        });

    }
});

router.get('/:id', function(req, res) {
  selectRow(TABLE, `id = ${req.params.id}`, function (err, statusCode, row) {
      if (err) {
          console.log(err);
          res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
      }
      else {
          if (row[0].citizenship == null) {
              row[0].citizenship = 'NULL';
          }
          res.status(statusCode).json({row: row});
      }
  });
});

router.get('/', function(req, res) {
    selectAllRows(TABLE, ORDER_BY, function (err, statusCode, rows) {
        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }
        else {
            res.status(statusCode).json({rows: rows});
        }
    });
});

module.exports = router;
