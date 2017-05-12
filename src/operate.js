//设置热源厂
var rycs = localStorage.getItem('RYC_DATA') ? JSON.parse(localStorage.getItem('RYC_DATA')) : [];
setTimeout(() => {
    window.HeatSourceMapApp.addNodes(rycs, 'RYC');
}, 1000);

function addRyc(e) {
    if (!e.overlay) {
        rycs.push({
            name: '热源厂:渭水',
            no: 'ryc_1',
            type: 'RYC',
            coord: [e.point.lng, e.point.lat],
            data: {
                name: '渭水'
            }
        });
    } else {
        for (var i = 0; i < rycs.length; i++) {
            if (rycs[i]._marker === e.overlay) {
                rycs.splice(i, 1);
                break;
            }
        }
    }
    window.HeatSourceMapApp.addNodes(rycs, 'RYC');
}

function saveRyc(e) {
    var saveRycs = rycs.map(item => {
        return {
            coord: [item._marker.point.lng, item._marker.point.lat],
            data: item.data,
            name: item.name,
            no: item.no,
            type: item.type
        };
    });
    localStorage.setItem('RYC_DATA', JSON.stringify(saveRycs));
}
$("#add_ryc").on('click', function () {
    window.MAP_CONFIG_DATA = addRyc;
    $("#currentOperate").html($(this).text())
});
$("#save_ryc").on('click', saveRyc);