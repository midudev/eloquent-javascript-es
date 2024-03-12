{{meta {code_links: ["code/file_server.mjs"]}}}

# Node.js

{{quote {author: "Maestro Yuan-Ma", title: "El Libro de la Programación", chapter: true}

Un estudiante preguntó: "Los programadores de antaño solo usaban máquinas simples y ningún lenguaje de programación, sin embargo, creaban programas hermosos. ¿Por qué nosotros usamos máquinas complicadas y lenguajes de programación?". Fu-Tzu respondió: "Los constructores de antaño solo usaban palos y arcilla, sin embargo, creaban hermosas chozas."

quote}}

{{index "Yuan-Ma", "Libro de la Programación"}}

{{figure {url: "img/chapter_picture_20.jpg", alt: "Ilustración que muestra un poste telefónico con un enredo de cables en todas direcciones", chapter: "framed"}}}

{{index "línea de comandos"}}

Hasta ahora, hemos utilizado el lenguaje JavaScript en un solo entorno: el navegador. Este capítulo y el [siguiente](skillsharing) introducirán brevemente ((Node.js)), un programa que te permite aplicar tus habilidades con JavaScript fuera del navegador. Con él, puedes construir desde pequeñas herramientas de línea de comandos hasta servidores HTTP ((server)) que alimentan ((sitios web)) dinámicos.

Estos capítulos tienen como objetivo enseñarte los conceptos principales que Node.js utiliza y darte información suficiente para escribir programas útiles para él. No intentan ser un tratamiento completo, ni siquiera exhaustivo, de la plataforma.

{{if interactive

Mientras que podrías ejecutar el código en los capítulos anteriores directamente en estas páginas, ya sea JavaScript puro o escrito para el navegador, los ejemplos de código en este capítulo están escritos para Node y a menudo no se ejecutarán en el navegador.

if}}

