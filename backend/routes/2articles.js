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
// const router = express.Router();
let router1, router2;
router1 = router2 = express.Router();

router1.get(/^\/(home)*$/, (_, res) => readController(res,null,'index'));

// app.get('/powered-by', (_, res) => res.render('powered-by'));    // wont work for like btns
// router.get('/powered-by', (_, res) => poweredbyController(res));     // no need for like btns

// router.route('/articles')
router1.use('/articles', router2);

// router.route('/articles')
router2.get('/new', (_, res) => newController(res));

router2.post('/:id[0-9]', (req, res) => preserveLikeBtnsStateController(res,req.body));

router2.get('/:id[0-9]', (req, res) => readController(res,req.params.id,'show'));

router2.post('/', (req, res) => writeController(req,res,'createdAt','new'));

router2.get('/edit/:id[0-9]', (req, res) => readController(res,req.params.id,'edit'));

router2.put('/:id[0-9]', (req, res) => writeController(req,res,'updatedAt','edit'));

// router.delete('/:id', (req, res) => deleteController(res,req.params.id));
router2.delete('/:id[0-9]', ({ params: { id } }, res) => deleteController(res,id));

router2.patch('/like/:id[0-9]', likeController);

// router.get('/powered-by', (_, res) => res.render('articles/powered-by'));    // not working
router1.get('/powered-by', (_, res) => res.render('powered-by'));    // not working

router1.all('*', (_,res) => res.send('<br><h2><center>404!<br>Page not found...</center></h2>'));

router1.use((err, req, res, next) => {  // express err handler, global err format for printing user defined errs
    const { statusCode=500, message, stack } = err;
    const error = { statusCode, message, stack };
    // console.log('1',errFormat);
    console.error({ error });
});

module.exports = router1;

