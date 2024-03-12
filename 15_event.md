# Manejo de Eventos

{{quote {author: "Marco Aurelio", title: Meditaciones, chapter: true}

Tienes poder sobre tu mente, no sobre los eventos externos. Date cuenta de esto y encontrarás fuerza.

quote}}

{{index estoicismo, "Marco Aurelio", input, cronología}}

{{figure {url: "img/chapter_picture_15.jpg", alt: "Ilustración que muestra una máquina de Rube Goldberg que involucra una pelota, una balanza, un par de tijeras y un martillo, los cuales se afectan en una reacción en cadena que enciende una bombilla.", chapter: "framed"}}}

Algunos programas trabajan con la entrada directa del usuario, como acciones del ratón y del teclado. Ese tipo de entrada no está disponible de antemano, como una estructura de datos bien organizada, llega pieza por pieza, en tiempo real, y el programa debe responder a medida que sucede.

## Controladores de Eventos

{{index sondeo, "botón", "tiempo real"}}

Imagina una interfaz donde la única forma de saber si una tecla en el ((teclado)) está siendo presionada es leyendo el estado actual de esa tecla. Para poder reaccionar a las pulsaciones de teclas, tendrías que leer constantemente el estado de la tecla para capturarla antes de que se libere nuevamente. Sería peligroso realizar otras computaciones intensivas en tiempo, ya que podrías perder una pulsación de tecla.

Algunas máquinas primitivas manejan la entrada de esa manera. Un paso adelante sería que el hardware o el sistema operativo noten la pulsación de tecla y la pongan en una cola. Un programa puede luego verificar periódicamente la cola en busca de nuevos eventos y reaccionar a lo que encuentre allí.

{{index capacidad de respuesta, "experiencia de usuario"}}

Por supuesto, tiene que recordar mirar la cola y hacerlo a menudo, porque cualquier tiempo transcurrido entre la presión de la tecla y la notificación del evento por parte del programa hará que el software se sienta sin respuesta. Este enfoque se llama _((sondeo))_. La mayoría de los programadores prefieren evitarlo.

{{index "función de devolución de llamada", "manejo de eventos"}}

Un mecanismo mejor es que el sistema notifique activamente a nuestro código cuando ocurre un evento. Los navegadores hacen esto al permitirnos registrar funciones como _manejadores_ para eventos específicos.

```{lang: html}
<p>Haz clic en este documento para activar el manejador.</p>
<script>
  window.addEventListener("click", () => {
    console.log("¿Llamaste?");
  });
</script>
```

{{index "evento de clic", "método addEventListener", "objeto window", [navegador, ventana]}}

La asignación `window` se refiere a un objeto integrado proporcionado por el navegador. Representa la ventana del navegador que contiene el documento. Llamar a su método `addEventListener` registra el segundo argumento para que se llame cada vez que ocurra el evento descrito por su primer argumento.

## Eventos y nodos DOM

{{index "método addEventListener", "manejo de eventos", "objeto window", navegador, [DOM, eventos]}}

Cada controlador de eventos del navegador se registra en un contexto. En el ejemplo anterior llamamos a `addEventListener` en el objeto `window` para registrar un controlador para toda la ventana. Un método similar también se encuentra en elementos del DOM y algunos otros tipos de objetos. Los escuchas de eventos solo se llaman cuando el evento ocurre en el contexto del objeto en el que están registrados.

```{lang: html}
<button>Haz clic</button>
<p>No hay manejador aquí.</p>
<script>
  let button = document.querySelector("button");
  button.addEventListener("click", () => {
    console.log("Botón clickeado.");
  });
</script>
```

{{index "evento de clic", "botón (etiqueta HTML)"}}

Ese ejemplo adjunta un manejador al nodo del botón. Los clics en el botón hacen que se ejecute ese manejador, pero los clics en el resto del documento no lo hacen.

{{index "atributo onclick", encapsulamiento}}

Darle a un nodo un atributo `onclick` tiene un efecto similar. Esto funciona para la mayoría de tipos de eventos: puedes adjuntar un manejador a través del atributo cuyo nombre es el nombre del evento con `on` al inicio.

Pero un nodo solo puede tener un atributo `onclick`, por lo que solo puedes registrar un manejador por nodo de esa manera. El método `addEventListener` te permite agregar cualquier cantidad de manejadores, por lo que es seguro agregar manejadores incluso si ya hay otro manejador en el elemento.

{{index "método removeEventListener"}}

El método `removeEventListener`, llamado con argumentos similares a `addEventListener`, remueve un manejador.

```{lang: html}
<button>Botón de acción única</button>
<script>
  let button = document.querySelector("button");
  function unaVez() {
    console.log("¡Hecho!");
    button.removeEventListener("click", unaVez);
  }
  button.addEventListener("click", unaVez);
</script>
```

{{index ["función", "como valor"]}}

La función proporcionada a `removeEventListener` debe ser el mismo valor de función que se proporcionó a `addEventListener`. Por lo tanto, para anular el registro de un manejador, querrás darle un nombre a la función (`unaVez`, en el ejemplo) para poder pasar el mismo valor de función a ambos métodos.

## Objetos de eventos

{{index "propiedad de botón", "manejo de eventos"}}

Aunque lo hemos ignorado hasta ahora, las funciones de manejadores de eventos reciben un argumento: el _((objeto de evento))_. Este objeto contiene información adicional sobre el evento. Por ejemplo, si queremos saber _cuál_ ((botón del mouse)) se presionó, podemos mirar la propiedad `button` del objeto de evento.

