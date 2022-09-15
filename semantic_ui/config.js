var path ='../routes/users';

module.exports = {
    server_port : 3000,
    db_url :'mongodb://localhost:27017/local',
    db_schema: [{
        file:'../database/user_schema',
        collection:'users',
        schemaName:'UserSchema',
        modelName:'UserModel'
    }],
    route_info: [{
        file : path,
        path: '/action/login',
        method : 'login',
        type : 'post'
    },{
        file : path,
        path: '/action/adduser',
        method : 'adduser',
        type : 'post'
    },{
        file : path,
        path: '/action/listuser',
        method : 'listuser',
        type : 'post'
    }],
};