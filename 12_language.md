{{meta {load_files: ["code/chapter/12_language.js"], zip: "node/html"}}}

# Proyecto: Un Lenguaje de Programación

{{quote {author: "Hal Abelson y Gerald Sussman", title: "Estructura e Interpretación de Programas de Computadora", chapter: true}

El evaluador, que determina el significado de expresiones en un lenguaje de programación, es solo otro programa.

quote}}

{{index "Abelson, Hal", "Sussman, Gerald", SICP, "capítulo del proyecto"}}

{{figure {url: "img/chapter_picture_12.jpg", alt: "Ilustración que muestra un huevo con agujeros, mostrando huevos más pequeños dentro, que a su vez tienen huevos aún más pequeños dentro de ellos, y así sucesivamente", chapter: "framed"}}}

Crear tu propio ((lenguaje de programación)) es sorprendentemente fácil (si no apuntas muy alto) y muy esclarecedor.

Lo principal que quiero mostrar en este capítulo es que no hay ((magia)) involucrada en la construcción de un lenguaje de programación. A menudo he sentido que algunas invenciones humanas eran tan inmensamente inteligentes y complicadas que nunca las entendería. Pero con un poco de lectura y experimentación, a menudo resultan ser bastante mundanas.

{{index "Lenguaje Egg", [abstracción, "en Egg"]}}

Construiremos un lenguaje de programación llamado Egg. Será un lenguaje simple y diminuto, pero lo suficientemente poderoso como para expresar cualquier cálculo que puedas imaginar. Permitirá una simple ((abstracción)) basada en ((funciones)).

{{id parsing}}

## Análisis Sintáctico

{{index parsing, "validación", [sintaxis, "de Egg"]}}

La parte más inmediatamente visible de un lenguaje de programación es su _sintaxis_, o notación. Un _analizador sintáctico_ es un programa que lee un fragmento de texto y produce una estructura de datos que refleja la estructura del programa contenido en ese texto. Si el texto no forma un programa válido, el analizador sintáctico debería señalar el error.

{{index "forma especial", ["función", "aplicación"]}}

Nuestro lenguaje tendrá una sintaxis simple y uniforme. Todo en Egg es una ((expresión)). Una expresión puede ser el nombre de una asignación, un número, una cadena o una _aplicación_. Las aplicaciones se utilizan para llamadas de funciones pero también para estructuras como `if` o `while`.

{{index "carácter de comillas dobles", parsing, [escape, "en cadenas"], [espacio en blanco, sintaxis]}}

Para mantener el analizador sintáctico simple, las cadenas en Egg no admiten nada parecido a los escapes con barra invertida. Una cadena es simplemente una secuencia de caracteres que no son comillas dobles, envueltos entre comillas dobles. Un número es una secuencia de dígitos. Los nombres de las asignaciones pueden consistir en cualquier carácter que no sea espacio en blanco y que no tenga un significado especial en la sintaxis.

{{index "carácter de coma", ["paréntesis", argumentos]}}

Las aplicaciones se escriben de la misma manera que en JavaScript, colocando paréntesis después de una expresión y teniendo cualquier número de ((argumento))s entre esos paréntesis, separados por comas.

```{lang: null}
do(define(x, 10),
   if(>(x, 5),
      print("grande"),
      print("pequeño")))
```

{{index bloque, [sintaxis, "de Egg"]}}

La ((uniformidad)) del ((lenguaje Egg)) significa que las cosas que son ((operador))es en JavaScript (como `>`) son asignaciones normales en este lenguaje, aplicadas de la misma manera que otras ((funciones)). Y dado que la sintaxis no tiene concepto de bloque, necesitamos un constructo `do` para representar la realización de múltiples tareas en secuencia.

{{index "propiedad tipo", "análisis sintáctico", ["estructura de datos", "árbol"]}}

La estructura de datos que el analizador sintáctico utilizará para describir un programa consiste en objetos ((expresión)), cada uno de los cuales tiene una propiedad `type` que indica el tipo de expresión que es y otras propiedades para describir su contenido.

{{index identificador}}

Las expresiones de tipo `"value"` representan cadenas literales o números. Su propiedad `value` contiene el valor de cadena o número que representan. Las expresiones de tipo `"word"` se utilizan para identificadores (nombres). Estos objetos tienen una propiedad `name` que contiene el nombre del identificador como cadena. Finalmente, las expresiones `"apply"` representan aplicaciones. Tienen una propiedad `operator` que se refiere a la expresión que se está aplicando, así como una propiedad `args` que contiene una serie de expresiones de argumento.

