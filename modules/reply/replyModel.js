const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const replySchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    text: { type: String, required: true },
    isAnonymous: { type: Boolean, required: true },
    userId: { type: mongoose.Schema.Types.ObjectID, ref: "User" },
    thoughtId: { type: mongoose.Schema.Types.ObjectID, ref: "Thought" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Reply", replySchema);
