{{meta {load_files: ["code/chapter/19_paint.js"], zip: "html", include: ["css/paint.css"]}}}

# Proyecto: Editor de Arte Pixelado

{{quote {author: "Joan Miro", chapter: true}

Observo los muchos colores ante mí. Observo mi lienzo en blanco. Luego, intento aplicar colores como palabras que conforman poemas, como notas que conforman música.

quote}}

{{index "Miro, Joan", "ejemplo de programa de dibujo", "capítulo de proyecto"}}

{{figure {url: "img/chapter_picture_19.jpg", alt: "Ilustración que muestra un mosaico de baldosas negras, con tarros de otras baldosas junto a él", chapter: "framed"}}}

El material de los capítulos anteriores te brinda todos los elementos que necesitas para construir una aplicación ((web)) básica. En este capítulo, haremos precisamente eso.

{{index [archivo, imagen]}}

Nuestra ((aplicación)) será un programa de ((dibujo)) de pixeles, donde puedes modificar una imagen píxel por píxel manipulando una vista ampliada de la misma, mostrada como una rejilla de cuadros de colores. Puedes utilizar el programa para abrir archivos de imagen, garabatear en ellos con tu ratón u otro dispositivo señalador, y guardarlos. Así es cómo se verá:

{{figure {url: "img/pixel_editor.png", alt: "Captura de pantalla de la interfaz del editor de píxeles, con una rejilla de píxeles de colores en la parte superior y una serie de controles, en forma de campos y botones HTML, debajo de eso", width: "8cm"}}}

Pintar en una computadora es genial. No necesitas preocuparte por materiales, ((habilidad)) o talento. Simplemente comienzas a manchar y ves hacia dónde llegas.

## Componentes

{{index dibujo, "select (etiqueta HTML)", "canvas (etiqueta HTML)", componente}}

La interfaz de la aplicación muestra un gran elemento `<canvas>` en la parte superior, con varios formularios debajo de él. El usuario dibuja en la ((imagen)) seleccionando una herramienta de un campo `<select>` y luego haciendo clic, tocando o arrastrando sobre el lienzo. Hay herramientas para dibujar píxeles individuales o rectángulos, para rellenar un área y para seleccionar un ((color)) de la imagen.

{{index [DOM, componentes]}}

Estructuraremos la interfaz del editor como un conjunto de _((componente))s_, objetos responsables de una parte del DOM y que pueden contener otros componentes dentro de ellos.

{{index [estado, "de la aplicación"]}}

El estado de la aplicación consiste en la imagen actual, la herramienta seleccionada y el color seleccionado. Organizaremos las cosas de manera que el estado resida en un único valor, y los componentes de la interfaz siempre se basen en el estado actual para verse.

Para entender por qué esto es importante, consideremos la alternativa: distribuir piezas de estado a lo largo de la interfaz. Hasta cierto punto, esto es más fácil de programar. Podemos simplemente agregar un ((campo de color)) y leer su valor cuando necesitemos saber el color actual.

Pero luego agregamos el ((selector de colores)) —una herramienta que te permite hacer clic en la imagen para seleccionar el color de un píxel determinado. Para mantener el campo de color mostrando el color correcto, esa herramienta tendría que saber que el campo de color existe y actualizarlo cada vez que elige un nuevo color. Si alguna vez añades otro lugar que muestre el color (quizás el cursor del ratón podría mostrarlo), tendrías que actualizar tu código de cambio de color para mantener eso sincronizado también.

{{index modularidad}}

De hecho, esto crea un problema en el que cada parte de la interfaz necesita saber acerca de todas las demás partes, lo cual no es muy modular. Para aplicaciones pequeñas como la de este capítulo, eso puede no ser un problema. Para proyectos más grandes, puede convertirse en una verdadera pesadilla.

Para evitar esta pesadilla en principio, vamos a ser estrictos acerca del _((flujo de datos))_. Hay un estado, y la interfaz se dibuja basada en ese estado. Un componente de la interfaz puede responder a las acciones del usuario actualizando el estado, momento en el cual los componentes tienen la oportunidad de sincronizarse con este nuevo estado.

{{index biblioteca, marco de trabajo}}

En la práctica, cada ((componente)) se configura para que, cuando reciba un nuevo estado, también notifique a sus componentes hijos, en la medida en que estos necesiten ser actualizados. Configurar esto es un poco tedioso. Hacer que esto sea más conveniente es el principal punto de venta de muchas bibliotecas de programación para el navegador. Pero para una aplicación pequeña como esta, podemos hacerlo sin dicha infraestructura.

{{index [estado, transiciones]}}

Las actualizaciones al estado se representan como objetos, a los que llamaremos _((acciones))_. Los componentes pueden crear tales acciones y _((despachar))_ (enviarlos) a una función central de gestión de estado. Esa función calcula el próximo estado, tras lo cual los componentes de la interfaz se actualizan a este nuevo estado.

{{index [DOM, componentes]}}

Estamos tomando la tarea desordenada de ejecutar una ((interfaz de usuario)) y aplicándole ((estructura)). Aunque las piezas relacionadas con el DOM aún están llenas de ((efectos secundarios)), están respaldadas por un esqueleto conceptualmente simple: el ciclo de actualización de estado. El estado determina cómo se ve el DOM, y la única forma en que los eventos del DOM pueden cambiar el estado es despachando acciones al estado.

{{index "flujo de datos"}}

Hay _muchas_ variantes de este enfoque, cada una con sus propios beneficios y problemas, pero su idea central es la misma: los cambios de estado deben pasar por un canal único y bien definido, no suceder por todas partes.

{{index "propiedad dom", [interfaz, objeto]}}

Nuestros ((componente))s serán ((clases)) que cumplan con una interfaz. Su constructor recibe un estado, que puede ser el estado de toda la aplicación o algún valor más pequeño si no necesita acceso a todo, y lo utiliza para construir una propiedad `dom`. Este es el elemento DOM que representa el componente. La mayoría de los constructores también tomarán otros valores que no cambiarán con el tiempo, como la función que pueden utilizar para ((despachar)) una acción.

{{index "método syncState"}}

Cada componente tiene un método `syncState` que se utiliza para sincronizarlo con un nuevo valor de estado. El método recibe un argumento, que es el estado, del mismo tipo que el primer argumento de su constructor.

## El estado

{{index "Clase imagen", "propiedad imagen", "propiedad herramienta", "propiedad color"}}

