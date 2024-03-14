{{meta {load_files: ["code/journal.js", "code/chapter/04_data.js"], zip: "node/html"}}}

# Estructuras de datos: Objetos y Arrays

{{quote {author: "Charles Babbage", title: "Passages from the Life of a Philosopher (1864)", chapter: true}

En dos ocasiones me han preguntado: 'Dígame, Sr. Babbage, si introduce en la máquina cifras erróneas, ¿saldrán respuestas correctas?' [...] No soy capaz de entender correctamente el tipo de confusión de ideas que podría provocar tal pregunta.

quote}}

{{index "Babbage, Charles"}}

{{figure {url: "img/chapter_picture_4.jpg", alt: "Ilustración de una ardilla junto a un montón de libros y un par de gafas. Se pueden ver la luna y las estrellas en el fondo.", chapter: framed}}}

{{index objeto, "estructura de datos"}}

Números, booleanos y cadenas de texto son los átomos a partir de los cuales se construyen las estructuras de ((datos)). Sin embargo, muchos tipos de información requieren más de un átomo. Los _objetos_ nos permiten agrupar valores, incluyendo otros objetos, para construir estructuras más complejas.

Hasta ahora, los programas que hemos creado han estado limitados por el hecho de que operaban solo en tipos de datos simples. Después de aprender los conceptos básicos de estructuras de datos en este capítulo, sabrás lo suficiente como para comenzar a escribir programas útiles.

El capítulo trabajará a través de un ejemplo de programación más o menos realista, introduciendo conceptos a medida que se aplican al problema en cuestión. El código de ejemplo a menudo se basará en funciones y variables introducidas anteriormente en el libro.

{{if libro

El ((sandbox)) en línea para el libro ([_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code)) ofrece una forma de ejecutar código en el contexto de un capítulo en particular. Si decides trabajar a través de los ejemplos en otro entorno, asegúrate de descargar primero el código completo de este capítulo desde la página del sandbox.

if}}

## El hombreardilla

{{index "ejemplo hombreardilla", "licantropía"}}

De vez en cuando, usualmente entre las 8 p. m. y las 10 p. m., ((Jacques)) se encuentra transformándose en un pequeño roedor peludo con una cola espesa.

Por un lado, Jacques está bastante contento de no tener licantropía clásica. Convertirse en una ardilla causa menos problemas que convertirse en un lobo. En lugar de preocuparse por comer accidentalmente al vecino (_eso_ sería incómodo), se preocupa por ser comido por el gato del vecino. Después de dos ocasiones de despertar en una rama precariamente delgada en la copa de un roble, desnudo y desorientado, ha optado por cerrar con llave las puertas y ventanas de su habitación por la noche y poner unas cuantas nueces en el suelo para mantenerse ocupado.

Pero Jacques preferiría deshacerse por completo de su condición. Las ocurrencias irregulares de la transformación hacen que sospeche que podrían ser desencadenadas por algo. Durante un tiempo, creyó que sucedía solo en días en los que había estado cerca de robles. Sin embargo, evitar los robles no resolvió el problema.

{{index diario}}

Cambió a un enfoque más científico, Jacques ha comenzado a llevar un registro diario de todo lo que hace en un día dado y si cambió de forma. Con estos datos, espera estrechar las condiciones que desencadenan las transformaciones.Lo primero que necesita es una estructura de datos para almacenar esta información.

## Conjuntos de datos

{{index ["estructura de datos", "colección"], [memoria, "organización"]}}

Para trabajar con un conjunto de datos digitales, primero tenemos que encontrar una forma de representarlo en la memoria de nuestra máquina. Digamos, por ejemplo, que queremos representar una ((colección)) de los números 2, 3, 5, 7 y 11.

{{index string}}

Podríamos ser creativos con las cadenas, después de todo, las cadenas pueden tener cualquier longitud, por lo que podemos poner muchos datos en ellas, y usar `"2 3 5 7 11"` como nuestra representación. Pero esto es incómodo. Tendríamos que extraer de alguna manera los dígitos y convertirlos de vuelta a números para acceder a ellos.

{{index [array, "creación"], "[] (arreglo)"}}

Afortunadamente, JavaScript proporciona un tipo de dato específicamente para almacenar secuencias de valores. Se llama un _array_ y se escribe como una lista de valores entre ((corchetes)), separados por comas:

```
let listaDeNumeros = [2, 3, 5, 7, 11];
console.log(listaDeNumeros[2]);
// → 5
console.log(listaDeNumeros[0]);
// → 2
console.log(listaDeNumeros[2 - 1]);
// → 3
```

{{index "[] (subíndice)", [array, "indexación"]}}

La notación para acceder a los elementos dentro de un array también utiliza ((corchetes)). Un par de corchetes inmediatamente después de una expresión, con otra expresión dentro de ellos, buscará el elemento en la expresión de la izquierda que corresponde al _((índice))_ dado por la expresión en los corchetes.

{{id array_indexing}}

{{index "conteo basado en cero"}}

El primer índice de un array es cero, no uno, por lo que el primer elemento se recupera con `listaDeNumeros[0]`. El conteo basado en cero tiene una larga tradición en tecnología y de ciertas maneras tiene mucho sentido, pero requiere cierta acostumbrarse. Piensa en el índice como el número de elementos a omitir, contando desde el inicio del array.

{{id propiedades}}

## Propiedades

{{index "objeto Math", "función Math.max", ["propiedad longitud", "para cadenas"], [objeto, propiedad], "carácter punto", [acceso de propiedad]}}

Hemos visto algunas expresiones como `miCadena.length` (para obtener la longitud de una cadena) y `Math.max` (la función máxima) en capítulos anteriores. Estas expresiones acceden a una _propiedad_ de algún valor. En el primer caso, accedemos a la propiedad `length` del valor en `miCadena`. En el segundo, accedemos a la propiedad llamada `max` en el objeto `Math` (que es una colección de constantes y funciones relacionadas con matemáticas).

{{index ["acceso de propiedad"], null, undefined}}

Casi todos los valores de JavaScript tienen propiedades. Las excepciones son `null` y `undefined`. Si intentas acceder a una propiedad en uno de estos valores no definidos, obtendrás un error:

```{test: no}
null.length;
// → TypeError: null no tiene propiedades
```

{{indexsee "carácter punto", "carácter punto"}}
{{index "[] (subíndice)", "carácter punto", "corchetes", "propiedad calculada", ["acceso de propiedad"]}}

Las dos formas principales de acceder a propiedades en JavaScript son con un punto y con corchetes. Tanto `valor.x` como `valor[x]` acceden a una propiedad en `valor`, pero no necesariamente a la misma propiedad. La diferencia radica en cómo se interpreta `x`. Al usar un punto, la palabra después del punto es el nombre literal de la propiedad. Al usar corchetes, la expresión entre los corchetes es _evaluada_ para obtener el nombre de la propiedad. Mientras que `valor.x` obtiene la propiedad de `valor` llamada "x", `valor[x]` toma el valor de la variable llamada `x` y lo utiliza, convertido a cadena, como nombre de propiedad.Si sabes que la propiedad en la que estás interesado se llama _color_, dices `valor.color`. Si quieres extraer la propiedad nombrada por el valor almacenado en la vinculación `i`, dices `valor[i]`. Los nombres de las propiedades son cadenas de texto. Pueden ser cualquier cadena, pero la notación de punto solo funciona con nombres que parecen nombres de vinculaciones válidos, comenzando con una letra o guion bajo, y conteniendo solo letras, números y guiones bajos. Si deseas acceder a una propiedad llamada _2_ o _John Doe_, debes utilizar corchetes: `valor[2]` o `valor["John Doe"]`.

