import { genericFetch } from './httpServices';
import { goToStart } from './script';

document.querySelector(".register").addEventListener("click", goToRegister);
document.querySelector(".login").addEventListener("click", goToLogin);
document.getElementById("error-button").addEventListener("click", errorVanish);

function goToRegister() {
    window.history.pushState({}, "", "register");
    document.getElementById("logH1").innerText = "Register Page";
    (document.querySelector(".register") as HTMLElement).style.display = "none";
    (document.querySelector(".login") as HTMLElement).style.display = "block";
}

function goToLogin() {
    window.history.pushState({}, "", "/");
    document.getElementById("logH1").innerText = "Login Page";
    (document.querySelector(".register") as HTMLElement).style.display = "block";
    (document.querySelector(".login") as HTMLElement).style.display = "none";
    goToStart();
}

export async function sendRegistration(name: string, password: string) {
    //TODO check if password is respects some criteria

    let resp = await genericFetch("POST", "register", undefined, { name, password });
    if (resp.status === 409) {
        displayError("Name already taken!");
        return;
    }
    goToLogin();
}

function errorVanish() {
    (document.getElementById("error-div") as HTMLDivElement).style.display = "none";
}

export function displayError(msg: string) {
    (document.getElementById("error-div") as HTMLDivElement).style.display = "flex";
    (document.getElementById("error-span") as HTMLSpanElement).innerText = msg;
}