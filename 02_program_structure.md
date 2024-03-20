# Estructura del Programa

{{quote {author: "_why", title: "Guía (conmovedora) de Ruby de Why", chapter: true}

Y mi corazón brilla intensamente bajo mi piel diáfana y translúcida, y tienen que administrarme 10cc de JavaScript para hacerme volver. (Respondo bien a las toxinas en la sangre.) ¡Hombre, esa cosa sacará los melocotones de tus agallas!

quote}}

{{index why, "Guía Conmovedora"}}

{{figure {url: "img/chapter_picture_2.jpg", alt: "Ilustración que muestra varios tentáculos sujetando piezas de ajedrez", chapter: framed}}}

En este capítulo, comenzaremos a hacer cosas que realmente pueden ser llamadas _programación_. Ampliaremos nuestro dominio del lenguaje JavaScript más allá de los sustantivos y fragmentos de oraciones que hemos visto hasta ahora, hasta el punto en que podamos expresar prosa significativa.

## Expresiones y declaraciones

{{index grammar, [sintaxis, "expresión"], ["código", "estructura de"], "gramática", [JavaScript, sintaxis]}}

En el [Capítulo ?](values) creamos valores y le aplicamos operadores para obtener nuevos valores. Crear valores de esta manera es la sustancia principal de cualquier programa JavaScript. Pero esa sustancia debe enmarcarse en una estructura más grande para ser útil. Eso es lo que cubriremos en este capítulo.

{{index "expresión literal", ["paréntesis", "expresión"]}}

Un fragmento de código que produce un valor se llama una _((expresión))_. Cada valor que está escrito literalmente (como `22` o `"psicoanálisis"`) es una expresión. Una expresión entre paréntesis también es una expresión, al igual que un ((operador binario)) aplicado a dos expresiones o un ((operador unario)) aplicado a uno.

{{index [anidamiento, "de expresiones"], "lenguaje humano"}}

Esto muestra parte de la belleza de una interfaz basada en un lenguaje. Las expresiones pueden contener otras expresiones de manera similar a cómo las oraciones están anidadas en el lenguaje humano: una oración puede contener sus propias oraciones y así sucesivamente. Esto nos permite construir expresiones que describen cálculos arbitrariamente complejos.

{{index "declaración", punto y coma, programa}}

Si una expresión corresponde a un fragmento de oración, una _declaración_ de JavaScript corresponde a una oración completa. Un programa es una lista de declaraciones.

{{index [sintaxis, "declaración"]}}

El tipo más simple de declaración es una expresión con un punto y coma al final. Este es un programa:

```
1;
!false;
```

Sin embargo, es un programa inútil. Una ((expresión)) puede conformarse con simplemente producir un valor, que luego puede ser utilizado por el código que la contiene. Sin embargo, una ((declaración)) se mantiene por sí misma, por lo que si no afecta al mundo, es inútil. Puede mostrar algo en la pantalla, como con `console.log`, o cambiar el estado de la máquina de una manera que afectará a las declaraciones que vienen después de ella. Estos cambios se llaman _((efectos secundarios))_. Las declaraciones en el ejemplo anterior simplemente producen los valores `1` y `verdadero`, y luego los desechan inmediatamente. Esto no deja ninguna impresión en el mundo en absoluto. Cuando ejecutas este programa no sucede nada observable.

{{index "estilo de programación", "inserción automática de punto y coma", punto y coma}}

En algunos casos, JavaScript te permite omitir el punto y coma al final de una declaración. En otros casos, debe estar ahí, o la próxima ((línea)) se tratará como parte de la misma declaración. Las reglas sobre cuándo se puede omitir de manera segura son algo complejas y propensas a errores. Por lo tanto, en este libro, cada declaración que necesite un punto y coma siempre recibirá uno. Te recomiendo que hagas lo mismo, al menos hasta que hayas aprendido más sobre las sutilezas de la omisión del punto y coma.

## Enlaces

{{indexsee variable, binding}}

{{index [syntax, statement], [binding, definition], "side effect", ["memoría", "organización"], [estado, in binding]}}

¿Cómo mantiene un programa un estado interno? ¿Cómo recuerda las cosas? Hemos visto cómo producir nuevos valores a partir de valores antiguos, pero esto no cambia los valores antiguos, y el nuevo valor debe utilizarse inmediatamente o se disipará nuevamente. Para atrapar y retener valores, JavaScript proporciona una cosa llamada un _enlace_, o _variable_:

```
let caught = 5 * 5;
```

{{index "let keyword"}}

Eso nos da un segundo tipo de ((declaración)). La palabra clave (_((keyword))_) `let` indica que esta frase va a definir un enlace. Está seguida por el nombre del enlace y, si queremos darle inmediatamente un valor, por un operador `=` y una expresión.

El ejemplo crea un enlace llamado `caught` y lo utiliza para capturar el número que se produce al multiplicar 5 por 5.

Después de que se haya definido un enlace, su nombre se puede usar como una ((expresión)). El valor de esa expresión es el valor que el enlace mantiene actualmente. Aquí tienes un ejemplo:

