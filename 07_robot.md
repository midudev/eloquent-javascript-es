# Proyecto: Un Robot

{{quote {author: "Edsger Dijkstra", title: "Las amenazas a la ciencia informática", chapter: true}

[...] la pregunta de si las Máquinas Pueden Pensar [...] es tan relevante como la pregunta de si los Submarinos Pueden Nadar.

quote}}

{{index "inteligencia artificial", "Dijkstra, Edsger"}}

{{figure {url: "img/chapter_picture_7.jpg", alt: "Ilustración de un robot sosteniendo una pila de paquetes", chapter: framed}}

{{index "capítulo del proyecto", "leyendo código", "escribiendo código"}}

En los capítulos del "proyecto", dejaré de golpearte con nueva teoría por un breve momento, y en su lugar trabajaremos en un programa juntos. La teoría es necesaria para aprender a programar, pero leer y entender programas reales es igual de importante.

Nuestro proyecto en este capítulo es construir un ((autómata)), un pequeño programa que realiza una tarea en un ((mundo virtual)). Nuestro autómata será un ((robot)) de entrega de correo que recoge y deja paquetes.

## Meadowfield

{{index "array de carreteras"}}

El pueblo de ((Meadowfield)) no es muy grande. Consiste en 11 lugares con 14 carreteras entre ellos. Se puede describir con este array de carreteras:

```{includeCode: true}
const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];
```

{{figure {url: "img/village2x.png", alt: "Ilustración de arte pixelado de un pequeño pueblo con 11 ubicaciones, etiquetadas con letras, y carreteras entre ellas"}}}

La red de carreteras en el pueblo forma un _((gráfico))_. Un gráfico es una colección de puntos (lugares en el pueblo) con líneas entre ellos (carreteras). Este gráfico será el mundo por el que se moverá nuestro robot.

{{index "objeto roadGraph"}}

El array de cadenas no es muy fácil de trabajar. Lo que nos interesa son los destinos a los que podemos llegar desde un lugar dado. Vamos a convertir la lista de carreteras en una estructura de datos que, para cada lugar, nos diga qué se puede alcanzar desde allí.

```{includeCode: true}
function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (from in graph) {
      graph[from].push(to);
    } else {
      graph[from] = [to];
    }
  }
  for (let [from, to] of edges.map(r => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);
```

Dado un array de aristas, `buildGraph` crea un objeto de mapa que, para cada nodo, almacena un array de nodos conectados.

{{index "método split"}}

Utiliza el método `split` para pasar de las cadenas de carreteras, que tienen la forma `"Inicio-Fin"`, a arrays de dos elementos que contienen el inicio y el fin como cadenas separadas.

## La tarea

Nuestro ((robot)) se moverá por el pueblo. Hay paquetes en varios lugares, cada uno dirigido a algún otro lugar. El robot recoge los paquetes cuando llega a ellos y los entrega cuando llega a sus destinos.

El autómata debe decidir, en cada punto, hacia dónde ir a continuación. Habrá terminado su tarea cuando todos los paquetes hayan sido entregados.

{{index simulación, "mundo virtual"}}

Para poder simular este proceso, debemos definir un mundo virtual que pueda describirlo. Este modelo nos dice dónde está el robot y dónde están los paquetes. Cuando el robot decide moverse a algún lugar, necesitamos actualizar el modelo para reflejar la nueva situación.

{{index [estado, en objetos]}}

Si estás pensando en términos de ((programación orientada a objetos)), tu primer impulso podría ser empezar a definir objetos para los diferentes elementos en el mundo: una ((clase)) para el robot, una para un paquete, tal vez una para lugares. Estos podrían tener propiedades que describen su ((estado)) actual, como la pila de paquetes en un lugar, que podríamos cambiar al actualizar el mundo.

Esto es incorrecto. Al menos, usualmente lo es. El hecho de que algo suene como un objeto no significa automáticamente que deba ser un objeto en tu programa. Escribir reflexivamente clases para cada concepto en tu aplicación tiende a dejarte con una colección de objetos interconectados que tienen su propio estado interno cambiable. Estos programas a menudo son difíciles de entender y, por lo tanto, fáciles de romper.

{{index [estado, en objetos]}}

En lugar de eso, vamos a condensar el estado del pueblo en el conjunto mínimo de valores que lo define. Está la ubicación actual del robot y la colección de paquetes no entregados, cada uno de los cuales tiene una ubicación actual y una dirección de destino. Eso es todo.

{{index "clase VillageState", "estructura de datos persistente"}}

Y mientras lo hacemos, hagamos que no _cambiemos_ este estado cuando el robot se mueve, sino que calculemos un _nuevo_ estado para la situación después del movimiento.

```{includeCode: true}
class VillageState {
  constructor(place, parcels) {
    this.place = place;
    this.parcels = parcels;
  }

  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      let parcels = this.parcels.map(p => {
        if (p.place != this.place) return p;
        return {place: destination, address: p.address};
      }).filter(p => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}
```

El método `move` es donde ocurre la acción. Primero verifica si hay un camino desde el lugar actual hasta el destino, y si no lo hay, devuelve el estado anterior ya que este no es un movimiento válido.

{{index método "map", método "filter"}} 

Luego crea un nuevo estado con el destino como el nuevo lugar del robot. Pero también necesita crear un nuevo conjunto de paquetes: los paquetes que lleva el robot (que están en el lugar actual del robot) deben ser trasladados al nuevo lugar. Y los paquetes dirigidos al nuevo lugar deben ser entregados, es decir, deben ser eliminados del conjunto de paquetes no entregados. La llamada a `map` se encarga del traslado y la llamada a `filter` de la entrega.

Los objetos de parcela no se modifican cuando se mueven, sino que se vuelven a crear. El método `move` nos proporciona un nuevo estado de aldea pero deja intacto por completo el anterior.

```
let first = new VillageState(
  "Oficina de Correos",
  [{place: "Oficina de Correos", address: "Casa de Alice"}]
);
let next = first.move("Casa de Alice");

console.log(next.place);
// → Casa de Alice
console.log(next.parcels);
// → []
console.log(first.place);
// → Oficina de Correos
```

El movimiento hace que la parcela se entregue, y esto se refleja en el siguiente estado. Pero el estado inicial sigue describiendo la situación en la que el robot está en la oficina de correos y la parcela no se ha entregado.

## Datos persistentes

{{index "estructura de datos persistente", mutabilidad, ["estructura de datos", inmutable]}}

Las estructuras de datos que no cambian se llaman _((inmutables))_ o _persistentes_. Se comportan de manera similar a las cadenas de texto y los números en el sentido de que son lo que son y se mantienen así, en lugar de contener cosas diferentes en momentos diferentes.

En JavaScript, casi todo _puede_ cambiarse, por lo que trabajar con valores que se supone que son persistentes requiere cierta moderación. Existe una función llamada `Object.freeze` que cambia un objeto para que la escritura en sus propiedades sea ignorada. Podrías usar esto para asegurarte de que tus objetos no se modifiquen, si así lo deseas. Congelar requiere que la computadora realice un trabajo adicional, y que las actualizaciones se ignoren es casi tan propenso a confundir a alguien como hacer que hagan lo incorrecto. Por lo tanto, suelo preferir simplemente decirle a las personas que un objeto dado no debe ser modificado y esperar que lo recuerden.

```
let object = Object.freeze({value: 5});
object.value = 10;
console.log(object.value);
// → 5
```

¿Por qué me estoy esforzando tanto en no cambiar los objetos cuando el lenguaje obviamente espera que lo haga?

Porque me ayuda a entender mis programas. Una vez más, esto se trata de gestionar la complejidad. Cuando los objetos en mi sistema son cosas fijas y estables, puedo considerar operaciones sobre ellos de forma aislada: moverse a la casa de Alice desde un estado inicial dado siempre produce el mismo nuevo estado. Cuando los objetos cambian con el tiempo, eso añade toda una nueva dimensión de complejidad a este tipo de razonamiento.

Para un sistema pequeño como el que estamos construyendo en este capítulo, podríamos manejar ese poco de complejidad extra. Pero el límite más importante respecto a qué tipo de sistemas podemos construir es cuánto podemos entender. Cualquier cosa que haga que tu código sea más fácil de entender te permite construir un sistema más ambicioso.

Desafortunadamente, aunque entender un sistema construido sobre estructuras de datos persistentes es más fácil, _diseñar_ uno, especialmente cuando tu lenguaje de programación no ayuda, puede ser un poco más difícil. Buscaremos oportunidades para usar estructuras de datos persistentes en este libro, pero también usaremos aquellas que pueden cambiar.

## Simulación

{{index simulación, "mundo virtual"}}

Un ((robot)) de entrega observa el mundo y decide en qué dirección quiere moverse. Como tal, podríamos decir que un robot es una función que toma un objeto `VillageState` y devuelve el nombre de un lugar cercano.{{index "función runRobot"}}

Dado que queremos que los robots puedan recordar cosas, para que puedan hacer y ejecutar planes, también les pasamos su memoria y les permitimos devolver una nueva memoria. Por lo tanto, lo que un robot devuelve es un objeto que contiene tanto la dirección en la que quiere moverse como un valor de memoria que se le dará la próxima vez que se llame.

```{includeCode: true}
function runRobot(state, robot, memory) {
  for (let turn = 0;; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Terminado en ${turn} turnos`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Movido a ${action.direction}`);
  }
}
```

Consideremos lo que un robot tiene que hacer para "resolver" un estado dado. Debe recoger todos los paquetes visitando cada ubicación que tenga un paquete y entregarlos visitando cada ubicación a la que esté dirigido un paquete, pero solo después de recoger el paquete.

¿Cuál es la estrategia más tonta que podría funcionar? El robot podría simplemente caminar en una dirección aleatoria en cada turno. Eso significa que, con gran probabilidad, eventualmente se topará con todos los paquetes y en algún momento también llegará al lugar donde deben ser entregados.

{{index "función randomPick", "función randomRobot"}}

Esto es cómo podría lucir eso: 

```{includeCode: true}
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomRobot(state) {
  return {direction: randomPick(roadGraph[state.place])};
}
```

{{index "función Math.random", "función Math.floor", [array, "elemento aleatorio"]}}

Recuerda que `Math.random()` devuelve un número entre cero y uno, pero siempre por debajo de uno. Multiplicar dicho número por la longitud de un array y luego aplicarle `Math.floor` nos da un índice aleatorio para el array.

Dado que este robot no necesita recordar nada, ignora su segundo argumento (recuerda que las funciones de JavaScript pueden ser llamadas con argumentos adicionales sin efectos adversos) y omite la propiedad `memory` en su objeto devuelto.

Para poner a trabajar a este sofisticado robot, primero necesitaremos una forma de crear un nuevo estado con algunos paquetes. Un método estático (escrito aquí añadiendo directamente una propiedad al constructor) es un buen lugar para poner esa funcionalidad.

```{includeCode: true}
VillageState.random = function(parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPick(Object.keys(roadGraph));
    let place;
    do {
      place = randomPick(Object.keys(roadGraph));
    } while (place == address);
    parcels.push({place, address});
  }
  return new VillageState("Oficina Postal", parcels);
};
```

{{index "bucle do"}}

No queremos ningún paquete que sea enviado desde el mismo lugar al que está dirigido. Por esta razón, el bucle `do` sigue eligiendo nuevos lugares cuando obtiene uno que es igual a la dirección.

Vamos a iniciar un mundo virtual.

```{test: no}
runRobot(VillageState.random(), randomRobot);
// → Movido a Mercado
// → Movido a Ayuntamiento
// → …
// → Terminado en 63 turnos
```Al robot le lleva muchas vueltas entregar los paquetes porque no está planificando muy bien. Abordaremos eso pronto.

{{if interactive

Para tener una perspectiva más agradable de la simulación, puedes usar la función `runRobotAnimation` que está disponible en [el entorno de programación de este capítulo](https://eloquentjavascript.net/code/#7). Esto ejecuta la simulación, pero en lugar de mostrar texto, te muestra al robot moviéndose por el mapa del pueblo.

```{test: no}
runRobotAnimation(VillageState.random(), randomRobot);
```

La forma en que `runRobotAnimation` está implementada permanecerá como un misterio por ahora, pero después de que hayas leído los [capítulos posteriores](dom) de este libro, que tratan sobre la integración de JavaScript en los navegadores web, podrás adivinar cómo funciona.

if}}

## Ruta del camión de correo

{{index "mailRoute array"}}

Deberíamos poder hacerlo mucho mejor que el ((robot)) aleatorio. Una mejora sencilla sería inspirarnos en la forma en que funciona la entrega de correo en el mundo real. Si encontramos una ruta que pase por todos los lugares del pueblo, el robot podría recorrer esa ruta dos veces, momento en que se garantizaría que ha terminado. Aquí tienes una de esas rutas (comenzando desde la oficina de correos):

```{includeCode: true}
const mailRoute = [
  "Casa de Alicia", "Cabaña", "Casa de Alicia", "Casa de Bob",
  "Ayuntamiento", "Casa de Daria", "Casa de Ernie",
  "Casa de Grete", "Tienda", "Casa de Grete", "Granja",
  "Plaza del Mercado", "Oficina de Correos"
];
```

{{index "routeRobot function"}}

Para implementar el robot que sigue la ruta, necesitaremos hacer uso de la memoria del robot. El robot guarda el resto de su ruta en su memoria y deja caer el primer elemento en cada turno.

```{includeCode: true}
function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return {direction: memory[0], memory: memory.slice(1)};
}
```

Este robot es mucho más rápido ya. Tomará un máximo de 26 vueltas (el doble de la ruta de 13 pasos) pero generalmente menos.

{{if interactive

```{test: no}
runRobotAnimation(VillageState.random(), routeRobot, []);
```

if}}

## Búsqueda de caminos

Aún así, no llamaría a seguir ciegamente una ruta fija un comportamiento inteligente. Sería más eficiente si el ((robot)) ajustara su comportamiento a la tarea real que debe realizarse.

{{index pathfinding}}

Para hacer eso, tiene que poder moverse deliberadamente hacia un paquete dado o hacia la ubicación donde se debe entregar un paquete. Hacer eso, incluso cuando el objetivo está a más de un movimiento de distancia, requerirá algún tipo de función de búsqueda de ruta.

El problema de encontrar una ruta a través de un ((grafo)) es un _((problema de búsqueda))_ típico. Podemos determinar si una solución dada (una ruta) es una solución válida, pero no podemos calcular directamente la solución como podríamos hacerlo para 2 + 2. En su lugar, debemos seguir creando soluciones potenciales hasta encontrar una que funcione.

El número de rutas posibles a través de un grafo es infinito. Pero al buscar una ruta de _A_ a _B_, solo estamos interesados en aquellas que comienzan en _A_. Además, no nos importan las rutas que visiten el mismo lugar dos veces, esas definitivamente no son las rutas más eficientes en ningún lugar. Así que eso reduce la cantidad de rutas que el buscador de rutas debe considerar.De hecho, estamos mayormente interesados en la ruta _más corta_. Por lo tanto, queremos asegurarnos de buscar rutas cortas antes de mirar las más largas. Un buen enfoque sería "expandir" rutas desde el punto de inicio, explorando cada lugar alcanzable que aún no haya sido visitado, hasta que una ruta llegue al objetivo. De esta manera, solo exploraremos rutas que sean potencialmente interesantes, y sabremos que la primera ruta que encontremos es la ruta más corta (o una de las rutas más cortas, si hay más de una).

{{index "findRoute function"}}

{{id findRoute}}

Aquí hay una función que hace esto:

```{includeCode: true}
function findRoute(graph, from, to) {
  let work = [{at: from, route: []}];
  for (let i = 0; i < work.length; i++) {
    let {at, route} = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place);
      if (!work.some(w => w.at == place)) {
        work.push({at: place, route: route.concat(place)});
      }
    }
  }
}
```

La exploración debe realizarse en el orden correcto: los lugares que se alcanzaron primero deben explorarse primero. No podemos explorar de inmediato un lugar tan pronto como lleguemos a él porque eso significaría que los lugares alcanzados _desde allí_ también se explorarían de inmediato, y así sucesivamente, incluso si puede haber otros caminos más cortos que aún no se han explorado.

Por lo tanto, la función mantiene una _((lista de trabajo))_. Esta es una matriz de lugares que deben ser explorados a continuación, junto con la ruta que nos llevó allí. Comienza con solo la posición de inicio y una ruta vacía.

La búsqueda luego opera tomando el siguiente elemento en la lista y explorándolo, lo que significa que se ven todas las rutas que salen de ese lugar. Si una de ellas es el objetivo, se puede devolver una ruta terminada. De lo contrario, si no hemos mirado este lugar antes, se agrega un nuevo elemento a la lista. Si lo hemos mirado antes, dado que estamos buscando rutas cortas primero, hemos encontrado o bien una ruta más larga a ese lugar o una exactamente tan larga como la existente, y no necesitamos explorarla.

Puedes imaginar visualmente esto como una red de rutas conocidas que se extienden desde la ubicación de inicio, creciendo de manera uniforme en todos los lados (pero nunca enredándose de nuevo en sí misma). Tan pronto como el primer hilo alcance la ubicación objetivo, ese hilo se rastrea de vuelta al inicio, dándonos nuestra ruta.

{{index "grafo conectado"}}

Nuestro código no maneja la situación en la que no hay más elementos de trabajo en la lista de trabajo porque sabemos que nuestro gráfico está _conectado_, lo que significa que se puede llegar a cada ubicación desde todas las demás ubicaciones. Siempre podremos encontrar una ruta entre dos puntos, y la búsqueda no puede fallar.

```{includeCode: true}
function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}
```

{{index "goalOrientedRobot function"}}Este robot utiliza el valor de su memoria como una lista de direcciones en las que moverse, al igual que el robot que sigue la ruta. Cuando esa lista está vacía, debe averiguar qué hacer a continuación. Toma el primer paquete no entregado del conjunto y, si ese paquete aún no ha sido recogido, traza una ruta hacia él. Si el paquete ya ha sido recogido, todavía necesita ser entregado, por lo que el robot crea una ruta hacia la dirección de entrega.

{{if interactive

Veamos cómo lo hace.

```{test: no, startCode: true}
runRobotAnimation(VillageState.random(),
                  goalOrientedRobot, []);
```

if}}

Este robot suele terminar la tarea de entregar 5 paquetes en aproximadamente 16 turnos. Eso es ligeramente mejor que `routeRobot` pero definitivamente no es óptimo.

## Ejercicios

### Medición de un robot

{{index "measuring a robot (exercise)", testing, automation, "compareRobots function"}}

Es difícil comparar de manera objetiva los ((robot))s solo dejando que resuelvan algunos escenarios. Tal vez un robot simplemente tuvo tareas más fáciles o el tipo de tareas en las que es bueno, mientras que el otro no.

Escribe una función `compareRobots` que tome dos robots (y su memoria inicial). Debería generar 100 tareas y permitir que cada uno de los robots resuelva cada una de estas tareas. Cuando termine, debería mostrar el número promedio de pasos que cada robot dio por tarea.

Por el bien de la equidad, asegúrate de darle a cada tarea a ambos robots, en lugar de generar tareas diferentes por robot.

{{if interactive

```{test: no}
function compareRobots(robot1, memory1, robot2, memory2) {
  // Tu código aquí
}

compareRobots(routeRobot, [], goalOrientedRobot, []);
```
if}}

{{hint

{{index "measuring a robot (exercise)", "runRobot function"}}

Tendrás que escribir una variante de la función `runRobot` que, en lugar de registrar los eventos en la consola, devuelva el número de pasos que el robot tomó para completar la tarea.

Tu función de medición puede, entonces, en un bucle, generar nuevos estados y contar los pasos que toma cada uno de los robots. Cuando haya generado suficientes mediciones, puede usar `console.log` para mostrar el promedio de cada robot, que es el número total de pasos tomados dividido por el número de mediciones.

hint}}

### Eficiencia del robot

{{index "robot efficiency (exercise)"}}

¿Puedes escribir un robot que termine la tarea de entrega más rápido que `goalOrientedRobot`? Si observas el comportamiento de ese robot, ¿qué cosas claramente absurdas hace? ¿Cómo podrían mejorarse?

Si resolviste el ejercicio anterior, es posible que desees utilizar tu función `compareRobots` para verificar si mejoraste el robot.

{{if interactive

```{test: no}
// Tu código aquí

runRobotAnimation(VillageState.random(), tuRobot, memoria);
```

if}}

{{hint

{{index "robot efficiency (exercise)"}}

La principal limitación de `goalOrientedRobot` es que solo considera un paquete a la vez. A menudo caminará de un lado a otro del pueblo porque el paquete en el que está centrando su atención sucede que está en el otro lado del mapa, incluso si hay otros mucho más cerca.

Una posible solución sería calcular rutas para todos paquetes y luego tomar la más corta. Se pueden obtener resultados aún mejores, si hay múltiples rutas más cortas, al preferir aquellas que van a recoger un paquete en lugar de entregarlo.

hint}}

### Grupo persistente

{{index "grupo persistente (ejercicio)", "estructura de datos persistente", "clase Set", "conjunto (estructura de datos)", "clase Grupo", "clase PGroup"}}

La mayoría de las estructuras de datos proporcionadas en un entorno estándar de JavaScript no son muy adecuadas para un uso persistente. Los Arrays tienen métodos `slice` y `concat`, que nos permiten crear fácilmente nuevos arrays sin dañar el antiguo. Pero `Set`, por ejemplo, no tiene métodos para crear un nuevo conjunto con un elemento añadido o eliminado.

Escribe una nueva clase `PGroup`, similar a la clase `Grupo` del [Capítulo ?](object#groups), que almacena un conjunto de valores. Al igual que `Grupo`, tiene métodos `add`, `delete`, y `has`.

Sin embargo, su método `add` debería devolver una _nueva_ instancia de `PGroup` con el miembro dado añadido y dejar la anterior sin cambios. De manera similar, `delete` crea una nueva instancia sin un miembro dado.

La clase debería funcionar para valores de cualquier tipo, no solo para strings. No tiene que ser eficiente cuando se utiliza con grandes cantidades de valores.

{{index [interfaz, objeto]}}

El ((constructor)) no debería ser parte de la interfaz de la clase (aunque definitivamente querrás usarlo internamente). En su lugar, hay una instancia vacía, `PGroup.empty`, que se puede usar como valor inicial.

{{index singleton}}

¿Por qué necesitas solo un valor `PGroup.empty`, en lugar de tener una función que cree un nuevo mapa vacío cada vez?

{{if interactive

```{test: no}
class PGroup {
  // Tu código aquí
}

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
```

if}}

{{hint

{{index "mapa persistente (ejercicio)", "clase Set", [array, creación], "clase PGroup"}}

La forma más conveniente de representar el conjunto de valores miembro sigue siendo como un array, ya que los arrays son fáciles de copiar.

{{index "método concat", "método filter"}}

Cuando se añade un valor al grupo, puedes crear un nuevo grupo con una copia del array original que tenga el valor añadido (por ejemplo, usando `concat`). Cuando se elimina un valor, puedes filtrarlo del array.

El ((constructor)) de la clase puede tomar dicho array como argumento y almacenarlo como propiedad única de la instancia. Este array nunca se actualiza.

{{index "propiedad estática"}}

Para añadir la propiedad `empty` al constructor, puedes declararla como una propiedad estática.

Solo necesitas una instancia `empty` porque todos los grupos vacíos son iguales y las instancias de la clase no cambian. Puedes crear muchos grupos diferentes a partir de ese único grupo vacío sin afectarlo.

hint}}