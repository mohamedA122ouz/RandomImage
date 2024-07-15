const { exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
let mysource = fs.readFileSync(path.join(__dirname, "./code.src"),"utf8");
let dirData = fs.readdirSync(__dirname);
const images = dirData.filter((el) => {
    if (el.includes(".png") || el.includes(".jpg") || el.includes(".jpeg")||el.includes(".tiff")||el.includes(".gif"))
        return `"${el}"`;
})
console.log(images);
mysource = mysource.replace("0x11",JSON.stringify(images));
fs.writeFileSync(path.join(__dirname,"./randomQ.html"),mysource);
try{
    execSync(`explorer ${path.join(__dirname,"./randomQ.html")}`);
}
catch(ex){
    console.log("opened");
}