El estado de la aplicación será un objeto con las propiedades `imagen`, `herramienta` y `color`. La imagen es en sí misma un objeto que almacena el ancho, alto y contenido de píxeles de la imagen. Los ((píxel))s se almacenan en un solo array, fila por fila, de arriba abajo.

```{includeCode: true}
class Picture {
  constructor(width, height, pixels) {
    this.width = width;
    this.height = height;
    this.pixels = pixels;
  }
  static empty(width, height, color) {
    let pixels = new Array(width * height).fill(color);
    return new Picture(width, height, pixels);
  }
  pixel(x, y) {
    return this.pixels[x + y * this.width];
  }
  draw(pixels) {
    let copy = this.pixels.slice();
    for (let {x, y, color} of pixels) {
      copy[x + y * this.width] = color;
    }
    return new Picture(this.width, this.height, copy);
  }
}
```

{{index "side effect", "persistent data structure"}}

Queremos poder tratar una imagen como un valor ((inmutable)) por razones que revisaremos más adelante en el capítulo. Pero a veces necesitamos actualizar todo un conjunto de píxeles a la vez. Para poder hacerlo, la clase tiene un método `draw` que espera un array de píxeles actualizados, objetos con propiedades `x`, `y` y `color`, y crea una nueva imagen con esos píxeles sobrescritos. Este método utiliza `slice` sin argumentos para copiar todo el array de píxeles - el inicio de la rebanada predetermina a 0, y el final predetermina a la longitud del array.

{{index "Array constructor", "fill method", ["length property", "for array"], [array, creation]}}

El método `empty` utiliza dos funcionalidades de array que no hemos visto antes. El constructor `Array` se puede llamar con un número para crear un array vacío de la longitud dada. El método `fill` se puede usar para llenar este array con un valor dado. Se utilizan para crear un array en el que todos los píxeles tienen el mismo color.

{{index "número hexadecimal", "componente de color", "campo de color", "propiedad fillStyle"}}

Los colores se almacenan como cadenas que contienen códigos de colores CSS tradicionales compuestos por un ((signo de almohadilla)) (`#`) seguido de seis dígitos hexadecimales (base-16) - dos para el componente ((rojo)), dos para el componente ((verde)) y dos para el componente ((azul)). Esta es una forma algo críptica e incómoda de escribir colores, pero es el formato que utiliza el campo de entrada de color HTML, y se puede usar en la propiedad `fillStyle` de un contexto de dibujo de lienzo, por lo que para las formas en que usaremos colores en este programa, es lo bastante práctico.

{{index negro}}

El negro, donde todos los componentes son cero, se escribe como `"#000000"`, y el ((rosa)) brillante se ve como `"#ff00ff"`, donde los componentes rojo y azul tienen el valor máximo de 255, escrito `ff` en dígitos hexadecimales (que utilizan _a_ a _f_ para representar los dígitos 10 al 15).

{{index [estado, transiciones]}}

Permitiremos que la interfaz envíe ((acciones)) como objetos cuyas propiedades sobrescriben las propiedades del estado anterior. El campo de color, cuando el usuario lo cambia, podría enviar un objeto como `{color: field.value}`, a partir del cual esta función de actualización puede calcular un nuevo estado.

{{index "función updateState"}}

```{includeCode: true}
function updateState(state, action) {
  return {...state, ...action};
}
```

{{index "punto"}}

Este patrón, en el que el operador de ((spread)) de objetos se utiliza primero para agregar las propiedades de un objeto existente y luego para anular algunas de ellas, es común en el código de JavaScript que utiliza objetos ((inmutables)).

## Construcción del DOM

{{index "método `createElement`", "función `elt`", [DOM, "construcción"]}}

Una de las principales funciones que cumplen los componentes de la interfaz es crear una estructura DOM. Nuevamente, no queremos utilizar directamente los métodos verbosos del DOM para eso, así que aquí tienes una versión ligeramente ampliada de la función `elt`:

```{includeCode: true}
function elt(type, props, ...children) {
  let dom = document.createElement(type);
  if (props) Object.assign(dom, props);
  for (let child of children) {
    if (typeof child != "string") dom.appendChild(child);
    else dom.appendChild(document.createTextNode(child));
  }
  return dom;
}
```

{{index "método `setAttribute`", "atributo", "propiedad `onclick`", "evento de clic", "manejo de eventos"}}

