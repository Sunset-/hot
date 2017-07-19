    var symbolSize = 10;
    var items = [{
        name: 'P0',
        high: 100,
        low: 14,
        standardHigh: 100,
        standardLow: 10
    }, {
        name: 'P1',
        high: 90,
        low: 20,
        standardHigh: 94,
        standardLow: 16
    }, {
        name: 'P2',
        high: 85,
        low: 24,
        standardHigh: 88,
        standardLow: 22
    }, {
        name: 'P3',
        high: 74,
        low: 33,
        standardHigh: 82,
        standardLow: 28
    }, {
        name: 'P4',
        high: 74,
        low: 35,
        standardHigh: 76,
        standardLow: 34
    }, {
        name: 'P5',
        high: 71,
        low: 40,
        standardHigh: 70,
        standardLow: 40
    }, {
        name: 'P6',
        high: 62,
        low: 44,
        standardHigh: 64,
        standardLow: 46
    }, {
        name: 'P7',
        high: 58,
        low: 51,
        standardHigh: 58,
        standardLow: 52
    }, {
        name: 'P0',
        high: 100,
        low: 14,
        standardHigh: 100,
        standardLow: 10
    }, {
        name: 'P1',
        high: 90,
        low: 20,
        standardHigh: 94,
        standardLow: 16
    }, {
        name: 'P2',
        high: 85,
        low: 24,
        standardHigh: 88,
        standardLow: 22
    }, {
        name: 'P3',
        high: 74,
        low: 33,
        standardHigh: 82,
        standardLow: 28
    }, {
        name: 'P4',
        high: 74,
        low: 35,
        standardHigh: 76,
        standardLow: 34
    }, {
        name: 'P5',
        high: 71,
        low: 40,
        standardHigh: 70,
        standardLow: 40
    }, {
        name: 'P6',
        high: 62,
        low: 44,
        standardHigh: 64,
        standardLow: 46
    }, {
        name: 'P7',
        high: 58,
        low: 51,
        standardHigh: 58,
        standardLow: 52
    }];



    function getColor(v) {
        return ["#86E281", "#86E281", "#99C174", "#A6B765", "#B5AC53", "#CB9C3B", "#DE8E25", "#EA8617", "#EF8211", "#F47F0C", "#F97C07"][Math.round(v / 10.0)];
    }

    var labels = {
        high: '高压',
        low: '低压',
        standardHigh: '参考高压',
        standardLow: '参考低压',
        'high-low': '压差',
        'standardHigh-standardLow': '标准压差'
    };

    //初始化
    WaterPressureApp.init('#water-pressure-app', {
        timeStep: 360,
        windowPointCount: 10,
        //获取热源厂
        loadRyc() {
            return Promise.resolve([{
                text: '第一热源厂',
                value: 0
            }, {
                text: '第二热源厂',
                value: 1
            }, {
                text: '第三热源厂',
                value: 2
            }])
        },
        //获取换热站
        loadHrz(ryc) {
            return Promise.resolve([{
                text: '请选择',
                value: ''
            }].concat([
                [{
                    text: '第一换热站A',
                    value: 1
                }, {
                    text: '第一换热站B',
                    value: 2
                }],
                [{
                    text: '第二换热站A',
                    value: 3
                }, {
                    text: '第二换热站B',
                    value: 4
                }],
                [{
                    text: '第三换热站A',
                    value: 5
                }, {
                    text: '第三换热站B',
                    value: 6
                }]
            ][ryc.value]));
        },
        //获取水压数据
        loadData(ryc, hrz, time) {
            console.log(`${ryc&&ryc.text||'无'}-${hrz&&hrz.text||'无'}-${time.toString()}`)
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(items);
                }, 200);
            })
        },
        //loading样式
        chartLoadingStyle: {
            text: 'loading',
            color: '#c23531',
            textColor: '#000',
            maskColor: 'rgba(0, 0, 0, 0.8)',
            zlevel: 0
        },
        //点标签提示
        pointLabel(data, type) {
            return data.name;
        },
        //点标签样式
        pointLabelStyle(data, type) {
            return {
                color: '#1488C4',
                fontSize: 20,
                fontStyle: 'normal',
                fontWeight: 'normal',
                fontFamily: 'Arial'
            }
        },
        //点漂浮提示
        pointTip(data, type) {
            return `${labels[type]}：${data[type]}`;
        },
        //点样式
        pointStyle(data, type) {
            return {
                symbolSize: 15,
                normal: {
                    borderColor: (type == 'standardHigh' || type == 'standardLow') ? '#999' : getColor(data[type]),
                    borderWidth: (type == 'standardHigh' || type == 'standardLow') ? 0 : 2,
                    color: (type == 'standardHigh' || type == 'standardLow') ? '#999' : '#FFF',
                    opacity: (type == 'standardHigh' || type == 'standardLow') ? 0.7 : 1
                }
            }
        },
        //线漂浮提示
        lineTip(current, next, type) {
            if (next) {
                return `${labels[type]}差：${current[type]-next[type]}`;
            } else {
                var ts = type.split('-');
                return `${labels[type]}：${current[ts[0]]-current[ts[1]]}`;
            }
        },
        //线样式
        lineStyle(current, next, type) {
            return {
                normal: {
                    width: 6,
                    opacity: (type == 'standardHigh' || type == 'standardLow') ? 0.7 : 1
                }
            }
        }
    });