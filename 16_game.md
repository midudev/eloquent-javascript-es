{{meta {load_files: ["code/chapter/16_game.js", "code/levels.js", "code/stop_keys.js"], zip: "html", include: ["css/game.css"]}}}

# Proyecto: Un juego de plataformas

{{quote {author: "Iain Banks", title: "The Player of Games", chapter: true}

Toda la realidad es un juego.

quote}}

{{index "Banks, Ian", "capítulo de proyecto", "simulación"}}

{{figure {url: "img/chapter_picture_16.jpg", alt: "Ilustración que muestra un personaje de un juego de computadora saltando sobre lava en un mundo bidimensional", chapter: "framed"}}}

Gran parte de mi fascinación inicial con las computadoras, al igual que la de muchos niños _nerds_, tenía que ver con los ((juegos)) de computadora. Me sentía atraído por los diminutos ((mundos)) simulados que podía manipular y en los que se desarrollaban historias (más o menos), supongo, debido a la forma en que proyectaba mi ((imaginación)) en ellos más que por las posibilidades que realmente ofrecían.

No le desearía a nadie una ((carrera)) en programación de juegos. Al igual que la industria de la ((música)), la discrepancia entre la cantidad de jóvenes entusiastas que desean trabajar en ella y la demanda real de tales personas crea un entorno bastante insalubre. Pero escribir juegos por diversión resulta ser entretenido.

{{index "juego de saltos y carreras", dimensiones}}

Este capítulo guiará a través de la implementación de un pequeño ((juego de plataformas)). Los juegos de plataformas (o juegos de "saltos y carreras") son juegos que esperan que el ((jugador)) mueva una figura a través de un ((mundo)), que generalmente es bidimensional y se ve desde un lado, mientras salta cosas y sobre cosas.

## El juego

{{index minimalismo, "Palef, Thomas", "Dark Blue (juego)"}}

