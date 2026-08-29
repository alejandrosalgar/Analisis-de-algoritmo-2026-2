# Análisis de algoritmos · 2026-2

Material del curso (ITM). El hilo de esta guía es: **primero complejidad**, después **algoritmos greedy** y **algoritmos de ordenamiento**.

| Tema | Guía | Para proyectar en clase |
| --- | --- | --- |
| Complejidad y greedy | [`algoritmos-greedy/README.md`](algoritmos-greedy/README.md) | Laboratorio Angular del vuelto |
| Ordenamiento | [`README-ORDENAMIENTO.md`](README-ORDENAMIENTO.md) | [Despacho (Merge Sort)](algoritmos-ordenamiento/desarrollo/index.html) y [triaje (Heap Sort)](algoritmos-ordenamiento/presentacion/index.html) |

```bash
cd algoritmos-greedy
npm install
npm start
```

Abre [http://localhost:4200](http://localhost:4200).

Las piezas de **ordenamiento** no usan Node: abre [`algoritmos-ordenamiento/index.html`](algoritmos-ordenamiento/index.html) en el navegador (o Live Server).

---

## Qué es complejidad algorítmica

Un algoritmo no se evalúa solo por si acierta. Se evalúa por **cuánto cuesta** acertar cuando la entrada crece.

La **complejidad algorítmica** describe cómo aumentan el **tiempo** (número de operaciones elementales) y el **espacio** (memoria extra) en función del tamaño `n` de la instancia: cuántas actividades, vértices, caracteres o registros hay.

No se reporta «tardó 37 ms en este equipo». Eso mezcla lenguaje, CPU y ruido del sistema. El análisis usa un modelo abstracto y **notación asintótica**:

| Símbolo | Significado | Lectura |
| --- | --- | --- |
| `O(f(n))` | cota superior | a lo sumo del orden de `f` |
| `Ω(f(n))` | cota inferior | por lo menos del orden de `f` |
| `Θ(f(n))` | ambas | exactamente del orden de `f` |

Se ignora la constante y los términos chicos. Importa la **familia de crecimiento**: `O(1)`, `O(log n)`, `O(n)`, `O(n log n)`, `O(n²)`, `O(2^n)`…

Para `n = 40`, enumerar `2^n` subconjuntos ya es inviable; un `O(n log n)` sigue siendo inmediato. Elegir la estrategia del algoritmo es, en la práctica, elegir esa familia.

El **peor caso** es la cifra con la que se comparan algoritmos en este curso: si esa cota es aceptable, el resto también. Un mismo problema puede tener un algoritmo correcto exponencial (fuerza bruta) y otro polinomial (por ejemplo greedy o programación dinámica). El oficio es: **correctitud + cota**, no solo el código.

---

## Introducción a los algoritmos greedy

Un algoritmo **greedy** (voraz) construye la solución **decisión a decisión**. En cada paso toma la opción que **en ese instante** parece mejor, según una regla local, y **no se retracta**.

No recorre las `2^n` combinaciones. Casi siempre ordena (`O(n log n)`) y hace una pasada lineal. La complejidad suele ser **atractiva**. Lo difícil es otra cosa: si esa regla local produce un **óptimo global**.

Tres piezas:

1. **Candidatos** — de dónde sale el siguiente elemento.
2. **Criterio de selección** — cómo se puntúa (menor hora de fin, mayor densidad valor/peso, arista más barata…).
3. **Prueba de factibilidad** — si cabe con lo ya elegido.

Es correcto cuando hay **elección greedy** (existe una decisión local que siempre puede estar en un óptimo) y **subestructura óptima** (el resto es un subproblema de la misma forma). Si falta alguna, el procedimiento sigue siendo greedy y rápido, pero pasa a ser **heurística**.

El laboratorio anima el **vuelto de una caja**: siempre la moneda más grande que quepa. En COP suele ser óptimo y `O(k)`. El ejemplo *Trampa* (6 con piezas 4, 3, 1) muestra la misma cota con peor respuesta.

---

## Ejemplos: complejidad bruta vs greedy optimizado

Misma pregunta, dos algoritmos. El bruto **enumera** soluciones; el greedy **ordena y no vuelve atrás**. En estos ejemplos el greedy es óptimo: se gana tiempo, no se regala calidad.

| `n` | Bruto `2^n` | Greedy `n log₂ n` |
| --- | --- | --- |
| 10 | 1 024 | ~33 |
| 20 | ~1 millón | ~86 |
| 30 | ~1 000 millones | ~147 |
| 40 | ~1 billón | ~213 |

### Selección de actividades

Cuatro clases: Cálculo `[1,4]`, Tutoría `[3,5]`, Examen `[0,6]`, Laboratorio `[5,7]`.

- **Bruto:** `2^4 = 16` subconjuntos, y en cada uno revisar solapes → `O(n² 2^n)`. Óptimo: `{Cálculo, Laboratorio}`.
- **Greedy:** ordenar por hora de fin (`O(n log n)`), elegir Cálculo, descartar Tutoría y Examen, elegir Laboratorio.

Con el ejemplo *Mercado* de la app ($23.700) el greedy mira 8 denominaciones; enumerar combinaciones del monto ya no es razonable.

### Mochila fraccionaria

Capacidad 50. Café 60/10 (densidad 6), cacao 100/20 (5), azúcar 120/30 (4).

- **Bruto 0/1:** 8 subconjuntos, mejor valor entero 220 (cacao+azúcar). `O(n 2^n)`.
- **Greedy (se puede partir):** café + cacao + 2/3 del azúcar = **240**. `O(n log n)`.

Si los frascos no se abren (mochila 0/1), este greedy **deja de ser exacto**; ahí el exacto razonable es DP `O(nW)`.

### Cambio de monedas (COP)

Devolver 87 con `{50, 20, 10, 5, 1}`.

- **Bruto:** recursión `O(k^{monto})`; con DP, `O(k · 87)`.
- **Greedy:** `50+20+10+5+1+1` → 6 monedas, `O(k)`. En COP/USD/EUR acierta. Con monedas `{1,3,4}` y monto 6 falla: greedy 3 monedas, óptimo 2.

### Huffman, MST y rutas

| Problema | Bruto | Greedy |
| --- | --- | --- |
| Huffman (`n` símbolos) | ~Catalan árboles de prefijo | heap `O(n log n)` |
| MST, `n` ciudades | `n^{n-2}` árboles (Cayley) o `C(m, n-1)` | Kruskal `O(m log m)` |
| Ruta más corta, pesos ≥ 0 | hasta `n!` caminos simples | Dijkstra `O((n+m) log n)` |

Instancias chicas: 4 nodos → 16 árboles de recubrimiento vs. ordenar 6 aristas. 10 semáforos → `10! ≈ 3.6` millones de caminos vs. Dijkstra en milisegundos.

El desarrollo de cada cuenta (y cuándo el greedy **no** es óptimo) está en la [sección 3 de la guía completa](algoritmos-greedy/README.md#3-ejemplos-complejidad-bruta-frente-a-greedy-optimizado). Demostración, plantillas, usos en software y en el día a día: el resto de [`algoritmos-greedy/README.md`](algoritmos-greedy/README.md).
