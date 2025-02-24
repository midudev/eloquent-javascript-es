{{meta {load_files: ["code/hangar2.js", "code/chapter/11_async.js"], zip: "node/html"}}}

# Programación Asíncrona

{{quote {author: "Laozi", title: "Tao Te Ching", chapter: true}

¿Quién puede esperar en silencio mientras el barro se asienta?\
¿Quién puede permanecer quieto hasta el momento de la acción?

quote}}

{{index "Laozi"}}

{{figure {url: "img/chapter_picture_11.jpg", alt: "Ilustración que muestra dos cuervos en una rama de árbol", chapter: framed}}}

La parte central de una computadora, la parte que lleva a cabo los pasos individuales que componen nuestros programas, se llama _((procesador))_. Los programas que hemos visto hasta ahora mantendrán ocupado al procesador hasta que hayan terminado su trabajo. La velocidad a la cual puede ser ejecutado algo como un bucle que manipula números depende casi enteramente de la velocidad del procesador y la memoria de la computadora.

{{index [memoria, velocidad], [red, velocidad]}}

Pero muchos programas interactúan con cosas fuera del procesador. Por ejemplo, pueden comunicarse a través de una red de computadoras o solicitar datos desde el ((disco duro)), lo cual es mucho más lento que obtenerlos de la memoria.

Cuando esto está sucediendo, sería una lástima dejar el procesador inactivo: podría haber otro trabajo que este podría hacer en ese tiempo. En parte, esto es algo que maneja tu sistema operativo, el cual irá dándole al procesador múltiples programas en ejecución, haciendo que vaya cambiando entre ellos. Pero eso no ayuda cuando queremos que un _único_ programa pueda avanzar mientras espera una solicitud de red.

## Asincronía

{{index "programación sincrónica"}}

En un modelo de programación _sincrónico_, las cosas suceden una a una. Cuando llamas a una función que realiza una acción de larga duración, esta solo retorna cuando la acción ha terminado y puede devolver su resultado. Esto detiene tu programa durante el tiempo que tome la acción.

{{index "programación asíncrona"}}

Un modelo _asíncrono_ permite que múltiples cosas sucedan al mismo tiempo. Cuando inicias una acción, tu programa continúa ejecutándose. Cuando la acción termina, el programa es informado y obtiene acceso al resultado (por ejemplo, los datos leídos desde el disco).

Podemos comparar la programación sincrónica y asíncrona usando un pequeño ejemplo: un programa que realiza dos solicitudes a través de la ((red)) y luego combina de algún modo los resultados.

{{index "programación sincrónica"}}

En un entorno sincrónico, donde la función de solicitud retorna solo después de haber hecho su trabajo, la forma más fácil de realizar esta tarea es hacer las solicitudes una después de la otra. Esto tiene la desventaja de que la segunda solicitud se iniciará solo cuando la primera haya terminado. El tiempo total necesario será al menos la suma de los dos tiempos de respuesta.

{{index paralelismo}}

La solución a este problema, en un sistema sincrónico, es iniciar ((hilo))s de control adicionales. Un _hilo_ es otro programa en ejecución cuya ejecución puede ser intercalada con otros programas por el sistema operativo —como la mayoría de las computadoras modernas contienen múltiples procesadores, podrían ejecutarse incluso múltiples hilos al mismo tiempo, en diferentes procesadores. Un segundo hilo podría iniciar la segunda solicitud, y luego ambos hilos podrían esperar sus resultados, después de lo cual se resincronizan para combinarlos.

{{index CPU, bloqueo, "programación asíncrona", "línea de tiempo", "función de devolución de llamada"}}

En el siguiente diagrama, las líneas gruesas representan el tiempo que el programa pasa funcionando normalmente, y las líneas delgadas representan el tiempo gastado esperando a la red. En el modelo sincrónico, el tiempo tomado por la red es _parte_ de la línea de tiempo para un hilo de control dado. En el modelo asíncrono, iniciar una acción en la red permite que el programa continúe ejecutándose mientras la comunicación en la red sucede junto a él, notificando al programa cuando haya terminado.

{{figure {url: "img/control-io.svg", alt: "Diagrama que muestra el flujo de control en programas sincrónicos y asíncronos. La primera parte muestra un programa sincrónico, donde las fases activas y de espera del programa ocurren en una única línea secuencial. La segunda parte muestra un programa sincrónico multi-hilo, con dos líneas paralelas en las cuales las partes de espera suceden una al lado de la otra, haciendo que el programa termine más rápido. La última parte muestra un programa asíncrono, donde las múltiples acciones asíncronas se ramifican desde el programa principal, el cual se detiene en algún momento y luego continúa cuando la primera cosa por la que estaba esperando finaliza.", width: "8cm"}}}

{{index ["flujo de control", "asíncrono"], "programación asíncrona", verbosidad, rendimiento}}

Otra forma de describir la diferencia es que esperar a que las acciones terminen es _implícito_ en el modelo sincrónico, mientras que es _explícito_, bajo nuestro control, en el modelo asíncrono.

La asincronía tiene sus pros y sus contras. Facilita la expresión de programas que no encajan en el modelo de control en línea recta, pero también puede hacer que expresar programas que siguen una línea recta sea más complicado. Veremos algunas formas de reducir esta dificultad más adelante en el capítulo.

Las dos plataformas de programación de JavaScript más importantes —((navegadores)) y ((Node.js))— hacen que las operaciones que podrían tardar un tiempo sean asíncronas, en lugar de depender de ((hilos)). Dado que programar con hilos es notoriamente difícil (entender lo que hace un programa es mucho más difícil cuando está haciendo múltiples cosas a la vez), esto generalmente se considera algo bueno.

## Callbacks

{{indexsee ["función", "devolución de llamada"], "función de devolución de llamada"}}

Un enfoque para la ((programación asíncrona)) es hacer que las funciones que necesitan esperar por algo tomen un argumento adicional, una _((función de devolución de llamada))_, o _función de callback_. La función asíncrona inicia algún proceso, configura las cosas para que se llame a la función de callback cuando el proceso termine, y luego retorna.

{{index "función setTimeout", espera}}

Como ejemplo, la función `setTimeout`, disponible tanto en Node.js como en los navegadores, espera un número dado de milisegundos (un segundo equivale a mil milisegundos) y luego llama a una función.

```{test: no}
setTimeout(() => console.log("Tick"), 500);
```

Esperar no suele ser una tarea muy importante, pero puede ser muy útil cuando necesitas hacer que algo suceda en un momento determinado o verificar si alguna otra acción está tomando más tiempo del esperado.

