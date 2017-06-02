var STATUS_ENUMS = {
    '0': '<span style="color:#00cc66;">正常</span>',
    '1': '<span style="color:#ff9900;">预警</span>',
    '2': '<span style="color:red;">异常</span>',
    other: '未知'
};

var config = {
    //节点，管道可见层级配置
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
        RYC(data) {
            return {
                url: '/image/mini-icons.png',
                size: '46,59',
                imageSize: '160,195',
                anchor: '23,56',
                offset: ['-57,0', '-57,-136', '-57,-66'][data.status || 0]
            };
        },
        HRZ(data) {
            return {
                url: '/image/mini-icons.png',
                size: '32,42',
                imageSize: '110,134',
                anchor: '16,40',
                offset: ['-79,0', '-79,-93', '-79,-45'][data.status || 0]
            };
        },
        RLJ_FIRST(data) {
            return {
                url: '/image/mini-icons.png',
                size: '32,42',
                imageSize: '110,134',
                anchor: '16,40',
                offset: ['0,0', '0,-93', '0,-45'][data.status || 0]
            };
        },
        RLJ_SECOND(data) {
            return {
                url: '/image/mini-icons.png',
                size: '21,28',
                anchor: '10,26',
                imageSize: '72,88',
                offset: ['0,0', '0,-60', '0,-30'][data.status || 0]
            }
        },
        USER(data) {
            return {
                url: '/image/mini-user-icons.png',
                size: '26,34',
                anchor: '13,32',
                imageSize: '26,110',
                offset: ['0,0', '0,-76', '0,-38'][2 || data.status || 0]
            };
        }
    },
    regionStyles: {
        RYC: {
            normal(data) {
                return {
                    strokeColor: "orange",
                    fillColor: 'red',
                    fillOpacity: 0.2,
                    strokeWeight: 2,
                    strokeOpacity: 0.5
                }
            },
            active: {
                strokeColor: "orange",
                fillColor: "orange",
                fillOpacity: 0.2,
                strokeWeight: 2,
                strokeOpacity: 0.5
            }
        }
    },
    //管道样式回调
    pipeStyles: {
        PIPE_FIRST(data, terminals) {
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
        PIPE_SECOND(data, terminals) {
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
    alarmInterval: 300,
    alarms: {
        PIPE_FIRST: {
            check(data, terminals) {
                if (!terminals.start || !terminals.end) {
                    return true;
                }
                var pressure = Math.abs((+(terminals.start && terminals.start.pressure || 0)) - (+(terminals.end && terminals.end.pressure || 0)));
                if (pressure > 50) {
                    return true;
                }
                return false;
            },
            style(data, terminals) {
                return {
                    strokeColor: "red",
                    strokeWeight: 6,
                    strokeOpacity: 1
                };
            }
        }
    },
    //弹窗样式
    beforeInfo: {
        RYC(data, termals) {

        }
    },
    info: {
        RYC(data) {
            var $div = $(`<div>
                    <div>热源厂：${data.name}</div>
                    <div>温度：${data.temperature}℃</div>
                    <div>压力：${data.pressure}</div>
                    <div>状态：${STATUS_ENUMS[data.status]||STATUS_ENUMS.other}</div>
                    </div>`);
            return $div[0];
        },
        HRZ(data) {
            var $div = $(`<div>
                    <div>换热站：${data.name}</div>
                    <div>温度：${data.temperature}℃</div>
                    <div>压力：${data.pressure}</div>
                    <div>状态：${STATUS_ENUMS[data.status]||STATUS_ENUMS.other}</div>
                    </div>`);
            return $div[0];
        },
        RLJ_FIRST(data) {
            var $div = $(`<div>
                    <div>一级热力井</div>
                    <div>温度：${data.temperature}℃</div>
                    <div>压力：${data.pressure}</div>
                    </div>`);
            return $div[0];
        },
        RLJ_SECOND(data) {
            var $div = $(`<div>
                    <div>二级热力井</div>
                    <div>温度：${data.temperature}℃</div>
                    <div>压力：${data.pressure}</div>
                    </div>`);
            return $div[0];
        },
        USER(data) {
            var $div = $(`<div>
                    <div>${data&&data.name}</div>
                    <div>实时温度：${data&&data.temperature}℃</div>
                    </div>`);
            return $div[0];
        },
        PIPE_FIRST(data, terminals) {
            var temperature = (((+(terminals.start && terminals.start.temperature || 0)) + (+(terminals.end && terminals.end.temperature || 0))) / 2).toFixed(1);
            var pressure = Math.abs((+(terminals.start && terminals.start.pressure || 0)) - (+(terminals.end && terminals.end.pressure || 0))).toFixed(1);
            var $div = $(`<div>
                    <div>一级供水管道</div>
                    <div style="font-size:14px;">平均温度：${temperature}℃<span style="font-size:12px;color:#666;">（${terminals.start.temperature}℃ - ${terminals.end.temperature}℃）</span></div>
                    <div style="font-size:14px;">压差：${pressure}<span style="font-size:12px;color:#666;">（${terminals.start.pressure} - ${terminals.end.pressure}）</span></div>
                    </div>`).css({
                width: '280px'
            });
            return $div[0];
        },
        PIPE_SECOND(data, terminals) {
            var temperature = (((+(terminals.start && terminals.start.temperature || 0)) + (+(terminals.end && terminals.end.temperature || 0))) / 2).toFixed(1);
            var pressure = Math.abs((+(terminals.start && terminals.start.pressure || 0)) - (+(terminals.end && terminals.end.pressure || 0))).toFixed(1);
            var $div = $(`<div>
                    <div>二级供水管道</div>
                    <div style="font-size:14px;">平均温度：${temperature}℃<span style="font-size:12px;color:#666;">（${terminals.start.temperature}℃ - ${terminals.end.temperature}℃）</span></div>
                    <div style="font-size:14px;">压差：${pressure}<span style="font-size:12px;color:#666;">（${terminals.start.pressure} - ${terminals.end.pressure}）</span></div>
                    </div>`).css({
                width: '280px'
            });
            return $div[0];
        }
    },
    beforeClick: {
        RYC(data) {}
    },
    click: {
        RYC(data) {
            alert(`click:热源厂\ndata:${JSON.stringify(data)}`);
        },
        HRZ(data) {
            alert(`click:换热站\ndata:${JSON.stringify(data)}`);
        },
        RLJ_FIRST(data) {
            alert(`click:一级井\ndata:${JSON.stringify(data)}`);
        },
        RLJ_SECOND(data) {
            alert(`click:二级井\ndata:${JSON.stringify(data)}`);
        }
    }
};

module.exports = config;