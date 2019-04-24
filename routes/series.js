const express = require('express');
const router = express.Router();

// Array of possible countries
const COUNTRIES = require('../modules/countries');

// Some information for queries
const TABLE = 'series';
const ORDER_BY = 'ORDER BY title ASC, rating DESC';

// Some information for UI
const COLUMNS = ['id', 'title', 'country', 'description', 'rating'];
const RATING_OPTIONS = ['NULL', '1', '2', '3', '4', '5'];

// Some validation information
const TITLE_MAX = 50;
const DESCRIPTION_MAX = 255;

// Some validation messages
const MSG_TITLE_NOT_EMPTY = "Title is required!";
const MSG_TITLE_MAX = `Title must contain not more than ${TITLE_MAX} symbols!`;
const MSG_TITLE_ASCII_ONLY = 'Title may contain only ASCII symbols!';

const MSG_DESCRIPTION_MAX = `Description must contain not more than ${DESCRIPTION_MAX} symbols!`;
const MSG_DESCRIPTION_ASCII_ONLY = 'Description may contain only ASCII symbols!';

router.get('/countries', function(req, res) {
    res.status(OK).json({countries: COUNTRIES});
});

router.get('/ratingoptions', function(req, res) {
    res.status(OK).json({ratingOptions: RATING_OPTIONS});
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

  req.check('title')
      .trim()
      .notEmpty().withMessage(MSG_TITLE_NOT_EMPTY)
      .isLength({ max: TITLE_MAX }).withMessage(MSG_TITLE_MAX)
      .isAscii().withMessage(MSG_TITLE_ASCII_ONLY);

  req.check('description')
      .trim()
      .isLength({ max: DESCRIPTION_MAX }).withMessage(MSG_DESCRIPTION_MAX);

  if (req.body.description != '') {
      req.check('description')
      .isAscii().withMessage(MSG_DESCRIPTION_ASCII_ONLY);
  }

  return req.validationErrors();

}

router.post('/insert', urlencodedParser, function(req, res) {
    const errors = validateRequest(req);
    if (errors) {
        res.status(BAD_REQUEST).json({errors: errors});
    }
    else {

        if (req.body.country != 'NULL') {
            req.body.country = `"${req.body.country}"`;
        }

        if (req.body.rating != 'NULL') {
            req.body.rating = `"${req.body.rating}"`;
        }

        const newValues = `title = "${req.body.title}", country = ${
            req.body.country}, description = "${
            req.body.description}", rating = ${req.body.rating}`;

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

        if (req.body.country != 'NULL') {
            req.body.country = `"${req.body.country}"`;
        }

        if (req.body.rating != 'NULL') {
            req.body.rating = `"${req.body.rating}"`;
        }

        const newValues = `title = "${req.body.title}", country = ${
            req.body.country}, description = "${
            req.body.description}", rating = ${req.body.rating}`;

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
          if (row[0].rating == null) {
              row[0].rating = 'NULL';
          }
          if (row[0].country == null) {
              row[0].country = 'NULL';
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
