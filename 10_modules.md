{{meta {load_files: ["code/packages_chapter_10.js", "code/chapter/07_robot.js"]}}}

# Módulos

{{quote {author: "Tef", title: "La programación es terrible", chapter: true}

Escribe código que sea fácil de borrar, no fácil de extender

quote}}

{{index "Yuan-Ma", "Libro de la Programación"}}

{{figure {url: "img/chapter_picture_10.jpg", alt: "Ilustración de un edificio complicado construido a partir de piezas modulares", chapter: framed}}}

{{index organización, [código, estructura de]}}

Idealmente, un programa tiene una estructura clara y directa. La forma en que funciona es fácil de explicar, y cada parte desempeña un papel bien definido.

{{index "crecimiento orgánico"}}

En la práctica, los programas crecen de forma orgánica. Se añaden piezas de funcionalidad a medida que el programador identifica nuevas necesidades. Mantener un programa de esta manera bien estructurado requiere atención y trabajo constantes. Este es un trabajo que solo dará sus frutos en el futuro, la próxima vez que alguien trabaje en el programa. Por lo tanto, es tentador descuidarlo y permitir que las diversas partes del programa se enreden profundamente.

Esto causa dos problemas prácticos. Primero, entender un sistema enredado es difícil. Si todo puede afectar a todo lo demás, es difícil ver cualquier pieza en aislamiento. Te ves obligado a construir una comprensión holística de todo el conjunto. Segundo, si deseas utilizar alguna funcionalidad de dicho programa en otra situación, puede ser más fácil reescribirla que intentar desenredarla de su contexto.

La frase "((gran bola de barro))" se usa a menudo para tales programas grandes y sin estructura. Todo se une, y al intentar sacar una pieza, todo el conjunto se desintegra y solo logras hacer un desastre.

## Programas modulares

{{index dependencia, [interfaz, módulo]}}

Los _módulos_ son un intento de evitar estos problemas. Un ((módulo)) es una parte de un programa que especifica en qué otras piezas se basa y qué funcionalidad proporciona para que otros módulos la utilicen (su _interfaz_).

{{index "gran bola de barro"}}