{{index "función readTextFile"}}

Otro ejemplo de operación asíncrona común es leer un archivo desde el almacenamiento de un dispositivo. Imagina que tienes una función `readTextFile`, la cual lee el contenido de un archivo como una cadena y lo pasa a una función de callback.

```
readTextFile("lista_compra.txt", contenido => {
  console.log(`Lista de Compras:\n${contenido}`);
});
// → Lista de Compras:
// → Mantequilla de cacahuate
// → Plátanos
```

La función `readTextFile` no es parte del estándar de JavaScript. Veremos cómo leer archivos en el navegador y en Node.js en capítulos posteriores.

Realizar múltiples acciones asíncronas en serie usando callbacks implica que debes seguir pasando nuevas funciones para gestionar la continuación del proceso después de cada acción. Esta es la pinta que tendría una función asíncrona que compara dos archivos y produce un booleano que indica si su contenido es el mismo.

```
function compararArchivos(archivoA, archivoB, callback) {
  readTextFile(archivoA, contenidoA => {
    readTextFile(archivoB, contenidoB => {
      callback(contenidoA == contenidoB);
    });
  });
}
```

Este estilo de programación es factible, pero el nivel de sangrado aumenta con cada acción asíncrona porque terminas estando en otra función. Cosas más complicadas, como envolver acciones asíncronas en un bucle, pueden volverse muy incómodas.

De alguna manera, la asincronía es contagiosa. Cualquier función que llame a una función que trabaja de forma asíncrona debe ser asíncrona en sí misma, utilizando un callback u otro mecanismo similar para entregar su resultado. Llamar a una función callback es algo más complicado y propenso a errores que simplemente devolver un valor, por lo que crear la necesidad de estructurar grandes partes de tu programa de esa manera no es ideal.

## Promesas

Una forma ligeramente diferente de construir un programa asíncrono es hacer que las funciones asíncronas devuelvan un objeto que represente su resultado (futuro) en lugar de pasar callbacks por todas partes. De esta manera, tales funciones realmente devuelven algo con sentido, y la estructura del programa se asemeja más a la de los programas sincrónicos.

{{index "clase Promise", "programación asíncrona", "resolviendo (una promesa)", "método then", "función de devolución de llamada"}}

Para esto sirve la clase estándar `Promise`. Una _promesa_ es un recibo que representa un valor que aún puede no estar disponible. Proporciona un método `then` que te permite registrar una función que debe ser llamada cuando la acción por la que está esperando finalice. Cuando la promesa se _resuelve_, es decir, cuando su valor se vuelve disponible, esas funciones (puede haber varias) son llamadas con el valor del resultado. Es posible llamar a `then` en una promesa que ya ha sido resuelta —tu función aún será llamada.

{{index "función Promise.resolve"}}

La forma más sencilla de crear una promesa es llamando a `Promise.resolve`. Esta función se asegura de que el valor que le proporcionas esté envuelto en una promesa. Si ya es una promesa, simplemente se devuelve; de lo contrario, obtienes una nueva promesa que se resuelve de inmediato con tu valor como resultado.

```
let quince = Promise.resolve(15);
quince.then(valor => console.log(`Obtenido ${valor}`));
// → Obtenido 15
```

{{index "Clase Promise"}}

Para crear una promesa que no se resuelva inmediatamente, puedes utilizar `Promise` como constructor. Tiene una interfaz un tanto extraña: el constructor espera una función como argumento, a la cual llama inmediatamente, pasándole como argumento una función (`resolver`, en el ejemplo) que puede utilizar para resolver la promesa.

Así es como podrías crear una interfaz basada en promesas para la función `readTextFile`:

{{index "Función archivoTexto"}}

```
function archivoTexto(nombreArchivo) {
  return new Promise(resolver => {
    readTextFile(nombreArchivo, texto => resolver(texto));
  });
}

archivoTexto("planes.txt").then(console.log);
```

Observa cómo esta función asíncrona devuelve un valor con sentido: una promesa de proporcionarte el contenido del archivo en algún momento futuro.

{{index "método then"}}

Una característica útil del método `then` es que él mismo devuelve otra promesa que se resuelve al valor retornado por la función de callback o, si esa función devuelve una promesa, al valor al que esa promesa se resuelve. De esta forma, puedes "encadenar" varias llamadas a `then` para configurar una secuencia de acciones asíncronas.

Esta función, la cual lee un archivo lleno de nombres de archivos y devuelve el contenido de un archivo aleatorio de esa lista, muestra este tipo de cadena asíncrona de promesas.

```
function archivoAleatorio(archivoLista) {
  return archivoTexto(archivoLista)
    .then(contenido => contenido.trim().split("\n"))
    .then(ls => ls[Math.floor(Math.random() * ls.length)])
    .then(nombreArchivo => archivoTexto(nombreArchivo));
}
```

La función devuelve el resultado de esta cadena de llamadas a `then`. La promesa inicial obtiene la lista de archivos como una cadena. La primera llamada a `then` transforma esa cadena en un array de líneas, produciendo una nueva promesa. La segunda llamada a `then` elige una línea aleatoria del resultado de resolver esta promesa, produciendo una tercera promesa que arroja un único nombre de archivo. La llamada final a `then` lee este archivo, de modo que el resultado de la función en su totalidad es una promesa que devuelve el contenido de un archivo aleatorio.

En este código, las funciones utilizadas en las primeras dos llamadas a `then` devuelven un valor normal, que se pasará inmediatamente a la promesa devuelta por `then` cuando la función retorne. La última devuelve una promesa (`archivoTexto(nombreArchivo)`), lo que la convierte en un paso asíncrono de verdad.

También habría sido posible realizar todos estos pasos dentro de un solo callback de `then`, ya que solo el último paso es realmente asíncrono. Pero el tipo de envolturas `then` que solo realizan alguna transformación de datos sincrónica son a menudo útiles, por ejemplo, cuando deseas devolver una promesa que produzca una versión procesada de algún resultado asíncrono.

```
function archivoJson(nombreArchivo) {
  return archivoTexto(nombreArchivo).then(JSON.parse);
}

archivoJson("package.json").then(console.log);
```

En general, es útil pensar en las promesas como un mecanismo que permite al código ignorar la pregunta de cuándo va a llegar un valor. Un valor normal tiene que existir realmente antes de que podamos hacer referencia a él. Un valor prometido es un valor que _puede_ estar allí o podría aparecer en algún momento en el futuro. Las operaciones definidas en términos de promesas, al conectarlas con llamadas `then`, se ejecutan de forma asíncrona a medida que sus entradas están disponibles.

