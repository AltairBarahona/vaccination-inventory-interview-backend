/* Importing the express module and creating a new express application. */
require("dotenv").config();
require("./database/config").dbConnection();

const express = require("express"),
  path = require("path"),
  app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const users = require("./routes/usersRoutes");

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
