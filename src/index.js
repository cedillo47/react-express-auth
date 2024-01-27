require('dotenv').config();
const server = require('./server');

const port = process.env.PORT || 8080;
console.log("wawea")
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
