const mdToHtml = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const { ObjectId } = require('mongodb');    // to convert from type string to ObjectId of _id

const articleModel = require('../models/article');

const dompurify = createDomPurify(new JSDOM().window);

// function tryCatch0(fn, res, next, id, pg) {
//     return fn(res, next, id, pg).catch(next);
    // return (res, next, id, pg) => fn(res, next).catch(next);

    /*try {
        fn(res, next, id, pg);
    } catch (err) {
        next(err);
    }*/
// }
// const tryCatch1 = fn => (res, next) => {        // works fine
//     return fn(res, next).catch(next);
    // return (res, next, id, pg) => fn(res, next).catch(next);
    /*try {
        fn(res, next, id, pg);
    } catch (err) {
        next(err);
    }*/
// };

//  global try catch block to handle both user & system generated errs
function catchErr(fn) {
    // return (res, next) => fn(res, next).catch(next);
    // return (next, res) => fn(next, res).catch(res);        // works fine
    /*if(typeof b === 'function')
        return (a, b, c, d) => fn(a, b, c, d).catch(b);
    return (a, b, c, d) => fn(a, b, c, d).catch(c);*/
    return (a, b, c, d) => {
        if(typeof b === 'function') fn(a, b, c, d).catch(b);
        else fn(a, b, c, d).catch(c);
    };
    // return fn => fn.catch;
    // return fn => fn(a, b, c, d).catch(c);
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

exports.newController = res => res.render('new', { article: {}, activeLikeBtns });

// exports.readController = (res, next, id, pg) => tryCatch(async (res, next, id, pg) => {
/* exports.readController = tryCatch(async (res, next, id, pg) => {
    // try {
        // console.log(typeof id,id,typeof next,next,typeof res,res);
        if(pg === 'index') {        // [GET], index pg
            const response = await articleModel.find().sort({ createdAt: -1 }).lean() || [];
            // response.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));    // sort objects inside array in descending order of created date
            // console.log(response);
            res.status(200).render('index', { articles: response, activeLikeBtns, srcPg });        // calling frontend pg

            [activeLikeBtns, srcPg] = [null,null];
        } else {        // [GET], other pgs - show, edit
            const response = await articleModel.findById(id).lean();
            // if(!response) return res.sendStatus(500);
            if(!response) throw new Error('Something went wrong!\tPlease try again later...');

            res.status(200).render(pg, { article: response, activeLikeBtns });        // calling frontend pg
        }
    // } catch (err) {
    //     // console.log(error);
    //     next(err);
    // }
    // res.send('its'+pg);
// }, res, next, id, pg);
});*/

exports.readController = catchErr(async (res, next, id, pg) => {
    // try {
        if(pg === 'index') {        // [GET], index pg
            const response = await articleModel.find().sort({ createdAt: -1 }).lean() || [];
            // response.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));    // sort objects inside array in descending order of created date
            // console.log(response);
            res.status(200).render('index', { articles: response, activeLikeBtns, srcPg });        // calling frontend pg

            [activeLikeBtns, srcPg] = [null,null];
        } else {        // [GET], other pgs - show, edit
            const response = await articleModel.findById(id).lean();
            // if(!response) return res.sendStatus(500);
            if(!response) throw new Error('Something went wrong!\tPlease try again later...');

            // res.status(200).render(pg, { article: response, activeLikeBtns });        // calling frontend pg
            res.status(200).render(pg, { article: response, activeLikeBtns, srcPg });        // calling frontend pg, sending srcPg for edit pg
        }
    /*} catch (err) {
        // console.log(error);
        next(err);
    }*/
    // res.send('its'+pg);
});

exports.writeController = catchErr(async (req, res, next, type) => {
    // const { body:article, body:{ username='Anonymous', title, originalDesc, markdown }, params:{ id }={} } = req;
    const { body:article, body:{ title, originalDesc, markdown }, params:{ id }={} } = req;

    const username = article.username || 'Anonymous';
    // console.log('username',username,article.username,req,username || false);
    // article.username = article.username || 'Anonymous';
    /*if(username) {
        // article.username = article.username.length < 3 ? ;
            if(username.length < 3) {*/
                /*const err = new Error('Username must be at least 3 chars long!\tPlease insert appropriate name...');
                err.statusCode = 422;
                throw err;*/
                /*throw createErrObj('Username must be at least 3 chars long!\tPlease insert appropriate name...',422);
            }
        } else article.username = 'Anonymous';*/

    const chkSpclChars = /(?![\s-])\W|\n|\t|\r/g;    // chk special chars but not spaces, -, _
    // if(username !== 'Anonymous' && chkSpclChars.test(username))
    //     throw createErrObj('Invalid Name!\tPlease insert appropriate name...',422);
    // const chkFields = /(?:\S){10,}/g;
    // const chkFields = /(?:\S){10,}|(?!\s{1,2})/g;
    // const chkFields = /\w/g;
    const chkAlphabets = /[a-zA-Z]/g;      // count no. of chars[a-zA-Z] in the string containing all type of chars
    // const [chkSpclChars1, chkAlphabets1] = [/(?![\s-])\W/g, /[a-zA-Z]/g];
    // const chkStringLength = (string, minlen, maxlen) => {
    function chkStringLength(string, minlen, maxlen) {
        const no_of_alphabets = (string.match(chkAlphabets) || []).length;
        // console.log(len < 3 || len > 10);
        return no_of_alphabets < minlen || no_of_alphabets > maxlen;
    }

    const errmsg = field => createErrObj(`Invalid or smaller ${field}!\tPlease insert appropriate ${field}...`,422);
    /*if(username) {
        if((username.match(chkAlphabets) || []).length < 3)
            throw createErrObj('Invalid Name!\tPlease insert appropriate name...',422);
    } else article.username = 'Anonymous';*/
    // if(username !== 'Anonymous' && (username.match(chkAlphabets) || []).length < 3)
    /*if(username !== 'Anonymous' &&
        (chkSpclChars.test(username) ||
        (username.match(chkAlphabets) || []).length < 3 ||
        (username.match(chkAlphabets) || []).length > 10))*/
    if(username !== 'Anonymous' && (chkStringLength(username,3,15) || chkSpclChars.test(username)))
        // throw createErrObj('Invalid or smaller name!\tPlease insert appropriate name...',422);
        // throw createErrObj(errmsg('name'),422);
        throw errmsg('name');
    // if(!article.title || !/(?:\S)+/g.test(article.title))
    // if(!title || (title.match(chkAlphabets) || []).length < 5)
    // if(!title || chkSpclChars.test(title) || (title.match(chkAlphabets) || []).length < 5)
    if(!title || chkStringLength(title,5,20) || chkSpclChars.test(title))
        // throw createErrObj('Invalid or smaller title!\tPlease insert appropriate title...',422);
        // throw createErrObj(errmsg('title'),422);
        throw errmsg('title');
        // if(!article.originalDesc || !chkFields.test(article.originalDesc))
    // if(!originalDesc || (originalDesc.match(chkAlphabets) || []).length < 50)
    if(!originalDesc || chkStringLength(originalDesc,50,200))
        // throw createErrObj('Invalid or smaller description!\tPlease insert appropriate description...',422);
        // throw createErrObj(errmsg('description'),422);
        throw errmsg('description');
        // console.log(article.originalDesc);
    // if(!markdown || (markdown.match(chkAlphabets) || []).length < 20)
    if(!markdown || chkStringLength(markdown,20,70))
        // throw createErrObj('Invalid or smaller markdown!\tPlease insert appropriate markdown...',422);
        // throw createErrObj(errmsg('markdown'),422);
        throw errmsg('markdown');

    // console.log(article);
    // try {

        article.username = username.replace(/\s{2,}/g,' ');
        article.title = title.replace(/\s{2,}/g,' ');

        const chars1 = { '<': '&lt;', '>': '&gt;' };
        const chars2 = { '&lt;': '<', '&gt;': '>' };

        article.modifiedDesc = originalDesc      // for display
            // .replace(/[<>]/g, c => chars1[c])    // replace < > with &lt; &gt; (to nullify html scripts)
            .replace(/<|>/g, c => chars1[c])    // replace < > with &lt; &gt; (to disable html scripts)
            .replace(/(\r\n){2,}/g,'<br><br>')
            .replace(/\r\n/g,'<br>')
            .replace(/\s{2,}/g,'')
            .replace(/(<br>|\s)+$/,'');    // remove n <br>s from end
        article.originalDesc = article.modifiedDesc
            .replace(/<br>/g,'\n')      // for edit
            .replace(/(&lt;)|(&gt;)/g, c => chars2[c]);    // replace &lt; &gt; with < >

        const modifiedMd = markdown
            // .replace(/[<>]/g, c => chars1[c])    // replace < > with &lt; &gt; (to nullify html scripts)
            .replace(/<|>/g, c => chars1[c])    // replace < > with &lt; &gt; (to disable html scripts)
            .replace(/\r\n/g,'<>')
            .replace(/\s{2,}/g,'')
            .replace(/<>/g,'\n')
            .replace(/(\n|\s)+$/,'');

    // try {
        article.sanitizedHtml = dompurify.sanitize(mdToHtml(modifiedMd));   // convert markdown to html and purify the html
        article.markdown = modifiedMd.replace(/(&lt;)|(&gt;)/g, c => chars2[c]);    // replace &lt; &gt; with < >

        let response;
        if(!id) {        // [POST], new article
            const displayDate = new Date().toLocaleDateString();
            // const chkDate = /^\d\//;        // check string starts with '[1-9]/' i.e. date 1 - 9 only
            // article.displayDate = chkDate.test(displayDate) ? '0'+displayDate : displayDate;
            article.displayDate = displayDate[1] === '/' ? '0'+displayDate : displayDate;

            response = await articleModel.create(article);
            // if(!response) throw new Error('Unable to post article!\tPlease try again later...');
        } else {        // [PUT], update article
            // console.log('update article',article);
            response = await articleModel.findByIdAndUpdate(id, article, { new: true }).lean();
            // if(!response) throw new Error('Unable to update article!\tPlease try again later...');
        }
        if(!response) throw new Error(`Unable to ${type} article!\tPlease try again later...`);

        // if(type === 'post') statusCode = 201;
        // else statusCode = 200;
        const statusCode = type === 'post' ? 201 : 200;
        res.status(statusCode).redirect(`/articles/${response._id}`);        // api calling
    /*} catch (err) {
        next(err);
    }*/
});

exports.deleteController = catchErr(async (res, next, id) => {
    // console.log('id',_id,typeof _id);
    // try {
        // disabling deleting first 5 articles
        const { _id } = (await articleModel.aggregate([
            { $sort: { createdAt: 1 } },
            { $skip: 5 },
            { $match: { _id: ObjectId(id) } },
            { $project: { _id: 1 } }
        ]))[0] || {};
        // console.log('_id',_id);
        if(!_id) {
            /*const err = new Error("Can't delete this article!\tTry again later...");
            err.statusCode = 401;
            throw err;*/
            throw createErrObj("Can't delete this article!\tTry again later...",401);
        }

        // deleting article remaining of others
        const { deletedCount } = await articleModel.deleteOne({ _id }).lean();
        if(!deletedCount) {
            /*const err = new Error('Unable to delete article!\tPlease try again later...');
            err.statusCode = 404;
            throw err;*/
            throw createErrObj('Unable to delete article!\tPlease try again later...',404);
        }

        res.status(204).redirect('/');        // api calling
    /*} catch (err) {
        next(err);
    }*/
});

exports.likeController = catchErr(async (req, res, next) => {
    const { body:{ data:likeBtnState }, params:{ id } } = req;
    // try {
        const { likes:oldLikes } = await articleModel.findById(id).select('likes -_id').lean() || {};
        // console.log(oldLikes);
        if(!oldLikes) throw new Error('Something went wrong!\tPlease try again later...');

        const { likes:newLikes } = await articleModel.findByIdAndUpdate(id,
            { likes: likeBtnState ? oldLikes+1 : oldLikes-1 },
            { new: true }).select('likes -_id').lean() || {};
        // console.log(newLikes);
        if(!newLikes) throw new Error('Something went wrong!\tPlease try again later...');

        res.status(200).json({ likes: newLikes });
    /*} catch (err) {
        next(err);
    }*/
});