## Fallo

{{index "manejo de excepciones"}}

Un procedimiento normal de JavaScript puede fallar lanzando una excepción. Los procedimientos asíncronos a menudo necesitan algo así. Una solicitud de red puede fallar, un archivo puede no existir, o algún código que forma parte de un procedimiento asíncrono puede lanzar una excepción.

{{index "función de devolución de llamada", error}}

Uno de los problemas más urgentes del estilo de programación asíncrona basado en callbacks es que hace extremadamente difícil asegurarse de que los fallos se reporten adecuadamente a las funciones de callback.

Una convención ampliamente utilizada es que el primer argumento de la función de callback se utiliza para indicar que la acción ha fallado, y el segundo contiene el valor producido por la acción cuando ha terminado con éxito.

```
unaFuncionAsincrona((error, valor) => {
  if (error) manejarError(error);
  else procesarValor(valor);
});
```

Tales funciones de callback siempre deben verificar si recibieron una excepción y asegurarse de que cualquier problema que causen, incluidas las excepciones lanzadas por las funciones que llaman, se capturen y se den a la función correcta.

{{index "rechazar (una promesa)", "resolver (una promesa)", "método then"}}

Las promesas facilitan esto. Pueden ser o bien resueltas (la acción se completó con éxito) o rechazadas (la acción falló). Los manejadores de resolución (registrados con `then`) se llaman solo cuando la acción es exitosa, y los rechazos se propagan a la nueva promesa devuelta por `then`. Cuando un manejador lanza una excepción, esto causa automáticamente que la promesa producida por su llamada a `then` sea rechazada. Entonces, si algún elemento en una cadena de acciones asíncronas falla, el resultado de toda la cadena se marca como rechazado, y ningún manejador de éxito se ejecuta más allá del punto en el que ocurrió el fallo.

{{index "función Promise.reject", "clase Promise"}}

Al igual que resolver una promesa proporciona un valor, rechazar una también lo hace, generalmente llamado el _motivo_ del rechazo. Cuando una excepción en una función manejadora causa el rechazo, el valor de la excepción se usa como dicho motivo. De manera similar, cuando una función manejadora devuelve una promesa que es rechazada, ese rechazo fluye hacia la siguiente promesa. Existe una función `Promise.reject` que crea una nueva promesa inmediatamente rechazada.

{{index "método catch"}}

Para manejar explícitamente tales rechazos, las promesas tienen un método `catch` que registra un manejador para ser llamado cuando la promesa es rechazada, similar a cómo los manejadores de `then` manejan la resolución normal. También es muy similar a `then` en que devuelve una nueva promesa, que se resuelve con el valor de la promesa original cuando se resuelve normalmente y con el resultado del manejador `catch` en caso contrario. Si un manejador de `catch` lanza un error, la nueva promesa también se rechaza.

{{index "método then"}}

Como atajo, `then` también acepta un manejador de rechazo como segundo argumento, conque puedes instalar ambos tipos de manejadores en una sola llamada de método: `.then(manejadorDeAceptación, manejadorDeRechazo)`.

Una función pasada al constructor `Promise` recibe un segundo argumento, junto con la función de resolución, que puede usar para rechazar la nueva promesa. Cuando nuestra función `readTextFile` encuentra un problema, pasa el error a su función callback como segundo argumento. Nuestro envoltorio `archivoTexto` debería realmente examinar ese argumento, de manera que un fallo cause que la promesa que devuelve sea rechazada.

```{includeCode: true}
function archivoTexto(filename) {
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
new Promise((_, rechazar) => rechazar(new Error("Fail")))
  .then(value => console.log("Manejador 1:", value))
  .catch(reason => {
    console.log("Error capturado " + reason);
    return "nada";
  })
  .then(value => console.log("Manejador 2:", value));
// → Error capturado Error: Fail
// → Manejador 2: nada
```

{{note "**N. del T.:** nótese cómo el parámetro que se pasa al constructor `Promise` es una función con dos parámetros que no representan otra cosa que el nombre de las funciones de resolución y rechazo que espera el constructor. JavaScript ya sabe que la función cuyo nombre se pasa como primer parámetro hará lo que se necesite cuando la promesa se resuelve sin problemas, y que la función cuyo nombre se pasa como segundo parámetro hará lo propio cuando la promesa es rechazada. El nombre que les pongamos a dichos parámetros es indiferente, aunque suele usarse `resolve` para el primer caso y `reject` para el segundo o, como en este ejemplo, `_` para el primero (porque ni siquiera lo necesitamos) y `rechazar` para el segundo."}}

El primer manejador `then` no es llamado porque, en ese punto del pipeline, la promesa contiene un rechazo. El manejador `catch` maneja ese rechazo y devuelve un valor, que se le da al segundo manejador `then`.

Cuando una excepción no controlada es manejada por el entorno, los entornos de JavaScript pueden detectar cuándo un rechazo de promesa no es manejado y lo reportarán como un error.

## Carla

Es un día soleado en Berlín. La pista del antiguo aeropuerto desmantelado está llena de ciclistas y patinadores en línea. En el césped, cerca de un contenedor de basura, un grupo de cuervos se agita ruidosamente, intentando convencer a un grupo de turistas de que les den sus sándwiches.

Uno de los cuervos destaca: una hembra grande, andrajosa, con algunas plumas blancas en su ala derecha. Está atrayendo a la gente con una habilidad y confianza que sugieren que ha estado haciendo esto durante mucho tiempo. Cuando un anciano se distrae con las travesuras de otro cuervo, ella se abalanza como quien no quiere la cosa, le arrebata su bollo a medio comer de la mano y se aleja planeando.

A diferencia del resto del grupo, que parece estar feliz de pasar el día holgazaneando por ahí, el cuervo grande parece tener un propósito. Llevando su botín, vuela directamente hacia el techo del edificio del hangar, desapareciendo por un conducto de ventilación.

Dentro del edificio, se puede escuchar un sonido peculiar: suave, pero persistente. Viene de un espacio estrecho bajo el techo de una escalera sin terminar. El cuervo está sentado allí, rodeado de sus botines robados: media docena de teléfonos inteligentes (varios de los cuales están encendidos) y un enredo de cables. Golpea rápidamente la pantalla de uno de los teléfonos con su pico. Aparecen palabras en él. Si no supieras más, pensarías que estaba escribiendo.

