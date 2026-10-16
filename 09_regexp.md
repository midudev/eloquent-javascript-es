# Expresiones regulares

{{quote {author: "Jamie Zawinski", chapter: true}

Algunas personas, cuando se enfrentan a un problema, piensan '¡Ya sé, usaré expresiones regulares!' Ahora tienen dos problemas.

quote}}

{{index "Zawinski, Jamie"}}

{{if interactive

{{quote {author: "Master Yuan-Ma", title: "El Libro de la Programación", chapter: true}

Cuando cortas en contra de la veta de la madera, se necesita mucha fuerza. Cuando programas en contra de la veta del problema, se necesita mucho código.

quote}}

if}}

{{figure {url: "img/chapter_picture_9.jpg", alt: "Ilustración de un sistema de ferrocarril que representa la estructura sintáctica de las expresiones regulares", chapter: framed}}}

{{index "evolución", "adopción", "integración"}}

Las herramientas y técnicas de programación sobreviven y se propagan de manera caótica y evolutiva. No siempre ganan las mejores o brillantes, sino aquellas que funcionan lo suficientemente bien dentro del nicho correcto o que se integran con otra pieza exitosa de tecnología.

{{index "lenguaje específico de dominio"}}

En este capítulo, discutiré una de esas herramientas, _((expresiones regulares))_. Las expresiones regulares son una forma de describir ((patrón))es en datos de cadena. Forman un pequeño lenguaje separado que es parte de JavaScript y muchos otros lenguajes y sistemas.

{{index [interfaz, "diseño"]}}

Las expresiones regulares son tanto terriblemente incómodas como extremadamente útiles. Su sintaxis es críptica y la interfaz de programación que JavaScript proporciona para ellas es torpe. Pero son una herramienta poderosa para inspeccionar y procesar cadenas. Comprender adecuadamente las expresiones regulares te hará un programador más efectivo.

## Creando una expresión regular

{{index ["expresión regular", "creación"], "clase RegExp", "expresión literal", "carácter de barra diagonal"}}

Una expresión regular es un tipo de objeto. Puede ser construido con el constructor `RegExp` o escrito como un valor literal al encerrar un patrón entre caracteres de barra diagonal (`/`).

```
let re1 = new RegExp("abc");
let re2 = /abc/;
```

Ambos objetos de expresión regular representan el mismo ((patrón)): un carácter _a_ seguido de un _b_ seguido de un _c_.

{{index ["carácter de barra invertida", "en expresiones regulares"], "clase RegExp"}}

Cuando se utiliza el constructor `RegExp`, el patrón se escribe como una cadena normal, por lo que se aplican las reglas habituales para las barras invertidas.

{{index ["expresión regular", escape], [escape, "en regexps"], "carácter de barra diagonal"}}

La segunda notación, donde el patrón aparece entre caracteres de barra diagonal, trata las barras invertidas de manera un poco diferente. Primero, dado que una barra diagonal termina el patrón, debemos poner una barra invertida antes de cualquier barra diagonal que queramos que sea _parte_ del patrón. Además, las barras invertidas que no forman parte de códigos de caracteres especiales (como `\n`) serán _preservadas_, en lugar de ser ignoradas como lo son en las cadenas, y cambian el significado del patrón. Algunos caracteres, como signos de interrogación y signos de más, tienen significados especiales en las expresiones regulares y deben ser precedidos por una barra invertida si se desea representar el propio carácter.

```
let aPlus = /A\+/;
```

## Pruebas de coincidencias

{{index coincidencia, "método test", ["expresión regular", "métodos"]}}

Los objetos de expresiones regulares tienen varios métodos. El más simple es `test`. Si le pasas una cadena, devolverá un ((Booleano)) indicándote si la cadena contiene una coincidencia con el patrón de la expresión.

```
console.log(/abc/.test("abcde"));
// → true
console.log(/abc/.test("abxde"));
// → false
```

{{index "patrón"}}

Una ((expresión regular)) que consiste solo en caracteres no especiales simplemente representa esa secuencia de caracteres. Si _abc_ aparece en cualquier parte de la cadena contra la cual estamos probando (no solo al principio), `test` devolverá `true`.

## Conjuntos de caracteres

{{index "expresión regular", "método indexOf"}}

Descubrir si una cadena contiene _abc_ también se podría hacer con una llamada a `indexOf`. Las expresiones regulares son útiles porque nos permiten describir patrones más complicados.

Digamos que queremos hacer coincidir cualquier ((número)). En una expresión regular, poner un ((conjunto)) de caracteres entre corchetes hace que esa parte de la expresión coincida con cualquiera de los caracteres entre los corchetes.

Ambas expresiones siguientes hacen coincidir todas las cadenas que contienen un ((dígito)):

```
console.log(/[0123456789]/.test("in 1992"));
// → true
console.log(/[0-9]/.test("in 1992"));
// → true
```

{{index "carácter de guion"}}

Dentro de corchetes, un guion (`-`) entre dos caracteres se puede usar para indicar un rango de caracteres, donde el orden es determinado por el número del carácter en el ((Unicode)). Los caracteres del 0 al 9 están uno al lado del otro en este orden (códigos 48 a 57), por lo que `[0-9]` abarca todos ellos y coincide con cualquier ((dígito)).

{{index ["espacio en blanco", coincidencia], "caracter alfanumérico", "caracter de punto"}}

Varios grupos comunes de caracteres tienen sus propias abreviaturas incorporadas. Los dígitos son uno de ellos: `\d` significa lo mismo que `[0-9]`.

{{index "carácter de nueva línea", ["espacio en blanco", coincidencia]}}

{{table {cols: [1, 5]}}}

| `\d`    | Cualquier carácter ((dígito))
| `\w`    | Un carácter alfanumérico ("carácter de palabra")
| `\s`    | Cualquier carácter de espacio en blanco (espacio, tabulación, nueva línea, y similares)
| `\D`    | Un carácter que _no_ es un dígito
| `\W`    | Un carácter no alfanumérico
| `\S`    | Un carácter que no es de espacio en blanco
| `.`     | Cualquier carácter excepto nueva línea

Así que podrías hacer coincidir un formato de ((fecha)) y ((hora)) como 01-30-2003 15:20 con la siguiente expresión:

```
let dateTime = /\d\d-\d\d-\d\d\d\d \d\d:\d\d/;
console.log(dateTime.test("01-30-2003 15:20"));
// → true
console.log(dateTime.test("30-ene-2003 15:20"));
// → false
```

{{index ["carácter de barra invertida", "en expresiones regulares"]}}

