# Algoritmos de ordenamiento · 2026-2

Material del curso (ITM). Ordenar no es un trámite previo: es el motor `O(n log n)` que ya apareció en greedy (selección de actividades, Kruskal, Huffman) y el problema con cota inferior demostrable más limpia del semestre.

Dos piezas para proyectar en clase, ambas en HTML, CSS y JavaScript (se abren en el navegador, sin `npm`):

| Pieza | Qué es | Algoritmo | Problema real |
| --- | --- | --- | --- |
| [Laboratorio · despacho](algoritmos-ordenamiento/desarrollo/index.html) | App interactiva: divide, compara, fusiona | **Merge Sort** (estable) | Orden de salida de domicilios en Medellín |
| [Presentación · triaje](algoritmos-ordenamiento/presentacion/index.html) | Diapositivas con el heap animado | **Heap Sort** | Cola de atención en urgencias |

Hub: [`algoritmos-ordenamiento/index.html`](algoritmos-ordenamiento/index.html).

```text
algoritmos-ordenamiento/
├── index.html
├── desarrollo/       Merge Sort · Fogón del Centro
└── presentacion/     Heap Sort · sala de urgencias
```

Abre el `index.html` con doble clic o con *Live Server*. En la presentación: `←` `→` o espacio.

---

## 1. Qué es ordenar

**Entrada.** Una secuencia de `n` registros y un **criterio total** (quién va antes). El criterio puede ser un número (`tiempo restante`), un texto (`barrio`) o una **clave compuesta** (urgencia, luego barrio, luego valor).

**Salida.** Una permutación de esos mismos registros que respeta el criterio: si `i` queda antes que `j` en el resultado, entonces `clave(i) ≤ clave(j)` (orden no decreciente) o el convenio que se haya fijado.

Ordenar no inventa datos. **Reescribe el orden**. El trabajo está en cuántas comparaciones y movimientos hace falta para llegar ahí.

Tres preguntas de diseño, siempre:

1. **Clave** — qué número o tupla decide. Si la clave está mal, el algoritmo perfecto entrega el orden equivocado.
2. **Algoritmo** — cómo se obtienen las comparaciones (inserción, división, heap, conteo…).
3. **Cota** — tiempo y memoria en el peor caso, y si el método es estable, in-place o adaptativo.

El oficio de esta unidad: **correctitud del orden + cota**, no «el `.sort()` del lenguaje ya lo hace».

---

## 2. El modelo de comparaciones y `Ω(n log n)`

En el **modelo de comparaciones** el algoritmo solo pregunta «¿`a` va antes que `b`?» y reordena. No mira el valor como entero para meterlo en un cubo.

Cualquier árbol de decisión que distinga las `n!` permutaciones tiene altura al menos `log₂(n!)`. Por Stirling, `log₂(n!) = Θ(n log n)`. Por tanto:

> **Ningún** algoritmo de ordenamiento por comparaciones puede ser `o(n log n)` en el peor caso.

Merge Sort y Heap Sort alcanzan `Θ(n log n)` siempre. Quick Sort lo alcanza en promedio y se cae a `Θ(n²)` si el pivote es sistemáticamente el peor (arreglo ya ordenado y pivote extremo, sin aleatorizar). Insertion Sort es `Θ(n²)` en el peor caso y `Θ(n)` si la entrada ya viene casi ordenada.

Eso cierra una discusión que en greedy quedó implícita: cuando el greedy «solo ordena y barre», **el sort es lo que cuesta**. No hay truco comparativo más barato que `Θ(n log n)` para el peor caso.

Fuera del modelo de comparaciones sí hay atajos, si la clave es un entero en un rango chico: Counting Sort `O(n + k)`, Radix Sort `O(d(n + b))`. No violan la cota: **no** son algoritmos de comparación.

---

## 3. Propiedades que hay que nombrar

| Propiedad | Pregunta | Por qué importa |
| --- | --- | --- |
| **Estable** | Si `a` y `b` empatan, ¿se conserva el orden de llegada? | Agrupar barrios, desempates por «quién pidió primero», radix por dígitos |
| **In-place** | ¿Usa `O(1)` memoria extra (más allá de la pila)? | Arreglos enormes, embebidos, cache |
| **Adaptativo** | ¿Aprovecha que la entrada ya está casi ordenada? | Un pedido nuevo sobre una cola ya despachada |
| **Peor caso** | ¿La cota se sostiene en la instancia hostil? | Hora pico, datos adversarios, Quick sin randomizar |

Regla de lectura para este curso:

