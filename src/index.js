require('dotenv').config();
const server = require('./server');

const port = process.env.PORT || 3334;
console.log("waw ea ")
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
