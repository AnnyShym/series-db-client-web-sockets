const express = require('express');
const countries = require('./modules/countries');

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

// Some information for UI
const upCaseDataBase = database[0].toUpperCase() + database.slice(1);
const table1 = 'series';
const table2 = 'users';

// Logs
const connectionLog = 'MySql database was connected.';
const serverLog = `Server started on port ${port}.`;

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

app.get('/', function(req, res) {
    res.status(OK).render(indexRoute, {database: upCaseDataBase,
        table1: table1, table2: table2});
});

let routerTable1 = require(`./routes/${table1}`);
let routerTable2 = require(`./routes/${table2}`);
app.use(`/${table1}`, routerTable1);
app.use(`/${table1}`, routerTable2);

app.listen(port, () => {
    console.log(serverLog);
});;
