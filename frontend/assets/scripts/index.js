function fromOtherPg(activeLikeBtns, srcPg) {
    if(srcPg && activeLikeBtns)
        activeLikeBtns.split(',').forEach(id => {
            const btn = document.getElementById(id);
            [btn.style.color, btn.style.textShadow] = ['orange', '1px 1px 3px #ffa500'];
        });
}


function common(btn, beforeColor, afterColor, txtShadow) {
    const btnColor = window.getComputedStyle(btn).color;
    if(btnColor === beforeColor)
        [btn.style.color, btn.style.textShadow] = [afterColor,txtShadow];
}
const mouseOverLike = btn => common(btn,'rgb(169, 169, 169)','#ffa600','1px 1px 3px #ffa600');
const mouseOutLike = btn =>  common(btn,'rgb(255, 166, 0)','darkgray','0px 0px 0px #a9a9a9');


const callApi = (api, method, data) => fetch(api, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
});

let activeLikeBtnsCache = [];
let likeBtn;

async function mouseClickLike(btn, activeLikeBtns) {
    event.preventDefault();     // prevent pg from default reloading, default submitting, or default redirecting

    try {
        let likeBtnState;
        activeLikeBtnsCache = (likeBtn || !activeLikeBtns) ? activeLikeBtnsCache : activeLikeBtns.split(',');

        const btnColor = window.getComputedStyle(btn).color;
        const { id } = btn;

        if(btnColor === 'rgb(255, 165, 0)') {
            [btn.style.color, btn.style.textShadow, likeBtnState] = ['darkgray', '0px 0px 0px #a9a9a9', 0];

            if(activeLikeBtnsCache.length > 1) {
                const i = activeLikeBtnsCache.indexOf(id);
                activeLikeBtnsCache.splice(i,1);
            } else activeLikeBtnsCache.splice(0);   // delete all elements from index 0 but at the moment array has only 1 ele
        } else {
            [btn.style.color, btn.style.textShadow, likeBtnState] = ['orange', '1px 1px 3px #ffa500', 1];

            if(!activeLikeBtnsCache.includes(id))
                activeLikeBtnsCache.push(id);
        }

        const response = await callApi(`/articles/like/${id}`,'PATCH',likeBtnState);    // stores no. of likes in db
        // console.log(response.status,typeof response.status);
        // console.log(response.body,typeof response.body);
        // console.log(response.json());
        // console.log(response.body,typeof response.body);
        // const { likes } = await response.json();
        // const { likes } = 1; // await response.json();
        // if(likes) document.getElementById(id + id).innerText = likes;
        // else {
        //     alert('something went wrong!');

        // }
        if(response.status !== 200) return alert('something went wrong!');
        // else const { likes } = await response.json();    // invalid declaration
        else {
            const { likes } = await response.json();
            document.getElementById(id + id).innerText = likes;
        }
        // console.log('after alert');

        await callApi(`/articles/${id}`,'POST',activeLikeBtnsCache);        // stores active like btns in memory(preserved until home pg is not refresh)

        likeBtn = 'clicked';
    } catch (err) {
        console.log('err ->',err);
    }
}


async function apiConfig(activeLikeBtns) {
    try {
        await callApi('/articles/0','POST',likeBtn ? activeLikeBtnsCache : activeLikeBtns);        // stores active like btns in memory to transfer to another pg
    } catch (err) {
        console.log('err ->',err);
    }
}
const [mouseClickShow, mouseClickEdit, mouseClickNew] = [apiConfig,apiConfig,apiConfig];

