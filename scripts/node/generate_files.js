const fs = require("fs");
const path = require("path");

function ContentToHTML(content) {

    const contentByLine = content.split("\n");
    let htmlContent = "";
    let metaTitle = "";
    let metaAuthor = "";
    let metaImage = "";
    let foundImage = false;

    for (let line of contentByLine) {
        if (line === "\r" || line.startsWith("//")) continue;
        if (line.startsWith("# ")) {
            const titleContent = line.replace("# ", "");
            htmlContent += `<h1>${titleContent}</h1>`;
            if (!metaTitle) metaTitle = titleContent;
            continue;
        }
        if (line.startsWith("## ")) {
            const subTitleContent = line.replace("## ", "");
            htmlContent += `<h2>${subTitleContent}</h2>`;
            continue;
        }
        if (line.startsWith("Author: ")) {
            const authorContent = line.replace("Author: ", "");
            if (!metaAuthor) metaAuthor = authorContent;
            htmlContent += `<p class="author">Written by: <em>${authorContent}</em></p>`;
            continue;
        }
        if (line.startsWith("Date: ")) {
            const dateContent = line.replace("Date: ", "");
            htmlContent += `<p class="date">Published on: <em>${dateContent}</em></p>`;
            continue;
        }
        if (line.startsWith("![")) {
            const altText = line.split("![")[1].split("]")[0];
            const imageSource = line.split("![")[1].split("]")[1].split("(")[1].split(")")[0];
            htmlContent += `<img src="${imageSource}" alt="${altText}">`;
            if (!foundImage) {
                metaImage = imageSource;
                foundImage = true;
            }
            continue;
        }
        if (line.startsWith("-! ")) {
            const imageSubtitle = line.split("-! ")[1];
            htmlContent += `<p class="image-subtitle">${imageSubtitle}</p>`;
            continue;
        }
        if (line.startsWith("-#! ")) {
            const imageSourceText = line.split("-#! ")[1];
            htmlContent += `<p class="image-source">${imageSourceText}</p>`;
            continue;
        }
        if (line.startsWith("-# ")) {
            const sourceTitleContent = line.replace("-# ", "");
            htmlContent += `<p class="source-title">${sourceTitleContent}</p>`;
            continue;
        }
        if (line.startsWith("-#-")) {
            const sourceContent = line.replace("-#- ", "");
            const sourceTitle = sourceContent.split(": ")[0];
            const sourceLink = sourceContent.split(": ")[1];
            const sourceLinkTitle = sourceLink.split("[")[1].split("]")[0];
            const sourceLinkHref = sourceLink.split("(")[1].split(")")[0];
            htmlContent += `<ol class="source">${sourceTitle}: <a href="${sourceLinkHref}" target="_blank">${sourceLinkTitle}</a></ol>`;
            continue;
        }
        const paragraphContent = line.replace(/-\*-(.*?)-\*-/g, "<sup>$1</sup>");
        htmlContent += `<p>${paragraphContent}</p>`;
    }

    return { htmlContent, metaTitle, metaAuthor, metaImage };
}

function GenerateHTMLPage(content, fullFilePath) {

    const { htmlContent, metaTitle, metaAuthor, metaImage } = ContentToHTML(content);
    const filename = path.basename(fullFilePath, '.txt');

    return `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${metaTitle || "Untitled Post"}</title>
                <meta property="og:title" content="${metaTitle || "Untitled Post"}">
                <meta property="og:image" content="${metaImage || "/default-image.png"}">
                <meta property="og:author" content="${metaAuthor || "Unknown Author"}">
                <meta property="og:type" content="article">
                <link rel="stylesheet" href="/blog/style/root.css">
                <link rel="stylesheet" href="/blog/style/blog-content.css">
                <link rel="stylesheet" href="/blog/style/blog-browser.css">
                <link rel="stylesheet" href="/blog/style/other.css">
                <script src="/blog/scripts/root.js"></script>
                <script src="/blog/scripts/dark-mode-manager.js"></script>
            </head>
            <body dark-mode="false">
                <div id="blog-content" blog-id="${filename}">
                    ${htmlContent}
                </div>
                <div id="blog-browser" type="desktop">
                    <div id="placeholder-browser-content" hidden></div>
                    <div id="blog-browser-content">
                        <div id="all-blog-browser-content" hidden></div>
                    </div>
                    <div id="buttons">
                        <button id="browse-left">←</button>
                        <button id="browse-right">→</button>
                    </div>
                </div>
                <script src="/blog/scripts/single-page/load-blog-browser.js"></script>
                <script src="/blog/scripts/single-page/blog-browser.js"></script>
                <button onclick="toggleDarkMode();" id="darkModeButton" hidden>Toggle Dark Mode</button>
            </body>
            <!-- This file was automatically generated -->
        </html>
    `;

}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error("Usage: node generate_files.js <input-file-path> <output-file-path>");
    process.exit(1);
}

const contentFile = path.resolve(args[0]) || undefined;
const outputFile = path.resolve(args[1]) || undefined;

fs.readFile(contentFile, "utf8", (err, data) => {

    if (err) {
        console.error("Error reading content file:", err);
        return;
    }

    const htmlPage = GenerateHTMLPage(data,contentFile);
    fs.writeFile(outputFile, htmlPage, "utf8", (err) => {
        if (err) {
            console.error("Error writing HTML file:", err);
        } else {
            console.log("HTML file generated successfully!");
        }
    });

});

module.exports = GenerateHTMLPage;
