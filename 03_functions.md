# Funciones

{{quote {author: "Donald Knuth", chapter: true}

La gente piensa que la informática es el arte de los genios, pero la realidad actual es la opuesta, simplemente muchas personas haciendo cosas que se construyen unas sobre otras, como un muro de mini piedras.

quote}}

{{index "Knuth, Donald"}}

{{figure {url: "img/chapter_picture_3.jpg", alt: "Ilustración de hojas de helecho con una forma fractal, abejas en el fondo", chapter: framed}}}

{{index function, [code, "estructura de"]}}

Las funciones son una de las herramientas más centrales en la programación en JavaScript. El concepto de envolver un fragmento de programa en un valor tiene muchos usos. Nos proporciona una manera de estructurar programas más grandes, de reducir la repetición, de asociar nombres con subprogramas y de aislar estos subprogramas entre sí.

La aplicación más evidente de las funciones es definir nuevos ((vocabulario)). Crear nuevas palabras en prosa suele ser de mal estilo, pero en la programación es indispensable.

{{index "abstracción", vocabulario}}

Los hablantes de inglés adultos típicos tienen alrededor de 20,000 palabras en su vocabulario. Pocas lenguajes de programación vienen con 20,000 comandos incorporados. Y el vocabulario que _está_ disponible tiende a estar más precisamente definido, y por lo tanto menos flexible, que en el lenguaje humano. Por lo tanto, _tenemos_ que introducir nuevas palabras para evitar la verbosidad excesiva.

## Definir una función

{{index "ejemplo de cuadrado", [función, "definición"], [vinculación, "definición"]}}

Una definición de función es una vinculación regular donde el valor de la vinculación es una función. Por ejemplo, este código define `square` para que se refiera a una función que produce el cuadrado de un número dado:

```
const square = function(x) {
  return x * x;
};

console.log(square(12));
// → 144
```

{{indexsee "llaves", corchetes}}
{{index [corchetes, "cuerpo de la "función""], bloque, [sintaxis, "función"], "palabra clave de "función"", ["función", cuerpo], ["función", "como valor"], [paréntesis, argumentos]}}

Una función se crea con una expresión que comienza con la palabra clave `function`. Las funciones tienen un conjunto de _((parámetro))s_ (en este caso, solo `x`) y un _cuerpo_, que contiene las declaraciones que se ejecutarán cuando se llame a la función. El cuerpo de una función creada de esta manera siempre debe estar envuelto entre llaves, incluso cuando consiste en una única ((declaración)).

{{index "ejemplo de roundTo"}}

Una función puede tener varios parámetros o ninguno en absoluto. En el siguiente ejemplo, `makeNoise` no enumera nombres de parámetros, mientras que `roundTo` (que redondea `n` al múltiplo más cercano de `step`) enumera dos:

```
const makeNoise = function() {
  console.log("¡Pling!");
};

makeNoise();
// → ¡Pling!

const roundTo = function(n, step) {
  let resto = n % step;
  return n - resto + (resto < step / 2 ? 0 : step);
};

console.log(roundTo(23, 10));
// → 20
```

{{index "valor de retorno", "palabra clave de retorno", indefinido}}

Algunas funciones, como `roundTo` y `square`, producen un valor, y otras no, como `makeNoise`, cuyo único resultado es un ((efecto secundario)). Una instrucción `return` determina el valor que devuelve la función. Cuando el control llega a una instrucción de ese tipo, salta inmediatamente fuera de la función actual y le da el valor devuelto al código que llamó a la función. Una palabra clave `return` sin una expresión después de ella hará que la función devuelva `undefined`. Las funciones que no tienen ninguna instrucción `return` en absoluto, como `makeNoise`, devuelven igualmente `undefined`.

{{index "parámetro", [función, "aplicación"], [ligadura, "desde parámetro"]}}

Los parámetros de una función se comportan como ligaduras regulares, pero sus valores iniciales son dados por el _llamador_ de la función, no por el código en la función en sí misma.

## Ligaduras y ámbitos

{{indexsee "ámbito de nivel superior", "ámbito global"}}
{{index "palabra clave var", "ámbito global", [ligadura, global], [ligadura, "ámbito de"]}}

Cada ligadura tiene un _((ámbito))_, que es la parte del programa en la que la ligadura es visible. Para las ligaduras definidas fuera de cualquier función, bloque o módulo (ver [Capítulo ?](módulos)), el ámbito es todo el programa—puedes hacer referencia a esas ligaduras donde quieras. Estas se llaman _globales_.

{{index "ámbito local", [ligadura, local]}}

Las ligaduras creadas para los parámetros de una función o declaradas dentro de una función solo pueden ser referenciadas en esa función, por lo que se conocen como ligaduras _locales_. Cada vez que se llama a la función, se crean nuevas instancias de estas ligaduras. Esto proporciona cierto aislamiento entre funciones—cada llamada a función actúa en su propio pequeño mundo (su entorno local) y a menudo se puede entender sin saber mucho sobre lo que está sucediendo en el entorno global.

