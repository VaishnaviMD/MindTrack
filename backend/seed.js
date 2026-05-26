import mongoose from "mongoose";
import dotenv from "dotenv";

import Journal from "./models/Journal.js";

dotenv.config();

const DEFAULT_MONGO_URI = "mongodb://127.0.0.1:27017/mindtrack";
const MONGO_URI = process.env.MONGO_URI || DEFAULT_MONGO_URI;

const seedData = [
  // Example entry — replace or extend with your own data.
  {
    mood: "Content",
    note: "Set up MindTrack today and logged my first mood!",
    date: new Date(),
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Connected to MongoDB at ${MONGO_URI}`);

    await Journal.deleteMany({});
    console.log("Cleared existing journal entries.");

    if (seedData.length > 0) {
      await Journal.insertMany(seedData);
      console.log(`Inserted ${seedData.length} journal entries.`);
    } else {
      console.log("No seed data provided — database left empty.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  }
}

seedDatabase();

