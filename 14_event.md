{{meta {chap_num: 14, prev_link: 13_dom, next_link: 15_game}}}

# Handling Events

{{quote {author: "Marcus Aurelius,Meditations", chapter: true}

You have power over your mind—not
outside events. Realize this, and you will find strength.

quote}}

{{index stoicism, "Marcus Aurelius", input, timeline, "control flow"}}

Some programs work with direct user input, such as mouse and
keyboard interaction. The timing and order of such input can't be
predicted in advance. This requires a different approach to control
flow than the one we have used so far.

## Event handlers

{{index polling, button, "real-time"}}

Imagine an interface where the
only way to find out whether a key on the keyboard is being pressed is to read the
current state of that key. To be able to react to keypresses,
you would have to constantly read the key's state so that
you'd catch it before it's released again. It would be dangerous to
perform other time-intensive computations since you might miss a
keypress.

That is how such input was handled on primitive machines. A step
up would be for the hardware or operating system to notice the
keypress and put it in a queue. A program can then periodically check the
queue for new events and react to what it finds there.

{{index responsiveness, "user experience"}}

Of course, it has to remember
to look at the queue, and to do it often, because any time between the
key being pressed and the program noticing the event will cause the
software to feel unresponsive. This approach is called _((polling))_.
Most programmers avoid it whenever possible.

{{index "callback function", "event handling"}}

A better mechanism is for
the underlying system to give our code a chance to react
to events as they occur. Browsers do this by allowing us to register
functions as _handlers_ for specific events.

```text/html
<p>Click this document to activate the handler.</p>
<script>
  addEventListener("click", function() {
    console.log("You clicked!");
  });
</script>
```

{{index "click event", "addEventListener method"}}

The `addEventListener`
function registers its second argument to be called whenever the event
described by its first argument occurs.

## Events and DOM nodes

{{index "addEventListener method", "event handling"}}

Each ((browser))
event handler is registered in a context. When you call
`addEventListener` as shown previously, you are calling it as a method on the
whole ((window)) because in the browser the ((global scope)) is
equivalent to the `window` object. Every ((DOM)) element has its own
`addEventListener` method, which allows you to listen specifically on
that element.

```text/html
<button>Click me</button>
<p>No handler here.</p>
<script>
  var button = document.querySelector("button");
  button.addEventListener("click", function() {
    console.log("Button clicked.");
  });
</script>
```

{{index "click event", "button (HTML tag)"}}

The example attaches a handler
to the button node. Thus, clicks on the button cause that handler to
run, whereas clicks on the rest of the document do not.

{{index "onclick attribute", encapsulation}}

Giving a node an `onclick`
attribute has a similar effect. But a node has only one `onclick`
attribute, so you can register only one handler per node that way. The
`addEventListener` method allows you to add any number of handlers, so
you can't accidentally replace a handler that has already been
registered.

{{index "removeEventListener method"}}

The `removeEventListener` method,
called with arguments similar to as `addEventListener`, removes a
handler.

```text/html
<button>Act-once button</button>
<script>
  var button = document.querySelector("button");
  function once() {
    console.log("Done.");
    button.removeEventListener("click", once);
  }
  button.addEventListener("click", once);
</script>
```

{{index [function, "as value"]}}

To be able to unregister a handler function, we
give it a name (such as `once`) so that we
can pass it to both `addEventListener` and `removeEventListener`.

## Event objects

{{index "which property", "event handling"}}

Though we have ignored it in
the previous examples, event handler functions are passed an argument:
the _((event object))_. This object gives us additional information
about the event. For example, if we want to know _which_ ((mouse
button)) was pressed, we can look at the event object's `which` property.

```text/html
<button>Click me any way you want</button>
<script>
  var button = document.querySelector("button");
  button.addEventListener("mousedown", function(event) {
    if (event.which == 1)
      console.log("Left button");
    else if (event.which == 2)
      console.log("Middle button");
    else if (event.which == 3)
      console.log("Right button");
  });
</script>
```

{{index "event type", "type property"}}

The information stored in an event
object differs per type of event. We'll discuss various types later
in this chapter. The object's `type` property always holds a string
identifying the event (for example `"click"` or `"mousedown"`).

## Propagation

{{index "event propagation", "parent node"}}

{{indexsee bubbling, "event propagation"}}

{{indexsee propagation, "event propagation"}}

Event handlers registered on
nodes with children will also receive some events that happen in the
children. If a button inside a paragraph is clicked, event handlers on
the paragraph will also receive the click event.

