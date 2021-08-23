const express = require('express');

const { readController, writeController, deleteController, likeController } = require('../controllers/articles');

const router = express.Router();

router.get('/new', (req,res) => {
    res.render('articles/new', { article: {} });        // calling view pg
});

router.get('/:id', (req,res) => readController(res,req.params.id,'show'));

router.post('/', (req,res) => writeController(req,res,'createdAt','new'));

router.get('/edit/:id', (req,res) => readController(res,req.params.id,'edit'));

router.put('/:id', (req,res) => writeController(req,res,'updatedAt','edit'));

router.delete('/:id', deleteController);

router.put('/like/:id', likeController);

module.exports = router;

