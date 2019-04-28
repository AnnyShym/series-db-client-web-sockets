const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const config = require('./config');

const app = express();
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(cookieParser());

// Some server info
const PORT = 8080;

// Some DB info
const DB_NAME = 'series';
const TABLES = ['users', 'series', 'actors', 'actorsinseries'];

// Some location information
const DB_LOCATION = './public/create_tables.sql';
const ROUTES_DIR = './routes/';

// Status codes
const OK = 200;
const CREATED = 201;
const NO_CONTENT = 204;
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const INTERNAL_SERVER_ERROR = 500

// Status messages
const INTERNAL_ERROR_MSG = 'Oops, some internal issues occured... Please, try again!';
const NOT_UNIQUE_MSG = 'Such record already exists!';
const INVALID_ID_MSG = 'Invalid identifier!';
const UNAUTHORIZED_MSG = 'Please, sign in as administrator first!';

// Logs
const SERVER_LOG = `Server started on port ${PORT}.`;
const CONNECTION_LOG = 'MySql database was connected.';

// Connecting to the DB
// const CONNECTION_STR = 'mysql://root:root@192.168.99.100:3307/series_db?charset=utf8_general_ci&timezone=-0700';
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'series'
});

db.connect((err) => {
    if (err) {
        throw(err);
    }
    console.log(CONNECTION_LOG);
});

// Creating the tables
const sqlFile = fs.readFileSync(DB_LOCATION).toString();
const arrSql = sqlFile.split('\r\n\r\n');
for (let i in arrSql) {
    const query = db.query(arrSql[i], (err, results) => {
        if (err) {
            throw(err);
        }
    });
}

// Customizing the validator
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

// The middleware for checking the access rights (jwt)
app.use(function (req, res, next) {
    if (req.originalUrl !== "/signup" && req.originalUrl !== "/signin") {

        let cookieJwt = req.cookies.auth;

        jwt.verify(cookieJwt, config.KEY, function(err, decoded) {
            if (err) {
                res.status(UNAUTHORIZED).json({errors: [{ msg: UNAUTHORIZED_MSG }]});
            }
            else {
                next();
            }
        });

    }
    else {
        next();
    }
});

// Some functions for export
function selectAllRows(table, orderBy, callback) {
    const sql = `SELECT * FROM ${table} ${orderBy};`;
    const query = db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            callback(err, INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MSG, null);
        }
        else {
            callback(null, OK, null, rows);
        }
    });
}

function selectAllForIntermediateTable(table, table1ForJoin, table2ForJoin,
    what, tableColumn1, tableColumn2, table1Column, table2Column, orderBy,
    callback) {

    const sql = `SELECT ${what} FROM ${table
    } INNER JOIN ${table1ForJoin} ON ${table}.${tableColumn1
    } = ${table1ForJoin}.${table1Column
    } INNER JOIN ${table2ForJoin} ON ${table}.${tableColumn2
    } = ${table2ForJoin}.${table2Column
    } ${orderBy};`;

    const query = db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            callback(err, INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MSG, null);
        }
        else {
            callback(null, OK, null, rows);
        }
    });

}

function selectRow(table, condition, callback) {
    const sql = `SELECT * FROM ${table} WHERE ${condition};`;
    const query = db.query(sql, (err, row) => {
        if (err) {
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                callback(err, BAD_REQUEST, INVALID_ID_MSG, null);
            }
            else {
                console.log(err);
                callback(err, INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MSG, null);
            }
        }
        else {
            if (row.length === 0) {
                callback(true, BAD_REQUEST, INVALID_ID_MSG, null);
            }
            else {
                callback(null, OK, null, row);
            }
        }
    });
}

function selectPartialInfo(table, what, orderBy, callback) {
    const sql = `SELECT ${what} FROM ${table} ${orderBy};`;
    const query = db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            callback(err, INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MSG, null);
        }
        else {
            callback(null, OK, null, rows);
        }
    });
}

function insertRow(table, newValues, callback) {
    const sql = `INSERT INTO ${table} SET ${newValues};`;
    const query = db.query(sql, (err, results) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                callback(err, BAD_REQUEST, NOT_UNIQUE_MSG);
            }
            else {
                console.log(err);
                callback(err, INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MSG);
            }
        }
        else {
            callback(null, CREATED, null);
        }
    });
}

function deleteRow(table, condition, callback) {
    const sql = `DELETE FROM ${table} WHERE ${condition};`;
    const query = db.query(sql, (err, results) => {
        if (err) {
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                callback(err, BAD_REQUEST, INVALID_ID_MSG);
            }
            else {
                console.log(err);
                callback(err, INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MSG);
            }
        }
        else {
            callback(null, NO_CONTENT, null);
        }
    });
}

function updateRow(table, newValues, condition, callback) {
    const sql = `UPDATE ${table} SET ${newValues} WHERE ${condition};`;
    const query = db.query(sql, (err, results) => {
        if (err) {
            if (err.code === 'ER_BAD_FIELD_ERROR') {
                callback(err, BAD_REQUEST, INVALID_ID_MSG);
            }
            else {
                if (err.code === 'ER_DUP_ENTRY') {
                    callback(err, BAD_REQUEST, NOT_UNIQUE_MSG);
                }
                else {
                    console.log(err);
                    callback(err, INTERNAL_SERVER_ERROR, INTERNAL_ERROR_MSG);
                }
            }
        }
        else {
            callback(null, NO_CONTENT, null);
        }
    });
}

// Indicating the data for exporting
module.exports.urlencodedParser = urlencodedParser;
module.exports.db = db;
module.exports.jwt = jwt;

module.exports.DB_NAME = DB_NAME;

module.exports.selectAllRows = selectAllRows;
module.exports.selectAllForIntermediateTable = selectAllForIntermediateTable;
module.exports.selectRow = selectRow;
module.exports.selectPartialInfo = selectPartialInfo;
module.exports.insertRow = insertRow;
module.exports.deleteRow = deleteRow;
module.exports.updateRow = updateRow;

module.exports.OK = OK;
module.exports.CREATED = CREATED;
module.exports.NO_CONTENT = NO_CONTENT;
module.exports.BAD_REQUEST = BAD_REQUEST;
module.exports.UNAUTHORIZED = UNAUTHORIZED;
module.exports.INTERNAL_SERVER_ERROR = INTERNAL_SERVER_ERROR;

module.exports.INTERNAL_ERROR_MSG = INTERNAL_ERROR_MSG;
module.exports.NOT_UNIQUE_MSG = NOT_UNIQUE_MSG;
module.exports.INVALID_ID_MSG = INVALID_ID_MSG;

// Customizing the routes
const signUpModule = require(`${ROUTES_DIR}signup`);
const signInModule = require(`${ROUTES_DIR}signin`);
app.post('/signup', signUpModule.signUp);
app.post('/signin', signInModule.signIn);

let routerTables = [];
for (let i = 0; i < TABLES.length; i++) {
  routerTables.push(require(`${ROUTES_DIR}${TABLES[i]}`));
  app.use(`/${TABLES[i]}`, routerTables[i]);
}

// The handler for the root route
app.get('/', function(req, res) {
    res.sendStatus(NO_CONTENT);
});

// Starting to listen
app.listen(PORT, () => {
    console.log(SERVER_LOG);
});
