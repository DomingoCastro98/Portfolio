import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GithubService, GitHubRepo, GitHubUser } from '../../services/github.service';
import { ProjectModalComponent } from '../project-modal/project-modal.component';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ProjectModalComponent],
  template: `
    <section id="proyectos" class="projects-section">
      <div class="container">
        <div class="section-label">proyectos</div>
        <h2 class="section-title">Mi <span>trabajo</span> en GitHub</h2>

        <!-- GitHub Import -->
        <div class="github-import">
          <div class="import-card">
            <div class="import-left">
              <div class="import-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </div>
              <div>
                <h3 class="import-title">Repositorio de GitHub</h3>
                <p class="import-desc">Visualiza a tu gusto mis proyectos de GitHub.</p>
              </div>
            </div>
            <div class="import-form">
              <div class="fixed-user" aria-label="Usuario de GitHub fijo">
                <span class="input-prefix">github.com/</span>
                <span class="fixed-user-value">{{ username }}</span>
              </div>
              <button class="load-btn" (click)="loadRepos()" [disabled]="loading()">
                <span *ngIf="!loading()">Recargar repositorios</span>
                <span *ngIf="loading()" class="loading-text">
                  <span class="dot-anim">.</span><span class="dot-anim" style="animation-delay:.2s">.</span><span class="dot-anim" style="animation-delay:.4s">.</span>
                </span>
              </button>
            </div>
          </div>

          <!-- User profile (after load) -->
          <div class="gh-profile" *ngIf="ghUser()">
            <img [src]="ghUser()!.avatar_url" [alt]="ghUser()!.login" class="gh-avatar">
            <div class="gh-info">
              <span class="gh-name">{{ ghUser()!.name || ghUser()!.login }}</span>
              <span class="gh-bio" *ngIf="ghUser()!.bio">{{ ghUser()!.bio }}</span>
            </div>
            <div class="gh-stats">
              <span>{{ ghUser()!.public_repos }} repos</span>
              <span>{{ ghUser()!.followers }} seguidores</span>
            </div>
            <a [href]="ghUser()!.html_url" target="_blank" class="gh-link">Ver perfil -></a>
          </div>
        </div>

        <!-- Error -->
        <div class="error-msg" *ngIf="error()">
          ⚠️ {{ error() }}
        </div>

        <!-- Filter + Sort -->
        <div class="projects-controls" *ngIf="repos().length">
          <div class="filter-tabs">
            <button *ngFor="let lang of availableLangs()"
                    [class.active]="filterLang() === lang"
                    (click)="filterLang.set(lang)"
                    class="filter-btn">
              {{ lang === 'all' ? 'Todos' : lang }}
            </button>
          </div>
          <div class="search-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar repositorio...">
          </div>
          <span class="repos-count">{{ filteredRepos().length }} repositorios</span>
        </div>

        <!-- Repos Grid -->
        <div class="repos-grid" *ngIf="filteredRepos().length">
          <div class="repo-card" *ngFor="let repo of filteredRepos(); trackBy: trackById"
               (click)="openModal(repo)">
            <div class="repo-card-header">
              <div class="repo-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 3h18v18H3zM9 3v18M15 9H9M15 15H9"/>
                </svg>
              </div>
              <div class="repo-badges">
                <span class="live-badge" *ngIf="repo.homepage">
                  <span class="live-dot"></span>online
                </span>
              </div>
            </div>

            <h3 class="repo-name">{{ repo.name }}</h3>
            <p class="repo-desc">{{ repo.description || 'Sin descripción' }}</p>

            <div class="repo-topics" *ngIf="repo.topics.length">
              <span class="repo-topic" *ngFor="let t of repo.topics.slice(0,3)">{{ t }}</span>
            </div>

            <div class="repo-footer">
              <div class="repo-lang" *ngIf="repo.language">
                <span class="lang-dot" [class]="'lang-' + repo.language.toLowerCase()"></span>
                {{ repo.language }}
              </div>
              <div class="repo-stats">
                <span class="repo-stat">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                  {{ repo.stargazers_count }}
                </span>
                <span class="repo-stat">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/>
                    <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/>
                  </svg>
                  {{ repo.forks_count }}
                </span>
              </div>
            </div>

            <div class="repo-updated">actualizado {{ repo.updated_at | date:'shortDate' }}</div>

            <div class="repo-hover-actions">
              <span class="hover-action">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
                </svg>
                Ver repositorio
              </span>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div class="empty-state" *ngIf="!repos().length && !loading() && !error()">
          <div class="empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <p>No se pudieron cargar los repositorios de {{ username }}</p>
        </div>
      </div>
    </section>

    <!-- Modal -->
    <app-project-modal
      *ngIf="selectedRepo()"
      [repo]="selectedRepo()!"
      (close)="selectedRepo.set(null)">
    </app-project-modal>
  `,
  styles: [`
    .projects-section { padding: 7rem 0; }
    .github-import { margin: 2.5rem 0; }
    .import-card {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1.5rem;
      background: rgba(255,255,255,0.62);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 32px;
      padding: 1.5rem 2rem;
      box-shadow: 0 24px 60px rgba(47, 39, 29, 0.08);
      backdrop-filter: blur(14px);
    }
    .import-left {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      min-width: 0;
    }
    .import-left > div:last-child {
      min-width: 0;
    }
    .import-icon {
      width: 48px; height: 48px;
      background: linear-gradient(135deg, rgba(198,79,61,0.14), rgba(47,111,143,0.14));
      border: 1px solid var(--accent-border);
      border-radius: 16px;
      display: flex; align-items: center; justify-content: center;
      color: var(--accent);
      flex-shrink: 0;
    }
    .import-title {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
      margin-bottom: 0.2rem;
    }
    .import-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      overflow-wrap: anywhere;
    }
    .import-form {
      display: flex;
      gap: 0.75rem;
      align-items: center;
      flex-wrap: wrap;
      min-width: 0;
    }
    .fixed-user {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.92);
      border: 1px solid rgba(31,36,48,0.14);
      border-radius: 18px;
      overflow: hidden;
      width: min(100%, 320px);
    }
    .input-prefix {
      padding: 0.7rem 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-secondary);
      background: rgba(31, 36, 48, 0.04);
      border-right: 1px solid var(--border);
      white-space: nowrap;
    }
    .fixed-user-value {
      padding: 0.7rem 0.75rem;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--text-primary);
      font-weight: 600;
      letter-spacing: 0.01em;
      overflow-wrap: anywhere;
    }
    .load-btn {
      background: linear-gradient(135deg, var(--accent), #df7158);
      color: white;
      border: none;
      padding: 0.7rem 1.25rem;
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      transition: all 0.2s;
      min-width: 110px;
    }
    .load-btn:hover:not(:disabled) {
      box-shadow: var(--glow);
      transform: translateY(-1px);
    }
    .load-btn:disabled { opacity: 0.6; cursor: wait; }
    .dot-anim {
      animation: blink 1s infinite;
      font-size: 1.2rem;
    }
    .gh-profile {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
      padding: 1rem 1.5rem;
      background: rgba(47,111,143,0.08);
      border: 1px solid var(--accent-border);
      border-radius: 22px;
      flex-wrap: wrap;
    }
    .gh-avatar {
      width: 40px; height: 40px;
      border-radius: 50%;
      border: 2px solid var(--accent-border);
    }
    .gh-info {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 0;
      flex: 1;
    }
    .gh-name {
      font-family: var(--font-display);
      font-weight: 700;
      color: var(--text-primary);
      overflow-wrap: anywhere;
    }
    .gh-bio {
      font-size: 0.78rem;
      color: var(--text-secondary);
      overflow-wrap: anywhere;
    }
    .gh-stats {
      display: flex;
      gap: 1rem;
      margin-left: auto;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .gh-link { font-size: 0.8rem; color: var(--accent); }

    .error-msg {
      background: rgba(255, 80, 80, 0.08);
      border: 1px solid rgba(255, 80, 80, 0.3);
      border-radius: var(--radius);
      padding: 0.9rem 1.25rem;
      font-family: var(--font-mono);
      font-size: 0.83rem;
      color: #ff8080;
      margin-bottom: 1.5rem;
    }

    .projects-controls {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .filter-tabs { display: flex; gap: 0.5rem; flex-wrap: wrap; }
    .filter-btn {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-secondary);
      font-family: var(--font-mono);
      font-size: 0.72rem;
      padding: 0.35rem 0.8rem;
      border-radius: 20px;
      transition: all 0.2s;
    }
    .filter-btn:hover { color: var(--text-primary); border-color: rgba(255,255,255,0.2); }
    .filter-btn.active {
      background: var(--accent-dim);
      border-color: var(--accent-border);
      color: var(--accent);
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 18px;
      padding: 0.4rem 0.8rem;
      color: var(--text-muted);
      width: min(100%, 280px);
      min-width: 0;
    }
    .search-box:focus-within { border-color: var(--accent-border); }
    .search-box input {
      background: none;
      border: none;
      outline: none;
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--text-primary);
      width: 100%;
      min-width: 0;
    }
    .search-box input::placeholder { color: var(--text-muted); }
    .repos-count {
      margin-left: auto;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    .repos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.25rem;
    }
    .repo-card {
      background: rgba(255,255,255,0.64);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 28px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      box-shadow: 0 18px 44px rgba(47, 39, 29, 0.07);
      backdrop-filter: blur(14px);
    }
    .repo-card::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0;
      height: 2px;
      background: linear-gradient(90deg, var(--accent), var(--accent2));
      transform: scaleX(0);
      transition: transform 0.3s;
    }
    .repo-card:hover {
      border-color: rgba(198,79,61,0.22);
      background: rgba(255,255,255,0.86);
      transform: translateY(-3px);
      box-shadow: 0 22px 54px rgba(47,39,29,0.12);
    }
    .repo-card:hover::before { transform: scaleX(1); }
    .repo-card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.25rem;
    }
    .repo-icon { color: var(--text-muted); }
    .live-badge {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      font-family: var(--font-mono);
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: var(--accent);
      background: rgba(198,79,61,0.08);
      padding: 0.15rem 0.5rem;
      border-radius: 20px;
      border: 1px solid var(--accent-border);
    }
    .live-dot {
      width: 5px; height: 5px;
      background: var(--accent);
      border-radius: 50%;
      animation: glowPulse 1.5s infinite;
    }
    .repo-name {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .repo-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      line-height: 1.6;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .repo-topics { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.25rem; }
    .repo-topic {
      background: rgba(47,111,143,0.12);
      color: var(--accent2);
      font-size: 0.65rem;
      padding: 0.15rem 0.45rem;
      border-radius: 3px;
      font-family: var(--font-mono);
    }
    .repo-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.5rem;
      padding-top: 0.75rem;
      border-top: 1px solid var(--border);
    }
    .repo-lang {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .lang-dot {
      width: 9px; height: 9px;
      border-radius: 50%;
      background: var(--text-muted);
    }
    .lang-dot.lang-typescript { background: #3178c6; }
    .lang-dot.lang-javascript { background: #f1e05a; }
    .lang-dot.lang-python { background: #3572A5; }
    .lang-dot.lang-java { background: #b07219; }
    .lang-dot.lang-css { background: #563d7c; }
    .lang-dot.lang-html { background: #e34c26; }
    .lang-dot.lang-go { background: #00ADD8; }
    .lang-dot.lang-rust { background: #dea584; }
    .repo-stats { display: flex; gap: 0.75rem; }
    .repo-stat {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .repo-updated {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      color: var(--text-muted);
      margin-top: 0.25rem;
    }
    .repo-hover-actions {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.92);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.2s;
      border-radius: var(--radius-lg);
      backdrop-filter: blur(8px);
    }
    .repo-card:hover .repo-hover-actions { opacity: 1; }
    .hover-action {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, var(--accent), #df7158);
      color: white;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 600;
      padding: 0.65rem 1.25rem;
      border-radius: 999px;
    }
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      padding: 5rem 2rem;
      text-align: center;
      color: var(--text-muted);
      font-size: 0.9rem;
    }
    .empty-icon { color: var(--text-muted); opacity: 0.4; }
    @media (prefers-color-scheme: light) {
      .repo-card:hover {
        border-color: rgba(31, 36, 48, 0.8);
      }
    }
    @media (max-width: 768px) {
      .projects-section {
        text-align: center;
      }
      .projects-section .section-label {
        justify-content: center;
      }
      .import-card {
        justify-content: center;
        text-align: center;
        padding: 1.25rem;
      }
      .import-left {
        justify-content: center;
        flex-direction: column;
        text-align: center;
      }
      .import-form {
        justify-content: center;
        width: 100%;
      }
      .fixed-user,
      .search-box {
        width: 100%;
      }
      .gh-profile {
        text-align: center;
        justify-content: center;
      }
      .gh-stats {
        width: 100%;
        justify-content: center;
        margin-left: 0;
        flex-wrap: wrap;
      }
      .gh-link {
        overflow-wrap: anywhere;
      }
      .projects-controls {
        justify-content: center;
      }
      .repos-count {
        margin-left: 0;
      }
      .repos-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class ProjectsComponent implements OnInit {
  private github = inject(GithubService);

  // Usuario fijo del que se cargan los repositorios.
  username = 'DomingoCastro98';
  repos = signal<GitHubRepo[]>([]);
  ghUser = signal<GitHubUser | null>(null);
  loading = signal(false);
  error = signal('');
  filterLang = signal('all');
  searchQuery = '';
  selectedRepo = signal<GitHubRepo | null>(null);

  // Idiomas disponibles dinamicamente segun los repos cargados.
  availableLangs = computed(() => {
    const langs = ['all', ...new Set(
      this.repos()
        .map(r => r.language)
        .filter(Boolean) as string[]
    )];
    return langs;
  });

  // Reglas de filtrado por lenguaje y busqueda libre.
  filteredRepos = computed(() => {
    let list = this.repos();
    if (this.filterLang() !== 'all') {
      list = list.filter(r => r.language === this.filterLang());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q) ||
        (r.topics || []).some(t => t.includes(q))
      );
    }
    return list;
  });

  ngOnInit() {
    this.loadRepos();
  }

  loadRepos() {
    const username = this.username.trim();
    if (!username) return;

    this.loading.set(true);
    this.error.set('');
    this.repos.set([]);
    this.ghUser.set(null);

    // Primero valida el usuario y luego carga los repos.
    this.github.getUser(username).subscribe(user => {
      if (!user) {
        this.error.set(`Usuario "${username}" no encontrado en GitHub.`);
        this.loading.set(false);
        return;
      }
      this.ghUser.set(user);

      this.github.getRepos(username).subscribe(repos => {
        if (!repos.length) {
          this.error.set('No se encontraron repositorios públicos.');
        }
        this.repos.set(repos);
        this.loading.set(false);
      });
    });
  }

  openModal(repo: GitHubRepo) {
    this.selectedRepo.set(repo);
    // Bloquea el scroll del fondo mientras el modal esta abierto.
    document.body.style.overflow = 'hidden';
  }

  trackById(_: number, repo: GitHubRepo) { return repo.id; }
}
