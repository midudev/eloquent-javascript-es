# Funciones de Orden Superior

_"Hay dos formas de construir un diseño de software: Una forma es hacerlo tan simple que obviamente no haya deficiencias, y la otra forma es hacerlo tan complicado que no haya deficiencias obvias."_

— C.A.R. Hoare, _Discurso de Recepción del Premio Turing de la ACM de 1980_

Un programa grande es un programa costoso, y no solo por el tiempo que lleva construirlo. El tamaño casi siempre implica complejidad, y la complejidad confunde a los programadores. Los programadores confundidos, a su vez, introducen errores (_((bugs))_) en los programas. Un programa grande proporciona mucho espacio para que estos errores se escondan, lo que los hace difíciles de encontrar.

Volviendo brevemente a los dos ejemplos finales de programas en la introducción. El primero es autocontenido y tiene seis líneas:

```
let total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
```

El segundo depende de dos funciones externas y tiene una línea:

```
console.log(sum(range(1, 10)));
```

¿Cuál es más probable que contenga un error?

Si contamos el tamaño de las definiciones de `sum` y `range`, el segundo programa también es grande, incluso más que el primero. Pero, aún así, argumentaría que es más probable que sea correcto.

Esto se debe a que la solución se expresa en un ((vocabulary)) que corresponde al problema que se está resolviendo. Sumar un rango de números no se trata de bucles y contadores. Se trata de rangos y sumas.

Las definiciones de este vocabulario (las funciones `sum` y `range`) seguirán involucrando bucles, contadores y otros detalles incidentales. Pero debido a que expresan conceptos más simples que el programa en su totalidad, son más fáciles de hacer correctamente.

## Abstracción

En el contexto de la programación, este tipo de vocabularios se suelen llamar _((abstraction))s_. Las abstracciones nos brindan la capacidad de hablar sobre problemas a un nivel superior (o más abstracto), sin distraernos con detalles no interesantes.

Como analogía, compara estas dos recetas de sopa de guisantes. La primera es así:

_"Pon 1 taza de guisantes secos por persona en un recipiente. Agrega agua hasta que los guisantes estén bien cubiertos. Deja los guisantes en agua durante al menos 12 horas. Saca los guisantes del agua y ponlos en una olla. Agrega 4 tazas de agua por persona. Cubre la olla y deja que los guisantes hiervan a fuego lento durante dos horas. Toma media cebolla por persona. Córtala en trozos con un cuchillo. Agrégala a los guisantes. Toma un tallo de apio por persona. Córtalo en trozos con un cuchillo. Agrégalo a los guisantes. Toma una zanahoria por persona. ¡Córtala en trozos! ¡Con un cuchillo! Agrégala a los guisantes. Cocina durante 10 minutos más."_Cita:

Y esta es la segunda receta:

Por persona: 1 taza de guisantes partidos secos, 4 tazas de agua, media cebolla picada, un tallo de apio y una zanahoria.

Remoja los guisantes durante 12 horas. Cocina a fuego lento durante 2 horas. Pica y agrega las verduras. Cocina durante 10 minutos más.

El segundo es más corto y más fácil de interpretar. Pero necesitas entender algunas palabras más relacionadas con la cocina, como _remojar_, _cocinar a fuego lento_, _picar_, y, supongo, _verdura_.

Cuando se programa, no podemos depender de que todas las palabras que necesitamos estén esperándonos en el diccionario. Por lo tanto, podríamos caer en el patrón de la primera receta: trabajar en los pasos precisos que la computadora tiene que realizar, uno por uno, ciegos a los conceptos de más alto nivel que expresan.

Abstraer la repetición

Las funciones simples, como las hemos visto hasta ahora, son una buena manera de construir abstracciones. Pero a veces se quedan cortas.

Es común que un programa haga algo un número determinado de veces. Puedes escribir un `for` para eso, así:

```
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

¿Podemos abstraer "hacer algo _N_ veces" como una función? Bueno, es fácil escribir una función que llame a `console.log` _N_ veces:

```
function repeatLog(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
  }
