{{meta {load_files: ["code/chapter/16_game.js", "code/levels.js", "code/stop_keys.js", "code/chapter/17_canvas.js"], zip: "html include=["img/player.png", "img/sprites.png"]"}}}

# Dibujando en Canvas

{{quote {author: "M.C. Escher", title: "citado por Bruno Ernst en El Espejo Mágico de M.C. Escher", chapter: true}

Dibujar es engañar.

quote}}

{{index "Escher, M.C."}}

{{figure {url: "img/chapter_picture_17.jpg", alt: "Ilustración que muestra un brazo robótico con aspecto industrial dibujando una ciudad en un trozo de papel", chapter: "framed"}}}

{{index CSS, "transform (CSS)", [DOM, gráficos]}}

Los navegadores nos ofrecen varias formas de mostrar ((gráficos)). La forma más simple es usar estilos para posicionar y colorear elementos DOM regulares. Esto puede llevarnos bastante lejos, como mostró el juego en el [capítulo anterior](game). Al agregar imágenes de fondo parcialmente transparentes a los nodos, podemos hacer que se vean exactamente como queremos. Incluso es posible rotar o sesgar nodos con el estilo `transform`.

Pero estaríamos utilizando el DOM para algo para lo que no fue diseñado originalmente. Algunas tareas, como dibujar una ((línea)) entre puntos arbitrarios, son extremadamente incómodas de hacer con elementos HTML regulares.

{{index SVG, "img (etiqueta HTML)"}}

Hay dos alternativas. La primera es basada en el DOM pero utiliza _Gráficos Vectoriales Escalables_ (SVG), en lugar de HTML. Piensa en SVG como un dialecto de marcado de ((documento)) que se centra en las ((forma))s en lugar de en el texto. Puedes incrustar un documento SVG directamente en un documento HTML o incluirlo con una etiqueta `<img>`.

{{index despejando, [gráficos DOM], [interfaz, lienzo]}}

La segunda alternativa se llama _((lienzo))_. Un lienzo es un solo elemento DOM que encapsula una ((imagen)). Proporciona una interfaz de programación para dibujar ((forma))s en el espacio ocupado por el nodo. La principal diferencia entre un lienzo y una imagen SVG es que en SVG se conserva la descripción original de las formas para que puedan moverse o redimensionarse en cualquier momento. Un lienzo, por otro lado, convierte las formas en ((píxel))s (puntos de color en una cuadrícula) en cuanto se dibujan y no recuerda qué representan estos píxeles. La única forma de mover una forma en un lienzo es borrar el lienzo (o la parte del lienzo alrededor de la forma) y volver a dibujarlo con la forma en una nueva posición.

## SVG

