# Grafos · 2026-2

Material del curso (ITM). Un grafo no es un dibujo de circulitos: es el modelo para **relaciones**. Greedy ya usó esa idea sin detenerse en ella (Kruskal, Dijkstra). Esta guía la pone en el centro: de dónde salió, qué es, para qué sirve, cuáles algoritmos hay que saber y cómo se resuelven a mano dos o tres problemas típicos.

Curso: **Análisis de algoritmos · ITM · 2026-2**. Tarea: [`tareas/tarea3.md`](tareas/tarea3.md) (LeetCode: provincias y pensum).

---

## 1. Historia: Königsberg y el invento de Euler

En 1736, Königsberg (hoy Kaliningrado) tenía el río Pregel, dos islas y **siete puentes**. La pregunta de sobremesa era:

> ¿Se puede caminar por la ciudad cruzando **cada puente exactamente una vez** y volver al punto de partida?

Leonhard Euler no salió a caminar. Modeló orillas e islas como **puntos** y puentes como **líneas** que los unen, y preguntó algo más general: *¿qué tiene que cumplir un dibujo de puntos y líneas para que exista ese paseo?* El artículo se llama *Solutio problematis ad geometriam situs pertinentis* («solución de un problema relativo a la geometría de la posición»). No usa la palabra *grafo* —esa la acuñó J. J. Sylvester en 1878, por analogía con las fórmulas químicas—, pero ahí nace la **teoría de grafos** y, de paso, un trozo de la topología: lo que importa no es la forma de los puentes, sino **quién conecta con quién**.

Las cuatro tierras y los siete puentes (C es la isla Kneiphof; las dobles líneas son dos puentes entre el mismo par):

```text
        A (orilla norte)
        |  \
        |   \
       2|    1
        |     \
        C ——1—— D (otra isla)
        |     /
       2|    1
        |   /
        B (orilla sur)
```

Grados: `A = 3`, `B = 3`, `C = 5`, `D = 3`. Los cuatro son **impares**. Suma de grados `14 = 2m`, con `m = 7`. Euler observó que, en un paseo que usa cada arista una sola vez, cada vez que entras a un vértice por un puente **tienes** que salir por otro, salvo el inicio y el final. Entonces:

| Vértices de grado impar | ¿Existe paseo que use cada puente una vez? |
| --- | --- |
| 0 | Sí: circuito (vuelves al inicio). Hoy: **circuito euleriano**. |
| 2 | Sí: camino (empiezas en uno impar y terminas en el otro). **Camino euleriano**. |
| 4 o más | **No**. |

Königsberg tiene 4 impares: imposible. No hace falta enumerar rutas. La prueba es un **invariante** (la paridad de los grados), no una búsqueda.

Eso es el gesto que se repite en el resto del curso: **modelar → traducir la pregunta a una propiedad del grafo → algoritmo (o teorema) con cota**.

Lo que vino después, en una línea:

| Año (aprox.) | Quién | Qué aportó |
| --- | --- | --- |
| 1736 | Euler | Caminos que recorren aristas; nacimiento del área |
| 1847 | Kirchhoff | Redes eléctricas y árboles de recubrimiento |
| 1857 | Cayley | Árboles; recuento de isómeros químicos |
| 1878 | Sylvester | La palabra *graph* |
| 1936 | König | Primer libro de teoría de grafos |
| 1956–59 | Kruskal, Prim, Dijkstra, Ford–Fulkerson | Los algoritmos que aún se programan |

El problema de Königsberg es de **aristas**. El primo de **vértices** es el circuito hamiltoniano (visitar cada ciudad una vez): parece igual de inocente y es NP-duro. Misma familia de dibujos, otra complejidad.

---

## 2. Qué es un grafo

Un **grafo** es un par `G = (V, E)`:

- **`V`** — conjunto de **vértices** (nodos, puntos). Personas, cruce de calles, páginas web, asignaturas.
- **`E`** — conjunto de **aristas** (arcos, enlaces). Cada arista relaciona dos vértices.

El tamaño de la instancia se reporta con dos números: **`n = |V|`** y **`m = |E|`**. Un algoritmo de grafos casi nunca se cotiza solo en `n`: recorrer la lista de adyacencia es `Θ(n + m)`.

### Variantes que hay que nombrar

