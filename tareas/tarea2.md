# Tarea 2 · Algoritmos de ordenamiento en LeetCode

**Curso:** Análisis de algoritmos · ITM · 2026-2  
**Tema:** algoritmos de ordenamiento  
**Entrega:** repositorio **individual** de cada estudiante (no el repositorio del curso).

En clase se vio que ordenar no es «llamar a `.sort()`»: hay que elegir **clave**, **algoritmo** y **cota**. Merge Sort fusiona dos corridas ya ordenadas en tiempo lineal. Si el universo de claves es chico, Counting Sort (o un pariente) baja de `Θ(n log n)` a `O(n + k)` porque **no** compara. Esta tarea pide aplicar esas dos ideas en [LeetCode](https://leetcode.com/).

Material de apoyo: [`README-ORDENAMIENTO.md`](../README-ORDENAMIENTO.md), laboratorio de despacho y presentación de triaje en [`algoritmos-ordenamiento/`](../algoritmos-ordenamiento/).

---

## Qué hay que hacer

Resolver **los dos** ejercicios de abajo con un enfoque de **ordenamiento** (fusión o conteo / bandera holandesa: lo que pida cada uno). Para cada uno:

1. Implementar la solución en LeetCode (el lenguaje es libre: Python, Java, C++, JavaScript, TypeScript, etc.).
2. Hacer **Submit** hasta obtener **Accepted** (éxito: todos los casos de prueba pasan).
3. Subir al **repositorio individual** el código y las **imágenes** que demuestren ese éxito.

Sin captura de **Accepted**, el ejercicio no se considera entregado.

**No cuenta** como solución del curso pegar los dos arreglos y llamar al sort de la librería, ni `nums.sort()` en Sort Colors. LeetCode a veces lo acepta; en el README de la entrega tiene que verse el algoritmo que se pidió.

---

## Entrega (repositorio individual)

Monte **todo** en su repositorio individual, en una carpeta clara, por ejemplo:

```text
tarea2/
├── README.md                 ← enlace a cada problema, algoritmo y complejidad
├── merge-sorted-array/       ← código del ejercicio 1
├── sort-colors/              ← código del ejercicio 2
└── evidencias/
    ├── merge-sorted-array-accepted.png
    └── sort-colors-accepted.png
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
- cuál es el **algoritmo** (no el nombre comercial: fusión desde el final, counting de dos pasadas, tres punteros, etc.) y **por qué** esa familia y no un sort comparativo;
- complejidad de **tiempo** y de **espacio** (`O(…)`), con `n`, `m` o `k` nombrados;
- enlace relativo a la(s) imagen(es) de **Accepted**.

Ejemplo de cómo incrustar la evidencia en Markdown:

```markdown
## 88. Merge Sorted Array

Algoritmo: …

![Accepted — Merge Sorted Array](evidencias/merge-sorted-array-accepted.png)
```

---

## Ejercicio 1 · [88. Merge Sorted Array](https://leetcode.com/problems/merge-sorted-array/)

**Dificultad:** Easy  
**Etiquetas:** Array, Two Pointers, Sorting

Hay dos arreglos **ya ordenados** en no decreciente: `nums1` de longitud `m + n` (los primeros `m` valores valen; el resto son `0` y se ignoran) y `nums2` de longitud `n`. Hay que **fusionarlos** y dejar el resultado **dentro de `nums1`**, también ordenado.

Esto es exactamente la fusión del laboratorio *Despacho a tiempo*: dos corridas ordenadas, dos índices, el siguiente es el menor (aquí, el mayor si se escribe desde el final para no pisar `nums1`). No es un Merge Sort completo: la división ya está hecha; solo falta el `merge`.

**Pista de diseño (no es la solución completa):**

- si fusiona desde el índice `0`, pisa valores de `nums1` que todavía no ha consumido;
- conviene escribir desde el final (`m + n - 1`) hacia atrás, comparando las colas de ambas corridas;
- cuando se acaba una corrida, se copia lo que queda de la otra.

Indique en el README la complejidad. El follow-up de LeetCode pide **`O(m + n)`** en tiempo y **`O(1)`** extra (in-place). Concatenar y ordenar sería `O((m+n) log(m+n))` y **no** es lo que se evalúa.

---

## Ejercicio 2 · [75. Sort Colors](https://leetcode.com/problems/sort-colors/)

**Dificultad:** Medium  
**Etiquetas:** Array, Two Pointers, Sorting

`nums[i]` solo vale **0**, **1** o **2** (rojo, blanco, azul). Hay que ordenar **in-place** para que queden los 0, luego los 1, luego los 2.

El enunciado pide **no** usar la función de sort de la librería. El follow-up pide un algoritmo de **una pasada** y memoria extra constante.

En el catálogo del curso esto es el caso en el que Counting Sort gana a Merge/Heap: el universo tiene `k = 3` claves. `O(n + k)` es lineal. Un sort comparativo seguiría siendo `Ω(n log n)` y, además, aquí está prohibido.

**Pista de diseño (no es la solución completa):**

- **Dos pasadas (counting):** contar cuántos 0, 1 y 2 hay y reescribir el arreglo. Tiempo `O(n)`, espacio `O(1)` si los tres contadores van en variables. Cumple el orden; el follow-up de una pasada pide un poco más.
- **Una pasada (bandera holandesa):** tres índices (`low`, `mid`, `high`). Los 0 se mandan a la izquierda, los 2 a la derecha, los 1 se dejan en el medio. Un solo recorrido.

Indique en el README cuál de las dos usó y la complejidad. Si usa counting, escriba `k = 3` y explique **por qué no viola** la cota `Ω(n log n)` del modelo de comparaciones.

---

## Qué se evalúa

| Criterio | Qué se espera |
| --- | --- |
| Completitud | Los **dos** problemas en el repositorio individual |
| Éxito en LeetCode | Imagen de **Accepted / Success** por cada uno, legible y asociada al problema |
| Enfoque de ordenamiento | Algoritmo escrito (fusión / counting / tres punteros); no basta “el código pasó” ni un `.sort()` de librería |
| Complejidad | `O` de tiempo y espacio, coherente con el código (`m+n`, `n+k`, etc.) |
| Organización | Carpetas o nombres claros; el README enlaza código e imágenes |

No se pide copiar una solución de Internet sin entenderla. Si el código es correcto pero no puede explicar en clase por qué la fusión es lineal o por qué counting es legal con `k = 3`, la tarea queda incompleta.

---

## Recordatorios

- Trabaje en **su** repositorio. Un push al repo del curso **no** cuenta como entrega.
- Haga `git add` de las **imágenes** (`.png` / `.jpg`). Un README que apunta a archivos que nunca se subieron no sirve.
- El veredicto que cuenta es **Accepted** en Submit, no *Run Code* sobre un ejemplo.
- Plazos y forma de avisar el enlace del repo: según lo indicado en clase / aula virtual.
