const request = require('supertest');
const app = require('../src/app');

const CONCURRENT_REQUESTS = 500;

const runConcurrentTest = async () => {
    const requests = [];

    for (let i = 0; i < CONCURRENT_REQUESTS; i++) {
        requests.push(
            request(app)
                .get('/api/public/get-all-products')
        );
    }

    const results = await Promise.all(requests);

    results.forEach((res, index) => {
        console.log(`#${index + 1} ➜ ${res.statusCode} - ${res.body?.message ?? 'No message'}`);
    });
};

runConcurrentTest();
