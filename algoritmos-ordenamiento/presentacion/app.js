const SCORE = { rojo: 4, naranja: 3, amarillo: 2, verde: 1 };

function minutosDesde20(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m - 20 * 60;
}

function makePaciente(p) {
  const min = minutosDesde20(p.llegada);
  return {
    ...p,
    minutos: min,
    clave: SCORE[p.color] * 10000 - min,
  };
}

const PACIENTES = [
  makePaciente({ id: "P1", nombre: "Juan Cano", edad: 22, motivo: "Tobillo hinchado", color: "verde", llegada: "20:51" }),
  makePaciente({ id: "P2", nombre: "Marta Giraldo", edad: 67, motivo: "Dolor torácico", color: "rojo", llegada: "21:04" }),
  makePaciente({ id: "P3", nombre: "Andrés Villa", edad: 41, motivo: "Fractura de antebrazo", color: "naranja", llegada: "20:58" }),
  makePaciente({ id: "P4", nombre: "Sofía Rendón", edad: 8, motivo: "Fiebre", color: "amarillo", llegada: "21:02" }),
  makePaciente({ id: "P5", nombre: "Pedro Alzate", edad: 55, motivo: "Herida en la mano", color: "amarillo", llegada: "21:07" }),
  makePaciente({ id: "P6", nombre: "Lucía Monsalve", edad: 34, motivo: "Migraña", color: "verde", llegada: "21:00" }),
  makePaciente({ id: "P7", nombre: "Ricardo Peña", edad: 72, motivo: "Disnea", color: "naranja", llegada: "21:11" }),
  makePaciente({ id: "P8", nombre: "Elena Duque", edad: 19, motivo: "Corte superficial", color: "verde", llegada: "21:18" }),
];

const ORDEN = PACIENTES.slice().sort((a, b) => b.clave - a.clave);

function snapshot(arr) {
  return arr.map((p) => ({ ...p }));
}

function traceHeapSort(source) {
  const a = snapshot(source);
  const n0 = a.length;
  const steps = [];
  let comps = 0;
  const extracted = [];

  function push(extra) {
    steps.push({
      heap: snapshot(a),
      extracted: extracted.slice(),
      comps,
      ...extra,
    });
  }

  function siftDown(n, i, phase) {
    while (true) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      let largest = i;
      if (l < n) {
        comps += 1;
        if (a[l].clave > a[largest].clave) largest = l;
      }
      if (r < n) {
        comps += 1;
        if (a[r].clave > a[largest].clave) largest = r;
      }
      if (largest === i) {
        push({
          kind: "ok",
          phase,
          n,
          focus: [i],
          caption: `${a[i].nombre} cumple el invariante en la posición ${i}.`,
        });
        break;
      }
      push({
        kind: "swap",
        phase,
        n,
        focus: [i, largest],
        caption: `${a[largest].nombre} (clave ${a[largest].clave}) sube sobre ${a[i].nombre} (${a[i].clave}).`,
      });
      [a[i], a[largest]] = [a[largest], a[i]];
      push({
        kind: "swapped",
        phase,
        n,
        focus: [i, largest],
        caption: `Intercambio hecho. Sigue bajando desde ${a[largest].nombre}.`,
      });
      i = largest;
    }
  }

  push({
    kind: "start",
    phase: "build",
    n: n0,
    focus: [],
    caption: "Arreglo en orden de llegada. Aún no es un heap: la raíz no es Marta.",
  });

  for (let i = Math.floor(n0 / 2) - 1; i >= 0; i--) {
    push({
      kind: "sift-start",
      phase: "build",
      n: n0,
      focus: [i],
      caption: `build-heap: sift-down desde el padre ${i} (${a[i].nombre}).`,
    });
    siftDown(n0, i, "build");
  }

  push({
    kind: "built",
    phase: "extract",
    n: n0,
    focus: [0],
    caption: `Heap listo. La raíz es ${a[0].nombre} — el más urgente del lote.`,
  });

  for (let end = n0 - 1; end > 0; end--) {
    push({
      kind: "extract",
      phase: "extract",
      n: end + 1,
      focus: [0, end],
      caption: `Extraer ${a[0].nombre}. Se va al final del arreglo y el heap se achica a ${end}.`,
    });
    extracted.push(a[0]);
    [a[0], a[end]] = [a[end], a[0]];
    push({
      kind: "extracted",
      phase: "extract",
      n: end,
      focus: [0],
      caption: `${extracted[extracted.length - 1].nombre} queda atendido. Sift-down en la nueva raíz ${a[0].nombre}.`,
    });
    siftDown(end, 0, "extract");
  }
  extracted.push(a[0]);
  push({
    kind: "done",
    phase: "done",
    n: 0,
    focus: [],
    caption: "Lote vacío. El orden de extracciones es el orden de atención.",
  });

  return steps;
}

