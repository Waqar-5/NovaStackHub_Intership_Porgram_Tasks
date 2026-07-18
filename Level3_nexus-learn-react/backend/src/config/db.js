import mongoose from "mongoose";
import { env } from "./env.js";

let hasWarnedNoUri = false;

export async function connectDB() {
  mongoose.set("strictQuery", true);
  mongoose.set("bufferTimeoutMS", 5000);

  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 3000,
    });
    console.log(`[db] connected → ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    if (!hasWarnedNoUri) {
      console.error(
        `[db] connection failed (${err.message}). The API will still start so ` +
          "you can hit /api/v1/health, but any route touching the database will fail " +
          "until MONGO_URI is set correctly in .env."
      );
      hasWarnedNoUri = true;
    }
  }

  mongoose.connection.on("disconnected", () => {
    console.warn("[db] disconnected");
  });
}