| Variante | Qué cambia | Ejemplo |
| --- | --- | --- |
| **No dirigido** | La arista `{u, v}` se recorre en los dos sentidos | Amistad, calle de doble sentido, cable |
| **Dirigido** (digrafo) | El arco `(u, v)` va de `u` a `v` | Seguir en Instagram, calle de un sentido, prerrequisito |
| **Ponderado** | Cada arista tiene un peso `w(u,v)` | Minutos, pesos, costo, afinidad |
| **Simple** | Sin bucles ni aristas múltiples | El modelo por defecto en clase |
| **Multigrafo** | Varias aristas entre el mismo par | Los dos puentes entre las mismas orillas en Königsberg |

**Grado** `d(v)`: cuántas aristas tocan a `v` (en dirigidos: grado de entrada y de salida). Lema del apretón de manos: la suma de grados es `2m`. Por eso el número de vértices de grado impar es siempre par —el mismo hecho que usó Euler.

### Palabras usadas

- **Camino** — secuencia de vértices donde cada paso consecutivo es una arista. **Simple** si no repite vértices.
- **Ciclo** — camino que vuelve al inicio.
- **Conexo** (no dirigido) — de cualquier vértice se puede ir a cualquier otro.
- **Componente conexa** — trozo conexo maximal: un «grupo» que no se puede agrandar sin romper la conexión.
- **Fuertemente conexo** (dirigido) — se puede ir y volver entre cada par.
- **Árbol** — conexo y acíclico. Equivale a: `n` vértices y `n − 1` aristas, o «hay un único camino entre cada par».
- **DAG** — dirigido y acíclico. Admite **orden topológico**.

### Cómo se guarda (y por qué importa la cota)

Dos representaciones clásicas:

**Matriz de adyacencia** `A[n × n]`: `A[u][v] = 1` (o el peso) si hay arista. Espacio `Θ(n²)`. Consultar «¿existe `{u,v}`?» es `O(1)`. Recorrer los vecinos de `u` es `Θ(n)`, aunque `u` tenga dos amigos.

**Lista de adyacencia**: para cada vértice, la lista de sus vecinos. Espacio `Θ(n + m)`. Recorrer vecinos es `Θ(d(u))`. Consultar una arista concreta, sin hash, es `O(d(u))`.

En grafos **ralos** (`m` del orden de `n` o `n log n`) la lista gana: una red social de 10⁴ personas con 5 amigos de media no merece una matriz de 10⁸ celdas. En grafos **densos** (`m` cerca de `n²`) la matriz es natural. En este curso, salvo que se diga lo contrario, se asume **lista de adyacencia**.

```text
Ana:   [Bruno, Carla]
Bruno: [Ana, Hugo]
Carla: [Ana, Elena]
…
```

El oficio: **elegir el modelo (dirigido o no, con peso o no) y la representación**, no solo «dibujar el grafo».

---

## 3. Para qué sirve y cómo se recorre

Casi toda pregunta sobre un grafo se reduce a **recorrer** vértices y aristas con una política:

| Política | Estructura | Qué descubre primero | Para qué |
| --- | --- | --- | --- |
| **DFS** (profundidad) | Pila / recursión | Un camino largo | Componentes, ciclos, orden topológico, puentes |
| **BFS** (anchura) | Cola | Lo más cercano en número de aristas | Distancia no ponderada, niveles, «a k saltos» |

Los dos marcan visitados para no reentrar. Los dos son **`O(n + m)`** sobre lista de adyacencia: cada vértice se encola (o se apila) a lo sumo una vez y cada arista se mira un número constante de veces.

```text
BFS(origen s):
    cola ← {s}; dist[s] ← 0; visitado[s] ← sí
    mientras la cola no esté vacía:
        u ← desencolar
        para cada vecino v de u:
            si v no visitado:
                visitado[v] ← sí
                dist[v] ← dist[u] + 1
                encolar v
```

DFS es el mismo esqueleto con pila en lugar de cola (o con llamadas recursivas).

Con **pesos**, «el más cercano» ya no es el de menos aristas. Ahí entran Dijkstra, Bellman–Ford o Floyd–Warshall. El recorrido sigue siendo la idea; cambia **qué vértice se cierra a continuación**.

---

## 4. Aplicaciones en la vida real

El mismo `G = (V, E)` cambia de oficio según qué pongas en `V` y en `E`.

### Redes de personas

