const express = require('express');
const cors = require('cors');
const app = express();

const authRoute = require('./routes/auth')

app.use(cors());
app.use(express.json());

app.use('/auth', authRoute);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = app;