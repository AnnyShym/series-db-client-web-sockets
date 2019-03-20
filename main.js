var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql');

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'series'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql connected.');
});

var app = express();

app.set('view engine', 'ejs');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

function insert(table, newSeries) {
    if (newSeries.rating != "NULL")
      newSeries.rating = `"${newSeries.rating}"`;
    let sql = `INSERT INTO ${table} (id, title, country, description, rating) VALUES (NULL, "
      ${newSeries.title}", "${newSeries.country}", "${newSeries.description}", ${newSeries.rating})`;
    let query = db.query(sql, (err, results) => {
      if (err) {
          throw err;
      }
      console.log(results);
    });
}

function del(table, id) {
    let sql = `DELETE FROM ${table} WHERE id = ${id}`;
    let query = db.query(sql, (err, results) => {
      if (err) {
          throw err;
      }
    });
}

function update(table, column, newValue, id) {
    let sql = `UPDATE ${table} SET ${column} = "${newValue}" WHERE id = ${id}`;
    let query = db.query(sql, (err, results) => {
      if (err) {
          throw err;
      }
    });
}

app.get('/', function(req, res) {
  let sql = `SELECT * FROM series`;
  let query = db.query(sql, (err, results) => {
    if (err) {
        throw err;
    }
    res.render('index', {data: results});
  });
});

app.post('/delete/:id', urlencodedParser, function(req, res) {
    del('series', req.params.id)
    res.redirect('/');
});

var operation = null;
var id = 0;
app.post('/update/:id', urlencodedParser, function(req, res) {
  operation = 'Update';
  id = req.params.id;
  res.render('change', {operation: operation});
});

app.post('/insert', urlencodedParser, function(req, res) {
  operation = 'Insert';
  id = -1;
  res.render('change', {operation: operation});
});

// res.render('change', {operation: (str[0].toUpperCase() + str.slice(1))});

app.post('/save', urlencodedParser, function(req, res) {
  // validation
  console.log("1");
  if (operation == 'Insert') {
    console.log("2");
    insert('series', req.body);
  }
  else {
    update('series', 'title', req.body.title, id);
    update('series', 'country', req.body.country, id);
    update('series', 'description', req.body.description, id);
    update('series', 'rating', req.body.rating, id);
  }
  // return res.sendStatus(400);
  res.redirect('/');
});

app.listen(3000, () => {
    console.log('Server started on port 3000.');
});;
