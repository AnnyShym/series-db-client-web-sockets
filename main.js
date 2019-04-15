const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(bodyParser.json());
app.use(cors());

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
const INTERNAL_SERVER_ERROR = 500

// Status messages
const INTERNAL_ERROR_MSG = 'Oops, some internal issues occured... Please, try again!';

// Logs
const SERVER_LOG = `Server started on port ${PORT}.`;
const CONNECTION_LOG = 'MySql database was connected.';

// Some information for UI
const OP_INSERT = 'insert';
const OP_UPDATE = 'update';

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

// // Creating the tables
// const sqlFile = fs.readFileSync(DB_LOCATION).toString();
// const arrSql = sqlFile.split('\r\n\r\n');
// for (let i in arrSql) {
//     const query = db.query(arrSql[i], (err, results) => {
//         if (err) {
//             throw(err);
//         }
//     });
// }

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

// Some functions for export
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
    console.log('2');
    const query = db.query(sql, (err, results) => {
        let statusCode = 0;
        err ? statusCode = INTERNAL_SERVER_ERROR : statusCode = NO_CONTENT;
        console.log('3');
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

// Indicating global data
global.urlencodedParser = urlencodedParser;
global.db = db;
global.expressValidator = expressValidator;

global.insertRow = insertRow;
global.deleteRow = deleteRow;
global.updateRow = updateRow;

global.DB_NAME = DB_NAME;
global.OP_INSERT = OP_INSERT;
global.OP_UPDATE = OP_UPDATE;

global.OK = OK;
global.CREATED = CREATED;
global.NO_CONTENT = NO_CONTENT;
global.BAD_REQUEST = BAD_REQUEST;
global.INTERNAL_SERVER_ERROR = INTERNAL_SERVER_ERROR;

global.INTERNAL_ERROR_MSG = INTERNAL_ERROR_MSG;

// Customizing routes handlers
// let routerTables = [];
// for (let i = 0; i < TABLES.length; i++) {
//   routerTables.push(require(`${ROUTES_DIR}${TABLES[i]}`));
//   app.use(`/${TABLES[i]}`, routerTables[i]);
// }

const routerTable = require('./routes/actors');
app.use(`/actors`, routerTable);

// Starting to listen
app.listen(PORT, () => {
    console.log(SERVER_LOG);
});;
