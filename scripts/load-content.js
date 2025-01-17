function ContentToHTML(content) {
    // console.log(content.split("\n"));
    contentByLine = content.split("\n");
    let htmlContent = "";
    for(line in contentByLine) {
        if(contentByLine[line] == "\r") continue;
        if(contentByLine[line].startsWith("//")) continue;
        if(contentByLine[line].startsWith("# ")) {
            const titleContent = contentByLine[line].replace("# ","");
            htmlContent+= `<h1>${titleContent}</h1>`;
            continue;
        }
        if(contentByLine[line].startsWith("## ")) {
            const subTitleContent = contentByLine[line].replace("## ","");
            htmlContent+= `<h2>${subTitleContent}</h2>`;
            continue;
        }
        if(contentByLine[line].startsWith("Author: ")) {
            const authorContent = contentByLine[line].replace("Author: ","");
            htmlContent+= `<p class="author">Written by: <em>${authorContent}</em></p>`;
            continue;
        }
        if(contentByLine[line].startsWith("Date: ")) {
            const dateContent = contentByLine[line].replace("Date: ","");
            htmlContent+= `<p class="date">Published on: <em>${dateContent}</em></p>`;
            continue;
        }
        if(contentByLine[line].startsWith("![")) {
            const altText = contentByLine[line].split("![")[1].split("]")[0]
            const imageSource = contentByLine[line].split("![")[1].split("]")[1].split("(")[1].split(")")[0];
            htmlContent+= `<img src="${imageSource}" alt="${altText}">`;
            continue;
        }
        if(contentByLine[line].startsWith("-! ")) {
            const imageSubtitle = contentByLine[line].split("-! ")[1];
            htmlContent+= `<p class="image-subtitle">${imageSubtitle}</p>`;
            continue;
        }
        if(contentByLine[line].startsWith("-#! ")) {
            const imageSourceText = contentByLine[line].split("-#! ")[1];
            htmlContent+= `<p class="image-source">${imageSourceText}</p>`;
            continue;
        }
        if(contentByLine[line].startsWith("-# ")) {
            const sourceTitleContent = contentByLine[line].replace("-# ","");
            htmlContent+= `<p class="source-title">${sourceTitleContent}</p>`;
            continue;
        }
        if(contentByLine[line].startsWith("-#-")) {
            // console.log(contentByLine[line]);
            const sourceContent = contentByLine[line].replace("-#- ", "");
            const sourceTitle = sourceContent.split(": ")[0];
            const sourceLink = sourceContent.split(": ")[1];
            const sourceLinkTitle = sourceLink.split("[")[1].split("]")[0];
            const sourceLinkHref = sourceLink.split("(")[1].split(")")[0];
            htmlContent+= `<ol class="source">${sourceTitle}: <a href="${sourceLinkHref}" target="_blank">${sourceLinkTitle}</a></ol>`;
            continue;
        }
        const paragraphContent = contentByLine[line].replace(/-\*-(.*?)-\*-/g, "<sup>$1</sup>");
        htmlContent+= `<p>${paragraphContent}</p>`;
    }
    return htmlContent;
}

function ParseContent(content) {
    return content;
}

function SetContent(content, id) {
    const parent = document.getElementById(id);
    parent.innerHTML = content;
}

function LoadAndRun(idOverride) {
    const url = new URL(window.location.href);
    let articleID = url.searchParams.get("id");

    if(idOverride != undefined) articleID = idOverride;

    if(articleID != undefined) {
        LoadAndParsePost(articleID);
        return;
    } else {
        if(url.pathname.startsWith("/posts/")) {
            articleID = url.pathname.split("/")[2].split(".html")[0];
            try {
                LoadAndParsePost(articleID);
            } catch(error) {
                articleID = document.getElementById("blog-content").getAttribute("blog-id");
                LoadAndParsePost(articleID);
                console.error(error)
            }
            return;
        }
        LoadFile("/posts/data/latest.txt")
            .then(latestID => {
                LoadAndParsePost(latestID);
            })
            .catch(error => {
                console.error(error);
            })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("loading").hidden = false;
    try {
        LoadAndRun();
    } catch(error) {
        document.getElementById("error").hidden = false;
    }
    document.getElementById("loading").hidden = true;
})

function LoadAndParsePost(blogID) {
    LoadFile(`/posts/raw/${blogID}.txt`)
        .then(content => {
            // console.log(content);
            return content;
        })
        .then(content => {
            const contentHTML = ContentToHTML(content);
            // console.log(contentHTML);
            return contentHTML;
        })
        .then(parsedContent => {
            SetContent(parsedContent, "blog-content");
            document.getElementById("blog-content").setAttribute("blog-id", blogID);
            document.title = document.getElementById("blog-content").querySelector("h1").textContent;
        })
        .catch(error => console.error(error));
}