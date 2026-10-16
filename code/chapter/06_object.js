function speak(line) {
  console.log(`El conejo ${this.type} dice '${line}'`);
}
var conejoBlanco = {type: "blanco", speak};
var conejoHambriento = {type: "hambriento", speak};


var protoRabbit = {
  speak(line) {
    console.log(`El conejo ${this.type} dice '${line}'`);
  }
};
var blackRabbit = Object.create(protoRabbit);
blackRabbit.type = "negro";

var Rabbit = class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`El conejo ${this.type} dice '${line}'`);
  }
}

var killerRabbit = new Rabbit("asesino");

Rabbit.prototype.toString = function() {
  return `un conejo ${this.type}`;
};

var longitud = Symbol("longitud");
Array.prototype[longitud] = 0;

console.log([1, 2].length);
console.log([1, 2][longitud]);

var List = class List {
  constructor(value, rest) {
    this.value = value;
    this.rest = rest;
  }

  get length() {
    return 1 + (this.rest ? this.rest.length : 0);
  }

  static fromArray(array) {
    let result = null;
    for (let i = array.length - 1; i >= 0; i--) {
      result = new this(array[i], result);
    }
    return result;
  }
}

var ListIterator = class ListIterator {
  constructor(list) {
    this.list = list;
  }

  next() {
    if (this.list == null) {
      return { done: true };
    }
    let value = this.list.value;
    this.list = this.list.rest;
    return { value, done: false };
  }
}

List.prototype[Symbol.iterator] = function() {
  return new ListIterator(this);
};

var LengthList = class LengthList extends List {
  #length;

  constructor(valor, rest) {
    super(valor, rest);
    this.#length = super.length;
  }

  get length() {
    return this.#length;
  }
}

console.log(LengthList.fromArray([1, 2, 3]).length);