Este libro no se adentrará en detalles sobre ((SVG)), pero explicaré brevemente cómo funciona. Al [final del capítulo](canvas#tradeoffs_graficos), volveré a los compromisos que debes considerar al decidir qué mecanismo de ((dibujo)) es adecuado para una aplicación determinada.

Este es un documento HTML con una sencilla imagen SVG en él:

```{lang: html, sandbox: "svg"}
<p>Aquí va HTML normal.</p>
<svg xmlns="http://www.w3.org/2000/svg">
  <circle r="50" cx="50" cy="50" fill="red"/>
  <rect x="120" y="5" width="90" height="90"
        stroke="blue" fill="none"/>
</svg>
```

{{index "circle (etiqueta SVG)", "rect (etiqueta SVG)", "espacio de nombres XML", XML, "atributo xmlns"}}{{if book

El documento se muestra de la siguiente manera:

{{figure {url: "img/svg-demo.png", alt: "Captura de pantalla que muestra una imagen SVG incrustada en un documento HTML", width: "4.5cm"}}}

if}}

{{index [DOM, gráficos]}}

Estas etiquetas crean elementos del DOM, al igual que las etiquetas HTML, con las que los scripts pueden interactuar. Por ejemplo, esto cambia el elemento `<circle>` para que se coloree de cian:

```{sandbox: "svg"}
let circle = document.querySelector("circle");
circle.setAttribute("fill", "cyan");
```

## El elemento canvas

{{index [lienzo, tamaño], "canvas (etiqueta HTML)"}}

Los ((gráficos)) en lienzo pueden ser dibujados en un elemento `<canvas>`. Puedes darle a dicho elemento atributos `width` y `height` para determinar su tamaño en ((píxel))s.

Un lienzo nuevo está vacío, lo que significa que es completamente ((transparente)) y por lo tanto se muestra como espacio vacío en el documento.

{{index "2d (contexto de canvas)", "webgl (contexto de canvas)", OpenGL, [canvas, contexto], dimensiones, [interfaz, canvas]}}

La etiqueta `<canvas>` está destinada a permitir diferentes estilos de ((dibujo)). Para acceder a una interfaz de dibujo real, primero necesitamos crear un _((contexto))_, un objeto cuyos métodos proporcionan la interfaz de dibujo. Actualmente existen tres estilos de dibujo ampliamente compatibles: `"2d"` para gráficos bidimensionales, `"webgl"` para gráficos tridimensionales a través de la interfaz OpenGL, y `"webgpu"`, una alternativa más moderna y flexible a WebGL.

{{index renderizado, gráficos, eficiencia}}

Este libro no discutirá WebGL ni WebGPU—nos mantendremos en dos dimensiones. Pero si estás interesado en gráficos tridimensionales, te animo a investigar sobre WebGPU. Proporciona una interfaz directa al hardware gráfico y te permite renderizar escenas incluso complicadas de manera eficiente, utilizando JavaScript.

{{index "método getContext", [canvas, contexto]}}

Creas un ((contexto)) con el método `getContext` en el elemento DOM `<canvas>`.

```{lang: html}
<p>Antes del lienzo.</p>
<canvas width="120" height="60"></canvas>
<p>Después del lienzo.</p>
<script>
  let canvas = document.querySelector("canvas");
  let context = canvas.getContext("2d");
  context.fillStyle = "red";
  context.fillRect(10, 10, 100, 50);
</script>
```

Después de crear el objeto de contexto, el ejemplo dibuja un ((rectángulo)) rojo de 100 píxeles de ancho y 50 píxeles de alto, con su esquina superior izquierda en las coordenadas (10,10).

{{if book

{{figure {url: "img/canvas_fill.png", alt: "Captura de pantalla de un lienzo con un rectángulo en él", width: "2.5cm"}}}

if}}

{{index SVG, coordenadas}}

Al igual que en HTML (y SVG), el sistema de coordenadas que utiliza el lienzo sitúa el (0,0) en la esquina superior izquierda, y el eje y-((positivo)) va hacia abajo desde allí. Por lo tanto, (10,10) está 10 píxeles abajo y a la derecha de la esquina superior izquierda.

{{id fill_stroke}}

## Líneas y superficies

{{index relleno, trazado, dibujo, SVG}}

En la interfaz de ((lienzo)), una forma puede ser _rellenada_, lo que significa que su área recibe un color o patrón determinado, o puede ser _trazada_, lo que significa que se dibuja una ((línea)) a lo largo de su borde. La misma terminología se utiliza en SVG.

{{index "fillRect method", "strokeRect method"}}

El método `fillRect` rellena un ((rectángulo)). Primero toma las ((coordenadas)) x e y de la esquina superior izquierda del rectángulo, luego su ancho y finalmente su altura. Un método similar llamado `strokeRect` dibuja el ((contorno)) de un rectángulo.

{{index [state, "of canvas"]}}

Ninguno de los métodos toma más parámetros. El color del relleno, el grosor del trazo, y demás, no son determinados por un argumento del método, como podrías esperar razonablemente, sino por propiedades del objeto contexto.

{{index filling, "fillStyle property"}}

La propiedad `fillStyle` controla la forma en que se rellenan las formas. Puede establecerse como una cadena que especifica un ((color)), utilizando la notación de color utilizada por ((CSS)).

{{index stroking, "line width", "strokeStyle property", "lineWidth property", canvas}}

La propiedad `strokeStyle` funciona de manera similar, pero determina el color utilizado para una línea contorneada. El ancho de esa línea se determina mediante la propiedad `lineWidth`, que puede contener cualquier número positivo.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.strokeStyle = "blue";
  cx.strokeRect(5, 5, 50, 50);
  cx.lineWidth = 5;
  cx.strokeRect(135, 5, 50, 50);
</script>
```

{{if book

Este código dibuja dos cuadrados azules, usando una línea más gruesa para el segundo.

{{figure {url: "img/canvas_stroke.png", alt: "Captura de pantalla que muestra dos cuadrados contorneados", width: "5cm"}}}

if}}

{{index "default value", [canvas, size]}}

Cuando no se especifica ningún atributo `width` o `height`, como en el ejemplo, un elemento canvas obtiene un ancho predeterminado de 300 píxeles y una altura de 150 píxeles.

## Caminos

{{index [path, canvas], [interface, design], [canvas, path]}}

Un camino es una secuencia de ((línea))s. La interfaz del canvas 2D toma un enfoque peculiar para describir un camino. Se realiza completamente a través de ((efecto secundario))s. Los caminos no son valores que se puedan almacenar y pasar. En su lugar, si deseas hacer algo con un camino, haces una secuencia de llamadas a métodos para describir su forma.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  for (let y = 10; y < 100; y += 10) {
    cx.moveTo(10, y);
    cx.lineTo(90, y);
  }
  cx.stroke();
</script>
```

{{index canvas, "stroke method", "lineTo method", "moveTo method", shape}}

Este ejemplo crea un camino con varios segmentos horizontales de ((línea)) y luego lo traza usando el método `stroke`. Cada segmento creado con `lineTo` comienza en la posición _actual_ del camino. Esa posición suele ser el final del último segmento, a menos que se haya llamado a `moveTo`. En ese caso, el siguiente segmento comenzaría en la posición pasada a `moveTo`.

{{if book

El camino descrito por el programa anterior se ve así:

{{figure {url: "img/canvas_path.png", alt: "Captura de pantalla que muestra varias líneas verticales", width: "2.1cm"}}}

if}}

{{index [path, canvas], filling, [path, closing], "fill method"}}

Cuando se rellena un camino (usando el método `fill`), cada ((forma)) se llena por separado. Un camino puede contener múltiples formas—cada movimiento de `moveTo` inicia una nueva forma. Pero el camino necesita estar _cerrado_ (significando que su inicio y final están en la misma posición) antes de poder ser rellenado. Si el camino aún no está cerrado, se agrega una línea desde su final hasta su inicio, y se rellena la forma encerrada por el camino completado.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(50, 10);
  cx.lineTo(10, 70);
  cx.lineTo(90, 70);
  cx.fill();
</script>
```

Este ejemplo dibuja un triángulo relleno. Ten en cuenta que solo se dibujan explícitamente dos de los lados del triángulo. El tercero, desde la esquina inferior derecha de regreso a la parte superior, se da por implícito y no estaría allí cuando se traze el recorrido.

{{if book

{{figure {url: "img/canvas_triangle.png", alt: "Captura de pantalla que muestra un recorrido relleno", width: "2.2cm"}}}

if}}

{{index "método stroke", "método closePath", [recorrido, cierre], lienzo}}

También puedes usar el método `closePath` para cerrar explícitamente un recorrido agregando un segmento real ((line)) de vuelta al inicio del recorrido. Este segmento _se_ dibuja cuando se traza el recorrido.

## Curvas

{{index [recorrido, lienzo], lienzo, dibujo}}

Un recorrido también puede contener ((líneas)) curvadas. Lamentablemente, estas son un poco más complicadas de dibujar.

{{index "método quadraticCurveTo"}}

El método `quadraticCurveTo` dibuja una curva hacia un punto dado. Para determinar la curvatura de la línea, el método recibe un ((punto de control)) así como un punto de destino. Imagina este punto de control como _atrayendo_ la línea, dándole su curva. La línea no pasará por el punto de control, pero su dirección en los puntos de inicio y fin será tal que una línea recta en esa dirección apuntaría hacia el punto de control. El siguiente ejemplo ilustra esto:

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // control=(60,10) meta=(90,90)
  cx.quadraticCurveTo(60, 10, 90, 90);
  cx.lineTo(60, 10);
  cx.closePath();
  cx.stroke();
</script>
```

{{if book

Produce un recorrido que se ve así:

{{figure {url: "img/canvas_quadraticcurve.png", alt: "Captura de pantalla de una curva cuadrática", width: "2.3cm"}}}

if}}

{{index "método stroke"}}

Dibujamos una ((curva cuadrática)) de izquierda a derecha, con (60,10) como punto de control, y luego dibujamos dos segmentos ((line)) que pasan por ese punto de control y vuelven al inicio de la línea. El resultado se asemeja a un emblema de _((Star Trek))_. Puedes ver el efecto del punto de control: las líneas que salen de las esquinas inferiores comienzan en la dirección del punto de control y luego se curvan hacia su objetivo.

{{index lienzo, "método bezierCurveTo"}}

El método `bezierCurveTo` dibuja un tipo de curva similar. En lugar de un único ((punto de control)), este tiene dos—uno para cada uno de los extremos de la ((línea)). Aquí hay un boceto similar para ilustrar el comportamiento de dicha curva:

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  cx.moveTo(10, 90);
  // control1=(10,10) control2=(90,10) meta=(50,90)
  cx.bezierCurveTo(10, 10, 90, 10, 50, 90);
  cx.lineTo(90, 10);
  cx.lineTo(10, 10);
  cx.closePath();
  cx.stroke();
</script>
```

Los dos puntos de control especifican la dirección en ambos extremos de la curva. Cuanto más separados estén de su punto correspondiente, más la curva "abultará" en esa dirección.

{{if book

{{figure {url: "img/canvas_beziercurve.png", alt: "Captura de pantalla de una curva de Bezier", width: "2.2cm"}}}

if}}

{{index "prueba y error"}}

((curve))s como estas pueden ser difíciles de trabajar, no siempre es claro cómo encontrar los ((control point))s que proporcionan la ((forma)) que estás buscando. A veces puedes calcularlos y a veces simplemente tendrás que encontrar un valor adecuado mediante prueba y error.

{{index "método de arco", arc}}

El método `arc` es una forma de dibujar una línea que se curva a lo largo del borde de un círculo. Toma un par de ((coordenadas)) para el centro del arco, un radio, y luego un ángulo de inicio y un ángulo final.

{{index pi, "constante Math.PI"}}

Estos últimos dos parámetros permiten dibujar solo parte del círculo. Los ((ángulo))s se miden en ((radian))es, no en ((grado))s. Esto significa que un ((círculo)) completo tiene un ángulo de 2π, o `2 * Math.PI`, que es aproximadamente 6.28. El ángulo comienza a contar en el punto a la derecha del centro del círculo y va en sentido horario desde allí. Puedes usar un inicio de 0 y un final mayor que 2π (por ejemplo, 7) para dibujar un círculo completo.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.beginPath();
  // centro=(50,50) radio=40 ángulo=0 a 7
  cx.arc(50, 50, 40, 0, 7);
  // centro=(150,50) radio=40 ángulo=0 a ½π
  cx.arc(150, 50, 40, 0, 0.5 * Math.PI);
  cx.stroke();
</script>
```

{{index "método moveTo", "método arc", [path, " lienzo"]}}

La imagen resultante contiene una ((línea)) desde la derecha del círculo completo (primer llamado a `arc`) hasta la derecha del cuarto del ((círculo)) (segundo llamado). Al igual que otros métodos de dibujo de trayectos, una línea dibujada con `arc` está conectada al segmento de trayecto anterior. Puedes llamar a `moveTo` o comenzar un nuevo trayecto para evitar esto.

{{if book

{{figure {url: "img/canvas_circle.png", alt: "Captura de pantalla de un círculo", width: "4.9cm"}}}

if}}

{{id diagrama_sectores}}

## Dibujo de un diagrama de sectores

{{index "ejemplo de diagrama de sectores"}}

Imagina que acabas de aceptar un ((trabajo)) en EconomiCorp, Inc., y tu primera tarea es dibujar un diagrama de sectores de los resultados de la encuesta de satisfacción de los clientes.

El enlace `results` contiene una matriz de objetos que representan las respuestas de la encuesta.

```{sandbox: "pie", includeCode: true}
const results = [
  {name: "Satisfecho", count: 1043, color: "lightblue"},
  {name: "Neutral", count: 563, color: "lightgreen"},
  {name: "Insatisfecho", count: 510, color: "pink"},
  {name: "Sin comentario", count: 175, color: "silver"}
];
```

{{index "ejemplo de diagrama de sectores"}}

Para dibujar un diagrama de sectores, dibujamos una serie de sectores circulares, cada uno compuesto por un ((arco)) y un par de ((línea))s hacia el centro de ese arco. Podemos calcular el ((ángulo)) ocupado por cada arco dividiendo un círculo completo (2π) por el número total de respuestas y luego multiplicando ese número (el ángulo por respuesta) por el número de personas que eligieron una opción determinada.

```{lang: html, sandbox: "pie"}
<canvas width="200" height="200"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let total = results
    .reduce((sum, {count}) => sum + count, 0);
  // Comenzar en la parte superior
  let currentAngle = -0.5 * Math.PI;
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    // centro=100,100, radio=100
    // desde el ángulo actual, en sentido horario por el ángulo del sector
    cx.arc(100, 100, 100,
           currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(100, 100);
    cx.fillStyle = result.color;
    cx.fill();
  }
</script>
```

{{if book

Esto dibuja el siguiente gráfico:

{{figure {url: "img/canvas_pie_chart.png", alt: "Captura de pantalla que muestra un gráfico circular", width: "5cm"}}}

if}}

Pero un gráfico que no nos dice qué significan las porciones no es muy útil. Necesitamos una forma de dibujar texto en el ((canvas)).

## Texto

{{index trazado, relleno, "propiedad fillStyle", "método fillText", "método strokeText"}}

Un contexto de dibujo en lienzo 2D proporciona los métodos `fillText` y `strokeText`. Este último puede ser útil para contornear letras, pero generalmente `fillText` es lo que necesitas. Este llenará el contorno del ((texto)) dado con el `fillStyle` actual.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.font = "28px Georgia";
  cx.fillStyle = "fuchsia";
  cx.fillText("¡También puedo dibujar texto!", 10, 50);
</script>
```

Puedes especificar el tamaño, estilo y ((fuente)) del texto con la propiedad `font`. Este ejemplo solo da un tamaño de fuente y un nombre de familia. También es posible agregar `italic` o `bold` al comienzo de la cadena para seleccionar un estilo.

{{index "método fillText", "método strokeText", "propiedad textAlign", "propiedad textBaseline"}}

Los dos últimos argumentos de `fillText` y `strokeText` proporcionan la posición en la que se dibuja la fuente. Por defecto, indican la posición del inicio de la línea alfabética del texto, que es la línea en la que las letras "se paran", sin contar las partes colgantes en letras como la _j_ o la _p_. Puedes cambiar la posición horizontal configurando la propiedad `textAlign` en `"end"` o `"center"` y la posición vertical configurando `textBaseline` en `"top"`, `"middle"` o `"bottom"`.

{{index "ejemplo de gráfico circular"}}

Volveremos a nuestro gráfico circular y al problema de ((etiquetar)) las porciones, en los [ejercicios](canvas#exercise_pie_chart) al final del capítulo.

## Imágenes

{{index "gráficos vectoriales", "gráficos de mapa de bits"}}

En gráficos por computadora, a menudo se hace una distinción entre gráficos _vectoriales_ y gráficos _de mapa de bits_. El primero es lo que hemos estado haciendo hasta ahora en este capítulo: especificar una imagen dando una descripción lógica de las ((forma))s. Los gráficos de mapa de bits, por otro lado, no especifican formas reales, sino que trabajan con datos de ((píxel)) (rasteros de puntos de colores).

{{index "evento load", "manejo de eventos", "img (etiqueta HTML)", "método drawImage"}}

El método `drawImage` nos permite dibujar datos ((de píxel)) en un ((canvas)). Estos datos de píxel pueden originarse desde un elemento `<img>` o desde otro lienzo. El siguiente ejemplo crea un elemento `<img>` independiente y carga un archivo de imagen en él. Pero no podemos comenzar a dibujar inmediatamente desde esta imagen porque es posible que el navegador aún no la haya cargado. Para manejar esto, registramos un controlador de eventos `"load"` y hacemos el dibujo después de que la imagen se haya cargado.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/hat.png";
  img.addEventListener("load", () => {
    for (let x = 10; x < 200; x += 30) {
      cx.drawImage(img, x, 10);
    }
  });
</script>
```

{{index "método drawImage", escalado}}

Por defecto, `drawImage` dibujará la imagen a su tamaño original. También se le pueden proporcionar dos argumentos adicionales para establecer un ancho y alto diferente.

Cuando se utilizan _nueve_ argumentos en `drawImage`, se puede usar para dibujar solo un fragmento de una imagen. Los argumentos segundo a quinto indican el rectángulo (x, y, ancho y alto) en la imagen de origen que se debería copiar, y los argumentos sexto a noveno indican el rectángulo (en el lienzo) en el cual se debería copiar.

{{index "jugador", "arte de píxeles"}}

Esto se puede utilizar para empaquetar varios _((sprites))_ (elementos de imagen) en un único archivo de imagen y luego dibujar solo la parte que se necesita. Por ejemplo, tenemos esta imagen que contiene un personaje de juego en múltiples ((poses)):

{{figure {url: "img/player_big.png", alt: "Arte de píxeles mostrando un personaje de videojuego en 10 poses diferentes. Las primeras 8 forman su ciclo de animación de carrera, la novena tiene al personaje parado, y la décima lo muestra saltando.", width: "6cm"}}}

{{index [animación, "juego de plataforma"]}}

Alternando qué pose dibujamos, podemos mostrar una animación que parece un personaje caminando.

{{index "método fillRect", "método clearRect", borrado}}

Para animar una ((imagen)) en un ((lienzo)), el método `clearRect` es útil. Se asemeja a `fillRect`, pero en lugar de colorear el rectángulo, lo vuelve ((transparente)), eliminando los píxeles dibujados anteriormente.

{{index "función setInterval", "etiqueta img (HTML)"}}

Sabemos que cada _((sprite))_, cada subimagen, tiene un ancho de 24 ((píxeles)) y una altura de 30 píxeles. El siguiente código carga la imagen y luego establece un intervalo (temporizador repetido) para dibujar el siguiente ((frame)):

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/player.png";
  let spriteW = 24, spriteH = 30;
  img.addEventListener("load", () => {
    let ciclo = 0;
    setInterval(() => {
      cx.clearRect(0, 0, spriteW, spriteH);
      cx.drawImage(img,
                   // rectángulo de origen
                   ciclo * spriteW, 0, spriteW, spriteH,
                   // rectángulo de destino
                   0,               0, spriteW, spriteH);
      ciclo = (ciclo + 1) % 8;
    }, 120);
  });
</script>
```

{{index "operador de resto", "operador %", [animación, "juego de plataforma"]}}

El enlace `ciclo` sigue nuestra posición en la animación. En cada ((frame)), se incrementa y luego se recorta de nuevo al rango de 0 a 7 usando el operador de resto. Este enlace se utiliza luego para calcular la coordenada x que tiene el sprite para la pose actual en la imagen.

## Transformación

{{index transformación, espejado}}

{{indexsee voltear, espejado}}

Pero, ¿qué pasa si queremos que nuestro personaje camine hacia la izquierda en lugar de hacia la derecha? Podríamos dibujar otro conjunto de sprites, por supuesto. Pero también podemos instruir al ((lienzo)) para que dibuje la imagen en sentido contrario.

{{index "método scale", escalado}}

Llamar al método `scale` hará que todo lo que se dibuje después de él se escale. Este método toma dos parámetros, uno para establecer una escala horizontal y otro para establecer una escala vertical.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  cx.scale(3, .5);
  cx.beginPath();
  cx.arc(50, 50, 40, 0, 7);
  cx.lineWidth = 3;
  cx.stroke();
</script>
```

{{if book

Debido a la llamada a `scale`, el círculo se dibuja tres veces más ancho y la mitad de alto.

{{figure {url: "img/canvas_scale.png", alt: "Captura de pantalla de un círculo escalado", width: "6.6cm"}}}

if}}

{{index mirroring}}

Escalar hará que todo en la imagen dibujada, incluyendo el ((grosor de línea)), se estire o se comprima como se especifique. Escalar por una cantidad negativa volteará la imagen. La volteadura ocurre alrededor del punto (0,0), lo que significa que también volteará la dirección del sistema de coordenadas. Cuando se aplica una escala horizontal de -1, una forma dibujada en la posición x 100 terminará en lo que solía ser la posición -100.

{{index "drawImage method"}}

Así que para voltear una imagen, no podemos simplemente agregar `cx.scale(-1, 1)` antes de la llamada a `drawImage` porque eso movería nuestra imagen fuera del ((lienzo)), donde no sería visible. Podrías ajustar las ((coordenadas)) dadas a `drawImage` para compensar esto dibujando la imagen en la posición x -50 en lugar de 0. Otra solución, que no requiere que el código que hace el dibujo sepa sobre el cambio de escala, es ajustar el ((eje)) alrededor del cual ocurre el escalado.

{{index "rotate method", "translate method", transformation}}

Hay varios otros métodos además de `scale` que influyen en el sistema de coordenadas de un ((lienzo)). Puedes rotar formas dibujadas posteriormente con el método `rotate` y moverlas con el método `translate`. Lo interesante—y confuso—es que estas transformaciones _se apilan_, lo que significa que cada una ocurre relativa a las transformaciones anteriores.

{{index "rotate method", "translate method"}}

Entonces, si traducimos por 10 píxeles horizontales dos veces, todo se dibujará 20 píxeles a la derecha. Si primero movemos el centro del sistema de coordenadas a (50,50) y luego rotamos por 20 ((grados)) (aproximadamente 0.1π ((radianes))), esa rotación ocurrirá _alrededor_ del punto (50,50).

{{figure {url: "img/transform.svg", alt: "Diagrama que muestra el resultado de apilar transformaciones. El primer diagrama traduce y luego rota, causando que la traducción ocurra normalmente y la rotación alrededor del objetivo de la traducción. El segundo diagrama primero rota y luego traduce, causando que la rotación ocurra alrededor del origen y la dirección de traducción se incline por esa rotación.", width: "9cm"}}}

{{index coordinates}}

Pero si _primero_ rotamos 20 grados y _luego_ traducimos por (50,50), la traducción ocurrirá en el sistema de coordenadas rotado y producirá una orientación diferente. El orden en el que se aplican las transformaciones es importante.

{{index axis, mirroring}}

Para voltear una imagen alrededor de la línea vertical en una posición x dada, podemos hacer lo siguiente:

```{includeCode: true}
function flipHorizontally(context, around) {
  context.translate(around, 0);
  context.scale(-1, 1);
  context.translate(-around, 0);
}
```

{{index "método flipHorizontally"}}

Movemos el eje y a donde queremos que esté nuestro ((espejo)), aplicamos el efecto de espejo y finalmente devolvemos el eje y a su lugar adecuado en el universo espejado. La siguiente imagen explica por qué esto funciona:

{{figure {url: "img/mirror.svg", alt: "Diagrama que muestra el efecto de trasladar y espejar un triángulo", width: "8cm"}}}

{{index "método translate", "método scale", transformación, lienzo}}

Esto muestra los sistemas de coordenadas antes y después del espejo a través de la línea central. Los triángulos están numerados para ilustrar cada paso. Si dibujamos un triángulo en una posición x positiva, por defecto estaría en el lugar donde se encuentra el triángulo 1. Una llamada a `flipHorizontally` primero realiza una traslación a la derecha, lo que nos lleva al triángulo 2. Luego escala, volteando el triángulo a la posición 3. Esto no es donde debería estar, si estuviera reflejado en la línea dada. La segunda llamada a `translate` corrige esto, "cancela" la traslación inicial y hace que el triángulo 4 aparezca exactamente donde debería.

Ahora podemos dibujar un personaje espejado en la posición (100,0) volteando el mundo alrededor del centro vertical del personaje.

```{lang: html}
<canvas></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let img = document.createElement("img");
  img.src = "img/jugador.png";
  let spriteW = 24, spriteH = 30;
  img.addEventListener("load", () => {
    flipHorizontally(cx, 100 + spriteW / 2);
    cx.drawImage(img, 0, 0, spriteW, spriteH,
                 100, 0, spriteW, spriteH);
  });
</script>
```

## Almacenando y eliminando transformaciones

{{index "efecto secundario", lienzo, transformación}}

Las transformaciones permanecen. Todo lo que dibujemos después de ese personaje espejado también estará reflejado. Eso podría ser inconveniente.

Es posible guardar la transformación actual, hacer algunos dibujos y transformaciones, y luego restaurar la antigua transformación. Esto suele ser lo apropiado para una función que necesita transformar temporalmente el sistema de coordenadas. Primero, guardamos cualquier transformación que estuviera utilizando el código que llamó a la función. Luego, la función realiza su tarea, agregando más transformaciones sobre la transformación actual. Finalmente, volvemos a la transformación con la que comenzamos.

{{index "método save", "método restore", [estado, "del lienzo"]}}

Los métodos `save` y `restore` en el contexto 2D del lienzo hacen este manejo de transformaciones. Conceptualmente mantienen una pila de estados de transformación. Cuando llamas a `save`, el estado actual se apila, y cuando llamas a `restore`, se elimina el estado de la cima de la pila y se usa como la transformación actual del contexto. También puedes llamar a `resetTransform` para restablecer completamente la transformación.

{{index "recursión de ramificación", "ejemplo de fractal", recursión}}

La función `branch` en el siguiente ejemplo ilustra lo que puedes hacer con una función que cambia la transformación y luego llama a una función (en este caso a sí misma), que continúa dibujando con la transformación dada.Esta función dibuja una forma parecida a un árbol dibujando una línea, moviendo el centro del sistema de coordenadas al final de la línea, y llamándose a sí misma dos veces, primero rotada a la izquierda y luego rotada a la derecha. Cada llamada reduce la longitud de la rama dibujada, y la recursividad se detiene cuando la longitud desciende por debajo de 8.

```{lang: html}
<canvas width="600" height="300"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  function branch(length, angle, scale) {
    cx.fillRect(0, 0, 1, length);
    if (length < 8) return;
    cx.save();
    cx.translate(0, length);
    cx.rotate(-angle);
    branch(length * scale, angle, scale);
    cx.rotate(2 * angle);
    branch(length * scale, angle, scale);
    cx.restore();
  }
  cx.translate(300, 0);
  branch(60, 0.5, 0.8);
</script>
```

{{if book

El resultado es un fractal simple.

{{figure {url: "img/canvas_tree.png", alt: "Captura de pantalla de un fractal", width: "5cm"}}}

if}}

{{index "método save", "método restore", canvas, "método rotate"}}

Si las llamadas a `save` y `restore` no estuvieran allí, la segunda llamada recursiva a `branch` terminaría con la posición y rotación creadas por la primera llamada. No estaría conectada a la rama actual sino más bien a la rama más interna y a la derecha dibujada por la primera llamada. La forma resultante podría ser interesante, pero definitivamente no sería un árbol.

{{id canvasdisplay}}

## De vuelta al juego

{{index "método drawImage"}}

Ahora sabemos lo suficiente sobre el dibujo en ((canvas)) para empezar a trabajar en un sistema de ((display)) basado en ((canvas)) para el ((juego)) del [capítulo anterior](game). El nuevo display ya no mostrará solo cajas de colores. En su lugar, usaremos `drawImage` para dibujar imágenes que representen los elementos del juego.

{{index "clase CanvasDisplay", "clase DOMDisplay", [interfaz, objeto]}}

Definimos otro tipo de objeto de display llamado `CanvasDisplay`, que soporta la misma interfaz que `DOMDisplay` del [Capítulo ?](game#domdisplay), es decir, los métodos `syncState` y `clear`.

{{index [estado, "en objetos"]}}

Este objeto mantiene un poco más de información que `DOMDisplay`. En lugar de utilizar la posición de desplazamiento de su elemento DOM, realiza un seguimiento de su propio ((viewport)), que nos indica qué parte del nivel estamos viendo actualmente. Por último, mantiene una propiedad `flipPlayer` para que incluso cuando el jugador esté quieto, siga mirando en la dirección en la que se movió por última vez.

```{sandbox: "game", includeCode: true}
class CanvasDisplay {
  constructor(parent, level) {
    this.canvas = document.createElement("canvas");
    this.canvas.width = Math.min(600, level.width * scale);
    this.canvas.height = Math.min(450, level.height * scale);
    parent.appendChild(this.canvas);
    this.cx = this.canvas.getContext("2d");

    this.flipPlayer = false;

    this.viewport = {
      left: 0,
      top: 0,
      width: this.canvas.width / scale,
      height: this.canvas.height / scale
    };
  }

  clear() {
    this.canvas.remove();
  }
}
```

El método `syncState` primero calcula un nuevo viewport y luego dibuja la escena del juego en la posición adecuada.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.syncState = function(state) {
  this.updateViewport(state);
  this.clearDisplay(state.status);
  this.drawBackground(state.level);
  this.drawActors(state.actors);
};
```

{{index desplazamiento, limpieza}}

A diferencia de `DOMDisplay`, este estilo de visualización **sí** tiene que redibujar el fondo en cada actualización. Debido a que las formas en un lienzo son solo píxeles, una vez que las dibujamos no hay una buena manera de moverlas (o eliminarlas). La única forma de actualizar la visualización en lienzo es borrarla y volver a dibujar la escena. También puede ser que hayamos hecho scroll, lo que requeriría que el fondo esté en una posición diferente.

{{index "Clase CanvasDisplay"}}

El método `updateViewport` es similar al método `scrollPlayerIntoView` de `DOMDisplay`. Verifica si el jugador está demasiado cerca del borde de la pantalla y mueve el **viewport** en ese caso.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.updateViewport = function(state) {
  let view = this.viewport, margin = view.width / 3;
  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5));

  if (center.x < view.left + margin) {
    view.left = Math.max(center.x - margin, 0);
  } else if (center.x > view.left + view.width - margin) {
    view.left = Math.min(center.x + margin - view.width,
                         state.level.width - view.width);
  }
  if (center.y < view.top + margin) {
    view.top = Math.max(center.y - margin, 0);
  } else if (center.y > view.top + view.height - margin) {
    view.top = Math.min(center.y + margin - view.height,
                        state.level.height - view.height);
  }
};
```

{{index límite, "Función Math.max", "Función Math.min", recorte}}

Las llamadas a `Math.max` y `Math.min` aseguran que el **viewport** no termine mostrando espacio fuera del nivel. `Math.max(x, 0)` se asegura de que el número resultante no sea menor que cero. `Math.min` garantiza de manera similar que un valor se mantenga por debajo de un límite dado.

Al **limpiar** la visualización, usaremos un color ligeramente diferente según si el juego se ha ganado (más brillante) o perdido (más oscuro).

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.clearDisplay = function(status) {
  if (status == "won") {
    this.cx.fillStyle = "rgb(68, 191, 255)";
  } else if (status == "lost") {
    this.cx.fillStyle = "rgb(44, 136, 214)";
  } else {
    this.cx.fillStyle = "rgb(52, 166, 251)";
  }
  this.cx.fillRect(0, 0,
                   this.canvas.width, this.canvas.height);
};
```

{{index "Función Math.floor", "Función Math.ceil", redondeo}}

Para dibujar el fondo, recorremos los mosaicos que son visibles en el **viewport** actual, utilizando el mismo truco usado en el método `touches` del [capítulo anterior](game#touches).

```{sandbox: "game", includeCode: true}
let otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";

CanvasDisplay.prototype.drawBackground = function(level) {
  let {left, top, width, height} = this.viewport;
  let xStart = Math.floor(left);
  let xEnd = Math.ceil(left + width);
  let yStart = Math.floor(top);
  let yEnd = Math.ceil(top + height);
``````js
for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let tile = level.rows[y][x];
      if (tile == "empty") continue;
      let screenX = (x - left) * scale;
      let screenY = (y - top) * scale;
      let tileX = tile == "lava" ? scale : 0;
      this.cx.drawImage(otherSprites,
                        tileX,         0, scale, scale,
                        screenX, screenY, scale, scale);
    }
  }
};
```

{{index "método drawImage", sprites, tile}}

Las casillas que no están vacías se dibujan con `drawImage`. La imagen `otherSprites` contiene las imágenes utilizadas para elementos que no son el jugador. Contiene, de izquierda a derecha, la casilla de pared, la casilla de lava y el sprite de una moneda.

{{figure {url: "img/sprites_big.png", alt: "Arte pixelado que muestra tres sprites: una pieza de pared, hecha de pequeñas piedras blancas, un cuadrado de lava naranja y una moneda redonda.", width: "1.4cm"}}}

{{index escalado}}

Las casillas de fondo son de 20 por 20 píxeles ya que usaremos la misma escala que en `DOMDisplay`. Por lo tanto, el desplazamiento para las casillas de lava es 20 (el valor del enlace `scale`), y el desplazamiento para las paredes es 0.

{{index dibujo, "evento load", "método drawImage"}}

No nos molesta esperar a que se cargue la imagen del sprite. Llamar a `drawImage` con una imagen que aún no se ha cargado simplemente no hará nada. Por lo tanto, podríamos no dibujar correctamente el juego durante los primeros ((cuadro))s, mientras la imagen aún se está cargando, pero eso no es un problema grave. Dado que seguimos actualizando la pantalla, la escena correcta aparecerá tan pronto como termine la carga.

{{index "jugador", [animación, "juego de plataformas"], dibujo}}

El personaje de movimiento que se mostró anteriormente se utilizará para representar al jugador. El código que lo dibuja necesita seleccionar el ((sprite)) adecuado y la dirección basándose en el movimiento actual del jugador. Los primeros ocho sprites contienen una animación de caminar. Cuando el jugador se está moviendo a lo largo de una superficie, los recorremos según el tiempo actual. Queremos cambiar de fotogramas cada 60 milisegundos, por lo que primero dividimos el ((tiempo)) por 60. Cuando el jugador está quieto, dibujamos el noveno sprite. Durante los saltos, que se reconocen por el hecho de que la velocidad vertical no es cero, usamos el décimo sprite de la derecha.

{{index "función flipHorizontally", "clase CanvasDisplay"}}

Dado que los ((sprite))s son ligeramente más anchos que el objeto del jugador—24 en lugar de 16 píxeles para permitir algo de espacio para los pies y los brazos—el método debe ajustar la coordenada x y el ancho por una cantidad dada (`playerXOverlap`).

```{sandbox: "juego", includeCode: true}
let playerSprites = document.createElement("img");
playerSprites.src = "img/player.png";
const playerXOverlap = 4;

