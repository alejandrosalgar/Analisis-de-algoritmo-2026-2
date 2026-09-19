# Programación dinámica · 2026-2

Material del curso (ITM). Greedy ya resolvió problemas con **subestructura óptima** cuando además había una **elección local segura** (vuelto COP, intervalos por hora de fin, mochila fraccionaria). Cuando esa elección no existe —mochila 0/1, monedas `{1, 3, 4}`, actividades con pesos— enumerar `2^n` combinaciones no escala. **Programación dinámica (DP)** es la familia que sigue siendo exacta: no se compromete a la primera; **recuerda** cada subproblema útil y lo combina.

Curso: **Análisis de algoritmos · ITM · 2026-2**. Tarea: [`tareas/tarea4.md`](tareas/tarea4.md) (LeetCode: vuelto y partición 0/1). Greedy y el contraejemplo de la caja: [`algoritmos-greedy/README.md`](algoritmos-greedy/README.md). Grafos (Floyd–Warshall es DP): [`README-GRAFOS.md`](README-GRAFOS.md).

---

## 1. Historia: Bellman y un nombre que no habla de tablas

En los años 50, Richard Bellman trabajaba en la RAND Corporation sobre **procesos de decisión secuenciales**: hoy eliges, mañana eliges de nuevo, y el costo total depende de toda la cadena. El aparato matemático era recíproco (una ecuación que define el óptimo de hoy en función del óptimo de mañana). El libro es *Dynamic Programming* (1957).

El nombre es deliberadamente opaco. Bellman contó después que, en el Departamento de Defensa de entonces, la palabra *research* ya era sospechosa y *mathematical* peor. *Programming* se leía como **planificación** (la de un programa de producción o de un misil), no como «escribir código». *Dynamic* sonaba moderno. El disfraz funcionó: el área nació con presupuesto, no con un título honesto del estilo «recurrencias con subproblemas repetidos».

Lo que Bellman aisló no era un algoritmo concreto. Era un **principio**:

> El óptimo de un problema se construye con óptimos de subproblemas, y esos subproblemas **se repiten**. Si cada uno se calcula **una vez** y se guarda, el trabajo deja de ser exponencial.

La observación computacional más chica es anterior y se enseña primero: la sucesión de Fibonacci. `F(n) = F(n − 1) + F(n − 2)`, con `F(0) = 0`, `F(1) = 1`. La fórmula es de 1202 (Liber Abaci) y de siglos de matemáticos indios antes. El árbol de llamadas, en cambio, es un desastre: `F(5)` pide `F(3)` **dos veces**, `F(4)` pide otra vez `F(3)` y `F(2)`, y así. Sin memoria, el tiempo es `Θ(φ^n)` (`φ ≈ 1.618`). Con un arreglo de `n` celdas, `Θ(n)`.

Eso es el gesto que se repite en el resto de la unidad: **estado → recurrencia → tabla (o memo) → respuesta**. No es «usar un arreglo». Es **cambiar la familia de complejidad** porque se deja de recalcular.

Lo que vino después, en una línea:

| Año (aprox.) | Quién | Qué aportó |
| --- | --- | --- |
| 1953–57 | Bellman | El principio y el nombre; control y decisiones en el tiempo |
| 1962 | Held–Karp | TSP exacto con subconjuntos (`O(n² 2^n)`): exponencial, pero mucho mejor que `n!` |
| 1967 | Viterbi | Camino más probable en una cadena oculta (voz, GSM, CNN de códigos) |
| 1970 | Needleman–Wunsch | Alineamiento global de proteínas: LCS con pesos |
| 1970 | Knuth | Árboles binarios de búsqueda óptimos |
| 1974 | Wagner–Fischer | Distancia de edición (Levenshtein) en `Θ(nm)` |
| 1979 | Selinger (System R) | El optimizador de joins de las bases de datos: DP sobre el orden de las tablas |

El hilo no es «inventar fórmulas». Es: **si el estado cabe en memoria y la recurrencia es local, el óptimo se tabula**.

---

## 2. Qué es programación dinámica

Un algoritmo de **programación dinámica** resuelve un problema **guardando la respuesta de cada subproblema** para no calcularla otra vez. Sirve cuando se cumplen **las dos** propiedades:

| Propiedad | En castellano | Si falta |
| --- | --- | --- |
| **Subestructura óptima** | Un óptimo se arma con óptimos de trozos más chicos | Ni greedy ni DP garantizan el global; a veces hay que enumerar o aproximar |
| **Subproblemas superpuestos** | Los mismos trozos aparecen una y otra vez | Divide y vencerás basta (mergesort: las mitades **no** se solapan) |