{{index "event handling"}}

But if both the paragraph and the button have a
handler, the more specific handler—the one on the button—gets to go
first. The event is said to _propagate_ outward, from the node where
it happened to that node's parent node and on to the root of the
document. Finally, after all handlers registered on a specific node
have had their turn, handlers registered on the whole ((window)) get a
chance to respond to the event.

{{index "stopPropagation method", "click event"}}

At any point, an event
handler can call the `stopPropagation` method on the event object to
prevent handlers “further up” from receiving the event. This can be
useful when, for example, you have a button inside another clickable
element and you don't want clicks on the button to activate the outer
element's click behavior.

{{index "mousedown event"}}

The following example registers `"mousedown"`
handlers on both a button and the paragraph around it. When clicked
with the right mouse button, the handler for the button calls
`stopPropagation`, which will prevent the handler on the paragraph
from running. When the button is clicked with another ((mouse
button)), both handlers will run.

```text/html
<p>A paragraph with a <button>button</button>.</p>
<script>
  var para = document.querySelector("p");
  var button = document.querySelector("button");
  para.addEventListener("mousedown", function() {
    console.log("Handler for paragraph.");
  });
  button.addEventListener("mousedown", function(event) {
    console.log("Handler for button.");
    if (event.which == 3)
      event.stopPropagation();
  });
</script>
```

{{index "event propagation", "target property"}}

Most event objects have a
`target` property that refers to the node where they originated. You
can use this property to ensure that you're not accidentally handling
something that propagated up from a node you do not want to handle.

It is also possible to use the `target` property to cast a wide net
for a specific type of event. For example, if you have a node
containing a long list of buttons, it may be more convenient to
register a single click handler on the outer node and have it use the
`target` property to figure out whether a button was clicked, rather
than register individual handlers on all of the buttons.

```text/html
<button>A</button>
<button>B</button>
<button>C</button>
<script>
  document.body.addEventListener("click", function(event) {
    if (event.target.nodeName == "BUTTON")
      console.log("Clicked", event.target.textContent);
  });
</script>
```

## Default actions

{{index scrolling, "default behavior", "event handling"}}

Many events
have a default action associated with them. If you click a ((link)),
you will be taken to the link's target. If you press the down arrow,
the browser will scroll the page down. If you right-click, you'll get
a context menu. And so on.

{{index "preventDefault method"}}

For most types of events, the JavaScript
event handlers are called _before_ the default behavior is performed.
If the handler doesn't want the normal behavior to happen, typically
because it has already taken care of handling the event, it can call
the `preventDefault` method on the event object.

{{index expectation}}

This can be used to implement your own ((keyboard))
shortcuts or ((context menu)). It can also be used to obnoxiously
interfere with the behavior that users expect. For example, here is a
link that cannot be followed:

```text/html
<a href="https://developer.mozilla.org/">MDN</a>
<script>
  var link = document.querySelector("a");
  link.addEventListener("click", function(event) {
    console.log("Nope.");
    event.preventDefault();
  });
</script>
```

Try not to do such things unless you have a really good reason to. For
people using your page, it can be unpleasant when the behavior
they expect is broken.

Depending on the browser, some events can't be intercepted. On
Chrome, for example, ((keyboard)) shortcuts to close the current tab
(Ctrl-W or Command-W) cannot be handled by JavaScript.

## Key events

{{index keyboard, "keydown event", "keyup event", "event handling"}}

When a key on the keyboard is pressed, your browser fires a
`"keydown"` event. When it is released, a `"keyup"` event fires.

```text/html focus
<p>This page turns violet when you hold the V key.</p>
<script>
  addEventListener("keydown", function(event) {
    if (event.keyCode == 86)
      document.body.style.background = "violet";
  });
  addEventListener("keyup", function(event) {
    if (event.keyCode == 86)
      document.body.style.background = "";
  });
</script>
```

{{index "repeating key"}}

Despite its name, `"keydown"` fires not only 
when the key is physically pushed down. When a key is pressed and
held, the event fires again every time the key _repeats_.
Sometimes—for example if you want to increase the acceleration of a
((game)) character when an arrow key is pressed and decrease it again
when the key is released—you have to be careful not to increase it
again every time the key repeats or you'd end up with unintentionally
huge values.

{{index "keyCode property", "key code"}}

The previous example looked at the
`keyCode` property of the event object. This is how you can identify
which key is being pressed or released. Unfortunately, it's not
always obvious how to translate the numeric key code to an actual
key.

