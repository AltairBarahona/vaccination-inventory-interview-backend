const { Schema, model } = require("mongoose");

const VaccineSchema = Schema({
  vaccinationState: {
    type: Boolean,
    default: false,
  },
  vaccineType: {
    type: String,
  },
  vaccinationDate: {
    type: Date,
  },
  dosesNumber: {
    type: Number,
  },
});
