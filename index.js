/* Importing the express module and creating a new express application. */
require("dotenv").config();
require("./database/config").dbConnection();

const express = require("express"),
  path = require("path"),
  app = express(),
  puerto = 3001;

const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const users = require("./routes/usersRoutes");

const whitelist = [
  "http://localhost:3000",
  "http://localhost:80",
  "http://localhost",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json()); //Para parsear respuestas a json
app.use(logger("dev"));
app.use(bodyParser.json());

users(app);

// Una vez definidas nuestras rutas podemos iniciar el servidor
app.listen(puerto, (err) => {
  if (err) {
    console.error("Error escuchando: ", err);
    return;
  }
  console.log(`Escuchando en el puerto :${puerto}`);
});