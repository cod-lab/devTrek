const express = require('express');

const {
    newController,
    readController,
    preserveLikeBtnsStateController,
    writeController,
    deleteController,
    likeController
} = require('../controllers/articles');

const router = express.Router();

// router.get('/new', (_,res) => {
//     res.render('articles/new', { article: {} });        // calling view pg
// });
router.get('/new', (_, res) => newController(res));

// let likeBtnState;
// router.post('/:id', req => likeBtnState = req.body.likeBtnState);
// router.post('/:id', req => preserveLikeBtnStateController(req.body.likeBtnState,req.params.id));
// router.post('/:id', (req,res) => preserveLikeBtnStateController(res,req.body,req.params.id));
router.post('/:id', (req, res) => preserveLikeBtnsStateController(res,req.body));

// router.get('/:id', (req,res) => readController(res,req.params.id,'show',likeBtnState));
router.get('/:id', (req, res) => readController(res,req.params.id,'show'));

router.post('/', (req, res) => writeController(req,res,'createdAt','new'));

router.get('/edit/:id', (req, res) => readController(res,req.params.id,'edit'));

router.put('/:id', (req, res) => writeController(req,res,'updatedAt','edit'));

router.delete('/:id', deleteController);

router.patch('/like/:id', likeController);

module.exports = router;

