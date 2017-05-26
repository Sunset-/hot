(function () {

    //测试使用：状态文字
    var STATUS_ENUMS = {
        '0': '<span style="color:#00cc66;">正常</span>',
        '1': '<span style="color:#ff9900;">预警</span>',
        '2': '<span style="color:red;">异常</span>',
        other: '未知'
    };

    /**
     * 类型说明（类型可自由设置，但须统一）
     * RYC  :  热源厂
     * HRZ  :  换热站
     * RLJ_FIRST  :  一级热力井
     * RLJ_SECOND  :  二级热力井
     * PIPE_FIRST  :  一级管道
     * PIPE_SECOND  :  二级管道
     * USER  :  用户
     */

    //应用配置文件
    var config = {
        //节点，管道的可见层级配置（type : zoomLevel）为null时始终可见
        zooms: {
            RYC: null,
            HRZ: 12,
            RLJ_FIRST: 12,
            RLJ_SECOND: 13,
            PIPE_FIRST: 12,
            PIPE_SECOND: 13,
            USER: 13
        },
        //节点图标配置
        nodeIcons: {
            //[节点数据]
            RYC: function (data) {
                return {
                    url: './image/mini-icons.png', //图片路径
                    size: '46,59', //节点图标尺寸
                    imageSize: '160,195', //雪碧图尺寸
                    anchor: '23,56', //图标偏移（初始时，图表左上角对应坐标点,x左移，y上移）
                    offset: ['-57,0', '-57,-136', '-57,-66'][data.status || 0] //雪碧图坐标偏移
                };
            },
            HRZ: function (data) {
                return {
                    url: './image/mini-icons.png',
                    size: '32,42',
                    imageSize: '110,134',
                    anchor: '16,40',
                    offset: ['-79,0', '-79,-93', '-79,-45'][data.status || 0]
                };
            },
            RLJ_FIRST: function (data) {
                return {
                    url: './image/mini-icons.png',
                    size: '32,42',
                    imageSize: '110,134',
                    anchor: '16,40',
                    offset: ['0,0', '0,-93', '0,-45'][data.status || 0]
                };
            },
            RLJ_SECOND: function (data) {
                return {
                    url: './image/mini-icons.png',
                    size: '21,28',
                    anchor: '10,26',
                    imageSize: '72,88',
                    offset: ['0,0', '0,-60', '0,-30'][data.status || 0]
                }
            },
            USER: function (data) {
                return {
                    url: './image/mini-user-icons.png',
                    size: '26,34',
                    anchor: '13,32',
                    imageSize: '26,110',
                    offset: ['0,0', '0,-76', '0,-38'][data.status || 0]
                };
            }
        },
        //节点辖区样式
        regionStyles: {
            RYC: {
                //普通样式
                normal: {
                    strokeColor: "orange",
                    fillColor: "red",
                    fillOpacity: 0.2,
                    strokeWeight: 2,
                    strokeOpacity: 0.5
                },
                //高亮样式
                active: {
                    strokeColor: "orange",
                    fillColor: "orange",
                    fillOpacity: 0.2,
                    strokeWeight: 2,
                    strokeOpacity: 0.5
                }
            }
        },
        //管道样式(支持方法和对象)[管道数据，两端节点数据]
        pipeStyles: {
            PIPE_FIRST: function (data, terminals) {
                var temperature = ((+(terminals.start && terminals.start.temperature || 0)) + (+(terminals.end && terminals.end.temperature || 0))) / 2;
                var index = temperature > 120 ? 2 : (temperature < 90 ? 0 : 1);
                return [{
                    strokeColor: "#0099cc",
                    strokeWeight: 4,
                    strokeOpacity: 0.8
                }, {
                    strokeColor: "#00cc66",
                    strokeWeight: 4,
                    strokeOpacity: 0.8
                }, {
                    strokeColor: "#ff9900",
                    strokeWeight: 4,
                    strokeOpacity: 0.8
                }][index];
            },
            PIPE_SECOND: function (data, terminals) {
                var temperature = ((+(terminals.start && terminals.start.temperature || 0)) + (+(terminals.end && terminals.end.temperature || 0))) / 2;
                var index = temperature > 95 ? 2 : (temperature < 60 ? 0 : 1);
                return [{
                    strokeColor: "#0099cc",
                    strokeWeight: 4,
                    strokeOpacity: 0.8
                }, {
                    strokeColor: "#00cc66",
                    strokeWeight: 4,
                    strokeOpacity: 0.8
                }, {
                    strokeColor: "#ff9900",
                    strokeWeight: 4,
                    strokeOpacity: 0.8
                }][index];
            }
        },
        //报警闪烁间隔
        alarmInterval: 300,
        alarms: {
            PIPE_FIRST: {
                //报警检查
                check: function (data, terminals) {
                    if (!terminals.start || !terminals.end) {
                        return true;
                    }
                    var pressure = Math.abs((+(terminals.start && terminals.start.pressure || 0)) - (+(terminals.end && terminals.end.pressure || 0)));
                    if (pressure > 50) {
                        return true;
                    }
                    return false;
                },
                //报警样式回调(支持方法和对象)[管道数据，两端节点数据]
                style: function (data, terminals) {
                    return {
                        strokeColor: "red",
                        strokeWeight: 6,
                        strokeOpacity: 1
                    };
                }
            }
        },
        //信息框弹窗前回调，显式返回false，则阻止弹窗
        beforeInfo: {
            RYC: function (data, termals) {

            }
        },
        //信息框样式（返回dom节点）[节点数据/管道数据，两端节点数据]
        info: {
            // RYC: function (data) {
            //     var $div = $(`<div>
            //         <div>热源厂：${data.name}</div>
            //         <div>温度：${data.temperature}℃</div>
            //         <div>压力：${data.pressure}</div>
            //         <div>状态：${STATUS_ENUMS[data.status]||STATUS_ENUMS.other}</div>
            //         </div>`);
            //     return $div[0];
            // },
            // HRZ: function (data) {
            //     var $div = $(`<div>
            //         <div>换热站：${data.name}</div>
            //         <div>温度：${data.temperature}℃</div>
            //         <div>压力：${data.pressure}</div>
            //         <div>状态：${STATUS_ENUMS[data.status]||STATUS_ENUMS.other}</div>
            //         </div>`);
            //     return $div[0];
            // },
            // RLJ_FIRST: function (data) {
            //     var $div = $(`<div>
            //         <div>一级热力井</div>
            //         <div>温度：${data.temperature}℃</div>
            //         <div>压力：${data.pressure}</div>
            //         </div>`);
            //     return $div[0];
            // },
            // RLJ_SECOND: function (data) {
            //     var $div = $(`<div>
            //         <div>二级热力井</div>
            //         <div>温度：${data.temperature}℃</div>
            //         <div>压力：${data.pressure}</div>
            //         </div>`);
            //     return $div[0];
            // },
            // USER: function (data) {
            //     var $div = $(`<div>
            //         <div>${data&&data.name}</div>
            //         <div>实时温度：${data&&data.temperature}℃</div>
            //         </div>`);
            //     return $div[0];
            // },
            // PIPE_FIRST: function (data, terminals) {
            //     var temperature = (((+(terminals.start && terminals.start.temperature || 0)) + (+(terminals.end && terminals.end.temperature || 0))) / 2).toFixed(1);
            //     var pressure = Math.abs((+(terminals.start && terminals.start.pressure || 0)) - (+(terminals.end && terminals.end.pressure || 0))).toFixed(1);
            //     var $div = $(`<div>
            //         <div>一级供水管道</div>
            //         <div style="font-size:14px;">平均温度：${temperature}℃<span style="font-size:12px;color:#666;">（${terminals.start.temperature}℃ - ${terminals.end.temperature}℃）</span></div>
            //         <div style="font-size:14px;">压差：${pressure}<span style="font-size:12px;color:#666;">（${terminals.start.pressure} - ${terminals.end.pressure}）</span></div>
            //         </div>`).css({
            //         width: '280px'
            //     });
            //     return $div[0];
            // },
            // PIPE_SECOND: function (data, terminals) {
            //     var temperature = (((+(terminals.start && terminals.start.temperature || 0)) + (+(terminals.end && terminals.end.temperature || 0))) / 2).toFixed(1);
            //     var pressure = Math.abs((+(terminals.start && terminals.start.pressure || 0)) - (+(terminals.end && terminals.end.pressure || 0))).toFixed(1);
            //     var $div = $(`<div>
            //         <div>二级供水管道</div>
            //         <div style="font-size:14px;">平均温度：${temperature}℃<span style="font-size:12px;color:#666;">（${terminals.start.temperature}℃ - ${terminals.end.temperature}℃）</span></div>
            //         <div style="font-size:14px;">压差：${pressure}<span style="font-size:12px;color:#666;">（${terminals.start.pressure} - ${terminals.end.pressure}）</span></div>
            //         </div>`).css({
            //         width: '280px'
            //     });
            //     return $div[0];
            // }
        },
        //节点点击前回调，显式返回false，则阻止点击事件
        beforeClick: {
            RYC: function (data) {}
        },
        //节点点击回调[节点数据]
        click: {
            RYC: function (data) {
                // alert(`click:热源厂\ndata:${JSON.stringify(data)}`);
            },
            HRZ: function (data) {
                // alert(`click:换热站\ndata:${JSON.stringify(data)}`);
            },
            RLJ_FIRST: function (data) {
                // alert(`click:一级井\ndata:${JSON.stringify(data)}`);
            },
            RLJ_SECOND: function (data) {
                // alert(`click:二级井\ndata:${JSON.stringify(data)}`);
            }
        }
    };

    window.HotMapAppConfig = config;


    //地图样式配置
    window.HotMapAppMapStyle = {
        style: 'dark',
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
})();