```
let ten = 10;
console.log(ten * ten);
// → 100
```

{{index "= operator", "asignación", [binding, "asignación"]}}

Cuando un enlace apunta a un valor, eso no significa que esté atado a ese valor para siempre. El operador `=` se puede usar en cualquier momento en enlaces existentes para desconectarlos de su valor actual y hacer que apunten a uno nuevo:

```
let mood = "light";
console.log(mood);
// → light
mood = "dark";
console.log(mood);
// → dark
```

{{index [binding, "modelo de"], "tentáculo (analogía)"}}

Debes imaginarte los enlaces como tentáculos en lugar de cajas. No _contienen_ valores; los _agarran_—dos enlaces pueden hacer referencia al mismo valor. Un programa solo puede acceder a los valores a los que todavía tiene una referencia. Cuando necesitas recordar algo, o bien haces crecer un nuevo tentáculo para agarrarlo o lo reconectas con uno de tus tentáculos existentes.

Veamos otro ejemplo. Para recordar la cantidad de dólares que Luigi todavía te debe, creas un enlace. Cuando te paga $35, le das a este enlace un nuevo valor:

```
let luigisDebt = 140;
luigisDebt = luigisDebt - 35;
console.log(luigisDebt);
// → 105
```

{{index undefined}}

Cuando defines un enlace sin darle un valor, el tentáculo no tiene nada que agarrar, por lo que termina en el aire. Si solicitas el valor de un enlace vacío, obtendrás el valor `undefined`.

{{index "let keyword"}}

Una sola instrucción `let` puede definir múltiples enlaces. Las definiciones deben estar separadas por comas:

```
let one = 1, two = 2;
console.log(one + two);
// → 3
```

Las palabras `var` y `const` también se pueden usar para crear enlaces, de manera similar a `let`:

```
var name = "Ayda";
const greeting = "Hola ";
console.log(greeting + name);
// → Hola Ayda
```

{{index "var keyword"}}

La primera de estas, `var` (abreviatura de "variable"), es la forma en que se declaraban los enlaces en JavaScript anterior a 2015, cuando aún no existía `let`. Volveré a la forma precisa en que difiere de `let` en el [próximo capítulo](functions). Por ahora, recuerda que en su mayoría hace lo mismo, pero rara vez lo usaremos en este libro porque se comporta de manera extraña en algunas situaciones.

{{index "palabra clave const", "nomenclatura"}}

La palabra `const` significa _((constante))_. Define un enlace constante, que apunta al mismo valor mientras exista. Esto es útil para enlaces que solo dan un nombre a un valor para poder referirse fácilmente a él más tarde.

## Nombres de enlaces

{{index "carácter de subrayado", "signo de dólar", [enlace, nomenclatura]}}

Los nombres de enlaces pueden ser cualquier secuencia de una o más letras. Los dígitos pueden formar parte de los nombres de enlaces, `catch22` es un nombre válido, por ejemplo, pero el nombre no puede empezar con un dígito. Un nombre de enlace puede incluir signos de dólar (`$`) o subrayados (`_`), pero no otros signos de puntuación o caracteres especiales.

{{index [sintaxis, identificador], "implements (palabra reservada)", "interface (palabra reservada)", "package (palabra reservada)", "private (palabra reservada)", "protected (palabra reservada)", "public (palabra reservada)", "static (palabra reservada)", "operador void", "yield (palabra reservada)", "enum (palabra reservada)", "palabra reservada", [enlace, nomenclatura]}}

Palabras con un significado especial, como `let`, son _((palabra clave))_, y no pueden ser usadas como nombres de enlaces. También hay una serie de palabras que están "reservadas para su uso" en ((futuras)) versiones de JavaScript, las cuales tampoco se pueden usar como nombres de enlaces. La lista completa de palabras clave y palabras reservadas es bastante larga:

```{lang: "null"}
break case catch class const continue debugger default
delete do else enum export extends false finally for
function if implements import interface in instanceof let
new package private protected public return static super
switch this throw true try typeof var void while with yield
```

{{index [sintaxis, error]}}

No te preocupes por memorizar esta lista. Cuando al crear un enlace se produce un error de sintaxis inesperado, verifica si estás intentando definir una palabra reservada.

## El entorno

{{index "entorno estándar", [navegador, entorno]}}

La colección de enlaces y sus valores que existen en un momento dado se llama _((entorno))_. Cuando un programa se inicia, este entorno no está vacío. Siempre contiene enlaces que forman parte del lenguaje ((estándar)), y la mayoría de las veces también tiene enlaces que proporcionan formas de interactuar con el sistema circundante. Por ejemplo, en un navegador, existen funciones para interactuar con el sitio web cargado actualmente y para leer la entrada del ((ratón)) y el ((teclado)).

## Funciones

{{indexsee "aplicación (de funciones)", ["función", "aplicación"]}}
{{indexsee "invocación (de funciones)", ["función", "aplicación"]}}
{{indexsee "llamado (de funciones)", ["función", "aplicación"]}}

{{index salida, "función", ["función", "aplicación"], [navegador, entorno]}}