Facebook, WhatsApp, LinkedIn, el grafo de citas de un paper: vértice = cuenta, arista = amistad, seguimiento o coautoría. Las **componentes conexas** son grupos que no se hablan entre sí. El **diámetro** (el más largo de los caminos más cortos) es la idea detrás de los «seis grados de separación». Una recomendación de «gente que quizá conozcas» mira vecinos de vecinos (BFS a distancia 2) o caminos de longitud 3.

### Mapas, GPS y transporte

Intersecciones y tramos de calle (Google Maps, Waze, el Metro de Medellín). El peso es minutos, no kilómetros: un atajo empinado puede ser peor. Dijkstra / A* calculan la ruta. Un **MST** (Kruskal/Prim) no sirve para ir de A a B; sirve para cablear un barrio con la menor cantidad de fibra que deje a todos conectados.

### Internet y la web

El grafo de routers (BGP) y el grafo dirigido de páginas (un enlace `A → B`). PageRank, en espíritu, es un flujo en ese digrafo. Un **BFS** desde tu DNS local no te lleva a «la web entera»; el grafo es demasiado grande y dirigido. Aun así, crawlers recorren arcos.

### Dependencias de software y de asignaturas

Paquetes npm/pip, jobs de CI, prerrequisitos del pensum: es un **DAG** si no hay ciclos. El orden topológico dice en qué orden instalar o cursar. Un ciclo es un error de diseño (dependencia circular). Compiladores hacen lo mismo con módulos.

### Biología, circuitos y química

Proteínas que interactúan, genes que se regulan, moléculas (Cayley ya contaba isómeros como árboles). Un circuito impreso es un grafo; encontrar cortos o componentes conexas es inspección, no metáfora.

### Epidemiología y rumores

El modelo SIR sobre un grafo: un infectado contagia a sus vecinos. El tamaño de la componente del «paciente cero» acota a quién puede llegar el brote si nadie se aísla. Cerrar puentes entre componentes es, literalmente, **desconectar el grafo**.

### Videojuegos y logística

El mapa jugable es un grafo de celdas o de *waypoints*; A* mueve al personaje. Un almacén con pasillos, un aeropuerto con escalas, una red de bodegas: flujo máximo (cuánta mercancía cabe) o caminos más cortos (qué camión sale).

Regla de lectura: si la pregunta es «¿está relacionado con…?», «¿cuál es el grupo?», «¿cuál es la ruta?», «¿en qué orden?» o «¿cuánto cuesta conectar a todos?», el modelo es un grafo y el algoritmo ya tiene nombre.

---

## 5. Algoritmos más famosos

Los que hay que poder explicar en pizarrón, con cota y con la hipótesis que los hace correctos. Kruskal y Dijkstra ya aparecieron como greedy en [`algoritmos-greedy/README.md`](algoritmos-greedy/README.md); aquí se ven como **algoritmos de grafos**.

| Algoritmo | Pregunta | Hipótesis | Cota típica (lista + heap si aplica) |
| --- | --- | --- | --- |
| **DFS** | Recorrer, ciclos, componentes, topológico | — | `Θ(n + m)` |
| **BFS** | Distancia en **número de aristas** | Pesos = 1 (o no hay pesos) | `Θ(n + m)` |
| **Componentes conexas** | ¿Cuántos grupos? ¿Quién está con quién? | No dirigido | `Θ(n + m)` (DFS/BFS o Union-Find) |
| **Kosaraju / Tarjan** | Componentes **fuertemente** conexas | Dirigido | `Θ(n + m)` |
| **Orden topológico** | ¿En qué orden sin romper dependencias? | DAG | `Θ(n + m)` |
| **Dijkstra** | Camino más corto desde `s` | Pesos **≥ 0** | `O((n + m) log n)` con heap |
| **Bellman–Ford** | Camino más corto desde `s`; detecta ciclo negativo | Pesos reales | `O(nm)` |
| **Floyd–Warshall** | Caminos más cortos **entre todos los pares** | Pesos reales, sin ciclo negativo | `Θ(n³)` |
| **A\*** | Camino más corto con heurística | Heurística admisible; pesos ≥ 0 | Como Dijkstra, a menudo menos nodos cerrados |
| **Kruskal** | Árbol de recubrimiento mínimo (MST) | No dirigido, conexo, pesos | `O(m log m)` |
| **Prim** | El mismo MST | Igual | `O(m + n log n)` con heap |
| **Ford–Fulkerson / Edmonds–Karp** | Flujo máximo | Capacidades | EK: `O(n m²)` |
| **Hierholzer** | Construir el circuito euleriano | 0 (o 2) grados impares, conexo | `O(n + m)` |

