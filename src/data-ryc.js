//热源厂
var rycs = [{
    name: '热源厂:渭水',
    no: 'ryc_1',
    type: 'RYC',
    coord: [108.91, 34.38],
    region: '108.817283,34.462571;108.727596,34.445425;108.710348,34.387295;108.70115,34.321492;108.722996,34.268049;108.783937,34.229854;108.864426,34.204062;108.893171,34.233674;108.90007,34.267094;108.961011,34.30718;109.004705,34.329124;109.003555,34.385389;109.034601,34.424465;108.964461,34.469238;108.870175,34.474951;108.804634,34.474951',
    info: function (data) {
        var $div = $(`<div></div>`);
        return $div.html(`信息窗口:${data.name}`)[0];
    },
    click(data) {
        alert('click');
    },
    data: {
        name: '渭水'
    }
}, {
    name: '热源厂:雁东',
    no: 'ryc_2',
    type: 'RYC',
    coord: [109.02, 34.23],
    region: '109.012754,34.349155;109.098991,34.349155;109.142685,34.3234;109.186378,34.269958;109.220873,34.231764;109.186378,34.192597;109.184079,34.144807;109.095542,34.137158;109.034601,34.125683;108.921917,34.201196;108.90352,34.260411;108.948363,34.297638;109.012754,34.324354',
    info: function (data) {
        var $div = $(`<div></div>`);
        return $div.html(`信息窗口:${data.name}`)[0];
    },
    click(data) {
        alert('click');
    },
    data: {
        name: '雁东'
    }
}, {
    name: '热源厂:草堂',
    no: 'ryc_3',
    type: 'RYC',
    coord: [108.70, 34.03],
    region: '108.63216,34.206928;108.737944,34.204062;108.813833,34.157235;108.829931,34.09125;108.857527,34.018511;108.825331,33.973496;108.771289,33.940917;108.641358,33.954333;108.567769,33.991696;108.527525,34.040531;108.510278,34.092207;108.513727,34.135246;108.599965,34.183041',
    info: function (data) {
        var $div = $(`<div></div>`);
        return $div.html(`信息窗口:${data.name}`)[0];
    },
    click(data) {
        alert('click');
    },
    data: {
        name: '草堂'
    }
}, {
    name: '热源厂:高陵',
    no: 'ryc_4',
    type: 'RYC',
    coord: [109.09, 34.55],
    region: '108.979409,34.642383;109.093242,34.631928;109.093242,34.612917;109.187528,34.615769;109.247319,34.578685;109.248469,34.483522;109.212824,34.484474;109.215124,34.462571;109.117388,34.460666;109.03575,34.444473;109.028851,34.493043;108.939165,34.51113;108.940314,34.60436;108.986308,34.606262;108.982858,34.647134;108.979409,34.642383',
    click(data) {
        alert('click');
    },
    data: {
        name: '高陵'
    }
}];

module.exports = rycs;