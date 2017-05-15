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
        RYC: {
            url: '/image/mini-icons.png',
            size: '26,32',
            anchor: '13,32',
            offset: '-32,0'
        },
        HRZ(data) {
            return {
                url: '/image/mini-icons.png',
                size: '26,32',
                anchor: '13,32',
                offset: ['-66,0', '-66,-76', '-66,-38'][data.status || 0]
            };
        },
        RLJ_FIRST(data) {
            return {
                url: '/image/mini-icons.png',
                size: '26,32',
                anchor: '13,32',
                offset: ['0,0', '0,-76', '0,-38'][data.status || 0]
            }
        },
        RLJ_SECOND(data) {
            return {
                url: '/image/mini-icons.png',
                size: '26,32',
                anchor: '13,32',
                offset: ['0,0', '0,-76', '0,-38'][1 || data.status || 0]
            }
        }
    },
    //管道样式回调
    pipeStyles: {
        PIPE_FIRST(data, terminals) {
            return [{
                strokeColor: "#00cc66",
                strokeWeight: 4,
                strokeOpacity: 0.8
            }, {
                strokeColor: "#ff9900",
                strokeWeight: 4,
                strokeOpacity: 0.8
            }, {
                strokeColor: "#ff3300",
                strokeWeight: 4,
                strokeOpacity: 0.8
            }][data.status];
        },
        PIPE_SECOND(data, terminals) {
            var index = 1 || data.status || 0;
            // var temperature = Math.abs(terminals.start.temperature + terminals.end.temperature) / 2;
            // if (temperature > 150) {
            //     index = 2;
            // } else if (temperature > 120) {
            //     index = 1;
            // }
            return [{
                strokeColor: "#00cc66",
                strokeWeight: 4,
                strokeOpacity: 0.8
            }, {
                strokeColor: "#ff9900",
                strokeWeight: 4,
                strokeOpacity: 0.8
            }, {
                strokeColor: "#ff3300",
                strokeWeight: 4,
                strokeOpacity: 0.8
            }][index];
        }
    },
    alarmInterval: 300,
    alarms: {
        // PIPE_FIRST: {
        //     check(data, terminals) {
        //         if (!terminals.start || !terminals.end) {
        //             return true;
        //         }
        //         var pressure = Math.abs(terminals.start.pressure - terminals.end.pressure);
        //         if (pressure > 50) {
        //             return true;
        //         }
        //         return false;
        //     },
        //     style(data, terminals) {
        //         return {
        //             strokeColor: "red",
        //             strokeWeight: 3,
        //             strokeOpacity: 1
        //         };
        //     }
        // }
    },
    //弹窗样式
    infos: {
        RYC(data) {
            var $div = $(`<div></div>`);
            return $div.html(`信息窗口:${data.name}`)[0];
        },
        HRZ(data) {
            var $div = $(`<div></div>`);
            return $div.html(`信息窗口:${data.name}`)[0];
        },
        RLJ_FIRST(data) {
            var $div = $(`<div>
                    <div>名称：${data.name}</div>
                    <div>温度：${data.temperature}℃</div>
                    <div>压力：${data.pressure}</div>
                    </div>`);
            return $div[0];
        },
        RLJ_SECOND(data) {
            var $div = $(`<div>
                    <div>名称：${data.name}</div>
                    <div>温度：${data.temperature}℃</div>
                    <div>压力：${data.pressure}</div>
                    </div>`);
            return $div[0];
        },
        // PIPE_FIRST(data, terminals) {
        //     return;
        //     var temperature = ((terminals.start.temperature + terminals.end.temperature) / 2).toFixed(1);
        //     var pressure = Math.abs((terminals.start.pressure - terminals.end.pressure).toFixed(1));
        //     var $div = $(`<div>
        //             <div style="font-size:14px;">平均温度：${temperature}℃<span style="font-size:12px;color:#ccc;">（${terminals.start.temperature}℃ - ${terminals.end.temperature}℃）</span></div>
        //             <div style="font-size:14px;">压差：${pressure}<span style="font-size:12px;color:#ccc;">（${terminals.start.pressure} - ${terminals.end.pressure}）</span></div>
        //             </div>`).css({
        //         width: '280px'
        //     });
        //     return $div[0];
        // },
        // PIPE_SECOND(data, terminals) {
        //     return;
        //     var temperature = ((terminals.start.temperature + terminals.end.temperature) / 2).toFixed(1);
        //     var pressure = Math.abs((terminals.start.pressure - terminals.end.pressure).toFixed(1));
        //     var $div = $(`<div>
        //             <div style="font-size:14px;">平均温度：${temperature}℃<span style="font-size:12px;color:#ccc;">（${terminals.start.temperature}℃ - ${terminals.end.temperature}℃）</span></div>
        //             <div style="font-size:14px;">压差：${pressure}<span style="font-size:12px;color:#ccc;">（${terminals.start.pressure} - ${terminals.end.pressure}）</span></div>
        //             </div>`).css({
        //         width: '280px'
        //     });
        //     return $div[0];
        // }
    }
};

module.exports = config;