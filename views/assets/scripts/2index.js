function likeBtnStateFromShow(activeLikeBtns, srcPg) {
    // console.log('likeBtnState',typeof likeBtnState,likeBtnState,'\nid',typeof id,id,'\nsrcPg',typeof srcPg,srcPg);
    /*const btn = document.getElementById(id);
    if(srcPg === 'show' && likeBtnState === '1')
        [btn.style.color, btn.style.textShadow] = ['orange', '1px 1px 3px #ffa500'];*/
    // let a='';
    console.log(activeLikeBtns || false);
    console.log('activeLikeBtns',typeof activeLikeBtns,activeLikeBtns);
    // activeLikeBtns = activeLikeBtns.split(',');
    console.log('activeLikeBtns',typeof activeLikeBtns,activeLikeBtns,'\nsrcPg',srcPg);
    if(srcPg === 'show' && activeLikeBtns) {
        activeLikeBtns.split(',').forEach(id => {
            const btn = document.getElementById(id);
            [btn.style.color, btn.style.textShadow] = ['orange', '1px 1px 3px #ffa500'];
        });
    }
}

function common(btn, beforeColor, afterColor, txtShadow) {
    const btnColor = window.getComputedStyle(btn).color;
    if(btnColor === beforeColor)
        [btn.style.color, btn.style.textShadow] = [afterColor,txtShadow];
}

const mouseOverLike = (btn) => common(btn,'rgb(169, 169, 169)','#ffa600','1px 1px 3px #ffa600');
const mouseOutLike = (btn) =>  common(btn,'rgb(255, 166, 0)','darkgray','0px 0px 0px #a9a9a9');

// const activeLikeBtns = [];

const apiConfig = (api, method, data) => fetch(api, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
});
function common2(btn, x, y) {
    const btnColor = window.getComputedStyle(btn).color;
    // const likeBtnState = btnColor === 'rgb(255, 165, 0)' ? x : y;
    // return { btnColor, likeBtnState };
    return btnColor === 'rgb(255, 165, 0)' ? x : y;
}

const q = [];
async function mouseClickLike(btn, activeLikeBtns) {
    event.preventDefault();     // prevent pg from default reloading, default submitting, or default redirecting

    try {
        // const { btnColor, likeBtnState } = common2(btn,0,1);
        // const likeBtnState = common2(btn,0,1);
        // let likeBtnState, activeLikeBtns;
        // activeLikeBtns = x || activeLikeBtns;
        let likeBtnState;
        console.log('1 likeBtnState',typeof likeBtnState,likeBtnState);

        /*[btn.style.color, btn.style.textShadow] = btnColor === 'rgb(255, 165, 0)' ?
        ['darkgray', '0px 0px 0px #a9a9a9'] :
        ['orange', '1px 1px 3px #ffa500'];*/
        // if(btnColor === 'rgb(255, 165, 0)') {

        console.log('1 activeLikeBtns',typeof activeLikeBtns,activeLikeBtns);
        activeLikeBtns = activeLikeBtns ? activeLikeBtns.split(',') : [];
        const btnColor = window.getComputedStyle(btn).color;
        if(btnColor === 'rgb(255, 165, 0)') {
            [btn.style.color, btn.style.textShadow, likeBtnState] = ['darkgray', '0px 0px 0px #a9a9a9', 0];
            const i = activeLikeBtns.indexOf(btn.id);
            activeLikeBtns.splice(i,1);
        } else {
            [btn.style.color, btn.style.textShadow, likeBtnState] = ['orange', '1px 1px 3px #ffa500', 1];
            activeLikeBtns.push(btn.id);
        }
        console.log('2 likeBtnState',typeof likeBtnState,likeBtnState);
        console.log('2 activeLikeBtns',typeof activeLikeBtns,activeLikeBtns);
        /*const response = await fetch(`/articles/like/${btn.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likeBtnState })
        });*/
        const response1 = await apiConfig(`/articles/like/${btn.id}`,'PUT',likeBtnState);
        const { likes } = await response1.json();
        console.log('likes',likes);
        document.getElementById(btn.id + btn.id).innerText = likes;

        // preserving like btn state while refreshing pg
        // const response2 =
        await fetch(`/articles/${btn.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: activeLikeBtns })
        });
        /*const {activeLikeBtns:x} = await response2.json(); // .activeLikeBtns;
        x.forEach(ele => {
            if(!activeLikeBtns.includes(ele))
                activeLikeBtns = activeLikeBtns.concat(x);
        });
        console.log('response2',activeLikeBtns);*/

        /*await fetch(`/articles/${btn.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: activeLikeBtns })
        });*/
    } catch (err) {
        console.log('err ->',err);
    }
}

async function mouseClickShow(id, activeLikeBtns) {
    try {
        /*await fetch(`/articles/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likeBtnState })
        });*/
        console.log('activeLikeBtns',typeof activeLikeBtns,activeLikeBtns);
        await apiConfig(`/articles/${id}`,'POST',activeLikeBtns);
    } catch (err) {
        console.log('err ->',err);
    }
}

async function mouseClickEdit(articles, id) {
    try {
        const btn = document.getElementById(id);
        const likeBtnState = common2(btn,1,0);
        await apiConfig(`/articles/${id}`,'POST',likeBtnState);
    } catch (err) {
        console.log('err ->',err);
    }
}

