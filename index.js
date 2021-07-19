const fs = require('fs');

const events = {
  _events: [],
  on(fn) {
    this._events.push(fn)
  },
  emit(data) {
    this._events.forEach((fn) => {
      fn(data)
    })
  }
}

const arr = [];

events.on(() => {
  console.log('chufa');
})

events.on(() => {
  if (arr.length === 2) {
    console.log('over',arr);
  }
})


fs.readFile('./a.txt','UTF8',function (err,data) {
  arr.push(data)
  events.emit()
})

fs.readFile('./b.txt','UTF8',function (err,data) {
  arr.push(data)
  events.emit()
})
