import './app';

import config from './config';
import operate from './operate';

config.click = config.info = {};


//DEMO
//总公司
var org = {
    '西安热力总公司': [108.955783, 34.315257]
};


//外部操作
HeatSourceMapApp.init({
    container: $("#container"),
    center: [108.944267, 34.223048],
    zoom: 13,
    roam: true,
    edit: true,
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
    //添加节点
    // HeatSourceMapApp.addNodes(rycs);
    // HeatSourceMapApp.addNodes(rljs1);
    // HeatSourceMapApp.addNodes(hrzs);
    // HeatSourceMapApp.addNodes(rljs2);
    // //添加管道
    // HeatSourceMapApp.addPipes(pipes);
    // HeatSourceMapApp.addPipes(pipes2);
});