```{lang: html}
<button>Haz clic como quieras</button>
<script>
  let button = document.querySelector("button");
  button.addEventListener("mousedown", event => {
    if (event.button == 0) {
      console.log("Botón izquierdo");
    } else if (event.button == 1) {
      console.log("Botón del medio");
    } else if (event.button == 2) {
      console.log("Botón derecho");
    }
  });
</script>
```

{{index "tipo de evento", "propiedad type"}}

La información almacenada en un objeto de evento difiere según el tipo de evento. Discutiremos diferentes tipos más adelante en el capítulo. La propiedad `type` del objeto siempre contiene una cadena que identifica el evento (como `"click"` o `"mousedown"`).

## Propagación

{{index "propagación de evento", "nodo padre"}}

{{indexsee burbujeo, "propagación de evento"}}

{{indexsee "propagación", "propagación de evento"}}

Para la mayoría de tipos de evento, los manejadores registrados en nodos con hijos también recibirán eventos que ocurran en los hijos. Si se hace clic en un botón dentro de un párrafo, los manejadores de eventos en el párrafo también verán el evento de clic.

{{index "manejo de eventos"}}

Pero si tanto el párrafo como el botón tienen un controlador, el controlador más específico —el del botón— tiene prioridad para ejecutarse primero. Se dice que el evento *se propaga* hacia afuera, desde el nodo donde ocurrió hacia el nodo padre de ese nodo y hasta la raíz del documento. Finalmente, después de que todos los controladores registrados en un nodo específico hayan tenido su turno, los controladores registrados en toda la ((ventana)) tienen la oportunidad de responder al evento.

{{index "método stopPropagation", "evento click"}}

En cualquier momento, un controlador de eventos puede llamar al método `stopPropagation` en el objeto de evento para evitar que los controladores superiores reciban el evento. Esto puede ser útil cuando, por ejemplo, tienes un botón dentro de otro elemento clickeable y no quieres que los clics en el botón activen el comportamiento de click del elemento externo.

{{index "evento mousedown", "evento de puntero"}}

El siguiente ejemplo registra controladores de `"mousedown"` tanto en un botón como en el párrafo que lo rodea. Cuando se hace clic con el botón derecho del ratón, el controlador del botón llama a `stopPropagation`, lo que evitará que se ejecute el controlador en el párrafo. Cuando el botón se hace clic con otro ((botón del ratón)), ambos controladores se ejecutarán.

```{lang: html}
<p>Un párrafo con un <button>botón</button>.</p>
<script>
  let para = document.querySelector("p");
  let button = document.querySelector("button");
  para.addEventListener("mousedown", () => {
    console.log("Controlador para el párrafo.");
  });
  button.addEventListener("mousedown", event => {
    console.log("Controlador para el botón.");
    if (event.button == 2) event.stopPropagation();
  });
</script>
```

{{index "propagación de eventos", "propiedad target"}}

La mayoría de los objetos de eventos tienen una propiedad `target` que se refiere al nodo donde se originaron. Puedes usar esta propiedad para asegurarte de que no estás manejando accidentalmente algo que se propagó desde un nodo que no deseas manejar.

También es posible usar la propiedad `target` para abarcar un amplio rango para un tipo específico de evento. Por ejemplo, si tienes un nodo que contiene una larga lista de botones, puede ser más conveniente registrar un único controlador de clic en el nodo externo y hacer que utilice la propiedad `target` para averiguar si se hizo clic en un botón, en lugar de registrar controladores individuales en todos los botones.

```{lang: html}
<button>A</button>
<button>B</button>
<button>C</button>
<script>
  document.body.addEventListener("click", event => {
    if (event.target.nodeName == "BUTTON") {
      console.log("Clic en", event.target.textContent);
    }
  });
</script>
```

## Acciones predeterminadas

{{index scrolling, "comportamiento predeterminado", "manejo de eventos"}}

Muchos eventos tienen una acción predeterminada asociada a ellos. Si haces clic en un ((enlace)), serás llevado al destino del enlace. Si presionas la flecha hacia abajo, el navegador desplazará la página hacia abajo. Si haces clic derecho, obtendrás un menú contextual. Y así sucesivamente.

{{index "método preventDefault"}}

Para la mayoría de los tipos de eventos, los controladores de eventos de JavaScript se ejecutan _antes_ de que ocurra el comportamiento predeterminado. Si el controlador no desea que este comportamiento normal ocurra, típicamente porque ya se encargó de manejar el evento, puede llamar al método `preventDefault` en el objeto de evento.

{{index expectativas}}

Esto se puede utilizar para implementar tus propios atajos de teclado o menús contextuales. También se puede usar para interferir de manera molesta con el comportamiento que los usuarios esperan. Por ejemplo, aquí hay un enlace que no se puede seguir:

```{lang: html}
<a href="https://developer.mozilla.org/">MDN</a>
<script>
  let link = document.querySelector("a");
  link.addEventListener("click", event => {
    console.log("¡Incorrecto!");
    event.preventDefault();
  });
</script>
```

{{index usabilidad}}

Trata de no hacer este tipo de cosas a menos que tengas una razón realmente válida. Será desagradable para las personas que utilicen tu página cuando se rompa el comportamiento esperado.

Dependiendo del navegador, algunos eventos no se pueden interceptar en absoluto. En Chrome, por ejemplo, el atajo de teclado para cerrar la pestaña actual (control-W o command-W) no se puede manejar con JavaScript.

## Eventos de teclado

{{index teclado, "evento keydown", "evento keyup", "manejo de eventos"}}

Cuando se presiona una tecla en el teclado, tu navegador dispara un evento `"keydown"`. Cuando se suelta, obtienes un evento `"keyup"`.

