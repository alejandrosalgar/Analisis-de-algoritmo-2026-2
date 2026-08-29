const COP = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function resta(o) {
  return o.minutosPromesa - o.transcurrido;
}

function cmp(a, b) {
  const ra = resta(a);
  const rb = resta(b);
  if (ra !== rb) return ra - rb;
  if (a.barrio !== b.barrio) return a.barrio.localeCompare(b.barrio, "es");
  if (a.valor !== b.valor) return b.valor - a.valor;
  return 0;
}

function why(a, b) {
  const ra = resta(a);
  const rb = resta(b);
  if (ra !== rb) {
    return ra < rb
      ? `${a.id} resta ${ra} min, ${b.id} resta ${rb}`
      : `${b.id} resta ${rb} min, ${a.id} resta ${ra}`;
  }
  if (a.barrio !== b.barrio) {
    return `misma resta ${ra}; barrio ${a.barrio < b.barrio ? a.barrio : b.barrio} primero`;
  }
  if (a.valor !== b.valor) {
    return `mismo barrio; gana el de mayor valor`;
  }
  return `empate total: Merge conserva el orden original (estable)`;
}

function lateCount(list) {
  return list.filter((o) => resta(o) < 0).length;
}

function clone(xs) {
  return xs.slice();
}

const PICO = [
  { id: "A-104", cliente: "Laura Restrepo", barrio: "Laureles", minutosPromesa: 40, transcurrido: 28, valor: 42000 },
  { id: "A-107", cliente: "Andrés Pérez", barrio: "El Poblado", minutosPromesa: 35, transcurrido: 33, valor: 89000 },
  { id: "A-109", cliente: "Camila Hoyos", barrio: "Centro", minutosPromesa: 40, transcurrido: 44, valor: 31000 },
  { id: "A-111", cliente: "Diego Marín", barrio: "Belén", minutosPromesa: 45, transcurrido: 23, valor: 18000 },
  { id: "A-112", cliente: "Sofía Quintero", barrio: "Envigado", minutosPromesa: 40, transcurrido: 33, valor: 55000 },
  { id: "A-115", cliente: "Mateo Úsuga", barrio: "Itagüí", minutosPromesa: 45, transcurrido: 27, valor: 27000 },
  { id: "A-118", cliente: "Valentina Ruiz", barrio: "Boston", minutosPromesa: 35, transcurrido: 34, valor: 64000 },
  { id: "A-119", cliente: "Pablo Cárdenas", barrio: "Prado", minutosPromesa: 40, transcurrido: 25, valor: 22000 },
  { id: "A-121", cliente: "Isabella Gómez", barrio: "Laureles", minutosPromesa: 40, transcurrido: 31, valor: 47000 },
  { id: "A-122", cliente: "Santiago López", barrio: "El Poblado", minutosPromesa: 35, transcurrido: 33, valor: 120000 },
  { id: "A-124", cliente: "Mariana Vélez", barrio: "Centro", minutosPromesa: 40, transcurrido: 41, valor: 15000 },
  { id: "A-128", cliente: "Nicolás Herrera", barrio: "Belén", minutosPromesa: 45, transcurrido: 20, valor: 91000 },
];

const EMPATES = [
  { id: "B-01", cliente: "Ana Mejía", barrio: "Laureles", minutosPromesa: 40, transcurrido: 32, valor: 28000 },
  { id: "B-02", cliente: "Carlos Díaz", barrio: "Centro", minutosPromesa: 40, transcurrido: 32, valor: 28000 },
  { id: "B-03", cliente: "Elena Franco", barrio: "Centro", minutosPromesa: 40, transcurrido: 32, valor: 81000 },
  { id: "B-04", cliente: "Tomás Gil", barrio: "Laureles", minutosPromesa: 40, transcurrido: 32, valor: 81000 },
  { id: "B-05", cliente: "Lucía Pineda", barrio: "Belén", minutosPromesa: 40, transcurrido: 38, valor: 19000 },
  { id: "B-06", cliente: "Iván Soto", barrio: "Belén", minutosPromesa: 40, transcurrido: 10, valor: 44000 },
];

