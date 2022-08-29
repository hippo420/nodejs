module.exports = {
    server_port : 3000,
    db_url :'mongodb://localhost:27017/local',
    db_schema: [
        {file:'./user_schema',collection:'users3',schemaName:'userSchema',
        modelName:'userModel'}
    ]
}