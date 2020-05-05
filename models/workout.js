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

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
