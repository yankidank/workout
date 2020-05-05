const router = require("express").Router();
const Transaction = require("../models/exercise.js");

/* 
ROUTES: 
  GET workouts    // Previous workout
  GET workouts/:id// Returns sepcific workout
  POST exercise   // Add new
  PUT exercis/:id // Modify
  POST routine    // Add new
  PUT routine/:id // Modify
                  // When a routine is modified, create a clone and switch to it 
*/
router.post("/api/exercise", ({ body }, res) => {
  Transaction.create(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.post("/api/transaction/bulk", ({ body }, res) => {
  Transaction.insertMany(body)
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

router.get("/api/transaction", (req, res) => {
  Transaction.find({})
    .sort({ date: -1 })
    .then(dbTransaction => {
      res.json(dbTransaction);
    })
    .catch(err => {
      res.status(400).json(err);
    });
});

module.exports = router;
