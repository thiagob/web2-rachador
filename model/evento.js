var DBConn = require('../db-conn.js');
var dbConn = new DBConn();

var Participante = require('../model/participante')
var Despesa = require('../model/despesa')


class Evento {

    constructor() {
        this.nome = '';
        this.erros = [];
        this.totalPago = 0,
        this.totalRecebido = 0,
        this.totalEmAberto = 0
    }

    carregar(json){        
        this.id = json.id;
        this.nome = json.nome;
        //this.totalPago = json.totalPago;
        //this.totalRecebido = json.totalRecebido;
        //this.totalEmAberto = json.totalEmAberto;       
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
        return dbConn.db.get('SELECT * FROM eventos WHERE id = (?)', id, callback);
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

    atualizarTotais(callback) {
        var sql = `UPDATE eventos 
            SET totalPago = (?),
                totalRecebido = (?),
                totalEmAberto = (?)
            WHERE ID = (?)`;

        var params = [this.totalPago, this.totalRecebido, this.totalEmAberto, this.id];
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


    calcularTotais(callback) {
        this.totalPago = Math.random();
        this.atualizarTotais(callback);
    }
}

module.exports = Evento