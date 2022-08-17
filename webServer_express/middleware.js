// npm install serve-static --save
const static = require('serve-static');


app.use(static(path.join(__dirname,'FolerName')));

/*access==============>
* ./public/html -> localhost:3000/html/index.html
* ./public/html -> localhost:3000/images/f1.jpg
* ./public/html -> localhost:3000/js/access.js
*/

res.end("<img src ='/imgaes/f1.jpg' width='50%'>");

app.use('/public',static(path.join(__dirname,'public')));