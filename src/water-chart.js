// import './water.scss';

(function () {

    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype = {
        emit(eventName) {
            var cbs = this.events[eventName];
            if (cbs && cbs.length) {
                var args = [].slice.call(arguments, 1);
                cbs.forEach(cb => {
                    cb.apply(this, args);
                })
            }
        },
        on(eventName, cb) {
            (this.events[eventName] || (this.events[eventName] = [])).push(cb);
        }
    }

    EventEmitter.prototype.constructor = EventEmitter;

    var CommonConfig = {};

    function getCustomConfig(namespace, useOriginFunction) {
        var config = CommonConfig[namespace],
            args = [].slice.call(arguments, 2);
        if (!useOriginFunction && typeof config == 'function') {
            config = config.apply(null, args);
        }
        return config;
    }

    /**
     * 地址触发器
     */
    var RegionTrigger = Object.assign(new EventEmitter(), {
        init($app) {
            this.$app = $app;
            this.$ryc = $('.select-ryc', this.$app);
            this.$hrz = $('.select-hrz', this.$app);
            this.$ryc.on('change', () => {
                this.initHrz(this.rycs[this.$ryc.val()]);
            });
            this.$hrz.on('change', () => {
                var ryc = this.rycs[this.$ryc.val()];
                var hrz = this.hrzs[this.$hrz.val()];
                this.emit('change-region', ryc, hrz);
            });
            this.initData();
        },
        initData() {
            Promise.resolve(getCustomConfig('loadRyc')).then(items => {
                this.rycs = items || [];
                this.$ryc.html(items.map((ryc, index) => `<option value="${index}">${ryc.text}</option>`));
                if (items && items.length) {
                    this.initHrz(items[0]);
                }
            });
        },
        initHrz(ryc) {
            Promise.resolve(getCustomConfig('loadHrz', false, ryc)).then(items => {
                this.hrzs = items || [];
                this.$hrz.html(items.map((hrz, index) => `<option value="${index}">${hrz.text}</option>`));
                this.emit('change-region', ryc, this.hrzs[0]);
            });
        }
    });

    /**
     * 时间触发器
     */
    var TimeTrigger = Object.assign(new EventEmitter(), {
        state: {
            training: null,
            currentDate: null,
            currentTime: null
        },
        init($app, options) {
            this.$app = $app;
            this.options = Object.assign({}, options);
            this.options.timeStep = getCustomConfig('timeStep', false) || 360;
            this.initDatePicker();
            this.initTimePicker();
            this.initToolbar();
            this.initEvents();
            this.initState();
        },
        /**
         * 日期选择框
         * 
         */
        initDatePicker() {
            var $datetimepicker = $('.datetimepicker', this.$app);
            $datetimepicker.datetimepicker({
                yearOffset: 0,
                lang: 'ch',
                timepicker: false,
                format: 'Y-m-d',
                formatDate: 'Y-m-d',
                minDate: this._formatDate(0), // yesterday is minimum date
                maxDate: this._formatDate(Date.now()), // and tommorow is maximum date calendar
                theme: 'dark'
            });
            $datetimepicker.on('change', (ev) => {
                this.emit('change-date', ev.target.value);
            });
            this.on('set-date', (date, slient) => {
                $datetimepicker.val(date);
                this.emit('change-date', date, slient);
            });
        },
        /**
         * 时间选择框
         * 
         */
        initTimePicker() {
            var self = this,
                options = this.options,
                step = getCustomConfig('timeStep', false) || 360;
            var $app = this.$app,
                $container = $('.time-bar', $app),
                $rule = $('<div class="time-bar-rule"></div>'),
                $slider = $('<div></div>'),
                $long = $('<div class="long-pointer time-pointer"></div>'),
                $short = $('<div class="short-pointer time-pointer"></div>'),
                $slider = this.$timeSlider = $('<div class="time-bar-slider">=</div>');
            $container.append($rule);
            $container.append($slider);
            $rule.append($slider);

            var count = Math.floor(86400 / step);
            for (var i = 0; i < count; i++) {
                var $pointer;
                if (i % 5 == 0) {
                    $pointer = $long.clone();
                    if (i % 10 == 0) {
                        $pointer.attr('timelabel', this._getTime(i * step));
                    }
                } else {
                    $pointer = $short.clone();
                }
                $pointer.data('time', i * step * 1000);
                $rule.append($pointer);
            }
            $rule.width(count * 7);
            $container.mCustomScrollbar({
                axis: "x"
            });
            //点击事件
            $rule.on('click', '.time-pointer', function (ev) {
                var $this = $(this);
                var left = $this.offset().left - $this.offsetParent().offset().left;
                $slider.css('left', `${left-6}px`);
                self.emit('change-time', $this.data('time'));
            });
            //拖动事件
            var startX = 0,
                startLeft = 0,
                fullWidth = 0;

            function sliderMousemove(ev) {
                var currentLeft = startLeft + (ev.clientX - startX - $rule.offset().left);
                if (currentLeft > 0 && currentLeft < fullWidth) {
                    $slider.css('left', `${currentLeft}px`);
                }
            }

            function sliderMouseup(ev) {
                $document.unbind('mousemove', sliderMousemove);
                $document.unbind('mouseup', sliderMouseup);
                var left = parseInt($slider.css('left'));
                if ((left - 1) % 7 != 0) {
                    var yu = (left - 1) % 7;
                    if (yu <= 3) {
                        left -= yu;
                    } else {
                        left += 7 - yu;
                    }
                    $slider.css('left', `${left}px`);
                    self.emit('change-time', (left - 1) / 7 * step * 1000);
                } else {
                    self.emit('change-time', (left - 1) / 7 * step * 1000);
                }
            }
            var $document = $(document);
            $slider.on('mousedown', function (ev) {
                startX = ev.clientX - $rule.offset().left;
                startLeft = parseInt($slider.css('left'));
                fullWidth = $rule.width() - 5;
                $document.bind('mousemove', sliderMousemove);
                $document.bind('mouseup', sliderMouseup);
            });
            //监听事件
            this.on('set-time', (time) => {
                this.$timeSlider.css('left', this._timeToLeft(time));
                this.emit('change-time', time);
            });
        },
        /**
         * 按钮栏
         * 
         */
        initToolbar() {
            var $current = $('.time-current', this.$app),
                $prev = $('.time-prev', this.$app),
                $next = $('.time-next', this.$app);
            $prev.on('click', () => {
                var time = this.state.currentTime - this.options.timeStep * 1000;
                if (time < 0) {
                    time = 86400000 + time;
                    var d = new Date(this.state.currentDate);
                    d.setDate(d.getDate() - 1);
                    this.setDate(d, true);
                }
                this.setTime(time);
            });
            $next.on('click', () => {
                var time = this.state.currentTime + this.options.timeStep * 1000;
                if (time >= 86400000) {
                    time = time - 86400000;
                    var d = new Date(this.state.currentDate);
                    d.setDate(d.getDate() + 1);
                    this.setDate(d, true);
                }
                this.setTime(time);
            });
            $current.on('click', () => {
                this.setNow();
            });
        },
        /**
         * 初始化事件
         */
        initEvents() {
            var self = this;

            function refresh() {
                if (self.state.currentDate !== null && self.state.currentTime !== null) {
                    if (new Date(self.state.currentDate).getTime() + self.state.currentTime - 8 * 3600 * 1000 > Date.now()) {
                        self.setNow();
                    } else {
                        var date = new Date(self.state.currentDate),
                            time = self.state.currentTime,
                            hours = Math.floor(time / 3600000),
                            minutes = Math.floor(time % 3600000 / 60000),
                            seconds = Math.floor(time % 60000 / 1000),
                            ms = Math.floor(time % 1000);
                        date.setHours(hours);
                        date.setMinutes(minutes);
                        date.setSeconds(seconds);
                        date.setMilliseconds(ms);
                        self.emit('change-datetime', date);
                    }
                }
            }
            this.on('change-time', (time) => {
                this.state.currentTime = time;
                refresh();
            });
            this.on('change-date', (date, slient) => {
                this.state.currentDate = date;
                slient || refresh();
            });
        },
        /**
         * 初始化状态
         */
        initState() {
            this.setNow();
        },
        setNow() {
            var now = new Date();
            this.setDate(now, true);
            this.setTime((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000);
        },
        /**
         * 设置日期
         * @param  time 
         */
        setDate(time, slient) {
            var date = time;
            if (!isNaN(time)) {
                date = new Date(time);
            }
            this.emit('set-date', this._formatDate(date), slient);
        },
        /**
         * 设置时间
         * @param  time 
         */
        setTime(time) {
            this.emit('set-time', time);
        },
        _timeToLeft(time) {
            time /= 1000;
            var currentStep = Math.floor(time / this.options.timeStep);
            return currentStep * 7 + 1
        },
        _formatDate(date) {
            if (!isNaN(date)) {
                date = new Date(date);
            } else {
                date = new Date();
            }
            return `${date.getFullYear()}-${this._toFull(date.getMonth()+1)}-${this._toFull(date.getDate())}`
        },
        _toFull(v) {
            return (+v) < 10 ? `0${v}` : v;
        },
        _getTime(seconds) {
            var hour = Math.floor(seconds / 3600),
                mint = Math.floor(seconds % 3600 / 60);
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (mint < 10) {
                mint = '0' + mint;
            }
            return `${hour}:${mint}`;
        }
    });

    /**
     * 水压图表
     */
    var WaterPressureApp = Object.assign(new EventEmitter(), {
        filter: {
            region: null,
            time: null
        },
        init(el, config) {
            this.$app = $(el);
            Object.assign(CommonConfig, config);
            this.initOptions();
            this.initChart();
            RegionTrigger.on('change-region', (ryc, hrz) => {
                console.log('change-region');
                this.filter.region = {
                    ryc: ryc,
                    hrz: hrz
                };
                this.loadData();
            });
            TimeTrigger.on('change-datetime', (datetime) => {
                console.log('change-datetime');
                this.filter.time = datetime;
                this.loadData();
            });
            //时间触发器初始化
            TimeTrigger.init(this.$app);
            RegionTrigger.init(this.$app);
        },
        initOptions() {
            this.chartOptions = {
                title: {
                    text: ''
                },
                tooltip: {
                    triggerOn: 'none',
                    formatter: function (params) {
                        return 'X: ' + params.data[0].toFixed(2) + '<br>Y: ' + params.data[1].toFixed(2);
                    }
                },
                grid: {},
                xAxis: {
                    show: false,
                    min: 0,
                    max: 10,
                    type: 'value',
                    axisLine: {
                        onZero: false
                    }
                },
                yAxis: {
                    min: 0,
                    max: 110,
                    type: 'value',
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: "#F97C07" // 0% 处的颜色
                                }, {
                                    offset: 1,
                                    color: "#86E281" // 100% 处的颜色
                                }],
                                globalCoord: false // 缺省为 false
                            },
                            width: 2
                        }
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#9D9D9D'
                        }
                    },
                    splitLine: {
                        show: false
                    }
                },
                dataZoom: [{
                        type: 'slider',
                        xAxisIndex: 0,
                        filterMode: 'empty'
                    },
                    {
                        type: 'inside',
                        xAxisIndex: 0,
                        filterMode: 'empty'
                    }
                ],
                series: [{
                    name: 'scatter',
                    type: 'scatter',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: [],
                    itemStyle: {}
                }],
                tooltip: {
                    trigger: 'item'
                }

            }
        },
        initChart() {
            var chart = this.chart = echarts.init($('#water-pressure-app .water-pressure-chart')[0]);
            chart.setOption(this.chartOptions);
        },
        loadData() {
            var filter = this.filter;
            if (filter.region && filter.time) {
                this.chart.showLoading(getCustomConfig('chartLoadingStyle', false) || {
                    text: 'loading',
                    color: '#c23531',
                    textColor: '#000',
                    maskColor: 'rgba(0, 0, 0, 0.8)',
                    zlevel: 0
                });
                Promise.resolve(getCustomConfig('loadData', false, filter.region.ryc, filter.region.hrz, filter.time)).then(res => {
                    //格式化图表数据
                    var chartData = this._cast(res);
                    //调整option
                    var chartOptions = this.chartOptions;
                    var series = [];
                    //坐标轴
                    chartOptions.xAxis.max = chartData.xAxisMax;
                    chartOptions.yAxis.max = chartData.yAxisMax;
                    chartOptions.dataZoom[0].end = (getCustomConfig('windowPointCount', false) || 10) / chartData.xAxisMax * 100;
                    //点
                    series = series.concat(chartData.points);
                    //线
                    series.push({
                        id: 'lines',
                        type: 'lines',
                        coordinateSystem: 'cartesian2d',
                        // smooth: true,
                        data: chartData.lines
                    });
                    //刷新图表
                    chartOptions.series = series;
                    this.chart.setOption(chartOptions, true);
                    this.chart.hideLoading();
                });
            }
        },
        _cast(items) {
            items = items || [];
            var points = [],
                lines = [],
                dataMap = {},
                yAxisMax = 0;
            var pointNames = ['standardHigh', 'standardLow', 'high', 'low'];
            items.forEach((item, index) => {
                item._pointStyle = {};
                yAxisMax = Math.max(yAxisMax, item.high);
                yAxisMax = Math.max(yAxisMax, item.standardHigh);
                //点
                pointNames.forEach(name => {
                    var style = getCustomConfig('pointStyle', false, item, name);
                    item._pointStyle[name] = style;
                    points.push({
                        name: 'scatter',
                        type: 'scatter',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: [
                            [index + 1, item[name]]
                        ],
                        itemStyle: style,
                        symbolSize: style.symbolSize || 10,
                        label: {
                            normal: {
                                show: (name == 'high' || name == 'low' ? true : false),
                                position: ['0%', name == 'high' ? '-200%' : '200%'],
                                formatter: function () {
                                    return (name == 'high' || name == 'low') ? getCustomConfig('pointLabel', false, item, name) : '';
                                },
                                textStyle: getCustomConfig('pointLabelStyle', false, item, name)
                            }
                        },
                        tooltip: {
                            formatter: function () {
                                return getCustomConfig('pointTip', false, item, name);
                            }
                        }
                    });
                });
            });

            items.forEach((item, index) => {
                //线
                //竖线
                ['standardHigh-standardLow', 'high-low'].forEach(name => {
                    var ts = name.split('-');
                    var lineStyle = getCustomConfig('lineStyle', false, item, null, name);
                    var line_1_Style = $.extend(true, {}, lineStyle);
                    line_1_Style.normal.color = this._caculateLineColor({
                        x: index + 1,
                        y: item[ts[0]],
                        color: item._pointStyle[ts[0]].normal.borderColor
                    }, {
                        x: index + 1,
                        y: item[ts[1]],
                        color: item._pointStyle[ts[1]].normal.borderColor
                    });
                    lines.push({
                        coords: [
                            [index + 1, item[ts[0]]], // 起点
                            [index + 1, item[ts[1]]] // 终点
                        ],
                        tooltip: {
                            formatter() {
                                return getCustomConfig('lineTip', false, item, null, name);
                            }
                        },
                        lineStyle: line_1_Style
                    });
                });
                //间隔线
                if (index < items.length - 1) {
                    var nextItem = items[index + 1];
                    pointNames.forEach(name => {
                        var line_Style = getCustomConfig('lineStyle', false, item, nextItem, name);
                        line_Style.normal.color = this._caculateLineColor({
                            x: index + 1,
                            y: item[name],
                            color: item._pointStyle[name].normal.borderColor
                        }, {
                            x: index + 2,
                            y: nextItem[name],
                            color: nextItem._pointStyle[name].normal.borderColor
                        });
                        lines.push({
                            coords: [
                                [index + 1, item[name]], // 起点
                                [index + 2, nextItem[name]] // 终点
                            ],
                            tooltip: {
                                formatter() {
                                    return getCustomConfig('lineTip', false, item, nextItem, name);
                                }
                            },
                            lineStyle: line_Style
                        });
                    });
                }
            });
            return {
                points,
                lines,
                xAxisMax: items.length + 1,
                yAxisMax: (yAxisMax % 10 == 0) ? (yAxisMax + 10) : (yAxisMax + 10 - yAxisMax % 10)
            };
        },
        /**
         * 计算颜色
         * @param {*} point1 
         * @param {*} point2 
         */
        _caculateLineColor(point1, point2) {
            var x1, x2, y1, y2;
            if (point1.x < point2.x) {
                x2 = 1;
                x1 = point1.x * 1.0 / point2.x;
            } else {
                x1 = 1;
                x2 = point2.x * 1.0 / point1.x;
            }
            if (point1.y > point2.y) {
                y2 = 1;
                y1 = point2.y * 1.0 / point1.y;
            } else {
                y1 = 1;
                y2 = point1.y * 1.0 / point2.y;
            }
            return {
                type: 'linear',
                x: x1,
                y: y1,
                x2: x2,
                y2: y2,
                colorStops: [{
                    offset: 0,
                    color: point1.color // 0% 处的颜色
                }, {
                    offset: 1,
                    color: point2.color // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            };
        }
    });

    window.WaterPressureApp = WaterPressureApp;


})();