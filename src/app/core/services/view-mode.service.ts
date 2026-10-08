import { Injectable, signal } from '@angular/core';

export type ViewMode = 'cinema' | 'standard';

@Injectable({
  providedIn: 'root',
})
export class ViewModeService {
  private readonly STORAGE_KEY = 'portfolio_view_mode';

  readonly mode = signal<ViewMode>(this.getInitialMode());

  private getInitialMode(): ViewMode {
    try {
      if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        typeof window.localStorage.getItem === 'function'
      ) {
        const stored = window.localStorage.getItem(this.STORAGE_KEY);
        if (stored === 'cinema' || stored === 'standard') {
          return stored;
        }
      }
    } catch {
      // Entornos donde localStorage está bloqueado o restringido
    }
    return 'cinema';
  }

  setMode(mode: ViewMode): void {
    this.mode.set(mode);
    try {
      if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        typeof window.localStorage.setItem === 'function'
      ) {
        window.localStorage.setItem(this.STORAGE_KEY, mode);
      }
    } catch {
      // Ignorar errores de almacenamiento privado/restringido
    }
  }

  toggleMode(): void {
    const nextMode = this.mode() === 'cinema' ? 'standard' : 'cinema';
    this.setMode(nextMode);
  }

  isCinema(): boolean {
    return this.mode() === 'cinema';
  }
}