Lectura rápida:

- **BFS vs Dijkstra.** Si el costo de cada arista es 1, BFS *es* el camino más corto y más barato de implementar. Dijkstra generaliza BFS: la cola se vuelve cola de prioridad por distancia tentativa.
- **Bellman–Ford.** Relaja `n − 1` veces todas las aristas. Una relajación extra que aún mejore ⇒ ciclo negativo alcanzable. Obligatorio si hay peajes negativos (o «bonificaciones»).
- **Floyd–Warshall.** Triple bucle `k, i, j`: «¿conviene pasar por `k`?». No sustituye a Dijkstra cuando solo importa un origen y `n` es grande: `n³` con `n = 10⁴` no corre en clase.
- **MST ≠ camino más corto.** El MST minimiza la **suma de las aristas del árbol**, no la distancia entre un par. Para ir de la universidad a la casa, Dijkstra. Para tender la red de fibra del campus, Kruskal o Prim.
- **Euler vs Hamilton.** Recorrer aristas (Euler) es lineal si se cumple el teorema de grados. Recorrer vértices (Hamilton, TSP) no tiene algoritmo polinomial conocido; el greedy del vecino más cercano es heurística.

### Plantilla de componentes conexas (la que se usa en el ejercicio 1)

```text
función componentes(G):
    visitado[v] ← falso para todo v
    k ← 0
    para cada vértice v:
        si no visitado[v]:
            k ← k + 1
            explorar(v)        // DFS o BFS: marca toda la componente de v
    devolver k
```

Cada llamada a `explorar` cubre **exactamente un grupo**. El `para cada v` no recorre de más: los ya marcados se saltan. Complejidad `Θ(n + m)`.


### Ejercicio 1 · ¿Cuántos grupos de amigos hay?

**Enunciado.** En una red social del curso hay **8 personas**. Una amistad es recíproca (si A es amiga de B, B es amiga de A). No todas se conocen. Se quiere saber **cuántos grupos de amigos** hay: dos personas están en el mismo grupo si existe una cadena de amistades que las une (amigos, o amigos de amigos, o más lejos). Quien no tiene ningún amigo forma un grupo de una sola persona.

Personas: Ana, Bruno, Carla, Diego, Elena, Felipe, Gina, Hugo.

Amistades:

1. Ana — Bruno  
2. Ana — Carla  
3. Bruno — Hugo  
4. Carla — Elena  
5. Diego — Felipe  

Gina no aparece en ninguna amistad.

**Pregunta.** ¿Cuántos grupos hay? ¿Quién queda en cada uno?

**Modelo.** Grafo **no dirigido, no ponderado**. `V` = las 8 personas. `E` = las 5 amistades. Un grupo = una **componente conexa**.

Dibujo:

```text
Ana —— Bruno —— Hugo
 |
Carla —— Elena

Diego —— Felipe

Gina
```

Listas de adyacencia (vecinos en orden alfabético, para que la traza sea única):

```text
Ana:    Bruno, Carla
Bruno:  Ana, Hugo
Carla:  Ana, Elena
Diego:  Felipe
Elena:  Carla
Felipe: Diego
Gina:   (nadie)
Hugo:   Bruno
```

**Algoritmo.** Recorrer las personas en orden alfabético. Cada vez que aparezca una no visitada, empieza un grupo nuevo y se lanza un **DFS** (igual serviría BFS).

Estado inicial: nadie visitado. `k = 0`.

**Paso 1.** Ana no visitada → `k = 1`. DFS desde Ana.

| Llamada | Marca | Vecinos aún no visitados | Qué hace |
| --- | --- | --- | --- |
| `DFS(Ana)` | Ana | Bruno, Carla | entra a Bruno |
| `DFS(Bruno)` | Bruno | Hugo (Ana ya está) | entra a Hugo |
| `DFS(Hugo)` | Hugo | — (Bruno ya está) | vuelve |
| (sigue Ana) | | Carla | entra a Carla |
| `DFS(Carla)` | Carla | Elena | entra a Elena |
| `DFS(Elena)` | Elena | — (Carla ya está) | vuelve |

Componente 1 = `{Ana, Bruno, Carla, Elena, Hugo}`. Cinco personas. Hugo nunca habló con Elena, pero hay cadena `Hugo–Bruno–Ana–Carla–Elena`: **son el mismo grupo**.

