const hpp = require("hpp");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const express = require("express");
const rateLimit = require("express-rate-limit");

// Load env variables
dotenv.config();

const { connectDB } = require("./utils/utils");
const errorStrings = require("./utils/errors");
const { PORT } = require("./utils/config");

// Initialize express app
const app = express();

// Connect to MongoDB client using mongoose
connectDB();

app.set("trust proxy", 1);

// Set basic rate limiter
var limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per `window` (here, per 1 minute)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: errorStrings.RATE_LIMITED,
});
app.use(limiter);

// Use helmet to update common security headers
app.use(helmet());

// Use hpp to prevent HTTP parameter pollution
app.use(hpp());

// Parse request body and query
app.use(express.urlencoded({ limit: "10kb", extended: false }));
app.use(express.json("10kb"));

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

// Initialize routes
app.use("/api/v1", require("./api/routes"));

// This function will give a 404 response if an undefined API endpoint is fired
app.use((req, res, next) => {
  const error = new Error(errorStrings.ROUTE_NOT_FOUND);
  error.status = 404;
  next(error);
});

// Handle final errors
app.use(async (error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message:
      error.message || error.toString() || errorStrings.SOMETHING_WENT_WRONG,
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
