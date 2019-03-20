// Some data to create a connection to the database
const host = 'localhost';
const user = 'root';
const password = '';
const database = 'series';

// Some information for queries
const table = 'series';
const columnsStr = 'id, title, country, description, rating';
const sqlNull = 'NULL';

// Some server info
const port = 3000;

// Logs
const connectionLog = 'MySql database was connected.';
const serverLog = `Server started on port ${port}.`;

// Status messages
const failureMessage = 'Oops, something went wrong... Probably some data is incorrect. Check it and try again! ;)';
const internalErrorMessage = 'Oops, some internal issues occured... Please, try again!';

// Status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const INTERNAL_SERVER_ERROR = 500;

// Some information for UI
const upperCaseDataBase = database[0].toUpperCase() + database.slice(1);
const columns = ['#', 'title', 'country', 'description', 'rating'];
const upperCaseColumns = ['#', 'Title', 'Country', 'Description', 'Rating'];
const ratingOptions = ['NULL', '1', '2', '3', '4', '5'];
const emptyBody = [{id: '', title: '', country: '', description: '', rating: 0}];

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const countries = require('./countries');

const db = mysql.createConnection({
    host     : host,
    user     : user,
    password : password,
    database : database
});

db.connect((err) => {
    if (err) {
        throw(err);
    }
    console.log(connectionLog);
});

var app = express();

app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

function insertRow(table, columns, values) {
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${values});`;
    const query = db.query(sql, (err, results) => {
        let statusCode = 0;
        err ? statusCode = BAD_REQUEST : statusCode = CREATED;
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
        err ? statusCode = BAD_REQUEST : statusCode = NO_CONTENT;
        return statusCode;
    });
}

app.get('/', function(req, res) {
    const sql = `SELECT * FROM ${table};`;
    const query = db.query(sql, (err, rows) => {
        if (err) {
            req.status(INTERNAL_SERVER_ERROR).send(internalErrorMessage);
        }
        res.status(OK).render('index', {database: upperCaseDataBase,
            columns: columns, rows: rows});
    });
});

app.post('/delete/:id', urlencodedParser, function(req, res) {
    let statusCode = deleteRow(table, `id = ${req.params.id}`)
    res.status(statusCode).redirect('/');
});

var operation = null;
var id = 0;

app.post('/update/:id', urlencodedParser, function(req, res) {

    operation = 'Update';
    id = req.params.id;

    var sql = `SELECT * FROM ${table} WHERE id = ${id};`;
    var query = db.query(sql, (err, rows) => {
        if (err) {
            req.status(INTERNAL_SERVER_ERROR).send(internalErrorMessage);
        }
        res.status(OK).render('change', {database: upperCaseDataBase,
            columns: columns, upperCaseColumns: upperCaseColumns,
            operation: operation, options: ratingOptions, countries: countries,
            rows: rows});
    });

});

app.post('/insert', urlencodedParser, function(req, res) {
    operation = 'Insert';
    id = 0;
    res.status(OK).render('change', {database: upperCaseDataBase,
        columns: columns, upperCaseColumns: upperCaseColumns,
        operation: operation, options: ratingOptions, countries: countries,
        rows: emptyBody});
});

app.post('/save', urlencodedParser, function(req, res) {

    if (req.body.rating != sqlNull) {
        req.body.rating = `"${req.body.rating}"`;
    }

    let statusCode = 0;
    if (operation == 'Insert') {
        statusCode = insertRow(table, columnsStr, `${sqlNull},
            "${req.body.title.trim()}", "${req.body.country}
            ", "${req.body.description.trim()}", ${req.body.rating}`);
    }
    else {
        statusCode = updateRow(table, `title = "${req.body.title.trim()}
            ", country = " ${req.body.country}", description = "
            ${req.body.description.trim()}", rating = ${req.body.rating}
            `, `id = ${id}`);
    }

    res.status(statusCode).redirect('/');

});

app.listen(port, () => {
    console.log(serverLog);
});;
