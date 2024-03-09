var chapterData = [
  {
    "number": 0,
    "id": "00_intro",
    "title": "Introduction",
    "start_code": "console.log(sum(range(1, 10)));\n",
    "exercises": [],
    "include": [
      "code/intro.js"
    ]
  },
  {
    "number": 1,
    "id": "01_values",
    "title": "Values, Types, and Operators",
    "start_code": "",
    "exercises": [],
    "include": null
  },
  {
    "number": 2,
    "id": "02_program_structure",
    "title": "Program Structure",
    "start_code": "",
    "exercises": [
      {
        "name": "Looping a triangle",
        "file": "code/solutions/02_1_looping_a_triangle.js",
        "number": 1,
        "type": "js",
        "code": "// Your code here.",
        "solution": "for (let line = \"#\"; line.length < 8; line += \"#\")\n  console.log(line);"
      },
      {
        "name": "FizzBuzz",
        "file": "code/solutions/02_2_fizzbuzz.js",
        "number": 2,
        "type": "js",
        "code": "// Your code here.",
        "solution": "for (let n = 1; n <= 100; n++) {\n  let output = \"\";\n  if (n % 3 == 0) output += \"Fizz\";\n  if (n % 5 == 0) output += \"Buzz\";\n  console.log(output || n);\n}"
      },
      {
        "name": "Chessboard",
        "file": "code/solutions/02_3_chessboard.js",
        "number": 3,
        "type": "js",
        "code": "// Your code here.",
        "solution": "let size = 8;\n\nlet board = \"\";\n\nfor (let y = 0; y < size; y++) {\n  for (let x = 0; x < size; x++) {\n    if ((x + y) % 2 == 0) {\n      board += \" \";\n    } else {\n      board += \"#\";\n    }\n  }\n  board += \"\\n\";\n}\n\nconsole.log(board);"
      }
    ],
    "include": null
  },
  {
    "number": 3,
    "id": "03_functions",
    "title": "Functions",
    "start_code": "",
    "exercises": [
      {
        "name": "Minimum",
        "file": "code/solutions/03_1_minimum.js",
        "number": 1,
        "type": "js",
        "code": "// Your code here.\n\nconsole.log(min(0, 10));\n// → 0\nconsole.log(min(0, -10));\n// → -10",
        "solution": "function min(a, b) {\n  if (a < b) return a;\n  else return b;\n}\n\nconsole.log(min(0, 10));\n// → 0\nconsole.log(min(0, -10));\n// → -10"
      },
      {
        "name": "Recursion",
        "file": "code/solutions/03_2_recursion.js",
        "number": 2,
        "type": "js",
        "code": "// Your code here.\n\nconsole.log(isEven(50));\n// → true\nconsole.log(isEven(75));\n// → false\nconsole.log(isEven(-1));\n// → ??",
        "solution": "function isEven(n) {\n  if (n == 0) return true;\n  else if (n == 1) return false;\n  else if (n < 0) return isEven(-n);\n  else return isEven(n - 2);\n}\n\nconsole.log(isEven(50));\n// → true\nconsole.log(isEven(75));\n// → false\nconsole.log(isEven(-1));\n// → false"
      },
      {
        "name": "Bean counting",
        "file": "code/solutions/03_3_bean_counting.js",
        "number": 3,
        "type": "js",
        "code": "// Your code here.\n\nconsole.log(countBs(\"BOB\"));\n// → 2\nconsole.log(countChar(\"kakkerlak\", \"k\"));\n// → 4",
        "solution": "function countChar(string, ch) {\n  let counted = 0;\n  for (let i = 0; i < string.length; i++) {\n    if (string[i] == ch) {\n      counted += 1;\n    }\n  }\n  return counted;\n}\n\nfunction countBs(string) {\n  return countChar(string, \"B\");\n}\n\nconsole.log(countBs(\"BBC\"));\n// → 2\nconsole.log(countChar(\"kakkerlak\", \"k\"));\n// → 4"
      }
    ],
    "include": null
  },
  {
    "number": 4,
    "id": "04_data",
    "title": "Data Structures: Objects and Arrays",
    "start_code": "for (let event of journalEvents(JOURNAL)) {\n  let correlation = phi(tableFor(event, JOURNAL));\n  if (correlation > 0.1 || correlation < -0.1) {\n    console.log(event + \":\", correlation);\n  }\n}\n// → brushed teeth: -0.3805211953\n// → work:          -0.1371988681\n// → reading:        0.1106828054\n",
    "exercises": [
      {
        "name": "The sum of a range",
        "file": "code/solutions/04_1_the_sum_of_a_range.js",
        "number": 1,
        "type": "js",
        "code": "// Your code here.\n\nconsole.log(range(1, 10));\n// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nconsole.log(range(5, 2, -1));\n// → [5, 4, 3, 2]\nconsole.log(sum(range(1, 10)));\n// → 55",
        "solution": "function range(start, end, step = start < end ? 1 : -1) {\n  let array = [];\n\n  if (step > 0) {\n    for (let i = start; i <= end; i += step) array.push(i);\n  } else {\n    for (let i = start; i >= end; i += step) array.push(i);\n  }\n  return array;\n}\n\nfunction sum(array) {\n  let total = 0;\n  for (let value of array) {\n    total += value;\n  }\n  return total;\n}\n\nconsole.log(range(1, 10))\n// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nconsole.log(range(5, 2, -1));\n// → [5, 4, 3, 2]\nconsole.log(sum(range(1, 10)));\n// → 55"
      },
      {
        "name": "Reversing an array",
        "file": "code/solutions/04_2_reversing_an_array.js",
        "number": 2,
        "type": "js",
        "code": "// Your code here.\n\nlet myArray = [\"A\", \"B\", \"C\"];\nconsole.log(reverseArray(myArray));\n// → [\"C\", \"B\", \"A\"];\nconsole.log(myArray);\n// → [\"A\", \"B\", \"C\"];\nlet arrayValue = [1, 2, 3, 4, 5];\nreverseArrayInPlace(arrayValue);\nconsole.log(arrayValue);\n// → [5, 4, 3, 2, 1]",
        "solution": "function reverseArray(array) {\n  let output = [];\n  for (let i = array.length - 1; i >= 0; i--) {\n    output.push(array[i]);\n  }\n  return output;\n}\n\nfunction reverseArrayInPlace(array) {\n  for (let i = 0; i < Math.floor(array.length / 2); i++) {\n    let old = array[i];\n    array[i] = array[array.length - 1 - i];\n    array[array.length - 1 - i] = old;\n  }\n  return array;\n}\n\nconsole.log(reverseArray([\"A\", \"B\", \"C\"]));\n// → [\"C\", \"B\", \"A\"];\nlet arrayValue = [1, 2, 3, 4, 5];\nreverseArrayInPlace(arrayValue);\nconsole.log(arrayValue);\n// → [5, 4, 3, 2, 1]"
      },
      {
        "name": "A list",
        "file": "code/solutions/04_3_a_list.js",
        "number": 3,
        "type": "js",
        "code": "// Your code here.\n\nconsole.log(arrayToList([10, 20]));\n// → {value: 10, rest: {value: 20, rest: null}}\nconsole.log(listToArray(arrayToList([10, 20, 30])));\n// → [10, 20, 30]\nconsole.log(prepend(10, prepend(20, null)));\n// → {value: 10, rest: {value: 20, rest: null}}\nconsole.log(nth(arrayToList([10, 20, 30]), 1));\n// → 20",
        "solution": "function arrayToList(array) {\n  let list = null;\n  for (let i = array.length - 1; i >= 0; i--) {\n    list = {value: array[i], rest: list};\n  }\n  return list;\n}\n\nfunction listToArray(list) {\n  let array = [];\n  for (let node = list; node; node = node.rest) {\n    array.push(node.value);\n  }\n  return array;\n}\n\nfunction prepend(value, list) {\n  return {value, rest: list};\n}\n\nfunction nth(list, n) {\n  if (!list) return undefined;\n  else if (n == 0) return list.value;\n  else return nth(list.rest, n - 1);\n}\n\nconsole.log(arrayToList([10, 20]));\n// → {value: 10, rest: {value: 20, rest: null}}\nconsole.log(listToArray(arrayToList([10, 20, 30])));\n// → [10, 20, 30]\nconsole.log(prepend(10, prepend(20, null)));\n// → {value: 10, rest: {value: 20, rest: null}}\nconsole.log(nth(arrayToList([10, 20, 30]), 1));\n// → 20"
      },
      {
        "name": "Deep comparison",
        "file": "code/solutions/04_4_deep_comparison.js",
        "number": 4,
        "type": "js",
        "code": "// Your code here.\n\nlet obj = {here: {is: \"an\"}, object: 2};\nconsole.log(deepEqual(obj, obj));\n// → true\nconsole.log(deepEqual(obj, {here: 1, object: 2}));\n// → false\nconsole.log(deepEqual(obj, {here: {is: \"an\"}, object: 2}));\n// → true",
        "solution": "function deepEqual(a, b) {\n  if (a === b) return true;\n  \n  if (a == null || typeof a != \"object\" ||\n      b == null || typeof b != \"object\") return false;\n\n  let keysA = Object.keys(a), keysB = Object.keys(b);\n\n  if (keysA.length != keysB.length) return false;\n\n  for (let key of keysA) {\n    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) return false;\n  }\n\n  return true;\n}\n\nlet obj = {here: {is: \"an\"}, object: 2};\nconsole.log(deepEqual(obj, obj));\n// → true\nconsole.log(deepEqual(obj, {here: 1, object: 2}));\n// → false\nconsole.log(deepEqual(obj, {here: {is: \"an\"}, object: 2}));\n// → true"
      }
    ],
    "include": [
      "code/journal.js",
      "code/chapter/04_data.js"
    ],
    "links": [
      "code/chapter/04_data.zip"
    ]
  },
  {
    "number": 5,
    "id": "05_higher_order",
    "title": "Higher-Order Functions",
    "start_code": "function textScripts(text) {\n  let scripts = countBy(text, char => {\n    let script = characterScript(char.codePointAt(0));\n    return script ? script.name : \"none\";\n  }).filter(({name}) => name != \"none\");\n\n  let total = scripts.reduce((n, {count}) => n + count, 0);\n  if (total == 0) return \"No scripts found\";\n\n  return scripts.map(({name, count}) => {\n    return `${Math.round(count * 100 / total)}% ${name}`;\n  }).join(\", \");\n}\n\nconsole.log(textScripts('英国的狗说\"woof\", 俄罗斯的狗说\"тяв\"'));\n",
    "exercises": [
      {
        "name": "Flattening",
        "file": "code/solutions/05_1_flattening.js",
        "number": 1,
        "type": "js",
        "code": "let arrays = [[1, 2, 3], [4, 5], [6]];\n// Your code here.\n// → [1, 2, 3, 4, 5, 6]",
        "solution": "let arrays = [[1, 2, 3], [4, 5], [6]];\n\nconsole.log(arrays.reduce((flat, current) => flat.concat(current), []));\n// → [1, 2, 3, 4, 5, 6]"
      },
      {
        "name": "Your own loop",
        "file": "code/solutions/05_2_your_own_loop.js",
        "number": 2,
        "type": "js",
        "code": "// Your code here.\n\nloop(3, n => n > 0, n => n - 1, console.log);\n// → 3\n// → 2\n// → 1",
        "solution": "function loop(start, test, update, body) {\n  for (let value = start; test(value); value = update(value)) {\n    body(value);\n  }\n}\n\nloop(3, n => n > 0, n => n - 1, console.log);\n// → 3\n// → 2\n// → 1"
      },
      {
        "name": "Everything",
        "file": "code/solutions/05_3_everything.js",
        "number": 3,
        "type": "js",
        "code": "function every(array, test) {\n  // Your code here.\n}\n\nconsole.log(every([1, 3, 5], n => n < 10));\n// → true\nconsole.log(every([2, 4, 16], n => n < 10));\n// → false\nconsole.log(every([], n => n < 10));\n// → true",
        "solution": "function every(array, predicate) {\n  for (let element of array) {\n    if (!predicate(element)) return false;\n  }\n  return true;\n}\n\nfunction every2(array, predicate) {\n  return !array.some(element => !predicate(element));\n}\n\nconsole.log(every([1, 3, 5], n => n < 10));\n// → true\nconsole.log(every([2, 4, 16], n => n < 10));\n// → false\nconsole.log(every([], n => n < 10));\n// → true"
      },
      {
        "name": "Dominant writing direction",
        "file": "code/solutions/05_4_dominant_writing_direction.js",
        "number": 4,
        "type": "js",
        "code": "function dominantDirection(text) {\n  // Your code here.\n}\n\nconsole.log(dominantDirection(\"Hello!\"));\n// → ltr\nconsole.log(dominantDirection(\"Hey, مساء الخير\"));\n// → rtl",
        "solution": "function dominantDirection(text) {\n  let counted = countBy(text, char => {\n    let script = characterScript(char.codePointAt(0));\n    return script ? script.direction : \"none\";\n  }).filter(({name}) => name != \"none\");\n\n  if (counted.length == 0) return \"ltr\";\n\n  return counted.reduce((a, b) => a.count > b.count ? a : b).name;\n}\n\nconsole.log(dominantDirection(\"Hello!\"));\n// → ltr\nconsole.log(dominantDirection(\"Hey, مساء الخير\"));\n// → rtl"
      }
    ],
    "include": [
      "code/scripts.js",
      "code/chapter/05_higher_order.js",
      "code/intro.js"
    ],
    "links": [
      "code/chapter/05_higher_order.zip"
    ]
  },
  {
    "number": 6,
    "id": "06_object",
    "title": "The Secret Life of Objects",
    "start_code": "class Temperature {\n  constructor(celsius) {\n    this.celsius = celsius;\n  }\n  get fahrenheit() {\n    return this.celsius * 1.8 + 32;\n  }\n  set fahrenheit(value) {\n    this.celsius = (value - 32) / 1.8;\n  }\n\n  static fromFahrenheit(value) {\n    return new Temperature((value - 32) / 1.8);\n  }\n}\n\nlet temp = new Temperature(22);\nconsole.log(temp.fahrenheit);\ntemp.fahrenheit = 86;\nconsole.log(temp.celsius);\n",
    "exercises": [
      {
        "name": "A vector type",
        "file": "code/solutions/06_1_a_vector_type.js",
        "number": 1,
        "type": "js",
        "code": "// Your code here.\n\nconsole.log(new Vec(1, 2).plus(new Vec(2, 3)));\n// → Vec{x: 3, y: 5}\nconsole.log(new Vec(1, 2).minus(new Vec(2, 3)));\n// → Vec{x: -1, y: -1}\nconsole.log(new Vec(3, 4).length);\n// → 5",
        "solution": "class Vec {\n  constructor(x, y) {\n    this.x = x;\n    this.y = y;\n  }\n\n  plus(other) {\n    return new Vec(this.x + other.x, this.y + other.y);\n  }\n\n  minus(other) {\n    return new Vec(this.x - other.x, this.y - other.y);\n  }\n\n  get length() {\n    return Math.sqrt(this.x * this.x + this.y * this.y);\n  }\n}\n\nconsole.log(new Vec(1, 2).plus(new Vec(2, 3)));\n// → Vec{x: 3, y: 5}\nconsole.log(new Vec(1, 2).minus(new Vec(2, 3)));\n// → Vec{x: -1, y: -1}\nconsole.log(new Vec(3, 4).length);\n// → 5"
      },
      {
        "name": "Groups",
        "file": "code/solutions/06_2_groups.js",
        "number": 2,
        "type": "js",
        "code": "class Group {\n  // Your code here.\n}\n\nlet group = Group.from([10, 20]);\nconsole.log(group.has(10));\n// → true\nconsole.log(group.has(30));\n// → false\ngroup.add(10);\ngroup.delete(10);\nconsole.log(group.has(10));\n// → false",
        "solution": "class Group {\n  #members = [];\n\n  add(value) {\n    if (!this.has(value)) {\n      this.#members.push(value);\n    }\n  }\n\n  delete(value) {\n    this.#members = this.#members.filter(v => v !== value);\n  }\n\n  has(value) {\n    return this.#members.includes(value);\n  }\n\n  static from(collection) {\n    let group = new Group;\n    for (let value of collection) {\n      group.add(value);\n    }\n    return group;\n  }\n}\n\nlet group = Group.from([10, 20]);\nconsole.log(group.has(10));\n// → true\nconsole.log(group.has(30));\n// → false\ngroup.add(10);\ngroup.delete(10);\nconsole.log(group.has(10));\n// → false"
      },
      {
        "name": "Iterable groups",
        "file": "code/solutions/06_3_iterable_groups.js",
        "number": 3,
        "type": "js",
        "code": "// Your code here (and the code from the previous exercise)\n\nfor (let value of Group.from([\"a\", \"b\", \"c\"])) {\n  console.log(value);\n}\n// → a\n// → b\n// → c",
        "solution": "class Group {\n  #members = [];\n\n  add(value) {\n    if (!this.has(value)) {\n      this.#members.push(value);\n    }\n  }\n\n  delete(value) {\n    this.#members = this.#members.filter(v => v !== value);\n  }\n\n  has(value) {\n    return this.#members.includes(value);\n  }\n\n  static from(collection) {\n    let group = new Group;\n    for (let value of collection) {\n      group.add(value);\n    }\n    return group;\n  }\n\n  [Symbol.iterator]() {\n    return new GroupIterator(this.#members);\n  }\n}\n\nclass GroupIterator {\n  constructor(members) {\n    this.#members = members;\n    this.#position = 0;\n  }\n\n  next() {\n    if (this.#position >= this.#members.length) {\n      return {done: true};\n    } else {\n      let result = {value: this.#members[this.#position],\n                    done: false};\n      this.#position++;\n      return result;\n    }\n  }\n}\n\nfor (let value of Group.from([\"a\", \"b\", \"c\"])) {\n  console.log(value);\n}\n// → a\n// → b\n// → c"
      },
      {
        "name": "Borrowing a method [3rd ed]",
        "file": "code/solutions/06_4_borrowing_a_method.js",
        "number": "4[3]",
        "type": "js",
        "code": "let map = {one: true, two: true, hasOwnProperty: true};\n\n// Fix this call\nconsole.log(map.hasOwnProperty(\"one\"));\n// → true",
        "solution": "let map = {one: true, two: true, hasOwnProperty: true};\n\nconsole.log(Object.prototype.hasOwnProperty.call(map, \"one\"));\n// → true"
      }
    ],
    "include": [
      "code/chapter/06_object.js"
    ],
    "links": [
      "code/chapter/06_object.zip"
    ]
  },
  {
    "number": 7,
    "id": "07_robot",
    "title": "Project: A Robot",
    "start_code": "runRobotAnimation(VillageState.random(),\n                  goalOrientedRobot, []);\n",
    "exercises": [
      {
        "name": "Measuring a robot",
        "file": "code/solutions/07_1_measuring_a_robot.js",
        "number": 1,
        "type": "js",
        "code": "function compareRobots(robot1, memory1, robot2, memory2) {\n  // Your code here\n}\n\ncompareRobots(routeRobot, [], goalOrientedRobot, []);",
        "solution": "function countSteps(state, robot, memory) {\n  for (let steps = 0;; steps++) {\n    if (state.parcels.length == 0) return steps;\n    let action = robot(state, memory);\n    state = state.move(action.direction);\n    memory = action.memory;\n  }\n}\n\nfunction compareRobots(robot1, memory1, robot2, memory2) {\n  let total1 = 0, total2 = 0;\n  for (let i = 0; i < 100; i++) {\n    let state = VillageState.random();\n    total1 += countSteps(state, robot1, memory1);\n    total2 += countSteps(state, robot2, memory2);\n  }\n  console.log(`Robot 1 needed ${total1 / 100} steps per task`)\n  console.log(`Robot 2 needed ${total2 / 100}`)\n}\n\ncompareRobots(routeRobot, [], goalOrientedRobot, []);"
      },
      {
        "name": "Robot efficiency",
        "file": "code/solutions/07_2_robot_efficiency.js",
        "number": 2,
        "type": "js",
        "code": "// Your code here\n\nrunRobotAnimation(VillageState.random(), yourRobot, memory);",
        "solution": "function lazyRobot({place, parcels}, route) {\n  if (route.length == 0) {\n    // Describe a route for every parcel\n    let routes = parcels.map(parcel => {\n      if (parcel.place != place) {\n        return {route: findRoute(roadGraph, place, parcel.place),\n                pickUp: true};\n      } else {\n        return {route: findRoute(roadGraph, place, parcel.address),\n                pickUp: false};\n      }\n    });\n\n    // This determines the precedence a route gets when choosing.\n    // Route length counts negatively, routes that pick up a package\n    // get a small bonus.\n    function score({route, pickUp}) {\n      return (pickUp ? 0.5 : 0) - route.length;\n    }\n    route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;\n  }\n\n  return {direction: route[0], memory: route.slice(1)};\n}\n\nrunRobotAnimation(VillageState.random(), lazyRobot, []);"
      },
      {
        "name": "Persistent group",
        "file": "code/solutions/07_3_persistent_group.js",
        "number": 3,
        "type": "js",
        "code": "class PGroup {\n  // Your code here\n}\n\nlet a = PGroup.empty.add(\"a\");\nlet ab = a.add(\"b\");\nlet b = ab.delete(\"a\");\n\nconsole.log(b.has(\"b\"));\n// → true\nconsole.log(a.has(\"b\"));\n// → false\nconsole.log(b.has(\"a\"));\n// → false",
        "solution": "class PGroup {\n  #members;\n  constructor(members) {\n    this.#members = members;\n  }\n\n  add(value) {\n    if (this.has(value)) return this;\n    return new PGroup(this.#members.concat([value]));\n  }\n\n  delete(value) {\n    if (!this.has(value)) return this;\n    return new PGroup(this.#members.filter(m => m !== value));\n  }\n\n  has(value) {\n    return this.#members.includes(value);\n  }\n\n  static empty = new PGroup([]);\n}\n\nlet a = PGroup.empty.add(\"a\");\nlet ab = a.add(\"b\");\nlet b = ab.delete(\"a\");\n\nconsole.log(b.has(\"b\"));\n// → true\nconsole.log(a.has(\"b\"));\n// → false\nconsole.log(b.has(\"a\"));\n// → false"
      }
    ],
    "include": [
      "code/chapter/07_robot.js",
      "code/animatevillage.js"
    ]
  },
  {
    "number": 8,
    "id": "08_error",
    "title": "Bugs and Errors",
    "start_code": "",
    "exercises": [
      {
        "name": "Retry",
        "file": "code/solutions/08_1_retry.js",
        "number": 1,
        "type": "js",
        "code": "class MultiplicatorUnitFailure extends Error {}\n\nfunction primitiveMultiply(a, b) {\n  if (Math.random() < 0.2) {\n    return a * b;\n  } else {\n    throw new MultiplicatorUnitFailure(\"Klunk\");\n  }\n}\n\nfunction reliableMultiply(a, b) {\n  // Your code here.\n}\n\nconsole.log(reliableMultiply(8, 8));\n// → 64",
        "solution": "class MultiplicatorUnitFailure extends Error {}\n\nfunction primitiveMultiply(a, b) {\n  if (Math.random() < 0.2) {\n    return a * b;\n  } else {\n    throw new MultiplicatorUnitFailure(\"Klunk\");\n  }\n}\n\nfunction reliableMultiply(a, b) {\n  for (;;) {\n    try {\n      return primitiveMultiply(a, b);\n    } catch (e) {\n      if (!(e instanceof MultiplicatorUnitFailure))\n        throw e;\n    }\n  }\n}\n\nconsole.log(reliableMultiply(8, 8));\n// → 64"
      },
      {
        "name": "The locked box",
        "file": "code/solutions/08_2_the_locked_box.js",
        "number": 2,
        "type": "js",
        "code": "const box = new class {\n  locked = true;\n  #content = [];\n\n  unlock() { this.locked = false; }\n  lock() { this.locked = true;  }\n  get content() {\n    if (this.locked) throw new Error(\"Locked!\");\n    return this.#content;\n  }\n};\n\nfunction withBoxUnlocked(body) {\n  // Your code here.\n}\n\nwithBoxUnlocked(() => {\n  box.content.push(\"gold piece\");\n});\n\ntry {\n  withBoxUnlocked(() => {\n    throw new Error(\"Pirates on the horizon! Abort!\");\n  });\n} catch (e) {\n  console.log(\"Error raised: \" + e);\n}\nconsole.log(box.locked);\n// → true",
        "solution": "const box = new class {\n  locked = true;\n  #content = [];\n\n  unlock() { this.locked = false; }\n  lock() { this.locked = true;  }\n  get content() {\n    if (this.locked) throw new Error(\"Locked!\");\n    return this.#content;\n  }\n};\n\nfunction withBoxUnlocked(body) {\n  let locked = box.locked;\n  if (locked) box.unlock();\n  try {\n    return body();\n  } finally {\n    if (locked) box.lock();\n  }\n}\n\nwithBoxUnlocked(() => {\n  box.content.push(\"gold piece\");\n});\n\ntry {\n  withBoxUnlocked(() => {\n    throw new Error(\"Pirates on the horizon! Abort!\");\n  });\n} catch (e) {\n  console.log(\"Error raised:\", e);\n}\n\nconsole.log(box.locked);\n// → true"
      }
    ],
    "include": [
      "code/chapter/08_error.js"
    ]
  },
  {
    "number": 9,
    "id": "09_regexp",
    "title": "Regular Expressions",
    "start_code": "function parseINI(string) {\n  // Start with an object to hold the top-level fields\n  let result = {};\n  let section = result;\n  for (let line of string.split(/\\r?\\n/)) {\n    let match;\n    if (match = line.match(/^(\\w+)=(.*)$/)) {\n      section[match[1]] = match[2];\n    } else if (match = line.match(/^\\[(.*)\\]$/)) {\n      section = result[match[1]] = {};\n    } else if (!/^\\s*(;|$)/.test(line)) {\n      throw new Error(\"Line '\" + line + \"' is not valid.\");\n    }\n  };\n  return result;\n}\n\nconsole.log(parseINI(`\nname=Vasilis\n[address]\ncity=Tessaloniki`));\n",
    "exercises": [
      {
        "name": "Regexp golf",
        "file": "code/solutions/09_1_regexp_golf.js",
        "number": 1,
        "type": "js",
        "code": "// Fill in the regular expressions\n\nverify(/.../,\n       [\"my car\", \"bad cats\"],\n       [\"camper\", \"high art\"]);\n\nverify(/.../,\n       [\"pop culture\", \"mad props\"],\n       [\"plop\", \"prrrop\"]);\n\nverify(/.../,\n       [\"ferret\", \"ferry\", \"ferrari\"],\n       [\"ferrum\", \"transfer A\"]);\n\nverify(/.../,\n       [\"how delicious\", \"spacious room\"],\n       [\"ruinous\", \"consciousness\"]);\n\nverify(/.../,\n       [\"bad punctuation .\"],\n       [\"escape the period\"]);\n\nverify(/.../,\n       [\"Siebentausenddreihundertzweiundzwanzig\"],\n       [\"no\", \"three small words\"]);\n\nverify(/.../,\n       [\"red platypus\", \"wobbling nest\"],\n       [\"earth bed\", \"bedrøvet abe\", \"BEET\"]);\n\n\nfunction verify(regexp, yes, no) {\n  // Ignore unfinished exercises\n  if (regexp.source == \"...\") return;\n  for (let str of yes) if (!regexp.test(str)) {\n    console.log(`Failure to match '${str}'`);\n  }\n  for (let str of no) if (regexp.test(str)) {\n    console.log(`Unexpected match for '${str}'`);\n  }\n}",
        "solution": "// Fill in the regular expressions\n\nverify(/ca[rt]/,\n       [\"my car\", \"bad cats\"],\n       [\"camper\", \"high art\"]);\n\nverify(/pr?op/,\n       [\"pop culture\", \"mad props\"],\n       [\"plop\", \"prrrop\"]);\n\nverify(/ferr(et|y|ari)/,\n       [\"ferret\", \"ferry\", \"ferrari\"],\n       [\"ferrum\", \"transfer A\"]);\n\nverify(/ious($|\\P{L})/u,\n       [\"how delicious\", \"spacious room\"],\n       [\"ruinous\", \"consciousness\"]);\n\nverify(/\\s[.,:;]/,\n       [\"bad punctuation .\"],\n       [\"escape the dot\"]);\n\nverify(/\\p{L}{7}/u,\n       [\"Siebentausenddreihundertzweiundzwanzig\"],\n       [\"no\", \"three small words\"]);\n\nverify(/(^|\\P{L})[^\\P{L}e]+($|\\P{L})/i,\n       [\"red platypus\", \"wobbling nest\"],\n       [\"earth bed\", \"bedrøvet abe\", \"BEET\"]);\n\n\nfunction verify(regexp, yes, no) {\n  // Ignore unfinished exercises\n  if (regexp.source == \"...\") return;\n  for (let str of yes) if (!regexp.test(str)) {\n    console.log(`Failure to match '${str}'`);\n  }\n  for (let str of no) if (regexp.test(str)) {\n    console.log(`Unexpected match for '${str}'`);\n  }\n}"
      },
      {
        "name": "Quoting style",
        "file": "code/solutions/09_2_quoting_style.js",
        "number": 2,
        "type": "js",
        "code": "let text = \"'I'm the cook,' he said, 'it's my job.'\";\n// Change this call.\nconsole.log(text.replace(/A/g, \"B\"));\n// → \"I'm the cook,\" he said, \"it's my job.\"",
        "solution": "let text = \"'I'm the cook,' he said, 'it's my job.'\";\n\nconsole.log(text.replace(/(^|\\P{L})'|'(\\P{L}|$)/gu, '$1\"$2'));\n// → \"I'm the cook,\" he said, \"it's my job.\""
      },
      {
        "name": "Numbers again",
        "file": "code/solutions/09_3_numbers_again.js",
        "number": 3,
        "type": "js",
        "code": "// Fill in this regular expression.\nlet number = /^...$/;\n\n// Tests:\nfor (let str of [\"1\", \"-1\", \"+15\", \"1.55\", \".5\", \"5.\",\n                 \"1.3e2\", \"1E-4\", \"1e+12\"]) {\n  if (!number.test(str)) {\n    console.log(`Failed to match '${str}'`);\n  }\n}\nfor (let str of [\"1a\", \"+-1\", \"1.2.3\", \"1+1\", \"1e4.5\",\n                 \".5.\", \"1f5\", \".\"]) {\n  if (number.test(str)) {\n    console.log(`Incorrectly accepted '${str}'`);\n  }\n}",
        "solution": "// Fill in this regular expression.\nlet number = /^[+\\-]?(\\d+(\\.\\d*)?|\\.\\d+)([eE][+\\-]?\\d+)?$/;\n\n// Tests:\nfor (let str of [\"1\", \"-1\", \"+15\", \"1.55\", \".5\", \"5.\",\n                 \"1.3e2\", \"1E-4\", \"1e+12\"]) {\n  if (!number.test(str)) {\n    console.log(`Failed to match '${str}'`);\n  }\n}\nfor (let str of [\"1a\", \"+-1\", \"1.2.3\", \"1+1\", \"1e4.5\",\n                 \".5.\", \"1f5\", \".\"]) {\n  if (number.test(str)) {\n    console.log(`Incorrectly accepted '${str}'`);\n  }\n}"
      }
    ],
    "include": null
  },
  {
    "number": 10,
    "id": "10_modules",
    "title": "Modules",
    "start_code": "",
    "exercises": [
      {
        "name": "Roads module",
        "file": "code/solutions/10_2_roads_module.js",
        "number": 2,
        "type": "js",
        "code": "// Add dependencies and exports\n\nconst roads = [\n  \"Alice's House-Bob's House\",   \"Alice's House-Cabin\",\n  \"Alice's House-Post Office\",   \"Bob's House-Town Hall\",\n  \"Daria's House-Ernie's House\", \"Daria's House-Town Hall\",\n  \"Ernie's House-Grete's House\", \"Grete's House-Farm\",\n  \"Grete's House-Shop\",          \"Marketplace-Farm\",\n  \"Marketplace-Post Office\",     \"Marketplace-Shop\",\n  \"Marketplace-Town Hall\",       \"Shop-Town Hall\"\n];",
        "solution": "const {buildGraph} = require(\"./graph\");\n\nconst roads = [\n  \"Alice's House-Bob's House\",   \"Alice's House-Cabin\",\n  \"Alice's House-Post Office\",   \"Bob's House-Town Hall\",\n  \"Daria's House-Ernie's House\", \"Daria's House-Town Hall\",\n  \"Ernie's House-Grete's House\", \"Grete's House-Farm\",\n  \"Grete's House-Shop\",          \"Marketplace-Farm\",\n  \"Marketplace-Post Office\",     \"Marketplace-Shop\",\n  \"Marketplace-Town Hall\",       \"Shop-Town Hall\"\n];\n\nexports.roadGraph = buildGraph(roads.map(r => r.split(\"-\")));"
      }
    ],
    "include": [
      "code/packages_chapter_10.js",
      "code/chapter/07_robot.js"
    ]
  },
  {
    "number": 11,
    "id": "11_async",
    "title": "Asynchronous Programming",
    "start_code": "let video = new VideoPlayer(clipImages, 100);\nvideo.play().catch(e => {\n  console.log(\"Playback failed: \" + e);\n});\nsetTimeout(() => video.stop(), 15000);\n",
    "exercises": [
      {
        "name": "Quiet Times",
        "file": "code/solutions/11_1_quiet_times.js",
        "number": 1,
        "type": "js",
        "code": "async function activityTable(day) {\n  let logFileList = await textFile(\"camera_logs.txt\");\n  // Your code here\n}\n\nactivityTable(1)\n  .then(table => console.log(activityGraph(table)));",
        "solution": "async function activityTable(day) {\n  let table = [];\n  for (let i = 0; i < 24; i++) table[i] = 0;\n\n  let logFileList = await textFile(\"camera_logs.txt\");\n  for (let filename of logFileList.split(\"\\n\")) {\n    let log = await textFile(filename);\n    for (let timestamp of log.split(\"\\n\")) {\n      let date = new Date(Number(timestamp));\n      if (date.getDay() == day) {\n        table[date.getHours()]++;\n      }\n    }\n  }\n\n  return table;\n}\n\nactivityTable(1)\n  .then(table => console.log(activityGraph(table)));"
      },
      {
        "name": "Real Promises",
        "file": "code/solutions/11_2_real_promises.js",
        "number": 2,
        "type": "js",
        "code": "function activityTable(day) {\n  // Your code here\n}\n\nactivityTable(6)\n  .then(table => console.log(activityGraph(table)));",
        "solution": "function activityTable(day) {\n  let table = [];\n  for (let i = 0; i < 24; i++) table[i] = 0;\n\n  return textFile(\"camera_logs.txt\").then(files => {\n    return Promise.all(files.split(\"\\n\").map(name => {\n      return textFile(name).then(log => {\n        for (let timestamp of log.split(\"\\n\")) {\n          let date = new Date(Number(timestamp));\n          if (date.getDay() == day) {\n            table[date.getHours()]++;\n          }\n        }\n      });\n    }));\n  }).then(() => table);\n}\n\nactivityTable(6)\n  .then(table => console.log(activityGraph(table)));"
      },
      {
        "name": "Building Promise.all",
        "file": "code/solutions/11_3_building_promiseall.js",
        "number": 3,
        "type": "js",
        "code": "function Promise_all(promises) {\n  return new Promise((resolve, reject) => {\n    // Your code here.\n  });\n}\n\n// Test code.\nPromise_all([]).then(array => {\n  console.log(\"This should be []:\", array);\n});\nfunction soon(val) {\n  return new Promise(resolve => {\n    setTimeout(() => resolve(val), Math.random() * 500);\n  });\n}\nPromise_all([soon(1), soon(2), soon(3)]).then(array => {\n  console.log(\"This should be [1, 2, 3]:\", array);\n});\nPromise_all([soon(1), Promise.reject(\"X\"), soon(3)])\n  .then(array => {\n    console.log(\"We should not get here\");\n  })\n  .catch(error => {\n    if (error != \"X\") {\n      console.log(\"Unexpected failure:\", error);\n    }\n  });",
        "solution": "function Promise_all(promises) {\n  return new Promise((resolve, reject) => {\n    let results = [];\n    let pending = promises.length;\n    for (let i = 0; i < promises.length; i++) {\n      promises[i].then(result => {\n        results[i] = result;\n        pending--;\n        if (pending == 0) resolve(results);\n      }).catch(reject);\n    }\n    if (promises.length == 0) resolve(results);\n  });\n}\n\n// Test code.\nPromise_all([]).then(array => {\n  console.log(\"This should be []:\", array);\n});\nfunction soon(val) {\n  return new Promise(resolve => {\n    setTimeout(() => resolve(val), Math.random() * 500);\n  });\n}\nPromise_all([soon(1), soon(2), soon(3)]).then(array => {\n  console.log(\"This should be [1, 2, 3]:\", array);\n});\nPromise_all([soon(1), Promise.reject(\"X\"), soon(3)]).then(array => {\n  console.log(\"We should not get here\");\n}).catch(error => {\n  if (error != \"X\") {\n    console.log(\"Unexpected failure:\", error);\n  }\n});"
      },
      {
        "name": "Tracking the scalpel [3rd ed]",
        "file": "code/solutions/11_1_tracking_the_scalpel.js",
        "number": "1[3]",
        "type": "js",
        "code": "async function locateScalpel(nest) {\n  // Your code here.\n}\n\nfunction locateScalpel2(nest) {\n  // Your code here.\n}\n\nlocateScalpel(bigOak).then(console.log);\n// → Butcher Shop",
        "solution": "async function locateScalpel(nest) {\n  let current = nest.name;\n  for (;;) {\n    let next = await anyStorage(nest, current, \"scalpel\");\n    if (next == current) return current;\n    current = next;\n  }\n}\n\nfunction locateScalpel2(nest) {\n  function loop(current) {\n    return anyStorage(nest, current, \"scalpel\").then(next => {\n      if (next == current) return current;\n      else return loop(next);\n    });\n  }\n  return loop(nest.name);\n}\n\nlocateScalpel(bigOak).then(console.log);\n// → Butcher's Shop\nlocateScalpel2(bigOak).then(console.log);\n// → Butcher's Shop",
        "goto": "https://eloquentjavascript.net/3rd_edition/code/#11.1"
      }
    ],
    "include": [
      "code/hangar2.js",
      "code/chapter/11_async.js"
    ],
    "links": [
      "code/chapter/11_async.zip"
    ]
  },
  {
    "number": 12,
    "id": "12_language",
    "title": "Project: A Programming Language",
    "start_code": "run(`\ndo(define(plusOne, fun(a, +(a, 1))),\n   print(plusOne(10)))\n`);\n\nrun(`\ndo(define(pow, fun(base, exp,\n     if(==(exp, 0),\n        1,\n        *(base, pow(base, -(exp, 1)))))),\n   print(pow(2, 10)))\n`);\n",
    "exercises": [
      {
        "name": "Arrays",
        "file": "code/solutions/12_1_arrays.js",
        "number": 1,
        "type": "js",
        "code": "// Modify these definitions...\n\ntopScope.array = \"...\";\n\ntopScope.length = \"...\";\n\ntopScope.element = \"...\";\n\nrun(`\ndo(define(sum, fun(array,\n     do(define(i, 0),\n        define(sum, 0),\n        while(<(i, length(array)),\n          do(define(sum, +(sum, element(array, i))),\n             define(i, +(i, 1)))),\n        sum))),\n   print(sum(array(1, 2, 3))))\n`);\n// → 6",
        "solution": "topScope.array = (...values) => values;\n\ntopScope.length = array => array.length;\n\ntopScope.element = (array, i) => array[i];\n\nrun(`\ndo(define(sum, fun(array,\n     do(define(i, 0),\n        define(sum, 0),\n        while(<(i, length(array)),\n          do(define(sum, +(sum, element(array, i))),\n             define(i, +(i, 1)))),\n        sum))),\n   print(sum(array(1, 2, 3))))\n`);\n// → 6"
      },
      {
        "name": "Comments",
        "file": "code/solutions/12_3_comments.js",
        "number": 3,
        "type": "js",
        "code": "// This is the old skipSpace. Modify it...\nfunction skipSpace(string) {\n  let first = string.search(/\\S/);\n  if (first == -1) return \"\";\n  return string.slice(first);\n}\n\nconsole.log(parse(\"# hello\\nx\"));\n// → {type: \"word\", name: \"x\"}\n\nconsole.log(parse(\"a # one\\n   # two\\n()\"));\n// → {type: \"apply\",\n//    operator: {type: \"word\", name: \"a\"},\n//    args: []}",
        "solution": "function skipSpace(string) {\n  let skippable = string.match(/^(\\s|#.*)*/);\n  return string.slice(skippable[0].length);\n}\n\nconsole.log(parse(\"# hello\\nx\"));\n// → {type: \"word\", name: \"x\"}\n\nconsole.log(parse(\"a # one\\n   # two\\n()\"));\n// → {type: \"apply\",\n//    operator: {type: \"word\", name: \"a\"},\n//    args: []}"
      },
      {
        "name": "Fixing scope",
        "file": "code/solutions/12_4_fixing_scope.js",
        "number": 4,
        "type": "js",
        "code": "specialForms.set = (args, scope) => {\n  // Your code here.\n};\n\nrun(`\ndo(define(x, 4),\n   define(setx, fun(val, set(x, val))),\n   setx(50),\n   print(x))\n`);\n// → 50\nrun(`set(quux, true)`);\n// → Some kind of ReferenceError",
        "solution": "specialForms.set = (args, env) => {\n  if (args.length != 2 || args[0].type != \"word\") {\n    throw new SyntaxError(\"Bad use of set\");\n  }\n  let varName = args[0].name;\n  let value = evaluate(args[1], env);\n\n  for (let scope = env; scope; scope = Object.getPrototypeOf(scope)) {\n    if (Object.hasOwn(scope, varName)) {\n      scope[varName] = value;\n      return value;\n    }\n  }\n  throw new ReferenceError(`Setting undefined variable ${varName}`);\n};\n\nrun(`\ndo(define(x, 4),\n   define(setx, fun(val, set(x, val))),\n   setx(50),\n   print(x))\n`);\n// → 50\nrun(`set(quux, true)`);\n// → Some kind of ReferenceError"
      }
    ],
    "include": [
      "code/chapter/12_language.js"
    ],
    "links": [
      "code/chapter/12_language.zip"
    ]
  },
  {
    "number": 13,
    "id": "13_browser",
    "title": "JavaScript and the Browser",
    "start_code": "",
    "exercises": [],
    "include": null
  },
  {
    "number": 14,
    "id": "14_dom",
    "title": "The Document Object Model",
    "start_code": "<!doctype html>\n\n<p style=\"text-align: center\">\n  <img src=\"img/cat.png\" style=\"position: relative\">\n</p>\n<script>\n  let cat = document.querySelector(\"img\");\n  let angle = Math.PI / 2;\n  function animate(time, lastTime) {\n    if (lastTime != null) {\n      angle += (time - lastTime) * 0.001;\n    }\n    cat.style.top = (Math.sin(angle) * 20) + \"px\";\n    cat.style.left = (Math.cos(angle) * 200) + \"px\";\n    requestAnimationFrame(newTime => animate(newTime, time));\n  }\n  requestAnimationFrame(animate);\n</script>\n",
    "exercises": [
      {
        "name": "Build a table",
        "file": "code/solutions/14_1_build_a_table.html",
        "number": 1,
        "type": "html",
        "code": "<!doctype html>\n\n<h1>Mountains</h1>\n\n<div id=\"mountains\"></div>\n\n<script>\n  const MOUNTAINS = [\n    {name: \"Kilimanjaro\", height: 5895, place: \"Tanzania\"},\n    {name: \"Everest\", height: 8848, place: \"Nepal\"},\n    {name: \"Mount Fuji\", height: 3776, place: \"Japan\"},\n    {name: \"Vaalserberg\", height: 323, place: \"Netherlands\"},\n    {name: \"Denali\", height: 6168, place: \"United States\"},\n    {name: \"Popocatepetl\", height: 5465, place: \"Mexico\"},\n    {name: \"Mont Blanc\", height: 4808, place: \"Italy/France\"}\n  ];\n\n  // Your code here\n</script>",
        "solution": "<!doctype html>\n\n<meta charset=\"utf8\">\n\n<h1>Mountains</h1>\n\n<div id=\"mountains\"></div>\n\n<script>\n  const MOUNTAINS = [\n    {name: \"Kilimanjaro\", height: 5895, place: \"Tanzania\"},\n    {name: \"Everest\", height: 8848, place: \"Nepal\"},\n    {name: \"Mount Fuji\", height: 3776, place: \"Japan\"},\n    {name: \"Vaalserberg\", height: 323, place: \"Netherlands\"},\n    {name: \"Denali\", height: 6168, place: \"United States\"},\n    {name: \"Popocatepetl\", height: 5465, place: \"Mexico\"},\n    {name: \"Mont Blanc\", height: 4808, place: \"Italy/France\"}\n  ];\n\n  function buildTable(data) {\n    let table = document.createElement(\"table\");\n  \n    let fields = Object.keys(data[0]);\n    let headRow = document.createElement(\"tr\");\n    fields.forEach(function(field) {\n      let headCell = document.createElement(\"th\");\n      headCell.appendChild(document.createTextNode(field));\n      headRow.appendChild(headCell);\n    });\n    table.appendChild(headRow);\n\n    data.forEach(function(object) {\n      let row = document.createElement(\"tr\");\n      fields.forEach(function(field) {\n        let cell = document.createElement(\"td\");\n        cell.appendChild(document.createTextNode(object[field]));\n        if (typeof object[field] == \"number\") {\n          cell.style.textAlign = \"right\";\n        }\n        row.appendChild(cell);\n      });\n      table.appendChild(row);\n    });\n\n    return table;\n  }\n\n  document.querySelector(\"#mountains\")\n    .appendChild(buildTable(MOUNTAINS));\n</script>"
      },
      {
        "name": "Elements by tag name",
        "file": "code/solutions/14_2_elements_by_tag_name.html",
        "number": 2,
        "type": "html",
        "code": "<!doctype html>\n\n<h1>Heading with a <span>span</span> element.</h1>\n<p>A paragraph with <span>one</span>, <span>two</span>\n  spans.</p>\n\n<script>\n  function byTagName(node, tagName) {\n    // Your code here.\n  }\n\n  console.log(byTagName(document.body, \"h1\").length);\n  // → 1\n  console.log(byTagName(document.body, \"span\").length);\n  // → 3\n  let para = document.querySelector(\"p\");\n  console.log(byTagName(para, \"span\").length);\n  // → 2\n</script>",
        "solution": "<!doctype html>\n\n<h1>Heading with a <span>span</span> element.</h1>\n<p>A paragraph with <span>one</span>, <span>two</span>\n  spans.</p>\n\n<script>\n  function byTagName(node, tagName) {\n    let found = [];\n    tagName = tagName.toUpperCase();\n\n    function explore(node) {\n      for (let i = 0; i < node.childNodes.length; i++) {\n        let child = node.childNodes[i];\n        if (child.nodeType == document.ELEMENT_NODE) {\n          if (child.nodeName == tagName) found.push(child);\n          explore(child);\n        }\n      }\n    }\n\n    explore(node);\n    return found;\n  }\n\n  console.log(byTagName(document.body, \"h1\").length);\n  // → 1\n  console.log(byTagName(document.body, \"span\").length);\n  // → 3\n  let para = document.querySelector(\"p\");\n  console.log(byTagName(para, \"span\").length);\n  // → 2\n</script>"
      },
      {
        "name": "The cat's hat",
        "file": "code/solutions/14_3_the_cats_hat.html",
        "number": 3,
        "type": "html",
        "code": "<!doctype html>\n\n<style>body { min-height: 200px }</style>\n<img src=\"img/cat.png\" id=\"cat\" style=\"position: absolute\">\n<img src=\"img/hat.png\" id=\"hat\" style=\"position: absolute\">\n\n<script>\n  let cat = document.querySelector(\"#cat\");\n  let hat = document.querySelector(\"#hat\");\n\n  let angle = 0;\n  let lastTime = null;\n  function animate(time) {\n    if (lastTime != null) angle += (time - lastTime) * 0.001;\n    lastTime = time;\n    cat.style.top = (Math.sin(angle) * 40 + 40) + \"px\";\n    cat.style.left = (Math.cos(angle) * 200 + 230) + \"px\";\n\n    // Your extensions here.\n\n    requestAnimationFrame(animate);\n  }\n  requestAnimationFrame(animate);\n</script>",
        "solution": "<!doctype html>\n\n<meta charset=\"utf8\">\n\n<base href=\"https://eloquentjavascript.net/\">\n\n<style>body { min-height: 200px }</style>\n<img src=\"img/cat.png\" id=\"cat\" style=\"position: absolute\">\n<img src=\"img/hat.png\" id=\"hat\" style=\"position: absolute\">\n\n<script>\n  let cat = document.querySelector(\"#cat\");\n  let hat = document.querySelector(\"#hat\");\n\n  let angle = 0;\n  let lastTime = null;\n  function animate(time) {\n    if (lastTime != null) angle += (time - lastTime) * 0.001;\n    lastTime = time;\n    cat.style.top = (Math.sin(angle) * 40 + 40) + \"px\";\n    cat.style.left = (Math.cos(angle) * 200 + 230) + \"px\";\n    hat.style.top = (Math.sin(angle + Math.PI) * 40 + 40) + \"px\";\n    hat.style.left = (Math.cos(angle + Math.PI) * 200 + 230) + \"px\";\n\n    requestAnimationFrame(animate);\n  }\n  requestAnimationFrame(animate);\n</script>"
      }
    ],
    "include": null
  },
  {
    "number": 15,
    "id": "15_event",
    "title": "Handling Events",
    "start_code": "<!doctype html>\n\n<p>Drag the bar to change its width:</p>\n<div style=\"background: orange; width: 60px; height: 20px\">\n</div>\n<script>\n  let lastX; // Tracks the last observed mouse X position\n  let bar = document.querySelector(\"div\");\n  bar.addEventListener(\"mousedown\", event => {\n    if (event.button == 0) {\n      lastX = event.clientX;\n      window.addEventListener(\"mousemove\", moved);\n      event.preventDefault(); // Prevent selection\n    }\n  });\n\n  function moved(event) {\n    if (event.buttons == 0) {\n      window.removeEventListener(\"mousemove\", moved);\n    } else {\n      let dist = event.clientX - lastX;\n      let newWidth = Math.max(10, bar.offsetWidth + dist);\n      bar.style.width = newWidth + \"px\";\n      lastX = event.clientX;\n    }\n  }\n</script>\n",
    "exercises": [
      {
        "name": "Balloon",
        "file": "code/solutions/15_1_balloon.html",
        "number": 1,
        "type": "html",
        "code": "<!doctype html>\n\n<p>🎈</p>\n\n<script>\n  // Your code here\n</script>",
        "solution": "<!doctype html>\n\n<p>🎈</p>\n\n<script>\n  let p = document.querySelector(\"p\");\n  let size;\n  function setSize(newSize) {\n    size = newSize;\n    p.style.fontSize = size + \"px\";\n  }\n  setSize(20);\n\n  function handleArrow(event) {\n    if (event.key == \"ArrowUp\") {\n      if (size > 70) {\n        p.textContent = \"💥\";\n        document.body.removeEventListener(\"keydown\", handleArrow);\n      } else {\n        setSize(size * 1.1);\n        event.preventDefault();\n      }\n    } else if (event.key == \"ArrowDown\") {\n      setSize(size * 0.9);\n      event.preventDefault();\n    }\n  }\n  document.body.addEventListener(\"keydown\", handleArrow);\n</script>"
      },
      {
        "name": "Mouse trail",
        "file": "code/solutions/15_2_mouse_trail.html",
        "number": 2,
        "type": "html",
        "code": "<!doctype html>\n\n<style>\n  .trail { /* className for the trail elements */\n    position: absolute;\n    height: 6px; width: 6px;\n    border-radius: 3px;\n    background: teal;\n  }\n  body {\n    height: 300px;\n  }\n</style>\n\n<script>\n  // Your code here.\n</script>",
        "solution": "<!doctype html>\n\n<style>\n  .trail { /* className for the trail elements */\n    position: absolute;\n    height: 6px; width: 6px;\n    border-radius: 3px;\n    background: teal;\n  }\n  body {\n    height: 300px;\n  }\n</style>\n\n<body>\n<script>\n  let dots = [];\n  for (let i = 0; i < 12; i++) {\n    let node = document.createElement(\"div\");\n    node.className = \"trail\";\n    document.body.appendChild(node);\n    dots.push(node);\n  }\n  let currentDot = 0;\n  \n  window.addEventListener(\"mousemove\", event => {\n    let dot = dots[currentDot];\n    dot.style.left = (event.pageX - 3) + \"px\";\n    dot.style.top = (event.pageY - 3) + \"px\";\n    currentDot = (currentDot + 1) % dots.length;\n  });\n</script>\n</body>"
      },
      {
        "name": "Tabs",
        "file": "code/solutions/15_3_tabs.html",
        "number": 3,
        "type": "html",
        "code": "<!doctype html>\n\n<tab-panel>\n  <div data-tabname=\"one\">Tab one</div>\n  <div data-tabname=\"two\">Tab two</div>\n  <div data-tabname=\"three\">Tab three</div>\n</tab-panel>\n<script>\n  function asTabs(node) {\n    // Your code here.\n  }\n  asTabs(document.querySelector(\"tab-panel\"));\n</script>",
        "solution": "<!doctype html>\n\n<tab-panel>\n  <div data-tabname=\"one\">Tab one</div>\n  <div data-tabname=\"two\">Tab two</div>\n  <div data-tabname=\"three\">Tab three</div>\n</tab-panel>\n<script>\n  function asTabs(node) {\n    let tabs = Array.from(node.children).map(node => {\n      let button = document.createElement(\"button\");\n      button.textContent = node.getAttribute(\"data-tabname\");\n      let tab = {node, button};\n      button.addEventListener(\"click\", () => selectTab(tab));\n      return tab;\n    });\n\n    let tabList = document.createElement(\"div\");\n    for (let {button} of tabs) tabList.appendChild(button);\n    node.insertBefore(tabList, node.firstChild);\n\n    function selectTab(selectedTab) {\n      for (let tab of tabs) {\n        let selected = tab == selectedTab;\n        tab.node.style.display = selected ? \"\" : \"none\";\n        tab.button.style.color = selected ? \"red\" : \"\";\n      }\n    }\n    selectTab(tabs[0]);\n  }\n\n  asTabs(document.querySelector(\"tab-panel\"));\n</script>"
      }
    ],
    "include": null
  },
  {
    "number": 16,
    "id": "16_game",
    "title": "Project: A Platform Game",
    "start_code": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n\n<link rel=\"stylesheet\" href=\"css/game.css\">\n\n<body>\n  <script>\n    runGame(GAME_LEVELS, DOMDisplay);\n  </script>\n</body>\n",
    "exercises": [
      {
        "name": "Game over",
        "file": "code/solutions/16_1_game_over.html",
        "number": 1,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n\n<link rel=\"stylesheet\" href=\"css/game.css\">\n\n<body>\n<script>\n  // The old runGame function. Modify it...\n  async function runGame(plans, Display) {\n    for (let level = 0; level < plans.length;) {\n      let status = await runLevel(new Level(plans[level]),\n                                  Display);\n      if (status == \"won\") level++;\n    }\n    console.log(\"You've won!\");\n  }\n  runGame(GAME_LEVELS, DOMDisplay);\n</script>\n</body>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n\n<link rel=\"stylesheet\" href=\"css/game.css\">\n\n<body>\n<script>\n  // The old runGame function. Modify it...\n  async function runGame(plans, Display) {\n    let lives = 3;\n    for (let level = 0; level < plans.length && lives > 0;) {\n      console.log(`Level ${level + 1}, lives: ${lives}`);\n      let status = await runLevel(new Level(plans[level]),\n                                  Display);\n      if (status == \"won\") level++;\n      else lives--;\n    }\n    if (lives > 0) {\n      console.log(\"You've won!\");\n    } else {\n      console.log(\"Game over\");\n    }\n  }\n  runGame(GAME_LEVELS, DOMDisplay);\n</script>\n</body>"
      },
      {
        "name": "Pausing the game",
        "file": "code/solutions/16_2_pausing_the_game.html",
        "number": 2,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n\n<link rel=\"stylesheet\" href=\"css/game.css\">\n\n<body>\n<script>\n  // The old runLevel function. Modify this...\n  function runLevel(level, Display) {\n    let display = new Display(document.body, level);\n    let state = State.start(level);\n    let ending = 1;\n    return new Promise(resolve => {\n      runAnimation(time => {\n        state = state.update(time, arrowKeys);\n        display.syncState(state);\n        if (state.status == \"playing\") {\n          return true;\n        } else if (ending > 0) {\n          ending -= time;\n          return true;\n        } else {\n          display.clear();\n          resolve(state.status);\n          return false;\n        }\n      });\n    });\n  }\n  runGame(GAME_LEVELS, DOMDisplay);\n</script>\n</body>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n\n<link rel=\"stylesheet\" href=\"css/game.css\">\n\n<body>\n<script>\n  // To know when to stop and restart the animation, a level that is\n  // being displayed may be in three `running` states:\n  //\n  // * \"yes\":     Running normally.\n  // * \"no\":      Paused, animation isn't running\n  // * \"pausing\": Must pause, but animation is still running\n  //\n  // The key handler, when it notices escape being pressed, will do a\n  // different thing depending on the current state. When running is\n  // \"yes\" or \"pausing\", it will switch to the other of those two\n  // states. When it is \"no\", it will restart the animation and switch\n  // the state to \"yes\".\n  //\n  // The animation function, when state is \"pausing\", will set the state\n  // to \"no\" and return false to stop the animation.\n\n  function runLevel(level, Display) {\n    let display = new Display(document.body, level);\n    let state = State.start(level);\n    let ending = 1;\n    let running = \"yes\";\n\n    return new Promise(resolve => {\n      function escHandler(event) {\n        if (event.key != \"Escape\") return;\n        event.preventDefault();\n        if (running == \"no\") {\n          running = \"yes\";\n          runAnimation(frame);\n        } else if (running == \"yes\") {\n          running = \"pausing\";\n        } else {\n          running = \"yes\";\n        }\n      }\n      window.addEventListener(\"keydown\", escHandler);\n      let arrowKeys = trackKeys([\"ArrowLeft\", \"ArrowRight\", \"ArrowUp\"]);\n\n      function frame(time) {\n        if (running == \"pausing\") {\n          running = \"no\";\n          return false;\n        }\n\n        state = state.update(time, arrowKeys);\n        display.syncState(state);\n        if (state.status == \"playing\") {\n          return true;\n        } else if (ending > 0) {\n          ending -= time;\n          return true;\n        } else {\n          display.clear();\n          window.removeEventListener(\"keydown\", escHandler);\n          arrowKeys.unregister();\n          resolve(state.status);\n          return false;\n        }\n      }\n      runAnimation(frame);\n    });\n  }\n\n  function trackKeys(keys) {\n    let down = Object.create(null);\n    function track(event) {\n      if (keys.includes(event.key)) {\n        down[event.key] = event.type == \"keydown\";\n        event.preventDefault();\n      }\n    }\n    window.addEventListener(\"keydown\", track);\n    window.addEventListener(\"keyup\", track);\n    down.unregister = () => {\n      window.removeEventListener(\"keydown\", track);\n      window.removeEventListener(\"keyup\", track);\n    };\n    return down;\n  }\n\n  runGame(GAME_LEVELS, DOMDisplay);\n</script>\n</body>"
      },
      {
        "name": "A monster",
        "file": "code/solutions/16_3_a_monster.html",
        "number": 3,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n\n<link rel=\"stylesheet\" href=\"css/game.css\">\n<style>.monster { background: purple }</style>\n\n<body>\n  <script>\n    // Complete the constructor, update, and collide methods\n    class Monster {\n      constructor(pos, /* ... */) {}\n\n      get type() { return \"monster\"; }\n\n      static create(pos) {\n        return new Monster(pos.plus(new Vec(0, -1)));\n      }\n\n      update(time, state) {}\n\n      collide(state) {}\n    }\n\n    Monster.prototype.size = new Vec(1.2, 2);\n\n    levelChars[\"M\"] = Monster;\n\n    runLevel(new Level(`\n..................................\n.################################.\n.#..............................#.\n.#..............................#.\n.#..............................#.\n.#...........................o..#.\n.#..@...........................#.\n.##########..............########.\n..........#..o..o..o..o..#........\n..........#...........M..#........\n..........################........\n..................................\n`), DOMDisplay);\n  </script>\n</body>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n\n<link rel=\"stylesheet\" href=\"css/game.css\">\n\n<style>\n  .monster { background: purple }\n</style>\n\n<body>\n  <script>\n    const monsterSpeed = 4;\n\n    class Monster {\n      constructor(pos) { this.pos = pos; }\n\n      get type() { return \"monster\"; }\n\n      static create(pos) { return new Monster(pos.plus(new Vec(0, -1))); }\n\n      update(time, state) {\n        let player = state.player;\n        let speed = (player.pos.x < this.pos.x ? -1 : 1) * time * monsterSpeed;\n        let newPos = new Vec(this.pos.x + speed, this.pos.y);\n        if (state.level.touches(newPos, this.size, \"wall\")) return this;\n        else return new Monster(newPos);\n      }\n\n      collide(state) {\n        let player = state.player;\n        if (player.pos.y + player.size.y < this.pos.y + 0.5) {\n          let filtered = state.actors.filter(a => a != this);\n          return new State(state.level, filtered, state.status);\n        } else {\n          return new State(state.level, state.actors, \"lost\");\n        }\n      }\n    }\n\n    Monster.prototype.size = new Vec(1.2, 2);\n\n    levelChars[\"M\"] = Monster;\n\n    runLevel(new Level(`\n..................................\n.################################.\n.#..............................#.\n.#..............................#.\n.#..............................#.\n.#...........................o..#.\n.#..@...........................#.\n.##########..............########.\n..........#..o..o..o..o..#........\n..........#...........M..#........\n..........################........\n..................................\n`), DOMDisplay);\n  </script>\n</body>"
      }
    ],
    "include": [
      "code/chapter/16_game.js",
      "code/levels.js",
      "code/_stop_keys.js"
    ],
    "links": [
      "code/chapter/16_game.zip"
    ]
  },
  {
    "number": 17,
    "id": "17_canvas",
    "title": "Drawing on Canvas",
    "start_code": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n<script src=\"code/chapter/17_canvas.js\"></script>\n\n<body>\n  <script>\n    runGame(GAME_LEVELS, CanvasDisplay);\n  </script>\n</body>\n",
    "exercises": [
      {
        "name": "Shapes",
        "file": "code/solutions/17_1_shapes.html",
        "number": 1,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n<script src=\"code/chapter/17_canvas.js\"></script>\n\n<canvas width=\"600\" height=\"200\"></canvas>\n<script>\n  let cx = document.querySelector(\"canvas\").getContext(\"2d\");\n\n  // Your code here.\n</script>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n<script src=\"code/chapter/17_canvas.js\"></script>\n\n<canvas width=\"600\" height=\"200\"></canvas>\n<script>\n  let cx = document.querySelector(\"canvas\").getContext(\"2d\");\n\n  function trapezoid(x, y) {\n    cx.beginPath();\n    cx.moveTo(x, y);\n    cx.lineTo(x + 50, y);\n    cx.lineTo(x + 70, y + 50);\n    cx.lineTo(x - 20, y + 50);\n    cx.closePath();\n    cx.stroke();\n  }\n  trapezoid(30, 30);\n\n  function diamond(x, y) {\n    cx.translate(x + 30, y + 30);\n    cx.rotate(Math.PI / 4);\n    cx.fillStyle = \"red\";\n    cx.fillRect(-30, -30, 60, 60);\n    cx.resetTransform();\n  }\n  diamond(140, 30);\n\n  function zigzag(x, y) {\n    cx.beginPath();\n    cx.moveTo(x, y);\n    for (let i = 0; i < 8; i++) {\n      cx.lineTo(x + 80, y + i * 8 + 4);\n      cx.lineTo(x, y + i * 8 + 8);\n    }\n    cx.stroke();\n  }\n  zigzag(240, 20);\n\n  function spiral(x, y) {\n    let radius = 50, xCenter = x + radius, yCenter = y + radius;\n    cx.beginPath();\n    cx.moveTo(xCenter, yCenter);\n    for (let i = 0; i < 300; i++) {\n      let angle = i * Math.PI / 30;\n      let dist = radius * i / 300;\n      cx.lineTo(xCenter + Math.cos(angle) * dist,\n                yCenter + Math.sin(angle) * dist);\n    }\n    cx.stroke();\n  }\n  spiral(340, 20);\n\n  function star(x, y) {\n    let radius = 50, xCenter = x + radius, yCenter = y + radius;\n    cx.beginPath();\n    cx.moveTo(xCenter + radius, yCenter);\n    for (let i = 1; i <= 8; i++) {\n      let angle = i * Math.PI / 4;\n      cx.quadraticCurveTo(xCenter, yCenter,\n                          xCenter + Math.cos(angle) * radius,\n                          yCenter + Math.sin(angle) * radius);\n    }\n    cx.fillStyle = \"gold\";\n    cx.fill();\n  }\n  star(440, 20);\n</script>"
      },
      {
        "name": "The pie chart",
        "file": "code/solutions/17_2_the_pie_chart.html",
        "number": 2,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n<script src=\"code/chapter/17_canvas.js\"></script>\n\n<canvas width=\"600\" height=\"300\"></canvas>\n<script>\n  let cx = document.querySelector(\"canvas\").getContext(\"2d\");\n  let total = results\n    .reduce((sum, {count}) => sum + count, 0);\n  let currentAngle = -0.5 * Math.PI;\n  let centerX = 300, centerY = 150;\n\n  // Add code to draw the slice labels in this loop.\n  for (let result of results) {\n    let sliceAngle = (result.count / total) * 2 * Math.PI;\n    cx.beginPath();\n    cx.arc(centerX, centerY, 100,\n           currentAngle, currentAngle + sliceAngle);\n    currentAngle += sliceAngle;\n    cx.lineTo(centerX, centerY);\n    cx.fillStyle = result.color;\n    cx.fill();\n  }\n</script>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n<script src=\"code/chapter/17_canvas.js\"></script>\n\n<canvas width=\"600\" height=\"300\"></canvas>\n<script>\n  let cx = document.querySelector(\"canvas\").getContext(\"2d\");\n  let total = results.reduce(function(sum, choice) {\n    return sum + choice.count;\n  }, 0);\n\n  let currentAngle = -0.5 * Math.PI;\n  let centerX = 300, centerY = 150;\n\n  results.forEach(function(result) {\n    let sliceAngle = (result.count / total) * 2 * Math.PI;\n    cx.beginPath();\n    cx.arc(centerX, centerY, 100,\n           currentAngle, currentAngle + sliceAngle);\n\n    let middleAngle = currentAngle + 0.5 * sliceAngle;\n    let textX = Math.cos(middleAngle) * 120 + centerX;\n    let textY = Math.sin(middleAngle) * 120 + centerY;\n    cx.textBaseLine = \"middle\";\n    if (Math.cos(middleAngle) > 0) {\n      cx.textAlign = \"left\";\n    } else {\n      cx.textAlign = \"right\";\n    }\n    cx.font = \"15px sans-serif\";\n    cx.fillStyle = \"black\";\n    cx.fillText(result.name, textX, textY);\n\n    currentAngle += sliceAngle;\n    cx.lineTo(centerX, centerY);\n    cx.fillStyle = result.color;\n    cx.fill();\n  });\n</script>"
      },
      {
        "name": "A bouncing ball",
        "file": "code/solutions/17_3_a_bouncing_ball.html",
        "number": 3,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n<script src=\"code/chapter/17_canvas.js\"></script>\n\n<canvas width=\"400\" height=\"400\"></canvas>\n<script>\n  let cx = document.querySelector(\"canvas\").getContext(\"2d\");\n\n  let lastTime = null;\n  function frame(time) {\n    if (lastTime != null) {\n      updateAnimation(Math.min(100, time - lastTime) / 1000);\n    }\n    lastTime = time;\n    requestAnimationFrame(frame);\n  }\n  requestAnimationFrame(frame);\n\n  function updateAnimation(step) {\n    // Your code here.\n  }\n</script>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/16_game.js\"></script>\n<script src=\"code/levels.js\"></script>\n<script src=\"code/_stop_keys.js\"></script>\n<script src=\"code/chapter/17_canvas.js\"></script>\n\n<canvas width=\"400\" height=\"400\"></canvas>\n<script>\n  let cx = document.querySelector(\"canvas\").getContext(\"2d\");\n\n  let lastTime = null;\n  function frame(time) {\n    if (lastTime != null) {\n      updateAnimation(Math.min(100, time - lastTime) / 1000);\n    }\n    lastTime = time;\n    requestAnimationFrame(frame);\n  }\n  requestAnimationFrame(frame);\n\n  let x = 100, y = 300;\n  let radius = 10;\n  let speedX = 100, speedY = 60;\n\n  function updateAnimation(step) {\n    cx.clearRect(0, 0, 400, 400);\n    cx.strokeStyle = \"blue\";\n    cx.lineWidth = 4;\n    cx.strokeRect(25, 25, 350, 350);\n    \n    x += step * speedX;\n    y += step * speedY;\n    if (x < 25 + radius || x > 375 - radius) speedX = -speedX;\n    if (y < 25 + radius || y > 375 - radius) speedY = -speedY;\n    cx.fillStyle = \"red\";\n    cx.beginPath();\n    cx.arc(x, y, radius, 0, 7);\n    cx.fill();\n  }\n</script>"
      }
    ],
    "include": [
      "code/chapter/16_game.js",
      "code/levels.js",
      "code/_stop_keys.js",
      "code/chapter/17_canvas.js"
    ],
    "links": [
      "code/chapter/17_canvas.zip"
    ]
  },
  {
    "number": 18,
    "id": "18_http",
    "title": "HTTP and Forms",
    "start_code": "<!doctype html>\n\nNotes: <select></select> <button>Add</button><br>\n<textarea style=\"width: 100%\"></textarea>\n\n<script>\n  let list = document.querySelector(\"select\");\n  let note = document.querySelector(\"textarea\");\n\n  let state;\n  function setState(newState) {\n    list.textContent = \"\";\n    for (let name of Object.keys(newState.notes)) {\n      let option = document.createElement(\"option\");\n      option.textContent = name;\n      if (newState.selected == name) option.selected = true;\n      list.appendChild(option);\n    }\n    note.value = newState.notes[newState.selected];\n\n    localStorage.setItem(\"Notes\", JSON.stringify(newState));\n    state = newState;\n  }\n  setState(JSON.parse(localStorage.getItem(\"Notes\")) ?? {\n    notes: {\"shopping list\": \"Carrots\\nRaisins\"},\n    selected: \"shopping list\"\n  });\n\n  list.addEventListener(\"change\", () => {\n    setState({notes: state.notes, selected: list.value});\n  });\n  note.addEventListener(\"change\", () => {\n    let {selected} = state;\n    setState({\n      notes: {...state.notes, [selected]: note.value},\n      selected\n    });\n  });\n  document.querySelector(\"button\")\n    .addEventListener(\"click\", () => {\n      let name = prompt(\"Note name\");\n      if (name) setState({\n        notes: {...state.notes, [name]: \"\"},\n        selected: name\n      });\n    });\n</script>\n",
    "exercises": [
      {
        "name": "Content negotiation",
        "file": "code/solutions/18_1_content_negotiation.js",
        "number": 1,
        "type": "js",
        "code": "// Your code here.",
        "solution": "const url = \"https://eloquentjavascript.net/author\";\nconst types = [\"text/plain\",\n               \"text/html\",\n               \"application/json\",\n               \"application/rainbows+unicorns\"];\n\nasync function showTypes() {\n  for (let type of types) {\n    let resp = await fetch(url, {headers: {accept: type}});\n    console.log(`${type}: ${await resp.text()}\\n`);\n  }\n}\n\nshowTypes();"
      },
      {
        "name": "A JavaScript workbench",
        "file": "code/solutions/18_2_a_javascript_workbench.html",
        "number": 2,
        "type": "html",
        "code": "<!doctype html>\n\n<textarea id=\"code\">return \"hi\";</textarea>\n<button id=\"button\">Run</button>\n<pre id=\"output\"></pre>\n\n<script>\n  // Your code here.\n</script>",
        "solution": "<!doctype html>\n\n<textarea id=\"code\">return \"hi\";</textarea>\n<button id=\"button\">Run</button>\n<pre id=\"output\"></pre>\n\n<script>\n  document.querySelector(\"#button\").addEventListener(\"click\", () => {\n    let code = document.querySelector(\"#code\").value;\n    let outputNode = document.querySelector(\"#output\");\n    try {\n      let result = Function(code)();\n      outputNode.innerText = String(result);\n    } catch (e) {\n      outputNode.innerText = \"Error: \" + e;\n    }\n  });\n</script>"
      },
      {
        "name": "Conway's Game of Life",
        "file": "code/solutions/18_3_conways_game_of_life.html",
        "number": 3,
        "type": "html",
        "code": "<!doctype html>\n\n<div id=\"grid\"></div>\n<button id=\"next\">Next generation</button>\n\n<script>\n  // Your code here.\n</script>",
        "solution": "<!doctype html>\n\n<div id=\"grid\"></div>\n<button id=\"next\">Next generation</button>\n<button id=\"run\">Auto run</button>\n\n<script>\n  const width = 30, height = 15;\n\n  // I will represent the grid as an array of booleans.\n\n  let gridNode = document.querySelector(\"#grid\");\n  // This holds the checkboxes that display the grid in the document.\n  let checkboxes = [];\n  for (let y = 0; y < height; y++) {\n    for (let x = 0; x < width; x++) {\n      let box = document.createElement(\"input\");\n      box.type = \"checkbox\";\n      gridNode.appendChild(box);\n      checkboxes.push(box);\n    }\n    gridNode.appendChild(document.createElement(\"br\"));\n  }\n\n  function gridFromCheckboxes() {\n    return checkboxes.map(box => box.checked);\n  }\n  function checkboxesFromGrid(grid) {\n    grid.forEach((value, i) => checkboxes[i].checked = value);\n  }\n  function randomGrid() {\n    let result = [];\n    for (let i = 0; i < width * height; i++) {\n      result.push(Math.random() < 0.3);\n    }\n    return result;\n  }\n\n  checkboxesFromGrid(randomGrid());\n\n  // This does a two-dimensional loop over the square around the given\n  // x,y position, counting all fields that have a cell but are not the\n  // center field.\n  function countNeighbors(grid, x, y) {\n    let count = 0;\n    for (let y1 = Math.max(0, y - 1); y1 <= Math.min(height - 1, y + 1); y1++) {\n      for (let x1 = Math.max(0, x - 1); x1 <= Math.min(width - 1, x + 1); x1++) {\n        if ((x1 != x || y1 != y) && grid[x1 + y1 * width]) {\n          count++;\n        }\n      }\n    }\n    return count;\n  }\n\n  function nextGeneration(grid) {\n    let newGrid = new Array(width * height);\n    for (let y = 0; y < height; y++) {\n      for (let x = 0; x < width; x++) {\n        let neighbors = countNeighbors(grid, x, y);\n        let offset = x + y * width;\n        if (neighbors < 2 || neighbors > 3) {\n          newGrid[offset] = false;\n        } else if (neighbors == 2) {\n          newGrid[offset] = grid[offset];\n        } else {\n          newGrid[offset] = true;\n        }\n      }\n    }\n    return newGrid;\n  }\n\n  function turn() {\n    checkboxesFromGrid(nextGeneration(gridFromCheckboxes()));\n  }\n\n  document.querySelector(\"#next\").addEventListener(\"click\", turn);\n\n  let running = null;\n  document.querySelector(\"#run\").addEventListener(\"click\", () => {\n    if (running) {\n      clearInterval(running);\n      running = null;\n    } else {\n      running = setInterval(turn, 400);\n    }\n  });\n</script>"
      }
    ],
    "include": null
  },
  {
    "number": 19,
    "id": "19_paint",
    "title": "Project: A Pixel Art Editor",
    "start_code": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  document.querySelector(\"div\")\n    .appendChild(startPixelEditor({}));\n</script>\n",
    "exercises": [
      {
        "name": "Keyboard bindings",
        "file": "code/solutions/19_1_keyboard_bindings.html",
        "number": 1,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  // The original PixelEditor class. Extend the constructor.\n  class PixelEditor {\n    constructor(state, config) {\n      let {tools, controls, dispatch} = config;\n      this.state = state;\n\n      this.canvas = new PictureCanvas(state.picture, pos => {\n        let tool = tools[this.state.tool];\n        let onMove = tool(pos, this.state, dispatch);\n        if (onMove) {\n          return pos => onMove(pos, this.state, dispatch);\n        }\n      });\n      this.controls = controls.map(\n        Control => new Control(state, config));\n      this.dom = elt(\"div\", {}, this.canvas.dom, elt(\"br\"),\n                     ...this.controls.reduce(\n                       (a, c) => a.concat(\" \", c.dom), []));\n    }\n    syncState(state) {\n      this.state = state;\n      this.canvas.syncState(state.picture);\n      for (let ctrl of this.controls) ctrl.syncState(state);\n    }\n  }\n\n  document.querySelector(\"div\")\n    .appendChild(startPixelEditor({}));\n</script>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  class PixelEditor {\n    constructor(state, config) {\n      let {tools, controls, dispatch} = config;\n      this.state = state;\n\n      this.canvas = new PictureCanvas(state.picture, pos => {\n        let tool = tools[this.state.tool];\n        let onMove = tool(pos, this.state, dispatch);\n        if (onMove) {\n          return pos => onMove(pos, this.state, dispatch);\n        }\n      });\n      this.controls = controls.map(\n        Control => new Control(state, config));\n      this.dom = elt(\"div\", {\n        tabIndex: 0,\n        onkeydown: event => this.keyDown(event, config)\n      }, this.canvas.dom, elt(\"br\"),\n         ...this.controls.reduce(\n           (a, c) => a.concat(\" \", c.dom), []));\n    }\n    keyDown(event, config) {\n      if (event.key == \"z\" && (event.ctrlKey || event.metaKey)) {\n        event.preventDefault();\n        config.dispatch({undo: true});\n      } else if (!event.ctrlKey && !event.metaKey && !event.altKey) {\n        for (let tool of Object.keys(config.tools)) {\n          if (tool[0] == event.key) {\n            event.preventDefault();\n            config.dispatch({tool});\n            return;\n          }\n        }\n      }\n    }\n    syncState(state) {\n      this.state = state;\n      this.canvas.syncState(state.picture);\n      for (let ctrl of this.controls) ctrl.syncState(state);\n    }\n  }\n\n  document.querySelector(\"div\")\n    .appendChild(startPixelEditor({}));\n</script>"
      },
      {
        "name": "Efficient drawing",
        "file": "code/solutions/19_2_efficient_drawing.html",
        "number": 2,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  // Change this method\n  PictureCanvas.prototype.syncState = function(picture) {\n    if (this.picture == picture) return;\n    this.picture = picture;\n    drawPicture(this.picture, this.dom, scale);\n  };\n\n  // You may want to use or change this as well\n  function drawPicture(picture, canvas, scale) {\n    canvas.width = picture.width * scale;\n    canvas.height = picture.height * scale;\n    let cx = canvas.getContext(\"2d\");\n\n    for (let y = 0; y < picture.height; y++) {\n      for (let x = 0; x < picture.width; x++) {\n        cx.fillStyle = picture.pixel(x, y);\n        cx.fillRect(x * scale, y * scale, scale, scale);\n      }\n    }\n  }\n\n  document.querySelector(\"div\")\n    .appendChild(startPixelEditor({}));\n</script>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  PictureCanvas.prototype.syncState = function(picture) {\n    if (this.picture == picture) return;\n    drawPicture(picture, this.dom, scale, this.picture);\n    this.picture = picture;\n  }\n\n  function drawPicture(picture, canvas, scale, previous) {\n    if (previous == null ||\n        previous.width != picture.width ||\n        previous.height != picture.height) {\n      canvas.width = picture.width * scale;\n      canvas.height = picture.height * scale;\n      previous = null;\n    }\n\n    let cx = canvas.getContext(\"2d\");\n    for (let y = 0; y < picture.height; y++) {\n      for (let x = 0; x < picture.width; x++) {\n        let color = picture.pixel(x, y);\n        if (previous == null || previous.pixel(x, y) != color) {\n          cx.fillStyle = color;\n          cx.fillRect(x * scale, y * scale, scale, scale);\n        }\n      }\n    }\n  }\n\n  document.querySelector(\"div\")\n    .appendChild(startPixelEditor({}));\n</script>"
      },
      {
        "name": "Circles",
        "file": "code/solutions/19_3_circles.html",
        "number": 3,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  function circle(pos, state, dispatch) {\n    // Your code here\n  }\n\n  let dom = startPixelEditor({\n    tools: {...baseTools, circle}\n  });\n  document.querySelector(\"div\").appendChild(dom);\n</script>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  function circle(pos, state, dispatch) {\n    function drawCircle(to) {\n      let radius = Math.sqrt((to.x - pos.x) ** 2 +\n                             (to.y - pos.y) ** 2);\n      let radiusC = Math.ceil(radius);\n      let drawn = [];\n      for (let dy = -radiusC; dy <= radiusC; dy++) {\n        for (let dx = -radiusC; dx <= radiusC; dx++) {\n          let dist = Math.sqrt(dx ** 2 + dy ** 2);\n          if (dist > radius) continue;\n          let y = pos.y + dy, x = pos.x + dx;\n          if (y < 0 || y >= state.picture.height ||\n              x < 0 || x >= state.picture.width) continue;\n          drawn.push({x, y, color: state.color});\n        }\n      }\n      dispatch({picture: state.picture.draw(drawn)});\n    }\n    drawCircle(pos);\n    return drawCircle;\n  }\n\n  let dom = startPixelEditor({\n    tools: Object.assign({}, baseTools, {circle})\n  });\n  document.querySelector(\"div\").appendChild(dom);\n</script>"
      },
      {
        "name": "Proper lines",
        "file": "code/solutions/19_4_proper_lines.html",
        "number": 4,
        "type": "html",
        "code": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  // The old draw tool. Rewrite this.\n  function draw(pos, state, dispatch) {\n    function drawPixel({x, y}, state) {\n      let drawn = {x, y, color: state.color};\n      dispatch({picture: state.picture.draw([drawn])});\n    }\n    drawPixel(pos, state);\n    return drawPixel;\n  }\n\n  function line(pos, state, dispatch) {\n    // Your code here\n  }\n\n  let dom = startPixelEditor({\n    tools: {draw, line, fill, rectangle, pick}\n  });\n  document.querySelector(\"div\").appendChild(dom);\n</script>",
        "solution": "<!doctype html>\n<script src=\"code/chapter/19_paint.js\"></script>\n\n<div></div>\n<script>\n  function drawLine(from, to, color) {\n    let points = [];\n    if (Math.abs(from.x - to.x) > Math.abs(from.y - to.y)) {\n      if (from.x > to.x) [from, to] = [to, from];\n      let slope = (to.y - from.y) / (to.x - from.x);\n      for (let {x, y} = from; x <= to.x; x++) {\n        points.push({x, y: Math.round(y), color});\n        y += slope;\n      }\n    } else {\n      if (from.y > to.y) [from, to] = [to, from];\n      let slope = (to.x - from.x) / (to.y - from.y);\n      for (let {x, y} = from; y <= to.y; y++) {\n        points.push({x: Math.round(x), y, color});\n        x += slope;\n      }\n    }\n    return points;\n  }\n\n  function draw(pos, state, dispatch) {\n    function connect(newPos, state) {\n      let line = drawLine(pos, newPos, state.color);\n      pos = newPos;\n      dispatch({picture: state.picture.draw(line)});\n    }\n    connect(pos, state);\n    return connect;\n  }\n\n  function line(pos, state, dispatch) {\n    return end => {\n      let line = drawLine(pos, end, state.color);\n      dispatch({picture: state.picture.draw(line)});\n    };\n  }\n\n  let dom = startPixelEditor({\n    tools: {draw, line, fill, rectangle, pick}\n  });\n  document.querySelector(\"div\").appendChild(dom);\n</script>"
      }
    ],
    "include": [
      "code/chapter/19_paint.js"
    ],
    "links": [
      "code/chapter/19_paint.zip"
    ]
  },
  {
    "number": 20,
    "id": "20_node",
    "title": "Node.js",
    "start_code": "",
    "exercises": [
      {
        "name": "Search tool",
        "file": "code/solutions/20_1_search_tool.mjs",
        "number": 1,
        "type": "js",
        "code": "// Node exercises can not be ran in the browser,\n// but you can look at their solution here.\n",
        "solution": "import {statSync, readdirSync, readFileSync} from \"node:fs\";\n\nlet searchTerm = new RegExp(process.argv[2]);\n\nfor (let arg of process.argv.slice(3)) {\n  search(arg);\n}\n\nfunction search(file) {\n  let stats = statSync(file);\n  if (stats.isDirectory()) {\n    for (let f of readdirSync(file)) {\n      search(file + \"/\" + f);\n    }\n  } else if (searchTerm.test(readFileSync(file, \"utf8\"))) {\n    console.log(file);\n  }\n}\n"
      },
      {
        "name": "Directory creation",
        "file": "code/solutions/20_2_directory_creation.mjs",
        "number": 2,
        "type": "js",
        "code": "// Node exercises can not be ran in the browser,\n// but you can look at their solution here.\n",
        "solution": "// This code won't work on its own, but is also included in the\n// code/file_server.js file, which defines the whole system.\n\nimport {mkdir} from \"node:fs/promises\";\n\nmethods.MKCOL = async function(request) {\n  let path = urlPath(request.url);\n  let stats;\n  try {\n    stats = await stat(path);\n  } catch (error) {\n    if (error.code != \"ENOENT\") throw error;\n    await mkdir(path);\n    return {status: 204};\n  }\n  if (stats.isDirectory()) return {status: 204};\n  else return {status: 400, body: \"Not a directory\"};\n};\n"
      },
      {
        "name": "A public space on the web",
        "file": "code/solutions/20_3_a_public_space_on_the_web.zip",
        "number": 3,
        "type": "js",
        "code": "// Node exercises can not be ran in the browser,\n// but you can look at their solution here.\n",
        "solution": "// This solutions consists of multiple files. Download it\n// though the link below.\n"
      }
    ],
    "include": null,
    "links": [
      "code/file_server.mjs"
    ]
  },
  {
    "number": 21,
    "id": "21_skillsharing",
    "title": "Project: Skill-Sharing Website",
    "start_code": "",
    "exercises": [
      {
        "name": "Disk persistence",
        "file": "code/solutions/21_1_disk_persistence.mjs",
        "number": 1,
        "type": "js",
        "code": "// Node exercises can not be ran in the browser,\n// but you can look at their solution here.\n",
        "solution": "// This isn't a stand-alone file, only a redefinition of a few\n// fragments from skillsharing/skillsharing_server.js\n\nimport {readFileSync, writeFile} from \"node:fs\";\n\nconst fileName = \"./talks.json\";\n\nSkillShareServer.prototype.updated = function() {\n  this.version++;\n  let response = this.talkResponse();\n  this.waiting.forEach(resolve => resolve(response));\n  this.waiting = [];\n\n  writeFile(fileName, JSON.stringify(this.talks), e => {\n    if (e) throw e;\n  });\n};\n\nfunction loadTalks() {\n  try {\n    return JSON.parse(readFileSync(fileName, \"utf8\"));\n  } catch (e) {\n    return {};\n  }\n}\n\n// The line that starts the server must be changed to\nnew SkillShareServer(loadTalks()).start(8000);\n"
      },
      {
        "name": "Comment field resets",
        "file": "code/solutions/21_2_comment_field_resets.mjs",
        "number": 2,
        "type": "js",
        "code": "// Node exercises can not be ran in the browser,\n// but you can look at their solution here.\n",
        "solution": "// This isn't a stand-alone file, only a redefinition of the main\n// component from skillsharing/public/skillsharing_client.js\n\nclass Talk {\n  constructor(talk, dispatch) {\n    this.comments = elt(\"div\");\n    this.dom = elt(\n      \"section\", {className: \"talk\"},\n      elt(\"h2\", null, talk.title, \" \", elt(\"button\", {\n        type: \"button\",\n        onclick: () => dispatch({type: \"deleteTalk\",\n                                 talk: talk.title})\n      }, \"Delete\")),\n      elt(\"div\", null, \"by \",\n          elt(\"strong\", null, talk.presenter)),\n      elt(\"p\", null, talk.summary),\n      this.comments,\n      elt(\"form\", {\n        onsubmit(event) {\n          event.preventDefault();\n          let form = event.target;\n          dispatch({type: \"newComment\",\n                    talk: talk.title,\n                    message: form.elements.comment.value});\n          form.reset();\n        }\n      }, elt(\"input\", {type: \"text\", name: \"comment\"}), \" \",\n          elt(\"button\", {type: \"submit\"}, \"Add comment\")));\n    this.syncState(talk);\n  }\n\n  syncState(talk) {\n    this.talk = talk;\n    this.comments.textContent = \"\";\n    for (let comment of talk.comments) {\n      this.comments.appendChild(renderComment(comment));\n    }\n  }\n}\n\nclass SkillShareApp {\n  constructor(state, dispatch) {\n    this.dispatch = dispatch;\n    this.talkDOM = elt(\"div\", {className: \"talks\"});\n    this.talkMap = Object.create(null);\n    this.dom = elt(\"div\", null,\n                   renderUserField(state.user, dispatch),\n                   this.talkDOM,\n                   renderTalkForm(dispatch));\n    this.syncState(state);\n  }\n\n  syncState(state) {\n    if (state.talks == this.talks) return;\n    this.talks = state.talks;\n\n    for (let talk of state.talks) {\n      let found = this.talkMap[talk.title];\n      if (found && found.talk.presenter == talk.presenter &&\n          found.talk.summary == talk.summary) {\n        found.syncState(talk);\n      } else {\n        if (found) found.dom.remove();\n        found = new Talk(talk, this.dispatch);\n        this.talkMap[talk.title] = found;\n        this.talkDOM.appendChild(found.dom);\n      }\n    }\n    for (let title of Object.keys(this.talkMap)) {\n      if (!state.talks.some(talk => talk.title == title)) {\n        this.talkMap[title].dom.remove();\n        delete this.talkMap[title];\n      }\n    }\n  }\n}\n"
      }
    ],
    "include": null,
    "links": [
      "code/skillsharing.zip"
    ]
  },
  {
    "title": "JavaScript and Performance",
    "number": 22,
    "start_code": "<!-- This chapter exists in the paper book, not in the online version -->\n\n<script>\n  runLayout(forceDirected_simple, gridGraph(12));\n</script>\n",
    "include": [
      "code/draw_layout.js",
      "code/chapter/22_fast.js"
    ],
    "exercises": [
      {
        "name": "Prime numbers",
        "file": "code/solutions/22_1_prime_numbers.js",
        "number": 1,
        "type": "js",
        "code": "function* primes() {\n  for (let n = 2;; n++) {\n    // ...\n  }\n}\n\nfunction measurePrimes() {\n  // ...\n}\n\nmeasurePrimes();\n",
        "solution": "function* primes() {\n  for (let n = 2;; n++) {\n    let skip = false;\n    for (let d = 2; d < n; d++) {\n      if (n % d == 0) {\n        skip = true;\n        break;\n      }\n    }\n    if (!skip) yield n;\n  }\n}\n\nfunction measurePrimes() {\n  let iter = primes(), t0 = Date.now();\n  for (let i = 0; i < 10000; i++) {\n    iter.next();\n  }\n  console.log(`Took ${Date.now() - t0}ms`);\n}\n\nmeasurePrimes();\n"
      },
      {
        "name": "Faster prime numbers",
        "file": "code/solutions/22_2_faster_prime_numbers.js",
        "number": 2,
        "type": "js",
        "code": "function* primes() {\n  for (let n = 2;; n++) {\n    // ...\n  }\n}\n\nfunction measurePrimes() {\n  // ...\n}\n\nmeasurePrimes();\n",
        "solution": "function* primes() {\n  let found = [];\n  for (let n = 2;; n++) {\n    let skip = false, root = Math.sqrt(n);\n    for (let prev of found) {\n      if (prev > root) {\n        break;\n      } else if (n % prev == 0) {\n        skip = true;\n        break;\n      }\n    }\n    if (!skip) {\n      found.push(n);\n      yield n;\n    }\n  }\n}\n\nfunction measurePrimes() {\n  let iter = primes(), t0 = Date.now();\n  for (let i = 0; i < 10000; i++) {\n    iter.next();\n  }\n  console.log(`Took ${Date.now() - t0}ms`);\n}\n\nmeasurePrimes();\n"
      },
      {
        "name": "Pathfinding [3rd ed]",
        "file": "code/solutions/22_1_pathfinding.js",
        "number": "1[3]",
        "type": "js",
        "code": "function findPath(a, b) {\n  // Your code here...\n}\n\nlet graph = treeGraph(4, 4);\nlet root = graph[0], leaf = graph[graph.length - 1];\nconsole.log(findPath(root, leaf).length);\n// → 4\n\nleaf.connect(root);\nconsole.log(findPath(root, leaf).length);\n// → 2\n",
        "solution": "function findPath(a, b) {\n  let work = [[a]];\n  for (let path of work) {\n    let end = path[path.length - 1];\n    if (end == b) return path;\n    for (let next of end.edges) {\n      if (!work.some(path => path[path.length - 1] == next)) {\n        work.push(path.concat([next]));\n      }\n    }\n  }\n}\n\nlet graph = treeGraph(4, 4);\nlet root = graph[0], leaf = graph[graph.length - 1];\nconsole.log(findPath(root, leaf).length);\n// → 4\n\nleaf.connect(root);\nconsole.log(findPath(root, leaf).length);\n// → 2\n",
        "goto": "https://eloquentjavascript.net/3rd_edition/code/#22.1"
      },
      {
        "name": "Timing [3rd ed]",
        "file": "code/solutions/22_2_timing.js",
        "number": "2[3]",
        "type": "js",
        "code": "",
        "solution": "function findPath(a, b) {\n  let work = [[a]];\n  for (let path of work) {\n    let end = path[path.length - 1];\n    if (end == b) return path;\n    for (let next of end.edges) {\n      if (!work.some(path => path[path.length - 1] == next)) {\n        work.push(path.concat([next]));\n      }\n    }\n  }\n}\n\nfunction time(findPath) {\n  let graph = treeGraph(6, 6);\n  let startTime = Date.now();\n  let result = findPath(graph[0], graph[graph.length - 1]);\n  console.log(`Path with length ${result.length} found in ${Date.now() - startTime}ms`);\n}\ntime(findPath);\n",
        "goto": "https://eloquentjavascript.net/3rd_edition/code/#22.2"
      },
      {
        "name": "Optimizing [3rd ed]",
        "file": "code/solutions/22_3_optimizing.js",
        "number": "3[3]",
        "type": "js",
        "code": "",
        "solution": "function time(findPath) {\n  let graph = treeGraph(6, 6);\n  let startTime = Date.now();\n  let result = findPath(graph[0], graph[graph.length - 1]);\n  console.log(`Path with length ${result.length} found in ${Date.now() - startTime}ms`);\n}\n\nfunction findPath_set(a, b) {\n  let work = [[a]];\n  let reached = new Set([a]);\n  for (let path of work) {\n    let end = path[path.length - 1];\n    if (end == b) return path;\n    for (let next of end.edges) {\n      if (!reached.has(next)) {\n        reached.add(next);\n        work.push(path.concat([next]));\n      }\n    }\n  }\n}\n\ntime(findPath_set);\n\nfunction pathToArray(path) {\n  let result = [];\n  for (; path; path = path.via) result.unshift(path.at);\n  return result;\n}\n\nfunction findPath_list(a, b) {\n  let work = [{at: a, via: null}];\n  let reached = new Set([a]);\n  for (let path of work) {\n    if (path.at == b) return pathToArray(path);\n    for (let next of path.at.edges) {\n      if (!reached.has(next)) {\n        reached.add(next);\n        work.push({at: next, via: path});\n      }\n    }\n  }\n}\n\ntime(findPath_list);\n",
        "goto": "https://eloquentjavascript.net/3rd_edition/code/#22.3"
      }
    ]
  }
];
