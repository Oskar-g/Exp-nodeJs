const { area, circunference } = require('./circle');
const Square = require('./square');
const { EventEmitter } = require('events');
class MyEmiter extends EventEmitter {};
const myEmmiter = new MyEmiter()

let radio = 1234;
console.log(`Area del circulo con radio ${radio}: ${area(radio)}`);
console.log(`Circunferencia del circulo con radio ${radio}: ${circunference(radio)}`);

let c = new Square(10);
const ev = (area) => console.log('Evento emitido', area);

myEmmiter.on('event', ev)
const interval = setInterval(
    () => {
        console.log(c.area());
        myEmmiter.emit('event', c.area());
        c.width++;
    }, 100
);
setTimeout(() => console.log('yep'), 500);
setTimeout(() => clearInterval(interval), 1000);
setImmediate(() => console.log('inmediate1'));
setImmediate(() => console.log('inmediate2'));
console.log('fin');