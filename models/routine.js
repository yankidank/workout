const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const routineSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Enter a name for routine"
  },
  exercises: Array
});

const Routine = mongoose.model("Routine", routineSchema);

module.exports = Routine;
