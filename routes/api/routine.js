const router = require("express").Router();
const routineController = require("../../controllers/routineController");

// Matches with "/api/routine"
router.route("/")
  .get(routineController.findAll)
  .post(routineController.create);

// Matches with "/api/routine/:id"
router
  .route("/:id")
  .get(routineController.findById)
  .put(routineController.update)
  .delete(routineController.remove);

module.exports = router;
