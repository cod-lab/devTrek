// const { callApi, apiConfig } = require('./common');

const imgUrl = 'http://localhost:5000/images/likebtns/';
const heart = document.getElementById('heart');

function refreshPg(activeLikeBtns, id) {
    // console.log(activeLikeBtns || false);
    // activeLikeBtns = activeLikeBtns.split(',');
    // console.log('activeLikeBtns',typeof activeLikeBtns,activeLikeBtns,typeof aid);
    // if(likeBtnState === '1') heart.src = imgUrl + 'heart-fill.png';
    if(activeLikeBtns && activeLikeBtns.split(',').includes(id))
        heart.src = imgUrl + 'heart-fill.png';
}


function common(beforeImg, afterImg) {
    if(heart.src.match(`${imgUrl + beforeImg}.png`))
        heart.src = `${imgUrl + afterImg}.png`;
}
const mouseOverLike = () => common('heart-empty','heart-fill2');
const mouseOutLike = () => common('heart-fill2','heart-empty');


const callApi = (api, method, data, pg) => fetch(api, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, pg })
});

let activeLikeBtnsCache = [];
let likeBtn;

async function mouseClickLike(activeLikeBtns, id) {
    event.preventDefault();     // prevent pg from default reloading, default submitting, or default redirecting

    likeBtn = 'clicked';
    try {
        /*[heart.src, likeBtnState] = heart.src.match(imgUrl + 'heart-fill.png') ?
            [imgUrl + 'heart-empty.png', 0] :
            [imgUrl + 'heart-fill.png', 1];*/

        let likeBtnState;
        activeLikeBtnsCache = activeLikeBtns ? activeLikeBtns.split(',') : activeLikeBtnsCache;
        if(heart.src.match(imgUrl + 'heart-fill.png')) {
            [heart.src, likeBtnState] = [imgUrl + 'heart-empty.png', 0];
            // const i = activeLikeBtns.indexOf(id);
            // activeLikeBtns.splice(i,1);
            if(activeLikeBtnsCache.length > 1) {
                const i = activeLikeBtnsCache.indexOf(id);
                activeLikeBtnsCache.splice(i,1);
            } else activeLikeBtnsCache.splice(0);   // delete all elements from index 0 but at the moment array has only 1 ele
        } else {
            [heart.src, likeBtnState] = [imgUrl + 'heart-fill.png', 1];
            // activeLikeBtns.push(id);
            // q = q ? q.push(id) : id;
            // if(activeLikeBtnsCache)
            if(!activeLikeBtnsCache.includes(id))
                activeLikeBtnsCache.push(id);
            // else activeLikeBtnsCache = id;
        }
        // console.log('likeBtnState',likeBtnState);

        /*const response = await fetch(`/articles/like/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:  JSON.stringify({ data: likeBtnState })
        });*/
        const response = await callApi(`/articles/like/${id}`,'PATCH',likeBtnState);
        const { likes } = await response.json();
        document.getElementsByClassName('d-inline')[0].innerText = likes;

        // console.log('activeLikeBtns',activeLikeBtns);
        // console.log('q',typeof q,q);

        // preserving like btn state while refreshing pg
        /*await fetch(`/articles/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: activeLikeBtnsCache })
        });*/
        await callApi(`/articles/${id}`,'POST',activeLikeBtnsCache);
    } catch (err) {
        console.log('err ->',err);
    }
}


async function apiConfig(activeLikeBtns, id, pg) {
    try {
        // await callApi(`/articles/${id}`,'POST',activeLikeBtnsCache || activeLikeBtns,pg);
        // await callApi(`/articles/${id}`,'POST',activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns,pg);
        await callApi(`/articles/${id}`,'POST',likeBtn ? activeLikeBtnsCache : activeLikeBtns,pg);
        // await apiConfig(api,method,data,pg);
    } catch (err) {
        console.log('err ->',err);
    }
}
// async function mouseClickIndex(id, activeLikeBtns) {
    // try {
        // const likeBtnState = heart.src.match(imgUrl + 'heart-fill.png') ? 1 : 0;
        // console.log('activeLikeBtns',activeLikeBtns);
        /*await fetch(`/articles/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: activeLikeBtnsCache || activeLikeBtns, pg: 'show' })
        });*/
        /*await apiConfig(`/articles/${id}`,'POST',activeLikeBtnsCache || activeLikeBtns,'show');
    } catch (err) {
        console.log('err ->',err);
    }
}*/
// const mouseClickIndex1 = (id, activeLikeBtns) => common2(`/articles/${id}`,'POST',activeLikeBtnsCache || activeLikeBtns,'show');
// const mouseClickIndex = (activeLikeBtns, id) => apiConfig(activeLikeBtnsCache || activeLikeBtns,id,'show');
const mouseClickIndex = (activeLikeBtns, id) => apiConfig(activeLikeBtns,id,'show');

// async function mouseClickEdit(id, activeLikeBtns) {
    // try {
        /*await fetch(`/articles/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: activeLikeBtnsCache || activeLikeBtns })
        });*/
        /*await apiConfig(`/articles/${id}`,'POST',activeLikeBtnsCache || activeLikeBtns);
    } catch (err) {
        console.log('err ->',err);
    }
}*/
// const mouseClickEdit1 = (id, activeLikeBtns) => common2(`/articles/${id}`,'POST',activeLikeBtnsCache || activeLikeBtns);
// const mouseClickEdit = (activeLikeBtns, id) => apiConfig(activeLikeBtnsCache || activeLikeBtns,id);
const mouseClickEdit = apiConfig;

