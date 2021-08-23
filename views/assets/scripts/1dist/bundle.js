(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
exports.callApi = (api, method, data, pg) => fetch(api, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, pg })
});
exports.apiConfig = async (activeLikeBtns, id, pg) => {
    try {
        await callApi(`/articles/${id || 0}`,'POST',activeLikeBtns,pg);
    } catch (err) {
        console.log('err ->',err);
    }
};


},{}],2:[function(require,module,exports){
const { callApi, apiConfig } = require('./common');
// import { callApi, apiConfig } from './common.js';
/*const script1 = document.createElement('script');
script1['data-main'] = '/scripts/common';
script1.src = '/scripts/require.js';
// console.log('script1',script1);

const script2 = document.createElement('script');
script2.appendChild(require('/scripts/common.js'));
console.log('script2',script2);*/




// const q = [];
function fromOtherPg(activeLikeBtns, srcPg) {
    // console.log('likeBtnState',typeof likeBtnState,likeBtnState,'\nid',typeof id,id,'\nsrcPg',typeof srcPg,srcPg);
    /*const btn = document.getElementById(id);
    if(srcPg === 'show' && likeBtnState === '1')
        [btn.style.color, btn.style.textShadow] = ['orange', '1px 1px 3px #ffa500'];*/
    // let a='';
    // console.log('q',q);
    // console.log('activeLikeBtns',activeLikeBtns || false,typeof activeLikeBtns,activeLikeBtns);
    // activeLikeBtns = activeLikeBtns.split(',');
    // console.log('activeLikeBtns',typeof activeLikeBtns,activeLikeBtns,'\nsrcPg',srcPg);
    // if((srcPg === 'show' || srcPg === 'edit/new') && activeLikeBtns) {
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


/*const apiConfig1 = (api, method, data) => fetch(api, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data })
});*/
/*function common2(btn, x, y) {
    const btnColor = window.getComputedStyle(btn).color;
    // const likeBtnState = btnColor === 'rgb(255, 165, 0)' ? x : y;
    // return { btnColor, likeBtnState };
    return btnColor === 'rgb(255, 165, 0)' ? x : y;
}*/

const activeLikeBtnsCache = [];

async function mouseClickLike(btn) { //, activeLikeBtns) {
    event.preventDefault();     // prevent pg from default reloading, default submitting, or default redirecting

    try {
        // const { btnColor, likeBtnState } = common2(btn,0,1);
        // const likeBtnState = common2(btn,0,1);
        // let likeBtnState, activeLikeBtns;
        // activeLikeBtns = x || activeLikeBtns;
        let likeBtnState;
        // console.log('1 likeBtnState',typeof likeBtnState,likeBtnState);

        /*[btn.style.color, btn.style.textShadow] = btnColor === 'rgb(255, 165, 0)' ?
        ['darkgray', '0px 0px 0px #a9a9a9'] :
        ['orange', '1px 1px 3px #ffa500'];*/
        // if(btnColor === 'rgb(255, 165, 0)') {

        // console.log('1 activeLikeBtns',typeof activeLikeBtns,activeLikeBtns);
        // console.log('1 q',typeof q,q);
        // activeLikeBtns = activeLikeBtns ? activeLikeBtns.split(',') : [];
        const btnColor = window.getComputedStyle(btn).color;
        if(btnColor === 'rgb(255, 165, 0)') {
            [btn.style.color, btn.style.textShadow, likeBtnState] = ['darkgray', '0px 0px 0px #a9a9a9', 0];
            // const i = activeLikeBtns.indexOf(btn.id);
            // activeLikeBtns.splice(i,1);
            const i = activeLikeBtnsCache.indexOf(btn.id);
            activeLikeBtnsCache.splice(i,1);
        } else {
            [btn.style.color, btn.style.textShadow, likeBtnState] = ['orange', '1px 1px 3px #ffa500', 1];
            // activeLikeBtns.push(btn.id);
            activeLikeBtnsCache.push(btn.id);
        }
        // console.log('2 likeBtnState',typeof likeBtnState,likeBtnState);
        // console.log('2 activeLikeBtns',typeof activeLikeBtns,activeLikeBtns);
        // console.log('2 q',typeof q,q);
        /*const response = await fetch(`/articles/like/${btn.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likeBtnState })
        });*/
        const response = await callApi(`/articles/like/${btn.id}`,'PUT',likeBtnState);
        const { likes } = await response.json();
        // console.log('likes',likes);
        document.getElementById(btn.id + btn.id).innerText = likes;

        // preserving like btn state while refreshing pg
        // const response2 =
        /*await fetch(`/articles/${btn.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: q })
        });*/
        await callApi(`/articles/${btn.id}`,'POST',activeLikeBtnsCache);
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


/*async function common2(activeLikeBtns) {
    try {
        await apiConfig('/articles/0','POST',activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns);
        // await apiConfig(api,method,data);
    } catch (err) {
        console.log('err ->',err);
    }
}*/
// async function mouseClickShow(activeLikeBtns) { // , id) {
// const mouseClickShow = (activeLikeBtns) =>
// const mouseClickShow = common2;
    // try {
        /*await fetch(`/articles/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ likeBtnState })
        });*/
        // console.log('activeLikeBtns',typeof activeLikeBtns,activeLikeBtns);
        // console.log('2 q',q);
        // await apiConfig(`/articles/${id}`,'POST',q.length ? q : activeLikeBtns);
        // common2('/articles/0','POST',activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns);
    /*} catch (err) {
        console.log('err ->',err);
    }
}*/
// function mouseClickEdit(activeLikeBtns) { // , id) {
// const mouseClickEdit = (activeLikeBtns) =>
// const mouseClickEdit = common2;
// try {
        /*const btn = document.getElementById(id);
        const likeBtnState = common2(btn,1,0);
        await apiConfig(`/articles/${id}`,'POST',likeBtnState);*/
        // await apiConfig(`/articles/${id}`,'POST',q.length ? q : activeLikeBtns);
        // await apiConfig('/articles/0','POST',activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns);
        // common2('/articles/0','POST',activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns);
    /*} catch (err) {
        console.log('err ->',err);
    }*/
// }

// async function mouseClickNew(activeLikeBtns) {
// const mouseClickNew = (activeLikeBtns) =>
// const mouseClickNew = common2;
    // try {
        // const id = 0;
        // common2('/articles/0','POST',activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns);
    /*} catch (err) {
        console.log('err ->',err);
    }
}*/

// const [mouseClickShow, mouseClickEdit, mouseClickNew] = [common2,common2,common2];
const mouseClickShow = activeLikeBtns => apiConfig(activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns);
const mouseClickEdit = activeLikeBtns => apiConfig(activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns);
const mouseClickNew = activeLikeBtns => apiConfig(activeLikeBtnsCache.length ? activeLikeBtnsCache : activeLikeBtns);



},{"./common":1}]},{},[2]);
