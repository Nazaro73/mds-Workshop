let express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

// Lecture du fichier models/index.js afin de lancer la synchronisation de Sequelize
require('./models/index.js');

let app = express();

app.use(cors());

const indexRouter = require('./routes/index');
app.use('/', indexRouter);


module.exports = app;