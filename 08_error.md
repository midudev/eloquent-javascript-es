{{meta {load_files: ["code/chapter/08_error.js"]}}}

# Bugs y Errores

{{quote {author: "Brian Kernighan and P.J. Plauger", title: "The Elements of Programming Style", chapter: true}

Depurar es el doble de difícil que escribir el código por primera vez. Por lo tanto, si escribes el código de la manera más inteligente posible, no eres, por definición, lo suficientemente inteligente como para depurarlo.

quote}}

{{figure {url: "img/chapter_picture_8.jpg", alt: "Ilustración mostrando varios insectos y un ciempiés", chapter: framed}}}

{{index "Kernighan, Brian", "Plauger, P.J.", "depuración", "manejo de errores"}}

Los errores en los programas de computadora generalmente se llaman _((bug))s_. Los programadores nos sentimos mejor imaginándolos como pequeñas cosas que simplemente se meten en nuestro trabajo. Por supuesto, en realidad, somos nosotros mismos quienes los colocamos allí.

Si entendemos un programa como pensamiento cristalizado, podemos clasificar los errores más o menos en aquellos causados por pensamientos confusos y aquellos causados por errores introducidos al convertir un pensamiento en código. El primer tipo generalmente es más difícil de diagnosticar y arreglar que el último.º

## Lenguaje

{{index "análisis", parsing}}

Muchos errores podrían ser señalados automáticamente por la computadora si esta supiera lo suficiente sobre lo que estamos intentando hacer. Pero la laxitud de JavaScript es un obstáculo aquí. Su concepto de asociaciones y propiedades es lo suficientemente vago como para rara vez atrapar ((errata))s antes de ejecutar realmente el programa. E incluso entonces, todavía te permite hacer algunas cosas claramente absurdas sin quejarse, como calcular `true * "monkey"`.

{{index [sintaxis, error], [propiedad, acceso]}}

Hay algunas cosas sobre las que JavaScript sí que se queja. Escribir un programa que no siga la ((gramática)) del lenguaje hará que la computadora se queje de inmediato. Otras cosas, como llamar a algo que no es una función o buscar una propiedad en un valor ((undefined)) harán que se reporte un error cuando el programa intente realizar la acción.

{{index NaN, error}}

Pero a menudo, tu cálculo absurdo simplemente producirá `NaN` (not a number) o un valor indefinido, mientras que el programa continúa alegremente, convencido de que está haciendo algo con sentido. El error solo se pondrá de manifiesto más adelante, después de que el valor falso haya pasado ya por varias funciones. Es posible que no desencadene ningún error, sino que silenciosamente cause que la salida del programa sea incorrecta. Encontrar la fuente de tales problemas puede ser difícil.

El proceso de encontrar errores —bugs— en los programas se llama _((depuración))_ (en inglés, _debugging_).

## Modo estricto

{{index "modo estricto", [sintaxis, error], "función"}}

{{indexsee "use strict", "modo estricto"}}

Se puede hacer que JavaScript sea un _poco_ más estricto al habilitar el _modo estricto_. Esto se hace colocando la cadena `"use strict"` en la parte superior de un archivo o en el cuerpo de una función. Aquí tienes un ejemplo:

```{test: "error \"ReferenceError: counter is not defined\""}
function puedesEncontrarElProblema() {
  "use strict";
  for (contador = 0; contador < 10; contador++) {
    console.log("Happy happy");
  }
}

puedesEncontrarElProblema();
// → ReferenceError: contador is not defined
```

El código de dentro de una clase o un módulo (que veremos en el [Capítulo ?](modules)) se considera automáticamente en modo estricto. Se sigue manteniendo el comportamiento no estricto solo porque hay algo de código antiguo que podría quizá depender de él. De esta manera, los diseñadores del lenguaje evitan romper programas existentes.

{{index "let keyword", [binding, global]}}

Normalmente, cuando olvidas poner `let` frente a tu asociación, como en el caso de `counter` en el ejemplo, JavaScript silenciosamente crea un enlace global y lo utiliza. En modo,estricto, sin embargo, se reporta un ((error)). Esto es muy útil. No obstante, cabe mencionar que no aparecerá ningún mensaje de error cuando la asociación en cuestión ya existe en alguna parte del ámbito. En ese caso, el bucle igualmente sobrescribirá silenciosamente el valor de la asociación y seguirá con su tarea.

{{index "this binding", "global object", undefined, "strict mode"}}

