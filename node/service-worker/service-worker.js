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

    './module/iconfont/iconfont.css',
    './module/iconfont/iconfont.eot',
    './module/iconfont/iconfont.js',
    './module/iconfont/iconfont.svg',
    './module/iconfont/iconfont.ttf',
    './module/iconfont/iconfont.woff',
    './module/iconfont/iconfont.woff2',
    './module/tailwindcss.min.css',
    './module/vue.min.js',

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
        // console.log('Service Worker 注册成功');
    });
}

this.addEventListener('install', function (event) {
    // console.log('安装 sw.js');
    event.waitUntil(
        caches.open(VERSION).then(function (cache) {
            return cache.addAll(cacheFiles);
        })
    )
});

this.addEventListener('activate', function (event) {
    // console.log('激活 sw.js，可以开始处理 fetch 请求。');
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
        .then(function (resp) {
            if (resp) {
                // console.log('fetch ', event.request.url, '有缓存，从缓存中取');
                return resp;
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