const express = require('express');
const countries = require('../modules/countries');

const router = express.Router();

// Some information for queries
const TABLE = 'actors';

// Some information for UI
const COLUMNS = ['#', 'name', 'middle_name', 'last_name', 'citizenship'];

// Some validation information
const NAME_MAX = 50;

// Some validation messages
MSG_NAME_NOT_EMPTY = "Name is required!";
MSG_NAME_MAX = `Name must contain not more than ${NAME_MAX} symbols!`;
MSG_NAME_PATTERN = 'Invalid name!';

MSG_MIDDLE_NAME_MAX = `Middle name must contain not more than ${NAME_MAX} symbols!`;
MSG_MIDDLE_NAME_PATTERN = 'Invalid middle name!';

MSG_LAST_NAME_NOT_EMPTY = "Last name is required!";
MSG_LAST_NAME_MAX = `Last name must contain not more than ${NAME_MAX} symbols!`;
MSG_LAST_NAME_PATTERN = 'Invalid last name!';

router.get('/countries', urlencodedParser, function(req, res) {
    res.status(OK).json({countries: countries});
});

router.post('/delete/:id', function(req, res) {
    const sql = `DELETE FROM ${TABLE} WHERE id = ${req.params.id};`;
    const query = db.query(sql, (err, results) => {
        err ? res.sendStatus(INTERNAL_SERVER_ERROR) : res.sendStatus(NO_CONTENT);
    });
});

function validateRequest(req) {

  req.check('name')
      .trim()
      .notEmpty().withMessage(MSG_NAME_NOT_EMPTY)
      .isLength({ max: NAME_MAX }).withMessage(MSG_NAME_MAX)
      .matches(/^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?$/, 'i')
      .withMessage(MSG_NAME_PATTERN);

  req.check('middle_name')
      .trim()
      .isLength({ max: NAME_MAX }).withMessage(MSG_MIDDLE_NAME_MAX)

  if (req.body.middle_name != '') {
      req.check('middle_name')
      .matches(/^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?$/, 'i')
      .withMessage(MSG_MIDDLE_NAME_PATTERN);
  }

  req.check('last_name')
      .trim()
      .notEmpty().withMessage(MSG_LAST_NAME_NOT_EMPTY)
      .isLength({ max: NAME_MAX }).withMessage(MSG_LAST_NAME_MAX)
      .matches(/^[A-Za-z]+('[A-Za-z]+)?(-|\s)?[A-Za-z]+('[A-Za-z]+)?(\,\s[A-Za-z]+\.)?$/, 'i')
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

        const sql = `INSERT INTO ${TABLE} SET ${newValues};`;
        const query = db.query(sql, (err, results) => {
            err ? res.sendStatus(INTERNAL_SERVER_ERROR) : res.sendStatus(CREATED);
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

        // const statusCode = updateRow(TABLE, newValues, `id = ${req.props.id}`);

        const sql = `UPDATE ${TABLE} SET ${newValues} WHERE id = ${req.params.id};`;
        const query = db.query(sql, (err, results) => {
            err ? res.sendStatus(INTERNAL_SERVER_ERROR) : res.sendStatus(NO_CONTENT);
        });

    }
});

router.get('/:id', urlencodedParser, function(req, res) {
  const sql = `SELECT * FROM ${TABLE} WHERE id = ${req.params.id};`;
  const query = db.query(sql, (err, row) => {
      if (err) {
          res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_ERROR_MSG);
      }
      else {
          res.status(OK).json({actor: row});
      }
  });
});

router.use('/', urlencodedParser, function(req, res) {
    const sql = `SELECT * FROM ${TABLE} ORDER BY name, middle_name, last_name ASC;`;
    const query = db.query(sql, (err, rows) => {
        if (err) {
            res.status(INTERNAL_SERVER_ERROR).send(INTERNAL_ERROR_MSG);
        }
        else {
            res.status(OK).json({rows: rows});
        }
    });
});

module.exports = router;
