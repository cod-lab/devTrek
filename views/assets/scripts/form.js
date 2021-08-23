// const { apiConfig } = require('./common');

/*const callApi = (api, method, data, pg) => fetch(api, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data, pg })
});
async function apiConfig(activeLikeBtns, id, pg) {
    try {
        await callApi(`/articles/${id || 0}`,'POST',activeLikeBtns,pg);
    } catch (err) {
        console.log('err ->',err);
    }
}*/
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
/*async function mouseClickIndex(id, activeLikeBtns) {
    try {
        await fetch(`/articles/${id || 0}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: activeLikeBtns, pg: 'edit/new' })
        });
    } catch (err) {
        console.log('err ->',err);
    }
}*/
const mouseClickIndex = (activeLikeBtns, id) => callApi(activeLikeBtns,id,'edit/new');

/*async function mouseMoveShow(id, activeLikeBtns) {
    try {
        await fetch(`/articles/${id || 0}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: activeLikeBtns })
        });
    } catch (err) {
        console.log('err ->',err);
    }
}*/
const mouseMoveShow = callApi;