```

¿Y si queremos hacer algo que no sea solo registrar los números? Dado que "hacer algo" se puede representar como una función y las funciones son solo valores, podemos pasar nuestra acción como un valor de función:

```{includeCode: "top_lines: 5"}
function repeat(n, action) {
  for (let i = 0; i < n; i++) {
    action(i);
  }
}

repeat(3, console.log);
// → 0
// → 1
// → 2
```

No tenemos que pasar una función predefinida a `repeat`. A menudo, es más fácil crear un valor de función en el momento:

```
let etiquetas = [];
repeat(5, i => {
  etiquetas.push(`Unidad ${i + 1}`);
});
console.log(etiquetas);
// → ["Unidad 1", "Unidad 2", "Unidad 3", "Unidad 4", "Unidad 5"]
```

Esto está estructurado un poco como un `for` loop: primero describe el tipo de loop y luego proporciona un cuerpo. Sin embargo, el cuerpo ahora está escrito como un valor de función, que está envuelto entre los paréntesis de la llamada a `repeat`. Por eso tiene que cerrarse con el corchete de cierre y el paréntesis de cierre. En casos como este ejemplo donde el cuerpo es una sola expresión pequeña, también podrías omitir los corchetes y escribir el bucle en una sola línea.

Funciones de orden superior

Las funciones que operan en otras funciones, ya sea tomandolas como argumentos o devolviéndolas, se llaman _funciones de orden superior_. Dado que ya hemos visto que las funciones son valores regulares, no hay nada particularmente notable sobre el hecho de que existan tales funciones. El término proviene de las matemáticas, donde se toma más en serio la distinción entre funciones y otros valores.

{{index abstraction}}

Las funciones de orden superior nos permiten abstraer sobre _acciones_, no solo sobre valores. Vienen en varias formas. Por ejemplo, podemos tener funciones que crean nuevas funciones:

```
function mayorQue(n) {
  return m => m > n;
}
let mayorQue10 = mayorQue(10);
console.log(mayorQue10(11));
// → true
```

También podemos tener funciones que modifican otras funciones:

```
function ruidosa(f) {
  return (...args) => {
    console.log("llamando con", args);
    let resultado = f(...args);
    console.log("llamado con", args, ", devolvió", resultado);
    return resultado;
  };
}
ruidosa(Math.min)(3, 2, 1);
// → llamando con [3, 2, 1]
// → llamado con [3, 2, 1] , devolvió 1
```

Incluso podemos escribir funciones que proveen nuevos tipos de ((flujo de control)):

```
function aMenosQue(prueba, entonces) {
  if (!prueba) entonces();
}

