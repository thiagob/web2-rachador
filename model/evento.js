var DBConn = require('../db-conn.js');
var dbConn = new DBConn();

var Participante = require('../model/participante')
var Despesa = require('../model/despesa');
const Pagamento = require('./pagamentos.js');


class Evento {

    constructor() {
        this.data = {};

        this.despesas = {};
        this.participantes = {};
        this.pagamentos = {};

        this.nome = '';
        this.erros = [];
        this.total = 0;
    }

    carregar(json) {
        this.data = json;
        this.id = json.id;
        this.nome = json.nome;
        this.total = json.total;
    }

    validar() {
        this.erros = [];

        if (this.nome == undefined || this.nome == "") this.erros.push('Nome em branco');
        else if (this.nome.length < 3) this.erros.push('Nome com menos de 3 caracteres');

        return this.erros.length == 0;
    }

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM eventos', callback);
    }

    static buscarPeloId(id, callback) {
        return dbConn.db.get('SELECT * FROM eventos WHERE id = (?)', id, (err, data) => {
            if (err) {
                callback(err);
            } else {
                var evento = new Evento();
                evento.carregar(data);

                evento.buscarParticipantes((err, data) => {
                    if (err) callback(err);
                    else {
                        evento.buscarDespesas((err, data) => {
                            if (err) callback(err);
                            else {
                                evento.buscarPagamentos((err, data) => {
                                    if (err) callback(err);
                                    else {
                                        callback(err, evento);
                                    }
                                });
                            }
                        });
                    }
                });
            }

        });
    }

    salvar(callback) {
        if (this.id > 0) {
            this.atualizar(callback);
        } else {
            this.criar(callback);
        }
    }

    atualizar(callback) {
        var sql = `UPDATE eventos 
            SET nome = (?)
            WHERE ID = (?)`;

        var params = [this.nome, this.id];
        return dbConn.db.run(sql, params, callback);
    }

    criar(callback) {
        var sql = `INSERT INTO eventos (nome)
        VALUES ((?))`;

        var params = [this.nome];
        return dbConn.db.run(sql, params, callback);
    }


    excluir(callback) {
        var sql = `DELETE FROM eventos
        WHERE ID = (?)`;

        return dbConn.db.run(sql, this.id, callback);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Participantes
    // -----------------------------------------------------------------------------------------------------------------


    buscarParticipantes(callback) {
        Participante.buscarParticipantesDoEvento(this.id, (err, data) => {
            if (err) {
                callback(err);
            } else {
                this.participantes = data;
                callback(err, data);
            }
        });
    }

    adicionarParticipante(idParticipante, callback) {
        // TODO
        Participante.adicionarParticipanteNoEvento(this.id, idParticipante, callback);
    }

    removerParticipante(idParticipante, callback) {
        // TODO
        Participante.removerParticipanteDoEvento(this.id, idParticipante, callback);
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Despesa
    // -----------------------------------------------------------------------------------------------------------------

    buscarDespesas(callback) {
        Despesa.buscarDespesasDoEvento(this.id, (err, data) => {
            if (err) {
                callback(err);
            } else {
                this.despesas = data;
                callback(err, data);
            }
        });
    }

    adicionarDespesa(json, callback) {
        // TODO
    }

    excluirDespesa(idDespesa, callback) {
        // TODO
    }

    // -----------------------------------------------------------------------------------------------------------------
    // Pagamentos
    // -----------------------------------------------------------------------------------------------------------------

    buscarPagamentos(callback) {
        Pagamento.buscarPagamentosDoEvento(this.id, (err, data) => {
            if (err) {
                callback(err);
            } else {
                this.pagamentos = data;
                callback(err, data);
            }
        });
    }

    calcular() {
        this.calcularTotais();
        this.atualizarTotais();
    }

    // -------------------------------------

    calcularTotais(callback) {
        // TODO
    }

    calcularTotalEvento() {

        // TODO
    }

    calcularTotalParticipante(idParticipante) {
        // TODO
    }


    // -------------------------------------

    atualizarTotais() {

        this.atualizarTotalEvento();
        this.participantes.forEach(p => {
            Participante.atualizarTotais(p.idEvento, p.idParticipante, p.totalPagar, p.totalReceber);
        });
    }

    atualizarTotalEvento(callback) {
        var sql = 'UPDATE eventos SET total = (?) WHERE ID = (?)';
        var params = [this.total, this.id];
        dbConn.db.run(sql, params, callback);
    }

}

module.exports = Evento