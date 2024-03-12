{{meta {load_files: ["code/chapter/06_object.js"], zip: "node/html"}}}

# La Vida Secreta de los Objetos

{{quote {author: "Barbara Liskov", title: "Programando con Tipos de Datos Abstractos", chapter: true}

Un tipo de dato abstracto se realiza escribiendo un tipo especial de programa [...] que define el tipo en términos de las operaciones que se pueden realizar en él.

quote}}

{{index "Liskov, Barbara", "tipo de dato abstracto"}}

{{figure {url: "img/chapter_picture_6.jpg", alt: "Ilustración de un conejo junto a su prototipo, una representación esquemática de un conejo", chapter: framed}}}

[El Capítulo ?](data) introdujo los objetos de JavaScript, como contenedores que almacenan otros datos.

En la cultura de la programación, tenemos algo llamado _((programación orientada a objetos))_, un conjunto de técnicas que utilizan objetos como principio central de la organización de programas. Aunque nadie realmente se pone de acuerdo en su definición precisa, la programación orientada a objetos ha dado forma al diseño de muchos lenguajes de programación, incluido JavaScript. Este capítulo describe la forma en que estas ideas se pueden aplicar en JavaScript.

## Tipos de Datos Abstractos

{{index "tipo de dato abstracto", tipo, "ejemplo de batidora"}}

La idea principal en la programación orientada a objetos es utilizar objetos, o más bien _tipos_ de objetos, como la unidad de organización del programa. Configurar un programa como una serie de tipos de objetos estrictamente separados proporciona una forma de pensar en su estructura y, por lo tanto, de imponer algún tipo de disciplina para evitar que todo se entrelace.

La forma de hacer esto es pensar en objetos de alguna manera similar a como pensarías en una batidora eléctrica u otro ((electrodoméstico)) para el consumidor. Hay personas que diseñaron y ensamblaron una batidora, y tienen que realizar un trabajo especializado que requiere ciencia de materiales y comprensión de la electricidad. Cubren todo eso con una carcasa de plástico suave, de modo que las personas que solo quieren mezclar masa para panqueques no tengan que preocuparse por todo eso, solo tienen que entender los pocos botones con los que se puede operar la batidora.

{{index "clase"}}

De manera similar, un tipo de dato abstracto, o clase de objeto, es un subprograma que puede contener un código arbitrariamente complicado, pero expone un conjunto limitado de métodos y propiedades que se supone que las personas que trabajan con él deben usar. Esto permite construir programas grandes a partir de varios tipos de electrodomésticos, limitando el grado en que estas diferentes partes están entrelazadas al requerir que solo interactúen entre sí de formas específicas.

{{index encapsulamiento, aislamiento, modularidad}}

Si se encuentra un problema en una clase de objeto como esta, a menudo se puede reparar, o incluso reescribir completamente, sin afectar el resto del programa.

Incluso mejor, puede ser posible utilizar clases de objetos en varios programas diferentes, evitando la necesidad de recrear su funcionalidad desde cero. Puedes pensar en las estructuras de datos integradas de JavaScript, como arrays y strings, como tipos de datos abstractos reutilizables de este tipo.

{{id interfaz}}
{{index [interfaz, objeto]}}

Cada tipo de dato abstracto tiene una _interfaz_, que es la colección de operaciones que el código externo puede realizar en él. Incluso cosas básicas como los números pueden considerarse un tipo de dato abstracto cuya interfaz nos permite sumarlos, multiplicarlos, compararlos, y así sucesivamente. De hecho, la fijación en objetos _individuales_ como la unidad principal de organización en la programación orientada a objetos clásica es un tanto desafortunada, ya que a menudo las piezas de funcionalidad útiles involucran un grupo de diferentes clases de objetos que trabajan estrechamente juntos.

{{id obj_methods}}

## Métodos

{{index "ejemplo de conejo", "método", [propiedad, acceso]}}

En JavaScript, los métodos no son más que propiedades que contienen valores de función. Este es un método simple:

```{includeCode: "top_lines:6"}
function speak(line) {
  console.log(`El conejo ${this.type} dice '${line}'`);
}
let conejoBlanco = {type: "blanco", speak};
let conejoHambriento = {type: "hambriento", speak};

conejoBlanco.speak("Oh, mi pelaje y mis bigotes");
// → El conejo blanco dice 'Oh, mi pelaje y mis bigotes'
conejoHambriento.speak("¿Tienes zanahorias?");
// → El conejo hambriento dice '¿Tienes zanahorias?'
```

{{index "vinculación de this", "llamada de método"}}

Típicamente, un método necesita hacer algo con el objeto en el que fue invocado. Cuando una función es llamada como método—buscada como propiedad y llamada inmediatamente, como en `objeto.método()`—la vinculación llamada `this` en su cuerpo apunta automáticamente al objeto en el que fue llamada.

{{id call_method}}

{{index "llamar método"}}

Puedes pensar en `this` como un ((parámetro)) extra que se pasa a la función de una manera diferente a los parámetros regulares. Si deseas proveerlo explícitamente, puedes usar el método `call` de una función, el cual toma el valor de `this` como su primer argumento y trata los siguientes argumentos como parámetros normales.

```
speak.call(conejoBlanco, "Rápido");
// → El conejo blanco dice 'Rápido'
```

Dado que cada función tiene su propia vinculación `this`, cuyo valor depende de la forma en que es llamada, no puedes hacer referencia al `this` del ámbito envolvente en una función regular definida con la palabra clave `function`.