repetir(3, n => {
  aMenosQue(n % 2 == 1, () => {
    console.log(n, "es par");
  });
});
// → 0 es par
// → 2 es par
```

{{index [array, "métodos"], [array, "iteración"], "método forEach"}}

Existe un método incorporado de arrays, `forEach`, que proporciona algo similar a un bucle `for`/`of` como una función de orden superior:

```
["A", "B"].forEach(l => console.log(l));
// → A
// → B
```

{{id scripts}}

## Conjunto de datos de script

Un área donde las funciones de orden superior destacan es en el procesamiento de datos. Para procesar datos, necesitaremos algunos ejemplos de datos reales. Este capítulo utilizará un ((conjunto de datos)) sobre scripts—sistemas de escritura tales como el latín, cirílico o árabe.

¿Recuerdas ((Unicode)) del [Capítulo ?](valores#unicode), el sistema que asigna un número a cada carácter en lenguaje escrito? La mayoría de estos caracteres están asociados con un script específico. El estándar contiene 140 scripts diferentes, de los cuales 81 aún se utilizan hoy en día y 59 son históricos.

Aunque solo puedo leer con fluidez caracteres latinos, aprecio el hecho de que las personas estén escribiendo textos en al menos otros 80 sistemas de escritura, muchos de los cuales ni siquiera reconocería. Por ejemplo, aquí tienes una muestra de escritura ((Tamil)):

{{figure {url: "img/tamil.png", alt: "Una línea de verso en escritura Tamil. Los caracteres son relativamente simples y separados ordenadamente, pero completamente diferentes de los caracteres latinos."}}}

{{index "conjunto de datos SCRIPTS"}}

El ejemplo del ((conjunto de datos)) contiene algunas piezas de información sobre los 140 scripts definidos en Unicode. Está disponible en el [sandbox de código](https://eloquentjavascript.net/code#5) para este capítulo[ ([_https://eloquentjavascript.net/code#5_](https://eloquentjavascript.net/code#5))]{if book} como el enlace `SCRIPTS`. El enlace contiene un array de objetos, cada uno describe un script:


```{lang: "json"}
{
  name: "Copto",
  rangos: [[994, 1008], [11392, 11508], [11513, 11520]],
  dirección: "ltr",
  año: -200,
  vivo: false,
  enlace: "https://es.wikipedia.org/wiki/Alfabeto_copto"
}
```

Tal objeto nos informa sobre el nombre del script, los rangos Unicode asignados a él, la dirección en la que se escribe, el tiempo de origen (aproximado), si todavía se utiliza, y un enlace a más información. La dirección puede ser `"ltr"` para izquierda a derecha, `"rtl"` para derecha a izquierda (como se escribe el texto en árabe y hebreo) o `"ttb"` para arriba hacia abajo (como en la escritura mongola).

{{index "método de segmento"}}

La propiedad `ranges` contiene una matriz de ((rangos)) de caracteres Unicode, cada uno de los cuales es una matriz de dos elementos que contiene un límite inferior y un límite superior. Todos los códigos de caracteres dentro de estos rangos se asignan al guion. El límite inferior es inclusivo (el código 994 es un carácter copto) y el límite superior no es inclusivo (el código 1008 no lo es).

## Filtrado de arrays

{{index [array, "métodos"], [array, filtrado], "método de filtrado", ["función", "de orden superior"], "función de predicado"}}

Si queremos encontrar los guiones en el conjunto de datos que todavía se utilizan, la siguiente función puede ser útil. Filtra los elementos de una matriz que no pasan una prueba.

```
function filter(array, test) {
  let passed = [];
  for (let element of array) {
    if (test(element)) {
      passed.push(element);
    }
  }
  return passed;
}

console.log(filter(SCRIPTS, script => script.living));
// → [{name: "Adlam", …}, …]
```

{{index ["función", "como valor"], ["función", "aplicación"]}}

La función utiliza el argumento llamado `test`, un valor de función, para llenar un "vacío" en la computación, el proceso de decidir qué elementos recopilar.

{{index "método de filtrado", "función pura", "efecto secundario"}}

Observa cómo la función `filter`, en lugar de eliminar elementos de la matriz existente, construye una nueva matriz con solo los elementos que pasan la prueba. Esta función es _pura_. No modifica la matriz que se le pasa.

Al igual que `forEach`, `filter` es un método de matriz ((estándar)). El ejemplo definió la función solo para mostrar qué hace internamente. De ahora en adelante, lo usaremos de esta manera en su lugar:

```
console.log(SCRIPTS.filter(s => s.direction == "ttb"));
// → [{name: "Mongolian", …}, …]
```

{{id map}}

## Transformación con map

{{index [array, "métodos"], "método de mapeo"}}

Digamos que tenemos una matriz de objetos que representan guiones, producida al filtrar la matriz `SCRIPTS` de alguna manera. Queremos una matriz de nombres en su lugar, que es más fácil de inspeccionar.

{{index ["función", "de orden superior"]}}

El método `map` transforma una matriz aplicando una función a todos sus elementos y construyendo una nueva matriz a partir de los valores devueltos. La nueva matriz tendrá la misma longitud que la matriz de entrada, pero su contenido habrá sido _mapeado_ a una nueva forma por la función:

```
function map(array, transform) {
  let mapped = [];
  for (let element of array) {
    mapped.push(transform(element));
  }
  return mapped;
}

