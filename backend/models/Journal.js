import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    mood: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;

