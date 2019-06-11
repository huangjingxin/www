var images = ["./image/logo/173app.png", "./image/logo/5iwanyouxi.png", "./image/logo/80s.png", "./image/logo/97manhua.png", "./image/logo/alibaba-opsx.png", "./image/logo/anyknew.png", "./image/logo/appinn.png", "./image/logo/baiduyun.png", "./image/logo/beipy.png", "./image/logo/biquge5200.png", "./image/logo/bootcdn.png", "./image/logo/bootcss.png", "./image/logo/bundlephobia.png", "./image/logo/chanpin100.ico", "./image/logo/chuyu.png", "./image/logo/ciliwa.png", "./image/logo/cli.png", "./image/logo/csdn.png", "./image/logo/den4b.png", "./image/logo/dev-web.png", "./image/logo/docschina.png", "./image/logo/douban.png", "./image/logo/dribbble.ico", "./image/logo/easyicon.png", "./image/logo/facebook.png", "./image/logo/feeder.png", "./image/logo/firefox-send.png", "./image/logo/flighty.png", "./image/logo/foundertype.png", "./image/logo/gitee.png", "./image/logo/github.png", "./image/logo/gmail.png", "./image/logo/google-extensions.png", "./image/logo/google-fonts.png", "./image/logo/google.png", "./image/logo/greasyfork.png", "./image/logo/huaban.png", "./image/logo/iconfont.png", "./image/logo/imooc.png", "./image/logo/inoreader.png", "./image/logo/itellyou.png", "./image/logo/iyunying.png", "./image/logo/jianshu.png", "./image/logo/jiumodiary.png", "./image/logo/juejin.png", "./image/logo/kugou.png", "./image/logo/laimanhua.png", "./image/logo/lantern.ico", "./image/logo/laomoit.png", "./image/logo/liaoxuefeng.png", "./image/logo/linshiyouxiang.png", "./image/logo/manhuagui.png", "./image/logo/miku.png", "./image/logo/mozilla.png", "./image/logo/niaogebiji.png", "./image/logo/oschina.png", "./image/logo/outlook.png", "./image/logo/pdflibr.ico", "./image/logo/qq-ke.png", "./image/logo/qq-pc.png", "./image/logo/qq.png", "./image/logo/reederapp.png", "./image/logo/rss-feed-reader.png", "./image/logo/rsshub.png", "./image/logo/ruanyifeng.png", "./image/logo/rufus.png", "./image/logo/runningcheese.png", "./image/logo/runoob.png", "./image/logo/tampermonkey.png", "./image/logo/tieba.png", "./image/logo/toolfk.png", "./image/logo/tophub.png", "./image/logo/twitter.png", "./image/logo/ui.ico", "./image/logo/vxia.png", "./image/logo/w3cplus.png", "./image/logo/w3school.png", "./image/logo/wangyiyunmusic.png", "./image/logo/wechat.png", "./image/logo/weibo.png", "./image/logo/wepe.png", "./image/logo/woshipm.png", "./image/logo/ycombinator.png", "./image/logo/youxiang.png", "./image/logo/ypojie.ico", "./image/logo/zaodula.png", "./image/logo/zcool.ico", "./image/logo/zhangxinxu.png", "./image/logo/zhihu.png", "./image/logo/zxcs.png", "./image/app/baiduyun.png", "./image/app/csdn.png", "./image/app/douban.png", "./image/app/facebook.png", "./image/app/gitee.png", "./image/app/github.png", "./image/app/gmail.png", "./image/app/google.png", "./image/app/jianshu.png", "./image/app/juejin.png", "./image/app/kugou.png", "./image/app/outlook.png", "./image/app/qq.png", "./image/app/tieba.png", "./image/app/twitter.png", "./image/app/v2ex.png", "./image/app/wangyiyunmusic.png", "./image/app/wechat.png", "./image/app/weibo.png", "./image/app/youxiang.png", "./image/app/zhihu.png"]
var VERSION = 'v1';
var cacheFiles = [
    './',
    './pwa/manifest.json',
    './pwa/icons/logo-32.png',
    './pwa/icons/logo-72.png',
    './pwa/icons/logo-128.png',
    './pwa/icons/logo-144.png',
    './pwa/icons/logo-256.png',
    './pwa/icons/logo-512.png',
    './image/about/qrcode.png',
    './image/favicon.ico',
    './image/logo.png',
    './image/foot/beian.png',
    './data/data.json',
    './sw.js',
    ...images
];

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').then(function () {
        console.log('Service Worker 注册成功');
    });
}

this.addEventListener('install', function (event) {
    console.log('安装 sw.js');
    event.waitUntil(
        caches.open(VERSION).then(function (cache) {
            return cache.addAll(cacheFiles);
        })
    )
});

this.addEventListener('activate', function (event) {
    console.log('激活 sw.js，可以开始处理 fetch 请求。');
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
                console.log('fetch ', event.request.url, '有缓存，从缓存中取');
                return resp;
            } else {
                console.log('fetch ', event.request.url, '没有缓存，网络获取');
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