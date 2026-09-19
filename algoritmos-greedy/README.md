# Complejidad algorítmica y algoritmos greedy

Laboratorio interactivo en Angular del **vuelto de una caja** (cambio de monedas greedy), más una guía de curso: primero **qué es complejidad algorítmica**, después **algoritmos greedy**.

Curso: **Análisis de algoritmos · ITM · 2026-2**.

---

## Cómo correr la aplicación

Requisitos: Node.js 18 o superior (el proyecto se generó con Node 22 y Angular 19).

```bash
cd algoritmos-greedy
npm install
npm start
```

Abre [http://localhost:4200](http://localhost:4200).

| Acción | Qué hace |
| --- | --- |
| Café / Pasaje / Mercado | Vuelto cotidiano con denominaciones COP |
| Trampa | Monedas 4, 3, 1 y vuelto 6: el greedy usa 3 piezas, el óptimo 2 |
| Reproducir / Paso | Ordena de mayor a menor y entrega o salta cada pieza |
| Tocar una moneda | La quita o la deja en la caja |
| Monto / nueva pieza | Arma tu propio vuelto |
| Teclado | `←` `→` para pasos, espacio para reproducir |

El número grande es lo que **aún falta por devolver**. El recibo a la derecha acumula las piezas ya entregadas.

```bash
npm run build
```

genera la versión de producción en `dist/`.

---

## 1. Qué es complejidad algorítmica

Antes de hablar de greedy hay que fijar **qué se está midiendo**. Un algoritmo no se juzga solo por si «da la respuesta», sino por **cuánto cuesta** producirla cuando la entrada crece.

### Algoritmo, instancia y recurso

Un **algoritmo** es un procedimiento finito, preciso y efectivo: recibe una **instancia** (los datos concretos) y termina con una respuesta. El tamaño de esa instancia se llama **`n`**: número de actividades, de vértices, de caracteres, de registros.

La **complejidad algorítmica** describe cómo crecen los recursos que el algoritmo consume en función de `n`. Los dos recursos clásicos son:

| Recurso | Pregunta | Se cuenta, a grandes rasgos |
| --- | --- | --- |
| **Tiempo** | ¿Cuántas operaciones elementales hace? | Comparaciones, asignaciones, accesos a memoria, llamadas |
| **Espacio** | ¿Cuánta memoria extra necesita? | Arreglos auxiliares, pilas de recursión, tablas |

No se reporta «tardó 37 ms en mi portátil». Eso mezcla el lenguaje, la CPU, la caché y el resto de programas abiertos. El análisis trabaja en un **modelo abstracto** (máquina RAM): cada operación básica cuesta 1, y lo que importa es el **orden de crecimiento**.

### Mejor, promedio y peor caso

Para un mismo `n` hay muchas instancias. Tres lecturas habituales:

- **Mejor caso** — la instancia más amable. Sirve para cotas inferiores, casi nunca para decidir si el algoritmo escala.
- **Caso promedio** — media sobre una distribución de entradas. Útil si esa distribución es realista y se puede modelar.
- **Peor caso** — la instancia que más trabajo exige. Es la cifra con la que se dimensionan sistemas y se comparan algoritmos en este curso: si el peor caso es aceptable, el resto también.

Selección de actividades, por ejemplo, **siempre** ordena `n` intervalos: el peor caso y el caso típico coinciden en `Θ(n log n)` si se usa un sort comparativo.

### Notación asintótica

Se ignoran constantes y términos de menor orden. Lo que queda es la forma de la curva cuando `n → ∞`.

- **`O(f(n))`** — cota **superior**. El tiempo no crece más rápido que `f`, salvo una constante. «A lo sumo».
- **`Ω(f(n))`** — cota **inferior**. «Por lo menos».
- **`Θ(f(n))`** — ambas a la vez: el algoritmo es del **orden** de `f`.

Decir «es `O(n²)`» no afirma que sea lento a propósito; afirma que `n²` **alcanza** para acotarlo. Un algoritmo `Θ(n)` también es `O(n²)`, pero la cota floja no informa. En clase se busca la cota **ajustada**.

Reglas prácticas:

- sumar: se queda el término dominante (`n + n log n` es `Θ(n log n)`);
- un `for` de `n` vueltas con cuerpo `O(1)` es `O(n)`;
- dos bucles anidados independientes sobre `n` son `O(n²)`;
- ordenar por comparaciones cuesta `Ω(n log n)` en el peor caso; por eso tantos greedy «baratos» acaban en `O(n log n)`: el sort, no el barrido.

### Familias de crecimiento

| Clase | Nombre informal | Qué implica al duplicar `n` | Ejemplo |
| --- | --- | --- | --- |
| `O(1)` | constante | casi nada cambia | acceso a un arreglo, hash esperado |
| `O(log n)` | logarítmica | suma un paso | búsqueda binaria |
| `O(n)` | lineal | el trabajo se duplica | una pasada, filtrar, vuelto greedy sobre k ya ordenado |
| `O(n log n)` | linealítmica | un poco más que el doble | sort, Kruskal, Huffman, selección de actividades |
| `O(n²)`, `O(n³)` | polinomial | 4×, 8×, … | pares, Floyd–Warshall |
| `O(2^n)`, `O(n!)` | exponencial / factorial | se vuelve inviable | fuerza bruta, permutaciones |

La diferencia no es cosmética. Para `n = 40`, `2^n` ya es del orden de un billón de ramas; `n log n` sigue siendo instantáneo. **Elegir la familia de algoritmo es, en la práctica, elegir la complejidad.**

### Complejidad de un problema frente a la de un algoritmo

Un **algoritmo** tiene una complejidad. Un **problema** tiene una complejidad intrínseca: ningún algoritmo correcto puede ser asintóticamente más rápido que cierta cota (por ejemplo, ordenar por comparaciones es `Ω(n log n)`).

De ahí el oficio de esta asignatura:

1. proponer un algoritmo;
2. **demostrar** que es correcto;
3. **acotar** tiempo y espacio;
4. decidir si esa cota es aceptable o hace falta otra estrategia.

Greedy entra en el punto 1 como familia de diseño: pocas decisiones, sin retractarse, casi siempre un sort más un barrido lineal. Su complejidad suele ser **atractiva**. La pregunta difícil no es el `O(…)`, sino si la respuesta es **óptima**.

### Por qué esto importa antes de ver greedy

Fuerza bruta sobre combinaciones de monedas crece con el monto (o `2^n` si el problema es de subconjuntos). El greedy de la caja, ya ordenadas las k denominaciones, es **`O(k)`** y, en COP, coincide con el mínimo de piezas. Selección de actividades hace lo mismo en espíritu: bruto `O(n² 2^n)`, greedy `O(n log n)` y óptimo si el criterio es menor hora de fin.

Si el criterio greedy no es demostrable, uno no «gana complejidad» de verdad: gana velocidad a cambio de **dejar de garantizar** el óptimo. Entonces hay que decirlo: heurística `O(n log n)`, no algoritmo exacto.

Con eso ya se puede definir greedy con precisión.

---

## 2. Qué es un algoritmo greedy

Un algoritmo **greedy** (voraz, ávido) construye una solución **decisión a decisión**. En cada paso elige la opción que **en ese instante** parece mejor, según una regla local clara, y **no retracta** esa elección.

No explora combinaciones. No mantiene una tabla de subproblemas como la programación dinámica. No divide el problema en mitades independientes como divide y vencerás. Avanza, se queda con lo elegido y sigue.

La analogía útil: ir al mercado con una canasta de capacidad limitada y, en cada puesto, meter lo que ahora mismo da más valor por peso. Nunca vuelves a sacar un producto «por si acaso». A veces esa política es óptima (mochila **fraccionaria**). A veces no (mochila **0/1**).

Tres piezas definen un greedy:

1. **Candidatos** — el conjunto del que se puede sacar el siguiente elemento.
2. **Criterio de selección** — cómo se ordenan o puntúan esos candidatos.
3. **Prueba de factibilidad** — si el candidato cabe con lo ya elegido.

La plantilla, en seudocódigo, es siempre parecida:

```text
solución ← vacía
ordenar o puntuar candidatos
mientras queden candidatos y la solución no esté completa:
    x ← el mejor candidato restante
    si x es factible con la solución actual:
        agregar x a la solución
devolver solución
```

En la app interactiva los candidatos son **denominaciones**, el criterio es «la más grande que quepa» y la prueba es «no pasarse del resto». En las notas, selección de actividades usa el mismo esqueleto con intervalos y «la que termina antes».

---

## 3. Ejemplos: complejidad bruta frente a greedy optimizado

Misma pregunta, dos algoritmos: uno **enumera** (bruto) y otro **decide en local y sigue** (greedy). En los casos de esta sección el greedy es **óptimo**, así que no se está regalando calidad: se está regalando tiempo.

Orden de magnitud si el bruto es subconjuntos (`2^n`) y el greedy es un sort (`n log n`, logaritmo en base 2):

| `n` | Fuerza bruta `2^n` | Greedy `n log₂ n` | Qué se siente |
| --- | --- | --- | --- |
| 10 | 1 024 | ~33 | ambos instantáneos |
| 20 | ~1 millón | ~86 | el bruto ya se nota |
| 30 | ~1 000 millones | ~147 | el bruto, minutos u horas |
| 40 | ~1 billón | ~213 | el bruto, fuera de alcance |

Las cifras del greedy son el **número de comparaciones de un sort**, no milisegundos. El barrido posterior suma solo `O(n)`.

### 3.1 Selección de actividades

**Instancia.** Un aula, cuatro clases:

| Clase | Inicio | Fin |
| --- | --- | --- |
| A Cálculo | 1 | 4 |
| B Tutoría | 3 | 5 |
| C Examen | 0 | 6 |
| D Laboratorio | 5 | 7 |

**Bruto.** Hay `2^4 = 16` subconjuntos. Para cada uno se verifica que ningún par se solape (`O(n²)` por subconjunto). Complejidad `O(n² 2^n)`. El óptimo es `{A, D}` (tamaño 2). `{B, D}` también es factible de tamaño 2; `{C}` es factible de tamaño 1; `{A, B}` es ilegal.

**Greedy (menor fin).** Orden: A (fin 4), B (fin 5), C (fin 6), D (fin 7). Elige A, descarta B y C porque empiezan antes de 4, elige D. Complejidad `O(n log n)`. Con `n = 4` el sort es trivial; con `n = 30` el bruto ya no corre y el greedy sigue siendo una pasada.

En la app, el ejemplo *Mercado* tiene un vuelto de 23.700: el bruto explora combinaciones del monto; el greedy mira 8 denominaciones.

### 3.2 Mochila fraccionaria

**Instancia.** Capacidad `W = 50`. Tres lotes (se pueden partir):

| Ítem | Valor | Peso | Densidad (valor/peso) |
| --- | --- | --- | --- |
| Café | 60 | 10 | 6 |
| Cacao | 100 | 20 | 5 |
| Azúcar | 120 | 30 | 4 |

**Bruto (0/1, sin partir).** `2^3 = 8` subconjuntos. El mejor entero es café+cacao (valor 160, peso 30) o cacao+azúcar (220, 50) o café+azúcar (180, 40): gana 220. Complejidad `O(n 2^n)` para verificar pesos. **No** alcanza el óptimo fraccionario.

**Greedy fraccionario (mayor densidad).** Llenar café (10), cacao (20) y `20/30` del azúcar. Valor `60 + 100 + 80 = 240`. Complejidad `O(n log n)` por ordenar densidades, luego `O(n)` para llenar. Con `n = 40` objetos el bruto 0/1 ya es un billón de subconjuntos; el greedy fraccionario ordena 40 densidades.

La mochila **0/1** (no se parte) **no** se resuelve con este greedy: ahí el brute es `O(n 2^n)` y el algoritmo exacto razonable es [programación dinámica](../README-DP.md) `O(nW)`.

### 3.3 Cambio de monedas (sistema canónico)

**Instancia.** Devolver **87** con denominaciones COP típicas: `50, 20, 10, 5, 1` (`k = 5` tipos).

**Bruto.** Árbol de recursión: en cada peso restante se prueba cada moneda. Sin memoización es `O(k^{87})` en el peor dibujo. Con DP (mínimo número de monedas) baja a `O(k · monto) = O(5 · 87)`.

**Greedy (mayor denominación que cabe).** `50 + 20 + 10 + 5 + 1+1 = 6` monedas. Una pasada sobre `k` tipos: `O(k)`, o `O(k log k)` si había que ordenarlas. En sistemas canónicos (COP, USD, EUR) coincide con el óptimo. Contraejemplo clásico no canónico: monedas `1, 3, 4` y monto 6 → greedy `4+1+1` (3 monedas), óptimo `3+3` (2).

### 3.4 Huffman

**Instancia.** Cuatro símbolos con frecuencias `A:45, B:13, C:12, D:16` (el ejemplo de CLRS recortado; el libro añade E y F).

**Bruto.** Enumerar árboles binarios de prefijo y calcular la longitud media. El número de árboles binarios llenos con `n` hojas es el número de Catalan `C_{n-1}`: para `n = 10` ya son 4862 formas; para `n = 20` pasa de 17 millones. Cada evaluación recorre el árbol.

**Greedy.** Siempre fusionar los dos nodos de menor frecuencia. Cola de prioridad: `O(n log n)`. Para un alfabeto de 256 bytes es instantáneo; enumerar códigos no lo es.

### 3.5 Árbol de recubrimiento mínimo (Kruskal)

**Instancia.** `n = 4` ciudades, grafo completo, 6 aristas con pesos distintos.

**Bruto.** Cayley: hay `n^{n-2} = 16` árboles de recubrimiento en el completo etiquetado. En un grafo ralo hay que listar subconjuntos de `n-1` aristas y probar aciclicidad: `O(C(m, n-1) · (n+m))`. Con `n = 10` y `m = 20`, `C(20,9)` ya es 167 960.

**Greedy (Kruskal).** Ordenar `m` aristas y agregar si no forma ciclo (Union-Find): `O(m log m)`. Con `n = 10` son ~20 comparaciones de sort más unos `find`. Mismo MST, otra familia de complejidad.

### 3.6 Ruta más corta (Dijkstra)

**Instancia.** `n` semáforos, pesos de calle ≥ 0.

**Bruto.** Listar caminos simples origen–destino. En el peor caso hay hasta `O(n!)` caminos (permutaciones de vértices intermedios). Para `n = 10`, `10! = 3 628 800`.

**Greedy (Dijkstra).** Cerrar siempre el nodo no visitado de menor distancia tentativa: `O((n + m) log n)` con heap. `n = 10` es irrelevante; `n = 10 000` (un barrio) sigue siendo viable. Con pesos negativos el mismo greedy **deja de ser correcto**; ahí no se «optimiza complejidad», se cambia de algoritmo (Bellman-Ford `O(nm)`).

### Cómo leer la tabla resumen

| Problema | Bruto (idea y cota) | Greedy optimizado | ¿Óptimo greedy? |
| --- | --- | --- | --- |
| Selección de actividades | subconjuntos `O(n² 2^n)` | sort + barrido `O(n log n)` | Sí (menor fin) |
| Mochila fraccionaria | órdenes / 0/1 `O(n 2^n)` | densidad `O(n log n)` | Sí (si se puede partir) |
| Cambio canónico | recursión `O(k^{monto})` o DP `O(k·monto)` | `O(k)` | Sí en COP/USD/EUR |
| Huffman | árboles ~Catalan | heap `O(n log n)` | Sí (código por símbolo) |
| MST | árboles `n^{n-2}` o `C(m,n-1)` | Kruskal `O(m log m)` | Sí |
| Ruta más corta, pesos ≥ 0 | caminos `O(n!)` | Dijkstra `O((n+m) log n)` | Sí |

Regla de lectura: **bruto = explorar el espacio de soluciones; greedy = ordenar y no volver atrás.** Si hay demostración de elección greedy, las dos columnas de la derecha reemplazan a la del medio sin perder el óptimo.

---

## 4. Cuándo el greedy es correcto

Greedy no es una receta universal. Es correcto cuando el problema tiene, a la vez:

### Propiedad de elección greedy

Existe una decisión local que **siempre** puede formar parte de alguna solución óptima. Si el óptimo no la usaba, se puede **intercambiar** por ella sin empeorar.

En selección de actividades: la actividad que termina más temprano es una elección segura. Cualquier óptimo que no la incluya tiene alguna actividad que termina igual o más tarde; reemplazarla por la más temprana deja al menos el mismo número de huecos a la derecha.

### Subestructura óptima

Lo que queda después de esa decisión es un subproblema de la **misma forma**, y un óptimo del resto más la decisión greedy da un óptimo global.

Si falta cualquiera de las dos, el greedy puede devolver algo factible y hasta «decente», pero no necesariamente óptimo. Entonces o se cambia el criterio, o se pasa a programación dinámica, backtracking o aproximación.

### Cómo reconocer el patrón

Preguntas rápidas antes de programar un greedy:

- ¿Puedo **ordenar** los elementos por un número (fin, densidad valor/peso, peso de arista) y luego hacer una pasada?
- ¿Una decisión mal tomada se puede **arreglar con un intercambio** en un óptimo hipotético?
- ¿El problema pide un **conjunto de tamaño máximo**, un **peso mínimo** o un **empaquetado fraccionable**, no una combinatoria 0/1?

Si la respuesta a la segunda es «no lo veo», no implementes greedy y lo des por óptimo. Implementa, contrasta con fuerza bruta en instancias chicas, o busca un contraejemplo.

---

## 5. Selección de actividades (problema clásico)

La app anima el **vuelto**. Este apartado deja el otro greedy de libro, el de intervalos, porque es el que se demuestra con intercambio en casi todos los cursos.

**Entrada.** `n` actividades. La i-ésima pide el intervalo `[s_i, f_i)` (empieza en `s_i`, termina en `f_i`). Una persona, un aula o un procesador **no puede** ejecutar dos actividades que se solapan.

**Salida.** Un subconjunto de tamaño **máximo** de actividades compatibles. (Si hay pesos distintos, el problema cambia: ya no basta este greedy; hace falta DP.)

**Algoritmo.**

1. Ordenar por `f_i` creciente. Empates: da igual, o por `s_i`.
2. Elegir la primera.
3. Recorrer el resto: si `s_j ≥` fin de la última elegida, elegirla.

**Complejidad.** `O(n log n)` por el sort. El recorrido posterior es `O(n)`. Memoria extra: `O(n)` para la copia ordenada y el conjunto respuesta, o `O(1)` extra si se ordena in-place y solo se cuentan.

**Por qué no vale «la más corta».** El ejemplo *Trampa de la duración* en la app tiene tres intervalos: una clase larga de mañana, una charla corta que las cruza, y una clase larga de tarde. Elegir la más corta deja **1** actividad. Elegir las que terminan antes deja **2**. El greedy sigue siendo greedy; el criterio era el incorrecto.

**Por qué no vale «la que empieza antes».** Una jornada de 8:00 a 18:00 bloquea todas las clases cortas del día. El óptimo puede ser cinco clases de dos horas.

Esos contraejemplos están en la interfaz precisamente para separar **«usar greedy»** de **«usar el criterio que admite demostración»**.

### Esquema de corrección (intercambio)

Sea `a` la actividad de menor fin. Sea `OPT` un óptimo. Si `a ∈ OPT`, listo. Si no, `OPT` contiene alguna `b` que solapa con `a` (si no, se podría agregar `a`). Como `a` termina lo más temprano posible, `f(a) ≤ f(b)`. Entonces `OPT' = (OPT − {b}) ∪ {a}` es factible y `|OPT'| = |OPT|`. El resto del día a partir de `f(a)` se resuelve por inducción.

---

## 6. Otros problemas greedy clásicos

| Problema | Criterio local | ¿Óptimo? | Complejidad típica |
| --- | --- | --- | --- |
| Selección de actividades / interval scheduling | Menor hora de fin | Sí | `O(n log n)` |
| Mochila fraccionaria | Mayor valor / peso | Sí | `O(n log n)` |
| Mochila 0/1 | El mismo | **No** | [DP](../README-DP.md) `O(nW)` |
| Cambio de monedas (denominaciones canónicas: 1, 5, 10, 25) | Mayor denominación ≤ resto | Sí en sistemas canónicos | `O(k)` |
| Cambio de monedas genérico | El mismo | **No** | [DP](../README-DP.md) |
| Huffman | Fusionar los dos símbolos de menor frecuencia | Sí (código óptimo por símbolo) | `O(n log n)` |
| Kruskal (MST) | Arista de menor peso que no forma ciclo | Sí | `O(m log m)` |
| Prim (MST) | Vértice más barato de conectar al árbol | Sí | `O(m + n log n)` con heap |
| Dijkstra | Nodo no visitado con menor distancia tentativa | Sí si pesos ≥ 0 | `O(m + n log n)` |
| Dijkstra con pesos negativos | El mismo | **No** (usar Bellman-Ford) |
| Cobertura de conjuntos | El conjunto que cubre más elementos nuevos | Aproximación `H(n)` | Polinomial |
| Coloreo greedy de grafos | El color más chico que no use un vecino | Heurística | `O(n + m)` |

La lección de la tabla: **el esqueleto greedy se reutiliza**; la garantía de optimalidad **no**.

---

## 7. Cómo se implementa (plantillas de código)

### 7.1 Selección de actividades

```ts
function selectActivities(items: { start: number; finish: number }[]) {
  const ordered = [...items].sort((a, b) => a.finish - b.finish);
  const chosen = [];
  let lastFinish = Number.NEGATIVE_INFINITY;
  for (const item of ordered) {
    if (item.start >= lastFinish) {
      chosen.push(item);
      lastFinish = item.finish;
    }
  }
  return chosen;
}
```

Eso es el mismo patrón que `src/app/algorithms/coin-change.ts` usa para el vuelto: ordenar, una pasada, traza de pasos para la UI.

### 7.2 Mochila fraccionaria

Ordenar por `valor / peso` descendente. Llenar la capacidad. Si el siguiente objeto no cabe entero, tomar la **fracción** que falta. Optimalidad: un argumento de intercambio sobre densidad.

En código de producción esto aparece cuando el recurso es divisible: CPU milicores, presupuesto continuo, ancho de banda, espacio en un contenedor si se puede partir el lote.

### 7.3 Huffman

Cola de prioridad con frecuencias. Mientras haya más de un nodo, sacar los dos menores, crear un padre con la suma, volver a insertar. Los bits del código son el camino a cada hoja. Es el greedy que está detrás de `deflate` (ZIP), de partes de JPEG y de muchos codecs.

### 7.4 Kruskal y unión de conjuntos

Ordenar aristas por peso. Para cada arista, `find` de los extremos; si están en componentes distintas, `union` y agregar al MST. El greedy es «la arista más barata que no rompe aciclicidad». Union-Find con compresión de caminos hace casi `O(m α(n))` tras el sort.

### 7.5 Dijkstra como greedy sobre un frente

El conjunto `S` son los nodos con distancia ya **cerrada**. El siguiente es el de menor distancia tentativa. Eso solo es seguro si no hay pesos negativos: un atajo posterior no puede abaratar un nodo ya cerrado.

---

## 8. Greedy en el desarrollo de software

No es un tema de pizarrón. Compiladores, redes, bases de datos, DevOps y productos con calendario usan estas ideas, a veces con el nombre del paper, a veces como «la heurística obvia que funciona en nuestros datos».

### Calendarios, salas y turnos

Google Calendar, Outlook, sistemas de reserva de laboratorios o de quirófanos: dado un conjunto de reuniones y un recurso, **interval scheduling** es el greedy de menor fin (o variantes con pesos → DP). Fusionar intervalos ocupados (`merge intervals`) es el primo de limpieza: ordenar por inicio y extender el último rango si hay solape. Eso aparece en:

- detectar conflictos de booking;
- compactar bloques de disponibilidad;
- calcular «próximo hueco libre» en una agenda.

### CI/CD y colas de trabajo

Un runner de GitHub Actions, Jenkins o un worker de Celery debe elegir **qué job corre ahora**. Políticas greedy habituales:

- **SJF** (shortest job first): minimiza tiempo de espera promedio si las duraciones se conocen;
- **prioridad + earliest deadline**;
- **first fit** al asignar un job al primer agente que tenga RAM/CPU suficiente.

Ninguna es mágicamente óptima con jobs que llegan en línea, pero son el corazón de casi todo scheduler industrial. Kubernetes puntúa nodos (affinities, recursos, taints) y **elige el mejor score actual**: greedy sobre una función de utilidad. No resuelve un ILP en cada `Pending`.

### Redes, enrutamiento y CDN

- **OSPF / IS-IS** calculan árboles cortos; Dijkstra es el motor.
- Un **load balancer** least-connections envía el request al servidor con menos carga **ahora**.
- Un CDN que elige el PoP más cercano es greedy geográfico.
- **TCP congestion control** (en espíritu) reacciona a la señal local de pérdida o delay.

### Compresión, codecs y formatos

Huffman y sus herederos (canonical Huffman, ANS) viven en gzip, PNG, JPEG, MP3. El encoder elige códigos cortos para símbolos frecuentes. El desarrollador casi nunca reimplementa Huffman; sí debe saber **por qué** un histograma sesgado comprime mejor.

### Compiladores y máquinas virtuales

- **Register allocation** clásico usa coloreo de grafos; el coloreo greedy por ordenamiento (simplicial, chordal en SSA) es barato y a menudo óptimo en programas bien formados.
- Instruction scheduling a veces usa list scheduling: en cada ciclo, emitir la instrucción lista de mayor prioridad.

### Almacenamiento y bases de datos

- **Bin packing** de páginas, archivos en volúmenes, o pods en nodos: first fit decreasing (ordenar por tamaño, meter en el primer hueco). Es greedy y da una aproximación con razón acotada.
- Un **garbage collector** que elige la región con más basura para recolectar ahora es greedy sobre «beneficio inmediato».
- Índices y query planners combinan greedy (elegir el índice de menor costo estimado **en este join**) con DP (Selinger) cuando el espacio de planes es manejable.

### Producto: feeds, matching y precios

- «Mostrar primero el anuncio con mayor `CTR × bid`» es greedy de densidad.
- Matching en marketplaces (pasajero–conductor, turno–médico) a menudo asigna el par de mayor score **disponible ahora** en lugar de resolver un matching global en cada segundo.
- Rate limiting con **token bucket** no es greedy de combinatoria, pero la decisión «¿este request pasa ahora?» es local e irrevocable en esa ventana.

### Videojuegos y simulaciones

Pathfinding con Dijkstra/A* (A* añade una heurística admisible; el esqueleto sigue siendo «cerrar el nodo más prometedor»). Loot tables y AI de «atacar al enemigo más débil / más cercano» son políticas greedy; el diseño del juego decide si eso es diversión o un exploit.

### Lo que un equipo debería documentar

Cuando el código dice `sort_by(...)` y luego un `for` que acepta o rechaza, alguien debe dejar escrito:

1. cuál es el criterio;
2. si hay **demostración** o solo **heurística**;
3. el contraejemplo si es heurística;
4. qué métrica se degrada si el criterio deja de valer (latencia p99, ocupación de salas, costo de nube).

Eso evita que un refactor «ordene por otra columna porque se ve más justo» rompa una garantía.

---

## 9. Greedy en el día a día

Las mismas tensiones —elegir ya, no deshacer, optimizar un número local— ocurren fuera del editor.

### Dinero y compras

- El cajero que da cambio con el menor número de monedas usa greedy de denominación mayor. En pesos colombianos (y en euros o dólares) suele acertar porque el sistema es canónico. En un sistema raro tipo 1, 3, 4, cambiar 6 por greedy da `4+1+1` (3 monedas) y el óptimo es `3+3` (2).
- En el supermercado, llenar la maleta del viaje con lo de **mayor gusto por kilo** es mochila fraccionaria si puedes llevar media bolsa de café; si los frascos no se abren, es mochila 0/1 y el greedy puede fallar.
- Pagar la deuda de **mayor tasa de interés** primero (avalancha) es un greedy sobre tasa; pagar la **más chica** primero (bola de nieve) es otro criterio, psicológico, no óptimo en intereses.

### Tiempo y agenda

- Encajar el máximo de citas en un día sin solapes es selección de actividades: si siempre aceptas la que termina antes entre las que aún caben, maximizas el número de compromisos. Si aceptas la reunión de las 9:00 a las 17:00, perdiste el día.
- En un aeropuerto, «la fila que se ve más corta» es greedy; no ve la complejidad oculta del mostrador.
- Estudiar el tema de **mayor puntos-por-hora** de estudio antes del parcial es densidad greedy. Ignora prerrequisitos: a veces hay que tragar el capítulo 2 para que el 5 valga.

### Rutas y movimiento

- «En cada esquina, la calle que apunta más al destino» es greedy geográfico y puede meterte en un callejón. Dijkstra/A* corrigen eso con información global (o una heurística admisible).
- Elegir la gasolinera más barata **que ves ahora** sin saber la de 20 km más adelante es el mismo riesgo.

### Casa, cocina, colas

- Lavar primero el plato que **desbloquea más espacio** en el fregadero es un greedy de cuello de botella.
- En una olla, sofreír lo que más tarda primero es critical-path, no greedy puro; mezclar las dos intuiciones es lo que hace un cocinero experimentado.
- Empacar la mudanza: cajas **más grandes primero** (first fit decreasing) suele dejar menos huecos que ir metiendo lo que pillas.

### Lo que la metáfora enseña

En la vida, como en el código, greedy brilla cuando:

- deshacer es caro o imposible (un vuelo ya comprado, un commit ya en `main` sin revert);
- hay una medida local alineada con el objetivo global (terminar antes, densidad, peso de arista);
- el horizonte es un recurso lineal (tiempo de un aula, capacidad de una mochila divisible).

Falla cuando las decisiones **interfieren de forma no obvia**: prerrequisitos, pesos negativos, objetos indivisibles, o un óptimo que exige sacrificar el mejor bocado de hoy.

---

## 10. Greedy frente a otras familias

| Familia | Qué explora | Cuándo preferirla | Costo típico |
| --- | --- | --- | --- |
| Greedy | Una trayectoria de decisiones locales | Hay demostración de elección greedy, o una heurística aceptable | Casi siempre `O(n log n)` o mejor |
| Programación dinámica | Todos los subproblemas relevantes, con memoización | Subestructura óptima **sin** elección greedy segura (mochila 0/1, LIS, edit distance) | Polinomial en el estado, a veces pseudo-polinomial |
| Divide y vencerás | Subinstancias independientes + combine | El problema se parte limpio (mergesort, closest pair) | Recurrencias tipo Master Theorem |
| Backtracking / branch and bound | Árbol de soluciones, podando | Combinatoria, n chico, o necesidad de óptimo exacto | Exponencial en el peor caso |
| Aproximación / heurística | Greedy o búsqueda local con razón de aproximación | NP-duro (set cover, TSP métrico) | Polinomial, solución no necesariamente óptima |

Un error de curso frecuente: implementar greedy, ver que «da un número razonable», y afirmar `Θ(óptimo)`. Hay que o demostrar o exhibir el hueco.

---

## 11. Cómo está armado este repositorio

```text
algoritmos-greedy/
├── README.md
└── src/app/
    ├── algorithms/coin-change.ts          vuelto greedy + óptimo DP para contrastar
    ├── models/change.model.ts
    └── components/change-lab/             caja interactiva
```

El motor (`buildChangeSteps`) no solo cuenta monedas: emite `sort`, `consider`, `take`, `skip`, `done` para pintar el resto y el recibo. El ejemplo *Trampa* deja ver un greedy de la misma complejidad que ya no es óptimo, sin cambiar el bucle.

Eso es un patrón de ingeniería útil más allá del curso: **separar el algoritmo puro de la traza**. La traza sirve para enseñar, para depurar y para tests («tras el paso k, el conjunto debe ser…»).

---

## 12. Ejercicios sugeridos

1. Escribe `O`, `Ω` o `Θ` (el más preciso que puedas) para: búsqueda binaria, un `for` que recorre un arreglo una vez, dos bucles anidados `i, j ∈ 1…n`, y generar todos los subconjuntos de `n` elementos. ¿Por qué «es `O(n²)`» puede ser verdad y a la vez poco útil?
2. Con `n = 25` actividades, estima operaciones de un bruto `n² 2^n` frente a un greedy `n log₂ n`. Reproduce a mano las 16 combinaciones del ejemplo 3.1 y contrástalas con el sort.
3. Demuestra con intercambio que «menor fin» es óptimo. Escribe el contraejemplo de «menor duración» (ya está en la app) y uno propio de «menor inicio».
4. Agrega pesos a las actividades y observa que el greedy de este laboratorio deja de valer. ¿Qué DP lo resuelve? ¿Cuál es su complejidad en función de `n` y del horizonte temporal?
5. Implementa mochila fraccionaria en el mismo estilo de pasos. ¿Dónde iría la frontera ahora?
6. Encuentra en un sistema que uses (calendario, CI, juego) un `sort` + `for` que sea greedy. Documenta criterio, complejidad y si hay garantía de óptimo.
7. Instancia de cambio de monedas donde greedy falle. Compárala con denominaciones COP.
8. Kruskal a mano sobre un grafo de 6 nodos. ¿En qué decisión Union-Find rechaza una arista? ¿Quién domina, el sort o los `find`?

---

## 13. Referencias

- Cormen, Leiserson, Rivest, Stein. *Introduction to Algorithms*. Crecimiento de funciones y notación asintótica; capítulos de greedy, Huffman y MST.
- Kleinberg, Tardos. *Algorithm Design*. Interval scheduling, greedy stays ahead, exchange arguments.
- Dasgupta, Papadimitriou, Vazirani. *Algorithms*. Huffman y MST con argumentos limpios.
- Sipser. *Introduction to the Theory of Computation*. Para distinguir complejidad de un algoritmo de complejidad de un problema (clase P, etc.), cuando el curso llegue ahí.
- Tarjan / implementaciones de Union-Find: cualquier manual de estructuras de datos avanzada.
- Documentación de Kubernetes scheduler y de Dijkstra en librerías de grafos (para ver greedy «en producción»).

---

## Licencia de uso académico

Material de apoyo para clase. Úsalo, adáptalo y contrasta siempre la intuición greedy con una demostración o un contraejemplo.