const BASE_NUEVO = [
  { id: "C-01", cliente: "Camila Hoyos", barrio: "Centro", minutosPromesa: 40, transcurrido: 44, valor: 31000 },
  { id: "C-02", cliente: "Mariana Vélez", barrio: "Centro", minutosPromesa: 40, transcurrido: 41, valor: 15000 },
  { id: "C-03", cliente: "Valentina Ruiz", barrio: "Boston", minutosPromesa: 35, transcurrido: 34, valor: 64000 },
  { id: "C-04", cliente: "Santiago López", barrio: "El Poblado", minutosPromesa: 35, transcurrido: 33, valor: 120000 },
  { id: "C-05", cliente: "Andrés Pérez", barrio: "El Poblado", minutosPromesa: 35, transcurrido: 33, valor: 89000 },
  { id: "C-06", cliente: "Sofía Quintero", barrio: "Envigado", minutosPromesa: 40, transcurrido: 33, valor: 55000 },
  { id: "C-07", cliente: "Isabella Gómez", barrio: "Laureles", minutosPromesa: 40, transcurrido: 31, valor: 47000 },
  { id: "C-08", cliente: "Laura Restrepo", barrio: "Laureles", minutosPromesa: 40, transcurrido: 28, valor: 42000 },
];

const PEDIDO_NUEVO = {
  id: "C-09",
  cliente: "Julián Arango",
  barrio: "El Poblado",
  minutosPromesa: 35,
  transcurrido: 36,
  valor: 73000,
};

function traceMergeSort(items) {
  const steps = [];
  let comparisons = 0;

  function merge(left, right, depth) {
    const out = [];
    let i = 0;
    let j = 0;
    steps.push({
      kind: "merge-start",
      left: clone(left),
      right: clone(right),
      out: [],
      depth,
      comparisons,
      caption: `Fusionar ${left.length} + ${right.length} (nivel ${depth}). El menor según la clave sale primero.`,
    });
    while (i < left.length && j < right.length) {
      comparisons += 1;
      const L = left[i];
      const R = right[j];
      const takeLeft = cmp(L, R) <= 0;
      const winner = takeLeft ? L : R;
      steps.push({
        kind: "compare",
        left: clone(left).slice(i),
        right: clone(right).slice(j),
        out: clone(out),
        a: L.id,
        b: R.id,
        take: winner.id,
        depth,
        comparisons,
        caption: `¿${L.id} o ${R.id}? ${why(L, R)}. Sale ${winner.id} (${winner.cliente}).`,
      });
      if (takeLeft) out.push(left[i++]);
      else out.push(right[j++]);
      steps.push({
        kind: "take",
        left: clone(left).slice(i),
        right: clone(right).slice(j),
        out: clone(out),
        taken: winner.id,
        depth,
        comparisons,
        caption: `${winner.id} entra a la corrida. Quedan ${left.length - i} a la izquierda y ${right.length - j} a la derecha.`,
      });
    }
    while (i < left.length) out.push(left[i++]);
    while (j < right.length) out.push(right[j++]);
    steps.push({
      kind: "merge-done",
      left: [],
      right: [],
      out: clone(out),
      depth,
      comparisons,
      caption: `Corrida lista: ${out.map((o) => o.id).join(" → ")}.`,
    });
    return out;
  }

  function sort(list, depth) {
    if (list.length <= 1) return list;
    const mid = Math.ceil(list.length / 2);
    steps.push({
      kind: "split",
      left: clone(list).slice(0, mid),
      right: clone(list).slice(mid),
      out: [],
      depth,
      comparisons,
      caption: `Dividir ${list.length} pedidos en ${mid} + ${list.length - mid} (nivel ${depth}).`,
    });
    const left = sort(list.slice(0, mid), depth + 1);
    const right = sort(list.slice(mid), depth + 1);
    return merge(left, right, depth);
  }

  const sorted = sort(items.slice(), 0);
  steps.push({
    kind: "done",
    left: [],
    right: [],
    out: clone(sorted),
    comparisons,
    caption: `Orden de despacho listo. Merge Sort sobre n = ${items.length} es Θ(n log n).`,
  });
  return { steps, sorted, comparisons };
}

