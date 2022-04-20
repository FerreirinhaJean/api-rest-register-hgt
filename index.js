const customExpress = require('./config/customExpress');
const envs = require('./config/envs');
const database = require('./database');

const app = customExpress();

app.listen(envs.server.port, () => console.log('Listening in port 3000...'));