CanvasDisplay.prototype.drawPlayer = function(player, x, y,
                                              width, height){
  width += playerXOverlap * 2;
  x -= playerXOverlap;
  if (player.speed.x != 0) {
    this.flipPlayer = player.speed.x < 0;
  }

  let tile = 8;
  if (player.speed.y != 0) {
    tile = 9;
  } else if (player.speed.x != 0) {
    tile = Math.floor(Date.now() / 60) % 8;
  }
``````js
this.cx.save();
if (this.flipPlayer) {
  flipHorizontally(this.cx, x + width / 2);
}
let tileX = tile * width;
this.cx.drawImage(playerSprites, tileX, 0, width, height,
                                 x,     y, width, height);
this.cx.restore();
};
```

El método `drawPlayer` es llamado por `drawActors`, el cual es responsable de dibujar todos los actores en el juego.

```{sandbox: "game", includeCode: true}
CanvasDisplay.prototype.drawActors = function(actors) {
  for (let actor of actors) {
    let width = actor.size.x * scale;
    let height = actor.size.y * scale;
    let x = (actor.pos.x - this.viewport.left) * scale;
    let y = (actor.pos.y - this.viewport.top) * scale;
    if (actor.type == "player") {
      this.drawPlayer(actor, x, y, width, height);
    } else {
      let tileX = (actor.type == "coin" ? 2 : 1) * scale;
      this.cx.drawImage(otherSprites,
                        tileX, 0, width, height,
                        x,     y, width, height);
    }
  }
};
```

Cuando se está dibujando algo que no es el jugador, miramos su tipo para encontrar el desplazamiento del sprite correcto. El tile de lava se encuentra en el desplazamiento 20, y el sprite de la moneda se encuentra en 40 (dos veces `scale`).

{{index viewport}}

Tenemos que restar la posición del viewport al calcular la posición del actor, ya que (0,0) en nuestro ((canvas)) corresponde a la esquina superior izquierda del viewport, no a la esquina superior izquierda del nivel. También podríamos haber usado `translate` para esto. De ambas maneras funciona.

{{if interactive

Este documento conecta el nuevo display a `runGame`:

```{lang: html, sandbox: game, focus: yes, startCode: true}
<body>
  <script>
    runGame(GAME_LEVELS, CanvasDisplay);
  </script>
