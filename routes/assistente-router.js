var express = require('express');
var router = express.Router();

var Evento = require('../model/evento')
var Participante = require('../model/participante')

router.get('/', function (req, res, next) {

    Evento.buscarTodos((err, rows) => {
        if (err) next(err)
        else res.render('assistente/00_index', { eventos: rows });
    });

});


router.get('/evento/:idEvento', function (req, res, next) {

    // Busca detalhes do evento
    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
        if (err) next(err)
        else {

            Participante.buscarParticipantesDoEvento(evento.id, (err, participantesDoEvento) => {

                if (err) next(err)
                else {

                    Participante.buscarDemaisParticipantes(evento.id, (err, demaisParticipantes) => {
                        if (err) next(err)
                        else {
                            res.render('assistente/10_participantes', { 
                                evento: evento,
                                demaisParticipantes: demaisParticipantes,
                                participantesDoEvento: participantesDoEvento                                
                            });
                        }                    
                    });
                }
            });
        }
    });
});

module.exports = router;
