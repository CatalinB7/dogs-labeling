import { response } from "express";

export class CustomError extends Error {
    #statusCode: number;
    constructor(message: string, httpStatus: number) {
        super(message);
        this.#statusCode = httpStatus;
        Error.captureStackTrace(this, this.constructor);
    }

    get Message() {
        return this.message;
    }

    get StatusCode() {
        return this.#statusCode;
    }
}

type Category = string;
let db: {
    [key: string]: {
        id: number,
        links: { [index: string]: string[] },  //{"silly": [link1, link2..], ...}
        password: string,
        email: string,
        categories: string[]
    }
} = {}

let id: number = 0;

/*
TODO: At logout the nameToId dictinary must erase the id associated with that name

DB contains {
    idToSet which maps a name to set of categories
    idToLinks which maps a name to array of links
}

user receives sessionId at login and each request carries the sessionId

*/


let guard = (name: string, id: number) => {
    if (db[name].id != id)
        throw new CustomError("Wrong credentials!", 401);
}

let register = (name: string, pass: string) => {
    if (!db[name] || !db[name].id) {
        let links: { [index: string]: string[] } = { "silly": [], "adorable": [] };

        db[name] = {
            password: pass, email: "",
            categories: ["silly", "adorable"],
            links,
            id: undefined
        };

        return 200;
    }
    let err = new CustomError("Name already exists!", 409);
    throw err;
    // return 409; //error code for conflict
}

let getID = (name: string, pass: string) => {
    //actually it s the login that returns a session id
    
    if (!db[name] || db[name].password !== pass) {
        throw new CustomError("Wrong credentials!", 401);
    }
    if (!db[name].id) {
        id++;
        db[name].id = id;
        return id;
    }
    return db[name].id;
}

let getLinks = (category: Category, name: string, id: number) => {
    guard(name, id);
    return db[name].links[category];
}

let addLink = (category: Category, id: number, link: string, name: string) => {
    //insert link only if it doesn't exist in idToLinks
    guard(name, id);
    if (!db[name].links[category].includes(link)) {
        db[name].links[category].push(link);
        return;
    }
    else throw new CustomError("Image already saved!", 409);
}

let removeLink = (category: Category, id: number, name: string, link: string) => {
    guard(name, id);
    db[name].links[category] = db[name].links[category].filter(elem => elem != link);
}

let insertCategory = (id: number, name: string, category: string) => {
    guard(name, id);
    if (db[name].categories.includes(category)) {
        throw new CustomError("Category already defined", 401);
    }
    db[name].links[category] = [];
    db[name].categories.push(category);
}

let modifyCategory = (id: number, name: string, oldCategory: string, newCategory: string) => {
    //check if oldCategory existed, replace it in categories array then in links object
    guard(name, id);
    
    if (!db[name].categories.includes(oldCategory)) {
        throw new CustomError("Old category not defined", 404);
    }
    if (db[name].categories.includes(newCategory)) {
        throw new CustomError("New category already defined", 404);
    }
    db[name].categories = db[name].categories.map(el => {
        if (el === oldCategory)
            return newCategory;
        return el;
    })
    db[name].links[newCategory] = db[name].links[oldCategory];
    db[name].links[oldCategory] = undefined;
}

let getCategories = (id: number, name: string) => {
    //returns categories of a user
    guard(name, id);
    return db[name].categories;
}

let deleteCategory = (id: number, name: string, category: string) => {
    guard(name, id);
    db[name].categories = db[name].categories.filter(cat => cat != category);
    db[name].links[category] = undefined;
}

export {
    getID,
    getLinks,
    addLink,
    Category,
    removeLink,
    register,
    insertCategory,
    modifyCategory,
    getCategories,
    deleteCategory
}