La diferencia principal entre esta versión y la que usamos en el [Capítulo ?](game#domdisplay) es que asigna _propiedades_ a los nodos del DOM, no _atributos_. Esto significa que no podemos usarlo para establecer atributos arbitrarios, pero _sí_ podemos usarlo para configurar propiedades cuyo valor no es una cadena, como `onclick`, que se puede establecer como una función para registrar un controlador de eventos de clic.

{{index "botón (etiqueta HTML)"}}

Esto permite este estilo conveniente para registrar manejadores de eventos:

```{lang: html}
<body>
  <script>
    document.body.appendChild(elt("button", {
      onclick: () => console.log("clic")
    }, "El botón"));
  </script>
</body>
```

## El lienzo

El primer componente que definiremos es la parte de la interfaz que muestra la imagen como una cuadrícula de cuadros coloreados. Este componente es responsable de dos cosas: mostrar una imagen y comunicar ((evento de puntero))s en esa imagen al resto de la aplicación.

{{index "clase `PictureCanvas`", "función de devolución de llamada", "constante `scale`", "lienzo (etiqueta HTML)", "evento de mousedown", "evento de touchstart", [estado, "de la aplicación"]}}

Como tal, podemos definirlo como un componente que solo conoce la imagen actual, no todo el estado de la aplicación. Dado que no sabe cómo funciona la aplicación en su totalidad, no puede despachar ((acción))es directamente. Más bien, al responder a eventos de puntero, llama a una función de devolución de llamada proporcionada por el código que lo creó, que se encargará de las partes específicas de la aplicación.

```{includeCode: true}
const scale = 10;

class PictureCanvas {
  constructor(picture, pointerDown) {
    this.dom = elt("canvas", {
      onmousedown: event => this.mouse(event, pointerDown),
      ontouchstart: event => this.touch(event, pointerDown)
    });
    this.syncState(picture);
  }
  syncState(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  }
}
```

{{index "método `syncState`", eficiencia}}

Dibujamos cada píxel como un cuadrado de 10 por 10, según lo determinado por la constante `scale`. Para evitar trabajo innecesario, el componente realiza un seguimiento de su imagen actual y solo vuelve a dibujar cuando se le proporciona una nueva imagen a `syncState`.

{{index "función `drawPicture`"}}

La función de dibujo real establece el tamaño del lienzo en función de la escala y el tamaño de la imagen y lo llena con una serie de cuadrados, uno para cada píxel.

```{includeCode: true}
function drawPicture(picture, canvas, scale) {
  canvas.width = picture.width * scale;
  canvas.height = picture.height * scale;
  let cx = canvas.getContext("2d");

  for (let y = 0; y < picture.height; y++) {
    for (let x = 0; x < picture.width; x++) {
      cx.fillStyle = picture.pixel(x, y);
      cx.fillRect(x * scale, y * scale, scale, scale);
    }
  }
}
```

{{index "evento mousedown", "evento mousemove", "propiedad button", "propiedad buttons", "función pointerPosition"}}

Cuando se presiona el botón izquierdo del mouse mientras está sobre el lienzo de la imagen, el componente llama al callback `pointerDown`, dándole la posición del píxel que se hizo clic, en coordenadas de la imagen. Esto se usará para implementar la interacción del mouse con la imagen. El callback puede devolver otra función de callback para ser notificado cuando se mueve el puntero a un píxel diferente mientras se mantiene presionado el botón.

```{includeCode: true}
PictureCanvas.prototype.mouse = function(downEvent, onDown) {
  if (downEvent.button != 0) return;
  let pos = pointerPosition(downEvent, this.dom);
  let onMove = onDown(pos);
  if (!onMove) return;
  let move = moveEvent => {
    if (moveEvent.buttons == 0) {
      this.dom.removeEventListener("mousemove", move);
    } else {
      let newPos = pointerPosition(moveEvent, this.dom);
      if (newPos.x == pos.x && newPos.y == pos.y) return;
      pos = newPos;
      onMove(newPos);
    }
  };
  this.dom.addEventListener("mousemove", move);
};

function pointerPosition(pos, domNode) {
  let rect = domNode.getBoundingClientRect();
  return {x: Math.floor((pos.clientX - rect.left) / scale),
          y: Math.floor((pos.clientY - rect.top) / scale)};
}
```

{{index "método getBoundingClientRect", "propiedad clientX", "propiedad clientY"}}

Dado que conocemos el tamaño de los píxeles y podemos usar `getBoundingClientRect` para encontrar la posición del lienzo en la pantalla, es posible ir desde las coordenadas del evento del mouse (`clientX` y `clientY`) hasta las coordenadas de la imagen. Estas siempre se redondean hacia abajo para que se refieran a un píxel específico.

{{index "evento touchstart", "evento touchmove", "método preventDefault"}}

Con eventos táctiles, tenemos que hacer algo similar, pero utilizando diferentes eventos y asegurándonos de llamar a `preventDefault` en el evento `"touchstart"` para evitar el desplazamiento. 

```{includeCode: true}
PictureCanvas.prototype.touch = function(startEvent,
                                         onDown) {
  let pos = pointerPosition(startEvent.touches[0], this.dom);
  let onMove = onDown(pos);
  startEvent.preventDefault();
  if (!onMove) return;
  let move = moveEvent => {
    let newPos = pointerPosition(moveEvent.touches[0],
                                 this.dom);
    if (newPos.x == pos.x && newPos.y == pos.y) return;
    pos = newPos;
    onMove(newPos);
  };
  let end = () => {
    this.dom.removeEventListener("touchmove", move);
    this.dom.removeEventListener("touchend", end);
  };
  this.dom.addEventListener("touchmove", move);
  this.dom.addEventListener("touchend", end);
};
```

{{index "touches property", "clientX property", "clientY property"}}

Para eventos táctiles, `clientX` y `clientY` no están disponibles directamente en el objeto de evento, pero podemos usar las coordenadas del primer objeto táctil en la propiedad `touches`.

## La aplicación

Para hacer posible construir la aplicación pieza por pieza, implementaremos el componente principal como una cáscara alrededor de un lienzo de imagen y un conjunto dinámico de ((tool))s y ((control))s que pasamos a su constructor.

Los _controles_ son los elementos de interfaz que aparecen debajo de la imagen. Se proporcionarán como un array de constructores de ((component)).

{{index "br (etiqueta HTML)", "flood fill", "select (etiqueta HTML)", "PixelEditor clase", dispatch}}

Las _herramientas_ hacen cosas como dibujar píxeles o rellenar un área. La aplicación muestra el conjunto de herramientas disponibles como un campo `<select>`. La herramienta actualmente seleccionada determina qué sucede cuando el usuario interactúa con la imagen con un dispositivo puntero. El conjunto de herramientas disponibles se proporciona como un objeto que mapea los nombres que aparecen en el campo desplegable a funciones que implementan las herramientas. Dichas funciones reciben como argumentos una posición de imagen, un estado de aplicación actual y una función `dispatch`. Pueden devolver una función manejadora de movimiento que se llama con una nueva posición y un estado actual cuando el puntero se mueve a un píxel diferente.

```{includeCode: true}
class PixelEditor {
  constructor(state, config) {
    let {tools, controls, dispatch} = config;
    this.state = state;

    this.canvas = new PictureCanvas(state.picture, pos => {
      let tool = tools[this.state.tool];
      let onMove = tool(pos, this.state, dispatch);
      if (onMove) return pos => onMove(pos, this.state);
    });
    this.controls = controls.map(
      Control => new Control(state, config));
    this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                   ...this.controls.reduce(
                     (a, c) => a.concat(" ", c.dom), []));
  }
  syncState(state) {
    this.state = state;
    this.canvas.syncState(state.picture);
    for (let ctrl of this.controls) ctrl.syncState(state);
  }
}
```

El manejador de puntero dado a `PictureCanvas` llama a la herramienta actualmente seleccionada con los argumentos apropiados y, si eso devuelve un manejador de movimiento, lo adapta para también recibir el estado.

{{index "reduce method", "map method", [whitespace, "in HTML"], "syncState method"}}

Todos los controles se construyen y almacenan en `this.controls` para que puedan actualizarse cuando cambie el estado de la aplicación. La llamada a `reduce` introduce espacios entre los elementos DOM de los controles. De esa manera, no se ven tan juntos.

{{index "select (etiqueta HTML)", "change event", "ToolSelect clase", "syncState method"}}

El primer control es el menú de selección de ((tool)). Crea un elemento `<select>` con una opción para cada herramienta y configura un manejador de evento `"change"` que actualiza el estado de la aplicación cuando el usuario selecciona una herramienta diferente.

```{includeCode: true}
class ToolSelect {
  constructor(state, {tools, dispatch}) {
    this.select = elt("select", {
      onchange: () => dispatch({tool: this.select.value})
    }, ...Object.keys(tools).map(name => elt("option", {
      selected: name == state.tool
    }, name)));
    this.dom = elt("label", null, "🖌 Herramienta: ", this.select);
  }
  syncState(state) { this.select.value = state.tool; }
}
```

{{index "etiqueta (etiqueta HTML)"}}

Al envolver el texto de la etiqueta y el campo en un elemento `<label>`, le decimos al navegador que la etiqueta pertenece a ese campo para que, por ejemplo, se pueda hacer clic en la etiqueta para enfocar el campo.

{{index "campo de color", "entrada (etiqueta HTML)"}}

También necesitamos poder cambiar el color, así que agreguemos un control para eso. Un elemento HTML `<input>` con un atributo `type` de `color` nos brinda un campo de formulario especializado para seleccionar colores. El valor de dicho campo siempre es un código de color CSS en formato `"#RRGGBB"` (componentes rojo, verde y azul, dos dígitos por color). El navegador mostrará una interfaz de ((selector de color)) cuando el usuario interactúe con él.

{{if book

Dependiendo del navegador, el selector de color puede lucir así:

{{figure {url: "img/color-field.png", alt: "Captura de pantalla del campo de color", width: "6cm"}}}

if}}

{{index "clase ColorSelect", "método syncState"}}

Este ((control)) crea un campo de ese tipo y lo conecta para que se mantenga sincronizado con la propiedad `color` del estado de la aplicación.

```{includeCode: true}
class ColorSelect {
  constructor(state, {dispatch}) {
    this.input = elt("input", {
      type: "color",
      value: state.color,
      onchange: () => dispatch({color: this.input.value})
    });
    this.dom = elt("label", null, "🎨 Color: ", this.input);
  }
  syncState(state) { this.input.value = state.color; }
}
```

## Herramientas de dibujo

Antes de poder dibujar algo, necesitamos implementar las ((herramienta))s que controlarán la funcionalidad de eventos de ratón o táctiles en el lienzo.

{{index "función de dibujo"}}

La herramienta más básica es la herramienta de dibujo, que cambia cualquier ((píxel)) en el que hagas clic o toques al color seleccionado actualmente. Envía una acción que actualiza la imagen a una versión en la que el píxel señalado recibe el color seleccionado actualmente.

```{includeCode: true}
function draw(pos, state, dispatch) {
  function drawPixel({x, y}, state) {
    let drawn = {x, y, color: state.color};
    dispatch({picture: state.picture.draw([drawn])});
  }
  drawPixel(pos, state);
  return drawPixel;
}
```

La función llama inmediatamente a la función `drawPixel`, pero también la devuelve para que sea llamada nuevamente para los píxeles recién tocados cuando el usuario arrastra o ((desliza)) sobre la imagen.

{{index "función de rectángulo"}}

Para dibujar formas más grandes, puede ser útil crear rápidamente ((rectángulo))s. La herramienta `rectángulo` dibuja un rectángulo entre el punto donde comienzas a ((arrastrar)) y el punto al que arrastras.

```{includeCode: true}
function rectangle(start, state, dispatch) {
  function drawRectangle(pos) {
    let xStart = Math.min(start.x, pos.x);
    let yStart = Math.min(start.y, pos.y);
    let xEnd = Math.max(start.x, pos.x);
    let yEnd = Math.max(start.y, pos.y);
    let drawn = [];
    for (let y = yStart; y <= yEnd; y++) {
      for (let x = xStart; x <= xEnd; x++) {
        drawn.push({x, y, color: state.color});
      }
    }
    dispatch({picture: state.picture.draw(drawn)});
  }
  drawRectangle(start);
  return drawRectangle;
}
```

{{index "estructura de datos persistente", [estado, persistencia]}}

Un detalle importante en esta implementación es que al arrastrar, el rectángulo se vuelve a dibujar en la imagen a partir del estado _original_. De esta manera, puedes hacer que el rectángulo sea más grande o más pequeño nuevamente mientras lo creas, sin que los rectángulos intermedios queden pegados en la imagen final. Esta es una de las razones por las que los objetos de imagen ((inmutables)) son útiles; veremos otra razón más adelante.

Implementar el ((relleno por inundación)) es algo más complejo. Se trata de una ((herramienta)) que llena el píxel bajo el puntero y todos los píxeles adyacentes que tengan el mismo color. "Adyacente" significa adyacente directamente en horizontal o vertical, no diagonalmente. Esta imagen ilustra el conjunto de ((píxel))es coloreados cuando se utiliza la herramienta de relleno por inundación en el píxel marcado:

{{figure {url: "img/flood-grid.svg", alt: "Diagrama de una cuadrícula de píxeles que muestra el área llenada por una operación de relleno por inundación", width: "6cm"}}}

{{index "función de relleno"}}

Curiosamente, la forma en que lo haremos se parece un poco al código de ((búsqueda de caminos)) del [Capítulo ?](robot). Mientras que ese código buscaba a través de un grafo para encontrar una ruta, este código busca a través de una cuadrícula para encontrar todos los píxeles "conectados". El problema de llevar un conjunto ramificado de rutas posibles es similar.

```{includeCode: true}
const alrededor = [{dx: -1, dy: 0}, {dx: 1, dy: 0},
                {dx: 0, dy: -1}, {dx: 0, dy: 1}];

function rellenar({x, y}, estado, despachar) {
  let colorObjetivo = estado.imagen.pixel(x, y);
  let dibujados = [{x, y, color: estado.color}];
  let visitados = new Set();
  for (let hecho = 0; hecho < dibujados.length; hecho++) {
    for (let {dx, dy} of alrededor) {
      let x = dibujados[hecho].x + dx, y = dibujados[hecho].y + dy;
      if (x >= 0 && x < estado.imagen.ancho &&
          y >= 0 && y < estado.imagen.alto &&
          !visitados.has(x + "," + y) &&
          estado.imagen.pixel(x, y) == colorObjetivo) {
        dibujados.push({x, y, color: estado.color});
        visitados.add(x + "," + y);
      }
    }
  }
  despachar({imagen: estado.imagen.dibujar(dibujados)});
}
```

El array de píxeles dibujados funciona como la ((lista de trabajo)) de la función. Para cada píxel alcanzado, tenemos que ver si algún píxel adyacente tiene el mismo color y aún no ha sido pintado. El contador del bucle va rezagado respecto a la longitud del array `dibujados` a medida que se añaden nuevos píxeles. Cualquier píxel por delante de él aún necesita ser explorado. Cuando alcanza la longitud, no quedan píxeles sin explorar y la función termina.

{{index "función de selección"}}

La última ((herramienta)) es un ((selector de color)), que te permite apuntar a un color en la imagen para usarlo como color de dibujo actual.

```{includeCode: true}
function seleccionar(pos, estado, despachar) {
  despachar({color: estado.imagen.pixel(pos.x, pos.y)});
}
```## Guardar y cargar

Cuando hemos dibujado nuestra obra maestra, querríamos guardarla para más tarde. Deberíamos añadir un botón para descargar la imagen actual como un archivo de imagen. Este control proporciona ese botón:

```{includeCode: true}
class SaveButton {
  constructor(state) {
    this.picture = state.picture;
    this.dom = elt("button", {
      onclick: () => this.save()
    }, "💾 Guardar");
  }
  save() {
    let canvas = elt("canvas");
    drawPicture(this.picture, canvas, 1);
    let link = elt("a", {
      href: canvas.toDataURL(),
      download: "pixelart.png"
    });
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
  syncState(state) { this.picture = state.picture; }
}
```

El componente lleva un registro de la imagen actual para que pueda acceder a ella al guardar. Para crear el archivo de imagen, utiliza un elemento `<canvas>` en el que dibuja la imagen (a una escala de un píxel por píxel).

El método `toDataURL` en un elemento canvas crea una URL que empieza con `data:`. A diferencia de las URL `http:` y `https:`, las URL de datos contienen todo el recurso en la URL. Por lo general, son muy largas, pero nos permiten crear enlaces funcionales a imágenes arbitrarias aquí mismo en el navegador.

Para realmente hacer que el navegador descargue la imagen, luego creamos un elemento de ((enlace)) que apunta a esta URL y tiene un atributo `download`. Tales enlaces, al hacer clic en ellos, muestran un cuadro de diálogo para guardar el archivo en el navegador. Añadimos ese enlace al documento, simulamos un clic en él y luego lo eliminamos. Se pueden hacer muchas cosas con la tecnología del ((navegador)), pero a veces la forma de hacerlo es bastante extraña.

Y la cosa se pone peor. También querríamos cargar archivos de imagen existentes en nuestra aplicación. Para hacer eso, nuevamente definimos un componente de botón.

```{includeCode: true}
class LoadButton {
  constructor(_, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => startLoad(dispatch)
    }, "📁 Cargar");
  }
  syncState() {}
}

function startLoad(dispatch) {
  let input = elt("input", {
    type: "file",
    onchange: () => finishLoad(input.files[0], dispatch)
  });
  document.body.appendChild(input);
  input.click();
  input.remove();
}
```

Para acceder a un archivo en la computadora del usuario, necesitamos que el usuario seleccione el archivo a través de un campo de entrada de archivo. Pero no quiero que el botón de carga se vea como un campo de entrada de archivo, así que creamos el campo de entrada de archivo cuando se hace clic en el botón y luego fingimos que este campo de entrada de archivo fue clicado.

Cuando el usuario ha seleccionado un archivo, podemos usar `FileReader` para acceder a su contenido, nuevamente como una ((URL de datos)). Esa URL se puede utilizar para crear un elemento `<img>`, pero debido a que no podemos acceder directamente a los píxeles en una imagen de ese tipo, no podemos crear un objeto `Picture` a partir de eso.

```{includeCode: true}
function finishLoad(file, dispatch) {
  if (file == null) return;
  let reader = new FileReader();
  reader.addEventListener("load", () => {
    let image = elt("img", {
      onload: () => dispatch({
        picture: pictureFromImage(image)
      }),
      src: reader.result
    });
  });
  reader.readAsDataURL(file);
}
```

{{index "canvas (HTML tag)", "getImageData method", "pictureFromImage function"}}

Para acceder a los píxeles, primero debemos dibujar la imagen en un elemento `<canvas>`. El contexto del canvas tiene un método `getImageData` que permite a un script leer sus píxeles. Por lo tanto, una vez que la imagen esté en el canvas, podemos acceder a ella y construir un objeto `Picture`.

```{includeCode: true}
function pictureFromImage(image) {
  let width = Math.min(100, image.width);
  let height = Math.min(100, image.height);
  let canvas = elt("canvas", {width, height});
  let cx = canvas.getContext("2d");
  cx.drawImage(image, 0, 0);
  let pixels = [];
  let {data} = cx.getImageData(0, 0, width, height);

  function hex(n) {
    return n.toString(16).padStart(2, "0");
  }
  for (let i = 0; i < data.length; i += 4) {
    let [r, g, b] = data.slice(i, i + 3);
    pixels.push("#" + hex(r) + hex(g) + hex(b));
  }
  return new Picture(width, height, pixels);
}
```

Limitaremos el tamaño de las imágenes a 100 por 100 píxeles, ya que cualquier cosa más grande se verá _enorme_ en nuestra pantalla y podría ralentizar la interfaz.

{{index "getImageData method", color, transparency}}

La propiedad `data` del objeto devuelto por `getImageData` es un array de componentes de color. Para cada píxel en el rectángulo especificado por los argumentos, contiene cuatro valores, que representan los componentes rojo, verde, azul y _alfa_ del color del píxel, como números entre 0 y 255. La parte alfa representa la opacidad: cuando es cero, el píxel es totalmente transparente, y cuando es 255, es totalmente opaco. Para nuestro propósito, podemos ignorarla.

{{index "número hexadecimal", "método toString"}}

Los dos dígitos hexadecimales por componente, como se usa en nuestra notación de color, corresponden precisamente al rango del 0 al 255: dos dígitos en base 16 pueden expresar 16^2^ = 256 números diferentes. El método `toString` de los números puede recibir como argumento una base, por lo que `n.toString(16)` producirá una representación en cadena en base 16. Debemos asegurarnos de que cada número tenga dos dígitos, por lo que la función auxiliar `hex` llama a `padStart` para agregar un cero inicial cuando sea necesario.

¡Ya podemos cargar y guardar! Eso deja una característica más antes de que hayamos terminado.

## Historial de deshacer

La mitad del proceso de edición consiste en cometer pequeños errores y corregirlos. Por lo tanto, una característica importante en un programa de dibujo es un ((historial de deshacer)).

{{index "estructura de datos persistente", [estado, "de la aplicación"]}}

Para poder deshacer cambios, necesitamos almacenar versiones anteriores de la imagen. Dado que es un valor ((inmutable)), eso es fácil. Pero sí requiere un campo adicional en el estado de la aplicación.

{{index "propiedad done"}}

Agregaremos una matriz `done` para mantener versiones anteriores de la ((imagen)). Mantener esta propiedad requiere una función de actualización de estado más complicada que añade imágenes a la matriz.

{{index "propiedad doneAt", "función historyUpdateState", "función Date.now"}}

Pero no queremos almacenar _cada_ cambio, solo los cambios que ocurran en un determinado espacio de ((tiempo)). Para poder hacer eso, necesitaremos una segunda propiedad, `doneAt`, que rastree la hora en la que almacenamos por última vez una imagen en el historial.

```{includeCode: true}
function historyUpdateState(state, action) {
  if (action.undo == true) {
    if (state.done.length == 0) return state;
    return {
      ...state,
      picture: state.done[0],
      done: state.done.slice(1),
      doneAt: 0
    };
  } else if (action.picture &&
             state.doneAt < Date.now() - 1000) {
    return {
      ...state,
      ...action,
      done: [state.picture, ...state.done],
      doneAt: Date.now()
    };
  } else {
    return {...state, ...action};
  }
}
```

{{index "deshacer historial"}}

Cuando la acción es una acción de deshacer, la función toma la imagen más reciente del historial y la convierte en la imagen actual. Establece `doneAt` en cero para garantizar que el siguiente cambio almacenará la imagen nuevamente en el historial, permitiéndote revertir a ella en otro momento si lo deseas.

De lo contrario, si la acción contiene una nueva imagen y la última vez que almacenamos algo fue hace más de un segundo (1000 milisegundos), las propiedades `done` y `doneAt` se actualizan para almacenar la imagen anterior.

{{index "clase UndoButton", control}}

El botón de deshacer ((componente)) no hace mucho. Despacha acciones de deshacer al hacer clic y se deshabilita cuando no hay nada que deshacer.

```{includeCode: true}
class UndoButton {
  constructor(state, {dispatch}) {
    this.dom = elt("button", {
      onclick: () => dispatch({undo: true}),
      disabled: state.done.length == 0
    }, "⮪ Deshacer");
  }
  syncState(state) {
    this.dom.disabled = state.done.length == 0;
  }
}
```

## Vamos a dibujar

{{index "clase PixelEditor", "constante startState", "constante baseTools", "constante baseControls", "función startPixelEditor"}}

Para configurar la aplicación, necesitamos crear un estado, un conjunto de ((herramienta))s, un conjunto de ((control))es y una función ((despachar)). Podemos pasarlos al constructor `PixelEditor` para crear el componente principal. Dado que necesitaremos crear varios editores en los ejercicios, primero definimos algunos enlaces.

```{includeCode: true}
const startState = {
  tool: "draw",
  color: "#000000",
  picture: Picture.empty(60, 30, "#f0f0f0"),
  done: [],
  doneAt: 0
};

const baseTools = {draw, fill, rectangle, pick};

const baseControls = [
  ToolSelect, ColorSelect, SaveButton, LoadButton, UndoButton
];

function startPixelEditor({state = startState,
                           tools = baseTools,
                           controls = baseControls}) {
  let app = new PixelEditor(state, {
    tools,
    controls,
    dispatch(action) {
      state = historyUpdateState(state, action);
      app.syncState(state);
    }
  });
  return app.dom;
}
```

{{index "enlaces destructurantes", "operador =", [propiedad, acceso]}}

Cuando desestructuras un objeto o un array, puedes usar `=` después de un nombre de enlace para darle al enlace un ((valor predeterminado)), que se usa cuando la propiedad está ausente o tiene `undefined`. La función `startPixelEditor` hace uso de esto para aceptar un objeto con varias propiedades opcionales como argumento. Si, por ejemplo, no proporcionas una propiedad `tools`, entonces `tools` estará vinculado a `baseTools`.Así es como obtenemos un editor real en la pantalla:

```{lang: html, startCode: true}
<div></div>
<script>
  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

{{if interactive

Adelante y dibuja algo.

if}}

## ¿Por qué es tan difícil?

La tecnología del navegador es asombrosa. Proporciona un poderoso conjunto de bloques de construcción de interfaz, formas de diseñar y manipularlos, y herramientas para inspeccionar y depurar tus aplicaciones. El software que escribes para el ((navegador)) puede ejecutarse en casi todas las computadoras y teléfonos del planeta.

Al mismo tiempo, la tecnología del navegador es ridícula. Tienes que aprender una gran cantidad de trucos tontos y hechos oscuros para dominarla, y el modelo de programación predeterminado que ofrece es tan problemático que la mayoría de los programadores prefieren cubrirlo con varias capas de ((abstracción)) en lugar de lidiar con él directamente.

{{index "estándar", "evolución"}}

Y aunque la situación definitivamente está mejorando, en su mayoría lo hace en forma de más elementos que se agregan para abordar deficiencias, creando aún más ((complejidad)). Una característica utilizada por un millón de sitios web realmente no se puede reemplazar. Incluso si se pudiera, sería difícil decidir con qué debiera ser reemplazada.

{{index "factores sociales", "factores económicos", historia}}

La tecnología nunca existe en un vacío; estamos limitados por nuestras herramientas y los factores sociales, económicos e históricos que las produjeron. Esto puede ser molesto, pero generalmente es más productivo tratar de construir una buena comprensión de cómo funciona la realidad técnica _existente_ y por qué es como es, que luchar contra ella o esperar otra realidad.

Nuevas ((abstracciones)) _pueden_ ser útiles. El modelo de componente y la convención de flujo de ((datos)) que utilicé en este capítulo es una forma rudimentaria de eso. Como se mencionó, hay bibliotecas que intentan hacer la programación de interfaces de usuario más agradable. En el momento de escribir esto, [React](https://reactjs.org/) y [Svelte](https://svelte.dev/) son opciones populares, pero hay toda una industria de tales marcos. Si estás interesado en programar aplicaciones web, recomiendo investigar algunos de ellos para comprender cómo funcionan y qué beneficios proporcionan.

## Ejercicios

Todavía hay espacio para mejorar nuestro programa. Vamos a agregar algunas funciones más como ejercicios.

### Atajos de teclado

{{index "atajos de teclado (ejercicio)"}}

Agrega atajos de teclado a la aplicación. La primera letra del nombre de una herramienta selecciona la herramienta, y [control]{keyname}-Z o [command]{keyname}-Z activa el deshacer.

{{index "clase PixelEditor", "atributo tabindex", "función elt", "evento keydown"}}

Haz esto modificando el componente `PixelEditor`. Agrega una propiedad `tabIndex` de 0 al elemento `<div>` envolvente para que pueda recibir el ((enfoque)) del teclado. Ten en cuenta que la _propiedad_ correspondiente al atributo `tabindex` se llama `tabIndex`, con una I mayúscula, y nuestra función `elt` espera nombres de propiedades. Registra los manejadores de eventos de teclas directamente en ese elemento. Esto significa que debes hacer clic, tocar o moverte al tabulador en la aplicación antes de poder interactuar con el teclado.

{{index "propiedad ctrlKey", "propiedad metaKey", "tecla de control", "tecla de comando"}}

Recuerda que los eventos de teclado tienen las propiedades `ctrlKey` y `metaKey` (para la tecla [command]{keyname} en Mac) que puedes utilizar para ver si esas teclas están presionadas.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // La clase PixelEditor original. Extiende el constructor.
  class PixelEditor {
    constructor(state, config) {
      let {tools, controls, dispatch} = config;
      this.state = state;

      this.canvas = new PictureCanvas(state.picture, pos => {
        let tool = tools[this.state.tool];
        let onMove = tool(pos, this.state, dispatch);
        if (onMove) {
          return pos => onMove(pos, this.state, dispatch);
        }
      });
      this.controls = controls.map(
        Control => new Control(state, config));
      this.dom = elt("div", {}, this.canvas.dom, elt("br"),
                     ...this.controls.reduce(
                       (a, c) => a.concat(" ", c.dom), []));
    }
    syncState(state) {
      this.state = state;
      this.canvas.syncState(state.picture);
      for (let ctrl of this.controls) ctrl.syncState(state);
    }
  }

  document.querySelector("div")
    .appendChild(startPixelEditor({}));
</script>
```

if}}