let rtlScripts = SCRIPTS.filter(s => s.direction == "rtl");
console.log(map(rtlScripts, s => s.name));
// → ["Adlam", "Arabic", "Imperial Aramaic", …]
```

Al igual que `forEach` y `filter`, `map` es un método de matriz estándar.

## Resumen con reduce

{{index [array, "métodos"], "ejemplo de suma", "método de reducción"}}

Otra cosa común que hacer con matrices es calcular un único valor a partir de ellas. Nuestro ejemplo recurrente, sumar una colección de números, es una instancia de esto. Otro ejemplo es encontrar el guion con más caracteres.

{{indexsee "fold", "método de reducción"}}

{{index ["función", "de orden superior"], "método de reducción"}}La operación de orden superior que representa este patrón se llama _reduce_ (a veces también llamada _fold_). Construye un valor tomando repetidamente un único elemento del array y combinándolo con el valor actual. Al sumar números, comenzarías con el número cero y, para cada elemento, lo sumarías al total.

Los parámetros de `reduce` son, además del array, una función de combinación y un valor inicial. Esta función es un poco menos directa que `filter` y `map`, así que obsérvala detenidamente:

```
function reduce(array, combine, start) {
  let current = start;
  for (let element of array) {
    current = combine(current, element);
  }
  return current;
}

console.log(reduce([1, 2, 3, 4], (a, b) => a + b, 0));
// → 10
```

{{index "método reduce", "conjunto de datos SCRIPTS"}}

El método estándar de arrays `reduce`, que por supuesto corresponde a esta función, tiene una conveniencia adicional. Si tu array contiene al menos un elemento, puedes omitir el argumento `start`. El método tomará el primer elemento del array como su valor inicial y comenzará a reducir en el segundo elemento.

```
console.log([1, 2, 3, 4].reduce((a, b) => a + b));
// → 10
```

{{index "máximo", "función characterCount"}}

Para usar `reduce` (dos veces) y encontrar el script con más caracteres, podemos escribir algo así:

```
function characterCount(script) {
  return script.ranges.reduce((count, [from, to]) => {
    return count + (to - from);
  }, 0);
}

