import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      '⚠️  MONGODB_URI not set. Running with in-memory mock data only — see src/data/ for the dataset and src/controllers/ for the seam where real Mongoose queries should replace mock lookups.'
    );
    return;
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}
