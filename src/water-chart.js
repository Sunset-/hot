import EventEmitter from './EventEmitter';
import './water.scss';

(function () {

    var $waterPressureApp = $('#water-pressure-app');

    var DEFAULT_OPTIONS = {
        TIME_TRIGGER: {
            timeStep: 300,
            longShort: '1,0'
        }
    };



    var TimeTrigger = Object.assign(new EventEmitter(), {
        init($app, options) {
            this.$app = $app;
            this.options = Object.assign(DEFAULT_OPTIONS.TIME_TRIGGER, options);
            this.initDatePicker();
            this.initTimePicker();
            this.initToolbar();
        },
        /**
         * 日期选择框
         * 
         */
        initDatePicker() {
            $('.datetimepicker', this.$app).datetimepicker({
                yearOffset: 0,
                lang: 'ch',
                timepicker: false,
                format: 'Y-m-d',
                formatDate: 'Y-m-d',
                minDate: this._formatDate(0), // yesterday is minimum date
                maxDate: this._formatDate(Date.now()), // and tommorow is maximum date calendar
                theme: 'dark'
            });
        },
        /**
         * 时间选择框
         * 
         */
        initTimePicker() {
            var options = this.options,
                step = options.timeStep,
                longShort = options.longShort.split(',').map(i => +i);
            var $app = this.$app,
                $container = $('.time-bar', $app),
                $rule = $('<div class="time-bar-rule"></div>'),
                $slider = $('<div></div>'),
                $long = $('<div class="long-pointer"></div>'),
                $short = $('<div class="short-pointer"></div>'),
                $slider = $('<div class="time-bar-slider"></div>');
            $container.append($rule);
            $container.append($slider);
            $rule.append($slider);

            var count = Math.floor(86400 / step);
            for (var i = 0; i <= count; i++) {
                var $pointer;
                if (i % 5 == 0) {
                    $pointer = $long.clone();
                    if (i % 10 == 0) {
                        $pointer.attr('time', this._getTime(i * step));
                    }
                } else {
                    $pointer = $short.clone();
                }
                $rule.append($pointer);
            }
            $rule.width((steps + 1) * 4);

            $container.mCustomScrollbar({
                axis: "x"
            });
        },
        /**
         * 按钮栏
         * 
         */
        initToolbar() {

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









    var symbolSize = 10;


    var items = [{
        high: 80,
        low: 20
    }, {
        high: 70,
        low: 25
    }, {
        high: 60,
        low: 30
    }, {
        high: 50,
        low: 35
    }, {
        high: 45,
        low: 40
    }];


    var points = [];
    var lines = [];


    items.forEach((item, index) => {
        points.push([(index + 1) * 5, item.high]);
        points.push([(index + 1) * 5, item.low]);

        lines.push({
            coords: [
                [(index + 1) * 5, item.high], // 起点
                [(index + 1) * 5, item.low] // 终点
            ],
            tooltip: {
                formatter() {
                    return '瓦咔咔'
                }
            },
            lineStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0.5,
                        y: 1,
                        x2: 1,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: 'red' // 0% 处的颜色
                        }, {
                            offset: 1,
                            color: 'blue' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                    },
                    width: 3
                }
            }
        });
        if (index > 0) {
            var last = items[index - 1];
            lines.push({
                coords: [
                    [(index) * 5, last.high], // 起点
                    [(index + 1) * 5, item.high] // 终点
                ],
                tooltip: {
                    formatter() {
                        return '瓦咔咔'
                    }
                },
                lineStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0.5,
                            y: 1,
                            x2: 1,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'red' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'blue' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        width: 3
                    }
                }
            });
            lines.push({
                coords: [
                    [(index) * 5, last.low], // 起点
                    [(index + 1) * 5, item.low] // 终点
                ],
                tooltip: {
                    formatter() {
                        return '瓦咔咔'
                    }
                },
                lineStyle: {
                    normal: {
                        color: {
                            type: 'linear',
                            x: 0.5,
                            y: 1,
                            x2: 1,
                            y2: 1,
                            colorStops: [{
                                offset: 0,
                                color: 'red' // 0% 处的颜色
                            }, {
                                offset: 1,
                                color: 'blue' // 100% 处的颜色
                            }],
                            globalCoord: false // 缺省为 false
                        },
                        width: 3
                    }
                }
            });

        }
    });



    var data = [
        [5, 80],
        [10, 78],
        [15, 76],
        [20, 74],
        [25, 72],
        [30, 70],
        [35, 68],
        [40, 66]
    ];

    var datas = [
        [
            [5, 80],
            [10, 78],
            [15, 76],
            [20, 74],
            [25, 72],
            [30, 70],
            [35, 68],
            [40, 66]
        ],
        [
            [5, 20],
            [10, 22],
            [15, 24],
            [20, 26],
            [25, ],
            [30, 30],
            [35, 32],
            [40, 34]
        ],
        [
            [5, 80],
            [10, 76],
            [15, 75],
            [20, 70],
            [25, 68],
            [30, 62],
            [35, 59],
            [40, 57]
        ],
        [
            [5, 20],
            [10, 26],
            [15, 29],
            [20, 31],
            [25, 33],
            [30, 36],
            [35, 38],
            [40, 41]
        ],
        [
            [5, 20],
            [5, 80]
        ],
        [
            [10, 76],
            [10, 26]
        ]
    ];

    var option = {
        title: {
            text: '自由线'
        },
        tooltip: {
            triggerOn: 'none',
            formatter: function (params) {
                return 'X: ' + params.data[0].toFixed(2) + '<br>Y: ' + params.data[1].toFixed(2);
            }
        },
        grid: {},
        xAxis: {
            min: 0,
            max: 50,
            type: 'value',
            axisLine: {
                onZero: false
            }
        },
        yAxis: {
            min: 0,
            max: 100,
            type: 'value',
            axisLine: {
                onZero: false
            }
        },
        dataZoom: [{
                type: 'slider',
                xAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                type: 'slider',
                yAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                type: 'inside',
                xAxisIndex: 0,
                filterMode: 'empty'
            },
            {
                type: 'inside',
                yAxisIndex: 0,
                filterMode: 'empty'
            }
        ],
        series: [{
            name: 'I',
            type: 'scatter',
            xAxisIndex: 0,
            yAxisIndex: 0,
            data: points
        }, {
            id: 'f',
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            // smooth: true,
            symbolSize: symbolSize,
            data: lines
        }],
        tooltip: {
            trigger: 'item'
        }
    };


    var chart = echarts.init($('#water-pressure-app .water-pressure-chart')[0]);
    chart.setOption(option);



    TimeTrigger.init($waterPressureApp);

})();