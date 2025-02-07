# Valores, Tipos y Operadores

{{quote {author: "Master Yuan-Ma", title: "The Book of Programming", chapter: true}

Bajo de la superficie de la máquina, el programa se mueve. Sin esfuerzo, se expande y contrae. En gran armonía, los electrones se dispersan y reagrupan. Las formas en el monitor no son sino ondas en el agua. La esencia permanece invisible debajo.

quote}}

{{figure {url: "img/chapter_picture_1.jpg", alt: "Una foto de un mar de bits", chapter: "framed"}}}


En el mundo de la computadora, solo existe la información. Puedes leer datos, modificar datos, crear nuevos datos, pero no se puede hablar de nada que no sean datos. Todos estos datos se almacenan como largas secuencias de bits, y, por tanto, en el fondo, son todos iguales.

Llamamos _bits_ a cualquier tipo de cosa con dos posibles valores, y generalmente los describimos usando ceros y unos. Dentro de la computadora, aparecen en forma de una carga eléctrica alta o baja, una señal fuerte o débil, o un punto brillante u opaco en la superficie de un CD. Cualquier pieza de información discreta puede reducirse a una secuencia de ceros y unos y por lo tanto representarse en bits.

Por ejemplo, podemos expresar el número 13 en bits de la misma manera que lo hacemos como número decimal, pero en lugar de utilizando diez ((dígito))s diferentes, usando solo 2, aumentando el peso de cada dígito de la representación por un factor de 2 de derecha a izquierda. Aquí están los bits que componen el número 13, con los pesos de los dígitos mostrados debajo de ellos:

```{lang: null}
   0   0   0   0   1   1   0   1
 128  64  32  16   8   4   2   1
```

Ese es el número binario 00001101. Sus dígitos no nulos representan 8, 4 y 1, y suman 13.

## Valores

Imagina una mar de bits—un océano de ellos. Una computadora corriente de hoy en día tiene más de 100 mil millones de bits en su almacenamiento de datos volátil (memoria de trabajo o memoria RAM). El almacenamiento no volátil (el disco duro o cualquier equivalente) tiende a tener aún unos cuantos órdenes de magnitud más.

Para poder trabajar con tales cantidades de bits sin perdernos, los separamos en trozos que representan piezas de información. En un entorno de JavaScript, esos trozos se llaman _((valor))es_. Aunque todos los valores están hechos de bits, desempeñan roles diferentes. Cada valor tiene un ((tipo)) que determina su función. Algunos valores son números, otros son fragmentos de texto, otros son funciones, etc.

Para crear un valor, basta con invocar su nombre. Esto es conveniente. No tienes que recolectar material de construcción para tus valores ni pagar por ellos. Solo solicitas uno, y ¡pum!, ahí está. Por supuesto, los valores no se crean realmente de la nada. Cada uno tiene que almacenarse en algún lugar, y, si deseas usar gigantescas cantidades de ellos al mismo tiempo, podrías quedarte sin memoria en la computadora. Por suerte, esto es un problema solo si los necesitas todos a la vez. Tan pronto como dejes de usar un valor, se disipará, dejando atrás sus bits para ser reciclados como material de construcción para la próxima generación de valores. 

El resto de este capítulo presenta los elementos atómicos de los programas de JavaScript, es decir, los tipos de valores simples y los operadores que pueden actuar sobre dichos valores.

## Números

{{index [sintaxis, "número"], "número", ["número", "notación"]}}

Los valores del tipo _number_ son, como era de esperar, valores numéricos. En un programa de JavaScript, se escriben de la siguiente manera:

```
13
```

{{index "número binario"}}

Usar esto en un programa hará que el patrón de bits para el número 13 exista en la memoria del ordenador.

{{index ["número", "representación"], bit}}