</body>
```

if}}

{{if book

{{index [game, screenshot], [game, "with canvas"]}}

Eso concluye el nuevo sistema de ((display)). El juego resultante se ve algo así:

{{figure {url: "img/canvas_game.png", alt: "Captura de pantalla del juego mostrado en canvas", width: "8cm"}}}

if}}

{{id graphics_tradeoffs}}

## Elección de una interfaz gráfica

Por lo tanto, cuando necesitas generar gráficos en el navegador, puedes elegir entre HTML simple, ((SVG)) y ((canvas)). No hay un enfoque único _mejor_ que funcione en todas las situaciones. Cada opción tiene sus fortalezas y debilidades.

{{index "text wrapping"}}

HTML simple tiene la ventaja de ser simple. También se integra bien con ((texto)). Tanto SVG como canvas te permiten dibujar texto, pero no te ayudarán a posicionar ese texto o envolverlo cuando ocupa más de una línea. En una imagen basada en HTML, es mucho más fácil incluir bloques de texto.

{{index zooming, SVG}}

SVG se puede utilizar para producir ((gráficos)) ((nítidos)) que se ven bien en cualquier nivel de zoom. A diferencia de HTML, está diseñado para dibujar y, por lo tanto, es más adecuado para ese propósito.

{{index [DOM, graphics], SVG, "event handling", ["data structure", tree]}}

Tanto SVG como HTML construyen una estructura de datos (el DOM) que representa tu imagen. Esto hace posible modificar elementos después de ser dibujados. Si necesitas cambiar repetidamente una pequeña parte de una imagen grande en respuesta a lo que está haciendo el usuario o como parte de una ((animación)), hacerlo en un canvas puede ser innecesariamente costoso. El DOM también nos permite registrar manipuladores de eventos de ratón en cada elemento de la imagen (incluso en formas dibujadas con SVG). No puedes hacer eso con canvas.

{{index rendimiento, optimización}}

Pero el enfoque orientado a píxeles de ((canvas)) puede ser una ventaja al dibujar una gran cantidad de elementos pequeños. El hecho de que no construye una estructura de datos, sino que solo dibuja repetidamente sobre la misma superficie de píxeles, hace que canvas tenga un menor costo por forma.

{{index "ray tracer"}}

También hay efectos, como renderizar una escena píxel por píxel (por ejemplo, usando un ray tracer) o procesar una imagen con JavaScript (desenfocarla o distorsionarla), que solo son prácticos con un elemento canvas.

En algunos casos, puede que desees combinar varias de estas técnicas. Por ejemplo, podrías dibujar un ((gráfico)) con ((SVG)) o ((canvas)) pero mostrar información ((text))ual posicionando un elemento HTML encima de la imagen.

{{index visualización}}

Para aplicaciones poco exigentes, realmente no importa mucho qué interfaz elijas. La visualización que construimos para nuestro juego en este capítulo podría haber sido implementada utilizando cualquiera de estas tres tecnologías ((gráficas)) ya que no necesita dibujar texto, manejar interacción del mouse o trabajar con una cantidad extraordinariamente grande de elementos.

## Resumen

En este capítulo discutimos técnicas para dibujar gráficos en el navegador, centrándonos en el elemento `<canvas>`.

Un nodo canvas representa un área en un documento en la que nuestro programa puede dibujar. Este dibujo se realiza a través de un objeto de contexto de dibujo, creado con el método `getContext`.

La interfaz de dibujo 2D nos permite rellenar y trazar varias formas. La propiedad `fillStyle` del contexto determina cómo se rellenan las formas. Las propiedades `strokeStyle` y `lineWidth` controlan la forma en que se dibujan las líneas.

Los rectángulos y trozos de texto se pueden dibujar con una sola llamada a método. Los métodos `fillRect` y `strokeRect` dibujan rectángulos, y los métodos `fillText` y `strokeText` dibujan texto. Para crear formas personalizadas, primero debemos construir un camino.

{{index trazado, relleno}}

Llamar a `beginPath` inicia un nuevo camino. Varios otros métodos agregan líneas y curvas al camino actual. Por ejemplo, `lineTo` puede agregar una línea recta. Cuando un camino está terminado, se puede rellenar con el método `fill` o trazarse con el método `stroke`.

Mover píxeles desde una imagen u otro canvas a nuestro canvas se hace con el método `drawImage`. Por defecto, este método dibuja toda la imagen fuente, pero al darle más parámetros, puedes copiar un área específica de la imagen. Utilizamos esto para nuestro juego copiando poses individuales del personaje del juego de una imagen que contenía muchas poses.

Las transformaciones te permiten dibujar una forma en múltiples orientaciones. Un contexto de dibujo 2D tiene una transformación actual que se puede cambiar con los métodos `translate`, `scale` y `rotate`. Estos afectarán todas las operaciones de dibujo subsiguientes. Un estado de transformación se puede guardar con el método `save` y restaurar con el método `restore`.

Al mostrar una animación en un canvas, se puede usar el método `clearRect` para borrar parte del canvas antes de volver a dibujarlo.

## Ejercicios

### Formas

{{index "formas (ejercicio)"}}

Escribe un programa que dibuje las siguientes ((formas)) en un lienzo ((canvas)):

{{index rotación}}

1. Un ((trapecio)) (un ((rectángulo)) que es más ancho en un lado)

2. Un diamante rojo ((diamond)) (un rectángulo rotado 45 grados o ¼π radianes)

3. Una línea en zigzag 

4. Un ((espiral)) compuesta por 100 segmentos de línea recta

5. Una estrella amarilla ((star))

{{figure {url: "img/exercise_shapes.png", alt: "Imagen que muestra las formas que se te pide dibujar", width: "8cm"}}}

Cuando dibujes las dos últimas, es posible que quieras consultar la explicación de `Math.cos` y `Math.sin` en [Capítulo ?](dom#sin_cos), que describe cómo obtener coordenadas en un círculo utilizando estas funciones.

{{index legibilidad, "codificación en duro"}}

Recomiendo crear una función para cada forma. Pasa la posición y opcionalmente otras propiedades como el tamaño o el número de puntos, como parámetros. La alternativa, que es codificar números en todo tu código, tiende a hacer que el código sea innecesariamente difícil de leer y modificar.

{{if interactive

```{lang: html, test: no}
<canvas width="600" height="200"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");

  // Tu código aquí.
