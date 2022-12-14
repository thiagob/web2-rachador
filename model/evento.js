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
        Participante.adicionarParticipanteNoEvento(this.id, idParticipante, callback);
    }

    removerParticipante(idParticipante, callback) {
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
        var despesa = new Despesa();
        despesa.carregar(json);
        despesa.idEvento = this.id;

        despesa.salvar(callback);
    }

    excluirDespesa(idDespesa, callback) {
        Despesa.excluir(idDespesa, callback);
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

        // [X] Somar todas as despesas para calcular o custo total do evento
        this.total = this.calcularTotalEvento();
        // [X] Verificar o n??mero total de participantes
        var qtdeParticipantes = this.participantes.length;
        // [X] Calcular o custo por participante
        var custoPorParticipante = this.total / qtdeParticipantes;

        this.participantes.forEach(part => {
            // [X] Calcular quanto cada participante j?? pagou
            var pagoPeloParticipante = this.calcularTotalParticipante(part.idParticipante);
            part.totalPagar = pagoPeloParticipante;

            // [X] Identificar se o participante dever?? receber ou pagar
            // [X] Calcular quanto o participante ainda tem que pagar
            // [X] Calcular se o participante tem algo a receber        if (pagoPeloParticipante > 0) {
                if (pagoPeloParticipante > custoPorParticipante) {
                    // pagou mais despesas do que o custo por participante, 
                    // ent??o deve receber algum valor
                    part.totalPagar = 0;
                    part.totalReceber = pagoPeloParticipante - custoPorParticipante;
                } else {
                    // pagou menos despesas do que o custo por participante, 
                    // ent??o deve pagar a diferen??a
                    part.totalPagar = custoPorParticipante - pagoPeloParticipante;
                    part.totalReceber = 0;
                }

            } else {
                // n??o pagou nenhuma despesa, ent??o paga o custo por participante
                part.totalPagar = custoPorParticipante;
                part.totalReceber = 0;
            }

        });

    
    
        

    }

    calcularTotalEvento() {
        // TODO
        // Soma os custos totais do evento

        var total = 0;
        this.despesas.forEach(desp => {
            total += desp.valor;
        });
        return total;
    }

    calcularTotalParticipante(idParticipante) {
        // TODO
        // Retorna a soma o total das despesas pagas por um participante
        var total = 0;
        this.despesas.forEach(desp => {
            if (desp.idParticipante == idParticipante) {
                total += desp.valor;
            }            
        });
        return total;        
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