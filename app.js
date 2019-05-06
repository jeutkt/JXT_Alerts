const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

//import alert router
const alertRouter = require("./routes/alert-v1");

//import alerts model
const alertModel = require("./models/Alert");

const app = express();

app.use(bodyParser.json());

// Activation de Helmet
app.use(helmet({ noSniff: true }));

// On injecte le model dans le router. Ceci permet de supprimer la dépendance
// directe entre le router et le modele
app.use('/v1/alerts',alertRouter(alertModel))

// For unit tests
exports.app = app