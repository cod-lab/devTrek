const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
// const favicon = require('serve-favicon');
const path = require('path');
// const methodOverride = require('method-override');

const articleRoute = require('./backend/routes/articles');

const app = express();

// app.use(favicon(path.join(__dirname, 'backend', 'favicon.ico')));
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'frontend/views'));
// app.set('views', 'frontend/views');
app.use(express.static('frontend/assets'));    // for creating link for external style and script files to link in ejs files

// app.use(express.urlencoded({ extended: "false" }));     // parse data sent thru html form
// app.use(express.json({ limit: "1mb" }));        // parse json data coming from frontend
// app.use(methodOverride('_method'));

app.use('/',articleRoute);

// app.use(express.static('frontend/assets'));    // for creating link for external style and script files to link in ejs files

const { HOST:host, PORT:port=5000, DB_CON:dbUrl } = process.env;

mongoose.connect(
    dbUrl,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }
).then(() => {
    app.listen(port);
    console.log(`Connection is established at \nhttp://${host}:${port} OR \nhttps://devtrek.herokuapp.com\n`);
}).catch(err => console.error(err.message));


