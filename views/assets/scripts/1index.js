/*// hide and remove likeBtnState txt box from pg, its functionality will be there but it wont affect the pg structure/layout at all
const txt_boxes = document.getElementsByClassName("likeBtnState");
// console.log(y,typeof y,y.length);
// y.forEach(x => x.style.display = "none");
for(const txtBox of txt_boxes)
    txtBox.style.display = "none";*/

// let likeBtnState;
function likeBtnStateFromShow(likeBtnState, id, srcPg) {
    console.log('likeBtnState',typeof likeBtnState,likeBtnState,'\nid',typeof id,id,'\nsrcPg',typeof srcPg,srcPg);
    const btn = document.getElementById(id);
    if(srcPg === 'show' && likeBtnState === '1')
        [btn.style.color, btn.style.textShadow] = ['orange', '1px 1px 3px #ffa500'];
}

function common(btn, beforeColor, afterColor, txtShadow) {
    const btnColor = window.getComputedStyle(btn).color;
    if(btnColor === beforeColor)
        [btn.style.color, btn.style.textShadow] = [afterColor,txtShadow];
}

/*function mouseOverLike(btn) {
    // const btnColor = window.getComputedStyle(btn).color;
    // if(btnColor === 'rgb(169, 169, 169)')
    //     btn.style.color = '#ffa600';
    common(btn,'rgb(169, 169, 169)','#ffa600');
}

function mouseOutLike(btn) {
    // const btnColor = window.getComputedStyle(btn).color;
    // if(btnColor === 'rgb(255, 166, 0)')
    //     btn.style.color = 'darkgray';
    common(btn,'rgb(255, 166, 0)','darkgray');
}*/

const mouseOverLike = (btn) => common(btn,'rgb(169, 169, 169)','#ffa600','1px 1px 3px #ffa600');
const mouseOutLike = (btn) =>  common(btn,'rgb(255, 166, 0)','darkgray','0px 0px 0px #a9a9a9');

    // function likeFn() {
    // console.log(btn);
    // const bgColor = document.getElementById("like").style.color = "black";
    // for () {}
    /*let btn = document.getElementById("like");
    // const btn = document.querySelector('input');
    // var this_id = $(this).attr('like');
    // let bgColor = window.getComputedStyle(btn).backgroundColor;
    // let bgColor = document.getComputedStyle(btn).backgroundColor;
    btn.addEventListener("click", () => {
        // console.log(btn,bgColor);
        // if(bgColor === 'darkgray') btn.style.color = "black";
        // else btn.style.color = "darkgray";
        // btn.style.color = 'black'
    });*/
// }
// let btnClicked = 0;
// let btnId = 0;
// let switchOnCount = 0;

// let likeBtnState;

const apiConfig = (url, method, likeBtnState) => fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ likeBtnState })
});
function common2(btn, x, y) {
    const btnColor = window.getComputedStyle(btn).color;
    const likeBtnState = btnColor === 'rgb(255, 165, 0)' ? x : y;
    return { btnColor, likeBtnState };
}

