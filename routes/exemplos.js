var express = require('express');
var router = express.Router();

var DBConn = require('../db-conn');
var db = new DBConn();

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


// -----------------------------------------------------------------------------------------------------------------
// Exemplo matricula
// -----------------------------------------------------------------------------------------------------------------
router.get('/matricula', function (req, res, next) {
    res.send('Matrícula');
});

// router.post('/matricula/confirmar/', function (req, res, next) {
//     db.buscaAlunosDoCurso((err, matriculas) => {
//         if (err) next(err)
//         else {
//             if matriculas.length > curso.maxAlunos
//                 res.render(erro)
//             else 
//                 db.inserirMatricula
//             res.render('carros/calculo', { carros: carros });
//       });
// });

// -----------------------------------------------------------------------------------------------------------------
// Exemplo Freelancer
// -----------------------------------------------------------------------------------------------------------------
router.get('/freelancer/', function (req, res, next) {
    res.send('Freelancer!');
});

// -----------------------------------------------------------------------------------------------------------------
// Exemplo matricula
// -----------------------------------------------------------------------------------------------------------------
router.get('/carros/lista', function (req, res, next) {
    db.buscaTodosCarros((err, carros) => {
        if (err) next(err)
        else {
            if (carros.length == 1) {
                res.send("Apenas um carro");
            } else {
                res.render('carros/listaCarros', { carros: carros });
            }
        }
      });
});

router.post('/carros/calcula', function (req, res, next) {
    db.buscaTodosCarros((err, carros) => {
        if (err) next(err)
        else {
            if (carros.length == 1) {
                res.send("Apenas um carro");
            } else {
                res.render('carros/listaCarros', { carros: carros });
            }
        }
      });
});

module.exports = router;
