# Taller · Cinco familias en LeetCode

**Curso:** Análisis de algoritmos · ITM · 2026-2  
**Tipo:** clase taller (evaluación)  
**Peso:** **10 %** de la nota de la materia (2 % por ejercicio; los cinco pesan igual)  
**Entrega:** repositorio **individual** de cada estudiante (no el repositorio del curso).

| | Fecha y hora (Colombia) |
| --- | --- |
| **Apertura** | sabado 3 de octubre de 2026, **10:00 a. m.** |
| **Cierre** | domingo 4 de octubre de 2026, **12:00 de la medianoche** (23:59) |

Un *push* posterior al cierre no cuenta. Sin captura de **Accepted**, el ejercicio no se considera entregado.

En el semestre se vieron **ordenar**, **grafos**, **programación dinámica** y **greedy**. Este taller pide un problema **Medium** de cada una, más **backtracking** (enumerar con retractarse: lo que greedy no hace). Material de apoyo: [`README-ORDENAMIENTO.md`](../README-ORDENAMIENTO.md), [`README-GRAFOS.md`](../README-GRAFOS.md), [`README-DP.md`](../README-DP.md), [`algoritmos-greedy/README.md`](../algoritmos-greedy/README.md).

Los cinco son distintos de las tareas 1 a 4. No reenvíe Lemonade Change, Assign Cookies, Merge Sorted Array, Sort Colors, Number of Provinces, Course Schedule, Coin Change ni Partition Equal Subset Sum.

---

## Qué hay que hacer

Resolver **los cinco** ejercicios de abajo, cada uno con la familia que se pide. Para cada uno:

