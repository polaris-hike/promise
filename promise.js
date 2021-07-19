const PENDING = 'PENDING';
const FULFILLED = 'FULFILLED';
const REJECTED = 'REJECTED';

function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chain cycle detected for promise'))
  }

  if ((typeof x === 'object' && x !== null) || (typeof x === 'function')) {
    let called = false;
    try {
      const then = x.then;
      if (typeof then === 'function') {
        then.call(x,y=>{
          if (called) return;
          called = true;
          resolvePromise(promise2, y, resolve, reject)
        },r=>{
          if (called) return;
          called = true;
          reject(r)
        });
      } else {
        resolve(x )
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e)
    }
  } else {
      resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = PENDING;
    this.value = undefined;
    this.error = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (value instanceof Promise) {
        return value.then(resolve,reject)
      }
      if (this.status === PENDING) {
        this.status = FULFILLED;
        this.value = value;
        this.onResolvedCallbacks.forEach(fn => fn());
      }
    };

    const reject = (error) => {
      if (this.status === PENDING) {
        this.status = REJECTED;
        this.error = error;
        this.onRejectedCallbacks.forEach(fn => fn());
      }
    };

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v=>v
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
      throw err
    }
    const promise2 = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const value = onFulfilled(this.value);
            resolvePromise(promise2, value, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const value = onRejected(this.error);
            resolvePromise(promise2, value, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const value = onFulfilled(this.value);
              resolvePromise(promise2, value, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const value = onRejected(this.error);
              resolvePromise(promise2, value, resolve, reject);
            } catch (e) {
              reject(e);
            }
          });
        });
      }
    });
    return promise2;
  }

  static resolve(value) {
    return new Promise((resolve,reject) => {
      resolve(value)
    })
  }

  static reject(value) {
    return new Promise((resolve,reject) => {
      reject(value)
    })
  }

  static all(promises) {

    return new Promise((resolve,reject) => {
      const result = [];
      let times = 0;
      const processSuccess = (index,value) => {
        result[index] = value;
        if (++times === promises.length) {
          resolve(result)
        }
      }
      for (let i = 0;i < promises.length; i++) {
        const p = promises[i]
        if (p.then && typeof p.then === 'function') {
          p.then(res=>{
            processSuccess(i,res)
          },reject)
        } else {
          processSuccess(i,p)
        }
      }
    })
  }

  static race(promises) {
     return new Promise((resolve,reject) => {
      for (let i = 0;i < promises.length; i++) {
        const p = promises[i]
        if (p.then && typeof p.then === 'function') {
          p.then(resolve,reject)
        } else {
          resolve(p)
        }
      }
    })
  }

  finally(cb) {
    return this.then(data=> {
      return Promise.resolve(cb()).then(() => data);
    },err => {
      return Promise.resolve(cb()).then(() => {throw err})
    })
  }

  catch(errorFn) {
    return this.then(null,errorFn)
  }
}


Promise.deferred = function() {
  const dfd = {};
  dfd.promise = new Promise((resolve,reject)=> {
    dfd.resolve = resolve;
    dfd.reject = reject;
  })
  return dfd;
}

module.exports = Promise;

// 给promise 加上abort 错误中断
const wrap = (p1) => {
  let abort;
  const p = new Promise((resolve,reject) => {
    abort = reject
  })
  const p2 = Promise.race([p,p1])
  p2.abort = abort;
  return p2;
}

function promisify(fn) {
  return function (...args) {
    return new Promise((resolve,reject) => {
      fn(...args,(err,data) => {
        if (err) return reject(err);
        resolve(data)
      })
    })
  }
}



// const p1 = new Promise((resolve,reject) => {
//   setTimeout(() => {
//       reject('失败')
//   }, 3000)
// })
//
//
// const p2 = wrap(p1);
// p2.then((data) => {
//   console.log(data);
// }, err => {
//   console.log(err);
// })
//
//
// setTimeout(() => {
//   p2.abort('超过一秒啦');
// },1000)