Greedy también pide subestructura óptima. La diferencia es la **elección greedy**: si existe una decisión local que siempre puede estar en un óptimo, no hace falta probar las demás. Si no existe, DP **prueba las decisiones que el estado admite**, cada una reducida a un subproblema ya resuelto, y se queda con la mejor.

### Tres familias, misma pregunta

Misma instancia, tres políticas:

| Familia | Qué hace | Cota típica | Cuándo |
| --- | --- | --- | --- |
| **Fuerza bruta** | Recorre soluciones (subconjuntos, caminos, alineamientos) | `2^n`, `n!`, `k^{monto}` | `n` minúsculo, o para contrastar |
| **Greedy** | Una decisión local, no se retracta | Casi siempre `O(n log n)` o `O(n)` | Hay demostración de elección greedy |
| **DP** | Todas las decisiones **del estado**, cada subproblema **una vez** | Polinomial en el **número de estados** (a veces pseudo-polinomial) | Subestructura + solapes, sin elección greedy segura |

Divide y vencerás (mergesort, Karatsuba) parte en subproblemas **independientes**. DP parte en subproblemas que **comparten nietos**. Por eso mergesort no memoíza: no hay nada que reutilizar. Por eso Fibonacci recursivo sin memo es un árbol, no un camino.

### El estado es el oficio

Un **estado** es el resumen mínimo de «dónde va la decisión». Ejemplos:

- `dp[x]` — óptimo para el **monto** `x` (cambio de monedas).
- `dp[i][w]` — óptimo con los **primeros `i` objetos** y capacidad `w` (mochila 0/1).
- `dp[i][j]` — óptimo para el segmento `i..j` o para los prefijos `X[1..i]`, `Y[1..j]` (LCS, edición, matrices).
- `dp[v]` — óptimo del **subárbol** con raíz `v` (DP en árboles).
- `dp[S][v]` — óptimo para el **subconjunto** `S` de ciudades, terminando en `v` (Held–Karp).

La complejidad de tiempo es, casi siempre:

```text
(# de estados distintos) × (trabajo para llenar un estado)
```

El trabajo por estado suele ser `O(1)` o `O(k)` (probar `k` transiciones). Si hay `nW` estados y cada uno mira «¿meto este objeto o no?», el tiempo es `Θ(nW)`. **Diseñar mal el estado** (olvidar un parámetro, o poner uno de más) o es incorrecto o no corre.

### Memoización contra tabulación

Dos implementaciones del **mismo** recuento de estados:

**Arriba-abajo (memoización).** Se escribe la recurrencia recursiva. Antes de calcular un estado, se pregunta al diccionario. Si ya está, se devuelve. Si no, se calcula, se guarda y se devuelve. Solo se visitan estados **alcanzables** desde la pregunta original.

**Abajo-arriba (tabulación).** Se declara la tabla, se escriben los **casos base**, y se llena en un orden tal que cuando se necesita `dp[sub]`, `sub` **ya está**. Un doble `for` es el dibujo de pizarrón.

En este curso las dos son DP. La tabulación obliga a **nombrar el orden**. La memoización obliga a **no olvidar el caso base** y a no ciclar. El análisis es el mismo: estados × transiciones. La memoria extra es, como mínimo, el tamaño de la tabla (a veces se comprime a la fila anterior).

### Pseudo-polinomial, una trampa de vocabulario

Mochila 0/1 es `O(nW)`. Eso **no** es polinomial en el tamaño de la entrada si `W` se escribe en binario: el número `W` cabe en `log W` bits, y el algoritmo corre en tiempo proporcional a `W`, no a `log W`. Se llama **pseudo-polinomial**. Con `n = 100` y `W = 10^9` no cabe en clase. Con `n = 100` y `W = 10^4`, sí.

La misma distinción aparece en cambio de monedas: `O(k · monto)`. El monto es el valor, no la cantidad de bits.

### Lo que DP no es

- No es «cualquier recursión». Sin solapes, memoizar no ahorra.
- No es greedy con un arreglo al lado.
- No es magia de `O(n)`: Held–Karp sigue siendo exponencial; solo deja de ser factorial.
- No inventa información: si el estado no distingue dos situaciones que **exigen** decisiones distintas, la tabla miente.

---

## 3. Cómo se usa: la receta de cinco líneas

Antes de programar, se escribe esto. Si no se puede, el modelo está mal.

1. **Estado.** `dp[…]` = *la respuesta del subproblema …* (una frase).
2. **Recurrencia.** Cómo se obtiene un estado a partir de estados **estrictamente más fáciles** (más chicos, menos ítems, menos capacidad, prefijo más corto).
3. **Base.** Los estados que no se recortan: vacío, monto 0, `i = 0`, casilla `(0,0)`.
4. **Orden o memo.** Tabulación: el `for` recorre de fácil a difícil. Memo: la recursión + caché.
5. **Respuesta y reconstrucción.** La celda que corresponde a la instancia completa. Si hay que **listar** objetos, monedas o el alineamiento, se guarda el argumento del `min`/`max` (el «cómo llegué aquí») y se camina hacia atrás.