{{index "palabra clave let", "palabra clave const", "palabra clave var"}}

Las ligaduras declaradas con `let` y `const` en realidad son locales al _((bloque))_ en el que se declaran, por lo que si creas una de esas dentro de un bucle, el código antes y después del bucle no puede "verla". En JavaScript anterior a 2015, solo las funciones creaban nuevos ámbitos, por lo que las ligaduras de estilo antiguo, creadas con la palabra clave `var`, son visibles en toda la función en la que aparecen—o en todo el ámbito global, si no están dentro de una función.

```
let x = 10;   // global
if (true) {
  let y = 20; // local al bloque
  var z = 30; // también global
}
```

{{index [ligadura, visibilidad]}}

Cada ((ámbito)) puede "mirar hacia afuera" al ámbito que lo rodea, por lo que `x` es visible dentro del bloque en el ejemplo. La excepción es cuando múltiples ligaduras tienen el mismo nombre—en ese caso, el código solo puede ver la más interna. Por ejemplo, cuando el código dentro de la función `halve` hace referencia a `n`, está viendo su _propio_ `n`, no el `n` global.

```
const halve = function(n) {
  return n / 2;
};

let n = 10;
console.log(halve(100));
// → 50
console.log(n);
// → 10
```

{{id alcance}}

## Ámbito anidado

{{index [anidamiento, "de funciones"], [anidamiento, "de ámbito"], "ámbito", "función interna", "ámbito léxico"}}

JavaScript distingue no solo entre ligaduras globales y locales. Bloques y funciones pueden ser creados dentro de otros bloques y funciones, produciendo múltiples grados de localidad.

{{index "ejemplo de paisaje"}}

Por ejemplo, esta función—que muestra los ingredientes necesarios para hacer un lote de hummus—tiene otra función dentro de ella:

```
const hummus = function(factor) {
  const ingredient = function(amount, unit, name) {
    let ingredientAmount = amount * factor;
    if (ingredientAmount > 1) {
      unit += "s";
    }
    console.log(`${ingredientAmount} ${unit} ${name}`);
  };
  ingredient(1, "lata", "garbanzos");
  ingredient(0.25, "taza", "tahini");
  ingredient(0.25, "taza", "jugo de limón");
  ingredient(1, "diente", "ajo");
  ingredient(2, "cucharada", "aceite de oliva");
  ingredient(0.5, "cucharadita", "comino");
};
```

{{index [función, alcance], alcance}}

El código dentro de la función `ingredient` puede ver el enlace `factor` desde la función exterior, pero sus enlaces locales, como `unit` o `ingredientAmount`, no son visibles en la función exterior.

El conjunto de enlaces visibles dentro de un bloque está determinado por el lugar de ese bloque en el texto del programa. Cada bloque local también puede ver todos los bloques locales que lo contienen, y todos los bloques pueden ver el bloque global. Este enfoque de visibilidad de enlaces se llama _((lexicografía))_.

## Funciones como valores

{{index [función, "como valor"], [enlace, definición]}}

Un enlace de función generalmente simplemente actúa como un nombre para una parte específica del programa. Este enlace se define una vez y nunca se cambia. Esto hace que sea fácil confundir la función y su nombre.

{{index [enlace, asignación]}}

Pero los dos son diferentes. Un valor de función puede hacer todas las cosas que pueden hacer otros valores: se puede utilizar en expresiones arbitrarias, no solo llamarlo. Es posible almacenar un valor de función en un nuevo enlace, pasarlo como argumento a una función, etc. De manera similar, un enlace que contiene una función sigue siendo solo un enlace regular y, si no es constante, se le puede asignar un nuevo valor, así:

```{test: no}
let launchMissiles = function() {
  missileSystem.launch("now");
};
if (safeMode) {
  launchMissiles = function() {/* no hacer nada */};
}
```

{{index [función, "de orden superior"]}}

En [Capítulo ?](higher_order), discutiremos las cosas interesantes que podemos hacer al pasar valores de función a otras funciones.

## Notación de declaración

{{index [sintaxis, "función"], "palabra clave función", "ejemplo cuadrado", ["función", "definición"], ["función", "declaración"]}}

Hay una manera ligeramente más corta de crear un enlace de función. Cuando se utiliza la palabra clave `function` al inicio de una declaración, funciona de manera diferente:

```{test: wrap}
function square(x) {
  return x * x;
}
```

{{index futura, "orden de ejecución"}}

Esta es una función _declarativa_. La declaración define el enlace `square` y lo apunta a la función dada. Es un poco más fácil de escribir y no requiere un punto y coma después de la función.

Hay una sutileza con esta forma de definición de función.

```
console.log("El futuro dice:", future());

function future() {
  return "Nunca tendrás autos voladores";
}
```

