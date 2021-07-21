import { genericFetch, getData, sendCredentials, sendName } from "./httpServices";
import { state, toggleNavButton } from "./appState";
import { createCards, displayNewPage, displayNewPics, setCardBtnsEnabled, setPageTitle } from "./picsManipulation";
import { IResponse } from "./models";
import "./login";
import "./categoryManagement";
import "./styles.css";
import { sendRegistration } from "./login";
import { clearDom, setUsersCategories } from "./categoryManagement";
let noPics = state.getNoPics();

window.onpopstate = async function (event) {
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

document.querySelector('.form-btn').addEventListener("click", clickedSendButton); //send Name
(document.querySelector("form") as HTMLFormElement).addEventListener("submit", clickedSendButton); //send Name
document.querySelector('.refresh-btn').addEventListener("click", goToRandDogsPage) // Get other dogs
document.querySelectorAll('.request-btn').forEach(btn => {
    btn.addEventListener("click", goToCategoryPage); //get labeled dogs
});
document.querySelectorAll('.pageNav').forEach(elem => {
    // elem.addEventListener("click", changePage); //page navigation
    (elem as HTMLButtonElement).onclick = changePage;
});

document.getElementById("logout").addEventListener("click", goToStart);

async function clickedSendButton(event) {
    event.preventDefault();
    if ((document.location.toString()).split("/").pop() == "register") {
        let userName = (document.getElementById('name') as HTMLInputElement).value;
        let userPass = (document.getElementById('password') as HTMLInputElement).value;
        await sendRegistration(userName, userPass);
    }
    else {
        await clickedStartButton();
    }
}

async function clickedStartButton() {
    let resp = await sendCredentials();
    if (resp === -1) return;
    window.history.pushState({}, "", "random_dogs");
    let data = await getData(noPics);
    (document.querySelector(".del-cat") as HTMLButtonElement).style.display = "none";
    (document.querySelector(".edit-cat") as HTMLButtonElement).style.display = "none";
    clearDom();
    (document.getElementById("menu-name") as HTMLSpanElement).innerText = state.Name;
    await setUsersCategories();
    changeAppearance(data);
}

export async function goToRandDogsPage() {
    window.history.pushState({}, "", "random_dogs");
    (document.querySelector(".del-cat") as HTMLButtonElement).style.display = "none";
    (document.querySelector(".edit-cat") as HTMLButtonElement).style.display = "none";
    document.querySelector(".change-cat-input").classList.remove("extend-cat-input");
    await clickedRefreshButton();
}

async function clickedRefreshButton() {
    setCardBtnsEnabled();
    let data = await getData(noPics);
    displayNewPics(data);
}

let changeAppearance = (data: any) => {
    (document.querySelector(".register") as HTMLElement).style.display = "none";
    let mainContainer: HTMLElement = document.querySelector('.main-container');
    mainContainer.style.display = "none";
    (document.querySelector(".login-menu") as HTMLElement).style.display = "block";
    //if(!state.LoggedOnce) {
    createCards();
    state.LoggedOnce = true;
    //}
    displayNewPics(data);
    let divPicsRef = document.querySelector(".pics-container");
    (divPicsRef as HTMLElement).style.display = "flex";
}

export async function goToCategoryPage() {
    let text = this.innerText;
    // text.includes("Silly") ? text = "silly" : text = "adorable"; //this used to work when there were buttons
    window.history.pushState({}, "", `${text}_dogs`);
    await clickedRequestButton(text);
}


async function clickedRequestButton(text: string) {
    setPageTitle(`These are your ${text} dogs`);
    (document.querySelector(".pageContainer") as HTMLElement).style.display = "flex";
    let response: IResponse = await genericFetch("GET", "preferences?", { id: state.getSessionId(), category: text, name: state.Name }, undefined);
    setCardBtnsEnabled();
    state.setReceivedLinks(response.links);
    makeElementsVisible(response, text);
    state.setCurrentPage(1);
    toggleNavButton();
}

function makeElementsVisible(response: IResponse, text: string) {
    (document.querySelector(".del-cat") as HTMLButtonElement).style.display = "block";
    (document.querySelector(".edit-cat") as HTMLButtonElement).style.display = "block";
    let i = 0;
    let imgs = document.querySelectorAll("img");
    let divs: HTMLDivElement[] = Array.from(document.querySelectorAll(".card-div"));
    Array.from(document.querySelectorAll(".card-button")).forEach(
        (btn: HTMLButtonElement) => {
            if (btn.firstChild.nodeValue.toLowerCase() === text)
                btn.style.display = "none";
            else btn.style.display = "block";
        }
    )
    let icons: HTMLButtonElement[] = Array.from(document.querySelectorAll(".trashcan"));
    for (i; i < Math.min(response.links.length, noPics); i++) {
        //display pics and the right buttons i.e.
        //adorable if user is on silly dogs page, vice versa on the other page
        imgs[i].src = response.links[i];
        divs[i].style.display = "flex";
        icons[i].style.display = "block";
        // [...document.querySelectorAll(".form-btn.card-button")].forEach(btn => {
        //     if(btn.firstChild.nodeValue.toLowerCase() === text)
        // })
        // if (btns[2 * i].firstChild.nodeValue.toLowerCase() === text) {//REEEEEEEEEEEEEEEEEEEEFACTOR
        //     btns[i * 2].style.display = "none"
        //     btns[i * 2 + 1].style.display = "block";
        // }
        // else {
        //     btns[i * 2 + 1].style.display = "none";
        //     btns[i * 2].style.display = "block";
        // }
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

export function goToStart() {
    window.history.pushState({}, "", "/");
    (document.querySelector(".pageContainer") as HTMLDivElement).style.display = "none";
    (document.querySelector(".register") as HTMLDivElement).style.display = "block";
    (document.querySelector(".my-form") as HTMLFormElement).reset();
    let divs: HTMLDivElement[] = Array.from(document.querySelectorAll(".card-div"));
    (document.querySelector(".pics-container") as HTMLDivElement).style.display = "none";
    (document.querySelector(".login-menu") as HTMLElement).style.display = "none";
    setPageTitle("Dogs are awesome!");
    state.resetAlreadySent();
    for (let i = 0; i < Math.min(noPics, divs.length); i++) {
        (divs[i] as HTMLElement).style.display = "none";
    }
    let mainContainer: HTMLElement = document.querySelector('.main-container');
    mainContainer.style.display = "flex";
}

function returnFromStart() {
    let divs: HTMLDivElement[] = Array.from(document.querySelectorAll(".card-div"));
    (document.querySelector(".pics-container") as HTMLDivElement).style.display = "none";
    (document.querySelector(".login-menu") as HTMLElement).style.display = "block";
    setPageTitle("Dogs are awesome!");
    state.resetAlreadySent();
    for (let i = 0; i < noPics; i++) {
        (divs[i] as HTMLElement).style.display = "flex";
    }
    let mainContainer: HTMLElement = document.querySelector('.main-container');
    mainContainer.style.display = "none";
}




