import { Injectable, signal } from '@angular/core';

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'frontend' | 'backend' | 'tools' | 'other';
}

export interface PersonalInfo {
  name: string;
  title: string;
  tagline: string;
  about: string;
  location: string;
  phone: string;
  email: string;
  github: string;
  linkedin: string;
  twitter: string;
  website: string;
  experience: string;
  availableForWork: boolean;
}

@Injectable({ providedIn: 'root' })
export class PortfolioService {

  // Fuente unica de datos personales para todas las secciones del portfolio.
  personalInfo = signal<PersonalInfo>({
    name: 'Domingo Castro',
    title: 'Desarrollador Web Junior',
    tagline: 'Aprendo rápido, me adapto fácil y aporto valor desde el primer día.',
    about: `Soy una persona que aprende rápido, aporta optimismo y le gusta trabajar en equipo. También he trabajado durante años en solitario, lo que me ha dado autonomía y capacidad de adaptación. Me apasiona la informática y me gusta usarla para ayudar a personas y clientes a hacer su día a día más fácil.`,
    location: 'España',
    phone: '+34624605914',
    email: 'domingocastrotech1998@gmail.com',
    github: 'DomingoCastro98',
    linkedin: 'domingo-castro-',
    twitter: '',
    website: '',
    experience: 'Cuenta propia | 2017 - actualidad',
    availableForWork: true
  });

  // Stack tecnico y competencias mostradas en la seccion de habilidades.
  skills = signal<Skill[]>([
    { name: 'HTML/CSS/SASS', level: 82, category: 'frontend' },
    { name: 'JavaScript', level: 78, category: 'frontend' },
    { name: 'Angular', level: 74, category: 'frontend' },
    { name: 'C#', level: 50, category: 'backend' },
    { name: '.NET', level: 50, category: 'backend' },
    { name: 'Python', level: 42, category: 'backend' },
    { name: 'SQL', level: 82, category: 'backend' },
    { name: 'Java', level: 85, category: 'backend' },
    { name: 'Spring Boot', level: 70, category: 'backend' },
    { name: 'PHP', level: 90, category: 'backend' },
    { name: 'Azure', level: 70, category: 'tools' },
    { name: 'Power Platform', level: 57, category: 'tools' },
    { name: 'WordPress', level: 88, category: 'tools' },
    { name: 'Docker', level: 80, category: 'tools' },
    { name: 'Git', level: 90, category: 'tools' },
    { name: 'Trabajo en equipo', level: 80, category: 'other' },
    { name: 'Adaptabilidad', level: 88, category: 'other' },
    { name: 'Gestión del tiempo', level: 80, category: 'other' },
  ]);
}
