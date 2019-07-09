const express = require('express');
const dbRoutes = require('./data/db-routes');

const server = express();

const port = 5000;
server.use(express.json());

server.use('/api/posts', dbRoutes);

server.get('/', (req, res) => {
   res.send(`
    <h2>Jose's Posts API</h>
    <p>Welcome to the Jose's Posts API</p>
  `);
});

server.listen(port, () => {
   console.log('\n*** Awesome Server Running on http://localhost:5000 ***\n');
});