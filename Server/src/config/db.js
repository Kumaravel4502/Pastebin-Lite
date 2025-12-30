// Simple initialization - no database connection needed
const initDB = async () => {
    console.log('✅ Storage initialized (in-memory)');
    return Promise.resolve();
};

export default initDB;