- **Merge Sort** — estable, `Θ(n log n)` siempre, memoria extra `Θ(n)`.
- **Heap Sort** — no estable, `Θ(n log n)` siempre, in-place.
- **Quick Sort** (típico, in-place) — no estable, promedio `Θ(n log n)`, peor `Θ(n²)`; con pivote aleatorio el peor es improbable.
- **Insertion Sort** — estable, in-place, adaptativo: `Θ(n + d)` si hay `d` inversiones. Ideal para `n` chico o para **insertar uno** en una lista ya ordenada.

El laboratorio usa Merge Sort **porque el empate tiene significado** (mismo minutos restantes → respetar barrio y, si hace falta, el orden original). La presentación usa Heap Sort **porque el hospital necesita extraer siempre al más urgente**, y eso es un heap, no una fusión de mitades.

---

## 4. Catálogo (la tabla que hay que saber)

| Algoritmo | Idea | Mejor | Promedio | Peor | Extra | Estable |
| --- | --- | --- | --- | --- | --- | --- |
| Insertion | insertar cada uno en la prefijo ordenado | `Θ(n)` | `Θ(n²)` | `Θ(n²)` | `O(1)` | Sí |
| Selection | repetir el mínimo del sufijo | `Θ(n²)` | `Θ(n²)` | `Θ(n²)` | `O(1)` | No |
| Bubble (optimizado) | intercambiar adyacentes | `Θ(n)` | `Θ(n²)` | `Θ(n²)` | `O(1)` | Sí |
| Merge | dividir a la mitad, fusionar corridas | `Θ(n log n)` | `Θ(n log n)` | `Θ(n log n)` | `Θ(n)` | Sí |
| Heap | max-heap + extraer raíz `n` veces | `Θ(n log n)` | `Θ(n log n)` | `Θ(n log n)` | `O(1)` | No |
| Quick | pivote + partición | `Θ(n log n)` | `Θ(n log n)` | `Θ(n²)` | `O(log n)` pila | Típico: no |
| Counting | histograma de claves `{0…k}` | `Θ(n + k)` | `Θ(n + k)` | `Θ(n + k)` | `Θ(k)` | Sí (bien escrito) |
| Radix (LSD) | counting por dígito, estable | `Θ(d(n+b))` | igual | igual | `Θ(n + b)` | Sí |

Selection siempre mira todos los pares implícitos del sufijo: no es adaptativo. Por eso casi nunca se enseña como candidato serio; sirve para contrastar «hacer `n` mínimos» con «hacer un heap».

Quick Sort en librerías reales no es el de pizarrón: introsort (C++), Timsort (Python, Java para objetos) mezclan merge/insertion/heap para no pagar el `n²` ni perder estabilidad cuando el lenguaje la promete.

---

## 5. Bruto `n!` frente a `n log n`

Misma pregunta: de las `n!` permutaciones, ¿cuál minimiza pedidos tarde? Enumerarlas es el bruto. Ordenar por la clave correcta **es** elegir esa permutación, si la clave está bien diseñada.

| `n` pedidos | Permutaciones `n!` | Merge/Heap `n log₂ n` |
| --- | --- | --- |
| 6 | 720 | ~16 |
| 8 | 40 320 | ~24 |
| 10 | 3,6 millones | ~33 |
| 12 | 479 millones | ~43 |
| 15 | 1,3 billones | ~59 |

En el laboratorio el preset *Hora pico* trae 12 domicilios. El bruto no corre en clase. Merge Sort hace del orden de `12 log₂ 12` fusiones de elementos, más las comparaciones de la fusión (`< n log n` en total, `Θ(n log n)`).

**Instancia chica (4 pedidos) que sí se puede enumerar a mano.**

Promesa de 40 minutos. Tiempo restante (negativo = ya tarde):

| Pedido | Barrio | Resta | Valor |
| --- | --- | --- | --- |
| A | Centro | −3 | 30 000 |
| B | Laureles | 8 | 45 000 |
| C | Centro | 8 | 90 000 |
| D | Poblado | 2 | 20 000 |

Clave: menor resta, luego barrio, luego mayor valor.

- **Bruto.** 24 órdenes. Solo una (y sus empates de clave) minimiza atrasos: primero A (ya tarde), luego D (2 min), luego C y B (ambos 8; Centro antes que Laureles).
- **Merge Sort.** Divide `{A,B}` | `{C,D}`, fusiona con la misma clave. Complejidad `Θ(n log n)`. Resultado `A → D → C → B`.

Si el criterio fuera «mayor valor primero», el óptimo de negocio **cambia** (C primero) y se rompen más promesas. El algoritmo sigue siendo Merge Sort. Falló la **clave**, no la cota.

