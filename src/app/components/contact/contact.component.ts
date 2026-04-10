import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import emailjs from '@emailjs/browser';
import { PortfolioService } from '../../services/portfolio.service';

// 🔧 INSTRUCCIONES DE CONFIGURACIÓN:
// 1. Regístrate en https://www.emailjs.com/ (gratis)
// 2. Conecta un servicio de email (Gmail recomendado)
// 3. Crea una plantilla de email con variables: {{from_name}}, {{from_email}}, {{subject}}, {{message}}
// 4. Reemplaza estos valores con tus credenciales de EmailJS:
const EMAILJS_PUBLIC_KEY: string = 'xRAx0XnQTI4PRY8b4';
const EMAILJS_SERVICE_ID: string = 'service_portfolio';
const EMAILJS_TEMPLATE_ID: string = 'template_f8pm19o';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section id="contacto" class="contact-section">
      <div class="container">
        <div class="contact-grid">
          <!-- Left: Contact Info & Links -->
          <div class="contact-left">
            <div class="section-label">contacto</div>
            <h2 class="section-title">¿Tienes un <span>proyecto</span>?</h2>
            <p class="contact-desc">
              Estoy disponible para trabajo freelance, colaboraciones y posiciones junior en desarrollo web, backend o cloud.
            </p>

            <div class="contact-links">
              <a [href]="'tel:' + info().phone" class="contact-link">
                <div class="cl-icon">☎</div>
                <div>
                  <span class="cl-label">Telefono</span>
                  <span class="cl-val">{{ info().phone }}</span>
                </div>
              </a>
              <a [href]="'mailto:' + info().email" class="contact-link">
                <div class="cl-icon">✉</div>
                <div>
                  <span class="cl-label">Correo</span>
                  <span class="cl-val">{{ info().email }}</span>
                </div>
              </a>
              <div class="contact-link static-link">
                <div class="cl-icon">🎓</div>
                <div>
                  <span class="cl-label">Formación</span>
                  <span class="cl-val">DAW + Sistemas Microinformaticos y Redes + Cloud</span>
                </div>
              </div>
              <a [href]="'https://github.com/' + info().github" target="_blank" class="contact-link">
                <div class="cl-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div>
                  <span class="cl-label">GitHub</span>
                  <span class="cl-val">{{ info().github }}</span>
                </div>
              </a>
              <a *ngIf="info().linkedin" [href]="'https://linkedin.com/in/' + info().linkedin" target="_blank" class="contact-link">
                <div class="cl-icon">in</div>
                <div>
                  <span class="cl-label">LinkedIn</span>
                  <span class="cl-val">{{ info().linkedin }}</span>
                </div>
              </a>
            </div>
          </div>

          <!-- Right: Contact Form -->
          <div class="contact-right">
            <form class="contact-form" (ngSubmit)="sendMessage()" #contactForm="ngForm">
              <div class="form-group">
                <label class="form-label">nombre</label>
                <input 
                  type="text" 
                  name="name" 
                  [(ngModel)]="form.name" 
                  required
                  class="form-input" 
                  placeholder="Tu nombre"
                  [disabled]="loading()">
              </div>

              <div class="form-group">
                <label class="form-label">email</label>
                <input 
                  type="email" 
                  name="email" 
                  [(ngModel)]="form.email" 
                  required
                  class="form-input" 
                  placeholder="tu@empresa.com"
                  [disabled]="loading()">
              </div>

              <div class="form-group">
                <label class="form-label">asunto</label>
                <input 
                  type="text" 
                  name="subject" 
                  [(ngModel)]="form.subject"
                  class="form-input" 
                  placeholder="Propuesta de trabajo, consulta..."
                  [disabled]="loading()">
              </div>

              <div class="form-group">
                <label class="form-label">mensaje</label>
                <textarea 
                  name="message" 
                  [(ngModel)]="form.message" 
                  required
                  class="form-input form-textarea" 
                  rows="5"
                  placeholder="Cuéntame sobre tu proyecto..."
                  [disabled]="loading()"></textarea>
              </div>

              <button type="submit" class="submit-btn" [disabled]="!contactForm.valid || loading()">
                <span *ngIf="!loading() && !sent()">
                  Enviar mensaje
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                  </svg>
                </span>
                <span *ngIf="loading()" class="loading-text">
                  <span class="dot-anim">.</span><span class="dot-anim" style="animation-delay:.2s">.</span><span class="dot-anim" style="animation-delay:.4s">.</span>
                </span>
                <span *ngIf="sent()">✓ ¡Mensaje enviado!</span>
              </button>

              <p class="form-note error-msg" *ngIf="error()">
                ⚠️ {{ error() }}
              </p>
              <p class="form-note success-msg" *ngIf="sent()">
                ¡Gracias! Recibirás mi respuesta en cuanto antes.
              </p>
            </form>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="container footer-inner">
          <span class="footer-copy">
            © {{ year }} {{ info().name }} — hecho con Angular
          </span>
          <span class="footer-stack">
            <span>Angular</span><span>·</span><span>TypeScript</span><span>·</span><span>GitHub API</span>
          </span>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-section {
      padding: 7rem 0 0;
      background: linear-gradient(to bottom, transparent, rgba(47,111,143,0.05));
    }
    .contact-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5rem;
      align-items: start;
      margin-bottom: 5rem;
    }
    .contact-right {
      align-self: start;
      transform: translateY(clamp(2.5rem, 5vw, 5rem));
    }
    .contact-desc {
      font-size: 0.98rem;
      color: var(--text-secondary);
      line-height: 1.9;
      margin: 1rem 0 2.5rem;
    }
    .contact-links { display: flex; flex-direction: column; gap: 1rem; }
    
    .contact-link {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: rgba(255,255,255,0.62);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 22px;
      transition: all 0.2s;
      box-shadow: 0 14px 34px rgba(47, 39, 29, 0.06);
      backdrop-filter: blur(12px);
      min-width: 0;
    }
    .contact-link:hover {
      border-color: rgba(198,79,61,0.2);
      background: rgba(255,255,255,0.92);
      transform: translateY(-2px);
    }
    .static-link { cursor: default; }
    .static-link:hover { 
      border-color: rgba(31,36,48,0.08); 
      background: rgba(255,255,255,0.92); 
      transform: none; 
    }

    @media (prefers-color-scheme: light) {
      .contact-link:hover {
        border-color: rgba(198,79,61,0.2);
        background: rgba(255,255,255,0.92) !important;
        transform: translateY(-2px);
      }
      .static-link:hover {
        border-color: rgba(31,36,48,0.08);
        background: rgba(255,255,255,0.92) !important;
        transform: none;
      }
    }

    @media (prefers-color-scheme: dark) {
      .contact-link:hover {
        border-color: rgba(255, 134, 111, 0.3);
        background: rgba(32, 36, 47, 0.9);
      }
      .static-link:hover {
        border-color: rgba(255,255,255,0.08);
        background: rgba(32, 36, 47, 0.8);
        transform: none;
      }
    }

    .cl-icon {
      width: 40px; height: 40px;
      background: linear-gradient(135deg, rgba(198,79,61,0.14), rgba(47,111,143,0.14));
      border: 1px solid var(--accent-border);
      border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.85rem;
      color: var(--accent);
      font-weight: 700;
      flex-shrink: 0;
    }
    .contact-link > div:last-child {
      display: flex;
      flex-direction: column;
      gap: 0.1rem;
      min-width: 0;
    }
    .cl-label { 
      font-size: 0.68rem; 
      text-transform: uppercase; 
      letter-spacing: 0.1em; 
      color: var(--text-muted); 
    }
    .cl-val {
      font-family: var(--font-mono);
      font-size: 0.85rem;
      color: var(--text-primary);
      overflow-wrap: anywhere;
      word-break: break-word;
    }

    .contact-form { display: flex; flex-direction: column; gap: 1.25rem; margin-top: 7rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
    .form-label {
      font-family: var(--font-mono);
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .form-input {
      background: rgba(255,255,255,0.72);
      border: 1px solid rgba(31,36,48,0.08);
      border-radius: 18px;
      padding: 0.75rem 1rem;
      font-family: var(--font-sans);
      font-size: 0.92rem;
      color: var(--text-primary);
      outline: none;
      transition: all 0.2s;
      width: 100%;
    }
    .form-input::placeholder { color: var(--text-muted); }
    .form-input:focus { border-color: var(--accent-border); }
    .form-input:disabled { 
      opacity: 0.6; 
      cursor: not-allowed;
    }
    .form-textarea { 
      resize: vertical; 
      min-height: 120px; 
      font-family: var(--font-sans);
    }

    .submit-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: linear-gradient(135deg, var(--accent), #df7158);
      color: white;
      border: none;
      padding: 0.9rem 1.5rem;
      border-radius: 999px;
      font-family: var(--font-mono);
      font-size: 0.85rem;
      font-weight: 600;
      transition: all 0.2s;
      margin-top: 0.5rem;
      cursor: pointer;
    }
    .submit-btn:hover:not(:disabled) {
      box-shadow: var(--glow-strong);
      transform: translateY(-2px);
    }
    .submit-btn:disabled { 
      background: rgba(198,79,61,0.16); 
      color: var(--accent); 
      cursor: not-allowed;
      opacity: 0.7;
    }

    .form-note { 
      font-size: 0.75rem; 
      color: var(--text-muted); 
      text-align: center;
      margin-top: 0.5rem;
    }
    .error-msg {
      color: #c64f3d;
    }
    .success-msg {
      color: #2f6f8f;
    }

    .loading-text {
      display: inline-flex;
      gap: 2px;
    }
    .dot-anim {
      animation: blink 1s infinite;
    }
    @keyframes blink {
      0%, 20%, 50%, 80%, 100% { opacity: 1; }
      40% { opacity: 0.5; }
      60% { opacity: 0.5; }
    }

    .footer {
      border-top: 1px solid rgba(31,36,48,0.08);
      margin-top: 2rem;
      padding: 2rem 0;
    }
    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .footer-copy {
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .footer-stack {
      display: flex;
      gap: 0.5rem;
      font-family: var(--font-mono);
      font-size: 0.72rem;
      color: var(--text-muted);
    }

    @media (max-width: 768px) {
      .contact-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      .contact-left,
      .contact-right {
        text-align: center;
      }
      .contact-right {
        margin-top: 0;
        padding-top: 0;
        transform: none;
      }
      .contact-left .section-label {
        justify-content: center;
      }
      .contact-link {
        text-align: left;
      }
      .footer-inner {
        justify-content: center;
      }
    }
  `]
})
export class ContactComponent {
  private portfolio = inject(PortfolioService);
  info = this.portfolio.personalInfo;
  year = new Date().getFullYear();
  
  loading = signal(false);
  sent = signal(false);
  error = signal('');

  form = { 
    name: '', 
    email: '', 
    subject: '', 
    message: '' 
  };

  constructor() {
    // Inicializar EmailJS si está configurado
    if (EMAILJS_PUBLIC_KEY) {
      emailjs.init(EMAILJS_PUBLIC_KEY);
    }
  }

  sendMessage() {
    // Validar campos obligatorios
    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.message.trim()) {
      this.error.set('Por favor completa todos los campos requeridos (nombre, email, mensaje)');
      return;
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.form.email)) {
      this.error.set('Por favor ingresa un email válido');
      return;
    }

    // Si EmailJS no está configurado, mostrar error
    if (!EMAILJS_PUBLIC_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
      this.error.set('El servicio de email está siendo configurado. Intenta de nuevo en unos momentos.');
      return;
    }

    // Enviar email
    this.loading.set(true);
    this.error.set('');

    // Variables consumidas por la plantilla de EmailJS.
    const templateParams = {
      to_email: this.info().email,
      from_name: this.form.name.trim(),
      from_email: this.form.email.trim(),
      reply_to: this.form.email.trim(),
      subject: this.form.subject.trim() || 'Contacto desde portfolio',
      message: this.form.message.trim(),
    };

    emailjs
      .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
      .then(
        () => {
          this.sent.set(true);
          this.loading.set(false);
          
          // Resetear formulario después de 5 segundos
          setTimeout(() => {
            this.form = { name: '', email: '', subject: '', message: '' };
            this.sent.set(false);
          }, 5000);
        },
        (error) => {
          console.error('Error sending email:', error);
          if (error.status === 0) {
            this.error.set('Error de conexión. Verifica tu conexión a internet.');
          } else if (error.text) {
            this.error.set('Error al enviar el mensaje. Revisa la configuración de EmailJS.');
          } else {
            this.error.set('Error al enviar el mensaje. Intenta de nuevo más tarde.');
          }
          this.loading.set(false);
        }
      );
  }
}
