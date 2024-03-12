# HTTP y Formularios

{{quote {author: "Tim Berners-Lee", chapter: true}

Lo que a menudo resultaba difícil para las personas entender sobre el diseño era que no había nada más allá de las URL, HTTP y HTML. No había una computadora central "controlando" la Web, no existía una sola red en la que funcionaran estos protocolos, ni siquiera una organización en algún lugar que "dirigiera" la Web. La Web no era una "cosa" física que existía en un cierto "lugar". Era un "espacio" en el que la información podía existir.

quote}}

{{index "Fielding, Roy"}}

{{figure {url: "img/chapter_picture_18.jpg", alt: "Ilustración mostrando un formulario de registro en la web en un pergamino", chapter: "framed"}}}

El _Protocolo de Transferencia de Hipertexto_, mencionado anteriormente en [Capítulo ?](browser#web), es el mecanismo a través del cual se solicita y proporciona datos en la ((World Wide Web)). Este capítulo describe el ((protocolo)) con más detalle y explica la forma en que JavaScript del navegador tiene acceso a él.

## El protocolo

Si escribes _eloquentjavascript.net/18_http.html_ en la barra de direcciones de tu navegador, el ((navegador)) primero busca la ((dirección)) del servidor asociado con _eloquentjavascript.net_ e intenta abrir una ((conexión)) ((TCP)) con él en el ((puerto)) 80, el puerto predeterminado para el tráfico ((HTTP)). Si el ((servidor)) existe y acepta la conexión, el navegador podría enviar algo como esto:

```http
GET /18_http.html HTTP/1.1
Host: eloquentjavascript.net
User-Agent: Nombre de tu navegador
```

Luego el servidor responde, a través de esa misma conexión.

```http
HTTP/1.1 200 OK
Content-Length: 87320
Content-Type: text/html
Last-Modified: Vie, 13 Oct 2023 10:05:41 GMT

<!doctype html>
... el resto del documento
```

El navegador toma la parte de la ((respuesta)) después de la línea en blanco, su _cuerpo_ (no confundir con la etiqueta HTML `<body>`), y lo muestra como un documento ((HTML)).

La información enviada por el cliente se llama la _((solicitud))_. Comienza con esta línea:

```http
GET /18_http.html HTTP/1.1
```

La primera palabra es el _método_ de la ((solicitud)). `GET` significa que queremos _obtener_ el recurso especificado. Otros métodos comunes son `DELETE` para eliminar un recurso, `PUT` para crearlo o reemplazarlo, y `POST` para enviar información a él. Cabe destacar que el ((servidor)) no está obligado a llevar a cabo cada solicitud que recibe. Si te acercas a un sitio web aleatorio y le dices que `DELETE` su página principal, probablemente se negará.

La parte después del nombre del método es la ruta del _((recurso))_ al que aplica la solicitud. En el caso más simple, un recurso es simplemente un archivo en el ((servidor)), pero el protocolo no lo requiere así. Un recurso puede ser cualquier cosa que pueda transferirse _como si fuera_ un archivo. Muchos servidores generan las respuestas que producen al vuelo. Por ejemplo, si abres [_https://github.com/marijnh_](https://github.com/marijnh), el servidor buscará en su base de datos un usuario llamado "marijnh", y si lo encuentra, generará una página de perfil para ese usuario.Después de la ruta del recurso, la primera línea de la solicitud menciona `HTTP/1.1` para indicar la versión del protocolo HTTP que está utilizando.

En la práctica, muchos sitios utilizan la versión 2 de HTTP, que soporta los mismos conceptos que la versión 1.1 pero es mucho más complicada para que pueda ser más rápida. Los navegadores cambiarán automáticamente a la versión de protocolo adecuada al comunicarse con un servidor dado, y el resultado de una solicitud es el mismo independientemente de la versión utilizada. Dado que la versión 1.1 es más directa y más fácil de entender, la usaremos para ilustrar el protocolo.

{{index "código de estado"}}

La respuesta del servidor comenzará también con una versión, seguida del estado de la respuesta, primero como un código de estado de tres dígitos y luego como una cadena legible por humanos.

```{lang: http}
HTTP/1.1 200 OK
```

{{index "200 (código de estado de HTTP)", "respuesta de error", "404 (código de estado de HTTP)"}}

Los códigos de estado que comienzan con 2 indican que la solicitud tuvo éxito. Los códigos que comienzan con 4 significan que hubo un problema con la solicitud. El 404 es probablemente el código de estado de HTTP más famoso, lo que significa que el recurso no se pudo encontrar. Los códigos que comienzan con 5 indican que ocurrió un error en el servidor y la solicitud no es la responsable.

{{index HTTP}}

{{id headers}}

La primera línea de una solicitud o respuesta puede ir seguida de cualquier número de _cabeceras_. Estas son líneas en la forma `nombre: valor` que especifican información adicional sobre la solicitud o respuesta. Estas cabeceras eran parte del ejemplo de respuesta:

```{lang: null}
Content-Length: 87320
Content-Type: text/html
Last-Modified: Fri, 13 Oct 2023 10:05:41 GMT
```

{{index "cabecera Content-Length", "cabecera Content-Type", "cabecera Last-Modified"}}

Esto nos indica el tamaño y tipo del documento de respuesta. En este caso, es un documento HTML de 87,320 bytes. También nos dice cuándo se modificó por última vez ese documento.

El cliente y servidor son libres de decidir qué cabeceras incluir en sus solicitudes o respuestas. Sin embargo, algunas de ellas son necesarias para que todo funcione. Por ejemplo, sin la cabecera `Content-Type` en la respuesta, el navegador no sabrá cómo mostrar el documento.

{{index "método GET", "método DELETE", "método PUT", "método POST", "cuerpo (HTTP)"}}

Después de las cabeceras, tanto las solicitudes como las respuestas pueden incluir una línea en blanco seguida de un cuerpo, que contiene el documento real que se envía. Las solicitudes `GET` y `DELETE` no envían ningún dato, pero las solicitudes `PUT` y `POST` sí lo hacen. Algunos tipos de respuestas, como las respuestas de error, tampoco requieren un cuerpo.

## Navegadores y HTTP

{{index HTTP, [archivo, recurso]}}

Como vimos, un navegador hará una solicitud cuando introducimos una URL en la barra de direcciones. Cuando la página HTML resultante hace referencia a otros archivos, como imágenes y archivos de JavaScript, el navegador los recuperará también.

{{index paralelismo, "método GET"}}

Un sitio web moderadamente complicado puede incluir fácilmente entre 10 y 200 recursos. Para poder obtenerlos rápidamente, los navegadores harán varias solicitudes `GET` simultáneamente en lugar de esperar las respuestas una por una.Las páginas HTML pueden incluir formularios, que permiten al usuario completar información y enviarla al servidor. A continuación se muestra un ejemplo de un formulario:

```{lang: html}
<form method="GET" action="example/message.html">
  <p>Nombre: <input type="text" name="name"></p>
  <p>Mensaje:<br><textarea name="message"></textarea></p>
  <p><button type="submit">Enviar</button></p>
</form>
```

{{index form, "atributo method", "método GET"}}

Este código describe un formulario con dos campos: uno pequeño que pide un nombre y otro más grande para escribir un mensaje. Cuando se hace clic en el botón Enviar, el formulario se envía, lo que significa que el contenido de sus campos se empaqueta en una solicitud HTTP y el navegador navega hacia el resultado de esa solicitud.

Cuando el atributo `method` del elemento `<form>` es `GET` (o se omite), la información del formulario se agrega al final de la URL de `action` como una cadena de consulta. El navegador podría hacer una solicitud a esta URL:

```{lang: null}
GET /example/message.html?name=Jean&message=Yes%3F HTTP/1.1
```

{{index "carácter ampersand"}}

El signo de interrogación indica el final de la parte de la ruta de la URL y el inicio de la consulta. Le siguen pares de nombres y valores, correspondientes al atributo `name` en los elementos del campo del formulario y al contenido de esos elementos, respectivamente. Un carácter ampersand (`&`) se utiliza para separar los pares.

{{index [escaping, "en URLs"], "número hexadecimal", "función encodeURIComponent", "función decodeURIComponent"}}

El mensaje real codificado en la URL es "Yes?", pero el signo de interrogación se reemplaza por un código extraño. Algunos caracteres en las cadenas de consulta deben ser escapados. El signo de interrogación, representado como `%3F`, es uno de ellos. Parece haber una regla no escrita de que cada formato necesita su propia forma de escapar caracteres. Este, llamado codificación de URL, utiliza un signo de porcentaje seguido de dos dígitos hexadecimales (base 16) que codifican el código de caracteres. En este caso, 3F, que es 63 en notación decimal, es el código de un signo de interrogación. JavaScript proporciona las funciones `encodeURIComponent` y `decodeURIComponent` para codificar y decodificar este formato.

```
console.log(encodeURIComponent("Yes?"));
// → Yes%3F
console.log(decodeURIComponent("Yes%3F"));
// → Yes?
```

{{index "cuerpo (HTTP)", "método POST"}}

Si cambiamos el atributo `method` del formulario HTML en el ejemplo que vimos anteriormente a `POST`, la solicitud HTTP realizada para enviar el formulario utilizará el método `POST` y colocará la cadena de consulta en el cuerpo de la solicitud, en lugar de agregarla a la URL.

```{lang: http}
POST /example/message.html HTTP/1.1
Content-length: 24
Content-type: application/x-www-form-urlencoded

name=Jean&message=Yes%3F
```

Las solicitudes `GET` deben utilizarse para solicitudes que no tengan efectos secundarios, sino simplemente para solicitar información. Las solicitudes que cambian algo en el servidor, como por ejemplo crear una nueva cuenta o publicar un mensaje, deben expresarse con otros métodos, como `POST`. El software del lado del cliente, como un navegador, sabe que no debe hacer solicitudes `POST` a ciegas, pero a menudo implícitamente realiza solicitudes `GET`, por ejemplo, para precargar un recurso que cree que pronto el usuario necesitará.Volveremos a hablar de formularios y cómo interactuar con ellos desde JavaScript [más adelante en el capítulo](http#forms).

{{id fetch}}

## Fetch

{{index "función fetch", "clase Promise", [interfaz, "módulo"]}}

La interfaz a través de la cual JavaScript del navegador puede hacer solicitudes HTTP se llama `fetch`.

```{test: no}
fetch("ejemplo/datos.txt").then(response => {
  console.log(response.status);
  // → 200
  console.log(response.headers.get("Content-Type"));
  // → text/plain
});
```

{{index "clase Response", "propiedad status", "propiedad headers"}}

Llamar a `fetch` devuelve una promesa que se resuelve en un objeto `Response` que contiene información sobre la respuesta del servidor, como su código de estado y sus encabezados. Los encabezados están envueltos en un objeto similar a un `Map` que trata sus claves (los nombres de los encabezados) como insensibles a mayúsculas y minúsculas porque los nombres de los encabezados no deben ser sensibles a mayúsculas y minúsculas. Esto significa que `headers.get("Content-Type")` y `headers.get("content-TYPE")` devolverán el mismo valor.

Ten en cuenta que la promesa devuelta por `fetch` se resuelve con éxito incluso si el servidor responde con un código de error. También puede ser rechazada si hay un error de red o si el ((servidor)) al que se dirige la solicitud no se puede encontrar.

{{index [ruta, URL], "URL relativa"}}

El primer argumento de `fetch` es la URL que se debe solicitar. Cuando esa ((URL)) no comienza con un nombre de protocolo (como _http:_), se trata como _relativa_, lo que significa que se interpreta en relación con el documento actual. Cuando comienza con una barra (/), reemplaza la ruta actual, que es la parte después del nombre del servidor. Cuando no lo hace, la parte de la ruta actual hasta e incluyendo su último ((carácter de barra)) se coloca al principio de la URL relativa.

{{index "método text", "cuerpo (HTTP)", "clase Promise"}}

Para acceder al contenido real de una respuesta, puedes usar su método `text`. Debido a que la promesa inicial se resuelve tan pronto como se han recibido los encabezados de la respuesta y porque leer el cuerpo de la respuesta podría llevar un poco más de tiempo, esto devuelve nuevamente una promesa.

```{test: no}
fetch("ejemplo/datos.txt")
  .then(resp => resp.text())
  .then(text => console.log(text));
// → Este es el contenido de datos.txt
```

{{index "método json"}}

Un método similar, llamado `json`, devuelve una promesa que se resuelve al valor que obtienes al analizar el cuerpo como ((JSON)) o se rechaza si no es un JSON válido.

{{index "método GET", "cuerpo (HTTP)", "método DELETE", "propiedad método"}}

Por defecto, `fetch` utiliza el método `GET` para realizar su solicitud y no incluye un cuerpo de solicitud. Puedes configurarlo de manera diferente pasando un objeto con opciones adicionales como segundo argumento. Por ejemplo, esta solicitud intenta eliminar `ejemplo/datos.txt`:

```{test: no}
fetch("ejemplo/datos.txt", {method: "DELETE"}).then(resp => {
  console.log(resp.status);
  // → 405
});
```

{{index "código de estado 405 (HTTP)"}}

El código de estado 405 significa "método no permitido", la forma en que un servidor HTTP dice "Me temo que no puedo hacer eso".

{{index "encabezado de rango", "propiedad cuerpo", "propiedad headers"}}Para agregar un cuerpo de solicitud, puedes incluir una opción `body`. Para establecer cabeceras, está la opción `headers`. Por ejemplo, esta solicitud incluye una cabecera `Range`, que indica al servidor que devuelva solo una parte de un documento.

```{test: no}
fetch("ejemplo/datos.txt", {headers: {Range: "bytes=8-19"}})
  .then(resp => resp.text())
  .then(console.log);
// → el contenido
```

El navegador automáticamente añadirá algunas cabeceras de solicitud, como "Host" y aquellas necesarias para que el servidor pueda determinar el tamaño del cuerpo. Sin embargo, añadir tus propias cabeceras es muchas veces útil para incluir cosas como información de autenticación o para indicar al servidor en qué formato de archivo te gustaría recibir.

{{id http_sandbox}}

## Aislamiento HTTP

{{index sandbox, [navegador, seguridad]}}

Realizar solicitudes ((HTTP)) en scripts de páginas web plantea nuevamente preocupaciones sobre ((seguridad)). La persona que controla el script puede no tener los mismos intereses que la persona en cuya computadora se está ejecutando. Específicamente, si visito _themafia.org_, no quiero que sus scripts puedan hacer una solicitud a _mybank.com_, utilizando información de identificación de mi navegador, con instrucciones para transferir todo mi dinero.

Por esta razón, los navegadores nos protegen al impedir que los scripts hagan solicitudes HTTP a otros ((dominios)) (nombres como _themafia.org_ y _mybank.com_).

{{index "cabecera Access-Control-Allow-Origin", "solicitud entre dominios"}}

Esto puede ser un problema molesto al construir sistemas que necesitan acceder a varios dominios por razones legítimas. Afortunadamente, los ((servidores)) pueden incluir una ((cabecera)) como esta en sus ((respuestas)) para indicar explícitamente al navegador que está bien que la solicitud provenga de otro dominio:

```{lang: null}
Access-Control-Allow-Origin: *
```

## Apreciando HTTP

{{index cliente, HTTP, [interfaz, HTTP]}}

Cuando se construye un sistema que requiere ((comunicación)) entre un programa JavaScript que se ejecuta en el ((navegador)) (lado del cliente) y un programa en un ((servidor)) (lado del servidor), hay varias formas diferentes de modelar esta comunicación.

{{index [red, "abstracción"], "abstracción"}}

Un modelo comúnmente utilizado es el de las _llamadas de procedimiento remoto_. En este modelo, la comunicación sigue los patrones de llamadas de función normales, excepto que la función en realidad se está ejecutando en otra máquina. Llamarla implica hacer una solicitud al servidor que incluye el nombre de la función y sus argumentos. La respuesta a esa solicitud contiene el valor devuelto.

Cuando se piensa en términos de llamadas de procedimiento remoto, HTTP es simplemente un vehículo de comunicación, y es muy probable que escribas una capa de abstracción que lo oculte por completo.

{{index "tipo de medio", "formato del documento", [método, HTTP]}}

Otro enfoque es construir tu comunicación en torno al concepto de ((recurso))s y métodos ((HTTP)). En lugar de un procedimiento remoto llamado `addUser`, usas una solicitud `PUT` a `/usuarios/larry`. En lugar de codificar las propiedades de ese usuario en argumentos de función, defines un formato de documento JSON (o utilizas un formato existente) que represente a un usuario. El cuerpo de la solicitud `PUT` para crear un nuevo recurso es entonces dicho documento. Se obtiene un recurso realizando una solicitud `GET` a la URL del recurso (por ejemplo, `/usuario/larry`), que de nuevo devuelve el documento que representa al recurso.Este segundo enfoque facilita el uso de algunas de las características que proporciona HTTP, como el soporte para la caché de recursos (mantener una copia de un recurso en el cliente para un acceso rápido). Los conceptos utilizados en HTTP, que están bien diseñados, pueden proporcionar un conjunto útil de principios para diseñar la interfaz de tu servidor.

## Seguridad y HTTPS

{{index "hombre en el medio", seguridad, HTTPS, [red, seguridad]}}

Los datos que viajan por Internet tienden a seguir un largo y peligroso camino. Para llegar a su destino, deben pasar por cualquier cosa, desde puntos de acceso Wi-Fi de cafeterías hasta redes controladas por varias empresas y estados. En cualquier punto a lo largo de su ruta, pueden ser inspeccionados o incluso modificados.

{{index manipulación}}

Si es importante que algo se mantenga en secreto, como la ((contraseña)) de tu cuenta de ((correo electrónico)), o que llegue a su destino sin modificaciones, como el número de cuenta al que transfieres dinero a través del sitio web de tu banco, HTTP simple no es suficiente.

{{index "criptografía", cifrado}}

{{indexsee "HTTP seguro", HTTPS, [navegador, seguridad]}}

El protocolo seguro ((HTTP)), utilizado para ((URL))s que comienzan con _https://_, envuelve el tráfico HTTP de una manera que dificulta su lectura y manipulación. Antes de intercambiar datos, el cliente verifica que el servidor sea quien dice ser, solicitándole que demuestre que tiene un ((certificado)) criptográfico emitido por una autoridad de certificación que el navegador reconoce. Luego, todos los datos que pasan por la ((conexión)) están encriptados de una manera que debería evitar el espionaje y la manipulación.

Así, cuando funciona correctamente, ((HTTPS)) evita que otras personas se hagan pasar por el sitio web con el que estás intentando comunicarte _y_ que espíen tu comunicación. No es perfecto, y ha habido varios incidentes en los que HTTPS falló debido a certificados falsificados o robados y software defectuoso, pero es _mucho_ más seguro que el simple HTTP.

{{id formularios}}

## Campos de formulario

Los formularios fueron diseñados originalmente para la Web pre-JavaScript para permitir que los sitios web envíen información enviada por el usuario en una solicitud HTTP. Este diseño asume que la interacción con el servidor siempre ocurre navegando a una nueva página.

{{index [DOM, campos]}}

Pero sus elementos son parte del DOM al igual que el resto de la página, y los elementos DOM que representan los campos de formulario admiten una serie de propiedades y eventos que no están presentes en otros elementos. Esto hace posible inspeccionar y controlar dichos campos de entrada con programas JavaScript y hacer cosas como agregar nueva funcionalidad a un formulario o utilizar formularios y campos como bloques de construcción en una aplicación JavaScript.

{{index "formulario (etiqueta HTML)"}}

Un formulario web consiste en cualquier número de campos de entrada agrupados en una etiqueta `<form>`. HTML permite varios estilos diferentes de campos, que van desde simples casillas de verificación de encendido/apagado hasta menús desplegables y campos para entrada de texto. Este libro no intentará discutir exhaustivamente todos los tipos de campos, pero comenzaremos con una vista general aproximada.

{{index "entrada (etiqueta HTML)", "atributo tipo"}}

Muchos tipos de campos utilizan la etiqueta `<input>`. El atributo `type` de esta etiqueta se utiliza para seleccionar el estilo del campo. Estos son algunos tipos comúnmente utilizados de `<input>`:{{index "campo de contraseña", casilla de verificación, botón de radio, campo de archivo"}}

{{table {cols: [1,5]}}}

| `texto`    | Un campo de una línea ((campo de texto))
| `contraseña` | Igual que `texto` pero oculta el texto que se escribe
| `casilla de verificación` | Un interruptor de encendido/apagado
| `color`   | Un color
| `fecha`   | Una fecha de calendario
| `radio`   | (Parte de) un campo de ((opción múltiple))
| `archivo` | Permite al usuario elegir un archivo de su computadora

{{index "atributo valor", "atributo marcado", "formulario (etiqueta HTML)"}}

Los campos de formulario no necesariamente tienen que aparecer en una etiqueta `<form>`. Puedes ponerlos en cualquier parte de una página. Campos sin formulario no pueden ser ((enviado))s (solo un formulario en su totalidad puede), pero al responder a la entrada con JavaScript, a menudo no queremos enviar nuestros campos de forma normal de todos modos.

```{lang: html}
<p><input type="texto" value="abc"> (texto)</p>
<p><input type="contraseña" value="abc"> (contraseña)</p>
<p><input type="casilla de verificación" checked> (casilla de verificación)</p>
<p><input type="color" value="naranja"> (color)</p>
<p><input type="fecha" value="2023-10-13"> (fecha)</p>
<p><input type="radio" value="A" name="elección">
   <input type="radio" value="B" name="elección" checked>
   <input type="radio" value="C" name="elección"> (radio)</p>
<p><input type="archivo"> (archivo)</p>
```

{{if book

Los campos creados con este código HTML lucen así:

{{figure {url: "img/form_fields.png", alt: "Captura de pantalla que muestra varios tipos de etiquetas de entrada", width: "4cm"}}}

if}}

La interfaz de JavaScript para estos elementos difiere según el tipo de elemento.

{{index "área de texto (etiqueta HTML)", "campo de texto"}}

Los campos de texto de varias líneas tienen su propia etiqueta, `<textarea>`, principalmente porque sería incómodo utilizar un atributo para especificar un valor de inicio de varias líneas. La etiqueta `<textarea>` requiere una etiqueta de cierre `</textarea>` coincidente y utiliza el texto entre esas dos etiquetas, en lugar del atributo `valor`, como texto de inicio.

```{lang: html}
<textarea>
uno
dos
tres
</textarea>
```

{{index "select (etiqueta HTML)", "option (etiqueta HTML)", "opción múltiple", "menú desplegable"}}

Finalmente, la etiqueta `<select>` se usa para crear un campo que permite al usuario seleccionar de varias opciones predefinidas.

```{lang: html}
<select>
  <option>Tortitas</option>
  <option>Pudín</option>
  <option>Helado</option>
</select>
```

{{if book

Dicho campo luce así:

{{figure {url: "img/form_select.png", alt: "Captura de pantalla que muestra un campo de selección", width: "4cm"}}}

if}}

{{index "evento de cambio"}}

Cada vez que cambia el valor de un campo de formulario, se desencadenará un evento `"cambio"`.

## Enfoque

{{index teclado, enfoque}}

{{indexsee "enfoque del teclado", enfoque}}

A diferencia de la mayoría de elementos en documentos HTML, los campos de formulario pueden obtener _((enfoque)) de teclado_. Cuando se hace clic, se mueve con la tecla [tab]{keyname}, o se activa de alguna otra manera, se convierten en el elemento activo actual y en el receptor de la ((entrada)) de teclado.

{{index "option (etiqueta HTML)", "select (etiqueta HTML)"}}

Por lo tanto, puedes escribir en un ((campo de texto)) solo cuando está enfocado. Otros campos responden diferentemente a los eventos de teclado. Por ejemplo, un menú `<select>` intenta moverse a la opción que contiene el texto que el usuario escribió y responde a las teclas de flecha moviendo su selección hacia arriba y hacia abajo.

{{index "método focus", "método blur", "propiedad activeElement"}}

Podemos controlar el ((focus)) desde JavaScript con los métodos `focus` y `blur`. El primero mueve el enfoque al elemento del DOM en el que se llama, y el segundo elimina el enfoque. El valor en `document.activeElement` corresponde al elemento actualmente enfocado.

```{lang: html}
<input type="text">
<script>
  document.querySelector("input").focus();
  console.log(document.activeElement.tagName);
  // → INPUT
  document.querySelector("input").blur();
  console.log(document.activeElement.tagName);
  // → BODY
</script>
```

{{index "atributo autofocus"}}

Para algunas páginas, se espera que el usuario desee interactuar inmediatamente con un campo de formulario. JavaScript se puede utilizar para ((enfocar)) este campo cuando se carga el documento, pero HTML también proporciona el atributo `autofocus`, que produce el mismo efecto al mismo tiempo que le indica al navegador lo que estamos tratando de lograr. Esto le da al navegador la opción de deshabilitar el comportamiento cuando no es apropiado, como cuando el usuario ha puesto el enfoque en otra parte.

{{index "tecla de tabulación", teclado, "atributo tabindex", "a (etiqueta HTML)"}}

Los navegadores permiten al usuario mover el enfoque a través del documento presionando la tecla [tab]{keyname} para pasar al siguiente elemento enfocable, y [shift-tab]{keyname} para retroceder al elemento anterior. Por defecto, los elementos se visitan en el orden en que aparecen en el documento. Es posible usar el atributo `tabindex` para cambiar este orden. El siguiente ejemplo de documento permitirá que el enfoque salte del campo de texto al botón OK, en lugar de pasar primero por el enlace de ayuda:

```{lang: html, focus: true}
<input type="text" tabindex=1> <a href=".">(ayuda)</a>
<button onclick="console.log('ok')" tabindex=2>OK</button>
```

{{index "atributo tabindex"}}

Por defecto, la mayoría de los tipos de elementos HTML no pueden ser enfocados. Pero se puede agregar un atributo `tabindex` a cualquier elemento para hacerlo enfocable. Un `tabindex` de 0 hace que un elemento sea enfocable sin afectar el orden de enfoque.

## Campos deshabilitados

{{index "atributo disabled"}}

Todos los campos de ((formulario)) pueden ser _deshabilitados_ a través de su atributo `disabled`. Es un ((atributo)) que se puede especificar sin valor; el simple hecho de que esté presente deshabilita el elemento.

```{lang: html}
<button>Estoy bien</button>
<button disabled>Estoy fuera</button>
```

Los campos deshabilitados no pueden ser ((enfocar))dos ni modificados, y los navegadores los muestran de color gris y atenuados.

{{if book

{{figure {url: "img/button_disabled.png", alt: "Captura de pantalla de un botón deshabilitado", width: "3cm"}}}

if}}

{{index "experiencia del usuario"}}

Cuando un programa está en proceso de manejar una acción provocada por algún ((botón)) u otro control que podría requerir comunicación con el servidor y por lo tanto llevar un tiempo, puede ser una buena idea deshabilitar el control hasta que la acción haya terminado. De esta forma, cuando el usuario se impaciente y hace clic nuevamente, no repiten accidentalmente su acción.

## El formulario en su totalidad

{{index "objeto similar a un array", "formulario (etiqueta HTML)", "propiedad formulario", "propiedad elementos"}}Cuando un ((field)) está contenido en un elemento `<form>`, su elemento DOM tendrá una propiedad `form` que enlaza de vuelta al elemento DOM del formulario. El elemento `<form>`, a su vez, tiene una propiedad llamada `elements` que contiene una colección similar a un array de los campos dentro de él.

{{index "elements property", "name attribute"}}

El atributo `name` de un campo de formulario determina la forma en que se identificará su valor cuando se ((submit))ee el formulario. También se puede utilizar como nombre de propiedad al acceder a la propiedad `elements` del formulario, la cual actúa tanto como un objeto similar a un array (accesible por número) como un ((mapa)) (accesible por nombre).

```{lang: html}
<form action="ejemplo/enviar.html">
  Nombre: <input type="text" name="nombre"><br>
  Contraseña: <input type="password" name="contraseña"><br>
  <button type="submit">Ingresar</button>
</form>
<script>
  let formulario = document.querySelector("form");
  console.log(formulario.elements[1].type);
  // → password
  console.log(formulario.elements.contraseña.type);
  // → password
  console.log(formulario.elements.nombre.form == formulario);
  // → true
</script>
```

{{index "button (HTML tag)", "type attribute", submit, "enter key"}}

Un botón con un atributo `type` de `submit` hará que, al presionarlo, se submita el formulario. Presionar [enter]{keyname} cuando un campo de formulario está enfocado tendrá el mismo efecto.

{{index "submit event", "event handling", "preventDefault method", "page reload", "GET method", "POST method"}}

Enviar un ((form))ulario normalmente significa que el ((navegador)) se dirige a la página indicada por el atributo `action` del formulario, utilizando ya sea una solicitud `GET` o `POST`. Pero antes de que eso ocurra, se dispara un evento `"submit"`. Puedes manejar este evento con JavaScript y prevenir este comportamiento por defecto llamando a `preventDefault` en el objeto de evento.

```{lang: html}
<form>
  Valor: <input type="text" name="valor">
  <button type="submit">Guardar</button>
</form>
<script>
  let formulario = document.querySelector("form");
  formulario.addEventListener("submit", evento => {
    console.log("Guardando valor", formulario.elements.valor.value);
    evento.preventDefault();
  });
</script>
```

{{index "submit event", validation}}

Interceptar los eventos `"submit"` en JavaScript tiene varios usos. Podemos escribir código para verificar que los valores ingresados por el usuario tengan sentido y mostrar inmediatamente un mensaje de error en lugar de enviar el formulario. O podemos deshabilitar completamente la forma regular de enviar el formulario, como en el ejemplo, y hacer que nuestro programa maneje la entrada, posiblemente utilizando `fetch` para enviarla a un servidor sin recargar la página.

## Campos de texto

{{index "value attribute", "input (HTML tag)", "text field", "textarea (HTML tag)", [DOM, fields], [interface, object]}}

Los campos creados por etiquetas `<textarea>`, o etiquetas `<input>` con un tipo de `text` o `password`, comparten una interfaz común. Sus elementos DOM tienen una propiedad `value` que contiene su contenido actual como un valor de cadena. Establecer esta propiedad a otra cadena cambia el contenido del campo.

{{index "selectionStart property", "selectionEnd property"}}Las propiedades `selectionStart` y `selectionEnd` de los ((campos de texto)) nos brindan información sobre la posición del ((cursor)) y la ((selección)) en el ((texto)). Cuando no se ha seleccionado nada, estas dos propiedades contienen el mismo número, indicando la posición del cursor. Por ejemplo, 0 indica el inicio del texto, y 10 indica que el cursor está después del 10^º^ ((carácter)). Cuando se selecciona parte del campo, las dos propiedades serán diferentes, dándonos el inicio y el final del texto seleccionado. Al igual que `value`, estas propiedades también se pueden escribir.

{{index Khasekhemwy, "etiqueta textarea (HTML)", teclado, "manejo de eventos"}}

Imagina que estás escribiendo un artículo sobre Khasekhemwy pero tienes problemas para deletrear su nombre. El siguiente código vincula una etiqueta `<textarea>` con un controlador de eventos que, al presionar F2, inserta la cadena "Khasekhemwy" por ti.

```{lang: html}
<textarea></textarea>
<script>
  let textarea = document.querySelector("textarea");
  textarea.addEventListener("keydown", event => {
    if (event.key == "F2") {
      replaceSelection(textarea, "Khasekhemwy");
      event.preventDefault();
    }
  });
  function replaceSelection(field, word) {
    let from = field.selectionStart, to = field.selectionEnd;
    field.value = field.value.slice(0, from) + word +
                  field.value.slice(to);
    // Coloca el cursor después de la palabra
    field.selectionStart = from + word.length;
    field.selectionEnd = from + word.length;
  }
</script>
```

{{index "función replaceSelection", "campo de texto"}}

La función `replaceSelection` reemplaza la parte actualmente seleccionada del contenido de un campo de texto con la palabra proporcionada y luego mueve el ((cursor)) después de esa palabra para que el usuario pueda continuar escribiendo.

{{index "evento change", "evento input"}}

El evento `"change"` para un ((campo de texto)) no se activa cada vez que se escribe algo. En cambio, se activa cuando el campo pierde el ((enfoque)) después de que su contenido haya cambiado. Para responder de inmediato a los cambios en un campo de texto, se debe registrar un controlador para el evento `"input"`, que se activa cada vez que el usuario escribe un carácter, elimina texto o de otra manera manipula el contenido del campo.

El siguiente ejemplo muestra un campo de texto y un contador que muestra la longitud actual del texto en el campo:

```{lang: html}
<input type="text"> longitud: <span id="length">0</span>
<script>
  let texto = document.querySelector("input");
  let output = document.querySelector("#length");
  texto.addEventListener("input", () => {
    output.textContent = texto.value.length;
  });
</script>
```

## Casillas de verificación y botones de radio

{{index "etiqueta input (HTML)", "atributo checked"}}

Un campo de ((casilla de verificación)) es un interruptor binario. Su valor se puede extraer o cambiar a través de su propiedad `checked`, que contiene un valor Booleano.

```{lang: html}
<label>
  <input type="checkbox" id="purple"> Hacer esta página morada
</label>
<script>
  let casillaVerificacion = document.querySelector("#purple");
  casillaVerificacion.addEventListener("change", () => {
    document.body.style.background =
      casillaVerificacion.checked ? "mediumpurple" : "";
  });
</script>
```

{{index "for attribute", "id attribute", focus, "label (HTML tag)", labeling}}

La etiqueta `<label>` asocia un fragmento de documento con un campo de entrada. Hacer clic en cualquier parte de la etiqueta activará el campo, lo enfocará e invertirá su valor cuando sea un casilla de verificación o un botón de radio.

{{index "input (HTML tag)", "multiple-choice"}}

Un botón de radio es similar a una casilla de verificación, pero está vinculado implícitamente a otros botones de radio con el mismo atributo `name` para que solo uno de ellos pueda estar activo en cualquier momento.

```{lang: html}
Color:
<label>
  <input type="radio" name="color" value="orange"> Naranja
</label>
<label>
  <input type="radio" name="color" value="lightgreen"> Verde claro
</label>
<label>
  <input type="radio" name="color" value="lightblue"> Azul claro
</label>
<script>
  let buttons = document.querySelectorAll("[name=color]");
  for (let button of Array.from(buttons)) {
    button.addEventListener("change", () => {
      document.body.style.background = button.value;
    });
  }
</script>
```

{{index "name attribute", "querySelectorAll method"}}

Los corchetes cuadrados en la consulta CSS proporcionada a `querySelectorAll` se utilizan para hacer coincidir atributos. Selecciona elementos cuyo atributo `name` es `"color"`.

## Campos de selección

{{index "select (HTML tag)", "multiple-choice", "option (HTML tag)"}}

Los campos de selección son conceptualmente similares a los botones de radio, ya que también permiten al usuario elegir entre un conjunto de opciones. Sin embargo, mientras que un botón de radio pone el diseño de las opciones bajo nuestro control, la apariencia de una etiqueta `<select>` está determinada por el navegador.

{{index "multiple attribute", "drop-down menu"}}

Los campos de selección también tienen una variante que se asemeja más a una lista de casillas de verificación que a botones de radio. Cuando se le otorga el atributo `multiple`, una etiqueta `<select>` permitirá al usuario seleccionar cualquier número de opciones, en lugar de una sola opción. Mientras que un campo de selección regular se muestra como un control de _lista desplegable_, que muestra las opciones inactivas solo cuando lo abres, un campo con `multiple` habilitado muestra múltiples opciones al mismo tiempo, permitiendo al usuario habilitar o deshabilitarlas individualmente.

{{index "option (HTML tag)", "value attribute"}}

Cada etiqueta `<option>` tiene un valor. Este valor se puede definir con un atributo `value`. Cuando este no se proporciona, el ((texto)) dentro de la opción se considerará como su valor. La propiedad `value` de un elemento `<select>` refleja la opción actualmente seleccionada. Sin embargo, para un campo `multiple`, esta propiedad no significa mucho, ya que dará el valor de solo _una_ de las opciones actualmente seleccionadas.

{{index "select (HTML tag)", "options property", "selected attribute"}}

Las etiquetas `<option>` para un campo `<select>` pueden ser accedidas como un objeto similar a un array a través de la propiedad `options` del campo. Cada opción tiene una propiedad llamada `selected`, que indica si esa opción está actualmente seleccionada. La propiedad también se puede escribir para seleccionar o deseleccionar una opción.

{{index "multiple attribute", "binary number"}}

Este ejemplo extrae los valores seleccionados de un campo de selección `multiple` y los utiliza para componer un número binario a partir de bits individuales. Mantén pulsado [control]{keyname} (o [command]{keyname} en un Mac) para seleccionar múltiples opciones.

```{lang: html}
<select multiple>
  <option value="1">0001</option>
  <option value="2">0010</option>
  <option value="4">0100</option>
  <option value="8">1000</option>
</select> = <span id="output">0</span>
<script>
  let select = document.querySelector("select");
  let output = document.querySelector("#output");
  select.addEventListener("change", () => {
    let number = 0;
    for (let option of Array.from(select.options)) {
      if (option.selected) {
        number += Number(option.value);
      }
    }
    output.textContent = number;
  });
</script>
```

## Campos de archivo

{{index file, "hard drive", "file system", security, "file field", "input (HTML tag)"}}

Los campos de archivo fueron diseñados originalmente como una forma de ((subir)) archivos desde la máquina del usuario a través de un formulario. En los navegadores modernos, también proporcionan una forma de leer dichos archivos desde programas JavaScript. El campo actúa como una especie de guardián. El script no puede simplemente comenzar a leer archivos privados desde la computadora del usuario, pero si el usuario selecciona un archivo en dicho campo, el navegador interpreta esa acción como que el script puede leer el archivo.

Un campo de archivo suele parecerse a un botón etiquetado con algo como "elegir archivo" o "explorar", con información sobre el archivo elegido al lado.

```{lang: html}
<input type="file">
<script>
  let input = document.querySelector("input");
  input.addEventListener("change", () => {
    if (input.files.length > 0) {
      let file = input.files[0];
      console.log("Has elegido", file.name);
      if (file.type) console.log("Tiene tipo", file.type);
    }
  });
</script>
```

{{index "multiple attribute", "files property"}}

La propiedad `files` de un elemento ((campo de archivo)) es un objeto similar a un arreglo (una vez más, no es un arreglo real) que contiene los archivos elegidos en el campo. Inicialmente está vacío. La razón por la que no hay simplemente una propiedad `file` es que los campos de archivo también admiten un atributo `multiple`, lo que permite seleccionar varios archivos al mismo tiempo.

{{index "File type"}}

Los objetos en `files` tienen propiedades como `name` (el nombre de archivo), `size` (el tamaño del archivo en bytes, que son trozos de 8 bits) y `type` (el tipo de medio del archivo, como `text/plain` o `image/jpeg`).

{{index ["asynchronous programming", "reading files"], "file reading", "FileReader class"}}

{{id filereader}}

Lo que no tiene es una propiedad que contenga el contenido del archivo. Acceder a eso es un poco más complicado. Dado que leer un archivo desde el disco puede llevar tiempo, la interfaz es asíncrona para evitar que se congele la ventana.

```{lang: html}
<input type="file" multiple>
<script>
  let input = document.querySelector("input");
  input.addEventListener("change", () => {
    for (let file of Array.from(input.files)) {
      let reader = new FileReader();
      reader.addEventListener("load", () => {
        console.log("El archivo", file.name, "comienza con",
                    reader.result.slice(0, 20));
      });
      reader.readAsText(file);
    }
  });
</script>
```

{{index "Clase FileReader", "evento load", "método readAsText", "propiedad result"}}

La lectura de un archivo se realiza creando un objeto `FileReader`, registrando un controlador de eventos `"load"` para él y llamando a su método `readAsText`, dándole el archivo que queremos leer. Una vez que la carga finaliza, la propiedad `result` del lector contiene el contenido del archivo.

{{index "evento error", "Clase FileReader", "Clase Promise"}}

Los `FileReader`s también disparan un evento `"error"` cuando la lectura del archivo falla por cualquier motivo. El objeto de error en sí terminará en la propiedad `error` del lector. Esta interfaz fue diseñada antes de que las promesas se convirtieran en parte del lenguaje. Podrías envolverlo en una promesa de la siguiente manera:

```
function readFileText(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.addEventListener(
      "load", () => resolve(reader.result));
    reader.addEventListener(
      "error", () => reject(reader.error));
    reader.readAsText(file);
  });
}
```

## Almacenando datos del lado del cliente

{{index "aplicación web"}}

Páginas simples de ((HTML)) con un poco de JavaScript pueden ser un gran formato para "((mini aplicaciones))" - pequeños programas auxiliares que automatizan tareas básicas. Conectando unos cuantos campos de formulario con controladores de eventos, puedes hacer desde convertir entre centímetros y pulgadas hasta calcular contraseñas a partir de una contraseña maestra y un nombre de sitio web.

{{index persistencia, [vinculación, "como estado"], [navegador, almacenamiento]}}

Cuando una aplicación así necesita recordar algo entre sesiones, no puedes usar las vinculaciones de JavaScript, ya que estas se descartan cada vez que se cierra la página. Podrías configurar un servidor, conectarlo a Internet y hacer que tu aplicación almacene algo allí. Veremos cómo hacerlo en el [Capítulo ?](node). Pero eso implica mucho trabajo extra y complejidad. A veces es suficiente con mantener los datos en el ((navegador)).

{{index "objeto localStorage", "método setItem", "método getItem", "método removeItem"}}

El objeto `localStorage` se puede utilizar para almacenar datos de una manera que sobreviva a las recargas de página. Este objeto te permite guardar valores de cadena bajo nombres.

```
localStorage.setItem("nombre de usuario", "marijn");
console.log(localStorage.getItem("nombre de usuario"));
// → marijn
localStorage.removeItem("nombre de usuario");
```

{{index "objeto localStorage"}}

Un valor en `localStorage` permanece hasta que se sobrescribe, se elimina con `removeItem` o el usuario elimina sus datos locales.

{{index seguridad}}

Los sitios de diferentes ((dominios)) obtienen compartimentos de almacenamiento diferentes. Eso significa que los datos almacenados en `localStorage` por un sitio web dado, en principio, solo pueden ser leídos (y sobrescritos) por scripts en ese mismo sitio.

{{index "objeto localStorage"}}

Los navegadores aplican un límite en el tamaño de los datos que un sitio puede almacenar en `localStorage`. Esta restricción, junto con el hecho de que llenar los ((discos duros)) de la gente con basura no es realmente rentable, evita que la función ocupe demasiado espacio.

{{index "objeto localStorage", "ejemplo de toma de notas", "etiqueta select (HTML)", "etiqueta botón (HTML)", "etiqueta textarea (HTML)"}}El siguiente código implementa una aplicación rudimentaria de toma de notas. Mantiene un conjunto de notas con nombres y permite al usuario editar notas y crear nuevas.

```{lang: html, startCode: true}
Notas: <select></select> <button>Añadir</button><br>
<textarea style="width: 100%"></textarea>

<script>
  let list = document.querySelector("select");
  let note = document.querySelector("textarea");

  let state;
  function setState(nuevoEstado) {
    list.textContent = "";
    for (let nombre of Object.keys(nuevoEstado.notes)) {
      let option = document.createElement("option");
      option.textContent = nombre;
      if (nuevoEstado.selected == nombre) option.selected = true;
      list.appendChild(option);
    }
    note.value = nuevoEstado.notes[nuevoEstado.selected];

    localStorage.setItem("Notas", JSON.stringify(nuevoEstado));
    state = nuevoEstado;
  }
  setState(JSON.parse(localStorage.getItem("Notas")) ?? {
    notes: {"lista de compras": "Zanahorias\nPasas"},
    selected: "lista de compras"
  });

  list.addEventListener("change", () => {
    setState({notes: state.notes, selected: list.value});
  });
  note.addEventListener("change", () => {
    let {selected} = state;
    setState({
      notes: {...state.notes, [selected]: note.value},
      selected
    });
  });
  document.querySelector("button")
    .addEventListener("click", () => {
      let nombre = prompt("Nombre de la nota");
      if (nombre) setState({
        notes: {...state.notes, [nombre]: ""},
        selected: nombre
      });
    });
</script>
```

{{index "método getItem", JSON, "operador ??", "valor predeterminado"}}

El script obtiene su estado inicial del valor `"Notas"` almacenado en `localStorage` o, si está ausente, crea un estado de ejemplo que solo contiene una lista de compras. Leer un campo que no existe en `localStorage` devolverá `null`. Pasar `null` a `JSON.parse` hará que analice la cadena `"null"` y devuelva `null`. Por tanto, en una situación como esta se puede utilizar el operador `??` para proporcionar un valor predeterminado.

El método `setState` se asegura de que el DOM muestre un estado dado y almacena el nuevo estado en `localStorage`. Los controladores de eventos llaman a esta función para moverse a un nuevo estado.

{{index [objeto, "creación"], propiedad, "propiedad computada"}}

La sintaxis `...` en el ejemplo se utiliza para crear un nuevo objeto que es un clon del antiguo `state.notes`, pero con una propiedad añadida o sobrescrita. Utiliza la sintaxis ((spread)) para primero añadir las propiedades del objeto antiguo y luego establecer una nueva propiedad. La notación de ((corchetes cuadrados)) en el literal del objeto se utiliza para crear una propiedad cuyo nombre se basa en algún valor dinámico.

{{index "objeto sessionStorage", [navegador, almacenamiento]}}

Existe otro objeto, similar a `localStorage`, llamado `sessionStorage`. La diferencia entre los dos es que el contenido de `sessionStorage` se olvida al final de cada _((sesión))_, lo que en la mayoría de los navegadores significa cada vez que se cierra el navegador.

## Resumen

En este capítulo, discutimos cómo funciona el protocolo HTTP. Un _cliente_ envía una solicitud, que contiene un método (generalmente `GET`) y una ruta que identifica un recurso. El _servidor_ luego decide qué hacer con la solicitud y responde con un código de estado y un cuerpo de respuesta. Tanto las solicitudes como las respuestas pueden contener encabezados que proporcionan información adicional.La interfaz a través de la cual JavaScript del navegador puede realizar solicitudes HTTP se llama `fetch`. Realizar una solicitud se ve así:

```js
fetch("/18_http.html").then(r => r.text()).then(text => {
  console.log(`La página comienza con ${text.slice(0, 15)}`);
});
```

Los navegadores hacen solicitudes `GET` para obtener los recursos necesarios para mostrar una página web. Una página también puede contener formularios, que permiten enviar información ingresada por el usuario como una solicitud de una nueva página cuando se envía el formulario.

HTML puede representar varios tipos de campos de formulario, como campos de texto, casillas de verificación, campos de selección múltiple y selectores de archivos.

Estos campos pueden ser inspeccionados y manipulados con JavaScript. Disparan el evento `"change"` al cambiar, disparan el evento `"input"` al escribir texto y reciben eventos del teclado cuando tienen el foco del teclado. Propiedades como `value` (para campos de texto y select) o `checked` (para casillas de verificación y botones de radio) se utilizan para leer o establecer el contenido del campo.

Cuando un formulario se envía, se dispara un evento `"submit"` en él. Un controlador de JavaScript puede llamar a `preventDefault` en ese evento para deshabilitar el comportamiento predeterminado del navegador. Los elementos de campo de formulario también pueden ocurrir fuera de una etiqueta de formulario.

Cuando el usuario ha seleccionado un archivo de su sistema de archivos local en un campo de selección de archivos, la interfaz `FileReader` se puede utilizar para acceder al contenido de este archivo desde un programa JavaScript.

Los objetos `localStorage` y `sessionStorage` se pueden usar para guardar información de una manera que sobrevive a las recargas de la página. El primer objeto guarda los datos para siempre (o hasta que el usuario decida borrarlos) y el segundo los guarda hasta que se cierra el navegador.

## Ejercicios

### Negociación de contenido

{{index "Encabezado Accept", "tipo de medios", "formato de documento", "negociación de contenido (ejercicio)"}}

Una de las cosas que HTTP puede hacer es la _negociación de contenido_. El encabezado de solicitud `Accept` se utiliza para indicar al servidor qué tipo de documento le gustaría obtener al cliente. Muchos servidores ignoran este encabezado, pero cuando un servidor conoce diversas formas de codificar un recurso, puede mirar este encabezado y enviar la que el cliente prefiera.

{{index "tipo MIME"}}

La URL [_https://eloquentjavascript.net/author_](https://eloquentjavascript.net/author) está configurada para responder ya sea con texto sin formato, HTML o JSON, dependiendo de lo que pida el cliente. Estos formatos están identificados por los _((tipos de medios))_ estandarizados `text/plain`, `text/html` y `application/json`.

{{index "propiedad headers", "función fetch"}}

Envía solicitudes para obtener los tres formatos de este recurso. Utiliza la propiedad `headers` en el objeto de opciones pasado a `fetch` para establecer el encabezado llamado `Accept` en el tipo de medios deseado.

Finalmente, intenta pedir el tipo de medios `application/rainbows+unicorns` y mira qué código de estado produce.

{{if interactive

```{test: no}
// Tu código aquí.
```

if}}

{{hint

{{index "negociación de contenido (ejercicio)"}}

Basate en los ejemplos de `fetch` [anteriores en el capítulo](http#fetch).

{{index "406 (código de estado HTTP)", "encabezado Accept"}}

Al solicitar un tipo de medio falso devolverá una respuesta con el código 406, "No aceptable", que es el código que un servidor debería devolver cuando no puede cumplir con el encabezado `Accept`.

hint}}

### Un banco de trabajo de JavaScript

{{index "Consola de JavaScript", "banco de trabajo (ejercicio)"}}

Construye una interfaz que permita a las personas escribir y ejecutar fragmentos de código JavaScript.

{{index "textarea (etiqueta HTML)", "button (etiqueta HTML)", "Constructor de Function", "mensaje de error"}}

Coloca un botón al lado de un campo `<textarea>` que, al ser presionado, utilice el constructor `Function` que vimos en [Capítulo ?](modules#eval) para envolver el texto en una función y llamarla. Convierte el valor de retorno de la función, o cualquier error que genere, a una cadena y muéstralo debajo del campo de texto.

{{if interactive

```{lang: html, test: no}
<textarea id="code">return "hi";</textarea>
<button id="button">Run</button>
<pre id="output"></pre>

<script>
  // Tu código aquí.
</script>
```

if}}

{{hint

{{index "evento click", "evento mousedown", "Constructor de Function", "banco de trabajo (ejercicio)"}}

Utiliza `document.querySelector` o `document.getElementById` para acceder a los elementos definidos en tu HTML. Un manejador de eventos para eventos `"click"` o `"mousedown"` en el botón puede obtener la propiedad `value` del campo de texto y llamar a `Function` en él.

{{index "palabra clave try", "manejo de excepciones"}}

Asegúrate de envolver tanto la llamada a `Function` como la llamada a su resultado en un bloque `try` para poder capturar las excepciones que produce. En este caso, realmente no sabemos qué tipo de excepción estamos buscando, así que captura todo.

{{index "propiedad textContent", output, texto, "método createTextNode", "carácter de nueva línea"}}

La propiedad `textContent` del elemento de salida se puede utilizar para llenarlo con un mensaje de cadena. O, si deseas mantener el contenido anterior, crea un nuevo nodo de texto utilizando `document.createTextNode` y apéndelo al elemento. Recuerda agregar un carácter de nueva línea al final para que no aparezca toda la salida en una sola línea.

hint}}

### Juego de la vida de Conway

{{index "juego de la vida (ejercicio)", "vida artificial", "Juego de la vida de Conway"}}

El Juego de la vida de Conway es una ((simulación)) simple que crea "vida" artificial en una ((rejilla)), donde cada celda puede estar viva o no. En cada ((generación)) (turno), se aplican las siguientes reglas:

* Cualquier celda viva con menos de dos o más de tres vecinos vivos muere.

* Cualquier celda viva con dos o tres vecinos vivos sigue viva en la siguiente generación.

* Cualquier celda muerta con exactamente tres vecinos vivos se convierte en una celda viva.

Un _vecino_ se define como cualquier celda adyacente, incluidas las células adyacentes en diagonal.

{{index "función pura"}}

Ten en cuenta que estas reglas se aplican a toda la rejilla de una vez, no cuadrado por cuadrado. Eso significa que el recuento de vecinos se basa en la situación al comienzo de la generación, y los cambios que ocurran en las células vecinas durante esta generación no deberían influir en el nuevo estado de una celda dada.

{{index "función Math.random"}}

Implementa este juego utilizando la estructura de ((datos)) que consideres apropiada. Utiliza `Math.random` para poblar la rejilla con un patrón aleatorio inicialmente. Muestra la rejilla como una cuadrícula de ((campo de verificación)) ((campo))s, con un ((botón)) al lado para avanzar a la siguiente ((generación)). Cuando el usuario marque o desmarque los campos de verificación, sus cambios deberían incluirse al calcular la siguiente generación.

{{if interactive

```{lang: html, test: no}
<div id="grid"></div>
<button id="next">Siguiente generación</button>

<script>
  // Tu código aquí.
</script>
```

if}}

{{hint

{{index "juego de la vida (ejercicio)"}}

Para resolver el problema de que los cambios ocurran conceptualmente al mismo tiempo, intenta ver la computación de una ((generación)) como una ((función pura)), la cual toma un ((grid)) y produce un nuevo grid que representa el siguiente turno.

La representación de la matriz se puede hacer con un solo array de elementos de ancho × alto, almacenando valores fila por fila, por lo que, por ejemplo, el tercer elemento en la quinta fila se almacena en la posición 4 × _ancho_ + 2 (usando indexación basada en cero). Puedes contar los ((vecinos)) vivos con dos bucles anidados, recorriendo coordenadas adyacentes en ambas dimensiones. Asegúrate de no contar celdas fuera del campo e ignorar la celda en el centro, cuyos vecinos estamos contando.

{{index "manejo de eventos", "evento de cambio"}}

Asegurarse de que los cambios en los ((checkbox)) tengan efecto en la siguiente generación se puede hacer de dos maneras. Un manejador de eventos podría notar estos cambios y actualizar el grid actual para reflejarlos, o podrías generar un grid nuevo a partir de los valores de los checkboxes antes de calcular el siguiente turno.

Si decides utilizar manejadores de eventos, es posible que desees adjuntar ((atributo))s que identifiquen la posición a la que corresponde cada checkbox para que sea fácil saber qué celda cambiar.

{{index dibujo, "tabla (etiqueta HTML)", "br (etiqueta HTML)"}}

Para dibujar el grid de checkboxes, puedes usar un elemento `<table>` (ver [Capítulo ?](dom#ejercicio_table)) o simplemente colocar todos en el mismo elemento y poner elementos `<br>` (salto de línea) entre las filas.

hint}}