{{index "event object", "charCodeAt method"}}

For letter and number keys,
the associated key code will be the ((Unicode)) character code
associated with the (uppercase) letter or number printed on the key.
The `charCodeAt` method on ((string))s gives us a way to find this
code.

```
console.log("Violet".charCodeAt(0));
// → 86
console.log("1".charCodeAt(0));
// → 49
```

Other keys have less predictable ((key code))s. The best way to find
the codes you need is usually by ((experiment))ing—register a key event
handler that logs the key codes it gets and press the key you are
interested in.

{{index "modifier key", "shift key", "control key", "alt key", "meta key", "command key", "ctrlKey property", "shiftKey property", "altKey property", "metaKey property"}}

Modifier keys
such as Shift, Ctrl, Alt, and Meta (Command on Mac) generate key
events just like normal keys. But when looking for key combinations,
you can also find out whether these keys are held down by looking
at the `shiftKey`, `ctrlKey`, `altKey`, and `metaKey` properties of
keyboard and mouse events.

```text/html focus
<p>Press Ctrl-Space to continue.</p>
<script>
  addEventListener("keydown", function(event) {
    if (event.keyCode == 32 && event.ctrlKey)
      console.log("Continuing!");
  });
</script>
```

{{index typing, "fromCharCode function", "charCode property", "keydown event", "keyup event", "keypress event"}}

The
`"keydown"` and `"keyup"` events give you information about the
physical key that is being pressed. But what if you are interested in
the actual ((text)) being typed? Getting that text from key codes is
awkward. Instead, there exists another event, `"keypress"`, which
fires right after `"keydown"` (and repeated along with `"keydown"`
when the key is held) but only for keys that produce character input.
The `charCode` property in the event object contains a code that can
be interpreted as a ((Unicode)) character code. We can use the
`String.fromCharCode` function to turn this code into an
actual single-((character)) ((string)).

```text/html focus
<p>Focus this page and type something.</p>
<script>
  addEventListener("keypress", function(event) {
    console.log(String.fromCharCode(event.charCode));
  });
</script>
```

{{index "button (HTML tag)", "tabindex attribute"}}

