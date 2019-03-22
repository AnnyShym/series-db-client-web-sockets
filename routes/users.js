const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const expressValidator = require('express-validator');
const main_module = require('./modules/main_module');

const router = express.Router();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Some information for queries
const table = 'users';

// Some information for UI
const columns = ['#', 'login', 'password'];
const upCaseColumns = ['#', 'Login', 'Password'];

// Some information for routing
const changeRoute = 'change_users';

// Some validation information
const loginMax = 50;
const passwordMin = 8;
const passwordMax = 20;

// Some validation messages
const msgLoginIncorrect = 'Login should be a valid email!';
const msgLoginMax = `Login must contain not more than ${loginMax} symbols!`;
const msgPasswordMin = `Password must contain at least ${passwordMin} symbols!`;
const msgPasswordMax = `Password must contain not more than ${passwordMax} symbols!`;
const msgPasswordAsciiOnly = 'Password may contain only ASCII symbols!';
const msgPasswordDigits = 'Password must contain at least 1 digital!';
const msgPasswordLowLatin = 'Password must contain at least 1 latin lowercase letter!';
const msgPasswordUpLatin = 'Password must contain at least 1 latin uppercase letter!';
const msgUniqueness =  'The entered login was already taken!';

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

  req.check('login')
      .trim()
      .isEmail().withMessage(msgLoginIncorrect)
      .isLength({ max: loginMax }).withMessage(msgLoginMax)

  req.check('password')
      .trim()
      .isLength({ min: passwordMin }).withMessage(msgPasswordMin)
      .isLength({ max: passwordMax }).withMessage(msgPasswordMax)
      .isAscii().withMessage(msgPasswordAsciiOnly)
      .matches('[0-9]').withMessage(msgPasswordDigits)
      .matches('[a-z]').withMessage(msgPasswordLowLatin)
      .matches('[A-Z]').withMessage(msgPasswordUpLatin);

  let errors = req.validationErrors();
  const sql = `SELECT * FROM ${table} WHERE login = "${req.body.login}";`;
  const query = db.query(sql, (err, rows) => {
      if (err) {
          req.status(main_module.INTERNAL_SERVER_ERROR)
              .send(main_module.internalErrorMessage);
      }
      else {
          if (rows) {
              errors.push({msg: msgUniqueness});
          }
      }
  });

  return errors;

}

router.post(`./${table}/save`, urlencodedParser, function(req, res) {

    const errors = validateRequest(req);

    const newValues = `login = "${req.body.login}
        ", password = "${req.body.password}"`;
    main_module.handleErrorsSaveDataAndResponse(errors, changeRoute, columns,
        upCaseColumns, newValues, res);

});

router.use(`./${table}`, function(req, res) {
    main_module.selectAllToTableAndResponse(table, columns);
});

module.exports = router;
