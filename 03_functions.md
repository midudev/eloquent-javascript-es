# Funciones

{{quote {author: "Donald Knuth", chapter: true}

La gente piensa que la informática es el arte de los genios, cuando en realidad es al contrario, se trata simplemente de muchas personas construyendo cosas una encima de otra, como un muro de piedrecitas.

quote}}

{{index "Knuth, Donald"}}

{{figure {url: "img/chapter_picture_3.jpg", alt: "Ilustración de hojas de helecho con una forma fractal, abejas en el fondo", chapter: framed}}}

{{index "función", [code, "estructura de"]}}

Las funciones son una de las herramientas más fundamentales en la programación en JavaScript. El concepto de envolver un fragmento de programa en un valor tiene mucha utilidad. Nos proporciona una manera de estructurar programas más grandes, de reducir la repetición, de asociar nombres con subprogramas y de aislar estos subprogramas entre sí.

La aplicación más evidente de las funciones es definir nuevo ((vocabulario)). Crear palabras nuevas en el lenguaje usual no suele quedar bien, pero en programación es indispensable.

{{index "abstracción", vocabulario}}

Un angloparlante adulto estándar tiene alrededor de 20000 palabras en su vocabulario. Pocos lenguajes de programación vienen con 20000 comandos ya incorporados, y el vocabulario que _hay_ a disposición tiende a estar más precisamente definido —y por tanto a ser menos flexible— que en el caso del lenguaje natural humano. Así pues, _tenemos_ que introducir palabras nuevas para evitar una verbosidad excesiva.

## Definir una función

{{index "ejemplo de cuadrado", ["función", "definición"], ["enlace", "definición"]}}

Una definición de función es una asociación cualquiera en la que el valor de la asociación es una función. Por ejemplo, este código define la asociación `cuadrado` para referirse a una función que produce el cuadrado de un número dado:


```
const cuadrado = function(x) {
  return x * x;
};

console.log(cuadrado(12));
// → 144
```

{{indexsee "llaves", corchetes}}
{{index ["corchetes", "cuerpo de la función"], "bloque", ["sintaxis", "función"], "palabra clave de función", ["función", "cuerpo"], ["función", "como valor"], ["paréntesis", "argumentos"]}}


Una función se crea con una expresión que comienza con la palabra clave `function`. Las funciones tienen un conjunto de _((parámetro))s_ (en este ejemplo, solo `x`) y un _cuerpo_, que contiene las declaraciones que se ejecutarán cuando se llame a la función. El cuerpo de una función creada de esta manera siempre debe estar envuelto entre llaves, incluso aunque consista en una única ((declaración)).

{{index "ejemplo de roundTo"}}

Una función puede tener varios parámetros o ninguno en absoluto. En el siguiente ejemplo, `hacerRuido` no enumera nombre de parámetro alguno, mientras que `redondearA` (que redondea `n` al múltiplo más cercano de `paso`) enumera dos:

```
const hacerRuido = function() {
  console.log("¡Cling!");
};

hacerRuido();
// → ¡Cling!

const redondearA = function(n, paso) {
  let resto = n % paso;
  return n - resto + (resto < paso / 2 ? 0 : paso);
};

console.log(redondearA(23, 10));
// → 20
```

{{index "valor de retorno", "palabra clave de retorno", indefinido}}

Algunas funciones, como `redondearA` y `cuadrado`, producen un valor, y otras no, como `hacerRuido`, cuyo único resultado es un ((efecto secundario)). Una instrucción `return` determina el valor que devuelve la función. Cuando el control llega a una instrucción de ese tipo, salta inmediatamente fuera de la función actual y le da el valor devuelto al código que llamó a la función. Si la palabra clave `return` se usa sin una expresión después de ella, la función devolverá `undefined`. Las funciones que no tienen ninguna instrucción `return`, como `hacerRuido`, también devuelven `undefined`.

{{index "parámetro", ["función", "aplicación"], [enlace, "desde parámetro"]}}

Los parámetros de una función se comportan como asociaciones habituales, pero sus valores iniciales son dados por el _llamador_ de la función, no por el propio código de la función.

## Asociaciones y ámbitos

{{indexsee "ámbito de nivel superior", "ámbito global"}}
{{index "palabra clave var", "ámbito global", [enlace, global], [enlace, "ámbito de"]}}

Cada asociación tiene un _((ámbito))_, que es la parte del programa en la que la asociación es visible. Para las asociaciones definidas fuera de cualquier función, bloque o módulo (ver [Capítulo ?](modules)), el ámbito es todo el programa —puedes hacer referencia a esas asociaciones donde quieras. Estas asociaciones se llaman asociaciones _globales_.

{{index "ámbito local", [enlace, local]}}

