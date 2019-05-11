var imgList = ["./image/logo/173app.png","./image/logo/5iwanyouxi.png","./image/logo/80s-16.png","./image/logo/80s.png","./image/logo/97manhua.png","./image/logo/alibaba-opsx.png","./image/logo/anyknew.png","./image/logo/appinn.png","./image/logo/baiduyun.png","./image/logo/beipy.png","./image/logo/biquge5200.png","./image/logo/bootcdn.png","./image/logo/bootcss.png","./image/logo/bundlephobia.png","./image/logo/chuyu.png","./image/logo/ciliwa.png","./image/logo/cli.png","./image/logo/csdn.png","./image/logo/dev-web.png","./image/logo/docschina.png","./image/logo/douban.png","./image/logo/easyicon.png","./image/logo/facebook.png","./image/logo/feeder.png","./image/logo/firefox-send.png","./image/logo/flighty.png","./image/logo/gitee.png","./image/logo/github.png","./image/logo/gmail.png","./image/logo/google-extensions.png","./image/logo/google-fonts.png","./image/logo/google.png","./image/logo/greasyfork.png","./image/logo/huaban.png","./image/logo/iconfont.png","./image/logo/imooc.png","./image/logo/inoreader.png","./image/logo/ip138.png","./image/logo/itellyou.png","./image/logo/iyunying.png","./image/logo/jianshu.png","./image/logo/jiumodiary.png","./image/logo/juejin.png","./image/logo/kugou.png","./image/logo/lantern.ico","./image/logo/laomoit.png","./image/logo/liaoxuefeng.png","./image/logo/linshiyouxiang.png","./image/logo/manhuagui.png","./image/logo/miku.png","./image/logo/oschina.png","./image/logo/outlook.png","./image/logo/pdflibr.ico","./image/logo/qq-ke.png","./image/logo/qq-pc.png","./image/logo/qq.png","./image/logo/qrcode.png","./image/logo/reederapp.png","./image/logo/rss-feed-reader.png","./image/logo/rsshub.png","./image/logo/ruanyifeng.png","./image/logo/rufus.png","./image/logo/runningcheese.png","./image/logo/runoob.png","./image/logo/tampermonkey.png","./image/logo/tieba.png","./image/logo/toolfk.png","./image/logo/tophub.png","./image/logo/twitter.png","./image/logo/vxia.png","./image/logo/w3cplus.png","./image/logo/wangyiyunmusic.png","./image/logo/wechat.png","./image/logo/weibo.png","./image/logo/wepe.png","./image/logo/woshipm.png","./image/logo/ycombinator.png","./image/logo/youxiang.png","./image/logo/zaodula.png","./image/logo/zhangxinxu.png","./image/logo/zhihu.png","./image/logo/zxcs.png","./image/app/baiduyun.png","./image/app/csdn.png","./image/app/douban.png","./image/app/facebook.png","./image/app/gitee.png","./image/app/github.png","./image/app/gmail.png","./image/app/google.png","./image/app/jianshu.png","./image/app/juejin.png","./image/app/kugou.png","./image/app/outlook.png","./image/app/qq.png","./image/app/tieba.png","./image/app/twitter.png","./image/app/v2ex.png","./image/app/wangyiyunmusic.png","./image/app/wechat.png","./image/app/weibo.png","./image/app/youxiang.png","./image/app/zhihu.png"]
var cacheName = 'www.hjx24.com';
var apiCacheName = 'huangjx';
var cacheFiles = [
    '/',
    './image/favicon.png',
    './json/data.json',
    './image/beian/备案图标.png',
    './sw.js',
    ...imgList
];

/**
 * service worker
 */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function () {
        console.log('Service Worker 注册成功');
    });
}

// 监听install事件，安装完成后，进行文件缓存
self.addEventListener('install', function (e) {
    console.log('Service Worker 状态： install');
    var cacheOpenPromise = caches.open(cacheName).then(function (cache) {
        return cache.addAll(cacheFiles);
    });
    e.waitUntil(cacheOpenPromise);
});

// 监听activate事件，激活后通过cache的key来判断是否更新cache中的静态资源
self.addEventListener('activate', function (e) {
    console.log('Service Worker 状态： activate');
    var cachePromise = caches.keys().then(function (keys) {
        return Promise.all(keys.map(function (key) {
            if (key !== cacheName && key !== apiCacheName) {
                return caches.delete(key);
            }
        }));
    })
    e.waitUntil(cachePromise);
    // 注意不能忽略这行代码，否则第一次加载会导致fetch事件不触发
    return self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    // 需要缓存的xhr请求
    var cacheRequestUrls = [
        'json',
        'image'
    ];
    // console.log('现在正在请求：' + e.request.url);

    // 判断当前请求是否需要缓存
    var needCache = cacheRequestUrls.some(function (url) {
        return e.request.url.indexOf(url) > -1;
    });

    if (needCache) {
        // 需要缓存
        // 使用fetch请求数据，并将请求结果clone一份缓存到cache
        // 此部分缓存后在browser中使用全局变量caches获取
        caches.open(apiCacheName).then(function (cache) {
            return fetch(e.request).then(function (response) {
                cache.put(e.request.url, response.clone());
                return response;
            });
        });
    }
    else {
        // 非api请求，直接查询cache
        // 如果有cache则直接返回，否则通过fetch请求
        e.respondWith(
            caches.match(e.request).then(function (cache) {
                return cache || fetch(e.request);
            }).catch(function (err) {
                console.log(err);
                return fetch(e.request);
            })
        );
    }
});
