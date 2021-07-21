import { genericFetch, getData, sendName } from "./httpServices";
import { state, toggleNavButton } from "./appState";
import { createCards, displayNewPage, displayNewPics, setCardBtnsEnabled, setPageTitle } from "./picsManipulation";
import { IResponse } from "./models";
import "./styles.css";
let noPics = state.getNoPics();

window.onpopstate = async function (event) {
    console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
    let route = (document.location.toString()).split("/").pop();
    if (route == "random_dogs") {
        returnFromStart(); //only rand dogs can come after home page
        await clickedRefreshButton();
    }
    else if (route == "") {
        goToStart();
    } 
    else {
        //now checking the categories routes
        let text = route.split("_")[0];
        await clickedRequestButton(text);
    }
};

document.querySelector('.form-btn').addEventListener("click", clickedStartButton); //send Name
(document.querySelector("form") as HTMLFormElement).addEventListener("submit", clickedStartButton); //send Name
document.querySelector('.refresh-btn').addEventListener("click", goToRandDogsPage) // Get other dogs
document.querySelectorAll('.request-btn').forEach(btn => {
    btn.addEventListener("click", goToCategoryPage); //get labeled dogs
});
document.querySelectorAll('.pageNav').forEach(elem => {
    // elem.addEventListener("click", changePage); //page navigation
    (elem as HTMLButtonElement).onclick = changePage;
});

async function clickedStartButton(event) {
    window.history.pushState({}, "", "random_dogs");
    event.preventDefault();
    await sendName();
    let data = await getData(noPics);
    changeAppearance(data);
}

async function goToRandDogsPage() {
    window.history.pushState({}, "", "random_dogs");
    await clickedRefreshButton();
}

async function clickedRefreshButton() {
    setCardBtnsEnabled();
    let data = await getData(noPics);
    displayNewPics(data);
}

let changeAppearance = (data: any) => {
    let mainContainer: HTMLElement = document.querySelector('.main-container');
    mainContainer.style.display = "none";
    createCards();
    displayNewPics(data);
    let divPicsRef = document.querySelector(".pics-container");
    (divPicsRef as HTMLElement).style.display = "flex";
}

async function goToCategoryPage() {
    let text = this.innerText;
    text.includes("Silly") ? text = "silly" : text = "adorable";
    window.history.pushState({}, "", `${text}_dogs`);
    await clickedRequestButton(text);
}


async function clickedRequestButton(text: string) {
    setPageTitle(`These are your ${text} dogs`);
    (document.querySelector(".pageContainer") as HTMLElement).style.display = "flex";
    let response: IResponse = await genericFetch("GET", "preferences?", { id: state.getSessionId(), category: text }, undefined);
    setCardBtnsEnabled();
    state.setReceivedLinks(response.links);
    makeElementsVisible(response, text);
    state.setCurrentPage(1);
    toggleNavButton();
}

function makeElementsVisible(response: IResponse, text: string) {
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
        icons[i].style.display = "block";
        if (btns[2 * i].firstChild.nodeValue.toLowerCase() === text) {
            btns[i * 2].style.display = "none"
            btns[i * 2 + 1].style.display = "block";
        }
        else {
            btns[i * 2 + 1].style.display = "none";
            btns[i * 2].style.display = "block";
        }
    }
    for (i; i < noPics; i++) {
        //if there are fewer images than noPics do not display them
        divs[i].style.display = "none";
    }
}


function changePage() {
    let oldCurPage = state.getCurrentPage();
    if (this.innerText == "⬅")
        state.decreasePage();
    else
        state.increasePage();
    let currentPage = state.getCurrentPage();
    if (oldCurPage === currentPage) {
        //nothing to do if it s the same page
        return;
    }
    toggleNavButton();
    displayNewPage(currentPage);
}

function goToStart() {
    let divs: HTMLDivElement[] = Array.from(document.querySelectorAll(".card-div"));
    let divPics: HTMLDivElement = document.querySelector(".pics-container");
    divPics.style.display = "none";
    setPageTitle("Dogs are awesome!");
    state.resetAlreadySent();
    for (let i = 0; i < noPics; i++) {
        (divs[i] as HTMLElement).style.display = "none";
    }
    let mainContainer: HTMLElement = document.querySelector('.main-container');
    mainContainer.style.display = "flex";
}

function returnFromStart() {
    let divs: HTMLDivElement[] = Array.from(document.querySelectorAll(".card-div"));
    let divPics: HTMLDivElement = document.querySelector(".pics-container");
    divPics.style.display = "flex";
    setPageTitle("Dogs are awesome!");
    state.resetAlreadySent();
    for (let i = 0; i < noPics; i++) {
        (divs[i] as HTMLElement).style.display = "flex";
    }
    let mainContainer: HTMLElement = document.querySelector('.main-container');
    mainContainer.style.display = "none";
}