{{hint

{{index "enlaces de teclado (ejercicio)", "propiedad key", "tecla shift"}}

La propiedad `key` de los eventos de teclas de letras será la letra en minúscula en sí misma, si no se mantiene presionada la tecla [shift]{keyname}. No nos interesan los eventos de teclas con [shift]{keyname} aquí.

{{index "evento keydown"}}

Un controlador `"keydown"` puede inspeccionar su objeto de evento para ver si coincide con alguno de los atajos. Puedes obtener automáticamente la lista de primeras letras del objeto `tools` para que no tengas que escribirlas.

{{index "método preventDefault"}}

Cuando el evento de tecla coincide con un atajo, llama a `preventDefault` en él y ((dispatch)) la acción apropiada.

hint}}

### Dibujando eficientemente

{{index "dibujando eficientemente (ejercicio)", "lienzo (etiqueta HTML)", eficiencia}}

Durante el dibujo, la mayoría del trabajo que hace nuestra aplicación ocurre en `drawPicture`. Crear un nuevo estado y actualizar el resto del DOM no es muy costoso, pero repintar todos los píxeles en el lienzo es bastante trabajo.

{{index "método syncState", "clase PictureCanvas"}}

Encuentra una forma de hacer que el método `syncState` de `PictureCanvas` sea más rápido redibujando solo los píxeles que realmente cambiaron.

