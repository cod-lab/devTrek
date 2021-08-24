const fs = require('fs').promises;
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const slugify = require('slugify');

const dompurify = createDomPurify(new JSDOM().window);

// let likeBtnState;
// exports.showController = (x) => {
    // console.log('showController',req.body);
    // const { params: { id }, body: { likeBtnState } } = req;
    // const { params: { id } } = req;
    // likeBtnState = x;
    // console.log(id);
    /*try {
        const response = await fs.readFile('db.json','utf8') || '[]';
        const article = await JSON.parse(response)[id-1];
        // console.log(article);
        if(!article) return res.redirect('/');
        res.render('articles/show', { likeBtnState }); // , (err, html) => {
        //     if(err) console.log(err);
        // });        // calling show pg
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }*/
// };

let likeBtnState, aid, srcPg;
// exports.preserveLikeBtnStateController = (x,y) => [likeBtnState, aid] = [x,y];
exports.preserveLikeBtnStateController = (body, id) => [likeBtnState, aid, srcPg] = [body.likeBtnState,id,body.pg];

exports.readController = async (res, id, pg) => {
    console.log('srcPg',srcPg,'-> id',id,'aid',aid,'\npg',pg);
    try {
        const response = await fs.readFile('db.json','utf8') || '[]';
        // if (response) {
            const articles = await JSON.parse(response);
            if(pg === 'index') {        // [GET], index pg
                articles.sort((a,b) => b.id - a.id);    // sort objects inside array in descending order of articles[i].id
                res.render('articles/index', { articles, likeBtnState, aid, srcPg });        // calling view pg
                [likeBtnState, aid, srcPg] = [null,null,null];
            } else {        // [GET], other pgs - show, edit, new
                // const article = articles[id-1];
                if(!articles[id-1]) return res.redirect('/');
                res.render(`articles/${pg}`, { article: articles[id-1], likeBtnState });        // calling view pg
                // res.render(`articles/${pg}`);        // calling view pg
            }
        // }
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
};

exports.writeController = async (req, res, event, pg) => {
    const { body:article, params:{ id }={} } = req;

    article.name = article.name || 'Anonymous';
    article.description = article.description.replace(/\s{2,20}/g, '');
    article.markdown = article.markdown.replace(/\s{2,20}/g, '');
    article[event] = new Date().toLocaleDateString();

    try {
        article.slug = slugify(article.title, { lower: true, strict: true });     // generate string to use as url
        article.sanitizedHtml = dompurify.sanitize(marked(article.markdown));   // convert markdown to html and purify the html

        const response = await fs.readFile('db.json','utf8') || '[]';        // read from file
        const articles = await JSON.parse(response);

        if(!id) {        // [POST], new article
            article.id = articles.length + 1;
            article.likes = 0;
            articles.push(article);
        } else {        // [PUT], update article
            article.id = id;
            article.createdAt = articles[id-1].createdAt;
            article.likes = articles[id-1].likes;
            articles.splice(id-1,1,article);
        }

        await fs.writeFile('db.json',JSON.stringify(articles));        // write to file

        res.redirect(`/articles/${article.id}`);        // api calling
    } catch (err) {
        console.log('err ->',err);
        res.render(`articles/${pg}`, { article });        // calling view pg
    }
};

exports.deleteController = async (req, res) => {
    try {
        const response = await fs.readFile('db.json','utf8') || '[]';        // read from file
        const articles = await JSON.parse(response);
        articles.splice(req.params.id-1,1);    // delete requested article
        await fs.writeFile('db.json',JSON.stringify(articles));        // write to file
        res.redirect('/');
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
};

exports.likeController = async (req, res) => {
    // res.redirect('/');
    // res.sendStatus('200');
    // const btnClr = document.getComputedStyle(this).color;
    // this.getComputedStyle(btn).color
    // console.log('this',this);
    const { body:{ likeBtnState }, params:{ id } } = req;
    // console.log('->',req.body,req.params, typeof likeBtnState,req.method);
    try {
        const response = await fs.readFile('db.json','utf8') || [];
        const articles = await JSON.parse(response);

        // console.log('1',articles[id-1]);
        // if(likeBtnState) articles[id-1].likes++;
        // else articles[id-1].likes--;
        // res.send(`${likeBtnState === 'on' ? ++articles[id-1].likes : --articles[id-1].likes}`);
        // console.log('2',articles[id-1]);
        // return res.end();
        // res.redirect('/');

        res.status(200).json({ likes: likeBtnState ? ++articles[id-1].likes : --articles[id-1].likes });
        await fs.writeFile('db.json', JSON.stringify(articles));
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
};

