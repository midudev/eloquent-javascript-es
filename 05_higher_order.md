{{meta {load_files: ["code/scripts.js", "code/chapter/05_higher_order.js", "code/intro.js"], zip: "node/html"}}}
# Funciones de Orden Superior

_"Hay dos maneras de construir un diseño de software: una forma es hacerlo tan simple que obviamente no haya defectos, y la otra forma es hacerlo tan complicado que no haya defectos obvios."_

— C.A.R. Hoare, _Discurso de Recepción del Premio Turing de la ACM de 1980_

Un programa grande es un programa costoso, y no solo por el tiempo que lleva construirlo. El tamaño casi siempre implica complejidad, y la complejidad confunde a los programadores. Los programadores confundidos, a su vez, introducen errores (_((bugs))_) en los programas. Un programa grande da mucho hueco para que estos errores se escondan, lo que los hace difíciles de encontrar.

Vamos a volver por un momento a los dos ejemplos de programas del final de la introducción. El primero es autocontenido y tiene seis líneas:

```
let total = 0, contador = 1;
while (contador <= 10) {
  total += contador;
  contador += 1;
}
console.log(total);
```

El segundo depende de dos funciones externas y tiene una línea:

```
console.log(suma(rango(1, 10)));
```

¿Cuál es más probable que contenga un error?

Si contamos el tamaño de las definiciones de `suma` y `rango`, el segundo programa también es grande, incluso más que el primero. Pero, aún así, diría que es más probable que sea correcto.

Esto se debe a que la solución se expresa en un ((vocabulario)) que corresponde al problema que se está resolviendo. Sumar un intervalo de números no va considerar bucles y contadores. Va de intervalos y sumas.

Las definiciones de este vocabulario (las funciones `suma` y `rango`) no dejan de consistir en trabajar con bucles, contadores y otros detalles. Pero debido a que expresan conceptos más simples que el programa en su totalidad, son más fáciles de hacer correctamente.

## Abstracción

En el contexto de la programación, este tipo de vocabularios se suelen llamar _((abstraccion))es_. Las abstracciones nos brindan la capacidad de hablar sobre problemas a un nivel superior (o más abstracto), sin distraernos con detalles no interesantes.

Como analogía, compara estas dos recetas de sopa de guisantes. La primera es así:

{{quote 

Pon 1 taza de guisantes secos por persona en un recipiente. Añade agua hasta que los guisantes estén bien cubiertos. Deja los guisantes en agua durante al menos 12 horas. Saca los guisantes del agua y ponlos en una olla. Agrega 4 tazas de agua por persona. Cubre la olla y deja los guisantes cociendo a fuego lento durante dos horas. Toma media cebolla por persona. Córtala en trozos con un cuchillo. Agrégala a los guisantes. Toma un tallo de apio por persona. Córtalo en trozos con un cuchillo. Agrégalo a los guisantes. Toma una zanahoria por persona. ¡Córtala en trozos! ¡Con un cuchillo! Agrégala a los guisantes. Cocina durante 10 minutos más.

quote}}

Y esta es la segunda receta:

{{quote

Por persona: 1 taza de guisantes partidos secos, 4 tazas de agua, media cebolla picada, un tallo de apio y una zanahoria.

Remoja los guisantes durante 12 horas. Cocina a fuego lento durante 2 horas. Pica y agrega las verduras. Cocina durante 10 minutos más.

quote}}

La segunda es más corta y fácil de interpretar. Pero necesitas entender algunas palabras más relacionadas con la cocina, como _remojar_, _cocinar a fuego lento_, _picar_, y, supongo, _verdura_.

Cuando se programa, no podemos depender de que todas las palabras que necesitamos estén ya escritas en el diccionario para nosotros. Por lo tanto, podríamos caer en el patrón de la primera receta: ejecutar los pasos precisos que la computadora tiene que realizar, uno por uno, sin atender a los conceptos de más alto nivel que expresan.

Una habilidad útil en programación es darse cuenta de cuándo se está trabajando a un muy bajo nivel de abstracción.

## Abstraer la repetición

Funciones simples como las hemos visto hasta ahora son una buena manera de construir abstracciones. Pero a veces se quedan cortas.