{{index "vinculación de this", "función flecha"}}

Las funciones flecha son diferentes—no vinculan su propio `this` pero pueden ver la vinculación `this` del ámbito que las rodea. Por lo tanto, puedes hacer algo como el siguiente código, el cual hace referencia a `this` desde dentro de una función local:

```
let buscador = {
  find(array) {
    return array.some(v => v == this.value);
  },
  value: 5
};
console.log(buscador.find([4, 5]));
// → true
```

Una propiedad como `find(array)` en una expresión de objeto es una forma abreviada de definir un método. Crea una propiedad llamada `find` y le asigna una función como su valor.

Si hubiera escrito el argumento de `some` usando la palabra clave `function`, este código no funcionaría.

{{id prototypes}}

## Prototipos

Entonces, una forma de crear un tipo de conejo abstracto con un método `speak` sería crear una función de ayuda que tenga un tipo de conejo como parámetro, y devuelva un objeto que contenga eso como su propiedad `type` y nuestra función `speak` en su propiedad `speak`.

Todos los conejos comparten ese mismo método. Especialmente para tipos con muchos métodos, sería conveniente tener una forma de mantener los métodos de un tipo en un solo lugar, en lugar de añadirlos a cada objeto individualmente.

{{index [propiedad, herencia], [objeto, propiedad], "Prototipo de objeto"}} 

En JavaScript, los _((prototipos))_ son la forma de lograr eso. Los objetos pueden estar enlazados a otros objetos, para obtener mágicamente todas las propiedades que ese otro objeto tiene. Los simples objetos creados con la notación `{}` están enlazados a un objeto llamado `Object.prototype`.

{{index "método toString"}}

```
let empty = {};
console.log(empty.toString);
// → function toString(){…}
console.log(empty.toString());
// → [object Object]
```

Parece que acabamos de extraer una propiedad de un objeto vacío. Pero de hecho, `toString` es un método almacenado en `Object.prototype`, lo que significa que está disponible en la mayoría de los objetos.

Cuando a un objeto se le solicita una propiedad que no tiene, se buscará en su prototipo la propiedad. Si éste no la tiene, se buscará en _su_ prototipo, y así sucesivamente hasta llegar a un objeto que no tiene prototipo (`Object.prototype` es un objeto de este tipo).

```
console.log(Object.getPrototypeOf({}) == Object.prototype);
// → true
console.log(Object.getPrototypeOf(Object.prototype));
// → null
```

{{index "función getPrototypeOf"}}

Como podrás imaginar, `Object.getPrototypeOf` devuelve el prototipo de un objeto.

{{index herencia, "prototipo de Function", "prototipo de Array", "prototipo de Object"}}

Muchos objetos no tienen directamente `Object.prototype` como su ((prototipo)), sino que tienen otro objeto que proporciona un conjunto diferente de propiedades predeterminadas. Las funciones se derivan de `Function.prototype`, y los arreglos se derivan de `Array.prototype`.

```
console.log(Object.getPrototypeOf(Math.max) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf([]) == Array.prototype);
// → true
```

{{index "prototipo de Object"}}

Un objeto prototipo de este tipo tendrá a su vez un prototipo, a menudo `Object.prototype`, de modo que aún proporciona de forma indirecta métodos como `toString`.

{{index "ejemplo de conejo", "función Object.create"}}

Puedes utilizar `Object.create` para crear un objeto con un ((prototipo)) específico.

```{includeCode: "top_lines: 7"}
let protoRabbit = {
  speak(line) {
    console.log(`El conejo ${this.type} dice '${line}'`);
  }
};
let blackRabbit = Object.create(protoRabbit);
blackRabbit.type = "negro";
blackRabbit.speak("Soy el miedo y la oscuridad");
// → El conejo negro dice 'Soy el miedo y la oscuridad'
```

{{index "propiedad compartida"}}

El conejo "proto" actúa como un contenedor para las propiedades que son compartidas por todos los conejos. Un objeto de conejo individual, como el conejo negro, contiene propiedades que se aplican solo a él mismo, en este caso su tipo, y deriva propiedades compartidas de su prototipo.

{{id clases}}

## Clases

{{index "programación orientada a objetos", "tipo de datos abstracto"}}

El sistema de ((prototipos)) de JavaScript puede interpretarse como una versión algo libre de los tipos de datos abstractos o ((clases)). Una clase define la forma de un tipo de objeto, los métodos y propiedades que tiene. A dicho objeto se le llama una _((instancia))_ de la clase.

{{index [propiedad, herencia]}}

Los prototipos son útiles para definir propiedades cuyo valor es compartido por todas las instancias de una clase. Las propiedades que difieren por instancia, como la propiedad `type` de nuestros conejos, deben ser almacenadas directamente en los objetos mismos.

{{id constructores}}

Así que para crear una instancia de una clase, debes hacer un objeto que se derive del prototipo adecuado, pero _también_ debes asegurarte de que él mismo tenga las propiedades que se supone que deben tener las instancias de esta clase. Esto es lo que hace una función _((constructor))_.

```
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit);
  rabbit.type = type;
  return rabbit;
}
```


La notación de ((class)) de JavaScript facilita la definición de este tipo de función, junto con un objeto ((prototype)).

{{index "ejemplo de conejo", constructor}}

```{includeCode: true}
class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`El conejo ${this.type} dice '${line}'`);
  }
}
```