console.log(SCRIPTS.reduce((a, b) => {
  return characterCount(a) < characterCount(b) ? b : a;
}));
// → {name: "Han", …}
```

La función `characterCount` reduce los rangos asignados a un script sumando sus tamaños. Observa el uso de la desestructuración en la lista de parámetros de la función reductora. La segunda llamada a `reduce` luego utiliza esto para encontrar el script más grande comparando repetidamente dos scripts y devolviendo el más grande.

El script Han tiene más de 89,000 caracteres asignados en el estándar Unicode, convirtiéndolo en el sistema de escritura más grande en el conjunto de datos. Han es un script a veces utilizado para texto en chino, japonés y coreano. Esos idiomas comparten muchos caracteres, aunque tienden a escribirlos de manera diferente. El Consorcio Unicode (con sede en EE. UU.) decidió tratarlos como un único sistema de escritura para ahorrar códigos de caracteres. Esto se llama _unificación Han_ y todavía molesta a algunas personas.

## Composabilidad

{{index bucle, máximo}}

Considera cómo hubiéramos escrito el ejemplo anterior (encontrando el script más grande) sin funciones de orden superior. El código no es mucho peor:

```{test: no}
let biggest = null;
for (let script of SCRIPTS) {
  if (biggest == null ||
      characterCount(biggest) < characterCount(script)) {
    biggest = script;
  }
}
console.log(biggest);
// → {name: "Han", …}
```

Hay algunas variables adicionales y el programa tiene cuatro líneas más, pero sigue siendo muy legible.

{{index "función promedio", composabilidad, ["función", "de orden superior"], "método filter", "método map", "método reduce"}}{{id average_function}}

Las abstracciones proporcionadas por estas funciones brillan realmente cuando necesitas _componer_ operaciones. Como ejemplo, escribamos un código que encuentre el año promedio de origen para scripts vivos y muertos en el conjunto de datos:

```
function average(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

console.log(Math.round(average(
  SCRIPTS.filter(s => s.living).map(s => s.year))));
// → 1165
console.log(Math.round(average(
  SCRIPTS.filter(s => !s.living).map(s => s.year))));
// → 204
```

Como puedes ver, los scripts muertos en Unicode son, en promedio, más antiguos que los vivos. Esta no es una estadística muy significativa o sorprendente. Pero espero que estés de acuerdo en que el código utilizado para calcularlo no es difícil de leer. Puedes verlo como un pipeline: empezamos con todos los scripts, filtramos los vivos (o muertos), tomamos los años de esos scripts, calculamos el promedio y redondeamos el resultado.

Definitivamente también podrías escribir este cálculo como un único ((loop)) grande:

```
let total = 0, count = 0;
for (let script of SCRIPTS) {
  if (script.living) {
    total += script.year;
    count += 1;
  }
}
console.log(Math.round(total / count));
// → 1165
```

Sin embargo, es más difícil ver qué se estaba calculando y cómo. Y debido a que los resultados intermedios no se representan como valores coherentes, sería mucho más trabajo extraer algo como `average` en una función separada.

{{index efficiency, [array, creation]}}

En términos de lo que realmente está haciendo la computadora, estos dos enfoques también son bastante diferentes. El primero construirá nuevos arrays al ejecutar `filter` y `map`, mientras que el segundo calcula solo algunos números, haciendo menos trabajo. Por lo general, puedes permitirte el enfoque legible, pero si estás procesando matrices enormes y haciéndolo muchas veces, el estilo menos abstracto podría valer la pena por la velocidad adicional.

## Cadenas y códigos de caracteres

{{index "SCRIPTS data set"}}

Un uso interesante de este conjunto de datos sería averiguar qué script está utilizando un fragmento de texto. Vamos a través de un programa que hace esto.

Recuerda que cada script tiene asociado un array de intervalos de códigos de caracteres. Dado un código de carácter, podríamos usar una función como esta para encontrar el script correspondiente (si lo hay):

{{index "some method", "predicate function", [array, methods]}}

```{includeCode: strip_log}
function characterScript(code) {
  for (let script of SCRIPTS) {
    if (script.ranges.some(([from, to]) => {
      return code >= from && code < to;
    })) {
      return script;
    }
  }
  return null;
}

console.log(characterScript(121));
// → {name: "Latin", …}
```

El método `some` es otra función de orden superior. Toma una función de prueba y te dice si esa función devuelve true para alguno de los elementos en el array.

{{id code_units}}

Pero, ¿cómo obtenemos los códigos de caracteres en una cadena?

En [Chapter ?](values) mencioné que las cadenas de JavaScript están codificadas como una secuencia de números de 16 bits. Estos se llaman _((unidades de código))_. Un código de carácter Unicode inicialmente se suponía que cabía dentro de tal unidad (lo que te da un poco más de 65,000 caracteres). Cuando quedó claro que eso no iba a ser suficiente, muchas personas se mostraron reacias a la necesidad de usar más memoria por carácter. Para abordar estas preocupaciones, se inventó ((UTF-16)), el formato también utilizado por las cadenas de JavaScript. Describe la mayoría de los caracteres comunes usando una única unidad de código de 16 bits, pero usa un par de dos unidades de dicho tipo para otros.

{{index error}}

UTF-16 generalmente se considera una mala idea hoy en día. Parece casi diseñado intencionalmente para invitar a errores. Es fácil escribir programas que pretendan que las unidades de código y los caracteres son lo mismo. Y si tu lenguaje no utiliza caracteres de dos unidades, eso parecerá funcionar perfectamente. Pero tan pronto como alguien intente usar dicho programa con algunos caracteres chinos menos comunes, fallará. Afortunadamente, con la llegada de los emoji, todo el mundo ha comenzado a usar caracteres de dos unidades, y la carga de tratar con tales problemas está más equitativamente distribuida.

{{index [cadena, longitud], [cadena, "indexación"], "método charCodeAt"}}

Lamentablemente, las operaciones obvias en las cadenas de JavaScript, como obtener su longitud a través de la propiedad `length` y acceder a su contenido usando corchetes cuadrados, tratan solo con unidades de código.

```{test: no}
// Dos caracteres emoji, caballo y zapato
let horseShoe = "🐴👟";
console.log(horseShoe.length);
// → 4
console.log(horseShoe[0]);
// → (Mitad de carácter inválida)
console.log(horseShoe.charCodeAt(0));
// → 55357 (Código de la mitad de carácter)
console.log(horseShoe.codePointAt(0));
// → 128052 (Código real para el emoji de caballo)
```

{{index "método codePointAt"}}

El método `charCodeAt` de JavaScript te da una unidad de código, no un código de carácter completo. El método `codePointAt`, añadido más tarde, sí da un carácter Unicode completo, por lo que podríamos usarlo para obtener caracteres de una cadena. Pero el argumento pasado a `codePointAt` sigue siendo un índice en la secuencia de unidades de código. Para recorrer todos los caracteres en una cadena, aún necesitaríamos abordar la cuestión de si un carácter ocupa una o dos unidades de código.

{{index "bucle for/of", caracter}}

En el [capítulo anterior](datos#bucle_for_of), mencioné que un bucle `for`/`of` también se puede usar en cadenas. Al igual que `codePointAt`, este tipo de bucle se introdujo en un momento en que la gente era muy consciente de los problemas con UTF-16. Cuando lo usas para recorrer una cadena, te proporciona caracteres reales, no unidades de código:

```
let roseDragon = "🌹🐉";
for (let char of roseDragon) {
  console.log(char);
}
// → 🌹
// → 🐉
```

Si tienes un carácter (que será una cadena de una o dos unidades de código), puedes usar `codePointAt(0)` para obtener su código.

## Reconociendo texto

{{index "conjunto de datos SCRIPTS", "función countBy", [array, conteo]}}

Tenemos una función `characterScript` y una forma de recorrer correctamente los caracteres. El próximo paso es contar los caracteres que pertenecen a cada script. La siguiente abstracción de conteo será útil para eso:

```{includeCode: strip_log}
function countBy(items, groupName) {
  let counts = [];
  for (let item of items) {
    let name = groupName(item);
    let known = counts.find(c => c.name == name);
    if (!known) {
      counts.push({name, count: 1});
    } else {
      known.count++;
    }
  }
  return counts;
}

console.log(countBy([1, 2, 3, 4, 5], n => n > 2));
// → [{name: false, count: 2}, {name: true, count: 3}]
```

La función `countBy` espera una colección (cualquier cosa por la que podamos iterar con `for`/`of`) y una función que calcule un nombre de grupo para un elemento dado. Devuelve una matriz de objetos, cada uno de los cuales nombra un grupo y te dice el número de elementos que se encontraron en ese grupo.

{{index "método find"}}

Utiliza otro método de array, `find`, que recorre los elementos en el array y devuelve el primero para el cual una función devuelve true. Devuelve `undefined` cuando no se encuentra dicho elemento.

{{index "función textScripts", "caracteres chinos"}}

Usando `countBy`, podemos escribir la función que nos dice qué scripts se utilizan en un fragmento de texto:

```{includeCode: strip_log, startCode: true}
function textScripts(text) {
  let scripts = countBy(text, char => {
    let script = characterScript(char.codePointAt(0));
    return script ? script.name : "ninguno";
  }).filter(({name}) => name != "ninguno");

  let total = scripts.reduce((n, {count}) => n + count, 0);
  if (total == 0) return "No se encontraron scripts";

  return scripts.map(({name, count}) => {
    return `${Math.round(count * 100 / total)}% ${name}`;
  }).join(", ");
}

console.log(textScripts('英国的狗说"woof", 俄罗斯的狗说"тяв"'));
// → 61% Han, 22% Latin, 17% Cyrillic
```

{{index "función characterScript", "método filter"}}

La función primero cuenta los caracteres por nombre, usando `characterScript` para asignarles un nombre y retrocediendo a la cadena `"ninguno"` para los caracteres que no forman parte de ningún script. La llamada a `filter` elimina la entrada de `"ninguno"` del array resultante, ya que no nos interesan esos caracteres.

{{index "método reduce", "método map", "método join", [array, methods]}}

Para poder calcular porcentajes, primero necesitamos el número total de caracteres que pertenecen a un script, lo cual podemos calcular con `reduce`. Si no se encuentran dichos caracteres, la función devuelve una cadena específica. De lo contrario, transforma las entradas de conteo en cadenas legibles con `map` y luego las combina con `join`.

## Resumen

Poder pasar valores de funciones a otras funciones es un aspecto muy útil de JavaScript. Nos permite escribir funciones que modelan cálculos con "vacíos". El código que llama a estas funciones puede llenar los vacíos proporcionando valores de funciones.

Los arrays proporcionan diversos métodos de orden superior útiles. Puedes usar `forEach` para recorrer los elementos de un array. El método `filter` devuelve un nuevo array que contiene solo los elementos que pasan la ((función de predicado)). Transformar un array poniendo cada elemento en una función se hace con `map`. Puedes usar `reduce` para combinar todos los elementos de un array en un único valor. El método `some` comprueba si algún elemento coincide con una función de predicado dada, mientras que `find` encuentra el primer elemento que coincide con un predicado.

## Ejercicios

### Aplanamiento

{{index "aplanamiento (ejercicio)", "método reduce", "método concat", [array, aplanamiento]}}

Utiliza el método `reduce` en combinación con el método `concat` para "aplanar" un array de arrays en un único array que contenga todos los elementos de los arrays originales.

{{if interactive

```{test: no}
let arrays = [[1, 2, 3], [4, 5], [6]];
// Tu código aquí.
// → [1, 2, 3, 4, 5, 6]
```
if}}

### Tu propio bucle

{{index "ejemplo tu propio bucle", "bucle for"}}

Escribe una función de orden superior `loop` que proporcione algo similar a una declaración `for` loop. Debería recibir un valor, una función de prueba, una función de actualización y una función de cuerpo. En cada iteración, primero debe ejecutar la función de prueba en el valor actual del bucle y detenerse si devuelve falso. Luego debe llamar a la función de cuerpo, dándole el valor actual, y finalmente llamar a la función de actualización para crear un nuevo valor y empezar de nuevo desde el principio.

Al definir la función, puedes usar un bucle regular para hacer el bucle real.

{{if interactive

```{test: no}
// Your code here.

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1
```

if}}

### Everything

Los arrays también tienen un método `every` análogo al método `some`. Este método devuelve `true` cuando la función dada devuelve `true` para _cada_ elemento en el array. En cierto modo, `some` es una versión del operador `||` que actúa en arrays, y `every` es como el operador `&&`.

Implementa `every` como una función que recibe un array y una función de predicado como parámetros. Escribe dos versiones, una usando un bucle y otra usando el método `some`.

{{if interactive

```{test: no}
function every(array, test) {
  // Your code here.
}

console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true
```

if}}

{{hint

{{index "everything (exercise)", "short-circuit evaluation", "return keyword"}}

Como el operador `&&`, el método `every` puede dejar de evaluar más elementos tan pronto como encuentre uno que no coincida. Por lo tanto, la versión basada en bucle puede salir del bucle—con `break` o `return—tan pronto como encuentre un elemento para el que la función de predicado devuelva false. Si el bucle se ejecuta hasta el final sin encontrar dicho elemento, sabemos que todos los elementos coincidieron y deberíamos devolver true.

{{index "método some"}}

Para construir `every` sobre `some`, podemos aplicar _((leyes de De Morgan))_, que establecen que `a && b` es igual a `!(!a || !b)`. Esto se puede generalizar a arrays, donde todos los elementos en el array coinciden si no hay ningún elemento en el array que no coincida.

hint}}

### Dirección de escritura dominante

Escribe una función que calcule la dirección de escritura dominante en una cadena de texto. Recuerda que cada objeto script tiene una propiedad `direction` que puede ser `"ltr"` (de izquierda a derecha), `"rtl"` (de derecha a izquierda) o `"ttb"` (de arriba a abajo).

{{if interactive

```{test: no}
function dominantDirection(text) {
  // Your code here.
}

console.log(dominantDirection("Hello!"));
// → ltr
console.log(dominantDirection("Hey, مساء الخير"));
// → rtl
```
if}}

{{hint

{{index "dirección dominante (ejercicio)", "función textScripts", "método filter", "función characterScript"}}

Tu solución podría parecerse mucho a la primera mitad del ejemplo de `textScripts`. De nuevo, debes contar caracteres según un criterio basado en `characterScript` y luego filtrar la parte del resultado que se refiere a caracteres no interesantes (sin script).

{{index "método reduce"}}

Encontrar la dirección con el recuento de caracteres más alto se puede hacer con `reduce`. Si no está claro cómo hacerlo, consulta el ejemplo anterior en el capítulo, donde se usó `reduce` para encontrar el script con más caracteres.

hint}}