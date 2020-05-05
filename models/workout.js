const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const workoutSchema = new Schema({
  exercises: { type: Array },
  date_start: { type: Date, default: Date.now },
  date_end: { type: Date, required: false}
});

const Workout = mongoose.model("Workout", workoutSchema);

module.exports = Workout;
