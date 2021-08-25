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
const mouseClickIndex = (activeLikeBtns, id) => callApi(activeLikeBtns,id,'edit/new');
const mouseMoveShow = callApi;

