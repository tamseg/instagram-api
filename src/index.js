const express = require('express');
const mongoose = require('mongoose');
const routes = require('./config/routes');
const app = express();
const cors = require('cors');
const port = process.env.POT || 4000;
const env = require('./config/env/index');

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(routes);

mongoose.connect(env.mongoUrl)
    .then(listen)
    .catch(err => console.error(err));

    function listen() {
        app.listen(port, () => {
            console.log(`App listening at http://localhost:${port}`)
        });
    }