```{lang: html, focus: true}
<p>Esta página se vuelve violeta cuando mantienes presionada la tecla V.</p>
<script>
  window.addEventListener("keydown", event => {
    if (event.key == "v") {
      document.body.style.background = "violet";
    }
  });
  window.addEventListener("keyup", event => {
    if (event.key == "v") {
      document.body.style.background = "";
    }
  });
</script>
```

{{index "tecla repetitiva"}}

A pesar de su nombre, `"keydown"` se dispara no solo cuando la tecla se presiona físicamente hacia abajo. Cuando se presiona y se mantiene una tecla, el evento se vuelve a disparar cada vez que la tecla _se repite_. A veces tienes que tener cuidado con esto. Por ejemplo, si agregas un botón al DOM cuando se presiona una tecla y lo eliminas de nuevo cuando se suelta la tecla, podrías agregar accidentalmente cientos de botones cuando se mantiene presionada la tecla durante más tiempo.

{{index "propiedad key"}}

El ejemplo observó la propiedad `key` del objeto evento para ver sobre qué tecla es el evento. Esta propiedad contiene una cadena que, para la mayoría de las teclas, corresponde a lo que escribirías al presionar esa tecla. Para teclas especiales como [enter]{keyname}, contiene una cadena que nombra la tecla (`"Enter"`, en este caso). Si mantienes presionado [shift]{keyname} mientras presionas una tecla, eso también puede influir en el nombre de la tecla: `"v"` se convierte en `"V"`, y `"1"` puede convertirse en `"!"`, si eso es lo que produce al presionar [shift]{keyname}-1 en tu teclado.

{{index "tecla modificadora", "tecla shift", "tecla control", "tecla alt", "tecla meta", "tecla command", "propiedad ctrlKey", "propiedad shiftKey", "propiedad altKey", "propiedad metaKey"}}

Las teclas modificadoras como [shift]{keyname}, [control]{keyname}, [alt]{keyname} y [meta]{keyname} (command en Mac) generan eventos de tecla igual que las teclas normales. Pero al buscar combinaciones de teclas, también puedes averiguar si estas teclas se mantienen presionadas mirando las propiedades `shiftKey`, `ctrlKey`, `altKey` y `metaKey` de los eventos de teclado y ratón.

```{lang: html, focus: true}
<p>Pulsa Control-Espacio para continuar.</p>
<script>
  window.addEventListener("keydown", event => {
    if (event.key == " " && event.ctrlKey) {
      console.log("¡Continuando!");
    }
  });
</script>
```

{{index "button (etiqueta HTML)", "atributo tabindex", [DOM, eventos]}}

