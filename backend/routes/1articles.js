const express = require('express');

const {
    // poweredbyController,
    newController,
    readController,
    preserveLikeBtnsStateController,
    writeController,
    deleteController,
    likeController
} = require('../controllers/articles');

// const app = express();
// const { app } = require('../../server');
let router1, router2;
router1 = router2 = express.Router();

app.get(/^\/(home)*$/, (_, res) => readController(res,null,'index'));

// app.get('/powered-by', (_, res) => res.render('powered-by'));    // wont work for like btns
// router.get('/powered-by', (_, res) => poweredbyController(res));     // no need for like btns

// router.route('/articles')
app.use('/articles', router);

// router.route('/articles')
router.get('/new', (_, res) => newController(res));

router.post('/:id', (req, res) => preserveLikeBtnsStateController(res,req.body));

router.get('/:id', (req, res) => readController(res,req.params.id,'show'));

router.post('/', (req, res) => writeController(req,res,'createdAt','new'));

router.get('/edit/:id', (req, res) => readController(res,req.params.id,'edit'));

router.put('/:id', (req, res) => writeController(req,res,'updatedAt','edit'));

// router.delete('/:id', (req, res) => deleteController(res,req.params.id));
router.delete('/:id', ({ params: { id } }, res) => deleteController(res,id));

router.patch('/like/:id', likeController);

// router.get('/powered-by', (_, res) => res.render('articles/powered-by'));    // not working
app.get('/powered-by', (_, res) => res.render('powered-by'));    // not working

app.all('*', (_,res) => res.send('<br><h2><center>404!<br>Page not found...</center></h2>'));

app.use((err, req, res, next) => {  // express err handler, global err format for printing user defined errs
    const { statusCode=500, message, stack } = err;
    const error = { statusCode, message, stack };
    // console.log('1',errFormat);
    console.error({ error });
});

module.exports = app;