The ((DOM)) node where
a key event originates depends on the element that has ((focus)) when
the key is pressed. Normal nodes cannot have focus (unless you give
them a `tabindex` attribute), but things such as ((link))s, buttons, and
form fields can. We'll come back to form ((field))s in
[Chapter 18](18_forms.html#forms). When nothing in particular has
focus, `document.body` acts as the target node of key events.

## Mouse clicks

{{index "mousedown event", "mouseup event", "mouse cursor"}}

Pressing a
((mouse button)) also causes a number of events to fire. The
`"mousedown"` and `"mouseup"` events are similar to `"keydown"` and
`"keyup"` and fire when the button is pressed and released.
These will happen on the DOM nodes that are immediately below the
mouse pointer when the event occurs.

{{index "click event"}}

After the `"mouseup"` event, a `"click"` event
fires on the most specific node that contained both the press and the
release of the button. For example, if I press down the mouse button
on one paragraph and then move the pointer to another paragraph and
release the button, the `"click"` event will happen on the element
that contains both those paragraphs.

{{index "dblclick event", "double click"}}

If two clicks happen close
together, a `"dblclick"` (double-click) event also fires, after the
second click event.

{{index pixel, "pageX property", "pageY property", "event object"}}

To get precise information about the place where a mouse
event happened, you can look at its `pageX` and `pageY` properties,
which contain the event's ((coordinates)) (in pixels) relative to the
top-left corner of the document.

{{index "border-radius (CSS)", "absolute positioning", "drawing program example"}}

{{id mouse_drawing}}
The following implements a primitive drawing program. Every
time you click the document, it adds a dot under your mouse
pointer. See [Chapter 19](19_paint.html#paint) for a less primitive
drawing program.

```text/html
<style>
  body {
    height: 200px;
    background: beige;
  }
  .dot {
    height: 8px; width: 8px;
    border-radius: 4px; /* rounds corners */
    background: blue;
    position: absolute;
  }
</style>
<script>
  addEventListener("click", function(event) {
    var dot = document.createElement("div");
    dot.className = "dot";
    dot.style.left = (event.pageX - 4) + "px";
    dot.style.top = (event.pageY - 4) + "px";
    document.body.appendChild(dot);
  });
</script>
```

{{index "clientX property", "clientY property", "getBoundingClientRect method", "event object"}}

The `clientX` and `clientY` properties are
similar to `pageX` and `pageY` but relative to the part of the
document that is currently scrolled into view. These can be useful
when comparing mouse coordinates with the ((coordinates)) returned by
`getBoundingClientRect`, which also returns ((viewport))-relative
coordinates.

## Mouse motion

{{index "mousemove event"}}

Every time the mouse pointer moves, a
`"mousemove"` event fires. This event can be used to track the
position of the mouse. A common situation in which this is useful is
when implementing some form of mouse-((dragging)) functionality.

{{index "draggable bar example"}}

As an example, the following program displays a
bar and sets up event handlers so that dragging to the left or right
on this bar makes it narrower or wider:

```text/html
<p>Drag the bar to change its width:</p>
<div style="background: orange; width: 60px; height: 20px">
</div>
<script>
  var lastX; // Tracks the last observed mouse X position
  var rect = document.querySelector("div");
  rect.addEventListener("mousedown", function(event) {
    if (event.which == 1) {
      lastX = event.pageX;
      addEventListener("mousemove", moved);
      event.preventDefault(); // Prevent selection
    }
  });

  function buttonPressed(event) {
    if (event.buttons == null)
      return event.which != 0;
    else
      return event.buttons != 0;
  }
  function moved(event) {
    if (!buttonPressed(event)) {
      removeEventListener("mousemove", moved);
    } else {
      var dist = event.pageX - lastX;
      var newWidth = Math.max(10, rect.offsetWidth + dist);
      rect.style.width = newWidth + "px";
      lastX = event.pageX;
    }
  }
</script>
```

{{if book

The resulting page looks like this:

{{figure {url: "img/drag-bar.png", alt: "A draggable bar",width: "5.3cm"}}}

if}}

{{index "mouseup event", "mousemove event"}}

Note that the `"mousemove"`
handler is registered on the whole ((window)). Even if the mouse goes
outside of the bar during resizing, we still want to update its size
and stop dragging when the mouse is released.

{{index "buttons property", "which property"}}

We must stop resizing the
bar when the mouse button is released. Unfortunately, not all browsers
give `"mousemove"` events a meaningful `which` property. There is a
standard property called `buttons`, which provides similar
information, but that is also not supported on all browsers.
Fortunately, all major browsers support either `buttons` or `which`,
so the `buttonPressed` function in the example first tries `buttons`,
and falls back to `which` when that isn't available.

{{index "mouseover event", "mouseout event"}}

Whenever the mouse pointer
enters or leaves a node, a `"mouseover"` or `"mouseout"` event
fires. These two events can be used, among other things, to create
((hover effect))s, showing or styling something when the mouse is over
a given element.

{{index "event propagation"}}

Unfortunately, creating such an effect is not
as simple as starting the effect on `"mouseover"` and ending it on
`"mouseout"`. When the mouse moves from a node onto one of its
children, `"mouseout"` fires on the parent node, though the mouse
did not actually leave the node's extent. To make things worse, these
events propagate just like other events, and thus you will also
receive `"mouseout"` events when the mouse leaves one of the ((child
node))s of the node on which the handler is registered.

{{index "isInside function", "relatedTarget property", "target property"}}

To work around this problem, we can use the `relatedTarget`
property of the event objects created for these events. It tells us,
in the case of `"mouseover"`, what element the pointer was over
before and, in the case of `"mouseout"`, what element it is going to.
We want to change our hover effect only when the `relatedTarget` is
outside of our target node. Only in that case does this event actually
represent a _crossing over_ from outside to inside the node (or the
other way around).

```text/html
<p>Hover over this <strong>paragraph</strong>.</p>
<script>
  var para = document.querySelector("p");
  function isInside(node, target) {
    for (; node != null; node = node.parentNode)
      if (node == target) return true;
  }
  para.addEventListener("mouseover", function(event) {
    if (!isInside(event.relatedTarget, para))
      para.style.color = "red";
  });
  para.addEventListener("mouseout", function(event) {
    if (!isInside(event.relatedTarget, para))
      para.style.color = "";
  });
</script>
```

The `isInside` function follows the given node's parent links until it
either reaches the top of the document (when `node` becomes null) or
finds the parent we are looking for.

I should add that a ((hover effect)) like this can be much more easily
achieved using the ((CSS)) _((pseudoselector))_ `:hover`, as the next
example shows. But when your hover effect involves doing something
more complicated than changing a style on the target node, you must use the trick
with `"mouseover"` and `"mouseout"` events.

```text/html
<style>
  p:hover { color: red }
</style>
<p>Hover over this <strong>paragraph</strong>.</p>
```

## Scroll events

{{index scrolling, "scroll event", "event handling"}}

Whenever an
element is scrolled, a `"scroll"` event fires on it. This has
various uses, such as knowing what the user is currently looking at
(for disabling off-screen ((animation))s or sending ((spy)) reports to
your evil headquarters) or showing some indication of progress (by
highlighting part of a table of contents or showing a page number).

The following example draws a ((progress bar)) in the top-right corner of
the document and updates it to fill up as you scroll down:

```text/html
<style>
  .progress {
    border: 1px solid blue;
    width: 100px;
    position: fixed;
    top: 10px; right: 10px;
  }
  .progress > div {
    height: 12px;
    background: blue;
    width: 0%;
  }
  body {
    height: 2000px;
  }
</style>
<div class="progress"><div></div></div>
<p>Scroll me...</p>
<script>
  var bar = document.querySelector(".progress div");
  addEventListener("scroll", function() {
    var max = document.body.scrollHeight - innerHeight;
    var percent = (pageYOffset / max) * 100;
    bar.style.width = percent + "%";
  });
</script>
```

{{index "unit (CSS)", scrolling, "position (CSS)", "fixed positioning", "absolute positioning", percent}}

Giving an element
a `position` of `fixed` acts much like an `absolute` position but
also prevents it from scrolling along with the rest of the document.
The effect is to make our progress bar stay in its corner. Inside 
it is another element, which is resized to indicate the current
progress. We use `%`, rather than `px`, as a unit when setting the
width so that the element is sized relative to the whole bar.

{{index "innerHeight property", "innerWidth property", "pageYOffset property"}}

The global `innerHeight` variable gives us the height of
the window, which we have to subtract from the total scrollable
height—you can't keep scrolling when you hit the bottom of the
document. (There's also an `innerWidth` to go along with
`innerHeight`.) By dividing `pageYOffset`, the current scroll
position, by the maximum scroll position and multiplying by 100,
we get the percentage for the progress bar.

{{index "preventDefault method"}}

Calling `preventDefault` on a scroll event
does not prevent the scrolling from happening. In fact, the event
handler is called only _after_ the scrolling takes place.

## Focus events

{{index "event handling", "focus event", "blur event"}}

When an element
gains ((focus)), the browser fires a `"focus"` event on it. When it
loses focus, a `"blur"` event fires.

{{index "event propagation"}}

Unlike the events discussed earlier, these two
events do not propagate. A handler on a parent element is not notified
when a child element gains or loses focus.

{{index "input (HTML tag)", "help text example"}}

The following example 
displays help text for the ((text field)) that currently has
focus:

```text/html
<p>Name: <input type="text" data-help="Your full name"></p>
<p>Age: <input type="text" data-help="Age in years"></p>
<p id="help"></p>

<script>
  var help = document.querySelector("#help");
  var fields = document.querySelectorAll("input");
  for (var i = 0; i < fields.length; i++) {
    fields[i].addEventListener("focus", function(event) {
      var text = event.target.getAttribute("data-help");
      help.textContent = text;
    });
    fields[i].addEventListener("blur", function(event) {
      help.textContent = "";
    });
  }
</script>
```

{{if book

In the following screenshot, the help text for the age field is shown.

{{figure {url: "img/help-field.png", alt: "Providing help when a field is focused",width: "4.4cm"}}}

if}}

{{index "focus event", "blur event"}}

The ((window)) object will receive
`"focus"` and `"blur"` events when the user moves from or to the
browser tab or window in which the document is shown.

## Load event

{{index "script (HTML tag)", "load event"}}

When a page finishes loading,
the `"load"` event fires on the window and the document body
objects. This is often used to schedule ((initialization)) actions
that require the whole ((document)) to have been built. Remember that
the content of `<script>` tags is run immediately when the tag is
encountered. This is often too soon, such as when the script needs
to do something with parts of the document that appear after the
`<script>` tag.

{{index "event propagation", "img (HTML tag)"}}

Elements such as ((image))s
and script tags that load an external file also have a `"load"` event
that indicates the files they reference were loaded. Like the
focus-related events, loading events do not propagate.

{{index "beforeunload event", "page reload", "preventDefault method"}}

When a page is closed or navigated away from (for example by
following a link), a `"beforeunload"` event fires. The main use of
this event is to prevent the user from accidentally losing work by
closing a document. Preventing the page from unloading is not, as you
might expect, done with the `preventDefault` method. Instead, it is
done by returning a string from the handler. The string will be used
in a dialog that asks the user if they want to stay on the page or
leave it. This mechanism ensures that a user is able to leave the
page, even if it is running a ((malicious script)) that would prefer to
keep them there forever in order to force them to look at dodgy
weight loss ads.

{{id timeline}}
## Script execution timeline

{{index "requestAnimationFrame function", "event handling", timeline, "script (HTML tag)"}}

There are various
things that can cause a script to start executing. Reading a
`<script>` tag is one such thing. An event firing is another.
[Chapter 13](13_dom.html#animationFrame) discussed the
`requestAnimationFrame` function, which schedules a function to be
called before the next page redraw. That is yet another way in which a
script can start running.

{{index parallelism, concurrency, blocking}}

It is important to
understand that even though events can fire at any time, no two
scripts in a single document ever run at the same moment. If a script
is already running, event handlers and pieces of code scheduled in
other ways have to wait for their turn. This is the reason why a
document will freeze when a script runs for a long time. The browser
cannot react to clicks and other events inside the document because
it can't run event handlers until the current script finishes running.

{{index performance, complexity}}

Some programming environments do
allow multiple _((thread))s of execution_ to run at the same time.
Doing multiple things at the same time can be used to make a program
faster. But when you have multiple actors touching the same parts of
the system at the same time, thinking about a program becomes at least
an order of magnitude harder.

The fact that JavaScript programs do only one thing at a time makes
our lives easier. For cases where you _really_ do want to do some
time-consuming thing in the background without freezing the page,
browsers provide something called _((web worker))s_. A worker is an
isolated JavaScript ((environment)) that runs alongside the main
program for a document and can communicate with it only by sending
and receiving ((message))s.

Assume we have the following code in a file called `code/squareworker.js`:

```
addEventListener("message", function(event) {
  postMessage(event.data * event.data);
});
```

Imagine that squaring a number is a heavy, long-running computation
that we want to perform in a background ((thread)). This code spawns a
worker, sends it a few messages, and outputs the responses.

{{test no}}

```
var squareWorker = new Worker("code/squareworker.js");
squareWorker.addEventListener("message", function(event) {
  console.log("The worker responded:", event.data);
});
squareWorker.postMessage(10);
squareWorker.postMessage(24);
```

{{index "postMessage method", "message event"}}

The `postMessage` function
sends a message, which will cause a `"message"` event to fire in the
receiver. The script that created the worker sends and receives
messages through the `Worker` object, whereas the worker talks to the
script that created it by sending and listening directly on its
((global scope))—which is a _new_ global scope, not shared with the
original script.

## Setting timers

{{index timeout, "setTimeout function"}}

The `setTimeout` function is
similar to `requestAnimationFrame`. It schedules another function to
be called later. But instead of calling the function at the next
redraw, it waits for a given amount of milliseconds. This page
turns from blue to yellow after two seconds:

```text/html
<script>
  document.body.style.background = "blue";
  setTimeout(function() {
    document.body.style.background = "yellow";
  }, 2000);
</script>
```

{{index "clearTimeout function"}}

Sometimes you need to cancel a function you
have scheduled. This is done by storing the value returned by
`setTimeout` and calling `clearTimeout` on it.

```
var bombTimer = setTimeout(function() {
  console.log("BOOM!");
}, 500);

if (Math.random() < 0.5) { // 50% chance
  console.log("Defused.");
  clearTimeout(bombTimer);
}
```

{{index "cancelAnimationFrame function", "requestAnimationFrame function"}}

The `cancelAnimationFrame` function works in the same way
as _clearTimeout_—calling it on a value returned by
`requestAnimationFrame` will cancel that frame (assuming it hasn't
already been called).

{{index "setInterval function", "clearInterval function", repetition}}

A similar set of functions, `setInterval`
and `clearInterval` are used to set timers that should repeat every _X_
milliseconds.

```
var ticks = 0;
var clock = setInterval(function() {
  console.log("tick", ticks++);
  if (ticks == 10) {
    clearInterval(clock);
    console.log("stop.");
  }
}, 200);
```

## Debouncing

{{index optimization, "mousemove event", "scroll event", blocking}}

Some types of events have the potential to fire
rapidly, many times in a row (the `"mousemove"` and `"scroll"` events,
for example). When handling such events, you must be careful not to do
anything too time-consuming or your handler will take up so much time
that interaction with the document starts to feel slow and choppy.

{{index "setTimeout function"}}

If you do need to do something nontrivial in
such a handler, you can use `setTimeout` to make sure you are not
doing it too often. This is usually called _((debouncing))_ the event.
There are several slightly different approaches to this.

{{index "textarea (HTML tag)", "clearTimeout function", "keydown event"}}

In the first example, we want to do something when the user
has typed something, but we don't want to do it immediately for every
key event. When they are ((typing)) quickly, we just want to wait
until a pause occurs. Instead of immediately performing an action in
the event handler, we set a timeout instead. We also clear the
previous timeout (if any) so that when events occur close together
(closer than our timeout delay), the timeout from the previous event
will be canceled.

```text/html
<textarea>Type something here...</textarea>
<script>
  var textarea = document.querySelector("textarea");
  var timeout;
  textarea.addEventListener("keydown", function() {
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      console.log("You stopped typing.");
    }, 500);
  });
</script>
```

{{index "sloppy programming"}}

Giving an undefined value to `clearTimeout` or
calling it on a timeout that has already fired has no effect. Thus, we
don't have to be careful about when to call it, and we simply do so
for every event.

{{index "mousemove event"}}

We can use a slightly different pattern if we
want to space responses so that they're separated by at least a
certain length of ((time)) but want to fire them _during_ a series of
events, not just afterward. For example, we might want to respond to
`"mousemove"` events by showing the current coordinates of the mouse,
but only every 250 milliseconds.

```text/html
<script>
  function displayCoords(event) {
    document.body.textContent =
      "Mouse at " + event.pageX + ", " + event.pageY;
  }

  var scheduled = false, lastEvent;
  addEventListener("mousemove", function(event) {
    lastEvent = event;
    if (!scheduled) {
      scheduled = true;
      setTimeout(function() {
        scheduled = false;
        displayCoords(lastEvent);
      }, 250);
    }
  });
</script>
```

## Summary

Event handlers make it possible to detect and react to events we have
no direct control over. The `addEventListener` method is used to
register such a handler.

Each event has a type (`"keydown"`, `"focus"`, and so on) that identifies
it. Most events are called on a specific DOM element and then
_propagate_ to that element's ancestors, allowing handlers associated
with those elements to handle them.

When an event handler is called, it is passed an event object with
additional information about the event. This object also has methods
that allow us to stop further propagation (`stopPropagation`) and
prevent the browser's default handling of the event
(`preventDefault`).

Pressing a key fires `"keydown"`, `"keypress"`, and `"keyup"` events.
Pressing a mouse button fires `"mousedown"`, `"mouseup"`, and
`"click"` events. Moving the mouse fires `"mousemove"` and possibly
`"mouseenter"` and `"mouseout"` events.

Scrolling can be detected with the `"scroll"` event, and focus changes
can be detected with the `"focus"` and `"blur"` events. When the document finishes
loading, a `"load"` event fires on the window.

Only one piece of JavaScript program can run at a time. Thus, event
handlers and other scheduled scripts have to wait until other scripts
finish before they get their turn.

## Exercises

### Censored keyboard

{{index Turkish, Kurds, "censored keyboard (exercise)"}}

Between 1928
and 2013, Turkish law forbade the use of the letters _Q_, _W_, and _X_
in official documents. This was part of a wider initiative to stifle
Kurdish culture—those letters occur in the language used by Kurdish
people but not in Istanbul Turkish.

{{index typing, "input (HTML tag)"}}

As an exercise in doing ridiculous
things with technology, I'm asking you to program a ((text field)) (an
`<input type="text">` tag) that these letters cannot be typed into.

{{index clipboard}}

(Do not worry about copy and paste and other such
loopholes.)

{{if interactive

{{test no}}

```text/html
<input type="text">
<script>
  var field = document.querySelector("input");
  // Your code here.
</script>
```

if}}

{{hint

{{index "keypress event", "keydown event", "preventDefault method", "censored keyboard (exercise)"}}

The solution to this
exercise involves preventing the ((default behavior)) of key events.
You can handle either `"keypress"` or `"keydown"`. If either of them
has `preventDefault` called on it, the letter will not appear.

{{index "keyCode property", "charCode property", capitalization}}

Identifying the letter typed requires
looking at the `keyCode` or `charCode` property and comparing that
with the codes for the letters you want to filter. In `"keydown"`, you
do not have to worry about lowercase and uppercase letters, since it
identifies only  the key pressed. If you decide to handle `"keypress"`
instead, which identifies the actual character typed, you have to make
sure you test for both cases. One way to do that would be this:

```null
/[qwx]/i.test(String.fromCharCode(event.charCode))
```

hint}}

### Mouse trail

{{index animation, "mouse trail (exercise)"}}

In JavaScript's early days,
which was the high time of ((gaudy home pages)) with lots of animated
images, people came up with some truly inspiring ways to use the
language.

One of these was the “mouse trail”—a series of images that would
follow the mouse pointer as you moved it across the page.

{{index "absolute positioning", "background (CSS)"}}

In this exercise, I
want you to implement a mouse trail. Use absolutely positioned `<div>`
elements with a fixed size and background color (refer to the
[code](14_event.html#mouse_drawing) in the “Mouse Clicks”
section for an example). Create a bunch of such elements and, when the
mouse moves, display them in the wake of the mouse pointer.

{{index "mousemove event"}}

There are various possible approaches here. You
can make your solution as simple or as complex as you want. A simple
solution to start with is to keep a fixed number of trail elements and
cycle through them, moving the next one to the mouse's current
position every time a `"mousemove"` event occurs.

{{if interactive

{{test no}}

```text/html
<style>
  .trail { /* className for the trail elements */
    position: absolute;
    height: 6px; width: 6px;
    border-radius: 3px;
    background: teal;
  }
  body {
    height: 300px;
  }
</style>

<script>
  // Your code here.
</script>
```

if}}

{{hint

{{index "mouse trail (exercise)"}}

Creating the elements is best done in a
loop. Append them to the document to make them show up. To be
able to access them later to change their position, store the trail
elements in an array.

{{index "mousemove event", [array, indexing], "remainder operator", "% operator"}}

Cycling through them can be done by keeping a ((counter
variable)) and adding 1 to it every time the `"mousemove"` event
fires. The remainder operator (`% 10`) can then be used to get a valid
array index to pick the element you want to position during a given
event.

{{index simulation, "requestAnimationFrame function"}}

Another
interesting effect can be achieved by modeling a simple ((physics))
system. Use the `"mousemove"` event only to update a pair of variables
that track the mouse position. Then use `requestAnimationFrame` to
simulate the trailing elements being attracted to the position of the
mouse pointer. At every animation step, update their position based on
their position relative to the pointer (and, optionally, a speed that
is stored for each element). Figuring out a good way to do this is up
to you.

hint}}

### Tabs

{{index "tabbed interface (exercise)"}}

A tabbed interface is a common design
pattern. It allows you to select an interface panel by choosing from
a number of tabs “sticking out” above an element.

{{index "button (HTML tag)", "display (CSS)", "hidden element", "data attribute"}}

In this exercise you'll implement a simple tabbed
interface. Write a function, `asTabs`, that takes a DOM node and
creates a tabbed interface showing the child elements of that node. It
should insert a list of `<button>` elements at the top of the node,
one for each child element, containing text retrieved from the
`data-tabname` attribute of the child. All but one of the original
children should be hidden (given a `display` style of `none`), and the
currently visible node can be selected by clicking the buttons.

When it works, extend it to also style the currently active button
differently.

{{if interactive

{{test no}}

```text/html
<div id="wrapper">
  <div data-tabname="one">Tab one</div>
  <div data-tabname="two">Tab two</div>
  <div data-tabname="three">Tab three</div>
</div>
<script>
  function asTabs(node) {
    // Your code here.
  }
  asTabs(document.querySelector("#wrapper"));
</script>
```

if}}

{{hint

{{index "text node", "childNodes property", "live data structure", "tabbed interface (exercise)"}}

One pitfall you'll
probably run into is that you can't directly use the node's
`childNodes` property as a collection of tab nodes. For one thing,
when you add the buttons, they will also become child nodes and end
up in this object because it is live. For another, the text nodes
created for the ((whitespace)) between the nodes are also in there
and should not get their own tabs.

{{index "TEXT_NODE code", "nodeType property"}}

To work around this, start
by building up a real array of all the children in the wrapper that
have a `nodeType` of 1.

{{index "event handling", closure}}

When registering event handlers on
the buttons, the handler functions will need to know which tab element
is associated with the button. If they are created in a normal loop,
you can access the loop index variable from inside the function, but
it won't give you the correct number because that variable will have
been further changed by the loop.

{{index "forEach method", "local variable", loop}}

A simple workaround
is to use the `forEach` method and create the handler functions from
inside the function passed to `forEach`. The loop index, which is
passed as a second argument to that function, will be a normal local
variable there and won't be overwritten by further iterations.

hint}}
