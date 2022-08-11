/* Importing the express module and creating a new express application. */
require("dotenv").config();
require("./database/config").dbConnection();

const express = require("express"),
  path = require("path"),
  app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

const allowlist = [
  "https://vaccination-inventory-react-frontend.vercel.app/",
  "http://localhost:3000",
  "http://localhost:80",
  "http://localhost",
];

var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header("Origin")) !== -1) {
    corsOptions = { origin: true }; // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};
const users = require("./routes/usersRoutes");

app.use(cors(corsOptionsDelegate));
app.use(express.json()); //Para parsear respuestas a json
app.use(logger("dev"));
app.use(bodyParser.json());

users(app);
var port = process.env.PORT || 3002;
// Una vez definidas nuestras rutas podemos iniciar el servidor
app.listen(port, (err) => {
  if (err) {
    console.error("Error escuchando: ", err);
    return;
  }
  console.log(`Escuchando en el puerto :${port}`);
});