Plantilla de tabulación, en espíritu:

```text
llenar casos base
para cada estado s en orden topológico de la recurrencia:
    dp[s] ← combinación (min, max, suma, …) de las transiciones de s
devolver dp[instancia]
```

«Orden topológico de la recurrencia» quiere decir: si `s` depende de `s'`, `s'` se llena antes. En una tabla 1D creciente, eso es `x = 1 .. n`. En mochila, `i` creciente y, si se usa **un solo** arreglo, `w` **decreciente** (para no reutilizar el mismo objeto).

### Cómo se reconoce en un enunciado

Suele haber DP si se pide un **óptimo** o un **número de formas** y:

- las decisiones son «sí/no este elemento», «cuál es el último corte», «con qué letra alineo»;
- el resto, fijada esa decisión, es **el mismo problema** más chico;
- brute es `2^n` o peor, y `n` (o `n` y `W`) aún cabe en una tabla.

Preguntas que cierran el diseño:

- ¿Qué necesito recordar para no equivocar la próxima decisión? Eso es el estado.
- ¿Cuántos valores distintos toma esa memoria? Eso es el tamaño.
- ¿Desde un estado, cuántas opciones hay? Eso es el trabajo por celda.

---

## 4. Para qué sirve en la vida real

El mismo truco —tabla de subproblemas— cambia de oficio según qué pongas en el estado.

### Texto, diff y correctores

`git diff`, el subrayado rojo del procesador, el «¿quiso decir…?»: distancia de **Levenshtein** (cuántas inserciones, borrados y sustituciones hay entre dos cadenas). Wagner–Fischer llena una tabla `n × m`. El LCS (subsecuencia común más larga) es el primo: lo que **se conserva** cuando se alinea. Un corrector no «adivina»; mide edición contra un diccionario o contra un modelo.

### ADN, proteínas y medicina

Una proteína es una cadena sobre un alfabeto de aminoácidos. Alinear dos cadenas (Needleman–Wunsch, Smith–Waterman) es DP de edición con pesos biológicos: premiar coincidencias, penalizar huecos. El diagnóstico de parentesco, la búsqueda de un gen en un genoma y buena parte de BLAST en espíritu descienden de esa tabla. El estado es un par de prefijos; la recurrencia, tres flechas (diagonal, arriba, izquierda).

### Logística, bodegas y la maleta

Mochila: capacidad `W`, objetos con peso y valor. El avión tiene kilos; el contenedor, metros cúbicos; el presupuesto de un proyecto, pesos. Si el objeto entra entero o no entra (**0/1**), greedy por densidad falla y DP `O(nW)` es el exacto razonable. Si se puede partir, greedy basta (guía greedy, §3.2). El cambio de monedas es la mochila **no acotada** del cajero automático y de la máquina expendedora: el estado es el monto que falta.

### Agendas con valor, no solo con «cabe»

Un aula, un quirófano o un único profesor: intervalos **sin pesos** se resuelven greedy por hora de fin. Si cada clase tiene un **peso** (estudiantes, plata, prioridad), esa regla deja de ser óptima. El DP de **interval scheduling con pesos** ordena por fin, precalcula `p(i)` = «la última compatible con `i`», y hace `dp[i] = max(w_i + dp[p(i)], dp[i − 1])` en `O(n log n)`. Google Calendar no siempre maximiza pesos; el modelo sí está en planificadores de jobs y en reserva de quirófanos.

### Voz, códigos y GPS probabilístico

Viterbi: una secuencia de observaciones (fonemas ruidosos, bits recibidos) y una cadena de Markov oculta. El estado es `(tiempo, estado oculto)`; la recurrencia, el predecesor más verosímil. GSM, GPS de alta sensibilidad y reconocimiento de voz clásico corren esa tabla. No es magia de redes neuronales: es camino más probable, o sea DP.

### Bases de datos y compiladores

El optimizador de System R (Selinger) elige el **orden de los joins**: con `n` tablas, `n!` órdenes; con DP sobre subconjuntos, `O(n² 2^n)` planes. Sigue ahí, con heurísticas greedy cuando `n` crece. Un compilador que registra *instruction scheduling* o que parte una expresión en un orden de operaciones (cadena de matrices) usa la misma idea: `dp[i][j]` = óptimo de fusionar el segmento `i..j`.

### Redes (el puente con grafos)

