const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");

// Load env variables
dotenv.config();

const { connectDB } = require("./utils");
const errorStrings = require("./errors");

// Initialize express app
const app = express();

// Connect to MongoDB client using mongoose
connectDB();

// Set basic rate limiter
app.set("trust proxy", 1);
var limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
  message: errorStrings.RATE_LIMITED,
});
app.use(limiter);

// Use helmet to prevent common security vulnerabilities
app.use(helmet());

// Use body-parser to parse json body
app.use(bodyParser.urlencoded({ limit: "1mb", extended: false }));
app.use(bodyParser.json("100mb"));

// Allow CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use(cors());

app.use("/api/v1", require("./routes"));

// This function will give a 404 response if an undefined API endpoint is fired
app.use((req, res, next) => {
  const error = new Error(errorStrings.ROUTE_NOT_FOUND);
  error.status = 404;
  next(error);
});

app.use(async (error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message:
      error.message || error.toString() || errorStrings.SOMETHING_WENT_WRONG,
  });
});

const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
