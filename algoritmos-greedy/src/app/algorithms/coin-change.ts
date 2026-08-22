import { ChangeStep } from '../models/change.model';

export function formatMoney(value: number): string {
  return value.toLocaleString('es-CO');
}

export function minCoins(amount: number, coins: number[]): number | null {
  if (amount < 0 || amount > 80_000) {
    return null;
  }
  const inf = amount + 1;
  const dp = new Array<number>(amount + 1).fill(inf);
  dp[0] = 0;
  for (let rest = 1; rest <= amount; rest++) {
    for (const coin of coins) {
      if (coin <= rest && dp[rest - coin] + 1 < dp[rest]) {
        dp[rest] = dp[rest - coin] + 1;
      }
    }
  }
  return dp[amount] >= inf ? null : dp[amount];
}

function totalCoins(counts: Record<number, number>): number {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

export function buildChangeSteps(amount: number, coins: number[]): ChangeStep[] {
  const unique = [...new Set(coins.filter((coin) => coin > 0))].sort((a, b) => b - a);
  const original = Math.max(0, Math.floor(amount));
  const optimal = unique.length ? minCoins(original, unique) : null;

  const base = {
    original,
    ordered: unique,
    greedyCoins: 0,
    optimalCoins: optimal,
  };

  if (unique.length === 0 || original === 0) {
    return [
      {
        ...base,
        kind: original === 0 ? 'done' : 'idle',
        title: original === 0 ? 'No hay vuelto' : 'La caja está vacía',
        detail:
          original === 0
            ? 'El cliente pagó exacto. No hay que devolver nada. Elige Café, Pasaje o Mercado arriba.'
            : 'No hay billetes ni monedas. Agrega una abajo, por ejemplo 1000, 500 o 100.',
        remaining: original,
        counts: {},
      },
    ];
  }

  const steps: ChangeStep[] = [
    {
      ...base,
      kind: 'idle',
      title: 'Tú eres la cajera',
      detail: `El cliente espera $${formatMoney(original)} de vuelto. La regla greedy es simple: en cada paso entrega el billete o moneda más grande que no se pase de lo que falta. Pulsa «Paso» o «Reproducir» para verlo.`,
      remaining: original,
      counts: {},
    },
    {
      ...base,
      kind: 'sort',
      title: 'Poner el dinero de mayor a menor',
      detail: `Así la cajera mira primero lo más grande. El orden queda: ${unique.map((coin) => '$' + formatMoney(coin)).join(' → ')}. No es magia: es la misma idea de «¿tengo un billete grande que aún quepa?».`,
      remaining: original,
      counts: {},
    },
  ];

  let remaining = original;
  const counts: Record<number, number> = {};

  for (const coin of unique) {
    const take = Math.floor(remaining / coin);
    steps.push({
      ...base,
      kind: 'consider',
      title: `¿Cabe $${formatMoney(coin)} en los $${formatMoney(remaining)} que faltan?`,
      detail:
        take === 0
          ? `Cuenta: ${formatMoney(remaining)} ÷ ${formatMoney(coin)} = 0. Un $${formatMoney(coin)} es más grande que lo que falta, así que se pasaría. No lo usa.`
          : `Cuenta: ${formatMoney(remaining)} ÷ ${formatMoney(coin)} = ${take} (sin pasarse). Entonces puede entregar ${take} de $${formatMoney(coin)}.`,
      remaining,
      counts: { ...counts },
      current: coin,
      takeCount: take,
      greedyCoins: totalCoins(counts),
    });

    if (take === 0) {
      steps.push({
        ...base,
        kind: 'skip',
        title: `No usa $${formatMoney(coin)}`,
        detail: `Sigue con el siguiente más chico. La cajera no guarda este billete «por si acaso»: ya decidió que ahora no cabe.`,
        remaining,
        counts: { ...counts },
        current: coin,
        takeCount: 0,
        greedyCoins: totalCoins(counts),
      });
      continue;
    }

    counts[coin] = take;
    remaining -= take * coin;
    steps.push({
      ...base,
      kind: 'take',
      title: `Le da ${take} de $${formatMoney(coin)}`,
      detail: `Eso son $${formatMoney(take * coin)}. Antes faltaban $${formatMoney(remaining + take * coin)}; ahora faltan $${formatMoney(remaining)}. Esa decisión ya no se deshace.`,
      remaining,
      counts: { ...counts },
      current: coin,
      takeCount: take,
      greedyCoins: totalCoins(counts),
    });
  }

  const used = totalCoins(counts);
  const beats =
    optimal !== null && used !== optimal
      ? ` Ojo: con estas fichas raras usó ${used} piezas, pero se podía con ${optimal} (por ejemplo dos de 3). La regla «siempre la más grande» aquí falla.`
      : optimal !== null
        ? ` Usó ${used} piezas, que es el mínimo posible. Con pesos colombianos esta regla casi siempre acierta.`
        : '';

  steps.push({
    ...base,
    kind: 'done',
    title: remaining === 0 ? `Listo: el cliente ya tiene su vuelto` : `No se puede completar el vuelto`,
    detail:
      remaining === 0
        ? `Le entregó exactamente $${formatMoney(original)} con ${used} pieza${used === 1 ? '' : 's'}. Eso es lo que hace el algoritmo: una decisión tras otra, sin probar todas las combinaciones.${beats}`
        : `Todavía faltan $${formatMoney(remaining)} y no hay una moneda tan chica. Agrega por ejemplo $1 abajo.`,
    remaining,
    counts: { ...counts },
    greedyCoins: used,
  });

  return steps;
}
