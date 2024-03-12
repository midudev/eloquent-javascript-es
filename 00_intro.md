{{meta {load_files: ["code/intro.js"]}}}

# Introducción

{{quote {author: "Ellen Ullman", title: "Cerca de la máquina: Tecnofilia y sus Descontentos", chapter: true}

Creemos que estamos creando el sistema para nuestros propios propósitos. Creemos que lo estamos haciendo a nuestra propia imagen... Pero la computadora en realidad no es como nosotros. Es una proyección de una parte muy delgada de nosotros mismos: esa parte dedicada a la lógica, el orden, la regla y la claridad.

quote}}

{{figure {url: "img/chapter_picture_00.jpg", alt: "Ilustración de un destornillador junto a una placa de circuitos de aproximadamente el mismo tamaño", chapter: "framed"}}}

Este es un libro sobre cómo instruir a ((computadora))s. Las computadoras son tan comunes como los destornilladores hoy en día, pero son bastante más complejas, y hacer que hagan lo que quieres que hagan no siempre es fácil.

Si la tarea que tienes para tu computadora es común, bien entendida, como mostrarte tu correo electrónico o actuar como una calculadora, puedes abrir la ((aplicación)) correspondiente y ponerte a trabajar. Pero para tareas únicas o abiertas, a menudo no hay una aplicación adecuada.

Ahí es donde entra en juego la ((programming)). _Programar_ es el acto de construir un _programa_—un conjunto de instrucciones precisas que le dicen a una computadora qué hacer. Debido a que las computadoras son bestias tontas y pedantes, programar es fundamentalmente tedioso y frustrante.

{{index [programming, "joy of"], speed}}

Afortunadamente, si puedes superar ese hecho—e incluso disfrutar del rigor de pensar en términos que las máquinas tontas pueden manejar—programar puede ser gratificante. Te permite hacer cosas en segundos que tardarían _una eternidad_ a mano. Es una forma de hacer que tu herramienta informática haga cosas que antes no podía hacer. Además, se convierte en un maravilloso juego de resolución de acertijos y pensamiento abstracto.

La mayoría de la programación se realiza con ((lenguajes de programación)). Un _lenguaje de programación_ es un lenguaje artificialmente construido utilizado para instruir a las computadoras. Es interesante que la forma más efectiva que hemos encontrado para comunicarnos con una computadora se base tanto en la forma en que nos comunicamos entre nosotros. Al igual que los idiomas humanos, los lenguajes informáticos permiten combinar palabras y frases de nuevas formas, lo que permite expresar conceptos cada vez más nuevos.

{{index [JavaScript, "availability of"], "casual computing"}}

En un momento dado, las interfaces basadas en lenguajes, como los mensajes de BASIC y DOS de los años 1980 y 1990, eran el principal método de interactuar con las computadoras. Para el uso informático rutinario, estas se han reemplazado en gran medida por interfaces visuales, que son más fáciles de aprender pero ofrecen menos libertad. Pero si sabes dónde buscar, los lenguajes todavía están ahí. Uno de ellos, _JavaScript_, está integrado en cada navegador web moderno—y por lo tanto está disponible en casi todos los dispositivos.

{{indexsee "web browser", browser}}

Este libro intentará que te familiarices lo suficiente con este lenguaje para hacer cosas útiles y entretenidas con él.

## Sobre la programación

{{index [programming, "difficulty of"]}}

Además de explicar JavaScript, presentaré los principios básicos de la programación. La programación, resulta, es difícil. Las reglas fundamentales son simples y claras, pero los programas construidos sobre estas reglas tienden a volverse lo suficientemente complejos como para introducir sus propias reglas y complejidades. Estás construyendo tu propio laberinto, de alguna manera, y fácilmente puedes perderte en él.

{{index aprendizaje}}

Habrá momentos en los que leer este libro resulte terriblemente frustrante. Si eres nuevo en la programación, habrá mucho material nuevo que asimilar. Gran parte de este material luego se combinará de maneras que requieren que hagas conexiones adicionales.

Depende de ti hacer el esfuerzo necesario. Cuando te cueste seguir el libro, no saques conclusiones precipitadas sobre tus propias capacidades. Estás bien, simplemente necesitas seguir adelante. Tómate un descanso, vuelve a leer algo de material y asegúrate de leer y comprender los programas de ejemplo y los ((ejercicios)). Aprender es un trabajo duro, pero todo lo que aprendas será tuyo y facilitará aún más el aprendizaje futuro.

