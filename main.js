const express = require('express');
const mysql = require('mysql');
var expressValidator = require('express-validator');

var app = express();
app.set('view engine', 'ejs');

// Some server info
const port = 3000;

// Some data to create a connection to the database
const host = 'localhost';
const user = 'root';
const password = '';
const database = 'series';

// Some information for routing
const indexRoute = 'index';
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

// Logs
const serverLog = `Server started on port ${port}.`;
const connectionLog = 'MySql database was connected.';

// Some information for UI
const upCaseDataBase = database[0].toUpperCase() + database.slice(1);
const table1 = 'series';
const table2 = 'users';

var db = mysql.createConnection({
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

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;

    while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
    }
    return {
        param : formParam,
        msg   : msg,
        value : value
    };
  }
}));

module.exports = {
    db: function () { return db; },
    expressValidator: function () { return expressValidator; },
}

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

app.get('/', function(req, res) {
    res.status(OK).render(indexRoute, {database: upCaseDataBase,
        table1: table1, table2: table2});
});

let routerTable1 = require(`./routes/${table1}`);
let routerTable2 = require(`./routes/${table2}`);
app.use(`/${table1}`, routerTable1);
app.use(`/${table2}`, routerTable2);

app.listen(port, () => {
    console.log(serverLog);
});;
