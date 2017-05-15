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