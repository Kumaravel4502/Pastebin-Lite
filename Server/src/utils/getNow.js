export const getNow = (req) => {
    if (process.env.TEST_MODE === '1') {
        const testNow = req.headers['x-test-now-ms'];
        if (testNow) {
            return new Date(parseInt(testNow, 10));
        }
    }
    return new Date();
};