Este cuervo es conocido por sus iguales como "cāāw-krö". Pero dado que esos sonidos no son adecuados para las cuerdas vocales humanas, la llamaremos Carla.

Carla es un cuervo algo peculiar. En su juventud, estaba fascinada por el lenguaje humano, escuchando a la gente hasta que llegó incluso a entender lo que decían. Más tarde, su interés se trasladó a la tecnología humana, y comenzó a robar teléfonos para estudiarlos. Su proyecto actual es aprender a programar. El texto que está escribiendo en su laboratorio secreto, de hecho, es un fragmento de código JavaScript.

## Infiltración

{{index "Carla el cuervo"}}

A Carla le encanta Internet. Por desgracia, el teléfono en el que está trabajando está a punto de quedarse sin datos. El edificio tiene una red inalámbrica, pero se requiere un código para acceder a ella.

Afortunadamente, los rúteres inalámbricos del edificio tienen 20 años y están mal protegidos. Tras investigar un poco, Carla descubre que el mecanismo de autenticación de la red tiene un fallo que puede aprovechar. Al unirse a la red, un dispositivo debe enviar el código correcto de 6 dígitos. El punto de acceso responderá con un mensaje de éxito o fracaso dependiendo de si se proporciona el código correcto. Sin embargo, al enviar solo un código parcial (digamos, solo 3 dígitos), la respuesta es diferente según si esos dígitos son el inicio correcto del código o no. Cuando se envía un número incorrecto, se recibe inmediatamente un mensaje de fracaso. Cuando se envían los dígitos correctos, el punto de acceso espera más dígitos.

Esto acelera enormemente el descubrimiento del número. Carla puede encontrar el primer dígito probando cada número uno a uno, hasta que encuentre uno que no devuelva inmediatamente un fracaso. Teniendo un dígito, puede encontrar el segundo de la misma manera, y así sucesivamente, hasta que conozca todo el código de acceso.

Supongamos que tenemos una función `joinWifi`. Dado el nombre de la red y el código de acceso (como una cadena), intenta unirse a la red, devolviendo una promesa que se resuelve si tiene éxito, y se rechaza si la autenticación falla. Lo primero que necesitamos es una forma de envolver una promesa para que se rechace automáticamente después de transcurrir demasiado tiempo, de manera que podamos avanzar rápidamente si el punto de acceso no responde.

```{includeCode: true}
function conTiempoDeEspera(promesa, tiempo) {
  return new Promise((resolver, rechazar) => {
    promesa.then(resolver, rechazar);
    setTimeout(() => rechazar("Se agotó el tiempo"), tiempo);
  });
}
```

Esto aprovecha el hecho de que una promesa solo puede resolverse o rechazarse una vez: si la promesa dada como argumento se resuelve o se rechaza primero, ese será el resultado de la promesa devuelta por `conTiempoDeEspera`. Si, por otro lado, el `setTimeout` se ejecuta primero, rechazando la promesa, se ignora cualquier llamada posterior de resolución o rechazo.

Para encontrar todo el código de acceso, necesitamos buscar repetidamente el siguiente dígito probando cada dígito. Si la autenticación tiene éxito, sabremos que hemos encontrado lo que buscamos. Si falla inmediatamente, sabremos que ese dígito era incorrecto y debemos probar con el siguiente. Si el tiempo de la solicitud se agota, hemos encontrado otro dígito correcto y debemos continuar agregando otro dígito.

Como no puedes esperar una promesa dentro de un bucle `for`, Carla utiliza una función recursiva para llevar a cabo este proceso. En cada llamada, obtiene el código tal como lo conocemos hasta ahora, así como el siguiente dígito a probar. Dependiendo de lo que suceda, puede devolver un código terminado, o llamarse de nuevo a sí misma, ya sea para comenzar a descifrar la siguiente posición en el código, o para intentarlo de nuevo con otro dígito.

```{includeCode: true}
function crackearContraseña(identificadorDeRed) {
  function siguienteDígito(código, dígito) {
    let nuevoCódigo = código + dígito;
    return conTiempoDeEspera(joinWifi(identificadorDeRed, nuevoCódigo), 50)
      .then(() => nuevoCódigo)
      .catch(fallo => {
        if (fallo == "Se agotó el tiempo") {
          return siguienteDígito(nuevoCódigo, 0);
        } else if (dígito < 9) {
          return siguienteDígito(código, dígito + 1);
        } else {
          throw fallo;
        }
      });
  }
  return siguienteDígito("", 0);
}
```

El punto de acceso suele responder a solicitudes de autenticación incorrectas en aproximadamente 20 milisegundos, por lo que, para estar seguros, esta función espera 50 milisegundos antes de hacer expirar una solicitud.

```
crackearContraseña("HANGAR 2").then(console.log);
// → 555555
```

Carla inclina la cabeza y suspira. Esto habría sido más satisfactorio si el código hubiera sido un poco más difícil de adivinar.

## Funciones asíncronas

{{index "Promise class", recursion}}

Incluso con promesas, este tipo de código asíncrono es molesto de escribir. A menudo, necesitamos encadenar promesas de manera verbosa y de aparencia arbitraria —Carla ha tenido que usar una función recursiva para crear un bucle asíncrono.

{{index "synchronous programming", "asynchronous programming"}}

Lo que la función `crackearContraseña` realmente hace es completamente lineal: siempre espera a que la acción anterior se complete antes de comenzar la siguiente. Sería más sencillo de expresar en un modelo de programación sincrónica.

{{index "async function", "await keyword"}}

La buena noticia es que JavaScript te permite escribir código pseudo-sincrónico para describir procedimientos asíncronos. Una función `async` es una función que implícitamente devuelve una promesa y que puede, en su cuerpo, esperar (`await`) otras promesas de una manera que _parece_ sincrónica.

{{index "findInStorage function"}}

Podemos reescribir `crackearContraseña` de la siguiente manera:

```
async function crackearContraseña(identificadorDeRed) {
  for (let código = "";;) {
    for (let dígito = 0;; dígito++) {
      let nuevoCódigo = código + dígito;
      try {
        await withTimeout(joinWifi(identificadorDeRed, nuevoCódigo), 50);
        return nuevoCódigo;
      } catch (fallo) {
        if (fallo == "Se agotó el tiempo") {
          código = nuevoCódigo;
          break;
        } else if (dígito == 9) {
          throw fallo;
        }
      }
    }
  }
}
```

Esta versión muestra de manera más clara la estructura de doble bucle de la función (el bucle interno prueba los dígitos del 0 al 9 y el bucle externo añade dígitos al código de acceso).