</script>
```

if}}

{{hint

{{index [ruta, lienzo], "formas (ejercicio)"}}

El ((trapecio)) (1) es más fácil de dibujar usando un recorrido. Elige coordenadas centrales adecuadas y agrega cada una de las cuatro esquinas alrededor del centro.

{{index "función flipHorizontally", rotación}}

El diamante ((diamond)) (2) se puede dibujar de forma directa, con un recorrido, o de forma interesante, con una ((transformación)) de `rotación`. Para usar la rotación, tendrás que aplicar un truco similar al que hicimos en la función `flipHorizontally`. Debido a que quieres rotar alrededor del centro de tu rectángulo y no alrededor del punto (0,0), primero debes `translate` allí, luego rotar, y luego volver a trasladar.

Asegúrate de restablecer la transformación después de dibujar cualquier forma que la cree.

{{index "operador de resto", "operador %"}}

Para el zigzag (3) se vuelve impráctico escribir una nueva llamada a `lineTo` para cada segmento de línea. En su lugar, deberías usar un ((bucle)). En cada iteración, puedes hacer que dibuje dos segmentos de línea (derecha y luego izquierda nuevamente) o uno, en cuyo caso debes usar la paridad (`% 2`) del índice del bucle para determinar si ir a la izquierda o a la derecha.

También necesitarás un bucle para la espiral (4). Si dibujas una serie de puntos, con cada punto moviéndose más lejos a lo largo de un círculo alrededor del centro de la espiral, obtienes un círculo. Si, durante el bucle, varías el radio del círculo en el que estás poniendo el punto actual y das más de una vuelta, el resultado es una espiral.

{{index "método quadraticCurveTo"}}

La estrella (5) representada está construida con líneas `quadraticCurveTo`. También podrías dibujar una con líneas rectas. Divide un círculo en ocho piezas para una estrella con ocho puntas, o cuantas piezas desees. Dibuja líneas entre estos puntos, haciéndolas curvar hacia el centro de la estrella. Con `quadraticCurveTo`, puedes usar el centro como punto de control.

hint}}

{{id exercise_pie_chart}}

### El gráfico circular

Anteriormente en este capítulo, vimos un programa de ejemplo que dibujaba un gráfico circular. Modifica este programa para que el nombre de cada categoría se muestre junto a la porción que la representa. Intenta encontrar una forma agradable de posicionar automáticamente este texto que funcione también para otros conjuntos de datos. Puedes asumir que las categorías son lo suficientemente grandes como para dejar espacio suficiente para sus etiquetas.

Podrías necesitar `Math.sin` y `Math.cos` de nuevo, que se describen en [Capítulo ?](dom#sin_cos).

{{if interactive

{{if interactive

```{lang: html, test: no}
<canvas width="600" height="300"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");
  let total = results
    .reduce((sum, {count}) => sum + count, 0);
  let currentAngle = -0.5 * Math.PI;
  let centerX = 300, centerY = 150;

  // Add code to draw the slice labels in this loop.
  for (let result of results) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    cx.arc(centerX, centerY, 100,
           currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(centerX, centerY);
    cx.fillStyle = result.color;
    cx.fill();
  }
