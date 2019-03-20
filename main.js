// Some data to create a connection to the database
const host = 'localhost';
const user = 'root';
const password = '';
const database = 'series';

const upperCaseDataBase = database[0].toUpperCase() + database.slice(1);

const table = 'series';
const columns = ['#', 'title', 'country', 'description', 'rating'];
const upperCaseColumns = ['#', 'Title', 'Country', 'Description', 'Rating'];
const columnsStr = 'id, title, country, description, rating';
const sqlNull = 'NULL';

// Some server info
const port = 3000;

// Logs
const connectionInfo = 'MySql database was connected.';
const serverInfo = `Server started on port ${port}.`;

const options = ['NULL', '1', '2', '3', '4', '5'];
const countries = ['Afghanistan', 'Albania', 'Algeria', 'American Samoa', 'Andorra', 'Angola', 'Anguilla', 'Antigua and Barbuda', 'Argentina', 'Armenia', 'Aruba', 'Australia', 'Austria', 'Azerbaijan', 'Bangladesh', 'Barbados', 'Bahamas', 'Bahrain', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bermuda', 'Bhutan', 'Bolivia', 'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'British Indian Ocean Territory', 'British Virgin Islands', 'Brunei Darussalam', 'Bulgaria', 'Burkina Faso', 'Burma', 'Burundi', 'Cambodia', 'Cameroon', 'Canada', 'Cape Verde', 'Cayman Islands', 'Central African Republic', 'Chad', 'Chile', 'China', 'Christmas Island', 'Cocos (Keeling) Islands', 'Colombia', 'Comoros', 'Congo-Brazzaville', 'Congo-Kinshasa', 'Cook Islands', 'Costa Rica', 'Croatia', 'Curacao', 'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic', 'East Timor', 'Ecuador', 'El Salvador', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Estonia', 'Ethiopia', 'Falkland Islands', 'Faroe Islands', 'Federated States of Micronesia', 'Fiji', 'Finland', 'France', 'French Guiana', 'French Polynesia', 'French Southern Lands', 'Gabon', 'Gambia', 'Georgia', 'Germany', 'Ghana', 'Gibraltar', 'Greece', 'Greenland', 'Grenada', 'Guadeloupe', 'Guam', 'Guatemala', 'Guernsey', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Heard and McDonald Islands', 'Honduras', 'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Iraq', 'Ireland', 'Isle of Man', 'Israel', 'Italy', 'Jamaica', 'Japan', 'Jersey', 'Jordan', 'Kazakhstan', 'Kenya', 'Kiribati', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein', 'Lithuania', 'Luxembourg', 'Macau', 'Macedonia', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali', 'Malta', 'Marshall Islands', 'Martinique', 'Mauritania', 'Mauritius', 'Mayotte', 'Mexico', 'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Montserrat', 'Morocco', 'Mozambique', 'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Caledonia', 'New Zealand', 'Nicaragua', 'Niger', 'Nigeria', 'Niue', 'Norfolk Island', 'Northern Mariana Islands', 'Norway', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Philippines', 'Pitcairn Islands', 'Poland', 'Portugal', 'Puerto Rico', 'Qatar', 'Reunion', 'Romania', 'Russia', 'Rwanda', 'Saint Barthelemy', 'Saint Helena', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Martin', 'Saint Pierre and Miquelon', 'Saint Vincent', 'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia', 'Seychelles', 'Sierra Leone', 'Singapore', 'Sint Maarten', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia', 'South Africa', 'South Georgia', 'South Korea', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Svalbard and Jan Mayen', 'Sweden', 'Swaziland', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Tanzania', 'Thailand', 'Togo', 'Tokelau', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Turks and Caicos Islands', 'Tuvalu', 'Uganda', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Vietnam', 'Venezuela', 'Wallis and Futuna', 'Western Sahara', 'Yemen', 'Zambia', 'Zimbabwe'];
const emptyBody = [{id: '', title: '', country: '', description: '', rating: 0}];
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : host,
    user     : user,
    password : password,
    database : database
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log(connectionInfo);
});

var app = express();

app.set('view engine', 'ejs');
const urlencodedParser = bodyParser.urlencoded({ extended: false });

function makeQuery(sql) {
    const query = db.query(sql, (err, results) => {
        if (err) {
            throw err;
        }
    });
}

function insertRow(table, columns, values) {
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${values});`;
    console.log(sql);
    makeQuery(sql);
}

function deleteRow(table, condition) {
    const sql = `DELETE FROM ${table} WHERE ${condition};`;
    makeQuery(sql);
}

function updateRow(table, newValues, condition) {
    const sql = `UPDATE ${table} SET ${newValues} WHERE ${condition};`;
    makeQuery(sql);
}

app.get('/', function(req, res) {
    const sql = `SELECT * FROM ${table};`;
    const query = db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        res.render('index', {database: upperCaseDataBase,
            columns: columns, rows: rows});
    });
});

app.post('/delete/:id', urlencodedParser, function(req, res) {
    deleteRow(table, `id = ${req.params.id}`)
    res.redirect('/');
});

var operation = null;
var id = 0;
app.post('/update/:id', urlencodedParser, function(req, res) {
    operation = 'Update';
    id = req.params.id;

    var sql = `SELECT * FROM ${table} WHERE id = ${id};`;
    var query = db.query(sql, (err, rows) => {
        if (err) {
            throw err;
        }
        console.log(rows);
        res.render('change', {database: upperCaseDataBase, columns: columns,
            upperCaseColumns: upperCaseColumns, operation: operation, options: options, countries: countries, rows: rows});
    });
});

app.post('/insert', urlencodedParser, function(req, res) {
    operation = 'Insert';
    id = 0;
    res.render('change', {database: upperCaseDataBase, columns: columns,
        upperCaseColumns: upperCaseColumns, operation: operation, options: options, countries: countries, rows: emptyBody});
});

app.post('/save', urlencodedParser, function(req, res) {
  // validation

  if (req.body.rating != sqlNull) {
      req.body.rating = `"${req.body.rating}"`;
  }

  if (operation == 'Insert') {
    insertRow(table, columnsStr, `${sqlNull}, "${req.body.title.trim()}", "${req.body.country}",
        "${req.body.description.trim()}", ${req.body.rating}`);
  }
  else {
    updateRow(table, `title = "${req.body.title.trim()}", country = "
      ${req.body.country}", description = "${req.body.description.trim()}", rating =
      ${req.body.rating}`, `id = ${id}`);
  }
  // return res.sendStatus(400);
  res.redirect('/');
});

app.listen(port, () => {
    console.log(serverInfo);
});;
