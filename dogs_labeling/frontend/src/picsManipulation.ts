import { genericFetch } from "./httpServices";
import { setPageTitle, state, toggleNavButton } from "./appState";

let [ noPics, picWidth ] = [ state.getNoPics(), state.getPicWidth() ];

export function createCards() {
    //creating cards containing pics and 2 buttons
    for (let i = 0; i < noPics; i++) {
        insertNewCard(i, "block");
    }
}

export function savePic(idx: number) {
    return async function clickedSavePicButton() {
        let text = this.innerText;
        text.includes("Silly") ? text = "silly" : text = "adorable";
        this.disabled = true;
        if (state.getAlreadySent()[text][idx]) {
            return;
        }
        state.setAlreadySent(text, idx);
        let link = document.querySelectorAll("img")[idx].src;
        await genericFetch("POST", "preferences", undefined, { id: state.getSessionId(), link, category: text })
        //await postPreferences({ id: getSessionId(), link, category: text });
    }
}

function removeImage(idx: number) {
    return async function deleteImg() {
        let text = window.location.pathname;
        text = text.includes("silly") ? "silly" : "adorable";
        let link = document.querySelectorAll("img")[idx].src;
        let resp = await genericFetch("DELETE", "preferences?", { id: state.getSessionId(), category: text, link }, undefined);
        if(resp.status === 200) {
            state.setReceivedLinks(state.getReceivedLinks().filter(elem => elem != link));
            translatePics(state.getCurrentPage(), idx, state.getReceivedLinks());
        }
    }
}

function translatePics(currentPage: number, idx: number, links: string[]) {
    let imgs: HTMLImageElement[] = Array.from(document.querySelectorAll("img"));
    let i = idx;
    for(i; i < Math.min(noPics, links.length - (currentPage - 1) * noPics); i++) {
        imgs[i].src = links[(currentPage - 1) * noPics + i]; //first link on the next page after one got deleted
    }
    for(i; i < noPics; i++) {
        removeCard(i);
    }
    toggleNavButton();
}


function removeCard(idx: number) {
    let divs = document.querySelectorAll(".card-div");
    (divs[idx] as HTMLElement).style.display = "none";
}

function insertNewCard(i: number, displayedType: string) {
    let div = document.createElement("div");
    div.className = 'card-div';
    let img = document.createElement("img");
    img.alt = "Doggo";
    img.className = "pics";
    let button1 = document.createElement("button");
    let button2 = document.createElement("button");
    img.tabIndex = button1.tabIndex = button2.tabIndex = 0;
    button1.className = button2.className = "form-btn card-button";
    button1.innerText = "Silly";
    button2.innerText = "Adorable";
    let icon = document.createElement("button");
    icon.className = "trashcan";
    icon.addEventListener("click", removeImage(i));
    let spn = document.createElement("spn");
    spn.style.zIndex = "2";
    spn.setAttribute("data-icon", "octicon-trashcan");
    spn.className = "iconify";
    icon.append(spn);
    icon.setAttribute("data-icon", "octicon-trashcan");
    icon.style.display = "none";
    button1.addEventListener("click", savePic(i));
    button2.addEventListener("click", savePic(i));
    div.append(img, button1, button2, icon);
    div.style.display = displayedType;
    document.querySelector(".pics-container").append(div);
}


let displayNewPics = (data: any) => {
    (document.querySelector(".pageContainer") as HTMLElement).style.display = "none";
    let imgs = document.querySelectorAll("img");
    let divs = document.querySelectorAll(".card-div");
    let btns = document.querySelectorAll(".card-button");
    let icons = document.querySelectorAll(".trashcan");
    setPageTitle("Other random dogs!");
    state.resetAlreadySent();
    for (let i = 0; i < noPics; i++) {
        imgs[i].onload = onLoadImg;
        imgs[i].src = data.message[i];
        (divs[i] as HTMLElement).style.display = "flex";
        (btns[i * 2] as HTMLElement).style.display = "block";
        (btns[i * 2 + 1] as HTMLElement).style.display = "block";
        (icons[i] as HTMLElement).style.display = "none";
    }
}

function onLoadImg() {
    this.style.width = picWidth.toString() + "px";
}

export function setCardBtnsEnabled () {
    document.querySelectorAll(".form-btn.card-button").
    forEach(elem => (elem as HTMLButtonElement).disabled = false);
}

function displayNewPage(currentPage: number) {
    // interval is [ (pageNo -1 ) * noPics ... (pageNo * noPics - 1) ]
    let links = state.getReceivedLinks().slice((currentPage - 1) * noPics, currentPage * noPics);;
    let imgs = document.querySelectorAll("img");
    let divs = document.querySelectorAll(".card-div");
    for (let i = 0; i < links.length; i++) {
        (divs[i] as HTMLElement).style.display = "flex";
        imgs[i].src = links[i];
    }
    for (let i = links.length; i < noPics; i++) {
        (divs[i] as HTMLElement).style.display = "none";
    }
}

export { displayNewPage, displayNewPics, setPageTitle };