La parte `>(x, 5)` del programa anterior se representaría de la siguiente manera:

```{lang: "json"}
{
  type: "apply",
  operator: {type: "word", name: ">"},
  args: [
    {type: "word", name: "x"},
    {type: "value", value: 5}
  ]
}
```

{{indexsee "árbol de sintaxis abstracta", "árbol sintáctico", ["estructura de datos", árbol]}}

Esta estructura de datos se llama un _((árbol de sintaxis))_. Si te imaginas los objetos como puntos y los enlaces entre ellos como líneas entre esos puntos, tiene una forma similar a un ((árbol)). El hecho de que las expresiones contienen otras expresiones, que a su vez pueden contener más expresiones, es similar a la forma en que las ramas de un árbol se dividen y vuelven a dividir.

{{figure {url: "img/syntax_tree.svg", alt: "Un diagrama que muestra la estructura del árbol de sintaxis del programa de ejemplo. La raíz está etiquetada como 'do' y tiene dos hijos, uno etiquetado como 'define' y otro como 'if'. A su vez, estos tienen más hijos que describen su contenido.", width: "5cm"}}}

{{index "análisis" sintáctico}}

Contrasta esto con el analizador que escribimos para el formato de archivo de configuración en [Capítulo ?](regexp#ini), que tenía una estructura simple: dividía la entrada en líneas y manejaba esas líneas una a la vez. Solo había algunas formas simples que una línea podía tener.

{{index "recursión", [anidamiento, "de expresiones"]}}

Aquí debemos encontrar un enfoque diferente. Las expresiones no están separadas en líneas, y tienen una estructura recursiva. Las expresiones de aplicación _contienen_ otras expresiones.

{{index elegancia}}

Afortunadamente, este problema puede resolverse muy bien escribiendo una función de análisis sintáctico que sea recursiva de una manera que refleje la naturaleza recursiva del lenguaje.

{{index "función parseExpression", "árbol de sintaxis"}}

Definimos una función `parseExpression`, que recibe una cadena como entrada y devuelve un objeto que contiene la estructura de datos de la expresión al inicio de la cadena, junto con la parte de la cadena que queda después de analizar esta expresión. Al analizar subexpresiones (el argumento de una aplicación, por ejemplo), esta función puede ser llamada nuevamente, obteniendo la expresión de argumento así como el texto que queda. Este texto a su vez puede contener más argumentos o puede ser el paréntesis de cierre que finaliza la lista de argumentos.Esta es la primera parte del analizador sintáctico:

```{includeCode: true}
function parseExpression(program) {
  program = skipSpace(program);
  let match, expr;
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^[^\s(),#"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
  } else {
    throw new SyntaxError("Sintaxis inesperada: " + program);
  }

  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}
```

{{index "skipSpace function", [whitespace, syntax]}}

Debido a que Egg, al igual que JavaScript, permite cualquier cantidad de espacios en blanco entre sus elementos, debemos cortar repetidamente el espacio en blanco del inicio de la cadena del programa. Eso es para lo que sirve la función `skipSpace`.

{{index "literal expression", "SyntaxError type"}}

Después de omitir cualquier espacio inicial, `parseExpression` utiliza tres ((expresiones regulares)) para detectar los tres elementos atómicos que admite Egg: cadenas, números y palabras. El analizador construye un tipo diferente de estructura de datos dependiendo de cuál de ellos coincida. Si la entrada no coincide con ninguna de estas tres formas, no es una expresión válida y el analizador genera un error. Utilizamos el constructor `SyntaxError` aquí. Esta es una clase de excepción definida por el estándar, al igual que `Error`, pero más específica.

{{index "parseApply function"}}

Luego cortamos la parte que coincidió de la cadena del programa y la pasamos, junto con el objeto de la expresión, a `parseApply`, que verifica si la expresión es una aplicación. Si lo es, analiza una lista de argumentos entre paréntesis.

```{includeCode: true}
function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] != "(") {
    return {expr: expr, rest: program};
  }

  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    let arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",") {
      program = skipSpace(program.slice(1));
    } else if (program[0] != ")") {
      throw new SyntaxError("Se esperaba ',' o ')'");
    }
  }
  return parseApply(expr, program.slice(1));
}
```

{{index parsing}}

Si el próximo carácter en el programa no es un paréntesis de apertura, esto no es una aplicación y `parseApply` devuelve la expresión que se le dio.

{{index recursion}}

De lo contrario, se salta el paréntesis de apertura y crea el objeto ((árbol sintáctico)) para esta expresión de aplicación. Luego llama recursivamente a `parseExpression` para analizar cada argumento hasta encontrar un paréntesis de cierre. La recursión es indirecta, a través de `parseApply` y `parseExpression` llamándose mutuamente.

Dado que una expresión de aplicación puede a su vez ser aplicada (como en `multiplicador(2)(1)`), `parseApply` debe, después de analizar una aplicación, llamarse a sí misma nuevamente para verificar si sigue otro par de paréntesis.

{{index "árbol de sintaxis", "lenguaje Egg", "función de análisis"}}

Esto es todo lo que necesitamos para analizar Egg. Lo envolvemos en una conveniente `parse` función que verifica que ha llegado al final de la cadena de entrada después de analizar la expresión (un programa Egg es una sola expresión), y que nos da la estructura de datos del programa.

```{includeCode: strip_log, test: join}
function parse(program) {
  let {expr, rest} = parseExpression(program);
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Texto inesperado después del programa");
  }
  return expr;
}

console.log(parse("+(a, 10)"));
// → {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}
```

{{index "mensaje de error"}}

¡Funciona! No nos da información muy útil cuando falla y no almacena la línea y la columna en las que comienza cada expresión, lo cual podría ser útil al informar errores más tarde, pero es suficiente para nuestros propósitos.

## El evaluador

{{index "función de evaluación", "evaluación", "interpretación", "árbol de sintaxis", "lenguaje Egg"}}

¿Qué podemos hacer con el árbol de sintaxis de un programa? ¡Ejecutarlo, por supuesto! Y eso es lo que hace el evaluador. Le das un árbol de sintaxis y un objeto de ámbito que asocia nombres con valores, y evaluará la expresión que representa el árbol y devolverá el valor que esto produce.

```{includeCode: true}
const specialForms = Object.create(null);

function evaluate(expr, scope) {
  if (expr.type == "value") {
    return expr.value;
  } else if (expr.type == "word") {
    if (expr.name in scope) {
      return scope[expr.name];
    } else {
      throw new ReferenceError(
        `Vinculación indefinida: ${expr.name}`);
    }
  } else if (expr.type == "apply") {
    let {operator, args} = expr;
    if (operator.type == "word" &&
        operator.name in specialForms) {
      return specialForms[operator.name](expr.args, scope);
    } else {
      let op = evaluate(operator, scope);
      if (typeof op == "function") {
        return op(...args.map(arg => evaluate(arg, scope)));
      } else {
        throw new TypeError("Aplicando una no-función.");
      }
    }
  }
}
```

{{index "expresión literal", "ámbito"}}

El evaluador tiene código para cada uno de los tipos de expresión. Una expresión de valor literal produce su valor. (Por ejemplo, la expresión `100` simplemente se evalúa como el número 100.) Para un enlace, debemos verificar si está realmente definido en el ámbito y, si lo está, obtener el valor del enlace.

{{index ["función", "aplicación"]}}

Las aplicaciones son más complicadas. Si son una ((forma especial)), como `if`, no evaluamos nada y pasamos las expresiones de argumento, junto con el ámbito, a la función que maneja esta forma. Si es una llamada normal, evaluamos el operador, verificamos que sea una función, y la llamamos con los argumentos evaluados.

Usamos valores de función JavaScript simples para representar los valores de función de Egg. Volveremos a esto [más tarde](language#egg_fun), cuando se defina la forma especial llamada `fun`.

{{index legibilidad, "función de evaluación", "recursión", "análisis sintáctico"}}

La estructura recursiva de `evaluate` se asemeja a la estructura similar del analizador sintáctico, y ambos reflejan la estructura del lenguaje en sí. También sería posible combinar el analizador sintáctico y el evaluador en una sola función, y evaluar durante el análisis sintáctico. Pero dividirlos de esta manera hace que el programa sea más claro y flexible.

{{index "Lenguaje Egg", "interpretación"}}

Esto es realmente todo lo que se necesita para interpretar Egg. Es así de simple. Pero sin definir algunas formas especiales y agregar algunos valores útiles al ((entorno)), todavía no puedes hacer mucho con este lenguaje.

## Formas especiales

{{index "forma especial", "objeto specialForms"}}

El objeto `specialForms` se utiliza para definir sintaxis especial en Egg. Asocia palabras con funciones que evalúan dichas formas. Actualmente está vacío. Añadamos `if`.

```{includeCode: true}
specialForms.if = (args, scope) => {
  if (args.length != 3) {
    throw new SyntaxError("Número incorrecto de argumentos para if");
  } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else {
    return evaluate(args[2], scope);
  }
};
```

{{index "ejecución condicional", "operador ternario", "operador ?", "operador condicional"}}

La construcción `if` de Egg espera exactamente tres argumentos. Evaluará el primero, y si el resultado no es el valor `false`, evaluará el segundo. De lo contrario, se evaluará el tercero. Esta forma `if` se asemeja más al operador ternario `?:` de JavaScript que al `if` de JavaScript. Es una expresión, no una declaración, y produce un valor, concretamente, el resultado del segundo o tercer argumento.

{{index Booleano}}

Egg también difiere de JavaScript en cómo maneja el valor de condición para `if`. No tratará cosas como cero o la cadena vacía como falso, solo el valor preciso `false`.

{{index "evaluación de cortocircuito"}}

La razón por la que necesitamos representar `if` como una forma especial, en lugar de una función regular, es que todos los argumentos de las funciones se evalúan antes de llamar a la función, mientras que `if` debe evaluar solo _uno_ de sus segundos o terceros argumentos, dependiendo del valor del primero.

La forma `while` es similar.

```{includeCode: true}
specialForms.while = (args, scope) => {
  if (args.length != 2) {
    throw new SyntaxError("Número incorrecto de argumentos para while");
  }
  while (evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  }

  // Dado que undefined no existe en Egg, devolvemos false,
  // por falta de un resultado significativo.
  return false;
};
```

Otro bloque básico es `do`, que ejecuta todos sus argumentos de arriba abajo. Su valor es el valor producido por el último argumento.

```{includeCode: true}
specialForms.do = (args, scope) => {
  let valor = false;
  for (let arg of args) {
    valor = evaluate(arg, scope);
  }
  return valor;
};
```

{{index ["operador =", "en Egg"], ["vinculación", "en Egg"]}}

Para poder crear vinculaciones y darles nuevos valores, también creamos una forma llamada `define`. Espera una palabra como su primer argumento y una expresión que produzca el valor a asignar a esa palabra como su segundo argumento. Dado que `define`, al igual que todo, es una expresión, debe devolver un valor. Haremos que devuelva el valor que se asignó (como el operador `=` de JavaScript).

```{includeCode: true}
specialForms.define = (args, scope) => {
  if (args.length != 2 || args[0].type != "word") {
    throw new SyntaxError("Uso incorrecto de define");
  }
  let value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
};
```

## El entorno

{{index "Lenguaje Egg", "función evaluate", [binding, "en Egg"]}}

El ((scope)) aceptado por `evaluate` es un objeto con propiedades cuyos nombres corresponden a los nombres de los bindings y cuyos valores corresponden a los valores a los que esos bindings están ligados. Definamos un objeto para representar el ((scope global)).

Para poder usar la construcción `if` que acabamos de definir, necesitamos tener acceso a valores ((Booleanos)). Dado que solo hay dos valores Booleanos, no necesitamos una sintaxis especial para ellos. Simplemente asignamos dos nombres a los valores `true` y `false` y los usamos.

```{includeCode: true}
const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;
```

Ahora podemos evaluar una expresión simple que niega un valor Booleano.

```
let prog = parse(`if(true, false, true)`);
console.log(evaluate(prog, topScope));
// → false
```

{{index "aritmética", "Constructor de funciones"}}

Para suministrar ((operadores)) básicos de ((aritmética)) y ((comparación)), también agregaremos algunas funciones al ((scope)). En aras de mantener el código corto, usaremos `Function` para sintetizar un conjunto de funciones de operadores en un bucle, en lugar de definirlas individualmente.

```{includeCode: true}
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  topScope[op] = Function("a, b", `return a ${op} b;`);
}
```

También es útil tener una forma de ((imprimir)) valores, por lo que envolveremos `console.log` en una función y la llamaremos `print`.

```{includeCode: true}
topScope.print = value => {
  console.log(value);
  return value;
};
```

{{index parsing, "función run"}}

Esto nos proporciona suficientes herramientas elementales para escribir programas simples. La siguiente función proporciona una forma conveniente de analizar un programa y ejecutarlo en un nuevo ámbito:

```{includeCode: true}
function run(program) {
  return evaluate(parse(program), Object.create(topScope));
}
```

{{index "Función Object.create", prototipo}}

Utilizaremos las cadenas de prototipos de objetos para representar ámbitos anidados para que el programa pueda agregar bindings a su ámbito local sin modificar el ámbito de nivel superior.

```
run(`
do(define(total, 0),
   define(count, 1),
   while(<(count, 11),
         do(define(total, +(total, count)),
            define(count, +(count, 1)))),
   print(total))
`);
// → 55
```

{{index "ejemplo de suma", "Lenguaje Egg"}}

Este es el programa que hemos visto varias veces antes, que calcula la suma de los números del 1 al 10, expresado en Egg. Es claramente más feo que el equivalente programa en JavaScript, pero no está mal para un lenguaje implementado en menos de 150 ((líneas de código)).

{{id egg_fun}}

## Funciones

{{index "función", "Lenguaje Egg"}}

Un lenguaje de programación sin funciones es un pobre lenguaje de programación.

Afortunadamente, no es difícil agregar una construcción `fun`, que trata su último argumento como el cuerpo de la función y utiliza todos los argumentos anteriores como los nombres de los parámetros de la función.

```{includeCode: true}
specialForms.fun = (args, scope) => {
  if (!args.length) {
    throw new SyntaxError("Las funciones necesitan un cuerpo");
  }
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map(expr => {
    if (expr.type != "word") {
      throw new SyntaxError("Los nombres de los parámetros deben ser palabras");
    }
    return expr.name;
  });

  return function(...args) {
    if (args.length != params.length) {
      throw new TypeError("Número incorrecto de argumentos");
    }
    let localScope = Object.create(scope);
    for (let i = 0; i < args.length; i++) {
      localScope[params[i]] = args[i];
    }
    return evaluate(body, localScope);
  };
};
```

{{index "ámbito local"}}

Las funciones en Egg tienen su propio ámbito local. La función producida por la forma `fun` crea este ámbito local y añade los enlaces de los argumentos a él. Luego evalúa el cuerpo de la función en este ámbito y devuelve el resultado.

```{startCode: true}
run(`
do(define(plusOne, fun(a, +(a, 1))),
   print(plusOne(10)))
`);
// → 11

run(`
do(define(pow, fun(base, exp,
     if(==(exp, 0),
        1,
        *(base, pow(base, -(exp, 1)))))),
   print(pow(2, 10)))
`);
// → 1024
```

## Compilación

{{index "interpretación", "compilación"}}

Lo que hemos construido es un intérprete. Durante la evaluación, actúa directamente sobre la representación del programa producido por el analizador sintáctico.

{{index eficiencia, rendimiento, [enlace, "definición"], [memoria, velocidad]}}

_La compilación_ es el proceso de agregar otro paso entre el análisis sintáctico y la ejecución de un programa, que transforma el programa en algo que puede ser evaluado de manera más eficiente al hacer la mayor cantidad de trabajo posible por adelantado. Por ejemplo, en lenguajes bien diseñados, es obvio, para cada uso de un enlace, a qué enlace se hace referencia, sin ejecutar realmente el programa. Esto se puede utilizar para evitar buscar el enlace por nombre cada vez que se accede, en su lugar, recuperándolo directamente desde una ubicación de memoria predeterminada.

Tradicionalmente, ((compilar)) implica convertir el programa a ((código máquina)), el formato en bruto que un procesador de computadora puede ejecutar. Pero cualquier proceso que convierta un programa a una representación diferente se puede considerar como compilación.

{{index simplicidad, "Constructor de funciones", "transpilación"}}

Sería posible escribir una estrategia de ((evaluación)) alternativa para Egg, una que primero convierte el programa a un programa JavaScript, usa `Function` para invocar el compilador de JavaScript en él, y luego ejecuta el resultado. Cuando se hace correctamente, esto haría que Egg se ejecutara muy rápido y aún así fuera bastante simple de implementar.

Si te interesa este tema y estás dispuesto a dedicar tiempo a ello, te animo a intentar implementar ese compilador como ejercicio.

## Haciendo trampa

{{index "lenguaje Egg"}}

Cuando definimos `if` y `while`, probablemente notaste que eran envoltorios más o menos triviales alrededor del propio `if` y `while` de JavaScript. De manera similar, los valores en Egg son simplemente valores regulares de JavaScript. Cerrar la brecha hacia un sistema más primitivo, como el código máquina que entiende el procesador, requiere más esfuerzo, pero la forma en que funciona se asemeja a lo que estamos haciendo aquí.Aunque el lenguaje de juguete de este capítulo no hace nada que no se pudiera hacer mejor en JavaScript, _sí_ hay situaciones donde escribir pequeños lenguajes ayuda a realizar trabajos reales.

Tal lenguaje no tiene por qué parecerse a un lenguaje de programación típico. Si JavaScript no viniera equipado con expresiones regulares, por ejemplo, podrías escribir tu propio analizador sintáctico y evaluador para expresiones regulares.

{{index "generador de analizadores sintácticos"}}

O imagina que estás construyendo un programa que permite crear rápidamente analizadores sintácticos al proporcionar una descripción lógica del lenguaje que necesitan analizar. Podrías definir una notación específica para eso y un compilador que la convierta en un programa analizador.

```{lang: null}
expr = número | cadena | nombre | aplicación

number = dígito+

name = letra+

string = '"' (! '"')* '"'

application = expr '(' (expr (',' expr)*)? ')'
```

{{index expresividad}}

Esto es lo que comúnmente se denomina un _((lenguaje específico de dominio))_, un lenguaje diseñado para expresar un ámbito estrecho de conocimiento. Tal lenguaje puede ser más expresivo que un lenguaje de propósito general porque está diseñado para describir exactamente las cosas que necesitan ser descritas en su dominio, y nada más.

## Ejercicios

### Arrays

{{index "Lenguaje Egg", "arrays en Egg (ejercicio)", [array, "en Egg"]}}

Agrega soporte para arrays en Egg añadiendo las siguientes tres funciones al ámbito superior: `array(...valores)` para construir un array que contenga los valores de los argumentos, `length(array)` para obtener la longitud de un array y `element(array, n)` para obtener el n-ésimo elemento de un array.

{{if interactive

```{test: no}
// Modifica estas definiciones...

topScope.array = "...";

topScope.length = "...";

topScope.element = "...";

run(`
do(define(sum, fun(array,
     do(define(i, 0),
        define(sum, 0),
        while(<(i, length(array)),
          do(define(sum, +(sum, element(array, i))),
             define(i, +(i, 1)))),
        sum))),
   print(sum(array(1, 2, 3))))
`);
// → 6
```

if}}

{{hint

{{index "arrays en Egg (ejercicio)"}}

La forma más sencilla de hacer esto es representar los arrays de Egg con arrays de JavaScript.

{{index "método slice"}}

Los valores añadidos al ámbito superior deben ser funciones. Al usar un argumento restante (con la notación de triple punto), la definición de `array` puede ser _muy_ simple.

hint}}

### Clausura

{{index closure, ["función", "ámbito"], "clausura en Egg (ejercicio)"}}

La forma en que hemos definido `fun` permite que las funciones en Egg hagan referencia al ámbito circundante, lo que permite que el cuerpo de la función use valores locales que eran visibles en el momento en que se definió la función, al igual que lo hacen las funciones de JavaScript.

El siguiente programa ilustra esto: la función `f` devuelve una función que suma su argumento al argumento de `f`, lo que significa que necesita acceder al ((ámbito)) local dentro de `f` para poder usar la vinculación `a`.

```
run(`
do(define(f, fun(a, fun(b, +(a, b)))),
   print(f(4)(5)))
`);
// → 9
```

Vuelve a la definición del formulario `fun` y explica qué mecanismo hace que esto funcione.

{{hint

{{index cierre, "cierre en Egg (ejercicio)"}}

Una vez más, estamos montando un mecanismo en JavaScript para obtener la característica equivalente en Egg. Los formularios especiales reciben el ámbito local en el que se evalúan para que puedan evaluar sus subformas en ese ámbito. La función devuelta por `fun` tiene acceso al argumento `scope` dado a su función contenedora y lo utiliza para crear el ámbito ((local)) de la función cuando se llama.

{{index compilación}}

Esto significa que el ((prototipo)) del ámbito local será el ámbito en el cual la función fue creada, lo que hace posible acceder a los enlaces en ese ámbito desde la función. Esto es todo lo que se necesita para implementar el cierre (aunque para compilarlo de una manera realmente eficiente, sería necesario hacer un poco más de trabajo).

hint}}

### Comentarios

{{index "carácter de almohadilla", "lenguaje Egg", "comentarios en Egg (ejercicio)"}}

Sería bueno si pudiéramos escribir ((comentario))s en Egg. Por ejemplo, siempre que encontremos un signo de almohadilla (`#`), podríamos tratar el resto de la línea como un comentario y ignorarlo, similar a `//` en JavaScript.

{{index "función skipSpace"}}

No tenemos que hacer grandes cambios en el analizador para admitir esto. Simplemente podemos cambiar `skipSpace` para omitir comentarios como si fueran ((espacios en blanco)) de manera que todos los puntos donde se llama a `skipSpace` ahora también omitirán comentarios. Realiza este cambio.

{{if interactive

```{test: no}
// Este es el skipSpace antiguo. Modifícalo...
function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}

console.log(parse("# hola\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # uno\n   # dos\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}
```
if}}

{{hint

{{index "comentarios en Egg (ejercicio)", [espacio en blanco, sintaxis]}}

Asegúrate de que tu solución maneje múltiples comentarios seguidos, con posiblemente espacios en blanco entre ellos o después de ellos.

Una ((expresión regular)) es probablemente la forma más sencilla de resolver esto. Escribe algo que coincida con "espacio en blanco o un comentario, cero o más veces". Utiliza el método `exec` o `match` y observa la longitud del primer elemento en la matriz devuelta (la coincidencia completa) para averiguar cuántos caracteres cortar.

hint}}

### Corrigiendo el ámbito

{{index [enlace, "definición"], "asignación", "corrección de ámbito (ejercicio)"}}

Actualmente, la única forma de asignar un enlace un valor es `define`. Esta construcción actúa como una forma tanto de definir nuevos enlaces como de dar un nuevo valor a los existentes.

{{index "enlace local"}}

Esta ((ambigüedad)) causa un problema. Cuando intentas darle un nuevo valor a un enlace no local, terminarás definiendo uno local con el mismo nombre en su lugar. Algunos lenguajes funcionan de esta manera por diseño, pero siempre he encontrado que es una forma incómoda de manejar el ((ámbito)).

{{index "tipo Error de Referencia"}}

Agrega una forma especial `set`, similar a `define`, que da un nuevo valor a un enlace, actualizando el enlace en un ámbito exterior si aún no existe en el ámbito interior. Si el enlace no está definido en absoluto, lanza un `ReferenceError` (otro tipo de error estándar).

{{index "hasOwn function", prototype, "getPrototypeOf function"}}

La técnica de representar los ámbitos como objetos simples, que hasta ahora ha sido conveniente, te causará un pequeño problema en este punto. Es posible que desees usar la función `Object.getPrototypeOf`, la cual devuelve el prototipo de un objeto. También recuerda que puedes utilizar `Object.hasOwn` para verificar si un objeto dado tiene una propiedad.

{{if interactive

```{test: no}
specialForms.set = (args, scope) => {
  // Tu código aquí.
};

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
// → 50
run(`set(quux, true)`);
// → Algún tipo de ReferenceError
```
if}}

{{hint

{{index [binding, "compilation of"], assignment, "getPrototypeOf function", "hasOwn function", "fixing scope (exercise)"}}

Tendrás que iterar a través de un ((scope)) a la vez, utilizando `Object.getPrototypeOf` para ir al siguiente ámbito exterior. Para cada ámbito, utiliza `Object.hasOwn` para determinar si el enlace, indicado por la propiedad `name` del primer argumento de `set`, existe en ese ámbito. Si existe, establécelo en el resultado de evaluar el segundo argumento de `set` y luego devuelve ese valor.

{{index "global scope", "run-time error"}}

Si se alcanza el ámbito más externo (`Object.getPrototypeOf` devuelve null) y aún no hemos encontrado el enlace, significa que no existe y se debe lanzar un error.

hint}}