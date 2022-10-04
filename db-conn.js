var sqlite3 = require('sqlite3');

class DBConn {

    constructor() {
        this.db = new sqlite3.Database('db/dev.db');
    }

    createTables() {
        var sql = `CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL)`;

        this.db.run(sql);

        var sql = `CREATE TABLE participantes (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            nomeCompleto STRING  NOT NULL,
            apelido      TEXT    UNIQUE NOT NULL,
            email        STRING  UNIQUE NOT NULL,
            chavePIX     STRING
        );`;

        this.db.run(sql);        
    }

    getLastInsertRowId(callback) {
        return this.db.get('SELECT last_insert_rowid()', callback);
    }

    findAllEventos(callback) {
        var sql = 'SELECT * FROM eventos';
        return this.db.all(sql, [], callback);
    }

    createEvento(nome, callback) {
        var sql = 'INSERT INTO eventos (nome) VALUES (?)';
        return this.db.run(sql, [nome], callback);
    }

    updateEvento(id, nome, callback) {
        var sql = 'UPDATE eventos SET nome = (?) WHERE ID = (?)';
        return this.db.run(sql, [nome, id], callback);
    }

    getEventoById(id, callback) {
        var sql = 'SELECT * FROM eventos WHERE ID = (?)';
        return this.db.get(sql, id, callback);
    }    

    deleteEvento(id, callback) {
        var sql = 'DELETE FROM eventos WHERE ID = (?)';
        return this.db.run(sql, id, callback);
    }    


}

module.exports = DBConn