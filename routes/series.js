const express = require('express');
const countries = require('../modules/countries');

const router = express.Router();

// Some information for queries
const table = 'series';

// Some information for UI
const columns = ['#', 'title', 'country', 'description', 'rating'];
const upCaseColumns = ['#', 'Title', 'Country', 'Description', 'Rating'];
const ratingOptions = ['NULL', '1', '2', '3', '4', '5'];

// Some information for routing
const changeRoute = 'change_series';

// Some validation information
const titleMax = 50;
const descriptionMax = 255;

// Some validation messages
msgTitleNotEmpty = "Title is required!";
msgTitleMax = `Title must contain not more than ${titleMax} symbols!`;
msgTitleAsciiOnly = 'Title may contain only ASCII symbols!';
msgDescriptionMax = `Description must contain not more than ${descriptionMax} symbols!`;
msgDescriptionAsciiOnly = 'Description may contain only ASCII symbols!';

router.post('/delete/:id', function(req, res) {
    const statusCode = deleteRow(table, `id = ${req.params.id}`)
    res.status(statusCode).redirect(`/${table}`);
});

var operation = null;
var id = 0;

router.post('/insert', urlencodedParser, function(req, res) {

  operation = opInsert;
  id = 0;

  res.status(OK).render(changeRoute, {database: upCaseDataBase,
      table: table, columns: columns, upCaseColumns: upCaseColumns,
      operation: operation, ratingOptions: ratingOptions, countries: countries, rows: null, errors: null});

});

router.post('/update/:id', urlencodedParser, function(req, res) {

  operation = opUpdate;
  id = req.params.id;

  const sql = `SELECT * FROM ${table} WHERE id = ${id};`;
  const query = db.query(sql, (err, rows) => {
      if (err) {
          req.status(INTERNAL_SERVER_ERROR).send(internalErrorMessage);
      }
      else {
          res.status(OK).render(changeRoute, {database: upCaseDataBase,
              table: table, columns: columns, upCaseColumns: upCaseColumns,
              operation: operation, ratingOptions: ratingOptions, countries: countries, rows: rows, errors: null});
      }
  });

});

function validateRequest(req) {

  req.check('title')
      .trim()
      .notEmpty().withMessage(msgTitleNotEmpty)
      .isLength({ max: titleMax }).withMessage(msgTitleMax)
      .isAscii().withMessage(msgTitleAsciiOnly);

  req.check('description')
      .trim()
      .isLength({ max: descriptionMax }).withMessage(msgDescriptionMax);

  if (req.body.description != '') {
      req.check('description')
      .isAscii().withMessage(msgDescriptionAsciiOnly);
  }

  return req.validationErrors();

}

router.post('/save', urlencodedParser, function(req, res) {
    const errors = validateRequest(req);
    if (errors) {
        res.status(BAD_REQUEST).render(changeRoute, {
            database: upCaseDataBase, table: table,
            columns: columns, upCaseColumns: upCaseColumns,
            operation: operation, ratingOptions: ratingOptions, countries: countries, rows: null, errors: errors});
    }
    else {

        if (req.body.country != 'NULL') {
            req.body.country = `"${req.body.country}"`;
        }

        if (req.body.rating != 'NULL') {
            req.body.rating = `"${req.body.rating}"`;
        }

        const newValues = `title = "${req.body.title}
            ", country = ${req.body.country}, description = "${req.body.description}
            ", rating = ${req.body.rating}`;
        let statusCode = 0;
        if (operation == opInsert) {
            statusCode = insertRow(table, newValues);
        }
        else {
            statusCode = updateRow(table, newValues, `id = ${id}`);
        }

        res.status(statusCode).redirect('.');

    }
});

router.use('/', urlencodedParser, function(req, res) {
    const sql = `SELECT * FROM ${table};`;
    const query = db.query(sql, (err, rows) => {
        if (err) {
            req.status(INTERNAL_SERVER_ERROR).send(internalErrorMessage);
        }
        else {
            res.status(OK).render(tableRoute, {database: upCaseDataBase,
                table: table, columns: columns, rows: rows});
        }
    });
});

module.exports = router;
