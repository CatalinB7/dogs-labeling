import { state } from "./appState";
import { IResponse, IFetchParams } from "./models";

const baseUrl = 'http://localhost:8080';

export async function genericFetch(method: string, route: string, params: IFetchParams, body) {
    let response = await fetch(`${baseUrl}/${route}` + new URLSearchParams(params as any), {
        method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
    });
    const contentType = response.headers.get("content-type");
    let responseJSON: IResponse = {links: [], status: 0};
    if (contentType && contentType.indexOf("application/json") !== -1) {
        responseJSON = await response.json();
    }
    responseJSON.status = response.status;
    return responseJSON;
}

export async function sendName() {//move somehwere else
    let userName = (document.getElementById('name') as HTMLInputElement).value;
    let toSendObj = { name: userName };
    let responseJSON: IResponse = await genericFetch("POST", "name", undefined, (toSendObj));
    state.setSessionId(responseJSON.id)
}

export const getData = async (nb: number) => {
    let data = await fetch(`https://dog.ceo/api/breeds/image/random/${nb}`);
    return data.json();
}