**Paso 2.** Siguiente en el orden: Bruno, ya visitado. Carla, visitada. **Diego**, no visitado → `k = 2`. DFS desde Diego.

| Llamada | Marca | Vecinos aún no visitados |
| --- | --- | --- |
| `DFS(Diego)` | Diego | Felipe |
| `DFS(Felipe)` | Felipe | — |

Componente 2 = `{Diego, Felipe}`. El equipo que solo se habla entre sí.

**Paso 3.** Elena y Felipe ya visitados. **Gina**, no visitada → `k = 3`. DFS desde Gina: la marca y no tiene vecinos.

Componente 3 = `{Gina}`. Un grupo de tamaño 1 no es un error del algoritmo: es una componente.

**Paso 4.** Hugo ya visitado. Fin.

**Respuesta.** Hay **3 grupos**:

| Grupo | Personas | Cómo leerlo en la red |
| --- | --- | --- |
| 1 | Ana, Bruno, Carla, Elena, Hugo | El círculo del bloque B |
| 2 | Diego, Felipe | El dúo que no se cruza con el resto |
| 3 | Gina | Aún no ha hecho match con nadie |

**Complejidad.** `n = 8`, `m = 5`. El DFS mira cada persona una vez y cada amistad dos veces (ida y vuelta en la lista). Tiempo `Θ(n + m) = Θ(13)`. Memoria extra: el arreglo `visitado` y la pila de recursión, `O(n)` en el peor caso (un camino largo).

**Qué no hay que hacer.** Contar «cuántos tienen al menos un amigo» (daría 7) o contar aristas (5). La pregunta es de **componentes**, no de grados. Tampoco basta mirar «quién tiene más amigos»: Ana y Carla tienen grado 2 y viven en el mismo grupo.

**Variante Union-Find.** Para cada amistad `{u, v}` se hace `union(u, v)`. Al final, el número de raíces distintas es `k`. Misma respuesta; cota `O(n + m α(n))` tras `n` `makeSet`. Útil cuando las amistades **llegan en línea** (un follow nuevo) y hay que actualizar el recuento sin relanzar DFS.

**Comprobación rápida.** En un grafo no dirigido, `k = n − m` **solo** si cada componente es un árbol (sin ciclos). Aquí el grupo 1 tiene 5 vértices y 4 aristas (es un árbol), el 2 tiene 2 y 1, Gina 1 y 0: `k = 8 − 5 = 3`. Si mañana Ana también fuera amiga de Hugo nacería un ciclo y esa fórmula **dejaría de valer**; DFS seguiría bien.

---

### Ejercicio 2 · ¿A cuántas amistades está cada quien de Ana? (BFS)

El ejercicio 1 preguntaba **quiénes viven en el mismo grupo**. Este pregunta otra cosa, sobre **el mismo dibujo**: no basta «Elena está en el grupo de Ana»; Ana quiere saber **cuántas amistades hay que cruzar** para llegar a Elena (o a Hugo, o a Diego).

**Enunciado.** Misma red del ejercicio 1 (ocho personas, cinco amistades). Ana es el origen. Un **salto** es una amistad: si X es amigo de Y, hay 1 salto entre ellos. Si X es amigo de Y y Y es amigo de Z, pero X y Z no se conocen, hay **2 saltos** (X → Y → Z). Hay que escribir, para cada persona, ese número **mínimo**. Si desde Ana no existe ninguna cadena de amistades hasta esa persona, la distancia es **infinita** (no se puede llegar).

**Qué se pide.** Una etiqueta de distancia para cada uno, no un solo número.

**Intuición, sin algoritmo.** Cuente las líneas del dibujo desde Ana, siempre por el camino **más corto** (menos amistades):

```text
              2 saltos
                 Hugo
                  |
                 Bruno          ← 1 salto (amigo de Ana)
                  |
    Elena — Carla — Ana         ← Ana vale 0 (ella misma)
    2 saltos  1 salto


    Diego — Felipe              ← ninguna línea llega hasta Ana → ∞

    Gina                        ← nadie la conecta → ∞
```

Tres olas, como cuando tira una piedra al agua:

