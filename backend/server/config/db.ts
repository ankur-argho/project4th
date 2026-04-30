import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongooseCache ?? { conn: null, promise: null };

if (process.env.NODE_ENV !== 'production') {
  global.mongooseCache = cached;
}

/**
 * Cached MongoDB connection for local dev and Vercel serverless (reuse across invocations).
 */
export async function connectMongo(): Promise<void> {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  if (cached.conn) {
    return;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongoURI, {
        serverSelectionTimeoutMS: 10_000,
        connectTimeoutMS: 10_000,
      })
      .then((m) => {
        cached.conn = m;
        console.log(`MongoDB Connected: ${m.connection.host}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        throw err;
      });
  }

  await cached.promise;
}

export default connectMongo;
