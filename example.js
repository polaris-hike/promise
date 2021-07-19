const Promise = require('./promise')
// const promise = new Promise((resolve,reject) => {
//     resolve('success')
// }).then(res=>{
//   return new Promise((resolve,reject) => {
//     setTimeout(() => {
//       resolve(new Promise((resolve1,reject1) => {
//           setTimeout(() => {
//             resolve1('ok')
//           }, 1000)
//       }))
//     }, 1000)
//   })
// },err => {
//   return new Promise((resolve,reject) => {
//     setTimeout(() => {
//       reject('error')
//     }, 1000)
//   })
// })
//
// promise.then(res=> {
//   console.log(res);
// },err=>{
//   console.log(err);
// })

// new Promise((resolve,reject) => {
//   resolve(new Promise((resolve1,reject1) => {
//     resolve1(200)
//   }))
// }).then(res=>{
//   console.log(res);
// })

// Promise.reject(new Promise((resolve,reject) => {
//   setTimeout(() => {
//     resolve(111)
//   },1000)
// })).then(res => {
//   console.log(res);
// }).catch(err=>{
//   console.log('err');
//   console.log(err);
// })

// Promise.all([1,2,3,new Promise((resolve,reject) => {
//   setTimeout(() => {
//     reject(4)
//   }, 1000)
// })]).then(res => {
//   console.log(res);
// },err => {
//   console.log(err);
// })

new Promise((resolve,reject) => {
  setTimeout(() => {
    reject('err')
  },3000)
}).finally(() => {
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      reject(1100)
    },1000)
  })
 }).then(res => {
  console.log(res);
},err => {
  console.log(err);
})