Los elementos en un ((array)) se almacenan como propiedades del array, utilizando números como nombres de propiedades. Dado que no puedes usar la notación de punto con números y generalmente quieres usar una vinculación que contenga el índice de todos modos, debes utilizar la notación de corchetes para acceder a ellos.

{{index ["propiedad longitud", "para array"], [array, "longitud de"]}}

Al igual que las cadenas de texto, los arrays tienen una propiedad `length` que nos dice cuántos elementos tiene el array.

{{id "métodos"}}

## Métodos

{{index ["función", "como propiedad"], "método", cadena}}

Tanto los valores de cadena como los de array contienen, además de la propiedad `length`, varias propiedades que contienen valores de función.

```
let doh = "Doh";
console.log(typeof doh.toUpperCase);
// → function
console.log(doh.toUpperCase());
// → DOH
```

{{index "conversión de mayúsculas y minúsculas", "método toUpperCase", "método toLowerCase"}}

Cada cadena de texto tiene una propiedad `toUpperCase`. Cuando se llama, devolverá una copia de la cadena en la que todas las letras se han convertido a mayúsculas. También existe `toLowerCase`, que hace lo contrario.

{{index "vinculación de this"}}

Curiosamente, aunque la llamada a `toUpperCase` no pasa argumentos, de alguna manera la función tiene acceso a la cadena `"Doh"`, el valor cuya propiedad llamamos. Descubrirás cómo funciona esto en [Capítulo ?](object#obj_methods).

Las propiedades que contienen funciones generalmente se llaman _métodos_ del valor al que pertenecen, como en "`toUpperCase` es un método de una cadena".

{{id "métodos_de_array"}}

Este ejemplo demuestra dos métodos que puedes utilizar para manipular arrays:

```
let secuencia = [1, 2, 3];
secuencia.push(4);
secuencia.push(5);
console.log(secuencia);
// → [1, 2, 3, 4, 5]
console.log(secuencia.pop());
// → 5
console.log(secuencia);
// → [1, 2, 3, 4]
```

{{index "colección", array, "método push", "método pop"}}

El método `push` agrega valores al final de un array. El método `pop` hace lo opuesto, eliminando el último valor en el array y devolviéndolo.

{{index ["estructura de datos", pila]}}

Estos nombres un tanto tontos son términos tradicionales para operaciones en una _((pila))_. Una pila, en programación, es una estructura de datos que te permite agregar valores a ella y sacarlos en el orden opuesto para que lo que se agregó último se elimine primero. Las pilas son comunes en programación; es posible que recuerdes la función ((call stack)) del [capítulo anterior](functions#stack), que es una instancia de la misma idea.

## Objetos

{{index diario, "ejemplo weresquirrel", array, registro}}

De vuelta al hombre-ardilla. Un conjunto de entradas de registro diario se puede representar como un array, pero las entradas no consisten solo en un número o una cadena, cada entrada necesita almacenar una lista de actividades y un valor booleano que indique si Jacques se convirtió en ardilla o no. Idealmente, nos gustaría agrupar estos elementos en un único valor y luego poner esos valores agrupados en un array de entradas de registro.

Los valores del tipo ((object)) son colecciones arbitrarias de propiedades. Una forma de crear un objeto es usando llaves como una expresión:

```
let dia1 = {
  hombreArdilla: false,
  eventos: ["trabajo", "tocó árbol", "pizza", "correr"]
};
console.log(dia1.hombreArdilla);
// → false
console.log(dia1.lobo);
// → undefined
dia1.lobo = false;
console.log(dia1.lobo);
// → false
```

Dentro de las llaves, se escribe una lista de propiedades separadas por comas. Cada propiedad tiene un nombre seguido por dos puntos y un valor. Cuando un objeto se escribe en varias líneas, indentarlo como se muestra en este ejemplo ayuda a la legibilidad. Las propiedades cuyos nombres no son nombres de enlace válidos o números válidos deben ir entre comillas:

```
let descripciones = {
  trabajo: "Fui a trabajar",
  "tocó árbol": "Tocó un árbol"
};
```

Esto significa que las llaves tienen _dos_ significados en JavaScript. Al principio de una ((sentencia)), comienzan un ((bloque)) de sentencias. En cualquier otra posición, describen un objeto. Afortunadamente, rara vez es útil comenzar una sentencia con un objeto entre llaves, por lo que la ambigüedad entre estos dos casos no es gran problema. El único caso en el que esto surge es cuando quiere devolver un objeto desde una función flecha abreviada: no puede escribir `n => {prop: n}`, ya que las llaves se interpretarán como el cuerpo de una función. En cambio, debe poner un conjunto de paréntesis alrededor del objeto para dejar claro que es una expresión.

Al leer una propiedad que no existe, obtendrás el valor `undefined`.

Es posible asignar un valor a una expresión de propiedad con el operador `=`. Esto reemplazará el valor de la propiedad si ya existía o creará una nueva propiedad en el objeto si no existía.

Para volver brevemente a nuestro modelo de tentáculos de ((enlace))s, los enlaces de propiedad son similares. _Agarran_ valores, pero otros enlaces y propiedades podrían estar aferrándose a esos mismos valores. Puedes pensar en los objetos como pulpos con cualquier cantidad de tentáculos, cada uno con un nombre escrito en él.

El operador `delete` corta un tentáculo de dicho pulpo. Es un operador unario que, cuando se aplica a una propiedad de un objeto, eliminará la propiedad nombrada del objeto. Esto no es algo común de hacer, pero es posible.

```
let unObjeto = {izquierda: 1, derecha: 2};
console.log(unObjeto.izquierda);
// → 1
delete unObjeto.izquierda;
console.log(unObjeto.izquierda);
// → undefined
console.log("izquierda" in unObjeto);
// → false
console.log("derecha" in unObjeto);
// → true
```

{{index "operador in", [propiedad, "prueba de"], objeto}}

El operador binario `in`, cuando se aplica a una cadena y un objeto, te dice si ese objeto tiene una propiedad con ese nombre. La diferencia entre establecer una propiedad como `undefined` y realmente borrarla es que, en el primer caso, el objeto todavía _tiene_ la propiedad (simplemente no tiene un valor muy interesante), mientras que en el segundo caso la propiedad ya no está presente y `in` devolverá `false`.

{{index "función Object.keys"}}

Para averiguar qué propiedades tiene un objeto, puedes utilizar la función `Object.keys`. Al darle la función un objeto, devolverá un array de cadenas: los nombres de las propiedades del objeto:

```
console.log(Object.keys({x: 0, y: 0, z: 2}));
// → ["x", "y", "z"]
```

Existe una función `Object.assign` que copia todas las propiedades de un objeto en otro:

```
let objetoA = {a: 1, b: 2};
Object.assign(objetoA, {b: 3, c: 4});
console.log(objetoA);
// → {a: 1, b: 3, c: 4}
```

{{index array, "colección"}}

Los arrays, entonces, son solo un tipo de objeto especializado para almacenar secuencias de cosas. Si evalúas `typeof []`, producirá `"object"`. Puedes visualizar los arrays como pulpos largos y planos con todos sus tentáculos en una fila ordenada, etiquetados con números.

{{index diario, "ejemplo de ardilla"}}

Jacques representará el diario que lleva como un array de objetos:

```{test: wrap}
let diario = [
  {eventos: ["trabajo", "tocó árbol", "pizza",
            "corrió", "televisión"],
   ardilla: false},
  {eventos: ["trabajo", "helado", "coliflor",
            "lasaña", "tocó árbol", "se cepilló los dientes"],
   ardilla: false},
  {eventos: ["fin de semana", "ciclismo", "descanso", "cacahuetes",
            "cerveza"],
   ardilla: true},
  /* y así sucesivamente... */
];
```

## Mutabilidad

Pronto llegaremos a la programación real, pero primero, hay una pieza más de teoría para entender.

{{index mutabilidad, "efecto secundario", "número", cadena, booleano, [objeto, mutabilidad]}}

Vimos que los valores de objetos pueden modificarse. Los tipos de valores discutidos en capítulos anteriores, como números, cadenas y booleanos, son todos _((inmutables))_—es imposible cambiar valores de esos tipos. Puedes combinarlos y derivar nuevos valores de ellos, pero al tomar un valor específico de cadena, ese valor siempre permanecerá igual. El texto dentro de él no puede ser cambiado. Si tienes una cadena que contiene `"gato"`, no es posible que otro código cambie un carácter en tu cadena para que diga `"rata"`.

Los objetos funcionan de manera diferente. _Puedes_ cambiar sus propiedades, lo que hace que un valor de objeto tenga un contenido diferente en momentos diferentes.

{{index [objeto, identidad], identidad, ["organización", memoria], mutabilidad}}

Cuando tenemos dos números, 120 y 120, podemos considerarlos precisamente el mismo número, tanto si se refieren a los mismos bits físicos como si no. Con los objetos, hay una diferencia entre tener dos referencias al mismo objeto y tener dos objetos diferentes que contienen las mismas propiedades. Considera el siguiente código:

```
let object1 = {value: 10};
let object2 = object1;
let object3 = {value: 10};

console.log(object1 == object2);
// → true
console.log(object1 == object3);
// → false

object1.value = 15;
console.log(object2.value);
// → 15
console.log(object3.value);
// → 10
```

{{index "tentacle (analogy)", [binding, "model of"]}}

Las asignaciones `object1` y `object2` contienen la _misma_ referencia al objeto, por lo que al cambiar `object1` también se cambia el valor de `object2`. Se dice que tienen la misma _identidad_. La asignación `object3` apunta a un objeto diferente, que inicialmente contiene las mismas propiedades que `object1` pero vive una vida separada.

{{index "const keyword", "let keyword", [binding, "as state"]}}

Las asignaciones pueden ser modificables o constantes, pero esto es independiente de cómo se comportan sus valores. Aunque los valores numéricos no cambian, puedes utilizar una asignación `let` para hacer un seguimiento de un número que cambia al cambiar el valor al que apunta la asignación. De manera similar, aunque una asignación `const` a un objeto en sí no puede cambiarse y seguirá apuntando al mismo objeto, los _contenidos_ de ese objeto pueden cambiar.

```{test: no}
const score = {visitors: 0, home: 0};
// Esto está bien
score.visitors = 1;
// Esto no está permitido
score = {visitors: 1, home: 1};
```

{{index "== operator", [comparison, "of objects"], "deep comparison"}}

Cuando se comparan objetos con el operador `==` de JavaScript, se compara por identidad: producirá `true` solo si ambos objetos son exactamente el mismo valor. Comparar objetos diferentes devolverá `false`, incluso si tienen propiedades idénticas. No hay una operación de comparación "profunda" incorporada en JavaScript que compare objetos por contenido, pero es posible escribirla tú mismo (lo cual es uno de los [ejercicios](data#exercise_deep_compare) al final de este capítulo).

## El diario del licántropo

{{index "weresquirrel example", lycanthropy, "addEntry function"}}

Jacques inicia su intérprete de JavaScript y configura el entorno que necesita para mantener su ((diario)):

```{includeCode: true}
let journal = [];

function addEntry(events, squirrel) {
  journal.push({events, squirrel});
}
```

{{index [braces, object], "{} (object)", [property, definition]}}

Observa que el objeto agregado al diario luce un poco extraño. En lugar de declarar propiedades como `events: events`, simplemente se da un nombre de propiedad: `events`. Esta es una forma abreviada que significa lo mismo: si un nombre de propiedad en notación de llaves no va seguido de un valor, su valor se toma del enlace con el mismo nombre.

Cada noche a las 10 p.m., o a veces a la mañana siguiente después de bajar de la repisa superior de su estantería, Jacques registra el día:

```
addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
addEntry(["work", "ice cream", "cauliflower", "lasagna",
          "touched tree", "brushed teeth"], false);
addEntry(["weekend", "cycling", "break", "peanuts",
          "beer"], true);
```

Una vez que tiene suficientes puntos de datos, tiene la intención de utilizar estadísticas para descubrir qué eventos pueden estar relacionados con las transformaciones en ardilla.

{{index "correlación"}}

La _correlación_ es una medida de la ((dependencia)) entre variables estadísticas. Una variable estadística no es exactamente igual a una variable de programación. En estadística, típicamente tienes un conjunto de _mediciones_, y cada variable se mide para cada medición. La correlación entre variables suele expresarse como un valor que va de -1 a 1. Una correlación de cero significa que las variables no están relacionadas. Una correlación de 1 indica que las dos están perfectamente relacionadas: si conoces una, también conoces la otra. Un -1 también significa que las variables están perfectamente relacionadas pero son opuestas: cuando una es verdadera, la otra es falsa.

{{index del "coeficiente phi"}}

Para calcular la medida de correlación entre dos variables booleanas, podemos utilizar el _coeficiente phi_ (_ϕ_). Esta es una fórmula cuya entrada es una ((tabla de frecuencias)) que contiene la cantidad de veces que se observaron las diferentes combinaciones de las variables. La salida de la fórmula es un número entre -1 y 1 que describe la correlación.

Podríamos tomar el evento de comer ((pizza)) y ponerlo en una tabla de frecuencias como esta, donde cada número indica la cantidad de veces que ocurrió esa combinación en nuestras mediciones.

{{figure {url: "img/pizza-squirrel.svg", alt: "Una tabla de dos por dos que muestra la variable pizza en el eje horizontal y la variable ardilla en el eje vertical. Cada celda muestra cuántas veces ocurrió esa combinación. En 76 casos, ninguna ocurrió. En 9 casos, solo la pizza era verdadera. En 4 casos, solo la ardilla era verdadera. Y en un caso ambas ocurrieron.", width: "7cm"}}}

Si llamamos a esa tabla _n_, podemos calcular _ϕ_ utilizando la siguiente fórmula:

{{if html

<div> <table style="border-collapse: collapse; margin-left: 1em;"><tr>   <td style="vertical-align: middle"><em>ϕ</em> =</td>   <td style="padding-left: .5em">     <div style="border-bottom: 1px solid black; padding: 0 7px;"><em>n</em><sub>11</sub><em>n</em><sub>00</sub> −       <em>n</em><sub>10</sub><em>n</em><sub>01</sub></div>     <div style="padding: 0 7px;">√<span style="border-top: 1px solid black; position: relative; top: 2px;">       <span style="position: relative; top: -4px"><em>n</em><sub>1•</sub><em>n</em><sub>0•</sub><em>n</em><sub>•1</sub><em>n</em><sub>•0</sub></span>     </span></div>   </td> </tr></table> </div>

if}}

{{if tex

[\begin{equation}\varphi = \frac{n_{11}n_{00}-n_{10}n_{01}}{\sqrt{n_{1\bullet}n_{0\bullet}n_{\bullet1}n_{\bullet0}}}\end{equation}]{latex}

if}}

(Si en este punto estás dejando el libro para concentrarte en un terrible flashback a la clase de matemáticas de décimo grado, ¡espera! No pretendo torturarte con interminables páginas de notación críptica, solo es esta fórmula por ahora. Y incluso con esta, todo lo que haremos es convertirla en JavaScript).

La notación [_n_~01~]{if html}[[$n_{01}$]{latex}]{if tex} indica la cantidad de mediciones donde la primera variable (ardillez) es falsa (0) y la segunda variable (pizza) es verdadera (1). En la tabla de pizza, [_n_~01~]{if html}[[$n_{01}$]{latex}]{if tex} es 9.El valor [_n_~1•~]{if html}[[$n_{1\bullet}$]{latex}]{if tex} se refiere a la suma de todas las mediciones donde la primera variable es verdadera, que es 5 en el ejemplo de la tabla. De manera similar, [_n_~•0~]{if html}[[$n_{\bullet0}$]{latex}]{if tex} se refiere a la suma de las mediciones donde la segunda variable es falsa.

{{index "correlación", "coeficiente phi"}}

Entonces para la tabla de pizza, la parte encima de la línea de división (el dividendo) sería 1×76−4×9 = 40, y la parte debajo de ella (el divisor) sería la raíz cuadrada de 5×85×10×80, o [√340,000]{if html}[[$\sqrt{340,000}$]{latex}]{if tex}. Esto da un valor de _ϕ_ ≈ 0.069, que es muy pequeño. Comer ((pizza)) no parece tener influencia en las transformaciones.

## Calculando la correlación

{{index [array, "como tabla"], ["anidación", "de arrays"]}}

Podemos representar una tabla dos por dos en JavaScript con un array de cuatro elementos (`[76, 9, 4, 1]`). También podríamos usar otras representaciones, como un array que contiene dos arrays de dos elementos cada uno (`[[76, 9], [4, 1]]`) o un objeto con nombres de propiedades como `"11"` y `"01"`, pero el array plano es simple y hace que las expresiones que acceden a la tabla sean agradabemente cortas. Interpretaremos los índices del array como números binarios de dos bits, donde el dígito más a la izquierda (más significativo) se refiere a la variable ardilla y el dígito más a la derecha (menos significativo) se refiere a la variable de evento. Por ejemplo, el número binario `10` se refiere al caso donde Jacques se transformó en ardilla, pero el evento (digamos, "pizza") no ocurrió. Esto sucedió cuatro veces. Y como `10` en binario es 2 en notación decimal, almacenaremos este número en el índice 2 del array.

{{index "coeficiente phi", "función phi"}}

{{id phi_function}}

Esta es la función que calcula el coeficiente _ϕ_ a partir de dicho array:

```{includeCode: strip_log, test: clip}
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

console.log(phi([76, 9, 4, 1]));
// → 0.068599434
```

{{index "raíz cuadrada", "función Math.sqrt"}}

Esta es una traducción directa de la fórmula de _ϕ_ a JavaScript. `Math.sqrt` es la función de raíz cuadrada, como se provee en el objeto `Math` en un entorno estándar de JavaScript. Debemos agregar dos campos de la tabla para obtener campos como [n~1•~]{if html}[[$n_{1\bullet}$]{latex}]{if tex} porque las sumas de filas o columnas no se almacenan directamente en nuestra estructura de datos.

{{index "conjunto de datos JOURNAL"}}

Jacques mantiene su diario por tres meses. El ((conjunto de datos)) resultante está disponible en el [sandbox de código](https://eloquentjavascript.net/code#4) para este capítulo[ ([_https://eloquentjavascript.net/code#4_](https://eloquentjavascript.net/code#4))]{if book}, donde se almacena en el vínculo `JOURNAL`, y en un archivo descargable [aquí](https://eloquentjavascript.net/code/journal.js).

{{index "función tableFor"}}

Para extraer una tabla dos por dos para un evento específico del diario, debemos recorrer todas las entradas y contar cuántas veces ocurre el evento en relación con las transformaciones de ardilla:

```{includeCode: strip_log}
function tableFor(event, journal) {
  let table = [0, 0, 0, 0];
  for (let i = 0; i < journal.length; i++) {
    let entry = journal[i], index = 0;
    if (entry.events.includes(event)) index += 1;
    if (entry.squirrel) index += 2;
    table[index] += 1;
  }
  return table;
}

console.log(tableFor("pizza", JOURNAL));
// → [76, 9, 4, 1]
```

{{index [array, searching], "includes method"}}

Los arrays tienen un método `includes` que comprueba si un valor dado existe en el array. La función utiliza esto para determinar si el nombre del evento en el que está interesado forma parte de la lista de eventos de un día dado.

{{index [array, indexing]}}

El cuerpo del bucle en `tableFor` determina en qué caja de la tabla cae cada entrada del diario, verificando si la entrada contiene el evento específico en el que está interesado y si el evento ocurre junto con un incidente de ardilla. Luego, el bucle suma uno a la caja correcta de la tabla.

Ahora tenemos las herramientas necesarias para calcular correlaciones individuales. El único paso restante es encontrar una correlación para cada tipo de evento que se registró y ver si algo destaca.

{{id for_of_loop}}

## Bucles de Array

{{index "for loop", loop, [array, iteration]}}

En la función `tableFor`, hay un bucle como este:

```
for (let i = 0; i < JOURNAL.length; i++) {
  let entry = JOURNAL[i];
  // Hacer algo con entry
}
```

Este tipo de bucle es común en el JavaScript clásico; recorrer arrays elemento por elemento es algo que se hace con frecuencia, y para hacerlo se recorre un contador sobre la longitud del array y se selecciona cada elemento por turno.

Hay una forma más sencilla de escribir tales bucles en JavaScript moderno:

```
for (let entry of JOURNAL) {
  console.log(`${entry.events.length} eventos.`);
}
```

{{index "for/of loop"}}

Cuando un bucle `for` usa la palabra `of` después de la definición de su variable, recorrerá los elementos del valor dado después de `of`. Esto no solo funciona para arrays, sino también para cadenas y algunas otras estructuras de datos. Discutiremos _cómo_ funciona en [Capítulo ?](object).

{{id analysis}}

## El análisis final

{{index journal, "ejemplo de ardilla", "función journalEvents"}}

Necesitamos calcular una correlación para cada tipo de evento que ocurre en el conjunto de datos. Para hacerlo, primero necesitamos _encontrar_ cada tipo de evento.

{{index "includes method", "push method"}}

```{includeCode: "strip_log"}
function journalEvents(journal) {
  let events = [];
  for (let entry of journal) {
    for (let event of entry.events) {
      if (!events.includes(event)) {
        events.push(event);
      }
    }
  }
  return events;
}

console.log(journalEvents(JOURNAL));
// → ["zanahoria", "ejercicio", "fin de semana", "pan", …]
```

Agregando los nombres de cualquier evento que no estén en él al array `events`, la función recopila todos los tipos de eventos.

Usando esa función, podemos ver todas las correlaciones:

```{test: no}
for (let event of journalEvents(JOURNAL)) {
  console.log(event + ":", phi(tableFor(event, JOURNAL)));
}
// → zanahoria:   0.0140970969
// → ejercicio: 0.0685994341
// → fin de semana:  0.1371988681
// → pan:   -0.0757554019
// → pudín: -0.0648203724
// y así sucesivamente...
```

La mayoría de las correlaciones parecen estar cerca de cero. Comer zanahorias, pan o pudín aparentemente no desencadena la licantropía de las ardillas. Las transformaciones parecen ocurrir un poco más a menudo los fines de semana. Filtraremos los resultados para mostrar solo correlaciones mayores que 0.1 o menores que -0.1:

```{test: no, startCode: true}
for (let event of journalEvents(JOURNAL)) {
  let correlation = phi(tableFor(event, JOURNAL));
  if (correlation > 0.1 || correlation < -0.1) {
    console.log(event + ":", correlation);
  }
}
// → fin de semana:        0.1371988681
// → cepillarse los dientes: -0.3805211953
// → dulces:          0.1296407447
// → trabajo:          -0.1371988681
// → espaguetis:      0.2425356250
// → lectura:        0.1106828054
// → cacahuetes:        0.5902679812
```

¡Ajá! Hay dos factores con una correlación claramente más fuerte que los demás. Comer cacahuetes tiene un fuerte efecto positivo en la posibilidad de convertirse en una ardilla, mientras que cepillarse los dientes tiene un efecto negativo significativo.

Interesante. Intentemos algo:

```
for (let entry of JOURNAL) {
  if (entry.events.includes("cacahuetes") &&
     !entry.events.includes("cepillarse los dientes")) {
    entry.events.push("dientes de cacahuate");
  }
}
console.log(phi(tableFor("dientes de cacahuate", JOURNAL)));
// → 1
```

Ese es un resultado sólido. El fenómeno ocurre precisamente cuando Jacques come cacahuetes y no se cepilla los dientes. Si tan solo no fuera tan descuidado con la higiene dental, ni siquiera se habría dado cuenta de su aflicción.

Sabiendo esto, Jacques deja de comer cacahuetes por completo y descubre que sus transformaciones se detienen.

{{index "ejemplo de hombre ardilla"}}

Pero solo pasan unos pocos meses antes de que se dé cuenta de que algo falta en esta forma de vivir completamente humana. Sin sus aventuras salvajes, Jacques apenas se siente vivo. Decide que prefiere ser un animal salvaje a tiempo completo. Después de construir una hermosa casita en un árbol en el bosque y equiparla con un dispensador de mantequilla de cacahuate y un suministro de diez años de mantequilla de cacahuate, cambia de forma por última vez y vive la corta y enérgica vida de una ardilla.

## Más arreología

{{index [array, "métodos"], ["método", array]}}

Antes de terminar el capítulo, quiero presentarte algunos conceptos más relacionados con objetos. Comenzaré presentando algunos métodos de array generalmente útiles.

{{index "método push", "método pop", "método shift", "método unshift"}}

Vimos `push` y `pop`, que agregan y eliminan elementos al final de un array, [anteriormente](data#array_methods) en este capítulo. Los métodos correspondientes para agregar y eliminar cosas al principio de un array se llaman `unshift` y `shift`.

```
let listaDeTareas = [];
function recordar(tarea) {
  listaDeTareas.push(tarea);
}
function obtenerTarea() {
  return listaDeTareas.shift();
}
function recordarUrgente(tarea) {
  listaDeTareas.unshift(tarea);
}
```

{{index "ejemplo de gestión de tareas"}}

Este programa gestiona una cola de tareas. Agregas tareas al final de la cola llamando a `recordar("comestibles")`, y cuando estás listo para hacer algo, llamas a `obtenerTarea()` para obtener (y eliminar) el primer elemento de la cola. La función `recordarUrgente` también agrega una tarea pero la agrega al principio en lugar de al final de la cola.

{{index [array, searching], "indexOf method", "lastIndexOf method"}}

Para buscar un valor específico, los arrays proporcionan un método `indexOf`. Este método busca a través del array desde el principio hasta el final y devuelve el índice en el que se encontró el valor solicitado, o -1 si no se encontró. Para buscar desde el final en lugar de desde el principio, existe un método similar llamado `lastIndexOf`:

```
console.log([1, 2, 3, 2, 1].indexOf(2));
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2));
// → 3
```

Tanto `indexOf` como `lastIndexOf` admiten un segundo argumento opcional que indica dónde comenzar la búsqueda.

{{index "slice method", [array, indexing]}}

Otro método fundamental de los arrays es `slice`, que toma índices de inicio y fin y devuelve un array que solo contiene los elementos entre ellos. El índice de inicio es inclusivo, mientras que el índice de fin es exclusivo.

```
console.log([0, 1, 2, 3, 4].slice(2, 4));
// → [2, 3]
console.log([0, 1, 2, 3, 4].slice(2));
// → [2, 3, 4]
```

{{index [string, indexing]}}

Cuando no se proporciona el índice de fin, `slice` tomará todos los elementos después del índice de inicio. También puedes omitir el índice de inicio para copiar todo el array.

{{index concatenation, "concat method"}}

El método `concat` se puede usar para concatenar arrays y crear un nuevo array, similar a lo que el operador `+` hace para las strings.

El siguiente ejemplo muestra tanto `concat` como `slice` en acción. Toma un array y un índice y devuelve un nuevo array que es una copia del array original con el elemento en el índice dado eliminado:

```
function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2));
// → ["a", "b", "d", "e"]
```

Si le pasas a `concat` un argumento que no es un array, ese valor se agregará al nuevo array como si fuera un array de un solo elemento.

## Strings y sus propiedades

{{index [string, properties]}}

Podemos acceder a propiedades como `length` y `toUpperCase` en valores de tipo string. Pero si intentamos añadir una nueva propiedad, esta no se conserva.

```
let kim = "Kim";
kim.age = 88;
console.log(kim.age);
// → undefined
```

Los valores de tipo string, number y Boolean no son objetos, y aunque el lenguaje no se queja si intentas establecer nuevas propiedades en ellos, en realidad no almacena esas propiedades. Como se mencionó anteriormente, dichos valores son inmutables y no pueden ser modificados.

{{index [string, methods], "slice method", "indexOf method", [string, searching]}}

Pero estos tipos tienen propiedades integradas. Cada valor string tiene varios métodos. Algunos muy útiles son `slice` e `indexOf`, que se parecen a los métodos de arrays del mismo nombre:

```
console.log("coconuts".slice(4, 7));
// → nut
console.log("coconut".indexOf("u"));
// → 5
```

Una diferencia es que el `indexOf` de un string puede buscar un string que contenga más de un carácter, mientras que el método correspondiente de arrays busca solo un elemento:

```
console.log("one two three".indexOf("ee"));
// → 11
```

{{index [whitespace, trimming], "trim method"}}

El método `trim` elimina los espacios en blanco (espacios, saltos de línea, tabulaciones y caracteres similares) del principio y final de una cadena:

```
console.log("  okay \n ".trim());
// → okay
```

{{id padStart}}

La función `zeroPad` del [capítulo anterior](functions) también existe como un método. Se llama `padStart` y recibe la longitud deseada y el carácter de relleno como argumentos:

```
console.log(String(6).padStart(3, "0"));
// → 006
```

{{id split}}

{{index "split method"}}

Puedes dividir una cadena en cada ocurrencia de otra cadena con `split` y unirla nuevamente con `join`:

```
let sentence = "Secretarybirds specialize in stomping";
let words = sentence.split(" ");
console.log(words);
// → ["Secretarybirds", "specialize", "in", "stomping"]
console.log(words.join(". "));
// → Secretarybirds. specialize. in. stomping
```

{{index "repeat method"}}

Una cadena puede repetirse con el método `repeat`, que crea una nueva cadena que contiene múltiples copias de la cadena original, pegadas juntas:

```
console.log("LA".repeat(3));
// → LALALA
```

{{index ["length property", "for string"], [string, indexing]}}

Ya hemos visto la propiedad `length` del tipo string. Acceder a los caracteres individuales en una cadena se parece a acceder a los elementos de un array (con una complicación que discutiremos en [Capítulo ?](higher_order#code_units)).

```
let string = "abc";
console.log(string.length);
// → 3
console.log(string[1]);
// → b
```

{{id rest_parameters}}

## Parámetros restantes

{{index "Math.max function", "period character", "max example", spread, [array, "of rest arguments"]}}

Puede ser útil para una función aceptar cualquier cantidad de ((argumento)s). Por ejemplo, `Math.max` calcula el máximo de _todos_ los argumentos que se le pasan. Para escribir una función así, colocas tres puntos antes del último ((parámetro)) de la función, de esta manera:

```{includeCode: strip_log}
function max(...numbers) {
  let result = -Infinity;
  for (let number of numbers) {
    if (number > result) result = number;
  }
  return result;
}
console.log(max(4, 1, 9, -2));
// → 9
```

Cuando se llama a una función así, el _((parámetro restante))_ se vincula a un array que contiene todos los argumentos restantes. Si hay otros parámetros antes de él, sus valores no forman parte de ese array. Cuando, como en `max`, es el único parámetro, contendrá todos los argumentos.

{{index [function, application]}}

Puedes usar una notación similar de tres puntos para _llamar_ a una función con un array de argumentos:

```
let numbers = [5, 1, 7];
console.log(max(...numbers));
// → 7
```

Esto "((expande))" el array en la llamada de la función, pasando sus elementos como argumentos separados. Es posible incluir un array de esa manera junto con otros argumentos, como en `max(9, ...numbers, 2)`.

{{index "[] (array)"}}

La notación de array entre corchetes cuadrados permite al operador de triple punto expandir otro array en el nuevo array:

```
let words = ["never", "fully"];

console.log(["will", ...words, "understand"]);
// → ["will", "never", "fully", "understand"]
```

{{index "{} (object)"}}

Esto funciona incluso en objetos con llaves, donde agrega todas las propiedades de otro objeto. Si una propiedad se agrega varias veces, el último valor añadido es el que se conserva:

```
let coordenadas = {x: 10, y: 0};
console.log({...coordenadas, y: 5, z: 1});
// → {x: 10, y: 5, z: 1}
```

## El objeto Math

{{index "Objeto Math", "Función Math.min", "Función Math.max", "Función Math.sqrt", "mínimo", "máximo", "raíz cuadrada"}}

Como hemos visto, `Math` es una bolsa de funciones de utilidad relacionadas con números, tales como `Math.max` (máximo), `Math.min` (mínimo) y `Math.sqrt` (raíz cuadrada).

{{index espacio de nombres, [objeto, propiedad]}}

{{id "contaminación de espacio de nombres"}}

El objeto `Math` se utiliza como un contenedor para agrupar un conjunto de funcionalidades relacionadas. Solo hay un objeto `Math` y casi nunca es útil como un valor. Más bien, proporciona un _espacio de nombres_ para que todas estas funciones y valores no tengan que ser enlaces globales.

{{index [enlace, nombrar]}}

Tener demasiados enlaces globales "contamina" el espacio de nombres. Cuantos más nombres se hayan tomado, más probable es que sobrescribas accidentalmente el valor de algún enlace existente. Por ejemplo, es probable que quieras nombrar algo `max` en uno de tus programas. Dado que la función `max` integrada de JavaScript está protegida de forma segura dentro del objeto `Math`, no tienes que preocuparte por sobrescribirla.

{{index "palabra clave let", "palabra clave const"}}

Muchos lenguajes te detendrán, o al menos te advertirán, cuando estés definiendo un enlace con un nombre que ya está tomado. JavaScript hace esto para enlaces que declaraste con `let` o `const`, pero —perversamente— no para enlaces estándar ni para enlaces declarados con `var` o `function`.

{{index "Función Math.cos", "Función Math.sin", "Función Math.tan", "Función Math.acos", "Función Math.asin", "Función Math.atan", "Constante Math.PI", coseno, seno, tangente, "constante PI", pi}}

Volviendo al objeto `Math`. Si necesitas hacer ((trigonometría)), `Math` puede ayudarte. Contiene `cos` (coseno), `sin` (seno) y `tan` (tangente), así como sus funciones inversas, `acos`, `asin` y `atan`, respectivamente. El número π (pi) —o al menos la aproximación más cercana que cabe en un número de JavaScript— está disponible como `Math.PI`. Existe una antigua tradición de programación que consiste en escribir los nombres de ((valores constantes)) en mayúsculas:

```{test: no}
function puntoAleatorioEnCirculo(radio) {
  let ángulo = Math.random() * 2 * Math.PI;
  return {x: radio * Math.cos(ángulo),
          y: radio * Math.sin(ángulo)};
}
console.log(puntoAleatorioEnCirculo(2));
// → {x: 0.3667, y: 1.966}
```

Si no estás familiarizado con senos y cosenos, no te preocupes. Los explicaré cuando se utilicen en este libro, en [Capítulo ?](dom#sin_cos).

{{index "Función Math.random", "número aleatorio"}}

El ejemplo anterior utilizó `Math.random`. Esta es una función que devuelve un nuevo número pseudoaleatorio entre cero (inclusive) y uno (exclusivo) cada vez que la llamas:

```{test: no}
console.log(Math.random());
// → 0.36993729369714856
console.log(Math.random());
// → 0.727367032552138
console.log(Math.random());
// → 0.40180766698904335
```

{{index "número seudorandom", "número aleatorio"}}

Aunque las computadoras son máquinas deterministas —siempre reaccionan de la misma manera si se les da la misma entrada— es posible hacer que produzcan números que parezcan aleatorios. Para lograrlo, la máquina mantiene algún valor oculto y, cada vez que solicitas un nuevo número aleatorio, realiza cálculos complicados en este valor oculto para crear un valor nuevo. Almacena un nuevo valor y devuelve algún número derivado de este. De esta manera, puede producir números nuevos y difíciles de predecir que se _aparentan_ aleatorios.

{{index redondeo, "función Math.floor"}}

Si queremos un número entero aleatorio en lugar de uno fraccionario, podemos usar `Math.floor` (que redondea hacia abajo al número entero más cercano) en el resultado de `Math.random`:

```{test: no}
console.log(Math.floor(Math.random() * 10));
// → 2
```

Al multiplicar el número aleatorio por 10, obtenemos un número mayor o igual a 0 y menor que 10. Dado que `Math.floor` redondea hacia abajo, esta expresión producirá, con igual probabilidad, cualquier número del 0 al 9.

{{index "función Math.ceil", "función Math.round", "función Math.abs", "valor absoluto"}}

También existen las funciones `Math.ceil` (para "techo", que redondea hacia arriba al número entero más cercano), `Math.round` (al número entero más cercano) y `Math.abs`, que toma el valor absoluto de un número, es decir, niega los valores negativos pero deja los positivos tal como están.

## Desestructuración

{{index "función phi"}}

Volviendo por un momento a la función `phi`.

```{test: wrap}
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}
```

{{index "desestructuración de asignaciones", "parámetro"}}

Una razón por la que esta función es difícil de leer es que tenemos una asignación apuntando a nuestro array, pero preferiríamos tener asignaciones para los _elementos_ del array, es decir, `let n00 = table[0]` y así sucesivamente. Afortunadamente, hay una forma concisa de hacer esto en JavaScript:

```
function phi([n00, n01, n10, n11]) {
  return (n11 * n00 - n10 * n01) /
    Math.sqrt((n10 + n11) * (n00 + n01) *
              (n01 + n11) * (n00 + n10));
}
```

{{index "palabra clave let", "palabra clave var", "palabra clave const", ["asignación", "desestructuración"]}}

Esto también funciona para asignaciones creadas con `let`, `var` o `const`. Si sabes que el valor que estás asignando es un array, puedes usar ((corchetes)) para "mirar dentro" del valor y asignar sus contenidos.

{{index [objeto, propiedad], [llaves, objeto]}}

Un truco similar funciona para objetos, usando llaves en lugar de corchetes:

```
let {name} = {name: "Faraji", age: 23};
console.log(name);
// → Faraji
```

{{index null, undefined}}

Ten en cuenta que si intentas desestructurar `null` o `undefined`, obtendrás un error, igual que si intentaras acceder directamente a una propiedad de esos valores.

## Acceso opcional a propiedades

{{index "encadenamiento opcional", "carácter de punto"}}

Cuando no estás seguro de si un valor dado produce un objeto pero aún deseas leer una propiedad de él cuando lo hace, puedes usar una variante de la notación de punto: `objeto?.propiedad`.

```
function city(objeto) {
  return objeto.address?.city;
}
console.log(city({address: {city: "Toronto"}}));
// → Toronto
console.log(city({name: "Vera"}));
// → undefined
```

La expresión `a?.b` significa lo mismo que `a.b` cuando `a` no es nulo o indefinido. Cuando lo es, se evalúa como indefinido. Esto puede ser conveniente cuando, como en el ejemplo, no estás seguro de si una propiedad dada existe o cuando una variable podría contener un valor indefinido.

Una notación similar se puede utilizar con el acceso a corchetes cuadrados, e incluso con llamadas de funciones, colocando `?.` delante de los paréntesis o corchetes:

```
console.log("string".notAMethod?.());
// → undefined
console.log({}.arrayProp?.[0]);
// → undefined
```

## JSON

{{index [array, representation], [object, representation], "data format", [memory, organization]}}

Debido a que las propiedades capturan su valor en lugar de contenerlo, los objetos y arrays se almacenan en la memoria de la computadora como secuencias de bits que contienen las _((direcciones))_—el lugar en la memoria—de sus contenidos. Un array con otro array dentro de él consiste en (al menos) una región de memoria para el array interno y otra para el array externo, que contiene (entre otras cosas) un número que representa la dirección del array interno.

Si deseas guardar datos en un archivo para más tarde o enviarlos a otra computadora a través de la red, debes convertir de alguna manera estas marañas de direcciones de memoria en una descripción que se pueda almacenar o enviar. Podrías enviar toda la memoria de tu computadora junto con la dirección del valor que te interesa, supongo, pero eso no parece ser el mejor enfoque.

{{indexsee "JavaScript Object Notation", JSON}}

{{index [serialization, "World Wide Web"]}}

Lo que podemos hacer es _serializar_ los datos. Eso significa que se convierten en una descripción plana. Un formato de serialización popular se llama _((JSON))_ (pronunciado "Jason"), que significa JavaScript Object Notacion. Se utiliza ampliamente como formato de almacenamiento y comunicación de datos en la Web, incluso en lenguajes que no son JavaScript.

{{index [array, notation], [object, creation], [quoting, "in JSON"], comment}}

JSON se parece al formato de escritura de arrays y objetos de JavaScript, con algunas restricciones. Todos los nombres de propiedades deben estar rodeados de comillas dobles y solo se permiten expresiones de datos simples—no llamadas a funciones, enlaces, o cualquier cosa que implique cálculos reales. Los comentarios no están permitidos en JSON.

Una entrada de diario podría verse así cuando se representa como datos JSON:

```{lang: "json"}
{
  "squirrel": false,
  "events": ["work", "touched tree", "pizza", "running"]
}
```

{{index "JSON.stringify function", "JSON.parse function", serialization, deserialization, parsing}}

JavaScript nos proporciona las funciones `JSON.stringify` y `JSON.parse` para convertir datos a este formato y desde este formato. La primera toma un valor de JavaScript y devuelve una cadena codificada en JSON. La segunda toma dicha cadena y la convierte en el valor que codifica:

```
let string = JSON.stringify({squirrel: false,
                             events: ["weekend"]});
console.log(string);
// → {"squirrel":false,"events":["weekend"]}
console.log(JSON.parse(string).events);
// → ["weekend"]
```

## Resumen

Los objetos y arrays proporcionan formas de agrupar varios valores en un único valor. Esto nos permite poner un montón de cosas relacionadas en una bolsa y correr con la bolsa en lugar de envolver nuestros brazos alrededor de cada una de las cosas individuales e intentar sostenerlas por separado.

La mayoría de los valores en JavaScript tienen propiedades, con las excepciones siendo `null` y `undefined`. Las propiedades se acceden usando `valor.prop` o `valor["prop"]`. Los objetos tienden a usar nombres para sus propiedades y almacenan más o menos un conjunto fijo de ellas. Los arrays, por otro lado, suelen contener cantidades variables de valores conceptualmente idénticos y usan números (comenzando desde 0) como los nombres de sus propiedades.

Sí _hay_ algunas propiedades nombradas en arrays, como `length` y varios métodos. Los métodos son funciones que viven en propiedades y (usualmente) actúan sobre el valor del cual son una propiedad.

Puedes iterar sobre arrays usando un tipo especial de bucle `for`: `for (let elemento of array)`.

## Ejercicios

### La suma de un rango

{{index "summing (exercise)"}}

La [introducción](intro) de este libro insinuó lo siguiente como una forma agradable de calcular la suma de un rango de números:

```{test: no}
console.log(sum(range(1, 10)));
```

{{index "range function", "sum function"}}

Escribe una función `range` que tome dos argumentos, `inicio` y `fin`, y devuelva un array que contenga todos los números desde `inicio` hasta `fin`, incluyendo `fin`.

Luego, escribe una función `sum` que tome un array de números y devuelva la suma de estos números. Ejecuta el programa de ejemplo y verifica si realmente devuelve 55.

{{index "optional argument"}}

Como asignación adicional, modifica tu función `range` para que tome un tercer argumento opcional que indique el valor de "paso" utilizado al construir el array. Si no se proporciona un paso, los elementos deberían aumentar en incrementos de uno, correspondiendo al comportamiento anterior. La llamada a la función `range(1, 10, 2)` debería devolver `[1, 3, 5, 7, 9]`. Asegúrate de que esto también funcione con valores de paso negativos, de modo que `range(5, 2, -1)` produzca `[5, 4, 3, 2]`.

{{if interactive

```{test: no}
// Tu código aquí.

console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
console.log(sum(range(1, 10)));
// → 55
```

if}}

{{hint

{{index "summing (exercise)", [array, creation], "square brackets"}}

La construcción de un array se hace más fácilmente inicializando primero un enlace a `[]` (un array vacío nuevo) y llamando repetidamente a su método `push` para agregar un valor. No olvides devolver el array al final de la función.

{{index [array, indexing], comparison}}

Dado que el límite final es inclusivo, necesitarás usar el operador `<=` en lugar de `<` para verificar el final de tu bucle.

{{index "arguments object"}}

El parámetro de paso puede ser un parámetro opcional que por defecto (usando el operador `=`) es 1.

{{index "range function", "for loop"}}

Hacer que `range` comprenda valores negativos de paso probablemente sea mejor haciendo escribiendo dos bucles separados: uno para contar hacia arriba y otro para contar hacia abajo, porque la comparación que verifica si el bucle ha terminado necesita ser `>=` en lugar de `<=` al contar hacia abajo.

También puede valer la pena usar un paso predeterminado diferente, es decir, -1, cuando el final del rango es menor que el principio. De esa manera, `range(5, 2)` devuelve algo significativo, en lugar de quedarse atascado en un ((bucle infinito)). Es posible hacer referencia a parámetros anteriores en el valor predeterminado de un parámetro.

hint}}

### Reversión de un array

{{index "reversing (exercise)", "método reverse", [array, "métodos"]}}

Los arrays tienen un método `reverse` que cambia el array invirtiendo el orden en el que aparecen sus elementos. Para este ejercicio, escribe dos funciones, `reverseArray` y `reverseArrayInPlace`. La primera, `reverseArray`, debería tomar un array como argumento y producir un _nuevo_ array que tenga los mismos elementos en orden inverso. La segunda, `reverseArrayInPlace`, debería hacer lo que hace el método `reverse`: _modificar_ el array dado como argumento invirtiendo sus elementos. Ninguna de las funciones puede utilizar el método `reverse` estándar.

{{index eficiencia, "función pura", "efecto secundario"}}

Recordando las notas sobre efectos secundarios y funciones puras en el [capítulo anterior](functions#pure), ¿qué variante esperas que sea útil en más situaciones? ¿Cuál se ejecuta más rápido?

{{if interactive

```{test: no}
// Tu código aquí.

let myArray = ["A", "B", "C"];
console.log(reverseArray(myArray));
// → ["C", "B", "A"];
console.log(myArray);
// → ["A", "B", "C"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
```

if}}

{{hint

{{index "reversing (exercise)"}}

Hay dos formas obvias de implementar `reverseArray`. La primera es simplemente recorrer el array de entrada de principio a fin y usar el método `unshift` en el nuevo array para insertar cada elemento en su inicio. La segunda es recorrer el array de entrada hacia atrás y utilizar el método `push`. Iterar sobre un array hacia atrás requiere una especificación de bucle (algo incómoda), como `(let i = array.length - 1; i >= 0; i--)`.

{{index "método slice"}}

Invertir el array en su lugar es más difícil. Debes tener cuidado de no sobrescribir elementos que necesitarás más adelante. Utilizar `reverseArray` o copiar todo el array de otra manera (usar `array.slice()` es una buena forma de copiar un array) funciona pero es hacer trampa.

El truco consiste en _intercambiar_ el primer y último elementos, luego el segundo y el penúltimo, y así sucesivamente. Puedes hacer esto recorriendo la mitad de la longitud del array (utiliza `Math.floor` para redondear hacia abajo, no necesitas tocar el elemento central en un array con un número impar de elementos) e intercambiando el elemento en la posición `i` con el que está en la posición `array.length - 1 - i`. Puedes utilizar una asignación local para retener brevemente uno de los elementos, sobrescribirlo con su imagen reflejada, y luego colocar el valor de la asignación local en el lugar donde solía estar la imagen reflejada.

hint}}

{{id list}}

### Lista

{{index ["estructura de datos", lista], "lista (exercise)", "lista enlazada", array, "colección"}}

Como bloques genéricos de valores, los objetos se pueden utilizar para construir todo tipo de estructuras de datos. Una estructura de datos común es la _lista_ (no confundir con arrays). Una lista es un conjunto anidado de objetos, donde el primer objeto contiene una referencia al segundo, el segundo al tercero, y así sucesivamente:

```{includeCode: true}
let list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
};
```

Los objetos resultantes forman una cadena, como se muestra en el siguiente diagrama:

{{figure {url: "img/linked-list.svg", alt: "Un diagrama que muestra la estructura de memoria de una lista enlazada. Hay 3 celdas, cada una con un campo de valor que contiene un número y un campo 'rest' con una flecha que apunta al resto de la lista. La flecha de la primera celda apunta a la segunda celda, la flecha de la segunda celda apunta a la última celda y el campo 'rest' de la última celda contiene nulo.",width: "8cm"}}}

{{index "structure sharing", [memory, structure sharing]}}

Una ventaja de las listas es que pueden compartir partes de su estructura. Por ejemplo, si creo dos nuevos valores `{value: 0, rest: list}` y `{value: -1, rest: list}` (siendo `list` la referencia definida anteriormente), son listas independientes, pero comparten la estructura que conforma sus últimos tres elementos. La lista original también sigue siendo válida como una lista de tres elementos.

Escribe una función `arrayToList` que construya una estructura de lista como la mostrada cuando se le da `[1, 2, 3]` como argumento. También escribe una función `listToArray` que produzca un array a partir de una lista. Agrega las funciones auxiliares `prepend`, que toma un elemento y una lista y crea una nueva lista que añade el elemento al principio de la lista de entrada, y `nth`, que toma una lista y un número y devuelve el elemento en la posición dada en la lista (siendo cero el primer elemento) o `undefined` cuando no hay tal elemento.

{{index recursion}}

Si aún no lo has hecho, escribe también una versión recursiva de `nth`.

{{if interactive

```{test: no}
// Tu código aquí.

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
```

if}}

{{hint

{{index "list (exercise)", "linked list"}}

Construir una lista es más fácil cuando se hace de atrás hacia adelante. Por lo tanto, `arrayToList` podría iterar sobre el array en reversa (ver ejercicio anterior) y, para cada elemento, agregar un objeto a la lista. Puedes usar un enlace local para mantener la parte de la lista que se ha construido hasta el momento y usar una asignación como `lista = {value: X, rest: lista}` para añadir un elemento.

{{index "for loop"}}

Para recorrer una lista (en `listToArray` y `nth`), se puede utilizar una especificación de bucle `for` de esta forma:

```
for (let nodo = list; nodo; nodo = nodo.rest) {}
```

¿Puedes ver cómo funciona esto? En cada iteración del bucle, `nodo` apunta a la sublista actual, y el cuerpo puede leer su propiedad `value` para obtener el elemento actual. Al final de una iteración, `nodo` pasa a la siguiente sublista. Cuando eso es nulo, hemos llegado al final de la lista y el bucle ha terminado.

{{index recursion}}

La versión recursiva de `nth` mirará de manera similar una parte cada vez más pequeña de la "cola" de la lista y al mismo tiempo contará hacia abajo el índice hasta llegar a cero, momento en el que puede devolver la propiedad `value` del nodo que está observando. Para obtener el elemento cero de una lista, simplemente tomas la propiedad `value` de su nodo principal. Para obtener el elemento _N_ + 1, tomas el elemento *N*-ésimo de la lista que se encuentra en la propiedad `rest` de esta lista.

hint}}

{{id exercise_deep_compare}}

### Comparación profunda

El operador `==` compara objetos por identidad, pero a veces preferirías comparar los valores de sus propiedades reales.

Escribe una función `deepEqual` que tome dos valores y devuelva true solo si son el mismo valor o son objetos con las mismas propiedades, donde los valores de las propiedades son iguales cuando se comparan con una llamada recursiva a `deepEqual`.

Para saber si los valores deben compararse directamente (usando el operador `===` para eso) o si sus propiedades deben compararse, puedes usar el operador `typeof`. Si produce `"object"` para ambos valores, deberías hacer una comparación profunda. Pero debes tener en cuenta una excepción tonta: debido a un accidente histórico, `typeof null` también produce `"object"`.

La función `Object.keys` será útil cuando necesites recorrer las propiedades de los objetos para compararlas.

{{if interactive

```{test: no}
// Your code here.

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
```

if}}

{{hint

{{index "deep comparison (exercise)", [comparison, deep], "typeof operator", "=== operator"}}

La prueba para determinar si estás tratando con un objeto real se verá algo así: `typeof x == "object" && x != null`. Ten cuidado de comparar propiedades solo cuando _ambos_ argumentos sean objetos. En todos los demás casos, simplemente puedes devolver inmediatamente el resultado de aplicar `===`.

{{index "Object.keys function"}}

Utiliza `Object.keys` para recorrer las propiedades. Necesitas comprobar si ambos objetos tienen el mismo conjunto de nombres de propiedades y si esas propiedades tienen valores idénticos. Una forma de hacerlo es asegurarse de que ambos objetos tengan el mismo número de propiedades (las longitudes de las listas de propiedades son iguales). Y luego, al recorrer las propiedades de uno de los objetos para compararlas, asegúrate siempre primero de que el otro realmente tenga una propiedad con ese nombre. Si tienen el mismo número de propiedades y todas las propiedades en uno también existen en el otro, tienen el mismo conjunto de nombres de propiedades.

{{index "return value"}}

Devolver el valor correcto de la función se hace mejor devolviendo inmediatamente false cuando se encuentra una diferencia y devolviendo true al final de la función.

hint}}