class Tables {
    init(connection) {
        this.connection = connection;
        this.createRegisterHgt();
    }

    createRegisterHgt() {
        const sql = `CREATE TABLE IF NOT EXISTS registros(
                    id INTEGER NOT NULL AUTO_INCREMENT,
                    data DATETIME NOT NULL,
                    tipo_exame INTEGER NOT NULL,
                    resultado INTEGER NOT NULL,
                    observacao TEXT,
                    data_criacao DATETIME NOT NULL,
                    PRIMARY KEY (id)
        )
        `;

        this.connection.query(sql, error => {
            if (error)
                console.log(error);
            else
                console.log('Tabela registros criada com sucesso!');
        });
    };
};

module.exports = new Tables;