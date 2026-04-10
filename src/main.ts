import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// Bootstrap global de la app standalone con proveedores compartidos.
bootstrapApplication(AppComponent, {
  providers: [
    // HttpClient se usa para consumir la API de GitHub.
    provideHttpClient(),
    // Animaciones habilitadas para transiciones y efectos visuales.
    provideAnimations()
  ]
}).catch(err => console.error(err));