Nuestro ((juego)) estará basado más o menos en [Dark Blue](http://www.lessmilk.com/games/10)[ (_www.lessmilk.com/games/10_)]{if book} de Thomas Palef. He elegido ese juego porque es entretenido, minimalista y se puede construir sin mucho ((código)). Tiene esta pinta:

{{figure {url: "img/darkblue.png", alt: "Captura de pantalla del juego 'Dark Blue', mostrando un mundo hecho de cajas de colores. Hay una caja negra que representa al jugador, de pie sobre líneas blancas en un fondo azul. Pequeñas monedas amarillas flotan en el aire, y hay algunas partes rojas en el fondo que representan lava."}}}

{{index moneda, lava}}

La caja negra representa al ((jugador)), cuya tarea es recolectar las cajas amarillas (monedas) evitando las cosas rojas (lava). Un ((nivel)) se completa cuando se han recolectado todas las monedas.

{{index teclado, saltos}}

El jugador puede moverse con las teclas de flecha izquierda y derecha y puede saltar con la tecla de flecha hacia arriba. Saltar es una especialidad de este personaje del juego. Puede alcanzar varias veces su altura y puede cambiar de dirección en el aire. Esto puede no ser del todo realista, pero ayuda a darle al jugador la sensación de tener un control directo sobre el ((avatar)) en pantalla.

{{index "número fraccionario", "discretización", "vida artificial", "vida electrónica"}}

El ((juego)) consiste en un ((fondo)) estático, dispuesto como una ((rejilla)), con los elementos móviles superpuestos en ese fondo. Cada campo en la rejilla puede ser vacío, sólido o ((lava)). Los elementos móviles son el jugador, las monedas y ciertas piezas de lava. Las posiciones de estos elementos no están restringidas a la rejilla: sus coordenadas pueden ser fraccionarias, permitiendo un ((movimiento)) suave.

## La tecnología

{{index "manejo de eventos", teclado, [DOM, "gráficos"]}}

Usaremos el DOM del ((navegador)) para mostrar el juego y leeremos la entrada del usuario manejando eventos de teclado.

{{index "rectángulo", "fondo (CSS)", "posición (CSS)", "gráficos"}}

El código relacionado con la pantalla y el teclado es solo una pequeña parte del trabajo que necesitamos hacer para construir este ((juego)). Dado que todo se ve como ((caja))s de colores, dibujar es sencillo: creamos elementos del DOM y usamos estilos para darles un color de fondo, tamaño y posición.

{{index "tabla (etiqueta HTML)"}}

Podemos representar el fondo como una tabla ya que es una ((cuadrícula)) inmutable de cuadrados. Los elementos de movimiento libre se pueden superponer utilizando elementos posicionados absolutamente.

{{index rendimiento, [DOM, "gráficos"]}}

En juegos y otros programas que deben animar ((gráficos)) y responder a la ((entrada)) del usuario sin retrasos notables, la ((eficiencia)) es importante. Aunque el DOM no fue diseñado originalmente para gráficos de alto rendimiento, en realidad es mejor en esto de lo que podrías esperarte. Viste algunas ((animacione))s en el [Capítulo ?](dom#animation). En una máquina moderna, un juego simple como este funciona bien, incluso si no nos preocupamos mucho por la ((optimización)).

{{index lienzo, [DOM, "gráficos"]}}

En el [próximo capítulo](canvas), exploraremos otra tecnología del ((navegador)), la etiqueta `<canvas>`, que proporciona una forma más tradicional de dibujar gráficos, trabajando en términos de formas y ((píxel))es en lugar de elementos del DOM.

## Niveles

{{index dimensiones}}

Queremos una forma legible y editable por humanos para especificar niveles. Como podemos empezar a construir todo a partir de una cuadrícula, podríamos usar cadenas grandes en las que cada carácter represente un elemento, ya sea una parte de la cuadrícula de fondo o un elemento móvil.

El plan para un nivel pequeño podría tener este aspecto:

```{includeCode: true}
let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;
```

{{index nivel}}

Los puntos representan un espacio vacío, los caracteres de almohadilla (`#`) son paredes y los signos más son lava. La posición inicial del ((jugador)) es el signo de arroba (`@`). Cada carácter O es una moneda, y el signo igual (`=`) en la parte superior es un bloque de lava que se mueve de un lado a otro horizontalmente.

{{index rebotar}}

Además, vamos a admitir dos formas más de lava en movimiento: el carácter de barra vertical (`|`) crea gotas que se mueven verticalmente, y `v` indica lava goteante: lava que se mueve verticalmente y no rebota de un lado a otro, solo se mueve hacia abajo, volviendo a su posición de inicio cuando golpea el suelo.

Un ((juego)) completo consta de varios ((nivel))es que el ((jugador)) debe completar. Un nivel se completa cuando se han recolectado todas las ((moneda))s. Si el jugador toca la ((lava)), el nivel actual se restablece a su posición inicial y el jugador puede intentarlo de nuevo.

{{id nivel}}

## Leyendo un nivel

{{index clase "Level"}}

La siguiente ((clase)) almacena un objeto ((nivel)). Su argumento debe ser la cadena que define el nivel.

```{includeCode: true}
class Level {
  constructor(plan) {
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;
    this.width = rows[0].length;
    this.startActors = [];

    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type != "string") {
          let pos = new Vec(x, y);
          this.startActors.push(type.create(pos, ch));
          type = "empty";
        }
        return type;
      });
    });
  }
}
```

{{index "método trim", "método split", [espacios en blanco, recorte]}}

El método `trim` se utiliza para eliminar los espacios en blanco al principio y al final de la cadena de `plan`. Esto permite que nuestro plan de ejemplo comience con una nueva línea para que todas las líneas estén directamente debajo unas de otras. La cadena restante se divide en líneas en ((caracteres de nueva línea)), y cada línea se convierte en un array, produciendo arrays de caracteres.

{{index [array, "como matriz"]}}

Entonces, `rows` contiene un array de arrays de caracteres, las filas del plan. Podemos obtener el ancho y alto del nivel a partir de estos. Pero aún debemos separar los elementos móviles de la cuadrícula de fondo. Llamaremos a los elementos móviles _actores_. Se almacenarán en un array de objetos. El fondo será un array de arrays de cadenas, que contienen tipos de campo como `"empty"`, `"wall"`, o `"lava"`.

{{index "método map"}}

Para crear estos arrays, mapeamos sobre las filas y luego sobre su contenido. Recuerda que `map` pasa el índice del array como segundo argumento a la función de mapeo, lo que nos indica las coordenadas x e y de un carácter dado. Las posiciones en el juego se almacenarán como pares de coordenadas, siendo la esquina superior izquierda 0,0 y cada cuadro de fondo siendo de 1 unidad de alto y ancho.

{{index "método estático"}}

Para interpretar los caracteres en el plan, el constructor de `Level` utiliza el objeto `levelChars`, que, para cada carácter utilizado en las descripciones de niveles, contiene una cadena si es un tipo de fondo, y una clase si produce un actor. Cuando `type` es una clase de actor, se utiliza su método estático `create` para crear un objeto, que se agrega a `startActors`, y la función de mapeo devuelve `"empty"` para este cuadro de fondo.

{{index "clase Vec"}}

La posición del actor se almacena como un objeto `Vec`. Este es un vector bidimensional, un objeto con propiedades `x` e `y`, como se ve en los ejercicios del [Capítulo ?](object#exercise_vector).

{{index [estado, en objetos]}}

A medida que el juego avanza, los actores terminarán en lugares diferentes o incluso desaparecerán por completo (como hacen las monedas cuando se recogen). Utilizaremos una clase `State` para seguir el estado de un juego en ejecución.

```{includeCode: true}
class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  get player() {
    return this.actors.find(a => a.type == "player");
  }
}
```

La propiedad `status` cambiará a `"lost"` o `"won"` cuando el juego haya terminado.

Esta es nuevamente una estructura de datos persistente: actualizar el estado del juego crea un nuevo estado y deja intacto el anterior.

## Actores

{{index actor, "Clase Vec", [interfaz, objeto]}}

Los objetos de actores representan la posición actual y el estado de un elemento móvil dado en nuestro juego. Todos los objetos de actores se ajustan a la misma interfaz. Tienen las propiedades `size` y `pos` que contienen el tamaño y las coordenadas de la esquina superior izquierda del rectángulo que representa a este actor.

Luego tienen un método `update`, que se utiliza para calcular su nuevo estado y posición después de un paso de tiempo dado. Simula la acción que realiza el actor: moverse en respuesta a las teclas de flecha para el jugador y rebotar de un lado a otro para la lava, y devuelve un nuevo objeto de actor actualizado.

Una propiedad `type` contiene una cadena que identifica el tipo de actor: `"player"`, `"coin"` o `"lava"`. Esto es útil al dibujar el juego: la apariencia del rectángulo dibujado para un actor se basa en su tipo.

Las clases de actores tienen un método estático `create` que es utilizado por el constructor `Level` para crear un actor a partir de un carácter en el plan de nivel. Recibe las coordenadas del carácter y el carácter en sí, que es necesario porque la clase `Lava` maneja varios caracteres diferentes.

{{id vector}}

Esta es la clase `Vec` que usaremos para nuestros valores bidimensionales, como la posición y tamaño de los actores.

```{includeCode: true}
class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}
```

{{index "times method", "multiplicación"}}

El método `times` escala un vector por un número dado. Será útil cuando necesitemos multiplicar un vector de velocidad por un intervalo de tiempo para obtener la distancia recorrida durante ese tiempo.

Los diferentes tipos de actores tienen sus propias clases debido a que su comportamiento es muy diferente. Definamos estas clases. Llegaremos a sus métodos `update` más adelante.

{{index simulation, "Clase Player"}}

La clase `Player` tiene una propiedad `speed` que almacena su velocidad actual para simular el impulso y la gravedad.

```{includeCode: true}
class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  get type() { return "player"; }

  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)),
                      new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 1.5);
```

Dado que un jugador tiene una altura de un cuadro y medio, su posición inicial se establece medio cuadro por encima de la posición donde apareció el carácter `@`. De esta manera, su parte inferior se alinea con la parte inferior del cuadro en el que apareció.

La propiedad `size` es la misma para todas las instancias de `Player`, por lo que la almacenamos en el prototipo en lugar de en las propias instancias. Podríamos haber utilizado un ((getter)) como `type`, pero eso crearía y devolvería un nuevo objeto `Vec` cada vez que se lee la propiedad, lo cual sería derrochador (las cadenas, al ser ((inmutables)), no tienen que ser recreadas cada vez que se evalúan).

{{index "Clase Lava", "rebotando"}}

Al construir un actor `Lava`, necesitamos inicializar el objeto de manera diferente dependiendo del personaje en el que se base. La lava dinámica se mueve a lo largo de su velocidad actual hasta que choca con un obstáculo. En ese momento, si tiene una propiedad de `reset`, saltará de nuevo a su posición de inicio (esto sirve para el efecto de goteo). Si no la tiene, invertirá su velocidad y continuará en la otra dirección (rebotando).

El método `create` mira el carácter que pasa el constructor de `Level` y crea el actor de lava apropiado.

```{includeCode: true}
class Lava {
  constructor(pos, speed, reset) {
    this.pos = pos;
    this.speed = speed;
    this.reset = reset;
  }

  get type() { return "lava"; }

  static create(pos, ch) {
    if (ch == "=") {
      return new Lava(pos, new Vec(2, 0));
    } else if (ch == "|") {
      return new Lava(pos, new Vec(0, 2));
    } else if (ch == "v") {
      return new Lava(pos, new Vec(0, 3), pos);
    }
  }
}

Lava.prototype.size = new Vec(1, 1);
```

{{index "Clase Moneda", "animación"}}

Los actores `Coin` son relativamente simples. Mayoritariamente solo se quedan en su lugar. Pero para animar un poco el juego, se les da un "balanceo", un ligero movimiento vertical de ida y vuelta. Para hacer un seguimiento de esto, un objeto moneda almacena una posición base y también una propiedad de `wobble` que sigue la fase del movimiento de balanceo. Juntos, estos determinan la posición real de la moneda (almacenada en la propiedad `pos`).

```{includeCode: true}
class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  get type() { return "coin"; }

  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
                    Math.random() * Math.PI * 2);
  }
}

Coin.prototype.size = new Vec(0.6, 0.6);
```

{{index "Función Math.random", "número aleatorio", "Función Math.sin", seno, onda}}

En [Capítulo ?](dom#sin_cos), vimos que `Math.sin` nos da la coordenada y de un punto en un círculo. Esa coordenada va de ida y vuelta en una forma de onda suave a medida que nos movemos a lo largo del círculo, lo que hace que la función seno sea útil para modelar un movimiento de vaivén.

{{index pi}}

Para evitar una situación en la que todas las monedas se mueven hacia arriba y hacia abajo sincrónicamente, la fase inicial de cada moneda se aleatoriza. El periodo de la onda de `Math.sin`, el ancho de una onda que produce, es 2π. Multiplicamos el valor devuelto por `Math.random` por ese número para darle a la moneda una posición inicial aleatoria en el  vaivén.

{{index map, [objeto, "como mapa"]}}

Ahora podemos definir el objeto `levelChars` que mapea caracteres del plano a tipos de cuadrícula de fondo o clases de actor.

```{includeCode: true}
const levelChars = {
  ".": "empty", "#": "wall", "+": "lava",
  "@": Player, "o": Coin,
  "=": Lava, "|": Lava, "v": Lava
};
```

Esto nos brinda todas las partes necesarias para crear una instancia de `Level`.

```{includeCode: strip_log}
let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} por ${simpleLevel.height}`);
// → 22 por 9
```

Ahora toca mostrar esos niveles en pantalla y modelar el tiempo y movimiento dentro de ellos.

{{id domdisplay}}

## Dibujo

{{index graphics, encapsulation, "Clase DOMDisplay", [DOM, graphics]}}

En el [próximo capítulo](canvas#canvasdisplay), mostraremos el mismo juego de una manera diferente. Para hacerlo posible, colocamos la lógica de dibujo detrás de una interfaz y la pasamos al juego como argumento. De esta manera, podemos usar el mismo programa de juego con diferentes nuevos módulos de visualización.

Un objeto de visualización de juego dibuja un nivel y estado dados. Pasamos su constructor al juego para permitir que sea reemplazado. La clase de visualización que definimos en este capítulo se llama `DOMDisplay` porque utiliza elementos del DOM para mostrar el nivel.

{{index "atributo de estilo", CSS}}

Utilizaremos una hoja de estilo para establecer los colores y otras propiedades fijas de los elementos que conforman el juego. También sería posible asignarlos directamente a la propiedad `style` de los elementos al crearlos, pero eso produciría programas más verbosos.

{{index "atributo de clase"}}

La siguiente función auxiliar proporciona una forma concisa de crear un elemento y darle algunos atributos y nodos secundarios:

```{includeCode: true}
function elt(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}
```

Una visualización se crea dándole un elemento padre al que debe adjuntarse y un objeto de nivel.

```{includeCode: true}
class DOMDisplay {
  constructor(parent, level) {
    this.dom = elt("div", {class: "game"}, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  clear() { this.dom.remove(); }
}
```

{{index level}}

La cuadrícula de fondo del nivel, que nunca cambia, se dibuja una vez. Los actores se vuelven a dibujar cada vez que se actualiza la visualización con un estado dado. La propiedad `actorLayer` se utilizará para realizar un seguimiento del elemento que contiene a los actores para que puedan ser fácilmente eliminados y reemplazados.

{{index scaling, "Clase DOMDisplay"}}

Nuestras coordenadas y tamaños se miden en unidades de cuadrícula, donde un tamaño o distancia de 1 significa un bloque de cuadrícula. Al establecer tamaños de píxeles, tendremos que escalar estas coordenadas: todo en el juego sería ridículamente pequeño con un solo píxel por cuadrado. La constante `scale` indica el número de píxeles que una unidad ocupa en la pantalla.

```{includeCode: true}
const scale = 20;

function drawGrid(level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt("tr", {style: `height: ${scale}px`},
        ...row.map(type => elt("td", {class: type})))
  ));
}
```

{{index "table (etiqueta HTML)", "tr (etiqueta HTML)", "td (etiqueta HTML)", "operador de propagación"}}

El elemento `<table>` se corresponde bien con la estructura de la propiedad `rows` del nivel: cada fila de la cuadrícula se convierte en una fila de tabla (`<tr>`). Las cadenas en la cuadrícula se usan como nombres de clase para los elementos de celda de tabla (`<td>`). El código utiliza el operador de propagación (triple punto) para pasar arrays de nodos secundarios a `elt` como argumentos separados.El siguiente ((CSS)) hace que la tabla se vea como el fondo que queremos:

```{lang: "css"}
.background    { background: rgb(52, 166, 251);
                 table-layout: fixed;
                 border-spacing: 0;              }
.background td { padding: 0;                     }
.lava          { background: rgb(255, 100, 100); }
.wall          { background: white;              }
```

Algunos de estos (`table-layout`, `border-spacing` y `padding`) se utilizan para suprimir comportamientos predeterminados no deseados. No queremos que el diseño de la ((tabla)) dependa del contenido de sus celdas, ni queremos espacio entre las celdas de la ((tabla)) o relleno dentro de ellas.

La regla `background` establece el color de fondo. CSS permite que los colores se especifiquen tanto como palabras (`white`) como con un formato como `rgb(R, G, B)`, donde los componentes rojo, verde y azul del color se separan en tres números de 0 a 255. Por lo tanto, en `rgb(52, 166, 251)`, el componente rojo es 52, el verde es 166 y el azul es 251. Dado que el componente azul es el más grande, el color resultante será azulado. En la regla `.lava`, el primer número (rojo) es el más grande.

Dibujamos cada ((actor)) creando un elemento DOM para él y estableciendo la posición y el tamaño de ese elemento en función de las propiedades del actor. Los valores tienen que ser multiplicados por `scale` para pasar de unidades del juego a píxeles.

```{includeCode: true}
function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", {class: `actor ${actor.type}`});
    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}
```

Para agregar más de una clase a un elemento, separamos los nombres de las clases por espacios. En el siguiente código ((CSS)), la clase `actor` da a los actores su posición absoluta. El nombre de su tipo se utiliza como una clase adicional para darles un color. No tenemos que definir la clase `lava` de nuevo porque estamos reutilizando la clase para las casillas de lava de la cuadrícula que definimos anteriormente.

```{lang: "css"}
.actor  { position: absolute;            }
.coin   { background: rgb(241, 229, 89); }
.player { background: rgb(64, 64, 64);   }
```

El método `syncState` se utiliza para que la pantalla muestre un estado dado. Primero elimina los gráficos de actores antiguos, si los hay, y luego vuelve a dibujar los actores en sus nuevas posiciones. Puede ser tentador intentar reutilizar los elementos DOM para actores, pero para que eso funcione, necesitaríamos mucho más trabajo adicional para asociar actores con elementos DOM y asegurarnos de que eliminamos elementos cuando sus actores desaparecen. Como normalmente habrá solo un puñado de actores en el juego, volver a dibujar todos ellos no resulta costoso.

```{includeCode: true}
DOMDisplay.prototype.syncState = function(state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};
```

{{index level, "atributo clase"}}

Al agregar el estado actual del nivel como nombre de clase al contenedor, podemos estilizar ligeramente al actor del jugador cuando el juego se gana o se pierde, añadiendo una regla CSS que tenga efecto solo cuando el jugador tiene un elemento ancestro con una clase específica.

```{lang: "css"}
.lost .player {
  background: rgb(160, 64, 64);
}
.won .player {
  box-shadow: -4px -7px 8px white, 4px -7px 8px white;
}
```

{{index player, "sombra de caja (CSS)"}}

Después de tocar la lava, el color del jugador se vuelve rojo oscuro, sugiriendo quemaduras. Cuando se ha recolectado la última moneda, agregamos dos sombras blancas difuminadas, una en la parte superior izquierda y otra en la parte superior derecha, para crear un efecto de halo blanco.

{{id viewport}}

{{index "posición (CSS)", "ancho máximo (CSS)", "desbordamiento (CSS)", "altura máxima (CSS)", viewport, desplazamiento, [DOM, "gráficos"]}}

No podemos asumir que el nivel siempre encaja en el _viewport_ – el elemento en el que dibujamos el juego. Por eso es necesaria la llamada a `scrollPlayerIntoView`. Se asegura de que si el nivel sobresale del viewport, desplacemos ese viewport para asegurar que el jugador esté cerca de su centro. El siguiente ((CSS)) le da al elemento DOM contenedor del juego un tamaño máximo y asegura que cualquier cosa que sobresalga de la caja del elemento no sea visible. También le damos una posición relativa para que los actores dentro de él estén posicionados de manera relativa a la esquina superior izquierda del nivel.

```{lang: css}
.game {
  overflow: hidden;
  max-width: 600px;
  max-height: 450px;
  position: relative;
}
```

{{index scrolling}}

En el método `scrollPlayerIntoView`, encontramos la posición del jugador y actualizamos la posición de desplazamiento del elemento contenedor. Cambiamos la posición de desplazamiento manipulando las propiedades `scrollLeft` y `scrollTop` de ese elemento cuando el jugador está demasiado cerca del borde.

```{includeCode: true}
DOMDisplay.prototype.scrollPlayerIntoView = function(state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // El viewport
  let left = this.dom.scrollLeft, right = left + width;
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5))
                         .times(scale);

  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};
