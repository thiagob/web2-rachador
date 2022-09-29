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

/* GET home page. */
router.get('/:id', function(req, res, next) {
  //res.send(req.params);
  db.getEventoById(req.params.id, (err, data) => {
    if (err) {
      next(err);
    }
    else if (data) {
      //res.send(data);
      res.render('eventos/detalhe', { evento: data });
    } else {
      res.status(404).send("Evento não encontrado.");
    }
  });
});

module.exports = router;
