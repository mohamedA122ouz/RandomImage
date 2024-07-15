const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
let mysource = fs.readFileSync(path.join(__dirname, "./code.src"), "utf8");
let dirData = fs.readdirSync(path.join(__dirname, "./images"));
const images = dirData.map((el) => {
    if (el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif"))
        return `./images/${el}`;
    else
        return "";
}).filter((el)=>el);
const folders = dirData.map((el) => {
    if ((!el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif")))
        return `./images/${el}`;
    else
        return "";
}).filter((el)=>el);
console.log(folders);
folders.forEach(folder=>{
    fs.readdirSync(folder).forEach((el)=>{
        if (el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg") || el.includes(".tiff") || el.includes(".gif"))
            images.push(`${folder}/${el}`);
    });
})
if(images.length !== 0){
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
else{
    console.log("PLEASE INSERT IMAGES INTO 'images' FOLDER THEN RUN AGAIN!!");
    setTimeout(()=>{},20000);
}