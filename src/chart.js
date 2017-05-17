(function () {
    var HeatSourceChartApp = window.HeatSourceChartApp = {
        init(el, options = {}) {
            this._$el = $(el);
            this._initOptions(options);
            this._initDom();
            this._initEvent();
        },
        _initOptions(options) {
            this.labels = options.labels || {};
            this.steps = options.steps || {};
        },
        _initDom() {
            this._$el.html(`
            <div class="chart-box-container">
                <div class="chart-box-tabs">
                    <span class="chart-box-tab active" data-tab="discharge">环保排放</span>
                    <span class="chart-box-tab " data-tab="energy">能耗</span>
                </div> 
                <div class="chart-box-contents">
                    <div class="chart-box-content chart-discharge active">123</div>
                    <div class="chart-box-content chart-energy">456</div>
                </div>
            </div>
            `);
            this._$dischargeEl = $(`.chart-discharge`, this._$el);
            this._$energyEl = $(`.chart-energy`, this._$el);
        },
        _initEvent() {
            var self = this;
            this._$el.on('click', '.chart-box-tab', function () {
                var $this = $(this),
                    tab = $this.data('tab');
                $this.addClass('active').siblings().removeClass('active');
                $(`.chart-${tab}`, self._$el).addClass('active').siblings().removeClass('active');
                self[`_${tab}Chart`] && self[`_${tab}Chart`].resize();
            })
        },
        _getPlaceHolderData(data, step) {
            var max = data.reduce((max, current) => Math.max(max, current), data[0]),
                full;
            if (max % step == 0) {
                full = max + step;
            } else {
                full = (parseInt(max / step) + 1) * step;
            }
            return data.map(item => full - item);
        },
        setDischargeData(data) {
            if (!this._dischargeChart) {
                this._dischargeChart = echarts.init(this._$dischargeEl[0]);
            }
            var placeHoledStyle = {
                normal: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                }
            };
            var labels = this.labels.discharge || {},
                seriesData = {},
                legend = [],
                yAxis = [];
            data && data.forEach(item => {
                yAxis.push(item.label);
            });
            Object.keys(labels).forEach(key => {
                legend.push(labels[key]);
                data && data.forEach(item => {
                    seriesData[key] = seriesData[key] || [];
                    seriesData[key].push(item.discharge[key] || 0);
                });
            });
            var options = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                textStyle: {
                    color: '#FFF'
                },
                legend: {
                    data: legend,
                    textStyle: {
                        color: '#FFF'
                    },
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: yAxis
                },
                series: Object.keys(seriesData).map((key) => {
                    return {
                        name: labels[key],
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        data: seriesData[key]
                    };
                })
            };
            this._dischargeChart.setOption(options);
        },
        setEnergyData(data) {
            if (!this._energyChart) {
                this._energyChart = echarts.init(this._$energyEl[0]);
            }
            var placeHoledStyle = {
                normal: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                },
                emphasis: {
                    barBorderColor: 'rgba(0,0,0,0)',
                    color: 'rgba(0,0,0,0)'
                }
            };
            var labels = this.labels.energy || {},
                step = this.steps.energy || 100,
                seriesData = {},
                legend = [],
                yAxis = [];
            data && data.forEach(item => {
                yAxis.push(item.label);
            });
            Object.keys(labels).forEach(key => {
                legend.push(labels[key]);
                data && data.forEach(item => {
                    seriesData[key] = seriesData[key] || [];
                    seriesData[key].push(item.energy[key] || 0);
                });
            });
            var options = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: function (a, b, c) {
                        var html = [`${a[0].name}`];
                        for (var i = 0; i < a.length; i += 2) {
                            html.push(`<br><span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:${a[i].color}"></span>${a[i].seriesName}：${a[i].value}%`);
                        }
                        return html.join('');
                    }
                },
                textStyle: {
                    color: '#FFF'
                },
                legend: {
                    data: legend,
                    textStyle: {
                        color: '#FFF'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: yAxis
                },
                series: Object.keys(seriesData).reduce((data, key) => {
                    var currentData = {
                        name: labels[key],
                        type: 'bar',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight',
                                formatter: '{c}%'
                            }
                        },
                        data: seriesData[key]
                    };
                    data.push(currentData);
                    data.push({
                        name: labels[key],
                        type: 'bar',
                        stack: '总量',
                        itemStyle: placeHoledStyle,
                        data: this._getPlaceHolderData(seriesData[key], step)
                    });
                    return data;
                }, [])
            };
            this._energyChart.setOption(options);
        }
    };
})();