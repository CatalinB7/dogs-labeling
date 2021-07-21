import { setPageTitle, state } from "./appState";
import { genericFetch } from "./httpServices";
import { displayError } from "./login";
import { savePic } from "./picsManipulation";
import { goToCategoryPage, goToRandDogsPage } from "./script";

let [noPics] = [state.getNoPics()];

document.querySelector(".del-cat").addEventListener("click", deleteCategory);
document.querySelector(".edit-cat").addEventListener("click", expandEditInput);
document.querySelector(".change-cat-input").addEventListener("keyup", tryCategoryEdit);

const inputField: HTMLInputElement = document.querySelector('.chosen-value');
const dropdown: HTMLLIElement = document.querySelector('.value-list');
const dropdownArray = [...document.querySelectorAll('ul.value-list li')];

dropdown.classList.add('open');

let valueArray = [];
dropdownArray.forEach(item => {
    valueArray.push(item.textContent);
});

// const closeDropdown = () => {
//     dropdown.classList.remove('open');
// }

inputField.addEventListener('input', removeUnmatching);

function removeUnmatching() {
    dropdown.classList.add('open');
    let dropdownArray = [...document.querySelectorAll('ul.value-list li')];
    let valueArray = [];
    dropdownArray.forEach(item => {
        valueArray.push(item.textContent);
    });
    let inputValue = inputField.value.toLowerCase();
    if (inputValue.length > 0) {
        for (let j = 0; j < valueArray.length; j++) {
            //toggle class of li elements according to string matching
            if (!(inputValue.substring(0, inputValue.length) === valueArray[j].substring(0, inputValue.length).toLowerCase())) {
                dropdownArray[j].classList.add('closed');
            } else {
                dropdownArray[j].classList.remove('closed');
            }
        }
    } else {
        for (let i = 0; i < dropdownArray.length; i++) {
            dropdownArray[i].classList.remove('closed');
        }
    }
};

dropdownArray.forEach(item => {
    item.addEventListener('click', (evt) => {
        inputField.value = item.textContent;
        dropdownArray.forEach(dropdown => {
            dropdown.classList.add('closed');
        });
    });
})

inputField.addEventListener('focus', () => {
    inputField.placeholder = 'Type to filter';
    dropdown.classList.add('open');
    dropdownArray.forEach(dropdown => {
        dropdown.classList.remove('closed');
    });
});

inputField.addEventListener('blur', () => {
    inputField.placeholder = 'Type to filter';
    dropdown.classList.remove('open');
});

document.addEventListener('click', (evt: any) => {
    const isDropdown = dropdown.contains(evt.target);
    const isInput = inputField.contains(evt.target);
    if (!isDropdown && !isInput) {
        dropdown.classList.remove('open');
    }
});


document.querySelector(".insertCategory").addEventListener("click", displayInsertCategory);

function displayInsertCategory() {
    let inpt = (document.querySelector(".insert-input") as HTMLElement);
    if (!inpt.classList.contains("extend-input"))
        inpt.classList.add("extend-input");
    else inpt.classList.remove("extend-input");
}

document.querySelector(".insert-input").addEventListener("keyup", insertCategory);
async function insertCategory(event: KeyboardEvent) {
    if (event.key === "Enter") {
        let newCategory: string = this.value;
        this.value = "";
        // I SHOULD GET CATEGORIES FROM BACKEND since that s the truth origin
        if (checkCategoryExists(newCategory))
            return;
        let resp = await genericFetch("POST", "category", undefined,
            { name: state.Name, id: state.getSessionId(), category: newCategory });
        if (resp.status != 200)
            return; //should throw error displaying the error's msg
        insertCategoryButton(newCategory);
        let newLi = document.createElement("li");
        newLi.textContent = newCategory;
        dropdown.appendChild(newLi);
        newLi.addEventListener("click", goToCategoryPage);
    }
};