Las asociaciones que se crean en la lista de parámetros de una función o que se declaran dentro de ella solo pueden ser referenciadas dentro de esa función, por lo que se conocen como asociaciones _locales_. Cada vez que se llama a la función, se crean nuevas instancias de estas asociaciones. Esto proporciona cierto aislamiento entre funciones —cada llamada a función actúa en su pequeño mundo (su entorno local) y a menudo se puede entender sin saber mucho sobre lo que está sucediendo en el entorno global.

{{index "palabra clave let", "palabra clave const", "palabra clave var"}}

Las asociaciones declaradas con `let` y `const` en realidad son locales al _((bloque))_ en el que se declaran, por lo que si creas una de ellas dentro de un bucle, el código antes y después del bucle no puede "verla". En el JavaScript de antes de 2015, solo las funciones creaban nuevos ámbitos, por lo que las asociaciones clásicas, creadas con la palabra clave `var`, son visibles en todas partes de la función en la que aparecen —o en todo el ámbito global, si no están dentro de una función.


{{note "**N. del T.**: Lo más común al referirse a cualquiera de las entidades definidas mediante las palabras clave `let`, `const` y `var` es utilizar la palabra **variable**. Sin embargo, todas estas entidades se comportan de manera diferente, tal y como se explica en el texto. Además, el uso de la palabra **variable** para referirse a una entidad que se define mediante la palabra clave `const` —y que, por tanto, es constante— puede resultar confuso. Por este motivo, hemos elegido utilizar la palabra **asociación** para referirnos a estas entidades, aunque **vínculo** o **enlace** también serían alternativas adecuadas y podrían utilizarse en ocasiones. Esto se hace para —imitando lo que hace el autor en la obra original mediante el uso de la palabra **bind**— referirse a estas entidades de una manera unificada que no pueda llevar a confusión."}}


```
let x = 10;   // global
if (true) {
  let y = 20; // local al bloque
  var z = 30; // también global
}
```

{{index [enlace, visibilidad]}}

Cada ((ámbito)) puede "mirar hacia afuera" al ámbito que lo rodea, por lo que `x` es visible dentro del bloque en el ejemplo. La excepción es cuando múltiples asociaciones tienen el mismo nombre —en ese caso, el código solo puede ver la más interna. Por ejemplo, cuando el código dentro de la función `mitad` hace referencia a `n`, está viendo su _propia_ `n`, no la `n` global.

```
const mitad = function(n) {
  return n / 2;
};

let n = 10;
console.log(mitad(100));
// → 50
console.log(n);
// → 10
```

{{id alcance}}

## Ámbito anidado

{{index [anidamiento, "de funciones"], [anidamiento, "de ámbito"], "ámbito", "función interna", "ámbito léxico"}}

JavaScript distingue no solo entre asociaciones globales y locales. Se pueden crear bloques y funciones dentro de otros bloques y funciones, produciendo múltiples grados de localidad.

{{index "ejemplo de paisaje"}}

Por ejemplo, esta función —que muestra los ingredientes necesarios para hacer `factor` platos de hummus— tiene otra función dentro de ella:

```
const hummus = function(factor) {
  const ingrediente = function(cantidad, unidad, nombre) {
    let cantidadDeIngrediente = cantidad * factor;
    if (cantidadDeIngrediente != 1) {
      unidad += "s de";
    } else {
      unidad += " de";
    }
    console.log(`${cantidadDeIngrediente} ${unidad} ${nombre}`);
  };
  ingrediente(1, "lata", "garbanzos");
  ingrediente(0.25, "taza", "tahini");
  ingrediente(0.25, "taza", "jugo de limón");
  ingrediente(1, "diente", "ajo");
  ingrediente(2, "cucharada", "aceite de oliva");
  ingrediente(0.5, "cucharadita", "comino");
};
```

{{index ["función", alcance], alcance}}

El código dentro de la función `ingrediente` puede ver la asociación `factor` de la función exterior, pero sus asociaciones locales, como `unidad` o `cantidadDeIngrediente`, no son visibles en la función exterior.

El conjunto de asociaciones visibles dentro de un bloque está determinado por el lugar de ese bloque en el texto del programa. Cada ámbito local también puede ver todos los ámbitos locales que lo contienen, y todos los ámbitos pueden ver el ámbito global. Este enfoque de visibilidad de asociaciones se llama _((alcance léxico))_.

## Funciones como valores

{{index ["función", "como valor"], [enlace, "definición"]}}

Generalmente una asociación de función simplemente actúa como un nombre para una parte específica del programa. Esta asociación se define una vez y nunca se cambia. Esto hace que sea fácil confundir la función y su nombre.

{{index [enlace, "asignación"]}}

Pero son cosas distintas. Un valor de función puede hacer todas las cosas que pueden hacer otros valores: puedes utilizarlo en expresiones arbitrarias, no solamente llamarlo. Es posible almacenar un valor de función en una nueva asociación, pasarlo como argumento a una función, etc. De manera similar, una asociación que contiene una función sigue siendo solo una asociación normal y, si no es constante, se le puede asignar un nuevo valor, así:

