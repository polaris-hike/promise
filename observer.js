class Subject {
  constructor(name) {
    this.name = name;
    this.state = '';
    this.observer = []
  }
  setState(newState) {
    this.state = newState;
    this.observer.forEach(ob=>ob.update(this.name,newState))
  }
  attach(ob){
    this.observer.push(ob)
  }
}

class Observer {
  constructor(name) {
    this.name = name
  }
  update(name,state) {
    console.log(`${this.name}: ${name}当前${state}`);
  }
}

const s = new Subject('小宝宝');
const o1 = new Observer('爸爸')
const o2 = new Observer('妈妈')
s.attach(o1)
s.attach(o2)


s.setState('不开心了')
s.setState('开心了')
