import mongoose from 'mongoose';
interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}
declare global {
    var mongooseCache: MongooseCache | undefined;
}
/**
 * Cached MongoDB connection for local dev and Vercel serverless (reuse across invocations).
 */
export declare function connectMongo(): Promise<void>;
export default connectMongo;
//# sourceMappingURL=db.d.ts.map