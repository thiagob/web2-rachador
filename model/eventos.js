const e = require("express");

class Evento {

    constructor() {
        this._nome = '';
        this.erros = [];
    }


    get nome() {
        return this._nome;
    }

    set nome(value) {
        this._nome = value;
    }

    valida() {
        this.erros = [];

        if (this.nome == "") this.erros.push('Nome em branco');
        if (this.nome.length < 3) this.erros.push('Nome com menos de 3 caracteres');

        return this.erros.length == 0;
    }

}

var evento = new Evento();
console.log(evento.valida());

evento.nome = "X";
console.log(evento.valida());

evento.nome = "XXXX";
console.log(evento.valida());

module.exports = Evento