const { port } = require('./config/config');
const app = require('./app');

//Server listening
app.listen(port, () => console.log(`API server listening on port ${port}`));