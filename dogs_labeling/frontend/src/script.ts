import { getData, getPicsBackend, sendName } from "./httpServices";
import { setCurrentPage, noPics, getSessionId, setReceivedLinks, increasePage, decreasePage, getCurrentPage, getReceivedLinks, toggleNavButton } from "./appState";
import { createCards, displayNewPage, displayNewPics, setPageTitle } from "./picsManipulation";
import { myResponse } from "./models";
import "./styles.css";

document.querySelector('.form-btn').addEventListener("click", clickedStartButton); //send Name
(document.querySelector("form") as HTMLFormElement).addEventListener("submit", clickedStartButton); //send Name
document.querySelector('.refresh-btn').addEventListener("click", clickedRefreshButton) // Get other dogs
document.querySelectorAll('.request-btn').forEach(btn => {
    btn.addEventListener("click", clickedRequestButton); //get labeled dogs
});
document.querySelectorAll('.pageNav').forEach(elem => {
    elem.addEventListener("click", changePage); //page navigation
});


async function clickedStartButton() {
    event.preventDefault();
    await sendName();
    let data = await getData(noPics);
    changeAppearance(data);
}

async function clickedRefreshButton() {
    let data = await getData(noPics);
    displayNewPics(data);
}

let changeAppearance = (data: any) => {
    let mainContainer = document.querySelector('.main-container');
    (mainContainer as HTMLElement).style.display = "none";
    createCards();
    displayNewPics(data);
    let divPicsRef = document.querySelector(".pics-container");
    (divPicsRef as HTMLElement).style.display = "flex";
}



async function clickedRequestButton() {
    let text = this.innerText;
    text.includes("Silly") ? text = "silly" : text = "adorable";
    setPageTitle(`These are your ${text} dogs`);
    (document.querySelector(".pageContainer") as HTMLElement).style.display = "flex";
    let response: myResponse = await getPicsBackend({
        id: getSessionId(),
        category: text,
    });
    setReceivedLinks(response.links);
    makeElementsVisible(response, text);
    setCurrentPage(1);
    toggleNavButton();
}

function makeElementsVisible(response: myResponse, text: string) {
    let i = 0;
    let imgs = document.querySelectorAll("img");
    let divs: HTMLDivElement[] = Array.from(document.querySelectorAll(".card-div"));
    let btns: HTMLButtonElement[] = Array.from(document.querySelectorAll(".card-button"));
    let icons: HTMLButtonElement[] = Array.from(document.querySelectorAll(".trashcan"));
    for (i; i < Math.min(response.links.length, noPics); i++) {
        //display pics and the right buttons i.e.
        //adorable if user is on silly dogs page, vice versa on the other page
        imgs[i].src = response.links[i];
        divs[i].style.display = "flex";

        if (btns[2 * i].firstChild.nodeValue.toLowerCase() === text) {
            btns[i * 2].style.display = "none"
            btns[i * 2 + 1].style.display = "block";
        }
        else {
            btns[i * 2 + 1].style.display = "none";
            btns[i * 2].style.display = "block";
        }
        icons[i].style.display = "block";
    }
    for (i; i < noPics; i++) {
        //if there are fewer images than noPics do not display them
        divs[i].style.display = "none";
    }
}


function changePage() {
    let oldCurPage = getCurrentPage();
    if (this.innerText == "⬅")
        decreasePage();
    else
        increasePage();
    let currentPage = getCurrentPage();
    if (oldCurPage === currentPage) {
        //nothing to do if it s the same page
        return;
    }
    toggleNavButton();
    displayNewPage(currentPage);
}





