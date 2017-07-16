'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import './water.scss';

(function () {

    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype = {
        emit: function emit(eventName) {
            var _this = this;

            var cbs = this.events[eventName];
            if (cbs && cbs.length) {
                var args = [].slice.call(arguments, 1);
                cbs.forEach(function (cb) {
                    cb.apply(_this, args);
                });
            }
        },
        on: function on(eventName, cb) {
            (this.events[eventName] || (this.events[eventName] = [])).push(cb);
        }
    };

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
        init: function init($app) {
            var _this2 = this;

            this.$app = $app;
            this.$ryc = $('.select-ryc', this.$app);
            this.$hrz = $('.select-hrz', this.$app);
            this.$ryc.on('change', function () {
                _this2.initHrz(_this2.rycs[_this2.$ryc.val()]);
            });
            this.$hrz.on('change', function () {
                var ryc = _this2.rycs[_this2.$ryc.val()];
                var hrz = _this2.hrzs[_this2.$hrz.val()];
                _this2.emit('change-region', ryc, hrz);
            });
            this.initData();
        },
        initData: function initData() {
            var _this3 = this;

            Promise.resolve(getCustomConfig('loadRyc')).then(function (items) {
                _this3.rycs = items || [];
                _this3.$ryc.html(items.map(function (ryc, index) {
                    return '<option value="' + index + '">' + ryc.text + '</option>';
                }));
                if (items && items.length) {
                    _this3.initHrz(items[0]);
                }
            });
        },
        initHrz: function initHrz(ryc) {
            var _this4 = this;

            Promise.resolve(getCustomConfig('loadHrz', false, ryc)).then(function (items) {
                _this4.hrzs = items || [];
                _this4.$hrz.html(items.map(function (hrz, index) {
                    return '<option value="' + index + '">' + hrz.text + '</option>';
                }));
                _this4.emit('change-region', ryc, _this4.hrzs[0]);
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
        init: function init($app, options) {
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
        initDatePicker: function initDatePicker() {
            var _this5 = this;

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
            $datetimepicker.on('change', function (ev) {
                _this5.emit('change-date', ev.target.value);
            });
            this.on('set-date', function (date) {
                $datetimepicker.val(date);
                _this5.emit('change-date', date);
            });
        },

        /**
         * 时间选择框
         * 
         */
        initTimePicker: function initTimePicker() {
            var _this6 = this;

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
                $slider.css('left', left - 6 + 'px');
                self.emit('change-time', $this.data('time'));
            });
            //拖动事件
            var startX = 0,
                startLeft = 0,
                fullWidth = 0;

            function sliderMousemove(ev) {
                var currentLeft = startLeft + (ev.clientX - startX - $rule.offset().left);
                if (currentLeft > 0 && currentLeft < fullWidth) {
                    $slider.css('left', currentLeft + 'px');
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
                    $slider.css('left', left + 'px');
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
            this.on('set-time', function (time) {
                _this6.$timeSlider.css('left', _this6._timeToLeft(time));
                _this6.emit('change-time', time);
            });
        },

        /**
         * 按钮栏
         * 
         */
        initToolbar: function initToolbar() {
            var _this7 = this;

            var $current = $('.time-current', this.$app),
                $prev = $('.time-prev', this.$app),
                $next = $('.time-next', this.$app);
            $prev.on('click', function () {
                _this7.setTime(_this7.state.currentTime - _this7.options.timeStep * 1000);
            });
            $next.on('click', function () {
                _this7.setTime(_this7.state.currentTime + _this7.options.timeStep * 1000);
            });
            $current.on('click', function () {
                _this7.setNow();
            });
        },

        /**
         * 初始化事件
         */
        initEvents: function initEvents() {
            var _this8 = this;

            var self = this;

            function refresh() {
                if (self.state.currentDate && self.state.currentTime) {
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
            this.on('change-time', function (time) {
                _this8.state.currentTime = time;
                refresh();
            });
            this.on('change-date', function (date) {
                _this8.state.currentDate = date;
                refresh();
            });
        },

        /**
         * 初始化状态
         */
        initState: function initState() {
            this.setNow();
        },
        setNow: function setNow() {
            var now = new Date();
            this.setTime((now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()) * 1000);
            this.setDate(now);
        },

        /**
         * 设置日期
         * @param  time 
         */
        setDate: function setDate(time) {
            var date = time;
            if (!isNaN(time)) {
                date = new Date(time);
            }
            this.emit('set-date', this._formatDate(date));
        },

        /**
         * 设置时间
         * @param  time 
         */
        setTime: function setTime(time) {
            this.emit('set-time', time);
        },
        _timeToLeft: function _timeToLeft(time) {
            time /= 1000;
            var currentStep = Math.floor(time / this.options.timeStep);
            return currentStep * 7 + 1;
        },
        _formatDate: function _formatDate(date) {
            if (!isNaN(date)) {
                date = new Date(date);
            } else {
                date = new Date();
            }
            return date.getFullYear() + '-' + this._toFull(date.getMonth() + 1) + '-' + this._toFull(date.getDate());
        },
        _toFull: function _toFull(v) {
            return +v < 10 ? '0' + v : v;
        },
        _getTime: function _getTime(seconds) {
            var hour = Math.floor(seconds / 3600),
                mint = Math.floor(seconds % 3600 / 60);
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (mint < 10) {
                mint = '0' + mint;
            }
            return hour + ':' + mint;
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
        init: function init(el, config) {
            var _this9 = this;

            this.$app = $(el);
            Object.assign(CommonConfig, config);
            this.initOptions();
            this.initChart();
            RegionTrigger.on('change-region', function (ryc, hrz) {
                console.log('change-region');
                _this9.filter.region = {
                    ryc: ryc,
                    hrz: hrz
                };
                _this9.loadData();
            });
            TimeTrigger.on('change-datetime', function (datetime) {
                console.log('change-datetime');
                _this9.filter.time = datetime;
                _this9.loadData();
            });
            //时间触发器初始化
            TimeTrigger.init(this.$app);
            RegionTrigger.init(this.$app);
        },
        initOptions: function initOptions() {
            this.chartOptions = _defineProperty({
                title: {
                    text: ''
                },
                tooltip: {
                    triggerOn: 'none',
                    formatter: function formatter(params) {
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
                }, {
                    type: 'slider',
                    yAxisIndex: 0,
                    filterMode: 'empty'
                }, {
                    type: 'inside',
                    xAxisIndex: 0,
                    filterMode: 'empty'
                }, {
                    type: 'inside',
                    yAxisIndex: 0,
                    filterMode: 'empty'
                }],
                series: [{
                    name: 'scatter',
                    type: 'scatter',
                    xAxisIndex: 0,
                    yAxisIndex: 0,
                    data: [],
                    itemStyle: {}
                }]
            }, 'tooltip', {
                trigger: 'item'
            });
        },
        initChart: function initChart() {
            var chart = this.chart = echarts.init($('#water-pressure-app .water-pressure-chart')[0]);
            chart.setOption(this.chartOptions);
        },
        loadData: function loadData() {
            var _this10 = this;

            var filter = this.filter;
            if (filter.region && filter.time) {
                this.chart.showLoading(getCustomConfig('chartLoadingStyle', false) || {
                    text: 'loading',
                    color: '#c23531',
                    textColor: '#000',
                    maskColor: 'rgba(0, 0, 0, 0.8)',
                    zlevel: 0
                });
                Promise.resolve(getCustomConfig('loadData', false, filter.region.ryc, filter.region.hrz, filter.time)).then(function (res) {
                    //格式化图表数据
                    var chartData = _this10._cast(res);
                    //调整option
                    var chartOptions = _this10.chartOptions;
                    var series = [];
                    //坐标轴
                    chartOptions.xAxis.max = chartData.xAxisMax;
                    chartOptions.yAxis.max = chartData.yAxisMax;
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
                    _this10.chart.setOption(chartOptions, true);
                    _this10.chart.hideLoading();
                });
            }
        },
        _cast: function _cast(items) {
            var _this11 = this;

            items = items || [];
            var points = [],
                lines = [],
                dataMap = {},
                yAxisMax = 0;
            var pointNames = ['standardHigh', 'standardLow', 'high', 'low'];
            items.forEach(function (item, index) {
                item._pointStyle = {};
                yAxisMax = Math.max(yAxisMax, item.high);
                yAxisMax = Math.max(yAxisMax, item.standardHigh);
                //点
                pointNames.forEach(function (name) {
                    var style = getCustomConfig('pointStyle', false, item, name);
                    item._pointStyle[name] = style;
                    points.push({
                        name: 'scatter',
                        type: 'scatter',
                        xAxisIndex: 0,
                        yAxisIndex: 0,
                        data: [[index + 1, item[name]]],
                        itemStyle: style,
                        symbolSize: style.symbolSize || 10,
                        label: {
                            normal: {
                                show: name == 'high' || name == 'low' ? true : false,
                                position: ['0%', name == 'high' ? '-200%' : '200%'],
                                formatter: function formatter() {
                                    return name == 'high' || name == 'low' ? getCustomConfig('pointLabel', false, item, name) : '';
                                },
                                textStyle: getCustomConfig('pointLabelStyle', false, item, name)
                            }
                        },
                        tooltip: {
                            formatter: function formatter() {
                                return getCustomConfig('pointTip', false, item, name);
                            }
                        }
                    });
                });
            });

            items.forEach(function (item, index) {
                //线
                //竖线
                ['standardHigh-standardLow', 'high-low'].forEach(function (name) {
                    var ts = name.split('-');
                    var lineStyle = getCustomConfig('lineStyle', false, item, null, name);
                    var line_1_Style = $.extend(true, {}, lineStyle);
                    line_1_Style.normal.color = _this11._caculateLineColor({
                        x: index + 1,
                        y: item[ts[0]],
                        color: item._pointStyle[ts[0]].normal.borderColor
                    }, {
                        x: index + 1,
                        y: item[ts[1]],
                        color: item._pointStyle[ts[1]].normal.borderColor
                    });
                    lines.push({
                        coords: [[index + 1, item[ts[0]]], // 起点
                        [index + 1, item[ts[1]]] // 终点
                        ],
                        tooltip: {
                            formatter: function formatter() {
                                return getCustomConfig('lineTip', false, item, null, name);
                            }
                        },
                        lineStyle: line_1_Style
                    });
                });
                //间隔线
                if (index < items.length - 1) {
                    var nextItem = items[index + 1];
                    pointNames.forEach(function (name) {
                        var line_Style = getCustomConfig('lineStyle', false, item, nextItem, name);
                        line_Style.normal.color = _this11._caculateLineColor({
                            x: index + 1,
                            y: item[name],
                            color: item._pointStyle[name].normal.borderColor
                        }, {
                            x: index + 2,
                            y: nextItem[name],
                            color: nextItem._pointStyle[name].normal.borderColor
                        });
                        lines.push({
                            coords: [[index + 1, item[name]], // 起点
                            [index + 2, nextItem[name]] // 终点
                            ],
                            tooltip: {
                                formatter: function formatter() {
                                    return getCustomConfig('lineTip', false, item, nextItem, name);
                                }
                            },
                            lineStyle: line_Style
                        });
                    });
                }
            });
            return {
                points: points,
                lines: lines,
                xAxisMax: items.length + 1,
                yAxisMax: yAxisMax % 10 == 0 ? yAxisMax + 10 : yAxisMax + 10 - yAxisMax % 10
            };
        },

        /**
         * 计算颜色
         * @param {*} point1 
         * @param {*} point2 
         */
        _caculateLineColor: function _caculateLineColor(point1, point2) {
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
