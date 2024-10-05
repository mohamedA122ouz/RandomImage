import { Router } from "express";
import fs from "fs";
import path from "path";
import eHtml from "../index";
import virtualImage from "../Models/virtualImage";
import Subjects from "../Models/Subjects";
import instractionParser from "../Models/instractionParser";
const router = Router();
export default router;

router.get("/", (req, res) => {
    let subjects: Subjects = { info: [] } as Subjects;
    if (!fs.existsSync("./assets/data.json")) {
        fs.writeFileSync("./assets/data.json", JSON.stringify(subjects));
    } else {
        subjects = JSON.parse(fs.readFileSync("./assets/data.json", "utf8"));
    }
    res.send(eHtml("./View/home.html", subjects));
});
router.get("/submit", (req, res) => {
    //the structure of image must be the following 
    //parentFolder>subjectFolder>lectureFolderNamed:lec1|lec2|...>FolderNamed:q|Q
    let pathFromRoot: string = req.query.path as unknown as string;
    let paths
    if (fs.existsSync(pathFromRoot)) {
        let subjectsFoldersArr: string[] = fs.readdirSync(pathFromRoot);
        subjectsFoldersArr = subjectsFoldersArr.map(el => path.join(pathFromRoot, el));//adding subject files to the root
        subjectsFoldersArr.forEach(file => {
            let lectures: string[] = fs.readdirSync(file);
            lectures = lectures.map(el => path.join(file, el));//adding subject files to the root
            lectures.forEach(lecture => {
                let directory = path.join(lecture, "q");
                readImageFile(directory);
            });
        });
    }
});

//
function readImageFile(directory: string) {
    let dirData: string[] = fs.readdirSync(directory);
    const images: (string | virtualImage)[] = dirData.map((el) => {
        if (el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif"))
            return path.join(el);
        else if (el.includes('.ins')) {
            return instractionParser(directory);//returns array which make the error above
        }
        else
            return "";
    }).filter((el) => el);
    const folders = dirData.map((el) => {
        if (!(el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif")))
            return path.join(el);
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