```{test: no}
let lanzarMisiles = function() {
  sistemaDeMisil.lanzar("ahora");
};
if (modoSeguro) {
  lanzarMisiles = function() {/* no hacer nada */};
}
```

{{index ["función", "de orden superior"]}}

En el [Capítulo ?](higher_order), discutiremos las cosas interesantes que podemos hacer al pasar valores de función a otras funciones.

## Notación de declaración

{{index [sintaxis, "función"], "palabra clave función", "ejemplo cuadrado", ["función", "definición"], ["función", "declaración"]}}

Hay una manera ligeramente más corta de crear una asociación de función. Funciona de una manera un poco distinta cuando se utiliza la palabra clave `function` al inicio de una declaración:

```{test: wrap}
function cuadrado(x) {
  return x * x;
}
```

{{index futura, "orden de ejecución"}}

Esto es una función _declarativa_. La declaración define la asociación `cuadrado` y la apunta a la función dada. Es un poco más fácil de escribir y no requiere un punto y coma después de la función.

Hay una sutileza con esta forma de definir una función.

```
console.log("El futuro dice:", futuro());

function futuro() {
  return "Nunca tendrás coches voladores";
}
```

El código anterior funciona, incluso aunque la función esté definida _debajo_ del código que la usa. Las de funciones declarativas no forman parte del flujo de control regular de arriba hacia abajo. Conceptualmente se mueven al principio de su ámbito y pueden ser utilizadas por todo el código en ese ámbito. A veces esto es útil porque ofrece la libertad de ordenar el código de una manera que parezca más clara, sin tener que preocuparse por definir todas las funciones antes de que se utilicen.

## Funciones flecha

{{index "función", "función flecha"}}

Hay una tercera notación para funciones que tiene un aspecto muy diferente a las otras. En lugar de la palabra clave `function`, utiliza una flecha (`=>`) compuesta por un signo igual y un caracter mayor que (no confundir con el operador mayor o igual, que se escribe `>=`):

```{test: wrap}
const redondearA = (n, paso) => {
  let resto = n % paso;
  return n - resto + (resto < paso / 2 ? 0 : paso);
};
```

{{index [function, body]}}

La flecha se escribe _después_ de la lista de parámetros y va seguida por el cuerpo de la función. Expresa algo así como "esta entrada (los ((parámetros))) produce este resultado (el cuerpo)".

{{index [braces, "function body"], "ejemplo de exponente", ["paréntesis", argumentos]}}

Cuando solo hay un nombre de parámetro se pueden omitir los paréntesis alrededor de la lista de parámetros. Si el cuerpo es una sola expresión, en lugar de un ((bloque)) entre llaves, entonces la función devolverá esa expresión. Por ejemplo, estas dos definiciones de `exponente` hacen lo mismo:

```
const exponente1 = (x) => { return x * x; };
const exponente2 = x => x * x;
```

{{index ["paréntesis", argumentos]}}

Cuando una función flecha no tiene ningún parámetro, su lista de parámetros consiste simplemente en unos paréntesis vacíos.

```
const cuerno = () => {
  console.log("Honk");
};
```

{{index verbosidad}}

No hay una razón esencial para tener tanto funciones flecha como expresiones `function` en el lenguaje. Aparte de un detalle menor, que discutiremos en el [Capítulo ?](object), hacen lo mismo. Las funciones flecha se añadieron en 2015, principalmente para hacer posible escribir expresiones de función pequeñas de una manera menos verbosa. Las usaremos a menudo en el [Capítulo ?](higher_order) .

{{id pila}}

## La pila de llamadas

{{indexsee pila, "pila de llamadas"}}
{{index "pila de llamadas", ["función", "aplicación"]}}

La forma en que el control fluye a través de las funciones es un poco enrevesada. Echemos un vistazo más de cerca. Aquí hay un programa sencillo que realiza algunas llamadas de función:

```
function saludar(quién) {
  console.log("Hola " + quién);
}
saludar("Harry");
console.log("Adiós");
```

{{index ["flujo de control", funciones], "orden de ejecución", "console.log"}}

Una ejecución de este programa funciona más o menos así: la llamada a `saludar` hace que el control salte al inicio de esa función (línea 2). La función llama a `console.log`, que toma el control, hace su trabajo, y luego devuelve el control a la línea 2. Allí, llega al final de la función `saludar`, por lo que regresa al lugar desde el que se llamó, línea 4. La línea siguiente llama a `console.log` de nuevo. En cuanto vuelve de ahí, el programa llega a su fin.

Podríamos mostrar el flujo de control esquemáticamente como sigue:

```{lang: null}
fuera de función
   en saludar
        en console.log
   en saludar
fuera de función
   en console.log
fuera de función
```

