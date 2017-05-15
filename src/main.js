import './app';
import rycs from './data-ryc';
import hrzs from './data-hrz';
import rljs1 from './data-rlj1';
import rljs2 from './data-rlj2';
import pipes from './data-pipe1';
import pipes2 from './data-pipe2';

import config from './config';
import operate from './operate';


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
    edit: true
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