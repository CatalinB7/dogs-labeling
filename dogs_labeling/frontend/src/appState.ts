export function toggleNavButton() {
    let navBtns: HTMLButtonElement[] = Array.from(document.querySelectorAll(".pageNav"));
    let [leftBtn, rightBtn] = navBtns;
    let links = state.getReceivedLinks();
    let currentPage = state.getCurrentPage();
    if (currentPage * state.getNoPics() >= links.length) {
        rightBtn.disabled = true;
    } else {
        rightBtn.disabled = false;
    }
    if (currentPage > 1)
        leftBtn.disabled = false;
    else leftBtn.disabled = true;
}

export function setPageTitle(text: string) {
    let elem = document.querySelector(".title");
    elem.innerHTML = text;
}


class State {
    static instantiated = false;
    #currentPage = 1;
    #name: string;
    #noPics: number;
    #picWidth: number;
    #receivedLinks = [];
    #sessionId: number;
    #alreadySent: {silly: boolean[], adorable: boolean[]};
    #routes = ["register", "random_dogs", "silly_dogs", "adorable_dogs"];
    #loggedOnce = false;
    #categories: string[] = [];
    constructor(picsPerPage: number, widthOfPic: number) {
        if (State.instantiated) {
            throw new Error("Already instantiated");
        }
        State.instantiated = true;
        this.#noPics = picsPerPage;
        this.#picWidth = widthOfPic;
        this.#alreadySent = {
            "silly": new Array(this.#noPics).fill(false),
            "adorable": new Array(this.#noPics).fill(false)
        };
    }

    get Categories() {
        return this.#categories;
    }

    set Categories(val: string[]) {
        this.#categories = val;
    } 

    get Name() {
        return this.#name;
    }

    set Name(val) {
        this.#name = val;
    }

    get LoggedOnce() {
        return this.#loggedOnce;
    }

    
    set LoggedOnce(val: boolean) {
         this.#loggedOnce = val;
    }

    getNoPics() {
        return this.#noPics;
    }

    getPicWidth() {
        return this.#picWidth;
    }

    getRoutes() {
        return this.#routes;
    }

    addRoute(newRoute: string) {
        this.#routes.push(newRoute);
    }

    increasePage() {
        if (this.#currentPage === Math.ceil(this.#receivedLinks.length / this.#noPics))
            return;
        this.#currentPage++;
        if (this.#currentPage > Math.floor(this.#receivedLinks.length / this.#noPics))
            this.#currentPage = Math.floor(this.#receivedLinks.length / this.#noPics) + 1;
    }

    decreasePage() {
        this.#currentPage--;
        if (this.#currentPage < 1)
            this.#currentPage = 1;
    }

    getCurrentPage() {
        return this.#currentPage;
    }

    setCurrentPage(value: number) {
        this.#currentPage = value;
    }

    getSessionId() {
        return this.#sessionId;
    };

    setSessionId(id: number) {
        this.#sessionId = id;
    };

    setReceivedLinks(links: string[]) {
        this.#receivedLinks = links;
    }

    getReceivedLinks() {
        return this.#receivedLinks;
    }

    getAlreadySent() {
        return this.#alreadySent;
    }

    resetAlreadySent() {
        this.#categories.forEach(cat => {
            this.#alreadySent[cat] = new Array(this.#noPics).fill(false);
        })
    }

    setAlreadySent(text: string, idx: number) {
        this.#alreadySent[text][idx] = true;
    }

    appendCategory(netCat: string) {
        this.#alreadySent[netCat] = new Array(this.#noPics).fill(false);
    }

}

export const state = new State(8, 300);