{{quote {autor: "Ursula K. Le Guin", título: "La mano izquierda de la oscuridad"}

{{index "Le Guin, Ursula K."}}

Cuando la acción se vuelve poco rentable, recopila información; cuando la información se vuelve poco rentable, duerme.

quote}}

{{index [programa, "naturaleza de"], datos}}

Un programa es muchas cosas. Es un trozo de texto escrito por un programador, es la fuerza directiva que hace que la computadora haga lo que hace, es información en la memoria de la computadora, y al mismo tiempo controla las acciones realizadas en esta memoria. Las analogías que intentan comparar los programas con objetos familiares tienden a quedarse cortas. Una comparación vagamente adecuada es comparar un programa con una máquina: suelen estar implicadas muchas partes separadas y, para hacer que todo funcione, debemos considerar las formas en que estas partes se interconectan y contribuyen a la operación del conjunto.

Una ((computadora)) es una máquina física que actúa como anfitriona de estas máquinas inmateriales. Las computadoras mismas solo pueden hacer cosas increíblemente sencillas. La razón por la que son tan útiles es que hacen estas cosas a una velocidad increíblemente alta. Un programa puede combinar ingeniosamente un número enorme de estas acciones simples para hacer cosas muy complicadas.

{{index [programación, "alegría de"]}}

Un programa es una construcción del pensamiento. Es gratuito de construir, es liviano y crece fácilmente bajo nuestras manos al teclear. Pero a medida que un programa crece, también lo hace su ((complejidad)). La habilidad de programar es la habilidad de construir programas que no te confundan a ti mismo. Los mejores programas son aquellos que logran hacer algo interesante mientras siguen siendo fáciles de entender.

{{index "estilo de programación", "mejores prácticas"}}

Algunos programadores creen que esta complejidad se gestiona mejor utilizando solo un conjunto pequeño de técnicas bien comprendidas en sus programas. Han compuesto reglas estrictas ("mejores prácticas") que prescriben la forma que deberían tener los programas y se mantienen cuidadosamente dentro de su pequeña zona segura.

{{index experimento}}

Esto no solo es aburrido, sino que es ineficaz. A menudo, nuevos problemas requieren soluciones nuevas. El campo de la programación es joven y aún se está desarrollando rápidamente, y es lo suficientemente variado como para tener espacio para enfoques radicalmente diferentes. Hay muchos errores terribles que cometer en el diseño de programas, y deberías ir y cometerlos al menos una vez para entenderlos. Una noción de cómo es un buen programa se desarrolla con la práctica, no se aprende de una lista de reglas.## Por qué importa el lenguaje

{{index "lenguaje de programación", "código de máquina", "datos binarios"}}

Al principio, en los inicios de la informática, no existían los lenguajes de programación. Los programas lucían algo así:

```{lang: null}
00110001 00000000 00000000
00110001 00000001 00000001
00110011 00000001 00000010
01010001 00001011 00000010
00100010 00000010 00001000
01000011 00000001 00000000
01000001 00000001 00000001
00010000 00000010 00000000
01100010 00000000 00000000
```

{{index [programación, "historia de"], "tarjeta perforada", complejidad}}

Este es un programa para sumar los números del 1 al 10 y mostrar el resultado: `1 + 2 + ... + 10 = 55`. Podría ejecutarse en una máquina hipotética simple. Para programar los primeros ordenadores, era necesario configurar grandes conjuntos de interruptores en la posición correcta o perforar agujeros en tiras de cartón y alimentarlos al ordenador. Puedes imaginar lo tedioso y propenso a errores que era este procedimiento. Incluso escribir programas simples requería mucha astucia y disciplina. Los complejos eran casi inconcebibles.

{{index bit, "mago (poderoso)"}}

Por supuesto, introducir manualmente estos patrones arcanos de bits (los unos y ceros) hacía que el programador se sintiera como un mago poderoso. Y eso debe valer algo en términos de satisfacción laboral.

{{index memoria, instrucción}}

Cada línea del programa anterior contiene una única instrucción. Podría escribirse en inglés de la siguiente manera:

 1. Almacena el número 0 en la ubicación de memoria 0.
 2. Almacena el número 1 en la ubicación de memoria 1.
 3. Almacena el valor de la ubicación de memoria 1 en la ubicación de memoria 2.
 4. Resta el número 11 al valor en la ubicación de memoria 2.
 5. Si el valor en la ubicación de memoria 2 es el número 0, continúa con la instrucción 9.
 6. Suma el valor de la ubicación de memoria 1 a la ubicación de memoria 0.
 7. Añade el número 1 al valor de la ubicación de memoria 1.
 8. Continúa con la instrucción 3.
 9. Muestra el valor de la ubicación de memoria 0.