**Bellman–Ford** relaja aristas; la recaída `k` es «caminos con a lo sumo `k` aristas»: DP. **Floyd–Warshall** es el triple bucle `k, i, j`: `dp[k][i][j]` = camino `i ⇝ j` que solo usa `{1..k}` como intermedios. En la [guía de grafos](README-GRAFOS.md) se cotizan como algoritmos de caminos; aquí se ve **por qué** la cota es `Θ(n³)`: hay `n³` estados y `O(1)` trabajo en cada uno.

### Tipografía y videojuegos

Knuth–Plass (TeX) parte el párrafo en líneas minimizando «fealdad»: DP sobre el índice de la palabra donde empieza la línea. Un mapa de celdas (roguelike, damas) con costos: caminos en una grilla `dp[i][j] = celda + min(arriba, izquierda)`. El personaje no ejecuta Dijkstra si la grilla es DAG de solo bajar y a la derecha: la tabla basta.

Regla de lectura: si la pregunta es «¿cuál es el mejor / el número de formas / el alineamiento?», el horizonte se recorta en **prefijos, capacidades o subconjuntos**, y el bruto explota, el modelo es DP y el algoritmo ya tiene nombre.

---

## 5. Los DP más usados

Los que hay que poder explicar en pizarrón, con estado, recurrencia y cota. Las cotas asumen tablas densas (todo estado se llena).

| Problema | Estado (idea) | Recurrencia (idea) | Cota típica |
| --- | --- | --- | --- |
| **Fibonacci / subidas de escalera** | `dp[i]` = formas (o valor) para `i` | `dp[i] = dp[i−1] + dp[i−2]` | `Θ(n)` tiempo y, con dos variables, `O(1)` extra |
| **Cambio: mínimo de monedas** | `dp[x]` = menos piezas para monto `x` | `dp[x] = 1 + min_c dp[x−c]` | `Θ(k · monto)` |
| **Cambio: número de combinaciones** | `dp[x]` = formas de armar `x` | por cada moneda, `dp[x] += dp[x−c]` | `Θ(k · monto)` |
| **Mochila 0/1** | `dp[i][w]` = mejor valor con ítems `1..i` y peso `w` | no tomar / tomar si `w_i ≤ w` | `Θ(nW)` |
| **Mochila no acotada** | `dp[w]` (el objeto se reusa) | `dp[w] = max(dp[w], v_i + dp[w−w_i])` | `Θ(nW)` |
| **LIS** (subsecuencia creciente larga) | `dp[i]` = LIS que **termina** en `i` | `dp[i] = 1 + max { dp[j] : j < i, a_j < a_i }` | `Θ(n²)` (o `O(n log n)` con cola de colas) |
| **LCS** | `dp[i][j]` = LCS de prefijos `i`, `j` | igual → diagonal+1; si no, max(arriba, izq.) | `Θ(nm)` |
| **Edición (Levenshtein)** | `dp[i][j]` = editar `X[1..i]` en `Y[1..j]` | min(borrar, insertar, sustituir) | `Θ(nm)` |
| **Cortes / cadena de matrices** | `dp[i][j]` = óptimo del segmento `i..j` | `min_k` de partir en `k` | `Θ(n³)` |
| **Intervalos con peso** | `dp[i]` = óptimo con las `i` primeras (por fin) | tomar `i` + `dp[p(i)]`, o no tomarla | `O(n log n)` |
| **Caminos en grilla** | `dp[i][j]` | desde arriba y/o izquierda | `Θ(rc)` |
| **Floyd–Warshall** | `dp[k][i][j]` | ¿conviene el intermedio `k`? | `Θ(n³)` |
| **Bellman–Ford** | `dist[v]` tras `k` relajaciones | relajar todas las aristas | `O(nm)` |
| **DP en árboles** | `dp[v]` del subárbol | combinar hijos | `Θ(n)` si el trabajo por arista es `O(1)` |
| **Held–Karp (TSP)** | `dp[S][v]` | último salto `u → v`, `u ∈ S` | `O(n² 2^n)` |
| **Perfil / bitmask** | `dp[máscara]` | quitar un bit (o un subconjunto) | `O(s 2^n)` según transiciones |

Lectura rápida:

- **0/1 contra no acotada.** En 0/1 cada objeto existe una vez: la transición mira `dp[i−1][…]`. En no acotada (monedas, cortes de una barra con reuso) el mismo tipo se usa muchas veces: se actualiza `dp[w]` hacia adelante.
- **LCS contra edición.** LCS maximiza coincidencias. Edición minimiza operaciones. Con costos 0/1, `edición = n + m − 2 · LCS` **no** siempre (la sustitución complica); son primos, no el mismo número.
- **LIS `n²` contra `n log n`.** El `n²` es el que se pide en pizarrón. El `n log n` mantiene, para cada longitud, el menor final posible; es correcto pero más fácil de implementar mal.
- **TSP.** Held–Karp no vuelve TSP polinomial. Vuelve **viable** `n ≈ 20` en lugar de `n ≈ 12`. Eso ya es DP: el estado es el subconjunto.
- **Floyd no sustituye a Dijkstra** cuando hay un solo origen y `n` grande: `n³` con `n = 10⁴` no corre en clase. El estado sobra.

