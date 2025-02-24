{{meta {load_files: ["code/intro.js"]}}}

# Introducción

{{quote {author: "Ellen Ullman", title: "Close to the Machine: Technophilia and Its Discontents", chapter: true}

Creemos que estamos creando el sistema para nuestros propios propósitos. Creemos que lo estamos haciendo a nuestra propia imagen... Pero la computadora en realidad no es como nosotros. Es una proyección de una parte muy pequeña de nosotros mismos: esa parte dedicada a la lógica, el orden, la regla y la claridad.

quote}}

{{figure {url: "img/chapter_picture_00.jpg", alt: "Ilustración de un destornillador junto a una placa de circuitos de aproximadamente el mismo tamaño", chapter: "framed"}}}

Este es un libro sobre cómo instruir a las ((computadora))s. Las computadoras son tan comunes como los destornilladores hoy en día, pero son bastante más complejas, y hacer que hagan lo que quieres no siempre es fácil.

Si la tarea que tienes para tu computadora es algo común y bien conocido como mostrarte tu correo electrónico funcionar a modo de calculadora, puedes abrir la ((aplicación)) correspondiente y ponerte a trabajar. Sin embargo, para tareas únicas o abiertas, a menudo no hay una aplicación adecuada.

Ahí es donde entra en juego la programación. _Programar_ es el acto de construir un _programa_—un conjunto de instrucciones precisas que le dicen a una computadora qué hacer. Dado que las computadoras son criaturas estúpidas y cuadriculadas, programar resulta ser una tarea fundamentalmente tediosa y frustrante.

{{index ["programación", "la alegría de"], speed}}

Por suerte, si eres capaz de afrontar esto —y también quizá si disfrutas del rigor de pensar en términos que una de estas máquinas pueda entender— programar puede ser gratificante. Te permite hacer en segundos cosas que te tomarían _una eternidad_ a mano. Es una forma de hacer que tu herramienta informática haga cosas que antes no podía hacer. Además, se convierte en un maravilloso juego de resolución de puzles y pensamiento abstracto.

La mayoría de la programación se realiza con ((lenguajes de programación)). Un _lenguaje de programación_ es un lenguaje artificialmente construido utilizado para dar instrucciones a las computadoras. Es interesante que la forma más efectiva que hemos encontrado para comunicarnos con una computadora se base tanto en la forma en que nos comunicamos entre nosotros. Al igual que los idiomas humanos, los lenguajes informáticos permiten combinar palabras y frases de nuevas maneras, permitiendo expresar nuevos conceptos que no se habían expresado antes.

{{index [JavaScript, "availability of"], "casual computing"}}

En un momento dado, las interfaces basadas en lenguaje, como los _prompts_ de BASIC y DOS de los años 1980 y 1990, eran el principal método de interacción con las computadoras. n el uso del día a día, estas se han reemplazado en gran medida por interfaces visuales, que son más fáciles de aprender, aunque ofrecen menos libertad. No obstante, si sabes dónde mirar, los lenguajes de programación siguen ahí. Uno de ellos, _JavaScript_, está integrado en cada navegador web moderno —y por tanto está disponible en casi todos los dispositivos.

{{indexsee "web browser", browser}}

Este libro intentará que te familiarices lo suficiente con este lenguaje como para hacer cosas útiles y entretenidas con él.

## Sobre la programación

{{index ["programación", "la dificultad de"]}}

Además de explicar JavaScript, presentaré los principios básicos de la programación. Resulta que programar es una tarea difícil. Las reglas fundamentales son simples y claras, pero los programas construidos sobre estas reglas tienden a volverse lo suficientemente complejos como para introducir sus propias reglas y complejidades. De algún modo, estás construyendo tu propio laberinto, y es fácil que te pierdas en él.

{{index aprendizaje}}

Habrá momentos en los que leer este libro resulte terriblemente frustrante. Si eres nuevo en la programación, habrá mucho material nuevo que asimilar. Gran parte de este material luego se _combinará_ de maneras que requierirán que hagas nuevas conexiones mentales.

Depende de ti hacer el esfuerzo necesario. Cuando te cueste seguir el libro, no saques conclusiones precipitadas sobre tus propias capacidades. Está todo bien —simplemente necesitas seguir adelante. Tómate un descanso, vuelve a leer algo de material y asegúrate de leer y comprender los programas de ejemplo y los ((ejercicios)). Aprender es un trabajo duro, pero todo lo que aprendas será tuyo y facilitará aún más el aprendizaje futuro.

