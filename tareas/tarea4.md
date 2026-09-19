# Tarea 4 · Programación dinámica en LeetCode

**Curso:** Análisis de algoritmos · ITM · 2026-2  
**Tema:** programación dinámica (DP)  
**Entrega:** repositorio **individual** de cada estudiante (no el repositorio del curso).

En clase se vio que DP no es «usar un arreglo»: hay que nombrar el **estado**, la **recurrencia**, los **casos base** y la cota **estados × transiciones**. El vuelto con monedas `{1, 3, 4}` no se resuelve greedy; la maleta 0/1 no se resuelve por densidad. Esta tarea pide aplicar esas dos ideas en [LeetCode](https://leetcode.com/).

Material de apoyo: [`README-DP.md`](../README-DP.md). El contraste greedy (cuándo **no** hace falta la tabla): [`algoritmos-greedy/README.md`](../algoritmos-greedy/README.md).

---

## Qué hay que hacer

Resolver **los dos** ejercicios de abajo con un enfoque de **programación dinámica** (tabulación o memoización: lo que pida cada uno). Para cada uno:

1. Implementar la solución en LeetCode (el lenguaje es libre: Python, Java, C++, JavaScript, TypeScript, etc.).
2. Hacer **Submit** hasta obtener **Accepted** (éxito: todos los casos de prueba pasan).
3. Subir al **repositorio individual** el código y las **imágenes** que demuestren ese éxito.

Sin captura de **Accepted**, el ejercicio no se considera entregado.

**No cuenta** como solución del curso un greedy de «siempre la moneda más grande», una recursión **sin** memo (el árbol de Fibonacci), ni enumerar `2^n` subconjuntos. LeetCode a veces acepta un brute en los tests chicos; en el README de la entrega tiene que verse el **estado** y la **recurrencia**.

---

## Entrega (repositorio individual)

Monte **todo** en su repositorio individual, en una carpeta clara, por ejemplo:

```text
tarea4/
├── README.md                 ← enlace a cada problema, estado, recurrencia y complejidad
├── coin-change/              ← código del ejercicio 1
├── partition-equal-subset-sum/  ← código del ejercicio 2
└── evidencias/
    ├── coin-change-accepted.png
    └── partition-equal-subset-sum-accepted.png
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
- cuál es el **estado** (`dp[…]` en una frase), la **recurrencia** y los **casos base**;
- si las piezas/objetos se **reusan** (no acotada) o van **a lo más una vez** (0/1), y cómo se refleja eso en el `for`;
- complejidad de **tiempo** y de **espacio** (`O(…)`), con `n`, `k`, `amount` o `W` nombrados;
- enlace relativo a la(s) imagen(es) de **Accepted**.

Ejemplo de cómo incrustar la evidencia en Markdown:

```markdown
## 322. Coin Change

Estado: …  
Recurrencia: …  
Complejidad: …

![Accepted — Coin Change](evidencias/coin-change-accepted.png)
```

---

## Ejercicio 1 · [322. Coin Change](https://leetcode.com/problems/coin-change/)

**Dificultad:** Medium  
**Etiquetas:** Array, Dynamic Programming, Breadth-First Search

Hay `coins` (denominaciones; hay **infinitas** piezas de cada tipo) y un monto `amount`. Hay que devolver el **mínimo** número de monedas que suman exactamente `amount`. Si es imposible, devolver `-1`.

Este problema es el del **vuelto de la guía** (ejercicio 2: `{1, 3, 4}` y monto 6). Greedy toma 4+1+1 = 3 piezas; DP toma 3+3 = 2. En COP el greedy suele acertar; **aquí el sistema no es canónico** y hay que tabular.

**Pista de diseño (no es la solución completa):**

- estado: `dp[x]` = mínimo de monedas para armar exactamente `x` (`∞` o `amount + 1` si aún no se puede);
- base: `dp[0] = 0`;
- recurrencia: para cada `x`, para cada moneda `c ≤ x`, `dp[x] = min(dp[x], 1 + dp[x − c])`;
- las monedas **se reusan**: es mochila **no acotada**. El monto se recorre hacia **adelante** (de 1 a `amount`);
- al final, si `dp[amount]` sigue en `∞`, la respuesta es `-1`.

Indique en el README la complejidad. Con `k = coins.length` y `X = amount` la tabulación es **`Θ(k · X)`** en tiempo y `Θ(X)` en espacio. Es **pseudo-polinomial** en `X` (el mismo aviso de la guía). Un greedy de mayor denominación **no** es lo que se evalúa, aunque pase algún ejemplo.

---

## Ejercicio 2 · [416. Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/)

**Dificultad:** Medium  
**Etiquetas:** Array, Dynamic Programming

Hay un arreglo `nums` de enteros positivos. ¿Se puede partir en **dos** subconjuntos con la **misma** suma? Cada número se usa **a lo más una vez**.

En la guía esto es la **mochila 0/1** de la maleta (ejercicio 3): no se parte el frasco. Aquí el «valor» coincide con el «peso»: si la suma total `S` es impar, es imposible; si es par, hay que decidir si cabe un subconjunto de peso **exactamente** `W = S / 2`. Llenar esa capacidad es `true`; si no, `false`.

**Pista de diseño (no es la solución completa):**

- si `S` es impar, `false` de inmediato;
- estado: `dp[w]` = «¿existe un subconjunto de los ítems ya considerados cuya suma sea `w`?»;
- base: `dp[0] = true` (la suma vacía);
- recurrencia 0/1: al considerar `nums[i]`, `dp[w] = dp[w] OR dp[w − nums[i]]` cuando `w ≥ nums[i]`;
- cada número **una vez**: si comprime a un arreglo 1D, recorra `w` de `W` **hacia 0**. Hacia adelante reusa el mismo ítem (se convierte en el problema 1);
- enumerar los `2^n` subconjuntos es el bruto de la guía: con `n` hasta 200 no corre.

Indique en el README la complejidad. Con `n = nums.length` y `W = S/2` la tabla es **`Θ(n W)`** en tiempo y `Θ(W)` en espacio si usa un arreglo 1D (o `Θ(nW)` si deja la matriz). Nombre `W`: no escriba solo `O(n²)` por inercia. Un `O(n 2^n)` **no** es lo que se evalúa.

---

## Qué se evalúa

| Criterio | Qué se espera |
| --- | --- |
| Completitud | Los **dos** problemas en el repositorio individual |
| Éxito en LeetCode | Imagen de **Accepted / Success** por cada uno, legible y asociada al problema |
| Enfoque de DP | Estado, recurrencia y base escritos; no basta “el código pasó” ni un greedy |
| 0/1 vs reuso | En el README se ve por qué el ejercicio 1 reusa monedas y el 2 no reusa números |
| Complejidad | `O` de tiempo y espacio, coherente con el código (`k · amount`, `n · W`) |
| Organización | Carpetas o nombres claros; el README enlaza código e imágenes |

No se pide copiar una solución de Internet sin entenderla. Si el código es correcto pero no puede explicar en clase qué es `dp[x]`, por qué el `for` de la capacidad cambia de dirección, o por qué greedy falla en Coin Change, la tarea queda incompleta.

---

## Recordatorios

- Trabaje en **su** repositorio. Un push al repo del curso **no** cuenta como entrega.
- Haga `git add` de las **imágenes** (`.png` / `.jpg`). Un README que apunta a archivos que nunca se subieron no sirve.
- El veredicto que cuenta es **Accepted** en Submit, no *Run Code* sobre un ejemplo.
- Plazos y forma de avisar el enlace del repo: según lo indicado en clase / aula virtual.
