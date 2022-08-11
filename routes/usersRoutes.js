const cors = require("cors");

const UsersController = require("../controllers/usersController");
const whitelist = [
  "https://vaccination-inventory-react-frontend.vercel.app/",
  "http://localhost:3000",
  "http://localhost:80",
  "http://localhost",
];

module.exports = (app, upload) => {
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

  app.get("/api/users/getAllUsers", UsersController.getAllUsers);
  app.post("/api/users/login", UsersController.login);
  app.post("/api/users/createUser", UsersController.createUser);
  app.put("/api/users/updateUser/:id", UsersController.updateUser);
  app.delete("/api/users/deleteUser/:id", UsersController.deleteUser);
};
