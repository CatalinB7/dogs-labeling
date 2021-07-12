//probably i should manage the state in another way
let sessionId = null;
let currentPage = 1;

export function increasePage() {
    if (currentPage === Math.ceil(receivedLinks.length / noPics))
        return;
    currentPage++;
    if (currentPage > Math.floor(receivedLinks.length / noPics))
        currentPage = Math.floor(receivedLinks.length / noPics) + 1;
}

export function decreasePage() {
    currentPage--;
    if (currentPage < 1)
        currentPage = 1;
}

export function getCurrentPage() {
    return currentPage;
}

export function setCurrentPage(value: number) {
    currentPage = value;
}



export const noPics = 8;
export const picWidth = 300;
export const alreadySent = {
    "silly": new Array(noPics).fill(false),
    "adorable": new Array(noPics).fill(false)
};

export function resetAlreadySent() {
    alreadySent["silly"] = new Array(noPics).fill(false);
    alreadySent["adorable"] = new Array(noPics).fill(false);
}
export function getSessionId() {
    return sessionId;
};

export function setSessionId(id: number) {
    sessionId = id;
};

let receivedLinks = [];

export function setReceivedLinks(links: string[]) {
    receivedLinks = links;
}

export function getReceivedLinks() {
    return receivedLinks;
}

export function toggleNavButton() {
    let navBtns: HTMLButtonElement[] = Array.from(document.querySelectorAll(".pageNav"));
    let [leftBtn, rightBtn] = navBtns;
    let links = getReceivedLinks();
    let currentPage = getCurrentPage();
    if (currentPage * noPics >= links.length) {
        rightBtn.disabled = true;
    } else {
        rightBtn.disabled = false;
    }
    if (currentPage > 1)
        leftBtn.disabled = false;
    else leftBtn.disabled = true;
}



