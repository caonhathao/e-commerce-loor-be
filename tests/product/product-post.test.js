const request = require('supertest');
const path = require('path');
const fs = require('fs');
const app = require('../../src/app');
const { products: sampleData } = require('./sample.data');

(async () => {
    try {
        // Login lấy token
        const loginRes = await request(app)
            .post('/api/public/brand-login')
            .send({ email: 'fakeLove@fmail.com', password: '123456' });

        const accessToken = loginRes.body.access;

        if (!accessToken) {
            console.error('❌ Login failed: No access token received');
            return;
        }

        console.log('✅ Got access token:', accessToken);

        for (const product of sampleData) {
            try {
                const req = request(app)
                    .post('/api/vendor/create-products')
                    .set('Authorization', `Bearer ${accessToken}`)
                    .set('Content-Type', 'multipart/form-data');

                // Thêm các field text
                req.field('name', product.name);
                req.field('category_id', product.category_id);
                req.field('subCategory_id', product.subcategory_id);
                req.field('origin', 'Việt Nam');
                req.field('average_price', product.price.toString());
                req.field('description', `Mô tả cho sản phẩm ${product.name}`);
                req.field('stock', product.stock.toString());
                req.field('status', product.status);
                req.field('tags', product.tags); // nếu là chuỗi

                // Thêm ảnh (nếu có)
                if (Array.isArray(product.images)) {
                    for (const imagePath of product.images) {
                        const fullPath = path.join(__dirname, imagePath);
                        if (fs.existsSync(fullPath)) {
                            req.attach('images', fullPath);
                        } else {
                            console.warn(`⚠️ File không tồn tại: ${fullPath}`);
                        }
                    }
                }

                // Gửi request
                const res = await req;

                if ([200, 201].includes(res.statusCode)) {
                    console.log(`✅ Inserted: ${product.name} (status ${res.statusCode})`);
                } else {
                    console.error(`❌ Failed to insert ${product.name}: ${res.statusCode}`, res.body);
                }
            } catch (err) {
                console.error(`❌ Error inserting ${product.name}`, err);
            }
        }
    } catch (loginErr) {
        console.error('❌ Error during login:', loginErr);
    }
})();