{{index "propiedad prototype", [llaves, clase]}}

La palabra clave `class` inicia una ((declaración de clase)), que nos permite definir un constructor y un conjunto de métodos juntos. Se pueden escribir cualquier cantidad de métodos dentro de las llaves de la declaración. Este código tiene el efecto de definir un enlace llamado `Rabbit`, que contiene una función que ejecuta el código en `constructor`, y tiene una propiedad `prototype` que contiene el método `speak`.

{{index "operador new", "enlace this", [creación de objetos]}}

Esta función no puede ser llamada normalmente. Los constructores, en JavaScript, se llaman colocando la palabra clave `new` delante de ellos. Al hacerlo, se crea un objeto nuevo con el objeto contenido en la propiedad `prototype` de la función como prototipo, luego se ejecuta la función con `this` vinculado al nuevo objeto, y finalmente se devuelve el objeto.

```{includeCode: true}
let killerRabbit = new Rabbit("asesino");
```

De hecho, la palabra clave `class` se introdujo solo en la edición de JavaScript de 2015. Cualquier función puede ser utilizada como constructor, y antes de 2015 la forma de definir una clase era escribir una función regular y luego manipular su propiedad `prototype`.

```
function ConejoArcaico(type) {
  this.type = type;
}

ConejoArcaico.prototype.speak = function(line) {
  console.log(`El conejo ${this.type} dice '${line}'`);
};

let conejoEstiloAntiguo = new ConejoArcaico("estilo antiguo");
```

Por esta razón, todas las funciones que no sean de flecha comienzan con una propiedad `prototype` que contiene un objeto vacío.

{{index mayúsculas}}

Por convención, los nombres de constructores se escriben con mayúscula inicial para que puedan distinguirse fácilmente de otras funciones.

{{index "propiedad prototype", "función getPrototypeOf"}}

Es importante entender la distinción entre la forma en que un prototipo está asociado con un constructor (a través de su _propiedad_ `prototype`) y la forma en que los objetos _tienen_ un prototipo (que se puede encontrar con `Object.getPrototypeOf`). El prototipo real de un constructor es `Function.prototype` ya que los constructores son funciones. Su _propiedad_ `prototype` contiene el prototipo utilizado para las instancias creadas a través de él.

```
console.log(Object.getPrototypeOf(Rabbit) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf(killerRabbit) ==
            Rabbit.prototype);
// → true
```

{{index constructor}}

Por lo general, los constructores agregarán algunas propiedades específicas de instancia a `this`. También es posible declarar propiedades directamente en la ((declaración de clase)). A diferencia de los métodos, dichas propiedades se agregan a los objetos ((instancia)), no al prototipo.

```
class Particle {
  speed = 0;
  constructor(position) {
    this.position = position;
  }
}
```

Al igual que `function`, `class` se puede utilizar tanto en declaraciones como en expresiones. Cuando se usa como una expresión, no define un enlace sino que simplemente produce el constructor como un valor. Se te permite omitir el nombre de la clase en una expresión de clase.

```
let object = new class { getWord() { return "hello"; } };
console.log(object.getWord());
// → hello
```

## Propiedades privadas

{{index [property, private], [property, public], "declaración de clase"}}

Es común que las clases definan algunas propiedades y métodos para uso interno, que no forman parte de su ((interfaz)). Estas se llaman propiedades _privadas_, en contraposición a las públicas, que son parte de la interfaz externa del objeto.

{{index ["método", privado]}}

Para declarar un método privado, coloca un signo `#` delante de su nombre. Estos métodos solo pueden ser llamados desde dentro de la declaración de la `class` que los define.

```
class SecretiveObject {
  #getSecret() {
    return "Me comí todas las ciruelas";
  }
  interrogate() {
    let deboDecirlo = this.#getSecret();
    return "nunca";
  }
}
```

Si intentas llamar a `#getSecret` desde fuera de la clase, obtendrás un error. Su existencia está completamente oculta dentro de la declaración de la clase.

Para usar propiedades de instancia privadas, debes declararlas. Las propiedades regulares se pueden crear simplemente asignándoles un valor, pero las propiedades privadas _deben_ declararse en la declaración de la clase para estar disponibles en absoluto.

Esta clase implementa un dispositivo para obtener un número entero aleatorio por debajo de un número máximo dado. Solo tiene una propiedad ((pública)): `getNumber`.

```
class RandomSource {
  #max;
  constructor(max) {
    this.#max = max;
  }
  getNumber() {
    return Math.floor(Math.random() * this.#max);
  }
}
```

## Sobrescribiendo propiedades derivadas

{{index "propiedad compartida", sobrescribir, [property, herencia]}}

Cuando agregas una propiedad a un objeto, ya sea que esté presente en el prototipo o no, la propiedad se agrega al objeto _mismo_. Si ya existía una propiedad con el mismo nombre en el prototipo, esta propiedad ya no afectará al objeto, ya que ahora está oculta detrás de la propiedad propia del objeto.

```
Rabbit.prototype.teeth = "pequeñas";
console.log(killerRabbit.teeth);
// → pequeñas
killerRabbit.teeth = "largos, afilados y sangrientos";
console.log(killerRabbit.teeth);
// → largos, afilados y sangrientos
console.log((new Rabbit("básico")).teeth);
// → pequeñas
console.log(Rabbit.prototype.teeth);
// → pequeñas
```

{{index [prototipo, diagrama]}}

