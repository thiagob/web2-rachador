var express = require('express');
var router = express.Router();

var Evento = require('../model/evento')
var Participante = require('../model/participante')
var Despesa = require('../model/despesa')


// -----------------------------------------------------------------------------------------------------------------
// Página Inicial do Assistente
// -----------------------------------------------------------------------------------------------------------------
router.get('/', function (req, res, next) {
    res.render('exemplos');
});

router.get('/buscarPeloId/:idEvento', function (req, res, next) {
    
    // Busca detalhes do evento
    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
        if (err) next(err)
        else {
            res.send(evento);
        }
    });

});

module.exports = router;