JavaScript utiliza una cantidad fija de bits, 64 de ellos, para almacenar cada valor numérico. Hay una cantidad limitada de patrones que puedes formar con 64 bits, lo que limita la cantidad de números diferentes que se pueden representar. Con _N_ ((dígitos)) decimales, puedes representar 10^N^ números distintos. De manera similar, utilizando 64 dígitos binarios, puedes representar 2^64^ números diferentes, que son alrededor de 18 mil trillones (un 18 seguido de 18 ceros). Eso es un montón.

La memoria de la computadora solía ser mucho más pequeña, y la gente solía utilizar grupos de 8 o 16 bits para representar sus números. Era fácil acabar por error con un _((desbordamiento))_ (comúnmente conocido como _overflow_) con un conjunto posible de números tan pequeño —es decir, terminar con un número que no puede ser representado con la cantidad dada de bits. Hoy en día, incluso un dispositivo que cabe en tu bolsillo tiene mucha memoria, por lo que puedes utilizar trozos de 64 bits para representar números, y solo necesitas preocuparte por el desbordamiento cuando pretendes representar cantidades realmente astronómicas.

{{index signo, "número de punto flotante", "bit de signo"}}

En cualquier caso, no todos los números naturales menores que 18 mil trillones caben en un número de JavaScript. Esos bits también almacenan números negativos, por lo que un bit se usa para indicar el signo del número. Y aún más complicado es representar números no enteros. Para hacer esto, algunos de los bits se utilizan para almacenar la posición del punto decimal. El número entero más grande que en realidad se puede almacenar está más en el rango de los 9 mil billones (15 ceros), que sigue siendo increíblemente grande.

{{index ["número", "notación"], "número fraccionario"}}

Para representar números con parte decimal se utiliza un punto:

```
9.81
```

{{index exponente, "notación científica", ["número", "notación"]}}

Para números muy grandes o muy pequeños, también se puede usar notación científica agregando una _e_ (de _exponente_), seguida del exponente del número:

```
2.998e8
```

Esto representaría al número 2.998 × 10^8^ = 299,800,000.

{{index pi, ["número", "precisión de"], "número de punto flotante"}}

La precisión de cualquier cálculo con números _((enteros))_ con valor absoluto menor a los 9 mil billones antes mencionados está siempre garantizada. Por desgracia, la de los cálculos con números no enteros generalmente no está. Así como π (pi) no puede expresarse con total precisión mediante un número finito de dígitos decimales, muchos números pierden algo de precisión en su representación cuando solo tenemos 64 bits para almacenarlos. Es una lástima, pero solo provoca problemas prácticos en situaciones específicas. Lo importante tenerlo en cuenta y tratar los números digitales con parte decimal como aproximaciones, no como valores precisos.

### Aritmética

{{index [sintaxis, operador], operador, "operador binario", "aritmética", suma, "multiplicación"}}

Con números, lo principal que uno puede hacer es aritmética. Operaciones aritméticas como la suma o la multiplicación toman dos valores numéricos y producen un nuevo número a partir de ellos. Esta es la pinta que tienen en JavaScript:

```{meta: "expr"}
100 + 4 * 11
```

{{index [operador, "aplicación"], asterisco, "carácter de suma", "operador *", "operador +"}}

Los símbolos `+` y `*` se llaman _operadores_. El primero representa la suma y el segundo representa la multiplicación. Colocar un operador entre dos valores aplicará ese operador a esos valores y producirá un nuevo valor.

{{index "agrupación", "paréntesis", precedencia}}

¿Significa este ejemplo "sumar 4 y 100, y luego multiplicar el resultado por 11", o se realiza primero la multiplicación antes de la suma? Como habrás adivinado, la multiplicación se realiza primero. Pero igual que en matemáticas, esto se puede cambiar escribiendo la suma entre paréntesis:

```{meta: "expr"}
(100 + 4) * 11
```

{{index "carácter de resta", "carácter de división", "división", resta, "-", "/ operator"}}

Para la resta, está el operador `-`. La división se puede hacer con el operador `/`.

