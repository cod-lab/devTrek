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

router.post('/', async (req,res) => {
    // try {
        // const response = await articleModel.create(req.body);
        // if(!response) return res.send('article not saved');
        // console.log('localStorage',document.localStorage);
        // document.localStorage.setItem(JSON.stringify(req.body));
        // res.redirect(`/articles/${response._id}`);

        // console.log('newArticle',newArticle,'\nid',id,'\narticles',articles);
        // var articles;
        // var id =0;

        // let articles, new_id;
        // function readDb() {
            /*let x;
            console.log('1 read ->');
            await fs.readFile('db','utf8', (err,data) => {
                if(err) throw err;
                // console.log('data',typeof JSON.parse(data),JSON.parse(data));
                // console.log('data',typeof data, data);
                req.articles = JSON.parse(data);
                console.log('1 articles',typeof req.articles,req.articles);
                // new_id = articles[articles.length - 1].id + 1;
                req.new_id = req.articles.length + 1;
                console.log('1 new_id',typeof req.new_id,req.new_id);
                // console.log(id);
                a(data);
                // x = data;
            });
            console.log('2 read ->');
            // (() => {a=b;})();
            function a(data) {
                req.articles = JSON.parse(data);
                console.log('2 articles',typeof req.articles,req.articles);
                req.new_id = req.articles.length + 1;
                console.log('2 new_id',typeof req.new_id,req.new_id);
            }*/
            // console.log('2 articles',typeof articles,articles);
        // }
        // next();
    // }, (req,res) => {
        // function writeDb() {
            /*console.log('write ->');
            req.body.id = req.new_id;
            var newArticle = req.body;
            console.log('newArticle',newArticle,'\nid',req.new_id,'\narticles',req.articles);*/
            /*articles.push(newArticle);
            fs.writeFile("db",articles,(err,data) => {
                if(err) return res.render('articles/new', { article: data });
                // else console.log(data);
                res.redirect(`/articles/${id}`);
            });*/
        // }

        // readDb();
        // console.log(id,typeof id);
        // writeDb();
    // } catch (error) {
        // console.log('article',article);
        // res.render('articles/new', { article: response });
    // }

    // req.body.description = req.body.description.replace(/\s{2,20}/g, '');
    // req.body.markdown = req.body.markdown.replace(/\s{2,20}/g, '');

    const { body:newArticle } = req;
    newArticle.description = newArticle.description.replace(/\s{2,20}/g, '');
    newArticle.markdown = newArticle.markdown.replace(/\s{2,20}/g, '');
    newArticle.createdAt = new Date().toLocaleDateString();
    // console.log('newArticle',newArticle);
    try {
        newArticle.slug = slugify(newArticle.title, { lower: true, strict: true });     // generate string to used as url
        newArticle.sanitizedHtml = dompurify.sanitize(marked(newArticle.markdown));   // convert markdown to html and purify the html

        const data = await fs.readFile('db.json','utf8') || '[]';        // read from file
        // console.log('data',data,typeof data,data === undefined, data === null, data === '');
        const articles = JSON.parse(data);
        const new_id = articles.length + 1;
        // console.log(req.articles, typeof req.articles, req.new_id, typeof req.new_id);
        // req.body.id = new_id;
        // console.log(req.body);

        newArticle.id = new_id;
        articles.push(newArticle);
        // articles = JSON.stringify(articles).replace('[{','[\n{').replace('{"','{\n"').replace(',"',',\n"').replace('},','\n},').replace(',{',',\n{');
        /*articles = JSON.stringify(articles)
            .replace(/\[\{/g,/\[\n\{/)
            .replace(/\{\"/g,/\{\n\"/)
            .replace(/\,\"/g,/\,\n\"/)
            .replace(/\}\,/g,/\n\}\,/)
            .replace(/\,\{/g,/\,\n\{/);*/
        // console.log('articles',articles);

        await fs.writeFile('db.json',JSON.stringify(articles));        // write to file
        // fs.writeFile('db',articles);
        // if(!response) return res.render('articles/new', { article: response });
        res.redirect(`/articles/${new_id}`);        // api calling
    } catch (err) {
        console.log('err ->',err);
        res.render('articles/new', { article: newArticle });        // calling view pg
        // if(err) {}
    }
    // res.redirect(`/articles/${req.body.id}`);
    // res.sendStatus(200);
});

router.get('/:id', async (req,res) => {
    /*try {
        const response = await articleModel.findById(req.params.id);
        if(!response) return res.send('unable to get article');
    } catch (error) {
        // res.json({ article: response });
        res.send(req.params.id);
    }*/
    /*await fs.readFile('db','utf8',(err,data) => {
        if(err) throw err;
        console.log('articles/:id\n',data);
    });*/

    try {
        const response = await fs.readFile('db.json','utf8') || '[]';
        const article = JSON.parse(response)[req.params.id-1]; // || 'nothing found';
        // console.log('article',article); //new Date(article.createdAt));
        if(!article) return res.redirect('/');
        // res.json({ article });
        res.render('articles/show', { article });        // calling view pg
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
    // res.json({ articles });
});

router.get('/edit/:id', async (req,res) => {
    try {
        const response = await fs.readFile('db.json','utf8') || '[]';
        const article = JSON.parse(response)[req.params.id-1];
        res.render('articles/edit', { article });
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
});

router.put('/:id', async (req,res) => {
    let { body:update, body:{ markdown:md }, params:{ id } } = req;
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
    }
});

router.delete('/:id', async (req,res) => {
    try {
        const response = await fs.readFile('db.json','utf8') || '[]';        // read from file
        // const articles = JSON.parse(response).splice(req.params.id-1,1);     // returns deleted ele
        const articles = JSON.parse(response);
        articles.splice(req.params.id-1,1);    // delete requested article
        // console.log('response',JSON.parse(response),'articles',articles,'id:',req.params.id);
        await fs.writeFile('db.json',JSON.stringify(articles));        // write to file
        res.redirect('/');
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
});

module.exports = router;

