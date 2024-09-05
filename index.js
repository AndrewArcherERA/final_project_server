const express = require('express');
const cors = require('cors');
const countsRoute = require('./routes/count');


const app = express();
app.use(cors());
app.use(express.json());

app.use('/counts', countsRoute);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;