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
const router = express.Router();
// let router1, router2;
// router1 = router2 = express.Router();

// router1.get(/^\/(home)*$/, (_, res) => readController(res,null,'index'));

// app.get('/powered-by', (_, res) => res.render('powered-by'));    // wont work for like btns
// router.get('/powered-by', (_, res) => poweredbyController(res));     // no need for like btns

// router.route('/articles')
// router1.use('/articles', router2);
// router.patch('/like/:id', likeController);

// router.route('/articles')
// router.get('/new', (_, res) => newController(res));

// router.post('/:id', ({ body }, res) => preserveLikeBtnsStateController(res,body));

// router.get('/:id', ({ params: { id } }, res, next) => readController(res,next,id,'show'));

// router.post('/', (req, res, next) => writeController(req,res,next,'createdAt','new'));
// router.post('/', (req, res, next) => writeController(req,res,next,'new'));
// router.post('/', (req, res, next) => writeController(req,res,next,'post'));

// router.get('/edit/:id', ({ params: { id } }, res, next) => readController(res,next,id,'edit'));

// router.put('/:id', (req, res, next) => writeController(req,res,next,'updatedAt','edit'));
// router.put('/:id', (req, res, next) => writeController(req,res,next,'edit'));
// router.put('/:id', (req, res, next) => writeController(req,res,next,'update'));

// router.delete('/:id', (req, res) => deleteController(res,req.params.id));
// router.delete('/:id', ({ params: { id } }, res, next) => deleteController(res,next,id));
// console.log('routes');
// router.patch('/like/:id', likeController);
// router.patch('/like/:id([a-z0-9]{24})', () => console.log('like'),likeController);
// router.patch('/like/:id', (q,s,next) => {console.log('like'); next();},likeController);
router.patch('/like/:id', (req, res, next) => likeController(req, res, next));
// console.log('routes');

// router.get('/powered-by', (_, res) => res.render('articles/powered-by'));    // not working
// router1.get('/powered-by', (_, res) => res.render('powered-by'));    // not working

// router1.all('*', (_,res) => res.send('<br><h2><center>404!<br>Page not found...</center></h2>'));

// router1.use((err, req, res, next) => {  // express err handler, global err format for printing user defined errs
//     const { statusCode=500, message, stack } = err;
//     const error = { statusCode, message, stack };
//     // console.log('1',errFormat);
//     console.error({ error });
// });

module.exports = router;

