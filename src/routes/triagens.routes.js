const express = require("express");
const { autenticar, autorizar } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", autenticar, autorizar(2), (req, res) => {
  res.json({ msg: "Triagem registrada pelo brigadista." });
});

module.exports = router;
