/* Importing the express module and creating a new express application. */
require("dotenv").config();
require("./database/config").dbConnection();

const express = require("express"),
  path = require("path"),
  app = express();

const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const users = require("./routes/usersRoutes");

// const whitelist = [
//   "http://localhost:3000",
//   "http://localhost:80",
//   "http://localhost",
// ];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

// app.use(cors(corsOptions));
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});
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
