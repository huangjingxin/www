// 此文件用于更新 sw.js

let fs = require('fs')

// 读取目录
function getDir(path) {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (err, arr) => {
            if (err) reject(err);
            resolve(arr)
        })
    })
}

// 读取文件
function getFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) reject(err);
            resolve(data)
        })
    })
}




async function update() {

    let app = await getDir("./image/app/");
    app = app.map(x => "./image/app/" + x);

    let site = await getDir("./image/site/");
    site = site.map(x => "./image/site/" + x);

    let arr = [...app, ...site];
    arr = `let images = ${JSON.stringify(arr)};\r\n`;

    let sw = await getFile("./node/service-worker/service-worker.js");

    let data = arr + sw;

    fs.writeFile('./sw.js', data, (err) => {
        if (err) throw err;
        console.log('sw.js 已更新');
    });

    // console.log(data)
}

update()