const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middleware/auth.middleware");
const dashboardController = require("../controllers/dashboard.controller");

router.use(authMiddleware);

// Dashboard geral
router.get("/", dashboardController.getDashboard);

module.exports = router;
