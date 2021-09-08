const mdToHtml = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { ObjectId } = require('mongodb');    // to convert from type string to ObjectId of _id

const articleModel = require('../models/article');

const dompurify = createDomPurify(new JSDOM().window);

//  global try catch block to handle both user & system generated errs
function catchErr(fn) {
    return (a, b, c, d) => {
        if(typeof b === 'function') fn(a, b, c, d).catch(b);
        else fn(a, b, c, d).catch(c);
    };
}

//  global fn to initialize err object to be thrown to user
function createErrObj(msg, code) {
    const err = new Error(msg);
    err.statusCode = code;
    return err;
}

let activeLikeBtns, srcPg;

exports.preserveLikeBtnsStateController = (res, body) => {
    [activeLikeBtns, srcPg] = [body.data,body.pg];
    res.sendStatus(200);
};

exports.newController = res => res.render('new', { article: {}, activeLikeBtns, srcPg });   // calling frontend pg

exports.readController = catchErr(async (res, next, id, pg) => {
    if(pg === 'index') {        // [GET], index pg
        const response = await articleModel.find().sort({ createdAt: -1 }).lean() || [];
        res.status(200).render('index', { articles: response, activeLikeBtns, srcPg });        // calling frontend pg

        [activeLikeBtns, srcPg] = [null,null];
    } else {        // [GET], other pgs - show, edit
        const response = await articleModel.findById(id).lean();
        if(!response) throw new Error('Something went wrong!\tPlease try again later...');

        res.status(200).render(pg, { article: response, activeLikeBtns, srcPg });        // calling frontend pg, sending srcPg for edit pg
    }
});

exports.writeController = catchErr(async (req, res, next, type) => {
    const { body:article, params:{ id }={} } = req;

    const username = article.username.trim() || 'Anonymous';
    const title = article.title.trim();
    const originalDesc = article.originalDesc.trim();
    const markdown = article.markdown.trim();

    // checking fields
    const errmsg = field => createErrObj(`Invalid or smaller ${field}!\tPlease insert appropriate ${field}...`,422);

    const chkAlphabets = /[a-zA-Z]/g;      // count no. of chars[a-zA-Z] in the string containing all types of chars
    function chkStringLength(string, minAlphabets, maxlen) {
        const no_of_alphabets = (string.match(chkAlphabets) || []).length;
        return no_of_alphabets < minAlphabets || string.length > maxlen;
    }

    const chkSpclChars = /(?![\s\.-])\W/g;    // chk special chars but not spaces, -, _, ., \n, \t, \r

    if(username !== 'Anonymous' && (chkStringLength(username,3,20) || chkSpclChars.test(username)))
        throw errmsg('name');
    if(!title || chkStringLength(title,5,25) || chkSpclChars.test(title))
        throw errmsg('title');
    if(!originalDesc || chkStringLength(originalDesc,500,4000))
        throw errmsg('description');
    if(!markdown || chkStringLength(markdown,20,2000))
        throw errmsg('markdown');

    // correcting fields after passing above test
    function allowedSpclChars(string) {
        return string
            .replace(/\n|\t|\r/g,'')
            .replace(/\s{2,}/g,' ')     // it can cover \n{2,} | \t{2,} | \r{2,}
            .replace(/\.{2,}/g,'.')
            .replace(/-{2,}/g,'-')
            .replace(/_{2,}/g,'_');
    }
    article.username = allowedSpclChars(username);
    article.title = allowedSpclChars(title);

    const chars1 = { '<': '&lt;', '>': '&gt;' };
    const chars2 = { '&lt;': '<', '&gt;': '>' };

    article.modifiedDesc = originalDesc      // for display
        .replace(/<|>/g, c => chars1[c])    // replace < > with &lt; &gt; (to disable html scripts)
        .replace(/\n{2,}/g,'<br><br>')
        .replace(/\n/g,'<br>')
        .replace(/\s{2,}/g,'');
    article.originalDesc = article.modifiedDesc
        .replace(/<br>/g,'\n')      // for edit
        .replace(/(&lt;)|(&gt;)/g, c => chars2[c]);    // replace &lt; &gt; with < >

    const modifiedMd = markdown
        .replace(/<|>/g, c => chars1[c])    // replace < > with &lt; &gt; (to disable html scripts)
        .replace(/(?!\n)\s{2,}/g,'');
    article.sanitizedHtml = dompurify.sanitize(mdToHtml(modifiedMd));   // convert markdown to html and purify the html
    article.markdown = modifiedMd.replace(/(&lt;)|(&gt;)/g, c => chars2[c]);    // replace &lt; &gt; with < >

    let response;
    if(!id) {        // [POST], new article
        const displayDate = new Date().toLocaleDateString();
        article.displayDate = displayDate[1] === '/' ? '0'+displayDate : displayDate;

        response = await articleModel.create(article);
    } else      // [PUT], update article
        response = await articleModel.findByIdAndUpdate(id, article, { new: true }).lean();

    if(!response) throw new Error(`Unable to ${type} article!\tPlease try again later...`);

    const statusCode = type === 'post' ? 201 : 200;
    res.status(statusCode).redirect(`/articles/${response._id}`);        // api calling
});

exports.deleteController = catchErr(async (res, next, id) => {
    // disabling deletion of first 5 articles
    const { _id } = (await articleModel.aggregate([
        { $sort: { createdAt: 1 } },
        { $skip: 5 },
        { $match: { _id: ObjectId(id) } },
        { $project: { _id: 1 } }
    ]))[0] || {};
    if(!_id) throw createErrObj("Can't delete this article!\tTry again later...",401);

    // deleting article remaining of others
    const { deletedCount } = await articleModel.deleteOne({ _id }).lean();
    if(!deletedCount) throw createErrObj('Unable to delete article!\tPlease try again later...',404);

    res.status(204).redirect('/');        // api calling
});

exports.likeController = catchErr(async (req, res, next) => {
    const { body:{ data:likeBtnState }, params:{ id } } = req;

    const { likes:oldLikes } = await articleModel.findById(id).select('likes -_id').lean() || {};
    if(!Number.isInteger(oldLikes)) throw new Error('Something went wrong!\tPlease try again later...');

    const { likes:newLikes } = await articleModel.findByIdAndUpdate(id,
        { likes: likeBtnState ? oldLikes+1 : oldLikes-1 },
        { new: true }).select('likes -_id').lean() || {};
    if(!Number.isInteger(newLikes)) throw new Error('Something went wrong!\tPlease try again later...');

    res.status(200).json({ likes: newLikes });
});

