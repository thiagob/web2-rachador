var express = require('express');
var router = express.Router();

var Evento = require('../model/evento')
var Participante = require('../model/participante')
var Despesa = require('../model/despesa')


// -----------------------------------------------------------------------------------------------------------------
// Página Inicial do Assistente
// -----------------------------------------------------------------------------------------------------------------
router.get('/', function (req, res, next) {

    Evento.buscarTodos((err, rows) => {
        if (err) next(err)
        else res.render('assistente/00_index', { eventos: rows });
    });

});

// -----------------------------------------------------------------------------------------------------------------
// Página 1 do assistente: Relação de Participantes
// -----------------------------------------------------------------------------------------------------------------
router.get('/evento/:idEvento/participantes', function (req, res, next) {

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

// Adiciona participante do evento
router.post('/evento/:idEvento/participantes/:idParticipante', function (req, res, next) {

    // Busca detalhes do evento
    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
       
        if (err) next(err)
        else {
            evento.adicionarParticipante(req.params.idParticipante, (err, data) => {
                if (err) next(err)
                else {
                    res.status(200).send('Participante adicionado do evento.');
                }        
            });
        }
    });

});

// Remove participante do evento
router.delete('/evento/:idEvento/participantes/:idParticipante', function (req, res, next) {

    // Busca detalhes do evento
    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
       
        if (err) next(err)
        else {
            evento.removerParticipante(req.params.idParticipante, (err, data) => {
                if (err) next(err)
                else {
                    res.status(200).send('Participante excluído do evento.');
                }        
            });
        }
    });

});

// -----------------------------------------------------------------------------------------------------------------
// Página 2: Relação de despesas
// -----------------------------------------------------------------------------------------------------------------
router.get('/evento/:idEvento/despesas', function (req, res, next) {

    // Busca detalhes do evento
    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
        if (err) next(err)
        else {

            Despesa.buscarDespesasDoEvento(evento.id, (err, despesas) => {

                if (err) next(err)
                else {
                    res.render('assistente/20_despesas', {
                        evento: evento,
                        despesas: despesas
                    });
                }
            });
        }
    });
});

// Página para adicionar despesa
router.get('/evento/:idEvento/despesas/nova', function (req, res, next) {

    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
        if (err) next(err)
        else {

            evento.buscarParticipantes((err, participantes) => {
                if (err) next(err)
                else {
                    res.render('assistente/21_nova_despesa', {
                        evento: evento,
                        participantes: participantes
                    });                    
                }
            });
        }
    });
});

// Adiciona despesa no evento
router.post('/evento/:idEvento/despesas', function (req, res, next) {

    // Busca detalhes do evento
    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
        if (err) next(err)
        else {
            evento.adicionarDespesa(req.body, (err, data) => {
                if (err) next(err)
                else {
                    res.redirect('/assistente/evento/' + req.params.idEvento + '/despesas');
                }
            });
        }
    });
});

// Exclui despesa
router.delete('/evento/:idEvento/despesas/:idDespesa', function (req, res, next) {

    // Busca detalhes do evento
    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {
       
        if (err) next(err)
        else {
            evento.excluirDespesa(req.params.idDespesa, (err, data) => {
                if (err) next(err)
                else {
                    res.status(200).send('Despesa excluída do evento.');
                }        
            });
        }
    });

});


// -----------------------------------------------------------------------------------------------------------------
// Página 3: Relação de pagamentos
// -----------------------------------------------------------------------------------------------------------------

router.get('/evento/:idEvento/resumo', function (req, res, next) {

    // Busca detalhes do evento
    Evento.buscarPeloId(req.params.idEvento, (err, evento) => {

        if (err) next(err)
        else {            
            res.render('assistente/30_resumo', {
                evento: evento
            });
        }
    });
});

router.post('/evento/:idEvento/gerarPagamentos', function (req, res, next) {
    res.send('OK');
});


module.exports = router;
