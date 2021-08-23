const fs = require('fs').promises;
const marked = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const slugify = require('slugify');

const dompurify = createDomPurify(new JSDOM().window);

let activeLikeBtns, srcPg; // , aid;
// console.log('1 activeLikeBtns',activeLikeBtns);
// exports.preserveLikeBtnStateController = (body, id) => [activeLikeBtns, srcPg, aid] = [body.data,body.pg,id];
/*exports.preserveLikeBtnStateController = (res, body, id) => {
    [activeLikeBtns, srcPg, aid] = [body.data,body.pg,id];
    // [activeLikeBtns, srcPg, aid] = [activeLikeBtns ? activeLikeBtns.concat(body.data) : body.data, body.pg, id];
    console.log('body',body,'activeLikeBtns',activeLikeBtns);
    // res.status(200).json({ activeLikeBtns });
    res.sendStatus(200);
};*/
exports.preserveLikeBtnsStateController = (res, body) => {
    // console.log('body',body);
    [activeLikeBtns, srcPg] = [body.data,body.pg];
    // console.log('2 activeLikeBtns',activeLikeBtns);
    res.sendStatus(200);
};

exports.newController = res => res.render('articles/new', { article: {}, activeLikeBtns });

exports.readController = async (res, id, pg) => {
    // console.log('srcPg',srcPg,'-> id',id,'\npg',pg,'\n3 activeLikeBtns',activeLikeBtns,typeof activeLikeBtns);
    try {
        const response = await fs.readFile('db.json','utf8') || '[]';
        const articles = await JSON.parse(response);
        if(pg === 'index') {        // [GET], index pg
            articles.sort((a,b) => b.id - a.id);    // sort objects inside array in descending order of articles[i].id
            res.render('articles/index', { articles, activeLikeBtns, srcPg });        // calling view pg
            // [activeLikeBtns, srcPg, aid] = [null,null,null];
            [activeLikeBtns, srcPg] = [null,null];
        } else {        // [GET], other pgs - show, edit
            let article = articles.find(article => article.id === id);
            if(!article) return res.redirect('/');
            res.render(`articles/${pg}`, { article, activeLikeBtns });        // calling view pg
        }
    } catch (err) {
        console.log('err ->',err);
        res.send(err);
    }
};

exports.writeController = async (req, res, event, pg) => {
    const { body:article, params:{ id }={} } = req;

    article.name = article.name || 'Anonymous';
    // console.log('1 article\n',article);
    // console.log('1 orgi ->\n',article.originalDesc);
    // const chars = { '\s{3,6}': '', '\n': '<br>' };
    // const chars = { '\n': '<br>', '\s{2,}': '' };
    // const x = ['\n','\s{2,}'];
    // article.description = article.description.replace(/\s{2,20}/g, '');
    // article.description = dompurify.sanitize(marked(article.description));
    // article.description = article.description.replace(/[\n\s{3,6}]/g, m => chars[m]);
    // article.description = article.description.replace(/(.*?(\n))+.*?/);
    // const purifyString = string => string.replace(/\r\n/g,'<br>').replace(/\s{2,}/g,'').replace(/(<br>|\s)+$/,'');
    article.modifiedDesc = article.originalDesc      // for display
        // .replace(/\n/g,'<br>')
        // .replace(/\r\n/g,'<br>')
        // .replace(/(\r\n){2,}|(\r\n)+$/g,'<br><br>')
        .replace(/(\r\n){2,}/g,'<br><br>')
        .replace(/\r\n/g,'<br>')
        .replace(/\s{2,}/g,'')
        .replace(/(<br>|\s)+$/,'');    // remove n <br>s from end
        // article.modifiedDesc = purifyString(article.modifiedDesc);
        // .replace(/(\r<br>)+$/,/\s/);    // remove n \r<br>s from end
        // .replace(/((?:\\r)<br>)+$/,'');    // remove n <br>s from end
        // .replace(/(<br>)+$/,'');    // remove n <br>s from end
        // article.originalDesc = article.originalDesc.replace(/\n/g,'\n').replace(/\s{2,}/g,'');      // for edit
    // article.originalDesc = article.originalDesc.replace(/\s{2,}(?!\n)/g,'');      // for edit
    // article.originalDesc = article.originalDesc.replace(/\n/g,'<br>').replace(/\s{2,}/g,'').replace(/<br>/g,'\n');      // for display
    // console.log('\nmodi ->\n',article.modifiedDesc);
    article.originalDesc = article.modifiedDesc.replace(/<br>/g,'\n'); //.replace(/(\\n)+$/,'');      // for edit
    // console.log('\n2 orgi ->\n',article.originalDesc);
    // article.description = article.description.replace(/\s{2,}/g,'');
    // article.description = article.description.replace(/\n\s{2,}/g, m => chars[m]);
    // article.description = article.description.replace(/x[0]x[1]/g, m => chars[m]);
    // article.markdown = article.markdown.replace(/\s{2,}/g,'');
    // article.modifiedMd = purifyString(article.originalMd);
    // article.modifiedMd = article.originalMd
    article.markdown = article.markdown
        .replace(/\r\n/g,'<>')
        .replace(/\s{2,}/g,'')
        .replace(/<>/g,'\n')
        .replace(/(\n|\s)+$/,'');
        // article.modifiedMd = article.markdown
    //     .replace(/\r\n/g,'\n')
    //     .replace(/\s{2,}/g, '');
    // article.modifiedMd = article.modifiedMd.replace(/#| #/g,' #');
    // article.markdown = article.markdown.replace(/\n/g,'<br>').replace(/\s{2,20}/g,'');
    // article.markdown = '';
    // article.originalMd = article.modifiedMd.replace(/<br>/g,'\n');
    // console.log('\n2 article\n',article);
    article[event] = new Date().toLocaleDateString();
    // const chkDate = /^[1-9]{1}\//;  // check string starts with '[1-9]/' i.e. date 1 - 9 only, also works fine
    const chkDate = /^\d\//;  // check string starts with '[1-9]/' i.e. date 1 - 9 only
    if(chkDate.test(article[event])) article[event] = '0'+article[event];
    // console.log(article[event],typeof article[event],new Date(),/^[0-9]{1}\//.test(article[event]));

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
    const { body:{ data:likeBtnState }, params:{ id } } = req;
    // console.log('->',req.body,req.params, typeof likeBtnState,req.method);
    try {
        const response = await fs.readFile('db.json','utf8') || [];
        const articles = await JSON.parse(response);

        // console.log('likeController');
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

