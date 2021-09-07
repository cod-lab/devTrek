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

// exports.poweredbyController = res => res.render('powered-by');
exports.newController = res => res.render('new', { article: {}, activeLikeBtns });

exports.readController = async (res, id, pg) => {
    try {
        const response = await fs.readFile('backend/db.json','utf8') || '[]';        // read from file
        const articles = await JSON.parse(response);

        if(pg === 'index') {        // [GET], index pg
            articles.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));    // sort objects inside array in descending order of created date
            res.render('index', { articles, activeLikeBtns, srcPg });        // calling frontend pg

            [activeLikeBtns, srcPg] = [null,null];
        } else {        // [GET], other pgs - show, edit
            const article = articles.find(article => article.id === id);
            if(!article) return res.sendStatus(500);
            res.render(pg, { article, activeLikeBtns });        // calling frontend pg
        }
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
};

exports.writeController = async (req, res, event, pg) => {
    const { body:article, params:{ id }={} } = req;

    article.name = article.name || 'Anonymous';

    const chars1 = { '<': '&lt;', '>': '&gt;' };
    const chars2 = { '&lt;': '<', '&gt;': '>' };

    article.modifiedDesc = article.originalDesc      // for display
        .replace(/[<>]/g, c => chars1[c])    // replace < > with &lt; &gt; (to nullify html scripts)
        .replace(/(\r\n){2,}/g,'<br><br>')
        .replace(/\r\n/g,'<br>')
        .replace(/\s{2,}/g,'')
        .replace(/(<br>|\s)+$/,'');    // remove n <br>s from end
    // console.log('1 originalDesc',article.originalDesc,'\nmodifiedDesc',article.modifiedDesc);
    article.originalDesc = article.modifiedDesc
        .replace(/<br>/g,'\n')      // for edit
        .replace(/(&lt;)|(&gt;)/g, c => chars2[c]);    // replace &lt; &gt; with < >
    // console.log('\n2 originalDesc',article.originalDesc,'\nmodifiedDesc',article.modifiedDesc);

    // console.log('\n1 markdown',article.markdown); //,'\nmodifiedDesc',article.modifiedDesc);
    const modifiedMd = article.markdown
        .replace(/[<>]/g, c => chars1[c])    // replace < > with &lt; &gt; (to nullify html scripts)
        .replace(/\r\n/g,'<>')
        .replace(/\s{2,}/g,'')
        .replace(/<>/g,'\n')
        .replace(/(\n|\s)+$/,'');
    // console.log('\n2 markdown',modifiedMd); //,'\nmodifiedDesc',article.modifiedDesc);

    article[event] = new Date();

    try {
        article.slug = slugify(article.title, { lower: true, strict: true });   // generate string from article title to use as url
        article.sanitizedHtml = dompurify.sanitize(marked(modifiedMd));   // convert markdown to html and purify the html
        article.markdown = modifiedMd.replace(/(&lt;)|(&gt;)/g, c => chars2[c]);    // replace &lt; &gt; with < >
        // console.log('\n3 markdown',article.markdown);

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
        res.render(pg, { article });        // calling frontend pg
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

