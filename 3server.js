const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const favicon = require('serve-favicon');
const path = require('path');
const methodOverride = require('method-override');

const articleRoute = require('./backend/routes/articles');
// const { readController } = require('./backend/controllers/articles');

const app = express();

// frontend
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'frontend/views'));   // set default views directory
// app.use(express.static('frontend/assets'));    // for creating link for external style and script files to link in ejs files
// app.use(methodOverride('_method'));     // for calling request methods other than get and post thru form

// app.use(express.json({ limit: "1mb" }));        // parse json data coming from frontend
app.use(express.urlencoded({ extended: "false" }));     // parse data sent thru html form

app.use(favicon(path.join(__dirname, 'backend', 'favicon.ico')));   // serve req: '/favicon.ico' & set favicon for all pgs

app.use(express.static('frontend/assets'));    // for creating link for external style and script files to link in ejs files
app.use(methodOverride('_method'));     // for calling request methods other than get and post thru form

// app.get(/^\/(home)*$/, (_, res) => readController(res,null,'index'));

// app.use('/articles',articleRoute);
app.use('/',articleRoute);

// app.all('*', (_,res) => res.send('<br><h2><center>404!<br>Page not found...</center></h2>'));

// app.use((err, req, res, next) => {  // express err handler, global err format for printing user defined errs
//     const errFormat = {
//         statusCode: err.statusCode || 500,
//         message: err.message,
//         stack: err.stack
//     };
// });

// const { HOST:host='localhost', PORT:port=5000 } = process.env;
const { HOST:host, PORT:port=5000, DB_CON:dbUrl } = process.env;

// app.listen(port, () => console.log(`Connection is established at \nhttp://${host}:${port} OR \nhttps://devtrek.herokuapp.com\n`));
// console.log(host,port,dbUrl);
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

// mongoose.set('useFindAndModify',false);