¡Eso se ve completamente horrible, ¿verdad? La mitad son barras invertidas, produciendo un ruido de fondo que dificulta identificar el ((patrón)) expresado. Veremos una versión ligeramente mejorada de esta expresión [más adelante](regexp#date_regexp_counted).

{{index [escape, "en regexps"], "expresión regular", conjunto}}

Estos códigos de barra invertida también se pueden usar dentro de ((corchetes)). Por ejemplo, `[\d.]` significa cualquier dígito o un carácter de punto. Pero el punto en sí, entre corchetes, pierde su significado especial. Lo mismo ocurre con otros caracteres especiales, como `+`.

{{index "corchetes cuadrados", "inversión", "carácter circunflejo"}}

Para _invertir_ un conjunto de caracteres, es decir, expresar que deseas hacer coincidir cualquier carácter _excepto_ los que están en el conjunto, puedes escribir un carácter circunflejo (`^`) después del corchete de apertura.

```
let nonBinary = /[^01]/;
console.log(nonBinary.test("1100100010100110"));
// → false
console.log(nonBinary.test("0111010112101001"));
// → true
```

## Caracteres internacionales

{{index "internacionalización", Unicode, ["expresión regular", "internacionalización"]}}

Debido a la implementación simplista inicial de JavaScript y al hecho de que este enfoque simplista luego se estableció como comportamiento ((estándar)), las expresiones regulares de JavaScript son bastante simples en lo que respecta a los caracteres que no aparecen en el idioma inglés. Por ejemplo, según las expresiones regulares de JavaScript, un "((carácter de palabra))" es solo uno de los 26 caracteres del alfabeto latino (mayúsculas o minúsculas), dígitos decimales y, por alguna razón, el guion bajo. Cosas como _é_ o _β_, que definitivamente son caracteres de palabra, no coincidirán con `\w` (y _sí_ coincidirán con `\W` en mayúsculas, la categoría de no palabras).

{{index [espacio en blanco, coincidencia]}}

Por un extraño accidente histórico, `\s` (espacio en blanco) no tiene este problema y coincide con todos los caracteres que el estándar Unicode considera espacios en blanco, incluidos elementos como el ((espacio sin ruptura)) y el ((separador de vocal mongol)).

{{index "categoría de caracteres", [Unicode, propiedad]}}

Es posible usar `\p` en una expresión regular para hacer coincidir todos los caracteres a los que el estándar Unicode asigna una propiedad dada. Esto nos permite hacer coincidir cosas como letras de una manera más cosmopolita. Sin embargo, nuevamente debido a la compatibilidad con los estándares originales del lenguaje, estos solo se reconocen cuando se coloca un carácter `u` (por ((Unicode))) después de la expresión regular.

{{table {cols: [1, 5]}}}

| `\p{L}`             | Cualquier letra
| `\p{N}`             | Cualquier carácter numérico
| `\p{P}`             | Cualquier carácter de puntuación
| `\P{L}`             | Cualquier no letra (la P en mayúsculas invierte)
| `\p{Script=Hangul}` | Cualquier carácter del guion dado (ver [Capítulo ?](higher_order#scripts))

Usar `\w` para el procesamiento de texto que puede necesitar manejar texto no inglés (o incluso texto en inglés con palabras prestadas como "cliché") es una desventaja, ya que no tratará caracteres como "é" como letras. Aunque tienden a ser un poco más verbosos, los grupos de propiedades `\p` son más robustos.

```{test: never}
console.log(/\p{L}/u.test("α"));
// → true
console.log(/\p{L}/u.test("!"));
// → false
console.log(/\p{Script=Greek}/u.test("α"));
// → true
console.log(/\p{Script=Arabic}/u.test("α"));
// → false
```

{{index "Función de número"}}

Por otro lado, si estás haciendo coincidir números para hacer algo con ellos, a menudo querrás usar `\d` para dígitos, ya que convertir caracteres numéricos arbitrarios en un número de JavaScript no es algo que una función como `Number` pueda hacer por ti.

## Repetir partes de un patrón

{{index ["expresión regular", "repetición"]}}

Ahora sabemos cómo hacer coincidir un solo dígito. ¿Qué tal si queremos hacer coincidir un número entero, una ((secuencia)) de uno o más dígitos?

{{index "carácter de suma", "repetición", "operador +"}}

Cuando colocas un signo más (`+`) después de algo en una expresión regular, indica que el elemento puede repetirse más de una vez. Así, `/\d+/` hace coincidir uno o más caracteres de dígitos.

```
console.log(/'\d+'/.test("'123'"));
// → true
console.log(/'\d+'/.test("''"));
// → false
console.log(/'\d*'/.test("'123'"));
// → true
console.log(/'\d*'/.test("''"));
// → true
```

{{index "* operador", asterisco}}

El asterisco (`*`) tiene un significado similar pero también permite que el patrón coincida cero veces. Algo con un asterisco después nunca impide que un patrón coincida, simplemente coincidirá cero veces si no puede encontrar ningún texto adecuado para hacer coincidir.

{{index "Inglés británico", "Inglés Americano", "signo de interrogación"}}

Un signo de interrogación hace que una parte de un patrón sea _((opcional))_, lo que significa que puede ocurrir cero veces o una vez. En el siguiente ejemplo, se permite que el carácter _u_ ocurra, pero el patrón también coincide cuando falta.

```
let neighbor = /neighbou?r/;
console.log(neighbor.test("neighbour"));
// → true
console.log(neighbor.test("neighbor"));
// → true
```

{{index "repetición", [llaves, "en expresión regular"]}}

Para indicar que un patrón debe ocurrir un número preciso de veces, utiliza llaves. Colocar `{4}` después de un elemento, por ejemplo, requiere que ocurra exactamente cuatro veces. También es posible especificar un ((rango)) de esta manera: `{2,4}` significa que el elemento debe ocurrir al menos dos veces y como máximo cuatro veces.

{{id date_regexp_counted}}

Aquí tienes otra versión del patrón de ((fecha)) y ((hora)) que permite días, meses y horas de uno o dos ((dígitos)). También es un poco más fácil de entender.

```
let dateTime = /\d{1,2}-\d{1,2}-\d{4} \d{1,2}:\d{2}/;
console.log(dateTime.test("1-30-2003 8:45"));
// → true
```

También puedes especificar ((rangos)) abiertos al utilizar llaves omitiendo el número después de la coma. Así, `{5,}` significa cinco o más veces.

## Agrupación de subexpresiones

{{index ["expresión regular", "agrupación"], "agrupación", ["paréntesis", "en expresiones regulares"]}}

Para usar un operador como `*` o `+` en más de un elemento a la vez, debes utilizar paréntesis. Una parte de una expresión regular que está encerrada entre paréntesis cuenta como un solo elemento en lo que respecta a los operadores que le siguen.

```
let cartoonCrying = /boo+(hoo+)+/i;
console.log(cartoonCrying.test("Boohoooohoohooo"));
// → true
```

{{index crying}}

Los primeros y segundos caracteres `+` aplican solo al segundo _o_ en _boo_ y _hoo_, respectivamente. El tercer `+` se aplica a todo el grupo `(hoo+)`, haciendo coincidir una o más secuencias como esa.

{{index "sensibilidad a mayúsculas", "capitalización", ["expresión regular", banderas]}}

La `i` al final de la expresión en el ejemplo hace que esta expresión regular ignore mayúsculas y minúsculas, lo que le permite hacer coincidir la _B_ mayúscula en la cadena de entrada, aunque el patrón en sí está completamente en minúsculas.

## Coincidencias y grupos

{{index ["expresión regular", "agrupación"], "método exec", [array, "coincidencia de RegExp"]}}

El método `test` es la forma más simple de hacer coincidir una expresión regular. Solo te indica si hubo coincidencia y nada más. Las expresiones regulares también tienen un método `exec` (ejecutar) que devolverá `null` si no se encontró ninguna coincidencia y devolverá un objeto con información sobre la coincidencia en caso contrario.

```
let coincidencia = /\d+/.exec("uno dos 100");
console.log(coincidencia);
// → ["100"]
console.log(coincidencia.index);
// → 8
```

{{index "propiedad de índice", [string, "indexación"]}}

Un objeto devuelto por `exec` tiene una propiedad de `index` que nos dice _dónde_ en la cadena comienza la coincidencia exitosa. Aparte de eso, el objeto parece (y de hecho es) un array de strings, cuyo primer elemento es la cadena que coincidió. En el ejemplo anterior, esta es la secuencia de ((dígitos)) que estábamos buscando.

{{index [string, "métodos"], "método match"}}

Los valores de tipo string tienen un método `match` que se comporta de manera similar.

```
console.log("uno dos 100".match(/\d+/));
// → ["100"]
```

{{index "agrupación", "grupo de captura", "método exec"}}

Cuando la expresión regular contiene subexpresiones agrupadas con paréntesis, el texto que coincidió con esos grupos también aparecerá en el array. La coincidencia completa es siempre el primer elemento. El siguiente elemento es la parte coincidente con el primer grupo (el que tiene el paréntesis de apertura primero en la expresión), luego el segundo grupo, y así sucesivamente.

```
let textoEntreComillas = /'([^']*)'/;
console.log(textoEntreComillas.exec("ella dijo 'hola'"));
// → ["'hola'", "hola"]
```

{{index "grupo de captura"}}

Cuando un grupo no termina coincidiendo en absoluto (por ejemplo, cuando está seguido por un signo de pregunta), su posición en el array de salida contendrá `undefined`. Y cuando un grupo coincide múltiples veces (por ejemplo, cuando está seguido por un `+`), solo la última coincidencia termina en el array.

```
console.log(/mal(mente)?/.exec("mal"));
// → ["mal", undefined]
console.log(/(\d)+/.exec("123"));
// → ["123", "3"]
```

Si quieres utilizar paréntesis puramente para agrupar, sin que aparezcan en el array de coincidencias, puedes colocar `?:` después del paréntesis de apertura.

```
console.log(/(?:na)+/.exec("banana"));
// → ["nana"]
```

{{index "método exec", ["expresión regular", "métodos"], "extracción"}}

Los grupos pueden ser útiles para extraer partes de una cadena. Si no solo queremos verificar si una cadena contiene una ((fecha)) sino también extraerla y construir un objeto que la represente, podemos envolver paréntesis alrededor de los patrones de dígitos y seleccionar directamente la fecha del resultado de `exec`.

Pero primero haremos un breve desvío, en el que discutiremos la forma incorporada de representar fechas y ((horas)) en JavaScript.

## La clase Date

{{index constructor, "clase Date"}}

JavaScript tiene una clase estándar para representar ((fechas))—o, más bien, puntos en ((tiempo)). Se llama `Date`. Si simplemente creas un objeto de fecha usando `new`, obtendrás la fecha y hora actuales.

```{test: no}
console.log(new Date());
// → Fri Feb 02 2024 18:03:06 GMT+0100 (CET)
```

{{index "Clase Date"}}

También puedes crear un objeto para un momento específico.

```
console.log(new Date(2009, 11, 9));
// → Mié Dec 09 2009 00:00:00 GMT+0100 (CET)
console.log(new Date(2009, 11, 9, 12, 59, 59, 999));
// → Mié Dec 09 2009 12:59:59 GMT+0100 (CET)
```

{{index "Conteo basado en cero", [interfaz, "diseño"]}}

JavaScript utiliza una convención donde los números de mes empiezan en cero (por lo que diciembre es 11), pero los números de día comienzan en uno. Esto es confuso y tonto. Ten cuidado.

Los últimos cuatro argumentos (horas, minutos, segundos y milisegundos) son opcionales y se consideran cero cuando no se proporcionan.

{{index "Método getTime", marca de tiempo}}

Las marcas de tiempo se almacenan como el número de milisegundos desde el comienzo de 1970, en UTC (zona horaria). Esto sigue una convención establecida por "tiempo de Unix", que fue inventado alrededor de esa época. Puedes usar números negativos para tiempos antes de 1970. El método `getTime` en un objeto de fecha retorna este número. Es grande, como te puedes imaginar.

```
console.log(new Date(2013, 11, 19).getTime());
// → 1387407600000
console.log(new Date(1387407600000));
// → Jue Dec 19 2013 00:00:00 GMT+0100 (CET)
```

{{index "Función Date.now", "Clase Date"}}

Si le proporcionas un único argumento al constructor `Date`, ese argumento se tratará como un recuento de milisegundos. Puedes obtener el recuento actual de milisegundos creando un nuevo objeto `Date` y llamando a `getTime` en él o llamando a la función `Date.now`.

{{index "Método getFullYear", "Método getMonth", "Método getDate", "Método getHours", "Método getMinutes", "Método getSeconds", "Método getYear"}}

Los objetos de fecha proporcionan métodos como `getFullYear`, `getMonth`, `getDate`, `getHours`, `getMinutes` y `getSeconds` para extraer sus componentes. Además de `getFullYear`, también existe `getYear`, que te da el año menos 1900 (`98` o `119`) y es en su mayoría inútil.

{{index "Grupo de captura", "Método getDate", ["paréntesis", "en expresiones regulares"]}}


Poniendo paréntesis alrededor de las partes de la expresión que nos interesan, podemos crear un objeto de fecha a partir de una cadena.

```
function getDate(string) {
  let [_, month, day, year] =
    /(\d{1,2})-(\d{1,2})-(\d{4})/.exec(string);
  return new Date(year, month - 1, day);
}
console.log(getDate("1-30-2003"));
// → Jue Ene 30 2003 00:00:00 GMT+0100 (CET)
```

{{index destructuring, "carácter guion bajo"}}

La vinculación `_` (guion bajo) se ignora y se utiliza solo para omitir el elemento de coincidencia completa en el array devuelto por `exec`.

## Límites y anticipación

{{index matching, ["expresión regular", "límite"]}}

Desafortunadamente, `getDate` también extraerá felizmente una fecha de la cadena `"100-1-30000"`. Una coincidencia puede ocurrir en cualquier parte de la cadena, por lo que en este caso, simplemente empezará en el segundo carácter y terminará en el antepenúltimo carácter.

{{index "límite", "carácter circunflejo", "signo de dólar"}}

Si queremos asegurar que la coincidencia abarque toda la cadena, podemos agregar los marcadores `^` y `$`. El circunflejo coincide con el inicio de la cadena de entrada, mientras que el signo de dólar coincide con el final. Por lo tanto, `/^\d+$/` coincide con una cadena que consiste completamente de uno o más dígitos, `/^!/` coincide con cualquier cadena que comience con un signo de exclamación y `/x^/` no coincide con ninguna cadena (no puede haber una _x_ antes del inicio de la cadena).

{{index "límite de palabra", "carácter de palabra"}}

También existe un marcador `\b`, que coincide con los "límites de palabra", posiciones que tienen un carácter de palabra a un lado y un carácter que no es de palabra al otro. Desafortunadamente, estos utilizan el mismo concepto simplista de caracteres de palabra que `\w`, por lo que no son muy confiables.

Ten en cuenta que estos marcadores no coinciden con ningún carácter real. Simplemente aseguran que se cumpla una condición determinada en el lugar donde aparecen en el patrón.

{{index "mirar adelante"}}

Las pruebas de _mirar adelante_ hacen algo similar. Proporcionan un patrón y harán que la coincidencia falle si la entrada no coincide con ese patrón, pero en realidad no mueven la posición de la coincidencia hacia adelante. Se escriben entre `(?=` y `)`.

```
console.log(/a(?=e)/.exec("braeburn"));
// → ["a"]
console.log(/a(?! )/.exec("a b"));
// → null
```

Observa cómo la `e` en el primer ejemplo es necesaria para coincidir, pero no forma parte de la cadena coincidente. La notación `(?! )` expresa un mirar adelante _negativo_. Esto solo coincide si el patrón entre paréntesis _no_ coincide, lo que hace que el segundo ejemplo solo coincida con caracteres "a" que no tienen un espacio después de ellos.

## Patrones de elección

{{index branching, ["expresión regular", alternativas], "ejemplo de granja"}}

Digamos que queremos saber si un texto contiene no solo un número, sino un número seguido de una de las palabras _pig_, _cow_ o _chicken_, o cualquiera de sus formas en plural.

Podríamos escribir tres expresiones regulares y probarlas sucesivamente, pero hay una forma más sencilla. El carácter de ((barra vertical)) (`|`) denota una ((elección)) entre el patrón a su izquierda y el patrón a su derecha. Así que puedo decir esto:

```
let animalCount = /\d+ (pig|cow|chicken)s?/;
console.log(animalCount.test("15 pigs"));
// → true
console.log(animalCount.test("15 pugs"));
// → false
```

{{index ["paréntesis", "en expresiones regulares"]}}

Los paréntesis se pueden utilizar para limitar la parte del patrón a la que se aplica el operador de barra, y puedes colocar varios de estos operadores uno al lado del otro para expresar una elección entre más de dos alternativas.

## La mecánica de la coincidencia

{{index ["expresión regular", coincidencia], [coincidencia, algoritmo], "problema de búsqueda"}}

Conceptualmente, cuando utilizas `exec` o `test`, el motor de expresiones regulares busca una coincidencia en tu cadena tratando de ajustar primero la expresión desde el comienzo de la cadena, luego desde el segundo carácter, y así sucesivamente, hasta que encuentra una coincidencia o llega al final de la cadena. Devolverá la primera coincidencia que encuentre o fracasará en encontrar cualquier coincidencia.

{{index ["expresión regular", coincidencia], [coincidencia, algoritmo]}}

Para hacer la coincidencia real, el motor trata a una expresión regular algo así como un ((diagrama de flujo)). Este es el diagrama para la expresión de ganado en el ejemplo anterior:

{{figure {url: "img/re_pigchickens.svg", alt: "Diagrama de ferrocarril que primero pasa por un recuadro etiquetado 'dígito', que tiene un bucle que regresa desde después de él a antes de él, y luego un recuadro para un carácter de espacio. Después de eso, el ferrocarril se divide en tres, pasando por cuadros para 'pig', 'cow' y 'chicken'. Después de estos, se reúne de nuevo y pasa por un cuadro etiquetado 's', que, al ser opcional, también tiene un ferrocarril que lo pasa por alto. Finalmente, la línea llega al estado de aceptación."}}}

{{index ["expresión regular", diagrama de flujo]}}

Nuestra expresión coincide si podemos encontrar un camino desde el lado izquierdo del diagrama hasta el lado derecho. Mantenemos una posición actual en la cadena, y cada vez que avanzamos a través de un recuadro, verificamos que la parte de la cadena después de nuestra posición actual coincida con ese recuadro.

{{id backtracking}}

## Retroceso

{{index ["expresión regular", retroceso], "número binario", "número decimal", "número hexadecimal", "diagrama de flujo", [coincidencia, algoritmo], retroceso}}

La expresión regular `/^([01]+b|[\da-f]+h|\d+)$/` coincide ya sea con un número binario seguido de una _b_, un número hexadecimal (es decir, base 16, con las letras _a_ a _f_ representando los dígitos del 10 al 15) seguido de un _h_, o un número decimal regular sin un carácter de sufijo. Este es el diagrama correspondiente:

{{figure {url: "img/re_number.svg", alt: "Diagrama de ferrocarril para la expresión regular '^([01]+b|\\d+|[\\da-f]+h)$'"}}}

{{index "ramificación"}}

Al coincidir con esta expresión, a menudo sucede que se ingresa por la rama superior (binaria) aunque la entrada en realidad no contenga un número binario. Al coincidir con la cadena `"103"`, por ejemplo, solo se aclara en el 3 que estamos en la rama incorrecta. La cadena _coincide_ con la expresión, simplemente no con la rama en la que nos encontramos actualmente.

{{index retroceso, "problema de búsqueda"}}

Entonces, el coincidente _retrocede_. Al ingresar a una rama, recuerda su posición actual (en este caso, al principio de la cadena, justo después del primer cuadro de límite en el diagrama) para poder retroceder y probar otra rama si la actual no funciona. Para la cadena `"103"`, después de encontrar el carácter 3, intentará la rama para los números hexadecimales, lo cual también falla porque no hay un _h_ después del número. Entonces intenta la rama para los números decimales. Esta encaja, y se informa una coincidencia después de todo.

{{index [coincidencia, algoritmo]}}

El coincidente se detiene tan pronto como encuentra una coincidencia completa. Esto significa que si varias ramas podrían coincidir potencialmente con una cadena, solo se usa la primera (ordenada por dónde aparecen las ramas en la expresión regular).

El retroceso también ocurre para los operadores de repetición como + y `*`. Si coincide con `/^.*x/` contra `"abcxe"`, la parte `.*` intentará primero consumir toda la cadena. Luego el motor se dará cuenta de que necesita una _x_ para que coincida con el patrón. Dado que no hay una _x_ más allá del final de la cadena, el operador estrella intentará coincidir con un carácter menos. Pero el coincidente no encuentra una _x_ después de `abcx` tampoco, por lo que retrocede nuevamente, coincidiendo con el operador estrella solo con `abc`. _Ahora_ encuentra una _x_ donde la necesita y reporta una coincidencia exitosa desde las posiciones 0 a 4.

{{index rendimiento, complejidad}}

Es posible escribir expresiones regulares que realizarán _mucho_ retroceso. Este problema ocurre cuando un patrón puede coincidir con una parte de la entrada de muchas formas diferentes. Por ejemplo, si nos confundimos al escribir una expresión regular para los números binarios, podríamos escribir accidentalmente algo como `/([01]+)+b/`.

{{figure {url: "img/re_slow.svg", alt: "Diagrama de ferrocarril para la expresión regular '([01]+)+b'", width: "6cm"}}}

{{index "bucle interno", [anidamiento, "en expresiones regulares"]}}

Si intenta hacer coincidir una serie larga de ceros y unos sin un caracter _b_ al final, el analizador primero pasa por el bucle interno hasta que se queda sin dígitos. Luego se da cuenta de que no hay _b_, por lo que retrocede una posición, pasa por el bucle externo una vez y vuelve a darse por vencido, intentando retroceder nuevamente fuera del bucle interno. Continuará intentando todas las rutas posibles a través de estos dos bucles. Esto significa que la cantidad de trabajo se _duplica_ con cada carácter adicional. Incluso con apenas unas pocas docenas de caracteres, la coincidencia resultante tomará prácticamente para siempre.

## El método replace

{{index "método replace", "expresión regular"}}

Los valores de cadena tienen un método `replace` que se puede utilizar para reemplazar parte de la cadena con otra cadena.

```
console.log("papa".replace("p", "m"));
// → mapa
```

{{index ["expresión regular", banderas], ["expresión regular", global]}}

El primer argumento también puede ser una expresión regular, en cuyo caso se reemplaza la primera coincidencia de la expresión regular. Cuando se agrega una opción `g` (para _global_) después de la expresión regular, _todas_ las coincidencias en la cadena serán reemplazadas, no solo la primera.

```
console.log("Borobudur".replace(/[ou]/, "a"));
// → Barobudur
console.log("Borobudur".replace(/[ou]/g, "a"));
// → Barabadar
```

{{index "agrupación", "grupo de captura", "signo de dólar", "método replace", ["expresión regular", "agrupación"]}}

El verdadero poder de usar expresiones regulares con `replace` proviene del hecho de que podemos hacer referencia a grupos coincidentes en la cadena de reemplazo. Por ejemplo, digamos que tenemos una cadena larga que contiene los nombres de personas, un nombre por línea, en el formato `Apellido, Nombre`. Si queremos intercambiar estos nombres y eliminar la coma para obtener un formato `Nombre Apellido`, podemos usar el siguiente código:

```
console.log(
  "Liskov, Barbara\nMcCarthy, John\nMilner, Robin"
    .replace(/(\p{L}+), (\p{L}+)/gu, "$2 $1"));
// → Barbara Liskov
//   John McCarthy
//   Robin Milner
```

Los `$1` y `$2` en la cadena de reemplazo se refieren a los grupos entre paréntesis en el patrón. `$1` es reemplazado por el texto que coincidió con el primer grupo, `$2` por el segundo, y así sucesivamente, hasta `$9`. Toda la coincidencia se puede referenciar con `$&`.

{{index ["función", "de orden superior"], "agrupación", "grupo de captura"}}

Es posible pasar una función, en lugar de una cadena, como segundo argumento a `replace`. Para cada reemplazo, la función se llamará con los grupos coincidentes (así como la coincidencia completa) como argumentos, y su valor de retorno se insertará en la nueva cadena.

Aquí tienes un ejemplo:

```
let stock = "1 limón, 2 repollos y 101 huevos";
function menosUno(match, cantidad, unidad) {
  cantidad = Number(cantidad) - 1;
  if (cantidad == 1) { // solo queda uno, se elimina la 's'
    unidad = unidad.slice(0, unidad.length - 1);
  } else if (cantidad == 0) {
    cantidad = "ningún";
  }
  return cantidad + " " + unidad;
}
console.log(stock.replace(/(\d+) (\p{L}+)/gu, menosUno));
// → ningún limón, 1 repollo y 100 huevos
```
Esta función toma una cadena, encuentra todas las ocurrencias de un número seguido de una palabra alfanumérica, y devuelve una cadena que tiene una cantidad menos de cada una de esas ocurrencias.

El grupo `(\d+)` termina siendo el argumento `amount` de la función, y el grupo `(\p{L}+)` se asigna a `unit`. La función convierte `amount` a un número, lo cual siempre funciona ya que coincide con `\d+`, y realiza algunos ajustes en caso de que solo quede uno o ninguno.

## Avaricia

{{index avaricia, "expresión regular"}}

Es posible usar `replace` para escribir una función que elimine todos los comentarios de un fragmento de código JavaScript. Aquí tienes un primer intento:

```{test: wrap}
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*\*\//g, "");
}
console.log(stripComments("1 + /* 2 */3"));
// → 1 + 3
console.log(stripComments("x = 10;// ¡diez!"));
// → x = 10;
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1  1
```

{{index "carácter de punto", "carácter de barra", "carácter de nueva línea", "conjunto vacío", "comentario de bloque", "comentario de línea"}}

La parte antes del operador _or_ coincide con dos caracteres de barra seguidos por cualquier cantidad de caracteres que no sean de nueva línea. La parte de comentarios de varias líneas es más compleja. Utilizamos `[^]` (cualquier carácter que no esté en el conjunto vacío de caracteres) como una forma de coincidir con cualquier carácter. No podemos usar simplemente un punto aquí porque los comentarios de bloque pueden continuar en una nueva línea, y el carácter de punto no coincide con caracteres de nueva línea.

Pero la salida para la última línea parece haber salido mal. ¿Por qué?

{{index retroceso, avaricia, "expresión regular"}}

La parte `[^]*` de la expresión, como describí en la sección sobre retroceso, primero intentará coincidir con todo lo que pueda. Si esto hace que la siguiente parte del patrón falle, el coincidente retrocede un carácter y vuelve a intentar desde ahí. En el ejemplo, el coincidente intenta primero coincidir con el resto completo de la cadena y luego retrocede desde allí. Encontrará una ocurrencia de `*/` después de retroceder cuatro caracteres y coincidirá con eso. Esto no es lo que queríamos, la intención era coincidir con un único comentario, no llegar hasta el final del código y encontrar el final del último comentario de bloque.

Debido a este comportamiento, decimos que los operadores de repetición (`+`, `*`, `?`, y `{}`) son _avariciosos_, lo que significa que coinciden con todo lo que pueden y retroceden desde allí. Si colocas un ((signo de interrogación)) después de ellos (`+?`, `*?`, `??`, `{}?`), se vuelven no avariciosos y comienzan coincidiendo con la menor cantidad posible, coincidiendo más solo cuando el patrón restante no encaja con la coincidencia más pequeña.

Y eso es exactamente lo que queremos en este caso. Al hacer que el asterisco coincida con la menor cantidad de caracteres que nos lleva a `*/`, consumimos un comentario de bloque y nada más.

```{test: wrap}
function stripComments(code) {
  return code.replace(/\/\/.*|\/\*[^]*?\*\//g, "");
}
console.log(stripComments("1 /* a */+/* b */ 1"));
// → 1 + 1
```

Muchos ((error))s en programas de ((expresión regular)) pueden rastrearse hasta el uso no intencionado de un operador avaricioso donde uno no avaricioso funcionaría mejor. Cuando uses un operador de repetición, prefiere la variante no avariciosa.

## Creación dinámica de objetos RegExp

{{index ["expresión regular", "creación"], "carácter de subrayado", "clase RegExp"}}

Hay casos en los que es posible que no sepas el patrón exacto que necesitas para hacer coincidir cuando estás escribiendo tu código. Digamos que quieres probar el nombre de usuario en un fragmento de texto. Puedes construir una cadena y usar el `constructor` `RegExp` en ello. Aquí tienes un ejemplo:

```
let name = "harry";
let regexp = new RegExp("(^|\\s)" + name + "($|\\s)", "gi");
console.log(regexp.test("Harry es un personaje dudoso."));
// → true
```

{{index ["expresión regular", banderas], ["carácter de barra invertida", "en expresiones regulares"]}}

Al crear la parte `\s` de la cadena, tenemos que usar dos barras invertidas porque las estamos escribiendo en una cadena normal, no en una expresión regular entre barras. El segundo argumento del constructor `RegExp` contiene las opciones para la expresión regular, en este caso, `"gi"` para global e insensible a mayúsculas y minúsculas.

Pero ¿qué pasa si el nombre es `"dea+hl[]rd"` porque nuestro usuario es un adolescente ((nerd))? Eso resultaría en una expresión regular absurda que en realidad no coincidiría con el nombre del usuario.

{{index ["carácter de barra invertida", "en expresiones regulares"], [escape, "en regexps"], ["expresión regular", escape]}}

Para solucionar esto, podemos agregar barras invertidas antes de cualquier carácter que tenga un significado especial.

```
let name = "dea+hl[]rd";
let escaped = name.replace(/[\\[.+*?(){|^$]/g, "\\$&");
let regexp = new RegExp("(^|\\s)" + escaped + "($|\\s)",
                        "gi");
let text = "Este chico dea+hl[]rd es súper molesto.";
console.log(regexp.test(text));
// → true
```

## El método search

{{index ["expresión regular", "métodos"], "método indexOf", "método search"}}

El método `indexOf` en las cadenas no puede ser llamado con una expresión regular. Pero hay otro método, `search`, que espera una expresión regular. Al igual que `indexOf`, devuelve el primer índice en el que se encontró la expresión, o -1 cuando no se encontró.

```
console.log("  palabra".search(/\S/));
// → 2
console.log("    ".search(/\S/));
// → -1
```

Desafortunadamente, no hay una forma de indicar que la coincidencia debería comenzar en un offset dado (como se puede hacer con el segundo argumento de `indexOf`), lo cual a menudo sería útil.

## La propiedad lastIndex

{{index "método exec", "expresión regular"}}

El método `exec` de manera similar no proporciona una forma conveniente de comenzar a buscar desde una posición dada en la cadena. Pero sí proporciona una forma *in*conveniente.

{{index ["expresión regular", coincidencia], coincidencia, "propiedad source", "propiedad lastIndex"}}

Los objetos de expresión regular tienen propiedades. Una de esas propiedades es `source`, que contiene la cadena de la que se creó la expresión. Otra propiedad es `lastIndex`, que controla, en algunas circunstancias limitadas, desde dónde comenzará la siguiente coincidencia.

{{index [interface, "diseño"], "método exec", ["expresión regular", global]}}

Estas circunstancias implican que la expresión regular debe tener la opción global (`g`) o pegajosa (`y`) activada, y la coincidencia debe ocurrir a través del método `exec`. Nuevamente, una solución menos confusa habría sido simplemente permitir que se pase un argumento adicional a `exec`, pero la confusión es una característica esencial de la interfaz de expresiones regulares de JavaScript.

```
let pattern = /y/g;
pattern.lastIndex = 3;
let match = pattern.exec("xyzzy");
console.log(match.index);
// → 4
console.log(pattern.lastIndex);
// → 5
```

{{index "efecto secundario", "propiedad lastIndex"}}

Si la coincidencia tuvo éxito, la llamada a `exec` actualiza automáticamente la propiedad `lastIndex` para que apunte después de la coincidencia. Si no se encontró ninguna coincidencia, `lastIndex` se restablece a cero, que es también el valor que tiene en un objeto de expresión regular recién construido.

La diferencia entre las opciones global y sticky es que, cuando se habilita sticky, la coincidencia solo se producirá si comienza directamente en `lastIndex`, mientras que con global se buscará una posición donde pueda comenzar una coincidencia.

```
let global = /abc/g;
console.log(global.exec("xyz abc"));
// → ["abc"]
let sticky = /abc/y;
console.log(sticky.exec("xyz abc"));
// → null
```

{{index error}}

Al usar un valor de expresión regular compartido para múltiples llamadas a `exec`, estas actualizaciones automáticas a la propiedad `lastIndex` pueden causar problemas. Es posible que tu expresión regular comience accidentalmente en un índice que quedó de una llamada previa.

```
let digit = /\d/g;
console.log(digit.exec("aquí está: 1"));
// → ["1"]
console.log(digit.exec("ahora: 1"));
// → null
```

{{index ["expresión regular", global], "método match"}}

Otro efecto interesante de la opción global es que cambia la forma en que funciona el método `match` en las cadenas. Cuando se llama con una expresión global, en lugar de devolver una matriz similar a la devuelta por `exec`, `match` encontrará _todas_ las coincidencias del patrón en la cadena y devolverá una matriz que contiene las cadenas coincidentes.

```
console.log("Banana".match(/an/g));
// → ["an", "an"]
```

Así que ten cuidado con las expresiones regulares globales. Los casos en los que son necesarias, como las llamadas a `replace` y los lugares donde quieres usar explícitamente `lastIndex`, son típicamente los únicos lugares donde las deseas utilizar.

### Obteniendo todas las coincidencias

{{index "propiedad lastIndex", "método exec", bucle}}

Algo común que se hace es encontrar todas las coincidencias de una expresión regular en una cadena. Podemos hacer esto usando el método `matchAll`.

```
let input = "Una cadena con 3 números... 42 y 88.";
let matches = input.matchAll(/\d+/g);
for (let match of matches) {
  console.log("Encontrado", match[0], "en", match.index);
}
// → Encontrado 3 en 14
//   Encontrado 42 en 33
//   Encontrado 88 en 40
```

{{index ["expresión regular", global]}}

Este método devuelve una matriz de matrices de coincidencias. La expresión regular que se le proporciona _debe_ tener `g` habilitado.

{{id ini}}
## Analizando un archivo INI

{{index comentario, "formato de archivo", "ejemplo de enemigos", "archivo INI"}}

Para concluir el capítulo, analizaremos un problema que requiere ((expresiones regulares)). Imagina que estamos escribiendo un programa para recopilar automáticamente información sobre nuestros enemigos desde ((Internet)). (En realidad, no escribiremos ese programa aquí, solo la parte que lee el archivo de ((configuración)). Lo siento.) El archivo de configuración se ve así:

```{lang: "null"}
motorbusqueda=https://duckduckgo.com/?q=$1
rencor=9.7

; comentarios precedidos por un punto y coma...
; cada sección se refiere a un enemigo individual
[larry]
fullname=Larry Doe
type=matón de jardín de infantes
website=http://www.geocities.com/CapeCanaveral/11451

[davaeorn]
fullname=Davaeorn
type=mago malvado
outputdir=/home/marijn/enemies/davaeorn
```

{{index "gramática"}}

Las reglas exactas para este formato (que es un formato ampliamente utilizado, generalmente llamado un archivo _INI_) son las siguientes:

- Las líneas en blanco y las líneas que comienzan con punto y coma son ignoradas.

- Las líneas envueltas en `[` y `]` inician una nueva ((sección)).

- Las líneas que contienen un identificador alfanumérico seguido de un caracter `=` agregan una configuración a la sección actual.

- Cualquier otra cosa es inválida.

Nuestra tarea es convertir una cadena como esta en un objeto cuyas propiedades contienen cadenas para las configuraciones escritas antes del primer encabezado de sección y subobjetos para las secciones, con esos subobjetos conteniendo las configuraciones de la sección.

{{index "retorno de carro", "salto de línea", "carácter de nueva línea"}}

Dado que el formato debe procesarse ((línea)) por línea, dividir el archivo en líneas separadas es un buen comienzo. Vimos el método `split` en el [Capítulo ?](data#split). Sin embargo, algunos sistemas operativos utilizan no solo un carácter de nueva línea para separar líneas sino un carácter de retorno de carro seguido de una nueva línea (`"\r\n"`). Dado que el método `split` también permite una expresión regular como argumento, podemos usar una expresión regular como `/\r?\n/` para dividir de una manera que permita tanto `"\n"` como `"\r\n"` entre líneas.

```{startCode: true}
function parseINI(string) {
  // Comenzar con un objeto para contener los campos de nivel superior
  let result = {};
  let section = result;
  for (let line of string.split(/\r?\n/)) {
    let match;
    if (match = line.match(/^(\w+)=(.*)$/)) {
      section[match[1]] = match[2];
    } else if (match = line.match(/^\[(.*)\]$/)) {
      section = result[match[1]] = {};
    } else if (!/^\s*(;|$)/.test(line)) {
      throw new Error("La línea '" + line + "' no es válida.");
    }
  };
  return result;
}

console.log(parseINI(`
name=Vasilis
[address]
city=Tessaloniki`));
// → {name: "Vasilis", address: {city: "Tessaloniki"}}
```

{{index "función parseINI", "análisis"}}

El código recorre las líneas del archivo y construye un objeto. Las propiedades en la parte superior se almacenan directamente en ese objeto, mientras que las propiedades encontradas en secciones se almacenan en un objeto de sección separado. El enlace `section` apunta al objeto para la sección actual.

Hay dos tipos de líneas significativas: encabezados de sección o líneas de propiedades. Cuando una línea es una propiedad regular, se almacena en la sección actual. Cuando es un encabezado de sección, se crea un nuevo objeto de sección y `section` se establece para apuntar a él.

{{index "carácter indicador", "signo de dólar", "límite"}}

Observa el uso recurrente de `^` y `$` para asegurarse de que la expresión coincida con toda la línea, no solo parte de ella. Dejarlos fuera resulta en un código que funciona en su mayor parte pero se comporta de manera extraña para algunas entradas, lo que puede ser un error difícil de rastrear.

{{index "instrucción if", "asignación", ["operador =", "como expresión"]}}
```El patrón `if (match = string.match(...))` hace uso del hecho de que el valor de una expresión de ((asignación)) (`=`) es el valor asignado. A menudo no estás seguro de que tu llamada a `match` tendrá éxito, por lo que solo puedes acceder al objeto resultante dentro de una declaración `if` que comprueba esto. Para no romper la agradable cadena de formas de `else if`, asignamos el resultado de la coincidencia a un enlace y usamos inmediatamente esa asignación como la prueba para la declaración `if`.

{{index ["paréntesis", "en expresiones regulares"]}}

Si una línea no es un encabezado de sección o una propiedad, la función verifica si es un comentario o una línea vacía usando la expresión `/^\s*(;|$)/` para hacer coincidir líneas que solo contienen espacio o espacio seguido de un punto y coma (haciendo que el resto de la línea sea un comentario). Cuando una línea no coincide con ninguna de las formas esperadas, la función lanza una excepción.

## Unidades de código y caracteres

Otro error de diseño que se ha estandarizado en las expresiones regulares de JavaScript es que, por defecto, operadores como `.` o `?` trabajan en unidades de código, como se discute en el [Capítulo ?](higher_order#code_units), no en caracteres reales. Esto significa que los caracteres que están compuestos por dos unidades de código se comportan de manera extraña.

```
console.log(/🍎{3}/.test("🍎🍎🍎"));
// → false
console.log(/<.>/.test("<🌹>"));
// → false
console.log(/<.>/u.test("<🌹>"));
// → true
```

El problema es que el 🍎 en la primera línea se trata como dos unidades de código, y la parte `{3}` se aplica solo al segundo. Del mismo modo, el punto coincidirá con una sola unidad de código, no con las dos que componen la rosa ((emoji)).

Debes agregar la opción `u` (Unicode) a tu expresión regular para que trate correctamente este tipo de caracteres.

```
console.log(/🍎{3}/u.test("🍎🍎🍎"));
// → true
```

{{id summary_regexp}}

## Resumen

Las expresiones regulares son objetos que representan patrones en cadenas. Utilizan su propio lenguaje para expresar estos patrones.

{{table {cols: [1, 5]}}}

| `/abc/`     | Una secuencia de caracteres
| `/[abc]/`   | Cualquier carácter de un conjunto de caracteres
| `/[^abc]/`  | Cualquier carácter _que no esté_ en un conjunto de caracteres
| `/[0-9]/`   | Cualquier carácter en un rango de caracteres
| `/x+/`      | Una o más ocurrencias del patrón `x`
| `/x+?/`     | Una o más ocurrencias, perezoso
| `/x*/`      | Cero o más ocurrencias
| `/x?/`      | Cero o una ocurrencia
| `/x{2,4}/`  | Dos a cuatro ocurrencias
| `/(abc)/`   | Un grupo
| `/a|b|c/`   | Cualquiera de varias combinaciones de patrones
| `/\d/`      | Cualquier carácter de dígito
| `/\w/`      | Un carácter alfanumérico ("carácter de palabra")
| `/\s/`      | Cualquier carácter de espacio en blanco
| `/./`       | Cualquier carácter excepto saltos de línea
| `/\p{L}/u`  | Cualquier carácter de letra
| `/^/`       | Inicio de entrada
| `/$/`       | Fin de entrada
| `/(?=a)/`   | Una prueba de vistazo hacia adelante

Una expresión regular tiene un método `test` para comprobar si una cadena dada coincide con ella. También tiene un método `exec` que, cuando se encuentra una coincidencia, devuelve un array que contiene todos los grupos coincidentes. Dicho array tiene una propiedad `index` que indica dónde empezó la coincidencia.Las cadenas tienen un método `match` para compararlas con una expresión regular y un método `search` para buscar una, devolviendo solo la posición de inicio de la coincidencia. Su método `replace` puede reemplazar coincidencias de un patrón con una cadena o función de reemplazo.

Las expresiones regulares pueden tener opciones, que se escriben después de la barra de cierre. La opción `i` hace que la coincidencia no distinga entre mayúsculas y minúsculas. La opción `g` hace que la expresión sea _global_, lo que, entre otras cosas, hace que el método `replace` reemplace todas las instancias en lugar de solo la primera. La opción `y` la hace persistente, lo que significa que no buscará por delante ni omitirá parte de la cadena al buscar una coincidencia. La opción `u` activa el modo Unicode, que habilita la sintaxis `\p` y soluciona varios problemas en torno al manejo de caracteres que ocupan dos unidades de código.

Las expresiones regulares son una ((herramienta)) afilada con un mango incómodo. Simplifican enormemente algunas tareas, pero pueden volverse rápidamente ingobernables cuando se aplican a problemas complejos. Parte de saber cómo usarlas es resistir la tentación de intentar forzar cosas que no pueden expresarse de forma clara en ellas.

## Ejercicios

{{index debugging, bug}}

Es casi inevitable que, al trabajar en estos ejercicios, te sientas confundido y frustrado por el comportamiento inexplicable de algunas expresiones regulares. A veces ayuda introducir tu expresión en una herramienta en línea como [_debuggex.com_](https://www.debuggex.com/) para ver si su visualización corresponde a lo que pretendías y para ((experimentar)) con la forma en que responde a diferentes cadenas de entrada.

### Regexp golf

{{index "program size", "code golf", "regexp golf (exercise)"}}

_Code golf_ es un término utilizado para el juego de intentar expresar un programa en particular con la menor cantidad de caracteres posible. De manera similar, _regexp golf_ es la práctica de escribir una expresión regular lo más pequeña posible para que coincida con un patrón dado, y _solo_ ese patrón.

{{index boundary, matching}}

Para cada uno de los siguientes elementos, escribe una expresión regular para comprobar si el patrón dado ocurre en una cadena. La expresión regular debe coincidir solo con cadenas que contengan el patrón. Cuando tu expresión funcione, verifica si puedes hacerla más pequeña.

 1. _car_ y _cat_
 2. _pop_ y _prop_
 3. _ferret_, _ferry_ y _ferrari_
 4. Cualquier palabra que termine en _ious_
 5. Un carácter de espacio en blanco seguido de un punto, coma, dos puntos o punto y coma
 6. Una palabra con más de seis letras
 7. Una palabra sin la letra _e_ (o _E_)

Consulta la tabla en el [resumen del capítulo](regexp#summary_regexp) para obtener ayuda. Prueba cada solución con algunas cadenas de prueba.

{{if interactive
```
// Fill in the regular expressions

verify(/.../,
       ["my car", "bad cats"],
       ["camper", "high art"]);

verify(/.../,
       ["pop culture", "mad props"],
       ["plop", "prrrop"]);

verify(/.../,
       ["ferret", "ferry", "ferrari"],
       ["ferrum", "transfer A"]);

verify(/.../,
       ["how delicious", "spacious room"],
       ["ruinous", "consciousness"]);

verify(/.../,
       ["bad punctuation ."],
       ["escape the period"]);

verify(/.../,
       ["Siebentausenddreihundertzweiundzwanzig"],
       ["no", "three small words"]);

verify(/.../,
       ["red platypus", "wobbling nest"],
       ["earth bed", "bedrøvet abe", "BEET"]);


function verify(regexp, yes, no) {
  // Ignore unfinished exercises
  if (regexp.source == "...") return;
  for (let str of yes) if (!regexp.test(str)) {
    console.log(`Failure to match '${str}'`);
  }
  for (let str of no) if (regexp.test(str)) {
    console.log(`Unexpected match for '${str}'`);
  }
}
```

if}}

### Estilo de comillas

{{index "quoting style (exercise)", "single-quote character", "double-quote character"}}

Imagina que has escrito una historia y usaste comillas simples ((single-quote character)) para marcar piezas de diálogo. Ahora quieres reemplazar todas las comillas de diálogo con comillas dobles, manteniendo las comillas simples utilizadas en contracciones como _aren't_.

{{index "replace method"}}

Piensa en un patrón que distinga estos dos tipos de uso de comillas y crea una llamada al método `replace` que realice el reemplazo adecuado.

{{if interactive
```markdown
let text = "'I'm the cook,' he said, 'it's my job.'";
// Cambia esta llamada.
console.log(text.replace(/A/g, "B"));
// → "I'm the cook," he said, "it's my job."
```
if}}

{{hint

{{index "quoting style (exercise)", boundary}}

La solución más obvia es reemplazar solo las comillas que tienen un carácter que no sea una letra en al menos un lado, algo como `/\P{L}'|'\P{L}/`. Pero también debes tener en cuenta el inicio y el final de la línea.

{{index grouping, "replace method", [parentheses, "in regular expressions"]}}

Además, debes asegurarte de que la sustitución también incluya los caracteres que coincidieron con el patrón `\P{L}` para que no se eliminen. Esto se puede hacer envolviéndolos entre paréntesis e incluyendo sus grupos en la cadena de reemplazo (`$1`, `$2`). Los grupos que no se emparejen se reemplazarán por nada.

hint}}

### Números nuevamente

{{index sign, "fractional number", [syntax, number], minus, "plus character", exponent, "scientific notation", "period character"}}

Escribe una expresión que coincida solo con los números al estilo de JavaScript. Debe admitir un signo menos _o_ más opcional delante del número, el punto decimal y la notación de exponente—`5e-3` o `1E10`—de nuevo con un signo opcional delante del exponente. También ten en cuenta que no es necesario que haya dígitos delante o después del punto, pero el número no puede ser solo un punto. Es decir, `.5` y `5.` son números de JavaScript válidos, pero un punto solitario _no_ lo es.

{{if interactive
```markdown
// Completa esta expresión regular.
let number = /^...$/;

// Pruebas:
for (let str of ["1", "-1", "+15", "1.55", ".5", "5.",
                 "1.3e2", "1E-4", "1e+12"]) {
  if (!number.test(str)) {
    console.log(`Failed to match '${str}'`);
  }
}
for (let str of ["1a", "+-1", "1.2.3", "1+1", "1e4.5",
                 ".5.", "1f5", "."]) {
  if (number.test(str)) {
    console.log(`Incorrectly accepted '${str}'`);
  }
}
```

if}}

{{hint

{{index ["expresión regular", escapar], ["carácter de barra invertida", "en expresiones regulares"]}}

Primero, no olvides la barra invertida delante del punto.

Para hacer coincidir el ((signo)) opcional delante del ((número)), así como delante del ((exponente)), se puede hacer con `[+\-]?` o `(\+|-|)` (más, menos, o nada).

{{index "carácter de tubería"}}

La parte más complicada del ejercicio es el problema de hacer coincidir tanto `"5."` como `".5"` sin hacer coincidir también `"."`. Para esto, una buena solución es usar el operador `|` para separar los dos casos: uno o más dígitos seguidos opcionalmente por un punto y cero o más dígitos _o_ un punto seguido por uno o más dígitos.

{{index exponente, "sensibilidad a mayúsculas y minúsculas", ["expresión regular", flags]}}

Finalmente, para hacer que el caso de la _e_ sea insensible a mayúsculas y minúsculas, añade una opción `i` a la expresión regular o usa `[eE]`.

hint}}