| Ola | Pregunta en castellano | Personas | Distancia |
| --- | --- | --- | --- |
| 0 | ¿Quién es Ana? | Ana | 0 |
| 1 | ¿A quién conoce Ana **en persona**? | Bruno, Carla | 1 |
| 2 | ¿A quién conocen Bruno o Carla, que Ana **aún no** haya contado? | Hugo (lo presenta Bruno), Elena (la presenta Carla) | 2 |
| — | ¿Queda alguien a quien no se llegó? | Diego, Felipe, Gina | ∞ |

Hugo no es amigo de Ana: no hay línea `Ana — Hugo`. Pero Bruno sí es amigo de los dos, así que Ana llega a Hugo en **2** saltos (`Ana → Bruno → Hugo`). Elena igual: `Ana → Carla → Elena`. Diego tiene un amigo (Felipe), pero ese dúo **no toca** el grupo de Ana: no hay cadena, da igual cuántos saltos se permitan.

Eso es lo que LinkedIn llama contactos de 1.º y 2.º grado. El ejercicio 1 solo decía «mismo grupo / otro grupo». Este pone el **número**.

**Algoritmo.** Para no saltarse una ola ni contar dos veces a la misma persona, se usa **BFS** (recorrido en anchura). Idea: una **cola** (fila del banco: el primero que llegó se atiende primero). Ana entra primero. Cada vez que se atiende a alguien, se meten al final de la fila **solo sus amigos todavía no vistos**, con distancia = la de esa persona + 1. Así se terminan los de distancia 1 antes de pasar a los de distancia 2.

Marca de «ya lo vi» para no encolar a Ana otra vez cuando Bruno diga «mi amiga Ana».

| Paso | Fila (el de adelante se atiende) | Atiende | Distancia que le pone | Amigos nuevos que mete a la fila |
| --- | --- | --- | --- | --- |
| 1 | Ana | Ana | 0 | Bruno, Carla |
| 2 | Bruno, Carla | Bruno | 1 | Hugo (Ana ya estaba vista) |
| 3 | Carla, Hugo | Carla | 1 | Elena (Ana ya estaba vista) |
| 4 | Hugo, Elena | Hugo | 2 | nadie nuevo |
| 5 | Elena | Elena | 2 | nadie nuevo |
| 6 | (vacía) | se acaba | | |

Diego, Felipe y Gina **nunca** entran a la fila: desde Ana no hay arista que lleve hacia ellos.

**Respuesta.**

| Persona | Saltos desde Ana | En una frase |
| --- | --- | --- |
| Ana | 0 | es el origen |
| Bruno, Carla | 1 | amigos directos |
| Hugo, Elena | 2 | amigos de amigos |
| Diego, Felipe, Gina | ∞ | no hay camino; son los otros grupos del ejercicio 1 |

Comprobación: «¿Elena es amiga de una amiga de Ana?» Sí, `dist = 2`. «¿Y Diego?» No: Diego tiene amigos, pero no en el círculo de Ana.

**Relación con el ejercicio 1.** Quienes tienen distancia finita son **exactamente** la componente de Ana. Quienes tienen `∞` son las otras componentes. BFS, además del grupo, entrega **cuán lejos** está cada uno **en número de aristas**.

**Complejidad.** `Θ(n + m)`: cada persona se encola a lo sumo una vez y cada amistad se mira un número constante de veces. Aquí todas las amistades «pesan» 1, así que BFS **es** el camino más corto. Dijkstra haría falta solo si cada arista tuviera un costo distinto (minutos de bus, por ejemplo).

---

### Ejercicio 3 · ¿Se pueden cruzar todos los puentes? (Euler)

**Enunciado.** Un barrio copia el mapa de Königsberg: cuatro plazoletas `A, B, C, D` y **siete** pasajes peatonales.

- dos pasajes `A–C`
- dos pasajes `B–C`
- uno `A–D`
- uno `B–D`
- uno `C–D`

¿Existe un paseo que recorra **cada pasaje exactamente una vez**? ¿Y si se cierra el pasaje `C–D`?

**Modelo.** Multigrafo no dirigido. No se pide todavía listar el camino: se pide la **existencia**, con el criterio de Euler.

| Tierra | Pasajes que toca | Grado | Paridad |
| --- | --- | --- | --- |
| A orilla norte | C, C, D | 3 | impar |
| B orilla sur | C, C, D | 3 | impar |
| C Kneiphof | A, A, B, B, D | 5 | impar |
| D la otra isla | A, B, C | 3 | impar |