{{index legibilidad, nomenclatura, enlace}}

Aunque eso ya es más legible que la sopa de bits, sigue siendo bastante oscuro. Usar nombres en lugar de números para las instrucciones y las ubicaciones de memoria ayuda:

```{lang: "null"}
 Establecer “total” en 0.
 Establecer “count” en 1.
[bucle]
 Establecer “compare” en “count”.
 Restar 11 de “compare”.
 Si “compare” es cero, continuar en [fin].
 Sumar “count” a “total”.
 Añadir 1 a “count”.
 Continuar en [bucle].
[fin]
 Mostrar “total”.
```

{{index bucle, salto, "ejemplo de suma"}}

¿Puedes ver cómo funciona el programa en este punto? Las dos primeras líneas asignan los valores iniciales a dos ubicaciones de memoria: `total` se utilizará para construir el resultado de la computación, y `count` llevará la cuenta del número que estamos observando en ese momento. Las líneas que utilizan `compare` probablemente sean las más confusas. El programa quiere ver si `count` es igual a 11 para decidir si puede dejar de ejecutarse. Debido a que nuestra máquina hipotética es bastante primitiva, solo puede comprobar si un número es cero y tomar una decisión en función de ese valor. Por lo tanto, utiliza la ubicación de memoria etiquetada como `compare` para calcular el valor de `count - 11` y tomar una decisión basada en ese valor. Las siguientes dos líneas suman el valor de `count` al resultado e incrementan `count` en 1 cada vez que el programa decide que `count` aún no es 11.Aquí está el mismo programa en JavaScript:

```
let total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
// → 55
```

{{index "bucle while", bucle, [llaves, bloque]}}

Esta versión nos proporciona algunas mejoras. Lo más importante es que ya no es necesario especificar la forma en que queremos que el programa salte hacia adelante y hacia atrás; la construcción `while` se encarga de eso. Continúa ejecutando el bloque (entre llaves) debajo de él siempre y cuando se cumpla la condición que se le ha dado. Esa condición es `count <= 10`, lo que significa "el recuento es menor o igual a 10". Ya no tenemos que crear un valor temporal y compararlo con cero, lo cual era simplemente un detalle no interesante. Parte del poder de los lenguajes de programación es que pueden encargarse de los detalles no interesantes por nosotros.

{{index "console.log"}}

Al final del programa, después de que la construcción `while` haya terminado, se utiliza la operación `console.log` para escribir el resultado.

{{index "función de suma", "función de rango", abstracción, función}}

Finalmente, así es como podría verse el programa si tuviéramos a nuestra disposición las operaciones convenientes `rango` y `suma`, que respectivamente crean una colección de números dentro de un rango y calculan la suma de una colección de números:

```{startCode: true}
console.log(suma(rango(1, 10)));
// → 55
```

{{index legibilidad}}

La moraleja de esta historia es que el mismo programa puede expresarse de formas largas y cortas, ilegibles y legibles. La primera versión del programa era extremadamente oscura, mientras que esta última es casi en inglés: `registra` la `suma` del `rango` de números del 1 al 10. (Veremos en [capítulos posteriores](data) cómo definir operaciones como `suma` y `rango`.)

{{index ["lenguaje de programación", "poder de"], composabilidad}}

Un buen lenguaje de programación ayuda al programador al permitirle hablar sobre las acciones que la computadora debe realizar a un nivel más alto. Ayuda a omitir detalles, proporciona bloques de construcción convenientes (como `while` y `console.log`), te permite definir tus propios bloques de construcción (como `suma` y `rango`), y hace que esos bloques sean fáciles de componer.

## ¿Qué es JavaScript?

{{index historia, Netscape, navegador, "aplicación web", JavaScript, [JavaScript, "historia de"], "World Wide Web"}}

{{indexsee WWW, "World Wide Web"}}

JavaScript fue introducido en 1995 como una forma de agregar programas a páginas web en el navegador Netscape Navigator. Desde entonces, el lenguaje ha sido adoptado por todos los demás navegadores web gráficos principales. Ha hecho posibles aplicaciones web modernas, es decir, aplicaciones con las que puedes interactuar directamente sin tener que recargar la página para cada acción. JavaScript también se utiliza en sitios web más tradicionales para proporcionar distintas formas de interactividad e ingenio.

{{index Java, nombre}}