---

## 6. Laboratorio: despacho de última milla (Merge Sort)

**Problema real.** Un fogón del centro de Medellín promete 35–45 minutos. A la hora pico hay una docena de bolsas listas. El domiciliario no puede salir en el orden de llegada: un pedido de El Poblado que ya lleva 33 de 35 minutos no puede esperar a que salgan tres de Belén holgados.

**Qué hay que producir.** Una secuencia de salida. Objetivo operativo: **menos pedidos tarde**, y si empatan en urgencia, **agrupar barrio** para no zigzag, y si aún empatan, **mayor valor**.

**Algoritmo.** Merge Sort.

1. Dividir el arreglo a la mitad hasta corridas de 1.
2. Fusionar dos corridas ya ordenadas con dos índices: la siguiente salida es el menor según la clave.
3. La fusión es lineal en el tamaño de las dos corridas. La profundidad del árbol es `⌈log₂ n⌉`. Total `Θ(n log n)`.

**Por qué Merge y no Quick.** En hora pico se necesita la cota del peor caso (no un `n²` por un pivote torpe). En los empates de minutos, el barrio debe agruparse de forma **predecible**: Merge es estable, la partición típica de Quick no lo es.

**Por qué no Insertion para los 12.** Insertion sería `Θ(n²)` comparaciones en el caos de las 12:00. Sí vale **después**: la cola ya despachada está ordenada; entra un pedido nuevo y se inserta en `O(n)`. El preset *Pedido nuevo* muestra exactamente eso.

**Clave (comparador).**

```text
resta  = minutosPromesa − transcurrido     # negativo = ya incumplido
(a, b) →  resta(a) < resta(b)
       →  si empatan, barrio(a) < barrio(b)
       →  si empatan, valor(a) > valor(b)
```

Estabilidad: dos pedidos con la misma tupla conservan el orden en que estaban. Por eso, si se quiere «quien pidió primero», conviene que esa llegada ya vaya en la clave o en el orden original.

En la app: *Hora pico* / *Empates* / *Pedido nuevo*, **Paso** y **Reproducir**, conteo de comparaciones, pedidos tarde antes y después.

---

## 7. Presentación: triaje con Heap Sort

**Problema real.** Sala de urgencias un sábado. Cada paciente llega con un color de triaje (rojo, naranja, amarillo, verde) y una hora. La enfermera de puerta no reordena a ojo la fila cada vez: el siguiente en entrar debe ser el de **mayor prioridad**, y si dos tienen el mismo color, el que lleva más rato esperando.

**Qué hay que producir.** La secuencia de atención de los que ya están en sala. (El sistema vivo, con llegadas en línea, es una **cola de prioridad**; Heap Sort es la versión *offline*: ordenar el lote de una vez.)

**Clave.**

```text
score(gravedad) ∈ {rojo:4, naranja:3, amarillo:2, verde:1}
clave = score × 10 000 − minutosDesdeApertura
```

El término de llegada mete el desempate **dentro** de la clave. Hace falta: Heap Sort **no es estable**. Si se ordenara solo por color, dos amarillos podrían invertirse.

**Algoritmo.** Heap Sort (max-heap sobre `clave`).

1. **Construir el heap** (`build-heap`): desde el último padre `⌊n/2⌋−1` hasta la raíz, `sift-down`. Eso es `Θ(n)`, no `Θ(n log n)` — el análisis ajustado cuenta que los heaps chicos de abajo son baratos.
2. **Extraer** `n` veces: intercambiar raíz con el último, achicar el heap, `sift-down`. Cada extracción `O(log n)`. Total `Θ(n log n)`.

**Complejidad.** Tiempo `Θ(n log n)` peor y mejor (salvo heap ya trivial). Espacio extra `O(1)` si se ordena in-place. No estable.

**Por qué un heap y no Merge en este relato.** Merge ordena el lote igual de bien y además es estable. El hospital, sin embargo, vive de **extraer el máximo** mientras siguen llegando pacientes: insertar en un heap es `O(log n)`, extraer `O(log n)`. Merge Sort no da esa estructura incremental. La presentación muestra Heap Sort como el pariente *offline* de la cola de prioridad que sí corre en producción.

---

## 8. Cómo se implementa (plantillas)

### 8.1 Merge Sort (el del laboratorio)

