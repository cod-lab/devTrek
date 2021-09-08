const imgUrl = '/graphics/likebtns/';
const heart = document.getElementById('heart');

function refreshPg(activeLikeBtns, id) {
    if(activeLikeBtns && activeLikeBtns.split(',').includes(id))
        heart.src = imgUrl + 'heart-fill.png';
}


function common(beforeImg, afterImg) {
    if(heart.src.match(`${imgUrl + beforeImg}.png`))
        heart.src = `${imgUrl + afterImg}.png`;
}
const mouseOverLike = () => common('heart-empty','heart-fill2');
const mouseOutLike = () => common('heart-fill2','heart-empty');


const callApi = (api, method, data) => fetch(api, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, pg: 'show' })
});

let activeLikeBtnsCache = [];
let likeBtn;

async function mouseClickLike(activeLikeBtns, id) {
    event.preventDefault();     // prevent pg from default reloading, default submitting, or default redirecting

    try {
        let likeBtnState;
        activeLikeBtnsCache = activeLikeBtns ? activeLikeBtns.split(',') : activeLikeBtnsCache;

        if(heart.src.match(imgUrl + 'heart-fill.png')) {
            [heart.src, likeBtnState] = [imgUrl + 'heart-empty.png', 0];

            if(activeLikeBtnsCache.length > 1) {
                const i = activeLikeBtnsCache.indexOf(id);
                activeLikeBtnsCache.splice(i,1);
            } else activeLikeBtnsCache.splice(0);   // delete all elements from index 0 but at the moment array has only 1 ele
        } else {
            [heart.src, likeBtnState] = [imgUrl + 'heart-fill.png', 1];

            if(!activeLikeBtnsCache.includes(id))
                activeLikeBtnsCache.push(id);
        }

        const response = await callApi(`/articles/like/${id}`,'PATCH',likeBtnState);    // stores no. of likes in db
        if(response.status !== 200) return alert('something went wrong!');
        else {
            const { likes } = await response.json();
            document.getElementsByClassName('d-inline')[0].innerText = likes;
        }

        await callApi(`/articles/${id}`,'POST',activeLikeBtnsCache);        // stores active like btns in memory(preserved until home pg is not refresh)

        likeBtn = 'clicked';
    } catch (err) {
        console.log('err ->',err);
    }
}


async function apiConfig(activeLikeBtns, id) {
    try {
        await callApi(`/articles/${id}`,'POST',likeBtn ? activeLikeBtnsCache : activeLikeBtns);     // stores active like btns in memory to transfer to another pg
    } catch (err) {
        console.log('err ->',err);
    }
}
const [mouseClickIndex, mouseClickEdit] = [apiConfig,apiConfig];