{{index "async function", "return keyword", "exception handling"}}

Una función `async` está marcada con la palabra `async` antes de la palabra clave `function`. Los métodos también se pueden marcar como `async` escribiendo `async` antes de su nombre. Cuando se llama a una función o método de esta manera, lo que se devuelve es una promesa. Tan pronto como la función devuelve algo, esa promesa se resuelve. Si el cuerpo genera una excepción, la promesa es rechazada.

{{index "await keyword", ["control flow", "asincronía"]}}

Dentro de una función `async`, la palabra `await` puede colocarse delante de una expresión para esperar a que una promesa se resuelva y luego continuar con la ejecución de la función. Si la promesa es rechazada, se genera una excepción en el punto del `await`.

Una función de estas ya no se ejecuta de principio a fin de una vez como una función normal de JavaScript. En su lugar, puede estar _congelada_ en cualquier punto que tenga un `await`, y continuar más tarde.

Para la mayoría del código asíncrono, esta notación es más conveniente que usar directamente promesas. Aún así, es necesario comprender las promesas, ya que en muchos casos interactuarás con ellas directamente de todos modos. Pero al encadenarlas, las funciones `async` suelen ser más agradables de escribir que encadenar llamadas a `then`.

{{id generator}}

## Generadores

{{index "async function"}}

Esta capacidad de pausar y luego reanudar funciones no es exclusiva de las funciones `async`. JavaScript también tiene una característica llamada funciones ((generador))as (_generator functions_). Estas son parecidas a las funciones `async`, pero sin las promesas.

Cuando defines una función con `function*` (colocando un asterisco después de la palabra `function`), se convierte en un generador. Al llamar a un generador, este devuelve un ((iterador)), que ya estudiamos en el [Capítulo ?](object).

```
function* potencias(n) {
  for (let actual = n;; actual *= n) {
    yield actual;
  }
}

for (let potencia of potencias(3)) {
  if (potencia > 50) break;
  console.log(potencia);
}
// → 3
// → 9
// → 27
```

{{index "next method", "yield keyword"}}

Inicialmente, al llamar a `potencias`, la función se congela desde el principio. Cada vez que llamas a `next` en el iterador, la función se ejecuta hasta que encuentra una expresión `yield`, que la pausa y hace que el valor generado se convierta en el próximo valor producido por el iterador. Cuando la función retorna (la del ejemplo nunca lo hace), el iterador ha terminado.

