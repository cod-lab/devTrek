const express = require('express');
// const articleModel = require('../models/article');
// const localStorage = require('../localStorage');
const fs = require('fs').promises;
// const db = require('../db.json');
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const slugify = require('slugify');

const router = express.Router();

const dompurify = createDomPurify(new JSDOM().window);

router.get('/new', (req,res) => {
    res.render('articles/new', { article: {} });        // calling view pg
});

async function read(res, id, pg) {
    try {
        const response = await fs.readFile('db.json','utf8') || '[]';
        const article = JSON.parse(response)[id-1];
        if(!article) return res.redirect('/');
        res.render(`articles/${pg}`, { article });        // calling view pg
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
}

router.get('/:id', (req,res) => {
    read(res,req.params.id,'show');

    /*try {
        const response = await fs.readFile('db.json','utf8') || '[]';
        const article = JSON.parse(response)[req.params.id-1]; // || 'nothing found';
        if(!article) return res.redirect('/');
        res.render('articles/show', { article });        // calling view pg
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }*/
});

async function write(req, res, event, pg) {
    const { body:article, params:{ id }={} } = req;
    article.description = article.description.replace(/\s{2,20}/g, '');
    article.markdown = article.markdown.replace(/\s{2,20}/g, '');
    article[event] = new Date().toLocaleDateString();
    try {
        article.slug = slugify(article.title, { lower: true, strict: true });     // generate string to used as url
        article.sanitizedHtml = dompurify.sanitize(marked(article.markdown));   // convert markdown to html and purify the html

        const response = await fs.readFile('db.json','utf8') || '[]';        // read from file
        const articles = JSON.parse(response);

        if(!id) {        // [POST], new article
            article.id = articles.length + 1;
            articles.push(article);
        } else {        // [PUT], update article
            article.id = id;
            article.createdAt = articles[id-1].createdAt;
            articles.splice(id-1,1,article);
        }

        await fs.writeFile('db.json',JSON.stringify(articles));        // write to file

        res.redirect(`/articles/${article.id}`);        // api calling
    } catch (err) {
        console.log('err ->',err);
        res.render(`articles/${pg}`, { article });        // calling view pg
    }
}

router.post('/', (req,res) => {
    write(req,res,'createdAt','new');

    /*const { body:newArticle } = req;
    newArticle.description = newArticle.description.replace(/\s{2,20}/g, '');
    newArticle.markdown = newArticle.markdown.replace(/\s{2,20}/g, '');
    newArticle.createdAt = new Date().toLocaleDateString();
    try {
        newArticle.slug = slugify(newArticle.title, { lower: true, strict: true });     // generate string to used as url
        newArticle.sanitizedHtml = dompurify.sanitize(marked(newArticle.markdown));   // convert markdown to html and purify the html

        const data = await fs.readFile('db.json','utf8') || '[]';        // read from file
        const articles = JSON.parse(data);
        const new_id = articles.length + 1;
        newArticle.id = new_id;

        articles.push(newArticle);

        await fs.writeFile('db.json',JSON.stringify(articles));        // write to file
        res.redirect(`/articles/${new_id}`);        // api calling
    } catch (err) {
        console.log('err ->',err);
        res.render('articles/new', { article: newArticle });        // calling view pg
    }*/
});

router.get('/edit/:id', (req,res) => {
    read(res,req.params.id,'edit');

    /*try {
        const response = await fs.readFile('db.json','utf8') || '[]';
        const article = JSON.parse(response)[req.params.id-1];
        res.render('articles/edit', { article });
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }*/
});

router.put('/:id', (req,res) => {
    write(req,res,'updatedAt','edit');

    /*let { body:update, body:{ markdown:md }, params:{ id } } = req;
    update.description = update.description.replace(/\s{2,20}/g, '');
    update.markdown = update.markdown.replace(/\s{2,20}/g, '');
    update.updatedAt = new Date().toLocaleDateString();
    update.id = id;
    try {
        update.slug = slugify(update.title, { lower: true, strict: true });     // generate string to used as url
        // if(md) {
            update.sanitizedHtml = dompurify.sanitize(marked(update.markdown));   // convert markdown to html and purify the html
        // }

        const response = await fs.readFile('db.json','utf8') || '[]';        // read from file
        const articles = JSON.parse(response);
        update.createdAt = articles[id-1].createdAt;

        articles.splice(id-1,1,update);

        await fs.writeFile('db.json',JSON.stringify(articles));        // write to file
        res.redirect(`/articles/${id}`);        // api calling
    } catch (err) {
        console.log('err ->',err);
        res.render('articles/edit', { article: update });        // calling view pg
    }*/
});

router.delete('/:id', async (req,res) => {
    try {
        const response = await fs.readFile('db.json','utf8') || '[]';        // read from file
        const articles = JSON.parse(response);
        articles.splice(req.params.id-1,1);    // delete requested article
        await fs.writeFile('db.json',JSON.stringify(articles));        // write to file
        res.redirect('/');
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
});

module.exports = router;

