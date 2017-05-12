/*

var dom = document.getElementById("container");
var myChart = echarts.init(dom);

var app = {};
var option = null;
app.title = '热力管网';

var data1 = [

    {
        name: '城北',
        value: 70
    },
    {
        name: '渭水',
        value: 43
    },
    {
        name: '太华',
        value: 44
    },
    {
        name: '城区',
        value: 72
    },
    {
        name: '雁东',
        value: 92
    },
    {
        name: '北联',
        value: 72
    },
    {
        name: '泾渭',
        value: 32
    },
    {
        name: '草堂',
        value: 52
    },
    {
        name: '高陵',
        value: 32
    },
    {
        name: '阎良',
        value: 42
    },
];
var geoCoordMap = {
    '城北': [108.96, 34.32],
    '渭水': [108.91, 34.38],
    '太华': [109.01, 34.30],
    '城区': [108.953650, 34.26564],
    '雁东': [109.02, 34.23],
    '北联': [109.01, 34.39],
    '泾渭': [109.03, 34.48],
    '草堂': [108.70, 34.03],
    '高陵': [109.09, 34.55],
    '阎良': [109.19, 34.65]
};

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};

$.getJSON('lines-tube.json', function (data) {
    var hStep = 300 / (data.length - 1);
    var pipeLines = [].concat.apply([], data.map(function (pipeLine, idx) {
        var prevPt;
        var points = [];
        for (var i = 0; i < pipeLine.length; i += 2) {
            var pt = [pipeLine[i], pipeLine[i + 1]];
            if (i > 0) {
                pt = [
                    prevPt[0] + pt[0],
                    prevPt[1] + pt[1]
                ];
            }
            prevPt = pt;

            points.push([pt[0] / 1e4, pt[1] / 1e4]);
        }
        return {
            coords: points,
            lineStyle: {
                normal: {
                    color: echarts.color.modifyHSL('#5A94DF', Math.round(hStep * idx))
                }
            }
        };
    }));



    myChart.setOption(

        option = {
            bmap: {
                center: [109.0404, 34.3252],
                zoom: 11,
                roam: true,
                mapStyle: {
                    'styleJson': [{
                            'featureType': 'water',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#031628'
                            }
                        },
                        {
                            'featureType': 'land',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#000104'
                            }
                        },
                        {
                            'featureType': 'highway',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        },
                        {
                            'featureType': 'arterial',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'arterial',
                            'elementType': 'geometry.stroke',
                            'stylers': {
                                'color': '#0b3d51'
                            }
                        },
                        {
                            'featureType': 'local',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'railway',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'railway',
                            'elementType': 'geometry.stroke',
                            'stylers': {
                                'color': '#08304b'
                            }
                        },
                        {
                            'featureType': 'subway',
                            'elementType': 'all',
                            'stylers': {
                                'lightness': -70,
                                'visibility': 'off'
                            }
                        },
                        {
                            'featureType': 'building',
                            'elementType': 'geometry.fill',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'all',
                            'elementType': 'labels.text.fill',
                            'stylers': {
                                'color': '#857f7f'
                            }
                        },
                        {
                            'featureType': 'all',
                            'elementType': 'labels.text.stroke',
                            'stylers': {
                                'color': '#000000'
                            }
                        },
                        {
                            'featureType': 'building',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#022338'
                            }
                        },
                        {
                            'featureType': 'green',
                            'elementType': 'geometry',
                            'stylers': {
                                'color': '#062032'
                            }
                        },
                        {
                            'featureType': 'boundary',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#465b6c'
                            }
                        },
                        {
                            'featureType': 'manmade',
                            'elementType': 'all',
                            'stylers': {
                                'color': '#022338'
                            }
                        },
                        {
                            'featureType': 'Poi',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        },
                        {
                            'featureType': 'label',
                            'elementType': 'all',
                            'stylers': {
                                'visibility': 'off'
                            }
                        }
                    ]
                }
            },
            series: [{
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    polyline: true,
                    data: pipeLines,
                    silent: true,
                    lineStyle: {
                        normal: {
                            // color: '#c23531',
                            // color: 'rgb(200, 35, 45)',
                            opacity: 0.3,
                            width: 2
                        }
                    },
                    progressiveThreshold: 500,
                    progressive: 200
                }, {
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    polyline: true,
                    data: pipeLines,
                    lineStyle: {
                        normal: {
                            width: 0
                        }
                    },
                    effect: {
                        constantSpeed: 20,
                        show: true,
                        trailLength: 0.1,
                        symbolSize: 3
                    },
                    zlevel: 1
                },
                {
                    type: 'scatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data1),
                    symbolSize: function (val) {
                        return val[2] / 5;
                    },
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: false
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#6bd3d3',
                            opacity: 0.3,
                        }
                    }
                },
                {
                    name: 'Top 6',
                    type: 'effectScatter',
                    coordinateSystem: 'bmap',
                    data: convertData(data1.sort(function (a, b) {
                        return b.value - a.value;
                    }).slice(0, 10)),
                    symbolSize: function (val) {
                        return val[2] / 5;
                    },
                    showEffectOn: 'render',
                    rippleEffect: {
                        brushType: 'stroke'
                    },
                    hoverAnimation: true,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'right',
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#6bb2d3',
                            opacity: 0.5,
                            shadowBlur: 20,
                            shadowColor: '#333'
                        }
                    },
                    zlevel: 2


                }
            ]
        });



});



if (option && typeof option === "object") {
    myChart.setOption(option, true);
}

*/