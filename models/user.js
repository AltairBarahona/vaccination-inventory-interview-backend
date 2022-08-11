const { Schema, model } = require("mongoose");

const UserSchema = Schema({
  identificationNumber: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  secondName: {
    type: String,
    required: true,
  },
  paternalSurname: {
    type: String,
    required: true,
  },
  maternalSurname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  userGenerated: {
    tpye: String,
    default: "",
  },
  password: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "EMPLOYEE",
  },
  bornDate: {
    type: Date,
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
  vaccinationState: {
    type: String,
  },
  vaccineType: {
    type: String,
  },
  dosesNumber: {
    type: Number,
  },
});

UserSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = model("User", UserSchema);
