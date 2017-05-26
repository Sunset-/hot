    function dataToString(obj) {
        obj = obj || {};
        return Object.keys(obj).reduce(function (values, key) {
            values.push(`${key}:${obj[key]}`);
            return values;
        }, []).join(',');
    }

    function stringToData(str) {
        return (str || '').split(',').reduce(function (obj, keyvalue) {
            var kv = keyvalue.split(':');
            obj[kv[0]] = kv[1];
            return obj;
        }, {});
    }

    function downloadFile(fileName, content) {
        var aLink = document.createElement('a');
        var blob = new Blob([content]);
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("click", false, false); //initEvent 不加后两个参数在FF下会报错, 感谢 Barret Lee 的反馈
        aLink.download = fileName;
        aLink.href = URL.createObjectURL(blob);
        aLink.dispatchEvent(evt);
        aLink.text = '点此下载';
        $("#downloadlink").html(aLink);
    }

    var DATA = {
        rycs: null,
        rlj1s: null,
        hrzs: null,
        rlj2s: null,
        users: null,
        pipeFirsts: null
    };



    function init() {
        DATA.rycs = localStorage.getItem('RYC_DATA') ? JSON.parse(localStorage.getItem('RYC_DATA')) : [];
        DATA.rlj1s = localStorage.getItem('RLJ_FIRST_DATA') ? JSON.parse(localStorage.getItem('RLJ_FIRST_DATA')) : [];
        DATA.hrzs = localStorage.getItem('HRZ_DATA') ? JSON.parse(localStorage.getItem('HRZ_DATA')) : [];
        DATA.rlj2s = localStorage.getItem('RLJ_SECOND_DATA') ? JSON.parse(localStorage.getItem('RLJ_SECOND_DATA')) : [];
        DATA.users = localStorage.getItem('USER_DATA') ? JSON.parse(localStorage.getItem('USER_DATA')) : [];
        DATA.pipeFirsts = localStorage.getItem('PIPE_FIRST_DATA') ? JSON.parse(localStorage.getItem('PIPE_FIRST_DATA')) : [];
        DATA.pipeSeconds = localStorage.getItem('PIPE_SECOND_DATA') ? JSON.parse(localStorage.getItem('PIPE_SECOND_DATA')) : [];
        setTimeout(function () {
            window.HeatSourceMapApp.addNodes(DATA.rycs, 'RYC');
            window.HeatSourceMapApp.addNodes(DATA.rlj1s, 'RLJ_FIRST');
            window.HeatSourceMapApp.addNodes(DATA.hrzs, 'HRZ');
            window.HeatSourceMapApp.addNodes(DATA.rlj2s, 'RLJ_SECOND');
            window.HeatSourceMapApp.addNodes(DATA.users, 'USER');
            window.HeatSourceMapApp.addPipes(DATA.pipeFirsts, 'PIPE_FIRST');
            window.HeatSourceMapApp.addPipes(DATA.pipeSeconds, 'PIPE_SECOND');
        }, 300);
    }

    init();

    function saveAll() {
        Object.keys(DATA_MAP_REL).forEach(function (key) {
            var list = DATA[DATA_MAP_REL[key]];
            if (list) {
                if (!~key.indexOf('PIPE')) {
                    localStorage.setItem(`${key}_DATA`, JSON.stringify(list.map(function (item) {
                        return {
                            type: item.type,
                            coord: [item._marker.point.lng, item._marker.point.lat],
                            region: item._region && item._region.getPath().map(function (p) {
                                return `${p.lng},${p.lat}`;
                            }).join(';'),
                            data: item.data
                        };
                    })));
                } else {
                    localStorage.setItem(`${key}_DATA`, JSON.stringify(list.map(function (item) {
                        return {
                            type: item.type,
                            path: item._line.getPath().map(function (point) {
                                return `${point.lng},${point.lat}`;
                            }).join(';'),
                            data: item.data
                        };
                    })));
                }
            }
        });
        return {
            RYC_DATA: localStorage.getItem('RYC_DATA'),
            RLJ_FIRST_DATA: localStorage.getItem('RLJ_FIRST_DATA'),
            HRZ_DATA: localStorage.getItem('HRZ_DATA'),
            RLJ_SECOND_DATA: localStorage.getItem('RLJ_SECOND_DATA'),
            USER_DATA: localStorage.getItem('USER_DATA'),
            PIPE_FIRST_DATA: localStorage.getItem('PIPE_FIRST_DATA'),
            PIPE_SECOND_DATA: localStorage.getItem('PIPE_SECOND_DATA')
        };
    }
    $("#save").on('click', saveAll);

    function clear() {
        if (window.confirm('确定清空所有元素？')) {
            localStorage.setItem('RYC_DATA', '');
            localStorage.setItem('RLJ_FIRST_DATA', '');
            localStorage.setItem('HRZ_DATA', '');
            localStorage.setItem('RLJ_SECOND_DATA', '');
            localStorage.setItem('USER_DATA', '');
            localStorage.setItem('PIPE_FIRST_DATA', '');
            localStorage.setItem('PIPE_SECOND_DATA', '');
            init();
        }
    }
    $("#clear").on('click', clear);

    var DATA_MAP_REL = {
        RYC: 'rycs',
        HRZ: 'hrzs',
        RLJ_FIRST: 'rlj1s',
        RLJ_SECOND: 'rlj2s',
        PIPE_FIRST: 'pipeFirsts',
        PIPE_SECOND: 'pipeSeconds',
        USER: 'users'
    };

    //修改删除
    window.globalOperateNodeAndPipe = function (e, overlay) {
        if (e.altKey || e.ctrlKey || e.shiftKey) {
            var type = overlay._type,
                list = DATA[DATA_MAP_REL[type]],
                hold = (~type.indexOf('PIPE')) ? '_line' : '_marker',
                method = (~type.indexOf('PIPE')) ? 'addPipes' : 'addNodes',
                current, index;
            for (var i = 0; i < list.length; i++) {
                if (list[i][hold] === overlay) {
                    current = list[i];
                    index = i;
                    break;
                }
            }
            if (e.altKey) {
                if (!current._region) {
                    var center = current._marker.point;
                    current.region = `${center.lng},${center.lat+0.02};${center.lng-0.02},${center.lat-0.01};${center.lng+0.02},${center.lat-0.01}`;
                    window.HeatSourceMapApp.addNodes(DATA[DATA_MAP_REL[current.type]], current.type);
                } else {
                    if (window.confirm('删除此元素的辖区?')) {
                        current.region = null;
                        window.HeatSourceMapApp.addNodes(DATA[DATA_MAP_REL[current.type]], current.type);
                    }
                }
                //设置节点辖区
            } else if (e.ctrlKey) {
                if (window.confirm('删除此元素?')) {
                    list.splice(index, 1);
                    window.HeatSourceMapApp[method](list, type);
                }
            } else {
                current.data = stringToData(window.prompt('请输入data', dataToString(current && current.data)));
                current._infoWindow = null;
            }
        }
    }

    //新增节点
    var CURRENT_ADD_NODE_TYPE = null;

    function globalAddNode(e) {
        if (!e.overlay && CURRENT_ADD_NODE_TYPE) {
            DATA[DATA_MAP_REL[CURRENT_ADD_NODE_TYPE]].push({
                type: CURRENT_ADD_NODE_TYPE,
                coord: [e.point.lng, e.point.lat],
                data: {
                    type: CURRENT_ADD_NODE_TYPE,
                    name: '未命名'
                }
            });
            window.HeatSourceMapApp.addNodes(DATA[DATA_MAP_REL[CURRENT_ADD_NODE_TYPE]], CURRENT_ADD_NODE_TYPE);
        }
    }


    //新增管道
    var currentPipe = null,
        editingPipe = null,
        CURRENT_ADD_PIPE_TYPE = null,
        startAndEnd = {
            PIPE_FIRST: {
                start: {
                    RYC: true,
                    RLJ_FIRST: true
                },
                end: {
                    HRZ: true,
                    RLJ_FIRST: true
                }
            },
            PIPE_SECOND: {
                start: {
                    HRZ: true,
                    RLJ_SECOND: true
                },
                end: {
                    USER: true,
                    RLJ_SECOND: true
                }
            }
        };

    function globalAddPipe(e) {
        var se = startAndEnd[CURRENT_ADD_PIPE_TYPE];
        if (currentPipe == null) {
            editingPipe = null;
            if (e.overlay) {
                var type = e.overlay._type;
                if (se.start[type]) {
                    currentPipe = {
                        type: CURRENT_ADD_PIPE_TYPE,
                        path: `${e.overlay.point.lng},${e.overlay.point.lat}`,
                        data: {
                            type: CURRENT_ADD_PIPE_TYPE,
                            status: 0
                        }
                    }
                }
            }
        } else {
            editingPipe = currentPipe;
            if (e.overlay) {
                var type = e.overlay._type;
                if (se.end[type]) {
                    currentPipe.path += `;${e.overlay.point.lng},${e.overlay.point.lat}`;
                    currentPipe = null;
                }
            } else {
                currentPipe.path += `;${e.point.lng},${e.point.lat}`;
            }
        }
        var pipe = currentPipe || editingPipe;
        if (pipe && pipe.path.split(';').length > 1) {
            if (!pipe._line) {
                var pipes = window.HeatSourceMapApp.addPipes([pipe]);
                DATA[DATA_MAP_REL[CURRENT_ADD_PIPE_TYPE]].push(pipe);
            } else {
                pipe._line.setPath(pipe.path.split(';').map(function (p) {
                    var ps = p.split(',');
                    return new BMap.Point(ps[0], ps[1]);
                }))
            }
        }
    }


    //设置热源厂
    $("#add_tools .tool").on('click', function () {
        var $this = $(this),
            type = $this.data('type');
        if (!~type.indexOf('PIPE')) {
            window.globalAddNodeOrPipe = globalAddNode;
            CURRENT_ADD_NODE_TYPE = type;
        } else {
            window.globalAddNodeOrPipe = globalAddPipe;
            CURRENT_ADD_PIPE_TYPE = type;
        }
        $("#currentOperate").html($(this).text())
    });

    $("#download").on('click', function () {
        downloadFile('mapDemoData.json', JSON.stringify(saveAll()))
    });

    $("#import").on('change', function (e) {
        if (this.files && this.files.length == 1) {
            var reader = new FileReader();
            //将文件以Data URL形式读入页面  
            reader.readAsText(this.files[0]);
            reader.onload = function (e) {
                try {
                    DATA = JSON.parse(this.result);
                    Object.keys(DATA).forEach(function (key) {
                        localStorage.setItem(key, DATA[key]);
                    });
                    init();
                    alert('导入成功');
                } catch (e) {
                    alert('导入失败');
                    throw e;
                }
            }
        }
    });

    $("#search").on('click', function () {
        var searchText = $("#searchinput").val();
        var elements = window.HeatSourceMapApp.search(function (item) {
            return item.name && (~item.name.indexOf(searchText));
        });
    });



    

//外部操作
HeatSourceMapApp.init({
    container: $("#container"),
    center: [108.944267, 34.223048],
    zoom: 13,
    roam: true,
    edit: true,
    mapStyle: {
        style: 'dark'
    }
}).then(() => {
    //配置
    HeatSourceMapApp.config(window.HotMapAppConfig);
});