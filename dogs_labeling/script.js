const nbPics = 8;
const picWidth = 300;
let name = null;
let clickedButton = async () => {
    let data = await getData(nbPics);
    changeAppearance(data);
}

document.querySelector('.form-btn').addEventListener("click", clickedButton) // why clickedButton didnt require event as parameter?

let getData = async (nb) => {
    //prolly needs a try catch?
    let data = await fetch(`https://dog.ceo/api/breeds/image/random/${nb}`);
    return data.json();
}

let changeAppearance = (data) => {
    let mainContainer = document.querySelector('.main-container');
    mainContainer.style.display = "none";




    let imgs = document.querySelectorAll("img");
    for (let i = 0; i < nbPics; i++) {
        imgs[i].onload = onLoadImg;
        imgs[i].src = data.message[i];
    }

    let divPicsRef = document.querySelector(".pics-container");
    divPicsRef.style.display = "flex";
}

function onLoadImg() {
    let ratio = this.naturalHeight / this.naturalWidth;
    this.style.width = picWidth.toString() + "px";
    this.style.height = (picWidth * ratio).toString() + "px";
}

/*
Should append to (<div class="pics-container">) nbPics divs containing {
    img
    2 buttons: scarry or adorable
}

something like this:
    for(let i = 0; i < nbPics; i++) {
        let div = document.createElement("div");
        let img = document.createElement("img");
        let button1 = document.createElement("button");
        let button2 = document.createElement("button");
        div.append(img, button1, button2);
        document.querySelector(".pics-container").append(div);
    }

*/