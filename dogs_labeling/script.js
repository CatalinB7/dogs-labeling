const noPics = 8;
const picWidth = 300;
let name = null;

document.querySelector('.form-btn').addEventListener("click", clickedStartButton)
document.querySelector('.refresh-btn').addEventListener("click", clickedRefreshButton)
document.querySelectorAll('.request-btn')[0].addEventListener("click", clickedRequestButton);
document.querySelectorAll('.request-btn')[1].addEventListener("click", clickedRequestButton);

async function clickedStartButton() {
    await sendName();
    let data = await getData(noPics);
    changeAppearance(data);
}

async function clickedRefreshButton() {
    let data = await getData(noPics);
    displayNewPics(data);
}

let displayNewPics = (data) => {
    let imgs = document.querySelectorAll("img");
    for (let i = 0; i < noPics; i++) {
        imgs[i].onload = onLoadImg;
        imgs[i].src = data.message[i];
    }
}

let getData = async (nb) => {
    //prolly needs a try catch?
    let data = await fetch(`https://dog.ceo/api/breeds/image/random/${nb}`);
    return data.json();
}

let changeAppearance = (data) => {
    let mainContainer = document.querySelector('.main-container');
    mainContainer.style.display = "none";

    //creating cards containing pics and 2 buttons
    for(let i = 0; i < noPics; i++) {
        let div = document.createElement("div");
        div.className = 'card-div';
        let img = document.createElement("img");
        img.alt = "Doggo";
        img.className = "pics";
        let button1 = document.createElement("button");
        let button2 = document.createElement("button");
        button1.className = button2.className = "form-btn card-button";
        button1.innerText = "Silly";
        button2.innerText = "Adorable";
        div.append(img, button1, button2);
        document.querySelector(".pics-container").append(div);
    }

    displayNewPics(data);
    let divPicsRef = document.querySelector(".pics-container");
    divPicsRef.style.display = "flex";
}

function onLoadImg() {
    this.style.width = picWidth.toString() + "px";
}

let sendName = async () => {
    let name = document.getElementById('name').value;
    //TODO
}

async function clickedRequestButton() {
    let text = this.innerText;
    text.includes("Silly")? text = "silly" : text = "adorable";
    //TODO
}