{{index "función drawPicture", compatibilidad}}

Recuerda que `drawPicture` también es utilizado por el botón de guardar, así que si lo cambias, asegúrate de que los cambios no rompan el uso anterior o crea una nueva versión con un nombre diferente.

{{index "propiedad width", "propiedad height"}}

También ten en cuenta que al cambiar el tamaño de un elemento `<canvas>`, establecer sus propiedades `width` o `height`, lo borra y lo vuelve completamente transparente nuevamente.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // Cambia este método
  PictureCanvas.prototype.syncState = function(picture) {
    if (this.picture == picture) return;
    this.picture = picture;
    drawPicture(this.picture, this.dom, scale);
  };

  // Puede que quieras usar o cambiar esto también
  function drawPicture(picture, canvas, escala) {
    canvas.width = picture.width * escala;
    canvas.height = picture.height * escala;
    let cx = canvas.getContext("2d");

    for (let y = 0; y < picture.height; y++) {
      for (let x = 0; x < picture.width; x++) {
        cx.fillStyle = picture.pixel(x, y);
        cx.fillRect(x * escala, y * escala, escala, escala);
      }
    }
  }

  document.querySelector("div")
    .appendChild(startPixelEditor({}));
  </script>
```

if}}

{{hint

{{index "dibujo eficiente (ejercicio)"}}

Este ejercicio es un buen ejemplo de cómo las estructuras de datos ((inmutables)) pueden hacer que el código sea _más rápido_. Debido a que tenemos tanto la imagen antigua como la nueva, podemos compararlas y volver a dibujar solo los píxeles que cambiaron de color, ahorrando más del 99 por ciento del trabajo de dibujo en la mayoría de los casos.

{{index "función drawPicture"}}

Puedes escribir una nueva función `updatePicture` o hacer que `drawPicture` tome un argumento adicional, que puede ser undefined o la imagen anterior. Para cada ((píxel)), la función comprueba si se pasó una imagen anterior con el mismo color en esta posición y omite el píxel en ese caso.

{{index "propiedad width", "propiedad height", "canvas (etiqueta HTML)"}}

Como el lienzo se borra cuando cambiamos su tamaño, también debes evitar tocar sus propiedades `width` y `height` cuando la imagen antigua y la imagen nueva tienen el mismo tamaño. Si son diferentes, lo cual sucederá cuando se haya cargado una nueva imagen, puedes establecer que el enlace que sostiene la imagen antigua sea nulo después de cambiar el tamaño del lienzo porque no deberías omitir ningún píxel después de haber cambiado el tamaño del lienzo.

hint}}

### Círculos

{{index "círculos (ejercicio)", arrastrar}}

Define una ((herramienta)) llamada `circle` que dibuje un círculo relleno cuando arrastres. El centro del círculo se encuentra en el punto donde comienza el gesto de arrastre o toque, y su ((radio)) está determinado por la distancia arrastrada.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  function circle(pos, state, dispatch) {
    // Tu código aquí
  }

  let dom = startPixelEditor({
    tools: {...baseTools, circle}
  });
  document.querySelector("div").appendChild(dom);
</script>
```