Suma de grados `3+3+5+3 = 14 = 2 · 7`. **Cuatro** vértices impares → no hay camino euleriano ni circuito. Respuesta: **no** se pueden cruzar todos los pasajes sin repetir uno, ni volviendo al inicio ni terminando en otra plazoleta.

**Variante.** Se cierra el pasaje `C–D`. Nuevos grados: `A = 3`, `B = 3`, `C = 4`, `D = 2`. Quedan **exactamente dos** impares (`A` y `B`). Entonces **sí** existe camino euleriano: tiene que **empezar** en `A` (o en `B`) y **terminar** en el otro. No es un circuito: no se vuelve al inicio. Si se cerraran pasajes hasta dejar todos los grados pares y el grafo siguiera conexo, existiría circuito y sí se volvería al punto de partida.

**Algoritmo si la respuesta es sí.** Hierholzer: partir de un vértice permitido, avanzar por aristas aún no usadas, y cuando te atascas fusionar el subcircuito. Tiempo `O(n + m)`. No hace falta backtracking exponencial.

**Contraste con Hamilton.** «Visitar cada plazoleta exactamente una vez» es otra pregunta. Con `n = 4` se puede enumerar; con `n = 30` no. Misma ciudad, otra cota.

---

## 7. Cómo atacar un problema de grafos en este curso

1. **¿Qué es un vértice? ¿Qué es una arista?** Si no se puede decir en una frase, el modelo está mal.
2. **¿Dirigido? ¿Con peso? ¿Puede haber ciclo?** Eso decide BFS contra Dijkstra, DFS contra topológico, Kruskal contra nada.
3. **¿La pregunta es de componente, de distancia, de orden o de recubrimiento?** Cada una tiene algoritmo de libro.
4. **Representación.** Lista, salvo `n` chico y consultas «¿existe arista?» a mansalva.
5. **Cota en `n` y `m`.** Un `O(n²)` silencioso (matriz, Floyd) con `n = 10⁵` no es una implementación seria.
6. **Casos borde.** Vértice aislado (ejercicio 1, Gina). Grafo no conexo (distancia ∞). Pesos 0. Multiaristas.

---

## 8. Ejercicios para practicar

1. En el grafo del ejercicio 1, agregue la amistad Elena — Felipe. Recalcule componentes y las distancias desde Ana. ¿Cuántos grupos quedan? ¿Cuál es ahora `dist[Diego]`?
2. Escriba el BFS del ejercicio 2 pero desde Gina. ¿Qué distancias obtiene? Relaciónelo con `k = 3`.
3. Un pensum: *Cálculo I* → *Cálculo II* → *EDOs*; *Cálculo I* → *Álgebra lineal*; *Álgebra lineal* y *Cálculo II* → *Análisis de algoritmos*. Dibuje el DAG y dé **un** orden topológico. ¿Hay más de uno? ¿Qué ciclo rompería el semestre?
4. Cinco barrios, tiempos no negativos en las calles. Calcule a mano Dijkstra desde el origen. Cambie un tiempo a negativo y explique por qué la misma regla greedy deja de ser legal.
5. Kruskal a mano con 6 nodos (puede reutilizar el ejemplo de la [guía greedy, §3.5](algoritmos-greedy/README.md#35-árbol-de-recubrimiento-mínimo-kruskal)). Marque la primera arista que Union-Find **rechaza**.
6. Demuestre que si hay 0 vértices de grado impar y el grafo (salvo aislados) es conexo, existe circuito euleriano. Escriba el contraejemplo de Königsberg como instancia de «4 impares».

---

## 9. Referencias

- Euler, L. *Solutio problematis ad geometriam situs pertinentis*, 1736. El origen.
- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*. Grafos elementales, BFS/DFS, caminos mínimos, MST.
- Kleinberg, Tardos. *Algorithm Design*. Modelado; BFS como distancias; conexidad.
- Dasgupta, Papadimitriou, Vazirani. *Algorithms*. Euler, Dijkstra y MST con argumentos cortos.
- Bondy y Murty, o Diestel. *Graph Theory*. Si se quiere el lado estructural (más allá de algoritmos).

Greedy y MST/Dijkstra: [`algoritmos-greedy/README.md`](algoritmos-greedy/README.md). Complejidad y notación: el [README del curso](README.md).

---

## Licencia de uso académico

Material de apoyo para clase. Modela primero, recorre después, y no confunda componente conexa con «quién tiene más amigos».