function fillTabla() {
  const tb = document.getElementById("tabla-pacientes");
  tb.innerHTML = PACIENTES.map(
    (p) => `<tr>
      <td><i class="dot dot--${p.color}"></i></td>
      <td>${p.nombre}, ${p.edad}</td>
      <td>${p.motivo}</td>
      <td>${p.color}</td>
      <td>${p.llegada}</td>
      <td>${p.clave}</td>
    </tr>`
  ).join("");
}

function fillSolucion() {
  const ol = document.getElementById("solucion");
  ol.innerHTML = ORDEN.map(
    (p, i) =>
      `<li><i class="dot dot--${p.color}"></i> ${i + 1}. ${p.nombre} — ${p.motivo} (${p.color}, ${p.llegada}, clave ${p.clave})</li>`
  ).join("");
}

function nodeHTML(p, on, out) {
  if (!p) return "";
  const cls = ["node"];
  if (on) cls.push("node--on");
  if (out) cls.push("node--out");
  return `<div class="${cls.join(" ")}">
    <b>${p.nombre.split(" ")[0]}</b>
    <span>${p.color} · ${p.llegada}</span>
  </div>`;
}

function renderTree(step) {
  const tree = document.getElementById("tree");
  const heap = step.heap;
  const n = step.n;
  const focus = new Set(step.focus || []);
  const rows = [[0], [1, 2], [3, 4, 5, 6], [7]];
  tree.innerHTML = rows
    .map((idx) => {
      const cells = idx
        .filter((i) => i < heap.length)
        .map((i) => nodeHTML(heap[i], focus.has(i), i >= n))
        .join("");
      return `<div class="tree-row">${cells}</div>`;
    })
    .join("");
  document.getElementById("heap-caption").textContent = step.caption;
  document.getElementById("heap-kind").textContent =
    step.phase === "build"
      ? "fase: build-heap Θ(n)"
      : step.phase === "extract"
        ? "fase: extraer Θ(n log n)"
        : "fase: terminado";
  document.getElementById("heap-stats").textContent = `Comparaciones de sift: ${step.comps}`;
  const ol = document.getElementById("attended");
  if (!step.extracted.length) {
    ol.innerHTML = "<li>Nadie aún</li>";
  } else {
    ol.innerHTML = step.extracted
      .map((p, i) => `<li>${i + 1}. ${p.nombre} (${p.color})</li>`)
      .join("");
  }
}

const heapSteps = traceHeapSort(PACIENTES);
let heapIndex = 0;

function heapPaint() {
  renderTree(heapSteps[heapIndex]);
}

function heapStep() {
  if (heapIndex < heapSteps.length - 1) {
    heapIndex += 1;
    heapPaint();
  }
}

function heapReset() {
  heapIndex = 0;
  heapPaint();
}

const slides = [...document.querySelectorAll("[data-slide]")];
let slideIndex = 0;

function showSlide(i) {
  slideIndex = Math.max(0, Math.min(slides.length - 1, i));
  slides.forEach((s, k) => s.classList.toggle("is-on", k === slideIndex));
  document.getElementById("pos").textContent = `${slideIndex + 1} / ${slides.length}`;
  document.getElementById("bar").style.width = `${((slideIndex + 1) / slides.length) * 100}%`;
}

function next() {
  showSlide(slideIndex + 1);
}

function prev() {
  showSlide(slideIndex - 1);
}

document.getElementById("next").addEventListener("click", next);
document.getElementById("prev").addEventListener("click", prev);
document.getElementById("heap-step").addEventListener("click", (e) => {
  e.stopPropagation();
  heapStep();
});
document.getElementById("heap-reset").addEventListener("click", (e) => {
  e.stopPropagation();
  heapReset();
});

document.addEventListener("keydown", (e) => {
  if (e.target && (e.target.tagName === "BUTTON" || e.target.tagName === "SELECT" || e.target.tagName === "A")) {
    return;
  }
  if (e.key === " " && slides[slideIndex].classList.contains("slide--lab")) {
    e.preventDefault();
    heapStep();
    return;
  }
  if (e.key === "ArrowRight" || e.key === " ") {
    e.preventDefault();
    next();
  } else if (e.key === "ArrowLeft") {
    e.preventDefault();
    prev();
  }
});

fillTabla();
fillSolucion();
heapPaint();
showSlide(0);
