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

}

module.exports = DBConn