Es común que un programa haga algo una cantidad determinada de veces. Puedes escribir un `for` para eso, así:

```
for (let i = 0; i < 10; i++) {
  console.log(i);
}
```

¿Podemos abstraer "hacer algo _N_ veces" como una función? Bueno, es fácil escribir una función que llame a `console.log` _N_ veces:

```
function repetirLog(n) {
  for (let i = 0; i < n; i++) {
    console.log(i);
  }
}
```

¿Y si queremos hacer algo que no sea solo pintar los los números? Dado que "hacer algo" se puede representar como una función y las funciones son solo valores, podemos pasar nuestra acción como un valor de función:

```{includeCode: "top_lines: 5"}
function repetir(n, acción) {
  for (let i = 0; i < n; i++) {
    acción(i);
  }
}

repetir(3, console.log);
// → 0
// → 1
// → 2
```

No tenemos que pasar una función predefinida a `repetir`. A menudo, es más fácil crear un valor de función en el momento:

```
let etiquetas = [];
repetir(5, x => {
  etiquetas.push(`Unidad ${x + 1}`);
});
console.log(etiquetas);
// → ["Unidad 1", "Unidad 2", "Unidad 3", "Unidad 4", "Unidad 5"]
```

{{note "**N. del T.:** Con respecto a la versión original del texto, se ha cambiado el nombre del parámetro en la función flecha de `i` a `x` para enfatizar la no necesidad de que el parámetro de dicha función se llame como el parámetro contador del bucle for de la implementación de la función `repetir`."}}

Esto está estructurado un poco como un bucle `for`: primero describe el tipo de bucle y luego proporciona un cuerpo. Sin embargo, el cuerpo ahora está escrito como un valor de función, que está envuelto entre los paréntesis de la llamada a `repetir`. Por eso tiene que cerrarse con el corchete de cierre _y_ el paréntesis de cierre. En casos como este ejemplo donde el cuerpo es una sola expresión pequeña, también podrías omitir los corchetes y escribir el bucle en una sola línea.

## Funciones de orden superior

Las funciones que operan sobre otras funciones, ya sea tomándolas como argumentos o devolviéndolas, se llaman _funciones de orden superior_. Dado que ya hemos visto que las funciones son valores como cualquier otro, no hay nada particularmente notable en el hecho de que existan tales funciones. El término proviene de las matemáticas, donde se toma más en serio la distinción entre funciones y otros valores.

{{index abstraction}}

Las funciones de orden superior nos permiten abstraer _acciones_, no solo valores. Las hay de muchas formas. Por ejemplo, podemos tener funciones que crean nuevas funciones:

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

Existe un método ya incorporado en los arrays, `forEach`, que proporciona algo similar a un bucle `for`/`of` como una función de orden superior:

```
["A", "B"].forEach(l => console.log(l));
// → A
// → B
```

{{id scripts}}

## Conjunto de datos de sistemas de escritura

Un área donde las funciones de orden superior destacan es en el procesamiento de datos. Para procesar datos, vamos a necesitar algunos datos de ejemplo. Este capítulo utilizará un ((conjunto de datos)) sobre sistemas de escritura tales como el latín, cirílico o árabe.

