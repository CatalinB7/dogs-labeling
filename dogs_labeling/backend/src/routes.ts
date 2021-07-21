import express from "express";
import { getID, addLink, getLinks, Category, removeLink, register, insertCategory, getCategories, deleteCategory, modifyCategory } from "./db";
let router = express.Router();

router.post("/register", (req, res) => {
    let { name, password } = req.body;
    res.sendStatus(register(name, password));
});


router.post("/login", (req, res) => {
    //get the name of user and return a session id; it mimics a jwt token 
    let { name, password } = req.body;

    res.send({ id: getID(name, password) });
});

router.post("/preferences", (req, res) => {
    //get tag: silly or adorable; save the link associated with that id
    let { id, link, category, name } = req.body;
    addLink(category, id, link, name);
    res.sendStatus(200);
});

router.get("/preferences", (req, res) => {
    //return links from specified category for a user
    let id: number;
    let category: string;
    let name = (req.query.name) as string;
    id = parseInt((req.query.id) as string);
    category = req.query.category as string;
    // {id, category} = req.query; // how do i destructure it like this in typescript?
    let links = getLinks(category as Category, name, id);
    res.send({ links });
});

router.delete("/preferences", (req, res) => {
    //remove link from dictionary by (idx and category) 
    let id: number;
    let category: string;
    id = parseInt((req.query.id) as string);
    let name = (req.query.name) as string;
    category = req.query.category as string;
    let link: string = req.query.link as string;
    removeLink(category as Category, id, name, link);
    res.sendStatus(200);
});


router.post("/category", (req, res) => {
    //insert new category for a certain user
    let { id, category, name } = req.body;
    insertCategory(id, name, category);
    res.sendStatus(200);
});

router.get("/category", (req, res) => {
    let id = parseInt((req.query.id) as string);
    let name = (req.query.name) as string;
    res.send({categories: getCategories(id, name)});
});

router.delete("/category", (req, res) => {
    let id = parseInt((req.query.id) as string);
    let name = (req.query.name) as string;
    let category = (req.query.category) as string;
    deleteCategory(id, name, category);
    res.sendStatus(200);
});

router.put("/category", (req, res) => {
    let id = parseInt((req.query.id) as string);
    let name = (req.query.name) as string;
    let oldCategory = (req.query.oldCategory) as string;
    let newCategory = (req.query.newCategory) as string;
    modifyCategory(id, name, oldCategory, newCategory);
    res.sendStatus(200);
});

export default router;