### Plantilla 1D (monto, índice, capacidad comprimida)

```text
dp[0] ← caso base          // 0 monedas, 0 valor, 1 forma…
para x = 1 .. N:
    dp[x] ← ∞ o 0 según el problema
    para cada transición t que llega a x:
        actualizar dp[x] con dp[x − t]
devolver dp[N]
```

### Plantilla 2D de prefijos (LCS / edición / grilla)

```text
para i = 0 .. n: dp[i][0] ← base
para j = 0 .. m: dp[0][j] ← base
para i = 1 .. n:
    para j = 1 .. m:
        dp[i][j] ← combinación de
            dp[i−1][j], dp[i][j−1], dp[i−1][j−1]
devolver dp[n][m]
```

---

## 6. Ejercicios resueltos (pizarrón)

### Ejercicio 1 · El árbol de Fibonacci y la tabla que lo aplasta

**Enunciado.** Calcular `F(6)`. Recurrencia `F(n) = F(n − 1) + F(n − 2)`, `F(0) = 0`, `F(1) = 1`. Primero sin memoria; después con una tabla.

**Bruto.** Cada llamada se parte en dos. El dibujo de `F(5)` (el de `F(6)` cabe igual, más ancho):

```text
                    F(5)
                   /    \
               F(4)      F(3)
              /   \      /   \
          F(3)   F(2)  F(2)  F(1)
          / \    / \   / \
       F(2) F(1) F(1) F(0) …
```

`F(3)` aparece **varias** veces. `F(2)` todavía más. Número de hojas ~ `F(n)`: tiempo `Θ(φ^n)`. Para `n = 40` ya es del orden de mil millones de llamadas; para `n = 6` aún se puede contar a mano y ver el desperdicio.

**DP (tabulación).**

| `i` | 0 | 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `dp[i]` | 0 | 1 | 1 | 2 | 3 | 5 | 8 |

Cada celda es una suma `O(1)`. Tiempo `Θ(n)`, memoria `Θ(n)` (o dos enteros: `prev` y `cur`).

**La misma recaída, otro enunciado.** Un edificio de `n` peldaños; en cada paso subes 1 o 2. ¿De cuántas formas llegas arriba? `dp[i] = dp[i−1] + dp[i−2]`. Es Fibonacci. El estado no dice «Fibonacci»: dice **«formas de llegar al peldaño `i`»**.

**Qué no hay que hacer.** Escribir la recursión en el examen y cotizarla `O(n)` «porque n decrece». Sin memo, no es `O(n)`.

---

### Ejercicio 2 · El vuelto en el que greedy miente (`{1, 3, 4}`, monto 6)

En la [guía greedy](algoritmos-greedy/README.md) el COP acierta. El laboratorio *Trampa* usa piezas 4, 3, 1 y vuelto 6: greedy entrega 3; el óptimo, 2. Aquí se **calcula** ese óptimo.

**Enunciado.** Denominaciones `C = {1, 3, 4}` (hay infinitas de cada una). Armar el monto **6** con el **mínimo** número de piezas.

**Estado.** `dp[x]` = mínimo de monedas para armar exactamente `x`. `dp[x] = ∞` si es imposible.

**Base.** `dp[0] = 0` (cero piezas para cero pesos).

**Recurrencia.**

```text
dp[x] = min { 1 + dp[x − c]  :  c ∈ C, c ≤ x }
```

**Tabla.** Se llena de `x = 1` a `6`. En cada `x` se prueban las monedas que caben.

| `x` | Transiciones | `dp[x]` | Una elección que alcanza el min |
| --- | --- | --- | --- |
| 0 | — | 0 | — |
| 1 | `1 + dp[0] = 1` | **1** | una de 1 |
| 2 | `1 + dp[1] = 2` | **2** | 1+1 |
| 3 | `1+dp[2]=3` o `1+dp[0]=1` (moneda 3) | **1** | una de 3 |
| 4 | `1+dp[3]=2`, `1+dp[1]=2`, `1+dp[0]=1` (moneda 4) | **1** | una de 4 |
| 5 | `1+dp[4]=2`, `1+dp[2]=3`, `1+dp[1]=2` | **2** | 4+1 |
| 6 | `1+dp[5]=3`, `1+dp[3]=2`, `1+dp[2]=3` | **2** | **3+3** |

**Respuesta.** `dp[6] = 2` (dos monedas de 3). Greedy (siempre la más grande que cabe) habría tomado 4 y después 1+1: **3** piezas. El greedy sigue siendo `O(k)` y correcto en COP; **en este sistema no hay elección greedy segura**.

