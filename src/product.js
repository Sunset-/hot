import './app';
import config from './config';
import mapDemoData from './data';

//DEMO
//总公司
var org = {
    '西安热力总公司': [108.955783, 34.315257]
};


//外部操作
HeatSourceMapApp.init({
    container: $("#container"),
    center: [108.944267, 34.223048],
    zoom: 11,
    roam: true,
    mapStyle: {
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
    }
}).then(() => {
    //配置
    HeatSourceMapApp.config(config);
    //$.get('/data/mapDemoData.json').then(res => {
    var res = mapDemoData || {};
    var DATA = {};
    DATA.rycs = res['RYC_DATA'] ? JSON.parse(res['RYC_DATA']) : [];
    DATA.rlj1s = res['RLJ_FIRST_DATA'] ? JSON.parse(res['RLJ_FIRST_DATA']) : [];
    DATA.hrzs = res['HRZ_DATA'] ? JSON.parse(res['HRZ_DATA']) : [];
    DATA.rlj2s = res['RLJ_SECOND_DATA'] ? JSON.parse(res['RLJ_SECOND_DATA']) : [];
    DATA.users = res['USER_DATA'] ? JSON.parse(res['USER_DATA']) : [];
    DATA.pipeFirsts = res['PIPE_FIRST_DATA'] ? JSON.parse(res['PIPE_FIRST_DATA']) : [];
    DATA.pipeSeconds = res['PIPE_SECOND_DATA'] ? JSON.parse(res['PIPE_SECOND_DATA']) : [];
    window.HeatSourceMapApp.addNodes(DATA.rycs, 'RYC');
    window.HeatSourceMapApp.addNodes(DATA.rlj1s, 'RLJ_FIRST');
    window.HeatSourceMapApp.addNodes(DATA.hrzs, 'HRZ');
    window.HeatSourceMapApp.addNodes(DATA.rlj2s, 'RLJ_SECOND');
    window.HeatSourceMapApp.addNodes(DATA.users, 'USER');
    window.HeatSourceMapApp.addPipes(DATA.pipeFirsts, 'PIPE_FIRST');
    window.HeatSourceMapApp.addPipes(DATA.pipeSeconds, 'PIPE_SECOND');
    //});
});



import './chart';

HeatSourceChartApp.init('#chart', {
    labels: {
        discharge: {
            co2: '二氧化碳',
            so2: '二氧化硫',
            pm25: 'PM2.5',
            no2: '二氧化氮'
        },
        energy: {
            h20: '水',
            mei: '煤'
        }
    },
    steps: {
        energy: 10
    }
});
HeatSourceChartApp.setDischargeData([{
    label: '城区',
    discharge: {
        co2: 320,
        so2: 210,
        pm25: 310,
        no2: 1320
    }
}, {
    label: '雁东',
    discharge: {
        co2: 330,
        so2: 230,
        pm25: 330,
        no2: 1320
    }
}, {
    label: '北联',
    discharge: {
        co2: 320,
        so2: 210,
        pm25: 310,
        no2: 1320
    }
}, {
    label: '太华',
    discharge: {
        co2: 320,
        so2: 230,
        pm25: 330,
        no2: 1330
    }
}, {
    label: '阎良',
    discharge: {
        co2: 390,
        so2: 90,
        pm25: 290,
        no2: 1290
    }
}, {
    label: '城北',
    discharge: {
        co2: 234,
        so2: 134,
        pm25: 234,
        no2: 934
    }
}, {
    label: '渭水',
    discharge: {
        co2: 300,
        so2: 110,
        pm25: 205,
        no2: 900
    }
}, {
    label: '泾渭',
    discharge: {
        co2: 300,
        so2: 130,
        pm25: 180,
        no2: 830
    }
}, {
    label: '高陵',
    discharge: {
        co2: 320,
        so2: 120,
        pm25: 220,
        no2: 820
    }
}]);
HeatSourceChartApp.setEnergyData([{
    label: '城区',
    energy: {
        h20: 34,
        mei: 24
    }
}, {
    label: '雁东',
    energy: {
        h20: 50,
        mei: 41
    }
}, {
    label: '北联',
    energy: {
        h20: 65,
        mei: 35
    }
}, {
    label: '太华',
    energy: {
        h20: 62,
        mei: 32
    }
}, {
    label: '阎良',
    energy: {
        h20: 37,
        mei: 47
    }
}, {
    label: '城北',
    energy: {
        h20: 34,
        mei: 24
    }
}, {
    label: '渭水',
    energy: {
        h20: 86,
        mei: 56
    }
}, {
    label: '泾渭',
    energy: {
        h20: 50,
        mei: 41
    }
}, {
    label: '高陵',
    energy: {
        h20: 38,
        mei: 61
    }
}]);

$("#searchbutton").on('click', function () {
    var searchText = $("#searchinput").val();
    var elements = window.HeatSourceMapApp.search(item => {
        return item.name && (~item.name.indexOf(searchText));
    });
    if (elements.length == 0) {
        alert('未找到符合条件的节点');
    }
})