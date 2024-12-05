const _express = require('express');

const app = _express();
const db = require('./models');

db.sequelize.sync().then(() => {
    app.listen(8080, () => {
        console.log("Server running on port 8080");
    })
})
