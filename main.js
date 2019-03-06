var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'ejs');
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.post('/index/:id', urlencodedParser, function(req, res) {
  if (req.params.id != 2) {
    res.render("update");
    // save index, operation
  }
  else {
    // db, status
    res.render("index");
  }
});

app.post('/update', urlencodedParser, function(req, res) {
  // validation
  // db
  // return res.sendStatus(400);
  res.render("index");
});

app.get('/', function(req, res) {
  // selecting, redrawing
  //res.render('index', {someInfo: "Данные для передачи"});
  res.render("index");
});

app.get('/update', function(req, res) {
  res.render("index");
});

console.log("listening");
app.listen(3000);
