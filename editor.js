const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
let mysource = fs.readFileSync(path.join(__dirname, "./code.src"), "utf8");
let dirData = fs.readdirSync(path.join(__dirname, "./images"));
const images = dirData.map((el) => {
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
    fs.readdirSync(folder).forEach((el) => {
        if (el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif"))
            images.push(`${folder}/${el}`);
    });
})
if (images.length !== 0) {
    console.log(images);
    mysource = mysource.replace("0x11", JSON.stringify(images));
    fs.writeFileSync(path.join(__dirname, "./randomQ.html"), mysource);
    try {
        execSync(`explorer ${path.join(__dirname, "./randomQ.html")}`);
    }
    catch (ex) {
        console.log("opened");
    }
}
else {
    console.log("PLEASE INSERT IMAGES INTO 'images' FOLDER THEN RUN AGAIN!!");
    setTimeout(() => { }, 20000);
}
const app = express();
app.use(express.json());
app.listen("8080");
app.use(cors({ origin: "*" }));
app.get("/", (req, res) => {
    try {
        res.status(200);
        res.json(readStorage());
    } catch (ex) {
        res.status(404);
        res.json({});
    }
});
app.post("/", (req, res) => {
    let body = req.body;
    try {
        saveProperties(JSON.stringify(body));
        res.status(200);
        res.json("savedTostorage");
    } catch (ex) {
        res.status(500);
        res.json({ err: "not saved" });
    }
});


function readStorage() {
    try {
        return fs.readFileSync(path.join(__dirname, "./savedProperties.json"), "utf-8");
    } catch (ex) {
        fs.writeFileSync(path.join(__dirname, "./savedProperties.json"), "{}");
        return "{}";
    }
}
function saveProperties(body) {
    fs.writeFileSync(path.join(__dirname, "./savedProperties.json"), body);
}