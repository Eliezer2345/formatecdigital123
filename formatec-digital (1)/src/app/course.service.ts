import { Injectable, signal, computed, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from './auth.service';

export interface Lesson {
  id: number;
  title: string;
  type: 'video' | 'info' | 'practice' | 'exam';
  content: string;
  questions?: Question[];
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Level {
  id: number;
  title: string;
  lessons: Lesson[];
}

export interface Course {
  id: number;
  title: string;
  description: string;
  longDescription: string;
  image: string;
  category: string;
  duration: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  levels: Level[];
}

export interface Certificate {
  id: string;
  courseId: number;
  userName: string;
  courseName: string;
  completedAt: string;
  score: number;
  progress: number;
  duration: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private readonly COURSES_KEY = 'formatec_courses';
  private readonly ENROLLMENTS_KEY = 'formatec_enrollments';
  private readonly PROGRESS_KEY = 'formatec_progress';
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  private courses = signal<Course[]>([]);
  private enrolledCourseIds = signal<number[]>([]);
  private courseProgress = signal<Record<number, { id: number, completed: boolean }[]>>({}); // courseId -> lessonStatus[]
  private certificates = signal<Certificate[]>([]);
  private searchQuery = signal<string>('');

  completedLessons = computed(() => {
    const progress = this.courseProgress();
    const result: Record<number, number[]> = {};
    Object.keys(progress).forEach(courseId => {
      const id = Number(courseId);
      result[id] = progress[id].filter(l => l.completed).map(l => l.id);
    });
    return result;
  });

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Load global courses catalog
      const storedCourses = localStorage.getItem(this.COURSES_KEY);
const hiddenCourseIds = [9, 12];

if (storedCourses) {
  const parsedCourses = JSON.parse(storedCourses) as Course[];
  this.courses.set(parsedCourses.filter(course => !hiddenCourseIds.includes(course.id)));
} else {
  this.courses.set(
    this.getDefaultCourses().filter(course => !hiddenCourseIds.includes(course.id))
  );
}

      // Watch for user changes to load/save user-specific data
      effect(() => {
        const user = this.authService.user();
        if (user) {
          this.loadUserData(user.email);
        } else {
          this.clearUserData();
        }
      });

      // Persist user-specific data changes
      effect(() => {
        const user = this.authService.user();
        if (user && isPlatformBrowser(this.platformId)) {
          const userData = {
            email: user.email,
            cursos: this.enrolledCourseIds(),
            progreso: this.courseProgress(),
            certificados: this.certificates()
          };
          localStorage.setItem(`formatec_user_${user.email}`, JSON.stringify(userData));
        }
      });

      // Persist courses catalog changes (global)
      effect(() => {
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem(this.COURSES_KEY, JSON.stringify(this.courses()));
        }
      });
    } else {
      this.courses.set(this.getDefaultCourses());
    }
  }

  private loadUserData(email: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedData = localStorage.getItem(`formatec_user_${email}`);
    if (storedData) {
      const data = JSON.parse(storedData);
      this.enrolledCourseIds.set(data.cursos || []);
      this.courseProgress.set(data.progreso || {});
      this.certificates.set(data.certificados || []);
    } else {
      // New user starts from zero
      this.enrolledCourseIds.set([]);
      this.courseProgress.set({});
      this.certificates.set([]);
    }
  }

  private clearUserData() {
    this.enrolledCourseIds.set([]);
    this.courseProgress.set({});
    this.certificates.set([]);
  }

  getCourseById(id: number): Course | undefined {
    return this.courses().find(c => c.id === id);
  }

  isCourseCompleted(courseId: number): boolean {
    const progress = this.getCourseProgress(courseId);
    return progress === 100;
  }

  getCourseProgress(courseId: number): number {
    const course = this.courses().find(c => c.id === courseId);
    if (!course) return 0;
    
    const totalLessons = course.levels.reduce((acc, level) => acc + level.lessons.length, 0);
    const completed = (this.courseProgress()[courseId] || []).filter(l => l.completed).length;
    
    return totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;
  }

  getCourseDuration(courseId: number): string {
    const course = this.courses().find(c => c.id === courseId);
    return course?.duration || '10 horas';
  }

  getCertificateForCourse(courseId: number): Certificate | undefined {
    return this.certificates().find(c => c.courseId === courseId);
  }

  generateCertificate(courseId: number, score: number) {
    const course = this.getCourseById(courseId);
    const user = this.authService.user();
    if (!course || !user) return;

    if (this.getCertificateForCourse(courseId)) return; // Already exists

    const newCert: Certificate = {
      id: `FTD-${courseId}-${Date.now().toString().slice(-6)}`,
      courseId,
      userName: user.name || user.email,
      courseName: course.title,
      completedAt: new Date().toISOString(),
      score: score,
      progress: 100,
      duration: course.duration
    };

    this.certificates.update(certs => [...certs, newCert]);
  }

  private loadInitialData() {
    // This method is now handled by the constructor effects
  }

  private getDefaultCourses(): Course[] {
      const generateLevels = (courseTitle: string): Level[] => {
        const levels: Level[] = [];
        const nursingData: Record<number, string[]> = {
          1: ['Higiene y Lavado de Manos', 'Signos Vitales y Monitoreo', 'Principios de Bioseguridad', 'Triage y Clasificación RAC', 'Bioseguridad Hospitalaria'],
          2: ['Primeros Auxilios Básicos', 'Atención Básica al Paciente', 'Vendajes e Inmovilización', 'Traslado y Movilización', 'Cuidados de Confort'],
          3: ['Administración de Medicamentos', 'Vías de Administración', 'Cálculo de Dosis', 'Canalización Periférica', 'Manejo de Insumos Médicos'],
          4: ['Ética y Deontología Médica', 'Atención al Paciente Crítico', 'Relación Enfermero-Paciente', 'Cuidados Paliativos', 'Humanización de la Salud']
        };

        const nursingVideos: Record<number, string[]> = {
          1: [
            'https://www.youtube.com/embed/nshR6w2jMhk', // Lavado manos
            'https://www.youtube.com/embed/pCHid8EmsA0', // Signos vitales
            'https://www.youtube.com/embed/S9uN1u3fR78', // Bioseguridad
            'https://www.youtube.com/embed/uXWycyeTeCs', 
            'https://www.youtube.com/embed/vLnPwxZdW4Y'
          ],
          2: [
            'https://www.youtube.com/embed/04n3qO0O0u4', // Primeros auxilios
            'https://www.youtube.com/embed/rfscVS0vtbw', 
            'https://www.youtube.com/embed/PkZNo7MFNFg',
            'https://www.youtube.com/embed/2zVvF0r4QnA',
            'https://www.youtube.com/embed/6x4jHk9Z9d8'
          ],
          3: [
            'https://www.youtube.com/embed/pCHid8EmsA0',
            'https://www.youtube.com/embed/8ext9G7xspg',
            'https://www.youtube.com/embed/O5nskjZ_GoI',
            'https://www.youtube.com/embed/O2l1ZzX1b7g',
            'https://www.youtube.com/embed/FzY2n4d0k9U'
          ],
          4: [
            'https://www.youtube.com/embed/2zVvF0r4QnA',
            'https://www.youtube.com/embed/9Xz0Xy9d8JQ',
            'https://www.youtube.com/embed/5XfP6K7g2TQ',
            'https://www.youtube.com/embed/Z1Yd7upQsXY',
            'https://www.youtube.com/embed/Y5J7d0sY0h0'
          ]
        };

        const pharmacyData: Record<number, string[]> = {
          1: ['Introducción a la Farmacia', 'Recepción de Medicamentos', 'Almacenamiento y Conservación', 'Terminología Farmacéutica', 'Ética Profesional'],
          2: ['La Receta Médica', 'Dispensación y Atención', 'Formas Farmacéuticas', 'Vías de Administración', 'Cálculo de Dosis'],
          3: ['Farmacología: Antibióticos', 'Analgésicos y Antiinflamatorios', 'Sistemas Cardiovascular y Respiratorio', 'Cadena de Frío', 'Efectos Adversos'],
          4: ['Gestión de Inventarios', 'Farmacia Hospitalaria vs Comunitaria', 'Legislación Farmacéutica', 'Marketing y Venta Ética', 'Prácticas Profesionales']
        };

        for (let l = 1; l <= 4; l++) {
          const lessons: Lesson[] = [];
          for (let i = 1; i <= 5; i++) {
            let lessonTitle = this.getLessonTitle(courseTitle, l, i);
            let videoUrl = this.getLessonVideo(courseTitle, l, i);

            if (courseTitle.includes('Enfermería')) {
              lessonTitle = nursingData[l][i-1];
              videoUrl = nursingVideos[l][i-1];
            } else if (courseTitle.includes('Farmacia')) {
              lessonTitle = pharmacyData[l][i-1];
              videoUrl = this.getLessonVideo('Farmacia', l, i);
            }

            lessons.push({
              id: (l * 100) + i,
              title: `Lección ${i}: ${lessonTitle}`,
              type: 'video',
              content: videoUrl,
              questions: this.getQuestionsForLesson(courseTitle, l, i)
            });
          }
          levels.push({
            id: l,
            title: `Nivel ${l}: ${this.getLevelTitle(courseTitle, l)}`,
            lessons: lessons
          });
        }
        return levels;
      };

    return [
      {
        id: 1,
        title: 'Informática Básica',
        description: 'Domina las herramientas digitales esenciales.',
        longDescription: 'Desde el uso del mouse hasta la gestión de archivos y navegación segura.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop',
        category: 'Tecnología',
        duration: '40 horas',
        level: 'Básico',
        difficulty: 'Beginner',
        levels: generateLevels('Informática Básica')
      },
      {
        id: 2,
        title: 'Barbería Profesional',
        description: 'Domina el arte del corte masculino y diseño de barba.',
        longDescription: 'Desde técnicas básicas hasta cortes de vanguardia y cuidado de la barba.',
        image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop',
        category: 'Belleza',
        duration: '60 horas',
        level: 'Básico',
        difficulty: 'Beginner',
        levels: generateLevels('Barbería Profesional')
      },
      {
        id: 3,
        title: 'Repostería Creativa',
        description: 'El arte de la pastelería y decoración de postres.',
        longDescription: 'Aprende recetas clásicas y modernas para deleitar paladares.',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop',
        category: 'Cocina',
        duration: '60 horas',
        level: 'Básico',
        difficulty: 'Beginner',
        levels: generateLevels('Repostería')
      },
      {
        id: 4,
        title: 'Uñas Acrílicas',
        description: 'Especialízate en el diseño y aplicación de uñas acrílicas.',
        longDescription: 'Domina el esculpido, limado y decoración de uñas con estándares profesionales.',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=800&auto=format&fit=crop',
        category: 'Belleza',
        duration: '40 horas',
        level: 'Básico',
        difficulty: 'Beginner',
        levels: generateLevels('Uñas Acrílicas')
      },
      {
        id: 5,
        title: 'Auxiliar de Enfermería',
        description: 'Cuidados básicos de salud y asistencia al paciente.',
        longDescription: 'Formación profesional en enfermería clínica: cuidados básicos, signos vitales, administración de medicamentos y primeros auxilios avanzados.',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=800&auto=format&fit=crop',
        category: 'Salud',
        duration: '120 horas',
        level: 'Intermedio',
        difficulty: 'Intermediate',
        levels: generateLevels('Auxiliar de Enfermería')
      },
      {
        id: 6,
        title: 'Inglés Básico',
        description: 'Inicia tu comunicación en el idioma global.',
        longDescription: 'Domina los fundamentos del idioma inglés: gramática esencial, vocabulario cotidiano y estructuras para una comunicación fluida.',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
        category: 'Idiomas',
        duration: '80 horas',
        level: 'Básico',
        difficulty: 'Beginner',
        levels: generateLevels('Inglés Básico')
      },
      {
        id: 7,
        title: 'Reparación de Celulares',
        description: 'Servicio técnico y mantenimiento de dispositivos móviles.',
        longDescription: 'Diagnóstico y reparación de hardware y software de smartphones.',
        image: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=800&auto=format&fit=crop',
        category: 'Tecnología',
        duration: '90 horas',
        level: 'Intermedio',
        difficulty: 'Intermediate',
        levels: generateLevels('Reparación de Celulares')
      },
      {
        id: 8,
        title: 'Maquillaje Profesional',
        description: 'Técnicas profesionales de maquillaje artístico y social.',
        longDescription: 'Aprende a resaltar la belleza natural y crear looks impactantes para toda ocasión.',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=800&auto=format&fit=crop',
        category: 'Belleza',
        duration: '45 horas',
        level: 'Básico',
        difficulty: 'Beginner',
        levels: generateLevels('Maquillaje Profesional')
      },

      {
        id: 10,
        title: 'Estilismo Profesional',
        description: 'Diseño de mirada y técnicas de belleza integral.',
        longDescription: 'Lifting, extensiones y diseño de cejas según la morfología facial.',
        image: 'https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop',
        category: 'Belleza',
        duration: '40 horas',
        level: 'Básico',
        difficulty: 'Beginner',
        levels: generateLevels('Estilismo Profesional')
      },
      {
        id: 11,
        title: 'Auxiliar de Farmacia',
        description: 'Gestión farmacéutica y dispensación de medicamentos.',
        longDescription: 'Aprende sobre farmacología, atención al cliente en farmacia, gestión de inventarios y normativa legal vigente.',
        image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?q=80&w=800&auto=format&fit=crop',
        category: 'Salud',
        duration: '100 horas',
        level: 'Intermedio',
        difficulty: 'Intermediate',
        levels: generateLevels('Auxiliar de Farmacia')
      },
      
    ];
  }

  private getLevelTitle(course: string, level: number): string {
    if (course.includes('Enfermería')) {
      const nursingLevels: Record<number, string> = {
        1: 'Higiene y Bioseguridad',
        2: 'Primeros Auxilios y Atención',
        3: 'Administración de Medicamentos',
        4: 'Ética y Atención al Paciente'
      };
      return nursingLevels[level] || 'Módulo de Enfermería';
    }
    if (course.includes('Farmacia')) {
      const pharmacyLevels: Record<number, string> = {
        1: 'Fundamentos y Recepción',
        2: 'Gestión de Dispensación',
        3: 'Farmacología Aplicada',
        4: 'Administración y Normativa'
      };
      return pharmacyLevels[level] || 'Módulo de Farmacia';
    }
    const titles: Record<number, string> = {
      1: 'Fundamentos y Bases',
      2: 'Técnicas Intermedias',
      3: 'Práctica Avanzada',
      4: 'Perfeccionamiento Profesional'
    };
    return titles[level] || 'Módulo de Aprendizaje';
  }

  private getLessonTitle(course: string, level: number, lesson: number): string {
    const pharmacyTitles: Record<number, string[]> = {
      1: ['Introducción a la Salud Pública', 'Recepción Técnica de Medicamentos', 'Almacenamiento (Buenas Prácticas)', 'Terminología Farmacológica', 'Bioética Farmacéutica'],
      2: ['Interpretación de la Receta Médica', 'Dispensación Paso a Paso', 'Formas Farmacéuticas Sólidas', 'Dispositivos Médicos Comunes', 'Cálculos de Micro y Macrogotas'],
      3: ['Antibióticos y Antivirales', 'Manejo del Dolor e Inflamación', 'Farmacología Cardiovascular', 'Conservación de Vacunas', 'Detección de Reacciones PRM'],
      4: ['Software de Gestión Farmacéutica', 'Farmacia Clínica y Hospitalaria', 'Legislación de Medicamentos Controlados', 'Atención al Cliente y Ventas', 'Auditoría de Inventarios y Merma']
    };
    const nursingTitles: Record<number, string[]> = {
      1: ['Signos Vitales y Monitoreo', 'Lavado de Manos Clínico (OMS)', 'Ética y Deontología Médica', 'Triage y Clasificación RAC', 'Primeros Auxilios Básicos'],
      2: ['Administración de Fármacos (5 Correctos)', 'Vendajes y Inmovilización', 'Canalización de Vía Periférica', 'Higiene y Confort del Paciente', 'Nutrición y Dietética Clínica'],
      3: ['Manejo de Emergencias Respiratorias', 'RCP Básico y Avanzado', 'Cuidados de Enfermería Post-operatorios', 'Manejo de Heridas y Curaciones', 'Ginecología y Obstetricia para Auxiliares'],
      4: ['Salud Pública y Comunitaria', 'Enfermería Pediátrica', 'Cuidados Paliativos y Geriatría', 'Farmacología Clínica II', 'Gestión y Liderazgo en Enfermería']
    };

    const engineeringTitles: Record<number, string[]> = {
      1: ['Introducción a la Ingeniería', 'Física y Mecánica', 'Cálculo Diferencial', 'Álgebra Lineal', 'Dibujo Técnico'],
      2: ['Resistencia de Materiales', 'Termodinámica', 'Circuitos Eléctricos', 'Mecánica de Fluidos', 'Geotecnia'],
      3: ['Hidráulica Aplicada', 'Instalaciones Especiales', 'Maquinaria Pesada', 'Gestión de Obra', 'Presupuestos'],
      4: ['Impacto Ambiental', 'Ética en Ingeniería', 'Seguridad Industrial', 'Residencias Profesionales', 'Proyecto Final']
    };

    const englishTitles: Record<number, string[]> = {
      1: ['Present Simple: Identity', 'Vocabulary: Daily Life', 'Greetings & Socializing', 'Essential Verbs', 'Numbers & Time'],
      2: ['Past Simple: Memories', 'Personal Pronouns', 'Routine & Habits', 'Questions Words', 'Descriptive Adjectives'],
      3: ['Present Continuous', 'Future with Will/Going to', 'Modals of Permission', 'Prepositions of Place', 'Business Basics'],
      4: ['Perfect Tenses', 'Passive Voice', 'Academic Vocabulary', 'Travel & Culture', 'Final Project Presentation']
    };

    if (course.includes('Enfermería')) {
      return nursingTitles[level]?.[lesson-1] || `Unidad ${lesson} de Salud`;
    }
    if (course.includes('Ingeniería')) {
      return engineeringTitles[level]?.[lesson-1] || `Módulo ${lesson} de Ingeniería`;
    }
    if (course.includes('Inglés')) {
      return englishTitles[level]?.[lesson-1] || `Advanced Grammar ${lesson}`;
    }
    if (course.includes('Farmacia')) {
      return pharmacyTitles[level]?.[lesson-1] || `Lección Técnica ${lesson}`;
    }
    return `Introducción al tema ${lesson} del Nivel ${level}`;
  }

