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
const mouseClickCancel = (activeLikeBtns, id, srcPg) => callApi(activeLikeBtns,id,srcPg ? undefined : 'edit/new');


const chkAlphabets = /[a-zA-Z]/g;      // count no. of chars[a-zA-Z] in the string containing all type of chars
const chkSpclChars = /(?![\s\.-])\W/g;    // it wont chk spaces, -, _, .

function chkStringLength(string, minAlphabets, maxlen) {
    const no_of_alphabets = (string.match(chkAlphabets) || []).length;
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

    try {
        if(nameString && (chkStringLength(nameString,3,20) || chkSpclChars.test(nameString)))
            return activateErr(nameErr);
        deactivateTextBoxErr(nameErr,eleName,nameString);

        if(!titleString || chkStringLength(titleString,5,25) || chkSpclChars.test(titleString))
            return activateErr(titleErr);
        deactivateTextBoxErr(titleErr,eleTitle,titleString);

        if(!descString || chkStringLength(descString,500,4000))
            return activateErr(descErr);
        deactivateTextAreaErr(descErr,eleDesc,descString);

        if(!mdString || chkStringLength(mdString,20,2000))
            return activateErr(mdErr);
        deactivateTextAreaErr(mdErr,eleMd,mdString);
    } catch (err) {
        console.log('err ->',err);
        return false;       // prevent api calling & form submission
    }

    callApi(activeLikeBtns,id);
}

