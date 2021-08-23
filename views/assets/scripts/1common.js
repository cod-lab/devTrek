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

