const express = require("express");

const userRoutes = require("./modules/user/userRoutes");
const thoughtRoutes = require("./modules/thought/thoughtRoutes");

const router = express.Router();

router.use("/users", userRoutes);
router.use("/thoughts", thoughtRoutes);

module.exports = router;