</script>
```

if}}

{{hint

{{index "fillText method", "textAlign property", "textBaseline property", "pie chart example"}}

Necesitarás llamar a `fillText` y establecer las propiedades `textAlign` y `textBaseline` del contexto de manera que el texto termine donde quieras.

Una forma sensata de posicionar las etiquetas sería poner el texto en la línea que va desde el centro del círculo a través del medio de la porción. No quieres poner el texto directamente contra el lado del círculo, sino mover el texto hacia afuera del círculo por un número determinado de píxeles.

El ángulo de esta línea es `currentAngle + 0.5 * sliceAngle`. El siguiente código encuentra una posición en esta línea a 120 píxeles del centro:

```{test: no}
let middleAngle = currentAngle + 0.5 * sliceAngle;
let textX = Math.cos(middleAngle) * 120 + centerX;
let textY = Math.sin(middleAngle) * 120 + centerY;
```

Para `textBaseline`, el valor `"middle"` probablemente sea apropiado al usar este enfoque. Lo que se debe usar para `textAlign` depende de en qué lado del círculo nos encontremos. En el lado izquierdo, debería ser `"right"`, y en el lado derecho, debería ser `"left"`, de manera que el texto se posicione lejos del círculo.

{{index "Math.cos function"}}

Si no estás seguro de cómo averiguar en qué lado del círculo se encuentra un ángulo dado, consulta la explicación de `Math.cos` en [Capítulo ?](dom#sin_cos). El coseno de un ángulo nos indica qué coordenada x le corresponde, lo que a su vez nos dice exactamente en qué lado del círculo estamos.

hint}}

### Una pelota rebotando

Utiliza la técnica de `requestAnimationFrame` que vimos en [Capítulo ?](dom#animationFrame) y [Capítulo ?](game#runAnimation) para dibujar una caja con una pelota rebotando dentro. La pelota se mueve a una velocidad constante y rebota en los lados de la caja cuando los alcanza.

{{if interactive

```{lang: html, test: no}
<canvas width="400" height="400"></canvas>
<script>
  let cx = document.querySelector("canvas").getContext("2d");

  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      updateAnimation(Math.min(100, time - lastTime) / 1000);
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  function updateAnimation(step) {
    // Tu código aquí.
  }
