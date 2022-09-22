var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();

/* GET home page. */
router.get('/', function(req, res, next) {

  db.findAllEventos( (err, data) => {
    //res.send(data);
    res.render('eventos/index', { eventos: data });
  });

  //res.render('eventos/index');
});

/* GET home page. */
router.get('/novo', function(req, res, next) {
  res.render('eventos/novo');
});

module.exports = router;