**Reconstrucción.** Desde `x = 6`, una transición óptima es la moneda 3 (`dp[3] + 1 = 2`). Desde 3, la moneda 3 (`dp[0] + 1 = 1`). Piezas: `3, 3`. (También `4+1+1` es factible; no es mínima.)

**Complejidad.** `k = 3` tipos, monto `6`: `Θ(k · monto)` celdas-transiciones. En general, `Θ(k X)` tiempo y `Θ(X)` memoria. Pseudo-polinomial en `X`.

**Variante (número de combinaciones).** Si se pregunta *de cuántas maneras* (el orden no importa), hay que ciclar **primero** las monedas y **después** el monto, para no contar `3+3` y `3+3` como permutaciones distintas ni inflar con el orden. No es el mismo `dp` que el mínimo de piezas.

**Qué no hay que hacer.** Copiar el greedy de la caja y cotizarlo como óptimo. Ni rellenar `dp[x]` con «la moneda más grande ≤ x» y llamarlo DP: eso es greedy tabulando el resto, y aquí falla igual.

---

### Ejercicio 3 · Mochila 0/1 (los frascos no se abren)

**Enunciado.** Maleta de **8 kg**. Cuatro productos enteros (0/1: va o no va).

| Ítem | Producto | Peso `w` | Valor `v` | Densidad `v/w` |
| --- | --- | --- | --- | --- |
| 1 | Café | 4 | 10 | 2.50 |
| 2 | Cacao | 5 | 13 | 2.60 |
| 3 | Azúcar | 3 | 7 | 2.33 |
| 4 | Queso | 2 | 6 | 3.00 |

¿Qué subconjunto cabe y **maximiza** el valor?

**Greedy por densidad** (el de la mochila fraccionaria, pero sin partir): queso (2 kg, 6) + cacao (5 kg, 13) = 7 kg, valor **19**. Sobra 1 kg y ningún frasco pesa 1. ¿Es óptimo? Aún no se sabe.

**Estado.** `dp[i][w]` = máximo valor usando un subconjunto de los **primeros `i`** ítems con peso **exactamente ≤ `w`**.

**Base.** `dp[0][w] = 0` (ningún producto). `dp[i][0] = 0` (capacidad 0).

**Recurrencia.**

```text
dp[i][w] = dp[i−1][w]                              si no tomo el ítem i
si w_i ≤ w:
    dp[i][w] = max( eso,  v_i + dp[i−1][w − w_i] )  si lo tomo
```

**Tabla** (`i` filas de ítems ya considerados, `w` de 0 a 8):

```text
         w=  0   1   2   3   4   5   6   7   8
i=0          0   0   0   0   0   0   0   0   0
i=1 Café     0   0   0   0  10  10  10  10  10
i=2 +Cacao   0   0   0   0  10  13  13  13  13
i=3 +Azúcar  0   0   0   7  10  13  13  17  20
i=4 +Queso   0   0   6   7  10  13  16  19  20
```

Lectura de algunas celdas:

- `dp[3][7] = 17`: café + azúcar (`4+3`, `10+7`). Cacao no cabe con azúcar en 7 (`5+3=8`).
- `dp[3][8] = 20`: cacao + azúcar (`5+3`, `13+7`).
- `dp[4][7] = 19`: cacao + queso (`5+2`, `13+6`), que es el greedy.
- `dp[4][8] = 20`: el queso **no mejora** la celda 20; cacao + azúcar sigue ganando.

**Respuesta.** Valor óptimo **20**. El greedy se dejó **1** en la mesa.

**Reconstrucción.** Empezar en `i = 4`, `w = 8`:

| Ítem | `dp[i][w]` vs `dp[i−1][w]` | ¿Se tomó? | Nuevo `w` |
| --- | --- | --- | --- |
| Queso | 20 = 20 | no | 8 |
| Azúcar | 20 ≠ 13 | **sí** (`v=7`) | 8 − 3 = 5 |
| Cacao | 13 ≠ 10 | **sí** (`v=13`) | 5 − 5 = 0 |
| Café | capacidad 0 | no | 0 |

Subconjunto: **cacao y azúcar**. Peso 8, valor 20. Café y queso, los de mejor y peor densidad del paquete, se quedan fuera: la densidad local no era una elección greedy segura.

**Complejidad.** `n = 4`, `W = 8`: `Θ(nW) = Θ(32)` celdas, `O(1)` por celda. Memoria `Θ(nW)`; con un arreglo `dp[w]` y `w` de `W` **bajando** a 0, `Θ(W)` (cada objeto se usa a lo más una vez).

