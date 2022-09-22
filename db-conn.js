var sqlite3 = require('sqlite3');

class DBConn {

    constructor() {
        this.db = new sqlite3.Database('db/dev.db');
    }

    findAllEventos(callback) {

        var sql = "SELECT * FROM eventos";
        return this.db.all(sql, [], callback);

    }

}

module.exports = DBConn