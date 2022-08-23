var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('eventos/index');
});

/* GET home page. */
router.get('/novo', function(req, res, next) {
  res.render('eventos/novo');
});

module.exports = router;
