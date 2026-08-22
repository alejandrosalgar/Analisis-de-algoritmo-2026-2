export interface ChangePreset {
  id: string;
  label: string;
  item: string;
  price: number | null;
  paid: number | null;
  amount: number;
  coins: number[];
}

export type ChangeKind = 'idle' | 'sort' | 'consider' | 'take' | 'skip' | 'done';

export interface ChangeStep {
  kind: ChangeKind;
  title: string;
  detail: string;
  remaining: number;
  original: number;
  ordered: number[];
  counts: Record<number, number>;
  current?: number;
  takeCount?: number;
  greedyCoins: number;
  optimalCoins: number | null;
}

export const KIND_LABEL: Record<ChangeKind, string> = {
  idle: 'empezar',
  sort: 'ordenar',
  consider: 'preguntar',
  take: 'entregar',
  skip: 'no cabe',
  done: 'terminó',
};

export const PRESETS: ChangePreset[] = [
  {
    id: 'cafe',
    label: 'Café',
    item: 'un café',
    price: 3500,
    paid: 5000,
    amount: 1500,
    coins: [1000, 500, 200, 100, 50],
  },
  {
    id: 'bus',
    label: 'Pasaje',
    item: 'un pasaje',
    price: 2200,
    paid: 5000,
    amount: 2800,
    coins: [2000, 1000, 500, 200, 100],
  },
  {
    id: 'mercado',
    label: 'Mercado',
    item: 'el mercado',
    price: 76300,
    paid: 100000,
    amount: 23700,
    coins: [20000, 10000, 5000, 2000, 1000, 500, 200, 100],
  },
  {
    id: 'trampa',
    label: 'Tienda rara',
    item: 'un dulce',
    price: 4,
    paid: 10,
    amount: 6,
    coins: [4, 3, 1],
  },
];