El código anterior funciona, incluso aunque la función esté definida _debajo_ del código que la usa. Las declaraciones de función no forman parte del flujo de control regular de arriba hacia abajo. Conceptualmente se mueven al principio de su alcance y pueden ser utilizadas por todo el código en ese alcance. A veces esto es útil porque ofrece la libertad de ordenar el código de una manera que parezca más clara, sin tener que preocuparse por definir todas las funciones antes de que se utilicen.

## Funciones de flecha

{{index "función", "función de flecha"}}

Hay una tercera notación para funciones, que se ve muy diferente de las otras. En lugar de la palabra clave `function`, utiliza una flecha (`=>`) compuesta por un signo igual y un caracter mayor que (no confundir con el operador mayor o igual, que se escribe `>=`):

```{test: wrap}
const roundTo = (n, step) => {
  let remainder = n % step;
  return n - remainder + (remainder < step / 2 ? 0 : step);
};
```

{{index [function, body]}}

La flecha viene _después_ de la lista de parámetros y es seguida por el cuerpo de la función. Expresa algo así como "esta entrada (los ((parámetros))s) produce este resultado (el cuerpo)".

{{index [braces, "function body"], "ejemplo de exponente", [paréntesis, argumentos]}}

Cuando solo hay un nombre de parámetro, puedes omitir los paréntesis alrededor de la lista de parámetros. Si el cuerpo es una sola expresión, en lugar de un ((bloque)) entre llaves, esa expresión será devuelta por la función. Por lo tanto, estas dos definiciones de `exponente` hacen lo mismo:

```
const exponente1 = (x) => { return x * x; };
const exponente2 = x => x * x;
```

{{index [paréntesis, argumentos]}}

Cuando una función de flecha no tiene parámetros en absoluto, su lista de parámetros es simplemente un conjunto vacío de paréntesis.

```
const cuerno = () => {
  console.log("Toot");
};
```

{{index verbosidad}}

No hay una razón profunda para tener tanto funciones de flecha como expresiones `function` en el lenguaje. Aparte de un detalle menor, que discutiremos en el [Capítulo ?](objeto), hacen lo mismo. Las funciones de flecha se agregaron en 2015, principalmente para hacer posible escribir expresiones de función pequeñas de una manera menos verbosa. Las usaremos a menudo en [Capítulo ?](orden superior).

{{id pila}}

## La pila de llamadas

{{indexsee pila, "pila de llamadas"}}
{{index "pila de llamadas", [función, aplicación]}}

La forma en que el control fluye a través de las funciones es un tanto complicada. Echemos un vistazo más de cerca. Aquí hay un programa simple que realiza algunas llamadas de función:

```
function saludar(quién) {
  console.log("Hola " + quién);
}
saludar("Harry");
console.log("Adiós");
```

{{index ["flujo de control", funciones], "orden de ejecución", "console.log"}}

Una ejecución de este programa va más o menos así: la llamada a `saludar` hace que el control salte al inicio de esa función (línea 2). La función llama a `console.log`, que toma el control, hace su trabajo, y luego devuelve el control a la línea 2. Allí, llega al final de la función `saludar`, por lo que regresa al lugar que la llamó, línea 4. La línea siguiente llama a `console.log` nuevamente. Después de ese retorno, el programa llega a su fin.

Podríamos mostrar el flujo de control esquemáticamente de esta manera:

```{lang: null}
no en función
   en saludar
        en console.log
   en saludar
no en función
   en console.log
no en función
```

{{index "palabra clave return", [memoria, pila de llamadas]}}

Dado que una función tiene que regresar al lugar que la llamó cuando termina, la computadora debe recordar el contexto desde el cual se realizó la llamada. En un caso, `console.log` tiene que regresar a la función `saludar` cuando haya terminado. En el otro caso, regresa al final del programa.

El lugar donde la computadora almacena este contexto es la _((pila de llamadas))_. Cada vez que se llama a una función, el contexto actual se almacena en la parte superior de esta pila. Cuando una función devuelve, elimina el contexto superior de la pila y usa ese contexto para continuar la ejecución.

{{index "bucle infinito", "desbordamiento de pila", "recursión"}}

Almacenar esta pila requiere espacio en la memoria de la computadora. Cuando la pila crece demasiado, la computadora fallará con un mensaje como "sin espacio en la pila" o "demasiada recursividad". El siguiente código ilustra esto al hacerle a la computadora una pregunta realmente difícil que causa un vaivén infinito entre dos funciones. O más bien, _sería_ infinito, si la computadora tuviera una pila infinita. Como no la tiene, nos quedaremos sin espacio o "reventaremos la pila".

```{test: no}
function chicken() {
  return egg();
}
function egg() {
  return chicken();
}
console.log(chicken() + " salió primero.");
// → ??
```

## Argumentos Opcionales

{{index argumento, [función, aplicación]}}

