'use strict';

(function () {

    //工具方法
    function warn(msg) {
        alert(msg);
        throw new Error(msg);
    }

    //依赖库
    var DEP_LIB = {
        'echarts': 'echarts',
        'BMap': '百度地图',
        'jQuery': 'jQuery'
    };

    //地图风格
    var MAP_THEME = {
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

    var DEFAULT_LINE_STYLE = {
        strokeColor: "blue",
        strokeWeight: 2,
        strokeOpacity: 0.5
    };

    var DEFAULT_REGION_STYLE = {
        strokeColor: "orange",
        fillColor: "red",
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeOpacity: 0.5
    };
    var DEFAULT_REGION_ACTIVE_STYLE = {
        strokeColor: "orange",
        fillColor: "red",
        fillOpacity: 0.2,
        strokeWeight: 2,
        strokeOpacity: 0.5
    };

    //配置
    var _config = {};

    function getConfig(namaspace, defaults) {
        var parent = _config;
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
            nodes: {},
            point_node: {},
            pipes: {}
        },
        init: function init() {
            var _this = this;

            var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            this._checkDepLibs();
            this.state.edit = !!options.edit;
            options.container && this._initEchartsMap(options);
            return {
                then: function then(func) {
                    if (_this.inited) {
                        func.call(_this);
                    } else {
                        _this.thens.push(func);
                    }
                }
            };
        },
        config: function config(options) {
            Object.assign(_config, options);
        },
        _checkDepLibs: function _checkDepLibs() {
            Object.keys(DEP_LIB).forEach(function (key) {
                if (!window[key]) {
                    warn('\u672A\u5F15\u5165' + DEP_LIB[key] + '\u5E93');
                }
            });
        },

        /**
         * 初始化地图应用
         */
        _initEchartsMap: function _initEchartsMap(options) {
            var _this2 = this;

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
            map.setMapStyle(options.mapStyle);
            return;

            var $container = $(options.container);
            if (!$container.length) {
                warn('\u8BF7\u4F20\u5165container\u5143\u7D20\u8282\u70B9');
                return;
            }
            this.mapChart = echarts.init($container[0]);
            //map
            this.mapChart.setOption({
                bmap: {
                    center: options.center,
                    zoom: options.zoom,
                    roam: options.roam,
                    mapStyle: options.mapStyle || MAP_THEME
                },
                series: []
            });
            //获取bmap实例
            setTimeout(function () {
                var model = _this2.mapChart.getModel(),
                    bmap = null;
                model.eachComponent('bmap', function (bmapModel) {
                    if (bmap == null) {
                        bmap = bmapModel.__bmap;
                    }
                });
                if (!(_this2.bmap = bmap)) {
                    warn('\u672A\u83B7\u53D6\u5230bmap\u5B9E\u4F8B');
                }
                _this2._initMapEvents();
                while (_this2.thens.length) {
                    _this2.thens.shift().call(_this2);
                }
                _this2.inited = true;
            });
        },
        _initMapEvents: function _initMapEvents() {
            var _this3 = this;

            this.bmap.addEventListener('zoomend', function (e) {
                _this3.refresh();
            });
            this.bmap.addEventListener('click', function (e) {
                region.push(e.point.lng + ',' + e.point.lat);
                console.log(region.join(';'));
                window.globalAddNodeOrPipe && window.globalAddNodeOrPipe(e);
            });
        },

        /**
         * 添加节点
         * 
         * @param {any} nodes 节点数组
         * @param {any} clearType 清除节点类型
         */
        addNodes: function addNodes(nodes, clearType) {
            var _this4 = this;

            this.removeNodes(clearType);
            var nodeMap = this.state.nodes;
            nodes && nodes.forEach(function (node) {
                _this4._buildNode(node);
                _this4._bindNodeEvent(node);
                (nodeMap[node.type] || (nodeMap[node.type] = [])).push(node);
                _this4.state.point_node[node._point.lng + ',' + node._point.lat] = node;
            });
            setTimeout(function () {
                _this4.refresh(nodes);
            }, 0);
            return nodes;
        },
        getNodeByPoint: function getNodeByPoint(point) {
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
        removeNodes: function removeNodes(clearType) {
            if (!clearType) {
                return;
            }
            var bmap = this.bmap;
            if (clearType === true) {
                this.state.nodes = {};
                this.state.point_node = {};
                bmap.clearOverlays();
            } else {
                var nodes = this.state.nodes[clearType],
                    point_node = this.state.point_node;
                if (nodes) {
                    var node;
                    while (nodes.length) {
                        node = nodes.pop();
                        delete point_node[node._point.lng + ',' + node._point.lat];
                        bmap.removeOverlay(node._marker);
                        node._region && bmap.removeOverlay(node._region);
                        node._marker = null;
                        node._region = null;
                    }
                    delete this.state.nodes[clearType];
                }
            }
        },
        _buildNode: function _buildNode(node) {
            var _this5 = this;

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
                var points = node.region.split(';').map(function (p) {
                    var ps = p.split(',');
                    return new BMap.Point(+ps[0], +ps[1]);
                });
                var polygon = new BMap.Polygon(points, getConfig('regionStyles.' + node.type + '.normal', DEFAULT_REGION_STYLE));
                bmap.addOverlay(polygon);
                node._region = polygon;
                node._overlays.push(node._region);
                node._region.addEventListener('mouseover', function () {
                    //辖区高亮
                    _this5._changeAreaStyle(node._region, getConfig('regionStyles.' + node.type + '.active', DEFAULT_REGION_ACTIVE_STYLE));
                });
                node._region.addEventListener('mouseout', function () {
                    //辖区去除高亮
                    _this5._changeAreaStyle(node._region, getConfig('regionStyles.' + node.type + '.normal', DEFAULT_REGION_STYLE));
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
                node._marker.addEventListener('dragend', function (e) {
                    var oldPoint = node._point,
                        newPoint = e.point;
                    //替换node坐标
                    node._point = e.point;
                    node.coord = [e.point.lng, e.point.lat];
                    //变更pipe坐标
                    var pipeMap = _this5.state.pipes;
                    Object.keys(pipeMap).forEach(function (type) {
                        var pipes = pipeMap[type];
                        pipes.forEach(function (pipe) {
                            var points = pipe._line.getPath();
                            if (points[0].equals(oldPoint)) {
                                points[0] = newPoint;
                            }
                            if (points[points.length - 1].equals(oldPoint)) {
                                points[points.length - 1] = newPoint;
                            }
                            pipe._line.setPath(points);
                        });
                    });
                });
            }
        },
        _changeAreaStyle: function _changeAreaStyle(area, style) {
            if (area && style) {
                Object.keys(style).forEach(function (key) {
                    var method = 'set' + (key.substr(0, 1).toUpperCase() + key.substring(1, key.length));
                    area[method] && area[method](style[key]);
                });
            }
        },
        _changeNodeIcon: function _changeNodeIcon(node) {
            var iconCallback = _config.nodeIcons && _config.nodeIcons[node.type];
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
                    var imageSize = iconOpts.imageSize && iconOpts.imageSize.split(',');
                    var opts = {
                        anchor: new BMap.Size(anchor[0], anchor[1]),
                        imageOffset: new BMap.Size(offset[0], offset[1])
                    };
                    if (imageSize && imageSize.length == 2) {
                        opts.imageSize = new BMap.Size(imageSize[0], imageSize[1]);
                    }
                    var icon = new BMap.Icon(iconOpts.url, new BMap.Size(size[0], size[1]), opts);
                    node._iconOffset = {
                        width: size[0],
                        height: size[1]
                    };
                    marker.setIcon(icon);
                }
            }
        },
        _bindNodeEvent: function _bindNodeEvent(node) {
            var _this6 = this;

            //区域高亮联动
            node._marker.addEventListener('mouseover', function () {
                _this6._openInfoWindow(node, node._marker.point);
            });
            node._marker.addEventListener('mouseout', function () {
                _this6.bmap.closeInfoWindow();
            });
            node._marker.addEventListener('click', function () {
                var click = getConfig('click.' + node.type) || getConfig('click');
                if (typeof click == 'function') {
                    var beforeClick = getConfig('beforeClick.' + node.type) || getConfig('beforeClick');
                    if (typeof beforeClick == 'function') {
                        if (beforeClick.call(null, node.data) === false) {
                            return;
                        }
                    }
                    click.call(null, node.data);
                }
            });
        },
        addPipes: function addPipes(pipes, clearType) {
            var _this7 = this;

            this.removePipes(clearType);
            var pipeMap = this.state.pipes;
            pipes && pipes.forEach(function (pipe) {
                if (pipe.path) {
                    _this7._buildPipe(pipe);
                    _this7._alarmPipe(pipe);
                    _this7._bindPipeEvent(pipe);
                    (pipeMap[pipe.type] || (pipeMap[pipe.type] = [])).push(pipe);
                }
            });
            setTimeout(function () {
                _this7.refresh(null, pipes);
            }, 0);
            return pipes;
        },

        /**
         * 清除节点
         * 
         * @param {any} clearType 节点类型
         * @returns 
         */
        removePipes: function removePipes(clearType) {
            if (!clearType) {
                return;
            }
            var bmap = this.bmap;
            if (clearType === true) {
                this.state.pipes = {};
                bmap.clearOverlays();
            } else {
                var pipes = this.state.pipes[clearType];
                if (pipes) {
                    while (pipes.length) {
                        var pipe = pipes.pop();
                        bmap.removeOverlay(pipe._line);
                        pipe._line = null;
                    }
                    delete this.state.pipes[clearType];
                }
            }
        },
        _buildPipe: function _buildPipe(pipe) {
            var bmap = this.bmap,
                points = [],
                point;
            //线
            var polyline = new BMap.Polyline(pipe.path.split(';').map(function (p) {
                var ps = p.split(',').map(function (p) {
                    return +p.trim();
                });
                points.push(ps);
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
        _changePipeStyle: function _changePipeStyle(pipe, styleCallback) {
            styleCallback = styleCallback || _config.pipeStyles && _config.pipeStyles[pipe.type];
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
            Object.keys(opts).forEach(function (key) {
                var method = 'set' + (key.substr(0, 1).toUpperCase() + key.substring(1, key.length));
                line[method] && line[method](opts[key]);
            });
        },
        _getPipeTerminals: function _getPipeTerminals(pipe) {
            if (pipe._points) {
                return {
                    start: this.getNodeByPoint(pipe._points[0].join(',')),
                    end: this.getNodeByPoint(pipe._points[pipe._points.length - 1].join(','))
                };
            }
        },
        _getPipeTerminalDatas: function _getPipeTerminalDatas(pipe) {
            var terminals = this._getPipeTerminals(pipe);
            return terminals && {
                start: terminals.start && terminals.start.data,
                end: terminals.end && terminals.end.data
            };
        },
        _alarmPipe: function _alarmPipe(pipe) {
            var _this8 = this;

            var alarmConfig = _config.alarms && _config.alarms[pipe.type];
            if (alarmConfig) {
                if (typeof alarmConfig.check == 'function' && alarmConfig.check(pipe.data, this._getPipeTerminalDatas(pipe))) {
                    clearTimeout(pipe._alarmTimer);
                    var flag = false;
                    pipe._alarmTimer = setInterval(function () {
                        flag = !flag;
                        _this8._changePipeStyle(pipe, flag && alarmConfig.style);
                    }, _config.alarmInterval || 1000);
                }
            }
        },
        _bindPipeEvent: function _bindPipeEvent(pipe) {
            var _this9 = this;

            //区域高亮联动
            pipe._line.addEventListener('mouseover', function (e) {
                _this9._openInfoWindow(pipe, e.point);
            });
            pipe._line.addEventListener('mouseout', function (e) {
                _this9.bmap.closeInfoWindow(pipe, e.point);
            });
        },

        /**
         * 刷新
         * 
         * @param {any} nodes 
         */
        refresh: function refresh(nodes, pipes) {
            var _this10 = this;

            if (nodes || pipes) {
                nodes && this._refreshOverlays(nodes);
                pipes && this._refreshOverlays(pipes);
            } else {
                var nodeMap = this.state.nodes;
                var pipeMap = this.state.pipes;
                Object.keys(nodeMap).forEach(function (type) {
                    nodeMap[type] && _this10._refreshOverlays(nodeMap[type]);
                });
                Object.keys(pipeMap).forEach(function (type) {
                    pipeMap[type] && _this10._refreshOverlays(pipeMap[type]);
                });
            }
        },
        _refreshOverlays: function _refreshOverlays(nodes) {
            var zoom = this.bmap.getZoom();
            nodes.forEach(function (node) {
                var nodeZoom = node.zoom || _config.zooms && _config.zooms[node.type];
                if (!isNaN(nodeZoom)) {
                    if (zoom >= nodeZoom) {
                        node._overlays.forEach(function (o) {
                            return o.show();
                        });
                    } else {
                        node._overlays.forEach(function (o) {
                            return o.hide();
                        });
                    }
                }
            });
        },
        _refreshPipes: function _refreshPipes(pipes) {
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
        _openInfoWindow: function _openInfoWindow(overlay, point) {
            var infoCallback = getConfig('info.' + overlay.type) || getConfig('info');
            if (!infoCallback) {
                return;
            }
            if (typeof infoCallback != 'function') {
                throw new Error('信息框回调必须为一个function');
            }
            var data = overlay.data,
                terminalDatas = this._getPipeTerminalDatas(overlay);
            var beforeInfoCallback = getConfig('beforeInfo.' + overlay.type) || getConfig('beforeInfo');
            if (typeof beforeInfoCallback == 'function' && beforeInfoCallback.call(null, data, terminalDatas) === false) {
                return;
            }
            if (!overlay._infoWindow) {
                var offset = overlay._iconOffset || {};
                var opts = {
                    offset: new BMap.Size(0, -(offset.height || 0))
                };
                var content = infoCallback.call(null, data, terminalDatas);
                overlay._infoWindow = new BMap.InfoWindow(content, opts); // 创建信息窗口对象 
            }
            this.bmap.openInfoWindow(overlay._infoWindow, point || overlay._point); //开启信息窗口
        },

        /**
         * 搜索
         */
        search: function search(filter) {
            if (typeof filter != 'function') {
                throw new Error('过滤条件应为一个function');
            }
            var nodeMap = this.state.nodes,
                pipeMap = this.state.pipes;
            var resultPoints = [];
            var resultElements = [];
            Object.keys(nodeMap).forEach(function (type) {
                nodeMap[type].forEach(function (node) {
                    if (filter(node.data)) {
                        resultElements.push(node.data);
                        resultPoints.push(node._marker.point);
                    }
                });
            });
            Object.keys(pipeMap).forEach(function (type) {
                pipeMap[type].forEach(function (pipe) {
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
