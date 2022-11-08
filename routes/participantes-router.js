var express = require('express');
var router = express.Router();
var Participante = require('../model/participante')


router.get('/', function (req, res, next) {

    Participante.buscarTodos((err, rows) => {
        if (err) next(err)
        else res.render('participantes/index', { rows: rows });
    });

});

router.get('/exibir/:id', function (req, res, next) {

    Participante.buscarPeloId(req.params.id, (err, row) => {
        if (err) next(err)
        else res.render('participantes/exibirParticipante', { row: row });
    });

});

router.get('/editar/:id', function (req, res, next) {

    Participante.buscarPeloId(req.params.id, (err, row) => {
        if (err) next(err)
        else res.render('participantes/formParticipante', { modo: "edit", row: row });
    });

});

router.get('/novo', function (req, res, next) {

    var p = new Participante();    
    res.render('participantes/formParticipante', { modo: "create", row: p });
    
});

router.post('/atualizar/:id', function (req, res, next) {

    var p = new Participante();    
    p.carregar(req.body);

    if (!p.validar()) {
        res.render('participantes/formParticipante', { modo: "edit", row: p });
    } else {
        p.atualizar((err, data) => {
            if (err) next(err)
            else {
                res.redirect('/participantes');
            }
        });  
    }
});

router.post('/criar', function (req, res, next) {

    var p = new Participante();
    p.carregar(req.body);

    if (!p.validar()) {
        res.render('participantes/formParticipante', { modo: "create", row: p });
    } else {
        p.criar((err, data) => {
            if (err) next(err)
            else {
                res.redirect('/participantes');
            }
        });        
    }

});

router.post('/excluir/:id', function (req, res, next) {

    Participante.buscarPeloId(req.params.id, (err, row) => {
        if (err) next(err)
        else {
            var p = new Participante();
            p.carregar(row);            
            p.excluir((err, data) => {
                if (err) next(err)
                else {
                    res.redirect('/participantes');
                }
            });        
        }
    });

});

module.exports = router;