private getLessonVideo(course: string, level: number, lesson: number): string {

  const videoLibrary: Record<string, string[]> = {

    // 💈 BARBERÍA
    "Barbería Profesional": [
      "https://www.youtube.com/embed/VfPQeWhVQqg",
      "https://www.youtube.com/embed/lSHkVX8jaXw",
      "https://www.youtube.com/embed/0fjXRnLRgt4",
      "https://www.youtube.com/embed/89ATGbud5nE",
      "https://www.youtube.com/embed/4TagZixHrOI"
    ],

    // 💊 ENFERMERÍA
    "Auxiliar de Enfermería": [
      "https://www.youtube.com/embed/hizBdM1Ob68",
      "https://www.youtube.com/embed/WoYVmlOxwbA",
      "https://www.youtube.com/embed/y6xQHq9E6WQ",
      "https://www.youtube.com/embed/1APwq1df6Mw",
      "https://www.youtube.com/embed/Fc8zJ3zJx1A"
    ],

    // 💻 INFORMÁTICA
    "Informática Básica": [
      "https://www.youtube.com/embed/6V0H6G7Jz9A",
      "https://www.youtube.com/embed/x7k7F5rQz6M",
      "https://www.youtube.com/embed/3JZ_D3ELwOQ",
      "https://www.youtube.com/embed/rwbho0CgEAE",
      "https://www.youtube.com/embed/Vl0H-qTclOg"
    ],

    // 🇺🇸 INGLÉS
    "Inglés Básico": [
      "https://www.youtube.com/embed/tVlcKp3bWH8",
      "https://www.youtube.com/embed/f9rCUQjmkxU",
      "https://www.youtube.com/embed/KrHnGZkq4QE",
      "https://www.youtube.com/embed/1hHMwLxN6EM",
      "https://www.youtube.com/embed/YJ0l9xXh3X0"
    ],

    // 💄 ESTÉTICA / BELLEZA
    "Maquillaje Profesional": [
      "https://www.youtube.com/embed/6F7X0Q3ZpX8",
      "https://www.youtube.com/embed/8cG0h7Fz2Xk",
      "https://www.youtube.com/embed/9z5K8VvX7yE",
      "https://www.youtube.com/embed/4fXz9yY2XnM",
      "https://www.youtube.com/embed/3JZ_D3ELwOQ"
    ],

    // 🍰 REPOSTERÍA
    "Repostería Creativa": [
      "https://www.youtube.com/embed/6x4jHk9Z9d8",
      "https://www.youtube.com/embed/Hh3k6Q6b6y0",
      "https://www.youtube.com/embed/4aZr5hZXP_s",
      "https://www.youtube.com/embed/Z4o8P6H3H9A",
      "https://www.youtube.com/embed/8ZKzZkF8r8Y"
    ]
  };

  const videos = videoLibrary[course];

  if (!videos) {
    return "https://www.youtube.com/embed/6V0H6G7Jz9A"; // fallback seguro
  }

  const index = ((level - 1) * 5 + (lesson - 1)) % videos.length;

  return videos[index];
}

  private getQuestionsForLesson(course: string, level: number, lesson: number): Question[] {
    const questions: Record<string, Question[]> = {
      'Informática': [
        { id: 1, text: '¿Qué componente es el "cerebro" de la computadora?', options: ['Memoria RAM', 'Disco Duro', 'CPU', 'Tarjeta de Video'], correctAnswer: 2 },
        { id: 2, text: '¿Cuál de estos es un sistema operativo?', options: ['Word', 'Windows', 'Excel', 'Google Chrome'], correctAnswer: 1 },
        { id: 3, text: '¿Para qué sirve el teclado?', options: ['Para ver imágenes', 'Para escuchar música', 'Para ingresar texto', 'Para imprimir'], correctAnswer: 2 }
      ],
      'Repostería': [
        { id: 1, text: '¿Cuál es el ingrediente principal para que un bizcocho suba?', options: ['Azúcar', 'Harina', 'Polvo de hornear', 'Sal'], correctAnswer: 2 },
        { id: 2, text: '¿A qué temperatura se suele precalentar el horno para pasteles?', options: ['100°C', '180°C', '250°C', '300°C'], correctAnswer: 1 },
        { id: 3, text: '¿Qué es el "merengue"?', options: ['Una masa de pan', 'Claras de huevo batidas con azúcar', 'Un tipo de chocolate', 'Una crema de leche'], correctAnswer: 1 }
      ],
      'Barbería': [
        { id: 1, text: '¿Qué herramienta se usa para un "fade" perfecto?', options: ['Tijeras', 'Navaja', 'Máquina con peines', 'Peine'], correctAnswer: 2 },
        { id: 2, text: '¿Para qué se usa el aftershave?', options: ['Para peinar', 'Para desinfectar y calmar la piel', 'Para lavar el cabello', 'Para dar brillo'], correctAnswer: 1 },
        { id: 3, text: '¿Qué es un "degradado"?', options: ['Un tipo de tinte', 'Un corte que va de menos a más longitud', 'Un lavado especial', 'Un peinado con gel'], correctAnswer: 1 }
      ],
      'Enfermería': [
        { id: 1, text: '¿Cuál es el primer paso en primeros auxilios?', options: ['Gritar', 'Asegurar la escena', 'Mover al paciente', 'Dar agua'], correctAnswer: 1 },
        { id: 2, text: '¿Qué mide un esfigmomanómetro?', options: ['Temperatura', 'Presión arterial', 'Frecuencia cardíaca', 'Oxígeno'], correctAnswer: 1 },
        { id: 3, text: '¿Cuál es la frecuencia cardíaca normal en reposo?', options: ['20-40 lpm', '60-100 lpm', '120-150 lpm', '10-20 lpm'], correctAnswer: 1 }
      ],
      'Inglés': [
        { id: 1, text: '¿Cómo se dice "Hola" en inglés?', options: ['Goodbye', 'Please', 'Hello', 'Thank you'], correctAnswer: 2 },
        { id: 2, text: '¿Cuál es el pronombre para "Yo"?', options: ['You', 'He', 'I', 'She'], correctAnswer: 2 },
        { id: 3, text: '¿Qué significa "Apple"?', options: ['Naranja', 'Manzana', 'Pera', 'Uva'], correctAnswer: 1 }
      ]
    };

    const category = Object.keys(questions).find(key => course.includes(key));
    const courseQuestions = category ? questions[category] : [
      { id: 1, text: `¿Cuál es el objetivo principal de la Lección ${lesson}?`, options: ['Aprender conceptos básicos', 'Dominar la técnica', 'Certificarse', 'Ninguna de las anteriores'], correctAnswer: 0 },
      { id: 2, text: '¿Es necesaria la práctica constante en este módulo?', options: ['No es necesaria', 'Solo a veces', 'Es fundamental', 'Depende del tiempo'], correctAnswer: 2 },
      { id: 3, text: '¿Qué se debe hacer al finalizar esta lección?', options: ['Cerrar la plataforma', 'Repasar lo aprendido', 'Ir a dormir', 'Nada'], correctAnswer: 1 }
    ];

    return courseQuestions;
  }

  private getQuestionsForCourse(course: string, level: number): Question[] {
    const genericQuestions: Question[] = [
      { id: 1, text: `¿Cuál es el objetivo principal del Nivel ${level}?`, options: ['Aprender conceptos básicos', 'Dominar la técnica', 'Certificarse', 'Ninguna de las anteriores'], correctAnswer: 0 },
      { id: 2, text: '¿Es necesaria la práctica constante en este módulo?', options: ['No es necesaria', 'Solo a veces', 'Es fundamental', 'Depende del tiempo'], correctAnswer: 2 },
      { id: 3, text: '¿Qué se debe hacer al finalizar cada lección?', options: ['Cerrar la plataforma', 'Repasar lo aprendido', 'Ir a dormir', 'Nada'], correctAnswer: 1 },
      { id: 4, text: '¿Cómo se mide el progreso en el curso?', options: ['Por tiempo conectado', 'Por lecciones completadas', 'Por cantidad de clics', 'No se mide'], correctAnswer: 1 },
      { id: 5, text: '¿Cuál es la importancia de la evaluación final?', options: ['Ninguna', 'Validar los conocimientos adquiridos', 'Perder el tiempo', 'Es opcional'], correctAnswer: 1 }
    ];

    if (course.includes('Informática')) {
      return [
        { id: 1, text: '¿Qué componente es el "cerebro" de la computadora?', options: ['Memoria RAM', 'Disco Duro', 'CPU', 'Tarjeta de Video'], correctAnswer: 2 },
        { id: 2, text: '¿Cuál de estos es un sistema operativo?', options: ['Word', 'Windows', 'Excel', 'Google Chrome'], correctAnswer: 1 },
        { id: 3, text: '¿Para qué sirve el teclado?', options: ['Para ver imágenes', 'Para escuchar música', 'Para ingresar texto', 'Para imprimir'], correctAnswer: 2 },
        { id: 4, text: '¿Qué significa USB?', options: ['Universal Serial Bus', 'Ultra Speed Battery', 'User System Backup', 'Unit Software Board'], correctAnswer: 0 },
        { id: 5, text: '¿Cuál es un periférico de salida?', options: ['Ratón', 'Escáner', 'Monitor', 'Micrófono'], correctAnswer: 2 }
      ];
    }

    if (course.includes('Inglés')) {
      return [
        { id: 1, text: '¿Cómo se dice "Hola" en inglés?', options: ['Goodbye', 'Please', 'Hello', 'Thank you'], correctAnswer: 2 },
        { id: 2, text: '¿Cuál es el pronombre para "Yo"?', options: ['You', 'He', 'I', 'She'], correctAnswer: 2 },
        { id: 3, text: '¿Qué significa "Apple"?', options: ['Naranja', 'Manzana', 'Pera', 'Uva'], correctAnswer: 1 },
        { id: 4, text: '¿Cómo se dice "Azul" en inglés?', options: ['Red', 'Green', 'Blue', 'Yellow'], correctAnswer: 2 },
        { id: 5, text: '¿Cuál es el plural de "Child"?', options: ['Childs', 'Children', 'Childrens', 'Childes'], correctAnswer: 1 }
      ];
    }

    if (course.includes('Barbería')) {
      return [
        { id: 1, text: '¿Qué herramienta se usa para un "fade" perfecto?', options: ['Tijeras', 'Navaja', 'Máquina con peines', 'Peine'], correctAnswer: 2 },
        { id: 2, text: '¿Para qué se usa el aftershave?', options: ['Para peinar', 'Para desinfectar y calmar la piel', 'Para lavar el cabello', 'Para dar brillo'], correctAnswer: 1 },
        { id: 3, text: '¿Qué es un "degradado"?', options: ['Un tipo de tinte', 'Un corte que va de menos a más longitud', 'Un lavado especial', 'Un peinado con gel'], correctAnswer: 1 },
        { id: 4, text: '¿Cómo se debe limpiar la navaja?', options: ['Con agua solamente', 'Con alcohol o desinfectante', 'No se limpia', 'Con un paño seco'], correctAnswer: 1 },
        { id: 5, text: '¿Qué ángulo se recomienda para el afeitado con navaja?', options: ['90 grados', '45 grados', '30 grados', '0 grados'], correctAnswer: 2 }
      ];
    }

    if (course.includes('Repostería')) {
      return [
        { id: 1, text: '¿Cuál es el ingrediente principal para que un bizcocho suba?', options: ['Azúcar', 'Harina', 'Polvo de hornear', 'Sal'], correctAnswer: 2 },
        { id: 2, text: '¿A qué temperatura se suele precalentar el horno para pasteles?', options: ['100°C', '180°C', '250°C', '300°C'], correctAnswer: 1 },
        { id: 3, text: '¿Qué es el "merengue"?', options: ['Una masa de pan', 'Claras de huevo batidas con azúcar', 'Un tipo de chocolate', 'Una crema de leche'], correctAnswer: 1 },
        { id: 4, text: '¿Para qué sirve tamizar la harina?', options: ['Para que pese menos', 'Para quitar grumos y airear', 'Para cambiarle el color', 'No sirve para nada'], correctAnswer: 1 },
        { id: 5, text: '¿Qué es el baño María?', options: ['Lavar los platos', 'Cocer suavemente dentro de un recipiente con agua caliente', 'Un postre francés', 'Enfriar rápido'], correctAnswer: 1 }
      ];
    }

    return genericQuestions;
  }

  getCourses() {
    return this.courses.asReadonly();
  }

  filteredCourses = computed(() => {
    const query = this.searchQuery().toLowerCase();
    return this.courses().filter(course => 
      course.title.toLowerCase().includes(query) || 
      course.category.toLowerCase().includes(query)
    );
  });

  setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  getEnrolledCourses() {
    const allCourses = this.courses();
    const ids = this.enrolledCourseIds();
    return allCourses.filter(c => ids.includes(c.id));
  }

  enroll(courseId: number) {
    if (!this.enrolledCourseIds().includes(courseId)) {
      this.enrolledCourseIds.update(ids => [...ids, courseId]);
    }
  }

  unenroll(courseId: number) {
    this.enrolledCourseIds.update(ids => ids.filter(id => id !== courseId));
    
    // Remove progress
    this.courseProgress.update(progress => {
      const newProgress = { ...progress };
      delete newProgress[courseId];
      return newProgress;
    });

    // Also remove from detailed enrollments in localStorage if present
    if (isPlatformBrowser(this.platformId)) {
      const enrolled = JSON.parse(localStorage.getItem('formatec_enrollments') || '{}');
      if (enrolled[courseId]) {
        delete enrolled[courseId];
        localStorage.setItem('formatec_enrollments', JSON.stringify(enrolled));
      }
    }
  }

  completeLesson(courseId: number, lessonId: number, score: number = 10.0) {
    this.courseProgress.update(progress => {
      const currentLessons = progress[courseId] || [];
      const lessonIndex = currentLessons.findIndex(l => l.id === lessonId);
      
      let nextProgress = progress;
      if (lessonIndex === -1) {
        // Add new completed lesson
        nextProgress = { 
          ...progress, 
          [courseId]: [...currentLessons, { id: lessonId, completed: true }] 
        };
      } else if (!currentLessons[lessonIndex].completed) {
        // Update existing lesson to completed
        const updatedLessons = [...currentLessons];
        updatedLessons[lessonIndex] = { ...updatedLessons[lessonIndex], completed: true };
        nextProgress = { ...progress, [courseId]: updatedLessons };
      }

      // Check if this completion triggers a certificate
      setTimeout(() => {
        if (this.isCourseCompleted(courseId)) {
          this.generateCertificate(courseId, score);
        }
      }, 0);
      
      return nextProgress;
    });
  }

  getUserData(email: string) {
    if (!isPlatformBrowser(this.platformId)) return null;
    const storedData = localStorage.getItem(`formatec_user_${email}`);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return null;
  }

  // Admin methods
  addCourse(course: Partial<Course>) {
    const newCourse: Course = {
      ...course as Course,
      id: Date.now(),
      levels: course.levels || []
    };
    this.courses.update(courses => [...courses, newCourse]);
  }

  updateCourse(updatedCourse: Course) {
    this.courses.update(courses => courses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  }

  deleteCourse(id: number) {
    this.courses.update(courses => courses.filter(c => c.id !== id));
  }

  getCompletedCourses(): Course[] {
    return this.courses().filter(course => this.getCourseProgress(course.id) === 100);
  }

  getBrandLogo(): string {
    // Returns the brand logo from localStorage or a default one
    if (isPlatformBrowser(this.platformId)) {
      const savedLogo = localStorage.getItem('formatec_logo');
      if (savedLogo) return savedLogo;
    }
    return 'https://ais-pre-7awxrrunuewt2zabctfcwd-85397199196.us-west1.run.app/favicon.ico'; // Placeholder default
  }
}
