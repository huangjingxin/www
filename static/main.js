new Vue({
    el: '#app',
    data: {
        sites: [],
        apps: [],
        showMenu: false,
        isFixed: true,
        focus: false,
        input: '',
        results: [],
        view: [], // results 中可见元素的 index
        id: 0,
    },
    created() {
        if (document.documentElement.clientWidth > 567) {
            this.showMenu = true;
        }
        fetch('./data/site.json')
            .then(res => res.json())
            .then(data => {
                this.sites = data;
            });
        fetch('./data/app.json')
            .then(res => res.json())
            .then(data => {
                this.apps = data;
            });
        // 初始化 view 数组
        this.view = Array.from(new Array(Math.floor(window.innerHeight * 0.8 / 130) - 1).keys());
    },
    methods: {
        open(url) {
            window.open(url, '_blank')
        },
        jump(id) {
            document.getElementById(id).scrollIntoView();
            // 如果是手机端，就顺带把导航栏关闭
            if (document.documentElement.clientWidth < 567) {
                this.showMenu = false;
            }
        },
        search(keyword) {
            this.sites.forEach(x => {
                x.lists.forEach((i) => {
                    if (i.search.join().indexOf(keyword) > -1) {
                        this.results.push(i);
                    }
                })
            })
        },
        inputEnter() {
            this.input = '';
            this.open(this.results[this.id].url);
        },
        inputEsc() {
            this.input = '';
        },
        inputUp() {
            if (this.id === 0) {
                this.id = 0
            } else {
                this.id -= 1;
                if (this.view.indexOf(this.id) === -1) {
                    document.getElementById('result-' + this.id).scrollIntoView();
                    this.view = this.view.map(x => x - 1)
                }
            }
        },
        inputDown() {
            if (this.id === this.results.length - 1) {
                this.id = this.results.length - 1
            } else {
                this.id += 1;
                if (this.view.indexOf(this.id) === -1) {
                    document.getElementById('result-' + (this.id - this.view.length)).scrollIntoView();
                    this.view = this.view.map(x => x + 1)
                }
            }
        },
        resetView() {
            // 重置数组
            this.view = this.view.map((x, index) => x[index] = index);
        }
    },
    watch: {
        input: function (newInput, oldInput) {
            this.id = 0;
            this.results = [];
            this.resetView();
            // 滚动条 回到顶部
            setTimeout(() => {
                document.getElementById("search-result-box-top").scrollIntoView();
            }, 50)
            newInput = newInput.trim().toLowerCase();
            if (newInput) {
                this.search(newInput);
            }
        }
    }
})