Otro cambio en el modo estricto es que el enlace `this` tiene el valor `undefined` en funciones que no son llamadas como ((método))s. Al hacer una llamada de este tipo fuera del modo estricto, `this` se refiere al objeto del ámbito global, que es un objeto cuyas propiedades son los enlaces globales. Así que, si llamas incorrectamente a un método o constructor por error en modo estricto, JavaScript producirá un error tan pronto como intente leer algo de `this`, en lugar de escribir en el ámbito global.

Considera, por ejemplo, el siguiente código, que llama a una función ((constructor)) sin la palabra clave `new` para que su `this` _no_ se refiera a un objeto recién construido:

```
function Persona(nombre) { this.nombre = nombre; }
let ferdinand = Persona("Ferdinand"); // oops
console.log(nombre);
// → Ferdinand
```

{{index error}}

La llamada errónea a `Persona` ha tenido éxito pero ha devuelto un valor no definido y ha creado el enlace global `name`. En modo estricto, el resultado es diferente.

```{test: "error \"TypeError: Cannot set properties of undefined (setting 'name')\""}
"use strict";
function Persona(nombre) { this.nombre = nombre; }
let ferdinand = Persona("Ferdinand"); // falta el new
// → TypeError: Cannot set property 'nombre' of undefined
```

Inmediatamente se nos informa de que algo falla. Esto es útil.

Por suerte, los constructores creados con la notación `class` siempre se van a quejar si se llaman sin `new`, conque esto no será tanto problema incluso en modo no estricto.

{{index parameter, [binding, naming], "with statement"}}

El modo estricto hace algunas cosas más. Prohíbe darle a una función múltiples parámetros con el mismo nombre y elimina ciertas características problemáticas del lenguaje por completo (como la declaración `with`, que es tan incorrecta que ni se va a discutir más en este libro).

{{index debugging}}

En resumen, colocar `"use strict"` al principio de tu programa rara vez hace daño y podría ayudarte a identificar un problema.

## Tipos

Algunos lenguajes quieren saber los tipos de todas tus asociaciones y expresiones antes de ejecutar un programa. Te indicarán de inmediato cuando un tipo se utiliza de manera inconsistente. JavaScript considera los tipos solo cuando realmente se ejecuta el programa, e incluso allí a menudo intenta convertir valores implícitamente al tipo que espera, por lo que no es de mucha ayuda.

Aun así, los tipos proporcionan un marco útil para hablar sobre programas. Muchos errores surgen de la confusión acerca del tipo de valor que entra o sale de una función. Si tienes esa información escrita, es menos probable que te confundas. Podrías agregar un comentario como el siguiente antes de la función `findRoute` del capítulo anterior para describir su tipo:

```
// (graph: Object, from: string, to: string) => string[]
function findRoute(graph, from, to) {
  // ...
}
```

Existen varias convenciones diferentes para anotar programas de JavaScript con tipos.

Una cosa sobre los tipos es que necesitan introducir su propia complejidad para ser capaces de describir el suficiente código como para ser útiles. ¿Qué tipo crees que tendría la función `randomPick` que devuelve un elemento aleatorio de un array? Necesitarías introducir una _((variable de tipo))_, _T_, que pueda representar cualquier tipo, para que puedas darle a `randomPick` un tipo como `(T[]) → T` (función de un array de *T* a un *T*).

{{index "comprobación de tipos", TypeScript}}

{{id typing}}

