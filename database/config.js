//Aquí va la cadena de conexión a la base de datos
//Importo el paquete de mongoose
const mongoose = require("mongoose");

//Creo función encargada de hacer la conexión de forma asíncrona
const dbConnection = async () => {
  /*Try cath porque necesito capturar todo lo que pueda suceder, que yo no lo pueda
    controlar al ser una conexión con una base de datos en este caso en Mongo Atlas*/

  try {
    console.log("Conectando a la base de datos...");
    console.log(process.env.DB_CNN);
    //Conexión con la base de datos mediante la cadena de conexión
    await mongoose.connect(process.env.DB_CNN, {
      //Esto es necesario acorde a recomendación de documentación
      useNewUrlParser: true,
      //userUnifiedTopology: true, me dio error de not supported
      // useCreateIndexes: true, me dio error de not supported
    });
    //Mensaje para comprobar si se pudo conectar
    console.log("DB Online");
    console.log("Init DB Config");
  } catch (error) {
    console.log("Error: " + error);
    throw new Error("Error en la base de datos - hable con el admin");
  }
};

//Para poder usar una función debemos exportarla manualmente
//Exportación por nombre
module.exports = {
  dbConnection,
};
