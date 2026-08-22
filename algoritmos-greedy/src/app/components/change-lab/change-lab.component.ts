import { Component, HostListener, OnDestroy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { buildChangeSteps, formatMoney } from '../../algorithms/coin-change';
import { KIND_LABEL, PRESETS } from '../../models/change.model';

@Component({
  selector: 'app-change-lab',
  imports: [FormsModule],
  templateUrl: './change-lab.component.html',
  styleUrl: './change-lab.component.scss',
})
export class ChangeLabComponent implements OnDestroy {
  readonly presets = PRESETS;
  readonly kindLabel = KIND_LABEL;
  readonly formatMoney = formatMoney;

  readonly amount = signal(1500);
  readonly coins = signal<number[]>([1000, 500, 200, 100, 50]);
  readonly presetId = signal('cafe');
  readonly stepIndex = signal(0);
  readonly playing = signal(false);
  readonly speedMs = signal(900);

  draftAmount = 1500;
  draftCoin = 50;

  readonly steps = computed(() => buildChangeSteps(this.amount(), this.coins()));
  readonly step = computed(() => this.steps()[this.stepIndex()] ?? this.steps()[0]);
  readonly progress = computed(() => {
    const total = Math.max(this.steps().length - 1, 1);
    return `${(this.stepIndex() / total) * 100}%`;
  });
  readonly filled = computed(() => {
    const original = this.step().original;
    if (!original) {
      return '0%';
    }
    return `${((original - this.step().remaining) / original) * 100}%`;
  });
  readonly receipt = computed(() => {
    const counts = this.step().counts;
    return this.step()
      .ordered.filter((coin) => (counts[coin] ?? 0) > 0)
      .map((coin) => ({
        coin,
        count: counts[coin],
        total: counts[coin] * coin,
      }));
  });
  readonly isSuboptimal = computed(() => {
    const { greedyCoins, optimalCoins, kind } = this.step();
    return kind === 'done' && optimalCoins !== null && greedyCoins !== optimalCoins;
  });
  readonly hint = computed(() => {
    const preset = PRESETS.find((item) => item.id === this.presetId());
    if (!preset || preset.price === null || preset.paid === null) {
      return `Hay que devolver $${formatMoney(this.amount())}. La cajera entrega siempre el billete o moneda más grande que todavía quepa.`;
    }
    return `El cliente compró ${preset.item} por $${formatMoney(preset.price)} y pagó $${formatMoney(preset.paid)}. Tú le debes $${formatMoney(preset.amount)} de vuelto.`;
  });

  readonly story = computed(() => {
    const preset = PRESETS.find((item) => item.id === this.presetId());
    if (!preset || preset.price === null || preset.paid === null) {
      return null;
    }
    return preset;
  });

  coinCaption(coin: number): string {
    const step = this.step();
    const used = step.counts[coin] ?? 0;
    if (step.current === coin && step.kind === 'consider') {
      return '¿esta cabe?';
    }
    if (step.current === coin && step.kind === 'take') {
      return `se la${used === 1 ? '' : 's'} damos`;
    }
    if (step.current === coin && step.kind === 'skip') {
      return 'no cabe';
    }
    if (used > 0) {
      return `ya diste ×${used}`;
    }
    return 'disponible';
  }

  private timer: ReturnType<typeof setInterval> | undefined;

  ngOnDestroy(): void {
    this.pause();
  }

  @HostListener('window:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    if (target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(target.tagName)) {
      return;
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.next();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.prev();
    } else if (event.key === ' ') {
      event.preventDefault();
      this.playing() ? this.pause() : this.play();
    }
  }

  loadPreset(id: string): void {
    const preset = PRESETS.find((item) => item.id === id);
    if (!preset) {
      return;
    }
    this.pause();
    this.presetId.set(id);
    this.amount.set(preset.amount);
    this.coins.set([...preset.coins]);
    this.draftAmount = preset.amount;
    this.stepIndex.set(0);
  }

  applyAmount(): void {
    const value = Math.max(0, Math.floor(Number(this.draftAmount) || 0));
    this.pause();
    this.amount.set(value);
    this.presetId.set('custom');
    this.stepIndex.set(0);
  }

  toggleCoin(coin: number): void {
    this.pause();
    this.coins.update((list) =>
      list.includes(coin) ? list.filter((item) => item !== coin) : [...list, coin].sort((a, b) => b - a),
    );
    this.presetId.set('custom');
    this.stepIndex.set(0);
  }

  addCoin(): void {
    const coin = Math.floor(Number(this.draftCoin) || 0);
    if (coin <= 0) {
      return;
    }
    if (!this.coins().includes(coin)) {
      this.toggleCoin(coin);
    }
    this.draftCoin = coin;
  }

  play(): void {
    if (this.stepIndex() >= this.steps().length - 1) {
      this.stepIndex.set(0);
    }
    this.playing.set(true);
    this.clearTimer();
    this.timer = setInterval(() => {
      if (this.stepIndex() >= this.steps().length - 1) {
        this.pause();
        return;
      }
      this.stepIndex.update((index) => index + 1);
    }, this.speedMs());
  }

  pause(): void {
    this.playing.set(false);
    this.clearTimer();
  }

  next(): void {
    this.pause();
    this.stepIndex.update((index) => Math.min(index + 1, this.steps().length - 1));
  }

  prev(): void {
    this.pause();
    this.stepIndex.update((index) => Math.max(index - 1, 0));
  }

  reset(): void {
    this.pause();
    this.stepIndex.set(0);
  }

  setSpeed(value: string): void {
    const playing = this.playing();
    this.speedMs.set(Number(value));
    if (playing) {
      this.play();
    }
  }

  coinState(coin: number): string {
    const step = this.step();
    if (step.current === coin) {
      return step.kind;
    }
    if ((step.counts[coin] ?? 0) > 0) {
      return 'used';
    }
    if (step.ordered.length && step.kind !== 'idle') {
      const index = step.ordered.indexOf(coin);
      const currentIndex = step.current === undefined ? -1 : step.ordered.indexOf(step.current);
      if (currentIndex > index || step.kind === 'done') {
        return 'past';
      }
    }
    return 'idle';
  }

  private clearTimer(): void {
    if (this.timer !== undefined) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
}
