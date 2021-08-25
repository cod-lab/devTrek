const fs = require('fs').promises;
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const slugify = require('slugify');

const dompurify = createDomPurify(new JSDOM().window);

let activeLikeBtns, srcPg;

exports.preserveLikeBtnsStateController = (res, body) => {
    [activeLikeBtns, srcPg] = [body.data,body.pg];
    res.sendStatus(200);
};

exports.newController = res => res.render('articles/new', { article: {}, activeLikeBtns });

exports.readController = async (res, id, pg) => {
    try {
        const response = await fs.readFile('backend/db.json','utf8') || '[]';        // read from file
        const articles = await JSON.parse(response);

        if(pg === 'index') {        // [GET], index pg
            articles.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));    // sort objects inside array in descending order of created date
            res.render('articles/index', { articles, activeLikeBtns, srcPg });        // calling frontend pg

            [activeLikeBtns, srcPg] = [null,null];
        } else {        // [GET], other pgs - show, edit
            const article = articles.find(article => article.id === id);
            if(!article) return res.sendStatus(500);
            res.render(`articles/${pg}`, { article, activeLikeBtns });        // calling frontend pg
        }
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
};

exports.writeController = async (req, res, event, pg) => {
    const { body:article, params:{ id }={} } = req;

    article.name = article.name || 'Anonymous';
    article.modifiedDesc = article.originalDesc      // for display
        .replace(/(\r\n){2,}/g,'<br><br>')
        .replace(/\r\n/g,'<br>')
        .replace(/\s{2,}/g,'')
        .replace(/(<br>|\s)+$/,'');    // remove n <br>s from end
    article.originalDesc = article.modifiedDesc.replace(/<br>/g,'\n');      // for edit
    article.markdown = article.markdown
        .replace(/\r\n/g,'<>')
        .replace(/\s{2,}/g,'')
        .replace(/<>/g,'\n')
        .replace(/(\n|\s)+$/,'');
    article[event] = new Date();

    try {
        article.slug = slugify(article.title, { lower: true, strict: true });   // generate string from article title to use as url
        article.sanitizedHtml = dompurify.sanitize(marked(article.markdown));   // convert markdown to html and purify the html

        const response = await fs.readFile('backend/db.json','utf8') || '[]';        // read from file
        const articles = await JSON.parse(response);

        if(!id) {        // [POST], new article
            article.id = Math.trunc((Math.random() * 8735012) * (Math.random() * 1029456)) + '';
            const displayDate = article.createdAt.toLocaleDateString();
            const chkDate = /^\d\//;        // check string starts with '[1-9]/' i.e. date 1 - 9 only
            article.displayDate = chkDate.test(displayDate) ? '0'+displayDate : displayDate;
            article.likes = 0;
            articles.push(article);
        } else {        // [PUT], update article
            article.id = id;
            const i = articles.findIndex(article => article.id === id);
            if(i === -1) return res.status(404).send('Unable to update article!');
            article.createdAt = articles[i].createdAt;
            article.displayDate = articles[i].displayDate;
            article.likes = articles[i].likes;
            articles.splice(i,1,article);       // replace old article with updated article
        }

        await fs.writeFile('backend/db.json',JSON.stringify(articles));        // write to file
        res.redirect(`/articles/${article.id}`);        // api calling
    } catch (err) {
        console.log('err ->',err);
        res.render(`articles/${pg}`, { article });        // calling frontend pg
    }
};

exports.deleteController = async (res, id) => {
    try {
        const response = await fs.readFile('backend/db.json','utf8') || '[]';        // read from file
        const articles = await JSON.parse(response);

        const i = articles.findIndex(article => article.id === id);
        if(i === -1) return res.status(404).send('Unable to delete article!');
        if(i < 5) return res.status(405).send("Can't delete first 5 articles currently!\nTry again later...");
        articles.splice(i,1);    // delete requested article

        await fs.writeFile('backend/db.json',JSON.stringify(articles));        // write to file
        res.redirect('/');        // api calling
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
};

exports.likeController = async (req, res) => {
    const { body:{ data:likeBtnState }, params:{ id } } = req;
    try {
        const response = await fs.readFile('backend/db.json','utf8') || [];        // read from file
        const articles = await JSON.parse(response);

        const i = articles.findIndex(article => article.id === id);
        if(i === -1) return res.sendStatus(500);
        res.status(200).json({ likes: likeBtnState ? ++articles[i].likes : --articles[i].likes });

        await fs.writeFile('backend/db.json', JSON.stringify(articles));        // write to file
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
};