¿Recuerdas ((Unicode)) del [Capítulo ?](values#unicode), el sistema que asigna un número a cada carácter en lenguaje escrito? La mayoría de estos caracteres están asociados con un sistema de escritura concreto. El estándar contiene 140 sistemas diferentes, de los cuales 81 aún se utilizan hoy en día y 59 son históricos.

Aunque solo puedo leer con fluidez caracteres latinos, aprecio el hecho de que las personas estén escribiendo textos en al menos otros 80 sistemas de escritura, muchos de los cuales ni siquiera reconocería. Por ejemplo, aquí tienes una muestra de escritura ((Tamil)):

{{figure {url: "img/tamil.png", alt: "Una línea de verso en escritura Tamil. Los caracteres son relativamente simples y separados ordenadamente, pero completamente diferentes de los caracteres latinos."}}}

{{index "conjunto de datos SCRIPTS"}}

El ((conjunto de datos)) de ejemplo contiene información sobre los 140 sistemas de escritura definidos en Unicode. Está disponible en el [sandbox de código](https://eloquentjavascript.net/code#5) para este capítulo[ ([_https://eloquentjavascript.net/code#5_](https://eloquentjavascript.net/code#5))]{if book} como la asociación de nombre `SCRIPTS`. La variable contiene un array de objetos, cada uno describiendo un sistema de escritura:


```{lang: "json"}
{
  name: "Coptic",
  ranges: [[994, 1008], [11392, 11508], [11513, 11520]],
  direction: "ltr",
  year: -200,
  living: false,
  link: "https://en.wikipedia.org/wiki/Coptic_alphabet"
}
```

Tal objeto nos informa sobre el nombre del sistema de lenguaje, los rangos Unicode asignados a él, la dirección en la que se escribe, el momento de origen (aproximado), si todavía se utiliza, y un enlace a más información. La dirección puede ser `"ltr"` para izquierda a derecha, `"rtl"` para derecha a izquierda (como se escribe el texto en árabe y hebreo) o `"ttb"` para arriba hacia abajo (como en la escritura mongola).

{{index "método de segmento"}}

La propiedad `ranges` contiene un array de ((rangos)) de caracteres Unicode, cada uno de los cuales es un array de dos elementos que contiene un límite inferior y un límite superior. Todos los códigos de caracteres dentro de estos rangos se asignan al sistema de escritura en cuestión. El límite inferior es inclusivo (el código 994 es un carácter copto) y el límite superior es no inclusivo (el código 1008 no lo es).

## Filtrado de arrays

{{index [array, "métodos"], [array, filtrado], "método de filtrado", ["función", "de orden superior"], "función de predicado"}}

Si queremos encontrar en el conjunto de datos qué sistemas de escritura todavía se utilizan, la siguiente función puede ser útil. Deja fuera los elementos de un array que no cumplen una cierta comprobación.

```
function filtrar(array, comprobación) {
  let pasada = [];
  for (let elemento of array) {
    if (comprobación(elemento)) {
      pasada.push(elemento);
    }
  }
  return pasada;
}

console.log(filtrar(SCRIPTS, sistema => sistema.living));
// → [{name: "Adlam", …}, …]
```

{{index ["función", "como valor"], ["función", "aplicación"]}}

La función utiliza el argumento llamado `comprobación`, un valor de función, para llenar un "hueco" en el procedimiento de filtrado: el proceso de decidir qué elementos recopilar.

{{index "método de filtrado", "función pura", "efecto secundario"}}

Observa cómo la función `filtrar`, en lugar de eliminar elementos de la matriz existente, construye una nueva matriz con solo los elementos que pasan la prueba. Esta función es _pura_. No modifica la matriz que se le pasa.

Al igual que con `forEach`, hay un método ((estándar)) para `filtrar` en los arrays, el método `filter`. En el ejemplo se define la función solo para mostrar qué hace internamente. De ahora en adelante, lo usaremos de esta manera en su lugar:

```
console.log(SCRIPTS.filter(s => s.direction == "ttb"));
// → [{name: "Mongolian", …}, …]
```

{{id map}}

## Transformación con map

{{index [array, "métodos"], "método de mapeo"}}

Digamos que tenemos un array de objetos que representan sistemas de escritura, producido al filtrar el array `SCRIPTS` de alguna manera. En su lugar, queremos un array de nombres, que es más fácil de inspeccionar.

{{index ["función", "de orden superior"]}}

El método `map` transforma un array aplicando una función a todos sus elementos y construyendo un nuevo array a partir de los valores devueltos. El nuevo array tendrá la misma longitud que el de entrada, pero su contenido habrá sido _mapeado_ a una nueva forma por la función:

```
function mapear(array, transformación) {
  let mapeados = [];
  for (let elemento of array) {
    mapeados.push(transformación(elemento));
  }
  return mapeados;
}

let rtlScripts = SCRIPTS.filter(s => s.direction == "rtl");
console.log(mapear(rtlScripts, s => s.name));
// → ["Adlam", "Arabic", "Imperial Aramaic", …]
```

Al igual que `forEach` y `filter`, hay un método estándar para `mapear` en los arrays, el método `map`.

## Resumiendo con reduce

{{index [array, "métodos"], "ejemplo de suma", "método de reducción"}}

Otra cosa común que hacer con arrays es calcular un único valor a partir de ellos. Nuestro ejemplo de siempre, sumar una colección de números, es una ejemplo de esto. Otro ejemplo es encontrar el sistema de escritura con más caracteres.

{{indexsee "fold", "método de reducción"}}

{{index ["función", "de orden superior"], "método de reducción"}}

La operación de orden superior que representa esta idea se llama _reduce_ (a veces también llamada _fold_). Construye un valor tomando repetidamente un único elemento del array y combinándolo con el valor actual. Al sumar números empezarías con el número cero y añadirías cada elemento a la suma.

Los parámetros de `reduce` son, además del array, una función de combinación y un valor inicial. Esta función es un poco menos directa que `filter` y `map`, así que obsérva detenidamente:

```
function reducir(array, combinación, principio) {
  let actual = inicio;
  for (let elemento of array) {
    actual = combinación(actual, elemento);
  }
  return actual;
}

console.log(reducir([1, 2, 3, 4], (a, b) => a + b, 0));
// → 10
```

{{index "método reduce", "conjunto de datos SCRIPTS"}}

El método estándar de arrays, `reduce` —que por supuesto corresponde a esta función— tiene una ventaja adicional. Si tu array contiene al menos un elemento, puedes omitir el argumento `start`. El método tomará el primer elemento del array como su valor inicial y comenzará a reducir en el segundo elemento.

```
console.log([1, 2, 3, 4].reduce((a, b) => a + b));
// → 10
```

{{index "máximo", "función characterCount"}}

Para usar `reduce` (dos veces) y encontrar el sistema de escritura con más caracteres, podemos escribir algo así:

```
function contarCaracteres(sistema) {
  return sistema.ranges.reduce((contador, [desde, hasta]) => {
    return contador + (hasta - desde);
  }, 0);
}

console.log(SCRIPTS.reduce((a, b) => {
  return contarCaracteres(a) < contarCaracteres(b) ? b : a;
}));
// → {name: "Han", …}
```

La función `contarCaracteres` reduce los rangos asignados a un sistema de escritura sumando sus tamaños. Observa el uso de la desestructuración en la lista de parámetros de la función reductora. La segunda llamada a `reduce` luego utiliza esto para encontrar el sistema de escritura más grande comparando repetidamente dos sistemas y devolviendo el más grande.

El sistema de escritura Han (es decir, el sistema de escritura chino actual) tiene más de 89000 caracteres asignados en el estándar Unicode, convirtiéndolo en el sistema de escritura más grande del conjunto de datos. El sistema Han es un sistema a veces utilizado para texto en chino, japonés y coreano. Estos idiomas comparten muchos caracteres, aunque tienden a escribirlos de manera diferente. El Consorcio Unicode (con sede en EE. UU.) decidió tratarlos como un único sistema de escritura para ahorrar códigos de caracteres. Esto se llama _unificación Han_ y aún hay gente que no está muy contenta con ella.

## Composabilidad

{{index bucle, "máximo"}}

Considera cómo hubiéramos escrito el ejemplo anterior (encontrar el sistema más grande) sin funciones de orden superior. El código no es tan inferior al anterior.

```{test: no}
let másGrande = null;
for (let sistema of SCRIPTS) {
  if (másGrande == null ||
      contarCaracteres(másGrande) < contarCaracteres(sistema)) {
    másGrande = sistema;
  }
}
console.log(másGrande);
// → {name: "Han", …}
```

Hay algunas variables más y el programa tiene cuatro líneas más, pero sigue siendo muy legible.

{{index "función promedio", composabilidad, ["función", "de orden superior"], "método filter", "método map", "método reduce"}}

{{id average_function}}

Las abstracciones proporcionadas por estas funciones brillan realmente cuando necesitas _componer_ operaciones. Como ejemplo, escribamos un código que encuentre el año promedio de origen para sistemas vivos y muertos en el conjunto de datos:

```
function promedio(array) {
  return array.reduce((a, b) => a + b) / array.length;
}

console.log(Math.round(promedio(
  SCRIPTS.filter(s => s.living).map(s => s.year))));
// → 1165
console.log(Math.round(promedio(
  SCRIPTS.filter(s => !s.living).map(s => s.year))));
// → 204
```

Como puedes ver, los sistemas de escritura muertos en Unicode son, en promedio, más antiguos que los vivos. Esta no es una estadística muy significativa o sorprendente. Pero espero que estés de acuerdo en que el código utilizado para calcularlo no es difícil de leer. Puedes verlo como una cadena de procesos (pipeline): empezamos con todos los sistemas, filtramos los vivos (o muertos), tomamos los años de esos sistemas, calculamos el promedio y redondeamos el resultado.

Definitivamente también podrías escribir este cálculo como un único ((bucle)) grande:

```
let total = 0, contador = 0;
for (let sistema of SCRIPTS) {
  if (sistema.living) {
    total += sistema.year;
    contador += 1;
  }
}
console.log(Math.round(total / contador));
// → 1165
```

Sin embargo, es más difícil ver qué se estaba calculando y cómo. Y como los resultados intermedios no se representan como valores coherentes, sería mucho más trabajo extraer algo como el `promedio` en una función separada.

{{index efficiency, [array, creation]}}

En términos de lo que realmente está haciendo la computadora, estos dos enfoques también son bastante distintos. El primero construirá nuevos arrays al ejecutar `filter` y `map`, mientras que el segundo calcula solo algunos números, haciendo menos trabajo. Por lo general, puedes permitirte el enfoque legible, pero si estás procesando arrays enormes y haciéndolo muchas veces, un estilo menos abstracto podría valer la pena a cambio de velocidad adicional.

## Cadenas y códigos de caracteres

{{index "SCRIPTS data set"}}

Un uso interesante de este conjunto de datos sería averiguar qué sistema de escritura está utilizando un fragmento de texto. Veamos un programa que hace esto.

Recuerda que cada sistema de escritura tiene asociado un array de intervalos de códigos de caracteres. Dado un código de carácter, podríamos usar una función como esta para encontrar el sistema correspondiente (si lo hay):

{{index "some method", "predicate function", [array, methods]}}

```{includeCode: strip_log}
function sistemaCaracteres(código) {
  for (let sistema of SCRIPTS) {
    if (sistema.ranges.some(([desde, hasta]) => {
      return código >= desde && código < hasta;
    })) {
      return sistema;
    }
  }
  return null;
}

console.log(sistemaCaracteres(121));
// → {name: "Latin", …}
```

El método `some` es otra función de orden superior. Toma una función de comprobación y te dice si esa función devuelve true para alguno de los elementos en el array.

{{id code_units}}

Pero, ¿cómo obtenemos los códigos de caracteres en una cadena?

En el [Capítulo ?](values) mencioné que las cadenas de JavaScript están codificadas como una secuencia de números de 16 bits. Estos se llaman _((unidades de código))_. Al principio, se suponía que un código de carácter Unicode cabía dentro de tal unidad (lo que te da algo más de 65000 caracteres). Cuando quedó claro que eso no iba a ser suficiente, mucha gente se mostró reacia a la necesidad de usar más memoria por carácter. Para abordar estas preocupaciones, se inventó ((UTF-16)), el formato que usan las cadenas de JavaScript. Describe la mayoría de los caracteres comunes usando una única unidad de código de 16 bits, pero usa un par de dos unidades de dicho tipo para otros.

{{index error}}

UTF-16 generalmente se considera una mala idea hoy en día. Parece casi diseñado intencionalmente para provocar errores. Es fácil escribir programas que asuman que las unidades de código y los caracteres son lo mismo. Y si tu lenguaje no utiliza caracteres de dos unidades, eso parecerá funcionar perfectamente. Pero tan pronto como alguien intente usar dicho programa con algunos caracteres menos comunes como los chinos, fallará. Por suerte, con la llegada de los emoji, todo el mundo ha comenzado a usar caracteres de dos unidades, y tratar con tales problemas se está haciendo más llevadero.

{{index [cadena, longitud], [cadena, "indexación"], "método charCodeAt"}}

Lamentablemente, las operaciones obvias en las cadenas de JavaScript, como obtener su longitud a través de la propiedad `length` y acceder a su contenido usando corchetes cuadrados, tratan solo con unidades de código.

```{test: no}
// Dos caracteres emoji, caballo y zapato
let caballoZapato = "🐴👟";
console.log(caballoZapato.length);
// → 4
console.log(caballoZapato[0]);
// → (Mitad de carácter inválida)
console.log(caballoZapato.charCodeAt(0));
// → 55357 (Código de la mitad de caracter)
console.log(caballoZapato.codePointAt(0));
// → 128052 (Código real para el emoji de caballo)
```

{{index "método codePointAt"}}

El método `charCodeAt` de JavaScript te da una unidad de código, no un código de carácter completo. El método `codePointAt`, añadido más tarde, sí da un carácter Unicode completo, por lo que podríamos usarlo para obtener caracteres de una cadena. Pero el argumento pasado a `codePointAt` sigue siendo un índice en la secuencia de unidades de código. Para recorrer todos los caracteres en una cadena, aún necesitaríamos abordar la cuestión de si un carácter ocupa una o dos unidades de código.

{{index "bucle for/of", caracter}}

En el [capítulo anterior](datos#bucle_for_of), mencioné que un bucle `for`/`of` también se puede usar en cadenas. Al igual que `codePointAt`, este tipo de bucle se introdujo en un momento en que la gente era muy consciente de los problemas con UTF-16. Cuando lo usas para recorrer una cadena, te proporciona caracteres reales, no unidades de código:

```
let rosaDragón = "🌹🐉";
for (let carácter of rosaDragón) {
  console.log(caracter);
}
// → 🌹
// → 🐉
```

Si tienes un carácter (que será una cadena de una o dos unidades de código), puedes usar `codePointAt(0)` para obtener su código.

## Reconociendo texto

{{index "conjunto de datos SCRIPTS", "función countBy", [array, conteo]}}

Tenemos una función `sistemaCaracteres` y una forma de recorrer correctamente los caracteres. El próximo paso es contar los caracteres que pertenecen a cada sistema de escritura. La siguiente abstracción de recuento será útil para eso:

```{includeCode: strip_log}
function contarPor(items, nombreGrupo) {
  let recuentos = [];
  for (let item of items) {
    let nombre = nombreGrupo(item);
    let conocido = recuentos.find(c => c.nombre == nombre);
    if (!conocido) {
      recuentos.push({nombre, recuento: 1});
    } else {
      conocido.recuento++;
    }
  }
  return recuentos;
}

console.log(contarPor([1, 2, 3, 4, 5], n => n > 2));
// → [{nombre: false, recuento: 2}, {nombre: true, recuento: 3}]
```

La función `contarPor` espera una colección (cualquier cosa por la que podamos iterar con `for`/`of`) y una función que calcule un nombre de grupo para un elemento dado. Devuelve una matriz de objetos, cada uno de los cuales nombra un grupo y te dice el número de elementos que se encontraron en ese grupo.

{{index "método find"}}

Utiliza otro método de array, `find`, que recorre los elementos en el array y devuelve el primero para el cual una función devuelve true. Devuelve `undefined` cuando no se encuentra dicho elemento.

{{index "función textScripts", "caracteres chinos"}}

Usando `contarPor`, podemos escribir la función que nos dice qué sistemas de escritura se utilizan en un fragmento de texto:

```{includeCode: strip_log, startCode: true}
function sistemasTexto(texto) {
  let sistemas = contarPor(texto, carácter => {
    let sistema = sistemaCaracteres(carácter.codePointAt(0));
    return sistema ? sistema.name : "ninguno";
  }).filter(({nombre}) => nombre != "ninguno");

  let total = sistemas.reduce((n, {recuento}) => n + recuento, 0);
  if (total == 0) return "No se encontraron sistemas";

  return sistemas.map(({nombre, recuento}) => {
    return `${Math.round(recuento * 100 / total)}% ${nombre}`;
  }).join(", ");
}

console.log(sistemasTexto('英国的狗说"woof", 俄罗斯的狗说"тяв"'));
// → 61% Han, 22% Latin, 17% Cyrillic
```

{{index "función characterScript", "método filter"}}

La función primero recoge los nombres de los sistemas de escritura de los caracteres en el texto usando `sistemaCaracteres` para asignarles un nombre y recurriendo a la cadena `"ninguno"` para los caracteres que no forman parte de ningún sistema. La llamada a `filter` elimina la entrada correspondiente a `"ninguno"` del array resultante, ya que no nos interesan esos caracteres.

{{index "método reduce", "método map", "método join", [array, methods]}}

Para poder calcular porcentajes, primero necesitamos el número total de caracteres que pertenecen a un sistema dado, lo cual podemos calcular con `reduce`. Si no se encuentran dichos caracteres, la función devuelve una cadena específica. De lo contrario, transforma las entradas de conteo en cadenas legibles con `map` y luego las combina con `join`.

## Resumen

Poder pasar valores de funciones a otras funciones es un aspecto muy útil de JavaScript. Nos permite escribir funciones que modelan cálculos con "huecos a rellenar" en ellas. El código que llama a estas funciones puede llenar los huecos proporcionando valores de funciones.

Los arrays proporcionan diversos métodos de orden superior muy útiles. Puedes usar `forEach` para recorrer los elementos de un array. El método `filter` devuelve un nuevo array que contiene solo los elementos que pasan la ((función de predicado)). Transformar un array poniendo cada elemento en una función se hace con `map`. Puedes usar `reduce` para combinar todos los elementos de un array en un único valor. El método `some` comprueba si algún elemento satisface una función de predicado dada, mientras que `find` encuentra el primer elemento que satisface un predicado.

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

Escribe una función de orden superior `loop` que proporcione algo similar a una declaración de bucle `for`. Debería recibir un valor, una función de comprobación, una función de actualización y una función de cuerpo. En cada iteración, primero debe ejecutar la función de comprobación en el valor actual del bucle y detenerse si devuelve falso. Luego debe llamar a la función de cuerpo, pasándole el valor actual, y finalmente llamar a la función de actualización para crear un nuevo valor y empezar de nuevo desde el principio.

Al definir la función, puedes usar un bucle normal para hacer el bucle real.

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

Los arrays también tienen un método `every` análogo al método `some`. Este método devuelve `true` cuando la función dada devuelve `true` para _todo_ elemento en el array. En cierto modo, `some` es una versión del operador `||` que actúa en arrays, y `every` es como el operador `&&`.

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

Al igual que el operador `&&`, el método `every` puede dejar de evaluar más elementos tan pronto como encuentre uno que no coincida. Por lo tanto, la versión basada en un bucle puede salir del bucle —con `break` o `return`— tan pronto como encuentre un elemento para el que la función de predicado devuelva false. Si el bucle se ejecuta hasta el final sin encontrar dicho elemento, sabemos que todos los elementos coincidieron y deberíamos devolver true.

{{index "método some"}}

Para construir `every` sobre `some`, podemos aplicar _((leyes de De Morgan))_, que establecen que `a && b` tiene el mismo valor que `!(!a || !b)`. Esto se puede generalizar a arrays, donde todos los elementos en el array coinciden si no hay ningún elemento en el array que no coincida.

hint}}

### Dirección de escritura dominante

Escribe una función que calcule la dirección de escritura dominante en una cadena de texto. Recuerda que cada objeto de sistema de escritura tiene una propiedad `direction` que puede ser `"ltr"` (de izquierda a derecha), `"rtl"` (de derecha a izquierda) o `"ttb"` (de arriba a abajo).

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

Tu solución podría parecerse mucho a la primera mitad del ejemplo de `sistemasTexto`. De nuevo, debes contar caracteres según un criterio basado en `sistemaCaracteres` y luego filtrar la parte del resultado que se refiere a caracteres no interesantes (sin sistema asociado).

{{index "método reduce"}}

Encontrar la dirección con el recuento de caracteres más alto es algo que se puede hacer con `reduce`. Si no está claro cómo hacerlo, consulta el ejemplo que vimos antes en el capítulo, donde se usó `reduce` para encontrar el script con más caracteres.

hint}}