{{quote {autor: "Ursula K. Le Guin", title: "La mano izquierda de la oscuridad"}

{{index "Le Guin, Ursula K."}}

Cuando la acción se vuelve poco rentable, recopila información; cuando la información se vuelve poco rentable, duerme.

quote}}

{{index [programa, "naturaleza de"], datos}}

Un programa es muchas cosas. Es un trozo de texto escrito por un programador, es la fuerza directriz que hace que la computadora haga lo que hace, es información en la memoria de la computadora, y al mismo tiempo controla las acciones realizadas en esta memoria. Las analogías que intentan comparar los programas con objetos familiares tienden a quedarse cortas. Una comparación vagamente adecuada es comparar un programa con una máquina: suelen estar formadas por muchas partes separadas y, para hacer que todo funcione, debemos considerar las formas en que estas partes se interconectan y contribuyen a la operación del conjunto.

Una ((computadora)) es una máquina física que actúa como anfitriona de estas máquinas inmateriales. Una computadora por si sola solo es capaz de hacer cosas estúpidamente sencillas. La razón por la que son tan útiles es que hacen estas cosas a una velocidad increíblemente alta. Un programa puede combinar ingeniosamente un número enorme de estas acciones simples para hacer cosas muy complicadas.

{{index ["programación", "alegría de"]}}

Un programa es una construcción del pensamiento. No tiene coste ni peso, y crece fácilmente según tecleamos. Pero a medida que un programa crece, también lo hace su ((complejidad)). La habilidad de programar es la habilidad de construir programas que no te confundan a ti mismo. Los mejores programas son aquellos que logran hacer algo interesante mientras siguen siendo fáciles de entender.

{{index "estilo de programación", "mejores prácticas"}}

Algunos programadores creen que esta complejidad se gestiona mejor utilizando solo un puñado de técnicas conocidas en sus programas. Han creado reglas estrictas ("mejores prácticas") que prescriben la forma que deberían tener los programas y se mantienen diligentemente dentro de su pequeño espacio seguro.

{{index experimento}}

Esto no solo es aburrido sino que es ineficaz. A menudo, nuevos problemas requieren soluciones nuevas. El campo de la programación es joven y sin embargo se está desarrollando rápidamente, con variedad suficiente como para adoptar enfoques radicalmente distintos. Hay muchos errores terribles que cometer en el diseño de un programa, y deberías cometerlos al menos una vez para entenderlos. Una noción de cómo es un buen programa se desarrolla con la práctica, no se aprende de una lista de reglas.

## Por qué importa el lenguaje

{{index "lenguaje de programación", "código de máquina", "datos binarios"}}

Al principio, en los inicios de la informática, no existían los lenguajes de programación. Los programas tenían una pinta como la siguiente:

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

{{index ["programación", "historia de"], "tarjeta perforada", complejidad}}

Este es un programa para sumar los números del 1 al 10 y mostrar el resultado: `1 + 2 + ... + 10 = 55`. Podría ejecutarse en una máquina hipotética simple. Para programar los primeros ordenadores, era necesario configurar grandes conjuntos de interruptores en la posición correcta o perforar agujeros en tiras de cartón y dárselos a la computadora. Ya te puedes imaginar lo tedioso y propenso a errores que era este procedimiento. Incluso escribir programas simples requería de mucha astucia y disciplina. Los complejos eran casi inconcebibles.

{{index bit, "mago (poderoso)"}}

Por supuesto, introducir manualmente estos misteriosos patrones de bits (los unos y ceros) hacía que el programador se sintiera como un mago poderoso. Y eso debe valer algo en términos de satisfacción laboral.

{{index memoria, "instrucción"}}

Cada línea del programa anterior contiene una única instrucción. Podría escribirse en español de la siguiente manera:

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

Aunque eso ya es más legible que la sopa de bits anterior, sigue siendo bastante confuso. Usar nombres en lugar de números para las instrucciones y las ubicaciones de memoria ayuda:

```{lang: "null"}
 Establecer “total” en 0.
 Establecer “contador” en 1.
[bucle]
 Establecer “comparación” en “contador”.
 Restar 11 de “comparación”.
 Si “comparación” es cero, continuar en [fin].
 Sumar “contador” a “total”.
 Añadir 1 a “contador”.
 Continuar en [bucle].
[fin]
 Mostrar “total”.
```

