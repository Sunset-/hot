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
        }, {
            'featureType': 'land',
            'elementType': 'geometry',
            'stylers': {
                'color': '#000104'
            }
        }, {
            'featureType': 'highway',
            'elementType': 'all',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'arterial',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'arterial',
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#0b3d51'
            }
        }, {
            'featureType': 'local',
            'elementType': 'geometry',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'railway',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'railway',
            'elementType': 'geometry.stroke',
            'stylers': {
                'color': '#08304b'
            }
        }, {
            'featureType': 'subway',
            'elementType': 'all',
            'stylers': {
                'lightness': -70,
                'visibility': 'off'
            }
        }, {
            'featureType': 'building',
            'elementType': 'geometry.fill',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'all',
            'elementType': 'labels.text.fill',
            'stylers': {
                'color': '#857f7f'
            }
        }, {
            'featureType': 'all',
            'elementType': 'labels.text.stroke',
            'stylers': {
                'color': '#000000'
            }
        }, {
            'featureType': 'building',
            'elementType': 'geometry',
            'stylers': {
                'color': '#022338'
            }
        }, {
            'featureType': 'green',
            'elementType': 'geometry',
            'stylers': {
                'color': '#062032'
            }
        }, {
            'featureType': 'boundary',
            'elementType': 'all',
            'stylers': {
                'color': '#465b6c'
            }
        }, {
            'featureType': 'manmade',
            'elementType': 'all',
            'stylers': {
                'color': '#022338'
            }
        }, {
            'featureType': 'Poi',
            'elementType': 'all',
            'stylers': {
                'visibility': 'off'
            }
        }, {
            'featureType': 'label',
            'elementType': 'all',
            'stylers': {
                'visibility': 'off'
            }
        }]
    };

    const DEFAULT_LINE_STYLE = {
        strokeColor: "blue",
        strokeWeight: 2,
        strokeOpacity: 0.5
    };

    const DEFAULT_REGION_STYLE = {
        strokeColor: "orange",
        fillColor: "red",
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeOpacity: 0.5
    }
    const DEFAULT_REGION_ACTIVE_STYLE = {
        strokeColor: "orange",
        fillColor: "red",
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeOpacity: 0.5
    }

    //配置
    const config = {};

    function getConfig(namaspace, defaults) {
        var parent = config;
        if (namaspace && namaspace.length) {
            var ns = namaspace.split('.');
            for (var i = 0, l = ns.length; i < l; i++) {
                if (parent[ns[i]] != void 0) {
                    parent = parent[ns[i]];
                } else {
                    return defaults;
                }
            }
            return parent;
        }
        return defaults;
    }

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
            this.state.edit = !!options.edit;
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
            var map = new BMap.Map($(options.container)[0], {
                enableMapClick: false
            });
            map.centerAndZoom(new BMap.Point(options.center[0], options.center[1]), options.zoom);
            map.enableScrollWheelZoom();
            this.bmap = map;
            this._initMapEvents();
            while (this.thens.length) {
                this.thens.shift().call(this);
            }
            this.inited = true;
            map.setMapStyle({
                style: 'dark'
            });
            return;


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
            this.bmap.addEventListener('click', (e) => {
                region.push(`${e.point.lng},${e.point.lat}`);
                console.log(region.join(';'))
                window.globalAddNodeOrPipe && window.globalAddNodeOrPipe(e);
            });
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
            setTimeout(() => {
                this.refresh(nodes);
            }, 0);
            return nodes;
        },
        getNodeByPoint(point) {
            if (!this.state.point_node[point]) {
                // debugger;
            }
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
                        node._region && bmap.removeOverlay(node._region);
                        node._marker = null;
                        node._region = null;
                    }
                }
            }
        },
        _buildNode(node) {
            var bmap = this.bmap;
            //点
            var point = new BMap.Point(node.coord[0], node.coord[1]);
            node._point = point;
            //标
            var marker = new BMap.Marker(point);
            bmap.addOverlay(marker);
            node._marker = marker;
            node._overlays = [node._marker];
            this._changeNodeIcon(node);
            //片
            if (node.region) {
                var points = node.region.split(';').map(p => {
                    var ps = p.split(',');
                    return new BMap.Point(+ps[0], +ps[1], )
                })
                var polygon = new BMap.Polygon(points, getConfig(`regionStyles.${node.type}.normal`, DEFAULT_REGION_STYLE));
                bmap.addOverlay(polygon);
                node._region = polygon;
                node._overlays.push(node._region);
                node._region.addEventListener('mouseover', () => {
                    //辖区高亮
                    this._changeAreaStyle(node._region, getConfig(`regionStyles.${node.type}.active`, DEFAULT_REGION_ACTIVE_STYLE));
                });
                node._region.addEventListener('mouseout', () => {
                    //辖区去除高亮
                    this._changeAreaStyle(node._region, getConfig(`regionStyles.${node.type}.normal`, DEFAULT_REGION_STYLE));
                });
            }

            //编辑相关
            if (this.state.edit) {
                node._marker._type = node.type;
                node._marker.enableDragging();
                node._region && node._region.enableEditing();
                node._marker.addEventListener('click', function (e) {
                    window.globalOperateNodeAndPipe && window.globalOperateNodeAndPipe(e, e.target);
                });
                node._marker.addEventListener('dragend', (e) => {
                    var oldPoint = node._point,
                        newPoint = e.point;
                    //替换node坐标
                    node._point = e.point;
                    node.coord = [e.point.lng, e.point.lat];
                    //变更pipe坐标
                    var pipeMap = this.state.pipes;
                    Object.keys(pipeMap).forEach(type => {
                        var pipes = pipeMap[type];
                        pipes.forEach(pipe => {
                            var points = pipe._line.getPath();
                            if (points[0].equals(oldPoint)) {
                                points[0] = newPoint;
                            }
                            if (points[points.length - 1].equals(oldPoint)) {
                                points[points.length - 1] = newPoint;
                            }
                            pipe._line.setPath(points);
                        })
                    })
                });
            }
        },
        _changeAreaStyle(area, style) {
            if (area && style) {
                Object.keys(style).forEach(key => {
                    var method = `set${key.substr(0,1).toUpperCase()+key.substring(1,key.length)}`;
                    area[method] && area[method](style[key]);
                });
            }
        },
        _changeNodeIcon(node) {
            var iconCallback = config.nodeIcons && config.nodeIcons[node.type];
            if (iconCallback) {
                var iconOpts;
                if (typeof iconCallback == 'function') {
                    iconOpts = iconCallback(node.data);
                } else {
                    iconOpts = iconCallback;
                }
                var marker = node._marker;
                if (marker) {
                    var size = (iconOpts.size || '30,30').split(',');
                    var anchor = (iconOpts.anchor || '0,0').split(',');
                    var offset = (iconOpts.offset || '0,0').split(',');
                    var icon = new BMap.Icon(iconOpts.url, new BMap.Size(size[0], size[1]), {
                        anchor: new BMap.Size(anchor[0], anchor[1]),
                        imageOffset: new BMap.Size(offset[0], offset[1])
                    });
                    node._iconOffset = {
                        width: size[0],
                        height: size[1]
                    };
                    marker.setIcon(icon);
                }
            }
        },
        _bindNodeEvent(node) {
            //区域高亮联动
            node._marker.addEventListener('mouseover', () => {
                this._openInfoWindow(node, node._marker.point);
            });
            node._marker.addEventListener('mouseout', () => {
                this.bmap.closeInfoWindow();
            });
            node._marker.addEventListener('click', () => {
                var click = config.click && config.click[node.type];
                if (typeof click == 'function') {
                    click.call(null, node.data);
                }
            });
        },
        addPipes(pipes, clearType) {
            this.removePipes(clearType);
            var pipeMap = this.state.pipes;
            pipes && pipes.forEach(pipe => {
                if (pipe.path) {
                    this._buildPipe(pipe);
                    this._alarmPipe(pipe);
                    this._bindPipeEvent(pipe);
                    (pipeMap[pipe.type] || (pipeMap[pipe.type] = [])).push(pipe);
                }
            });
            setTimeout(() => {
                this.refresh(null, pipes);
            }, 0);
            return pipes;
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
                        var pipe = pipes.pop();
                        bmap.removeOverlay(pipe._line);
                        pipe._line = null;
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
                var ps = p.split(',').map(p => (+p.trim()));
                points.push(ps)
                return new BMap.Point(ps[0], ps[1]);
            }));

            pipe._line = polyline;
            pipe._points = points;
            this._changePipeStyle(pipe);
            bmap.addOverlay(pipe._line);
            pipe._overlays = [pipe._line];

            //编辑相关
            if (this.state.edit) {
                pipe._line._type = pipe.type;
                polyline.enableEditing();
                polyline.addEventListener('click', function (e) {
                    window.globalOperateNodeAndPipe && window.globalOperateNodeAndPipe(e, e.target);
                });
            }
        },
        _changePipeStyle(pipe, styleCallback) {
            styleCallback = styleCallback || config.pipeStyles && config.pipeStyles[pipe.type];
            var opts;
            if (styleCallback) {
                if (typeof styleCallback == 'function') {
                    opts = styleCallback(pipe.data, this._getPipeTerminalDatas(pipe));
                } else {
                    opts = styleCallback;
                }
            } else {
                opts = DEFAULT_LINE_STYLE;
            }
            var line = pipe._line;
            Object.keys(opts).forEach(key => {
                var method = `set${key.substr(0,1).toUpperCase()+key.substring(1,key.length)}`;
                line[method] && line[method](opts[key]);
            });
        },
        _getPipeTerminals(pipe) {
            if (pipe._points) {
                return {
                    start: this.getNodeByPoint(pipe._points[0].join(',')),
                    end: this.getNodeByPoint(pipe._points[pipe._points.length - 1].join(','))
                };
            }
        },
        _getPipeTerminalDatas(pipe) {
            var terminals = this._getPipeTerminals(pipe);
            return terminals && {
                start: terminals.start && terminals.start.data,
                end: terminals.end && terminals.end.data
            };
        },
        _alarmPipe(pipe) {
            var alarmConfig = config.alarms && config.alarms[pipe.type];
            if (alarmConfig) {
                if ((typeof alarmConfig.check == 'function') && (alarmConfig.check(pipe.data, this._getPipeTerminalDatas(pipe)))) {
                    clearTimeout(pipe._alarmTimer);
                    var flag = false;
                    pipe._alarmTimer = setInterval(() => {
                        flag = !flag;
                        this._changePipeStyle(pipe, flag && alarmConfig.style);
                    }, config.alarmInterval || 1000);
                }
            }
        },
        _bindPipeEvent(pipe) {
            //区域高亮联动
            pipe._line.addEventListener('mouseover', (e) => {
                this._openInfoWindow(pipe, e.point);
            });
            pipe._line.addEventListener('mouseout', (e) => {
                this.bmap.closeInfoWindow(pipe, e.point);
            });
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
        _openInfoWindow(overlay, point) {
            var infoCallback = config.infos && config.infos[overlay.type];
            if (!infoCallback) {
                return;
            }
            if (!overlay._infoWindow) {
                var offset = overlay._iconOffset || {};
                var opts = {
                    offset: new BMap.Size(0, -(offset.height || 0))
                }
                var content = (typeof infoCallback == 'function') ? infoCallback(overlay.data, this._getPipeTerminalDatas(overlay)) : infoCallback;
                overlay._infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
            }
            this.bmap.openInfoWindow(overlay._infoWindow, point || overlay._point); //开启信息窗口
        },
        /**
         * 搜索
         */
        search(filter) {
            if (typeof filter != 'function') {
                throw new Error('过滤条件应为一个function');
            }
            var nodeMap = this.state.nodes,
                pipeMap = this.state.pipes;
            var resultPoints = [];
            var resultElements = [];
            Object.keys(nodeMap).forEach(type => {
                nodeMap[type].forEach(node => {
                    if (filter(node.data)) {
                        resultElements.push(node.data);
                        resultPoints.push(node._marker.point);
                    }
                });
            });
            Object.keys(pipeMap).forEach(type => {
                pipeMap[type].forEach(pipe => {
                    if (filter(pipe.data)) {
                        resultElements.push(pipe.data);
                        resultPoints = resultPoints.concat(pipe.getPath());
                    }
                });
            });
            if (resultPoints.length) {
                this.bmap.setViewport(resultPoints);
            }
            return resultElements;
        }
    };

})();