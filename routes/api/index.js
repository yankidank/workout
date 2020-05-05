const router = require("express").Router();
const exerciseRoutes = require("./exercise");
const routineRoutes = require("./routine");
const workoutRoutes = require("./workout");

router.use("/exercise", exerciseRoutes);
router.use("/routine", routineRoutes);
router.use("/workout", workoutRoutes);

/* 
const Exercise = require("../models/exercise.js");
const Routine = require("../models/routine.js");
const Workout = require("../models/workout.js");

const exerciseController = require("../../controllers/exerciseController");
const routineController = require("../../controllers/routineController");
const workoutController = require("../../controllers/workoutController");

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

router.get("/api/exercise/:id", (req, res) => {
  Exercise.findOne({
    where: {
      _id: req.params.id
    }
  })
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

*/

module.exports = router;