if}}

{{hint

{{index "círculos (ejercicio)", "función rectángulo"}}

Puedes inspirarte en la herramienta `rectangle`. Como esa herramienta, querrás seguir dibujando en la imagen _inicial_, en lugar de la imagen actual, cuando el puntero se mueva.

Para averiguar qué píxeles colorear, puedes usar el ((teorema de Pitágoras)). Primero averigua la distancia entre la posición actual del puntero y la posición de inicio tomando la raíz cuadrada (`Math.sqrt`) de la suma del cuadrado (`x ** 2`) de la diferencia en las coordenadas x y el cuadrado de la diferencia en las coordenadas y. Luego, recorre una cuadrícula de píxeles alrededor de la posición de inicio, cuyos lados tienen al menos el doble del ((radio)), y colorea aquellos que estén dentro del radio del círculo, nuevamente usando la fórmula pitagórica para averiguar la ((distancia)) desde el centro.

Asegúrate de no intentar colorear píxeles que estén fuera de los límites de la imagen.

hint}}

### Líneas adecuadas

{{index "líneas adecuadas (ejercicio)", "dibujando líneas"}}

Este es un ejercicio más avanzado que los dos anteriores, y requerirá que diseñes una solución a un problema no trivial. Asegúrate de tener mucho tiempo y ((paciencia)) antes de comenzar a trabajar en este ejercicio, y no te desanimes por los fallos iniciales.

