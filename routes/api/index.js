const router = require("express").Router();
const exerciseRoutes = require("./exercise");
const routineRoutes = require("./routine");
const workoutRoutes = require("./workout");

router.use("/exercise", exerciseRoutes);
router.use("/routine", routineRoutes);
router.use("/workout", workoutRoutes);

module.exports = router;
