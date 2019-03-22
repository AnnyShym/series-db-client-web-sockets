const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const main_module = require('./modules/main_module');

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Some information for queries
const table = 'series';

// Some information for UI
const columns = ['#', 'title', 'country', 'description', 'rating'];
const upCaseColumns = ['#', 'Title', 'Country', 'Description', 'Rating'];
const ratingOptions = ['NULL', '1', '2', '3', '4', '5'];

// Some information for routing
const changeRoute = 'change_series';

// Some validation information
const titleMax = 50;
const descriptionMax = 255;

// Some validation messages
msgTitleNotEmpty = "Title is required!";
msgTitleMax = `Title must contain not more than ${titleMax} symbols!`;
msgTitleAsciiOnly = 'Title may contain only ASCII symbols!';
msgDescriptionMax = `Description must contain not more than ${descriptionMax} symbols!`;
msgDescriptionAsciiOnly = 'Description may contain only ASCII symbols!';

router.post(`./${table}/delete/:id`, urlencodedParser, function(req, res) {
    main_module.deleteRowByIdAndResponse(table, req.params.id, res);
});

router.post(`./${table}/insert`, urlencodedParser, function(req, res) {
    main_module.prepareFormForInsertingAndResponse(changeRoute, table, columns,
        upCaseColumns, res);
});

router.post(`./${table}/update/:id`, urlencodedParser, function(req, res) {
    main_module.prepareFormForUpdatingAndResponse(changeRoute, table, columns,
        upCaseColumns, req.params.id, res);
});

function validateRequest(req) {

  req.check('title')
      .trim()
      .notEmpty().withMessage(msgTitleNotEmpty);
      .isLength({ max: titleMax }).withMessage(msgTitleMax)
      .isAscii().withMessage(msgTitleAsciiOnly);

  req.check('description')
      .trim()
      .isLength({ max: descriptionMax }).withMessage(msgDescriptionMax)
      .isAscii().withMessage(msgDescriptionAsciiOnly);

  return req.validationErrors();

}

router.post(`./${table}/save`, urlencodedParser, function(req, res) {

    const errors = validateRequest(req);

    const newValues = `title = "${req.body.title}", country =
        ${req.body.country}, description = "${req.body.description}", rating =
        ${req.body.rating}`;
    main_module.handleErrorsSaveDataAndResponse(errors, changeRoute, columns,
        upCaseColumns, newValues, res);

});

router.use(`./${table}`, function(req, res) {
    main_module.selectAllToTableAndResponse(table, columns);
});

module.exports = router;