El siguiente código está permitido y se ejecuta sin ningún problema:

```
function square(x) { return x * x; }
console.log(square(4, true, "erizo"));
// → 16
```

Hemos definido `square` con solo un ((parámetro)). Sin embargo, cuando lo llamamos con tres, el lenguaje no se queja. Ignora los argumentos adicionales y calcula el cuadrado del primero.

{{index indefinido}}

JavaScript es extremadamente flexible en cuanto al número de argumentos que puedes pasar a una función. Si pasas demasiados, los extras son ignorados. Si pasas muy pocos, los parámetros faltantes se les asigna el valor `undefined`.

El inconveniente de esto es que es posible —incluso probable— que pases accidentalmente el número incorrecto de argumentos a las funciones. Y nadie te dirá nada al respecto. La ventaja es que puedes utilizar este comportamiento para permitir que una función sea llamada con diferentes números de argumentos. Por ejemplo, esta función `minus` intenta imitar al operador `-` actuando sobre uno o dos argumentos:

```
function minus(a, b) {
  if (b === undefined) return -a;
  else return a - b;
}

console.log(minus(10));
// → -10
console.log(minus(10, 5));
// → 5
```

{{id roundTo}}
{{index "argumento opcional", "valor por defecto", "parámetro", ["operador =", "para valor por defecto"], "ejemplo de redondeo"}}

Si escribes un operador `=` después de un parámetro, seguido de una expresión, el valor de esa expresión reemplazará al argumento cuando no se le dé. Por ejemplo, esta versión de `roundTo` hace que su segundo argumento sea opcional. Si no lo proporcionas o pasas el valor `undefined`, por defecto será uno:

```{test: wrap}
function roundTo(n, step = 1) {
  let remainder = n % step;
  return n - remainder + (remainder < step / 2 ? 0 : step);
};

console.log(roundTo(4.5));
// → 5
console.log(roundTo(4.5, 2));
// → 4
```

{{index "console.log"}}