Si deseas seguir y ejecutar el código en este capítulo, necesitarás instalar Node.js versión 18 o superior. Para hacerlo, ve a [_https://nodejs.org_](https://nodejs.org) y sigue las instrucciones de instalación para tu sistema operativo. También puedes encontrar más ((documentación)) para Node.js allí.

## Antecedentes

{{index responsividad, entrada, [red, velocidad]}}

Cuando se construyen sistemas que se comunican a través de la red, la forma en que gestionas la entrada y el ((output))—es decir, la lectura y escritura de datos desde y hacia la red y el ((disco duro))—puede marcar una gran diferencia en cuán rápido responde un sistema al usuario o a las solicitudes de red.

{{index ["programación asincrónica", "en Node.js"]}}

En tales programas, la programación asincrónica a menudo es útil. Permite que el programa envíe y reciba datos desde y hacia múltiples dispositivos al mismo tiempo sin una complicada gestión de hilos y sincronización.

{{index "lenguaje de programación", "Node.js", estándar}}

Node fue concebido inicialmente con el propósito de hacer que la programación asincrónica sea fácil y conveniente. JavaScript se presta bien a un sistema como Node. Es uno de los pocos lenguajes de programación que no tiene una forma incorporada de manejar la entrada y salida. Por lo tanto, JavaScript podría adaptarse al enfoque algo excéntrico de Node para la programación de red y sistemas de archivos sin terminar con dos interfaces inconsistentes. En 2009, cuando se diseñaba Node, la gente ya estaba realizando programación basada en callbacks en el navegador, por lo que la ((comunidad)) alrededor del lenguaje estaba acostumbrada a un estilo de programación asincrónica.

## El comando node

{{index "programa node"}}

Cuando ((Node.js)) está instalado en un sistema, proporciona un programa llamado `node`, que se utiliza para ejecutar archivos de JavaScript. Supongamos que tienes un archivo `hello.js`, que contiene este código:

```
let message = "Hola mundo";
console.log(message);
```

Luego puedes ejecutar `node` desde la ((línea de comandos)) de la siguiente manera para ejecutar el programa:

```{lang: null}
$ node hello.js
Hola mundo
```

{{index "console.log"}}

El método `console.log` en Node hace algo similar a lo que hace en el navegador. Imprime un texto. Pero en Node, el texto irá al flujo de salida estándar del proceso, en lugar de ir a la ((consola de JavaScript)) de un navegador. Al ejecutar `node` desde la línea de comandos, significa que verás los valores registrados en tu ((terminal)).

{{index "programa node", "bucle de lectura-evaluación-impresión"}}

Si ejecutas `node` sin proporcionarle un archivo, te proporcionará un indicador en el que puedes escribir código JavaScript y ver inmediatamente el resultado.

```{lang: null}
$ node
> 1 + 1
2
> [-1, -2, -3].map(Math.abs)
[1, 2, 3]
> process.exit(0)
$
```

{{index "objeto process", "ámbito global", [binding, global], "método exit", "código de estado"}}

El enlace `process`, al igual que el enlace `console`, está disponible globalmente en Node. Proporciona varias formas de inspeccionar y manipular el programa actual. El método `exit` finaliza el proceso y puede recibir un código de estado de salida, que le indica al programa que inició `node` (en este caso, la shell de línea de comandos) si el programa se completó correctamente (código cero) o si se encontró un error (cualquier otro código).

{{index "línea de comandos", "propiedad argv"}}

Para encontrar los argumentos de línea de comandos dados a tu script, puedes leer `process.argv`, que es un array de cadenas. Ten en cuenta que también incluye el nombre del comando `node` y el nombre de tu script, por lo que los argumentos reales comienzan en el índice 2. Si `showargv.js` contiene la instrucción `console.log(process.argv)`, podrías ejecutarlo de la siguiente manera:

```{lang: null}
$ node showargv.js one --and two
["node", "/tmp/showargv.js", "one", "--and", "two"]
```

{{index [binding, global]}}

Todos los enlaces globales de JavaScript estándar, como `Array`, `Math` y `JSON`, también están presentes en el entorno de Node. La funcionalidad relacionada con el navegador, como `document` o `prompt`, no lo está.

## Módulos

{{index "Node.js", "ámbito global", "cargador de módulos"}}

Además de los enlaces que mencioné, como `console` y `process`, Node agrega pocos enlaces adicionales en el ámbito global. Si deseas acceder a funcionalidades integradas, debes solicitarlas al sistema de módulos.

{{index "función require"}}

Node comenzó utilizando el sistema de módulos CommonJS, basado en la función `require`, que vimos en [Capítulo ?](modules#commonjs). Aún utilizará este sistema de forma predeterminada cuando cargues un archivo `.js`.

{{index "palabra clave import", "módulos ES"}}

Pero también soporta el sistema de módulos ES más moderno. Cuando el nombre de un script termina en `.mjs`, se considera que es un módulo de este tipo, y puedes usar `import` y `export` en él (pero no `require`). Utilizaremos módulos ES en este capítulo.

{{index [path, "sistema de archivos"], "ruta relativa", resolución}}

Cuando se importa un módulo, ya sea con `require` o `import`, Node debe resolver la cadena proporcionada a un ((archivo)) real que pueda cargar. Los nombres que comienzan con `/`, `./` o `../` se resuelven como archivos, relativos a la ruta del módulo actual. Aquí, `.` representa el directorio actual, `../` para un directorio arriba, y `/` para la raíz del sistema de archivos. Por lo tanto, si solicitas `"./graph.mjs"` desde el archivo `/tmp/robot/robot.mjs`, Node intentará cargar el archivo `/tmp/robot/graph.mjs`.

{{index "directorio node_modules", directorio}}

Cuando se importa una cadena que no parece una ruta relativa o absoluta, se asume que se refiere a un módulo integrado o un módulo instalado en un directorio `node_modules`. Por ejemplo, importar desde `"node:fs"` te dará el módulo integrado del sistema de archivos de Node. E importar `"robot"` podría intentar cargar la biblioteca encontrada en `node_modules/robot/`. Una forma común de instalar estas bibliotecas es usando ((NPM)), a lo cual volveremos en un momento.

{{index "palabra clave import", "Node.js", "ejemplo confuso"}}

Configuremos un proyecto pequeño que consta de dos archivos. El primero, llamado `main.mjs`, define un script que puede ser llamado desde la ((línea de comandos)) para revertir una cadena.

```
import {reverse} from "./reverse.mjs";

// El índice 2 contiene el primer argumento real de la línea de comandos
let argument = process.argv[2];

console.log(reverse(argument));
```

{{index "reutilización", "función Array.from", "método join"}}

El archivo `reverse.mjs` define una biblioteca para revertir cadenas, que puede ser utilizada tanto por esta herramienta de línea de comandos como por otros scripts que necesiten acceso directo a una función para revertir cadenas.

```
export function reverse(string) {
  return Array.from(string).reverse().join("");
}
```

{{index "palabra clave export", "módulos ES", [interfaz, "módulo"]}}

Recuerda que `export` se utiliza para declarar que un enlace es parte de la interfaz del módulo. Eso permite que `main.mjs` importe y utilice la función.

Ahora podemos llamar a nuestra herramienta de esta manera:

```{lang: null}
$ node main.mjs JavaScript
tpircSavaJ
```

## Instalando con NPM

{{index NPM, "Node.js", "programa npm", biblioteca}}

NPM, que fue introducido en [Capítulo ?](modules#modules_npm), es un repositorio en línea de ((módulos)) de JavaScript, muchos de los cuales están escritos específicamente para Node. Cuando instalas Node en tu computadora, también obtienes el comando `npm`, que puedes usar para interactuar con este repositorio.

{{index "paquete ini"}}

El uso principal de NPM es ((descargar)) paquetes. Vimos el paquete `ini` en [Capítulo ?](modules#modules_ini). Podemos usar NPM para buscar e instalar ese paquete en nuestra computadora.

```{lang: null}
$ npm install ini
agregado 1 paquete en 723ms

$ node
> const {parse} = require("ini");
> parse("x = 1\ny = 2");
{ x: '1', y: '2' }
```

{{index "función require", "directorio node_modules", "programa npm"}}

Después de ejecutar `npm install`, ((NPM)) habrá creado un directorio llamado `node_modules`. Dentro de ese directorio estará un directorio `ini` que contiene la ((biblioteca)). Puedes abrirlo y ver el código. Cuando importamos `"ini"`, esta biblioteca se carga, y podemos llamar a su propiedad `parse` para analizar un archivo de configuración.Por defecto, NPM instala paquetes en el directorio actual, en lugar de en un lugar centralizado. Si estás acostumbrado a otros gestores de paquetes, esto puede parecer inusual, pero tiene ventajas: pone a cada aplicación en control total de los paquetes que instala y facilita la gestión de versiones y limpieza al eliminar una aplicación.

### Archivos de paquete

{{index "package.json", dependency}}

Después de ejecutar `npm install` para instalar algún paquete, encontrarás no solo un directorio `node_modules`, sino también un archivo llamado `package.json` en tu directorio actual. Se recomienda tener tal archivo para cada proyecto. Puedes crearlo manualmente o ejecutar `npm init`. Este archivo contiene información sobre el proyecto, como su nombre y ((versión)), y enumera sus dependencias.

La simulación del robot de [Capítulo ?](robot), modularizada en el ejercicio en [Capítulo ?](modules#modular_robot), podría tener un archivo `package.json` como este:

```{lang: "json"}
{
  "author": "Marijn Haverbeke",
  "name": "eloquent-javascript-robot",
  "description": "Simulación de un robot de entrega de paquetes",
  "version": "1.0.0",
  "main": "run.mjs",
  "dependencies": {
    "dijkstrajs": "^1.0.1",
    "random-item": "^1.0.0"
  },
  "license": "ISC"
}
```

{{index "npm program", tool}}

Cuando ejecutas `npm install` sin especificar un paquete para instalar, NPM instalará las dependencias enumeradas en `package.json`. Cuando instalas un paquete específico que no está listado como una dependencia, NPM lo añadirá a `package.json`.

### Versiones

{{index "package.json", dependency, evolution}}

Un archivo `package.json` lista tanto la ((versión)) del propio programa como las versiones de sus dependencias. Las versiones son una forma de manejar el hecho de que los ((paquete))s evolucionan por separado, y el código escrito para funcionar con un paquete tal como existía en un momento dado puede no funcionar con una versión posterior y modificada del paquete.

{{index compatibility}}

NPM exige que sus paquetes sigan un esquema llamado _((semantic versioning))_, que codifica información sobre qué versiones son _compatibles_ (no rompen la antigua interfaz) en el número de versión. Una versión semántica consiste en tres números, separados por puntos, como `2.3.0`. Cada vez que se añade nueva funcionalidad, el número del medio debe incrementarse. Cada vez que se rompe la compatibilidad, de modo que el código existente que utiliza el paquete puede que no funcione con la nueva versión, el primer número debe incrementarse.

{{index "caret character"}}

Un carácter de intercalación (`^`) delante del número de versión para una dependencia en `package.json` indica que se puede instalar cualquier versión compatible con el número dado. Por ejemplo, `"^2.3.0"` significaría que se permite cualquier versión mayor o igual a 2.3.0 y menor que 3.0.0.

{{index publishing}}

El comando `npm` también se utiliza para publicar nuevos paquetes o nuevas versiones de paquetes. Si ejecutas `npm publish` en un ((directorio)) que tiene un archivo `package.json`, se publicará un paquete con el nombre y versión listados en el archivo JSON en el registro. Cualquiera puede publicar paquetes en NPM, aunque solo bajo un nombre de paquete que aún no esté en uso, ya que no sería bueno que personas aleatorias pudieran actualizar paquetes existentes.Este libro no profundizará más en los detalles del uso de ((NPM)). Consulta [_https://npmjs.org_](https://npmjs.org) para obtener más documentación y una forma de buscar paquetes.

## El módulo del sistema de archivos

{{index directorio, "node:fs", "Node.js", [archivo, acceso]}}

Uno de los módulos integrados más utilizados en Node es el módulo `node:fs`, que significa _((sistema de archivos))_. Exporta funciones para trabajar con archivos y directorios.

{{index "función" "readFile", "función de devolución de llamada"}}

Por ejemplo, la función llamada `readFile` lee un archivo y luego llama a una función de devolución de llamada con el contenido del archivo.

```
import {readFile} from "node:fs";
readFile("archivo.txt", "utf8", (error, texto) => {
  if (error) throw error;
  console.log("El archivo contiene:", texto);
});
```

{{index clase "Buffer"}}

El segundo argumento de `readFile` indica la _((codificación de caracteres))_ utilizada para decodificar el archivo en una cadena. Existen varias formas en las que el ((texto)) puede ser codificado en ((datos binarios)), pero la mayoría de los sistemas modernos utilizan ((UTF-8)). Entonces, a menos que tengas razones para creer que se utiliza otra codificación, pasa `"utf8"` al leer un archivo de texto. Si no pasas una codificación, Node asumirá que estás interesado en los datos binarios y te dará un objeto `Buffer` en lugar de una cadena. Este es un ((objeto similar a un array)) que contiene números que representan los bytes (trozos de datos de 8 bits) en los archivos.

```
import {readFile} from "node:fs";
readFile("archivo.txt", (error, buffer) => {
  if (error) throw error;
  console.log("El archivo contenía", buffer.length, "bytes.",
              "El primer byte es:", buffer[0]);
});
```

{{index "función" "writeFile", "sistema de archivos", [archivo, acceso]}}

Una función similar, `writeFile`, se utiliza para escribir un archivo en el disco.

```
import {writeFile} from "node:fs";
writeFile("graffiti.txt", "Node estuvo aquí", err => {
  if (err) console.log(`Error al escribir el archivo: ${err}`);
  else console.log("Archivo escrito.");
});
```

{{index clase "Buffer", "codificación de caracteres"}}

Aquí no fue necesario especificar la codificación: `writeFile` asumirá que cuando se le da una cadena para escribir, en lugar de un objeto `Buffer`, debe escribirla como texto utilizando su codificación de caracteres predeterminada, que es ((UTF-8)).

{{index "node:fs", """"función"""" "readdir", """"función"""" "stat", """"función"""" "rename", """"función"""" "unlink"}}

El módulo `node:fs` contiene muchas otras funciones útiles: `readdir` te dará los archivos en un ((directorio)) como un array de cadenas, `stat` recuperará información sobre un archivo, `rename` cambiará el nombre de un archivo, `unlink` lo eliminará, entre otros. Consulta la documentación en [_https://nodejs.org_](https://nodejs.org) para obtener detalles específicos.

{{index ["programación asíncrona", "en Node.js"], "Node.js", "manejo de errores", "función de devolución de llamada"}}

La mayoría de estas funciones toman una función de devolución de llamada como último parámetro, a la que llaman ya sea con un error (el primer argumento) o con un resultado exitoso (el segundo). Como vimos en [Capítulo ?](async), hay desventajas en este estilo de programación, siendo la mayor que el manejo de errores se vuelve verboso y propenso a errores.

{{index "Clase Promise", "paquete node:fs/promises"}}

El módulo `node:fs/promises` exporta la mayoría de las mismas funciones que el antiguo módulo `node:fs`, pero utiliza promesas en lugar de funciones de devolución de llamada.

```
import {readFile} from "node:fs/promises";
readFile("file.txt", "utf8")
  .then(text => console.log("El archivo contiene:", text));
```

{{index "programación síncrona", "paquete node:fs", "función readFileSync"}}

A veces no necesitas asincronía y simplemente te estorba. Muchas de las funciones en `node:fs` también tienen una variante síncrona, que tiene el mismo nombre con `Sync` agregado al final. Por ejemplo, la versión síncrona de `readFile` se llama `readFileSync`.

```
import {readFileSync} from "node:fs";
console.log("El archivo contiene:",
            readFileSync("file.txt", "utf8"));
```

{{index "optimización", rendimiento, bloqueo}}

Cabe destacar que mientras se realiza una operación síncrona de este tipo, tu programa se detiene por completo. Si debería estar respondiendo al usuario o a otras máquinas en la red, quedarse atrapado en una acción síncrona podría producir retrasos molestos.

## El módulo HTTP

{{index "Node.js", "paquete node:http", [HTTP, servidor]}}

Otro módulo central se llama `node:http`. Proporciona funcionalidad para ejecutar un ((servidor)) HTTP.

{{index "escucha (TCP)", "método listen", "función createServer"}}

Esto es todo lo que se necesita para iniciar un servidor HTTP:

```
import {createServer} from "node:http";
let server = createServer((solicitud, respuesta) => {
  respuesta.writeHead(200, {"Content-Type": "text/html"});
  respuesta.write(`
    <h1>¡Hola!</h1>
    <p>Pediste <code>${solicitud.url}</code></p>`);
  respuesta.end();
});
server.listen(8000);
console.log("¡Escuchando! (puerto 8000)");
```

{{index puerto, localhost}}

Si ejecutas este script en tu propia máquina, puedes apuntar tu navegador web a [_http://localhost:8000/hola_](http://localhost:8000/hola) para hacer una solicitud a tu servidor. Responderá con una pequeña página HTML.

{{index "función createServer", HTTP}}

La función pasada como argumento a `createServer` se llama cada vez que un cliente se conecta al servidor. Los enlaces `solicitud` y `respuesta` son objetos que representan los datos de entrada y salida. El primero contiene información sobre la ((solicitud)), como su propiedad `url`, que nos dice a qué URL se hizo la solicitud.

Así que, cuando abres esa página en tu navegador, envía una solicitud a tu propia computadora. Esto hace que la función del servidor se ejecute y envíe una respuesta, que luego puedes ver en el navegador.

{{index "200 (código de estado HTTP)", "encabezado Content-Type", "método writeHead"}}

Para enviar algo al cliente, llamas a métodos en el objeto `respuesta`. El primero, `writeHead`, escribirá los ((encabezados de respuesta)) (ver [Capítulo ?](http#encabezados)). Le das el código de estado (200 para "OK" en este caso) y un objeto que contiene valores de encabezado. El ejemplo establece el encabezado `Content-Type` para informar al cliente que estaremos enviando de vuelta un documento HTML.

{{index "flujo de escritura", "cuerpo (HTTP)", stream, "método write", "método end"}}

A continuación, el cuerpo real de la respuesta (el documento en sí) se envía con `response.write`. Se permite llamar a este método varias veces si deseas enviar la respuesta pieza por pieza, por ejemplo para transmitir datos al cliente a medida que estén disponibles. Por último, `response.end` señala el fin de la respuesta.

{{index "método listen"}}

La llamada a `server.listen` hace que el ((servidor)) comience a esperar conexiones en el ((puerto)) 8000. Por eso debes conectarte a _localhost:8000_ para comunicarte con este servidor, en lugar de simplemente a _localhost_, que usaría el puerto predeterminado 80.

{{index "Node.js", "finalizar proceso"}}

Cuando ejecutas este script, el proceso se queda esperando. Cuando un script está escuchando eventos —en este caso, conexiones de red—, `node` no se cerrará automáticamente al llegar al final del script. Para cerrarlo, presiona [control]{keyname}-C.

{{index ["método", HTTP]}}

Un verdadero servidor web ((server)) usualmente hace más cosas que el ejemplo; examina el ((método)) de la solicitud (la propiedad `method`) para ver qué acción está intentando realizar el cliente y mira el ((URL)) de la solicitud para descubrir sobre qué recurso se está realizando esta acción. Veremos un servidor más avanzado [más adelante en este capítulo](node#file_server).

{{index "node:http package", "función request", "función fetch", [HTTP, cliente]}}

El módulo `node:http` también provee una función `request`, que se puede usar para hacer solicitudes HTTP. Sin embargo, es mucho más engorroso de usar que `fetch`, que vimos en [Capítulo ?](http). Afortunadamente, `fetch` también está disponible en Node, como un enlace global. A menos que desees hacer algo muy específico, como procesar el documento de respuesta pieza por pieza a medida que llegan los datos a través de la red, recomiendo usar `fetch`.

## Flujos

{{index  "Node.js", stream, "flujo de escritura", "función de devolución de llamada", ["programación asincrónica", "en Node.js"], "método write", "método end", "clase Buffer"}}

El objeto de respuesta al que el servidor HTTP podría escribir es un ejemplo de un objeto de _flujo de escritura_, que es un concepto ampliamente usado en Node. Estos objetos tienen un método `write` al que se puede pasar una cadena o un objeto `Buffer` para escribir algo en el flujo. Su método `end` cierra el flujo y opcionalmente toma un valor para escribir en el flujo antes de cerrarlo. Ambos métodos también pueden recibir una devolución de llamada como argumento adicional, que se llamará cuando la escritura o el cierre hayan finalizado.

{{index "función createWriteStream", "función writeFile", [archivo, flujo]}}

Es posible crear un flujo de escritura que apunte a un archivo con la función `createWriteStream` del módulo `node:fs`. Luego puedes usar el método `write` en el objeto resultante para escribir el archivo pieza por pieza, en lugar de hacerlo de una sola vez como con `writeFile`.

{{index "createServer function", "función request", "manejo de eventos", "flujo legible"}}

Los _flujos legibles_ son un poco más complejos. El argumento `request` para la devolución de llamada del servidor HTTP es un flujo legible. Leer de un flujo se hace utilizando manejadores de eventos, en lugar de métodos.

{{index "método on", "método addEventListener"}}

Los objetos que emiten eventos en Node tienen un método llamado `on` que es similar al método `addEventListener` en el navegador. Le das un nombre de evento y luego una función, y registrará esa función para que se llame cada vez que ocurra el evento dado.

{{index "función createReadStream", "evento data", "evento end", "flujo legible"}}

Los ((stream))s legibles tienen eventos `"data"` y `"end"`. El primero se dispara cada vez que llegan datos, y el segundo se llama cuando el flujo llega a su fin. Este modelo es más adecuado para datos de _streaming_ que pueden procesarse de inmediato, incluso cuando todo el documento aún no está disponible. Un archivo se puede leer como un flujo legible utilizando la función `createReadStream` de `node:fs`.

{{index "ejemplo de servidor de mayúsculas", "capitalización", "método toUpperCase"}}

Este código crea un ((servidor)) que lee los cuerpos de las solicitudes y los reenvía al cliente como texto en mayúsculas:

```
import {createServer} from "node:http";
createServer((solicitud, respuesta) => {
  respuesta.writeHead(200, {"Content-Type": "text/plain"});
  solicitud.on("data", fragmento =>
    respuesta.write(fragmento.toString().toUpperCase()));
  solicitud.on("end", () => respuesta.end());
}).listen(8000);
```

{{index "clase Buffer", "método toString"}}

El valor `chunk` pasado al controlador de datos será un `Buffer` binario. Podemos convertir esto a una cadena decodificándolo como caracteres codificados en UTF-8 con su método `toString`.

El siguiente fragmento de código, cuando se ejecuta con el servidor de mayúsculas activo, enviará una solicitud a ese servidor y escribirá la respuesta que recibe:

```
fetch("http://localhost:8000/", {
  method: "POST",
  body: "Hola servidor"
}).then(resp => resp.text()).then(console.log);
// → HOLA SERVIDOR
```

{{id file_server}}

## Un servidor de archivos

{{index "ejemplo de servidor de archivos", "Node.js", [HTTP, servidor]}}

Combina nuestro nuevo conocimiento sobre los servidores HTTP y el trabajo con el sistema de archivos para crear un puente entre ambos: un servidor HTTP que permite el ((acceso remoto)) a un sistema de archivos. Este tipo de servidor tiene todo tipo de usos, como permitir que las aplicaciones web almacenen y compartan datos, o dar acceso compartido a un grupo de personas a un montón de archivos.

{{index [ruta, URL], "método GET", "método PUT", "método DELETE", [archivo, recurso]}}

Cuando tratamos los archivos como ((recursos)) de HTTP, los métodos HTTP `GET`, `PUT` y `DELETE` se pueden usar para leer, escribir y eliminar los archivos, respectivamente. Interpretaremos la ruta en la solicitud como la ruta del archivo al que se refiere la solicitud.

{{index [ruta, "sistema de archivos"], "ruta relativa"}}

Probablemente no queramos compartir todo nuestro sistema de archivos, por lo que interpretaremos estas rutas como comenzando en el directorio de trabajo del servidor, que es el directorio en el que se inició. Si ejecuté el servidor desde `/tmp/public/` (o `C:\tmp\public\` en Windows), entonces una solicitud para `/file.txt` debería referirse a `/tmp/public/file.txt` (o `C:\tmp\public\file.txt`).

{{index "ejemplo de servidor de archivos", "Node.js", "objeto methods", "clase Promise"}}

Construiremos el programa paso a paso, utilizando un objeto llamado `methods` para almacenar las funciones que manejan los diferentes métodos HTTP. Los controladores de métodos son funciones `async` que reciben el objeto de solicitud como argumento y devuelven una promesa que se resuelve a un objeto que describe la respuesta.

```{includeCode: ">code/file_server.mjs"}
import {createServer} from "node:http";

const methods = Object.create(null);

createServer((request, response) => {
  let handler = methods[request.method] || notAllowed;
  handler(request).catch(error => {
    if (error.status != null) return error;
    return {body: String(error), status: 500};
  }).then(({body, status = 200, type = "text/plain"}) => {
    response.writeHead(status, {"Content-Type": type});
    if (body && body.pipe) body.pipe(response);
    else response.end(body);
  });
}).listen(8000);

async function notAllowed(request) {
  return {
    status: 405,
    body: `Método ${request.method} no permitido.`
  };
}
```

{{index "405 (código de estado HTTP)"}}

Esto inicia un servidor que simplemente devuelve respuestas de error 405, que es el código utilizado para indicar que el servidor se niega a manejar un método determinado.

{{index "500 (código de estado HTTP)", "manejo de errores", "respuesta de error"}}

Cuando la promesa de un controlador de solicitud es rechazada, la llamada a `catch` traduce el error en un objeto de respuesta, si aún no lo es, para que el servidor pueda enviar una respuesta de error para informar al cliente que no pudo manejar la solicitud.

{{index "200 (código de estado HTTP)", "encabezado Content-Type"}}

El campo `status` de la descripción de la respuesta puede omitirse, en cuyo caso se establece en 200 (OK) por defecto. El tipo de contenido, en la propiedad `type`, también puede omitirse, en cuyo caso se asume que la respuesta es texto plano.

{{index "método end", "método pipe", flujo}}

Cuando el valor de `body` es un ((readable stream)), este tendrá un método `pipe` que se utiliza para reenviar todo el contenido de un flujo de lectura a un ((writable stream)). Si no es así, se asume que es `null` (sin cuerpo), una cadena o un búfer, y se pasa directamente al método `end` del ((response)).

{{index [ruta, URL], "función urlPath", "clase URL", "análisis", [escape, "en las URL"], "función decodeURIComponent", "método startsWith"}}

Para determinar qué ruta de archivo corresponde a una URL de solicitud, la función `urlPath` utiliza la clase integrada `URL` (que también existe en el navegador) para analizar la URL. Este constructor espera una URL completa, no solo la parte que comienza con la barra diagonal que obtenemos de `request.url`, por lo que le proporcionamos un nombre de dominio falso para completar. Extrae su ruta, que será algo como `"/archivo.txt"`, la decodifica para eliminar los códigos de escape estilo `%20`, y la resuelve en relación con el directorio de trabajo del programa.

```{includeCode: ">code/file_server.mjs"}
import {parse} from "node:url";
import {resolve, sep} from "node:path";

const baseDirectory = process.cwd();

function urlPath(url) {
  let {pathname} = new URL(url, "http://d");
  let path = resolve(decodeURIComponent(pathname).slice(1));
  if (path != baseDirectory &&
      !path.startsWith(baseDirectory + sep)) {
    throw {status: 403, body: "Prohibido"};
  }
  return path;
}
```

Tan pronto como configuras un programa para aceptar solicitudes de red, debes empezar a preocuparte por la ((seguridad)). En este caso, si no tenemos cuidado, es probable que terminemos exponiendo accidentalmente todo nuestro ((sistema de archivos)) a la red.

Las rutas de archivos son cadenas en Node. Para mapear dicha cadena a un archivo real, hay una cantidad no trivial de interpretación en juego. Las rutas pueden, por ejemplo, incluir `../` para hacer referencia a un directorio padre. Así que una fuente obvia de problemas serían las solicitudes de rutas como `/../archivo_secreto`.

{{index "paquete node:path", "función resolve", "función cwd", "objeto process", "403 (código de estado HTTP)", "vínculo sep", ["carácter barra invertida", "como separador de ruta"], "carácter barra"}}

Para evitar tales problemas, `urlPath` utiliza la función `resolve` del módulo `node:path`, que resuelve rutas relativas. Luego verifica que el resultado esté _debajo_ del directorio de trabajo. La función `process.cwd` (donde `cwd` significa "directorio de trabajo actual") se puede usar para encontrar este directorio de trabajo. El vínculo `sep` del paquete `node:path` es el separador de ruta del sistema: una barra invertida en Windows y una barra diagonal en la mayoría de otros sistemas. Cuando la ruta no comienza con el directorio base, la función arroja un objeto de respuesta de error, usando el código de estado HTTP que indica que el acceso al recurso está prohibido.

{{index "ejemplo de servidor de archivos", "Node.js", "método GET", [archivo, recurso]}}

Configuraremos el método `GET` para devolver una lista de archivos al leer un ((directorio)) y para devolver el contenido del archivo al leer un archivo regular.

{{index "tipo de medio", "encabezado Content-Type", "paquete mime-types"}}

Una pregunta complicada es qué tipo de encabezado `Content-Type` debemos establecer al devolver el contenido de un archivo. Dado que estos archivos podrían ser cualquier cosa, nuestro servidor no puede simplemente devolver el mismo tipo de contenido para todos ellos. ((npm)) puede ayudarnos nuevamente aquí. El paquete `mime-types` (los indicadores de tipo de contenido como `text/plain` también se llaman _((tipos MIME))_) conoce el tipo correcto para una gran cantidad de ((extensiones de archivo)).

{{index "programa npm"}}

El siguiente comando de `npm`, en el directorio donde reside el script del servidor, instala una versión específica de `mime`:

```{lang: null}
$ npm install mime-types@2.1.0
```

{{index "404 (código de estado HTTP)", "función stat", [archivo, recurso]}}

Cuando un archivo solicitado no existe, el código de estado HTTP correcto a devolver es 404. Utilizaremos la función `stat`, que busca información sobre un archivo, para averiguar tanto si el archivo existe como si es un ((directorio)).

```{includeCode: ">code/file_server.mjs"}
import {createReadStream} from "node:fs";
import {stat, readdir} from "node:fs/promises";
import {lookup} from "mime-types";

methods.GET = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 404, body: "Archivo no encontrado"};
  }
  if (stats.isDirectory()) {
    return {body: (await readdir(path)).join("\n")};
  } else {
    return {body: createReadStream(path),
            type: lookup(path)};
  }
};
```

{{index "función createReadStream", ["programación asíncrona", "en Node.js"], "manejo de errores","ENOENT (código de estado)","Tipo de error","herencia"}}

Debido a que debe acceder al disco y por lo tanto podría llevar algún tiempo, `stat` es asíncrono. Dado que estamos utilizando promesas en lugar del estilo de devolución de llamada, debe ser importado desde `node:fs/promises` en lugar de directamente desde `node:fs`.

Cuando el archivo no existe, `stat` lanzará un objeto de error con una propiedad `code` de `"ENOENT"`. Estos códigos algo oscuros, inspirados en ((Unix)), son la forma en que se reconocen los tipos de error en Node.

{{index "Tipo Stats", "función stat", "método isDirectory"}}

El objeto `stats` devuelto por `stat` nos indica varias cosas sobre un ((archivo)), como su tamaño (propiedad `size`) y su ((fecha de modificación)) (`mtime`). Aquí nos interesa saber si es un ((directorio)) o un archivo regular, lo cual nos dice el método `isDirectory`.

{{index "función readdir"}}

Usamos `readdir` para leer la matriz de archivos en un ((directorio)) y devolverla al cliente. Para archivos normales, creamos un flujo de lectura con `createReadStream` y lo devolvemos como cuerpo, junto con el tipo de contenido que nos proporciona el paquete `mime` para el nombre del archivo.

{{index "Node.js", "ejemplo de servidor de archivos", "método DELETE", "función rmdir", "función unlink"}}

El código para manejar las solicitudes `DELETE` es ligeramente más sencillo.

```{includeCode: ">code/file_server.mjs"}
import {rmdir, unlink} from "node:fs/promises";

methods.DELETE = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    else return {status: 204};
  }
  if (stats.isDirectory()) await rmdir(path);
  else await unlink(path);
  return {status: 204};
};
```

{{index "204 (código de estado HTTP)", "cuerpo (HTTP)"}}

Cuando una ((respuesta HTTP)) no contiene datos, se puede usar el código de estado 204 ("sin contenido") para indicarlo. Dado que la respuesta a la eliminación no necesita transmitir ninguna información más allá de si la operación tuvo éxito, es sensato devolver eso aquí.

{{index idempotencia, "respuesta de error"}}

Es posible que te preguntes por qué intentar eliminar un archivo inexistente devuelve un código de estado de éxito en lugar de un error. Cuando el archivo que se está eliminando no está presente, se podría decir que el objetivo de la solicitud ya se ha cumplido. El estándar ((HTTP)) nos anima a hacer solicitudes _idempotentes_, lo que significa que hacer la misma solicitud varias veces produce el mismo resultado que hacerla una vez. De cierta manera, si intentas eliminar algo que ya no está, el efecto que intentabas lograr se ha alcanzado: la cosa ya no está allí.

{{index "ejemplo de servidor de archivos", "Node.js", "método PUT"}}

Este es el manejador para las solicitudes `PUT`:

```{includeCode: ">code/file_server.mjs"}
import {createWriteStream} from "node:fs";

function pipeStream(from, to) {
  return new Promise((resolve, reject) => {
    from.on("error", reject);
    to.on("error", reject);
    to.on("finish", resolve);
    from.pipe(to);
  });
}```methods.PUT = async function(request) {
  let path = urlPath(request.url);
  await pipeStream(request, createWriteStream(path));
  return {status: 204};
};
```

{{index sobrescritura, "204 (código de estado HTTP)", "evento de error", "evento de finalización", "función createWriteStream", "método pipe", stream}}

Esta vez no necesitamos verificar si el archivo existe; si lo hace, simplemente lo sobrescribiremos. Nuevamente usamos `pipe` para mover datos de un flujo legible a uno escribible, en este caso del request al archivo. Pero como `pipe` no está diseñado para devolver una promesa, debemos escribir un contenedor, `pipeStream`, que cree una promesa alrededor del resultado de llamar a `pipe`.

{{index "evento de error", "evento de finalización"}}

Cuando algo sale mal al abrir el archivo, `createWriteStream` seguirá devolviendo un flujo, pero ese flujo lanzará un evento de `"error"`. El flujo del request también puede fallar, por ejemplo si la red falla. Por lo tanto, conectamos los eventos de `"error"` de ambos flujos para rechazar la promesa. Cuando `pipe` haya terminado, cerrará el flujo de salida, lo que hará que lance un evento de `"finalización"`. En ese momento podemos resolver la promesa con éxito (devolviendo nada).

{{index descarga, "ejemplo de servidor de archivos", "Node.js"}}

El script completo del servidor está disponible en [_https://eloquentjavascript.net/code/file_server.mjs_](https://eloquentjavascript.net/code/file_server.mjs). Puedes descargarlo y, después de instalar sus dependencias, ejecutarlo con Node para iniciar tu propio servidor de archivos. Y, por supuesto, puedes modificarlo y ampliarlo para resolver los ejercicios de este capítulo o para experimentar.

{{index "cuerpo (HTTP)", "programa curl", [HTTP, cliente], [método, HTTP]}}

La herramienta de línea de comandos `curl`, ampliamente disponible en sistemas ((Unix)) (como macOS y Linux), se puede utilizar para hacer ((solicitudes)) HTTP. La siguiente sesión prueba brevemente nuestro servidor. La opción `-X` se usa para establecer el método de la solicitud, y `-d` se utiliza para incluir un cuerpo de solicitud.

```{lang: null}
$ curl http://localhost:8000/file.txt
Archivo no encontrado
$ curl -X PUT -d CONTENIDO http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
CONTENIDO
$ curl -X DELETE http://localhost:8000/file.txt
$ curl http://localhost:8000/file.txt
Archivo no encontrado
```

La primera solicitud para `file.txt` falla ya que el archivo aún no existe. La solicitud `PUT` crea el archivo y, voilà, la siguiente solicitud lo recupera con éxito. Después de eliminarlo con una solicitud `DELETE`, el archivo vuelve a estar ausente.

## Resumen

{{index "Node.js"}}

Node es un sistema pequeño interesante que nos permite ejecutar JavaScript en un contexto no de navegador. Originalmente fue diseñado para tareas de red para desempeñar el papel de un _nodo_ en una red. Sin embargo, se presta para todo tipo de tareas de script, y si disfrutas escribir JavaScript, automatizar tareas con Node funciona bien.

NPM proporciona paquetes para todo lo que puedas imaginar (y varias cosas que probablemente nunca se te ocurrirían), y te permite descargar e instalar esos paquetes con el programa `npm`. Node viene con varios módulos integrados, incluido el módulo `node:fs` para trabajar con el sistema de archivos y el módulo `node:http` para ejecutar servidores HTTP.Todo el input y output en Node se hace de forma asíncrona, a menos que uses explícitamente una variante síncrona de una función, como `readFileSync`. Originalmente, Node usaba devoluciones de llamada para funcionalidades asíncronas, pero el paquete `node:fs/promises` proporciona una interfaz basada en promesas para el sistema de archivos.

## Ejercicios

### Herramienta de búsqueda

{{index grep, "problema de búsqueda", "herramienta de búsqueda (ejercicio)"}}

En los sistemas ((Unix)), existe una herramienta de línea de comandos llamada `grep` que se puede utilizar para buscar rápidamente archivos según una ((expresión regular)).

Escribe un script de Node que se pueda ejecutar desde la línea de comandos y funcione de manera similar a `grep`. Trata el primer argumento de la línea de comandos como una expresión regular y trata cualquier argumento adicional como archivos a buscar. Debería mostrar los nombres de los archivos cuyo contenido coincide con la expresión regular.

Una vez que eso funcione, extiéndelo para que cuando uno de los argumentos sea un ((directorio)), busque en todos los archivos de ese directorio y sus subdirectorios.

{{index ["programación asíncrona", "en Node.js"], "programación síncrona"}}

Utiliza funciones asíncronas o síncronas del sistema de archivos según consideres adecuado. Configurar las cosas para que se soliciten múltiples acciones asíncronas al mismo tiempo podría acelerar un poco las cosas, pero no demasiado, ya que la mayoría de los sistemas de archivos solo pueden leer una cosa a la vez.

{{hint

{{index "Clase RegExp", "herramienta de búsqueda (ejercicio)"}}

Tu primer argumento de línea de comandos, la ((expresión regular)), se puede encontrar en `process.argv[2]`. Los archivos de entrada vienen después de eso. Puedes usar el constructor `RegExp` para convertir una cadena en un objeto de expresión regular.

{{index "Función readFileSync"}}

Hacer esto de forma síncrona, con `readFileSync`, es más sencillo, pero si usas `node:fs/promises` para obtener funciones que devuelven promesas y escribes una función `async`, el código se ve similar.

{{index "Función stat", "Función statSync", "Método isDirectory"}}

Para averiguar si algo es un directorio, nuevamente puedes usar `stat` (o `statSync`) y el método `isDirectory` del objeto de estadísticas.

{{index "Función readdir", "Función readdirSync"}}

Explorar un directorio es un proceso ramificado. Puedes hacerlo usando una función recursiva o manteniendo un array de tareas pendientes (archivos que aún deben ser explorados). Para encontrar los archivos en un directorio, puedes llamar a `readdir` o `readdirSync`. Observa la extraña capitalización: el nombrado de funciones del sistema de archivos de Node se basa vagamente en las funciones estándar de Unix, como `readdir`, que son todas en minúsculas, pero luego agrega `Sync` con una letra mayúscula.

Para obtener el nombre completo de un archivo leído con `readdir`, debes combinarlo con el nombre del directorio, ya sea añadiendo `sep` de `node:path` entre ellos, o utilizando la función `join` de ese mismo paquete.

hint}}

### Creación de directorios

{{index "ejemplo de servidor de archivos", "creación de directorios (ejercicio)", "función rmdir"}} 

Aunque el método `DELETE` en nuestro servidor de archivos es capaz de eliminar directorios (usando `rmdir`), actualmente el servidor no proporciona ninguna forma de _crear_ un ((directorio)).

{{index "MKCOL method", "mkdir function"}}

Añade soporte para el método `MKCOL` ("make collection"), que debería crear un directorio llamando a `mkdir` desde el módulo `node:fs`. `MKCOL` no es un método HTTP ampliamente utilizado, pero sí existe con este mismo propósito en el estándar _((WebDAV))_, el cual especifica un conjunto de convenciones sobre ((HTTP)) que lo hacen adecuado para crear documentos.

```{hidden: true, includeCode: ">code/file_server.mjs"}
import {mkdir} from "node:fs/promises";

methods.MKCOL = async function(request) {
  let path = urlPath(request.url);
  let stats;
  try {
    stats = await stat(path);
  } catch (error) {
    if (error.code != "ENOENT") throw error;
    await mkdir(path);
    return {status: 204};
  }
  if (stats.isDirectory()) return {status: 204};
  else return {status: 400, body: "No es un directorio"};
};
```

{{hint

{{index "creación de directorios (ejercicio)", "ejemplo de servidor de archivos", "método MKCOL", "función mkdir", idempotencia, "código de estado 400 (HTTP)"}}

Puedes usar la función que implementa el método `DELETE` como base para el método `MKCOL`. Cuando no se encuentra ningún archivo, intenta crear un directorio con `mkdir`. Cuando existe un directorio en esa ruta, puedes devolver una respuesta 204 para que las solicitudes de creación de directorios sean idempotentes. Si existe un archivo que no es un directorio en esta ruta, devuelve un código de error. El código 400 ("solicitud incorrecta") sería apropiado.

hint}}

### Un espacio público en la web

{{index "espacio público (ejercicio)", "ejemplo de servidor de archivos", "cabecera Content-Type", sitio web}}

Dado que el servidor de archivos sirve cualquier tipo de archivo e incluso incluye la cabecera `Content-Type` correcta, puedes usarlo para servir un sitio web. Dado que permite a todos eliminar y reemplazar archivos, sería un tipo interesante de sitio web: uno que puede ser modificado, mejorado y vandalizado por todos aquellos que se tomen el tiempo de hacer la solicitud HTTP adecuada.

Escribe una página ((HTML)) básica que incluya un archivo JavaScript sencillo. Coloca los archivos en un directorio servido por el servidor de archivos y ábrelos en tu navegador.

Luego, como ejercicio avanzado o incluso como un ((proyecto de fin de semana)), combina todo el conocimiento que has adquirido de este libro para construir una interfaz más amigable para modificar el sitio web—desde _dentro_ del sitio web.

Utiliza un formulario ((HTML)) para editar el contenido de los archivos que conforman el sitio web, permitiendo al usuario actualizarlos en el servidor mediante solicitudes HTTP, como se describe en [Capítulo ?](http).

Comienza permitiendo que solo un archivo sea editable. Luego haz que el usuario pueda seleccionar qué archivo editar. Aprovecha el hecho de que nuestro servidor de archivos devuelve listas de archivos al leer un directorio.

{{index sobrescritura}}

No trabajes directamente en el código expuesto por el servidor de archivos ya que si cometes un error, es probable que dañes los archivos allí. En su lugar, mantén tu trabajo fuera del directorio accesible al público y cópialo allí al hacer pruebas.

{{hint

{{index "ejemplo de servidor de archivos", "etiqueta textarea (HTML)", "función fetch", "ruta relativa", "espacio público (ejercicio)"}}

Puedes crear un elemento `<textarea>` para contener el contenido del archivo que se está editando. Una solicitud `GET`, utilizando `fetch`, puede recuperar el contenido actual del archivo. Puedes usar URLs relativas como _index.html_, en lugar de [_http://localhost:8000/index.html_](http://localhost:8000/index.html), para hacer referencia a archivos en el mismo servidor que el script en ejecución.

{{index "etiqueta form (HTML)", "evento submit", "método PUT"}}

Luego, cuando el usuario haga clic en un botón (puedes usar un elemento `<form>` y el evento `"submit"`), realiza una solicitud `PUT` a la misma URL, con el contenido del `<textarea>` como cuerpo de la solicitud, para guardar el archivo.

{{index "etiqueta select (HTML)", "etiqueta option (HTML)", "evento change"}}

Puedes luego agregar un elemento `<select>` que contenga todos los archivos en el directorio principal del servidor mediante la adición de elementos `<option>` que contengan las líneas devueltas por una solicitud `GET` a la URL `/`. Cuando el usuario seleccione otro archivo (un evento `"change"` en el campo), el script debe recuperar y mostrar ese archivo. Al guardar un archivo, utiliza el nombre de archivo actualmente seleccionado.

hint}}