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
        
        const PORT = process.env.PORT || config.get('api.port');
        app.listen(PORT, () => console.log('Listening in port 3000...'));
    }
});