</script>
```

if}}

{{hint

{{index "método strokeRect", animación, "método arc"}}

Un ((cuadro)) es fácil de dibujar con `strokeRect`. Define una variable que contenga su tamaño o define dos variables si el ancho y alto de tu cuadro difieren. Para crear una ((pelota)) redonda, comienza un camino y llama a `arc(x, y, radio, 0, 7)`, que crea un arco que va desde cero a más de un círculo completo. Luego rellena el camino.

{{index "detección de colisiones", "clase Vec"}}

Para modelar la posición y la ((velocidad)) de la pelota, puedes usar la clase `Vec` del [Capítulo ?](game#vector) (que está disponible en esta página){if interactive}. Dale una velocidad inicial, preferiblemente una que no sea puramente vertical u horizontal, y en cada ((cuadro)) multiplica esa velocidad por la cantidad de tiempo transcurrido. Cuando la pelota se acerca demasiado a una pared vertical, invierte el componente x en su velocidad. De manera similar, invierte el componente y cuando golpea una pared horizontal.

{{index "método clearRect", limpieza}}

Después de encontrar la nueva posición y velocidad de la pelota, usa `clearRect` para borrar la escena y vuélvela a dibujar usando la nueva posición.

hint}}

### Reflejo precalculado

{{index optimización, "gráficos de mapa de bits", espejo}}

Una desventaja de las ((transformaciones)) es que ralentizan el dibujo de mapas de bits. La posición y el tamaño de cada ((píxel)) deben ser transformados, y aunque es posible que los ((navegadores)) se vuelvan más inteligentes sobre las transformaciones en el ((futuro)), actualmente causan un aumento medible en el tiempo que lleva dibujar un mapa de bits.

En un juego como el nuestro, en el que solo estamos dibujando un sprite transformado, esto no es un problema. Pero imagina que necesitamos dibujar cientos de personajes o miles de partículas giratorias de una explosión.

Piensa en una forma de permitirnos dibujar un personaje invertido sin cargar archivos de imagen adicionales y sin tener que hacer llamadas transformadas de `drawImage` en cada cuadro.

{{hint

{{index espejo, escalado, "método drawImage"}}

La clave para la solución está en el hecho de que podemos usar un elemento ((canvas)) como imagen de origen al usar `drawImage`. Es posible crear un elemento `<canvas>` adicional, sin agregarlo al documento, y dibujar nuestros sprites invertidos en él, una vez. Al dibujar un cuadro real, simplemente copiamos los sprites ya invertidos al lienzo principal.

{{index "evento de carga"}}

Se requeriría cierto cuidado porque las imágenes no se cargan instantáneamente. Hacemos el dibujo invertido solo una vez y, si lo hacemos antes de que la imagen se cargue, no dibujará nada. Se puede usar un controlador de `"load"` en la imagen para dibujar las imágenes invertidas en el lienzo adicional. Este lienzo se puede usar como fuente de dibujo inmediatamente (simplemente estará en blanco hasta que dibujemos el personaje en él).

hint}}