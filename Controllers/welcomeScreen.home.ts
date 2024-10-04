import { Router } from "express";
import fs from "fs";
import path from "path";
import eHtml from "../index";
import virtualImage from "../Models/virtualImage";
const router = Router();
export default router;

router.get("/", (req, res) => {
    if (fs.existsSync("../assets/data.json")) {

    }
    res.send(eHtml("./View/home.html",{test:"test",test1:"test2"}));
});
router.get("/submit", (req, res) => {
    fs.existsSync(req.query.path as unknown as string);
});

//
function readImageFile(directory: string) {
    let dirData: string[] = fs.readdirSync(directory);
    const images: string[] | virtualImage = dirData.map((el) => {
        if (el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif"))
            return `./images/${el}`;
        else
            return "";
    }).filter((el) => el);
    const folders = dirData.map((el) => {
        if (!(el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif")))
            return `./images/${el}`;
        else
            return "";
    }).filter((el) => el);
    console.log(folders);
    folders.forEach(folder => {
        (fs.readdirSync(folder) as string[]).forEach((el) => {
            if (el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif"))
                images.push(`${folder}/${el}`);
        });
    })
    return images;
}