```

{{index center, coordenadas, legibilidad}}

La forma en que se encuentra el centro del jugador muestra cómo los métodos en nuestro tipo `Vec` permiten que los cálculos con objetos se escriban de una manera relativamente legible. Para encontrar el centro del actor, sumamos su posición (esquina superior izquierda) y la mitad de su tamaño. Ese es el centro en coordenadas de nivel, pero lo necesitamos en coordenadas de píxeles, así que luego multiplicamos el vector resultante por nuestra escala de visualización.

{{index validation}}

A continuación, una serie de comprobaciones verifica que la posición del jugador no esté fuera del rango permitido. Ten en cuenta que a veces esto establecerá coordenadas de desplazamiento sin sentido que están por debajo de cero o más allá del área desplazable del elemento. Esto está bien, el DOM las limitará a valores aceptables. Establecer  `scrollLeft` en -10 hará que se convierta en 0.

Hubiera sido un poco más sencillo intentar siempre desplazar al jugador al centro del ((viewport)). Pero esto crea un efecto bastante brusco. Mientras saltas, la vista se desplazará constantemente hacia arriba y hacia abajo. Es más agradable tener un área "neutral" en el centro de la pantalla donde puedas moverte sin causar ningún desplazamiento.

{{index [juego, captura de pantalla]}}

Ahora podemos mostrar nuestro pequeño nivel.

```{lang: html}
<link rel="stylesheet" href="css/game.css">

