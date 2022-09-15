var mongoose = require('mongoose');
const mongodb = require('mongodb');

var database ={};

database.init = function(app,config){
    console.log('database ====> init() 호출됨');

    connect(app,config);
}

function connect(app,config){
    console.log('database ====> connect() 호출됨');
    var databaseUrl = config.db_url;
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database.db = mongoose.connection;

    database.db.on('error',console.error.bind(console,'mongoose connection error!!!'));
    
    database.db.on('open', function(){
        console.log('DB open');
        createSchema(app,config);
    });

    database.db.on('disconnected',function(){
        console.log('DB 연결 해제 ======> connect() 시도');
        //connect();
    });
}


function createSchema(app,config){
    console.log('database.js =====> createSchema()');
    let schemaLen =config.db_schema.length;
    console.log('스키마 개수 : %d',schemaLen);
    for(i=0;i<schemaLen;i++){

        let curItem = config.db_schema[i];
        console.log(curItem.file);
        let curSchema = require(curItem.file).createSchema(mongoose);
        console.log('%s  모듈 Load ====> createSchema(mongoose)', curItem.file);

        let curModel = mongoose.model(curItem.collection,curSchema);
        console.log('%s 컬렉션 모델 정의함', curItem.collection);

        database[curItem.schemaName] = curSchema;
        database[curItem.modelName] = curModel;
        console.log('databse 객체의 속성 추가 ====> 스키마 이름 [%s], 모델 이름 [%s]', curItem.schemaName, curItem.modelName);
    }

    app.set('database',database);
    console.log('database 객체가 app객체의 속성으로 추가됨');
}

module.exports = database;