Es importante tener en cuenta que JavaScript casi no tiene nada que ver con el lenguaje de programación llamado Java. El nombre similar fue inspirado por consideraciones de marketing en lugar de un buen juicio. Cuando se estaba introduciendo JavaScript, el lenguaje Java se estaba comercializando mucho y ganaba popularidad. Alguien pensó que era una buena idea intentar aprovechar este éxito. Ahora estamos atrapados con el nombre.

{{index ECMAScript, compatibilidad}}

Después de su adopción fuera de Netscape, se escribió un ((documento estándar)) para describir la forma en que debería funcionar el lenguaje JavaScript para que las diversas piezas de software que afirmaban soportar JavaScript pudieran asegurarse de que realmente proporcionaban el mismo lenguaje. Esto se llama el estándar ECMAScript, según la organización Ecma International que llevó a cabo la estandarización. En la práctica, los términos ECMAScript y JavaScript se pueden usar indistintamente, son dos nombres para el mismo lenguaje.

{{index JavaScript, "debilidades de", depuración}}

Hay quienes dirán cosas _terribles_ sobre JavaScript. Muchas de esas cosas son ciertas. Cuando me pidieron que escribiera algo en JavaScript por primera vez, rápidamente llegué a detestarlo. Aceptaba casi cualquier cosa que escribía pero lo interpretaba de una manera completamente diferente a lo que yo quería decir. Esto tenía mucho que ver con el hecho de que no tenía ni idea de lo que estaba haciendo, por supuesto, pero hay un problema real aquí: JavaScript es ridículamente liberal en lo que permite. La idea detrás de este diseño era que haría la programación en JavaScript más fácil para principiantes. En realidad, esto hace que encontrar problemas en tus programas sea más difícil porque el sistema no te los señalará.

{{index JavaScript, "flexibilidad de"}}

Esta flexibilidad también tiene sus ventajas. Deja espacio para técnicas imposibles en lenguajes más rígidos y permite un estilo de programación agradable e informal. Después de ((aprender)) el lenguaje adecuadamente y trabajar con él durante un tiempo, he llegado a realmente _gustarme_ JavaScript.

{{index futuro, [JavaScript, "versiones de"], ECMAScript, "ECMAScript 6"}}

Ha habido varias versiones de JavaScript. La versión ECMAScript 3 fue la versión ampliamente soportada durante el ascenso al dominio de JavaScript, aproximadamente entre 2000 y 2010. Durante este tiempo, se estaba trabajando en una versión ambiciosa 4, la cual planeaba una serie de mejoras y extensiones radicales al lenguaje. Cambiar un lenguaje vivo y ampliamente utilizado de esa manera resultó ser políticamente difícil, y el trabajo en la versión 4 fue abandonado en 2008. Una versión mucho menos ambiciosa 5, que solo realizaba algunas mejoras no controversiales, salió en 2009. En 2015, salió la versión 6, una actualización importante que incluía algunas de las ideas previstas para la versión 4. Desde entonces, hemos tenido nuevas actualizaciones pequeñas cada año.

El hecho de que JavaScript esté evolucionando significa que los navegadores tienen que mantenerse constantemente al día. Si estás usando un navegador más antiguo, es posible que no admita todas las funciones. Los diseñadores del lenguaje se aseguran de no realizar cambios que puedan romper programas existentes, por lo que los nuevos navegadores aún pueden ejecutar programas antiguos. En este libro, estoy utilizando la versión 2023 de JavaScript.

{{index [JavaScript, "usos de"]}}

Los navegadores web no son las únicas plataformas en las que se utiliza JavaScript. Algunas bases de datos, como MongoDB y CouchDB, utilizan JavaScript como su lenguaje de secuencias de comandos y consulta. Varias plataformas para programación de escritorio y servidores, especialmente el proyecto ((Node.js)) (el tema del [Capítulo ?](node)), proporcionan un entorno para programar en JavaScript fuera del navegador.## Código y qué hacer con él

{{index "leer código", "escribir código"}}

El _código_ es el texto que constituye los programas. La mayoría de los capítulos en este libro contienen bastante código. Creo que leer código y escribir ((código)) son partes indispensables de ((aprender)) a programar. Intenta no solo echar un vistazo a los ejemplos, léelos atentamente y entiéndelos. Esto puede ser lento y confuso al principio, pero te prometo que pronto le tomarás la mano. Lo mismo ocurre con los ((ejercicios)). No des por sentado que los entiendes hasta que hayas escrito realmente una solución que funcione.

{{index interpretación}}

Te recomiendo que pruebes tus soluciones a los ejercicios en un intérprete de JavaScript real. De esta manera, obtendrás comentarios inmediatos sobre si lo que estás haciendo funciona, y, espero, te tentarás a ((experimentar)) y a ir más allá de los ejercicios.