<script>
  let simpleLevel = new Level(simpleLevelPlan);
  let display = new DOMDisplay(document.body, simpleLevel);
  display.syncState(State.start(simpleLevel));
</script>
```
  
{{if book

{{figure {url: "img/game_simpleLevel.png", alt: "Captura de pantalla del nivel renderizado", width: "7cm"}}}

if}}

{{index "enlace (etiqueta HTML)", CSS}}

La etiqueta `<link>`, cuando se utiliza con `rel="stylesheet"`, proporciona una forma de cargar un archivo CSS en una página. El archivo `game.css` contiene los estilos necesarios para nuestro juego.

## Movimiento y colisión

{{index "física", ["animación", "juego de plataformas"]}}

Ahora estamos en el punto en el que podemos comenzar a agregar movimiento. El enfoque básico, seguido por la mayoría de juegos como este, es dividir ((tiempo)) en pequeños pasos y, para cada paso, mover a los actores una distancia correspondiente a su velocidad multiplicada por el tamaño del paso de tiempo. Mediremos el tiempo en segundos, por lo que las velocidades se expresan en unidades por segundo.

{{index "obstáculo", "detección de colisión"}}

Mover cosas es fácil. La parte difícil es lidiar con las interacciones entre los elementos. Cuando el jugador golpea una pared o el suelo, este no debería atravesarlos. El juego debe notar cuándo un movimiento dado hace que un objeto golpee a otro objeto y responder en consecuencia. Para las paredes, el movimiento debe detenerse. Al golpear una moneda, esa moneda debe ser recogida. Al tocar lava, la partida debería acabarse.

Resolver esto para un caso general es una tarea complicada. Puedes encontrar bibliotecas, generalmente llamadas _((motores físicos))_, que simulan la interacción entre objetos físicos en dos o tres ((dimensiones)). Adoptaremos un enfoque más modesto en este capítulo, manejando solo colisiones entre objetos rectangulares y manejándolas de una manera bastante simplista.

{{index rebote, "detección de colisión", ["animación", "juego de plataformas"]}}

Antes de mover al ((jugador)) o un bloque de ((lava)), probamos si el movimiento los llevaría dentro de una pared. Si lo hace, simplemente cancelamos el movimiento. La respuesta a tal colisión depende del tipo de actor. Si se trata del jugador, este se detendrá, mientras que un bloque de lava rebotará.

{{index "discretización"}}

Este enfoque requiere que nuestros pasos de ((tiempo)) sean bastante pequeños, ya que hará que el movimiento se detenga antes de que los objetos realmente se toquen. Si los pasos de tiempo (y por lo tanto los pasos de movimiento) son demasiado grandes, el jugador terminaría flotando a una distancia notable sobre el suelo. Otro enfoque, bastante mejor pero más complicado, sería encontrar el punto exacto de colisión y moverse allí. Tomaremos el enfoque simple y ocultaremos sus problemas asegurando que la animación avance en pasos pequeños.

{{index "obstáculo", "método touches", "detección de colisiones"}}

{{id touches}}

Este método nos indica si un ((rectángulo)) (especificado por una posición y un tamaño) toca un elemento de rejilla de un tipo dado.

```{includeCode: true}
Level.prototype.touches = function(pos, size, type) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
                      y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (here == type) return true;
    }
  }
  return false;
};
```

{{index "función Math.floor", "función Math.ceil"}}

El método calcula el conjunto de cuadrados de rejilla con los que el cuerpo se ((superpone)) utilizando `Math.floor` y `Math.ceil` en sus ((coordenadas)). Recuerda que los cuadrados de la ((rejilla)) son de tamaño 1 por 1 unidad. Al ((redondear)) los lados de un cuadro hacia arriba y hacia abajo, obtenemos el rango de cuadrados del ((fondo)) que el rectángulo toca.

{{figure {url: "img/game-grid.svg", alt: "Diagrama que muestra una rejilla con un bloque negro superpuesto. Todos los cuadrados de la rejilla que están parcialmente cubiertos por el bloque están marcados.", width: "3cm"}}}

Recorremos el bloque de cuadrados de ((rejilla)) encontrado al ((redondear)) las ((coordenadas)) y devolvemos `true` cuando se encuentra un cuadro coincidente. Los cuadrados fuera del nivel siempre se tratan como `"wall"` para asegurar que el jugador no pueda salir del mundo y que no intentemos leer fuera de los límites de nuestra matriz `rows`.

El método `update` de estado utiliza `touches` para determinar si el jugador está tocando lava.

```{includeCode: true}
State.prototype.update = function(time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;
  if (this.level.touches(player.pos, player.size, "lava")) {
    return new State(this.level, actors, "lost");
  }

  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};
