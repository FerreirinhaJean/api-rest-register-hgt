const customExpress = require('./config/customExpress');
const connection = require('./infrastructure/connection');
const Tables = require('./infrastructure/tables');
const config = require('config');

connection.connect(error => {
    if (error)
        console.log(error);
    else {
        console.log('Conectado com sucesso!');
        Tables.init(connection);
        const app = customExpress();
        app.listen(config.get('api.port'), () => console.log('Listening in port 3000...'));
    }
});

