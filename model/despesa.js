var DBConn = require('../db-conn.js');
var dbConn = new DBConn();

class Despesa {

    constructor() {
        this.descricao = '';
        this.valor = '';
        this.erros = [];
    }

    carregar(json){        
        this.id = json.id;
        this.data = json;

        this.idEvento = json.idEvento;
        this.idParticipante = json.idParticipante;
        this.descricao = json.descricao;
        this.valor = json.valor;
    }

    validar() {
        this.erros = [];

        if (this.descricao == undefined || this.descricao == "") this.erros.push('Valor inválido');
        if (this.valordescricao == undefined || this.valor < 0) this.erros.push('Valor inválido');        

        if (this.idParticipante == undefined || this.idParticipante == 0) this.erros.push('Informe um participante');
        if (this.idEvento == undefined || this.idParticipante == 0) this.erros.push('Informe um evento');

        return this.erros.length == 0;
    }    

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM despesas', callback);
    }

    static buscarPeloId(id, callback) {
        return dbConn.db.get('SELECT * FROM despesas WHERE id = (?)', id, callback);
    }

    static buscarDespesasDoEvento(idEvento, callback) {
        return dbConn.db.all(`
            SELECT
                despesas.*,
                participantes.nomeCompleto,
                participantes.email,
                participantes.chavePIX
            FROM
                despesas,
                participantes
            WHERE despesas.idEvento = (?)
            AND despesas.idParticipante = participantes.id        
        `, idEvento, callback);
    }

    static excluir(idDespesa, callback) {
        var sql = `DELETE FROM despesas WHERE ID = (?)`;
        return dbConn.db.run(sql, idDespesa, callback);
    }      


    salvar(callback) {
        if (this.id > 0) {
            this.atualizar(callback);
        } else {
            this.criar(callback);
        }
    }

    atualizar(callback) {
        var sql = `UPDATE despesas 
            SET idEvento = (?), idParticipante = (?), descricao = (?), valor = (?) 
            WHERE ID = (?)`;

        var params = [this.idEvento, this.idParticipante, this.descricao, this.valor, this.id];
        return dbConn.db.run(sql, params, callback);
    }

    criar(callback) {
        var sql = `INSERT INTO despesas (idEvento, idParticipante, descricao, valor)
        VALUES ((?), (?), (?), (?))`;

        var params = [this.idEvento, this.idParticipante, this.descricao, this.valor];
        return dbConn.db.run(sql, params, callback);
    }    

}

module.exports = Despesa