{{index "función de dibujo", "evento mousemove", "evento touchmove"}}

En la mayoría de los navegadores, al seleccionar la `herramienta` de `dibujo` y arrastrar rápidamente sobre la imagen, no obtienes una línea cerrada. En su lugar, obtienes puntos con huecos entre ellos porque los eventos `"mousemove"` o `"touchmove"` no se dispararon lo suficientemente rápido como para alcanzar cada ((píxel)).

Mejora la herramienta de `dibujo` para que dibuje una línea completa. Esto significa que debes hacer que la función de controlador de movimiento recuerde la posición anterior y la conecte con la actual.

Para hacer esto, dado que los píxeles pueden estar a una distancia arbitraria, tendrás que escribir una función general de dibujo de líneas.

Una línea entre dos píxeles es una cadena conectada de píxeles, lo más recta posible, que va desde el comienzo hasta el final. Los píxeles diagonalmente adyacentes cuentan como conectados. Por lo tanto, una línea inclinada debería verse como la imagen de la izquierda, no como la de la derecha.

{{figure {url: "img/line-grid.svg", alt: "Diagrama de dos líneas pixeladas, una clara, saltando píxeles diagonalmente, y otra más gruesa, con todos los píxeles conectados horizontal o verticalmente", width: "6cm"}}}

