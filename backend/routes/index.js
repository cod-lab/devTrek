const express = require('express');

const articlesRoute = require('./articles');

const { readController } = require('../controllers/articles');

const router = express.Router();

router.get(/^\/(home)*$/, (_, res, next) => readController(res,next,null,'index'));

router.use('/articles',articlesRoute);

router.get('/powered-by', (_, res) => res.render('powered-by'));

router.all('*', (req, res) => {
    res.status(404).send('<br><h2><center>404!<br>Page not found...</center></h2>');
    console.log(`404..\nRequested url: [${req.method}] ${req.headers.host + req.originalUrl} doesn't exist!`);
    // const err = new Error('Invalid URL');
    // err.statusCode = 404;
    // next(err); //,statusCode=404);
    // console.log('\nnext',next);
});

router.use((err, req, res, next) => {  // express err handler, global err format for printing user defined errs
    const { statusCode=500, message, stack } = err;
    const error = { statusCode, message, stack };
    res.status(statusCode).json(error);
    console.error('error:',error);
    // console.log('s',s);
    // res.send('abcd');
});

module.exports = router;
