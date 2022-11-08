var DBConn = require('../db-conn.js');
var dbConn = new DBConn();

class Pagamento {

    constructor() {
        this.descricao = '';
        this.valor = '';
        this.erros = [];
    }

    carregar(json){        
        this.id = json.id;
        this.data = json;

        this.idEvento = json.idEvento;
        this.idParticipanteRecebedor = json.idParticipanteRecebedor;
        this.idParticipantePagador = json.idParticipantePagador;
        this.valor = json.valor;
        this.status = this.status
    }

    validar() {
        this.erros = [];

        // TODO: a ser implementado

        return this.erros.length == 0;
    }    

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM pagamentos', callback);
    }

    static buscarPeloId(id, callback) {
        return dbConn.db.get('SELECT * FROM pagamento WHERE id = (?)', id, callback);
    }

    static buscarPagamentosDoEvento(idEvento, callback) {
        return dbConn.db.all(`
            SELECT
                pagamentos.*,
                recebedor.nomeCompleto as nomeRecebedor,
                pagador.nomeCompleto  as nomePagador
            FROM
                pagamentos,
                participantes recebedor,
                participantes pagador
            WHERE pagamentos.idEvento = (?)
            AND pagamentos.idParticipanteRecebedor = recebedor.id
            AND pagamentos.idParticipantePagador = pagador.id
        `, idEvento, callback);
    }

    static excluir(idPagamento, callback) {
        var sql = `DELETE FROM pagamentos WHERE ID = (?)`;
        return dbConn.db.run(sql, idPagamento, callback);
    }

    static excluirPagamentosDoEvento(idEvento, callback) {
        var sql = `DELETE FROM pagamentos WHERE idEvento = (?)`;
        return dbConn.db.run(sql, idEvento, callback);
    }


    salvar(callback) {
        if (this.id > 0) {
            this.atualizar(callback);
        } else {
            this.criar(callback);
        }
    }

    atualizar(callback) {
        var sql = `UPDATE pagamentos 
            SET idEvento = (?), idParticipanteRecebedor = (?), idParticipantePagador = (?), valor = (?), status = (?)
            WHERE ID = (?)`;

        var params = [this.idEvento, this.idParticipanteRecebedor, this.idParticipantePagador, this.valor, this.status, this.id];
        return dbConn.db.run(sql, params, callback);
    }

    criar(callback) {
        var sql = `INSERT INTO despesas (idEvento, idParticipanteRecebedor, idParticipantePagador, valor, status)
        VALUES ((?), (?), (?), (?), (?))`;

        var params = [this.idEvento, this.idParticipanteRecebedor, this.idParticipantePagador, this.valor, this.status];
        return dbConn.db.run(sql, params, callback);
    }    

}

module.exports = Pagamento