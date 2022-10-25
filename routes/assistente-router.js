var express = require('express');
var router = express.Router();

var Evento = require('../model/evento')

router.get('/', function (req, res, next) {

    Evento.buscarTodos((err, rows) => {
        if (err) next(err)
        else res.render('assistente/00_index', { eventos: rows });
    });

});


router.get('/evento/:idEvento', function (req, res, next) {

    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
        if (err) next(err)
        else {
            res.render('assistente/index', { eventos: rows });
        }              
    });

});

module.exports = router;
