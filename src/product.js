import './app';
import config from './config';

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
    roam: true
}).then(() => {
    //配置
    HeatSourceMapApp.config(config);
    $.get('/data/mapDemoData.json').then(res => {
        res = res || {};
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
    });
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