CREATE TABLE eventos (
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    nome  TEXT    NOT NULL,
    total DECIMAL NOT NULL
                  DEFAULT (0) 
);


CREATE TABLE participantes (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    nomeCompleto STRING  NOT NULL,
    apelido      TEXT    UNIQUE
                         NOT NULL,
    email        STRING  UNIQUE
                         NOT NULL,
    chavePIX     STRING
);


CREATE TABLE participante_evento (
    idEvento       INTEGER REFERENCES eventos (id) ON DELETE NO ACTION
                                                   ON UPDATE NO ACTION
                                                   MATCH SIMPLE
                           NOT NULL,
    idParticipante INTEGER REFERENCES participantes (id) ON DELETE NO ACTION
                                                         ON UPDATE NO ACTION
                                                         MATCH SIMPLE
                           NOT NULL,
    totalPagar     DECIMAL NOT NULL
                           DEFAULT (0),
    totalReceber   DECIMAL NOT NULL
                           DEFAULT (0),
    CONSTRAINT PK_Participante_Evento PRIMARY KEY (
        idEvento,
        idParticipante
    )
);

CREATE TABLE despesas (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    idEvento       INTEGER REFERENCES eventos (id) 
                           NOT NULL,
    idParticipante         REFERENCES participantes (id) 
                           NOT NULL,
    descricao      STRING  NOT NULL,
    valor          DECIMAL NOT NULL,
    FOREIGN KEY (
        idEvento,
        idParticipante
    )
    REFERENCES participante_evento (idEvento,
    idParticipante) 
);


CREATE TABLE pagamentos (
    id                      INTEGER PRIMARY KEY AUTOINCREMENT
                                    NOT NULL,
    idEvento                INTEGER REFERENCES eventos (id) 
                                    NOT NULL,
    idParticipantePagador   INTEGER REFERENCES participantes (id) 
                                    NOT NULL,
    idParticipanteRecebedor INTEGER REFERENCES participantes (id) 
                                    NOT NULL,
    valor                   DECIMAL NOT NULL,
    status                  STRING  NOT NULL
);