function traceInsertion(sorted, nuevo) {
  const steps = [];
  let comparisons = 0;
  const out = sorted.slice();
  steps.push({
    kind: "split",
    left: clone(out),
    right: [nuevo],
    out: [],
    comparisons: 0,
    caption: `La cola ya está ordenada. Entra ${nuevo.id} (${nuevo.cliente}, resta ${resta(nuevo)} min). Insertion, no un Merge de n+1.`,
  });
  let i = out.length - 1;
  while (i >= 0) {
    comparisons += 1;
    const cur = out[i];
    const goesBefore = cmp(nuevo, cur) < 0;
    steps.push({
      kind: "compare",
      left: [cur],
      right: [nuevo],
      out: clone(out),
      a: cur.id,
      b: nuevo.id,
      take: goesBefore ? nuevo.id : cur.id,
      comparisons,
      caption: goesBefore
        ? `${nuevo.id} es más urgente que ${cur.id} (${why(nuevo, cur)}). ${cur.id} se recorre una posición.`
        : `${cur.id} va antes que ${nuevo.id}. Hueco encontrado.`,
    });
    if (!goesBefore) break;
    out[i + 1] = cur;
    i -= 1;
    steps.push({
      kind: "take",
      left: i >= 0 ? [out[i]] : [],
      right: [nuevo],
      out: clone(out),
      taken: cur.id,
      comparisons,
      caption: `Desplazar ${cur.id} a la derecha. Sigue buscando hacia la cabeza de la cola.`,
    });
  }
  out[i + 1] = nuevo;
  steps.push({
    kind: "done",
    left: [],
    right: [],
    out: clone(out),
    comparisons,
    caption: `${nuevo.id} quedó en la posición ${i + 2}. Insertion de uno solo es O(n), no Θ(n log n).`,
  });
  return { steps, sorted: out, comparisons };
}

function restaClass(o) {
  const r = resta(o);
  if (r < 0) return "resta--late";
  if (r <= 5) return "resta--hot";
  return "resta--ok";
}

function cardHTML(o, flags) {
  const cls = ["card"];
  if (flags.cmp) cls.push("card--cmp");
  if (flags.take) cls.push("card--take");
  if (resta(o) < 0) cls.push("card--late");
  const r = resta(o);
  const rLabel = r < 0 ? `${r} min` : `${r} min`;
  return `<article class="${cls.join(" ")}" data-id="${o.id}">
    <div class="card__id"><span>${o.id}</span><span>${o.barrio}</span></div>
    <div class="card__name">${o.cliente}</div>
    <div class="card__meta">
      <span class="resta ${restaClass(o)}">${rLabel}</span>
      <span>${COP.format(o.valor)}</span>
    </div>
  </article>`;
}

function renderLane(el, list, step) {
  el.innerHTML = list
    .map((o) =>
      cardHTML(o, {
        cmp: step && (o.id === step.a || o.id === step.b),
        take: step && (o.id === step.taken || o.id === step.take),
      })
    )
    .join("");
}

const ui = {
  caption: document.getElementById("caption"),
  cmp: document.getElementById("stat-cmp"),
  late: document.getElementById("stat-late"),
  first: document.getElementById("stat-first"),
  bound: document.getElementById("stat-bound"),
  left: document.getElementById("left"),
  right: document.getElementById("right"),
  out: document.getElementById("out"),
  board: document.getElementById("board"),
  nLabel: document.getElementById("n-label"),
  play: document.getElementById("btn-play"),
  step: document.getElementById("btn-step"),
  reset: document.getElementById("btn-reset"),
  speed: document.getElementById("speed"),
};

const state = {
  preset: "pico",
  source: [],
  steps: [],
  index: -1,
  playing: false,
  timer: 0,
  sorted: [],
  bound: "Θ(n log n)",
};

