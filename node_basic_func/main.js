const url = require('url');
const querystring = require('querystring');
let curl = url.parse("https://search.naver.com/search.naver?where=nexearch&sm=top_hty&fbm=1&ie=utf8&query=노드제이에스");

console.log('###주소문자열 파싱한 URL객체###');
console.dir(curl);

let urlArray = url.format(curl);
console.log('URL객체로 생성된 주소 문자열: %s', urlArray);

//요청파라미터 쪼개기
let param = querystring.parse(curl.query);
console.log('원본 파라미터 : %s',querystring.stringify(param));
console.log('요청 파라미터 Query: %s',param.query);