```js
function mergeSort(arr, cmp) {
  if (arr.length <= 1) return arr;
  const mid = Math.ceil(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid), cmp);
  const right = mergeSort(arr.slice(mid), cmp);
  return merge(left, right, cmp);
}

function merge(left, right, cmp) {
  const out = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (cmp(left[i], right[j]) <= 0) out.push(left[i++]);
    else out.push(right[j++]);
  }
  return out.concat(left.slice(i), right.slice(j));
}
```

La fusión hace a lo sumo `n − 1` comparaciones para `n = |left| + |right|`. El árbol tiene `⌈log₂ n⌉` niveles. Memoria: cada nivel materializa arreglos; en la práctica `Θ(n)` auxiliar si se reutiliza un buffer.

### 8.2 Insertion de un elemento (preset *Pedido nuevo*)

```js
function insertSorted(arr, x, cmp) {
  const out = arr.slice();
  let i = out.length - 1;
  while (i >= 0 && cmp(x, out[i]) < 0) {
    out[i + 1] = out[i];
    i--;
  }
  out[i + 1] = x;
  return out;
}
```

`O(n)` desplazamientos. Reordenar los `n + 1` con Merge sería `Θ(n log n)`. Con `n = 200` pedidos en cocina la diferencia se siente; con `n = 12` se siente en el conteo de comparaciones de la app.

### 8.3 Heap Sort (el de la presentación)

```js
function siftDown(a, n, i, cmpMax) {
  while (true) {
    let largest = i;
    const l = 2 * i + 1, r = 2 * i + 2;
    if (l < n && cmpMax(a[l], a[largest]) > 0) largest = l;
    if (r < n && cmpMax(a[r], a[largest]) > 0) largest = r;
    if (largest === i) break;
    [a[i], a[largest]] = [a[largest], a[i]];
    i = largest;
  }
}

function heapSort(a, cmpMax) {
  const b = a.slice();
  const n = b.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) siftDown(b, n, i, cmpMax);
  for (let end = n - 1; end > 0; end--) {
    [b[0], b[end]] = [b[end], b[0]];
    siftDown(b, end, 0, cmpMax);
  }
  return b; // creciente si el heap era de máximos
}
```

`build-heap` es `Θ(n)`. Las `n` extracciones dominan: `Θ(n log n)`.

---

## 9. Ordenar en el desarrollo de software

Casi nunca se reimplementa Merge Sort. Sí se elige **clave**, **estabilidad** y **estructura** (arreglo ordenado vs heap vs árbol).

### Listas, feeds y búsquedas

- Un e-commerce ordena por precio, rating, «más reciente». Eso es un comparador. Si «más reciente» debe romper empates de precio de forma estable, el sort del motor tiene que ser estable (Timsort lo es).
- Buscar en un catálogo ordenado es `O(log n)` (binaria). El costo se pagó al ordenar o al mantener un índice.

### Urgencias, tickets y colas de trabajo

- Jira, PagerDuty, un *help desk*: extraer el ticket de mayor severidad es un **heap** (cola de prioridad). Heap Sort aparece cuando se quiere el ranking completo del backlog, no solo el siguiente.
- Un runner de CI que siempre toma el job de mayor prioridad: mismo heap. Greedy sobre un frente ya ordenado.

### Bases de datos

- `ORDER BY` en un `n` que no cabe en memoria: *external merge sort* (el Merge Sort de este laboratorio, a escala de runs en disco).
- Índices B-tree mantienen el orden incrementally: cada insert es `O(log n)`, como el preset *Pedido nuevo*, no un sort completo.

### Mapas y logística

- El despacho del laboratorio es primo de *earliest deadline first* y de *batching* por zona. Un courier real añade capacidad del vehículo y ventanas; ahí el sort es el primer corte, no el problema entero (pasa a matching o a heurística).
- Kruskal ordena aristas; Dijkstra extrae el vértice de menor distancia tentativo de un heap. Ordenar y heaps **son el sustrato** de los greedy del otro laboratorio.

### Lo que un equipo debería documentar

Cuando el código dice `sort((a, b) => …)`:

1. la tupla de clave, en orden;
2. si el empate es significativo (estabilidad);
3. el tamaño típico y el peor `n`;
4. si hace falta un heap (llegadas en línea) en lugar de un sort de lote.

Un refactor que «ordene por otra columna porque se ve más justo» cambia el problema, no el algoritmo.

---

## 10. Ordenar en el día a día

