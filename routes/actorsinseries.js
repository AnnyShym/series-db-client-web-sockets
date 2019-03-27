const express = require('express');

const router = express.Router();

// Some information for queries
const table = 'actorsinseries';

// Some information for UI
const columns = ['id', 'id_series', 'id_actors'];
const upCaseColumns = ['#', '# Series', '# Actors'];

// Some information for routing
const changeRoute = 'change/actorsinseries';

// Some validation messages
const msgIdSeriesNotEmpty = 'Series id required!';
const msgIdSeriesInt = 'Series id must be a number!';

const msgIdActorsNotEmpty = 'Actors id required!';
const msgIdActorsInt = 'Actors id must be a number!';

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
      operation: operation, rows: null, errors: null});

});

router.post('/update/:id', urlencodedParser, function(req, res) {

  operation = opUpdate;
  id = req.params.id;

  const sql = `SELECT * FROM ${table} WHERE id = ${id};`;
  const query = db.query(sql, (err, rows) => {
      if (err) {
          res.status(INTERNAL_SERVER_ERROR).send(internalErrorMessage);
      }
      else {
          res.status(OK).render(changeRoute, {database: upCaseDataBase,
              table: table, columns: columns, upCaseColumns: upCaseColumns,
              operation: operation, rows: rows, errors: null});
      }
  });

});

function validateRequest(req) {

  req.check('id_series')
      .trim()
      .notEmpty().withMessage(msgIdSeriesNotEmpty)
      .isInt().withMessage(msgIdSeriesInt);

      req.check('id_actors')
          .trim()
          .notEmpty().withMessage(msgIdActorsNotEmpty)
          .isInt().withMessage(msgIdActorsInt);

  return req.validationErrors();

}

router.post('/save', urlencodedParser, function(req, res) {

    const errors = validateRequest(req);
    if (errors) {
        res.status(BAD_REQUEST).render(changeRoute, {
            database: upCaseDataBase, table: table,
            columns: columns, upCaseColumns: upCaseColumns,
            operation: operation, rows: null, errors: errors});
    }
    else {

        const newValues = `id_series = "${req.body.id_series}
            ", id_actors = "${req.body.id_actors}"`;
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
    const sql = `SELECT * FROM ${table} ORDER BY id ASC;`;
    const query = db.query(sql, (err, rows) => {
        if (err) {
            res.status(INTERNAL_SERVER_ERROR).send(internalErrorMessage);
        }
        else {
            res.status(OK).render(tableRoute, {database: upCaseDataBase,
                table: table, columns: columns, upCaseColumns: upCaseColumns, rows: rows});
        }
    });
});

module.exports = router;