function loadPreset(id) {
  state.preset = id;
  document.querySelectorAll(".pill").forEach((p) => {
    p.classList.toggle("pill--on", p.dataset.preset === id);
  });
  stopPlay();
  if (id === "pico") {
    state.source = PICO.map((o) => ({ ...o }));
    const traced = traceMergeSort(state.source);
    state.steps = traced.steps;
    state.sorted = traced.sorted;
    state.bound = "Θ(n log n)";
  } else if (id === "empates") {
    state.source = EMPATES.map((o) => ({ ...o }));
    const traced = traceMergeSort(state.source);
    state.steps = traced.steps;
    state.sorted = traced.sorted;
    state.bound = "Θ(n log n)";
  } else {
    state.source = BASE_NUEVO.map((o) => ({ ...o }));
    const traced = traceInsertion(state.source, { ...PEDIDO_NUEVO });
    state.steps = traced.steps;
    state.sorted = traced.sorted;
    state.bound = "O(n)";
  }
  state.index = -1;
  paintIdle();
}

function paintIdle() {
  const step = {
    caption:
      state.preset === "nuevo"
        ? "Cola ya despachada (ordenada). El pedido nuevo de El Poblado ya va tarde: hay que insertarlo."
        : "Lote en el orden de llegada. Pulsa Paso para dividir.",
    left: [],
    right: [],
    out: [],
    comparisons: 0,
  };
  paint(step, true);
}

function paint(step, idle) {
  ui.caption.textContent = step.caption;
  ui.cmp.textContent = String(step.comparisons ?? 0);
  ui.late.textContent = String(lateCount(state.source) + (state.preset === "nuevo" && resta(PEDIDO_NUEVO) < 0 ? 1 : 0));
  const head = (step.kind === "done" ? step.out : state.sorted)[0];
  ui.first.textContent = head ? head.id : "—";
  ui.bound.textContent = state.bound;
  ui.nLabel.textContent = `(n = ${state.source.length}${
    state.preset === "nuevo" ? " + 1" : ""
  })`;
  renderLane(ui.left, step.left || [], step);
  renderLane(ui.right, step.right || [], step);
  renderLane(ui.out, step.out || [], step);
  const board = idle
    ? state.preset === "nuevo"
      ? state.source.concat(PEDIDO_NUEVO)
      : state.source
    : step.kind === "done"
      ? step.out
      : state.source;
  ui.board.innerHTML = board
    .map((o, idx) => {
      const html = cardHTML(o, {
        cmp: o.id === step.a || o.id === step.b,
        take: o.id === step.taken || o.id === step.take,
      });
      if (step.kind === "done") {
        return html.replace(
          'class="card',
          `class="card" style="order:${idx}"`
        );
      }
      return html;
    })
    .join("");
  const last = state.index >= state.steps.length - 1 && state.index >= 0;
  ui.step.disabled = last;
  ui.play.disabled = last;
}

function goStep() {
  if (state.index >= state.steps.length - 1) {
    stopPlay();
    return;
  }
  state.index += 1;
  paint(state.steps[state.index], false);
  if (state.index >= state.steps.length - 1) stopPlay();
}

function stopPlay() {
  state.playing = false;
  ui.play.textContent = "Reproducir";
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = 0;
  }
}

function togglePlay() {
  if (state.playing) {
    stopPlay();
    return;
  }
  if (state.index >= state.steps.length - 1) return;
  state.playing = true;
  ui.play.textContent = "Pausa";
  const tick = () => goStep();
  tick();
  state.timer = window.setInterval(tick, Number(ui.speed.value));
}

document.querySelectorAll(".pill").forEach((p) => {
  p.addEventListener("click", () => loadPreset(p.dataset.preset));
});
ui.step.addEventListener("click", () => {
  stopPlay();
  goStep();
});
ui.play.addEventListener("click", togglePlay);
ui.reset.addEventListener("click", () => loadPreset(state.preset));
ui.speed.addEventListener("change", () => {
  if (!state.playing) return;
  stopPlay();
  togglePlay();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    stopPlay();
    goStep();
  } else if (e.key === " ") {
    e.preventDefault();
    togglePlay();
  }
});

loadPreset("pico");