{{index "palabra clave return", [memoria, pila de llamadas]}}

Dado que una función tiene que regresar al lugar desde donde se llamó cuando termina, la computadora debe recordar el contexto desde el cual se realizó la llamada. En un caso, `console.log` tiene que regresar a la función `saludar` cuando haya terminado. En el otro caso, regresa al final del programa.

El lugar donde la computadora almacena este contexto es la _((pila de llamadas))_. Cada vez que se llama a una función, el contexto actual se apila encima de esta pila. Cuando una función termina, la computadora quita el contexto superior de la pila y lo usa para continuar la ejecución.

{{index "bucle infinito", "desbordamiento de pila", "recursión"}}

Almacenar esta pila requiere espacio en la memoria de la computadora. Cuando la pila crece demasiado, la computadora fallará con un mensaje como "sin espacio en la pila" o "demasiada recursividad". El siguiente código ilustra esto al hacerle a la computadora una pregunta realmente difícil que causa un vaivén infinito entre dos funciones. O, más bien, _sería_ infinito, si la computadora tuviera una pila infinita. Como no es el caso, nos quedaremos sin espacio o "volaremos la pila".

```{test: no}
function gallina() {
  return huevo();
}
function huevo() {
  return gallina();
}
console.log(gallina() + " salió primero.");
// → ??
```

## Argumentos Opcionales

{{index argumento, ["función", "aplicación"]}}

El siguiente código está permitido y se ejecuta sin ningún problema:

```
function cuadrado(x) { return x * x; }
console.log(cuadrado(4, true, "erizo"));
// → 16
```

Hemos definido `cuadrado` con solo un ((parámetro)). Sin embargo, cuando la llamamos con tres, el lenguaje no se queja. Ignora los argumentos adicionales y calcula el cuadrado del primero.

{{index indefinido}}

JavaScript es extremadamente flexible en cuanto al número de argumentos que puedes pasarle a una función. Si pasas demasiados, los extras son ignorados. Si pasas muy pocos, a los parámetros faltantes se les asigna el valor `undefined`.

El inconveniente de esto es que es posible —incluso probable— que pases accidentalmente una cantidad incorrecta de argumentos a funciones. Y nadie te dirá nada al respecto. La ventaja es que puedes utilizar este comportamiento para permitir que una función sea llamada con diferentes números de argumentos. Por ejemplo, esta función `menos` intenta imitar al operador `-` al actuar sobre uno o dos argumentos:

```
function menos(a, b) {
  if (b === undefined) return -a;
  else return a - b;
}

console.log(menos(10));
// → -10
console.log(menos(10, 5));
// → 5
```

{{id roundTo}}
{{index "argumento opcional", "valor por defecto", "parámetro", ["operador =", "para valor por defecto"], "ejemplo de redondeo"}}

Si escribes un operador `=` después de un parámetro, seguido de una expresión, el valor de esa expresión sustituirá al argumento cuando este no se proporcione. Por ejemplo, esta versión de `redondearA` hace que su segundo argumento sea opcional. Si no lo proporcionas o pasas el valor `undefined`, por defecto será uno:

```{test: wrap}
function redondearA(n, paso = 1) {
  let resto = n % paso;
  return n - resto + (resto < paso / 2 ? 0 : paso);
};

console.log(redondearA(4.5));
// → 5
console.log(redondearA(4.5, 2));
// → 4
```

{{index "console.log"}}