El siguiente diagrama esquematiza la situación después de que se ha ejecutado este código. Los prototipos `Rabbit` y `Object` están detrás de `killerRabbit` como un telón de fondo, donde se pueden buscar propiedades que no se encuentran en el objeto mismo.

{{figure {url: "img/rabbits.svg", alt: "Un diagrama que muestra la estructura de objetos de conejos y sus prototipos. Hay un cuadro para la instancia 'killerRabbit' (que tiene propiedades de instancia como 'tipo'), con sus dos prototipos, 'Rabbit.prototype' (que tiene el método 'hablar') y 'Object.prototype' (que tiene métodos como 'toString') apilados detrás de él.",width: "8cm"}}}

{{index "propiedad compartida"}}

Sobrescribir propiedades que existen en un prototipo puede ser algo útil de hacer. Como muestra el ejemplo de los dientes del conejo, sobrescribir se puede utilizar para expresar propiedades excepcionales en instancias de una clase más genérica de objetos, mientras se permite que los objetos no excepcionales tomen un valor estándar de su prototipo.

{{index "método toString", "prototipo de Array", "prototipo de Function"}}

También se utiliza la sobrescritura para dar a los prototipos estándar de funciones y arrays un método `toString` diferente al del prototipo básico de objeto.

```
console.log(Array.prototype.toString ==
            Object.prototype.toString);
// → false
console.log([1, 2].toString());
// → 1,2
```

{{index "método toString", "método join", "método call"}}

Llamar a `toString` en un array produce un resultado similar a llamar a `.join(",")` en él—coloca comas entre los valores en el array. Llamar directamente a `Object.prototype.toString` con un array produce una cadena diferente. Esa función no conoce acerca de los arrays, por lo que simplemente coloca la palabra _object_ y el nombre del tipo entre corchetes.

```
console.log(Object.prototype.toString.call([1, 2]));
// → [object Array]
```

## Mapas

{{index "método map"}}

