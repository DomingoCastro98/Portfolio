import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GitHubRepo } from '../../services/github.service';

@Component({
  selector: 'app-project-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay" (click)="onOverlayClick($event)">
      <div class="modal" #modal>
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-title-area">
            <span class="modal-lang-badge" *ngIf="repo.language" [class]="getLangClass(repo.language)">
              {{ repo.language }}
            </span>
            <h2 class="modal-title">{{ repo.name }}</h2>
            <p class="modal-desc">{{ repo.description || 'Sin descripción' }}</p>
          </div>
          <button class="modal-close" (click)="close.emit()">✕</button>
        </div>

        <!-- Tabs -->
        <div class="modal-tabs">
          <button [class.active]="activeTab() === 'preview'" (click)="setTab('preview')"
                  [disabled]="!repo.homepage">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
            </svg>
            Vista previa
          </button>
          <button [class.active]="activeTab() === 'info'" (click)="setTab('info')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            Informacion del repo
          </button>
          <button [class.active]="activeTab() === 'readme'" (click)="setTab('readme')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
            </svg>
            README
          </button>
        </div>

        <!-- Tab Content -->
        <div class="modal-body">

          <!-- PREVIEW TAB -->
          <div class="tab-content" *ngIf="activeTab() === 'preview'">
            <div class="preview-container" *ngIf="repo.homepage; else noPreview">
              <div class="browser-bar">
                <div class="browser-dots">
                  <span class="dot red"></span>
                  <span class="dot yellow"></span>
                  <span class="dot green"></span>
                </div>
                <div class="browser-url">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  {{ repo.homepage }}
                </div>
                <a [href]="repo.homepage" target="_blank" class="open-btn">↗ Abrir</a>
              </div>
              <div class="iframe-wrapper" [class.loading]="iframeLoading()">
                <div class="iframe-loader" *ngIf="iframeLoading()">
                  <div class="loader-spinner"></div>
                  <span>Cargando vista previa...</span>
                </div>
                <iframe
                  [src]="safeUrl"
                  (load)="iframeLoading.set(false)"
                  sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                  loading="lazy"
                  title="Project preview">
                </iframe>
              </div>
            </div>
            <ng-template #noPreview>
              <div class="no-preview">
                <div class="no-preview-icon">🔗</div>
                <p>Este repositorio no tiene URL de demo configurada.</p>
                <p class="hint">Anade una "Homepage" en tu repo de GitHub para habilitar la vista previa.</p>
                <a [href]="repo.html_url" target="_blank" class="btn-accent">Ver en GitHub -></a>
              </div>
            </ng-template>
          </div>

          <!-- INFO TAB -->
          <div class="tab-content info-tab" *ngIf="activeTab() === 'info'">
            <div class="info-grid">
              <div class="info-card">
                <span class="info-icon">⭐</span>
                <span class="info-num">{{ repo.stargazers_count }}</span>
                <span class="info-lbl">Estrellas</span>
              </div>
              <div class="info-card">
                <span class="info-icon">🍴</span>
                <span class="info-num">{{ repo.forks_count }}</span>
                <span class="info-lbl">Bifurcaciones</span>
              </div>
              <div class="info-card">
                <span class="info-icon">🐛</span>
                <span class="info-num">{{ repo.open_issues_count }}</span>
                <span class="info-lbl">Incidencias</span>
              </div>
              <div class="info-card">
                <span class="info-icon">👁️</span>
                <span class="info-num">{{ repo.visibility }}</span>
                <span class="info-lbl">Visibilidad</span>
              </div>
            </div>

            <div class="info-details">
              <div class="info-row">
                <span class="info-key">Repositorio</span>
                <a [href]="repo.html_url" target="_blank" class="info-link">{{ repo.full_name }}</a>
              </div>
              <div class="info-row" *ngIf="repo.homepage">
                <span class="info-key">Demo en vivo</span>
                <a [href]="repo.homepage" target="_blank" class="info-link">{{ repo.homepage }}</a>
              </div>
              <div class="info-row">
                <span class="info-key">Rama principal</span>
                <span class="info-val">{{ repo.default_branch }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Creado</span>
                <span class="info-val">{{ repo.created_at | date:'mediumDate' }}</span>
              </div>
              <div class="info-row">
                <span class="info-key">Actualizado</span>
                <span class="info-val">{{ repo.updated_at | date:'mediumDate' }}</span>
              </div>
              <div class="info-row" *ngIf="repo.topics.length">
                <span class="info-key">Temas</span>
                <div class="topics">
                  <span class="topic" *ngFor="let t of repo.topics">{{ t }}</span>
                </div>
              </div>
            </div>

            <div class="info-actions">
              <a [href]="repo.html_url" target="_blank" class="btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Ver en GitHub
              </a>
              <a *ngIf="repo.homepage" [href]="repo.homepage" target="_blank" class="btn-accent">
                Abrir demo ↗
              </a>
            </div>
          </div>

          <!-- README TAB -->
          <div class="tab-content readme-tab" *ngIf="activeTab() === 'readme'">
            <div class="readme-embed">
              <p class="readme-hint">
                📄 Para ver el README completo, visita el repositorio:
              </p>
              <a [href]="repo.html_url + '#readme'" target="_blank" class="btn-accent">
                Ver README en GitHub ->
              </a>
              <div class="readme-preview">
                <pre class="readme-path">
# {{ repo.name }}

{{ repo.description || 'Sin descripción disponible.' }}

## Instalación

\`\`\`bash
git clone {{ repo.html_url }}.git
cd {{ repo.name }}
npm install
npm start
\`\`\`

## Repositorio
{{ repo.html_url }}</pre>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal {
      background: rgba(252, 248, 242, 0.92);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 32px;
      width: 100%;
      max-width: 960px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: 0 30px 90px rgba(47, 39, 29, 0.18);
      animation: fadeInUp 0.25s ease;
      backdrop-filter: blur(18px);
    }
    .modal-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      padding: 1.5rem 1.75rem 1.25rem;
      border-bottom: 1px solid rgba(31,36,48,0.08);
      gap: 1rem;
      flex-shrink: 0;
    }
    .modal-lang-badge {
      display: inline-block;
      padding: 0.2rem 0.6rem;
      border-radius: 999px;
      font-size: 0.68rem;
      font-family: var(--font-mono);
      letter-spacing: 0.05em;
      margin-bottom: 0.4rem;
      background: rgba(198,79,61,0.08);
      color: var(--accent);
      border: 1px solid var(--accent-border);
    }
    .modal-title {
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.25rem;
    }
    .modal-desc {
      font-size: 0.83rem;
      color: var(--text-secondary);
    }
    .modal-close {
      background: rgba(255,255,255,0.7);
      border: 1px solid rgba(31,36,48,0.08);
      color: var(--text-secondary);
      width: 32px; height: 32px;
      border-radius: 999px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem;
      flex-shrink: 0;
      transition: all 0.2s;
    }
    .modal-close:hover { background: white; color: var(--text-primary); }
    .modal-tabs {
      display: flex;
      gap: 0;
      border-bottom: 1px solid rgba(31,36,48,0.08);
      padding: 0 1rem;
      flex-shrink: 0;
    }
    .modal-tabs button {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      background: none;
      border: none;
      border-bottom: 2px solid transparent;
      color: var(--text-muted);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      padding: 0.85rem 1rem;
      margin-bottom: -1px;
      transition: all 0.2s;
      cursor: pointer;
    }
    .modal-tabs button:hover { color: var(--text-secondary); }
    .modal-tabs button.active {
      color: var(--accent);
      border-bottom-color: var(--accent);
    }
    .modal-tabs button:disabled { opacity: 0.3; cursor: not-allowed; }
    .modal-body { overflow-y: auto; flex: 1; }
    .tab-content { padding: 1.5rem 1.75rem; }

    /* Preview */
    .preview-container { display: flex; flex-direction: column; gap: 0; }
    .browser-bar {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: rgba(255,255,255,0.78);
      border: 1px solid rgba(31,36,48,0.08);
      border-bottom: none;
      border-radius: var(--radius-lg) var(--radius-lg) 0 0;
      padding: 0.6rem 1rem;
    }
    .browser-dots { display: flex; gap: 5px; }
    .dot { width: 9px; height: 9px; border-radius: 50%; }
    .dot.red { background: #ff5f57; }
    .dot.yellow { background: #ffbd2e; }
    .dot.green { background: #28c840; }
    .browser-url {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
      background: rgba(255,255,255,0.95);
      padding: 0.3rem 0.7rem;
      border-radius: 999px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .open-btn {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--accent);
      white-space: nowrap;
    }
    .iframe-wrapper {
      position: relative;
      height: 520px;
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 0 0 var(--radius-lg) var(--radius-lg);
      overflow: hidden;
    }
    .iframe-loader {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      background: rgba(255,255,255,0.94);
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-muted);
      z-index: 2;
    }
    .loader-spinner {
      width: 32px; height: 32px;
      border: 2px solid var(--border);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    iframe {
      width: 100%; height: 100%;
      border: none;
      background: white;
    }
    .no-preview {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      padding: 4rem;
      text-align: center;
    }
    .no-preview-icon { font-size: 2.5rem; }
    .no-preview p { color: var(--text-secondary); font-size: 0.9rem; }
    .no-preview .hint { color: var(--text-muted); font-size: 0.8rem; }

    /* Info tab */
    .info-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    .info-card {
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 22px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
      text-align: center;
    }
    .info-icon { font-size: 1.2rem; }
    .info-num {
      font-family: var(--font-display);
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .info-lbl {
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .info-details { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem; }
    .info-row {
      display: grid;
      grid-template-columns: 130px 1fr;
      gap: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid rgba(31,36,48,0.08);
      align-items: center;
    }
    .info-key {
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }
    .info-val { font-size: 0.85rem; color: var(--text-primary); }
    .info-link { font-size: 0.85rem; color: var(--accent2); word-break: break-all; }
    .topics { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .topic {
      background: rgba(47,111,143,0.12);
      color: var(--accent2);
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      font-family: var(--font-mono);
    }
    .info-actions { display: flex; gap: 0.75rem; }

    /* README */
    .readme-embed { display: flex; flex-direction: column; gap: 1rem; }
    .readme-hint { font-size: 0.85rem; color: var(--text-secondary); }
    .readme-preview {
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: var(--radius);
      overflow: hidden;
    }
    .readme-path {
      padding: 1.25rem;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-secondary);
      line-height: 1.7;
      white-space: pre-wrap;
    }

    /* Shared button styles */
    .btn-accent {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: linear-gradient(135deg, var(--accent), #df7158); color: white;
      font-family: var(--font-mono); font-size: 0.78rem; font-weight: 700;
      padding: 0.6rem 1.2rem; border-radius: 999px;
      transition: box-shadow 0.2s, transform 0.2s;
    }
    .btn-accent:hover {
      box-shadow: var(--glow-strong);
      transform: translateY(-1px);
      color: white;
    }
    .btn-ghost {
      display: inline-flex; align-items: center; gap: 0.4rem;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(31,36,48,0.08);
      color: var(--text-secondary);
      font-family: var(--font-mono); font-size: 0.78rem;
      padding: 0.6rem 1.2rem; border-radius: 999px;
      transition: all 0.2s;
    }
    .btn-ghost:hover { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }

    @media (max-width: 640px) {
      .info-grid { grid-template-columns: repeat(2, 1fr); }
      .iframe-wrapper { height: 350px; }
    }
  `]
})
export class ProjectModalComponent {
  @Input() repo!: GitHubRepo;
  @Output() close = new EventEmitter<void>();

  // Control de pestaña activa y estado de carga del iframe.
  activeTab = signal<'preview' | 'info' | 'readme'>('preview');
  iframeLoading = signal(true);

  constructor(private sanitizer: DomSanitizer) {}

  get safeUrl(): SafeResourceUrl {
    // Sanitiza la URL para poder usarla de forma segura en el iframe.
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.repo.homepage || '');
  }

  setTab(tab: 'preview' | 'info' | 'readme') {
    this.activeTab.set(tab);
    if (tab === 'preview') this.iframeLoading.set(true);
  }

  onOverlayClick(e: MouseEvent) {
    // Cierra solo si el click fue en el fondo, no dentro del contenido.
    if ((e.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }

  getLangClass(lang: string): string {
    return lang.toLowerCase().replace(/[^a-z]/g, '');
  }
}
