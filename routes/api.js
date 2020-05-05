const router = require("express").Router();
const Exercise = require("../models/exercise.js");
const Routine = require("../models/routine.js");
const Workout = require("../models/workout.js");

/* 
ROUTES: 
  GET workouts    // Previous workout
  GET workouts/:id// Returns sepcific workout
  POST exercise   // Add new
  PUT exercise/:id // Modify
  POST routine    // Add new
  PUT routine/:id // Modify
                  // When a routine is modified, create a clone and switch to it 
*/

router.post("/api/exercise", ({ body }, res) => {
  Exercise.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/api/routine", ({ body }, res) => {
  Routine.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/api/workout", ({ body }, res) => {
  Workout.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/api/exercise/bulk", ({ body }, res) => {
  Exercise.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/workout", (req, res) => {
  Workout.find({})
    .sort({ date: -1 })
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/exercise", (req, res) => {
  Exercise.find({})
    .sort({ date: -1 })
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/routine", (req, res) => {
  Routine.find({})
    .sort({ date: -1 })
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;
