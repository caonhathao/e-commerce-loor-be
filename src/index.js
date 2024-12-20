const _express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = _express();
const db = require('./models');

const dotenv= require('dotenv');
const dotenvExpand=require('dotenv-expand');

//middleware
app.use(_express.json());
app.use(cors());

//Routes
const routersPath = path.join(__dirname, 'routers');

fs.readdirSync(routersPath).forEach((file) => {

    if (file.endsWith('.js')) {

        const router = require(path.join(routersPath, file));

        app.use(router);

    }

});


db.sequelize.sync().then(() => {

    const port = parseInt(process.env.SERVER_PORT);

    app.listen(port, () => {

        console.log("Server running on port: ", port);

    })

})