{{index bucle, salto, "ejemplo de suma"}}

¿Puedes ver cómo funciona el programa en este punto? Las dos primeras líneas asignan los valores iniciales a dos ubicaciones de memoria: `total` se utilizará para construir el resultado de la suma, y `contador` llevará la cuenta del número que estamos observando en ese momento. Las líneas que utilizan `comparación` probablemente sean las más confusas. El programa quiere ver si `contador` es igual a 11 para decidir si puede parar de ejecutarse. Debido a que nuestra máquina hipotética es bastante primitiva, solo puede comprobar si un número es cero y tomar una decisión en función de ese valor. Por lo tanto, utiliza la ubicación de memoria etiquetada como `comparación` para calcular el valor de `contador - 11` y tomar una decisión basada en el resultado. Las siguientes dos líneas suman el valor de `contador` al resultado e incrementan `contador` en 1 cada vez que el programa decide que `contador` aún no vale 11. Aquí está el mismo programa en JavaScript:

```
let total = 0, contador = 1;
while (contador <= 10) {
  total += contador;
  contador += 1;
}
console.log(total);
// → 55
```

{{index "bucle while", bucle, [llaves, bloque]}}

Esta versión nos proporciona algunas mejoras más. Lo más importante es que ya no es necesario especificar la forma en que queremos que el programa salte hacia adelante y hacia atrás; la construcción `while` se encarga de eso. Continúa ejecutando el bloque (entre llaves) debajo de él siempre y cuando se cumpla la condición que se le ha dado. Esa condición es `contador <= 10`, lo que significa "el recuento es menor o igual a 10". Ya no tenemos que crear un valor temporal y compararlo con cero, lo cual era simplemente un detalle carente de interés. Parte del poder de los lenguajes de programación es que pueden encargarse de los detalles que no nos interesan.

{{index "console.log"}}

Al final del programa, después de que la construcción `while` haya terminado, se utiliza la operación `console.log` para mostrar el resultado.

{{index "función de suma", "función de rango", "abstracción", "función"}}

Finalmente, así es como podría verse el programa si tuviéramos a nuestra disposición las útiles operaciones `rango` y `suma`, que crean una colección de números enteros dentro de un intervalo (o rango) y calculan la suma de una colección de números, respectivamente:

```{startCode: true}
console.log(suma(rango(1, 10)));
// → 55
```

{{index legibilidad}}

La moraleja de esta historia es que un mismo programa puede expresarse de formas largas y cortas, ilegibles y legibles. La primera versión del programa era extremadamente críptica, mientras que esta última es casi hablar en inglés: registra (`log`) la `suma` del `rango` de números del 1 al 10 (veremos en [capítulos posteriores](data) cómo definir operaciones como `suma` y `rango`).

{{index ["lenguaje de programación", "poder de"], composabilidad}}

Un buen lenguaje de programación ayuda al programador, al permitirle hablar sobre las acciones que la computadora debe realizar a un más alto nivel. Ayuda a omitir detalles, proporciona bloques de construcción convenientes (como `while` y `console.log`), te permite definir tus propios bloques de construcción (como `suma` y `rango`), y hace que esos bloques sean fáciles de componer.

## ¿Qué es JavaScript?

{{index historia, Netscape, navegador, "aplicación web", JavaScript, [JavaScript, "historia de"], "World Wide Web"}}

{{indexsee WWW, "World Wide Web"}}

JavaScript fue introducido en 1995 como una forma de agregar programas a páginas web en el navegador Netscape Navigator. Desde entonces, el lenguaje ha sido adoptado por todos los demás principales navegadores web gráficos. Ha hecho posibles aplicaciones web modernas, es decir, aplicaciones con las que puedes interactuar directamente sin tener que recargar la página para cada acción. JavaScript también se utiliza en sitios web más tradicionales para proporcionar distintas formas de interactividad e ingenio.

{{index Java, nombre}}

Es importante mencionar que JavaScript no tiene casi nada que ver con el lenguaje de programación llamado Java. La elección de un nombre tan parecido se debe más a consideraciones de marketing que a un buen criterio. Cuando se estaba introduciendo JavaScript, el lenguaje Java se estaba comercializando mucho y ganaba popularidad. Alguien pensó que era una buena idea intentar aprovechar este éxito y ahora tenemos que quedarnos con el nombre.

{{index ECMAScript, compatibilidad}}