```

El método recibe un paso de tiempo y una estructura de datos que le indica qué teclas se mantienen presionadas. Lo primero que hace es llamar al método `update` en todos los actores, produciendo un array de actores actualizados. Los actores también reciben el paso de tiempo, las teclas y el estado, para que puedan basar su actualización en esos valores. Solo el jugador lee realmente las teclas, ya que es el único actor controlado por el teclado.

Si el juego ya ha terminado, no es necesario realizar más procesamiento (no se puede ganar el juego después de haber perdido, o viceversa). De lo contrario, el método prueba si el jugador está tocando lava de fondo. Si es así, se pierde el juego y hemos terminado. Finalmente, si el juego sigue en curso, verifica si algún otro actor se superpone al jugador.La superposición entre actores se detecta con la función `overlap`. Toma dos objetos actor y devuelve true cuando se tocan, lo cual sucede cuando se superponen tanto a lo largo del eje x como a lo largo del eje y.

```{includeCode: true}
function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
         actor1.pos.x < actor2.pos.x + actor2.size.x &&
         actor1.pos.y + actor1.size.y > actor2.pos.y &&
         actor1.pos.y < actor2.pos.y + actor2.size.y;
}
```

Si algún actor se superpone, su método `collide` tiene la oportunidad de actualizar el estado. Tocar un actor de lava establece el estado del juego en `"lost"`. Las monedas desaparecen cuando las tocas y establecen el estado en `"won"` cuando son la última moneda del nivel.

```{includeCode: true}
Lava.prototype.collide = function(state) {
  return new State(state.level, state.actors, "lost");
};

