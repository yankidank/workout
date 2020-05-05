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

const routine = mongoose.model("routine", routineSchema);

module.exports = routine;
