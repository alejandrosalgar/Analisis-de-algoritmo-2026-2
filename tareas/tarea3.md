# Tarea 3 · Grafos en LeetCode

**Curso:** Análisis de algoritmos · ITM · 2026-2  
**Tema:** grafos (recorrido, componentes conexas, grafos dirigidos)  
**Entrega:** repositorio **individual** de cada estudiante (no el repositorio del curso).

En clase se vio que un grafo es el modelo de **relaciones**: hay que decir qué es un vértice, qué es una arista, si es dirigido y qué algoritmo responde la pregunta. Contar **grupos de amigos** es contar **componentes conexas**. Decidir si se puede cursar un pensum es decidir si un grafo **dirigido** es un DAG (no tiene ciclo). Esta tarea pide aplicar esas dos ideas en [LeetCode](https://leetcode.com/).

Material de apoyo: [`README-GRAFOS.md`](../README-GRAFOS.md).

---

## Qué hay que hacer

Resolver **los dos** ejercicios de abajo con un enfoque de **grafos** (DFS, BFS, Union-Find o orden topológico: lo que pida cada uno). Para cada uno:

1. Implementar la solución en LeetCode (el lenguaje es libre: Python, Java, C++, JavaScript, TypeScript, etc.).
2. Hacer **Submit** hasta obtener **Accepted** (éxito: todos los casos de prueba pasan).
3. Subir al **repositorio individual** el código y las **imágenes** que demuestren ese éxito.

Sin captura de **Accepted**, el ejercicio no se considera entregado.

**No cuenta** como solución del curso un truco que no recorra el grafo (por ejemplo, adivinar con conteos locales que no equivalen a componentes o a detectar un ciclo). En el README de la entrega tiene que verse el algoritmo que se pidió.

---

## Entrega (repositorio individual)

Monte **todo** en su repositorio individual, en una carpeta clara, por ejemplo:

```text
tarea3/
├── README.md                 ← enlace a cada problema, algoritmo y complejidad
├── number-of-provinces/      ← código del ejercicio 1
├── course-schedule/          ← código del ejercicio 2
└── evidencias/
    ├── number-of-provinces-accepted.png
    └── course-schedule-accepted.png
```

El nombre de las carpetas puede variar; lo obligatorio es que se identifique **qué archivo es de cuál problema** y que las evidencias estén **dentro del repo** (no solo pegadas en un correo o un chat).

### Imágenes de éxito (obligatorias)

Por **cada** problema incluya al menos **una captura de pantalla** en la que se vea, sin recortar lo esencial:

- el enunciado o el número/título del problema de LeetCode;
- el resultado **Accepted** (o **Success**), en verde;
- que **todos** los test cases pasaron;
- runtime / memoria si LeetCode los muestra;
- **su usuario** de LeetCode visible (o el correo/cuenta con la que resolvió).

No vale una captura solo del editor, ni del Run local, ni de un caso de ejemplo. Tiene que ser el **Submit** aceptado por la plataforma.

Si quiere, puede agregar una segunda imagen con el detalle de *Runtime beats …%* / *Memory beats …%*. Es opcional.

### README de la entrega

En el `README.md` de la carpeta de la tarea, para **cada** ejercicio escriba en pocas líneas:

- enlace al problema;
- cuál es el **modelo** (qué es un vértice, qué es una arista, dirigido o no) y el **algoritmo** (DFS, BFS, Union-Find, Kahn, etc.);
- complejidad de **tiempo** y de **espacio** (`O(…)`), con `n` y `m` nombrados (y `n²` si la entrada es una matriz);
- enlace relativo a la(s) imagen(es) de **Accepted**.

Ejemplo de cómo incrustar la evidencia en Markdown:

```markdown
## 547. Number of Provinces

Modelo: …  
Algoritmo: …

![Accepted — Number of Provinces](evidencias/number-of-provinces-accepted.png)
```

---

## Ejercicio 1 · [547. Number of Provinces](https://leetcode.com/problems/number-of-provinces/)

**Dificultad:** Medium  
**Etiquetas:** Depth-First Search, Breadth-First Search, Union Find, Graph

Hay `n` ciudades. La matriz `isConnected` de `n × n` cumple `isConnected[i][j] = 1` si las ciudades `i` y `j` están **directamente** conectadas (y 0 si no). La conexión es recíproca: el grafo es **no dirigido**. Una **provincia** es un conjunto de ciudades ligadas de forma directa o **indirecta** (amigos, o amigos de amigos, o más lejos). Hay que devolver **cuántas provincias** hay.

Este problema es el de los **grupos de amigos** de la guía: cada ciudad es una persona, cada `1` fuera de la diagonal es una amistad, y una provincia es una **componente conexa**. Quien no se conecta con nadie forma un grupo de tamaño 1 (Gina en el ejemplo de clase).

**Pista de diseño (no es la solución completa):**

- vértices: las `n` ciudades (`0 … n-1`); arista `{i, j}` si `i ≠ j` e `isConnected[i][j] == 1`;
- recorra las ciudades; cada vez que aparezca una **no visitada**, sume 1 al recuento y lance DFS o BFS para marcar todo su grupo;
- Union-Find también vale: `union` por cada `1` de la matriz y al final cuente raíces distintas;
- la diagonal `isConnected[i][i]` vale 1 por definición: **no** es una arista hacia otra ciudad.

Indique en el README la complejidad. La entrada ya es una matriz: hay que mirar `Θ(n²)` celdas. Un DFS/BFS sobre lista sería `Θ(n + m)`, pero aquí construir la lista o recorrer la fila ya cuesta `Θ(n²)`. Espacio extra: `O(n)` para `visitado` (más la pila/cola).

---

## Ejercicio 2 · [207. Course Schedule](https://leetcode.com/problems/course-schedule/)

**Dificultad:** Medium  
**Etiquetas:** Depth-First Search, Breadth-First Search, Graph, Topological Sort

Hay `numCourses` asignaturas, etiquetadas `0 … numCourses-1`. El arreglo `prerequisites` trae pares `[a, b]`: para cursar `a` hay que **haber cursado antes** `b`. Decidir si es posible terminar **todas** las asignaturas.

En la guía esto es el **pensum como grafo dirigido**: vértice = materia, arco `b → a` (o el convenio inverso, pero **uno solo** y coherente). Se pueden cursar todas si y solo si el grafo es un **DAG**: no hay ciclo de prerrequisitos. Un ciclo *Cálculo II* necesita *EDOs* y *EDOs* necesita *Cálculo II* deja el semestre bloqueado.

**Pista de diseño (no es la solución completa):**

- construya la lista de adyacencia y, si usa Kahn, el arreglo de **grados de entrada**;
- **Kahn / BFS:** encole las materias con indegree 0; cada vez que «cursa» una, baje el indegree de sus vecinas; si al final cursó menos de `numCourses`, había un ciclo;
- **DFS de 3 colores:** blanco / gris / negro; volver a visitar un nodo **gris** es un ciclo hacia atrás;
- materias aisladas (sin flechas) se pueden cursar cuando sea: no las olvide en el recuento.

Indique en el README la complejidad. Con `n = numCourses` y `m = prerequisites.length` tanto Kahn como DFS son **`O(n + m)`** en tiempo y `O(n + m)` en espacio (listas + cola o pila). Un algoritmo `O(n³)` tipo Floyd **no** es lo que se evalúa.

---

## Qué se evalúa

| Criterio | Qué se espera |
| --- | --- |
| Completitud | Los **dos** problemas en el repositorio individual |
| Éxito en LeetCode | Imagen de **Accepted / Success** por cada uno, legible y asociada al problema |
| Enfoque de grafos | Modelo (vértices, aristas, dirigido o no) y algoritmo escritos; no basta “el código pasó” |
| Complejidad | `O` de tiempo y espacio, coherente con el código (`n`, `m`, o `n²` en la matriz) |
| Organización | Carpetas o nombres claros; el README enlaza código e imágenes |

No se pide copiar una solución de Internet sin entenderla. Si el código es correcto pero no puede explicar en clase qué es una componente o cómo detectó el ciclo, la tarea queda incompleta.

---

## Recordatorios

- Trabaje en **su** repositorio. Un push al repo del curso **no** cuenta como entrega.
- Haga `git add` de las **imágenes** (`.png` / `.jpg`). Un README que apunta a archivos que nunca se subieron no sirve.
- El veredicto que cuenta es **Accepted** en Submit, no *Run Code* sobre un ejemplo.
- Plazos y forma de avisar el enlace del repo: según lo indicado en clase / aula virtual.