Después de su adopción fuera de Netscape, se redactó un ((documento estándar)) para describir cómo debería funcionar el lenguaje JavaScript, de manera que los diferentes programas que decían soportar JavaScript pudieran asegurarse de que realmente proporcionaban el mismo lenguaje. A esto se le llama el estándar ECMAScript, en honor a la organización Ecma International que llevó a cabo la estandarización. En la práctica, los términos ECMAScript y JavaScript se pueden usar de manera intercambiable; son dos nombres para el mismo lenguaje.

{{index JavaScript, "debilidades de", "depuración"}}

Hay quienes dirán cosas _terribles_ sobre JavaScript. Muchas de ellas son ciertas. Cuando me pidieron que escribiera algo en JavaScript por primera vez, empecé a detestarlo rápidamente. Aceptaba casi cualquier cosa que escribía pero lo interpretaba de una manera completamente diferente a lo que yo quería decir. Esto tenía mucho que ver con el hecho de que yo no tenía ni idea de lo que estaba haciendo, por supuesto, pero hay un problema real aquí: JavaScript es ridículamente flexible en lo que permite. La idea detrás de este diseño era que haría la programación en JavaScript más fácil para principiantes. En realidad, esto hace que encontrar problemas en tus programas sea más difícil porque el sistema no te los va a señalar.

{{index JavaScript, "flexibilidad de"}}

Esta flexibilidad también tiene sus ventajas. Deja espacio para técnicas imposibles en lenguajes más rígidos y permite un estilo de programación agradable e informal. Después de ((aprender)) el lenguaje adecuadamente y trabajar con él durante un tiempo, ha llegado a realmente _gustarme_ JavaScript.

{{index futuro, [JavaScript, "versiones de"], ECMAScript, "ECMAScript 6"}}

Ha habido varias versiones de JavaScript. La versión ECMAScript 3 fue la versión más respaldada durante el ascenso al dominio de JavaScript, aproximadamente entre 2000 y 2010. Durante este tiempo, se estaba trabajando en una ambiciosa versión 4, la cual planeaba una serie de mejoras y extensiones radicales del lenguaje. Cambiar un lenguaje vivo y ampliamente utilizado de esa manera resultó ser políticamente difícil, y el trabajo en la versión 4 se abandonó en 2008. Una mucho menos ambiciosa versión 5, que solo realizaba algunas mejoras poco controvertidas, se lanzó en 2009. En 2015, salió la versión 6, una actualización importante que incluía algunas de las ideas previstas para la versión 4. Desde entonces, hemos tenido nuevas pequeñas actualizaciones cada año.

El hecho de que JavaScript esté evolucionando significa que los navegadores tienen que mantenerse constantemente al día. Si estás usando un navegador más antiguo, es posible que no admita todas las funciones. Los diseñadores del lenguaje se aseguran de no realizar cambios que puedan romper programas ya existentes, por lo que los nuevos navegadores aún pueden ejecutar programas antiguos. En este libro, estoy utilizando la versión 2023 de JavaScript.

{{index [JavaScript, "usos de"]}}

Los navegadores web no son las únicas plataformas en las que se utiliza JavaScript. Algunas bases de datos, como MongoDB y CouchDB, utilizan JavaScript como su lenguaje de secuencias de comandos y consulta. Varias plataformas para programación de escritorio y servidores, especialmente el proyecto ((Node.js)) (el tema del [Capítulo ?](node)), proporcionan un entorno para programar en JavaScript fuera del navegador.

## Código, y qué hacer con él

{{index "leer código", "escribir código"}}

El _código_ es el texto que constituye los programas. La mayoría de los capítulos en este libro contienen bastante código. Creo que leer código y escribir ((código)) son partes indispensables de ((aprender)) a programar. Intenta no solo mirar por encima los ejemplos, léelos atentamente y entiéndelos. Esto puede ser lento y confuso al principio, pero te prometo que pronto le pillarás el truco. Lo mismo ocurre con los ((ejercicios)). No des por sentado que los entiendes hasta que hayas escrito una solución que realmente funcione.

{{index "interpretación"}}

Te recomiendo que pruebes tus soluciones a los ejercicios en un intérprete de JavaScript real. De esta manera, obtendrás comentarios inmediatos sobre si lo que estás haciendo funciona, y, espero, te tentarán a ((experimentar)) y a ir más allá de los ejercicios.

