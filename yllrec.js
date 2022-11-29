class yllrec {


    config_timemachine = 20; // 时间机器的扫描间隔时间
    config_contentupload = 1000; // 数据上传间隔
    config_recvapi = './recv.php'; // 数据上报的api
    config_debug = false; // 是否启用控制台输出


    handle_timemachine = 0;
    handle_reccontent = {};
    content = [];

    constructor () {

        this._init_event(); // 初始化监听器
        this._init_timemachine(); // 初始化时间机器

    }

    _init_event () {

        var flush_screen = () => {

            this.handle_reccontent.screeninfo = {
                'aliscreenwidth': window.screen.availWidth,
                'aliscreenheight': window.screen.availHeight,
                'screenwidth': window.screen.width,
                'screenheight': window.screen.height,
                'scrolltop': document.documentElement.scrollTop,
                'htmlheight': document.body.scrollHeight
            }

        };

        document.onmousemove = (event) => {
            
            this.handle_reccontent.mouseinfo = {
                'clientx': event.clientX,
                'clienty': event.clientY
            }

        }

        window.addEventListener('scroll', flush_screen);
        window.addEventListener('resize', flush_screen);

        flush_screen();

    }

    _init_timemachine () {

        setInterval(() => {

            // console.log(Object.prototype.isPrototypeOf(this.handle_reccontent));

            if (!(Object.prototype.isPrototypeOf(this.handle_reccontent) && Object.keys(this.handle_reccontent).length === 0)) {

                var cached = {
                    'index': this.handle_timemachine,
                    'url': window.location.href,
                    'cookie': document.cookie,
                    'content': this.handle_reccontent
                };

                if (this.config_debug) { console.log('[yllrec] =>', cached); }

                this.content.push(cached);
                this.handle_reccontent = {};

            }
            
            this.handle_timemachine += 1;

        }, this.config_timemachine);

        setInterval(() => {

            if (!(Object.prototype.isPrototypeOf(this.content) && Object.keys(this.content).length === 0)) {
                var httpRequest = new XMLHttpRequest();
                httpRequest.open('POST', this.config_recvapi, true);
                httpRequest.setRequestHeader('Content-type', 'application/json');
                httpRequest.send(JSON.stringify({'content': this.content}));
                this.content = [];
                if (this.config_debug) { console.log('[yllrec] => data sending.......'); }
            }


        }, this.config_contentupload)

    }
}

new yllrec();