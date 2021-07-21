type Category = ("silly" | "adorable");
type categoriesToLinks = { [key in Category]: string[] };
let nameToId: { [index: string]: number } = {};

let idToLinks: { [index: number]: categoriesToLinks } = {}; //this should be idToLinks[id]["silly" | "adorable"] = [link1, link2..]

let id: number = 0;

let getID = (name: string) => {
    if (!nameToId[name]) {
        id++;
        nameToId[name] = id;
        idToLinks[id] = { "silly": [], "adorable": [] };
        return id;
    }
    return nameToId[name];
}

let getLinks = (category: Category, loggedID: number) => {
    return idToLinks[loggedID][category];
}

let addLink = (category: Category, loggedID: number, link: string) => {
    //insert link only if it doesn't exist in idToLinks
    if (!idToLinks[loggedID][category].includes(link))
        idToLinks[loggedID][category].push(link);
    //else generate error to user?
}

let removeLink = (category: Category, loggedID: number, link: string) => {
    idToLinks[loggedID][category] = idToLinks[loggedID][category].filter(elem => elem != link);
}

export {
    getID,
    getLinks,
    addLink,
    Category,
    removeLink
}