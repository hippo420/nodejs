
const config = require('../config');
const database = require('../database/database_loader');


var route_loader ={};

route_loader.init = function(app,router){
    console.log('route_loader.js ===> init() 호출됨.');
    database.init(app,config);
    return initRoutes(app,router);
}

function initRoutes(app,router){
    console.log('route_loader.js ===> initRoutes() 호출됨.');

    let routeLen = config.route_info.length;
    
    for(i=0;i<routeLen;i++){
        let curItem = config.route_info[i];
        let curModel = require(curItem.file);

        let methodType = curItem.type;
        switch(methodType){
            case 'get':
                console.log('#===========> get ===========>');
                console.log('@path : %s',curItem.path);
                console.log('@curModel : %s',curModel[curItem.method]);
                //router.route(curItem.path).get(curModel[curItem.method]);
                app.get(curItem.path,curModel[curItem.method]);
                break;

            case 'post':
                console.log('#===========> post ==========>');
                console.log('@path : %s',curItem.path);
                console.log('@curItem.method : %s',curItem.method);
                app.post(curItem.path,curModel[curItem.method]);
                break;
        }
        console.log('라우팅 모듈 : [%s]',curItem.method);
    }
   
    
}

module.exports = route_loader;