let initialized = false;
function InitBrowser() {
    UpdateBrowser();
    initialized = true;
}

document.getElementById("browse-left").addEventListener("click", () => {
    if(!initialized) return;
    BrowseLeft();
    UpdateBrowser();
});
document.getElementById("browse-right").addEventListener("click", () => {
    if(!initialized) return;
    BrowseRight();
    UpdateBrowser();
});

let currentActive = [];
let currentInactive = [];
function UpdateBrowser() {

    let allItems = [];
    let activeItems = [];
    let inactiveItems = [];

    const items = document.getElementsByClassName("blog-browser-item");
    for(let a = 0; a < items.length; a++) {
        allItems.push({
            item: items[a],
            id: items[a].getAttribute("browse-id"),
        })
    };

    for(let a = 0; a < allItems.length; a++) {
        if(a < 3) {
            activeItems.push(allItems[a]);
            continue;
        }
        inactiveItems.push(allItems[a]);
    }

    
    currentActive = activeItems;
    currentInactive = inactiveItems;

    DisplayItems(allItems, currentActive, currentInactive);

}

function DisplayItems(allItems, active,inactive) {

    const placeholderParent = document.getElementById("placeholder-browser-content");
    const activeParent = document.getElementById("blog-browser-content");
    const inactiveParent = document.getElementById("all-blog-browser-content");

    for(let a = 0; a < allItems.length; a++) {
        placeholderParent.appendChild(allItems[a].item);
    }

    for(let a = 0; a < active.length; a++) {
        activeParent.appendChild(active[a].item);
    }

    for(let a = 0; a < inactive.length; a++) {
        inactiveParent.appendChild(inactive[a].item);
    }

}

function BrowseLeft() {

    let allItems = [];

    const movedToInactive = currentActive.shift();
    currentInactive.push(movedToInactive);

    const movedToActive = currentInactive.shift();
    currentActive.push(movedToActive);

    for(let a = 0; a < currentActive.length; a++) {
        allItems.push(currentActive[a]);
    }
    for(let b = 0; b < currentInactive.length; b++) {
        allItems.push(currentInactive[b]);
    }

    DisplayItems(allItems, currentActive, currentInactive);

}
function BrowseRight() {

    let allItems = [];

    const movedToInactive = currentActive.pop();
    currentInactive.unshift(movedToInactive);

    const movedToActive = currentInactive.pop();
    currentActive.unshift(movedToActive);

    for(let a = 0; a < currentActive.length; a++) {
        allItems.push(currentActive[a]);
    }
    for(let b = 0; b < currentInactive.length; b++) {
        allItems.push(currentInactive[b]);
    }

    DisplayItems(allItems, currentActive, currentInactive);

}