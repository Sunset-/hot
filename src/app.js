(function () {

    //工具方法
    function warn(msg) {
        alert(msg);
        throw new Error(msg);
    }

    //依赖库
    const DEP_LIB = {
        'echarts': 'echarts',
        'BMap': '百度地图',
        'jQuery': 'jQuery'
    };

    //地图风格
    const MAP_THEME = {
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
    };

    const DEFAULT_LINE_STYLE = {
        strokeColor: "blue",
        strokeWeight: 2,
        strokeOpacity: 0.5
    };

    //配置
    const config = {

    };

    var region = [];

    var HeatSourceMapApp = window.HeatSourceMapApp = {
        thens: [],
        inited: false,
        state: {
            nodes: {

            },
            point_node: {

            },
            pipes: {

            }
        },
        init(options = {}) {
            this._checkDepLibs();
            options.container && this._initEchartsMap(options);
            return {
                then: (func) => {
                    if (this.inited) {
                        func.call(this);
                    } else {
                        this.thens.push(func);
                    }
                }
            };
        },
        config(options) {
            Object.assign(config, options);
        },
        _checkDepLibs() {
            Object.keys(DEP_LIB).forEach(key => {
                if (!window[key]) {
                    warn(`未引入${DEP_LIB[key]}库`);
                }
            });
        },
        /**
         * 初始化地图应用
         */
        _initEchartsMap(options) {
            var $container = $(options.container);
            if (!$container.length) {
                warn(`请传入container元素节点`);
                return;
            }
            this.mapChart = echarts.init($container[0]);
            //map
            this.mapChart.setOption({
                bmap: {
                    center: options.center,
                    zoom: options.zoom,
                    roam: options.roam,
                    mapStyle: (options.mapStyle || MAP_THEME)
                },
                series: []
            });
            //获取bmap实例
            setTimeout(() => {
                var model = this.mapChart.getModel(),
                    bmap = null;
                model.eachComponent('bmap', function (bmapModel) {
                    if (bmap == null) {
                        bmap = bmapModel.__bmap;
                    }
                });
                if (!(this.bmap = bmap)) {
                    warn(`未获取到bmap实例`);
                }
                this._initMapEvents();
                while (this.thens.length) {
                    this.thens.shift().call(this);
                }
                this.inited = true;
            });
        },
        _initMapEvents() {
            this.bmap.addEventListener('zoomend', (e) => {
                this.refresh();
            });
            // this.bmap.addEventListener('click', (e) => {
            //     region.push(`${e.point.lng},${e.point.lat}`);
            //     console.log(region.join(';'))
            // });
        },
        /**
         * 添加节点
         * 
         * @param {any} nodes 节点数组
         * @param {any} clearType 清除节点类型
         */
        addNodes(nodes, clearType) {
            this.removeNodes(clearType);
            var nodeMap = this.state.nodes;
            nodes && nodes.forEach(node => {
                this._buildNode(node);
                this._bindNodeEvent(node);
                (nodeMap[node.type] || (nodeMap[node.type] = [])).push(node);
                this.state.point_node[`${node._point.lng},${node._point.lat}`] = node;
            });
            this.refresh(nodes);
        },
        getNodeByPoint(point) {
            return this.state.point_node[point];
        },
        /**
         * 清除节点
         * 
         * @param {any} clearType 节点类型
         * @returns 
         */
        removeNodes(clearType) {
            if (!clearType) {
                return;
            }
            var bmap = this.bmap;
            if (clearType === true) {
                this.state.point_node = {};
                bmap.clearOverlays();
            } else {
                var nodes = this.state.nodes[clearType],
                    point_node = this.state.point_node;
                if (nodes) {
                    var node;
                    while (nodes.length) {
                        node = nodes.pop();
                        delete point_node[`${node._point.lng},${node._point.lat}`];
                        bmap.removeOverlay(node._marker);
                    }
                }
            }
        },
        _buildNode(node) {
            var bmap = this.bmap;
            //点
            var point = new BMap.Point(node.lng, node.lat);
            node._point = point;
            //标
            var marker = new BMap.Marker(point);
            bmap.addOverlay(marker);
            node._marker = marker;
            node._overlays = [node._marker];
            //片
            if (node.region) {
                var points = node.region.split(';').map(p => {
                    var ps = p.split(',');
                    return new BMap.Point(+ps[0], +ps[1], )
                })
                var polygon = new BMap.Polygon(points, {
                    strokeColor: "orange",
                    fillColor: "red",
                    fillOpacity: 0.2,
                    strokeWeight: 2,
                    strokeOpacity: 0.5
                });
                bmap.addOverlay(polygon);
                node._region = polygon;
                node._overlays.push(node._region)
            }
        },
        _bindNodeEvent(node) {
            //区域高亮联动
            node._marker.addEventListener('mouseover', () => {
                node._region && node._region.setFillColor('orange');
                if (node.info) {
                    this._openInfoWindow(node);
                }
            });
            node._marker.addEventListener('mouseout', () => {
                node._region && node._region.setFillColor('red');
                this.bmap.closeInfoWindow();
            });
            if (node.click) {
                node._marker.addEventListener('click', () => {
                    node.click.call(null, node.data);
                });
            }
        },
        _openInfoWindow(node, point) {
            if (!node._infoWindow) {
                var opts = {
                    // offset: new BMap.Size(5, -20)
                }
                var content = (typeof node.info == 'function') ? node.info(node.data) : node.info;
                node._infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
            }
            this.bmap.openInfoWindow(node._infoWindow, point || node._point); //开启信息窗口
        },
        addPipes(pipes, clearType) {
            this.removePipes(clearType);
            var pipeMap = this.state.pipes;
            pipes && pipes.forEach(pipe => {
                if (pipe.path) {
                    this._buildPipe(pipe);
                    this._bindPipeEvent(pipe);
                    (pipeMap[pipe.type] || (pipeMap[pipe.type] = [])).push(pipe);
                }
            });
            this.refresh(null, pipes);
        },
        /**
         * 清除节点
         * 
         * @param {any} clearType 节点类型
         * @returns 
         */
        removePipes(clearType) {
            if (!clearType) {
                return;
            }
            var bmap = this.bmap;
            if (clearType === true) {
                bmap.clearOverlays();
            } else {
                var pipes = this.state.pipes[clearType];
                if (pipes) {
                    while (pipes.length) {
                        bmap.removeOverlay(pipes.pop()._marker);
                    }
                }
            }
        },
        _buildPipe(pipe) {
            var bmap = this.bmap,
                points = [],
                point;
            //线
            var polyline = new BMap.Polyline(pipe.path.split(';').map(p => {
                var ps = p.split(',');
                points.push(ps)
                return new BMap.Point(ps[0], ps[1]);
            }));
            pipe._line = polyline;
            pipe._points = points;
            this._changePipeStyle(pipe);
            bmap.addOverlay(pipe._line);
            pipe._overlays = [pipe._line];
        },
        _changePipeStyle(pipe) {
            var opts = (typeof config.pipeStyle ? config.pipeStyle(pipe.data, {
                    start: this.getNodeByPoint(pipe._points[0].join(',')) && this.getNodeByPoint(pipe._points[0].join(',')).data,
                    end: this.getNodeByPoint(pipe._points[pipe._points.length - 1].join(',')) && this.getNodeByPoint(pipe._points[pipe._points.length - 1].join(',')).data
                }) : config.pipeStyle) || DEFAULT_LINE_STYLE,
                line = pipe._line;
            Object.keys(opts).forEach(key => {
                line[`set${key.substr(0,1).toUpperCase()+key.substring(1,key.length)}`](opts[key]);
            });
        },
        _bindPipeEvent(pipe) {
            if (pipe.info) {
                //区域高亮联动
                pipe._line.addEventListener('mouseover', (e) => {
                    this._openInfoWindow(pipe, e.point);
                });
                pipe._line.addEventListener('mouseout', (e) => {
                    this.bmap.closeInfoWindow(pipe, e.point);
                });
            }
        },
        /**
         * 刷新
         * 
         * @param {any} nodes 
         */
        refresh(nodes, pipes) {
            if (nodes || pipes) {
                nodes && this._refreshOverlays(nodes);
                pipes && this._refreshOverlays(pipes);
            } else {
                var nodeMap = this.state.nodes;
                var pipeMap = this.state.pipes;
                Object.keys(nodeMap).forEach(type => {
                    nodeMap[type] && this._refreshOverlays(nodeMap[type]);
                });
                Object.keys(pipeMap).forEach(type => {
                    pipeMap[type] && this._refreshOverlays(pipeMap[type]);
                });
            }
        },
        _refreshOverlays(nodes) {
            var zoom = this.bmap.getZoom();
            nodes.forEach(node => {
                var nodeZoom = node.zoom || config.zooms && config.zooms[node.type];
                if (!isNaN(nodeZoom)) {
                    if (zoom >= nodeZoom) {
                        node._overlays.forEach(o => o.show());
                    } else {
                        node._overlays.forEach(o => o.hide());
                    }
                }
            });
        },
        _refreshPipes(pipes) {
            this.mapChart.setOption({
                series: [{
                    type: 'lines',
                    coordinateSystem: 'bmap',
                    polyline: true,
                    data: pipes.push,
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
                }]
            });
        },
        _setNodeIcon(node) {
            var icon = node.icon || config.nodeIcons && config.nodeIcons[node.type],
                marker = node._marker;
            if (icon && marker) {
                var size = (icon.size || '30,30').split(',');
                marker.setIcon(new BMap.Icon(icon.url, new BMap.Size(500, 500)));
            }
        }
    }



    var nodeMap = {
        '城北': [108.96, 34.32],
        '渭水': [108.91, 34.38],
        '太华': [109.01, 34.30],
        '城区': [108.953650, 34.26564],
        '雁东': [109.02, 34.23],
        '北联': [109.01, 34.39],
        '泾渭': [109.03, 34.48],
        '草堂': [108.70, 34.03, '108.646583,34.109795;108.610938,34.086836;108.59599,34.039943;108.80526,33.984404;108.816758,34.041858;108.777664,34.038029;108.774214,34.069613;108.753517,34.11649;108.692576,34.134659;108.66383,34.159516'],
        '高陵': [109.09, 34.55],
        '阎良': [109.19, 34.65]
    };
    //外部操作
    HeatSourceMapApp.init({
        container: $("#container"),
        center: [109.0404, 34.3252],
        zoom: 11,
        roam: true
    }).then(() => {
        //配置
        HeatSourceMapApp.config({
            nodeIcons: {
                // TOP: {
                //     url: '/image/node_icons.png',
                //     size: '20,20'
                // }
            },
            zooms: {
                TOP: null,
                PIPE_FIRST: null
            },
            pipeStyle(data, points) {
                return [{
                    strokeColor: "green",
                    strokeWeight: 3,
                    strokeOpacity: 1
                }, {
                    strokeColor: "orange",
                    strokeWeight: 3,
                    strokeOpacity: 1
                }, {
                    strokeColor: "red",
                    strokeWeight: 3,
                    strokeOpacity: 1
                }][data.status];
            }
        });
        //添加节点
        HeatSourceMapApp.addNodes(Object.keys(nodeMap).map(key => {
            return {
                type: 'TOP',
                lng: nodeMap[key][0],
                lat: nodeMap[key][1],
                region: nodeMap[key][2],
                info: function () {
                    var $div = $("<div></div>");
                    return $div.html('信息窗口').css('background', 'yellow')[0];
                },
                click(data) {
                    alert('click');
                },
                data: {
                    name: '123'
                }
            }
        }));
        //添加管道
        HeatSourceMapApp.addPipes([{
            type: 'PIPE_FIRST',
            path: '109.19, 34.65;109.253694,34.649402;109.253694,34.589514;109.323833,34.592366;109.319234,34.536243',
            data: {
                name: '123',
                status: 0
            }
        }, {
            type: 'PIPE_FIRST',
            path: '109.319234,34.536243;109.437667,34.541;109.439966,34.618037;109.530803,34.618988;109.528503,34.694053',
            data: {
                name: '123',
                status: 1
            },
            info: function () {
                var $div = $("<div></div>");
                return $div.html('管道信息窗口').css('background', 'yellow')[0];
            }
        }, {
            type: 'PIPE_FIRST',
            path: '109.528503,34.694053,109.403172,34.70165;109.396273,34.662705;109.319234,34.661755;109.314635,34.742476',
            data: {
                name: '123',
                status: 2
            }
        }]);
    })
})();

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