Cuando los operadores aparecen juntos sin paréntesis, el orden en que se aplican se determina por la _((precedencia))_ de los operadores. El ejemplo muestra que la multiplicación se realiza antes que la suma. El operador `/` tiene la misma precedencia que `*`. Igualmente, `+` y `-` tienen la misma precedencia. Cuando varios operadores con la misma precedencia aparecen uno al lado del otro, como en `1 - 2 + 1`, se aplican de izquierda a derecha: `(1 - 2) + 1`.

No te preocupes demasiado por estas reglas de precedencia. Cuando tengas dudas, simplemente agrega paréntesis.

{{index "operador de módulo", "división", "operador de residuo", "% operator"}}

Hay un operador aritmético más que quizás no te suene tanto. El símbolo `%` se utiliza para representar la operación de _resto_. `X % Y` es el resto de la división entera de `X` entre `Y`. Por ejemplo, `314 % 100` produce `14`, y `144 % 12` da `0`. La precedencia del operador de resto es la misma que la de multiplicación y división. También verás a menudo a este operador referido como _módulo_.

### Números especiales

{{index ["número", "valores especiales"], infinito}}

Hay tres valores especiales en JavaScript que se consideran números pero no se comportan como números normales. Los dos primeros son `Infinity` y `-Infinity`, que representan el infinito positivo y negativo. `Infinity - 1` sigue siendo `Infinity`, etc. De todos modos, no te fíes demasiado de las cuentas que involucren al infinito. No suele tener sentido matemáticamente y rápidamente te llevará a encontrarte con el siguiente número especial: `NaN`.

{{index NaN, "no es un número", "división por cero"}}

`NaN` significa "no es un número" (en inglés, _not a number_), aunque _es_ un valor del tipo _number_. Obtendrás este resultado cuando, por ejemplo, intentes calcular `0 / 0` (cero dividido por cero), `Infinity - Infinity`, o cualquier otra cuanta que no tenga un sentido determinado.

## Cadenas

{{indexsee "acento grave", "comilla invertida"}}

{{index [sintaxis, cadena], texto, "carácter", [cadena, "notación"], "comilla simple", "comilla doble", comillas, comilla invertida}}

El siguiente tipo de dato básico es la _((cadena))_ (en inglés, _string_). Las cadenas se utilizan para representar texto. Se escriben encerrando su contenido entre comillas.

```
`En el mar`
"Acostado en el océano"
'Flotando en el océano'
```

Puedes usar comillas simples, comillas dobles o acentos graves para marcar las cadenas, siempre y cuando el tipo de comillas al principio y al final de la cadena coincidan.

{{index "salto de línea", "carácter de nueva línea"}}

