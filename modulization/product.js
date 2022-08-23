//속성 저장
// exports.getProduct = function(){
//     return {id:'iPhone13', name:'아이폰13'};
// }

// exports.group = {id:'SmartPhone',name:'스마트폰'};


//객체저장
// exports ={
//     getProduct : function(){
//         return { id:'iPhone14'
//                , name:'아이폰14'};
//     },
//     group : {
//           id:'SmartPhone'
//         , name :'스마트폰'
//     }
// }

//module.exports사용
// var product ={
//     getProduct : function(){
//         return { id:'iPhone14'
//                , name:'아이폰14'};
//     },
//     group : {
//           id:'SmartPhone'
//         , name :'스마트폰'
//     }
// }

// module.exports = product;

//함수 할당
module.exports =  function() {
    return{id:'iPhone14', price:'1,000,000'};
};
