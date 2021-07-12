import { getSessionId, setSessionId } from "./appState";
import { myResponse, fetchParams } from "./models";
//should these fetching functions be more generic?
//receive parameters for method and url maybe
export async function getPicsBackend(params: fetchParams) { //bad cast params as any 
    let response = await fetch('http://localhost:8080/preferences?' + new URLSearchParams(params as any), {
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
    });
    let responseJSON: myResponse = await response.json();
    return responseJSON;
}

export async function postPreferences(body: any) {
    let response = await fetch('http://localhost:8080/preferences', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
}

export async function deletePreferences(params: any) {
    let response = await fetch('http://localhost:8080/preferences?' + new URLSearchParams(params), {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
    });

}


export async function sendName() {//move somehwere else
    let userName = (document.getElementById('name') as HTMLInputElement).value;
    let toSendObj = { name: userName };
    let response = await fetch('http://localhost:8080/name', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSendObj)
    });
    let responseJSON = await response.json();
    setSessionId(responseJSON.id)
}

let getData = async (nb: number) => {
    let data = await fetch(`https://dog.ceo/api/breeds/image/random/${nb}`);
    return data.json();
}

export { getData };