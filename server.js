const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const favicon = require('serve-favicon');
const methodOverride = require('method-override');

const routes = require('./backend/routes');

const app = express();

app.use(express.json({ limit: "1mb" }));        // parse json data coming from frontend
app.use(express.urlencoded({ extended: "false" }));     // parse data sent thru html form

app.use(favicon('backend/favicon.ico'));   // serve req: '/favicon.ico' & set favicon for all pgs

// frontend
app.set('view engine','ejs');
app.set('views','frontend/views');   // set default views directory
app.use(express.static('frontend/assets'));    // for creating link for external style and script files to link in ejs files
app.use(methodOverride('_method'));     // for calling request methods other than get and post thru form

app.use('/',routes);

const { HOST:host='localhost', PORT:port=5000, DB_CON:dbUrl } = process.env;

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

mongoose.set('useFindAndModify',false);

