import mongoose from 'mongoose';

let mongoMemoryServer = null;

const startInMemoryMongo = async () => {
  try {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    mongoMemoryServer = await MongoMemoryServer.create();
    const uri = mongoMemoryServer.getUri();
    console.log(`  In-Memory MongoDB started at: ${uri}`);
    return uri;
  } catch (memErr) {
    console.warn('  Could not start in-memory MongoDB:', memErr.message);
    console.warn('  Falling back to local MongoDB: mongodb://127.0.0.1:27017/wedora');
    return 'mongodb://127.0.0.1:27017/wedora';
  }
};

export const connectDB = async () => {
  let uri = process.env.MONGODB_URI;

  // If no URI set, use in-memory
  if (!uri) {
    console.log('  No MONGODB_URI set. Starting in-memory MongoDB for development...');
    uri = await startInMemoryMongo();
  }

  // Try to connect; if Atlas URI fails, automatically fall back to in-memory
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 6000 });
    console.log(`MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);

    // Atlas or remote URI failed — fall back to in-memory for local dev
    const isRemote =
      uri.includes('mongodb+srv://') ||
      (uri.includes('@') && !uri.includes('127.0.0.1') && !uri.includes('localhost'));

    if (isRemote) {
      console.log('');
      console.log('  Remote MongoDB unavailable. Falling back to in-memory MongoDB...');
      const fallbackUri = await startInMemoryMongo();
      try {
        const conn = await mongoose.connect(fallbackUri);
        console.log(`MongoDB Connected (in-memory): ${conn.connection.host}/${conn.connection.name}`);
        console.log('');
        console.log('=============================================================');
        console.log('  WARNING: Running with in-memory (temporary) database.');
        console.log('  All data will be lost when the server restarts.');
        console.log('  Set a valid MONGODB_URI in backend/.env for persistence.');
        console.log('=============================================================');
        console.log('');
        return conn;
      } catch (fallbackErr) {
        console.error(`In-memory MongoDB also failed: ${fallbackErr.message}`);
        process.exit(1);
      }
    }

    process.exit(1);
  }
};

export const closeDB = async () => {
  try {
    await mongoose.connection.close();
    if (mongoMemoryServer) {
      await mongoMemoryServer.stop();
    }
  } catch (error) {
    console.error(`Error closing MongoDB: ${error.message}`);
  }
};
