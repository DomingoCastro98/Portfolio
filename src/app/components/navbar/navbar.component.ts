import { Component, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav [class.scrolled]="scrolled()">
      <div class="nav-inner container">
        <div class="nav-brand">
          <div class="brand-mark">DC</div>
          <div class="brand-copy">
            <span class="brand-name">Domingo Castro</span>
            <span class="brand-subtitle">portfolio</span>
          </div>
        </div>

        <div class="nav-links" [class.open]="menuOpen()">
          <a href="#inicio" (click)="close()">Inicio</a>
          <a href="#sobre-mi" (click)="close()">Sobre mí</a>
          <a href="#habilidades" (click)="close()">Habilidades</a>
          <a href="#proyectos" (click)="close()">Proyectos</a>
          <a href="#contacto" (click)="close()">Contacto</a>
        </div>

        <button class="theme-toggle" (click)="toggleTheme()" type="button" [attr.aria-label]="theme() === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'">
          <span *ngIf="theme() === 'light'">🌙</span>
          <span *ngIf="theme() === 'dark'">☀️</span>
        </button>

        <button class="hamburger" (click)="toggleMenu()" [class.open]="menuOpen()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    nav {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 100;
      transition: all 0.3s ease;
      padding: 1rem 0 0;
    }
    nav.scrolled {
      padding-top: 0.75rem;
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      background: rgba(255, 255, 255, 0.52);
      border: 1px solid rgba(31, 36, 48, 0.08);
      border-radius: 24px;
      padding: 0.95rem 1.15rem;
      box-shadow: 0 14px 36px rgba(47, 39, 29, 0.08);
      backdrop-filter: blur(16px);
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      min-width: 0;
    }
    .brand-mark {
      width: 2.35rem;
      height: 2.35rem;
      display: grid;
      place-items: center;
      border-radius: 14px;
      background: linear-gradient(135deg, rgba(198,79,61,0.14), rgba(47,111,143,0.14));
      color: var(--text-primary);
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      border: 1px solid rgba(31,36,48,0.08);
      flex-shrink: 0;
    }
    .brand-copy {
      display: flex;
      flex-direction: column;
      gap: 0.05rem;
      min-width: 0;
    }
    .brand-name {
      font-family: var(--font-display);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-primary);
      line-height: 1;
      white-space: nowrap;
    }
    .brand-subtitle {
      font-family: var(--font-mono);
      font-size: 0.62rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .nav-links {
      display: flex;
      gap: 0.35rem;
      padding: 0.3rem;
      background: rgba(31, 36, 48, 0.05);
      border-radius: 999px;
    }
    .nav-links a {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      color: var(--text-secondary); 
      transition: color 0.2s;
      position: relative;
      padding: 0.55rem 0.95rem;
      border-radius: 999px;
    }
    .nav-links a:hover {
      color: var(--text-primary);
      background: rgba(198, 79, 61, 0.08);
    }
    .theme-toggle {
      width: 42px;
      height: 42px;
      border-radius: 14px;
      border: 1px solid rgba(31, 36, 48, 0.08);
      background: rgba(255,255,255,0.72);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      color: var(--text-primary);
      flex-shrink: 0;
      box-shadow: 0 10px 24px rgba(47, 39, 29, 0.08);
      transition: transform 0.2s ease, background 0.2s ease;
    }
    .theme-toggle:hover {
      transform: translateY(-1px);
      background: rgba(255,255,255,0.92);
    }
    .hamburger {
      display: none;
      flex-direction: column;
      gap: 5px;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(31, 36, 48, 0.08);
      border-radius: 16px;
      padding: 0.75rem;
    }
    .hamburger span {
      display: block;
      width: 22px;
      height: 2px;
      background: var(--text-primary);
      transition: all 0.3s;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    @media (max-width: 768px) {
      nav { padding-top: 0.75rem; }
      .nav-inner {
        border-radius: 20px;
        padding: 0.75rem 0.85rem;
        gap: 0.55rem;
      }
      .nav-brand {
        flex: 1;
        min-width: 0;
      }
      .brand-mark {
        width: 2.1rem;
        height: 2.1rem;
      }
      .brand-copy { overflow: hidden; }
      .brand-name {
        font-size: 0.85rem;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .brand-subtitle {
        font-size: 0.58rem;
        letter-spacing: 0.12em;
      }
      .theme-toggle {
        width: 38px;
        height: 38px;
        border-radius: 12px;
      }
      .hamburger {
        display: flex;
        border-radius: 12px;
        padding: 0.62rem;
      }
      .hamburger span { width: 20px; }
      .nav-links {
        position: fixed;
        top: 76px; left: 1rem; right: 1rem;
        background: rgba(247, 242, 235, 0.98);
        border: 1px solid rgba(31, 36, 48, 0.08);
        border-radius: 20px;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        gap: 0.5rem;
        transform: translateY(-12px);
        opacity: 0;
        transition: all 0.3s;
        pointer-events: none;
        box-shadow: 0 24px 50px rgba(47, 39, 29, 0.16);
      }
      .nav-links.open {
        transform: translateY(0);
        opacity: 1;
        pointer-events: all;
      }
    }

    @media (max-width: 420px) {
      .nav-inner {
        padding: 0.65rem 0.7rem;
        gap: 0.45rem;
      }
      .brand-mark {
        width: 1.95rem;
        height: 1.95rem;
        border-radius: 12px;
        font-size: 0.7rem;
      }
      .brand-name { font-size: 0.78rem; }
      .brand-subtitle { display: none; }
      .theme-toggle {
        width: 34px;
        height: 34px;
        border-radius: 10px;
        font-size: 0.85rem;
      }
      .hamburger {
        border-radius: 10px;
        padding: 0.5rem;
      }
      .hamburger span {
        width: 18px;
        height: 2px;
      }
    }
  `]
})
export class NavbarComponent {
  // Cambia estilos cuando el usuario hace scroll.
  scrolled = signal(false);
  // Controla el menu desplegable en movil.
  menuOpen = signal(false);
  private themeService = inject(ThemeService);
  theme = this.themeService.mode;

  @HostListener('window:scroll')
  onScroll() { this.scrolled.set(window.scrollY > 50); }

  toggleMenu() { this.menuOpen.update(v => !v); }
  close() { this.menuOpen.set(false); }
  toggleTheme() { this.themeService.toggle(); }
}
