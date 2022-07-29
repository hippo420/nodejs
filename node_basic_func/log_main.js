
const morgan = require('morgan');
const logger = require('./log');

app.use(bodyparser.json());
app.use(morgan('combines',{stream:logger.stream}));

app.listen(3004,function(){
    looger.info('server 3004 port starting....');
});