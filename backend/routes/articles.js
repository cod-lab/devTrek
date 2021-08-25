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

router.post('/:id', (req, res) => preserveLikeBtnsStateController(res,req.body));

router.get('/:id', (req, res) => readController(res,req.params.id,'show'));

router.post('/', (req, res) => writeController(req,res,'createdAt','new'));

router.get('/edit/:id', (req, res) => readController(res,req.params.id,'edit'));

router.put('/:id', (req, res) => writeController(req,res,'updatedAt','edit'));

router.delete('/:id', (req, res) => deleteController(res,req.params.id));

router.patch('/like/:id', likeController);

module.exports = router;

