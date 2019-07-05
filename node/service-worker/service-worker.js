let VERSION = 'v1';
let cacheFiles = [
    './',

    './data/app.json',
    './data/site.json',

    ...images,
    './image/about/qrcode.png',
    './image/foot/beian.png',
    './image/foot/pic.gif',
    './image/favicon.ico',
    './image/logo.png',

    './cdn/iconfont/iconfont.css',
    './cdn/iconfont/iconfont.eot',
    './cdn/iconfont/iconfont.js',
    './cdn/iconfont/iconfont.svg',
    './cdn/iconfont/iconfont.ttf',
    './cdn/iconfont/iconfont.woff',
    './cdn/iconfont/iconfont.woff2',
    './cdn/tailwindcss.min.css',
    './cdn/vue.min.js',

    './pwa/icons/logo-32.png',
    './pwa/icons/logo-72.png',
    './pwa/icons/logo-128.png',
    './pwa/icons/logo-144.png',
    './pwa/icons/logo-256.png',
    './pwa/icons/logo-512.png',
    './pwa/manifest.json',

    './static/main.js',
    './static/style.css',

    './sw.js',
];

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function () {
        // console.log('1. Service Worker 注册成功');
    });
}

this.addEventListener('install', function (event) {
    // console.log('2. 安装 sw.js');
    event.waitUntil(
        caches.open(VERSION).then(function (cache) {
            return cache.addAll(cacheFiles);
        })
    )
});

this.addEventListener('activate', function (event) {
    // console.log('3. 激活 sw.js，可以开始处理 fetch 请求。');
    event.waitUntil(
        caches.keys().then(function (keyList) {
            return Promise.all(keyList.map(function (key) {
                if (VERSION.indexOf(key) === -1) {
                    return caches.delete(key);
                }
            }))
        })
    )
});

this.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
            .then(function (response) {
                if (response) {
                    // console.log('fetch ', event.request.url, '有缓存，从缓存中取');
                    return response;
                } else {
                    // console.log('fetch ', event.request.url, '没有缓存，网络获取');
                    return fetch(event.request)
                        .then(function (response) {
                            return caches.open(VERSION).then(function (cache) {
                                cache.put(event.request, response.clone());
                                return response;
                            })
                        })
                }
            })
    )
});