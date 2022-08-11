const cors = require("cors");

const UsersController = require("../controllers/usersController");

module.exports = (app, upload) => {
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    next();
  });

  app.get("/api/users/getAllUsers", UsersController.getAllUsers);
  app.post("/api/users/login", UsersController.login);
  app.post("/api/users/createUser", UsersController.createUser);
  app.put("/api/users/updateUser/:id", UsersController.updateUser);
  app.delete("/api/users/deleteUser/:id", UsersController.deleteUser);
};