Cuando los tipos de un programa son conocidos, es posible que la computadora los _verifique_ por ti, señalando errores antes de que se ejecute el programa. Hay varios dialectos de JavaScript que añaden tipos al lenguaje y los verifican. El más popular se llama [TypeScript](https://www.typescriptlang.org/). Si estás interesado en agregar más rigor a tus programas, te recomiendo que lo pruebes.

En este libro, continuaremos utilizando código JavaScript crudo, peligroso y sin tipos.

## Testing

{{index "suite de pruebas", "error en tiempo de ejecución", "automatización", pruebas}}

Si el lenguaje no nos va a ayudar mucho a encontrar errores, habrá que encontrarlos por las malas: ejecutando el programa y viendo si hace lo correcto.

Hacer esto manualmente, una y otra vez, es una idea muy mala. No solo es una lata, sino que tiende a ser ineficaz, ya que lleva demasiado tiempo probar exhaustivamente todo cada vez que haces un cambio.

Las computadoras son buenas en tareas repetitivas, y las pruebas (o el testing) son la tarea repetitiva ideal. Los tests automatizados son el proceso de escribir un programa que testea otro programa. Lleva algo más de trabajo escribir tests que hacer las pruebas a mano, pero una vez que lo has hecho, adquieres una especie de superpoder: solo te llevará unos segundos verificar que tu programa sigue comportándose correctamente en todas las situaciones para las que escribiste tus tests. Cuando rompes algo, lo notarás de inmediato en lugar de encontrártelo de casualidad más adelante.

{{index "método toUpperCase"}}

Los tests suelen ser pequeños programas etiquetados que verifican algún aspecto de tu código. Por ejemplo, un conjunto de tests para el (probablemente ya probado por alguien más) método `toUpperCase` estándar podría tener esta pinta:

```
function test(etiqueta, cuerpo) {
  if (!cuerpo()) console.log(`Fallo: ${etiqueta}`);
}

test("convertir texto latino a mayúsculas", () => {
  return "hola".toUpperCase() == "HOLA";
});
test("convertir texto griego a mayúsculas", () => {
  return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ";
});
test("no convertir caracteres sin mayúsculas", () => {
  return "مرحبا".toUpperCase() == "مرحبا";
});
```

{{index "lenguaje específico de dominio"}}

Escribir tests de esta manera tiende a generar código repetitivo y poco elegante. Por suerte, hay software que te ayuda a construir y ejecutar colecciones de tests (_((test suites))_) al proporcionar un lenguaje (en forma de funciones y métodos) adecuado para expresar tests y producir información descriptiva cuando un test falla. Estas herramientas suelen llamarse _((test runners))_.

{{index "estructura de datos persistente"}}

Hay códigos más fáciles de testar que otros. Generalmente, cuantos más objetos externos interactúan con el código, más difícil es configurar el contexto para testearlo. El estilo de programación que vimos en el [capítulo anterior](robot), que utiliza valores persistentes autocontenidos en lugar de objetos cambiantes, suele ser fácil de probar.

## Depuración

{{index debugging}}

Una vez que notas que hay algo mal en tu programa porque no se comporta como debe o produce errores, el siguiente paso es descubrir _cuál_ es el problema.

A veces es obvio. El mensaje de ((error)) señalará una línea específica de tu programa, y si miras la descripción del error y esa línea de código, a menudo puedes ver el problema.

{{index "error en tiempo de ejecución"}}

Pero no siempre. A veces la línea que desencadenó el problema es simplemente el primer lugar donde se utiliza de manera incorrecta un valor defectuoso producido en otro lugar. Si has estado resolviendo los ((ejercicios)) en capítulos anteriores, probablemente ya hayas experimentado estas situaciones.

{{index "número decimal", "número binario"}}

El siguiente programa de ejemplo intenta convertir un número entero en una cadena en una base dada (decimal, binaria, etc.) al seleccionar consecutivamente el último ((dígito)) y luego dividir el número para deshacerse de este dígito. Pero la extraña salida que produce actualmente sugiere que tiene un ((error)).

```
function númeroACadena(n, base = 10) {
  let resultado = "", signo = "";
  if (n < 0) {
    signo = "-";
    n = -n;
  }
  do {
    resultado = String(n % base) + resultado;
    n /= base;
  } while (n > 0);
  return signo + resultado;
}
console.log(númeroACadena(13, 10));
// → 1.5e-3231.3e-3221.3e-3211.3e-3201.3e-3191.3e-3181.3…
```

{{index analysis}}

Incluso si ya ves el problema, finge por un momento que no lo haces. Sabemos que nuestro programa no funciona correctamente, y queremos descubrir por qué.

{{index "ensayo y error"}}

Aquí es donde debes resistir la tentación de empezar a hacer cambios aleatorios en el código para ver si así mejora. En vez de eso, _piensa_. Analiza lo que está sucediendo y elabora una ((teoría)) sobre por qué podría estar ocurriendo. Luego, realiza observaciones adicionales para probar esta teoría, o, si aún no tienes una teoría, realiza observaciones adicionales para ayudarte a crear una.

{{index "console.log", salida, "depuración", registro}}

Colocar algunas llamadas a `console.log` estratégicamente en el programa es una buena manera de obtener información adicional sobre lo que este está haciendo. En este caso, queremos que `n` tome los valores `13`, `1` y luego `0`. Vamos a escribir su valor al inicio del bucle.

```{lang: null}
13
1.3
0.13
0.013
…
1.5e-323
```

{{index rounding}}

_Correcto_. Al dividir 13 por 10 no se produce un número entero. En lugar de `n /= base`, lo que realmente queremos es `n = Math.floor(n / base)` de manera que pasamos correctamente a calcular el siguiente dígito.

{{index "consola de JavaScript", "sentencia de depuración"}}

Una alternativa a usar `console.log` para observar el comportamiento del programa es utilizar las capacidades del _depurador_ de tu navegador. Los navegadores vienen con la capacidad de establecer un _((punto de interrupción))_ en una línea específica de tu código. Cuando la ejecución del programa llega a una línea con un punto de interrupción, esta se pausa y puedes inspeccionar los valores de las asignaciones o variables en ese punto. No entraré en detalles, ya que los depuradores difieren de un navegador a otro, pero busca en las ((herramientas de desarrollo)) de tu navegador o busca instrucciones en la web.

Otra forma de establecer un punto de interrupción es incluir una instrucción `debugger` (consistente únicamente en esa palabra clave) en tu programa. Si las herramientas de ((desarrollo)) de tu navegador están activas, el programa se pausará cada vez que alcance dicha instrucción.

## Propagación de errores

{{index entrada, salida, "error en tiempo de ejecución", error, "validación"}}

Lamentablemente, el programador no puede evitar todos los problemas. Si tu programa se comunica de alguna manera con el mundo exterior, es posible recibir entradas con el formato incorrecto, sobrecargarse de trabajo o que falle la red.

{{index "recuperación de errores"}}

Si estás programando solo para ti, puedes permitirte simplemente ignorar esos problemas hasta que ocurran. Pero si estás construyendo algo que será utilizado por alguien más, generalmente quieres que el programa haga algo más que simplemente colapsar. A veces lo correcto es aceptar la entrada errónea y continuar ejecutándose. En otros casos, lo mejor es informar al usuario sobre lo que salió mal y luego rendirse. Pero, en cualquier caso, el programa debe hacer algo activamente en respuesta al problema.

{{index "función promptNumber", "validación"}}

Imaginemos que tienes una función `solicitarNúmero` que solicita al usuario un número y lo devuelve. ¿Qué debería devolver si el usuario dice "naranja"?

{{index null, undefined, "valor de retorno", "valor de retorno especial"}}

Una opción es hacer que devuelva un valor especial. Algunas opciones comunes para tales valores son `null`, `undefined` o -1.

```{test: no}
function solicitarNúmero(pregunta) {
  let resultado = Number(prompt(pregunta));
  if (Number.isNaN(resultado)) return null;
  else return resultado;
}

console.log(solicitarNúmero("¿Cuántos árboles ves?"));
```

Ahora, cualquier código que llame a `solicitarNúmero` debe verificar si de verdad se leyó un número y, de no ser así, debe recuperarse de alguna manera, quizás volviendo a preguntar o completando con un valor predeterminado. O podría devolver nuevamente un valor especial a quién la llamó para indicar que no pudo hacer lo que se le pidió.

{{index "manejo de errores"}}

En muchas situaciones, sobre todo cuando los ((errores)) son comunes y el llamante debería tomarlos explícitamente en cuenta, devolver un valor especial es una buena manera de indicar un error. Sin embargo, tiene sus inconvenientes. Primero, ¿qué pasa si la función ya puede devolver todos los tipos posibles de valores? En tal función, tendrás que hacer algo como envolver el resultado en un objeto para poder distinguir el éxito del fracaso, de la misma manera que lo hace el método `next` en la interfaz del iterador.

```
function últimoElemento(array) {
  if (array.length == 0) {
    return {falló: true};
  } else {
    return {valor: array[array.length - 1]};
  }
}
```

{{index "valor de retorno especial", legibilidad}}

El segundo problema con devolver valores especiales es que puede hacer que el código sea incómodo de manejar. Si un fragmento de código llama a `solicitarNúmero` 10 veces, tendrá que verificar 10 veces si se devolvió `null`. Y si su respuesta al encontrar `null` es simplemente devolver `null` en sí mismo, los que llamen a la función a su vez tendrán que comprobarlo, y así sucesivamente.

## Excepciones

{{index "manejo de errores"}}

Cuando una función no puede proceder normalmente, lo que a menudo _queremos_ hacer es simplemente detener lo que estamos haciendo e ir directamente a un lugar que sepa cómo manejar el problema. Esto es lo que hace el _((manejo de excepciones))_.

{{index ["flujo de control", excepciones], "lanzar (excepción)", "palabra clave throw", "pila de llamadas"}}

Las excepciones son un mecanismo que hace posible que el código que se encuentra con un problema _lance_ (o _emita_) una excepción. Una excepción puede ser cualquier valor. Lanzar una es de alguna manera como un retorno de función supervitaminado: no solo se sale fuera de la función actual sino también de sus llamadores, hasta llegar a la primera llamada que inició la ejecución actual. Esto se llama _((desenrollar la pila))_. Recordarás la pila de llamadas a funciones que se mencionó en el [Capítulo ?](functions#stack). Una excepción recorre esta pila, descartando todos los contextos de llamada que encuentra.

{{index "manejo de errores", [sintaxis, "declaración"], "palabra clave catch"}}

Si las excepciones siempre fueran directamente hasta el final de la pila, no serían de mucha utilidad. Simplemente serían una forma alternativa de hacer que tu programa falle. Su poder radica en el hecho de que puede colocar "obstáculos" a lo largo de la pila para _capturar_ la excepción mientras viaja hacia afuera. Una vez que ha capturado una excepción, puede hacer algo con ella para resolver el problema y luego continuar ejecutando el programa.

Aquí tienes un ejemplo:

{{id look}}
```
function solicitarDirección(pregunta) {
  let resultado = prompt(pregunta);
  if (resultado.toLowerCase() == "izquierda") return "L";
  if (resultado.toLowerCase() == "derecha") return "R";
  throw new Error("Dirección inválida: " + resultado);
}

function mirar() {
  if (solicitarDirección("¿Hacia dónde?") == "L") {
    return "una casa";
  } else {
    return "dos osos enfadados";
  }
}

try {
  console.log("Ves", mirar());
} catch (error) {
  console.log("Algo salió mal: " + error);
}
```

{{index "manejo de excepciones", bloque, "palabra clave throw", "palabra clave try", "palabra clave catch"}}

La palabra clave `throw` se utiliza para lanzar una excepción. La captura de una excepción se realiza envolviendo un trozo de código en un bloque `try`, seguido de la palabra clave `catch`. Cuando el código en el bloque `try` provoca que se lance una excepción, se evalúa el bloque `catch`, con el nombre entre paréntesis vinculado al valor de la excepción. Cuando el bloque `catch` acabe, o cuando el bloque `try` finalice sin problemas, el programa continúa debajo de toda la instrucción `try/catch`.

{{index "depuración", "pila de llamadas", "Tipo de error"}}

En este caso, utilizamos el ((constructor)) `Error` para crear nuestro valor de excepción. Este es un constructor de JavaScript ((estándar)) que crea un objeto con una propiedad `message`. Las instancias de `Error` también recopilan información sobre la pila de llamadas que existía cuando se creó la excepción, lo que se conoce como una _((traza de pila))_. Esta información se almacena en la propiedad `stack` y puede ser útil al intentar depurar un problema: nos indica la función donde ocurrió el problema y qué funciones realizaron la llamada fallida.

{{index "manejo de excepciones"}}

Ten en cuenta que la función `mirar` ignora por completo la posibilidad de que `solicitarDirección` pueda fallar. Esta es la gran ventaja de las excepciones: el código de manejo de errores solo es necesario en el punto donde ocurre el error y en el punto donde se maneja. Las funciones intermedias pueden olvidarse por completo de ello.

Bueno, casi...

## Limpiando después de excepciones

{{index "manejo de excepciones", "limpieza", ["flujo de control", excepciones]}}

El resultado de una excepción es otro tipo de flujo de control. Cada acción que pueda causar una excepción, que es prácticamente cualquier llamada a función y acceso a propiedad, puede hacer que el control salga repentinamente de tu código.

Esto significa que, cuando el código tiene varios efectos secundarios, una excepción podría impedir que algunos de ellos ocurran, incluso si en el flujo de control "normal" parece que siempre deberían ejecutarse todos.

{{index "ejemplo de banco"}}

Aquí tienes un código bancario realmente malo.

```{includeCode: true}
const cuentas = {
  a: 100,
  b: 0,
  c: 20
};

function obtenerCuenta() {
  let nombreCuenta = prompt("Ingresa el nombre de una cuenta");
  if (!Object.hasOwn(cuentas, nombreCuenta)) {
    throw new Error(`No existe esa cuenta: ${nombreCuenta}`);
  }
  return nombreCuenta;
}

function transferir(desde, cantidad) {
  if (cuentas[desde] < cantidad) return;
  cuentas[desde] -= cantidad;
  cuentas[obtenerCuenta()] += cantidad;
}
```

La función `transferir` transfiere una suma de dinero desde una cuenta dada a otra, pidiendo el nombre de la otra cuenta en el proceso. Si se proporciona un nombre de cuenta inválido, `obtenerCuenta` lanza una excepción.

Pero `transferir` _primero_ retira el dinero de la cuenta y _luego_ llama a `obtenerCuenta` antes de agregarlo a otra cuenta. Si se interrumpe por una excepción en ese momento, simplemente hará desaparecer el dinero.

Ese código podría haber sido escrito de manera un poco más inteligente, por ejemplo, llamando a `obtenerCuenta` antes de comenzar a mover el dinero. Pero a menudo problemas como este ocurren de formas mucho más sutiles. Incluso funciones que aparentemente no lanzarían una excepción podrían hacerlo en circunstancias excepcionales o cuando contienen un error del programador.

Una manera de abordar este problema es utilizar menos efectos secundarios. De nuevo, un estilo de programación que calcule valores nuevos en lugar de cambiar datos existentes, ayuda. Si un fragmento de código deja de ejecutarse en medio de la creación de un nuevo valor, al menos no se dañan estructuras de datos existentes, lo que facilita la recuperación.

{{index block, "palabra clave try", "palabra clave finally"}}

Como eso no siempre es práctico, las instrucciones `try` tienen otra funcionalidad: pueden estar seguidas de un bloque `finally` en lugar o además de un bloque `catch`. Un bloque `finally` dice "sin importar _qué_ suceda, ejecuta este código después de intentar ejecutar el código en el bloque `try`."

```{includeCode: true}
function transferir(desde, cantidad) {
  if (cuentas[desde] < cantidad) return;
  let progreso = 0;
  try {
    cuentas[desde] -= cantidad;
    progreso = 1;
    cuentas[obtenerCuenta()] += cantidad;
    progreso = 2;
  } finally {
    if (progreso == 1) {
      cuentas[desde] += cantidad;
    }
  }
}
```

Esta versión de la función rastrea su progreso y, si al salir se da cuenta de que pasó algo en un punto donde había creado un estado del programa inconsistente, repara el daño causado. 

Cabe destacar que aunque el código `finally` se ejecuta cuando se lanza una excepción en el bloque `try`, no interfiere con la excepción. Después de que se ejecuta el bloque `finally`, la pila continúa desenrollándose.

{{index "excepción de seguridad"}}

Escribir programas que funcionen de manera fiable incluso cuando surgen excepciones en lugares inesperados es difícil. Mucha gente simplemente no se preocupa, y debido a que las excepciones suelen reservarse para circunstancias excepcionales, el problema puede ocurrir tan raramente que ni siquiera se note. Si eso es algo bueno o realmente malo depende de cuánto daño causará el software cuando falle.

## Captura selectiva

{{index "excepción no capturada", "manejo de excepciones", "consola de JavaScript", "herramientas para desarrolladores", "pila de llamadas", error}}

Cuando una excepción llega hasta el final de la pila sin ser capturada, es manejada por el entorno. Lo que esto significa difiere según los entornos. En los navegadores, generalmente se escribe una descripción del error en la consola de JavaScript (accesible a través del menú Herramientas o Desarrollador del navegador). Node.js, el entorno de JavaScript sin navegador del que hablaremos en el [Capítulo ?](node), es más cuidadoso con la corrupción de datos. Abortará todo el proceso cuando ocurra una excepción no manejada.

{{index crash, "manejo de errores"}}

Para errores de programación, a menudo dejar que el error siga su curso es lo mejor que se puede hacer. Una excepción no manejada es una forma razonable de señalar un programa defectuoso, y la consola de JavaScript proporcionará, en navegadores modernos, información sobre qué llamadas a funciones estaban en la pila cuando ocurrió el problema.

{{index "interfaz de usuario"}}

Para problemas que se _espera_ que puedan ocurrir de normal, fallar con una excepción no manejada es una muy mala estrategia.

{{index ["función", "aplicación"], "manejo de excepciones", "tipo de error", [enlace, indefinido]}}

Usos incorrectos del lenguaje, como hacer referencia a un enlace inexistente, buscar una propiedad en `null` o llamar a algo que no es una función, también provocarán que se lancen excepciones. Estas excepciones también pueden ser capturadas.

{{index "palabra clave catch"}}

Cuando se entra en un cuerpo `catch`, todo lo que sabemos es que _algo_ en nuestro cuerpo `try` causó una excepción. Pero no sabemos _qué_ lo hizo ni _qué_ excepción causó.

{{index "manejo de excepciones"}}

JavaScript (en una omisión bastante evidente) no proporciona un soporte directo para capturar excepciones selectivamente: o las capturas todas o no capturas ninguna. Esto hace que sea tentador _asumir_ que la excepción que obtienes es la que tenías en mente cuando escribiste el bloque `catch`.

{{index "función promptDirection"}}

Pero podría no serlo. Algún otro ((supuesto)) podría no cumplirse, o puede que hayas introducido un error que está causando una excepción. Aquí tienes un ejemplo que _intenta_ seguir llamando a `solicitarDirección` hasta obtener una respuesta válida:

```{test: no}
for (;;) {
  try {
    let dir = soliitarDirección("¿Dónde?"); // ← ¡Error de tipeo!
    console.log("Elegiste ", dir);
    break;
  } catch (e) {
    console.log("Dirección no válida. Inténtalo de nuevo.");
  }
}
```

{{index "bucle infinito", "bucle for", "palabra clave catch", "depuración"}}

La construcción `for (;;)` es una forma de crear intencionalmente un bucle que no se termina por sí mismo. Salimos del bucle solo cuando se proporciona una dirección válida. _Pero_ escribimos mal `solicitarDirección`, lo que resultará en un error de "variable no definida". Debido a que el bloque `catch` ignora por completo el valor de la excepción (`e`), trata erróneamente el error de asociación mal escrita al asumir que sabe cuál es el problema, indicando entonces que el problema se debió a una entrada incorrecta. Esto no solo causa un bucle infinito, sino que también "entierra" el útil mensaje de error sobre el enlace mal escrito.

Como regla general, no captures excepciones indiscriminadamente a menos que sea con el propósito de "enviarlas" a algún lugar, por ejemplo, a través de la red para informar a otro sistema de que nuestro programa se bloqueó. E incluso en ese caso, piensa cuidadosamente cómo podrías estar ocultando información.

{{index "manejo de excepciones"}}

Queremos capturar un tipo _específico_ de excepción. Podemos hacer esto verificando en el bloque `catch` si la excepción que recibimos es la que nos interesa y relanzándola en caso contrario. Pero, ¿cómo reconocemos una excepción?

Podríamos comparar su propiedad `message` con el mensaje de ((error)) que esperamos. Pero esta es una forma poco fiable de escribir código, estaríamos utilizando información diseñada para consumo humano (el mensaje) para tomar una decisión programática. Tan pronto como alguien cambie (o traduzca) el mensaje, el código dejará de funcionar.

{{index "tipo de Error", "operador instanceof", "función promptDirection"}}

En lugar de eso, definamos un nuevo tipo de error y usemos `instanceof` para identificarlo.

```{includeCode: true}
class InputError extends Error {}

function solicitarDirección(pregunta) {
  let resultado = prompt(pregunta);
  if (resultado.toLowerCase() == "izquierda") return "I";
  if (resultado.toLowerCase() == "derecha") return "D";
  throw new InputError("Dirección no válida: " + resultado);
}
```

{{index "palabra clave throw", herencia}}

La nueva clase de error extiende la clase `Error`. No define su propio constructor, lo que significa que hereda el constructor de `Error`, que espera un mensaje de cadena como argumento. De hecho, no define nada en absoluto, la clase está vacía. Los objetos `InputError` se comportan como objetos `Error`, excepto que tienen una clase diferente mediante la cual podemos reconocerlos.

{{index "manejo de excepciones"}}

Ahora el bucle puede capturar esto con más cuidado.

```{test: no}
for (;;) {
  try {
    let dir = solicitarDirección("¿Dónde?");
    console.log("Elegiste ", dir);
    break;
  } catch (e) {
    if (e instanceof InputError) {
      console.log("Dirección no válida. Inténtalo de nuevo.");
    } else {
      throw e;
    }
  }
}
```

{{index "depuración"}}

Esto capturará solo instancias de `InputError` y permitirá que cualquier excepción no relacionada pase sin más (solamente lanzando el error). Si vuelves a introducir el error de tipeo, el error de enlace no definido se informará correctamente.

## Asertos

{{index "función assert", "afirmación", "depuración"}}

Los _asertos_ son verificaciones dentro de un programa que aseguran que algo es como se supone que debe ser. Se utilizan no para manejar situaciones que pueden surgir con un uso normal del programa, sino para encontrar errores del programador.

Si, por ejemplo, se describe `primerElemento` como una función que nunca debería ser llamada en arrays vacíos, podríamos escribirla de la siguiente manera:

```
function primerElemento(array) {
  if (array.length == 0) {
    throw new Error("primerElemento llamado con []");
  }
  return array[0];
}
```

{{index "validación", "error en tiempo de ejecución", fallo, "suposición"}}

Ahora, en lugar de devolver silenciosamente `undefined` (que es lo que obtienes al leer una propiedad de un array que no existe), esto hará que tu programa falle "ruidosamente" tan pronto como lo uses incorrectamente. Esto hace que sea menos probable que tales errores pasen desapercibidos y más fácil encontrar su causa cuando ocurran.

No recomiendo intentar escribir afirmaciones para cada tipo de entrada incorrecta posible. Eso sería mucho trabajo y llevaría a un código muy ruidoso. Querrás reservarlas para errores que son fáciles de cometer (o que veas que estás cometiendo).

## Resumen

Una parte importante de programar es encontrar, diagnosticar y corregir errores. Los problemas pueden ser más fáciles de notar si tienes un conjunto de tests automatizados o agregas asertos a tus programas.

Los problemas causados por factores fuera del control del programa generalmente deberían ser planificados activamente. A veces, cuando el problema puede ser manejado localmente, los valores de retorno especiales son una buena forma de rastrearlos. De lo contrario, puede ser preferible usar excepciones.

Lanzar una excepción provoca que la pila de llamadas se desenrolle hasta el próximo bloque `try/catch` envolvente o hasta la base de la pila. El valor de la excepción será entregado al bloque `catch` que la captura, el cual debe verificar que sea realmente el tipo de excepción esperado y luego hacer algo con él. Para ayudar a abordar el flujo de control impredecible causado por las excepciones, se pueden utilizar bloques `finally` para asegurar que un trozo de código se ejecute _siempre_ cuando un bloque termina.

## Ejercicios

### Reintentar

{{index "primitiveMultiply (exercise)", "manejo de excepciones", "palabra clave throw"}}

Imagina que tienes una función `primitiveMultiply` que en el 20 por ciento de los casos multiplica dos números y en el otro 80 por ciento arroja una excepción del tipo `MultiplicatorUnitFailure`. Escribe una función que envuelva esta función problemática y siga intentando hasta que una llamada tenga éxito, momento en el que devuelva el resultado.

{{index "palabra clave catch"}}

Asegúrate de manejar solo las excepciones que estás intentando manejar.

{{if interactive

```{test: no}
class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  // Tu código aquí.
}

console.log(reliableMultiply(8, 8));
// → 64
```
if}}

{{hint

{{index "primitiveMultiply (exercise)", "palabra clave try", "palabra clave catch", "palabra clave throw"}}

La llamada a `primitiveMultiply` definitivamente debería ocurrir en un bloque `try`. El bloque `catch` correspondiente debería relanzar la excepción cuando no sea una instancia de `MultiplicatorUnitFailure` y asegurarse de que la llamada se reintente cuando lo sea.

Para hacer el reintento, puedes usar un bucle que se detenga solo cuando una llamada tiene éxito, como en el ejemplo de [`mirar`](error#look) anterior en este capítulo, o usar la ((recursión)) y esperar que no tengas una cadena tan larga de fallos que colapse la pila (lo cual es bastante improbable).

hint}}

### La caja cerrada con llave

Considera el siguiente objeto (bastante artificial):

```
const box = new class {
  locked = true;
  #content = [];

  unlock() { this.locked = false; }
  lock() { this.locked = true;  }
  get content() {
    if (this.locked) throw new Error("¡Cerrado con llave!");
    return this.#content;
  }
};
```

{{index "private property", "access control"}}

Es una ((caja)) con una cerradura. Hay un array en la caja, pero solo puedes acceder a él cuando la caja está desbloqueada.

{{index "finally keyword", "exception handling"}}

Escribe una función llamada `withBoxUnlocked` que reciba como argumento un valor de función, desbloquee la caja, ejecute la función y luego asegure que la caja esté cerrada de nuevo antes de devolverla, independientemente de si la función de argumento terminó con normalidad o lanzó una excepción.

{{if interactive

```
const box = new class {
  locked = true;
  #content = [];

  unlock() { this.locked = false; }
  lock() { this.locked = true;  }
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this.#content;
  }
};

function withBoxUnlocked(body) {
  // Your code here.
}

withBoxUnlocked(() => {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(() => {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
}
console.log(box.locked);
// → true
```

if}}

Para más puntos, asegúrate de que si llamas a `withBoxUnlocked` cuando la caja ya está desbloqueada, la caja permanezca desbloqueada.

{{hint

{{index "locked box (exercise)", "finally keyword", "try keyword"}}

En este ejercicio, es posible que desees usar `try` y `finally` juntos. Tu función debería desbloquear la caja y luego llamar a la función de argumento desde dentro de un bloque `try`. El bloque `finally` después de él debería volver a bloquear la caja.

Para asegurarte de que no bloquees la caja cuando no estaba bloqueada, verifica su bloqueo al comienzo de la función y desbloquéala y bloquéala solo cuando comenzó bloqueada.

hint}}