Finalmente, si tenemos código que dibuja una línea entre dos puntos arbitrarios, podríamos usarlo también para definir una `herramienta` de `línea`, que dibuja una línea recta entre el inicio y el final de un arrastre.

{{if interactive

```{test: no, lang: html}
<div></div>
<script>
  // The old draw tool. Rewrite this.
  function draw(pos, state, dispatch) {
    function drawPixel({x, y}, state) {
      let drawn = {x, y, color: state.color};
      dispatch({picture: state.picture.draw([drawn])});
    }
    drawPixel(pos, state);
    return drawPixel;
  }

  function line(pos, state, dispatch) {
    // Your code here
  }

  let dom = startPixelEditor({
    tools: {draw, line, fill, rectangle, pick}
  });
  document.querySelector("div").appendChild(dom);
</script>
```

if}}

{{hint

{{index "proper lines (exercise)", "line drawing"}}

El problema de dibujar una línea pixelada es que en realidad son cuatro problemas similares pero ligeramente diferentes. Dibujar una línea horizontal de izquierda a derecha es fácil: recorres las coordenadas _x_ y coloreas un píxel en cada paso. Si la línea tiene una ligera pendiente (menos de 45 grados o ¼π radianes), puedes interpolar la coordenada _y_ a lo largo de la pendiente. Aún necesitas un píxel por posición _x_, con la posición _y_ de esos píxeles determinada por la pendiente.

Pero tan pronto como tu pendiente cruce los 45 grados, necesitas cambiar la forma en que tratas las coordenadas. Ahora necesitas un píxel por posición _y_ ya que la línea sube más de lo que va a la izquierda. Y luego, cuando cruces los 135 grados, tendrás que volver a recorrer las coordenadas _x_, pero de derecha a izquierda.

No necesitas realmente escribir cuatro bucles. Dado que dibujar una línea de _A_ a _B_ es lo mismo que dibujar una línea de _B_ a _A_, puedes intercambiar las posiciones de inicio y fin para las líneas que van de derecha a izquierda y tratarlas como si fueran de izquierda a derecha.

Por lo tanto, necesitas dos bucles diferentes. Lo primero que debería hacer tu función de dibujo de líneas es verificar si la diferencia entre las coordenadas x es mayor que la diferencia entre las coordenadas y. Si lo es, esta es una línea horizontal-ish y, si no, una línea vertical-ish.

{{index "Math.abs function", "valor absoluto"}}

Asegúrate de comparar los valores _absolutos_ de la diferencia de _x_ e _y_, los cuales puedes obtener con `Math.abs`.

{{index "swapping bindings"}}

Una vez que sepas a lo largo de qué ((eje)) estarás iterando, puedes verificar si el punto de inicio tiene una coordenada más alta a lo largo de ese eje que el punto final y intercambiarlos si es necesario. Una forma sucinta de intercambiar los valores de dos enlaces en JavaScript utiliza la asignación por ((desestructuración)) de la siguiente manera:

```{test: no}
[inicio, fin] = [fin, inicio];
```

{{index rounding}}

Entonces puedes calcular la ((pendiente)) de la línea, que determina la cantidad en que la coordenada en el otro eje cambia por cada paso que das a lo largo de tu eje principal. Con eso, puedes ejecutar un bucle a lo largo del eje principal mientras también haces un seguimiento de la posición correspondiente en el otro eje, y puedes dibujar píxeles en cada iteración. Asegúrate de redondear las coordenadas del eje no principal ya que es probable que sean fraccionales y el método `draw` no responda bien a coordenadas fraccionales.

hint}}