{{if interactive

Cuando leas este libro en tu navegador, puedes editar (y ejecutar) todos los programas de ejemplo haciendo clic en ellos.

if}}

{{if book

{{index descargar, sandbox, "ejecutar código"}}

La forma más sencilla de ejecutar el código de ejemplo en el libro —y de experimentar con él— es buscarlo en la versión en línea del libro en [_https://eloquentjavascript.net_](https://eloquentjavascript.net/). Allí, puedes hacer clic en cualquier ejemplo de código para editarlo y ejecutarlo, y ver la salida que produce. Para trabajar en los ejercicios, ve a [_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code), que proporciona el código inicial para cada ejercicio de programación y te permite ver las soluciones.

if}}

{{index "herramientas de desarrollo", "consola de JavaScript"}}

Ejecutar los programas definidos en este libro fuera del sitio web del libro requiere cierto cuidado. Muchos ejemplos son independientes y deberían funcionar en cualquier entorno de JavaScript. Pero el código en los capítulos posteriores a menudo está escrito para un entorno específico (navegador o Node.js) y solo puede ejecutarse allí. Además, muchos capítulos definen programas más grandes, y los trozos de código que aparecen en ellos dependen unos de otros, o de archivos externos. El [sandbox](https://eloquentjavascript.net/code) en el sitio web proporciona enlaces a archivos ZIP que contienen todos los scripts y archivos de datos necesarios para ejecutar el código de un capítulo dado.

## Visión general de este libro

Este libro consta aproximadamente de tres partes. Los primeros 12 capítulos tratan sobre el lenguaje JavaScript. Los siguientes siete capítulos son acerca de los navegadores web y la forma en que se utiliza JavaScript para programarlos. Por último, se dedican dos capítulos a ((Node.js)), otro entorno para programar en JavaScript. Hay cinco _capítulos de proyectos_ en el libro que describen programas de ejemplo más grandes para darte una idea de programación de verdad.

La parte del libro sobre el lenguaje comienza con cuatro capítulos que introducen la estructura básica del lenguaje JavaScript. En ellos, se discuten las [estructuras de control](program_structure) (como la palabra `while` que viste en esta introducción), las [funciones](functions) (escribir tus propios bloques de construcción) y las [estructuras de datos](data). Después de estos, serás capaz de escribir programas básicos. Luego, los Capítulos [?](higher_order) y [?](object) introducen técnicas para usar funciones y objetos para escribir código más _abstracto_ y mantener la complejidad bajo control. 

Después de un [primer capítulo de proyecto](robot) en el que se construye un robot de entrega rudimentario, la parte del libro sobre lenguaje continúa con capítulos acerca de [manejo de errores y corrección de errores](error), [expresiones regulares](regexp) (una herramienta importante para trabajar con texto), [modularidad](modules) (otra defensa contra la complejidad) y [programación asíncrona](async) (tratando con eventos que llevan tiempo). El [segundo capítulo de proyecto](language), donde implementamos un lenguaje de programación, cierra la primera parte del libro.

La segunda parte del libro, de los capítulos [?](browser) a [?](paint), describe las herramientas a las que tiene acceso JavaScript en un navegador. Aprenderás a mostrar cosas en la pantalla (Capítulos [?](dom) y [?](canvas)), responder a la entrada del usuario ([Capítulo ?](event)) y comunicarte a través de la red ([Capítulo ?](http)). Nuevamente hay dos capítulos de proyecto en esta parte que consisten construir un [juego de plataformas](game) y un [programa de pintura de píxeles](paint), respectivamente.

En el [Capítulo ?](node) se describe Node.js, y en el [Capítulo ?](skillsharing) se construye un pequeño sitio web utilizando esta herramienta.

{{if comercial

Finalmente, el [Capítulo ?](fast) describe algunas consideraciones que surgen al optimizar programas de JavaScript para velocidad.

if}}

## Convenciones tipográficas

{{index "función factorial"}}

En este libro, el texto escrito en una fuente `monoespaciada` representará partes de programas. A veces serán fragmentos autosuficientes, y a veces simplemente se referirán a partes de un programa que se acabe de comentar. Los programas (de los cuales ya has visto algunos) se escriben de la siguiente manera:

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

A veces, para mostrar la salida que produce un programa, la salida esperada se escribe después, con dos barras diagonales y una flecha en frente.

```
console.log(factorial(8));
// → 40320
```

¡Buena suerte!
