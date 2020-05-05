const mongoose = require("mongoose");
const db = require("../models");

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true
});

const routineSeed = [
  {
    name: "Cardio",
    exercises: [1,2,3,4,5,17,18]
  },
  {
    name: "Arms",
    exercises: [6,7,8,9,10,11]
  },
  {
    name: "Legs",
    exercises: [1,3,13,16]
  },
  {
    name: "Abs",
    exercises: [9,12]
  },
  {
    name: "Shoulders",
    exercises: [6,7,9,10]
  }
];

db.Routine.deleteMany({})
  .then(() => db.Routine.collection.insertMany(routineSeed))
  .then(data => {
    console.log(data.result.n + " records inserted!");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });

  
const exerciseSeed = [
	{
		name: "Running",
		measurements: {"miles": 12, "seconds": 3000}
	},
	{
		name: "Walking",
		measurements: {"miles": 6, "seconds": 600}
	},
	{
		name: "Biking",
		measurements: {"miles": 12, "seconds": 6000}
	},
	{
		name: "Rowing",
		measurements: {"seconds": 300}
	},
	{
		name: "Swimming",
		measurements: {"laps": 25, "seconds": 360}
	},
	{
		name: "Bench Press",
		measurements: {"reps": 4, "sets": 3, "weight": 110}
	},
	{
		name: "Bent Over Row",
		measurements: {"reps": 12, "sets": 3, "weight": 70}
	},
	{
		name: "Bicep Curls",
		measurements: {"reps": 12, "sets": 3, "weight": 80}
	},
	{
		name: "Push-ups",
		measurements: {"reps": 10, "sets": 3}
	},
	{
		name: "Shoulder Shrugs",
		measurements: {"reps": 10, "sets": 3, "weight": 120}
	},
	{
		name: "Tricep Dips",
		measurements: {"reps": 12, "sets": 3}
	},
	{
		name: "Crunches",
		measurements: {"reps": 12, "sets": 3}
	},
	{
		name: "Calf Raises",
		measurements: {"reps": 12, "sets": 3, "weight": 50}
	},
	{
		name: "Leg Raises",
		measurements: {"reps": 12, "sets": 3}
	},
	{
		name: "Lunges",
		measurements: {"reps": 8, "sets": 3, "weight": 110}
	},
	{
		name: "Squats",
		measurements: {"reps": 6, "sets": 3, "weight": 140}
	},
	{
		name: "Jump Rope",
		measurements: {"seconds": 120, "sets": 5}
	},
	{
		name: "Jumping Jacks",
		measurements: {"seconds": 120, "sets": 3}
	}
  ];
  
  db.Exercise.deleteMany({})
	.then(() => db.Exercise.collection.insertMany(exerciseSeed))
	.then(data => {
	  console.log(data.result.n + " records inserted!");
	  process.exit(0);
	})
	.catch(err => {
	  console.error(err);
	  process.exit(1);
	});
  