const express = require("express");
const { authMiddleware, authorizeRoles } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", authMiddleware, authorizeRoles(2), (req, res) => {
  res.json({ msg: "Triagem registrada pelo brigadista." });
});

module.exports = router;
