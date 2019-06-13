// 此文件用于更新 data/site.json


const fs = require('fs')
const path = require('path')


fs.readFile('./data/site.json', 'utf-8', (err, data) => {
    if (err) throw err;
    sites = JSON.parse(data);
    sites.forEach(x => {
        x.lists.forEach(y => {
            if (!y.search && y.search.length <= 3) {
                y.search = [1, 2, 3];
            }
            // 前三位为固定内容（域名、名字、描述）
            y.search[0] = path.parse(y.logo).name;
            y.search[1] = y.name;
            y.search[2] = y.description;
            // 全部转换为小写
            y.search.forEach((z, index) => {
                y.search[index] = z.toLowerCase();
            })
        })
    });
    sites = JSON.stringify(sites);
    fs.writeFile('./data/site.json', sites, (err) => {
        if (err) throw err;
        console.log('data/site.json 已更新');
    });
    // console.log(sites);
})