Vimos la palabra _map_ utilizada en el [capítulo anterior](higher_order#map) para una operación que transforma una estructura de datos aplicando una función a sus elementos. Por confuso que sea, en programación la misma palabra también se utiliza para una cosa relacionada pero bastante diferente.

{{index "map (estructura de datos)", "ejemplo de edades", ["estructura de datos", map]}}

Un _mapa_ (sustantivo) es una estructura de datos que asocia valores (las claves) con otros valores. Por ejemplo, podrías querer mapear nombres a edades. Es posible usar objetos para esto.

```
let edades = {
  Boris: 39,
  Liang: 22,
  Júlia: 62
};

console.log(`Júlia tiene ${edades["Júlia"]}`);
// → Júlia tiene 62
console.log("¿Se conoce la edad de Jack?", "Jack" in edades);
// → ¿Se conoce la edad de Jack? false
console.log("¿Se conoce la edad de toString?", "toString" in edades);
// → ¿Se conoce la edad de toString? true
```

{{index "Object.prototype", "método toString"}}

Aquí, los nombres de propiedad del objeto son los nombres de las personas, y los valores de las propiedades son sus edades. Pero ciertamente no listamos a nadie con el nombre toString en nuestro mapa. Sin embargo, dado que los objetos simples derivan de `Object.prototype`, parece que la propiedad está allí.

{{index "función Object.create", prototipo}}

Por lo tanto, usar objetos simples como mapas es peligroso. Hay varias formas posibles de evitar este problema. Primero, es posible crear objetos sin _ningún_ prototipo. Si pasas `null` a `Object.create`, el objeto resultante no derivará de `Object.prototype` y se puede usar de forma segura como un mapa.

```
console.log("toString" in Object.create(null));
// → false
```

{{index [propiedad, nombrar]}}

Los nombres de las propiedades de los objetos deben ser cadenas. Si necesitas un mapa cuyas claves no puedan convertirse fácilmente en cadenas—como objetos—no puedes usar un objeto como tu mapa.

{{index "clase Map"}}

Afortunadamente, JavaScript viene con una clase llamada `Map` que está escrita para este propósito exacto. Almacena un mapeo y permite cualquier tipo de claves.

```
let ages = new Map();
ages.set("Boris", 39);
ages.set("Liang", 22);
ages.set("Júlia", 62);

console.log(`Júlia tiene ${ages.get("Júlia")}`);
// → Júlia tiene 62
console.log("¿Se conoce la edad de Jack?", ages.has("Jack"));
// → ¿Se conoce la edad de Jack? false
console.log(ages.has("toString"));
// → false
```

{{index [interfaz, objeto], "método set", "método get", "método has", encapsulación}}

Los métodos `set`, `get` y `has` forman parte de la interfaz del objeto `Map`. Escribir una estructura de datos que pueda actualizar y buscar rápidamente un gran conjunto de valores no es fácil, pero no tenemos que preocuparnos por eso. Alguien más lo hizo por nosotros, y podemos utilizar su trabajo a través de esta interfaz sencilla.

{{index "función hasOwn", "operador in"}}

Si tienes un objeto simple que necesitas tratar como un mapa por alguna razón, es útil saber que `Object.keys` devuelve solo las claves _propias_ de un objeto, no las del prototipo. Como alternativa al operador `in`, puedes utilizar la función `Object.hasOwn`, que ignora el prototipo del objeto.

```
console.log(Object.hasOwn({x: 1}, "x"));
// → true
console.log(Object.hasOwn({x: 1}, "toString"));
// → false
```

## Polimorfismo

{{index "método toString", "función String", polimorfismo, "anulación", "programación orientada a objetos"}}

Cuando llamas a la función `String` (que convierte un valor a una cadena) en un objeto, llamará al método `toString` en ese objeto para intentar crear una cadena significativa a partir de él. Mencioné que algunos de los prototipos estándar definen su propia versión de `toString` para poder crear una cadena que contenga información más útil que `"[object Object]"`. También puedes hacerlo tú mismo.

```{includeCode: "top_lines: 3"}
Rabbit.prototype.toString = function() {
  return `un conejo ${this.type}`;
};

console.log(String(conejoAsesino));
// → un conejo asesino
```

{{index "programación orientada a objetos", [interfaz, objeto]}}

Este es un ejemplo simple de una idea poderosa. Cuando se escribe un código para trabajar con objetos que tienen una determinada interfaz, en este caso, un método `toString`, cualquier tipo de objeto que accidentalmente admita esta interfaz puede ser enchufado en el código, y este podrá funcionar con él.

Esta técnica se llama _polimorfismo_. El código polimórfico puede trabajar con valores de diferentes formas, siempre y cuando admitan la interfaz que espera.

{{index "método forEach"}}

Un ejemplo de una interfaz ampliamente utilizada es la de los ((objeto similar a un array)) que tiene una propiedad `length` que contiene un número, y propiedades numeradas para cada uno de sus elementos. Tanto los arreglos como las cadenas admiten esta interfaz, al igual que varios otros objetos, algunos de los cuales veremos más adelante en los capítulos sobre el navegador. Nuestra implementación de `forEach` en el [Capítulo ?](higher_order) funciona en cualquier cosa que proporcione esta interfaz. De hecho, también lo hace `Array.prototype.forEach`.

```
Array.prototype.forEach.call({
  length: 2,
  0: "A",
  1: "B"
}, elt => console.log(elt));
// → A
// → B
```

## Getters, setters y estáticos

{{index [interfaz, objeto], [propiedad, "definición"], "clase Map"}}

Las interfaces a menudo contienen propiedades simples, no solo métodos. Por ejemplo, los objetos `Map` tienen una propiedad `size` que te dice cuántas claves están almacenadas en ellos.

No es necesario que dicho objeto calcule y almacene directamente esa propiedad en la instancia. Incluso las propiedades que se acceden directamente pueden ocultar una llamada a un método. Dichos métodos se llaman _((getter))_ y se definen escribiendo `get` delante del nombre del método en una expresión de objeto o declaración de clase.

```{test: no}
let varyingSize = {
  get size() {
    return Math.floor(Math.random() * 100);
  }
};

console.log(varyingSize.size);
// → 73
console.log(varyingSize.size);
// → 49
```

{{index "ejemplo temperatura"}}

Cada vez que alguien lee la propiedad `size` de este objeto, se llama al método asociado. Puedes hacer algo similar cuando se escribe en una propiedad, utilizando un _((setter))_.

```{test: no, startCode: true}
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }

  static fromFahrenheit(value) {
    return new Temperature((value - 32) / 1.8);
  }
}

let temp = new Temperature(22);
console.log(temp.fahrenheit);
// → 71.6
temp.fahrenheit = 86;
console.log(temp.celsius);
// → 30
```

La clase `Temperature` te permite leer y escribir la temperatura en grados ((Celsius)) o grados ((Fahrenheit)), pero internamente solo almacena Celsius y convierte automáticamente de y a Celsius en el _getter_ y _setter_ de `fahrenheit`.

{{index "método estático", "propiedad estática"}}

A veces quieres adjuntar algunas propiedades directamente a tu función constructora, en lugar de al prototipo. Estos métodos no tendrán acceso a una instancia de clase, pero pueden, por ejemplo, usarse para proporcionar formas adicionales de crear instancias.

Dentro de una declaración de clase, los métodos o propiedades que tienen `static` escrito antes de su nombre se almacenan en el constructor. Por lo tanto, la clase `Temperature` te permite escribir `Temperature.fromFahrenheit(100)` para crear una temperatura usando grados Fahrenheit.

## Símbolos

{{index "bucle for/of", "interfaz iteradora"}}

Mencioné en [Capítulo ?](data#for_of_loop) que un bucle `for`/`of` puede recorrer varios tipos de estructuras de datos. Este es otro caso de polimorfismo: tales bucles esperan que la estructura de datos exponga una interfaz específica, la cual hacen los arrays y las cadenas. ¡Y también podemos agregar esta interfaz a nuestros propios objetos! Pero antes de hacerlo, debemos echar un vistazo breve al tipo de símbolo.

Es posible que múltiples interfaces utilicen el mismo nombre de propiedad para diferentes cosas. Por ejemplo, en objetos similares a arrays, `length` se refiere a la cantidad de elementos en la colección. Pero una interfaz de objeto que describa una ruta de senderismo podría usar `length` para proporcionar la longitud de la ruta en metros. No sería posible que un objeto cumpla con ambas interfaces.

Un objeto que intente ser una ruta y similar a un array (quizás para enumerar sus puntos de referencia) es algo un tanto improbable, y este tipo de problema no es tan común en la práctica. Pero para cosas como el protocolo de iteración, los diseñadores del lenguaje necesitaban un tipo de propiedad que _realmente_ no entrara en conflicto con ninguna otra. Por lo tanto, en 2015, se agregaron los _((símbolos))_ al lenguaje.

{{index "Función de símbolo", [propiedad, denominación]}}

La mayoría de las propiedades, incluidas todas las propiedades que hemos visto hasta ahora, se nombran con cadenas. Pero también es posible usar símbolos como nombres de propiedades. Los símbolos son valores creados con la función `Symbol`. A diferencia de las cadenas, los símbolos recién creados son únicos: no puedes crear el mismo símbolo dos veces.

```
let sym = Symbol("nombre");
console.log(sym == Symbol("nombre"));
// → false
Rabbit.prototype[sym] = 55;
console.log(killerRabbit[sym]);
// → 55
```

La cadena que pasas a `Symbol` se incluye cuando la conviertes en una cadena y puede facilitar reconocer un símbolo cuando, por ejemplo, se muestra en la consola. Pero no tiene otro significado más allá de eso: varios símbolos pueden tener el mismo nombre.

Ser tanto únicos como utilizables como nombres de propiedades hace que los símbolos sean adecuados para definir interfaces que pueden convivir pacíficamente junto a otras propiedades, independientemente de cuáles sean sus nombres.

```{includeCode: "líneas_superiores: 1"}
const longitud = Symbol("longitud");
Array.prototype[longitud] = 0;

console.log([1, 2].length);
// → 2
console.log([1, 2][longitud]);
// → 0
```

{{index [propiedad, denominación]}}

Es posible incluir propiedades de símbolos en expresiones de objetos y clases mediante el uso de ((corchetes)). Esto hace que la expresión entre los corchetes se evalúe para producir el nombre de la propiedad, análogo a la notación de acceso a propiedades mediante corchetes cuadrados.

```
let miViaje = {
  longitud: 2,
  0: "Lankwitz",
  1: "Babelsberg",
  [longitud]: 21500
};
console.log(miViaje[longitud], miViaje.longitud);
// → 21500 2
```

## La interfaz del iterador

{{index "interfaz iterable", "símbolo Symbol.iterator", "bucle for/of"}}

Se espera que el objeto proporcionado a un bucle `for`/`of` sea _iterable_. Esto significa que tiene un método nombrado con el símbolo `Symbol.iterator` (un valor de símbolo definido por el lenguaje, almacenado como una propiedad de la función `Symbol`).

{{index "interfaz del iterador", "método próximo"}}

Cuando se llama, ese método debería devolver un objeto que proporcione una segunda interfaz, _iterador_. Este es lo que realmente itera. Tiende un método `next` que devuelve el próximo resultado. Ese resultado debería ser un objeto con una propiedad `value` que proporciona el siguiente valor, si lo hay, y una propiedad `done`, que debería ser `true` cuando no hay más resultados y `false` en caso contrario.

Ten en cuenta que los nombres de propiedad `next`, `value` y `done` son simples cadenas, no símbolos. Solo `Symbol.iterator`, que probablemente se agregará a _muchos_ objetos diferentes, es un símbolo real.

Podemos usar esta interfaz directamente nosotros mismos.

```
let okIterador = "OK"[Symbol.iterator]();
console.log(okIterador.next());
// → {value: "O", done: false}
console.log(okIterador.next());
// → {value: "K", done: false}
console.log(okIterador.next());
// → {value: undefined, done: true}
```

{{index ["estructura de datos", lista], "lista enlazada", colección}}

Implementemos una estructura de datos iterable similar a la lista enlazada del ejercicio en [Capítulo ?](datos). Esta vez escribiremos la lista como una clase.```{includeCode: true}
class List {
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
```

Toma en cuenta que `this`, en un método estático, apunta al constructor de la clase, no a una instancia, ya que no hay una instancia disponible cuando se llama a un método estático.

Iterar sobre una lista debería devolver todos los elementos de la lista desde el principio hasta el final. Escribiremos una clase separada para el iterador.

{{index "Clase ListIterator"}}

```{includeCode: true}
class ListIterator {
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
```

La clase realiza un seguimiento del progreso de la iteración a través de la lista actualizando su propiedad `list` para moverse al siguiente objeto de lista cada vez que se devuelve un valor, y reporta que ha terminado cuando esa lista está vacía (null).

Ahora configuraremos la clase `List` para que sea iterable. A lo largo de este libro, ocasionalmente utilizaré la manipulación de prototipos posterior al hecho para agregar métodos a las clases de modo que las piezas individuales de código se mantengan pequeñas y autónomas. En un programa regular, donde no hay necesidad de dividir el código en piezas pequeñas, declararías estos métodos directamente en la clase en su lugar.

```{includeCode: true}
List.prototype[Symbol.iterator] = function() {
  return new ListIterator(this);
};
```

{{index "bucle for/of"}}

Ahora podemos iterar sobre una lista con `for`/`of`.

```
let lista = List.fromArray([1, 2, 3]);
for (let elemento of lista) {
  console.log(elemento);
}
// → 1
// → 2
// → 3
```

{{index "spread"}}

La sintaxis `...` en notación de arrays y en llamadas a funciones funciona de forma similar con cualquier objeto iterable. Por ejemplo, puedes usar `[...valor]` para crear un array que contenga los elementos de un objeto iterable arbitrario.

```
console.log([... "PCI"]);
// → ["P", "C", "I"]
```

## Herencia

{{index "herencia, "lista enlazada", "programación orientada a objetos", "Clase LengthList"}}

Imaginemos que necesitamos un tipo de lista, bastante parecido a la clase `List` que vimos anteriormente, pero como siempre estaremos preguntando por su longitud, no queremos tener que recorrer su `rest` cada vez, en su lugar, queremos almacenar la longitud en cada instancia para un acceso eficiente.

{{index "anulación, prototipo"}}

El sistema de prototipos de JavaScript permite crear una _nueva_ clase, muy similar a la clase antigua, pero con nuevas definiciones para algunas de sus propiedades. El prototipo de la nueva clase se deriva del prototipo antiguo pero agrega una nueva definición, por ejemplo, para el `getter` de `length`.

En términos de programación orientada a objetos, esto se llama _((herencia))_. La nueva clase hereda propiedades y comportamientos de la clase antigua.

```{includeCode: "top_lines: 17"}
class LengthList extends List {
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
// → 3
```

El uso de la palabra `extends` indica que esta clase no debería basarse directamente en el prototipo predeterminado de `Object`, sino en alguna otra clase. Esta se llama la _((superclase))_. La clase derivada es la _((subclase))_.

Para inicializar una instancia de `LengthList`, el constructor llama al constructor de su superclase a través de la palabra clave `super`. Esto es necesario porque si este nuevo objeto se va a comportar (aproximadamente) como una `List`, va a necesitar las propiedades de instancia que tienen las listas.

Luego, el constructor almacena la longitud de la lista en una propiedad privada. Si hubiéramos escrito `this.longitud` ahí, se habría llamado al getter de la propia clase, lo cual no funciona aún, ya que `#longitud` aún no ha sido completado. Podemos usar `super.algo` para llamar a métodos y getters en el prototipo de la superclase, lo cual a menudo es útil.

La herencia nos permite construir tipos de datos ligeramente diferentes a partir de tipos de datos existentes con relativamente poco trabajo. Es una parte fundamental de la tradición orientada a objetos, junto con la encapsulación y la polimorfismo. Pero, mientras que los dos últimos se consideran generalmente ideas maravillosas, la herencia es más controvertida.

{{index complejidad, "reutilización", "jerarquía de clases"}}

Mientras que ((encapsulación)) y polimorfismo se pueden utilizar para _separar_ las piezas de código unas de otras, reduciendo el enredo del programa en general, ((herencia)) fundamentalmente ata clases juntas, creando _más_ enredo. Al heredar de una clase, generalmente tienes que saber más sobre cómo funciona que cuando simplemente la usas. La herencia puede ser una herramienta útil para hacer que algunos tipos de programas sean más concisos, pero no debería ser la primera herramienta a la que recurras, y probablemente no deberías buscar activamente oportunidades para construir jerarquías de clases (árboles genealógicos de clases).

## El operador instanceof

{{index tipo, "operador instanceof", constructor, objeto}}

A veces es útil saber si un objeto se derivó de una clase específica. Para esto, JavaScript proporciona un operador binario llamado `instanceof`.

```
console.log(
  new LengthList(1, null) instanceof LengthList);
// → true
console.log(new LengthList(2, null) instanceof List);
// → true
console.log(new List(3, null) instanceof LengthList);
// → false
console.log([1] instanceof Array);
// → true
```

{{index herencia}}

El operador podrá ver a través de tipos heredados, por lo que un `LengthList` es una instancia de `List`. El operador también se puede aplicar a constructores estándar como `Array`. Casi todo objeto es una instancia de `Object`.

## Resumen

Los objetos hacen más que simplemente contener sus propias propiedades. Tienen prototipos, que son otros objetos. Actuarán como si tuvieran propiedades que no tienen siempre y cuando su prototipo tenga esa propiedad. Los objetos simples tienen `Object.prototype` como su prototipo.

Los constructores, que son funciones cuyos nombres generalmente comienzan con una letra mayúscula, se pueden usar con el operador `new` para crear nuevos objetos. El prototipo del nuevo objeto será el objeto encontrado en la propiedad `prototype` del constructor. Puedes sacar buen provecho de esto poniendo las propiedades que comparten todos los valores de un tipo dado en su prototipo. Existe una notación de `class` que proporciona una forma clara de definir un constructor y su prototipo.

Puedes definir getters y setters para llamar secretamente a métodos cada vez que se accede a una propiedad de un objeto. Los métodos estáticos son métodos almacenados en el constructor de una clase, en lugar de en su prototipo.

El operador `instanceof` puede, dado un objeto y un constructor, decirte si ese objeto es una instancia de ese constructor.

Una cosa útil que se puede hacer con objetos es especificar una interfaz para ellos y decirle a todo el mundo que se supone que deben comunicarse con tu objeto solo a través de esa interfaz. El resto de los detalles que componen tu objeto están ahora _encapsulados_, escondidos detrás de la interfaz. Puedes usar propiedades privadas para ocultar una parte de tu objeto del mundo exterior.

Más de un tipo puede implementar la misma interfaz. El código escrito para usar una interfaz automáticamente sabe cómo trabajar con cualquier número de objetos diferentes que proporcionen la interfaz. Esto se llama _polimorfismo_.

Cuando se implementan múltiples clases que difieren solo en algunos detalles, puede ser útil escribir las nuevas clases como _subclases_ de una clase existente, _heredando_ parte de su comportamiento.

## Ejercicios

{{id exercise_vector}}

### Un tipo de vector

{{index dimensions, "Clase Vec", coordenadas, "vector (ejercicio)"}}

Escribe una clase `Vec` que represente un vector en el espacio bidimensional. Toma los parámetros `x` e `y` (números), que debería guardar en propiedades del mismo nombre.

{{index "adición", sustracción}}

Dale a la clase `Vec` dos métodos en su prototipo, `plus` y `minus`, que tomen otro vector como parámetro y devuelvan un nuevo vector que tenga la suma o la diferencia de los valores _x_ e _y_ de los dos vectores (`this` y el parámetro).

Agrega una propiedad ((getter)) `length` al prototipo que calcule la longitud del vector, es decir, la distancia del punto (_x_, _y_) desde el origen (0, 0).

{{if interactive

```{test: no}
// Tu código aquí.

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// → 5
```
if}}

{{hint

{{index "vector (exercise)"}}

Mira de nuevo el ejemplo de la clase `Rabbit` si no estás seguro de cómo se ven las declaraciones de `class`.

{{index "Pitágoras", "defineProperty function", "raíz cuadrada", "Math.sqrt function"}}

Agregar una propiedad getter al constructor se puede hacer poniendo la palabra `get` antes del nombre del método. Para calcular la distancia desde (0, 0) hasta (x, y), puedes usar el teorema de Pitágoras, que dice que el cuadrado de la distancia que estamos buscando es igual al cuadrado de la coordenada x más el cuadrado de la coordenada y. Por lo tanto, [√(x^2^ + y^2^)]{if html}[[$\sqrt{x^2 + y^2}$]{latex}]{if tex} es el número que buscas. `Math.sqrt` es la forma de calcular una raíz cuadrada en JavaScript y `x ** 2` se puede usar para elevar al cuadrado un número.

hint}}

### Grupos

{{index "groups (exercise)", "Clase Set", "Clase Group", "conjunto (estructura de datos)"}}

{{id groups}}

El entorno estándar de JavaScript proporciona otra estructura de datos llamada `Set`. Al igual que una instancia de `Map`, un conjunto contiene una colección de valores. A diferencia de `Map`, no asocia otros valores con esos, solo realiza un seguimiento de qué valores forman parte del conjunto. Un valor puede formar parte de un conjunto solo una vez: agregarlo nuevamente no tiene ningún efecto.

{{index "método add", "método delete", "método has"}}

Escribe una clase llamada `Group` (ya que `Set` está siendo utilizado). Al igual que `Set`, tiene los métodos `add`, `delete` y `has`. Su constructor crea un grupo vacío, `add` agrega un valor al grupo (pero solo si aún no es miembro), `delete` elimina su argumento del grupo (si era miembro), y `has` devuelve un valor booleano que indica si su argumento es miembro del grupo.

{{index "operador ===", "método indexOf"}}

Usa el operador `===`, o algo equivalente como `indexOf`, para determinar si dos valores son iguales.

{{index "método estático"}}

Dale a la clase un método estático `from` que tome un objeto iterable como argumento y cree un grupo que contenga todos los valores producidos al iterar sobre él.

{{if interactive

```{test: no}
class Group {
  // Tu código aquí.
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
```

if}}

{{hint

{{index "grupos (ejercicio)", "clase Group", "método indexOf", "método includes"}}

La forma más sencilla de hacer esto es almacenar un array de miembros del grupo en una propiedad de instancia. Los métodos `includes` o `indexOf` se pueden usar para verificar si un valor dado está en el array.

{{index "método push"}}

El constructor de tu clase puede establecer la colección de miembros en un array vacío. Cuando se llama a `add`, debe verificar si el valor dado está en el array o agregarlo, por ejemplo con `push`, de lo contrario.

{{index "método filter"}}

Eliminar un elemento de un array, en `delete`, es menos directo, pero puedes usar `filter` para crear un nuevo array sin el valor. No olvides sobrescribir la propiedad que contiene los miembros con la nueva versión filtrada del array.

{{index "bucle for/of", "interfaz iterable"}}

El método `from` puede usar un bucle `for`/`of` para obtener los valores del objeto iterable y llamar a `add` para colocarlos en un grupo recién creado.

hint}}

### Grupos iterables

{{index "grupos (ejercicio)", [interfaz, objeto], "interfaz del iterador", "clase Group"}}

{{id group_iterator}}

Haz que la clase `Group` del ejercicio anterior sea iterable. Refiérete a la sección sobre la interfaz del iterador anteriormente en el capítulo si no tienes claro la forma exacta de la interfaz.

Si utilizaste un array para representar los miembros del grupo, no devuelvas simplemente el iterador creado al llamar al método `Symbol.iterator` en el array. Eso funcionaría, pero va en contra del propósito de este ejercicio.

Está bien si tu iterador se comporta de manera extraña cuando el grupo se modifica durante la iteración.

{{if interactive

```{test: no}
// Tu código aquí (y el código del ejercicio anterior)

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c
```

if}}

{{hint

{{index "grupos (ejercicio)", "clase Group", "método next"}}

Probablemente valga la pena definir una nueva clase `GroupIterator`. Las instancias del iterador deberían tener una propiedad que rastree la posición actual en el grupo. Cada vez que se llama a `next`, verifica si ha terminado y, si no, avanza más allá del valor actual y lo devuelve.

La clase `Group` en sí misma obtiene un método nombrado `Symbol.iterator` que, al ser llamado, devuelve una nueva instancia de la clase iteradora para ese grupo.

hint}}