Las interfaces de los módulos tienen mucho en común con las interfaces de objetos, como las vimos en [Capítulo ?](object#interface). Permiten que una parte del módulo esté disponible para el mundo exterior y mantienen el resto privado.

{{index dependencia}}

Pero la interfaz que un módulo proporciona para que otros la utilicen es solo la mitad de la historia. Un buen sistema de módulos también requiere que los módulos especifiquen qué código _ellos_ utilizan de otros módulos. Estas relaciones se llaman _dependencias_. Si el módulo A utiliza funcionalidad del módulo B, se dice que _depende_ de él. Cuando estas dependencias se especifican claramente en el propio módulo, se pueden utilizar para averiguar qué otros módulos deben estar presentes para poder utilizar un módulo dado y cargar las dependencias automáticamente.

Cuando las formas en que los módulos interactúan entre sí son explícitas, un sistema se vuelve más como ((LEGO)), donde las piezas interactúan a través de conectores bien definidos, y menos como barro, donde todo se mezcla con todo.

## Módulos ES

{{index "ámbito global", [vinculación, global]}}El lenguaje original JavaScript no tenía ningún concepto de un módulo. Todos los scripts se ejecutaban en el mismo ámbito, y acceder a una función definida en otro script se hacía mediante la referencia a las vinculaciones globales creadas por ese script. Esto fomentaba activamente el enredo accidental y difícil de detectar del código e invitaba a problemas como scripts no relacionados que intentaban usar el mismo nombre de vinculación.

{{index "Módulos de ES"}}

Desde ECMAScript 2015, JavaScript admite dos tipos diferentes de programas. Los _scripts_ se comportan de la manera antigua: sus vinculaciones se definen en el ámbito global y no tienen forma de referenciar directamente otros scripts. Los _módulos_ obtienen su propio ámbito separado y admiten las palabras clave `import` y `export`, que no están disponibles en los scripts, para declarar sus dependencias e interfaz. Este sistema de módulos se suele llamar _módulos de ES_ (donde "ES" significa "ECMAScript").

Un programa modular está compuesto por varios de estos módulos, conectados a través de sus importaciones y exportaciones.

{{index "Clase Date", "módulo weekDay"}}

Este ejemplo de módulo convierte entre nombres de días y números (como los devueltos por el método `getDay` de `Date`). Define una constante que no forma parte de su interfaz y dos funciones que sí lo son. No tiene dependencias.

```
const names = ["Domingo", "Lunes", "Martes", "Miércoles",
               "Jueves", "Viernes", "Sábado"];

export function dayName(number) {
  return names[number];
}
export function dayNumber(name) {
  return names.indexOf(name);
}
```

La palabra clave `export` se puede colocar delante de una función, clase o definición de vinculación para indicar que esa vinculación es parte de la interfaz del módulo. Esto permite que otros módulos utilicen esa vinculación importándola.

```{test: no}
import {dayName} from "./dayname.js";
let ahora = new Date();
console.log(`Hoy es ${dayName(ahora.getDay())}`);
// → Hoy es Lunes
```

{{index "palabra clave import", dependencia, "módulos de ES"}}

La palabra clave `import`, seguida de una lista de nombres de vinculación entre llaves, hace que las vinculaciones de otro módulo estén disponibles en el módulo actual. Los módulos se identifican por cadenas entre comillas.

{{index [módulo, resolución], resolución}}

Cómo se resuelve un nombre de módulo a un programa real difiere según la plataforma. El navegador los trata como direcciones web, mientras que Node.js los resuelve a archivos. Para ejecutar un módulo, se cargan todos los demás módulos en los que depende, y las vinculaciones exportadas se ponen a disposición de los módulos que las importan.

Las declaraciones de importación y exportación no pueden aparecer dentro de funciones, bucles u otros bloques. Se resuelven de inmediato cuando se carga el módulo, independientemente de cómo se ejecute el código en el módulo, y para reflejar esto, deben aparecer solo en el cuerpo del módulo externo.

Así que la interfaz de un módulo consiste en una colección de vinculaciones con nombres, a las cuales tienen acceso otros módulos que dependen de ellas. Las vinculaciones importadas se pueden renombrar para darles un nuevo nombre local utilizando `as` después de su nombre.

```
import {dayName as nomDeJour} from "./dayname.js";
console.log(nomDeJour(3));
// → Miércoles
```

También es posible que un módulo tenga una exportación especial llamada `default`, que a menudo se usa para módulos que solo exportan un único enlace. Para definir una exportación predeterminada, se escribe `export default` antes de una expresión, una declaración de función o una declaración de clase.

```
export default ["Invierno", "Primavera", "Verano", "Otoño"];
```

Este enlace se importa omitiendo las llaves alrededor del nombre de la importación.

```
import nombresEstaciones from "./nombrsestaciones.js";
```

## Paquetes

{{index bug, dependency, structure, reuse}}

Una de las ventajas de construir un programa a partir de piezas separadas y poder ejecutar algunas de esas piezas por separado, es que puedes aplicar la misma pieza en diferentes programas.

{{index "parseINI function"}}

Pero, ¿cómo se configura esto? Digamos que quiero usar la función `parseINI` de [Capítulo ?](regexp#ini) en otro programa. Si está claro de qué depende la función (en este caso, nada), puedo simplemente copiar ese módulo en mi nuevo proyecto y usarlo. Pero luego, si encuentro un error en el código, probablemente lo corrija en el programa con el que estoy trabajando en ese momento y olvide corregirlo también en el otro programa.

{{index duplication, "copy-paste programming"}}

Una vez que empieces a duplicar código, rápidamente te darás cuenta de que estás perdiendo tiempo y energía moviendo copias y manteniéndolas actualizadas.

Ahí es donde entran los _((paquete))s_. Un paquete es un fragmento de código que se puede distribuir (copiar e instalar). Puede contener uno o más módulos y tiene información sobre en qué otros paquetes depende. Un paquete también suele venir con documentación que explica qué hace para que las personas que no lo escribieron aún puedan usarlo.

Cuando se encuentra un problema en un paquete o se añade una nueva característica, se actualiza el paquete. Ahora los programas que dependen de él (que también pueden ser paquetes) pueden copiar la nueva ((versión)) para obtener las mejoras que se hicieron en el código.

{{id modules_npm}}

{{index installation, upgrading, "package manager", download, reuse}}

Trabajar de esta manera requiere ((infraestructura)). Necesitamos un lugar para almacenar y encontrar paquetes y una forma conveniente de instalar y actualizarlos. En el mundo de JavaScript, esta infraestructura es provista por ((NPM)) ([_https://npmjs.org_](https://npmjs.org)).

NPM es dos cosas: un servicio en línea donde puedes descargar (y subir) paquetes y un programa (incluido con Node.js) que te ayuda a instalar y gestionarlos.

{{index "ini package"}}

En el momento de la escritura, hay más de tres millones de paquetes diferentes disponibles en NPM. Una gran parte de ellos son basura, para ser honesto. Pero casi cada paquete de JavaScript útil y disponible públicamente se puede encontrar en NPM. Por ejemplo, un analizador de archivos INI, similar al que construimos en [Capítulo ?](regexp), está disponible bajo el nombre del paquete `ini`.

{{index "command line"}}

[Capítulo ?](node) mostrará cómo instalar tales paquetes localmente usando el programa de línea de comandos `npm`.

Tener paquetes de calidad disponibles para descargar es extremadamente valioso. Significa que a menudo podemos evitar reinventar un programa que 100 personas han escrito antes y obtener una implementación sólida y bien probada con solo presionar algunas teclas.

{{index mantenimiento}}

El software es barato de copiar, por lo que una vez que alguien lo ha escrito, distribuirlo a otras personas es un proceso eficiente. Pero escribirlo en primer lugar _es_ trabajo, y responder a las personas que han encontrado problemas en el código, o que desean proponer nuevas características, es incluso más trabajo.

Por defecto, eres el ((propietario de los derechos de autor)) del código que escribes, y otras personas solo pueden usarlo con tu permiso. Pero porque algunas personas son amables y porque publicar buen software puede ayudarte a volverte un poco famoso entre los programadores, muchos paquetes se publican bajo una ((licencia)) que permite explícitamente a otras personas usarlo.

La mayoría del código en ((NPM)) tiene esta licencia. Algunas licencias requieren que también publiques el código que construyes sobre el paquete bajo la misma licencia. Otros son menos exigentes, simplemente requiriendo que mantengas la licencia con el código al distribuirlo. La comunidad de JavaScript mayormente utiliza este último tipo de licencia. Al usar paquetes de otras personas, asegúrate de estar al tanto de su licencia.

{{id modulos_ini}}

{{index "paquete ini"}}

Ahora, en lugar de escribir nuestro propio analizador de archivos INI, podemos usar uno de ((NPM)).

```
import {parse} from "ini";

console.log(parse("x = 10\ny = 20"));
// → {x: "10", y: "20"}
```

{{id commonjs}}

## Módulos CommonJS

Antes de 2015, cuando el lenguaje de JavaScript no tenía un sistema de módulos integrado real, las personas ya estaban construyendo sistemas grandes en JavaScript. Para que funcionara, ellos _necesitaban_ ((módulos)).

{{index [función, alcance], [interfaz, módulo], [objeto, como módulo]}}

La comunidad diseñó sus propios ((sistemas de módulos)) improvisados sobre el lenguaje. Estos utilizan funciones para crear un alcance local para los módulos y objetos regulares para representar interfaces de módulos.

Inicialmente, las personas simplemente envolvían manualmente todo su módulo en una "((expresión de función invocada inmediatamente))" para crear el alcance del módulo, y asignaban sus objetos de interfaz a una única variable global.

```
const semana = function() {
  const nombres = ["Domingo", "Lunes", "Martes", "Miércoles",
                 "Jueves", "Viernes", "Sábado"];
  return {
    nombre(numero) { return nombres[numero]; },
    numero(nombre) { return nombres.indexOf(nombre); }
  };
}();

console.log(semana.nombre(semana.numero("Domingo")));
// → Domingo
```

{{index dependencia, [interfaz, módulo]}}

Este estilo de módulos proporciona ((aislamiento)), hasta cierto punto, pero no declara dependencias. En cambio, simplemente coloca su interfaz en el ((ámbito global)) y espera que sus dependencias, si las tiene, hagan lo mismo. Esto no es ideal.

{{index "Módulos CommonJS"}}

Si implementamos nuestro propio cargador de módulos, podemos hacerlo mejor. El enfoque más ampliamente utilizado para los módulos de JavaScript agregados se llama _Módulos CommonJS_. ((Node.js)) lo utilizaba desde el principio (aunque ahora también sabe cómo cargar módulos ES) y es el sistema de módulos utilizado por muchos paquetes en ((NPM)).

{{index "función require", [interfaz, módulo], "objeto exports"}}

Un módulo CommonJS se ve como un script regular, pero tiene acceso a dos enlaces que utiliza para interactuar con otros módulos. El primero es una función llamada `require`. Cuando llamas a esto con el nombre del módulo de tu dependencia, se asegura de que el módulo esté cargado y devuelve su interfaz. El segundo es un objeto llamado `exports`, que es el objeto de interfaz para el módulo. Comienza vacío y agregas propiedades para definir los valores exportados.{{index "formatDate module", "Date class", "ordinal package", "date-names package"}}

Este módulo de ejemplo CommonJS proporciona una función de formateo de fechas. Utiliza dos ((package))s de NPM: `ordinal` para convertir números en strings como `"1st"` y `"2nd"`, y `date-names` para obtener los nombres en inglés de los días de la semana y los meses. Exporta una única función, `formatDate`, que recibe un objeto `Date` y una cadena ((template)).

La cadena de template puede contener códigos que indican el formato, como `YYYY` para el año completo y `Do` para el día ordinal del mes. Puede pasársele una cadena como `"MMMM Do YYYY"` para obtener una salida como "22 de noviembre de 2017".

```
const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal(date.getDate());
    if (tag == "dddd") return days[date.getDay()];
  });
};
```

{{index "destructuring binding"}}

La interfaz de `ordinal` es una única función, mientras que `date-names` exporta un objeto que contiene múltiples cosas: `days` y `months` son arrays de nombres. La técnica de desestructuración es muy conveniente al crear enlaces para las interfaces importadas.

El módulo añade su función de interfaz a `exports` para que los módulos que dependen de él tengan acceso a ella. Podemos usar el módulo de la siguiente manera:

```
const {formatDate} = require("./format-date.js");

console.log(formatDate(new Date(2017, 9, 13),
                       "dddd the Do"));
// → Viernes 13º
```

CommonJS se implementa con un cargador de módulos que, al cargar un módulo, envuelve su código en una función (dándole su propio ámbito local) y pasa los enlaces `require` y `exports` a esa función como argumentos.

{{id require}}

{{index "require function", "CommonJS modules", "readFile function"}}

Si asumimos que tenemos acceso a una función `readFile` que lee un archivo por su nombre y nos da su contenido, podemos definir una forma simplificada de `require` de la siguiente manera:

```{test: wrap, sandbox: require}
function require(name) {
  if (!(name in require.cache)) {
    let code = readFile(name);
    let exports = require.cache[name] = {};
    let wrapper = Function("require, exports", code);
    wrapper(require, exports);
  }
  return require.cache[name];
}
require.cache = Object.create(null);
```

{{id eval}}

{{index "Function constructor", eval, security}}

`Function` es una función interna de JavaScript que recibe una lista de argumentos (como una cadena separada por comas) y una cadena que contiene el cuerpo de la función, devolviendo un valor de función con esos argumentos y ese cuerpo. Este es un concepto interesante, ya que permite que un programa cree nuevas partes del programa a partir de datos de cadena, pero también es peligroso, ya que si alguien logra engañar a tu programa para que introduzca una cadena que ellos proporcionan en `Function`, pueden hacer que el programa haga cualquier cosa que quieran.{{index [archivo, acceso]}}

JavaScript estándar no proporciona una función como `readFile`, pero diferentes entornos de JavaScript, como el navegador y Node.js, proporcionan sus propias formas de acceder a los archivos. El ejemplo simplemente simula que `readFile` existe.

Para evitar cargar el mismo módulo múltiples veces, `require` mantiene una tienda (caché) de módulos ya cargados. Cuando se llama, primero comprueba si el módulo solicitado ha sido cargado y, si no, lo carga. Esto implica leer el código del módulo, envolverlo en una función y llamarlo.

{{index "paquete ordinal", "objeto exports", "objeto module", [interfaz, módulo]}}

Al definir `require`, `exports` como parámetros para la función de envoltura generada (y pasar los valores apropiados al llamarla), el cargador se asegura de que estos enlaces estén disponibles en el ámbito del módulo.

Una diferencia importante entre este sistema y los módulos ES es que las importaciones de módulos ES suceden antes de que comience a ejecutarse el script de un módulo, mientras que `require` es una función normal, invocada cuando el módulo ya está en ejecución. A diferencia de las declaraciones `import`, las llamadas a `require` _pueden_ aparecer dentro de funciones, y el nombre de la dependencia puede ser cualquier expresión que se evalúe a una cadena, mientras que `import` solo permite cadenas simples entre comillas.

La transición de la comunidad de JavaScript desde el estilo CommonJS a los módulos ES ha sido lenta y algo complicada. Pero afortunadamente, ahora estamos en un punto en el que la mayoría de los paquetes populares en NPM proporcionan su código como módulos ES, y Node.js permite que los módulos ES importen desde módulos CommonJS. Por lo tanto, si bien el código CommonJS es algo con lo que te encontrarás, ya no hay una razón real para escribir nuevos programas en este estilo.

## Compilación y empaquetado

{{index compilación, "verificación de tipos"}}

Muchos paquetes de JavaScript no están, técnicamente, escritos en JavaScript. Hay extensiones, como TypeScript, el dialecto de verificación de tipos mencionado en el [Capítulo ?](error#typing), que se utilizan ampliamente. A menudo, las personas también comienzan a usar extensiones planeadas para el lenguaje mucho antes de que se agreguen a las plataformas que realmente ejecutan JavaScript.

Para hacer esto posible, _compilan_ su código, traduciéndolo desde su dialecto de JavaScript elegido a JavaScript antiguo, e incluso a una versión anterior de JavaScript, para que los navegadores puedan ejecutarlo.

{{index latencia, rendimiento, [archivo, acceso], [red, velocidad]}}

Incluir un programa modular que consta de 200 archivos diferentes en una ((página web)) produce sus propios problemas. Si recuperar un solo archivo a través de la red lleva 50 milisegundos, cargar todo el programa lleva 10 segundos, o quizás la mitad de eso si puedes cargar varios archivos simultáneamente. Eso es mucho tiempo desperdiciado. Como recuperar un solo archivo grande tiende a ser más rápido que recuperar muchos archivos pequeños, los programadores web han comenzado a usar herramientas que combinan sus programas (que dividieron minuciosamente en módulos) en un solo archivo grande antes de publicarlo en la Web. Estas herramientas se llaman _((bundler))s_.

{{index "tamaño del archivo"}}Y podemos ir más allá. Aparte del número de archivos, el _tamaño_ de los archivos también determina qué tan rápido pueden ser transferidos a través de la red. Por lo tanto, la comunidad de JavaScript ha inventado _((minificador))es_. Estas son herramientas que toman un programa de JavaScript y lo hacen más pequeño al eliminar automáticamente comentarios y espacios en blanco, renombrar enlaces y reemplazar fragmentos de código con código equivalente que ocupa menos espacio.

{{index pipeline, herramienta}}

Por lo tanto, no es raro que el código que encuentres en un paquete de NPM o que se ejecute en una página web haya pasado por _múltiples_ etapas de transformación, convirtiéndose desde JavaScript moderno a JavaScript histórico, luego combinando los módulos en un solo archivo, y minimizando el código. No entraremos en detalles sobre estas herramientas en este libro ya que hay muchas de ellas, y cuál es popular cambia regularmente. Simplemente ten en cuenta que tales cosas existen, y búscalas cuando las necesites.

## Diseño de módulos

{{index [módulo, diseño], [interfaz, módulo], [código, "estructura de"]}}

Estructurar programas es uno de los aspectos más sutiles de la programación. Cualquier funcionalidad no trivial puede ser organizada de diversas formas.

Un buen diseño de programa es subjetivo—hay compensaciones implicadas y cuestiones de gusto. La mejor manera de aprender el valor de un diseño bien estructurado es leer o trabajar en muchos programas y notar qué funciona y qué no. No asumas que un desorden doloroso es “simplemente así”. Puedes mejorar la estructura de casi todo pensando más detenidamente en ello.

{{index [interfaz, módulo]}}

Un aspecto del diseño de módulos es la facilidad de uso. Si estás diseñando algo que se supone será utilizado por varias personas—o incluso por ti mismo, dentro de tres meses cuando ya no recuerdes los detalles de lo que hiciste—es útil que tu interfaz sea simple y predecible.

{{index "paquete ini", JSON}}

Eso puede significar seguir convenciones existentes. Un buen ejemplo es el paquete `ini`. Este módulo imita el objeto estándar `JSON` al proporcionar funciones `parse` y `stringify` (para escribir un archivo INI), y, como `JSON`, convierte entre cadenas y objetos simples. Por lo tanto, la interfaz es pequeña y familiar, y después de haber trabajado con ella una vez, es probable que recuerdes cómo usarla.

{{index "efecto secundario", "disco duro", composabilidad}}

Incluso si no hay una función estándar o paquete ampliamente utilizado para imitar, puedes mantener tus módulos predecibles utilizando estructuras de datos simples y haciendo una sola cosa enfocada. Muchos de los módulos de análisis de archivos INI en NPM proporcionan una función que lee directamente dicho archivo desde el disco duro y lo analiza, por ejemplo. Esto hace imposible usar dichos módulos en el navegador, donde no tenemos acceso directo al sistema de archivos, y añade complejidad que hubiera sido mejor abordada _componiendo_ el módulo con alguna función de lectura de archivos.

{{index "función pura"}}

Esto señala otro aspecto útil del diseño de módulos—la facilidad con la que algo puede ser compuesto con otro código. Los módulos enfocados en calcular valores son aplicables en una gama más amplia de programas que los módulos más grandes que realizan acciones complicadas con efectos secundarios. Un lector de archivos INI que insiste en leer el archivo desde el disco es inútil en un escenario donde el contenido del archivo proviene de otra fuente.{{index "programación orientada a objetos"}}

Relacionado con esto, a veces los objetos con estado son útiles o incluso necesarios, pero si algo se puede hacer con una función, utiliza una función. Varios de los lectores de archivos INI en NPM proporcionan un estilo de interfaz que requiere que primero crees un objeto, luego cargues el archivo en tu objeto, y finalmente uses métodos especializados para acceder a los resultados. Este tipo de enfoque es común en la tradición orientada a objetos, y es terrible. En lugar de hacer una sola llamada a función y continuar, debes realizar el ritual de mover tu objeto a través de sus diversos estados. Y debido a que los datos están envueltos en un tipo de objeto especializado, todo el código que interactúa con él debe conocer ese tipo, creando interdependencias innecesarias.

A menudo, no se puede evitar definir nuevas estructuras de datos, ya que el estándar del lenguaje proporciona solo algunas básicas, y muchos tipos de datos deben ser más complejos que un array o un mapa. Pero cuando un array es suficiente, utiliza un array.

Un ejemplo de una estructura de datos ligeramente más compleja es el grafo de [Capítulo ?](robot). No hay una forma única obvia de representar un ((grafo)) en JavaScript. En ese capítulo, utilizamos un objeto cuyas propiedades contienen arrays de strings: los otros nodos alcanzables desde ese nodo.

Existen varios paquetes de búsqueda de rutas en ((NPM)), pero ninguno de ellos utiliza este formato de grafo. Por lo general, permiten que las aristas del grafo tengan un peso, que es el costo o la distancia asociada a ellas. Eso no es posible en nuestra representación.

{{index "Dijkstra, Edsger", pathfinding, "algoritmo de Dijkstra", "paquete dijkstrajs"}}

Por ejemplo, está el paquete `dijkstrajs`. Un enfoque conocido para la búsqueda de rutas, bastante similar a nuestra función `findRoute`, se llama _algoritmo de Dijkstra_, en honor a Edsger Dijkstra, quien lo escribió por primera vez. A menudo se agrega el sufijo `js` a los nombres de los paquetes para indicar que están escritos en JavaScript. Este paquete `dijkstrajs` utiliza un formato de grafo similar al nuestro, pero en lugar de arrays, utiliza objetos cuyos valores de propiedad son números, los pesos de las aristas.

Por lo tanto, si quisiéramos usar ese paquete, deberíamos asegurarnos de que nuestro grafo esté almacenado en el formato que espera. Todas las aristas tienen el mismo peso, ya que nuestro modelo simplificado trata cada camino como teniendo el mismo coste (una vuelta).

```
const {find_path} = require("dijkstrajs");

let graph = {};
for (let node of Object.keys(roadGraph)) {
  let edges = graph[node] = {};
  for (let dest of roadGraph[node]) {
    edges[dest] = 1;
  }
}

console.log(find_path(graph, "Oficina de Correos", "Cabaña"));
// → ["Oficina de Correos", "Casa de Alicia", "Cabaña"]
```

Esto puede ser una barrera para la composición: cuando varios paquetes están utilizando diferentes estructuras de datos para describir cosas similares, combinarlos es difícil. Por lo tanto, si deseas diseñar para la composabilidad, averigua qué ((estructuras de datos)) están utilizando otras personas y, cuando sea posible, sigue su ejemplo.

{{index diseño}}

Diseñar una estructura de módulo adecuada para un programa puede ser difícil. En la fase en la que aún estás explorando el problema, probando diferentes cosas para ver qué funciona, es posible que no quieras preocuparte demasiado por esto, ya que mantener todo organizado puede ser una gran distracción. Una vez que tengas algo que se sienta sólido, es un buen momento para dar un paso atrás y organizarlo.## Resumen

Los módulos proporcionan estructura a programas más grandes al separar el código en piezas con interfaces claras y dependencias. La interfaz es la parte del módulo que es visible para otros módulos, y las dependencias son los otros módulos que se utilizan.

Dado que JavaScript históricamente no proporcionaba un sistema de módulos, se construyó el sistema CommonJS sobre él. Luego, en algún momento _obtuvo_ un sistema incorporado, que ahora coexiste incómodamente con el sistema CommonJS.

Un paquete es un fragmento de código que se puede distribuir por sí solo. NPM es un repositorio de paquetes de JavaScript. Puedes descargar todo tipo de paquetes útiles (y inútiles) desde aquí.

## Ejercicios

### Un robot modular

{{index "modular robot (exercise)", module, robot, NPM}}

{{id modular_robot}}

Estos son los enlaces que crea el proyecto del [Capítulo ?](robot):

```{lang: "null"}
roads
buildGraph
roadGraph
VillageState
runRobot
randomPick
randomRobot
mailRoute
routeRobot
findRoute
goalOrientedRobot
```

Si tuvieras que escribir ese proyecto como un programa modular, ¿qué módulos crearías? ¿Qué módulo dependería de qué otro módulo y cómo serían sus interfaces?

¿Qué piezas es probable que estén disponibles preescritas en NPM? ¿Preferirías usar un paquete de NPM o escribirlos tú mismo?

{{hint

{{index "modular robot (exercise)"}}

Esto es lo que habría hecho (pero de nuevo, no hay una única forma _correcta_ de diseñar un módulo dado):

{{index "dijkstrajs package"}}

El código utilizado para construir el gráfico de carreteras se encuentra en el módulo `graph`. Como preferiría usar `dijkstrajs` de NPM en lugar de nuestro propio código de búsqueda de caminos, haremos que este construya el tipo de datos de gráfico que espera `dijkstrajs`. Este módulo exporta una única función, `buildGraph`. Haría que `buildGraph` aceptara un arreglo de arreglos de dos elementos, en lugar de cuerdas que contienen guiones, para hacer que el módulo dependa menos del formato de entrada.

El módulo `roads` contiene los datos crudos de las carreteras (el arreglo `roads`) y el enlace `roadGraph`. Este módulo depende de `./graph.js` y exporta el grafo de carreteras.

{{index "random-item package"}}

La clase `VillageState` se encuentra en el módulo `state`. Depende del módulo `./roads` porque necesita poder verificar que una carretera dada exista. También necesita `randomPick`. Dado que es una función de tres líneas, podríamos simplemente ponerla en el módulo `state` como una función auxiliar interna. Pero `randomRobot` también la necesita. Entonces tendríamos que duplicarla o ponerla en su propio módulo. Dado que esta función existe en NPM en el paquete `random-item`, una solución razonable es hacer que ambos módulos dependan de eso. También podemos agregar la función `runRobot` a este módulo, ya que es pequeña y está relacionada con la gestión del estado. El módulo exporta tanto la clase `VillageState` como la función `runRobot`.

Finalmente, los robots, junto con los valores en los que dependen, como `mailRoute`, podrían ir en un módulo `example-robots`, que depende de `./roads` y exporta las funciones del robot. Para que `goalOrientedRobot` pueda realizar la búsqueda de rutas, este módulo también depende de `dijkstrajs`.Al externalizar cierto trabajo a módulos ((NPM)), el código se volvió un poco más pequeño. Cada módulo individual hace algo bastante simple y se puede leer por sí solo. Dividir el código en módulos a menudo sugiere mejoras adicionales en el diseño del programa. En este caso, parece un poco extraño que el `VillageState` y los robots dependan de un gráfico de caminos específico. Podría ser una mejor idea hacer que el gráfico sea un argumento del constructor de estado y hacer que los robots lo lean desde el objeto de estado, esto reduce las dependencias (lo cual siempre es bueno) y hace posible ejecutar simulaciones en mapas diferentes (lo cual es aun mejor).

¿Es una buena idea utilizar módulos de NPM para cosas que podríamos haber escrito nosotros mismos? En principio, sí, para cosas no triviales como la función de búsqueda de caminos es probable que cometas errores y pierdas tiempo escribiéndolas tú mismo. Para funciones pequeñas como `random-item`, escribirlas por ti mismo es bastante fácil. Pero añadirlas donde las necesitas tiende a saturar tus módulos.

Sin embargo, tampoco debes subestimar el trabajo involucrado en _encontrar_ un paquete de NPM apropiado. Y aunque encuentres uno, podría no funcionar bien o le podrían faltar alguna característica que necesitas. Además, depender de paquetes de NPM significa que debes asegurarte de que estén instalados, debes distribuirlos con tu programa y es posible que debas actualizarlos periódicamente.

Así que de nuevo, esto es un compromiso, y puedes decidir de cualquier manera dependiendo de cuánto te ayude realmente un paquete dado.

hint}}

### Módulo de caminos

{{index "módulo de caminos (ejercicio)"}}

Escribe un módulo ES, basado en el ejemplo del [Capítulo ?](robot), que contenga el array de caminos y exporte la estructura de datos de gráfico que los representa como `roadGraph`. Debería depender de un módulo `./graph.js`, que exporta una función `buildGraph` que se utiliza para construir el gráfico. Esta función espera un array de arrays de dos elementos (los puntos de inicio y fin de los caminos).

{{if interactive

```{test: no}
// Añade dependencias y exportaciones

const roads = [
  "Casa de Alicia-Casa de Bob",
  "Casa de Alicia-Cabaña",
  "Casa de Alicia-Oficina de Correos",
  "Casa de Bob-Ayuntamiento",
  "Casa de Daría-Casa de Ernie",
  "Casa de Daría-Ayuntamiento",
  "Casa de Ernie-Casa de Grete",
  "Casa de Grete-Granja",
  "Casa de Grete-Tienda",
  "Plaza de Mercado-Granja",
  "Plaza de Mercado-Oficina de Correos",
  "Plaza de Mercado-Tienda",
  "Plaza de Mercado-Ayuntamiento",
  "Tienda-Ayuntamiento"
];
```

if}}

{{hint

{{index "módulo de caminos (ejercicio)", "desestructuración", "objeto de exportaciones"}}

Dado que este es un módulo ES, debes usar `import` para acceder al módulo de gráfico. Esto se describió como exportando una función de `buildGraph`, la cual puedes seleccionar de su objeto de interfaz con una declaración de desestructuración `const`.

Para exportar `roadGraph`, colocas la palabra clave `export` antes de su definición. Debido a que `buildGraph` toma una estructura de datos que no coincide exactamente con `roads`, la división de las cadenas de carretera debe ocurrir en tu módulo.

hint}}

### Dependencias circulares

{{index dependency, "dependencia circular", "función require"}}Una dependencia circular es una situación en la que el módulo A depende de B, y B también, directa o indirectamente, depende de A. Muchos sistemas de módulos simplemente prohíben esto porque, sin importar el orden que elijas para cargar dichos módulos, no puedes asegurarte de que las dependencias de cada módulo se hayan cargado antes de que se ejecute.

Los módulos ((CommonJS)) permiten una forma limitada de dependencias cíclicas. Siempre y cuando los módulos no accedan a la interfaz de cada uno hasta después de que terminen de cargarse, las dependencias cíclicas están bien.

La función `require` proporcionada [anteriormente en este capítulo](modules#require) admite este tipo de ciclo de dependencia. ¿Puedes ver cómo maneja los ciclos?

{{hint

{{index sobreescritura, "dependencia circular", "objeto de exportación"}}

El truco es que `require` añade el objeto de interfaz de un módulo a su caché _antes_ de comenzar a cargar el módulo. De esta manera, si se hace alguna llamada a `require` mientras se está ejecutando tratando de cargarlo, ya se conoce, y se devolverá la interfaz actual, en lugar de comenzar a cargar el módulo nuevamente (lo que eventualmente desbordaría la pila).

hint}}