import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
const app = express();
let port = 4040;
let defineControllers = new Promise(async function (resolve, reject) {
    const controllers = fs.readdirSync(path.join(__dirname, "./Controllers"));
    for (let cFile of controllers) {
        const module = await import(`./Controllers/${cFile}`);
        let controllerName = cFile.split('.')[1];
        app.use(`/${controllerName}`, module.default);
    }
    resolve("done");
});
app.listen(port, () => {
    console.log("Welcome at your MVC project \nApplication ip is:\nhttp://localhost:", port);
    exec("start explorer http://localhost:4040", (err) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Browser Opened!");
        }
    });
});
app.get("/", async (req, res) => {
    await defineControllers;
    res.redirect("/home");
});
function html(HTMLPath: string, obj?: any): string {//the function takes the path of html file that has placeHolders like the following ~propertyName and replace the Property name with the needed data
    //function allow loops in html
    let HTML = fs.readFileSync(path.join(__dirname, HTMLPath), "utf8");
    if (obj !== null) {
        for (let propertyName in obj) {
            if (HTML.includes(`~${propertyName}@{`)) {
                let loopElementIndex: number = HTML.indexOf(`~${propertyName}@{`) + propertyName.length + 3;
                let neededElement: string = HTML.substring(loopElementIndex, HTML.indexOf("}@"));
                HTML = HTML.replace(`~${propertyName}@{${neededElement}}@`, `~|()(${propertyName})%~`);
                let stringElements = "";
                if (obj[propertyName] instanceof Array) {
                    for (let obj1 of obj[propertyName]) {//how to implement it [{},{},{}]
                        stringElements += neededElement;
                        for (let propertyNameE in obj1) {
                            stringElements = stringElements.replace(`~${propertyNameE}`, obj1[propertyNameE]);
                        }
                    }
                }
                else if (obj[propertyName] instanceof Object) {
                    let counter = 0;
                    for (let innerProperties in obj[propertyName]) {
                        if (0 === counter++) {
                            for (let arrIndex in obj[propertyName][innerProperties]) {
                                stringElements += neededElement.replace(`~${innerProperties}`, obj[propertyName][innerProperties][arrIndex]);
                            }
                        }
                        else if (stringElements.includes('~')) {
                            for (let arrIndex in obj[propertyName][innerProperties]) {
                                stringElements = stringElements.replace(`~${innerProperties}`, obj[propertyName][innerProperties][arrIndex]);
                            }
                        }
                    }
                }
                HTML = HTML.replace(`~|()(${propertyName})%~`, stringElements);
            }
            else if (HTML.includes(`~${propertyName}#{`)) {
                //if $str$ means if string or $obj$ means if object
                let wantedDataType: "string" | "object" | "" = "";
                let switchBracketIndex: number = HTML.indexOf(`~${propertyName}#{`) + propertyName.length + 3;
                let switchBracket: string = HTML.substring(switchBracketIndex, HTML.indexOf("}#"));
                let choosenElement: string = "";
                HTML = HTML.replace(`~${propertyName}#{${switchBracket}}#`, `~|(${propertyName})%~`);
                let isFinished = false;
                while (switchBracket.indexOf('?') !== -1 && !isFinished) {
                    let temp = switchBracket.substring(switchBracket.indexOf('?'), switchBracket.indexOf('$', switchBracket.indexOf('?', switchBracket.indexOf('?') + 1)) + 1);
                    let caseValue = temp.substring(1, temp.lastIndexOf('?'));
                    if (caseValue.includes('$')) {
                        if (caseValue === "$str$") {
                            wantedDataType = "string";
                        } else if (caseValue === "$obj$") {
                            wantedDataType = "object";
                        }
                        if (typeof obj[propertyName] === wantedDataType) {
                            choosenElement = temp.replace(`?${caseValue}?`, "");
                            choosenElement = choosenElement.substring(0, choosenElement.length - 1);
                            isFinished = true; break;
                        }
                    }
                    else {
                        if (caseValue === obj[propertyName]) {
                            choosenElement = temp.replace(`?${caseValue}?`, "");
                            choosenElement = choosenElement.substring(0, choosenElement.length - 1);
                            isFinished = true; break;
                        }
                    }
                    switchBracket = switchBracket.replace(temp, "");
                }
                HTML = HTML.replace(`~|(${propertyName})%~`, choosenElement);
                // if(typeof propertyName === wantedDataType){
                //     HTML = HTML.replace(`~${propertyName}#{${neededElement}}#`, `~!${propertyName}#~`);
                // }
                // HTML = HTML.replace(`~${propertyName}#{${neededElement}}#`, `~!${propertyName}#~`);
            }
            else
                HTML = HTML.replace(`~${propertyName}`, obj[propertyName]);
        }
    }
    return HTML;
}
/**
 * @param data if not specified the controller name at the property @ it will giving it the name of the view which should be the same as controller name 
 * @param HTMLPath the view must be with the same name of controller else you must specify the name of controller at property @ [@] = "controller name"
*/
export default function eHtml(HTMLPath: string, data?: any): string {
    data = data === undefined || data === null ? {} : data;
    if (data["@"] === undefined) {
        data["@"] = HTMLPath.substring(HTMLPath.lastIndexOf("/"), HTMLPath.lastIndexOf("."));
    }
    if (data["title"] === undefined) {
        data["title"] = HTMLPath.substring(HTMLPath.lastIndexOf("/") + 1, HTMLPath.lastIndexOf("."));
    }
    return html(HTMLPath, data);
}