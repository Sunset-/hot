(function () {
    var symbolSize = 10;
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
            [25,  ],
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
            id: 'a',
            type: 'line',
            // smooth: true,
            symbolSize: symbolSize,
            data: datas[0]
        }, {
            id: 'b',
            type: 'line',
            // smooth: true,
            symbolSize: symbolSize,
            data: datas[1]
        }, {
            id: 'c',
            type: 'line',
            // smooth: true,
            symbolSize: symbolSize,
            data: datas[2],
            markLine: {
                data: [
                    [{
                            coord: [0, 40]
                        },
                        {
                            coord: [40, 40]
                        }
                    ]
                ]
            }
        }, {
            id: 'd',
            type: 'line',
            // smooth: true,
            symbolSize: symbolSize,
            data: datas[3]
        }, {
            id: 'e',
            type: 'line',
            // smooth: true,
            symbolSize: symbolSize,
            data: datas[4]
        }, {
            id: 'f',
            type: 'lines',
            coordinateSystem: 'cartesian2d',
            // smooth: true,
            symbolSize: symbolSize,
            data: [{
                coords: [
                    [15, 66], // 起点
                    [30, 62] // 终点
                ],
                tooltip: {
                    formatter(){
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
                        width : 35
                    }
                }
            }]
        }],
        tooltip: {
            trigger: 'item'
        }
    };


    var chart = echarts.init(document.getElementById('chart'));
    chart.setOption(option);
})();