Muchos de los valores proporcionados en el entorno predeterminado tienen el tipo de _((función))_. Una función es un fragmento de programa envuelto en un valor. Estos valores pueden ser _aplicados_ para ejecutar el programa envuelto. Por ejemplo, en un entorno de navegador, el enlace `prompt` contiene una función que muestra un pequeño ((cuadro de diálogo)) pidiendo la entrada del usuario. Se utiliza de la siguiente manera:

```
prompt("Enter passcode");
```

{{figure {url: "img/prompt.png", alt: "Un cuadro de diálogo que dice 'Enter passcode'", width: "8cm"}}}

{{index "parámetro", ["función", "aplicación"], ["paréntesis", argumentos]}}

Ejecutar una función se llama _invocar_, _llamar_, o _aplicar_ la función. Puedes llamar una función poniendo paréntesis después de una expresión que produce un valor de función. Usualmente usarás directamente el nombre del enlace que contiene la función. Los valores entre paréntesis se le pasan al programa dentro de la función. En el ejemplo, la función `prompt` utiliza la cadena que le pasamos como el texto a mostrar en el cuadro de diálogo. Los valores dados a las funciones se llaman _((argumento))s_. Diferentes funciones pueden necesitar un número diferente o diferentes tipos de argumentos.

La función `prompt` no se usa mucho en la programación web moderna, principalmente porque no tienes control sobre cómo se ve el cuadro de diálogo resultante, pero puede ser útil en programas simples y experimentos.

## La función console.log

{{index "consola JavaScript", "herramientas para desarrolladores", "Node.js", "console.log", salida, [navegador, entorno]}}

En los ejemplos, utilicé `console.log` para mostrar valores. La mayoría de los sistemas de JavaScript (incluidos todos los navegadores web modernos y Node.js) proveen una función `console.log` que escribe sus argumentos en _algún_ dispositivo de salida de texto. En los navegadores, la salida va a la ((consola de JavaScript)). Esta parte de la interfaz del navegador está oculta por defecto, pero la mayoría de los navegadores la abren cuando presionas F12 o, en Mac, [comando]{keyname}-[opción]{keyname}-I. Si eso no funciona, busca a través de los menús un elemento llamado Herramientas para Desarrolladores o similar.

{{if interactive

Cuando ejecutas los ejemplos (o tu propio código) en las páginas de este libro, la salida de `console.log` se mostrará después del ejemplo, en lugar de en la consola de JavaScript del navegador.

```
let x = 30;
console.log("el valor de x es", x);
// → el valor de x es 30
```

if}}

{{index [objeto, propiedad], [acceso, propiedad]}}