Coin.prototype.collide = function(state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};
```

{{id actores}}

## Actualizaciones de actores

{{index actor, "Clase Lava", lava}}

Los métodos `update` de los objetos actor toman como argumentos el paso de tiempo, el objeto de estado y un objeto `keys`. El actor de tipo `Lava` ignora el objeto `keys`.

```{includeCode: true}
Lava.prototype.update = function(time, state) {
  let newPos = this.pos.plus(this.speed.times(time));
  if (!state.level.touches(newPos, this.size, "wall")) {
    return new Lava(newPos, this.speed, this.reset);
  } else if (this.reset) {
    return new Lava(this.reset, this.speed, this.reset);
  } else {
    return new Lava(this.pos, this.speed.times(-1));
  }
};
```

{{index rebotante, "multiplicación", "Clase Vec", "detección de colisiones"}}

Este método `update` calcula una nueva posición agregando el producto del paso de tiempo y la velocidad actual a su posición anterior. Si no hay obstáculos que bloqueen esa nueva posición, se mueve allí. Si hay un obstáculo, el comportamiento depende del tipo de bloque de ((lava)) —la lava goteante tiene una posición de `reset` a la que regresa cuando golpea algo. La lava rebotante invierte su velocidad multiplicándola por -1 para que comience a moverse en el sentido opuesto.

{{index "Clase Coin", coin, wave}}

Las monedas utilizan su método `update` para balancearse. Ignoran las colisiones con la cuadrícula ya que simplemente se balancean dentro de su propio cuadrado.

```{includeCode: true}
const wobbleSpeed = 8, wobbleDist = 0.07;

Coin.prototype.update = function(time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
                  this.basePos, wobble);
};
```

{{index "Función Math.sin", seno, fase}}

La propiedad `wobble` se incrementa para hacer un seguimiento del tiempo y luego se utiliza como argumento para `Math.sin` para encontrar la nueva posición en el ((vaivén)). La posición actual de la moneda se calcula a partir de su posición base y un desplazamiento basado en esta onda.

{{index "detección de colisiones", "clase Jugador"}}

Ya solo nos queda el ((jugador)). El movimiento del jugador se maneja por separado por cada ((eje)), porque golpear el suelo no debería impedir el movimiento horizontal, y golpear una pared no debería detener el movimiento de caída o de salto.

```{includeCode: true}
const playerXSpeed = 7;
const gravity = 30;
const jumpSpeed = 17;

Player.prototype.update = function(time, state, keys) {
  let xSpeed = 0;
  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  if (keys.ArrowRight) xSpeed += playerXSpeed;
  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }

  let ySpeed = this.speed.y + time * gravity;
  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  } else if (keys.ArrowUp && ySpeed > 0) {
    ySpeed = -jumpSpeed;
  } else {
    ySpeed = 0;
  }
  return new Player(pos, new Vec(xSpeed, ySpeed));
};
```

{{index ["animación", "juego de plataformas"], teclado}}

El movimiento horizontal se calcula en función del estado de las teclas de flecha izquierda y derecha. Cuando no hay una pared bloqueando la nueva posición creada por este movimiento, se utiliza. De lo contrario, se mantiene la posición anterior.

{{index "aceleración", "física"}}

El movimiento vertical funciona de manera similar pero tiene que simular ((saltos)) y ((gravedad)). La velocidad vertical del jugador (`ySpeed`) se acelera primero para tener en cuenta la ((gravedad)).

{{index "detección de colisiones", teclado, saltos}}

Comprobamos las paredes nuevamente. Si no golpeamos ninguna, se usa la nueva posición. Si _hay_ una pared, hay dos posibles resultados. Cuando se presiona la flecha hacia arriba _y_ estamos bajando (lo que significa que lo que golpeamos está debajo de nosotros), la velocidad se establece en un valor negativo relativamente grande. Esto hace que el jugador salte. Si ese no es el caso, el jugador simplemente chocó con algo y la velocidad se establece en cero.

La fuerza de la gravedad, la velocidad de ((salto)) y otras ((constantes)) en el juego se determinaron simplemente probando algunos números y viendo cuáles se sentían más correctos. Puedes experimentar con ellos.

## Seguimiento de teclas

{{index teclado}}

Para un ((juego)) como este, no queremos que las teclas tengan efecto una vez por pulsación de tecla. Más bien, queremos que su efecto (mover la figura del jugador) se mantenga activo mientras se mantienen presionadas.

{{index "método" "preventDefault"}}

Necesitamos configurar un controlador de teclas que almacene el estado actual de las teclas de flecha izquierda, derecha y arriba. También queremos llamar a `preventDefault` para esas teclas para que no terminen ((desplazando)) la página.

{{index "función" "trackKeys", "código de tecla", "manejo de eventos", "método addEventListener"}}

La siguiente función, al darle un array de nombres de teclas, devolverá un objeto que sigue la posición actual de esas teclas. Registra controladores de eventos para eventos `"keydown"` y `"keyup"` y, cuando el código de tecla en el evento está presente en el conjunto de códigos que está siguiendo, actualiza el objeto.

```{includeCode: true}
function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

