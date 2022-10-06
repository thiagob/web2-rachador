var sqlite3 = require('sqlite3');

class DBConn {

    constructor() {
        this.db = new sqlite3.Database('db/dev.db');
    }

    createTables() {
        var sql = `CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL)`;

        return this.db.run(sql);
    }
    
    findAllEventos(callback) {

        var sql = "SELECT * FROM eventos";
        return this.db.all(sql, [], callback);

    }

    getEventoById(id, callback) {

        var sql = "SELECT * FROM eventos WHERE id = (?)";
        return this.db.get(sql, [id], callback);

    }    

    createEvento(nome, callback) {

        var sql = "INSERT INTO eventos (nome) VALUES (?)";
        return this.db.run(sql, [nome], callback);

    }

    deleteEvento(id, callback) {

        var sql = "DELETE FROM eventos WHERE ID = (?)";
        return this.db.run(sql, [id], callback);

    }    

}

module.exports = DBConn