{{if interactive

Cuando leas este libro en tu navegador, puedes editar (y ejecutar) todos los programas de ejemplo haciendo clic en ellos.

if}}

{{if book

{{index descargar, sandbox, "ejecutar código"}}

La forma más sencilla de ejecutar el código de ejemplo en el libro —y de experimentar con él— es buscarlo en la versión en línea del libro en [_https://eloquentjavascript.net_](https://eloquentjavascript.net/). Allí, puedes hacer clic en cualquier ejemplo de código para editarlo y ejecutarlo, y ver la salida que produce. Para trabajar en los ejercicios, ve a [_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code), que proporciona el código inicial para cada ejercicio de programación y te permite ver las soluciones.

if}}

{{index "herramientas de desarrollo", "consola de JavaScript"}}

Ejecutar los programas definidos en este libro fuera del sitio web del libro requiere cierto cuidado. Muchos ejemplos son independientes y deberían funcionar en cualquier entorno de JavaScript. Pero el código en los capítulos posteriores a menudo está escrito para un entorno específico (navegador o Node.js) y solo puede ejecutarse allí. Además, muchos capítulos definen programas más grandes, y las piezas de código que aparecen en ellos dependen unas de otras o de archivos externos. El [sandbox](https://eloquentjavascript.net/code) en el sitio web proporciona enlaces a archivos ZIP que contienen todos los scripts y archivos de datos necesarios para ejecutar el código de un capítulo dado.

## Visión general de este libro

Este libro consta aproximadamente de tres partes. Los primeros 12 capítulos tratan sobre el lenguaje JavaScript. Los siguientes siete capítulos son acerca de los navegadores web y la forma en que se utiliza JavaScript para programarlos. Por último, dos capítulos están dedicados a ((Node.js)), otro entorno para programar en JavaScript. Hay cinco _capítulos de proyectos_ en el libro que describen programas de ejemplo más grandes para darte una idea de la programación real.

La parte del lenguaje del libro comienza con cuatro capítulos que introducen la estructura básica del lenguaje JavaScript. Discuten las [estructuras de control](program_structure) (como la palabra `while` que viste en esta introducción), las [funciones](functions) (escribir tus propios bloques de construcción) y las [estructuras de datos](data). Después de estos, serás capaz de escribir programas básicos. Luego, los Capítulos [?](higher_order) y [?](object) introducen técnicas para usar funciones y objetos para escribir código más _abstracto_ y mantener la complejidad bajo control.Después de un [primer capítulo del proyecto](robot) que construye un robot de entrega rudimentario, la parte del lenguaje del libro continúa con capítulos sobre [manejo de errores y corrección de errores](error), [expresiones regulares](regexp) (una herramienta importante para trabajar con texto), [modularidad](modules) (otra defensa contra la complejidad) y [programación asíncrona](async) (tratando con eventos que toman tiempo). El [segundo capítulo del proyecto](language), donde implementamos un lenguaje de programación, concluye la primera parte del libro.

La segunda parte del libro, de los capítulos [?](browser) a [?](paint), describe las herramientas a las que tiene acceso JavaScript en un navegador. Aprenderás a mostrar cosas en la pantalla (Capítulos [?](dom) y [?](canvas)), responder a la entrada del usuario ([Capítulo ?](event)) y comunicarte a través de la red ([Capítulo ?](http)). Nuevamente hay dos capítulos de proyecto en esta parte, construyendo un [juego de plataforma](game) y un [programa de pintura de píxeles](paint).

El [Capítulo ?](node) describe Node.js, y el [Capítulo ?](skillsharing) construye un pequeño sitio web utilizando esa herramienta.

{{if comercial

Finalmente, el [Capítulo ?](fast) describe algunas consideraciones que surgen al optimizar programas de JavaScript para velocidad.

if}}

## Convenciones tipográficas

{{index "función factorial"}}

En este libro, el texto escrito en una fuente `monoespaciada` representará elementos de programas. A veces estos son fragmentos autosuficientes, y a veces simplemente se refieren a partes de un programa cercano. Los programas (de los cuales ya has visto algunos) se escriben de la siguiente manera:

```
function factorial(n) {
  if (n == 0) {
    return 1;
  } else {
    return factorial(n - 1) * n;
  }
}
```

{{index "console.log"}}

A veces, para mostrar la salida que produce un programa, la salida esperada se escribe después, con dos barras inclinadas y una flecha al frente.

```
console.log(factorial(8));
// → 40320
```

¡Buena suerte!