const arrowKeys =
  trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp"]);
```


{{index "evento keydown", "evento keyup"}}

La misma función manejadora se utiliza para ambos tipos de eventos. Esta función examina la propiedad `type` del objeto de evento para determinar si el estado de la tecla debe actualizarse a verdadero (`"keydown"`) o falso (`"keyup"`).

{{id runAnimation}}

## Ejecutando el juego

{{index "función requestAnimationFrame", ["animación", "juego de plataformas"]}}

La función `requestAnimationFrame`, que vimos en el [Capítulo ?](dom#animationFrame), proporciona una buena forma de animar un juego. Pero su interfaz es bastante primitiva, ya que su uso requiere que llevemos un registro del momento en que se llamó a nuestra función la última vez y llamemos a `requestAnimationFrame` nuevamente después de cada fotograma.

{{index "función runAnimation", "función de devolución de llamada", ["función", "como valor"], ["función", "de orden superior"], ["animación", "juego de plataformas"]}}

Vamos a definir una función auxiliar que envuelva todo eso en una interfaz conveniente y nos permita simplemente llamar a `runAnimation`, dándole una función que espera una diferencia de tiempo como argumento y dibuja un solo fotograma. Cuando la función de fotograma devuelve el valor `false`, la animación se detiene.

```{includeCode: true}
function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

{{index tiempo, "discretización"}}

He establecido un paso de fotograma máximo de 100 milisegundos (una décima parte de un segundo). Cuando la pestaña del navegador o la ventana con nuestra página está oculta, las llamadas a `requestAnimationFrame` se suspenden hasta que la pestaña o la ventana se vuelva a mostrar. En este caso, la diferencia entre `lastTime` y `time` será todo el tiempo en el que la página estuvo oculta. Avanzar el juego tanto en un solo paso se vería ridículo y podría causar efectos secundarios extraños, como que el jugador caiga a través del suelo.

La función también convierte los pasos de tiempo a segundos, que son una cantidad más fácil de entender que los milisegundos.

{{index "función de devolución de llamada", "función runLevel", ["animación", "juego de plataformas"]}}

La función `runLevel` toma un objeto `Level` y un constructor de ((display)) y devuelve una promesa. Muestra el nivel (en `document.body`) y permite al usuario jugar a través de él. Cuando el nivel termina (perdiendo o ganando), `runLevel` espera un segundo más (para que el usuario vea qué sucede), luego borra la pantalla, detiene la animación y resuelve la promesa con el estado final del juego.

```{includeCode: true}
function runLevel(level, Display) {
  let display = new Display(document.body, level);
  let state = State.start(level);
  let ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}
```

{{index "función runGame"}}

Un juego es una secuencia de ((niveles)). Cada vez que el ((jugador)) muere, el nivel actual se reinicia. Cuando se completa un nivel, pasamos al siguiente nivel. Esto se puede expresar mediante la siguiente función, que toma un array de planos de nivel (cadenas) y un constructor de ((display)):

```{includeCode: true}
async function runGame(plans, Display) {
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]),
                                Display);
    if (status == "won") level++;
  }
  console.log("You've won!");
}
```

{{index "programación asíncrona", "manejo de eventos"}}

Como hemos hecho que `runLevel` devuelva una promesa, `runGame` puede escribirse utilizando una función `async`, como se muestra en el [Capítulo ?](async). Devuelve otra promesa, que se resuelve cuando el jugador termina el juego.

{{index juego, "conjunto de datos GAME_LEVELS"}}

