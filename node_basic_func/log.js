/**
 * Logger Level
 * debug:0 > info:1 > notice:2 > warning:3 > error:4 > crit:5 > alert:6 > emerg:7
 */
const winston = require('winston');
const winstonDaily = require('winston-daily-rotate-file');
const moment = require('moment');

function timeStamp(){
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
};

let logger = new winston.createLogger({
    transports:[
        new (winstonDaily)({
            name : 'info-file',
            filename: './log/server_%DATE%.log',
            colorize: false,
            maxsize:50000000,
            maxFiles:1000,
            level:'info',
            showLevel:true,
            json: false,
            timestamp:timeStamp 
        }),
        new (winston.transports.Console)({
            name : 'debug-console',
            colorize: true,
            level:'debug',
            showLevel:true,
            json: false,
            timestamp:timeStamp 
        }),
    ],
    exceptionHandlers:[
        new (winstonDaily)({
            name : 'exception-file',
            filename: './log/exception_%DATE%.log',
            colorize: false,
            maxsize:50000000,
            maxFiles:1000,
            level:'error',
            showLevel:true,
            json: false,
            timestamp:timeStamp 
        }),
        new (winston.transports.Console)({
            name : 'exception-console',
            colorize: true,
            level:'debug',
            showLevel:true,
            json: false,
            timestamp:timeStamp 
        }),
    ]
});

logger.stream={
    write:function(message,encoding){
        logger.info(message);
    },
};
module.exports=logger;