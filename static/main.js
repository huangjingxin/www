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
        results_view: [], // results 中可见元素的 index 组成的 arr
        id: 0, // results 中 hover 元素的 id
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
        // 初始化 results_view 数组
        this.results_view = Array.from(new Array(Math.floor(window.innerHeight * 0.8 / 130) - 1).keys());
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
                    if (i.search.some(x => x.includes(keyword))) {
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
                if (this.results_view.indexOf(this.id) === -1) {
                    document.getElementById('result-' + this.id).scrollIntoView();
                    this.results_view = this.results_view.map(x => x - 1)
                }
            }
        },
        inputDown() {
            if (this.id === this.results.length - 1) {
                this.id = this.results.length - 1
            } else {
                this.id += 1;
                if (this.results_view.indexOf(this.id) === -1) {
                    document.getElementById('result-' + (this.id - this.results_view.length)).scrollIntoView();
                    this.results_view = this.results_view.map(x => x + 1)
                }
            }
        },
        resetView() {
            // 重置数组
            this.results_view = this.results_view.map((x, index) => x[index] = index);
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