Hay un conjunto de planos de ((niveles)) disponibles en la asociación `GAME_LEVELS` en el [sandbox de este capítulo](https://eloquentjavascript.net/code#16)[ ([_https://eloquentjavascript.net/code#16_](https://eloquentjavascript.net/code#16))]{if book}. Esta página los alimenta a `runGame`, comenzando un juego real.

```{sandbox: null, focus: yes, lang: html, startCode: true}
<link rel="stylesheet" href="css/game.css">

<body>
  <script>
    runGame(GAME_LEVELS, DOMDisplay);
  </script>
</body>
```

{{if interactive

Intenta pasártelos. Yo me he divertido construyéndolos.

if}}

## Ejercicios

### Fin del juego

{{index "vidas (ejercicio)", juego}}

Es tradición que los ((juegos de plataformas)) hagan que el jugador comience con un número limitado de _vidas_ y resten una vida cada vez que mueren. Cuando el jugador se queda sin vidas, el juego se reinicia desde el principio.

{{index "función runGame"}}

Ajusta `runGame` para implementar vidas. Haz que el jugador comience con tres vidas. Muestra el número actual de vidas (usando `console.log`) cada vez que comienza un nivel.

{{if interactive

```{lang: html, test: no, focus: yes}
<link rel="stylesheet" href="css/game.css">

<body>
<script>
  // La antigua función runGame. Modifícala...
  async function runGame(plans, Display) {
    for (let level = 0; level < plans.length;) {
      let status = await runLevel(new Level(plans[level]),
                                  Display);
      if (status == "ganado") level++;
    }
    console.log("¡Has ganado!");
  }
  runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>
```

if}}

### Pausar el juego

{{index "pausa (ejercicio)", "tecla de escape", teclado}}

Haz que se pueda pausar y reanudar el juego presionando la tecla Esc.

{{index "función runLevel", "manejo de eventos"}}

Esto se puede hacer cambiando la función `runLevel` para configurar un manejador de eventos de teclado que interrumpa o reanude la animación cada vez que se presiona la tecla Esc.

{{index "función runAnimation"}}

La interfaz de `runAnimation` puede no parecer adecuada para esto a primera vista, pero lo es si reorganizas la forma en que `runLevel` la llama.

{{index [enlace, global], "función trackKeys"}}

Cuando eso esté funcionando, hay algo más que podrías intentar. La forma en que hemos estado registrando los controladores de eventos de teclado es algo problemática. El objeto `arrowKeys` es actualmente una asignación global, y sus controladores de eventos se mantienen incluso cuando no hay ningún juego en ejecución. Podrías decir que _escapan_ de nuestro sistema. Amplía `trackKeys` para proporcionar una forma de anular el registro de sus controladores y luego cambia `runLevel` para registrar sus controladores cuando comienza y desregistrarlos nuevamente cuando termine.

{{if interactive

```{lang: html, focus: yes, test: no}
<link rel="stylesheet" href="css/game.css">

<body>
<script>
  // La antigua función runLevel. Modifica esto...
  function runLevel(level, Display) {
    let display = new Display(document.body, level);
    let state = State.start(level);
    let ending = 1;
    return new Promise(resolve => {
      runAnimation(time => {
        state = state.update(time, arrowKeys);
        display.syncState(state);
        if (state.status == "playing") {
          return true;
        } else if (ending > 0) {
          ending -= time;
          return true;
        } else {
          display.clear();
          resolve(state.status);
          return false;
        }
      });
    });
  }
  runGame(GAME_LEVELS, DOMDisplay);
</script>
</body>
```

if}}

{{hint

{{index "pausing (exercise)", [animation, "platform game"]}}

Una animación puede ser interrumpida devolviendo `false` desde la función dada a `runAnimation`. Puede ser continuada llamando a `runAnimation` nuevamente.

{{index closure}}

Así que necesitamos comunicar el hecho de que estamos pausando el juego a la función dada a `runAnimation`. Para eso, puedes usar una asignación a la que tanto el controlador de eventos como esa función tengan acceso.

{{index "event handling", "removeEventListener method", [function, "as value"]}}

Al encontrar una forma de anular los controladores registrados por `trackKeys`, recuerda que _exactamente_ el mismo valor de función que se pasó a `addEventListener` debe pasarse a `removeEventListener` para quitar con éxito un controlador. Por lo tanto, el valor de función `handler` creado en `trackKeys` debe estar disponible para el código que anula los controladores.

Puedes agregar una propiedad al objeto devuelto por `trackKeys`, que contenga ese valor de función o un método que maneje la anulación directamente.

hint}}

### Un monstruo

{{index "monster (exercise)"}}

Es tradición que los juegos de plataformas tengan enemigos a los que puedes saltar encima para derrotar. Este ejercicio te pide que agregues un tipo de actor así al juego.

Lo llamaremos monstruo. Los monstruos se mueven solo horizontalmente. Puedes hacer que se muevan en la dirección del jugador, que reboten de un lado a otro como lava horizontal, o tengan cualquier patrón de movimiento que desees. La clase no tiene que manejar caídas, pero debe asegurarse de que el monstruo no atraviese paredes.

Cuando un monstruo toca al jugador, el efecto depende de si el jugador está saltando encima de ellos o no. Puedes aproximarlo comprobando si el final del jugador está cerca de la parte superior del monstruo. Si este es el caso, el monstruo desaparece. Si no, la partida termina.

{{if interactive

```{test: no, lang: html, focus: yes}
<link rel="stylesheet" href="css/game.css">
<style>.monster { background: purple }</style>

<body>
  <script>
    // Completa los métodos constructor, update y collide
    class Monster {
      constructor(pos, /* ... */) {}

      get type() { return "monster"; }

      static create(pos) {
        return new Monster(pos.plus(new Vec(0, -1)));
      }

      update(time, state) {}

      collide(state) {}
    }

    Monster.prototype.size = new Vec(1.2, 2);

    levelChars["M"] = Monster;

    runLevel(new Level(`
..................................
.################################.
.#..............................#.
.#..............................#.
.#..............................#.
.#...........................o..#.
.#..@...........................#.
.##########..............########.
..........#..o..o..o..o..#........
..........#...........M..#........
..........################........
..................................
`), DOMDisplay);
  </script>
</body>
```

if}}

{{hint

{{index "monster (exercise)", "persistent data structure"}}

Si deseas implementar un tipo de movimiento que sea mutable, como el rebote, asegúrate de almacenar el estado necesario en el objeto del actor, inclúyelo como argumento del constructor y agrégalo como propiedad.

Recuerda que `update` devuelve un _nuevo_ objeto en lugar de cambiar el anterior.

{{index "collision detection"}}

Al manejar la colisión, encuentra al jugador en `state.actors` y compara su posición con la posición del monstruo. Para obtener la _parte inferior_ del jugador, debes sumar su tamaño vertical a su posición vertical. La creación de un estado actualizado se parecerá al método `collide` de `Coin` (eliminando al actor) o a `Lava` (cambiando el estado a `"lost"`), dependiendo de la posición del jugador.

hint}}
