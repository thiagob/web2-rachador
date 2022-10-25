var DBConn = require('../db-conn.js');
var dbConn = new DBConn();

class Participante {

    constructor() {
        this.nomeCompleto = '';
        this.apelido = '';
        this.email = '';
        this.chavePIX = '';
        this.erros = [];
    }

    carregar(json){        
        this.id = json.id;
        this.nomeCompleto = json.nomeCompleto;
        this.apelido = json.apelido;
        this.email = json.email;
        this.chavePIX = json.chavePIX;
    }

    validar() {
        this.erros = [];

        if (this.nomeCompleto == undefined || this.nomeCompleto == "") this.erros.push('Nome em branco');
        else if (this.nomeCompleto.length < 3) this.erros.push('Nome com menos de 3 caracteres');

        if (this.apelido == undefined || this.apelido == "") this.erros.push('Apelido em branco');
        else if (this.apelido.length < 3) this.erros.push('Apelido com menos de 3 caracteres');

        if (this.email == undefined || this.email == "") {
            this.erros.push('E-mail em branco');
        } else {
            if (this.email.length < 3) this.erros.push('E-mail com menos de 3 caracteres');
            if (!this.email.includes('@')) this.erros.push('E-mail inválido');
        }

        return this.erros.length == 0;
    }    

    static buscarTodos(callback) {
        return dbConn.db.all('SELECT * FROM participantes', callback);
    }

    static buscarPeloId(id, callback) {
        return dbConn.db.get('SELECT * FROM participantes WHERE id = (?)', id, callback);
    }

    static buscarParticipantesDoEvento(idEvento, callback) {
        return dbConn.db.all(`
            SELECT
                participante_evento.*,
                participantes.nomeCompleto,
                participantes.apelido,
                participantes.email,
                participantes.chavePIX
            FROM 
                participante_evento,
                participantes
            WHERE participante_evento.idParticipante = participantes.id
                AND participante_evento.idEvento = (?)
        `, idEvento, callback);
    }

    static buscarDemaisParticipantes(idEvento, callback) {
        return dbConn.db.all(`
            SELECT
                *
            FROM
                participantes
            WHERE id not in (SELECT idParticipante FROM participante_evento WHERE idEvento = (?))
        `, idEvento, callback);
    }    


    salvar(callback) {
        if (this.id > 0) {
            this.atualizar(callback);
        } else {
            this.criar(callback);
        }
    }

    atualizar(callback) {
        var sql = `UPDATE participantes 
            SET nomeCompleto = (?), apelido = (?), email = (?), chavePIX = (?) 
            WHERE ID = (?)`;

        var params = [this.nomeCompleto, this.apelido, this.email, this.chavePIX, this.id];
        return dbConn.db.run(sql, params, callback);
    }

    criar(callback) {
        var sql = `INSERT INTO participantes (nomeCompleto, apelido, email, chavePIX)
        VALUES ((?), (?), (?), (?))`;

        var params = [this.nomeCompleto, this.apelido, this.email, this.chavePIX];
        return dbConn.db.run(sql, params, callback);
    }    


    excluir(callback) {
        var sql = `DELETE FROM participantes
        WHERE ID = (?)`;

        return dbConn.db.run(sql, this.id, callback);
    }      
}

module.exports = Participante