Aunque los nombres de enlaces no pueden contener ((puntos)), `console.log` tiene uno. Esto se debe a que `console.log` no es un simple enlace, sino una expresión que recupera la propiedad `log` del valor contenido por el enlace `console`. Descubriremos exactamente lo que esto significa en el [Capítulo ?](data#properties).

{{id valores_retorno}}
## Valores de retorno

{{index ["comparación", "de números"], "valor de retorno", "función Math.max", "máximo"}}

Mostrar un cuadro de diálogo o escribir texto en la pantalla es un ((efecto secundario)). Muchas funciones son útiles debido a los efectos secundarios que producen. Las funciones también pueden producir valores, en cuyo caso no necesitan tener un efecto secundario para ser útiles. Por ejemplo, la función `Math.max` toma cualquier cantidad de argumentos numéricos y devuelve el mayor:

```
console.log(Math.max(2, 4));
// → 4
```

{{index ["función", "aplicación"], "mínimo", "función Math.min"}}

Cuando una función produce un valor, se dice que _retorna_ ese valor. Cualquier cosa que produzca un valor es una ((expresión)) en JavaScript, lo que significa que las llamadas a funciones se pueden utilizar dentro de expresiones más grandes. En el siguiente código, una llamada a `Math.min`, que es lo opuesto a `Math.max`, se usa como parte de una expresión de suma:

```
console.log(Math.min(2, 4) + 100);
// → 102
```

El [Capítulo ?](functions) explicará cómo escribir tus propias funciones.

## Control de flujo

{{index "orden de ejecución", programa, "control de flujo"}}

Cuando tu programa contiene más de una ((sentencia)), las sentencias se ejecutan como si fueran una historia, de arriba hacia abajo. Por ejemplo, el siguiente programa tiene dos sentencias. La primera le pide al usuario un número, y la segunda, que se ejecuta después de la primera, muestra el ((cuadrado)) de ese número:

```
let elNumero = Number(prompt("Elige un número"));
console.log("Tu número es la raíz cuadrada de " +
            elNumero * elNumero);
```

{{index ["número", "conversión a"], "coerción de tipo", "función Number", "función String", "función Boolean", [Boolean, "conversión a"]}}

La función `Number` convierte un valor a un número. Necesitamos esa conversión porque el resultado de `prompt` es un valor de tipo string, y queremos un número. Hay funciones similares llamadas `String` y `Boolean` que convierten valores a esos tipos.

Aquí está la representación esquemática bastante trivial del flujo de control en línea recta:

{{figure {url: "img/controlflow-straight.svg", alt: "Diagrama mostrando una flecha recta", width: "4cm"}}}

## Ejecución condicional

{{index Boolean, ["control de flujo", condicional]}}

No todos los programas son caminos rectos. Podríamos, por ejemplo, querer crear una carretera ramificada donde el programa tome la rama adecuada basada en la situación en cuestión. Esto se llama _((ejecución condicional))_.

{{figure {url: "img/controlflow-if.svg", alt: "Diagrama de una flecha que se divide en dos y luego se une de nuevo",width: "4cm"}}}

{{index [sintaxis, sentencia], "función Number", "palabra clave if"}}

La ejecución condicional se crea con la palabra clave `if` en JavaScript. En el caso simple, queremos que cierto código se ejecute si, y solo si, una cierta condición es verdadera. Por ejemplo, podríamos querer mostrar el cuadrado de la entrada solo si la entrada es realmente un número:

```{test: wrap}
let elNumero = Number(prompt("Elige un número"));
if (!Number.isNaN(elNumero)) {
  console.log("Tu número es la raíz cuadrada de " +
              elNumero * elNumero);
}
```

Con esta modificación, si introduces "loro", no se mostrará ninguna salida.

{{index ["paréntesis", sentencia]}}

La palabra clave `if` ejecuta o salta una sentencia dependiendo del valor de una expresión booleana. La expresión de decisión se escribe después de la palabra clave, entre paréntesis, seguida de la sentencia a ejecutar.

{{index "función Number.isNaN"}}

La función `Number.isNaN` es una función estándar de JavaScript que devuelve `true` solo si el argumento que se le pasa es `NaN`. La función `Number` devuelve `NaN` cuando le das una cadena que no representa un número válido. Por lo tanto, la condición se traduce a "a menos que `elNumero` no sea un número, haz esto".

{{index "agrupación", "{} (bloque)", [llaves, "bloque"]}}

La sentencia después del `if` está envuelta entre llaves (`{` y `}`) en este ejemplo. Las llaves se pueden usar para agrupar cualquier cantidad de sentencias en una sola sentencia, llamada un _((bloque))_. También podrías haber omitido en este caso, ya que contienen solo una sentencia, pero para evitar tener que pensar si son necesarias, la mayoría de los programadores de JavaScript las usan en cada sentencia envuelta de esta manera. Seguiremos principalmente esa convención en este libro, excepto por los casos ocasionales de una sola línea.

```
if (1 + 1 == 2) console.log("Es verdad");
// → Es verdad
```

{{index "else keyword"}}

A menudo no solo tendrás código que se ejecuta cuando una condición es verdadera, sino también código que maneja el otro caso. Esta ruta alternativa está representada por la segunda flecha en el diagrama. Puedes usar la palabra clave `else`, junto con `if`, para crear dos caminos de ejecución alternativos y separados:

```{test: wrap}
let elNumero = Number(prompt("Elige un número"));
if (!Number.isNaN(elNumero)) {
  console.log("Tu número es la raíz cuadrada de " +
              elNumero * elNumero);
} else {
  console.log("Oye. ¿Por qué no me diste un número?");
}
```

{{index ["if keyword", chaining]}}

Si tienes más de dos caminos para elegir, puedes "encadenar" múltiples pares `if`/`else`. Aquí tienes un ejemplo:

```
let num = Number(prompt("Escoge un número"));

if (num < 10) {
  console.log("Pequeño");
} else if (num < 100) {
  console.log("Mediano");
} else {
  console.log("Grande");
}
```

El programa primero comprueba si `num` es menor que 10. Si lo es, elige esa rama, muestra `"Pequeño"`, y termina. Si no lo es, toma la rama `else`, la cual contiene a su vez otro `if`. Si la segunda condición (`< 100`) se cumple, eso significa que el número es al menos 10 pero menor que 100, y se muestra `"Mediano"`. Si no, se elige la segunda y última rama `else`.

El esquema de este programa se ve más o menos así:

{{figure {url: "img/controlflow-nested-if.svg", alt: "Diagrama que muestra una flecha que se divide en dos, con una de las ramas dividiéndose nuevamente antes de que todas las ramas se unan de nuevo", width: "4cm"}}}

{{id loops}}
## Bucles while y do

Considera un programa que imprime todos los números pares de 0 a 12. Una forma de escribirlo es la siguiente:

```
console.log(0);
console.log(2);
console.log(4);
console.log(6);
console.log(8);
console.log(10);
console.log(12);
```

{{index ["control flow", loop]}}

Eso funciona, pero la idea de escribir un programa es hacer _menos_ trabajo, no más. Si necesitáramos todos los números pares menores que 1,000, este enfoque sería inviable. Lo que necesitamos es una manera de ejecutar un fragmento de código múltiples veces. Esta forma de control de flujo se llama _((bucle))_.

{{figure {url: "img/controlflow-loop.svg", alt: "Diagrama que muestra una flecha que apunta a un punto que tiene una flecha cíclica que regresa a sí mismo y otra flecha que continúa", width: "4cm"}}}

{{index [syntax, statement], "variable de contador"}}

El control de flujo mediante bucles nos permite regresar a algún punto en el programa donde estábamos antes y repetirlo con nuestro estado de programa actual. Si combinamos esto con una variable que cuente, podemos hacer algo como esto:

```
let numero = 0;
while (numero <= 12) {
  console.log(numero);
  numero = numero + 2;
}
// → 0
// → 2
//   … etcétera
```

{{index "while loop", Boolean, [parentheses, statement]}}

Una ((sentencia)) que comienza con la palabra clave `while` crea un bucle. La palabra `while` va seguida de una ((expresión)) entre paréntesis y luego un enunciado, similar a `if`. El bucle sigue ejecutando ese enunciado mientras la expresión produzca un valor que se convierta en `true` al convertirse a Booleano.

{{index [estado, "en enlace"], [enlace, "como estado"]}}

El enlace 'numero' demuestra la forma en que un ((enlace)) puede seguir el progreso de un programa. Cada vez que se repite el bucle, 'numero' obtiene un valor que es 2 más que su valor anterior. Al comienzo de cada repetición, se compara con el número 12 para decidir si el trabajo del programa ha terminado.

{{index "exponenciación"}}

Como ejemplo de algo realmente útil, ahora podemos escribir un programa que calcule y muestre el valor de 2^10^ (2 elevado a la 10ª potencia). Usamos dos enlaces: uno para llevar un seguimiento de nuestro resultado y otro para contar cuántas veces hemos multiplicado este resultado por 2. El bucle comprueba si el segundo enlace ya ha alcanzado 10 y, si no, actualiza ambos enlaces.

```
let result = 1;
let counter = 0;
while (counter < 10) {
  result = result * 2;
  counter = counter + 1;
}
console.log(result);
// → 1024
```

El contador también podría haber comenzado en `1` y haber comprobado si era `<= 10`, pero por razones que se harán evidentes en el [Capítulo ?](data#array_indexing), es buena idea acostumbrarse a contar desde 0.

{{index "** operador"}}

Ten en cuenta que JavaScript también tiene un operador para la potencia (`2 ** 10`), que usarías para calcular esto en un código real, pero eso habría arruinado el ejemplo.

{{index "cuerpo del bucle", "bucle do", ["flujo de control", bucle]}}

Un bucle `do` es una estructura de control similar a un bucle `while`. La única diferencia radica en que un bucle `do` siempre ejecuta su cuerpo al menos una vez, y comienza a probar si debe detenerse solo después de esa primera ejecución. Para reflejar esto, la prueba aparece después del cuerpo del bucle:

```
let tuNombre;
do {
  tuNombre = prompt("¿Quién eres?");
} while (!tuNombre);
console.log("Hola " + tuNombre);
```

{{index [Booleano, "conversión a"], operador "!"}}

Este programa te obligará a ingresar un nombre. Preguntará una y otra vez hasta que obtenga algo que no sea una cadena vacía. Aplicar el operador `!` convertirá un valor al tipo Booleano antes de negarlo, y todas las cadenas excepto `""` se convierten en `true`. Esto significa que el bucle continúa hasta que proporciones un nombre no vacío.

## Sangrado de Código

{{index ["código", "estructura de"], [espacios en blanco, sangrado], "estilo de programación"}}

En los ejemplos, he estado agregando espacios delante de las sentencias que son parte de alguna otra sentencia más grande. Estos espacios no son necesarios: la computadora aceptará el programa perfectamente sin ellos. De hecho, incluso los ((saltos)) de línea en los programas son opcionales. Podrías escribir un programa como una sola línea larga si así lo deseas.

El papel de este ((sangrado)) dentro de los ((bloque))s es hacer que la estructura del código resalte para los lectores humanos. En el código donde se abren nuevos bloques dentro de otros bloques, puede volverse difícil ver dónde termina un bloque y comienza otro. Con un sangrado adecuado, la forma visual de un programa corresponde a la forma de los bloques dentro de él. A mí me gusta usar dos espacios para cada bloque abierto, pero los gustos difieren: algunas personas usan cuatro espacios y otras usan ((caracteres de tabulación)). Lo importante es que cada nuevo bloque agregue la misma cantidad de espacio.

```
if (false != true) {
  console.log("Tiene sentido.");
  if (1 < 2) {
    console.log("No hay sorpresas ahí.");
  }
}
```

La mayoría de los programas de edición (incluido el de este libro) ayudarán automáticamente con la sangría adecuada al escribir nuevas líneas.

## bucles for

{{index [sintaxis, "declaración"], "bucle while", "variable de contador"}}

Muchos bucles siguen el patrón mostrado en los ejemplos de `while`. Primero se crea una variable de "contador" para rastrear el progreso del bucle. Luego viene un bucle `while`, generalmente con una expresión de prueba que verifica si el contador ha alcanzado su valor final. Al final del cuerpo del bucle, el contador se actualiza para rastrear el progreso.

{{index "bucle for", bucle}}

Debido a que este patrón es tan común, JavaScript y lenguajes similares proporcionan una forma ligeramente más corta y completa, el bucle `for`:

```
for (let numero = 0; numero <= 12; numero = numero + 2) {
  console.log(numero);
}
// → 0
// → 2
//   … etcétera
```

{{index ["flujo de control", bucle], estado}}

Este programa es exactamente equivalente al [anterior](program_structure#loops) ejemplo de impresión de números pares. La única diferencia es que todas las ((declaraciones)) relacionadas con el "estado" del bucle están agrupadas después de `for`.

{{index [variable, como estado], ["paréntesis", "declaración"]}}

Los paréntesis después de la palabra clave `for` deben contener dos ((punto y coma)). La parte antes del primer punto y coma _inicializa_ el bucle, generalmente definiendo una variable. La segunda parte es la ((expresión)) que _verifica_ si el bucle debe continuar. La parte final _actualiza_ el estado del bucle después de cada iteración. En la mayoría de los casos, esto es más corto y claro que un `while` tradicional.

{{index "exponenciación"}}

Este es el código que calcula 2^10^ usando `for` en lugar de `while`:

```{test: wrap}
let resultado = 1;
for (let contador = 0; contador < 10; contador = contador + 1) {
  resultado = resultado * 2;
}
console.log(resultado);
// → 1024
```

## Saliendo de un bucle

{{index [bucle, "terminación de"], "palabra clave break"}}

Hacer que la condición del bucle produzca `false` no es la única forma en que un bucle puede terminar. La instrucción `break` tiene el efecto de salir inmediatamente del bucle que la contiene. Su uso se demuestra en el siguiente programa, que encuentra el primer número que es mayor o igual a 20 y divisible por 7:

```
for (let actual = 20; ; actual = actual + 1) {
  if (actual % 7 == 0) {
    console.log(actual);
    break;
  }
}
// → 21
```

{{index "operador de resto", "operador %"}}

Usar el operador de resto (`%`) es una forma sencilla de comprobar si un número es divisible por otro. Si lo es, el resto de su división es cero.

{{index "bucle for"}}

La construcción `for` en el ejemplo no tiene una parte que verifique el final del bucle. Esto significa que el bucle nunca se detendrá a menos que se ejecute la instrucción `break` dentro de él.

Si eliminaras esa declaración `break` o escribieses accidentalmente una condición final que siempre produzca `true`, tu programa quedaría atrapado en un _((bucle infinito))_. Un programa atrapado en un bucle infinito nunca terminará de ejecutarse, lo cual suele ser algo malo.

{{if interactive

Si creas un bucle infinito en uno de los ejemplos en estas páginas, generalmente se te preguntará si deseas detener el script después de unos segundos. Si eso falla, deberás cerrar la pestaña en la que estás trabajando para recuperarte.

if}}

{{index "continue keyword"}}

La palabra clave `continue` es similar a `break` en que influye en el progreso de un bucle. Cuando se encuentra `continue` en el cuerpo de un bucle, el control salta fuera del cuerpo y continúa con la siguiente iteración del bucle.

## Actualización concisa de enlaces

{{index assignment, "+= operator", "-= operator", "/= operator", "*= operator", [state, in binding], "side effect"}}

Especialmente al hacer bucles, un programa a menudo necesita "actualizar" un enlace para que contenga un valor basado en el valor anterior de ese enlace.

```{test: no}
counter = counter + 1;
```

JavaScript proporciona un atajo para esto:

```{test: no}
counter += 1;
```

Atajos similares funcionan para muchos otros operadores, como `result *= 2` para duplicar `result` o `counter -= 1` para contar hacia atrás.

Esto nos permite acortar aún más nuestro ejemplo de contar:

```
for (let number = 0; number <= 12; number += 2) {
  console.log(number);
}
```

{{index "++ operator", "-- operator"}}

Para `counter += 1` y `counter -= 1`, existen equivalentes aún más cortos: `counter++` y `counter--`.

## Despachar un valor con switch

{{index [syntax, statement], "conditional execution", dispatch, ["if keyword", chaining]}}

No es raro que el código luzca así:

```{test: no}
if (x == "valor1") accion1();
else if (x == "valor2") accion2();
else if (x == "valor3") accion3();
else accionPredeterminada();
```

{{index "colon character", "switch keyword"}}

Existe una construcción llamada `switch` que está destinada a expresar dicho "despacho" de una manera más directa. Desafortunadamente, la sintaxis que JavaScript utiliza para esto (heredada de la línea de lenguajes de programación C/Java) es algo incómoda; una cadena de declaraciones `if` puede verse mejor. Aquí hay un ejemplo:

```
switch (prompt("¿Cómo está el clima?")) {
  case "lluvioso":
    console.log("Recuerda llevar un paraguas.");
    break;
  case "soleado":
    console.log("Vístete ligero.");
  case "nublado":
    console.log("Sal al exterior.");
    break;
  default:
    console.log("¡Tipo de clima desconocido!");
    break;
}
```

{{index fallthrough, "break keyword", "case keyword", "default keyword"}}

Puedes colocar cualquier cantidad de etiquetas `case` dentro del bloque abierto por `switch`. El programa comenzará a ejecutarse en la etiqueta que corresponda al valor que se le dio a `switch`, o en `default` si no se encuentra ningún valor coincidente. Continuará ejecutándose, incluso a través de otras etiquetas, hasta que alcance una declaración `break`. En algunos casos, como el caso `"soleado"` en el ejemplo, esto se puede usar para compartir algo de código entre casos (recomienda salir al exterior tanto para el clima soleado como para el nublado). Sin embargo, ten cuidado, es fácil olvidar un `break` de este tipo, lo que hará que el programa ejecute código que no deseas ejecutar.

## Uso de mayúsculas

{{index "capitalización", [binding, nombrar], [espacios en blanco, sintaxis]}}

Los nombres de los enlaces no pueden contener espacios, sin embargo, a menudo es útil usar varias palabras para describir claramente lo que representa el enlace. Estas son básicamente tus opciones para escribir un nombre de enlace con varias palabras:

```{lang: null}
fuzzylittleturtle
fuzzy_little_turtle
FuzzyLittleTurtle
fuzzyLittleTurtle
```

{{index "camel case", "estilo de programación", "carácter de subrayado"}}

El primer estilo puede ser difícil de leer. Personalmente me gusta más la apariencia de los guiones bajos, aunque ese estilo es un poco difícil de escribir. Las funciones estándar de ((JavaScript)) y la mayoría de los programadores de JavaScript siguen el último estilo: escriben con mayúscula cada palabra excepto la primera. No es difícil acostumbrarse a pequeñas cosas como esa, y el código con estilos de nombrado mixtos puede resultar molesto de leer, así que seguimos esta ((convención)).

{{index "Función Número", constructor}}

En algunos casos, como en la función `Number`, la primera letra de un enlace también está en mayúscula. Esto se hizo para marcar esta función como un constructor. Quedará claro lo que es un constructor en el [Capítulo ?](object#constructors). Por ahora, lo importante es no molestarse por esta aparente falta de ((consistencia)).

## Comentarios

{{index legibilidad}}

A menudo, el código sin formato no transmite toda la información que deseas que un programa transmita a los lectores humanos, o lo hace de una manera tan críptica que las personas podrían no entenderlo. En otros momentos, es posible que solo quieras incluir algunos pensamientos relacionados como parte de tu programa. Para eso sirven los _((comentarios))_.

{{index "carácter de barra", "comentario de línea"}}

Un comentario es un fragmento de texto que forma parte de un programa pero que es completamente ignorado por la computadora. JavaScript tiene dos formas de escribir comentarios. Para escribir un comentario de una sola línea, puedes usar dos caracteres de barra (`//`) y luego el texto del comentario después de eso:

```{test: no}
let saldoCuenta = calcularSaldo(cuenta);
// Es un hueco verde donde canta un río
saldoCuenta.ajustar();
// Atrapando locamente pedazos blancos en la hierba.
let informe = new Informe();
// Donde el sol en la orgullosa montaña resuena:
agregarAInforme(saldoCuenta, informe);
// Es un valle pequeño, espumoso como la luz en un vaso.
```

{{index "comentario de bloque"}}

Un comentario con `//` solo va hasta el final de la línea. Una sección de texto entre `/*` y `*/` será ignorada por completo, independientemente de si contiene saltos de línea. Esto es útil para agregar bloques de información sobre un archivo o un fragmento de programa:

```
/*
  Encontré este número por primera vez garabateado en la parte posterior de un viejo
  cuaderno. Desde entonces, a menudo ha aparecido, mostrándose en
  números de teléfono y números de serie de productos que he
  comprado. Obviamente le gusto, así que he decidido quedármelo.
*/
const miNumero = 11213;
```

## Resumen

Ahora sabes que un programa está construido a partir de declaraciones, que a veces contienen más declaraciones. Las declaraciones tienden a contener expresiones, que a su vez pueden estar construidas a partir de expresiones más pequeñas. Poner declaraciones una después de la otra te da un programa que se ejecuta de arriba hacia abajo. Puedes introducir alteraciones en el flujo de control usando declaraciones condicionales (`if`, `else` y `switch`) y bucles (`while`, `do` y `for`).

Los enlaces se pueden usar para guardar fragmentos de datos bajo un nombre, y son útiles para hacer un seguimiento del estado en tu programa. El entorno es el conjunto de enlaces que están definidos. Los sistemas de JavaScript siempre colocan varios enlaces estándar útiles en tu entorno.

Las funciones son valores especiales que encapsulan un fragmento de programa. Puedes invocarlas escribiendo `nombreDeFuncion(argumento1, argumento2)`. Dicha llamada a función es una expresión y puede producir un valor.

## Ejercicios

{{index ejercicios}}

Si no estás seguro de cómo probar tus soluciones a los ejercicios, consulta la [Introducción](intro).

Cada ejercicio comienza con una descripción del problema. Lee esta descripción e intenta resolver el ejercicio. Si encuentras problemas, considera leer las pistas [después del ejercicio]{if interactive}[al [final del libro](hints)]{if book}. Puedes encontrar soluciones completas a los ejercicios en línea en [_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code#2). Si deseas aprender algo de los ejercicios, te recomiendo mirar las soluciones solo después de haber resuelto el ejercicio, o al menos después de haberlo intentado lo suficiente como para tener un ligero dolor de cabeza.

### Haciendo un triángulo con bucles

{{index "triángulo (ejercicio)"}}

Escribe un ((bucle)) que realice siete llamadas a `console.log` para mostrar el siguiente triángulo:

```{lang: null}
#
##
###
####
#####
######
#######
```

{{index [cadena, longitud]}}

Puede ser útil saber que puedes encontrar la longitud de una cadena escribiendo `.length` después de ella.

```
let abc = "abc";
console.log(abc.length);
// → 3
```

{{if interactive

La mayoría de los ejercicios contienen un fragmento de código que puedes modificar para resolver el ejercicio. Recuerda que puedes hacer clic en los bloques de código para editarlos.

```
// Tu código aquí.
```
if}}

{{hint

{{index "triángulo (ejercicio)"}}

Puedes comenzar con un programa que imprime los números del 1 al 7, el cual puedes obtener haciendo algunas modificaciones al ejemplo de impresión de números pares dado anteriormente en el capítulo, donde se introdujo el bucle `for`.

Ahora considera la equivalencia entre los números y las cadenas de caracteres "#" . Puedes pasar de 1 a 2 sumando 1 (`+= 1`). Puedes pasar de `"#"` a `"##"` agregando un carácter (`+= "#"`). Por lo tanto, tu solución puede seguir de cerca el programa de impresión de números.

hint}}

### FizzBuzz

{{index "FizzBuzz (ejercicio)", bucle, "ejecución condicional"}}

Escribe un programa que use `console.log` para imprimir todos los números del 1 al 100, con dos excepciones. Para los números divisibles por 3, imprime `"Fizz"` en lugar del número, y para los números divisibles por 5 (y no por 3), imprime `"Buzz"` en su lugar.

Cuando tengas eso funcionando, modifica tu programa para imprimir `"FizzBuzz"` para los números que son divisibles por 3 y 5 (y sigue imprimiendo `"Fizz"` o `"Buzz"` para los números que son divisibles solo por uno de esos).

(Esto es en realidad una ((pregunta de entrevista)) que se ha afirmado que elimina a un porcentaje significativo de candidatos a programadores. Entonces, si lo resolviste, tu valor en el mercado laboral acaba de aumentar.)

{{if interactive
```
// Tu código aquí.
```
if}}

{{hint

{{index "FizzBuzz (exercise)", "remainder operator", "% operator"}}

Claramente, recorrer los números es un trabajo de bucle, y seleccionar qué imprimir es una cuestión de ejecución condicional. Recuerda el truco de usar el operador de resto (`%`) para verificar si un número es divisible por otro número (tiene un resto de cero).

En la primera versión, hay tres resultados posibles para cada número, por lo que tendrás que crear una cadena `if`/`else if`/`else`.

{{index "|| operator", ["if keyword", chaining]}}

La segunda versión del programa tiene una solución sencilla y una inteligente. La solución simple es agregar otra "rama" condicional para probar exactamente la condición dada. Para la solución inteligente, construye una cadena que contenga la palabra o palabras a imprimir e imprime esta palabra o el número si no hay palabra, potencialmente haciendo un buen uso del operador `||`.

hint}}

### Tablero de ajedrez

Escribe un programa que cree una cadena que represente un tablero de 8x8, usando caracteres de salto de línea para separar las líneas. En cada posición del tablero hay un carácter de espacio o un carácter "#". Los caracteres deben formar un tablero de ajedrez.

Al pasar esta cadena a `console.log` debería mostrar algo como esto:

```{lang: null}
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
 # # # #
# # # # 
```

Cuando tengas un programa que genere este patrón, define una variable `size = 8` y cambia el programa para que funcione para cualquier `size`, generando un tablero con el ancho y alto dados.

{{if interactive
```
// Tu código aquí.
```
if}}

{{hint

Para trabajar con dos dimensiones, necesitarás un bucle dentro de otro bucle. Pon llaves alrededor de los cuerpos de ambos bucles para que sea fácil ver dónde empiezan y terminan. Intenta indentar correctamente estos cuerpos. El orden de los bucles debe seguir el orden en el que construimos la cadena (línea por línea, de izquierda a derecha, de arriba abajo). Entonces el bucle exterior maneja las líneas y el bucle interior maneja los caracteres en una línea.

Necesitarás dos variables para hacer un seguimiento de tu progreso. Para saber si debes colocar un espacio o un signo de hash en una posición determinada, podrías verificar si la suma de los dos contadores es par (`% 2`).

Terminar una línea agregando un carácter de salto de línea debe ocurrir después de que se haya construido la línea, así que hazlo después del bucle interno pero dentro del bucle externo.

hint}}