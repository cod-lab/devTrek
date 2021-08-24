const imgUrl = 'http://localhost:5000/images/likebtns/';
const heart = document.getElementById('heart');

// let likeBtnState;
function refreshPg(likeBtnState) {
    console.log('likeBtnState',typeof likeBtnState,likeBtnState); // ,'\nlikeBtnState',likeBtnState,typeof likeBtnState);
    // likeBtnState = String(likeBtnState || '') || x;
    // likeBtnState = likeBtnState === undefined ? x : likeBtnState;
    // if(likeBtnState === '1') heart.src = imgUrl + 'heart-fill.png';
    // if(likeBtnState === '1' || likeBtnState === 1) heart.src = imgUrl + 'heart-fill.png';
    if(likeBtnState === '1') heart.src = imgUrl + 'heart-fill.png';
}

/*function mouseOverLike(x) {
    const heart = document.getElementById('heart');
    if((heart.classList)[1] === 'bi-heart') {
        heart.classList.remove('bi-heart');
        heart.classList.add('bi-heart-fill');
    }
}
function mouseOutLike(x) {
    const heart = document.getElementById('heart');
    if((heart.classList)[1] === 'bi-heart-fill') {
        heart.classList.remove('bi-heart-fill');
        heart.classList.add('bi-heart');
    }
}*/
/*function mouseOverLike(x) {
    const heart = document.getElementById('heart');
    if(heart.src.match('http://localhost:5000/images/likebtns/31611.png'))
        heart.src = 'http://localhost:5000/images/likebtns/31414-2.png';
}

function mouseOutLike(x) {
    const heart = document.getElementById('heart');
    if(heart.src.match('http://localhost:5000/images/likebtns/31414-2.png'))
        heart.src = 'http://localhost:5000/images/likebtns/31611.png';
}*/

function common(beforeImg, afterImg) {
    if(heart.src.match(`${imgUrl + beforeImg}.png`))
        heart.src = `${imgUrl + afterImg}.png`;
}
const mouseOverLike = () => common('heart-empty','heart-fill2');
const mouseOutLike = () => common('heart-fill2','heart-empty');

async function mouseClickLike(btn, y, id) {
    event.preventDefault();     // prevent pg from default reloading, default submitting, or default redirecting
    // const heart = document.getElementById('heart');
    // y.classList.remove('bi-heart');
    // y.classList.add('bi-heart-fill');
    // console.log(heart.classList);
    // if(likeBtnState) {
    //     heart.classList.remove('bi-heart');
    //     heart.classList.add('bi-heart-fill');
    // }
    // const x = heart.classList;

    /*console.log((heart.classList)[1],typeof (heart.classList)[1]);
    if((heart.classList)[1] === 'bi-heart') {
        heart.classList.remove('bi-heart');
        heart.classList.add('bi-heart-fill');
    } else {
        heart.classList.remove('bi-heart-fill');
        heart.classList.add('bi-heart');
    }*/

    // console.log(heart.src === 'http://localhost:5000/images/likebtns/31611.png');
    /*if(heart.src.match(imgUrl + 'heart-fill.png'))
        heart.src = imgUrl + 'heart-empty.png';
    else heart.src = imgUrl + 'heart-fill.png';*/

    try {
        [heart.src, likeBtnState] = heart.src.match(imgUrl + 'heart-fill.png') ?
            [imgUrl + 'heart-empty.png', 0] :
            [imgUrl + 'heart-fill.png', 1];

        console.log('1 likeBtnState',likeBtnState);

        const response = await fetch(`/articles/like/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:  JSON.stringify({ likeBtnState })
        });
        const { likes } = await response.json();
        document.getElementsByClassName('d-inline')[0].innerText = likes;

        console.log('2 likeBtnState',likeBtnState);

        // setting like btn state for fn fn1() for refresh pg condn.
        // fn1(likeBtnState);
        await fetch(`/articles/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:  JSON.stringify({ likeBtnState })
        });

    } catch (err) {
        console.log('err ->',err);
    }
}

async function mouseClickIndex(id) {
    try {
        // console.log('heart',heart.src);
        const likeBtnState = heart.src.match(imgUrl + 'heart-fill.png') ? 1 : 0;

        await fetch(`/articles/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:  JSON.stringify({ likeBtnState, pg: 'show' })
        });
    } catch (err) {
        console.log('err ->',err);
    }
}

