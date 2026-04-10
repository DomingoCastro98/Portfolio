import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="inicio" class="hero">
      <!-- Grid background -->
      <div class="hero-grid"></div>
      <!-- Glow orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>

      <div class="container hero-content">
        <div class="hero-status" *ngIf="info().availableForWork">
          <span class="status-dot"></span>
          disponible para nuevas oportunidades
        </div>

        <div class="hero-label section-label">
          hola, soy
        </div>

        <h1 class="hero-name">{{ info().name }}</h1>
        <h2 class="hero-title">{{ info().title }}</h2>

        <p class="hero-tagline">
          <span class="prompt">$ </span>
          <span class="typed">{{ displayText }}</span>
          <span class="cursor" [class.blink]="typing">█</span>
        </p>

        <p class="hero-about">{{ info().about }}</p>

        <div class="hero-actions">
          <a href="#proyectos" class="btn btn-primary">
            <span>ver proyectos</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#contacto" class="btn btn-outline">contactar</a>
          <a [href]="'https://github.com/' + info().github" target="_blank" class="btn btn-ghost">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </a>
        </div>

        <div class="hero-stats">
          <div class="stat">
            <span class="stat-number">{{ info().github }}</span>
            <span class="stat-label">perfil github</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">{{ info().location }}</span>
            <span class="stat-label">ubicación</span>
          </div>
        </div>
      </div>

      <div class="scroll-hint">
        <span>desplaza</span>
        <div class="scroll-line"></div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      min-height: 100vh;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      padding: 8rem 0 5rem;
    }
    .hero-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(31, 36, 48, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(31, 36, 48, 0.05) 1px, transparent 1px);
      background-size: 72px 72px;
      mask-image: radial-gradient(ellipse 82% 72% at 50% 40%, black, transparent);
    }
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(36px);
      pointer-events: none;
    }
    .orb-1 {
      width: 420px; height: 420px;
      background: radial-gradient(circle, rgba(198, 79, 61, 0.14), transparent 70%);
      top: -80px; left: -70px;
    }
    .orb-2 {
      width: 340px; height: 340px;
      background: radial-gradient(circle, rgba(47, 111, 143, 0.16), transparent 70%);
      bottom: 8%; right: 5%;
    }
    .hero-content {
      position: relative;
      z-index: 2;
      max-width: 920px;
      background: rgba(255, 255, 255, 0.58);
      border: 1px solid rgba(31, 36, 48, 0.08);
      border-radius: 36px;
      padding: clamp(2rem, 5vw, 4rem);
      box-shadow: 0 30px 80px rgba(47, 39, 29, 0.1);
      backdrop-filter: blur(18px);
    }
    .hero-status {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(198, 79, 61, 0.08);
      border: 1px solid var(--accent-border);
      border-radius: 999px;
      padding: 0.4rem 0.9rem;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent);
      letter-spacing: 0.05em;
      margin-bottom: 1.5rem;
      animation: fadeInUp 0.4s ease;
    }
    .status-dot {
      width: 7px; height: 7px;
      background: var(--accent);
      border-radius: 50%;
      animation: glowPulse 2s infinite;
    }
    .hero-label {
      animation: fadeInUp 0.5s 0.1s ease both;
    }
    .hero-name {
      font-family: var(--font-display);
      font-size: clamp(3.2rem, 8vw, 5rem);
      font-weight: 600;
      color: var(--text-primary);
      letter-spacing: -0.03em;
      line-height: 0.88;
      margin-bottom: 1.2rem;
      animation: fadeInUp 0.5s 0.2s ease both;
    }
    .hero-title {
      font-family: var(--font-mono);
      font-size: clamp(1rem, 2.5vw, 1.3rem);
      font-weight: 600;
      color: var(--accent2);
      letter-spacing: 0.03em;
      margin-bottom: 1.25rem;
      animation: fadeInUp 0.5s 0.3s ease both;
    }
    .hero-tagline {
      font-family: var(--font-mono);
      font-size: 0.98rem;
      color: var(--text-secondary);
      margin-bottom: 1.25rem;
      min-height: 1.7em;
      animation: fadeInUp 0.5s 0.4s ease both;
    }
    .prompt { color: var(--accent); margin-right: 0.3rem; }
    .typed { color: var(--text-primary); }
    .cursor {
      color: var(--accent2);
      font-size: 0.9em;
    }
    .cursor.blink { animation: blink 0.8s infinite; }
    .hero-about {
      font-family: var(--font-sans);
      font-size: 1rem;
      color: var(--text-secondary);
      line-height: 1.85;
      max-width: 680px;
      margin-bottom: 2rem;
      animation: fadeInUp 0.5s 0.5s ease both;
    }
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2.5rem;
      animation: fadeInUp 0.5s 0.6s ease both;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.9rem 1.4rem;
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.03em;
      transition: all 0.2s ease;
      border: 1px solid transparent;
    }
    .btn-primary {
      background: var(--accent);
      color: white;
    }
    .btn-primary:hover {
      box-shadow: var(--glow-strong);
      transform: translateY(-2px);
      color: white;
    }
    .btn-outline {
      border-color: var(--accent-border);
      color: var(--accent);
      background: rgba(255,255,255,0.55);
    }
    .btn-outline:hover {
      background: rgba(198,79,61,0.08);
      transform: translateY(-2px);
    }
    .btn-ghost {
      color: var(--text-secondary);
      border-color: rgba(31,36,48,0.1);
      background: rgba(255,255,255,0.38);
    }
    .btn-ghost:hover { color: var(--text-primary); border-color: rgba(31,36,48,0.16); }
    .hero-stats {
      display: flex;
      align-items: center;
      gap: 2rem;
      animation: fadeInUp 0.5s 0.7s ease both;
    }
    .stat { display: flex; flex-direction: column; gap: 0.15rem; }
    .stat-number {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
    }
    .stat-label {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .stat-divider {
      width: 1px;
      height: 40px;
      background: var(--border);
    }
    .scroll-hint {
      position: absolute;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-muted);
      animation: fadeInUp 1s 1s ease both;
    }
    .scroll-line {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, var(--accent), transparent);
      animation: scanAnim 2s linear infinite;
    }
    @media (max-width: 640px) {
      .hero { padding-top: 7rem; }
      .hero-content {
        border-radius: 28px;
        padding: 1.5rem;
        margin-inline: auto;
        text-align: center;
      }
      .hero-status {
        margin-left: auto;
        margin-right: auto;
      }
      .hero-label {
        justify-content: center;
      }
      .hero-about {
        margin-left: auto;
        margin-right: auto;
      }
      .hero-stats {
        gap: 1rem;
        justify-content: center;
      }
      .stat {
        align-items: center;
      }
      .hero-actions {
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      .hero-actions .btn {
        width: min(240px, 100%);
        justify-content: center;
      }
    }
  `]
})
export class HeroComponent implements OnInit, OnDestroy {
  private portfolio = inject(PortfolioService);
  info = this.portfolio.personalInfo;

  // Estado del efecto typewriter.
  displayText = '';
  typing = true;
  private phrases = [
    'Desarrollador web junior con enfoque practico.',
    'Azure, Power Platform y desarrollo web.',
    'Tecnologia al servicio de las personas.',
    'Aprendizaje rapido y trabajo en equipo.',
  ];
  private phraseIndex = 0;
  private charIndex = 0;
  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() { this.type(); }
  ngOnDestroy() { if (this.timer) clearTimeout(this.timer); }

  // Escribe caracter a caracter la frase activa.
  private type() {
    const phrase = this.phrases[this.phraseIndex];
    if (this.charIndex <= phrase.length) {
      this.displayText = phrase.slice(0, this.charIndex++);
      this.typing = true;
      this.timer = setTimeout(() => this.type(), 60);
    } else {
      this.typing = false;
      this.timer = setTimeout(() => this.erase(), 2500);
    }
  }

  // Borra caracter a caracter y avanza a la siguiente frase.
  private erase() {
    const phrase = this.phrases[this.phraseIndex];
    if (this.charIndex > 0) {
      this.displayText = phrase.slice(0, --this.charIndex);
      this.typing = true;
      this.timer = setTimeout(() => this.erase(), 30);
    } else {
      this.phraseIndex = (this.phraseIndex + 1) % this.phrases.length;
      this.timer = setTimeout(() => this.type(), 400);
    }
  }
}
