{{meta {load_files: ["code/hangar2.js", "code/chapter/11_async.js"], zip: "node/html"}}

# Programación Asíncrona

{{quote {author: "Laozi", title: "Tao Te Ching", chapter: true}

¿Quién puede esperar en silencio mientras el barro se asienta?\
¿Quién puede permanecer quieto hasta el momento de la acción?

quote}}

{{index "Laozi"}}

{{figure {url: "img/chapter_picture_11.jpg", alt: "Ilustración que muestra dos cuervos en una rama de árbol", capítulo: enmarcado}}

La parte central de una computadora, la parte que lleva a cabo los pasos individuales que componen nuestros programas, se llama el _((procesador))_. Los programas que hemos visto hasta ahora mantendrán ocupado al procesador hasta que hayan terminado su trabajo. La velocidad a la cual algo como un bucle que manipula números puede ser ejecutado depende casi enteramente de la velocidad del procesador y la memoria de la computadora.

{{index [memoria, velocidad], [red, velocidad]}}

Pero muchos programas interactúan con cosas fuera del procesador. Por ejemplo, pueden comunicarse a través de una red de computadoras o solicitar datos desde el ((disco duro)), lo cual es mucho más lento que obtenerlo de la memoria.

Cuando esto está sucediendo, sería una lástima dejar el procesador inactivo, ya que podría haber otro trabajo que podría hacer en ese tiempo. En parte, esto es manejado por tu sistema operativo, el cual cambiará el procesador entre múltiples programas en ejecución. Pero eso no ayuda cuando queremos que un _único_ programa pueda avanzar mientras espera una solicitud de red.

## Asincronía

{{index "programación sincrónica"}}

En un modelo de programación _sincrónico_, las cosas suceden una a la vez. Cuando llamas a una función que realiza una acción de larga duración, solo devuelve cuando la acción ha terminado y puede devolver el resultado. Esto detiene tu programa durante el tiempo que tome la acción.

{{index "programación asincrónica"}}

Un modelo _asincrónico_ permite que múltiples cosas sucedan al mismo tiempo. Cuando inicias una acción, tu programa continúa ejecutándose. Cuando la acción termina, el programa es informado y obtiene acceso al resultado (por ejemplo, los datos leídos desde el disco).

Podemos comparar la programación sincrónica y asincrónica usando un pequeño ejemplo: un programa que realiza dos solicitudes a través de la ((red)) y luego combina los resultados.

{{index "programación sincrónica"}}

En un entorno sincrónico, donde la función de solicitud devuelve solo después de haber hecho su trabajo, la forma más fácil de realizar esta tarea es hacer las solicitudes una después de la otra. Esto tiene la desventaja de que la segunda solicitud se iniciará solo cuando la primera haya terminado. El tiempo total tomado será al menos la suma de los dos tiempos de respuesta.

{{index paralelismo}}

La solución a este problema, en un sistema sincrónico, es iniciar ((hebra))s de control adicionales. Una _hebra_ es otro programa en ejecución cuya ejecución puede ser intercalada con otros programas por el sistema operativo, ya que la mayoría de las computadoras modernas contienen múltiples procesadores, múltiples hebras incluso podrían ejecutarse al mismo tiempo, en diferentes procesadores. Una segunda hebra podría iniciar la segunda solicitud, y luego ambas hebras esperan que sus resultados regresen, después de lo cual se resincronizan para combinar sus resultados.{{index CPU, bloqueo, "programación asíncrona", línea de tiempo, "función de devolución de llamada"}}

En el siguiente diagrama, las líneas gruesas representan el tiempo que el programa pasa funcionando normalmente, y las líneas delgadas representan el tiempo gastado esperando a la red. En el modelo síncrono, el tiempo tomado por la red es _parte_ de la línea de tiempo para un hilo de control dado. En el modelo asíncrono, iniciar una acción en la red permite que el programa continúe ejecutándose mientras la comunicación en la red sucede junto a él, notificando al programa cuando haya terminado.

{{figure {url: "img/control-io.svg", alt: "Diagrama que muestra el flujo de control en programas síncronos y asíncronos. La primera parte muestra un programa síncrono, donde las fases activas y de espera del programa ocurren en una única línea secuencial. La segunda parte muestra un programa síncrono multi-hilo, con dos líneas paralelas en las cuales las partes de espera suceden una al lado de la otra, haciendo que el programa termine más rápido. La última parte muestra un programa asíncrono, donde las múltiples acciones asíncronas se ramifican desde el programa principal, el cual se detiene en algún momento y luego continúa cuando la primera cosa por la que estaba esperando finaliza.", ancho: "8cm"}}}

{{index ["flujo de control", asíncrono], "programación asíncrona", verbosidad, rendimiento}}

Otra forma de describir la diferencia es que esperar a que las acciones terminen es _implícito_ en el modelo síncrono, mientras que es _explícito_, bajo nuestro control, en el modelo asíncrono.

La asincronía tiene sus pros y sus contras. Facilita la expresión de programas que no encajan en el modelo de control de línea recta, pero también puede hacer que expresar programas que siguen una línea recta sea más complicado. Veremos algunas formas de reducir esta dificultad más adelante en el capítulo.

Tanto las plataformas de programación de JavaScript prominentes —((navegadores)) como ((Node.js))— hacen operaciones que podrían tardar un tiempo de forma asíncrona, en lugar de depender de ((hilos)). Dado que programar con hilos es notoriamente difícil (entender lo que hace un programa es mucho más difícil cuando está haciendo múltiples cosas a la vez), esto generalmente se considera algo bueno.

## Retrollamadas

{{veríndice [función, devolución de llamada], "función de devolución de llamada"}}

Un enfoque para la ((programación asíncrona)) es hacer que las funciones que necesitan esperar por algo tomen un argumento adicional, una _((función de devolución de llamada))_. La función asíncrona inicia algún proceso, configura las cosas para que se llame a la función de devolución de llamada cuando el proceso termine, y luego retorna.

{{index "función setTimeout", espera}}

Como ejemplo, la función `setTimeout`, disponible tanto en Node.js como en los navegadores, espera un número dado de milisegundos (un segundo equivale a mil milisegundos) y luego llama a una función.

```{test: no}
setTimeout(() => console.log("Tick"), 500);
```

Esperar no suele ser un tipo de trabajo muy importante, pero puede ser muy útil cuando necesitas organizar que algo suceda en un momento determinado o verificar si alguna otra acción está tomando más tiempo del esperado.{{index "función readTextFile"}}

Otro ejemplo de una operación asincrónica común es leer un archivo desde el almacenamiento de un dispositivo. Imagina que tienes una función `readTextFile`, la cual lee el contenido de un archivo como una cadena y lo pasa a una función de devolución de llamada.

```
readTextFile("lista_de_compras.txt", contenido => {
  console.log(`Lista de Compras:\n${contenido}`);
});
// → Lista de Compras:
// → Mantequilla de cacahuate
// → Plátanos
```

La función `readTextFile` no es parte del estándar de JavaScript. Veremos cómo leer archivos en el navegador y en Node.js en capítulos posteriores.

Realizar múltiples acciones asincrónicas en fila usando devoluciones de llamada significa que tienes que seguir pasando nuevas funciones para manejar la continuación de la computación después de las acciones. Así es como podría verse una función asincrónica que compara dos archivos y produce un booleano que indica si su contenido es el mismo.

```
function compararArchivos(archivoA, archivoB, devolucionLlamada) {
  readTextFile(archivoA, contenidoA => {
    readTextFile(archivoB, contenidoB => {
      devolucionLlamada(contenidoA == contenidoB);
    });
  });
}
```

Este estilo de programación es funcional, pero el nivel de indentación aumenta con cada acción asincrónica porque terminas en otra función. Hacer cosas más complicadas, como envolver acciones asincrónicas en un bucle, puede ser incómodo.

De alguna manera, la asincronía es contagiosa. Cualquier función que llame a una función que trabaja de forma asincrónica debe ser asincrónica en sí misma, utilizando una devolución de llamada u otro mecanismo similar para entregar su resultado. Llamar a una devolución de llamada es algo más complicado y propenso a errores que simplemente devolver un valor, por lo que necesitar estructurar grandes partes de tu programa de esa manera no es ideal.

## Promesas

Una forma ligeramente diferente de construir un programa asincrónico es hacer que las funciones asincrónicas devuelvan un objeto que represente su resultado (futuro) en lugar de pasar devoluciones de llamada por todas partes. De esta manera, tales funciones realmente devuelven algo significativo, y la estructura del programa se asemeja más a la de los programas síncronos.

{{index "clase Promise", "programación asincrónica", "resolviendo (una promesa)", "método then", "función de devolución de llamada"}}

Para esto sirve la clase estándar `Promise`. Una _promesa_ es un recibo que representa un valor que aún puede no estar disponible. Proporciona un método `then` que te permite registrar una función que debe ser llamada cuando la acción por la que está esperando finalice. Cuando la promesa se _resuelve_, es decir, su valor se vuelve disponible, esas funciones (puede haber varias) son llamadas con el valor del resultado. Es posible llamar a `then` en una promesa que ya ha sido resuelta; tu función seguirá siendo llamada.

{{index "función Promise.resolve"}}

La forma más sencilla de crear una promesa es llamando a `Promise.resolve`. Esta función se asegura de que el valor que le proporcionas esté envuelto en una promesa. Si ya es una promesa, simplemente se devuelve; de lo contrario, obtienes una nueva promesa que se resuelve de inmediato con tu valor como resultado.

```
let quince = Promise.resolve(15);
quince.then(valor => console.log(`Obtenido ${valor}`));
// → Obtenido 15
```{{index "Clase Promise"}}

Para crear una promesa que no se resuelva inmediatamente, puedes utilizar `Promise` como constructor. Tiene una interfaz un tanto extraña: el constructor espera una función como argumento, la cual llama inmediatamente, pasándole una función que puede utilizar para resolver la promesa.

Así es como podrías crear una interfaz basada en promesas para la función `readTextFile`:

{{index "Función textFile"}}

```
function textFile(nombreArchivo) {
  return new Promise(resolve => {
    readTextFile(nombreArchivo, texto => resolve(texto));
  });
}

textFile("planes.txt").then(console.log);
```

Observa cómo esta función asíncrona devuelve un valor significativo: una promesa para proporcionarte el contenido del archivo en algún momento futuro.

{{index "método then"}}

Una característica útil del método `then` es que él mismo devuelve otra promesa que se resuelve al valor retornado por la función de devolución de llamada o, si esa función devuelve una promesa, al valor al que esa promesa se resuelve. De esta forma, puedes "encadenar" varias llamadas a `then` para configurar una secuencia de acciones asíncronas.

Esta función, la cual lee un archivo lleno de nombres de archivos y devuelve el contenido de un archivo aleatorio de esa lista, muestra este tipo de cadena asíncrona de promesas.

```
function randomFile(archivoLista) {
  return textFile(archivoLista)
    .then(contenido => contenido.trim().split("\n"))
    .then(ls => ls[Math.floor(Math.random() * ls.length)])
    .then(nombreArchivo => textFile(nombreArchivo));
}
```

La función devuelve el resultado de esta cadena de llamadas a `then`. La promesa inicial obtiene la lista de archivos como una cadena. La primera llamada a `then` transforma esa cadena en un array de líneas, produciendo una nueva promesa. La segunda llamada a `then` elige una línea aleatoria de eso, produciendo una tercera promesa que arroja un único nombre de archivo. La llamada final a `then` lee este archivo, de modo que el resultado de la función en su totalidad es una promesa que devuelve el contenido de un archivo aleatorio.

En este código, las funciones utilizadas en las primeras dos llamadas a `then` devuelven un valor regular, que se pasará inmediatamente a la promesa devuelta por `then` cuando la función regrese. La última devuelve una promesa (`textFile(nombreArchivo)`), convirtiéndola en un paso asincrónico real.

También habría sido posible realizar todos estos pasos dentro de un solo callback de `then`, ya que solo el último paso es realmente asíncrono. Pero los tipos de envolturas `then` que solo realizan alguna transformación de datos síncrona son a menudo útiles, por ejemplo, cuando deseas devolver una promesa que produzca una versión procesada de algún resultado asíncrono.

```
function jsonFile(nombreArchivo) {
  return textFile(nombreArchivo).then(JSON.parse);
}

jsonFile("package.json").then(console.log);
```

En general, es útil pensar en las promesas como un mecanismo que permite al código ignorar la pregunta de cuándo va a llegar un valor. Un valor normal tiene que existir realmente antes de que podamos hacer referencia a él. Un valor prometido es un valor que _puede_ estar allí o podría aparecer en algún momento en el futuro. Las operaciones definidas en términos de promesas, al conectarlas con llamadas `then`, se ejecutan de forma asíncrona a medida que sus entradas están disponibles.## Falla

{{index "manejo de excepciones"}}

Las computaciones regulares de JavaScript pueden fallar al lanzar una excepción. Las computaciones asíncronas a menudo necesitan algo así. Una solicitud de red puede fallar, un archivo puede no existir, o algún código que forma parte de la computación asíncrona puede lanzar una excepción.

{{index "función de devolución de llamada", error}}

Uno de los problemas más apremiantes con el estilo de programación asíncrona basado en devoluciones de llamada es que hace extremadamente difícil asegurarse de que las fallas se informen adecuadamente a las devoluciones de llamada.

Una convención ampliamente utilizada es que el primer argumento de la devolución de llamada se utiliza para indicar que la acción falló, y el segundo contiene el valor producido por la acción cuando fue exitosa.

```
unaFuncionAsincrona((error, valor) => {
  if (error) manejarError(error);
  else procesarValor(valor);
});
```

Tales funciones de devolución de llamada siempre deben verificar si recibieron una excepción y asegurarse de que cualquier problema que causen, incluidas las excepciones lanzadas por las funciones que llaman, se capturen y se den a la función correcta.

{{index "rechazar (una promesa)", "resolver (una promesa)", "método then"}}

Las promesas facilitan esto. Pueden ser o bien resueltas (la acción se completó con éxito) o rechazadas (falló). Los manejadores de resolución (como se registran con `then`) se llaman solo cuando la acción es exitosa, y los rechazos se propagan a la nueva promesa que es devuelta por `then`. Cuando un manejador lanza una excepción, esto causa automáticamente que la promesa producida por la llamada a su `then` sea rechazada. Entonces, si algún elemento en una cadena de acciones asíncronas falla, el resultado de toda la cadena se marca como rechazado, y no se llaman manejadores de éxito más allá del punto donde falló.

{{index "función Promise.reject", "clase Promise"}}

Al igual que resolver una promesa proporciona un valor, rechazar una también lo hace, generalmente llamado el _motivo_ del rechazo. Cuando una excepción en una función manejadora causa el rechazo, el valor de la excepción se usa como el motivo. De manera similar, cuando una función manejadora devuelve una promesa que es rechazada, ese rechazo fluye hacia la siguiente promesa. Existe una función `Promise.reject` que crea una nueva promesa inmediatamente rechazada.

{{index "método catch"}}

Para manejar explícitamente tales rechazos, las promesas tienen un método `catch` que registra un manejador para ser llamado cuando la promesa es rechazada, similar a cómo los manejadores de `then` manejan la resolución normal. También es muy similar a `then` en que devuelve una nueva promesa, que se resuelve con el valor de la promesa original cuando se resuelve normalmente y con el resultado del manejador `catch` en caso contrario. Si un manejador de `catch` lanza un error, la nueva promesa también se rechaza.

{{index "método then"}}

Como un atajo, `then` también acepta un manejador de rechazo como segundo argumento, para poder instalar ambos tipos de manejadores en una sola llamada de método.

Una función pasada al constructor `Promise` recibe un segundo argumento, junto con la función de resolución, que puede usar para rechazar la nueva promesa.Cuando nuestra función `readTextFile` encuentra un problema, pasa el error a su función de devolución de llamada como segundo argumento. Nuestro envoltorio `textFile` debería realmente examinar ese argumento, de manera que un fallo cause que la promesa que devuelve sea rechazada.

```{includeCode: true}
function textFile(filename) {
  return new Promise((resolve, reject) => {
    readTextFile(filename, (text, error) => {
      if (error) reject(error);
      else resolve(text);
    });
  });
}
```

Las cadenas de valores de promesa creadas por llamadas a `then` y `catch` forman así un pipeline a través del cual se mueven los valores asíncronos o fallos. Dado que dichas cadenas se crean registrando manejadores, cada eslabón tiene asociado un manejador de éxito o un manejador de rechazo (o ambos). Los manejadores que no coinciden con el tipo de resultado (éxito o fallo) son ignorados. Pero aquellos que coinciden son llamados, y su resultado determina qué tipo de valor viene a continuación: éxito cuando devuelve un valor que no es una promesa, rechazo cuando genera una excepción, y el resultado de la promesa cuando devuelve una promesa.

```{test: no}
new Promise((_, reject) => reject(new Error("Fail")))
  .then(value => console.log("Manejador 1:", value))
  .catch(reason => {
    console.log("Error capturado " + reason);
    return "nada";
  })
  .then(value => console.log("Manejador 2:", value));
// → Error capturado Error: Fail
// → Handler 2: nothing
```

La primera función de manejador regular no es llamada, porque en ese punto del pipeline la promesa contiene un rechazo. El manejador `catch` maneja ese rechazo y devuelve un valor, que se le da a la segunda función de manejador.

Cuando una excepción no controlada es manejada por el entorno, los entornos de JavaScript pueden detectar cuándo un rechazo de promesa no es manejado y lo reportarán como un error.

## Carla

Es un día soleado en Berlín. La pista del antiguo aeropuerto desmantelado rebosa de ciclistas y patinadores en línea. En el césped cerca de un contenedor de basura un grupo de cuervos se agita ruidosamente, intentando convencer a un grupo de turistas de que les den sus sándwiches.

Uno de los cuervos destaca: una hembra grande andrajosa con algunas plumas blancas en su ala derecha. Está atrayendo a la gente con habilidad y confianza que sugieren que ha estado haciendo esto durante mucho tiempo. Cuando un anciano se distrae con las travesuras de otro cuervo, ella se abalanza casualmente, arrebata su bollo a medio comer de su mano y se aleja planeando.

A diferencia del resto del grupo, que parece estar feliz de pasar el día holgazaneando aquí, el cuervo grande parece tener un propósito. Llevando su botín, vuela directamente hacia el techo del edificio del hangar, desapareciendo en una rejilla de ventilación.

Dentro del edificio, se puede escuchar un sonido peculiar: suave, pero persistente. Viene de un espacio estrecho bajo el techo de una escalera sin terminar. El cuervo está sentado allí, rodeado de sus botines robados, media docena de teléfonos inteligentes (varios de los cuales están encendidos) y un enredo de cables. Golpea rápidamente la pantalla de uno de los teléfonos con su pico. Aparecen palabras en él. Si no supieras mejor, pensarías que estaba escribiendo.Este cuervo es conocido por sus pares como "cāāw-krö". Pero dado que esos sonidos no son adecuados para las cuerdas vocales humanas, la llamaremos Carla.

Carla es un cuervo algo peculiar. En su juventud, estaba fascinada por el lenguaje humano, escuchando a la gente hasta que tuvo un buen entendimiento de lo que decían. Más tarde, su interés se trasladó a la tecnología humana, y comenzó a robar teléfonos para estudiarlos. Su proyecto actual es aprender a programar. El texto que está escribiendo en su laboratorio secreto, de hecho, es un fragmento de código JavaScript.

## Infiltración

{{index "Carla el cuervo"}}

A Carla le encanta Internet. Fastidiosamente, el teléfono en el que está trabajando está a punto de quedarse sin datos prepagos. El edificio tiene una red inalámbrica, pero se requiere un código para acceder a ella.

Afortunadamente, los enrutadores inalámbricos en el edificio tienen 20 años y están mal protegidos. Tras investigar un poco, Carla descubre que el mecanismo de autenticación de la red tiene una falla que puede aprovechar. Al unirse a la red, un dispositivo debe enviar el código correcto de 6 dígitos. El punto de acceso responderá con un mensaje de éxito o fracaso dependiendo de si se proporciona el código correcto. Sin embargo, al enviar solo un código parcial (digamos, solo 3 dígitos), la respuesta es diferente según si esos dígitos son el inicio correcto del código o no. Cuando se envía un número incorrecto, se recibe inmediatamente un mensaje de fracaso. Cuando se envían los correctos, el punto de acceso espera más dígitos.

Esto hace posible acelerar enormemente la adivinación del número. Carla puede encontrar el primer dígito probando cada número a su vez, hasta que encuentre uno que no devuelva inmediatamente un fracaso. Teniendo un dígito, puede encontrar el segundo de la misma manera, y así sucesivamente, hasta que conozca todo el código de acceso.

Supongamos que tenemos una función `joinWifi`. Dado el nombre de la red y el código de acceso (como una cadena), intenta unirse a la red, devolviendo una promesa que se resuelve si tiene éxito, y se rechaza si la autenticación falla. Lo primero que necesitamos es una forma de envolver una promesa para que se rechace automáticamente después de transcurrir demasiado tiempo, de manera que podamos avanzar rápidamente si el punto de acceso no responde.

```{includeCode: true}
function withTimeout(promise, tiempo) {
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject);
    setTimeout(() => reject("Se agotó el tiempo"), tiempo);
  });
}
```

Esto aprovecha el hecho de que una promesa solo puede resolverse o rechazarse una vez: si la promesa dada como argumento se resuelve o se rechaza primero, ese será el resultado de la promesa devuelta por `withTimeout`. Si, por otro lado, el `setTimeout` se ejecuta primero, rechazando la promesa, se ignoran cualquier llamada posterior a resolve o reject.

Para encontrar todo el código de acceso, necesitamos buscar repetidamente el siguiente dígito probando cada dígito. Si la autenticación tiene éxito, sabremos que hemos encontrado lo que buscamos. Si falla inmediatamente, sabremos que ese dígito era incorrecto y debemos probar con el siguiente. Si la solicitud se agota, hemos encontrado otro dígito correcto y debemos continuar agregando otro dígito.Debido a que no puedes esperar una promesa dentro de un bucle `for`, Carla utiliza una función recursiva para llevar a cabo este proceso. En cada llamada, obtiene el código tal como lo conocemos hasta ahora, así como el siguiente dígito a probar. Dependiendo de lo que suceda, puede devolver un código terminado, o llamar de nuevo a sí misma, ya sea para comenzar a descifrar la siguiente posición en el código, o para intentarlo de nuevo con otro dígito.

```{includeCode: true}
function crackPasscode(networkID) {
  function nextDigit(code, digit) {
    let newCode = code + digit;
    return withTimeout(joinWifi(networkID, newCode), 50)
      .then(() => newCode)
      .catch(failure => {
        if (failure == "Timed out") {
          return nextDigit(newCode, 0);
        } else if (digit < 9) {
          return nextDigit(code, digit + 1);
        } else {
          throw failure;
        }
      });
  }
  return nextDigit("", 0);
}
```

El punto de acceso suele responder a solicitudes de autenticación incorrectas en aproximadamente 20 milisegundos, por lo que, para estar seguros, esta función espera 50 milisegundos antes de hacer expirar una solicitud.

```
crackPasscode("HANGAR 2").then(console.log);
// → 555555
```

Carla inclina la cabeza y suspira. Esto habría sido más satisfactorio si el código hubiera sido un poco más difícil de adivinar.

## Funciones asíncronas

{{index "Promise class", recursion}}

Incluso con promesas, este tipo de código asíncrono es molesto de escribir. Las promesas a menudo necesitan ser encadenadas de manera verbosa y arbitraria. Y nos vimos obligados a introducir una función recursiva solo para crear un bucle.

{{index "synchronous programming", "asynchronous programming"}}

Lo que la función de descifrado realmente hace es completamente lineal: siempre espera a que la acción anterior se complete antes de comenzar la siguiente. En un modelo de programación síncrona, sería más sencillo de expresar.

{{index "async function", "await keyword"}}

La buena noticia es que JavaScript te permite escribir código pseudo-sincrónico para describir la computación asíncrona. Una función `async` es una función que implícitamente devuelve una promesa y que puede, en su cuerpo, `await` otras promesas de una manera que _parece_ sincrónica.

{{index "findInStorage function"}}

Podemos reescribir `crackPasscode` de la siguiente manera:

```
async function crackPasscode(networkID) {
  for (let code = "";;) {
    for (let digit = 0;; digit++) {
      let newCode = code + digit;
      try {
        await withTimeout(joinWifi(networkID, newCode), 50);
        return newCode;
      } catch (failure) {
        if (failure == "Timed out") {
          code = newCode;
          break;
        } else if (digit == 9) {
          throw failure;
        }
      }
    }
  }
}
```

Esta versión muestra de manera más clara la estructura de doble bucle de la función (el bucle interno prueba el dígito 0 al 9, el bucle externo añade dígitos al código de acceso).

{{index "async function", "return keyword", "exception handling"}}

Una función `async` está marcada con la palabra `async` antes de la palabra clave `function`. Los métodos también pueden ser marcados como `async` escribiendo `async` antes de su nombre. Cuando se llama a una función o método de esta manera, devuelve una promesa. Tan pronto como la función devuelve algo, esa promesa se resuelve. Si el cuerpo genera una excepción, la promesa es rechazada.{{index "await keyword", ["control flow", asynchronous]}}

Dentro de una función `async`, la palabra `await` puede colocarse delante de una expresión para esperar a que una promesa se resuelva y luego continuar con la ejecución de la función. Si la promesa es rechazada, se genera una excepción en el punto del `await`.

Una función así ya no se ejecuta, como una función regular de JavaScript, de principio a fin de una sola vez. En su lugar, puede estar _congelada_ en cualquier punto que tenga un `await`, y puede continuar más tarde.

Para la mayoría del código asíncrono, esta notación es más conveniente que usar directamente promesas. Aún necesitas comprender las promesas, ya que en muchos casos todavía interactúas con ellas directamente. Pero al encadenarlas, las funciones `async` suelen ser más agradables de escribir que encadenar llamadas `then`.

{{id generator}}

## Generadores

{{index "async function"}}

Esta capacidad de pausar y luego reanudar funciones no es exclusiva de las funciones `async`. JavaScript también tiene una característica llamada _((generador))_ functions. Son similares, pero sin las promesas.

Cuando defines una función con `function*` (colocando un asterisco después de la palabra `function`), se convierte en un generador. Al llamar a un generador, devuelve un ((iterador)), que ya vimos en [Capítulo ?](object).

```
function* powers(n) {
  for (let current = n;; current *= n) {
    yield current;
  }
}

for (let power of powers(3)) {
  if (power > 50) break;
  console.log(power);
}
// → 3
// → 9
// → 27
```

{{index "next method", "yield keyword"}}

Inicialmente, al llamar a `powers`, la función se congela desde el principio. Cada vez que llamas a `next` en el iterador, la función se ejecuta hasta que encuentra una expresión `yield`, que la pausa y hace que el valor generado se convierta en el próximo valor producido por el iterador. Cuando la función retorna (la del ejemplo nunca lo hace), el iterador ha terminado.

Escribir iteradores a menudo es mucho más fácil cuando usas funciones generadoras. El iterador para la clase `Group` (del ejercicio en [Capítulo ?](object#group_iterator)) se puede escribir con este generador:

{{index "Group class"}}

```
Group.prototype[Symbol.iterator] = function*() {
  for (let i = 0; i < this.members.length; i++) {
    yield this.members[i];
  }
};
```

```{hidden: true, includeCode: true}
class Group {
  constructor() { this.members = []; }
  add(m) { this.members.add(m); }
}
```

{{index [state, in iterator]}}

Ya no es necesario crear un objeto para mantener el estado de la iteración: los generadores guardan automáticamente su estado local cada vez que hacen un `yield`.

Tales expresiones `yield` solo pueden ocurrir directamente en la función generadora misma y no en una función interna que definas dentro de ella. El estado que un generador guarda, al hacer yield, es solo su entorno _local_ y la posición donde hizo el yield.

{{index "await keyword"}}

Una función `async` es un tipo especial de generador. Produce una promesa al llamarla, la cual se resuelve cuando retorna (termina) y se rechaza cuando arroja una excepción. Cada vez que hace un yield (awaits) una promesa, el resultado de esa promesa (valor o excepción generada) es el resultado de la expresión `await`.## Un Proyecto de Arte de Corvidos

{{index "Carla la cuerva"}}

Esta mañana, Carla se despertó con un ruido desconocido en la pista de aterrizaje fuera de su hangar. Saltando al borde del techo, ve que los humanos están preparando algo. Hay muchos cables eléctricos, un escenario y una especie de gran pared negra que están construyendo.

Siendo una cuerva curiosa, Carla echa un vistazo más de cerca a la pared. Parece estar compuesta por varios dispositivos grandes con frente de vidrio conectados a cables. En la parte trasera, los dispositivos dicen "LedTec SIG-5030".

Una rápida búsqueda en Internet saca a relucir un manual de usuario para estos dispositivos. Parecen ser señales de tráfico, con una matriz programable de luces LED ambarinas. La intención de los humanos probablemente sea mostrar algún tipo de información en ellas durante su evento. Curiosamente, las pantallas pueden ser programadas a través de una red inalámbrica. ¿Podría ser que estén conectadas a la red local del edificio?

Cada dispositivo en una red recibe una _dirección IP_, que otros dispositivos pueden usar para enviarle mensajes. Hablamos más sobre eso en el [Capítulo ?](browser). Carla nota que sus propios teléfonos reciben direcciones como `10.0.0.20` o `10.0.0.33`. Podría valer la pena intentar enviar mensajes a todas esas direcciones y ver si alguna responde a la interfaz descrita en el manual de las señales.

El [Capítulo ?](http) muestra cómo hacer solicitudes reales en redes reales. En este capítulo, usaremos una función ficticia simplificada llamada `request` para la comunicación en red. Esta función toma dos argumentos: una dirección de red y un mensaje, que puede ser cualquier cosa que se pueda enviar como JSON, y devuelve una promesa que se resuelve con una respuesta de la máquina en la dirección dada, o se rechaza si hubo un problema.

Según el manual, puedes cambiar lo que se muestra en una señal SIG-5030 enviándole un mensaje con contenido como `{"command": "display", "data": [0, 0, 3, …]}`, donde `data` contiene un número por cada punto de LED, indicando su brillo; 0 significa apagado, 3 significa brillo máximo. Cada señal tiene 50 luces de ancho y 30 luces de alto, por lo que un comando de actualización debe enviar 1500 números.

Este código envía un mensaje de actualización de pantalla a todas las direcciones en la red local para ver cuál se queda. Cada uno de los números en una dirección IP puede ir de 0 a 255. En los datos que envía, activa un número de luces correspondiente al último número de la dirección de red.

```
for (let addr = 1; addr < 256; addr++) {
  let data = [];
  for (let n = 0; n < 1500; n++) {
    data.push(n < addr ? 3 : 0);
  }
  let ip = `10.0.0.${addr}`;
  request(ip, {command: "display", data})
    .then(() => console.log(`Solicitud a ${ip} aceptada`))
    .catch(() => {});
}
```

Dado que la mayoría de estas direcciones no existirán o no aceptarán tales mensajes, la llamada a `catch` se asegura de que los errores de red no hagan que el programa falle. Las solicitudes se envían todas inmediatamente, sin esperar a que otras solicitudes terminen, para no perder tiempo cuando algunas de las máquinas no respondan.

Después de haber iniciado su exploración de red, Carla regresa afuera para ver el resultado. Para su deleite, todas las pantallas ahora muestran una franja de luz en sus esquinas superiores izquierdas. Están en la red local y sí aceptan comandos. Rápidamente toma nota de los números mostrados en cada pantalla. Hay 9 pantallas, dispuestas tres en alto y tres en ancho. Tienen las siguientes direcciones de red:```{includeCode: true}
const screenAddresses = [
  "10.0.0.44", "10.0.0.45", "10.0.0.41",
  "10.0.0.31", "10.0.0.40", "10.0.0.42",
  "10.0.0.48", "10.0.0.47", "10.0.0.46"
];
```

Ahora esto abre posibilidades para todo tipo de travesuras. Podría mostrar "los cuervos mandan, los humanos babean" en la pared en letras gigantes. Pero eso se siente un poco grosero. En su lugar, planea mostrar un video de un cuervo volando que cubre todas las pantallas por la noche.

Carla encuentra un clip de video adecuado, en el cual un segundo y medio de metraje se puede repetir para crear un video en bucle mostrando el aleteo de un cuervo. Para ajustarse a las nueve pantallas (cada una de las cuales puede mostrar 50 por 30 píxeles), Carla corta y redimensiona los videos para obtener una serie de imágenes de 150 por 90, diez por segundo. Estas luego se cortan en nueve rectángulos cada una, y se procesan para que los puntos oscuros en el video (donde está el cuervo) muestren una luz brillante, y los puntos claros (sin cuervo) permanezcan oscuros, lo que debería crear el efecto de un cuervo ámbar volando contra un fondo negro.

Ella ha configurado la variable `clipImages` para contener un array de fotogramas, donde cada fotograma se representa con un array de nueve conjuntos de píxeles, uno para cada pantalla, en el formato que los letreros esperan.

Para mostrar un único fotograma del video, Carla necesita enviar una solicitud a todas las pantallas a la vez. Pero también necesita esperar el resultado de estas solicitudes, tanto para no comenzar a enviar el siguiente fotograma antes de que el actual se haya enviado correctamente, como para notar cuando las solicitudes están fallando.

{{index "Promise.all function"}}

`Promise` tiene un método estático `all` que se puede usar para convertir un array de promesas en una sola promesa que se resuelve en un array de resultados. Esto proporciona una forma conveniente de que algunas acciones asíncronas sucedan al lado unas de otras, esperar a que todas terminen y luego hacer algo con sus resultados (o al menos esperar a que terminen para asegurarse de que no fallen).

```{includeCode: true}
function displayFrame(frame) {
  return Promise.all(frame.map((data, i) => {
    return request(screenAddresses[i], {
      command: "display",
      data
    });
  }));
}
```

Esto recorre las imágenes en `frame` (que es un array de arrays de datos de visualización) para crear un array de promesas de solicitud. Luego devuelve una promesa que combina todas esas promesas.

Para poder detener un video en reproducción, el proceso está envuelto en una clase. Esta clase tiene un método asíncrono `play` que devuelve una promesa que solo se resuelve cuando la reproducción se detiene de nuevo a través del método `stop`.

```{includeCode: true}
function wait(time) {
  return new Promise(accept => setTimeout(accept, time));
}

class VideoPlayer {
  constructor(frames, frameTime) {
    this.frames = frames;
    this.frameTime = frameTime;
    this.stopped = true;
  }

  async play() {
    this.stopped = false;
    for (let i = 0; !this.stopped; i++) {
      let nextFrame = wait(this.frameTime);
      await displayFrame(this.frames[i % this.frames.length]);
      await nextFrame;
    }
  }

  stop() {
    this.stopped = true;
  }
}
```La función `wait` envuelve `setTimeout` en una promesa que se resuelve después del número de milisegundos especificado. Esto es útil para controlar la velocidad de reproducción.

```{startCode: true}
let video = new VideoPlayer(clipImages, 100);
video.play().catch(e => {
  console.log("La reproducción falló: " + e);
});
setTimeout(() => video.stop(), 15000);
```

Durante toda la semana que dura el muro de pantalla, todas las noches, cuando está oscuro, aparece misteriosamente un enorme pájaro naranja brillante en él.

## El bucle de eventos

{{index "programación asincrónica", programación, "bucle de eventos", línea de tiempo}}

Un programa asincrónico comienza ejecutando su script principal, que a menudo configurará devoluciones de llamada para ser llamadas más tarde. Ese script principal, así como las devoluciones de llamada, se ejecutan por completo de una vez, sin interrupciones. Pero entre ellos, el programa puede estar inactivo, esperando a que ocurra algo.

{{index "función setTimeout"}}

Por lo tanto, las devoluciones de llamada no son llamadas directamente por el código que las programó. Si llamo a `setTimeout` desde dentro de una función, esa función ya habrá retornado en el momento en que se llame a la función de devolución de llamada. Y cuando la devolución de llamada regresa, el control no vuelve a la función que lo programó.

{{index "clase Promise", palabra clave "catch", "manejo de excepciones"}}

El comportamiento asincrónico ocurre en su propia función vacía ((pila de llamadas)). Esta es una de las razones por las que, sin promesas, gestionar excepciones en código asincrónico es tan difícil. Dado que cada devolución de llamada comienza con una pila de llamadas en su mayoría vacía, sus manejadores de `catch` no estarán en la pila cuando lancen una excepción.

```
try {
  setTimeout(() => {
    throw new Error("¡Zoom!");
  }, 20);
} catch (e) {
  // Esto no se ejecutará
  console.log("Atrapado", e);
}
```

{{index hilo, cola}}

No importa cuán cerca ocurran eventos, como tiempos de espera o solicitudes entrantes, un entorno JavaScript ejecutará solo un programa a la vez. Puedes pensar en esto como ejecutar un gran bucle _alrededor_ de tu programa, llamado el _bucle de eventos_. Cuando no hay nada que hacer, ese bucle se pausa. Pero a medida que llegan eventos, se agregan a una cola y su código se ejecuta uno tras otro. Debido a que no se ejecutan dos cosas al mismo tiempo, un código lento puede retrasar el manejo de otros eventos.

Este ejemplo establece un tiempo de espera pero luego se demora hasta después del momento previsto para el tiempo de espera, provocando que el tiempo de espera sea tardío.

```
let start = Date.now();
setTimeout(() => {
  console.log("El tiempo de espera se ejecutó en", Date.now() - start);
}, 20);
while (Date.now() < start + 50) {}
console.log("Tiempo perdido hasta", Date.now() - start);
// → Tiempo perdido hasta 50
// → El tiempo de espera se ejecutó en 55
```

{{index "resolviendo (una promesa)", "rechazando (una promesa)", "clase Promise"}}

Las promesas siempre se resuelven o se rechazan como un nuevo evento. Incluso si una promesa ya está resuelta, esperarla hará que su devolución de llamada se ejecute después de que termine el script actual, en lugar de inmediatamente.

```
Promise.resolve("Hecho").then(console.log);
console.log("¡Yo primero!");
// → ¡Yo primero!
// → Hecho
```

En capítulos posteriores veremos varios tipos de eventos que se ejecutan en el bucle de eventos.## Errores asincrónicos

{{index "programación asincrónica", [estado, transiciones]}}

Cuando tu programa se ejecuta de forma síncrona, de una sola vez, no hay cambios de estado ocurriendo excepto aquellos que el programa mismo realiza. Para programas asíncronos esto es diferente, pueden tener _brechas_ en su ejecución durante las cuales otro código puede correr.

Veamos un ejemplo. Esta es una función que intenta reportar el tamaño de cada archivo en un arreglo de archivos, asegurándose de leerlos todos al mismo tiempo en lugar de en secuencia.

{{index "función fileSizes"}}

```{includeCode: true}
async function fileSizes(files) {
  let lista = "";
  await Promise.all(files.map(async fileName => {
    lista += fileName + ": " +
      (await textFile(fileName)).length + "\n";
  }));
  return lista;
}
```

{{index "función async"}}

La parte `async fileName =>` muestra cómo también se pueden hacer ((arrow function))s `async` colocando la palabra `async` delante de ellas.

{{index "función Promise.all"}}

El código no parece ser sospechoso de inmediato... mapea la función flecha `async` sobre el arreglo de nombres, creando un arreglo de promesas, y luego usa `Promise.all` para esperar a todas ellas antes de devolver la lista que construyen.

Pero está totalmente roto. Siempre devolverá solo una línea de salida, enumerando el archivo que tardó más en leer.

{{if interactive

```
fileSizes(["plans.txt", "shopping_list.txt"])
  .then(console.log);
```

if}}

¿Puedes descubrir por qué?

{{index "operador +="}}

El problema radica en el operador `+=`, que toma el valor _actual_ de `lista` en el momento en que comienza a ejecutarse la instrucción y luego, cuando el `await` termina, establece el enlace `lista` como ese valor más la cadena agregada.

{{index "palabra clave await"}}

Pero entre el momento en que comienza a ejecutarse la instrucción y el momento en que termina, hay una brecha asincrónica. La expresión `map` se ejecuta antes de que se agregue cualquier cosa a la lista, por lo que cada uno de los operadores `+=` comienza desde una cadena vacía y termina, cuando termina su recuperación de almacenamiento, estableciendo `lista` en el resultado de agregar su línea a la cadena vacía.

{{index "efecto secundario"}}

Esto podría haberse evitado fácilmente devolviendo las líneas de las promesas mapeadas y llamando a `join` en el resultado de `Promise.all`, en lugar de construir la lista cambiando un enlace. Como suele ser, calcular nuevos valores es menos propenso a errores que cambiar valores existentes.

{{index "función fileSizes"}}

```
async function fileSizes(files) {
  let líneas = files.map(async fileName => {
    return fileName + ": " +
      (await textFile(fileName)).length;
  });
  return (await Promise.all(líneas)).join("\n");
}
```

Errores como este son fáciles de cometer, especialmente al usar `await`, y debes ser consciente de dónde ocurren las brechas en tu código. Una ventaja de la asincronía _explícita_ de JavaScript (ya sea a través de devoluciones de llamada, promesas o `await`) es que identificar estas brechas es relativamente fácil.

## Resumen

La programación asincrónica hace posible expresar la espera de acciones de larga duración sin congelar todo el programa. Los entornos de JavaScript típicamente implementan este estilo de programación utilizando devoluciones de llamada, funciones que se llaman cuando las acciones se completan. Un bucle de eventos programa estas devoluciones de llamada para que se llamen cuando sea apropiado, una tras otra, de modo que su ejecución no se superponga.La programación de forma asíncrona se facilita gracias a las promesas, que son objetos que representan acciones que podrían completarse en el futuro, y las funciones `async`, que te permiten escribir un programa asíncrono como si fuera sincrónico.

## Ejercicios

### Momentos de tranquilidad

{{index "momentos de tranquilidad (ejercicio)", "cámara de seguridad", "Carla la urraca", "función async"}}

Hay una cámara de seguridad cerca del laboratorio de Carla que se activa con un sensor de movimiento. Está conectada a la red y comienza a enviar un flujo de video cuando está activa. Como prefiere no ser descubierta, Carla ha configurado un sistema que detecta este tipo de tráfico de red inalámbrico y enciende una luz en su guarida cada vez que hay actividad afuera, para que ella sepa cuándo mantenerse en silencio.

{{index "clase Date", "función Date.now", marca de tiempo}}

También ha estado registrando los momentos en que la cámara se activa desde hace un tiempo, y quiere utilizar esta información para visualizar qué momentos, en una semana promedio, tienden a ser tranquilos y cuáles tienden a ser ocupados. El registro se almacena en archivos que contienen un número de marca de tiempo por línea (como devuelto por `Date.now()`).

```{lang: null}
1695709940692
1695701068331
1695701189163
```

El archivo `"camera_logs.txt"` contiene una lista de archivos de registro. Escribe una función asíncrona `activityTable(día)` que, para un día de la semana dado, devuelva un array de 24 números, uno para cada hora del día, que contenga la cantidad de observaciones de tráfico de red de la cámara vista en esa hora del día. Los días se identifican por número utilizando el sistema utilizado por `Date.getDay`, donde el domingo es 0 y el sábado es 6.

La función `activityGraph`, proporcionada por el sandbox, resume dicha tabla en una cadena.

{{index "función textFile"}}

Utiliza la función `textFile` definida anteriormente, que al recibir un nombre de archivo devuelve una promesa que se resuelve en el contenido del archivo. Recuerda que `new Date(marcaDeTiempo)` crea un objeto `Date` para ese momento, que tiene métodos `getDay` y `getHours` que devuelven el día de la semana y la hora del día.

Ambos tipos de archivos, la lista de archivos de registro y los propios archivos de registro, tienen cada dato en su propia línea, separados por caracteres de nueva línea (`"\n"`).

{{if interactive

```{test: no}
async function activityTable(day) {
  let logFileList = await textFile("camera_logs.txt");
  // Tu código aquí
}

activityTable(1)
  .then(table => console.log(activityGraph(table)));
```

if}}

{{hint

{{index "momentos de tranquilidad (ejercicio)", "método split", "función textFile", "clase Date"}}

Necesitarás convertir el contenido de estos archivos en un array. La forma más fácil de hacerlo es utilizando el método `split` en la cadena producida por `textFile`. Ten en cuenta que para los archivos de registro, eso seguirá dándote un array de cadenas, que debes convertir a números antes de pasarlos a `new Date`.

Resumir todos los puntos temporales en una tabla de horas se puede hacer creando una tabla (array) que contenga un número para cada hora del día. Luego puedes recorrer todos los marca de tiempos (sobre los archivos de registro y los números en cada archivo de registro) y, para cada uno, si sucedió en el día correcto, toma la hora en que ocurrió y suma uno al número correspondiente en la tabla.{{index "función async", "palabra clave await", "clase Promise"}}

Asegúrate de usar `await` en el resultado de las funciones asíncronas antes de hacer cualquier cosa con él, o terminarás con una `Promise` donde esperabas un string.

hinting}}


### Promesas Reales

{{index "promesas reales (ejercicio)", "clase Promise"}}

Reescribe la función del ejercicio anterior sin `async`/`await`, utilizando métodos simples de `Promise`.

{{if interactive

```{test: no}
function activityTable(día) {
  // Tu código aquí
}

activityTable(6)
  .then(tabla => console.log(gráficoActividad(tabla)));
```

if}}

{{index "función async", "palabra clave await", rendimiento}}

En este estilo, usar `Promise.all` será más conveniente que intentar modelar un bucle sobre los archivos de registro. En la función `async`, simplemente usar `await` en un bucle es más simple. Si leer un archivo toma un tiempo, ¿cuál de estos dos enfoques tomará menos tiempo para ejecutarse?

{{index "rechazar (una promesa)"}}

Si uno de los archivos listados en la lista de archivos tiene un error tipográfico, y falla al leerlo, ¿cómo termina ese fallo en el objeto `Promise` que retorna tu función?

{{hint

{{index "promesas reales (ejercicio)", "método then", "función textFile", "función Promise.all"}}

El enfoque más directo para escribir esta función es usar una cadena de llamadas `then`. La primera promesa se produce al leer la lista de archivos de registro. El primer callback puede dividir esta lista y mapear `textFile` sobre ella para obtener una matriz de promesas para pasar a `Promise.all`. Puede devolver el objeto devuelto por `Promise.all`, para que lo que sea que eso devuelva se convierta en el resultado del valor de retorno de este primer `then`.

{{index "programación asincrónica"}}

Ahora tenemos una promesa que devuelve un array de archivos de registro. Podemos llamar a `then` nuevamente en eso, y poner la lógica de conteo de marcas de tiempo allí. Algo así:

```{test: no}
function activityTable(día) {
  return textoArchivo("registros_camara.txt").then(archivos => {
    return Promise.all(archivos.split("\n").map(textoArchivo));
  }).then(logs => {
    // analizar...
  });
}
```

O podrías, para una programación aún mejor, poner el análisis de cada archivo dentro de `Promise.all`, para que ese trabajo pueda comenzar para el primer archivo que regresa del disco, incluso antes de que los otros archivos regresen.

```{test: no}
function activityTable(día) {
  let tabla = []; // inicializar...
  return textoArchivo("registros_camara.txt").then(archivos => {
    return Promise.all(archivos.split("\n").map(nombre => {
      return textoArchivo(nombre).then(log => {
        // analizar...
      });
    }));
  }).then(() => tabla);
}
```

{{index "palabra clave await", programación de planificación}}

Lo que muestra que la forma en que estructuras tus promesas puede tener un efecto real en la forma en que se programa el trabajo. Un simple bucle con `await` hará que el proceso sea completamente lineal: espera a que se cargue cada archivo antes de continuar. `Promise.all` hace posible que varias tareas sean trabajadas conceptualmente al mismo tiempo, permitiéndoles progresar mientras los archivos aún se están cargando. Esto puede ser más rápido, pero también hace que el orden en que sucederán las cosas sea menos predecible. En este caso, donde solo vamos a estar incrementando números en una tabla, eso no es difícil de hacer de manera segura. Para otros tipos de problemas, puede ser mucho más difícil.{{index "rechazar (una promesa)", "método then"}}

Cuando un archivo en la lista no existe, la promesa devuelta por `textFile` será rechazada. Debido a que `Promise.all` se rechaza si alguna de las promesas que se le pasan falla, el valor de retorno de la devolución de llamada dada al primer `then` también será una promesa rechazada. Esto hace que la promesa devuelta por `then` falle, por lo que la devolución de llamada dada al segundo `then` ni siquiera se llama, y se devuelve una promesa rechazada desde la función.

hint}}

### Construyendo Promise.all

{{index "clase Promise", "función Promise.all", "construyendo Promise.all (ejercicio)"}}

Como vimos, dado un array de promesas, `Promise.all` devuelve una promesa que espera a que todas las promesas en el array finalicen. Luego tiene éxito, devolviendo un array de valores de resultado. Si una promesa en el array falla, la promesa devuelta por `all` también falla, con la razón de fallo de la promesa que falló.

Implementa algo similar tú mismo como una función regular llamada `Promise_all`.

Recuerda que después de que una promesa tiene éxito o falla, no puede volver a tener éxito o fallar, y las llamadas posteriores a las funciones que la resuelven se ignoran. Esto puede simplificar la forma en que manejas el fallo de tu promesa.

{{if interactive

```{test: no}
function Promise_all(promesas) {
  return new Promise((resolver, rechazar) => {
    // Tu código aquí.
  });
}

// Código de prueba.
Promise_all([]).then(array => {
  console.log("Esto debería ser []:", array);
});
function pronto(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([pronto(1), pronto(2), pronto(3)]).then(array => {
  console.log("Esto debería ser [1, 2, 3]:", array);
});
Promise_all([pronto(1), Promise.reject("X"), pronto(3)])
  .then(array => {
    console.log("No deberíamos llegar aquí");
  })
  .catch(error => {
    if (error != "X") {
      console.log("Fallo inesperado:", error);
    }
  });
```

if}}

{{hint

{{index "función Promise.all", "clase Promise", "método then", "construyendo Promise.all (ejercicio)"}}

La función pasada al constructor `Promise` tendrá que llamar a `then` en cada una de las promesas en el array dado. Cuando una de ellas tiene éxito, dos cosas deben suceder. El valor resultante debe ser almacenado en la posición correcta de un array de resultados, y debemos verificar si esta era la última promesa pendiente y finalizar nuestra propia promesa si lo era.

{{index "variable de contador"}}

Esto último se puede hacer con un contador que se inicializa con la longitud del array de entrada y del cual restamos 1 cada vez que una promesa tiene éxito. Cuando llegue a 0, hemos terminado. Asegúrate de tener en cuenta la situación en la que el array de entrada está vacío (y por lo tanto ninguna promesa se resolverá nunca).

Manejar el fallo requiere un poco de pensamiento pero resulta ser extremadamente simple. Simplemente pasa la función `reject` de la promesa contenedora a cada una de las promesas en el array como un controlador `catch` o como un segundo argumento para `then` para que un fallo en una de ellas desencadene el rechazo de toda la promesa contenedora.

pista