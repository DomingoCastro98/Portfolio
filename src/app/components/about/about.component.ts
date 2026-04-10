import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="sobre-mi" class="about-section">
      <div class="container">
        <div class="about-grid">
          <div class="about-left">
            <div class="section-label">Sobre mi</div>
            <h2 class="section-title">
              Código con <span>propósito</span>
            </h2>
            <p class="about-text">{{ info().about }}</p>
            <p class="about-text">
              He trabajado en mantenimiento y montaje de equipos informaticos, asistencia remota, redes y creacion de paginas web con WordPress. Tambien he desarrollado soluciones con Power Apps y aplicaciones en Python para automatizar entornos de preproduccion y produccion.
            </p>
            <p class="about-text">
              Mi formacion combina el Grado Medio en Sistemas Microinformaticos y Redes, el desarrollo cloud y el Grado Superior en Desarrollo de Aplicaciones Web, que estoy cursando entre 2024 y 2026.
            </p>
            <div class="about-details">
              <div class="detail">
                <span class="detail-key">ubicación</span>
                <span class="detail-val">{{ info().location }}</span>
              </div>
              <div class="detail">
                <span class="detail-key">email</span>
                <a [href]="'mailto:' + info().email" class="detail-val link">{{ info().email }}</a>
              </div>
              <div class="detail">
                <span class="detail-key">disponible</span>
                <span class="detail-val available" *ngIf="info().availableForWork">✓ si, para nuevas oportunidades</span>
                <span class="detail-val" *ngIf="!info().availableForWork">actualmente ocupado</span>
              </div>
              <div class="detail">
                <span class="detail-key">experiencia</span>
                <span class="detail-val">{{ info().experience }}</span>
              </div>
            </div>
          </div>

          <div class="about-right">
            <div class="code-window">
              <div class="window-header">
                <div class="window-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <span class="window-title">about.ts</span>
              </div>
              <pre class="window-code"><code><span class="c-keyword">const</span> <span class="c-var">developer</span> = &#123;
  <span class="c-key">name</span>: <span class="c-str">"{{ info().name }}"</span>,
  <span class="c-key">role</span>: <span class="c-str">"{{ info().title }}"</span>,
  <span class="c-key">location</span>: <span class="c-str">"{{ info().location }}"</span>,
  <span class="c-key">stack</span>: [
    <span class="c-str">"WordPress"</span>, <span class="c-str">"Power Apps"</span>,
    <span class="c-str">"Azure"</span>, <span class="c-str">"Power Platform"</span>,
    <span class="c-str">"C#"</span>, <span class="c-str">"Python"</span>,
    <span class="c-str">"SQL"</span>, <span class="c-str">"JavaScript"</span>
  ],
  <span class="c-key">passions</span>: [
    <span class="c-str">"tecnologia con impacto"</span>,
    <span class="c-str">"aprendizaje continuo"</span>,
    <span class="c-str">"ayudar a clientes"</span>
  ],
  <span class="c-key">available</span>: <span class="c-bool">{{ info().availableForWork }}</span>,
  <span class="c-key">coffeePerDay</span>: <span class="c-num">3</span>,

  <span class="c-key">greet</span>(): <span class="c-type">string</span> &#123;
    <span class="c-keyword">return</span> <span class="c-str">&#96;¡Hola! Soy $&#123;<span class="c-var">this</span>.name&#125;&#96;</span>;
  &#125;
&#125;;</code></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .about-section {
      padding: 7rem 0;
      position: relative;
    }
    .about-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 5rem;
      align-items: stretch;
      justify-items: stretch;
    }
    .about-left,
    .about-right {
      background: rgba(255, 255, 255, 0.58);
      border: 1px solid rgba(31, 36, 48, 0.08);
      border-radius: 32px;
      padding: 2rem;
      box-shadow: 0 24px 60px rgba(47, 39, 29, 0.08);
      backdrop-filter: blur(14px);
      width: 100%;
      min-width: 0;
    }
    .about-left {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .about-text {
      font-size: 0.98rem;
      color: var(--text-secondary);
      line-height: 1.9;
      margin-bottom: 1.2rem;
    }
    .about-details {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid var(--border);
    }
    .detail {
      display: grid;
      grid-template-columns: 120px 1fr;
      gap: 1rem;
      align-items: center;
    }
    .detail-key {
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .detail-val {
      font-size: 0.88rem;
      color: var(--text-primary);
    }
    .detail-val.available { color: var(--accent); }
    .detail-val.link { color: var(--accent2); }
    .code-window {
      border-radius: var(--radius-lg);
      overflow: hidden;
      border: 1px solid rgba(31,36,48,0.10);
      background: linear-gradient(180deg, rgba(252, 249, 244, 0.98), rgba(245, 238, 228, 0.96));
      box-shadow: 0 18px 48px rgba(47, 39, 29, 0.08);
    }
    .window-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.9rem 1.25rem;
      background: rgba(255, 255, 255, 0.84);
      border-bottom: 1px solid rgba(31,36,48,0.08);
    }
    .window-dots { display: flex; gap: 6px; }
    .dot {
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .dot.red { background: #ff5f57; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #28c840; }
    .window-title {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .window-code {
      padding: 1.5rem;
      overflow-x: auto;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.94), rgba(250, 245, 237, 0.96));
    }
    code {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      line-height: 1.7;
    }
    .c-keyword { color: #c04c7b; }
    .c-var { color: var(--accent2); }
    .c-key { color: #b45f20; }
    .c-str { color: var(--accent); }
    .c-bool { color: #2f6f8f; }
    .c-num { color: #7b5fc0; }
    .c-type { color: #8a5a44; }
    .c-comment { color: var(--text-muted); font-style: italic; }

    :host-context([data-theme='dark']) .code-window {
      background: linear-gradient(180deg, rgba(44, 40, 38, 0.96), rgba(31, 28, 27, 0.95));
      box-shadow: 0 18px 48px rgba(47, 39, 29, 0.10);
      border-color: rgba(31,36,48,0.10);
    }
    :host-context([data-theme='dark']) .window-header {
      background: rgba(39, 35, 33, 0.92);
    }
    :host-context([data-theme='dark']) .window-title {
      color: var(--text-muted);
    }
    :host-context([data-theme='dark']) .window-code {
      background: linear-gradient(180deg, rgba(36, 32, 30, 0.96), rgba(28, 25, 24, 0.98));
    }
    @media (max-width: 900px) {
      .about-grid {
        grid-template-columns: minmax(0, 1fr);
        gap: 1.5rem;
      }
      .about-left,
      .about-right {
        width: 100%;
      }
    }
    @media (max-width: 640px) {
      .about-left,
      .about-right {
        padding: 1.4rem;
      }
      .about-left {
        text-align: center;
      }
      .about-left .section-label {
        justify-content: center;
      }
      .detail {
        grid-template-columns: 1fr;
        gap: 0.35rem;
        text-align: center;
      }
    }
  `]
})
export class AboutComponent {
  private portfolio = inject(PortfolioService);
  // Datos personales compartidos desde el servicio central.
  info = this.portfolio.personalInfo;
}