1. Implementar la solución en [LeetCode](https://leetcode.com/) (el lenguaje es libre: Python, Java, C++, JavaScript, TypeScript, etc.).
2. Hacer **Submit** hasta obtener **Accepted** (éxito: todos los casos de prueba pasan).
3. Subir al **repositorio individual** el código y las **imágenes** que demuestren ese éxito.

**No cuenta** como solución del curso un `.sort()` de librería donde se pidió el algoritmo, un greedy donde hace falta la tabla, una recursión **sin** retractarse donde se pidió backtracking, ni pegar código de Internet que no pueda explicar. En el README de la entrega tiene que verse la familia, la idea y la cota.

---

## Entrega (repositorio individual)

Monte **todo** en su repositorio individual, en una carpeta clara, por ejemplo:

```text
taller/
├── README.md                         ← enlace, familia, idea y complejidad de cada uno
├── merge-intervals/                  ← ejercicio 1 · ordenamiento
├── number-of-islands/                ← ejercicio 2 · grafos
├── longest-common-subsequence/       ← ejercicio 3 · programación dinámica
├── non-overlapping-intervals/        ← ejercicio 4 · greedy
├── combination-sum/                  ← ejercicio 5 · backtracking
└── evidencias/
    ├── merge-intervals-accepted.png
    ├── number-of-islands-accepted.png
    ├── longest-common-subsequence-accepted.png
    ├── non-overlapping-intervals-accepted.png
    └── combination-sum-accepted.png
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

En el `README.md` de la carpeta del taller, para **cada** ejercicio escriba en pocas líneas:

- enlace al problema;
- la **familia** (ordenar / grafos / DP / greedy / backtracking) y la **idea** en una o dos frases (clave, modelo, estado, criterio local o qué se elige y se deshace);
- complejidad de **tiempo** y de **espacio** (`O(…)`), con `n`, `m`, etc. nombrados;
- enlace relativo a la(s) imagen(es) de **Accepted**.

Ejemplo de cómo incrustar la evidencia en Markdown:

```markdown
## 56. Merge Intervals

Familia: ordenamiento  
Idea: …  
Complejidad: …

![Accepted — Merge Intervals](evidencias/merge-intervals-accepted.png)
```

---

## Ejercicio 1 · [56. Merge Intervals](https://leetcode.com/problems/merge-intervals/)

**Dificultad:** Medium  
**Familia:** ordenamiento  
**Etiquetas:** Array, Sorting

Hay un arreglo de intervalos `intervals[i] = [startᵢ, endᵢ]`. Hay que devolver la lista de intervalos **fusionados**: si dos se solapan o se tocan, se convierten en uno solo que cubre la unión.

En el laboratorio de despacho la fusión juntaba **dos corridas ya ordenadas**. Aquí la entrada **no** viene ordenada: primero se elige la **clave** (el `start`) y se ordena; después una pasada fusiona lo que se solapa, como el `merge` pero sobre una sola corrida.

**Pista de diseño (no es la solución completa):**

- ordene por extremo izquierdo;
- recorra de izquierda a derecha y mantenga el intervalo «abierto» actual;
- si el siguiente empieza **antes o justo cuando** termina el actual, ensanche el `end`; si no, cierre el actual y abra otro;
- concatenar y llamar al sort de la librería **sobre los extremos sueltos** no es el algoritmo: hay que **ordenar intervalos** y **fusionar**.

Indique en el README la complejidad. El término dominante es el sort: **`O(n log n)`** en tiempo y `O(n)` en espacio para la salida (más lo que pida el sort). Un `O(n²)` que compare todos contra todos **no** es lo que se evalúa.

---

## Ejercicio 2 · [200. Number of Islands](https://leetcode.com/problems/number-of-islands/)

**Dificultad:** Medium  
**Familia:** grafos  
**Etiquetas:** Array, Depth-First Search, Breadth-First Search, Union Find, Matrix

Hay una grilla `m × n` de `'1'` (tierra) y `'0'` (agua). Un **isla** es un grupo de tierras conectadas por **arriba, abajo, izquierda o derecha** (no en diagonal). Hay que devolver **cuántas islas** hay.

En la tarea 3 las provincias eran componentes en una **matriz de adyacencia**. Aquí el grafo está implícito en la grilla: cada celda `'1'` es un vértice; hay arista a la vecina ortogonal que también es `'1'`. Contar islas es contar **componentes conexas**.

**Pista de diseño (no es la solución completa):**

- recorra las celdas; cada vez que aparezca un `'1'` **no visitado**, sume 1 y lance DFS o BFS para marcar (o hundir) toda la isla;
- Union-Find también vale: `union` entre vecinos tierra y al final cuente raíces de celdas `'1'`;
- no trate la diagonal como vecina;
- las celdas `'0'` no se recorren como vértices.

Indique en el README el **modelo** (vértice, arista, no dirigido) y la complejidad. Con `m` filas y `n` columnas, DFS/BFS son **`Θ(m n)`** en tiempo (cada celda se visita una vez) y `O(m n)` en espacio en el peor caso (pila o cola). Un algoritmo que no recorra la componente **no** es lo que se evalúa.

---

## Ejercicio 3 · [1143. Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/)

**Dificultad:** Medium  
**Familia:** programación dinámica  
**Etiquetas:** String, Dynamic Programming

Hay dos cadenas `text1` y `text2`. Hay que devolver la **longitud** de la subsecuencia común más larga. Subsecuencia: se pueden borrar letras, **no** reordenar las que quedan. `ace` es subsecuencia de `abcde`; `aec` no lo es.

En la guía esto es el **LCS** de Needleman–Wunsch / Wagner–Fischer: tabla de prefijos. No es la subcadena (substring) contigua. Greedy de «tomar la primera coincidencia que vea» falla; hay que tabular.

**Pista de diseño (no es la solución completa):**

- estado: `dp[i][j]` = LCS de `text1[0..i)` y `text2[0..j)`;
- base: `dp[0][j] = dp[i][0] = 0` (un prefijo vacío);
- si `text1[i-1] == text2[j-1]`, `dp[i][j] = 1 + dp[i-1][j-1]`;
- si no, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`;
- se pide la **longitud**, no la cadena (reconstruir es opcional y no se evalúa).

Indique en el README estado, recurrencia y base. Con `n = text1.length` y `m = text2.length` la tabla es **`Θ(n m)`** en tiempo y `Θ(n m)` en espacio (o `Θ(min(n, m))` si comprime a dos filas). Una recursión **sin** memo es el árbol exponencial de la guía: **no** es lo que se evalúa.

---

## Ejercicio 4 · [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Dificultad:** Medium  
**Familia:** greedy  
**Etiquetas:** Array, Dynamic Programming, Greedy, Sorting

Hay intervalos `[startᵢ, endᵢ]`. Hay que devolver el **mínimo** número de intervalos que hay que **borrar** para que los que quedan **no se solapen**.

Esto es la **selección de actividades** de la guía, contada al revés: maximizar cuántos caben sin solape es lo mismo que minimizar cuántos se tiran. El criterio greedy de clase sigue valiendo: entre los que aún caben, quedarse con el que **termina antes**.

**Pista de diseño (no es la solución completa):**

- candidatos: los intervalos, ordenados;
- criterio: después de ordenar por `end`, ir eligiendo el siguiente que no pisa al último aceptado;
- lo que no se eligió es lo que se «borra»; la respuesta es `n −` (cuántos se quedaron);
- dos intervalos se solapan si uno empieza **antes** de que el otro termine; si uno termina exactamente cuando el otro empieza, **no** se solapan (el enunciado de LeetCode los admite juntos);
- un DP `O(n²)` sobre intervalos ordenados puede ser correcto; **no** es lo que se evalúa. Aquí el greedy es óptimo y debe quedar en **`O(n log n)`**.

Indique en el README el criterio greedy y la complejidad. El sort domina: **`O(n log n)`** en tiempo y `O(1)` extra si ordena in-place (o `O(n)` si el lenguaje copia). No basta escribir «usé greedy» sin decir **qué** elige en cada paso.

---

## Ejercicio 5 · [39. Combination Sum](https://leetcode.com/problems/combination-sum/)

**Dificultad:** Medium  
**Familia:** backtracking  
**Etiquetas:** Array, Backtracking

Hay un arreglo de enteros distintos `candidates` y un `target`. Hay que devolver **todas** las combinaciones únicas que suman `target`. Un número puede usarse **las veces que quiera**. El orden dentro de una combinación no importa: `[2,2,3]` y `[2,3,2]` son la misma.

En Coin Change (tarea 4) DP respondía **cuántas monedas mínimas**. Aquí hay que **enumerar** las combinaciones. Greedy no se retracta; backtracking **sí**: elige un candidato, baja el resto, y si se pasa o se acaba, **deshace** y prueba el siguiente.

**Pista de diseño (no es la solución completa):**

- estado de la búsqueda: índice desde el que puede tomar, suma (o resto) y la combinación actual;
- elija `candidates[i]` y **reutilícelo** (el siguiente llamado puede seguir en `i`); para no repetir permutaciones, **no** vuelva a índices menores;
- si la suma iguala `target`, copie la combinación a la respuesta; si la supera, corte esa rama (*poda*);
- al regresar, quite el último elegido (eso es el *backtrack*);
- una tabla DP que solo cuente o que arme el mínimo **no** sustituye la lista de combinaciones.

Indique en el README qué se elige, qué se deshace y la complejidad. Con `n = candidates.length` y `t = target`, el peor caso es exponencial en la profundidad (combinaciones de un `1` repetido, etc.): nombre esa familia (`O(n^{t/min})` o el recuento que justifique) y el espacio de la pila más la salida. Un `O(n · target)` de Coin Change **no** es el algoritmo de este ejercicio.

---

## Qué se evalúa

| Criterio | Qué se espera |
| --- | --- |
| Completitud | Los **cinco** problemas en el repositorio individual, dentro de la ventana |
| Éxito en LeetCode | Imagen de **Accepted / Success** por cada uno, legible y asociada al problema |
| Familia correcta | Ordenar + fusionar; componente en grilla; estado y recurrencia de LCS; criterio greedy de actividades; elegir y deshacer |
| Complejidad | `O` de tiempo y espacio, coherente con el código |
| Organización | Carpetas o nombres claros; el README enlaza código e imágenes |

| Ejercicio | Familia | Problema | Peso |
| --- | --- | --- | --- |
| 1 | Ordenamiento | 56. Merge Intervals | 2 % |
| 2 | Grafos | 200. Number of Islands | 2 % |
| 3 | Programación dinámica | 1143. Longest Common Subsequence | 2 % |
| 4 | Greedy | 435. Non-overlapping Intervals | 2 % |
| 5 | Backtracking | 39. Combination Sum | 2 % |

No se pide copiar una solución de Internet sin entenderla. Si el código es correcto pero no puede explicar en clase la clave, la componente, el `dp[i][j]`, el criterio greedy o qué se retracta, el ejercicio queda incompleto.

---

## Recordatorios

- Trabaje en **su** repositorio. Un push al repo del curso **no** cuenta como entrega.
- Haga `git add` de las **imágenes** (`.png` / `.jpg`). Un README que apunta a archivos que nunca se subieron no sirve.
- El veredicto que cuenta es **Accepted** en Submit, no *Run Code* sobre un ejemplo.
- La ventana es el **4 de octubre de 2026, 10:00 a. m. – 12:00 de la medianoche**. Después de las 23:59 no se recibe.
- El taller vale el **10 %** de la materia. Cada *Accepted* con evidencia y README vale **2 %**.