**Contraste.** Si se pudiera abrir el queso y meter 1 kg, el problema sería fraccionario y el greedy de la guía greedy sería legal. Aquí los frascos están cerrados: **0/1 → DP**.

**Qué no hay que hacer.** Llenar la tabla recorriendo `w` hacia adelante **sobre un único arreglo**: el café se metería dos veces (pasa a ser no acotada). Ni enumerar los `2^4 = 16` subconjuntos y cotizar `O(nW)`: eso es brute, y con `n = 40` no corre (`2^40`), mientras `W = 10^4` sí.

---

### Ejercicio 4 · Distancia de edición: de `ITM` a `ITEM`

**Enunciado.** ¿Cuántas operaciones de **insertar**, **borrar** o **sustituir** una letra hacen falta para transformar `ITM` en `ITEM`? Cada operación cuesta 1.

**Estado.** `dp[i][j]` = distancia entre el prefijo `ITM[1..i]` y el prefijo `ITEM[1..j]` (índices 1-based; la fila/columna 0 es la cadena vacía).

**Base.** `dp[i][0] = i` (borrar `i` letras). `dp[0][j] = j` (insertar `j` letras).

**Recurrencia.**

```text
si X[i] = Y[j]:
    dp[i][j] = dp[i−1][j−1]          // coinciden: no cuesta
si no:
    dp[i][j] = 1 + min(
        dp[i−1][j],     // borrar X[i]
        dp[i][j−1],     // insertar Y[j]
        dp[i−1][j−1]    // sustituir X[i] por Y[j]
    )
```

Cadenas: `X = ITM` (`n = 3`), `Y = ITEM` (`m = 4`).

```text
        ε   I   T   E   M
    ε   0   1   2   3   4
    I   1   0   1   2   3
    T   2   1   0   1   2
    M   3   2   1   1   1
```

La esquina `dp[3][4] = 1`: una inserción (la `E`). Alineamiento posible:

```text
I T - M
I T E M
```

**Complejidad.** `Θ(nm)` tiempo y memoria. Aquí `3 × 4`. Un diff de dos archivos de 4 000 líneas ya es dieciséis millones de celdas: cabe; dos genomas de `10^8` no se alinean con esta tabla cruda (ahí entran recortes, bandas y heurísticas).

**LCS en el mismo espíritu.** Para `AGCT` y `GACT` la tabla de coincidencias da longitud **3** (por ejemplo `GCT` o `ACT`). Misma grilla, otra combinación: `+1` en diagonal si las letras igualan, si no el `max` de arriba e izquierda.

---

### Ejercicio 5 · Intervalos con peso (cuando el greedy de la hora de fin no basta)

**Enunciado.** Un aula, tres reservas. Solo una a la vez. Ahora cada una tiene **peso** (estudiantes, o plata):

| | Intervalo | Peso `w` |
| --- | --- | --- |
| Charla | `[1, 4)` | 2 |
| Magistral | `[2, 5)` | 10 |
| Laboratorio | `[4, 8)` | 3 |

Sin pesos, el greedy de **menor fin** elige Charla (termina a las 4) y Laboratorio (empieza a las 4): **2** eventos. Con pesos, esa pareja suma `2 + 3 = 5` y la magistral sola suma **10**.

**Algoritmo.** Ordenar por hora de fin (ya lo están). `p(i)` = índice de la reserva **más a la derecha** que termina ≤ inicio de `i`, o 0 si no hay.

| `i` | Reserva | `p(i)` | Por qué |
| --- | --- | --- | --- |
| 1 | Charla | 0 | nadie termina ≤ 1 |
| 2 | Magistral | 0 | Charla termina en 4, magistral empieza en 2: solapan |
| 3 | Laboratorio | 1 | empieza en 4 ≥ fin de Charla; no es compatible con Magistral (4 < 5) |

```text
dp[0] = 0
dp[i] = max( w_i + dp[p(i)],  dp[i − 1] )
```

| `i` | Tomar `i` | No tomar | `dp[i]` |
| --- | --- | --- | --- |
| 1 | 2 + 0 = 2 | 0 | 2 |
| 2 | 10 + 0 = 10 | 2 | **10** |
| 3 | 3 + dp[1] = 5 | 10 | **10** |

**Respuesta.** Peso **10**, la magistral. Reconstrucción: `dp[3] = dp[2]`, no se tomó el laboratorio; `dp[2] ≠ dp[1]`, sí la magistral.

**Complejidad.** Ordenar `O(n log n)`; cada `p(i)` con búsqueda binaria sobre los fines, `O(n log n)`; el barrido `O(n)`. Memoria `O(n)`.

**Lección.** Subestructura óptima **sí** (el resto a la izquierda de `i` es el mismo problema). Elección greedy por fin **no**, porque el peso de una reserva larga puede ganar a dos cortas. El DP prueba las dos ramas en cada `i` y reutiliza `dp[·]`.