[El próximo capítulo](data#rest_parameters) presentará una forma en que el cuerpo de una función puede acceder a toda la lista de argumentos que se le han pasado. Esto es útil porque le permite a una función aceptar cualquier número de argumentos. Por ejemplo, `console.log` lo hace, mostrando todos los valores que se le dan:

```
console.log("C", "O", 2);
// → C O 2
```

## Clausura

{{index "pila de llamadas", "vinculación local", ["función", "como valor"], alcance}}

La capacidad de tratar las funciones como valores, combinada con el hecho de que las asociaciones locales se recrean cada vez que se llama a una función, plantea una pregunta interesante: ¿qué sucede con las asociaciones locales cuando la llamada a la función que las creó ya no está activa? El siguiente código muestra un ejemplo de esto. Define una función, `envuelveValor`, que crea una asociación local. Luego, devuelve una función que accede a esta asociación local y la devuelve:

```
function envuelveValor(n) {
  let local = n;
  return () => local;
}

let envoltura1 = envuelveValor(1);
let envoltura2 = envuelveValor(2);
console.log(envoltura1());
// → 1
console.log(envoltura2());
// → 2
```

Esto está permitido y funciona como esperarías: aún puede accederse a ambas instancias de la asociación. Esta situación es una buena demostración de que las asociaciones locales se crean nuevamente para cada llamada, y las diferentes llamadas no afectan las asociaciones locales de las demás llamadas.

Esta característica —poder hacer referencia a una instancia específica de una asociación local en un ámbito superior— se llama _((clausura))_. Una función que hace referencia a asociaciones de ámbitos locales a su alrededor se llama _una_ clausura. Este comportamiento no solo te libra de tener que preocuparte por la vida útil de las asociaciones, sino que también permite usar valores de función de formas creativas.

{{index "función de multiplicador"}}

Con un pequeño cambio, podemos convertir el ejemplo anterior en una forma de crear funciones que multiplican por una cantidad arbitraria:

```
function multiplicador(factor) {
  return número => número * factor;
}

let doble = multiplicador(2);
console.log(doble(5));
// → 10
```

{{index [enlace, "desde parámetro"]}}

La asociación explícita `local` del ejemplo `envuelveValor` realmente no es necesaria, ya que un parámetro es en sí mismo una asociación local.

{{index ["función", "modelo de"]}}

Pensar en programas de esta manera requiere algo de práctica. Un buen modelo mental es pensar en los valores de función como conteniendo tanto el código en su cuerpo como el entorno en el que han sido creados. Cuando se llama, el cuerpo de la función ve el entorno en el que fue creada, no el entorno en el que se le llama.

En el ejemplo anterior, se llama a `multiplicador` y esta crea un entorno en el que su parámetro `factor` se asocia a 2. El valor de función que devuelve, que se almacena en `doble`, recuerda este entorno para que, cuando se llame, multiplique su argumento por 2.

## Recursión

{{index "ejemplo de potencia", "desbordamiento de pila", "recursión", ["función", "aplicación"]}}

Es perfectamente válido que una función se llame a sí misma, siempre y cuando no lo haga tan a menudo que desborde la pila de llamadas. Una función que se llama a sí misma se llama _recursiva_. La recursión permite escribir funciones con un estilo diferente. Considera, por ejemplo, esta función `potencia`, que hace lo mismo que el operador `**` (potenciación):

```{test: wrap}
function potencia(base, exponente) {
  if (exponente == 0) {
    return 1;
  } else {
    return base * potencia(base, exponente - 1);
  }
}

console.log(potencia(2, 3));
// → 8
```

{{index ciclo, legibilidad, "matemáticas"}}

Esto se parece más a la forma en que los matemáticos definen la potenciación y describe el concepto de manera más clara que el bucle que usamos en el [Capítulo ?](program_structure). La función se llama a sí misma varias veces con exponentes cada vez más pequeños para conseguir una multiplicación repetida como la deseada.

{{index ["función", "aplicación"], eficiencia}}

Sin embargo, esta implementación tiene un problema: en implementaciones típicas en JavaScript, es aproximadamente tres veces más lenta que una versión que utilice un bucle `for`. Recorrer un simple bucle suele ser más económico que llamar a una función recursivamente.

{{index "optimización"}}

El dilema de velocidad _versus_ ((elegancia)) es interesante. Se puede ver como una especie de continuo entre la compatibilidad con los humanos y las máquinas. Casi siempre se puede alargar y complicar un programa para hacerlo más rápido. Es cosa del programador encontrar el equilibrio apropiado.

En el caso de la función `potencia`, una versión poco elegante (con bucles) sigue siendo bastante simple y fácil de leer. No tiene mucho sentido sustituirla por una función recursiva. Sin embargo, a menudo un programa trata con conceptos tan complejos que es útil renunciar a algo de eficiencia para hacer que el programa sea más sencillo.

{{index perfilado}}

Preocuparse por la eficiencia puede ser una distracción. Es otro factor que complica el diseño del programa, y, cuando estás haciendo algo que ya es difícil, ese extra en lo que preocuparse puede llegar a ser paralizante.

{{index "optimización prematura"}}

Por lo tanto, generalmente deberías comenzar escribiendo algo que sea correcto y fácil de entender. Si te preocupa que sea demasiado lento —lo cual suele ser raro, ya que la mayoría del código simplemente no se ejecuta suficientes veces como para consumir una cantidad significativa de tiempo—, puedes medir después y mejorarlo si es necesario.

{{index "recursión de ramificación"}}

La recursión no siempre es simplemente una alternativa ineficiente a los bucles. Algunos problemas realmente son más fáciles de resolver con recursión que con bucles. Con frecuencia, se trata de problemas que requieren explorar o procesar varias "ramas", cada una de las cuales podría ramificarse nuevamente en aún más ramas.

{{id rompecabezas_recursivo}}
{{index "recursión", "ejemplo de rompecabezas numérico"}}

Considera este problema: al comenzar desde el número 1 y repetidamente elegir entre sumar 5 o multiplicar por 3, se puede producir un conjunto infinito de números. ¿Cómo escribirías una función que, dado un número, intente encontrar una secuencia de tales sumas y multiplicaciones que produzcan ese número? Por ejemplo, el número 13 podría alcanzarse al multiplicar por 3 y luego sumar 5 dos veces, mientras que el número 15 no se puede alcanzar de esta manera.

Aquí tienes una solución recursiva:

```
function encontrarSolucion(objetivo) {
  function encontrar(actual, historial) {
    if (actual === objetivo) {
      return historial;
    } else if (actual > objetivo) {
      return null;
    } else {
      return encontrar(actual + 5, `(${historial} + 5)`) ??
             encontrar(actual * 3, `(${historial} * 3)`);
    }
  }
  return encontrar(1, "1");
}

console.log(encontrarSolucion(24));
// → (((1 * 3) + 5) * 3)
```

Ten en cuenta que este programa no necesariamente encuentra la secuencia de operaciones más _corta_. Se conforma con encontrar cualquier secuencia.

No te preocupes si no ves cómo funciona este código de inmediato. Vamos a inspeccionarlo bien, ya que es un gran ejercicio de pensamiento recursivo.

La función interna `encontrar` es la que realiza la recursión real. Toma dos argumentos: el número actual y una cadena que registra cómo llegamos a este número. Si encuentra una solución, devuelve una cadena que muestra cómo llegar al objetivo. Si no puede encontrar una solución para este número, devuelve `null`.

{{index null, "operador ??", "evaluación de cortocircuito"}}

Para hacer esto, la función realiza una de entre tres acciones. Si el número actual es el número objetivo, el historial actual es una forma de alcanzar ese objetivo, por lo que este se devuelve y termina la función. Si el número actual es mayor que el objetivo, no tiene sentido explorar más esta rama porque tanto la suma como la multiplicación solo harán que el número sea más grande, por lo que la función devuelve `null`. Finalmente, si aún estamos por debajo del número objetivo, la función prueba ambas rutas posibles que parten del número actual llamándose a sí misma dos veces, una vez para la suma y otra vez para la multiplicación. Si la primera llamada devuelve algo que no es `null`, entonces este es el resultado que se devuelve. De lo contrario, se devuelve la segunda llamada, independientemente de si produce una cadena o `null`.

{{index "pila de llamadas"}}

Para entender mejor cómo esta función produce el efecto que estamos buscando, veamos todas las llamadas a `encontrar` que se hacen al buscar una solución para el número 13:

```{lang: null}
encontrar(1, "1")
  encontrar(6, "(1 + 5)")
    encontrar(11, "((1 + 5) + 5)")
      encontrar(16, "(((1 + 5) + 5) + 5)")
        demasiado grande
      encontrar(33, "(((1 + 5) + 5) * 3)")
        demasiado grande
    encontrar(18, "((1 + 5) * 3)")
      demasiado grande
  encontrar(3, "(1 * 3)")
    encontrar(8, "((1 * 3) + 5)")
      encontrar(13, "(((1 * 3) + 5) + 5)")
        ¡encontrado!
```

La sangría indica la profundidad de la pila de llamadas. La primera vez que se llama a `encontrar`, la función comienza llamándose a sí misma para explorar la solución que comienza con `(1 + 5)`. Esa llamada seguirá recursivamente para explorar _cada_ solución a continuación que produzca un número menor o igual al número objetivo. Como no encuentra uno que alcance el objetivo, devuelve `null` en la primera llamada que se hace dentro de `encontrar`. Allí, el operador `??` hace que ocurra la llamada que explora la opción `(1 * 3)`. Esta búsqueda es más exitosa: su primera llamada recursiva, a través de _otra_ llamada recursiva _más_, alcanza el número objetivo. Esa llamada más interna devuelve una cadena, y cada uno de los operadores `??` en las llamadas intermedias pasa esa cadena, devolviendo en última instancia la solución.

## Crecimiento de funciones

{{index ["función", "definición"]}}

Hay dos formas más o menos naturales de que las funciones aparezcan en los programas.

{{index "repetición"}}

La primera ocurre cuando te encuentras escribiendo código muy parecido varias veces. Preferirías no hacer eso, ya que tener más código significa más posibilidades de cometer errores y más material para leer para aquellas personas que intenten entender el programa. Por lo tanto, agarras esta funcionalidad repetida, encuentras un buen nombre para ella y la colocas dentro de una función.

La segunda forma es que darte cuenta de que necesitas alguna funcionalidad que aún no has escrito y que suena como si mereciera su propia función. Primero nombras la función y luego escribes su cuerpo. Incluso podrías comenzar a escribir código que use la función antes de definir la función en sí.

{{index ["función", nombramiento], [variable, nombramiento]}}

Cuán difícil es encontrar un buen nombre para una función es una buena indicación de lo claro que es el concepto que estás tratando de encapsular en ella. Vamos a ver de un ejemplo.

{{index "ejemplo de granja"}}

Queremos escribir un programa que imprima dos números: el número de vacas y de pollos en una granja, con las palabras `Vacas` y `Pollos` después de ellos y ceros de rrelleno antes de ambos números para que siempre se trate de números con tres dígitos:

```{lang: null}
007 Vacas
011 Pollos
```

Esto está pidiendo una función con dos argumentos: el número de vacas y el número de pollos. ¡Vamos a programar!

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

Escribir `.length` después de una expresión de cadena nos dará la longitud de esa cadena. Por lo tanto, los bucles `while` siguen añadiendo ceros delante de las cadenas de números hasta que estas tengan al menos tres caracteres de longitud.

¡Misión cumplida! Pero justo cuando estamos a punto de enviarle a la granjera el código (junto con una factura considerable), ella llama y nos dice que también ha comenzado a criar cerdos, ¿podríamos extender el software para imprimir también los cerdos?

{{index "programación copiar y pegar"}}

¡Claro que podemos! Pero justo cuando estamos en el proceso de copiar y pegar esas cuatro líneas una vez más, nos detenemos y reconsideramos. Tiene que haber una mejor manera. Aquí un primer intento:

```
function imprimirConRellenoYEtiqueta(número, etiqueta) {
  let cadenaNumero = String(número);
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

{{index ["función", nombramiento]}}

¡Funciona! Pero ese nombre, `imprimirConRellenoYEtiqueta`, es un poco raro. Confluye tres cosas: imprimir, rellenar con ceros y añadir una etiqueta, en una sola función.

{{index "función rellenarConCeros"}}

En lugar de extraer completamente la parte repetida de nuestro programa, intentemos sacar un solo _concepto_:

```
function rellenarConCeros(número, ancho) {
  let cadena = String(número);
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

Una función con un nombre claro y obvio como `rellenarConCeros` hace que sea más fácil para alguien que lee el código entender qué es lo que este hace. Además, una función así es útil en más situaciones aparte de este programa específico. Por ejemplo, podrías usarla para ayudar a imprimir tablas de números alineadas correctamente.

{{index [interfaz, "diseño"]}}

¿Cómo de inteligente y versátil _debería_ ser nuestra función? Podríamos escribir cualquier cosa, desde una función terriblemente simple que solo puede rellenar un número para que tenga tres caracteres de ancho hasta un sistema complejo de formato de números general que maneje números fraccionarios, números negativos, alineación de puntos decimales, relleno con diferentes caracteres y más.

Un principio útil es abstenerse de agregar ingenio a menos que estés absolutamente seguro de que lo vas a necesitar. Puede ser tentador escribir "((frameworks))" generales para cada trozo de funcionalidad que te encuentres. No caigas en la tentación. Así no lograrás acabar ninguna tarea —estarás demasiado ocupado escribiendo código que nunca usarás.

{{id puro}}

## Funciones y efectos secundarios

{{index "efecto secundario", "función pura", ["función", pureza]}}

Las funciones pueden clasificarse más o menos en aquellas a las que se llama por sus efectos secundarios y aquellas a las que se llama por su valor de retorno (aunque también es posible tener efectos secundarios y devolver un valor).

{{index "reutilización"}}

La primera función auxiliar en el ((ejemplo de la granja)), `imprimirConRellenoYEtiqueta`, se llama por su efecto secundario: imprimir una línea. La segunda versión, `rellenarConCeros`, se llama por su valor de retorno. No es casualidad que la segunda sea útil en más situaciones que la primera. Las funciones que crean valores son más fáciles de combinar de nuevas formas que las funciones que realizan efectos secundarios directamente.

{{index "sustitución"}}

Una función _pura_ es un tipo específico de función productora de valores que no solo no tiene efectos secundarios, sino que tampoco depende de efectos secundarios de otro código —por ejemplo, no lee asociaciones globales cuyo valor podría cambiar. Una función pura tiene la agradable propiedad de que, al llamarla con los mismos argumentos, siempre produce el mismo valor (y no hace nada más). Una llamada a una tal función puede sustituirse por su valor de retorno sin cambiar el significado del código. Cuando no estás seguro de si una función pura está funcionando correctamente, puedes probarla llamándola y saber que, si funciona en ese contexto, funcionará en cualquier otro contexto. Las funciones no puras tienden a requerir más andamiaje para probarlas.

{{index "optimización", "console.log"}}

Aún así, no hay que sentirse mal por escribir funciones que no son puras. Los efectos secundarios a menudo son útiles. No hay forma de escribir una versión pura de `console.log`, por ejemplo, y es bueno tener `console.log`. Algunas operaciones también son más fáciles de expresar de manera eficiente cuando usamos efectos secundarios.

## Resumen

Este capítulo te enseña cómo escribir tus propias funciones. La palabra clave `function`, cuando se usa como expresión, puede crear un valor de función. Cuando se usa como una declaración, puede usarse para declarar un enlace y darle una función como su valor. Las funciones flecha son otra forma de crear funciones.

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

Una parte clave del estudio de las funciones es comprender los ámbitos (scopes). Cada bloque crea un nuevo ámbito. Los parámetros y las enlaces declarados en un ámbito dado son locales y no son visibles desde el exterior. Las asociaciones declaradas con `var` se comportan de manera diferente: terminan en el ámbito de la función más cercana o en el ámbito global.

Separar las tareas que realiza tu programa en diferentes funciones es útil. No tendrás que repetirte tanto, y las funciones pueden ayudar a organizar un programa agrupando el código en trozos que hacen cosas específicas.

## Ejercicios

### Mínimo

{{index "Math object", "minimum (exercise)", "Math.min function", minimum}}

En el [capítulo previo](program_structure#return_values) se introdujo la función estándar `Math.min` que devuelve el menor de sus argumentos. Ahora podemos escribir una función como esa nosotros mismos. Define la función `min` que toma dos argumentos y devuelve su mínimo.

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

Si tienes problemas para colocar las llaves y paréntesis en el lugar correcto para obtener una definición de función válida, comienza copiando uno de los ejemplos de este capítulo y modifícalo.

{{index "return keyword"}}

Una función puede contener múltiples declaraciones `return`.

hint}}

### Recursión

{{index recursion, "isEven (exercise)", "even number"}}

Hemos visto que podemos usar `%` (el operador de resto) para verificar si un número es par o impar al usar `% 2` para ver si es divisible por dos. Aquí hay otra forma de definir si un número entero positivo es par o impar:

- El cero es par.

- El uno es impar.

- Para cualquier otro número _N_, su paridad es la misma que la de _N_ - 2.

Define una función recursiva `esPar` que corresponda a esta descripción. La función debe aceptar un solo parámetro (un número entero positivo) y devolver un booleano.

{{index "stack overflow"}}

Pruébalo con 50 y 75. Observa cómo se comporta con -1. ¿Por qué? ¿Puedes pensar en una forma de solucionarlo?

{{if interactive

```{test: no}
// Tu código aquí.

console.log(esPar(50));
// → true
console.log(esPar(75));
// → false
console.log(esPar(-1));
// → ??
```

if}}

{{hint

{{index "isEven (exercise)", ["if keyword", chaining], recursion}}

Es probable que tu función se parezca en cierta medida a la función interna `encontrar` en el ejemplo recursivo `encontrarSolucion` [ejemplo](functions#recursive_puzzle) de este capítulo, con una cadena `if`/`else if`/`else` que prueba cuál de los tres casos aplica. El `else` final, correspondiente al tercer caso, realiza la llamada recursiva. Cada una de las ramas debe contener una declaración `return` o de algún modo, asegurarse de que se devuelva un valor específico.

{{index "stack overflow"}}

Cuando se le da un número negativo, la función se llamará recursivamente una y otra vez, pasándose a sí misma un número cada vez más negativo, alejándose así más y más de devolver un resultado. Al final, el programa se quedará sin espacio en la pila cortará.

hint}}

### Contando minuciosamente

{{index "bean counting (exercise)", [string, indexing], "zero-based counting", ["length property", "for string"]}}

Puedes obtener el N-ésimo caracter, o letra, de una cadena escribiendo `[N]` después de la cadena (por ejemplo, `cadena[2]`). El valor resultante será una cadena que contiene solo un carácter (por ejemplo, `"b"`). El primer carácter tiene la posición 0, lo que hace que el último se encuentre en la posición `cadena.length - 1`. En otras palabras, una cadena de dos caracteres tiene longitud 2, y sus caracteres tienen posiciones 0 y 1.

Escribe una función `contarBs` que tome una cadena como único argumento y devuelva un número que indique cuántos caracteres B en mayúscula hay en la cadena.

A continuación, escribe una función llamada `contarCaracter` que se comporte como `contarBs`, excepto que toma un segundo argumento que indica el carácter que se va a contar (en lugar de contar solo caracteres B en mayúscula). Reescribe `contarBs` para hacer uso de esta nueva función.

{{if interactive

```{test: no}
// Tu código aquí.

console.log(contarBs("BOB"));
// → 2
console.log(contarCaracter("kakkerlak", "k"));
// → 4
```

if}}

{{hint

{{index "bean counting (exercise)", ["length property", "for string"], "counter variable"}}

Tu función necesita un ((bucle)) que mire cada carácter en la cadena. Puede recorrer un índice desde cero hasta uno menos que su longitud (`< string.length`). Si el caracter en la posición actual es el mismo que el que la función está buscando, agrega 1 a una variable contadora. Una vez que el bucle ha terminado, el contador puede ser devuelto.

{{index "local binding"}}

Ten cuidado de que todas las asociaciones utilizadas en la función sean _locales_ a la función, declarándolas correctamente con la palabra clave `let` o `const`.

hint}}
