import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section id="habilidades" class="skills-section">
      <div class="container">
        <div class="section-label">habilidades</div>
        <h2 class="section-title">Mi <span>stack</span> técnico</h2>
        <p class="skills-desc">Tecnologías con las que construyo día a día.</p>

        <div class="skills-categories">
          <div class="skill-group" *ngFor="let cat of categories">
            <h3 class="group-title">
              <span class="group-icon">{{ cat.icon }}</span>
              {{ cat.label }}
            </h3>
            <div class="skills-list">
              <div class="skill-item" *ngFor="let skill of getByCategory(cat.id)">
                <div class="skill-header">
                  <span class="skill-name">{{ skill.name }}</span>
                  <span class="skill-pct">{{ skill.level }}%</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-fill" [style.width.%]="skill.level"
                       [class.high]="skill.level >= 85"
                       [class.mid]="skill.level >= 70 && skill.level < 85">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .skills-section {
      padding: 7rem 0;
      background: linear-gradient(to bottom, transparent, rgba(198,79,61,0.05), transparent);
    }
    .skills-desc {
      color: var(--text-secondary);
      font-size: 0.98rem;
      margin-top: 0.75rem;
      margin-bottom: 3.5rem;
    }
    .skills-categories {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 2rem;
    }
    .skill-group {
      background: rgba(255,255,255,0.62);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 28px;
      padding: 1.75rem;
      transition: all 0.25s ease;
      box-shadow: 0 18px 44px rgba(47, 39, 29, 0.07);
      backdrop-filter: blur(14px);
    }
    .skill-group:hover { border-color: rgba(198,79,61,0.22); transform: translateY(-3px); }
    .group-title {
      font-family: var(--font-display);
      font-size: 1rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 1.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .group-icon { font-size: 1.1rem; }
    .skills-list { display: flex; flex-direction: column; gap: 1rem; }
    .skill-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.4rem;
    }
    .skill-name {
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-primary);
    }
    .skill-pct {
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .skill-bar {
      height: 4px;
      background: rgba(31,36,48,0.08);
      border-radius: 2px;
      overflow: hidden;
    }
    .skill-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--accent2), var(--accent));
      border-radius: 2px;
      transition: width 1s ease;
    }
    .skill-fill.mid { background: linear-gradient(90deg, #6d89a6, var(--accent2)); }
    .skill-fill.high {
      background: linear-gradient(90deg, var(--accent), #e07954);
      box-shadow: 0 0 12px rgba(198,79,61,0.24);
    }
    @media (max-width: 640px) {
      .skills-section {
        text-align: center;
      }
      .skills-section .section-label {
        justify-content: center;
      }
      .skills-categories {
        grid-template-columns: 1fr;
        justify-items: center;
      }
      .skill-group {
        width: 100%;
      }
    }
  `]
})
export class SkillsComponent {
  private portfolio = inject(PortfolioService);
  skills = this.portfolio.skills;

  // Configuracion de bloques visuales por categoria.
  categories = [
    { id: 'frontend', label: 'Frontend', icon: '🎨' },
    { id: 'backend',  label: 'Backend',  icon: '⚙️' },
    { id: 'tools',    label: 'Herramientas', icon: '🛠️' },
    { id: 'other',    label: 'Competencias', icon: '🤝' },
  ];

  // Filtra por categoria y ordena por porcentaje de mayor a menor.
  getByCategory(cat: string) {
    return this.skills()
      .filter(s => s.category === cat)
      .sort((a, b) => b.level - a.level);
  }
}
