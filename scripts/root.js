function LoadFile(url) {
    return new Promise((resolve, reject) => {
        fetch(url)
            .then(response => {
                if(!response.ok) throw new Error(`ERROR STATUS: ${response.status}`);
                return response.text();
            })
            .then(text => resolve(text))
            .catch(e => reject(e));
    });
}