- **Fila del médico / EPS.** El color de triaje es la clave. Atender por orden de llegada **sin** color es otro algoritmo (FIFO) y otro objetivo (justicia de espera, no riesgo clínico).
- **Bandeja del correo.** Estrellas y no leídos primero: clave compuesta. Insertion mental: el correo nuevo se mete en su sitio, no se reordena la bandeja entera.
- **Manos de naipes.** Insertion Sort es exactamente cómo mucha gente ordena la mano: cada carta nueva busca su hueco. Con 13 cartas, `n²` da igual.
- **Estantería y mudanza.** «Lo más grande primero» es un criterio (first fit decreasing usa un sort previo). El criterio no es inocente: cambia el hueco que queda.
- **Playlist.** Ordenar por BPM o por álbum. Un sort estable deja juntas las pistas del mismo disco cuando el BPM empata.
- **Cajero que agrupa billetes.** Counting Sort informal: cubetas de 2 000, 5 000, 10 000, 20 000, 50 000, 100 000. La clave es un conjunto chico de enteros; no hace falta `n log n`.

La metáfora útil: **elegir la clave es elegir la política**. El algoritmo solo la ejecuta barato.

---

## 11. Frente a greedy y a las otras familias

Ordenar es divide-y-vencerás (Merge), o estructura (Heap), o histograma (Counting). Greedy **usa** un sort y después no se retracta.

| Familia | Papel del ordenamiento |
| --- | --- |
| Greedy | Casi siempre el término dominante: `O(n log n)` + barrido `O(n)` |
| Divide y vencerás | Merge Sort *es* el ejemplo de libro; la recurrencia `T(n)=2T(n/2)+Θ(n)` |
| Estructuras | Heap / cola de prioridad: el sort *online* |
| Programación dinámica | A veces se ordena la entrada (LIS vía patience, intervalos ponderados) |

Un error de curso: decir «es `O(n log n)` porque ordené» sin decir **con qué** (peor caso de Quick ≠ Merge) y **para qué clave**.

---

## 12. Cómo está armado el material HTML

```text
algoritmos-ordenamiento/
├── index.html                      hub
├── desarrollo/
│   ├── index.html
│   ├── styles.css
│   └── app.js                      traza de Merge Sort + inserción
└── presentacion/
    ├── index.html
    ├── styles.css
    └── app.js                      diapositivas + Heap Sort paso a paso
```

El motor del laboratorio no llama `Array.sort` para el relato de clase: emite `split`, `compare`, `take`, `merge-done` para pintar las dos corridas y la salida. El de la presentación emite `sift` y `extract` sobre el arreglo-heap.

Eso es el mismo patrón que el vuelto greedy: **algoritmo puro + traza**. Sirve para enseñar, para depurar y para preguntar en tablero «tras el paso k, ¿quién va primero en la fusión?».

---

## 13. Ejercicios sugeridos

1. Escribe `O` / `Θ` ajustado de Insertion, Merge, Heap y Quick (peor y promedio). ¿Por qué «Quick es `O(n log n)`» es verdad en promedio y una trampa en el peor caso?
2. Con `n = 12` (hora pico del laboratorio), compara `n!` con `n log₂ n`. ¿En qué `n` dejarías de enumerar permutaciones a mano?
3. Demuestra `log₂(n!) ∈ Θ(n log n)` con Stirling o con la cota ` (n/2)^{n/2} ≤ n! ≤ n^n `.
4. En el preset *Empates*, cambia el comparador a solo `resta` y observa si dos pedidos del mismo barrio se separan. Relaciónalo con estabilidad.
5. Escribe el contraejemplo de Heap Sort no estable: dos registros con la misma clave, orden original `A, B`, resultado `B, A`.
6. Un hospital atiende llegadas en línea. ¿Sigue siendo Heap Sort el procedimiento, o es un heap con `insert` + `extract-max`? Complejidad de cada operación.
7. Counting Sort para las denominaciones COP del laboratorio greedy. ¿Cuál es `k`? ¿Por qué aquí `O(n + k)` gana a `O(n log n)`?
8. Encuentra en un sistema que uses (correo, clase virtual, tienda) un `ORDER BY` o un sort. Documenta la clave, si es estable y el `n` típico.

---

## 14. Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*. Heapsort, Quicksort, Mergesort, cota inferior, counting y radix.
- Kleinberg, Tardos. *Algorithm Design*. Recurrencias de divide-y-vencerás; interval scheduling (el sort que ya vieron en greedy).
- Sedgewick, Wayne. *Algorithms*. Implementaciones y el papel de Insertion para `n` chico / arrays casi ordenados.
- Python Timsort / Java `Arrays.sort` para objetos: documentación de por qué un sort de producción no es un único algoritmo de pizarrón.

---

## Licencia de uso académico

Material de apoyo para clase. Úsalo y adáptalo. Contrasta siempre la clave (la política) con la cota (el algoritmo).
