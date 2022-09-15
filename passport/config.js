var path ='../routes/users';

module.exports = {
    server_port : 3000,
    db_url :'mongodb://localhost:27017/local',
    db_schema: [{
        file:'../database/user_schema',
        collection:'users1',
        schemaName:'UserSchema',
        modelName:'UserModel'
    }],
    route_info: [],
};