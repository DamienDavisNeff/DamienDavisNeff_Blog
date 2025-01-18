const fs = require('fs');
const path = require('path');
const generateHTMLPage = require('./generate_files');

const args = process.argv.slice(2);
const directoryToRead = args[0]; // Read Directory
const directoryToCreate = args[1]; // Create Directory
const forceGenerate = args.includes('-f'); // Force Recreate a File
const forceGenerateAll = args.includes('-fg'); // Force Recreate All Files
const fileToGenerate = args.find(arg => !arg.startsWith('-') && arg !== directoryToRead && arg !== directoryToCreate); // While file to force recreate

if (!fs.existsSync(directoryToRead)) {
    console.error(`Error: The directory to read from (${directoryToRead}) does not exist.`);
    process.exit(1);
}
if (!fs.existsSync(directoryToCreate)) {
    console.error(`Error: The directory to create files in (${directoryToCreate}) does not exist.`);
    process.exit(1);
}

function fileExists(filename) {
    return fs.existsSync(path.join(directoryToCreate, `${filename}.html`));
}

function generateFile(file) {
    const content = fs.readFileSync(path.join(directoryToRead, file), 'utf-8');
    const htmlContent = generateHTMLPage(content, path.join(directoryToRead, file));
    const outputFile = path.join(directoryToCreate, `${path.basename(file, '.txt')}.html`);
    fs.writeFileSync(outputFile, htmlContent);
    console.log(`Generated: ${outputFile}`);
}

fs.readdirSync(directoryToRead).forEach(file => {
    if (file.endsWith('.txt')) {
        const filenameWithoutExt = path.basename(file, '.txt');

        if (fileToGenerate && filenameWithoutExt !== fileToGenerate) {
            return;
        }

        if (!fileExists(filenameWithoutExt) || forceGenerate || forceGenerateAll) {
            generateFile(file);
        } else {
            console.log(`Skipping: ${file} (already exists)`);
        }
    }
});

// If -fg flag was passed, regenerate all files
if (forceGenerateAll) {
    console.log("Regenerating all files...");
    fs.readdirSync(directoryToRead).forEach(file => {
        if (file.endsWith('.txt')) {
            generateFile(file);
        }
    });
}
