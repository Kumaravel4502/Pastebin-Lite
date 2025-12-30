import mongoose from 'mongoose';

const connectDB = async () => {
    const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!MONGODB_URI) {
        console.error('❌ MONGODB_URI or MONGO_URI environment variable is required');
        console.error('   Please create a .env file with: MONGODB_URI=mongodb://localhost:27017/pastebin-lite');
        process.exit(1);
    }

    // Configure Mongoose to not buffer operations
    mongoose.set('bufferCommands', false);

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Drop old pasteId index if it exists (from previous schema)
        try {
            const Paste = (await import('../models/Paste.js')).default;
            const indexes = await Paste.collection.indexes();
            const pasteIdIndex = indexes.find(idx => idx.key && idx.key.pasteId);
            if (pasteIdIndex) {
                await Paste.collection.dropIndex('pasteId_1');
                console.log('✅ Dropped old pasteId index');
            }
        } catch (err) {
            // Index might not exist or already dropped, that's fine
            console.log('ℹ️  No old indexes to clean up');
        }
    } catch (err) {
        console.error('❌ MongoDB connection error:', err.message);
        console.error('   Make sure MongoDB is running and the connection string is correct');
        process.exit(1);
    }
};

export default connectDB;

