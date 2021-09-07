const express = require('express');
// const favicon = require('serve-favicon');
const path = require('path');
// const methodOverride = require('method-override');
// require('dotenv').config();

const articleRoute = require('./backend/routes/articles');
// const { readController } = require('./backend/controllers/articles');

const app = express();
// export const app = express();

// app.use(favicon(path.join(__dirname, 'backend', 'favicon.ico')));
// app.use(express.static(path.join(__dirname, 'frontend/assets')));
app.use(express.static('frontend/assets'));    // for creating link for external style and script files to link in ejs files
// app.set('views', path.join(__dirname, 'frontend/views'));
app.set('views', 'frontend/views');
app.set('view engine','ejs');
// app.engine('html', require('ejs').renderFile);
// app.set('view engine', 'html');
// console.log(app,app.settings.views,'\n',__dirname);
// app.settings.views = __dirname + "\\frontend\\views";
// console.log(app.settings.views,app,app.set);
// app.use(express.urlencoded({ extended: "false" }));     // parse data sent thru html form
// app.use(express.json({ limit: "1mb" }));        // parse json data coming from frontend
// app.use(methodOverride('_method'));

// app.get(/^\/(home)*$/, (_, res) => readController(res,null,'index'));

// module.exports = app;
app.use('/',articleRoute);

// app.use(express.static('frontend/assets'));    // for creating link for external style and script files to link in ejs files

// app.all('*', (_,res) => res.send('<br><h2><center>404!<br>Page not found...</center></h2>'));

const { HOST:host='localhost', PORT:port=5000 } = process.env;
app.listen(port, () => console.log(`Connection is established at \nhttp://${host}:${port} OR \nhttps://devtrek.herokuapp.com\n`));

// exports.module = app;
// module.exports = app;
// console.log(app);

