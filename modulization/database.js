const mongoose = require('mongoose');

var database={};

database.init = function(app,config){
    console.log('database.js ===> init() 호출');

    connect(app,config);
}

function connect(app,config){
    console.log('database.js ===> connect() 호출');
}