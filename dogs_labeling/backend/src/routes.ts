import express from "express";
import { getID, addLink, getLinks, Category, removeLink } from "./db";
let router = express.Router();

router.post("/name", (req, res) => {
    //get the name of user and return a session id; it mimics a jwt token 
    let { name } = req.body;
    res.send({ id: getID(name) });
});


router.post("/preferences", (req, res) => {
    //get tag: silly or adorable; save the link associated with that id
    let { id, link, category } = req.body;
    addLink(category, id, link);
    res.sendStatus(200);
});

router.get("/preferences", (req, res) => {
    //return links from specified category for a user
    let id: number;
    let category: string;
    id = parseInt((req.query.id) as string);
    category = req.query.category as string;
    // {id, category} = req.query; // how do i destructure it like this in typescript?
    let links = getLinks(category as Category, id);
    res.send({ links });
})

router.delete("/preferences", (req, res) => {
    //remove link from dictionary by (idx and category) 
    let id: number;
    let category: string;
    id = parseInt((req.query.id) as string);
    category = req.query.category as string;
    let link: string = req.query.link as string;
    removeLink(category as Category, id, link);
    res.sendStatus(200);
})

export default router;