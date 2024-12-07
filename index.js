const _express = require('express');

const app = _express();
const db = require('./models');

//middleware
app.use(_express.json());

//Routes
const postRoute = require('./routers/userRouters');
app.use(postRoute);

db.sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
    })
    .catch((error) => {
        console.error('Unable to connect to the database:', error);
    });


db.sequelize.sync().then(() => {
    app.listen(8080, () => {
        console.log("Server running on port 8080");
    })
})