function checkCategoryExists(newCategory: string) {
    //returns true if the newCategory already exists
    let textCategories = [...document.querySelectorAll("ul.value-list li")].map((li: HTMLElement) => li.textContent);
    let alreadyExists = 0;
    textCategories.forEach(el => {
        if (el.toLowerCase() == newCategory.toLowerCase()) {
            //TODO THROW SOME ERROR BECAUSE IT S THE SAME CATEGORY
            alreadyExists = 1;
            return;
        }
    });
    if (alreadyExists) {
        displayError("Category already exists!");
        return true;
    }
    return false;
}

export async function setUsersCategories() {
    //problem: genericFetch should be generic so its params are generic (therefore kinda useless) but the return value must fit each case...
    let resp: any = await genericFetch("GET", "category?", { id: state.getSessionId(), name: state.Name }, undefined);
    resp.categories.forEach(item => {
        let newLi = document.createElement("li");
        newLi.textContent = item;
        dropdown.appendChild(newLi);
        newLi.addEventListener("click", goToCategoryPage);
    });
    state.Categories = resp.categories;
}

export function clearDom() {
    let liElems = [...document.querySelectorAll('ul.value-list li')];
    liElems.forEach(item => {
        item.parentElement.removeChild(item);
    });
    //can i remove only card-div elements since other elements are inside it
    [...document.querySelectorAll(".form-btn.card-button")].forEach(btn => {
        (btn as HTMLElement).parentElement.removeChild(btn);
    });

    [...document.querySelectorAll(".card-div")].forEach(div => {
        (div as HTMLElement).parentElement.removeChild(div);
    });
}


export function insertCategoryButton(newCategory: string) {

    let prefDivs = [...(document.querySelectorAll(".pref-div"))] as HTMLButtonElement[];
    for (let i = 0; i < noPics; i++) {
        let btn = document.createElement("button");
        btn.innerText = newCategory;
        btn.className = "form-btn card-button";
        state.appendCategory(newCategory);
        btn.addEventListener("click", savePic(i));
        btn.tabIndex = 0;
        prefDivs[i].appendChild(btn);
    }
}


async function deleteCategory() {
    let category = (document.location.toString()).split("/").pop().split("_")[0];
    let resp = await genericFetch("DELETE", "category?", { id: state.getSessionId(), name: state.Name, category }, undefined);
    if (resp.status != 200)
        return;
    state.Categories = state.Categories.filter(cat => cat != category);
    [...document.querySelectorAll('ul.value-list li')].forEach(elem => {
        if ((elem as HTMLElement).innerText == category) {
            elem.parentElement.removeChild(elem);
            return;
        }
    });

    [...document.querySelectorAll(".form-btn.card-button")].forEach(btn => {
        if ((btn as HTMLElement).innerText == category) {
            btn.parentElement.removeChild(btn);
            // return;
        }
    });

    await goToRandDogsPage();
}


async function editCategory(newCategory: string) {
    let oldCategory = (document.location.toString()).split("/").pop().split("_")[0];
    let resp = await genericFetch("PUT", "category?", { id: state.getSessionId(), name: state.Name, oldCategory, newCategory }, undefined);
    if (resp.status != 200)
        return;




    state.Categories = state.Categories.map(cat => {
        if (cat === oldCategory)
            return newCategory;
        return cat;
    });
    [...document.querySelectorAll('ul.value-list li')].forEach(elem => {
        if ((elem as HTMLElement).innerText == oldCategory) {
            (elem as HTMLElement).innerText = newCategory;
            return;
        }
    });

    [...document.querySelectorAll(".form-btn.card-button")].forEach(btn => {
        if ((btn as HTMLElement).innerText == oldCategory) {
            (btn as HTMLElement).innerText = newCategory;
            return;
        }
    });
}


function expandEditInput() {
    let inpt = document.querySelector(".change-cat-input");
    if(inpt.classList.contains("extend-cat-input")) {
        inpt.classList.remove("extend-cat-input");
    }
    else inpt.classList.add("extend-cat-input");
}

function tryCategoryEdit(event: KeyboardEvent) {
    if (event.key === "Enter") {
        let newCategory: string = this.value;
        this.value = "";
        editCategory(newCategory);
        setPageTitle(`These are your ${newCategory} dogs`);
        document.querySelector(".change-cat-input").classList.remove("extend-cat-input");
    }
    
}

/*
TODO: category form on enter should also go to that category page.
*/