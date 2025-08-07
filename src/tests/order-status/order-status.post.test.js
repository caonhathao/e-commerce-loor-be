const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../../app');
const {orderStatus: sampleData} = require('./sample-order-status.data');

(async () => {
    try {
        // Login lấy token
        const loginRes = await request(app)
            .post('/api/public/user-login')
            .send({email: 'admin@gmail.com', password: '123456'});

        console.log('login:',loginRes.body);
        const accessToken = loginRes.body.access;

        if (!accessToken) {
            console.error('❌ Login failed: No access token received');
            return;
        }

        console.log('✅ Got access token:', accessToken);

        for (const orderStatus of sampleData) {
            console.log(orderStatus);
            try {
                const req = request(app)
                    .post('/api/user/create-order-status')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .set('Content-Type', 'multipart/form-data');

                // Thêm các field text
                req.field('status_name', orderStatus.status_name);
                req.field('status_code', orderStatus.status_code);
                req.field('status_mean', orderStatus.status_mean);
                req.field('status_color', orderStatus.status_color);
                req.field('authority', orderStatus.authority);
                req.field('priority_order', orderStatus.priority_order);

                // Gửi request
                const res = await req;

                if ([200, 201].includes(res.statusCode)) {
                    console.log(`✅ Inserted: ${orderStatus.status_name} (status ${res.statusCode})`);
                } else {
                    console.error(`❌ Failed to insert ${orderStatus.status_name}: ${res.statusCode}`, res.body);
                }
            } catch (err) {
                console.error(`❌ Error inserting ${orderStatus.status_name}`, err);
            }
        }
    } catch (loginErr) {
        console.error('❌ Error during login:', loginErr);
    }
})();
