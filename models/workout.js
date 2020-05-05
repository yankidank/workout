const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  name: {
    type: String,
    trim: true,
    required: "Enter a name for workout"
  },
  exercises: Array
});

const workout = mongoose.model("workout", workoutSchema);

module.exports = workout;
