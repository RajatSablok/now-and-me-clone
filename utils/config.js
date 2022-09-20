module.exports = Object.freeze({
  MONGO_URL: process.env.MONGO_URL || "mongodb://mongo:27017",
  JWT_SECRET: process.env.JWT_SECRET || "0GGOC7TavNUUYW9",
  PORT: process.env.PORT || 5000,
  DEFAULT_JWT_EXPIRY: process.env.DEFAULT_JWT_EXPIRY || "30d",
  DEFAULT_PAGE_LIMIT: 10,
});