async function mouseClickLike(btn) { //,x) {
    event.preventDefault();     // prevent pg from default reloading, default submitting, or default redirecting

    // for(let i=0; i<9; i++) {
        // console.log('is',id);
        // console.log('1');
        // const btn = document.getElementById(id);
        // console.log('x',x);

    try {
        // const btnColor = window.getComputedStyle(btn).color;

        // set like btn color and like btn state
        // [btn.style.color, likeBtnState, btn.style.textShadow] = btnColor === 'rgb(255, 165, 0)' ?
        // ['darkgray', 0, '0px 0px 0px #a9a9a9'] :
        // ['orange', 1, '1px 1px 3px #ffa500'];

        const { btnColor, likeBtnState } = common2(btn,0,1);

        [btn.style.color, btn.style.textShadow] = btnColor === 'rgb(255, 165, 0)' ?
            ['darkgray', '0px 0px 0px #a9a9a9'] :
            ['orange', '1px 1px 3px #ffa500'];

        /*const response = await fetch(`/articles/like/${btn.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likeBtnState })
        });*/
        const response = await apiConfig(`/articles/like/${btn.id}`,'PUT',likeBtnState);
        const { likes } = await response.json();
        // console.log(response,likes);
        // .then(res => res.text())
        // .then(data => console.log(data))
        // .catch(err => console.error(err));
        // document.getElementById(btn.id + btn.id).innerText = likeBtnState ? ++x : --x;
        document.getElementById(btn.id + btn.id).innerText = likes;
        // console.log(likeBtnState);
    } catch (err) {
        console.log('err ->',err);
    }

        // console.log('1 btnColor', typeof window.getComputedStyle(btn).color, window.getComputedStyle(btn).color);
        // console.log('1 btnColor', typeof btnColor, btnColor);
        // btn.addEventListener("mouseover", () => {btn.style.color = 'black';});
        // btnColor = window.getComputedStyle(btn).color;
        // console.log('2 btnColor',btnColor);
        // console.log('3');
        // console.log(btnColor,typeof btnColor,btnColor === 'rgb(0, 0, 0)');
        // console.log('4');
        // document.getElementById(id).style.color = 'rgb(0, 0, 0)';
        // let x = 1;
        // btn.style.color = btnColor === '#010000' ? '#000000' : '#a9a9a9';

        /*if(btnColor === 'rgb(1, 0, 0)') btn.style.color = 'black';
        if(btnColor === 'rgb(0, 0, 0)') btn.style.color = 'darkgray';
        btn.addEventListener("mouseover", () => {
            btn.style.color = 'black';
            // if(btnColor === 'rgb(0, 0, 0)') btn.style.color = 'darkgray';
        });
        btn.addEventListener("mouseover", () => {
            if(btnColor === 'rgb(0, 0, 0)') btn.style.color = 'darkgray';
        });
        if(btnColor === 'rgb(169, 169, 169)') btn.style.color = 'black';*/

        /*console.log(btnClicked);
        if(!btnClicked) { // && !btnId) {   // like btn off
            btnClicked++;   // like btn on
            btnId = id;
            btn.style.color = 'black';
            // btn.h
        } else {
        // if(btnClicked && btnId === id) {
            btnClicked--;   // like btn off
            btnId = 0;
            btn.style.color = 'darkgray';
        }
        console.log(btnClicked);*/

        /*console.log(btnId);
        if(btnId !== id) {
            btnId = id;
            btn.style.color = 'black';
        } else {
            btnId = 0;
            btn.style.color = 'darkgray';
        }
        console.log(btnId);*/

        /*console.log(btnId, btnClicked, '\t',btnColor);
        if(!btnClicked && btnId !== id) {
            btnClicked++;
            btnId = id;
            btn.style.color = 'orange';
            // switchOnCount++;
        } else if(!btnClicked && btnId === id) {
            btnClicked++;
            btnId = 0;
            btn.style.color = 'orange';
        } else if(btnClicked && btnId !== id) {
            // btnClicked--;
            // switchOnCount--;
            btnId = id;
            // if(!switchOnCount) {
                btn.style.color = 'orange';
            // } else {
                // btn.style.color = 'darkgray';
            // }
        } else if(btnClicked && btnId === id) {
            btnClicked--;
            btnId = 0;
            btn.style.color = 'darkgray';
        }
        console.log(btnId, btnClicked, '\t',btnColor);*/
    // }
    // if(btnColor === 'rgb(169, 169, 169)') {
    //     btn.style.color = 'orange';
    // } else btn.style.color = 'darkgray';

    // set like btn color
    /*let likeBtnState;
    /*if(btnColor === 'rgb(255, 165, 0)') {
        btn.style.color = 'darkgray';
        likeBtnState = 0;
    } else {
        btn.style.color = 'orange';
        likeBtnState = 1;
    }*/

    // set like btn state in hidden txt box
    // console.log('id',btn.id, typeof btn.id);
    // btnColor = window.getComputedStyle(btn).color;
    // const likeBtnState = document.getElementById(btn.id + btn.id);
    // likeBtnState.value = btnColor === 'rgb(255, 165, 0)' ? 'on' : 'off';

    // console.log('2 btnColor', typeof window.getComputedStyle(btn).color, window.getComputedStyle(btn).color);
}

/*function likeFn1(id, btnClicked) {
    let x = parseInt(id)+1;
    const btn = document.getElementById(id);
    console.log(id,x);
    if(x === parseInt(id)+1) {
        // btnClicked++;
        x++;
        btn.style.color = 'orange';
    }
    else {
        // btnClicked--;
        x--;
        btn.style.color = 'darkgray';
    }
}*/

async function mouseClickShow(id) {
    // console.log('id',id);
    try {
        const btn = document.getElementById(id);
        // const btnColor = window.getComputedStyle(btn).color;
        // console.log('btnColor',btnColor);
        // const likeBtnState = btnColor === 'rgb(255, 165, 0)' ? 1 : 0;

        const { likeBtnState } = common2(btn,1,0);

        /*await fetch(`/articles/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likeBtnState })
        });*/
        await apiConfig(`/articles/${id}`,'POST',likeBtnState);
    } catch (err) {
        console.log('err ->',err);
    }
}

async function mouseClickEdit(articles, id) {
    try {
        const btn = document.getElementById(id);
        const { likeBtnState } = common2(btn,1,0);
        await apiConfig(`/articles/${id}`,'POST',likeBtnState);
    } catch (err) {
        console.log('err ->',err);
    }
}

