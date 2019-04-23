const express = require('express');
const router = express.Router();

// Some information for queries
const TABLE = 'actorsinseries';
const SERIES_TABLE = 'series';
const ACTORS_TABLE = 'actors';
const ORDER_BY_ID_SERIES = 'ORDER BY id ASC';
const ORDER_BY_ID_ACTORS = 'ORDER BY id ASC';

// Some information for UI
const COLUMNS = ['id', 'id_series', 'id_actors'];

router.get('/seriesinfo', function(req, res) {
    selectPartialInfo(SERIES_TABLE, 'id, title', ORDER_BY_ID_SERIES,
        function (err, statusCode, rows) {
        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }
        else {
            res.status(statusCode).json({rows: rows});
        }
    });
});

router.get('/actorsinfo', function(req, res) {
    selectPartialInfo(ACTORS_TABLE, 'id, name, last_name', ORDER_BY_ID_ACTORS,
    function (err, statusCode, rows) {
        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }
        else {
            res.status(statusCode).json({rows: rows});
        }
    });
});

router.post('/delete/:id', function(req, res) {
    deleteRow(TABLE, `id = ${req.params.id}`, function (err, statusCode) {
        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }
        else {
            res.sendStatus(statusCode);
        }
    });
});

router.post('/insert', urlencodedParser, function(req, res) {

    const newValues = `id_series = "${
        req.body.id_series}", id_actors = "${req.body.id_actors}"`;

    insertRow(TABLE, newValues, function (err, statusCode) {
        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }
        else {
            res.sendStatus(statusCode);
        }
    });

});

router.post('/update/:id', urlencodedParser, function(req, res) {

    const newValues = `id_series = "${
        req.body.id_series}", id_actors = "${req.body.id_actors}"`;

    updateRow(TABLE, newValues, `id = ${req.params.id}`,
        function (err, statusCode) {
        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }
        else {
            res.sendStatus(statusCode);
        }
    });

});

router.get('/:id', function(req, res) {
  selectRow(TABLE, `id = ${req.params.id}`, function (err, statusCode, row) {
      if (err) {
          console.log(err);
          res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
      }
      else {
          res.status(statusCode).json({row: row});
      }
  });
});

router.get('/', function(req, res) {
    selectAllForIntermediateTable(TABLE, SERIES_TABLE, ACTORS_TABLE,
        `${TABLE}.id, ${TABLE}.id_series, ${TABLE}.id_actors, ${SERIES_TABLE
        }.title, ${ACTORS_TABLE}.name, ${ACTORS_TABLE
        }.last_name`, 'id_series', 'id_actors', 'id', 'id',
        function (err, statusCode, rows) {
        if (err) {
            console.log(err);
            res.status(statusCode).json({errors: [{ msg: INTERNAL_ERROR_MSG }]});
        }
        else {
            res.status(statusCode).json({rows: rows});
        }
    });
});

module.exports = router;