Escribir iteradores a menudo es mucho más fácil cuando usas funciones generadoras. El iterador para la clase `Group` (del ejercicio en el [Capítulo ?](object#group_iterator)) se puede escribir con este generador:

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

Una función `async` es un tipo especial de generador. Produce una promesa al llamarla, la cual se resuelve cuando retorna (termina) y se rechaza cuando arroja una excepción. Cada vez que hace un yield de una promesa (es decir, la espera con `await`), el resultado de esa promesa (el valor o la excepción generada) es el resultado de la expresión `await`.

## Un Proyecto de Arte de Córvidos

{{index "Carla la cuerva"}}

Esta mañana, Carla se despertó con un ruido desconocido en la pista de aterrizaje fuera de su hangar. Saltando al borde del techo, ve que los humanos están preparando algo. Hay muchos cables eléctricos, un escenario y una especie de gran pared negra que están construyendo.

Como es una cuerva curiosa, Carla echa un vistazo más de cerca a la pared. Parece estar compuesta por varios dispositivos grandes con un frontal de vidrio conectados a cables. En la parte trasera, los dispositivos dicen "LedTec SIG-5030".

Una rápida búsqueda en Internet saca a relucir un manual de usuario para estos dispositivos. Parecen ser señales de tráfico, con una matriz programable de luces LED de color ámbar. La intención de los humanos probablemente sea mostrar algún tipo de información en ellas durante su evento. Curiosamente, las pantallas pueden ser programadas a través de una red inalámbrica. ¿Será posible que estén conectadas a la red local del edificio?

Cada dispositivo en una red recibe una _dirección IP_, que otros dispositivos pueden usar para enviarle mensajes. Hablaremos más sobre eso en el [Capítulo ?](browser). Carla se da cuenta que sus propios teléfonos reciben direcciones como `10.0.0.20` o `10.0.0.33`. Podría valer la pena intentar enviar mensajes a todas esas direcciones y ver si alguna responde a la interfaz descrita en el manual de las señales.

El [Capítulo ?](http) muestra cómo hacer solicitudes reales en redes reales. En este capítulo, usaremos una función ficticia simplificada llamada `request` para la comunicación en red. Esta función toma dos argumentos: una dirección de red y un mensaje, que puede ser cualquier cosa que se pueda enviar como JSON, y devuelve una promesa que se resuelve con una respuesta de la máquina en la dirección dada, o se rechaza si hubo un problema.

Según el manual, puedes cambiar lo que se muestra en una señal SIG-5030 enviándole un mensaje con contenido como `{"command": "display", "data": [0, 0, 3, …]}`, donde `data` contiene un número por cada LED, indicando su brillo; 0 significa apagado, 3 significa brillo máximo. Cada señal tiene 50 luces de ancho y 30 luces de alto, por lo que un comando de actualización debe enviar 1500 números.

Este código envía un mensaje de actualización de pantalla a todas las direcciones en la red local para ver cuál se queda. Cada uno de los números en una dirección IP puede ir de 0 a 255. En los datos que envía, activa un número de luces correspondiente al último número de la dirección de red.

```
for (let dir = 1; dir < 256; dir++) {
  let data = [];
  for (let n = 0; n < 1500; n++) {
    data.push(n < dir ? 3 : 0);
  }
  let ip = `10.0.0.${dir}`;
  request(ip, {command: "display", data})
    .then(() => console.log(`Solicitud a ${ip} aceptada`))
    .catch(() => {});
}
```

Dado que la mayoría de estas direcciones no existirán o no aceptarán tales mensajes, la llamada a `catch` se asegura de que los errores de red no hagan que el programa falle. Las solicitudes se envían todas inmediatamente, sin esperar a que otras solicitudes terminen, para no perder tiempo cuando algunas de las máquinas no respondan.

Después de haber iniciado su exploración de red, Carla regresa afuera para ver el resultado. Para su deleite, todas las pantallas ahora muestran una franja de luz en sus esquinas superiores izquierdas. Están en la red local y sí aceptan comandos. Rápidamente toma nota de los números mostrados en cada pantalla. Hay 9 pantallas, dispuestas tres en alto y tres en ancho. Tienen las siguientes direcciones de red:

```{includeCode: true}
const direccionesPantalla = [
  "10.0.0.44", "10.0.0.45", "10.0.0.41",
  "10.0.0.31", "10.0.0.40", "10.0.0.42",
  "10.0.0.48", "10.0.0.47", "10.0.0.46"
];
```

Ahora esto abre posibilidades para todo tipo de travesuras. Podría mostrar "los cuervos mandan, los humanos babean" en la pared en letras gigantes. Pero eso se parece un poco grosero. En su lugar, planea mostrar a la noche un vídeo de un cuervo volando que cubra todas las pantallas.

Carla encuentra un vídeo adecuado en el cual un segundo y medio de metraje se puede repetir para crear un vídeo en bucle mostrando el aleteo de un cuervo. Para ajustarse a las nueve pantallas (cada una de las cuales puede mostrar 50 por 30 píxeles), Carla corta y redimensiona los vídeos para obtener una serie de imágenes de 150 por 90, diez por segundo. Estas luego se cortan en nueve rectángulos cada una, y se procesan para que los puntos oscuros en el vídeo (donde está el cuervo) muestren una luz brillante, y los puntos claros (sin cuervo) permanezcan oscuros, lo que debería crear el efecto de un cuervo ámbar volando contra un fondo negro.

Ha configurado la variable `imágenesVídeo` para contener un array de fotogramas, donde cada fotograma se representa con un array de nueve conjuntos de píxeles, uno para cada pantalla, en el formato que los letreros esperan.

Para mostrar un único fotograma del vídeo, Carla necesita enviar una solicitud a todas las pantallas a la vez. Pero también necesita esperar el resultado de estas solicitudes, tanto para no comenzar a enviar el siguiente fotograma antes de que el actual se haya enviado correctamente, como para notar cuando las solicitudes están fallando.

{{index "Promise.all function"}}

`Promise` tiene un método estático `all` que se puede usar para convertir un array de promesas en una sola promesa que se resuelve en un array de resultados. Esto proporciona una forma conveniente de que algunas acciones asíncronas sucedan de manera concurrente, esperar a que todas terminen y luego hacer algo con sus resultados (o al menos esperar a que terminen para asegurarse de que no fallen).

```{includeCode: true}
function mostrarFotograma(fotograma) {
  return Promise.all(fotograma.map((data, i) => {
    return request(direccionesPantalla[i], {
      command: "display",
      data
    });
  }));
}
```

Esto recorre las imágenes en `fotograma` (que es un array de arrays de datos de visualización) para crear un array de promesas de solicitud. Luego devuelve una promesa que combina todas esas promesas.

Para tener la capacidad de detener un vídeo en reproducción, el proceso está envuelto en una clase. Esta clase tiene un método asíncrono `reproducir` que devuelve una promesa que solo se resuelve cuando la reproducción se detiene a través del método `parar`.

```{includeCode: true}
function espera(tiempo) {
  return new Promise(aceptar => setTimeout(aceptar, tiempo));
}

class ReproductorVídeo {
  constructor(fotogramas, tiempoFotograma) {
    this.fotogramas = fotogramas;
    this.tiempoFotograma = tiempoFotograma;
    this.parado = true;
  }

  async reproducir() {
    this.parado = false;
    for (let i = 0; !this.parado; i++) {
      let siguienteFotograma = espera(this.tiempoFotograma);
      await mostrarFotograma(this.fotogramas[i % this.fotogramas.length]);
      await siguienteFotograma;
    }
  }

  parar() {
    this.parado = true;
  }
}
```

La función `espera` envuelve `setTimeout` en una promesa que se resuelve después del número de milisegundos especificado. Esto es útil para controlar la velocidad de reproducción.

```{startCode: true}
let vídeo = new ReproductorVídeo(imágenesVídeo, 100);
vídeo.reproducir().catch(e => {
  console.log("La reproducción falló: " + e);
});
setTimeout(() => vídeo.parar(), 15000);
```

Durante toda la semana que la pantalla permanece allí, todas las noches, cuando está oscuro, aparece misteriosamente un enorme pájaro naranja brillante en ella.

## El bucle de eventos

{{index "programación asíncrona", "programación", "bucle de eventos", "línea" de tiempo}}

Un programa asíncrono comienza ejecutando su script principal, que a menudo configurará callbacks para ser llamados más tarde. Ese script principal, así como las funciones de callback, se ejecutan por completo de una vez, sin interrupciones. Pero entre ellos, el programa puede estar inactivo, esperando a que ocurra algo.

{{index "función setTimeout"}}

Por lo tanto, las funciones de callback no son llamadas directamente por el código que las programó. Si llamo a `setTimeout` desde dentro de una función, esa función ya habrá retornado en el momento en que se llame a la función de callback de `setTimeout`. Y cuando la función de callback retorna, el control no vuelve a la función que lo programó.

{{index "clase Promise", palabra clave "catch", "manejo de excepciones"}}

El comportamiento asíncrono ocurre en su propia ((pila de llamadas)) vacía. 

{{note "**N. del T.:** Esto último quiere decir que el comportamiento asíncrono en JavaScript no bloquea la ejecución: el código asíncrono se ejecuta una vez vaciada la pila de llamadas actual."}}

Esta es una de las razones por las que, sin promesas, gestionar excepciones en código asíncrono es tan difícil. Como cada callback comienza con una pila de llamadas en su mayoría vacía, sus manejadores de `catch` no estarán en la pila cuando lancen una excepción.

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

No importa cuán cerca ocurran los eventos (como por ejemplo tiempos de espera o solicitudes entrantes), un entorno JavaScript ejecutará solo un programa a la vez. Puedes imaginártelo como un gran bucle, llamado el _bucle de eventos_, que se ejecuta _alrededor_ de tu programa. Cuando no hay nada que hacer, ese bucle se pausa. Pero a medida que llegan eventos, se agregan a una cola y su código se ejecuta uno tras otro. Como no se ejecutan dos cosas al mismo tiempo, un código lento puede retrasar el manejo de otros eventos.

Este ejemplo establece un tiempo de espera pero luego se demora hasta después del momento previsto para el tiempo de espera, provocando que el tiempo de espera se alargue y termine más tarde de la cuenta.

```
let comienzo = Date.now();
setTimeout(() => {
  console.log("El tiempo de espera se ejecutó en", Date.now() - comienzo);
}, 20);
while (Date.now() < comienzo + 50) {}
console.log("Tiempo perdido hasta", Date.now() - comienzo);
// → Tiempo perdido hasta 50
// → El tiempo de espera se ejecutó en 55
```

{{index "resolviendo (una promesa)", "rechazando (una promesa)", "clase Promise"}}

Las promesas siempre se resuelven o se rechazan como un nuevo evento. Incluso si una promesa ya está resuelta, esperarla hará que su callback se ejecute después de que termine el script actual, en lugar de inmediatamente.

```
Promise.resolve("Hecho").then(console.log);
console.log("¡Yo primero!");
// → ¡Yo primero!
// → Hecho
```

En capítulos posteriores veremos varios tipos de eventos que se ejecutan en el bucle de eventos.

## Errores asíncronos

{{index "programación asíncrona", [estado, transiciones]}}

Cuando tu programa se ejecuta de forma sincrónica, de una sola vez, no hay cambios de estado ocurriendo excepto aquellos que el programa mismo realiza. Para programas asíncronos esto es diferente: pueden tener _brechas_ en su ejecución durante las cuales otro código puede correr.

Veamos un ejemplo. Esta es una función que intenta reportar el tamaño de cada archivo en un array de archivos, asegurándose de leerlos todos al mismo tiempo en lugar de secuencialmente.

{{index "función tamañosArchivos"}}

```{includeCode: true}
async function tamañosArchivos(archivos) {
  let lista = "";
  await Promise.all(archivos.map(async nombreArchivo => {
    lista += nombreArchivo + ": " +
      (await archivoTexto(nombreArchivo)).length + "\n";
  }));
  return lista;
}
```

{{index "función async"}}

La parte `async nombreArchivo =>` muestra cómo también se pueden hacer ((arrow function))s `async` (funciones flecha asíncronas) colocando la palabra `async` delante de ellas.

{{index "función Promise.all"}}

El código no parece sospechoso de inmediato... mapea la función flecha `async` sobre el array de nombres, creando un array de promesas, y luego usa `Promise.all` para esperar a todas ellas antes de devolver la lista que construyen.

Sin embargo, el programa está totalmente roto. Siempre devolverá solo una línea de salida, enumerando el archivo que tardó más en leer.

{{if interactive

```
tamañosArchivos(["planes.txt", "lista_compra.txt"])
  .then(console.log);
```

if}}

¿Puedes descubrir por qué?

{{index "operador +="}}

El problema radica en el operador `+=`, que toma el valor _actual_ de `lista` en el momento en que comienza a ejecutarse la instrucción y luego, cuando el `await` termina, establece el enlace `lista` como ese valor más la cadena agregada.

{{index "palabra clave await"}}

Pero entre el momento en que comienza a ejecutarse la instrucción y el momento en que termina, hay una brecha asíncrona. La expresión `map` se ejecuta antes de que se agregue cualquier cosa a la lista, por lo que cada uno de los operadores `+=` comienza desde una cadena vacía y acaba, cuando recupera la información del almacenamiento, estableciendo `lista` en el resultado de agregar su línea a la cadena vacía.

{{index "efecto secundario"}}

Esto podría haberse evitado fácilmente devolviendo las líneas de las promesas mapeadas y llamando a `join` en el resultado de `Promise.all`, en lugar de construir la lista cambiando una variable. Como de costumbre, calcular nuevos valores es menos propenso a errores que cambiar valores existentes.

{{index "función fileSizes"}}

```
async function tamañosArchivos(archivos) {
  let líneas = archivos.map(async nombreArchivo => {
    return nombreArchivo + ": " +
      (await archivoTexto(nombreArchivo)).length;
  });
  return (await Promise.all(líneas)).join("\n");
}
```

Errores como este son fáciles de cometer, especialmente al usar `await`, y debes ser consciente de dónde ocurren las brechas en tu código. Una ventaja de la asincronía _explícita_ de JavaScript (ya sea a través de callbacks, promesas o `await`) es que identificar estas brechas es relativamente fácil.

## Resumen

La programación asíncrona hace posible expresar la espera de acciones de larga duración sin congelar todo el programa. Los entornos de JavaScript típicamente implementan este estilo de programación utilizando callbacks, funciones que se llaman cuando las acciones se completan. Un bucle de eventos programa estas funciones de callback para que se llamen cuando sea apropiado, una tras otra, de modo que su ejecución no se superponga.

La programación asíncrona se facilita gracias a las promesas, que son objetos que representan acciones que podrían completarse en el futuro, y las funciones `async`, que te permiten escribir un programa asíncrono como si fuera sincrónico.

## Ejercicios

### Momentos de tranquilidad

{{index "momentos de tranquilidad (ejercicio)", "cámara de seguridad", "Carla la urraca", "función async"}}

Cerca del laboratorio de Carla hay una cámara de seguridad  que se activa con un sensor de movimiento. Está conectada a la red y comienza a enviar un flujo de vídeo cuando está activa. Como prefiere no ser descubierta, Carla ha configurado un sistema que detecta este tipo de tráfico de red inalámbrico y enciende una luz en su guarida cada vez que hay actividad afuera, de modo que sepa cuándo estar tranquila.

{{index "clase Date", "función Date.now", marca de tiempo}}

También ha estado registrando los momentos en que la cámara se activa desde hace un tiempo, y quiere utilizar esta información para visualizar qué momentos, en una semana promedio, tienden a ser tranquilos y cuáles tienden a no serlo. El registro se almacena en archivos que contienen un número de marca de tiempo por línea (como los que proporciona `Date.now()`).

```{lang: null}
1695709940692
1695701068331
1695701189163
```

El archivo `"camera_logs.txt"` contiene una lista de archivos de registro. Escribe una función asíncrona `activityTable(día)` que, para un día de la semana dado, devuelva un array de 24 números, uno para cada hora del día, que contenga la cantidad de observaciones de tráfico de red de la cámara vista en esa hora del día. Los días se identifican por número utilizando el sistema utilizado por `Date.getDay`, donde el domingo es 0 y el sábado es 6.

La función `activityGraph`, proporcionada por el sandbox, resume dicha tabla en una cadena.

{{index "función textFile"}}

Utiliza la función `textFile` ( o `archivoTexto`) definida anteriormente, que al recibir un nombre de archivo devuelve una promesa que se resuelve en el contenido del archivo. Recuerda que `new Date(marcaDeTiempo)` crea un objeto `Date` para ese momento, que tiene métodos `getDay` y `getHours` que devuelven el día de la semana y la hora del día.

Ambos tipos de archivos —la lista de archivos de registro y los propios archivos de registro— tienen cada dato en una línea, separados por caracteres de nueva línea (`"\n"`).

{{if interactive

```{test: no}
async function activityTable(día) {
  let logFileList = await textFile("camera_logs.txt");
  // Tu código aquí
}

activityTable(1)
  .then(table => console.log(activityGraph(table)));
```

if}}

{{hint

{{index "momentos de tranquilidad (ejercicio)", "método split", "función textFile", "clase Date"}}

Necesitarás convertir el contenido de estos archivos en un array. La forma más fácil de hacerlo es utilizando el método `split` en la cadena producida por `textFile` ( o `archivoTexto`). Ten en cuenta que para los archivos de registro, eso te dará un array de cadenas, que debes convertir a números antes de pasarlos a `new Date`.

Resumir todos los puntos temporales en una tabla de horas se puede hacer creando una tabla (array) que contenga un número para cada hora del día. Luego puedes recorrer todas las marcas de tiempo (de los archivos de registro y los números en cada archivo de registro) y, para cada uno, si sucedió en el día correcto, tomar la hora en que ocurrió y sumar uno al número correspondiente en la tabla.

{{index "función async", "palabra clave await", "clase Promise"}}

Asegúrate de usar `await` en el resultado de las funciones asíncronas antes de hacer cualquier cosa con él, o terminarás con una `Promise` donde esperabas tener un string.

hint}}


### Promesas Reales

{{index "promesas reales (ejercicio)", "clase Promise"}}

Reescribe la función del ejercicio anterior sin `async`/`await`, utilizando métodos simples de `Promise`.

{{if interactive

```{test: no}
function activityTable(día) {
  // Tu código aquí
}

activityTable(6)
  .then(tabla => console.log(activityGraph(tabla)));
```

if}}

{{index "función async", "palabra clave await", rendimiento}}

En este estilo, usar `Promise.all` será más conveniente que intentar modelar un bucle sobre los archivos de registro. En la función `async`, simplemente usar `await` en un bucle es más simple. Si leer un archivo lleva un tiempo, ¿cuál de estos dos enfoques necesitará menos tiempo para ejecutarse?

{{index "rechazar (una promesa)"}}

Si uno de los archivos listados en la lista de archivos tiene un error tipográfico, y su lectura falla, ¿cómo termina ese fallo en el objeto `Promise` que retorna tu función?

{{hint

{{index "promesas reales (ejercicio)", "método then", "función textFile", "función Promise.all"}}

El enfoque más directo para escribir esta función es usar una cadena de llamadas `then`. La primera promesa se produce al leer la lista de archivos de registro. El primer callback puede dividir esta lista y mapear `textFile` sobre ella para obtener un array de promesas para pasar a `Promise.all`. Puede devolver el objeto devuelto por `Promise.all`, para que lo que sea que eso devuelva se convierta en el resultado del valor de retorno de este primer `then`.

{{index "programación asíncrona"}}

Ahora tenemos una promesa que devuelve un array de archivos de registro. Podemos llamar a `then` nuevamente en eso, y poner la lógica de recuento de marcas de tiempo allí. Algo así:

```{test: no}
function activityTable(día) {
  return archivoTexto("camera_logs.txt").then(archivos => {
    return Promise.all(archivos.split("\n").map(archivoTexto));
  }).then(logs => {
    // analizar...
  });
}
```

O podrías, para una programación del trabajo aún mejor, poner el análisis de cada archivo dentro de `Promise.all`, para que ese trabajo pueda comenzar con el primer archivo que se reciba del disco, incluso antes de que lleguen los otros archivos.

```{test: no}
function activityTable(día) {
  let tabla = []; // inicializar...
  return archivoTexto("registros_camara.txt").then(archivos => {
    return Promise.all(archivos.split("\n").map(nombre => {
      return archivoTexto(nombre).then(log => {
        // analizar...
      });
    }));
  }).then(() => tabla);
}
```

{{index "palabra clave await", "programación de planificación"}}

Esto demuestra que la forma en que estructuras tus promesas puede tener un efecto real en la forma en que se programa el trabajo. Un simple bucle con `await` hará que el proceso sea completamente lineal: espera a que se cargue cada archivo antes de continuar. `Promise.all` hace posible que varias tareas sean trabajadas conceptualmente al mismo tiempo, permitiéndoles progresar mientras los archivos aún se están cargando. Esto puede ser más rápido, pero también hace que el orden en que sucederán las cosas sea menos predecible. En este caso, donde solo vamos a estar incrementando números en una tabla, eso no es difícil de hacer de manera segura. Para otros tipos de problemas, puede ser mucho más difícil.

{{index "rechazar (una promesa)", "método then"}}

Cuando un archivo en la lista no existe, la promesa devuelta por `archivoTexto` será rechazada. Debido a que `Promise.all` se rechaza si alguna de las promesas que se le pasan falla, el valor de retorno de la callback dada al primer `then` también será una promesa rechazada. Esto hace que la promesa devuelta por `then` falle, por lo que la callback dada al segundo `then` ni siquiera se llama, y se devuelve una promesa rechazada desde la función.

hint}}

### Construyendo Promise.all

{{index "clase Promise", "función Promise.all", "construyendo Promise.all (ejercicio)"}}

Como vimos, dado un array de promesas, `Promise.all` devuelve una promesa que espera a que todas las promesas en el array finalicen. Luego tiene éxito, devolviendo un array de valores de resultado. Si una promesa en el array falla, la promesa devuelta por `all` también falla, con la razón de fallo de la promesa que falló.

Implementa algo similar tú mismo como una función normal llamada `Promise_all`.

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

La función pasada al constructor `Promise` tendrá que llamar a `then` en cada una de las promesas en el array dado. Cuando una de ellas tiene éxito, dos cosas deben suceder: el valor resultante debe ser almacenado en la posición correcta de un array de resultados, y debemos verificar si esta era la última promesa pendiente y finalizar nuestra propia promesa si lo era.

{{index "variable de contador"}}

Esto último se puede hacer con un contador que se inicializa con la longitud del array de entrada y del cual restamos 1 cada vez que una promesa tiene éxito. Cuando llegue a 0, hemos terminado. Asegúrate de tener en cuenta la situación en la que el array de entrada está vacío (y por lo tanto ninguna promesa se resolverá nunca).

Manejar el fallo requiere un poco de pensamiento pero resulta ser extremadamente simple. Simplemente pasa la función `reject` de la promesa contenedora a cada una de las promesas en el array como un controlador `catch` o como un segundo argumento para `then` para que un fallo en una de ellas desencadene el rechazo de toda la promesa contenedora.

}}