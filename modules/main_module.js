const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var app = express();
app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Some information for routing
const tableRoute = 'table';

// Status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500

// Status messages
const internalErrorMessage = 'Oops, some internal issues occured... Please, try again!';

// Some information for UI
const database = 'series';
const upCaseDataBase = database[0].toUpperCase() + database.slice(1);
const opInsert = 'Insert';
const opUpdate = 'Update';

                            /* WORKING WITH DB */

function insertRow(table, newValues) {
    const sql = `INSERT INTO ${table} SET ${newValues};`;
    const query = db.query(sql, (err, results) => {
        let statusCode = 0;
        err ? statusCode = INTERNAL_SERVER_ERROR : statusCode = CREATED;
        return statusCode;
    });
}

function deleteRow(table, condition) {
    const sql = `DELETE FROM ${table} WHERE ${condition};`;
    const query = db.query(sql, (err, results) => {
        let statusCode = 0;
        err ? statusCode = INTERNAL_SERVER_ERROR : statusCode = NO_CONTENT;
        return statusCode;
    });
}

function updateRow(table, newValues, condition) {
    const sql = `UPDATE ${table} SET ${newValues} WHERE ${condition};`;
    const query = db.query(sql, (err, results) => {
        let statusCode = 0;
        err ? statusCode = INTERNAL_SERVER_ERROR : statusCode = NO_CONTENT;
        return statusCode;
    });
}

                        /* WORKING WITH REQUESTES */

function selectAllToTableAndResponse(table, column, res) {
    const sql = `SELECT * FROM ${table};`;
    const query = db.query(sql, (err, rows) => {
        if (err) {
            req.status(INTERNAL_SERVER_ERROR).send(internalErrorMessage);
        }
        else {
            res.status(OK).render(tableRoute, {database: upperCaseDataBase,
                table: table, columns: columns, rows: rows});
        }
    });
}

function deleteRowByIdAndResponse(table, _id, res) {
    const statusCode = deleteRow(table, `id = ${_id}`)
    res.status(statusCode).redirect(`./${table}`);
}

var operation = null;
var id = 0;

function prepareFormForInsertingAndResponse(changeRoute, table, columns,
    upCaseColumns, res) {

    operation = opInsert;
    id = 0;

    res.status(OK).render(changeRoute, {database: upCaseDataBase,
        table: table, columns: columns, upCaseColumns: upCaseColumns,
        operation: operation, rows: null, errors: null});

}

function prepareFormForUpdatingAndResponse(changeRoute, table, columns,
    upCaseColumns, _id, res) {

      operation = opUpdate;
      id = _id;

      const sql = `SELECT * FROM ${table} WHERE id = ${_id};`;
      const query = db.query(sql, (err, rows) => {
          if (err) {
              req.status(INTERNAL_SERVER_ERROR).send(internalErrorMessage);
          }
          else {
              res.status(OK).render(changeRoute, {database: upCaseDataBase,
                  table: table, columns: columns, upCaseColumns: upCaseColumns,
                  operation: operation, rows: rows, errors: null});
          }
      });

}

function handleErrorsSaveDataAndResponse(errors, changeRoute, table, columns,
    upCaseColumns, newValues, res) {
    if (errors) {
        res.status(BAD_REQUEST).render(changeRoute, {
            database: upCaseDataBase, table: table,
            columns: columns, upCaseColumns: upCaseColumns,
            operation: operation, rows: null, errors: errors});
    }
    else {

        let statusCode = 0;
        if (operation == opInsert) {
            statusCode = insertRow(table, newValues);
        }
        else {
            statusCode = updateRow(table, newValues, `id = ${id}`);
        }

        res.status(statusCode).redirect(`./${table}`);

    }
}

module.exports = {
    OK: OK,
    CREATED: CREATED,
    NO_CONTENT: NO_CONTENT,
    BAD_REQUEST: BAD_REQUEST,
    NOT_FOUND: NOT_FOUND,
    INTERNAL_SERVER_ERROR: INTERNAL_SERVER_ERROR,
    internalErrorMessage: internalErrorMessage,
    insertRow: insertRow,
    updateRow: updateRow,
    deleteRow: deleteRow,
    selectAllToTableAndResponse: selectAllToTableAndResponse,
    deleteRowByIdAndResponse: deleteRowByIdAndResponse,
    handleErrorsSaveDataAndResponse: handleErrorsSaveDataAndResponse,
    prepareFormForInsertingAndResponse: prepareFormForInsertingAndResponse,
    prepareFormForUpdatingAndResponse: prepareFormForUpdatingAndResponse,
    handleErrorsSaveDataAndResponse: handleErrorsSaveDataAndResponse
}
