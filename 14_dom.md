# El Modelo de Objetos del Documento

{{quote {author: "Friedrich Nietzsche", title: "Más allá del bien y del mal", chapter: true}

¡Qué mal! ¡La misma vieja historia! Una vez que has terminado de construir tu casa, te das cuenta de que has aprendido accidentalmente algo que realmente deberías haber sabido antes de comenzar.

quote}}

{{figure {url: "img/chapter_picture_14.jpg", alt: "Ilustración que muestra un árbol con letras, imágenes y engranajes colgando de sus ramas", chapter: "framed"}}}

{{index dibujo, análisis}}

Cuando abres una página web, tu navegador recupera el texto ((HTML)) de la página y lo analiza, de manera similar a como nuestro analizador de [Capítulo ?](language#parsing) analizaba programas. El navegador construye un modelo de la ((estructura)) del documento y utiliza este modelo para dibujar la página en la pantalla.

{{index "estructura de datos en vivo"}}

Esta representación del ((documento)) es uno de los juguetes que un programa JavaScript tiene disponible en su ((caja de arena)). Es una ((estructura de datos)) que puedes leer o modificar. Actúa como una estructura de datos _en vivo_: cuando se modifica, la página en la pantalla se actualiza para reflejar los cambios.

## Estructura del documento

{{index [HTML, estructura]}}

Puedes imaginar un documento HTML como un conjunto anidado de ((caja))s. Etiquetas como `<body>` y `</body>` encierran otras ((etiqueta))s, que a su vez contienen otras etiquetas o ((texto)). Aquí está el documento de ejemplo del [capítulo anterior](browser):

```{lang: html, sandbox: "homepage"}
<!doctype html>
<html>
  <head>
    <title>Mi página de inicio</title>
  </head>
  <body>
    <h1>Mi página de inicio</h1>
    <p>Hola, soy Marijn y esta es mi página de inicio.</p>
    <p>¡También escribí un libro! Léelo
      <a href="http://eloquentjavascript.net">aquí</a>.</p>
  </body>
</html>
```

Esta página tiene la siguiente estructura:

{{figure {url: "img/html-boxes.svg", alt: "Diagrama que muestra un documento HTML como un conjunto de cajas anidadas. La caja externa está etiquetada como 'html' y contiene dos cajas etiquetadas 'head' y 'body'. Dentro de ellas hay más cajas, con algunas de las cajas más internas que contienen el texto del documento.", width: "7cm"}}}

{{indexsee "Modelo de Objetos del Documento", DOM}}

La estructura de datos que el navegador utiliza para representar el documento sigue esta forma. Para cada caja, hay un objeto con el que podemos interactuar para saber cosas como qué etiqueta HTML representa y qué cajas y texto contiene. Esta representación se llama _Modelo de Objetos del Documento_, o ((DOM)) en resumen.

{{index "propiedad documentElement", "propiedad head", "propiedad body", "html (etiqueta HTML)", "body (etiqueta HTML)", "head (etiqueta HTML)"}}

El enlace global `document` nos da acceso a estos objetos. Su propiedad `documentElement` se refiere al objeto que representa la etiqueta `<html>`. Dado que cada documento HTML tiene una cabeza y un cuerpo, también tiene propiedades `head` y `body`, que apuntan a esos elementos.

## Árboles

{{index [anidamiento, "de objetos"]}}

Piensa en los ((árbol sintáctico))s del [Capítulo ?](language#parsing) por un momento. Sus estructuras son sorprendentemente similares a la estructura de un documento de un navegador. Cada _((nodo))_ puede referirse a otros nodos, _hijos_, que a su vez pueden tener sus propios hijos. Esta forma es típica de estructuras anidadas donde los elementos pueden contener subelementos que son similares a ellos mismos.

{{index "propiedad documentElement", [DOM, "árbol"]}}

Llamamos a una estructura de datos un _((árbol))_ cuando tiene una estructura de ramificación, no tiene ((ciclo))s (un nodo no puede contenerse a sí mismo, directa o indirectamente), y tiene un _((raíz))_ única y bien definida. En el caso del DOM, `document.documentElement` sirve como la raíz.

{{index ordenamiento, ["estructura de datos", "árbol"], "árbol de sintaxis"}}

Los árboles son comunes en la informática. Además de representar estructuras recursivas como documentos HTML o programas, a menudo se utilizan para mantener ((conjunto))s de datos ordenados porque los elementos generalmente se pueden encontrar o insertar de manera más eficiente en un árbol que en un arreglo plano.

{{index "nodo hoja", "Lenguaje Egg"}}

Un árbol típico tiene diferentes tipos de ((nodo))s. El árbol de sintaxis para [el lenguaje Egg](language) tenía identificadores, valores y nodos de aplicación. Los nodos de aplicación pueden tener hijos, mientras que los identificadores y valores son _hojas_, o nodos sin hijos.

{{index "propiedad body", [HTML, estructura]}}

Lo mismo ocurre para el DOM. Los nodos de los _((elemento))s_, que representan etiquetas HTML, determinan la estructura del documento. Estos pueden tener ((nodo hijo))s. Un ejemplo de dicho nodo es `document.body`. Algunos de estos hijos pueden ser ((nodo hoja)), como fragmentos de ((texto)) o nodos ((comentario)).

{{index "nodo de texto", elemento, "código NODE_ELEMENT", "código NODE_COMMENT", "código NODE_TEXT", "propiedad nodeType"}}

Cada objeto de nodo del DOM tiene una propiedad `nodeType`, que contiene un código (número) que identifica el tipo de nodo. Los elementos tienen el código 1, que también se define como la propiedad constante `Node.ELEMENT_NODE`. Los nodos de texto, que representan una sección de texto en el documento, obtienen el código 3 (`Node.TEXT_NODE`). Los comentarios tienen el código 8 (`Node.COMMENT_NODE`).

Otra forma de visualizar nuestro ((árbol)) de documento es la siguiente:

{{figure {url: "img/html-tree.svg", alt: "Diagrama que muestra el documento HTML como un árbol, con flechas de nodos padres a nodos hijos", width: "8cm"}}}

Las hojas son nodos de texto, y las flechas indican las relaciones padre-hijo entre nodos.

{{id estándar}}

## El estándar

{{index "lenguaje de programación", [interfaz, diseño], [DOM, interfaz]}}

Usar códigos numéricos crípticos para representar tipos de nodos no es algo muy propio de JavaScript. Más adelante en este capítulo, veremos que otras partes de la interfaz del DOM también se sienten incómodas y extrañas. La razón de esto es que la interfaz del DOM no fue diseñada exclusivamente para JavaScript. Más bien, intenta ser una interfaz neutral en cuanto a lenguaje que también pueda utilizarse en otros sistemas, no solo para HTML, sino también para ((XML)), que es un formato de datos genérico con una sintaxis similar a HTML.

{{index consistencia, integración}}

Esto es lamentable. Los estándares a menudo son útiles. Pero en este caso, la ventaja (consistencia entre lenguajes) no es tan convincente. Tener una interfaz que esté correctamente integrada con el lenguaje que estás utilizando te ahorrará más tiempo que tener una interfaz familiar en varios lenguajes.

{{index "objeto similar a arreglo", "tipo NodeList"}}Como ejemplo de esta mala integración, considera la propiedad `childNodes` que tienen los nodos de elementos en el DOM. Esta propiedad contiene un objeto similar a un array, con una propiedad `length` y propiedades etiquetadas por números para acceder a los nodos hijos. Pero es una instancia del tipo `NodeList`, no un array real, por lo que no tiene métodos como `slice` y `map`.

{{index [interface, design], [DOM, construction], "side effect"}}

Luego, hay problemas que son simplemente de mala diseño. Por ejemplo, no hay forma de crear un nuevo nodo y agregar inmediatamente hijos o ((atributos)) a él. En su lugar, primero tienes que crearlo y luego agregar los hijos y atributos uno por uno, usando efectos secundarios. El código que interactúa mucho con el DOM tiende a ser largo, repetitivo y feo.

{{index library}}

Pero estos defectos no son fatales. Dado que JavaScript nos permite crear nuestras propias ((abstracciones)), es posible diseñar formas mejoradas de expresar las operaciones que estás realizando. Muchas bibliotecas destinadas a la programación del navegador vienen con herramientas de este tipo.

## Movimiento a través del árbol

{{index pointer}}

Los nodos DOM contienen una gran cantidad de ((enlace))s a otros nodos cercanos. El siguiente diagrama ilustra esto:

{{figure {url: "img/html-links.svg", alt: "Diagrama que muestra los enlaces entre nodos DOM. El nodo 'body' se muestra como un cuadro, con una flecha 'firstChild' apuntando al nodo 'h1' en su inicio, una flecha 'lastChild' apuntando al último nodo de párrafo, y una flecha 'childNodes' apuntando a un array de enlaces a todos sus hijos. El párrafo del medio tiene una flecha 'previousSibling' apuntando al nodo anterior, una flecha 'nextSibling' al nodo siguiente, y una flecha 'parentNode' apuntando al nodo 'body'.", width: "6cm"}}}

{{index "child node", "parentNode property", "childNodes property"}}

Aunque el diagrama muestra solo un enlace de cada tipo, cada nodo tiene una propiedad `parentNode` que apunta al nodo del que forma parte, si lo hay. De igual manera, cada nodo de elemento (tipo 1) tiene una propiedad `childNodes` que apunta a un objeto similar a un array que contiene sus hijos.

{{index "firstChild property", "lastChild property", "previousSibling property", "nextSibling property"}}

En teoría, podrías moverte por todo el árbol utilizando solo estos enlaces padre e hijo. Pero JavaScript también te da acceso a varios enlaces de conveniencia adicionales. Las propiedades `firstChild` y `lastChild` apuntan a los primeros y últimos elementos hijos o tienen el valor `null` para nodos sin hijos. De manera similar, `previousSibling` y `nextSibling` apuntan a nodos adyacentes, que son nodos con el mismo padre que aparecen inmediatamente antes o después del nodo en sí. Para un primer hijo, `previousSibling` será nulo, y para un último hijo, `nextSibling` será nulo.

{{index "children property", "text node", element}}

También está la propiedad `children`, que es como `childNodes` pero contiene solo hijos de elementos (tipo 1), no otros tipos de nodos hijos. Esto puede ser útil cuando no estás interesado en nodos de texto.

{{index "función talksAbout", "recursión", [anidamiento, "de objetos"]}}

Cuando se trabaja con una estructura de datos anidada como esta, las funciones recursivas son frecuentemente útiles. La siguiente función examina un documento en busca de nodos de texto que contengan una cadena específica y devuelve `true` cuando ha encontrado uno:

{{id talksAbout}}

```{sandbox: "homepage"}
function talksAbout(node, cadena) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    for (let child of node.childNodes) {
      if (talksAbout(child, cadena)) {
        return true;
      }
    }
    return false;
  } else if (node.nodeType == Node.TEXT_NODE) {
    return node.nodeValue.indexOf(cadena) > -1;
  }
}

console.log(talksAbout(document.body, "libro"));
// → true
```

{{index "propiedad nodeValue"}}

La propiedad `nodeValue` de un nodo de texto contiene la cadena de texto que representa.

## Encontrando elementos

{{index [DOM, consultas], "propiedad body", "codificación en duro", [espacios en blanco, "en HTML"]}}

Navegar por estos enlaces entre padres, hijos y hermanos a menudo es útil. Pero si queremos encontrar un nodo específico en el documento, llegar a él empezando por `document.body` y siguiendo un camino fijo de propiedades no es una buena idea. Hacerlo implica hacer suposiciones en nuestro programa sobre la estructura precisa del documento, una estructura que podrías querer cambiar más adelante. Otro factor complicador es que se crean nodos de texto incluso para los espacios en blanco entre nodos. La etiqueta `<body>` del documento de ejemplo no tiene solo tres hijos (`<h1>` y dos elementos `<p>`) sino que en realidad tiene siete: esos tres, más los espacios en blanco antes, después y entre ellos.

{{index "problema de búsqueda", "atributo href", "método getElementsByTagName"}}

Por lo tanto, si queremos obtener el atributo `href` del enlace en ese documento, no queremos decir algo como "Obtener el segundo hijo del sexto hijo del cuerpo del documento". Sería mejor si pudiéramos decir "Obtener el primer enlace en el documento". Y podemos hacerlo.

```{sandbox: "homepage"}
let enlace = document.body.getElementsByTagName("a")[0];
console.log(enlace.href);
```

{{index "nodo hijo"}}

Todos los nodos de elemento tienen un método `getElementsByTagName`, que recoge todos los elementos con el nombre de etiqueta dado que son descendientes (hijos directos o indirectos) de ese nodo y los devuelve como un ((objeto similar a un array)).

{{index "atributo id", "método getElementById"}}

Para encontrar un nodo específico _único_, puedes darle un atributo `id` y usar `document.getElementById` en su lugar.

```{lang: html}
<p>Mi avestruz Gertrudis:</p>
<p><img id="gertrudis" src="img/ostrich.png"></p>

<script>
  let ostrich = document.getElementById("gertrudis");
  console.log(ostrich.src);
</script>
```

{{index "método getElementsByClassName", "atributo class"}}

Un tercer método similar es `getElementsByClassName`, que, al igual que `getElementsByTagName`, busca a través del contenido de un nodo de elemento y recupera todos los elementos que tienen la cadena dada en su atributo `class`.

## Cambiando el documento

{{index "efecto secundario", "método removeChild", "método appendChild", "método insertBefore", [construcción, DOM], [modificación, DOM]}}Casi todo se puede cambiar en la estructura de datos del DOM. La forma del árbol del documento se puede modificar cambiando las relaciones padre-hijo. Los nodos tienen un método `remove` para removerlos de su nodo padre actual. Para añadir un nodo hijo a un nodo de elemento, podemos usar `appendChild`, que lo coloca al final de la lista de hijos, o `insertBefore`, que inserta el nodo dado como primer argumento antes del nodo dado como segundo argumento.

```{lang: html}
<p>Uno</p>
<p>Dos</p>
<p>Tres</p>

<script>
  let párrafos = document.body.getElementsByTagName("p");
  document.body.insertBefore(párrafos[2], párrafos[0]);
</script>
```

Un nodo puede existir en el documento en un solo lugar. Por lo tanto, insertar el párrafo _Tres_ delante del párrafo _Uno_ primero lo removerá del final del documento y luego lo insertará al principio, resultando en _Tres_/_Uno_/_Dos_. Todas las operaciones que insertan un nodo en algún lugar causarán, como un ((efecto secundario)), que se elimine de su posición actual (si tiene una).

{{index "insertBefore method", "replaceChild method"}}

El método `replaceChild` se usa para reemplazar un nodo hijo con otro. Toma como argumentos dos nodos: un nodo nuevo y el nodo que se reemplazará. El nodo reemplazado debe ser un hijo del elemento en el que se llama el método. Ten en cuenta que tanto `replaceChild` como `insertBefore` esperan que el nodo _nuevo_ sea su primer argumento.

## Creación de nodos

{{index "alt attribute", "img (HTML tag)"}}

Digamos que queremos escribir un script que reemplace todas las ((imágenes)) (etiquetas `<img>`) en el documento con el texto contenido en sus atributos `alt`, que especifica una representación textual alternativa de la imagen.

{{index "createTextNode method"}}

Esto implica no solo eliminar las imágenes sino agregar un nuevo nodo de texto para reemplazarlas.

```{lang: html}
<p>The <img src="img/cat.png" alt="Cat"> in the
  <img src="img/hat.png" alt="Hat">.</p>

<p><button onclick="replaceImages()">Replace</button></p>

<script>
  function replaceImages() {
    let images = document.body.getElementsByTagName("img");
    for (let i = images.length - 1; i >= 0; i--) {
      let image = images[i];
      if (image.alt) {
        let text = document.createTextNode(image.alt);
        image.parentNode.replaceChild(text, image);
      }
    }
  }
</script>
```

{{index "text node"}}

Dada una cadena, `createTextNode` nos da un nodo de texto que podemos insertar en el documento para que aparezca en la pantalla.

{{index "live data structure", "getElementsByTagName method", "childNodes property"}}

El bucle que recorre las imágenes comienza al final de la lista. Esto es necesario porque la lista de nodos devuelta por un método como `getElementsByTagName` (o una propiedad como `childNodes`) es _dinámica_. Es decir, se actualiza a medida que el documento cambia. Si comenzáramos desde el principio, al quitar la primera imagen haría que la lista perdiera su primer elemento, por lo que la segunda vez que se repita el bucle, cuando `i` es 1, se detendría porque la longitud de la colección ahora también es 1.

{{index "método slice"}}

Si quieres tener una colección _sólida_ de nodos, en lugar de una en vivo, puedes convertir la colección en un array real llamando a `Array.from`.

```
let arrayish = {0: "uno", 1: "dos", length: 2};
let array = Array.from(arrayish);
console.log(array.map(s => s.toUpperCase()));
// → ["UNO", "DOS"]
```

{{index "método createElement"}}

Para crear nodos ((elemento)), puedes utilizar el método `document.createElement`. Este método toma un nombre de etiqueta y devuelve un nuevo nodo vacío del tipo dado.

{{index "Popper, Karl", [DOM, construcción], "función elt"}}

{{id elt}}

El siguiente ejemplo define una utilidad `elt`, que crea un nodo de elemento y trata el resto de sus argumentos como hijos de ese nodo. Luego, esta función se utiliza para agregar una atribución a una cita.

```{lang: html}
<blockquote id="quote">
  Ningún libro puede considerarse terminado. Mientras trabajamos en él aprendemos
  lo suficiente como para encontrarlo inmaduro en el momento en que lo dejamos.
</blockquote>

<script>
  function elt(type, ...children) {
    let node = document.createElement(type);
    for (let child of children) {
      if (typeof child != "string") node.appendChild(child);
      else node.appendChild(document.createTextNode(child));
    }
    return node;
  }

  document.getElementById("quote").appendChild(
    elt("footer", "—",
        elt("strong", "Karl Popper"),
        ", prefacio de la segunda edición de ",
        elt("em", "La sociedad abierta y sus enemigos"),
        ", 1950"));
</script>
```

{{if book

Así es como se vería el documento resultante:

{{figure {url: "img/blockquote.png", alt: "Imagen renderizada de la cita con atribución", width: "8cm"}}}

if}}

## Atributos

{{index "atributo href", [DOM, atributos]}}

Algunos ((atributo))s de elementos, como `href` para enlaces, pueden ser accedidos a través de una propiedad con el mismo nombre en el objeto ((DOM)) del elemento. Este es el caso para la mayoría de atributos estándar comúnmente usados.

{{index "atributo data", "método getAttribute", "método setAttribute", atributo}}

HTML te permite establecer cualquier atributo que desees en los nodos. Esto puede ser útil porque te permite almacenar información adicional en un documento. Para leer o cambiar atributos personalizados, que no están disponibles como propiedades regulares del objeto, debes usar los métodos `getAttribute` y `setAttribute`.

```{lang: html}
<p data-classified="secreto">El código de lanzamiento es 00000000.</p>
<p data-classified="no clasificado">Tengo dos pies.</p>

<script>
  let paras = document.body.getElementsByTagName("p");
  for (let para of Array.from(paras)) {
    if (para.getAttribute("data-classified") == "secreto") {
      para.remove();
    }
  }
</script>
```

Se recomienda prefijar los nombres de estos atributos inventados con `data-` para asegurarse de que no entren en conflicto con otros atributos.

{{index "método getAttribute", "método setAttribute", "propiedad className", "atributo class"}}

Existe un atributo comúnmente usado, `class`, que es una ((palabra clave)) en el lenguaje JavaScript. Por razones históricas—algunas implementaciones antiguas de JavaScript no podían manejar nombres de propiedades que coincidieran con palabras clave—la propiedad utilizada para acceder a este atributo se llama `className`. También puedes acceder a él con su nombre real, `"class"`, utilizando los métodos `getAttribute` y `setAttribute`.

## Diseño

{{index "diseño", "elemento de bloque", "elemento en línea", "etiqueta `p` (HTML)", "etiqueta `h1` (HTML)", "etiqueta `a` (HTML)", "etiqueta `strong` (HTML)"}}

Puede que hayas notado que diferentes tipos de elementos se disponen de manera diferente. Algunos, como párrafos (`<p>`) o encabezados (`<h1>`), ocupan todo el ancho del documento y se muestran en líneas separadas. Estos se llaman elementos de _bloque_. Otros, como enlaces (`<a>`) o el elemento `<strong>`, se muestran en la misma línea que el texto que los rodea. A estos elementos se les llama elementos _en línea_.

{{index dibujo}}

Para cualquier documento dado, los navegadores son capaces de calcular un diseño, que le da a cada elemento un tamaño y posición basados en su tipo y contenido. Luego, este diseño se usa para dibujar el documento realmente.

{{index "borde (CSS)", "propiedad `offsetWidth`", "propiedad `offsetHeight`", "propiedad `clientWidth`", "propiedad `clientHeight`", dimensiones}}

El tamaño y posición de un elemento pueden ser accedidos desde JavaScript. Las propiedades `offsetWidth` y `offsetHeight` te dan el espacio que el elemento ocupa en _((píxeles))_. Un píxel es la unidad básica de medida en el navegador. Tradicionalmente corresponde al punto más pequeño que la pantalla puede dibujar, pero en pantallas modernas, que pueden dibujar puntos _muy_ pequeños, eso puede que ya no sea cierto, y un píxel del navegador puede abarcar múltiples puntos de la pantalla.

De manera similar, `clientWidth` y `clientHeight` te dan el tamaño del espacio _dentro_ del elemento, ignorando el ancho del borde.

```{lang: html}
<p style="border: 3px solid red">
  Estoy enmarcado
</p>

<script>
  let para = document.body.getElementsByTagName("p")[0];
  console.log("clientHeight:", para.clientHeight);
  // → 19
  console.log("offsetHeight:", para.offsetHeight);
  // → 25
</script>
```

{{if book

Darle a un párrafo un borde hace que se dibuje un rectángulo a su alrededor.

{{figure {url: "img/boxed-in.png", alt: "Imagen renderizada de un párrafo con un borde", width: "8cm"}}}

if}}

{{index "método `getBoundingClientRect`", posición, propiedad `pageXOffset`, propiedad `pageYOffset`}}

{{id rectánguloDelimitador}}

La manera más efectiva de encontrar la posición precisa de un elemento en la pantalla es el método `getBoundingClientRect`. Devuelve un objeto con las propiedades `top`, `bottom`, `left` y `right`, indicando las posiciones en píxeles de los lados del elemento en relación con la esquina superior izquierda de la pantalla. Si los quieres en relación al documento completo, debes sumar la posición actual de desplazamiento, que puedes encontrar en las variables `pageXOffset` y `pageYOffset`.

{{index "propiedad `offsetHeight`", "método `getBoundingClientRect`", dibujo, pereza, rendimiento, eficiencia}}

Diseñar un documento puede ser bastante trabajo. En aras de la rapidez, los motores de los navegadores no vuelven a diseñar inmediatamente un documento cada vez que se modifica, sino que esperan tanto como pueden. Cuando un programa de JavaScript que ha modificado el documento finaliza su ejecución, el navegador tendrá que calcular un nuevo diseño para dibujar el documento modificado en la pantalla. Cuando un programa _pide_ la posición o tamaño de algo leyendo propiedades como `offsetHeight` o llamando a `getBoundingClientRect`, proporcionar esa información también requiere calcular un ((diseño)).

{{index "side effect", "optimización", benchmark}}

Un programa que alterna repetidamente entre la lectura de información de diseño del DOM y el cambio del DOM provoca que se realicen muchas computaciones de diseño y, en consecuencia, se ejecute muy lentamente. El siguiente código es un ejemplo de esto. Contiene dos programas diferentes que construyen una línea de caracteres _X_ de 2,000 píxeles de ancho y mide el tiempo que lleva cada uno.

```{lang: html, test: nonumbers}
<p><span id="one"></span></p>
<p><span id="two"></span></p>

<script>
  function time(name, action) {
    let start = Date.now(); // Tiempo actual en milisegundos
    action();
    console.log(name, "tomó", Date.now() - start, "ms");
  }

  time("ingenuo", () => {
    let target = document.getElementById("one");
    while (target.offsetWidth < 2000) {
      target.appendChild(document.createTextNode("X"));
    }
  });
  // → ingenuo tomó 32 ms

  time("astuto", function() {
    let target = document.getElementById("two");
    target.appendChild(document.createTextNode("XXXXX"));
    let total = Math.ceil(2000 / (target.offsetWidth / 5));
    target.firstChild.nodeValue = "X".repeat(total);
  });
  // → astuto tomó 1 ms
</script>
```

## Estilos

{{index "elemento de bloque", "elemento en línea", estilo, "strong (etiqueta HTML)", "a (etiqueta HTML)", subrayado}}

Hemos visto que diferentes elementos HTML se dibujan de manera diferente. Algunos se muestran como bloques, otros en línea. Algunos agregan estilos: `<strong>` hace que su contenido sea ((negrita)), y `<a>` lo hace azul y lo subraya.

{{index "img (etiqueta HTML)", "comportamiento por defecto", "atributo de estilo"}}

La forma en que una etiqueta `<img>` muestra una imagen o una etiqueta `<a>` hace que se siga un enlace al hacer clic está fuertemente vinculada al tipo de elemento. Pero podemos cambiar el estilo asociado con un elemento, como el color del texto o el subrayado. Aquí hay un ejemplo que utiliza la propiedad `style`:

```{lang: html}
<p><a href=".">Enlace normal</a></p>
<p><a href="." style="color: green">Enlace verde</a></p>
```

{{if book

El segundo enlace será verde en lugar del color de enlace predeterminado.

{{figure {url: "img/colored-links.png", alt: "Imagen renderizada de un enlace azul normal y un enlace verde con estilo", width: "2.2cm"}}}

if}}

{{index "borde (CSS)", "color (CSS)", CSS, "carácter dos puntos"}}

Un atributo de estilo puede contener uno o más _((declaración))es_, que son una propiedad (como `color`) seguida de dos puntos y un valor (como `verde`). Cuando hay más de una declaración, deben separarse por ((punto y coma))s, como en `"color: rojo; border: ninguno"`.

{{index "display (CSS)", diseño}}

Muchos aspectos del documento pueden ser influenciados por el estilo. Por ejemplo, la propiedad `display` controla si un elemento se muestra como un bloque o como un elemento en línea.

```{lang: html}
Este texto se muestra de forma <strong>en línea</strong>,
<strong style="display: block">como un bloque</strong>, y
<strong style="display: none">no del todo</strong>.
```

{{index "elemento oculto"}}

La etiqueta `block` terminará en su propia línea ya que los ((elementos de bloque)) no se muestran en línea con el texto que los rodea. La última etiqueta no se muestra en absoluto: `display: none` evita que un elemento aparezca en la pantalla. Esta es una forma de ocultar elementos. A menudo es preferible a eliminarlos completamente del documento porque facilita revelarlos nuevamente más tarde.

{{if book

{{figure {url: "img/display.png", alt: "Diferentes estilos de visualización", width: "4cm"}}}

if}}

{{index "color (CSS)", "atributo de estilo"}}

El código JavaScript puede manipular directamente el estilo de un elemento a través de la propiedad `style` del elemento. Esta propiedad contiene un objeto que tiene propiedades para todas las posibles propiedades de estilo. Los valores de estas propiedades son cadenas de texto, a las cuales podemos escribir para cambiar un aspecto particular del estilo del elemento.

```{lang: html}
<p id="para" style="color: purple">
  Texto bonito
</p>

<script>
  let para = document.getElementById("para");
  console.log(para.style.color);
  para.style.color = "magenta";
</script>
```

{{index "camel case", capitalización, "carácter guion", "font-family (CSS)"}}

Algunos nombres de propiedades de estilo contienen guiones, como `font-family`. Debido a que trabajar con estos nombres de propiedades en JavaScript es incómodo (tendrías que decir `style["font-family"]`), los nombres de las propiedades en el objeto `style` para tales propiedades tienen los guiones eliminados y las letras posterior a ellos en mayúscula (`style.fontFamily`).

## Estilos en cascada

{{index "regla (CSS)", "estilo (etiqueta HTML)"}}

{{indexsee "Hojas de Estilo en Cascada", CSS}}
{{indexsee "hoja de estilo", CSS}}

El sistema de estilos para HTML se llama ((CSS)), por sus siglas en inglés, _Cascading Style Sheets_. Una _hoja de estilo_ es un conjunto de reglas sobre cómo dar estilo a los elementos en un documento. Puede ser proporcionada dentro de una etiqueta `<style>`.

```{lang: html}
<style>
  strong {
    font-style: italic;
    color: gray;
  }
</style>
<p>Ahora el <strong>texto fuerte</strong> es cursiva y gris.</p>
```

{{index "regla (CSS)", "font-weight (CSS)", overlay}}

El _((cascada))_ en el nombre se refiere al hecho de que múltiples reglas de este tipo se combinan para producir el estilo final de un elemento. En el ejemplo, el estilo predeterminado de las etiquetas `<strong>`, que les da `font-weight: bold`, se superpone por la regla en la etiqueta `<style>`, que agrega `font-style` y `color`.

{{index "estilo (etiqueta HTML)", "atributo de estilo"}}

Cuando múltiples reglas definen un valor para la misma propiedad, la regla más recientemente leída obtiene una ((precedencia)) más alta y gana. Por lo tanto, si la regla en la etiqueta `<style>` incluyera `font-weight: normal`, contradiciendo la regla predeterminada de `font-weight`, el texto sería normal, _no_ negrita. Los estilos en un atributo `style` aplicado directamente al nodo tienen la mayor precedencia y siempre prevalecen.

{{index unicidad, "atributo class", "atributo id"}}

Es posible apuntar a cosas distintas de los nombres de ((etiqueta)) en reglas de CSS. Una regla para `.abc` se aplica a todos los elementos con `"abc"` en su atributo `class`. Una regla para `#xyz` se aplica al elemento con un atributo `id` de `"xyz"` (que debería ser único dentro del documento).

```{lang: css}
.subtle {
  color: gray;
  font-size: 80%;
}
#header {
  background: blue;
  color: white;
}
/* elementos p con id main y con clases a y b */
p#main.a.b {
  margin-bottom: 20px;
}
```

{{index "regla (CSS)"}}

La regla de ((precedencia)) que favorece a la regla más recientemente definida se aplica solo cuando las reglas tienen la misma _((especificidad))_. La especificidad de una regla es una medida de qué tan precisamente describe los elementos que coinciden, determinada por el número y tipo (etiqueta, clase o ID) de aspectos de elementos que requiere. Por ejemplo, una regla que apunta a `p.a` es más específica que las reglas que apuntan a `p` o simplemente `.a` y, por lo tanto, tendría precedencia sobre ellas.

{{index "direct child node"}}

La notación `p > a {…}` aplica los estilos dados a todas las etiquetas `<a>` que son hijos directos de etiquetas `<p>`. De manera similar, `p a {…}` se aplica a todas las etiquetas `<a>` dentro de las etiquetas `<p>`, ya sean hijos directos o indirectos.

## Selectores de consulta

{{index complexity, CSS}}

No vamos a usar hojas de estilo demasiado en este libro. Entenderlas es útil cuando se programa en el navegador, pero son lo suficientemente complicadas como para justificar un libro aparte.

{{index "domain-specific language", [DOM, querying]}}

La razón principal por la que introduje la sintaxis _((selector))_—la notación utilizada en las hojas de estilo para determinar a qué elementos se aplican un conjunto de estilos— es que podemos utilizar este mismo mini-lenguaje como una forma efectiva de encontrar elementos del DOM.

{{index "querySelectorAll method", "NodeList type"}}

El método `querySelectorAll`, que está definido tanto en el objeto `document` como en los nodos de elementos, toma una cadena de selector y devuelve un `NodeList` que contiene todos los elementos que encuentra.

```{lang: html}
<p>And if you go chasing
  <span class="animal">rabbits</span></p>
<p>And you know you're going to fall</p>
<p>Tell 'em a <span class="character">hookah smoking
  <span class="animal">caterpillar</span></span></p>
<p>Has given you the call</p>

<script>
  function count(selector) {
    return document.querySelectorAll(selector).length;
  }
  console.log(count("p"));           // Todos los elementos <p>
  // → 4
  console.log(count(".animal"));     // Clase animal
  // → 2
  console.log(count("p .animal"));   // Animal dentro de <p>
  // → 2
  console.log(count("p > .animal")); // Hijo directo de <p>
  // → 1
</script>
```

{{index "live data structure"}}

A diferencia de métodos como `getElementsByTagName`, el objeto devuelto por `querySelectorAll` _no_ es dinámico. No cambiará cuando cambies el documento. Aun así, no es un array real, por lo que necesitas llamar a `Array.from` si deseas tratarlo como tal.

{{index "querySelector method"}}

El método `querySelector` (sin la parte `All`) funciona de manera similar. Este es útil si deseas un elemento específico y único. Solo devolverá el primer elemento coincidente o `null` cuando no haya ningún elemento coincidente.

{{id animation}}

## Posicionamiento y animación

{{index "position (CSS)", "relative positioning", "top (CSS)", "left (CSS)", "absolute positioning"}}

La propiedad de estilo `position` influye en el diseño de una manera poderosa. De forma predeterminada, tiene un valor de `static`, lo que significa que el elemento se sitúa en su lugar normal en el documento. Cuando se establece en `relative`, el elemento sigue ocupando espacio en el documento, pero ahora las propiedades de estilo `top` y `left` se pueden usar para moverlo con respecto a ese lugar normal. Cuando `position` se establece en `absolute`, el elemento se elimina del flujo normal del documento, es decir, ya no ocupa espacio y puede superponerse con otros elementos. Además, sus propiedades de `top` y `left` se pueden usar para posicionarlo absolutamente con respecto a la esquina superior izquierda del elemento contenedor más cercano cuya propiedad de `position` no sea `static`, o con respecto al documento si no existe tal elemento contenedor.

{{index ["animación", "gato giratorio"]}}

Podemos usar esto para crear una animación. El siguiente documento muestra una imagen de un gato que se mueve en una ((elipse)):

```{lang: html, startCode: true}
<p style="text-align: center">
  <img src="img/cat.png" style="position: relative">
</p>
<script>
  let cat = document.querySelector("img");
  let angle = Math.PI / 2;
  function animate(time, lastTime) {
    if (lastTime != null) {
      angle += (time - lastTime) * 0.001;
    }
    cat.style.top = (Math.sin(angle) * 20) + "px";
    cat.style.left = (Math.cos(angle) * 200) + "px";
    requestAnimationFrame(newTime => animate(newTime, time));
  }
  requestAnimationFrame(animate);
</script>
```

{{if book

La flecha gris muestra la trayectoria a lo largo de la cual se mueve la imagen.

{{figure {url: "img/cat-animation.png", alt: "A diagram showing a picture of a cat with a circular arrow indicating its motion", width: "8cm"}}}

if}}

{{index "arriba (CSS)", "izquierda (CSS)", centrado, "posicionamiento relativo"}}

Nuestra imagen está centrada en la página y tiene una `posición` de `relative`. Actualizaremos repetidamente los estilos `top` e `left` de esa imagen para moverla.

{{index "función requestAnimationFrame", dibujo, animación}}

{{id animationFrame}}

El script utiliza `requestAnimationFrame` para programar la ejecución de la función `animar` siempre que el navegador esté listo para repintar la pantalla. La función `animar` a su vez vuelve a llamar a `requestAnimationFrame` para programar la siguiente actualización. Cuando la ventana del navegador (o pestaña) está activa, esto provocará que las actualizaciones ocurran a una velocidad de aproximadamente 60 por segundo, lo que suele producir una animación atractiva.

{{index línea de tiempo, bloqueo}}

Si simplemente actualizáramos el DOM en un bucle, la página se congelaría y nada aparecería en la pantalla. Los navegadores no actualizan su pantalla mientras se ejecuta un programa JavaScript, ni permiten ninguna interacción con la página. Por eso necesitamos `requestAnimationFrame` — le indica al navegador que hemos terminado por ahora, y puede continuar haciendo las cosas que hacen los navegadores, como actualizar la pantalla y responder a las acciones del usuario.

{{index "animación suave"}}

La función de animación recibe el ((tiempo)) actual como argumento. Para asegurar que el movimiento del gato por milisegundo sea estable, basa la velocidad a la que cambia el ángulo en la diferencia entre el tiempo actual y el último tiempo en que se ejecutó la función. Si simplemente moviera el ángulo por una cantidad fija por paso, el movimiento se interrumpiría si, por ejemplo, otra tarea pesada que se está ejecutando en la misma computadora impidiera que la función se ejecutara durante una fracción de segundo.

{{index "función Math.cos", "función Math.sin", coseno, seno, trigonometría}}

{{id sin_cos}}

Moverse en ((círculos)) se hace utilizando las funciones trigonométricas `Math.cos` y `Math.sin`. Para aquellos que no estén familiarizados con ellas, las presentaré brevemente ya que ocasionalmente las utilizaremos en este libro.

{{index coordenadas, pi}}

`Math.cos` y `Math.sin` son útiles para encontrar puntos que se encuentran en un círculo alrededor del punto (0,0) con un radio de uno. Ambas funciones interpretan su argumento como la posición en este círculo, con cero denotando el punto en el extremo derecho del círculo, avanzando en el sentido de las agujas del reloj hasta que 2π (aproximadamente 6,28) nos ha llevado alrededor de todo el círculo. `Math.cos` te indica la coordenada x del punto que corresponde a la posición dada, y `Math.sin` devuelve la coordenada y. Las posiciones (o ángulos) mayores que 2π o menores que 0 son válidos, la rotación se repite de manera que _a_+2π se refiere al mismo ((ángulo)) que _a_.

{{index "constante PI"}}

Esta unidad para medir ángulos se llama ((radianes)) — un círculo completo son 2π radianes, similar a cómo son 360 grados al medir en grados. La constante π está disponible como `Math.PI` en JavaScript.

{{figure {url: "img/cos_sin.svg", alt: "Diagrama que muestra el uso del coseno y el seno para calcular coordenadas. Se muestra un círculo con radio 1 con dos puntos en él. El ángulo desde el lado derecho del círculo hasta el punto, en radianes, se utiliza para calcular la posición de cada punto usando 'cos(ángulo)' para la distancia horizontal desde el centro del círculo y sin(ángulo) para la distancia vertical.", width: "6cm"}}}

{{index "variable contador", "función Math.sin", "top (CSS)", "función Math.cos", "left (CSS)", elipse}}

El código de animación del gato mantiene un contador, `angle`, para el ángulo actual de la animación e incrementa el mismo cada vez que se llama la función `animate`. Luego puede usar este ángulo para calcular la posición actual del elemento de imagen. El estilo `top` es calculado con `Math.sin` y multiplicado por 20, que es el radio vertical de nuestra elipse. El estilo `left` se basa en `Math.cos` y multiplicado por 200 para que la elipse sea mucho más ancha que alta.

{{index "unidad (CSS)"}}

Ten en cuenta que los estilos usualmente necesitan _unidades_. En este caso, tenemos que añadir `"px"` al número para indicarle al navegador que estamos contando en ((píxeles)) (en lugar de centímetros, "ems" u otras unidades). Esto es fácil de olvidar. Usar números sin unidades resultará en que tu estilo sea ignorado — a menos que el número sea 0, lo cual siempre significa lo mismo, independientemente de su unidad.

## Resumen

Los programas de JavaScript pueden inspeccionar e interferir con el documento que el navegador está mostrando a través de una estructura de datos llamada el DOM. Esta estructura de datos representa el modelo del documento del navegador, y un programa de JavaScript puede modificarlo para cambiar el documento visible.

El DOM está organizado como un árbol, en el cual los elementos están dispuestos jerárquicamente de acuerdo a la estructura del documento. Los objetos que representan elementos tienen propiedades como `parentNode` y `childNodes`, las cuales pueden ser usadas para navegar a través de este árbol.

La forma en que un documento es mostrado puede ser influenciada por el _estilo_, tanto adjuntando estilos directamente a nodos como definiendo reglas que coincidan con ciertos nodos. Hay muchas propiedades de estilo diferentes, como `color` o `display`. El código de JavaScript puede manipular el estilo de un elemento directamente a través de su propiedad `style`.

## Ejercicios

{{id exercise_table}}

### Construir una tabla

{{index "tabla (etiqueta HTML)"}}

Una tabla HTML se construye con la siguiente estructura de etiquetas:

```{lang: html}
<table>
  <tr>
    <th>nombre</th>
    <th>altura</th>
    <th>lugar</th>
  </tr>
  <tr>
    <td>Kilimanjaro</td>
    <td>5895</td>
    <td>Tanzania</td>
  </tr>
</table>
```

{{index "tr (etiqueta HTML)", "th (etiqueta HTML)", "td (etiqueta HTML)"}}Dado un conjunto de datos de montañas, un array de objetos con propiedades `name`, `height`, y `place`, genera la estructura DOM para una tabla que enumera los objetos. Debería haber una columna por clave y una fila por objeto, además de una fila de encabezado con elementos `<th>` en la parte superior, enumerando los nombres de las columnas.

Escribe esto de manera que las columnas se deriven automáticamente de los objetos, tomando los nombres de las propiedades del primer objeto en los datos.

Muestra la tabla resultante en el documento agregándola al elemento que tenga un atributo `id` de `"mountains"`.

Una vez que tengas esto funcionando, alinea a la derecha las celdas que contienen valores numéricos estableciendo su propiedad `style.textAlign` en `"right"`.

{{if interactive

```{test: no, lang: html}
<h1>Montañas</h1>

<div id="mountains"></div>

<script>
  const MONTAÑAS = [
    {name: "Kilimanjaro", height: 5895, place: "Tanzania"},
    {name: "Everest", height: 8848, place: "Nepal"},
    {name: "Monte Fuji", height: 3776, place: "Japón"},
    {name: "Vaalserberg", height: 323, place: "Países Bajos"},
    {name: "Denali", height: 6168, place: "Estados Unidos"},
    {name: "Popocatépetl", height: 5465, place: "México"},
    {name: "Mont Blanc", height: 4808, place: "Italia/Francia"}
  ];

  // Tu código aquí
</script>
```

if}}

{{hint

{{index "createElement method", "table example", "appendChild method"}}

Puedes usar `document.createElement` para crear nuevos nodos de elementos, `document.createTextNode` para crear nodos de texto y el método `appendChild` para poner nodos en otros nodos.

{{index "Object.keys function"}}

Querrás iterar sobre los nombres de las claves una vez para completar la fila superior y luego nuevamente para cada objeto en el array para construir las filas de datos. Para obtener un array de nombres de claves del primer objeto, `Object.keys` será útil.

{{index "getElementById method", "querySelector method"}}

Para agregar la tabla al nodo padre correcto, puedes usar `document.getElementById` o `document.querySelector` con `"#mountains"` para encontrar el nodo.

hint}}

### Elementos por nombre de etiqueta

{{index "método getElementsByTagName", recursividad}}

El método `document.getElementsByTagName` devuelve todos los elementos hijos con un nombre de etiqueta dado. Implementa tu propia versión de esto como una función que tome un nodo y un string (el nombre de la etiqueta) como argumentos y devuelva un array que contenga todos los nodos de elementos descendientes con el nombre de etiqueta dado. Tu función debe recorrer el documento en sí. No puede usar un método como `querySelectorAll` para hacer el trabajo.

{{index "propiedad nodeName", capitalización, "método toLowerCase", "método toUpperCase"}}

Para encontrar el nombre de etiqueta de un elemento, usa su propiedad `nodeName`. Pero ten en cuenta que esto devolverá el nombre de la etiqueta en mayúsculas. Usa los métodos de string `toLowerCase` o `toUpperCase` para compensar esto.

{{if interactive

```{lang: html, test: no}
<h1>Heading with a <span>span</span> element.</h1>
<p>A paragraph with <span>one</span>, <span>two</span>
  spans.</p>

<script>
  function byTagName(node, tagName) {
    // Your code here.
  }

  console.log(byTagName(document.body, "h1").length);
  // → 1
  console.log(byTagName(document.body, "span").length);
  // → 3
  let para = document.querySelector("p");
  console.log(byTagName(para, "span").length);
  // → 2
</script>
```
if}}

{{hint

{{index "getElementsByTagName method", recursion}}

La solución es más fácil de expresar con una función recursiva, similar a la [función `talksAbout`](dom#talksAbout) definida anteriormente en este capítulo.

{{index concatenation, "concat method", closure}}

Puedes llamar a `byTagname` a sí misma de manera recursiva, concatenando los arrays resultantes para producir la salida. O puedes crear una función interna que se llame a sí misma de manera recursiva y que tenga acceso a un enlace de array definido en la función externa, al cual puede agregar los elementos coincidentes que encuentre. No olvides llamar a la función interna una vez desde la función externa para iniciar el proceso.

{{index "nodeType property", "ELEMENT_NODE code"}}

La función recursiva debe verificar el tipo de nodo. Aquí estamos interesados solo en el tipo de nodo 1 (`Node.ELEMENT_NODE`). Para estos nodos, debemos recorrer sus hijos y, para cada hijo, ver si el hijo coincide con la consulta mientras también hacemos una llamada recursiva en él para inspeccionar sus propios hijos.

hint}}

### El sombrero del gato

Extiende la animación del gato definida anteriormente para que tanto el gato como su sombrero (`<img src="img/hat.png">`) orbiten en lados opuestos de la elipse.

O haz que el sombrero circule alrededor del gato. O altera la animación de alguna otra manera interesante.

{{index "absolute positioning", "top (CSS)", "left (CSS)", "position (CSS)"}}

Para facilitar el posicionamiento de varios objetos, es probablemente una buena idea cambiar a posicionamiento absoluto. Esto significa que `top` y `left` se cuentan en relación al extremo superior izquierdo del documento. Para evitar usar coordenadas negativas, que harían que la imagen se salga de la página visible, puedes agregar un número fijo de píxeles a los valores de posición.

{{if interactive

```{lang: html, test: no}
<style>body { min-height: 200px }</style>
<img src="img/cat.png" id="cat" style="position: absolute">
<img src="img/hat.png" id="hat" style="position: absolute">

<script>
  let cat = document.querySelector("#cat");
  let hat = document.querySelector("#hat");

  let angle = 0;
  let lastTime = null;
  function animate(time) {
    if (lastTime != null) angle += (time - lastTime) * 0.001;
    lastTime = time;
    cat.style.top = (Math.sin(angle) * 40 + 40) + "px";
    cat.style.left = (Math.cos(angle) * 200 + 230) + "px";

    // Your extensions here.

    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
</script>
```

if}}

{{hint

`Math.cos` y `Math.sin` miden los ángulos en radianes, donde un círculo completo es 2π. Para un ángulo dado, puedes obtener el ángulo opuesto sumando la mitad de este, que es `Math.PI`. Esto puede ser útil para poner el sombrero en el lado opuesto de la órbita.

hint}}