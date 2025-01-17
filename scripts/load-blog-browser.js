document.addEventListener("DOMContentLoaded", () => {
    LoadAndBrowse();
});

function LoadAndBrowse() {

    const allItems = document.querySelectorAll(".blog-browser-item");
    for(let a = 0; a < allItems.length; a++) allItems[a].remove();

    LoadFile("/posts/data/browser.txt")
        .then(rawData => {
            const newData = rawData.replaceAll("\r","").split("\n");
            const parsedData = [];
            for(line in newData) {
                parsedData.push(`${newData[line]}.txt`);
            }
            return parsedData;
        })
        .then(parsedData => {
            return LoadBlogPosts(parsedData);
        })
        .then(parsedData => {
            return RemoveCurrentBlogpost();
        })
        .then(() => InitBrowser())
        .catch(error => {
            console.error(error);
        })

}

function LoadBlogPosts(posts) {
    
    const blogPromise = posts.map(post => {
        return LoadFile(`/posts/raw/${post}`)
            .then(content => ParseBrowserContent(content, post.replace(".txt","")))
            .then(postData => {
                DisplayBrowserContent(postData);
            })
            .catch(error => console.error(error));
    });
    return Promise.all(blogPromise);
}

function ParseBrowserContent(content, id) {
    contentByLine = content.split("\n");
    let title = undefined;
    let author = undefined;
    let date = undefined;
    let image = undefined;
    let altImage = undefined;
    for(line in contentByLine) {
        if(contentByLine[line] == "\r") continue;
        const currentLine = contentByLine[line].replaceAll("\r","");
        if(currentLine.startsWith("//")) continue;
        if(currentLine.startsWith("# ")) {
            title = currentLine.replace("# ","");
            continue;
        }
        if(currentLine.startsWith("Author: ")) {
            author = currentLine.replace("Author: ","");
            continue;
        }
        if(currentLine.startsWith("Date: ")) {
            date = currentLine.replace("Date: ","");
            continue;
        }
        if(image == undefined && currentLine.startsWith("![")) {
            altImage = currentLine.split("![")[1].split("]")[0]
            image = currentLine.split("![")[1].split("]")[1].split("(")[1].split(")")[0];
            continue;
        }
    }
    return {
        title: title,
        author: author,
        date: date,
        image: image,
        altImage: altImage,
        id: id
    }
}

function DisplayBrowserContent(content) {
    const parent = document.getElementById("placeholder-browser-content");
    let htmlContent = ``;
    htmlContent += `<div class="blog-browser-item" browse-id="${content.id}"">`;
    htmlContent += `<img src="${content.image}" alt="${content.altImage}">`;
    htmlContent += `<h3>${content.title}</h2>`;
    htmlContent += `<p class="author">Written by: <em>${content.author}</em></p>`;
    htmlContent += `<p class="date">Published on: <em>${content.date}</em></p>`;
    htmlContent += `</div>`;
    parent.innerHTML += htmlContent;
    return;
}

function RemoveCurrentBlogpost() {

    const items = document.getElementsByClassName("blog-browser-item");
    const activeID = document.getElementById("blog-content").getAttribute("blog-id");

    for(let a = 0; a < items.length; a++) {
        if(items[a].getAttribute("browse-id") == activeID) items[a].remove();
    }

}