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

router.get('/new', (_, res) => newController(res));

router.post('/:id', ({ body }, res) => preserveLikeBtnsStateController(res,body));

router.get('/:id', ({ params: { id } }, res, next) => readController(res,next,id,'show'));

router.post('/', (req, res, next) => writeController(req,res,next,'post'));

router.get('/edit/:id', ({ params: { id } }, res, next) => readController(res,next,id,'edit'));

router.put('/:id', (req, res, next) => writeController(req,res,next,'update'));

router.delete('/:id', ({ params: { id } }, res, next) => deleteController(res,next,id));

router.patch('/like/:id', (req, res, next) => likeController(req, res, next));

module.exports = router;