El nodo del DOM donde se origina un evento de teclado depende del elemento que tiene ((foco)) cuando se presiona la tecla. La mayoría de los nodos no pueden tener foco a menos que les des un atributo `tabindex`, pero cosas como los ((enlace))s, botones y campos de formulario pueden. Volveremos a los campos de formulario en [Capítulo ?](http#forms). Cuando nada en particular tiene foco, `document.body` actúa como el nodo objetivo de los eventos de teclado.

Cuando el usuario está escribiendo texto, utilizar eventos de teclado para averiguar qué se está escribiendo es problemático. Algunas plataformas, especialmente el ((teclado virtual)) en teléfonos ((Android)), no disparan eventos de teclado. Pero incluso cuando se tiene un teclado tradicional, algunos tipos de entrada de texto no coinciden con las pulsaciones de teclas de manera directa, como el software de _editor de método de entrada_ (((IME))) utilizado por personas cuyos guiones no caben en un teclado, donde múltiples pulsaciones de teclas se combinan para crear caracteres.

Para detectar cuando se ha escrito algo, los elementos en los que se puede escribir, como las etiquetas `<input>` y `<textarea>`, activan eventos `"input"` cada vez que el usuario cambia su contenido. Para obtener el contenido real que se ha escrito, lo mejor es leerlo directamente del campo enfocado. [Capítulo ?](http#forms) mostrará cómo hacerlo.

## Eventos de puntero

Actualmente existen dos formas ampliamente utilizadas de señalar cosas en una pantalla: los ratones (incluyendo dispositivos que actúan como ratones, como touchpads y trackballs) y las pantallas táctiles. Estas producen diferentes tipos de eventos.

### Clics de ratón

{{index "evento mousedown", "evento mouseup", "cursor de ratón"}}

Presionar un ((botón de ratón)) provoca que se disparen varios eventos. Los eventos `"mousedown"` y `"mouseup"` son similares a `"keydown"` y `"keyup"` y se activan cuando se presiona y se suelta el botón. Estos eventos ocurren en los nodos del DOM que están inmediatamente debajo del puntero del ratón cuando se produce el evento.

{{index "evento click"}}

Después del evento `"mouseup"`, se dispara un evento `"click"` en el nodo más específico que contenía tanto la pulsación como la liberación del botón. Por ejemplo, si presiono el botón del ratón en un párrafo y luego muevo el puntero a otro párrafo y suelto el botón, el evento `"click"` ocurrirá en el elemento que contiene ambos párrafos.

{{index "evento dblclick", "doble clic"}}

Si dos clics ocurren cerca uno del otro, también se dispara un evento `"dblclick"` (doble clic), después del segundo evento de clic.

{{index "píxel", "propiedad clientX", "propiedad clientY", "propiedad pageX", "propiedad pageY", "objeto evento"}}

Para obtener información precisa sobre el lugar donde ocurrió un evento de ratón, puedes mirar sus propiedades `clientX` y `clientY`, que contienen las ((coordenadas)) del evento (en píxeles) relativas a la esquina superior izquierda de la ventana, o `pageX` y `pageY`, que son relativas a la esquina superior izquierda de todo el documento (lo cual puede ser diferente cuando la ventana ha sido desplazada).

{{index "border-radius (CSS)", "posicionamiento absoluto", "ejemplo de programa de dibujo"}}

{{id mouse_drawing}}El siguiente programa implementa una aplicación de dibujo primitiva. Cada vez que haces clic en el documento, agrega un punto bajo el puntero de tu ratón. Ver [Capítulo ?](paint) para una aplicación de dibujo menos primitiva.

```{lang: html}
<style>
  body {
    height: 200px;
    background: beige;
  }
  .dot {
    height: 8px; width: 8px;
    border-radius: 4px; /* redondea las esquinas */
    background: teal;
    position: absolute;
  }
</style>
<script>
  window.addEventListener("click", event => {
    let dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = (event.pageX - 4) + "px";
    dot.style.top = (event.pageY - 4) + "px";
    document.body.appendChild(dot);
  });
</script>
```

### Movimiento del ratón

{{index "mousemove event"}}

Cada vez que el puntero del ratón se mueve, se dispara un evento `"mousemove"`. Este evento se puede usar para rastrear la posición del ratón. Una situación común en la que esto es útil es al implementar algún tipo de funcionalidad de arrastrar y soltar con el ratón.

{{index "draggable bar example"}}

Como ejemplo, el siguiente programa muestra una barra y configura controladores de eventos para que al arrastrar hacia la izquierda o hacia la derecha en esta barra, se haga más estrecha o más ancha:

```{lang: html, startCode: true}
<p>Arrastra la barra para cambiar su anchura:</p>
<div style="background: orange; width: 60px; height: 20px">
</div>
<script>
  let lastX; // Rastrea la última posición X del ratón observada
  let bar = document.querySelector("div");
  bar.addEventListener("mousedown", event => {
    if (event.button == 0) {
      lastX = event.clientX;
      window.addEventListener("mousemove", moved);
      event.preventDefault(); // Prevenir selección
    }
  });

  function moved(event) {
    if (event.buttons == 0) {
      window.removeEventListener("mousemove", moved);
    } else {
      let dist = event.clientX - lastX;
      let newWidth = Math.max(10, bar.offsetWidth + dist);
      bar.style.width = newWidth + "px";
      lastX = event.clientX;
    }
  }
</script>
```

{{if book

La página resultante se ve así:

{{figure {url: "img/drag-bar.png", alt: "Imagen de una barra arrastrable", width: "5.3cm"}}}

if}}

{{index "mouseup event", "mousemove event"}}

Ten en cuenta que el controlador `"mousemove"` está registrado en toda la ((window)). Incluso si el ratón sale de la barra durante el cambio de tamaño, mientras el botón se mantenga presionado todavía queremos actualizar su tamaño.

{{index "buttons property", "button property", "bitfield"}}

Debemos detener el cambio de tamaño de la barra cuando se libere el botón del ratón. Para eso, podemos usar la propiedad `buttons` (notar el plural), que nos indica qué botones están actualmente presionados. Cuando este valor es cero, ningún botón está presionado. Cuando se mantienen presionados botones, su valor es la suma de los códigos de esos botones—el botón izquierdo tiene el código 1, el derecho 2 y el central 4. Con el botón izquierdo y el derecho presionados, por ejemplo, el valor de `buttons` será 3.

Es importante destacar que el orden de estos códigos es diferente al utilizado por `button`, donde el botón central venía antes que el derecho. Como se mencionó, la consistencia no es realmente un punto fuerte de la interfaz de programación del navegador.

### Eventos táctiles

{{index touch, "evento mousedown", "evento mouseup", "evento click"}}

El estilo de navegador gráfico que usamos fue diseñado pensando en interfaces de ratón, en una época donde las pantallas táctiles eran raras. Para hacer que la web "funcione" en los primeros teléfonos con pantalla táctil, los navegadores de esos dispositivos fingían, hasta cierto punto, que los eventos táctiles eran eventos de ratón. Si tocas la pantalla, recibirás eventos de `"mousedown"`, `"mouseup"` y `"click"`.

Pero esta ilusión no es muy robusta. Una pantalla táctil funciona de manera diferente a un ratón: no tiene múltiples botones, no se puede rastrear el dedo cuando no está en la pantalla (para simular `"mousemove"`), y permite que varios dedos estén en la pantalla al mismo tiempo.

Los eventos de ratón solo cubren la interacción táctil en casos sencillos: si agregas un controlador de `"click"` a un botón, los usuarios táctiles aún podrán usarlo. Pero algo como la barra redimensionable del ejemplo anterior no funciona en una pantalla táctil.

{{index "evento touchstart", "evento touchmove", "evento touchend"}}

Existen tipos específicos de eventos disparados por la interacción táctil. Cuando un dedo comienza a tocar la pantalla, se genera un evento `"touchstart"`. Cuando se mueve mientras toca, se generan eventos `"touchmove"`. Finalmente, cuando deja de tocar la pantalla, verás un evento `"touchend"`.

{{index "propiedad touches", "propiedad clientX", "propiedad clientY", "propiedad pageX", "propiedad pageY"}}

Debido a que muchas pantallas táctiles pueden detectar varios dedos al mismo tiempo, estos eventos no tienen un único conjunto de coordenadas asociadas. Más bien, sus ((objetos de eventos)) tienen una propiedad `touches`, que contiene un ((objeto similar a un array)) de puntos, cada uno con sus propias propiedades `clientX`, `clientY`, `pageX` y `pageY`.

Podrías hacer algo como esto para mostrar círculos rojos alrededor de cada dedo que toca:

```{lang: html}
<style>
  dot { position: absolute; display: block;
        border: 2px solid red; border-radius: 50px;
        height: 100px; width: 100px; }
</style>
<p>Toca esta página</p>
<script>
  function update(event) {
    for (let dot; dot = document.querySelector("dot");) {
      dot.remove();
    }
    for (let i = 0; i < event.touches.length; i++) {
      let {pageX, pageY} = event.touches[i];
      let dot = document.createElement("dot");
      dot.style.left = (pageX - 50) + "px";
      dot.style.top = (pageY - 50) + "px";
      document.body.appendChild(dot);
    }
  }
  window.addEventListener("touchstart", update);
  window.addEventListener("touchmove", update);
  window.addEventListener("touchend", update);
</script>
```

{{index "método preventDefault"}}

A menudo querrás llamar a `preventDefault` en los controladores de eventos táctiles para anular el comportamiento predeterminado del navegador (que puede incluir desplazar la página al deslizar) y evitar que se generen eventos de ratón, para los cuales también puedes tener un controlador.

## Eventos de desplazamiento

{{index scrolling, "evento scroll", "manejo de eventos"}}

Cada vez que un elemento se desplaza, se dispara un evento `"scroll"`. Esto tiene varios usos, como saber qué está viendo actualmente el usuario (para desactivar animaciones fuera de la pantalla o enviar informes de vigilancia a tu malvada sede) o mostrar alguna indicación de progreso (resaltando parte de una tabla de contenidos o mostrando un número de página).El siguiente ejemplo dibuja una barra de progreso sobre el documento y la actualiza para llenarla a medida que se desplaza hacia abajo:

```{lang: html}
<style>
  #progress {
    border-bottom: 2px solid blue;
    width: 0;
    position: fixed;
    top: 0; left: 0;
  }
</style>
<div id="progress"></div>
<script>
  // Create some content
  document.body.appendChild(document.createTextNode(
    "supercalifragilisticexpialidocious ".repeat(1000)));

  let bar = document.querySelector("#progress");
  window.addEventListener("scroll", () => {
    let max = document.body.scrollHeight - innerHeight;
    bar.style.width = `${(pageYOffset / max) * 100}%`;
  });
</script>
```

{{index "unit (CSS)", scrolling, "position (CSS)", "fixed positioning", "absolute positioning", percentage, "repeat method"}}

Darle a un elemento una `position` de `fixed` actúa de manera similar a una posición `absolute`, pero también evita que se desplace junto con el resto del documento. El efecto es hacer que nuestra barra de progreso permanezca en la parte superior. Su ancho se cambia para indicar el progreso actual. Usamos `%`, en lugar de `px`, como unidad al establecer el ancho para que el elemento tenga un tamaño relativo al ancho de la página.

{{index "innerHeight property", "innerWidth property", "pageYOffset property"}}

El enlace global `innerHeight` nos da la altura de la ventana, que debemos restar de la altura total desplazable, ya que no se puede seguir desplazando cuando se llega al final del documento. También existe un `innerWidth` para el ancho de la ventana. Al dividir `pageYOffset`, la posición actual de desplazamiento, por la posición máxima de desplazamiento y multiplicar por 100, obtenemos el porcentaje para la barra de progreso.

{{index "preventDefault method"}}

Llamar a `preventDefault` en un evento de desplazamiento no impide que ocurra el desplazamiento. De hecho, el controlador de eventos se llama solo _después_ de que ocurre el desplazamiento.

## Eventos de enfoque

{{index "event handling", "focus event", "blur event"}}

Cuando un elemento recibe el ((enfoque)), el navegador dispara un evento `"focus"` en él. Cuando pierde el enfoque, el elemento recibe un evento `"blur"`.

{{index "event propagation"}}

A diferencia de los eventos discutidos anteriormente, estos dos eventos no se propagan. Un controlador en un elemento padre no recibe notificaciones cuando un elemento hijo recibe o pierde el enfoque.

{{index "input (HTML tag)", "help text example"}}

El siguiente ejemplo muestra texto de ayuda para el ((campo de texto)) que actualmente tiene el foco:

```{lang: html}
<p>Nombre: <input type="text" data-help="Tu nombre completo"></p>
<p>Edad: <input type="text" data-help="Tu edad en años"></p>
<p id="help"></p>

<script>
  let help = document.querySelector("#help");
  let fields = document.querySelectorAll("input");
  for (let field of Array.from(fields)) {
    field.addEventListener("focus", event => {
      let text = event.target.getAttribute("data-help");
      help.textContent = text;
    });
    field.addEventListener("blur", event => {
      help.textContent = "";
    });
  }
</script>
```

{{if book

Esta captura de pantalla muestra el texto de ayuda para el campo de edad.

{{figure {url: "img/help-field.png", alt: "Captura de pantalla del texto de ayuda debajo del campo de edad", width: "4.4cm"}}}

{{index "evento de enfoque", "evento de desenfoque"}}

El objeto `((window))` recibirá eventos `"focus"` y `"blur"` cuando el usuario se mueva desde o hacia la pestaña o ventana del navegador en la que se muestra el documento.

if}}

## Evento de carga

{{index "script (etiqueta HTML)", "evento de carga"}}

Cuando una página termina de cargarse, se dispara el evento `"load"` en los objetos ventana y cuerpo del documento. Esto se usa a menudo para programar acciones de ((inicialización)) que requieren que todo el ((documento)) haya sido construido. Recuerda que el contenido de las etiquetas `<script>` se ejecuta inmediatamente cuando se encuentra la etiqueta. Esto puede ser demasiado pronto, por ejemplo, cuando el script necesita hacer algo con partes del documento que aparecen después de la etiqueta `<script>`.

{{index "propagación de eventos", "img (etiqueta HTML)"}}

Elementos como ((imágenes)) y etiquetas de script que cargan un archivo externo también tienen un evento `"load"` que indica que se cargaron los archivos a los que hacen referencia. Al igual que los eventos relacionados con el enfoque, los eventos de carga no se propagan.

{{index "evento beforeunload", "recarga de página", "método preventDefault"}}

Cuando se cierra una página o se navega lejos de ella (por ejemplo, al seguir un enlace), se dispara un evento `"beforeunload"`. El uso principal de este evento es evitar que el usuario pierda accidentalmente su trabajo al cerrar un documento. Si previenes el comportamiento predeterminado en este evento _y_ estableces la propiedad `returnValue` en el objeto de evento a una cadena, el navegador mostrará al usuario un cuadro de diálogo preguntando si realmente desea abandonar la página. Ese cuadro de diálogo podría incluir tu cadena, pero debido a que algunos sitios maliciosos intentan usar estos cuadros de diálogo para confundir a las personas y hacer que se queden en su página para ver anuncios de pérdida de peso dudosos, la mayoría de los navegadores ya no los muestran.

{{id timeline}}

## Eventos y el bucle de eventos

{{index "función requestAnimationFrame", "manejo de eventos", timeline, "script (etiqueta HTML)"}}

En el contexto del bucle de eventos, como se discutió en [Capítulo ?](async), los controladores de eventos del navegador se comportan como otras notificaciones asíncronas. Se programan cuando ocurre el evento pero deben esperar a que otros scripts que se estén ejecutando terminen antes de tener la oportunidad de ejecutarse.

El hecho de que los eventos solo se puedan procesar cuando no hay nada más en ejecución significa que, si el bucle de eventos está ocupado con otro trabajo, cualquier interacción con la página (que ocurre a través de eventos) se retrasará hasta que haya tiempo para procesarla. Entonces, si programas demasiado trabajo, ya sea con controladores de eventos de larga duración o con muchos que se ejecutan rápidamente, la página se volverá lenta y pesada de usar.

Para casos en los que _realmente_ quieres hacer algo que consume mucho tiempo en segundo plano sin congelar la página, los navegadores proporcionan algo llamado _((web worker))s_. Un worker es un proceso de JavaScript que se ejecuta junto al script principal, en su propia línea de tiempo.

Imagina que elevar al cuadrado un número es una computación pesada y de larga duración que queremos realizar en un ((hilo)) separado. Podríamos escribir un archivo llamado `code/squareworker.js` que responda a mensajes calculando un cuadrado y enviando un mensaje de vuelta.

```
addEventListener("message", event => {
  postMessage(event.data * event.data);
});
```

Para evitar los problemas de tener múltiples hilos tocando los mismos datos, los workers no comparten su alcance global ni ningún otro dato con el entorno del script principal. En cambio, debes comunicarte con ellos enviando mensajes de ida y vuelta.

Este código genera un worker que ejecuta ese script, le envía algunos mensajes y muestra las respuestas.

```{test: no}
let squareWorker = new Worker("code/squareworker.js");
squareWorker.addEventListener("message", event => {
  console.log("El worker respondió:", event.data);
});
squareWorker.postMessage(10);
squareWorker.postMessage(24);
```

{{index "método postMessage", "evento message"}}

La función `postMessage` envía un mensaje, lo que causará que se dispare un evento `"message"` en el receptor. El script que creó el worker envía y recibe mensajes a través del objeto `Worker`, mientras que el worker se comunica con el script que lo creó enviando y escuchando directamente en su alcance global. Solo se pueden enviar como mensajes valores que puedan representarse como JSON; el otro lado recibirá una _copia_ de ellos en lugar del valor en sí mismo.

## Temporizadores

{{index timeout, "función setTimeout"}}

Vimos la función `setTimeout` en [Capítulo ?](async). Programa otra función para que se llame más tarde, después de un cierto número de milisegundos.

{{index "función clearTimeout"}}

A veces necesitas cancelar una función que has programado. Esto se hace almacenando el valor devuelto por `setTimeout` y llamando a `clearTimeout` sobre él.

```
let bombTimer = setTimeout(() => {
  console.log("¡BOOM!");
}, 500);

if (Math.random() < 0.5) { // 50% de probabilidad
  console.log("Desactivado.");
  clearTimeout(bombTimer);
}
```

{{index "función cancelAnimationFrame", "función requestAnimationFrame"}}

La función `cancelAnimationFrame` funciona de la misma manera que `clearTimeout`; llamarla en un valor devuelto por `requestAnimationFrame` cancelará ese fotograma (si no se ha llamado ya).

{{index "función setInterval", "función clearInterval", repetición}}

Un conjunto similar de funciones, `setInterval` y `clearInterval`, se utilizan para programar temporizadores que deben _repetirse_ cada _X_ milisegundos.

```
let ticks = 0;
let reloj = setInterval(() => {
  console.log("tic", ticks++);
  if (ticks == 10) {
    clearInterval(reloj);
    console.log("¡Detener!");
  }
}, 200);
```

## Debouncing

{{index "optimización", "evento mousemove", "evento scroll", bloqueo}}

Algunos tipos de eventos pueden activarse rápidamente, muchas veces seguidas (como los eventos `"mousemove"` y `"scroll"`, por ejemplo). Al manejar tales eventos, debes tener cuidado de no hacer nada que consuma demasiado tiempo, ya que tu controlador tomará tanto tiempo que la interacción con el documento comenzará a sentirse lenta.

{{index "función setTimeout"}}

Si necesitas hacer algo importante en un controlador de este tipo, puedes usar `setTimeout` para asegurarte de que no lo estás haciendo con demasiada frecuencia. Esto suele llamarse _((debouncing))_ el evento. Hay varios enfoques ligeramente diferentes para esto.

{{index "textarea (etiqueta HTML)", "función clearTimeout", "evento keydown"}}

En el primer ejemplo, queremos reaccionar cuando el usuario ha escrito algo, pero no queremos hacerlo inmediatamente para cada evento de entrada. Cuando están escribiendo rápidamente, solo queremos esperar hasta que ocurra una pausa. En lugar de realizar inmediatamente una acción en el controlador de eventos, establecemos un tiempo de espera. También limpiamos el tiempo de espera anterior (si existe) para que cuando los eventos ocurran cerca uno del otro (más cerca de nuestro retraso de tiempo de espera), el tiempo de espera del evento anterior se cancele.

```{lang: html}
<textarea>Escribe algo aquí...</textarea>
<script>
  let textarea = document.querySelector("textarea");
  let timeout;
  textarea.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => console.log("¡Escrito!"), 500);
  });
</script>
```

{{index "programación descuidada"}}

Dar un valor no definido a `clearTimeout` o llamarlo en un tiempo de espera que ya ha pasado no tiene efecto. Por lo tanto, no tenemos que tener cuidado de cuándo llamarlo, y simplemente lo hacemos para cada evento.

{{index "evento mousemove"}}

Podemos usar un patrón ligeramente diferente si queremos espaciar las respuestas para que estén separadas por al menos una cierta longitud de tiempo, pero queremos activarlas _durante_ una serie de eventos, no solo después. Por ejemplo, podríamos querer responder a eventos `"mousemove"` mostrando las coordenadas actuales del mouse pero solo cada 250 milisegundos.

```{lang: html}
<script>
  let programado = null;
  window.addEventListener("mousemove", event => {
    if (!programado) {
      setTimeout(() => {
        document.body.textContent =
          `Ratón en ${programado.pageX}, ${programado.pageY}`;
        programado = null;
      }, 250);
    }
    programado = event;
  });
</script>
```

## Resumen

Los controladores de eventos hacen posible detectar y reaccionar a eventos que ocurren en nuestra página web. El método `addEventListener` se utiliza para registrar dicho controlador.

Cada evento tiene un tipo (`"keydown"`, `"focus"`, y así sucesivamente) que lo identifica. La mayoría de los eventos se activan en un elemento DOM específico y luego se _propagan_ a los ancestros de ese elemento, lo que permite que los controladores asociados a esos elementos los manejen.

Cuando se llama a un controlador de eventos, se le pasa un objeto de evento con información adicional sobre el evento. Este objeto también tiene métodos que nos permiten detener una mayor propagación (`stopPropagation`) y evitar el manejo predeterminado del evento por parte del navegador (`preventDefault`).

Presionar una tecla dispara eventos `"keydown"` y `"keyup"`. Presionar un botón del mouse dispara eventos `"mousedown"`, `"mouseup"` y `"click"`. Mover el mouse dispara eventos `"mousemove"`. La interacción con pantallas táctiles dará lugar a eventos `"touchstart"`, `"touchmove"` y `"touchend"`.

El desplazamiento se puede detectar con el evento `"scroll"`, y los cambios de enfoque se pueden detectar con los eventos `"focus"` y `"blur"`. Cuando el documento ha terminado de cargarse, se activa un evento `"load"` en la ventana.

## Ejercicios

### Globo

{{index "globo (ejercicio)", "tecla de flecha"}}Escribe una página que muestre un ((globo)) (usando el ((emoji)) de globo, 🎈). Cuando presiones la flecha hacia arriba, debería inflarse (crecer) un 10 por ciento, y cuando presiones la flecha hacia abajo, debería desinflarse (encoger) un 10 por ciento.

{{index "font-size (CSS)"}}

Puedes controlar el tamaño del texto (los emoji son texto) estableciendo la propiedad CSS `font-size` (`style.fontSize`) en su elemento padre. Recuerda incluir una unidad en el valor, por ejemplo, píxeles (`10px`).

Los nombres de las teclas de flecha son `"ArrowUp"` y `"ArrowDown"`. Asegúrate de que las teclas cambien solo el globo, sin hacer scroll en la página.

Cuando eso funcione, añade una característica en la que, si inflas el globo más allá de un cierto tamaño, explote. En este caso, explotar significa que se reemplace con un emoji de 💥, y el manejador de eventos se elimine (para que no se pueda inflar o desinflar la explosión).

{{if interactive

```{test: no, lang: html, focus: yes}
<p>🎈</p>

<script>
  // Tu código aquí
</script>
```

if}}

{{hint

{{index "evento keydown", "propiedad key", "globo (ejercicio)"}}

Querrás registrar un manejador para el evento `"keydown"` y mirar `event.key` para saber si se presionó la tecla de flecha hacia arriba o hacia abajo.

El tamaño actual se puede mantener en un enlace para que puedas basarte en él para el nuevo tamaño. Será útil definir una función que actualice el tamaño, tanto el enlace como el estilo del globo en el DOM, para que puedas llamarla desde tu manejador de eventos, y posiblemente también una vez al inicio, para establecer el tamaño inicial.

{{index "método replaceChild", "propiedad textContent"}}

Puedes cambiar el globo por una explosión reemplazando el nodo de texto por otro (usando `replaceChild`) o estableciendo la propiedad `textContent` de su nodo padre en una nueva cadena.

hint}}

### Estela del ratón

{{index "animación", "estela del ratón (ejercicio)"}}

En los primeros días de JavaScript, que fue la época dorada de las ((páginas de inicio estridentes)) con un montón de imágenes animadas, la gente ideó formas verdaderamente inspiradoras de usar el lenguaje.

Una de estas era la _estela del ratón_ —una serie de elementos que seguirían al puntero del ratón mientras lo movías por la página.

{{index "posicionamiento absoluto", "background (CSS)"}}

En este ejercicio, quiero que implementes una estela del ratón. Utiliza elementos `<div>` con posición absoluta y un tamaño fijo y color de fondo (consulta el [código](event#mouse_drawing) en la sección de "Clics de ratón" para un ejemplo). Crea un montón de estos elementos y, al mover el ratón, muéstralos en la estela del puntero del ratón.

{{index "mousemove event"}}

Hay varias aproximaciones posibles aquí. Puedes hacer tu solución tan simple o tan compleja como desees. Una solución simple para empezar es mantener un número fijo de elementos de estela y recorrerlos, moviendo el siguiente a la posición actual del ratón cada vez que ocurra un evento `"mousemove"`.

{{if interactive

```{lang: html, test: no}
<style>
  .trail { /* nombre de clase para los elementos de la estela */
    position: absolute;
    height: 6px; width: 6px;
    border-radius: 3px;
    background: teal;
  }
  body {
    height: 300px;
  }
</style>

```html
<script>
  // Tu código aquí.
</script>
```

if}}

{{hint

{{index "mouse trail (exercise)"}}

Crear los elementos es mejor hacerlo con un bucle. Adjúntalos al documento para que aparezcan. Para poder acceder a ellos más tarde y cambiar su posición, querrás almacenar los elementos en un array.

{{index "mousemove event", [array, indexing], "remainder operator", "% operator"}}

Recorrerlos se puede hacer manteniendo una variable de contador y sumándole 1 cada vez que se dispare el evento `"mousemove"`. Luego se puede usar el operador de resto (`% elementos.length`) para obtener un índice de array válido para elegir el elemento que deseas posicionar durante un evento dado.

{{index simulation, "requestAnimationFrame function"}}

Otro efecto interesante se puede lograr modelando un simple sistema de ((física)). Usa el evento `"mousemove"` solo para actualizar un par de enlaces que siguen la posición del ratón. Luego utiliza `requestAnimationFrame` para simular que los elementos rastreadores son atraídos a la posición del puntero del ratón. En cada paso de animación, actualiza su posición basándote en su posición relativa al puntero (y, opcionalmente, una velocidad que está almacenada para cada elemento). Descubrir una buena forma de hacer esto queda a tu cargo.

hint}}

### Pestañas

{{index "tabbed interface (exercise)"}}

Los paneles con pestañas son ampliamente utilizados en interfaces de usuario. Te permiten seleccionar un panel de interfaz eligiendo entre varias pestañas que sobresalen por encima de un elemento.

{{index "button (HTML tag)", "display (CSS)", "hidden element", "data attribute"}}

En este ejercicio debes implementar una interfaz de pestañas simple. Escribe una función, `asTabs`, que tome un nodo DOM y cree una interfaz de pestañas que muestre los elementos secundarios de ese nodo. Debería insertar una lista de elementos `<button>` en la parte superior del nodo, uno por cada elemento secundario, conteniendo el texto recuperado del atributo `data-tabname` del hijo. Todos los hijos originales excepto uno deben estar ocultos (con un estilo `display` de `none`). El nodo actualmente visible se puede seleccionar haciendo clic en los botones.

Cuando funcione, extiéndelo para dar estilo al botón de la pestaña actualmente seleccionada de manera diferente para que sea obvio cuál pestaña está seleccionada.

{{if interactive

```{lang: html, test: no}
<tab-panel>
  <div data-tabname="one">Pestaña uno</div>
  <div data-tabname="two">Pestaña dos</div>
  <div data-tabname="three">Pestaña tres</div>
</tab-panel>

<script>
  function asTabs(node) {
    // Tu código aquí.
  }
  asTabs(document.querySelector("tab-panel"));
</script>
```

if}}

{{hint

Un error en el que podrías caer es que no puedes usar directamente la propiedad `childNodes` del nodo como una colección de nodos de pestaña. Por un lado, cuando agregas los botones, también se convertirán en nodos secundarios y terminarán en este objeto porque es una estructura de datos en vivo. Por otro lado, los nodos de texto creados para el espacio en blanco entre los nodos también están en `childNodes` pero no deberían tener sus propias pestañas. Puedes usar `children` en lugar de `childNodes` para ignorar los nodos de texto.

{{index "TEXT_NODE code", "nodeType property"}}

Podrías empezar construyendo un array de pestañas para tener fácil acceso a ellas. Para implementar el estilo de los botones, podrías almacenar objetos que contengan tanto el panel de la pestaña como su botón.

Recomiendo escribir una función separada para cambiar las pestañas. Puedes almacenar la pestaña seleccionada previamente y cambiar solo los estilos necesarios para ocultarla y mostrar la nueva, o puedes actualizar el estilo de todas las pestañas cada vez que se seleccione una nueva pestaña.

Quizás quieras llamar a esta función inmediatamente para que la interfaz comience con la primera pestaña visible.

hint}}