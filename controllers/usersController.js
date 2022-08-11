const Users = require("../models/user");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const UsersController = {
  // Function to create a new user
  createUser: async (req, res) => {
    try {
      const {
        identificationNumber,
        firstName,
        secondName,
        paternalSurname,
        maternalSurname,
        email,
      } = req.body;

      //verify if the user already exists
      const userAlreadyRegistered = await Users.findOne({ email });

      //return 400 and message if the user already exists
      if (userAlreadyRegistered) {
        return res.status(400).json({
          message: "The user already exists",
        });
      }

      //auto generate fixed random password based on Mongoose's ObjectId
      let randomPassword = mongoose.Types.ObjectId();
      randomPassword = randomPassword.toString().substring(0, 6).toUpperCase();
      //hash random password to save encrypted password in database
      const randomPasswordHashed = crypto
        .createHash("sha256")
        .update(randomPassword)
        .digest("hex");

      //create new user
      const user = new Users({
        identificationNumber,
        firstName,
        secondName,
        paternalSurname,
        maternalSurname,
        email,
        userGenerated: email,
        password: randomPasswordHashed,
      });

      //save new user in database
      await user.save();

      try {
        var transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: "gaslygo@gmail.com",
            pass: "jrmxbrdqbtcxrqtp",
          },
        });

        var mailOptions = {
          from: "gaslygo@gmail.com",
          to: email,
          subject: "Credenciales cuenta Kruger Corporation",
          html: `
          <h1>Credenciales de acceso</h1>
              <h2>Bienvenido ${firstName} ${paternalSurname}, estas son tus credenciales</h2>
              <p>Username: ${email}</p>
              <p>Password: ${randomPassword}</p>
              `,
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            console.log(error);
            console.log("Error en transporter email");
            return res.status(500).json({
              success: false,
              message: error.message,
            });
          }
          console.log("Email sent: " + info.response);
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Error, no se pudo envia rel email",
        });
      }

      //return success message
      res.json({
        message: "User created successfully",
      });
    } catch (error) {
      //return error message
      console.error("Error: ", error);
      return res.status(501).json({
        success: false,
        message: "Error creating user",
      });
    }
  },

  // Function that is going to get all the users from the database.
  getAllUsers: async (req, res = response, next) => {
    try {
      //get all users from database
      const allUsers = await Users.find();
      console.log("Users: ", allUsers);
      //return all users with 201 success status
      return res.status(201).json(allUsers);
    } catch (error) {
      //return error message
      console.error("Error: ", error);
      return res.status(501).json({
        success: false,
        message: "Error al obtener los usuarios",
      });
    }
  },
  // Function for deleting a user from the database.
  deleteUser: async (req, res = response, next) => {
    try {
      // Delete user according to the email provided in the request.
      const id = req.params.id;
      const userToDelete = await Users.findOneAndDelete({ _id: id });

      // If the user whit that email is not found, return error message.
      if (!userToDelete) {
        return res.status(404).json({
          success: false,
          message: `The user ${req.body} was not founded`,
        });
      }

      return res.status(201).json({
        message: `The user was deleted`,
        success: true,
        user: userToDelete,
      });
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error in delete user`,
        error: error,
      });
    }
  },

  updateUser: async (req, res = response, next) => {
    try {
      const id = req.params.id;
      const {
        identificationNumber,
        firstName,
        secondName,
        paternalSurname,
        maternalSurname,
        email,
        bornDate,
        address,
        phone,
        vaccinationState,
        vaccineType,
        dosesNumber,
      } = req.body;

      const userToUpdate = await Users.findOneAndUpdate(
        { _id: id },
        {
          identificationNumber: identificationNumber,
          firstName: firstName,
          secondName: secondName,
          paternalSurname: paternalSurname,
          maternalSurname: maternalSurname,
          email: email,
          bornDate: bornDate,
          address: address,
          phone: phone,
          vaccinationState: vaccinationState,
          vaccineType: vaccineType,
          dosesNumber: dosesNumber,
        }
      );

      if (!userToUpdate) {
        return res.status(404).json({
          success: false,
          message: `The user ${req.body} was not founded`,
        });
      }

      return res.status(201).json({
        message: `The user with email ${email} was updated`,
        success: true,
        user: userToUpdate,
      });
    } catch (error) {
      return res.status(501).json({
        success: false,
        message: `Error in update user ${req.params}`,
        error: error,
      });
    }
  },

  login: async (req, res = response, next) => {
    const isPasswordMatched = async (randomPassword, hash) => {
      const myPasswordHashed = crypto
        .createHash("sha256")
        .update(randomPassword)
        .digest("hex");
      if (myPasswordHashed === hash) {
        return true;
      }
      return false;
    };
    try {
      const email = req.body.username;
      const password = req.body.password;
      console.log("email: ", email);
      console.log("password: ", password);
      const user = await Users.findOne({ email });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }
      const pass = await isPasswordMatched(password, user.password);
      // const pass = password == user.password;
      console.log("PASS: ", pass);
      if (pass) {
        // const token = jwt
        //   .sign
        // { id: user.uid, email: user.email },
        // keys.secretOrKey,
        // {
        // expiresIn: 60*60*24 - para que expire en una hora
        // }
        // ();
        // const userHasRoles = await UserHasRoles.find({ id_user: user.email });
        const data = {
          id: user.id,
          firstName: user.firstName,
          secondName: user.secondName,
          paternalSurname: user.paternalSurname,
          maternalSurname: user.maternalSurname,
          email: user.email,
          role: user.role,
        };
        // console.log("TOKEN GUARDADO: ", token);
        //Revisar update token
        // await updateToken(user.phone, token);
        //console.log("Usuario enviado: ",data);

        return res.status(201).json({
          success: true,
          data: data,
          message: "Login exitoso",
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Contraseña incorrecta",
          // data: data
        });
      }
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({
        success: false,
        message: "Error al momento de hacer login",
        error: error,
      });
    }
  },

  logout: async (req, res, next) => {
    try {
      const id = req.body.id;
      await Users.updateToken(id, null);
      return res.status(201).json({
        success: true,
        message: "La sesión del usuario se ha cerrado correctamente",
      });
    } catch (error) {
      console.log(`Error: ${error}`);
      return res.status(501).json({
        success: false,
        message: "Error en el momento de cerrar sesión",
        error: error,
      });
    }
  },
};

module.exports = UsersController;