---

## 7. Cómo atacar un problema de DP en este curso

1. **¿Es de óptimo o de conteo?** Min/max → `min`/`max` en la recurrencia. Número de formas → suma. Existencia → `o` lógico. No mezclar.
2. **¿Hay elección greedy demostrable?** Si sí, no hace falta la tabla (vuelto COP, intervalos sin peso, mochila fraccionaria). Si el contraejemplo cabe en una servilleta, a DP.
3. **Una frase para el estado.** Si no se puede decir «`dp[i][w]` es el mejor valor con…», no se programe todavía.
4. **Transiciones hacia estados más fáciles.** El argumento de `dp` tiene que **decrecer** en algún sentido (ítems, capacidad, longitud, `|S|`). Si no, hay ciclo.
5. **Base explícita.** Monto 0, cero ítems, cadena vacía, origen de la grilla.
6. **Cota = estados × trabajo.** Escribir `n`, `m`, `W`, `k` con nombre. Si `W = 10^9`, `O(nW)` no es una implementación seria. Si `n = 40` y el estado es subconjunto, Held–Karp `2^n n²` puede sí, `n!` no.
7. **0/1 contra reuso.** El `for` de la capacidad cambia de dirección. Confundirlos es el bug más común de la unidad.
8. **Reconstrucción aparte.** La tabla da el número. El camino se recupera con predecesores o comparando `dp[i]` con `dp[i−1]`.
9. **Casos borde.** Capacidad 0, un objeto que no cabe, cadenas vacías, monto imposible (`∞` y no `0`), un intervalo que tapa el día.

---

## 8. Ejercicios para practicar

1. En el ejercicio 2, calcule también `dp[x]` para `x = 0..8` con las mismas monedas. ¿Cuánto vale `dp[8]`? Reconstruya unas piezas óptimas. Contraste con greedy.
2. En la maleta del ejercicio 3, agregue *Panela* (`w = 3`, `v = 8`). Recalcule la última fila (o toda la tabla). ¿Sigue ganando cacao+azúcar?
3. LCS a mano de `CASA` y `CALA`. Escriba la tabla `5 × 5` (contando vacíos) y una subsecuencia óptima.
4. Edición de `GRAFO` a `GATO`. ¿Cuál es `dp[5][4]`? Nombre una secuencia de operaciones.
5. Subidas de escalera con peldaños de 1, 2 o **3**. Escriba la recurrencia y `dp[0..5]`.
6. LIS de `3, 1, 4, 1, 5, 9, 2, 6`. Calcule `dp[i]` = LIS que termina en cada posición. ¿Cuál es la longitud y una secuencia?
7. Un DAG de 5 vértices con pesos en nodos (o en aristas). Camino de peso máximo desde `s` a `t` por DP en orden topológico. ¿Por qué aquí no hace falta Dijkstra?
8. Floyd–Warshall a mano con 4 vértices (puede reutilizar una matriz chica de la [guía de grafos](README-GRAFOS.md)). Marque, para un par, el `k` que mejoró la distancia.
9. Demuestre que Fibonacci memoizado es `Θ(n)`: cada `i` se calcula una vez y hace `O(1)` trabajo. Escriba el contraejemplo de complejidad si se olvida el diccionario.
10. ¿Por qué el greedy de densidad **falla** en el ejercicio 3 y **acierta** si se puede llevar medio queso? Relaciónelo con elección greedy frente a subestructura óptima.

---

## 9. Referencias

- Bellman, R. *Dynamic Programming*, 1957. El origen del nombre y del principio.
- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*. Cap. de DP: corte de varilla, matriz, LCS, mochila.
- Kleinberg, Tardos. *Algorithm Design*. Cap. 6: weighted interval scheduling, mochila, alineamiento; el tono de «diseñar el estado».
- Dasgupta, Papadimitriou, Vazirani. *Algorithms*. DP corto, con TSP y caminos.
- Erickson, J. *Algorithms*. Notas claras de recurrencias y de «cómo se recorre la tabla».
- Wagner, Fischer. *The string-to-string correction problem*, 1974.
- Needleman, Wunsch. *A general method applicable to the search for similarities in the amino acid sequence of two proteins*, 1970.

Greedy (cuándo **no** hace falta DP, y los contraejemplos que sí): [`algoritmos-greedy/README.md`](algoritmos-greedy/README.md). Caminos como DP: Floyd y Bellman–Ford en [`README-GRAFOS.md`](README-GRAFOS.md). Complejidad y notación: el [README del curso](README.md).

---

## Licencia de uso académico

Material de apoyo para clase. Nombre el estado, llene la tabla de fácil a difícil, y no llame DP a un greedy con un arreglo al lado.
