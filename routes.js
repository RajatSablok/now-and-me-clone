const express = require("express");

const userRoutes = require("./modules/user/userRoutes");

const router = express.Router();

router.use("/users", userRoutes);

module.exports = router;
