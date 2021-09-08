async function callApi(data, id, pg) {
    try {
        await fetch(`/articles/${id || 0}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data, pg })
        });
    } catch (err) {
        console.log('err ->',err);
    }
}
// const mouseClickIndex = (activeLikeBtns, id) => callApi(activeLikeBtns,id,'edit/new');
const mouseClickCancel = (activeLikeBtns, id, srcPg) =>
    // srcPg ? callApi(activeLikeBtns,id) : callApi(activeLikeBtns,id,'edit/new');
    callApi(activeLikeBtns,id,srcPg ? undefined : 'edit/new');
/*const mouseClickCancel = (activeLikeBtns, id, srcPg) => {
    if(srcPg) callApi(activeLikeBtns,id);
    else callApi(activeLikeBtns,id,'edit/new');
};*/
// const mouseMoveShow = callApi;
// const mouseClickShow = callApi;

/*function removeSpaces(desc, md) {
    document.getElementById('description').defaultValue = desc || '';
    document.getElementById('markdown').defaultValue = md || '';
    // document.getElementById('description').defaultValue = '';
    // document.getElementById('markdown').defaultValue = '';
    // document.getElementById('description').defaultValue = desc;
    // document.getElementById('markdown').defaultValue = md;
}*/

// const chkSpclChars = /(?![\s-])\W|\n|\t|\r/g;    // chk special chars but not spaces, -, _
const chkSpclChars = /(?![\s\.-])\W/g;    // it wont chk spaces, -, _, .
const chkAlphabets = /[a-zA-Z]/g;      // count no. of chars[a-zA-Z] in the string containing all type of chars

function chkStringLength(string, minAlphabets, maxlen) {
    const no_of_alphabets = (string.match(chkAlphabets) || []).length;
    // return no_of_alphabets < minlen || no_of_alphabets > maxlen;
    return no_of_alphabets < minAlphabets || string.length > maxlen;
}

function allowedSpclChars(string) {
    return string
        .replace(/\n|\t|\r/g,'')
        .replace(/\s{2,}/g,' ')     // it can cover \n{2,} | \t{2,} | \r{2,}
        .replace(/\.{2,}/g,'.')
        .replace(/-{2,}/g,'-')
        .replace(/_{2,}/g,'_');
}

function activateErr(err) {
    err.display = 'inline';
    return false;
}
function deactivateTextBoxErr(err,ele,string) {
    err.display = 'none';
    ele.value = allowedSpclChars(string);
}
function deactivateTextAreaErr(err,ele,string) {
    err.display = 'none';
    ele.value = string;
}
/*function x(a, b, c, e, f) {
    if(c.id === 'name') {
        if(a && (chkStringLength(a,e,f) || chkSpclChars.test(a))) return y(b);
        else z(a,b,c);
    } else if(c.id === 'title') {
        if(!a || chkStringLength(a,e,f) || chkSpclChars.test(a)) return y(b);
        else z(a,b,c);
    } else if(c.id === 'description') {
        if(!a || chkStringLength(a,e,f)) return y(b);
        else z(a,b,c);
    } else if(c.id === 'markdown') {
        if(!a || chkStringLength(a,e,f)) return y(b);
        else z(a,b,c);
    }
}*/

function validation(activeLikeBtns, id) {
    const eleName = document.getElementById('name');
    const nameString = eleName.value.trim();
    const nameErr = document.getElementById('name-err').style;

    const eleTitle = document.getElementById('title');
    const titleString = eleTitle.value.trim();
    const titleErr = document.getElementById('title-err').style;

    const eleDesc = document.getElementById('description');
    const descString = eleDesc.value.trim();
    const descErr = document.getElementById('desc-err').style;

    const eleMd = document.getElementById('markdown');
    const mdString = eleMd.value.trim();
    const mdErr = document.getElementById('md-err').style;

    // console.log(titleErr.style,'s -', titleString,'d -',titleErr.style.display);
    // console.log(name.trim(),name.trim().length);
    // const name = eleName.value.trim();

    try {
        if(nameString && (chkStringLength(nameString,3,20) || chkSpclChars.test(nameString))) // {
            // alert('invalid or smaller name');
            // visible err msg
            // document.getElementById('name-err').style.display = "inline";
            // document.getElementById('name-err').style.visibility = visible;
            // nameErr.display = 'inline';
            // return false;
            return activateErr(nameErr);
            // if(!activateErr(nameErr)) return false;
        // } else {
            // document.getElementById('name-err').style.display = "none";
            // nameErr.display = 'none';
            // eleName.value = nameString.replace(/\s{2,}/g,' ');
            // eleName.value = allowedSpclChars(nameString);
                /*.replace(/\n|\t|\r/g,'')
                .replace(/\s{2,}/g,' ')     // it can cover \n{2,} | \t{2,} | \r{2,}
                .replace(/\.{2,}/g,'.')
                .replace(/-{2,}/g,'-')
                .replace(/_{2,}/g,'_');*/
            deactivateTextBoxErr(nameErr,eleName,nameString);
        // }
        // x(nameString,nameErr,eleName,3,20);

        if(!titleString || chkStringLength(titleString,5,25) || chkSpclChars.test(titleString)) // {
            // alert('invalid or smaller title');
            // visible err msg
            // console.log(title);
            // document.getElementById('title-err').style.display = "inline";
            // document.getElementById('title-err').style.visibility = visible;
            // titleErr.style.display = 'inline';
            // titleErr.display = 'inline';
            // return false;
            return activateErr(titleErr);
            // if(!activateErr(titleErr)) return false;
        // } else {
            // document.getElementById('title-err').style.display = "none";
            // titleErr.style.display = 'none';
            // titleErr.display = 'none';
            // eleTitle.value = titleString.replace(/\s{2,}/g,' ');
            /*eleTitle.value = titleString
                .replace(/\n|\t|\r/g,'')
                .replace(/\s{2,}/g,' ')     // it can cover \n{2,} | \t{2,} | \r{2,}
                .replace(/\.{2,}/g,'.')
                .replace(/-{2,}/g,'-')
                .replace(/_{2,}/g,'_');*/
            // eleName.value = allowedSpclChars(nameString);
            deactivateTextBoxErr(titleErr,eleTitle,titleString);
        // }
        // x(titleString,titleErr,eleTitle,5,25);

        // if(!descString || chkStringLength(descString,50,250)) {
        if(!descString || chkStringLength(descString,500,4000)) // {
            // alert('invalid or smaller description');
            // visible err msg
            // document.getElementById('desc-err').style.display = "inline";
            // document.getElementById('desc-err').style.visibility = visible;
            // descErr.display = 'inline';
            // return false;
            return activateErr(descErr);
            // if(!activateErr(descErr)) return false;
        // } else {
            // descErr.display = 'none';
            // eleDesc.value = descString;
            deactivateTextAreaErr(descErr,eleDesc,descString);
        // }
        // x(descString,descErr,eleDesc,500,4000);

        // if(!mdString || chkStringLength(mdString,20,120)) {
        if(!mdString || chkStringLength(mdString,20,2000)) // {
            // alert('invalid or smaller markdown');
            // visible err msg
            // document.getElementById('md-err').style.display = "inline";
            // document.getElementById('md-err').style.visibility = visible;
            // mdErr.display = 'inline';
            // return false;
            return activateErr(mdErr);
            // if(!activateErr(mdErr)) return false;
        // } else {
            // mdErr.display = 'none';
            // eleMd.value = mdString;
            deactivateTextAreaErr(mdErr,eleMd,mdString);
        // }
        // x(mdString,mdErr,eleMd,20,2000);

    } catch (err) {
        console.log('err ->',err);
        return false;   // prevent api calling & form submission
    }

    // return false;


    callApi(activeLikeBtns,id);
    // return true; // its automatic
}

/*function validation() {
    if(!0) return false;
}*/

/*const form = document.getElementById('form');
form.addEventListener('submit', event => {
    event.preventDefault();
    const eleName = document.getElementById('name');
    const name = eleName.value.trim();
    const eleTitle = document.getElementById('title');
    const title = eleTitle.value.trim();
    const eleDesc = document.getElementById('description');
    const desc = eleDesc.value.trim();
    const eleMd = document.getElementById('markdown');
    const md = eleMd.value.trim();

    // console.log(name,name.length);
    // console.log(name.trim(),name.trim().length);
    // const name = eleName.value.trim();
    if(name && (chkStringLength(name,3,20) || chkSpclChars.test(name))) {
        alert('invalid or smaller name');
        // visible err msg
        document.getElementById('name-err').style.display = "inline";
        // document.getElementById('name-err').style.visibility = visible;
    // event.preventDefault();
    // return false;
    } else eleName.value = name.replace(/\s{2,}/g,' ');

    if(!title || chkStringLength(title,5,25) || chkSpclChars.test(title)) {
        alert('invalid or smaller title');
        // visible err msg
        // console.log(title);
        document.getElementById('title-err').style.display = "inline";
        // document.getElementById('title-err').style.visibility = visible;
    // event.preventDefault();
    // return false;
    } else eleTitle.value = title.replace(/\s{2,}/g,' ');

    if(!desc || chkStringLength(desc,50,250)) {
        alert('invalid or smaller description');
        // visible err msg
        document.getElementById('desc-err').style.display = "inline";
        // document.getElementById('desc-err').style.visibility = visible;
    // event.preventDefault();
    // return false;
    } else eleDesc.value = desc;

    if(!md || chkStringLength(md,20,120)) {
        alert('invalid or smaller markdown');
        // visible err msg
        document.getElementById('md-err').style.display = "inline";
        // document.getElementById('md-err').style.visibility = visible;
    // event.preventDefault();
    // return false;
    } else eleMd.value = md;



    // return false;


    // callApi(activeLikeBtns,id);
    // return true; // its automatic
});*/