[El próximo capítulo](datos#rest_parameters) introducirá una forma en que un cuerpo de función puede acceder a la lista completa de argumentos que se le pasaron. Esto es útil porque le permite a una función aceptar cualquier número de argumentos. Por ejemplo, `console.log` lo hace, mostrando todos los valores que se le dan:

```
console.log("C", "O", 2);
// → C O 2
```

## Clausura

{{index "pila de llamadas", "vinculación local", [función, "como valor"], alcance}}

La capacidad de tratar las funciones como valores, combinada con el hecho de que las vinculaciones locales se recrean cada vez que se llama a una función, plantea una pregunta interesante: ¿qué sucede con las vinculaciones locales cuando la llamada a la función que las creó ya no está activa?El siguiente código muestra un ejemplo de esto. Define una función, `wrapValue`, que crea un enlace local. Luego devuelve una función que accede y devuelve este enlace local:

```
function wrapValue(n) {
  let local = n;
  return () => local;
}

let wrap1 = wrapValue(1);
let wrap2 = wrapValue(2);
console.log(wrap1());
// → 1
console.log(wrap2());
// → 2
```

Esto está permitido y funciona como esperarías: ambas instancias del enlace aún pueden accederse. Esta situación es una buena demostración de que los enlaces locales se crean nuevamente para cada llamada, y las diferentes llamadas no afectan los enlaces locales de los demás.

Esta característica, poder hacer referencia a una instancia específica de un enlace local en un ámbito superior, se llama _((clausura))_. Una función que hace referencia a enlaces de ámbitos locales a su alrededor se llama _una_ clausura. Este comportamiento no solo te libera de tener que preocuparte por la vida útil de los enlaces, sino que también hace posible usar valores de función de formas creativas.

{{index "función de multiplicador"}}

Con un ligero cambio, podemos convertir el ejemplo anterior en una forma de crear funciones que multiplican por una cantidad arbitraria:

```
function multiplier(factor) {
  return number => number * factor;
}

let twice = multiplier(2);
console.log(twice(5));
// → 10
```

{{index [enlace, "desde parámetro"]}}

El enlace explícito `local` del ejemplo `wrapValue` realmente no es necesario, ya que un parámetro es en sí mismo un enlace local.

{{index [función, "modelo de"]}}

Pensar en programas de esta manera requiere algo de práctica. Un buen modelo mental es pensar en los valores de función como que contienen tanto el código en su cuerpo como el entorno en el que fueron creados. Cuando se llama, el cuerpo de la función ve el entorno en el que fue creado, no el entorno en el que se llama.

En el ejemplo anterior, se llama a `multiplier` y crea un entorno en el que su parámetro `factor` está vinculado a 2. El valor de función que devuelve, que se almacena en `twice`, recuerda este entorno para que cuando se llame, multiplique su argumento por 2.

## Recursión

{{index "ejemplo de potencia", "desbordamiento de pila", "recursión", [función, aplicación]}}

Es perfectamente válido que una función se llame a sí misma, siempre y cuando no lo haga tan a menudo que desborde la pila. Una función que se llama a sí misma se llama _recursiva_. La recursión permite que algunas funciones se escriban de una manera diferente. Toma, por ejemplo, esta función `power`, que hace lo mismo que el operador `**` (exponenciación):

```{test: wrap}
function power(base, exponent) {
  if (exponent == 0) {
    return 1;
  } else {
    return base * power(base, exponent - 1);
  }
}

console.log(power(2, 3));
// → 8
```

{{index ciclo, legibilidad, matemáticas}}

Esto se asemeja bastante a la forma en que los matemáticos definen la exponenciación y describe el concepto de manera más clara que el bucle que usamos en [Capítulo ?](estructura_programación). La función se llama a sí misma varias veces con exponentes cada vez más pequeños para lograr la multiplicación repetida.

{{index [función, "aplicación"], eficiencia}}

Sin embargo, esta implementación tiene un problema: en implementaciones típicas de JavaScript, es aproximadamente tres veces más lenta que una versión que utiliza un `for` loop. Recorrer un simple bucle suele ser más económico que llamar a una función múltiples veces.

{{index optimización}}

El dilema de velocidad versus ((elegancia)) es interesante. Se puede ver como una especie de continuo entre amigabilidad humana y amigabilidad de máquina. Casi cualquier programa puede ser acelerado haciendo que sea más extenso y complicado. El programador debe encontrar un equilibrio apropiado.

En el caso de la función `potencia`, una versión poco elegante (con bucles) sigue siendo bastante simple y fácil de leer. No tiene mucho sentido reemplazarla con una función recursiva. Sin embargo, a menudo un programa trata con conceptos tan complejos que renunciar a algo de eficiencia para hacer que el programa sea más directo es útil.

{{index perfilado}}

Preocuparse por la eficiencia puede ser una distracción. Es otro factor que complica el diseño del programa y cuando estás haciendo algo que ya es difícil, ese extra en lo que preocuparse puede llegar a ser paralizante.

{{index "optimización prematura"}}

Por lo tanto, generalmente deberías comenzar escribiendo algo que sea correcto y fácil de entender. Si te preocupa que sea demasiado lento—lo cual suele ser raro, ya que la mayoría del código simplemente no se ejecuta lo suficiente como para tomar una cantidad significativa de tiempo—puedes medir después y mejorarlo si es necesario.

{{index "recursión de ramificación"}}

La recursión no siempre es simplemente una alternativa ineficiente a los bucles. Algunos problemas realmente son más fáciles de resolver con recursión que con bucles. Con mayor frecuencia, estos son problemas que requieren explorar o procesar varias "ramas", cada una de las cuales podría ramificarse nuevamente en aún más ramas.

{{id rompecabezas_recursivo}}
{{index "recursión", "ejemplo de rompecabezas numérico"}}

Considera este rompecabezas: al comenzar desde el número 1 y repetidamente sumar 5 o multiplicar por 3, se puede producir un conjunto infinito de números. ¿Cómo escribirías una función que, dado un número, intente encontrar una secuencia de tales sumas y multiplicaciones que produzcan ese número? Por ejemplo, el número 13 podría alcanzarse al multiplicar por 3 y luego sumar 5 dos veces, mientras que el número 15 no podría alcanzarse en absoluto.

Aquí tienes una solución recursiva:

```
function findSolution(objetivo) {
  function find(actual, historial) {
    if (actual === objetivo) {
      return historial;
    } else if (actual > objetivo) {
      return null;
    } else {
      return find(actual + 5, `(${historial} + 5)`) ??
             find(actual * 3, `(${historial} * 3)`);
    }
  }
  return find(1, "1");
}

console.log(findSolution(24));
// → (((1 * 3) + 5) * 3)
```

Ten en cuenta que este programa no necesariamente encuentra la secuencia de operaciones más _corta_. Se conforma con encontrar cualquier secuencia en absoluto.

No te preocupes si no ves cómo funciona este código de inmediato. Vamos a trabajar juntos, ya que es un gran ejercicio de pensamiento recursivo.La función interna `find` es la que realiza la recursión real. Toma dos argumentos: el número actual y una cadena que registra cómo llegamos a este número. Si encuentra una solución, devuelve una cadena que muestra cómo llegar al objetivo. Si no puede encontrar una solución comenzando desde este número, devuelve `null`.

{{index null, "operador ??", "evaluación de circuito corto"}}

Para hacer esto, la función realiza una de tres acciones. Si el número actual es el número objetivo, el historial actual es una forma de alcanzar ese objetivo, por lo que se devuelve. Si el número actual es mayor que el objetivo, no tiene sentido explorar más esta rama porque tanto la suma como la multiplicación solo harán que el número sea más grande, por lo que devuelve `null`. Finalmente, si aún estamos por debajo del número objetivo, la función prueba ambas rutas posibles que parten del número actual llamándose a sí misma dos veces, una vez para la suma y otra vez para la multiplicación. Si la primera llamada devuelve algo que no es `null`, se devuelve. De lo contrario, se devuelve la segunda llamada, independientemente de si produce una cadena o `null`.

{{index "pila de llamadas"}}

Para entender mejor cómo esta función produce el efecto que estamos buscando, veamos todas las llamadas a `find` que se hacen al buscar una solución para el número 13:

```{lang: null}
find(1, "1")
  find(6, "(1 + 5)")
    find(11, "((1 + 5) + 5)")
      find(16, "(((1 + 5) + 5) + 5)")
        demasiado grande
      find(33, "(((1 + 5) + 5) * 3)")
        demasiado grande
    find(18, "((1 + 5) * 3)")
      demasiado grande
  find(3, "(1 * 3)")
    find(8, "((1 * 3) + 5)")
      find(13, "(((1 * 3) + 5) + 5)")
        ¡encontrado!
```

La sangría indica la profundidad de la pila de llamadas. La primera vez que se llama a `find`, la función comienza llamándose a sí misma para explorar la solución que comienza con `(1 + 5)`. Esa llamada seguirá recursivamente para explorar _cada_ solución continua que produzca un número menor o igual al número objetivo. Como no encuentra uno que alcance el objetivo, devuelve `null` a la primera llamada. Allí, el operador `??` hace que ocurra la llamada que explora `(1 * 3)`. Esta búsqueda tiene más suerte: su primera llamada recursiva, a través de otra llamada recursiva, alcanza el número objetivo. Esa llamada más interna devuelve una cadena, y cada uno de los operadores `??` en las llamadas intermedias pasa esa cadena, devolviendo en última instancia la solución.

## Crecimiento de funciones

{{index [función, definición]}}

Hay dos formas más o menos naturales de introducir funciones en los programas.

{{index repetición}}

La primera ocurre cuando te encuentras escribiendo código similar varias veces. Preferirías no hacer eso, ya que tener más código significa más espacio para que se escondan los errores y más material para que las personas que intentan entender el programa lo lean. Por lo tanto, tomas la funcionalidad repetida, encuentras un buen nombre para ella y la colocas en una función.

La segunda forma es que te das cuenta de que necesitas alguna funcionalidad que aún no has escrito y que suena como si mereciera su propia función. Comienzas por nombrar la función, luego escribes su cuerpo. Incluso podrías comenzar a escribir código que use la función antes de definir la función en sí.

{{index [función, nombramiento], [variable, nombramiento]}}

Lo difícil que es encontrar un buen nombre para una función es una buena indicación de lo claro que es el concepto que estás tratando de envolver. Vamos a través de un ejemplo.

{{index "ejemplo de granja"}}

Queremos escribir un programa que imprima dos números: el número de vacas y de pollos en una granja, con las palabras `Vacas` y `Pollos` después de ellos y ceros rellenados antes de ambos números para que siempre tengan tres dígitos:

```{lang: null}
007 Vacas
011 Pollos
```

Esto pide una función con dos argumentos: el número de vacas y el número de pollos. ¡Vamos a programar!

```
function imprimirInventarioGranja(vacas, pollos) {
  let cadenaVaca = String(vacas);
  while (cadenaVaca.length < 3) {
    cadenaVaca = "0" + cadenaVaca;
  }
  console.log(`${cadenaVaca} Vacas`);
  let cadenaPollo = String(pollos);
  while (cadenaPollo.length < 3) {
    cadenaPollo = "0" + cadenaPollo;
  }
  console.log(`${cadenaPollo} Pollos`);
}
imprimirInventarioGranja(7, 11);
```

{{index ["propiedad length", "para cadenas"], "bucle while"}}

Escribir `.length` después de una expresión de cadena nos dará la longitud de esa cadena. Por lo tanto, los bucles `while` siguen añadiendo ceros delante de las cadenas de números hasta que tengan al menos tres caracteres de longitud.

¡Misión cumplida! Pero justo cuando estamos a punto de enviarle al granjero el código (junto con una jugosa factura), ella llama y nos dice que también ha comenzado a criar cerdos, ¿podríamos extender el software para imprimir también los cerdos?

{{index "programación copiar y pegar"}}

¡Claro que podemos! Pero justo cuando estamos en el proceso de copiar y pegar esas cuatro líneas una vez más, nos detenemos y reconsideramos. Tiene que haber una mejor manera. Aquí está un primer intento:

```
function imprimirConRellenoYEtiqueta(numero, etiqueta) {
  let cadenaNumero = String(numero);
  while (cadenaNumero.length < 3) {
    cadenaNumero = "0" + cadenaNumero;
  }
  console.log(`${cadenaNumero} ${etiqueta}`);
}

function imprimirInventarioGranja(vacas, pollos, cerdos) {
  imprimirConRellenoYEtiqueta(vacas, "Vacas");
  imprimirConRellenoYEtiqueta(pollos, "Pollos");
  imprimirConRellenoYEtiqueta(cerdos, "Cerdos");
}

imprimirInventarioGranja(7, 11, 3);
```

{{index [función, nombramiento]}}

¡Funciona! Pero ese nombre, `imprimirConRellenoYEtiqueta`, es un poco incómodo. Confluye tres cosas: imprimir, rellenar con ceros y añadir una etiqueta, en una sola función.

{{index "función zeroPad"}}

En lugar de sacar la parte repetida de nuestro programa completamente, intentemos sacar un solo _concepto_:

```
function rellenarConCeros(numero, ancho) {
  let cadena = String(numero);
  while (cadena.length < ancho) {
    cadena = "0" + cadena;
  }
  return cadena;
}

function imprimirInventarioGranja(vacas, pollos, cerdos) {
  console.log(`${rellenarConCeros(vacas, 3)} Vacas`);
  console.log(`${rellenarConCeros(pollos, 3)} Pollos`);
  console.log(`${rellenarConCeros(cerdos, 3)} Cerdos`);
}

imprimirInventarioGranja(7, 16, 3);
```

{{index legibilidad, "función pura"}}

Una función con un nombre claro y obvio como `rellenarConCeros` hace que sea más fácil para alguien que lee el código entender qué hace. Además, una función así es útil en más situaciones que solo este programa específico. Por ejemplo, podrías usarla para ayudar a imprimir tablas de números alineadas correctamente.

{{index [interfaz, diseño]}}

¿Qué tan inteligente y versátil _debería_ ser nuestra función? Podríamos escribir cualquier cosa, desde una función terriblemente simple que solo puede rellenar un número para que tenga tres caracteres de ancho hasta un sistema de formato de números generalizado complicado que maneje números fraccionarios, números negativos, alineación de puntos decimales, relleno con diferentes caracteres, y más.

Un principio útil es abstenerse de agregar ingenio a menos que estés absolutamente seguro de que lo vas a necesitar. Puede ser tentador escribir "((marcos de trabajo))" generales para cada trozo de funcionalidad que te encuentres. Resiste esa tentación. No lograrás hacer ningún trabajo real: estarás demasiado ocupado escribiendo código que nunca usas.

{{id puro}}

## Funciones y efectos secundarios

{{index "efecto secundario", "función pura", [función, pureza]}}

Las funciones pueden dividirse aproximadamente en aquellas que se llaman por sus efectos secundarios y aquellas que se llaman por su valor de retorno (aunque también es posible tener efectos secundarios y devolver un valor).

{{index reutilización}}

La primera función auxiliar en el ((ejemplo de la granja)), `imprimirRellenadoConEtiqueta`, se llama por su efecto secundario: imprime una línea. La segunda versión, `rellenarConCero`, se llama por su valor de retorno. No es casualidad que la segunda sea útil en más situaciones que la primera. Las funciones que crean valores son más fáciles de combinar de nuevas formas que las funciones que realizan efectos secundarios directamente.

{{index sustitución}}

Una función _pura_ es un tipo específico de función productora de valor que no solo no tiene efectos secundarios, sino que tampoco depende de efectos secundarios de otro código, por ejemplo, no lee enlaces globales cuyo valor podría cambiar. Una función pura tiene la agradable propiedad de que, al llamarla con los mismos argumentos, siempre produce el mismo valor (y no hace nada más). Una llamada a tal función puede sustituirse por su valor de retorno sin cambiar el significado del código. Cuando no estás seguro de que una función pura esté funcionando correctamente, puedes probarla llamándola y saber que si funciona en ese contexto, funcionará en cualquier otro. Las funciones no puras tienden a requerir más andamiaje para probarlas.

{{index "optimización", "console.log"}}

Aún así, no hay necesidad de sentirse mal al escribir funciones que no son puras. Los efectos secundarios a menudo son útiles. No hay forma de escribir una versión pura de `console.log`, por ejemplo, y es bueno tener `console.log`. Algunas operaciones también son más fáciles de expresar de manera eficiente cuando usamos efectos secundarios.

## Resumen

Este capítulo te enseñó cómo escribir tus propias funciones. La palabra clave `function`, cuando se usa como expresión, puede crear un valor de función. Cuando se usa como una declaración, puede usarse para declarar un enlace y darle una función como su valor. Las funciones de flecha son otra forma de crear funciones.

```
// Definir f para contener un valor de función
const f = function(a) {
  console.log(a + 2);
};

// Declarar g como una función
function g(a, b) {
  return a * b * 3.5;
}

// Un valor de función menos verboso
let h = a => a % 3;
```

Una parte clave para entender las funciones es comprender los ámbitos (scopes). Cada bloque crea un nuevo ámbito. Los parámetros y las vinculaciones declaradas en un ámbito dado son locales y no son visibles desde el exterior. Las vinculaciones declaradas con `var` se comportan de manera diferente: terminan en el ámbito de la función más cercana o en el ámbito global.

Separar las tareas que realiza tu programa en diferentes funciones es útil. No tendrás que repetirte tanto, y las funciones pueden ayudar a organizar un programa agrupando el código en piezas que hacen cosas específicas.

## Ejercicios

### Mínimo

{{index "Math object", "minimum (exercise)", "Math.min function", minimum}}

El [capítulo previo](program_structure#return_values) presentó la función estándar `Math.min` que devuelve su menor argumento. Ahora podemos escribir una función como esa nosotros mismos. Define la función `min` que toma dos argumentos y devuelve su mínimo.

{{if interactive

```{test: no}
// Tu código aquí.

console.log(min(0, 10));
// → 0
console.log(min(0, -10));
// → -10
```
if}}

{{hint

{{index "minimum (exercise)"}}

Si tienes problemas para colocar llaves y paréntesis en el lugar correcto para obtener una definición de función válida, comienza copiando uno de los ejemplos de este capítulo y modifícalo.

{{index "return keyword"}}

Una función puede contener múltiples declaraciones `return`.

hint}}

### Recursión

{{index recursion, "isEven (exercise)", "even number"}}

Hemos visto que podemos usar `%` (el operador de resto) para verificar si un número es par o impar al usar `% 2` para ver si es divisible por dos. Aquí hay otra forma de definir si un número entero positivo es par o impar:

- El cero es par.

- El uno es impar.

- Para cualquier otro número _N_, su paridad es la misma que _N_ - 2.

Define una función recursiva `isEven` que corresponda a esta descripción. La función debe aceptar un solo parámetro (un número entero positivo) y devolver un booleano.

{{index "stack overflow"}}

Pruébalo con 50 y 75. Observa cómo se comporta con -1. ¿Por qué? ¿Puedes pensar en una forma de solucionarlo?

{{if interactive

```{test: no}
// Tu código aquí.

console.log(isEven(50));
// → true
console.log(isEven(75));
// → false
console.log(isEven(-1));
// → ??
```

if}}

{{hint

{{index "isEven (exercise)", ["if keyword", chaining], recursion}}

Es probable que tu función se parezca en cierta medida a la función interna `find` en el ejemplo recursivo `findSolution` [ejemplo](functions#recursive_puzzle) de este capítulo, con una cadena `if`/`else if`/`else` que prueba cuál de los tres casos aplica. El `else` final, correspondiente al tercer caso, realiza la llamada recursiva. Cada una de las ramas debe contener una declaración `return` o de alguna otra manera asegurarse de que se devuelva un valor específico.

{{index "stack overflow"}}

Cuando se le da un número negativo, la función se llamará recursivamente una y otra vez, pasándose a sí misma un número cada vez más negativo, alejándose así más y más de devolver un resultado. Eventualmente se quedará sin espacio en la pila y se abortará.

hint}}

### Contando frijoles

{{index "bean counting (exercise)", [string, indexing], "zero-based counting", ["length property", "for string"]}}

Puedes obtener el *ésimo carácter, o letra, de una cadena escribiendo `[N]` después de la cadena (por ejemplo, `cadena[2]`). El valor resultante será una cadena que contiene solo un carácter (por ejemplo, `"b"`). El primer carácter tiene la posición 0, lo que hace que el último se encuentre en la posición `cadena.length - 1`. En otras palabras, una cadena de dos caracteres tiene longitud 2, y sus caracteres tienen posiciones 0 y 1.

Escribe una función `contarBs` que tome una cadena como único argumento y devuelva un número que indique cuántos caracteres B en mayúscula hay en la cadena.

A continuación, escribe una función llamada `contarCaracter` que se comporte como `contarBs`, excepto que toma un segundo argumento que indica el carácter que se va a contar (en lugar de contar solo caracteres B en mayúscula). Reescribe `contarBs` para hacer uso de esta nueva función.

{{if interactive

```{test: no}
// Your code here.

console.log(countBs("BOB"));
// → 2
console.log(countChar("kakkerlak", "k"));
// → 4
```

if}}

{{hint

{{index "bean counting (exercise)", ["length property", "for string"], "counter variable"}}

Tu función necesida un ((bucle)) que mire cada carácter en la cadena. Puede ejecutar un índice desde cero hasta uno menos que su longitud (`< string.length`). Si el carácter en la posición actual es el mismo que el que la función está buscando, agrega 1 a una variable de contador. Una vez que el bucle ha terminado, el contador puede ser devuelto.

{{index "local binding"}}

Ten cuidado de que todas las vinculaciones utilizadas en la función sean _locales_ a la función, declarándolas correctamente con la palabra clave `let` o `const`.

hint}}