Puedes poner casi cualquier cosa entre comillas para que JavaScript genere un valor de tipo cadena a partir de ello. Pero algunos caracteres son más difíciles. Ya te puedes imaginar lo complicado que sería poner comillas entre comillas, ya que parecerían el final de la cadena. _Saltos de línea_ (los caracteres que obtienes cuando le das al [enter]{keyname}) solo se pueden incluir cuando la cadena está entre acentos graves (`` ` ``).

{{index [escape, "en cadenas"], ["carácter de barra invertida", "en cadenas"]}}

Para poder incluir tales caracteres en una cadena, se utiliza la siguiente notación: una barra invertida (`\`) dentro de un texto entre comillas indica que el carácter posterior tiene un significado especial. A esto se le llama _escapar_ el carácter. Una comilla que va precedida por una barra invertida no finalizará la cadena, sino que formará parte de ella. Cuando un carácter `n` aparece después de una barra invertida, se interpreta como un salto de línea. De manera similar, un `t` después de una barra invertida significa un ((carácter de tabulación)). Consideremos la siguiente cadena:

```
"Esta es la primera línea\nY esta es la segunda"
```

Este es el texto real de esa cadena:

```{lang: null}
Esta es la primera línea
Y esta es la segunda
```

Por supuesto, hay situaciones en las que te gustaría que una barra invertida en una cadena fuera simplemente una barra invertida, no un código especial. Si aparecen dos barras invertidas seguidas en una cadena, estas colapsarán en una en el valor de cadena resultante. Así es como se puede expresar la cadena "_Un carácter de salto de línea se escribe como `"`\n`"`._":

```
"Un carácter de salto de línea se escribe como \"\\n\"."
```

{{id unicode}}

{{index [cadena, "representación"], Unicode, "carácter"}}

Las cadenas también hay que modelarlas como una serie de bits para que puedan existir dentro de la computadora. La forma en que JavaScript lo hace se basa en el estándar _((Unicode))_. Este estándar asigna un número a prácticamente cada carácter que puedas necesitar, incluidos los caracteres griegos, árabes, japoneses, armenios, etc. Si tenemos un número para cada carácter, una cadena puede ser descrita por una secuencia de números. Y eso es lo que hace JavaScript.

{{index "UTF-16", emoji}}

Pero hay una complicación: la representación de JavaScript utiliza 16 bits por cada elemento de tipo cadena, lo que puede describir hasta 2^16^ caracteres diferentes. Sin embargo, Unicode define más caracteres (alrededor del doble que eso, de momento). Por lo tanto, algunos caracteres, como muchos emoji, ocupan dos "posiciones de caracteres" en las cadenas de JavaScript. Volveremos a esto en el [Capítulo ?](higher_order#code_units).

{{index "operador +", "concatenación"}}

Las cadenas no se pueden dividir, multiplicar o restar. El operador `+` se puede usar en ellas, no para sumar, sino para _concatenar_ (unir dos cadenas). La siguiente línea producirá la cadena `"concatenar"`:

```{meta: "expr"}
"con" + "cat" + "e" + "nar"
```

Los valores de tipo cadena tienen una serie de funciones asociadas (_métodos_) que se pueden utilizar para realizar otras operaciones con ellos. Hablaré más sobre esto en el [Capítulo ?](data#methods).

{{index "interpolación", acento grave}}

Las cadenas escritas con comillas simples o dobles se comportan de manera muy similar, la única diferencia radica en qué tipo de comilla necesitas escapar dentro de ellas. Las cadenas entre acentos graves, generalmente llamadas _((template literals))_, pueden hacer algunas cosas más. Aparte de poder abarcar varias líneas, también pueden incrustar otros valores.

```{meta: "expr"}
`la mitad de 100 es ${100 / 2}`
```

Cuando escribes algo dentro de `${}` en un _template literal_, su resultado se calculará, se convertirá en una cadena, y se incluirá en esa posición. Este ejemplo produce "_la mitad de 100 es 50_".

## Operadores unarios

{{index operador, "operador typeof", tipo}}

No todos los operadores son símbolos. Algunos se representan con palabras. Un ejemplo es el operador `typeof`, que produce un valor de cadena que indica el tipo del valor que le proporcionas.

```
console.log(typeof 4.5)
// → number
console.log(typeof "x")
// → string
```

{{index "console.log", salida, "consola de JavaScript"}}

{{id "console.log"}}

Utilizaremos `console.log` en ejemplos de código para indicar que queremos ver el resultado de evaluar algo (veremos más sobre esto en el [próximo capítulo](program_structure)).

{{index "negación", "- operador", "operador binario", "operador unario"}}

Los otros operadores mostrados hasta ahora en este capítulo operaron sobre dos valores, pero `typeof` toma solo uno. Los operadores que utilizan dos valores se llaman operadores _binarios_, mientras que aquellos que toman uno se llaman operadores _unarios_. El operador menos (`-`) se puede usar tanto como un operador binario como un operador unario.

```
console.log(- (10 - 2))
// → -8
```

## Valores booleanos

{{index Booleano, operador, true, false, bit}}

A menudo es útil tener un valor que distinga solo entre dos posibilidades, como "sí" y "no" o "encendido" y "apagado". Para este propósito, JavaScript tiene un tipo _Booleano_, que tiene solo dos valores, true y false, y que se escriben tal cual como esas palabras.

### Comparación

{{index "comparación"}}

Aquí hay una forma de producir valores booleanos:

```
console.log(3 > 2)
// → true
console.log(3 < 2)
// → false
```

{{index ["comparación", "de números"], "> operador", "< operador", "más grande que", "menos que"}}

Los signos `>` y `<` son símbolos tradicionales para "es mayor que" y "es menor que", respectivamente. Son operadores binarios. Aplicarlos da como resultado un valor booleano que indica si son verdaderos en el caso en cuestión.

Las cadenas se pueden comparar de la misma manera:

```
console.log("Aardvark" < "Zoroaster")
// → true
```

{{index ["comparación", "de cadenas"]}}

El orden entre casenas es más o menos el alfabético pero no exactamente como se hace en un diccionario: las letras mayúsculas son siempre "menores" que las minúsculas, conque `"Z" < "a"`; y los caracteres no alfabéticos (!, -, etc.) también se incluyen en la ordenación. Para comparar cadenas, lo que JavaScript hace es recorrer los caracteres de izquierda a derecha, comparando los códigos ((Unicode)) uno por uno.

{{index igualdad, "operador >=", "operador <=", "operador ==", "operador !="}}

Otros operadores similares son `>=` (mayor o igual que), `<=` (menor o igual que), `==` (igual a), y `!=` (no igual a).

```
console.log("Granate" != "Rubí")
// → true
console.log("Perla" == "Amatista")
// → false
```

{{index ["comparación", "de NaN"], NaN}}

Solo hay un valor en JavaScript que no es igual a sí mismo, y ese es `NaN`.

```
console.log(NaN == NaN)
// → false
```

`NaN` se supone que denota el resultado de un cálculo sin sentido y, como tal, no es igual al resultado de ningún otro cálculo sin sentido.

### Operadores lógicos

{{index razonamiento, "operadores lógicos"}}

También hay algunas operaciones que se pueden aplicar a los propios valores Booleanos. JavaScript soporta tres operadores lógicos: _and_ (y), _or_ (o), y _not_ (no). Estos se pueden usar para "razonar" sobre valores Booleanos.

{{index "&& operador", "and lógico"}}

El operador `&&` representa el _and_ lógico. Es un operador binario, y su resultado es verdadero solo si los dos valores dados son verdaderos.

```
console.log(true && false)
// → false
console.log(true && true)
// → true
```

{{index "|| operador", "or lógico"}}

El operador `||` representa el _or_ lógico. Produce verdadero si cualquiera de los valores dados es verdadero.

```
console.log(false || true)
// → true
console.log(false || false)
// → false
```

{{index "negación", "! operador"}}

_Not_ se escribe con un signo de exclamación (`!`). Es un operador unario que invierte el valor del valor dado; `!true` produce `false` y `!false` produce `true`.

{{index precedencia}}

Al combinar estos operadores Booleanos con operadores aritméticos y otros operadores, no siempre es obvio cuándo se necesitan paréntesis. En la práctica, generalmente puedes tirar para alante sabiendo que, de los operadores que hemos visto hasta ahora, `||` tiene la menor precedencia, luego viene `&&`, luego los operadores de comparación (`>`, `==`, etc.), y luego el resto. Este orden ha sido elegido de tal manera que, en expresiones típicas como la siguiente, se necesite la menor cantidad de paréntesis posible:

```{meta: "expr"}
1 + 1 == 2 && 10 * 10 > 50
```

{{index "ejecución condicional", "operador ternario", "?: operador", "operador condicional", "carácter dos puntos", "signo de interrogación"}}

El último operador lógico que veremos no es unario ni binario, sino _ternario_, operando en tres valores. Se escribe con un signo de interrogación y dos puntos, como sigue:

```
console.log(true ? 1 : 2);
// → 1
console.log(false ? 1 : 2);
// → 2
```

Este es el llamado operador _condicional_ (o a veces simplemente _el operador ternario_ ya que es el único operador de este tipo en el lenguaje). El operador usa el valor a la izquierda del signo de interrogación para decidir cuál de los otros dos valores "elegir". Si escribes `a ? b : c`, el resultado será `b` cuando `a` es verdadero y `c` en caso contrario.

## Valores vacíos

{{index indefinido, nulo}}

Hay dos valores especiales que se escriben `null` y `undefined` y que se utilizan para denotar la ausencia de un valor _significativo_. Son valores en sí mismos, pero no llevan ninguna información. Muchas operaciones en el lenguaje que no producen un valor significativo devuelven `undefined` simplemente porque tienen que devolver _algún_ valor.

La diferencia en el significado entre `undefined` y `null` es un accidente del diseño de JavaScript, y la mayoría de las veces no es relevante. En casos en los que tienes que tratar con estos valores, recomiendo tratarlos como esencialmente intercambiables.

## Conversión automática de tipos

{{index NaN, "coerción de tipos"}}

En la [Introducción](intro), mencioné que JavaScript se pasa por aceptando cualquier programa que le des, incluso programas que hacen cosas extrañas. Esto se demuestra claramente con las siguientes expresiones:

```
console.log(8 * null)
// → 0
console.log("5" - 1)
// → 4
console.log("5" + 1)
// → 51
console.log("five" * 2)
// → NaN
console.log(false == 0)
// → true
```

{{index "+ operator", "aritmética", "* operator", "- operator"}}

Cuando se aplica un operador al tipo de valor "incorrecto", JavaScript convertirá silenciosamente ese valor al tipo que necesita, utilizando una serie de reglas que a menudo no son las que buscas o esperas. Esto se llama _((coerción de tipos))_. El `null` en la primera expresión se convierte en `0` y el `"5"` en la segunda expresión se convierte en `5` (de cadena a número). Sin embargo, en la tercera expresión, `+` intenta la concatenación de cadenas antes que la suma de números, por lo que el `1` se convierte en `"1"` (de número a cadena).

{{index "coerción de tipos", ["número", "conversión a"]}}

Cuando se convierte en un número algo que no se corresponde de manera obvia con un número (como `"five"` o `undefined`), obtienes el valor `NaN`. Más operaciones aritméticas en `NaN` siguen produciendo `NaN`, así que si ves que te sale uno de estos en un lugar inesperado, busca conversiones de tipo accidentales.

{{index null, undefined, ["comparación", "de valores undefined"], "== operador"}}

Cuando se comparan valores del mismo tipo usando el operador `==`, el resultado es fácil de predecir: deberías obtener verdadero cuando ambos valores son iguales, excepto en el caso de `NaN`. Pero cuando los tipos difieren, JavaScript utiliza una serie de reglas extrañas para determinar qué hacer. En la mayoría de los casos, simplemente intenta convertir uno de los valores al tipo del otro valor. Sin embargo, cuando `null` o `undefined` aparecen en cualquiera de los lados del operador, este produce verdadero solo si el valor de ambos lados está entre `null` y `undefined`.

```
console.log(null == undefined);
// → true
console.log(null == 0);
// → false
```

Ese comportamiento a menudo es útil. Cuando quieres comprobar si un valor tiene un valor real en lugar de `null` o `undefined`, puedes simplemente compararlo con `null` usando el operador `==` o `!=`.

{{index "coerción de tipos", [Boolean, "conversión a"], "=== operador", "!== operador", "comparación"}}

¿Qué sucede si quieres probar si algo se refiere al valor preciso `false`? Expresiones como `0 == false` y `"" == false` también dan verdadero debido a la conversión automática de tipos. Cuando _no_ deseas que ocurran conversiones de tipo, hay dos operadores adicionales: `===` y `!==`. El primero prueba si un valor es _precisamente_ igual al otro, y el segundo prueba si no es precisamente igual. Por lo tanto, `"" === false` es falso, como era de esperar.

Recomiendo usar los operadores de comparación de tres caracteres de manera preventiva para evitar conversiones de tipo inesperadas que puedan complicarte las cosas. Pero cuando estés seguro de que los tipos en ambos lados serán los mismos, no hay problema en usar los otros operadores más cortos.

### Cortocircuito de operadores lógicos

{{index "coerción de tipo", [Boolean, "conversión a"], operador}}

Los operadores lógicos `&&` y `||` manejan valores de tipos distintos de una forma peculiar. Convierten el valor del lado izquierdo a tipo Booleano para decidir qué hacer, pero, dependiendo del operador y el resultado de esa conversión, devuelven el valor _original_ del lado izquierdo o el valor del lado derecho.

{{index "operador ||"}}

El operador `||`, por ejemplo, devolverá el valor de su izquierda cuando ese valor pueda convertirse en true y devolverá el valor de su derecha de lo contrario. Esto tiene el efecto esperado cuando los valores son Booleanos y hace algo análogo para valores de otros tipos.

```
console.log(null || "usuario")
// → usuario
console.log("Agnes" || "usuario")
// → Agnes
```

{{index "valor predeterminado"}}

Podemos utilizar esta funcionalidad como una forma de utilizar un valor predeterminado. Si tienes un valor que podría estar vacío, puedes colocar `||` después de él con un valor de reemplazo. Si el valor inicial se puede convertir en false, obtendrás el valor de reemplazo en su lugar. Las reglas para convertir cadenas y números en valores Booleanos establecen que `0`, `NaN` y la cadena vacía (`""`) cuentan como `false`, mientras que todos los demás valores serán `true`. Esto significa que `0 || -1` produce `-1`, y `"" || "!?"` da como resultado `"!?"`.

{{index "operador ??", null, undefined}}

El operador `??` se parece a `||`, pero devuelve el valor de la derecha solo si el de la izquierda es null o undefined, no si es algún otro valor que se pueda convertir en `false`. Normalmente, este comportamiento es preferible al de `||`.

```
console.log(0 || 100);
// → 100
console.log(0 ?? 100);
// → 0
console.log(null ?? 100);
// → 100
```

{{index "operador &&"}}

El operador `&&` funciona de manera parecida pero en sentido contrario. Cuando el valor a su izquierda es algo que se convierte en false, devuelve ese valor, y de lo contrario devuelve el valor de su derecha.

Otra propiedad importante de estos dos operadores es que la parte de su derecha se evalúa solo cuando es necesario. En el caso de `true || X`, no importa lo que sea `X` —incluso si es una parte del programa que hace algo _terrible_—, el resultado será true, y `X` nunca se evaluará. Lo mismo ocurre con `false && X`, que es false e ignorará `X`. Esto se llama _evaluación de cortocircuito_ (o _evaluación mínima_).

{{index "operador ternario", "operador ?:", "operador condicional"}}

El operador condicional funciona de manera similar. De los valores segundo y tercero, solo se evalúa el que sea seleccionado.

## Resumen

En este capítulo examinamos cuatro tipos de valores en JavaScript: números, cadenas, Booleanos y valores indefinidos. Tales valores son creados escribiendo su nombre (`true`, `null`) o valor (`13`, `"abc"`).

Puedes combinar y transformar valores con operadores. Hemos visto operadores binarios para aritmética (`+`, `-`, `*`, `/` y `%`), concatenación de cadenas (`+`), comparación (`==`, `!=`, `===`, `!==`, `<`, `>`, `<=`, `>=`) y lógica (`&&`, `||`, `??`), así como varios operadores unarios (`-` para obtener el opuesto de un número, `!` para negar lógicamente, y `typeof` para descubrir el tipo de un valor) y un operador ternario (`?:`) para elegir uno de dos valores basado en un tercer valor.

Esto es información suficiente para usar JavaScript como una calculadora de bolsillo, pero no mucho más. El [próximo capítulo](program_structure) comenzará a unir estas expresiones en programas básicos.
