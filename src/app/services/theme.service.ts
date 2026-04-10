import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private storageKey = 'portfolio-theme';
  mode = signal<ThemeMode>('light');

  constructor() {
    // Prioridad: tema guardado por el usuario; si no existe, preferencia del sistema.
    const saved = this.getSavedTheme();
    this.setTheme(saved ?? this.getPreferredTheme(), false);
  }

  toggle() {
    this.setTheme(this.mode() === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: ThemeMode, persist = true) {
    this.mode.set(theme);
    const root = document.documentElement;
    // El atributo data-theme activa los estilos CSS por tema.
    root.setAttribute('data-theme', theme);

    if (persist) {
      localStorage.setItem(this.storageKey, theme);
    }
  }

  private getSavedTheme(): ThemeMode | null {
    const value = localStorage.getItem(this.storageKey);
    return value === 'dark' || value === 'light' ? value : null;
  }

  private getPreferredTheme(): ThemeMode {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
}