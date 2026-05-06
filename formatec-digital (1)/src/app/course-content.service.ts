import { Injectable, inject } from '@angular/core';
import { Question } from './course.service';
import { ExamService } from './exam.service';

export interface InfographicItem {
  icon: string;
  label: string;
  detail: string;
}

export interface Infographic {
  title: string;
  purpose: string;
  items: InfographicItem[];
}

export interface LessonContent {
  title: string;
  topic: string;
  important: string;
  purpose: string;
  practice: string;
  activity: string;
  reflection: string;
  video: string;
  fallbackVideos?: string[];
  infographics?: Infographic[];
}

export interface LevelContent {
  level: number;
  lessons: LessonContent[];
  exam?: Question[];
}

export interface CourseDetail {
  id: number;
  title: string;
  generalInfo: string;
  stepByStepGuide: string[];
  importance: string;
  whatYouWillLearn: string[];
  levels: LevelContent[];
}

@Injectable({
  providedIn: 'root'
})
export class CourseContentService {
  private examService = inject(ExamService);
  private contents: CourseDetail[] = this.generateAllContents();

  private generateAllContents(): CourseDetail[] {
    const courses = [
      { 
        id: 1, 
        title: 'Informática Básica', 
        category: 'Tecnología',
        generalInfo: 'Domina las herramientas digitales esenciales para el mundo moderno, desde el manejo de archivos hasta la navegación segura en internet.',
        importance: 'En la actualidad, la alfabetización digital es un requisito indispensable para cualquier empleo y para la vida cotidiana.',
        whatYouWillLearn: [
          'Uso eficiente de sistemas operativos (Windows/macOS)',
          'Gestión de archivos y carpetas en la nube',
          'Navegación segura y búsqueda avanzada en internet',
          'Fundamentos de seguridad informática y antivirus'
        ],
        stepByStepGuide: [
          'Reconocimiento de hardware y periféricos',
          'Configuración inicial del sistema operativo',
          'Manejo de explorador de archivos',
          'Uso de navegadores y correo electrónico',
          'Mantenimiento preventivo básico'
        ]
      },
      { 
        id: 2, 
        title: 'Barbería Profesional', 
        category: 'Belleza',
        generalInfo: 'Aprende el arte de la barbería clásica y moderna, dominando técnicas de corte, afeitado y diseño de barba.',
        importance: 'La barbería es un oficio con alta demanda y una excelente oportunidad para emprender tu propio negocio.',
        whatYouWillLearn: [
          'Técnicas de corte con máquina y tijera',
          'Realización de degradados (Fade) perfectos',
          'Perfilado y cuidado de la barba',
          'Higiene y mantenimiento de herramientas'
        ],
        stepByStepGuide: [
          'Introducción a las herramientas del barbero',
          'Técnicas de partición y sección del cabello',
          'Práctica de cortes básicos y clásicos',
          'Dominio de técnicas de degradado',
          'Servicio de afeitado y ritual de barba'
        ]
      },
      { 
        id: 3, 
        title: 'Repostería', 
        category: 'Cocina',
        generalInfo: 'Descubre los secretos de la pastelería fina, aprendiendo a crear postres deliciosos y visualmente impactantes.',
        importance: 'La repostería combina precisión científica con expresión artística, permitiéndote crear momentos inolvidables.',
        whatYouWillLearn: [
          'Fundamentos de las masas y batidos',
          'Elaboración de cremas, rellenos y coberturas',
          'Técnicas de horneado y control de temperatura',
          'Decoración artística de pasteles y postres'
        ],
        stepByStepGuide: [
          'Conocimiento de ingredientes y pesaje exacto',
          'Preparación de bizcochos y masas base',
          'Elaboración de merengues y cremas pasteleras',
          'Montaje y nivelado de pasteles',
          'Técnicas de decoración con manga y espátula'
        ]
      },
      { 
        id: 4, 
        title: 'Uñas Acrílicas', 
        category: 'Belleza',
        generalInfo: 'Conviértete en una experta en el esculpido de uñas, dominando las técnicas de acrílico, gel y diseño artístico.',
        importance: 'El cuidado de las uñas es uno de los servicios de belleza más solicitados y rentables actualmente.',
        whatYouWillLearn: [
          'Preparación correcta de la uña natural',
          'Aplicación de acrílico con perla perfecta',
          'Técnicas de limado y estructura',
          'Diseño de Nail Art y tendencias actuales'
        ],
        stepByStepGuide: [
          'Anatomía de la uña y bioseguridad',
          'Preparación química y física de la uña',
          'Colocación de tips y moldes',
          'Aplicación de acrílico y control de producto',
          'Finalizado, pulido y diseño creativo'
        ]
      },
      { 
        id: 5, 
        title: 'Auxiliar de Enfermería', 
        category: 'Salud',
        generalInfo: 'Capacítate para brindar cuidados integrales a pacientes, apoyando al equipo médico con ética y profesionalismo.',
        importance: 'Los auxiliares de enfermería son el pilar del cuidado directo al paciente, marcando la diferencia en su recuperación.',
        whatYouWillLearn: [
          'Toma y registro de signos vitales',
          'Técnicas de movilización y confort del paciente',
          'Primeros auxilios y atención de emergencias',
          'Normas de bioseguridad y asepsia'
        ],
        stepByStepGuide: [
          'Fundamentos de la enfermería y ética profesional',
          'Protocolos de higiene y lavado de manos',
          'Monitoreo de constantes vitales',
          'Asistencia en la alimentación y aseo del paciente',
          'Prevención de úlceras y cuidados básicos'
        ]
      },
      { 
        id: 6, 
        title: 'Inglés Básico', 
        category: 'Idiomas',
        generalInfo: 'Inicia tu camino en el idioma más hablado del mundo, desarrollando habilidades de escucha, habla, lectura y escritura.',
        importance: 'Dominar el inglés expande tus horizontes profesionales y te permite conectar con el mundo entero.',
        whatYouWillLearn: [
          'Vocabulario esencial para la vida diaria',
          'Estructuras gramaticales básicas (Present Simple)',
          'Pronunciación y comprensión auditiva',
          'Habilidades de presentación personal'
        ],
        stepByStepGuide: [
          'Saludos, despedidas y presentaciones',
          'Números, colores y objetos cotidianos',
          'Construcción de oraciones afirmativas y negativas',
          'Preguntas frecuentes y respuestas cortas',
          'Práctica de conversación en situaciones reales'
        ]
      },
      { 
        id: 7, 
        title: 'Reparación de Celulares', 
        category: 'Tecnología',
        generalInfo: 'Aprende a diagnosticar y reparar las fallas más comunes en smartphones, desde cambios de pantalla hasta micro-soldadura.',
        importance: 'Con miles de millones de dispositivos en uso, el servicio técnico de celulares es un negocio de alta rentabilidad.',
        whatYouWillLearn: [
          'Desensamble seguro de diferentes marcas',
          'Cambio de pantallas, baterías y puertos de carga',
          'Diagnóstico de fallas de software y hardware',
          'Uso de multímetro y estación de calor'
        ],
        stepByStepGuide: [
          'Herramientas esenciales y seguridad antiestática',
          'Técnicas de apertura y reconocimiento de partes',
          'Reemplazo de componentes modulares',
          'Introducción a la soldadura básica',
          'Protocolos de prueba y control de calidad'
        ]
      },
      { 
        id: 8, 
        title: 'Maquillaje Profesional', 
        category: 'Belleza',
        generalInfo: 'Domina las técnicas de maquillaje para diferentes ocasiones, aprendiendo sobre colorimetría, visagismo y productos.',
        importance: 'El maquillaje profesional te permite resaltar la belleza y confianza de las personas para sus momentos especiales.',
        whatYouWillLearn: [
          'Preparación de la piel según su tipo',
          'Teoría del color aplicada al maquillaje',
          'Técnicas de contorno y corrección (Visagismo)',
          'Maquillaje social, de noche y para novias'
        ],
        stepByStepGuide: [
          'Conocimiento de brochas y productos',
          'Limpieza y preparación del rostro',
          'Aplicación de base y correctores',
          'Diseño de ojos y aplicación de pestañas',
          'Sellado y fijación del maquillaje'
        ]
      },
      { 
        id: 9, 
        title: 'Cajero Bancario', 
        category: 'Finanzas',
        generalInfo: 'Desarróllate como un profesional de las finanzas, dominando el manejo de efectivo, sistemas bancarios y atención al cliente.',
        importance: 'El cajero bancario es una posición de gran responsabilidad y el primer paso para una carrera en el sector financiero.',
        whatYouWillLearn: [
          'Técnicas de conteo rápido y detección de billetes',
          'Procesamiento de depósitos, retiros y pagos',
          'Normativas de seguridad y prevención de fraudes',
          'Excelencia en el servicio y atención al cliente'
        ],
        stepByStepGuide: [
          'Introducción al sistema financiero',
          'Manejo de efectivo y arqueo de caja',
          'Uso de terminales y software bancario',
          'Protocolos de seguridad y bóveda',
          'Simulación de atención en ventanilla'
        ]
      },
      { 
        id: 10, 
        title: 'Estilismo Profesional', 
        category: 'Belleza',
        generalInfo: 'Especialízate en el diseño de mirada, aprendiendo técnicas avanzadas de cejas y pestañas para transformar rostros.',
        importance: 'Los servicios de cejas y pestañas son de alta recurrencia, garantizando una clientela fiel y constante.',
        whatYouWillLearn: [
          'Diseño de cejas según la morfología facial',
          'Técnicas de depilación y sombreado',
          'Aplicación de extensiones de pestañas',
          'Lifting de pestañas y laminado de cejas'
        ],
        stepByStepGuide: [
          'Morfología del rostro y visagismo de cejas',
          'Técnicas de diseño con hilo y pinza',
          'Aplicación de tintes y henna',
          'Técnicas de aislamiento en pestañas',
          'Cuidados posteriores y mantenimiento'
        ]
      },
      {
        id: 11,
        title: 'Auxiliar de Farmacia',
        category: 'Salud',
        generalInfo: 'Aprende sobre farmacología, atención al cliente en farmacia, gestión de inventarios y normativa legal vigente.',
        importance: 'El auxiliar de farmacia es un eslabón crítico en la cadena de salud, asegurando el uso correcto de medicamentos.',
        whatYouWillLearn: [
          'Fundamentos de Farmacología',
          'Gestión de Inventarios y Almacenamiento',
          'Atención y Dispensación Farmacéutica',
          'Normativa Legal y Ética en Farmacia'
        ],
        stepByStepGuide: [
          'Recepción técnica de medicamentos',
          'Clasificación y almacenamiento por grupo terapéutico',
          'Interpretación de recetas médicas',
          'Servicios de atención al cliente',
          'Control de inventarios y vencimientos'
        ]
      },
      {
        id: 12,
        title: 'Ingeniería Civil: Fundamentos',
        category: 'Ingeniería',
        generalInfo: 'Estudia las bases de la construcción moderna, desde el análisis estructural hasta la gestión de obras civiles complejas.',
        importance: 'La ingeniería civil es el motor del desarrollo de infraestructura, fundamental para el crecimiento de las ciudades y la sociedad.',
        whatYouWillLearn: [
          'Cálculo y análisis estructural básico',
          'Estudio de suelos y geotecnia aplicada',
          'Mecánica de fluidos e hidráulica',
          'Gestión, costos y presupuestos en obra'
        ],
        stepByStepGuide: [
          'Fundamentos de física y matemáticas aplicadas',
          'Dibujo técnico e introducción al BIM',
          'Análisis de cargabilidad y materiales estructurales',
          'Hidrología y saneamiento urbano',
          'Prácticas de ética y seguridad industrial'
        ]
      }
    ];

    return courses.map(course => ({
      id: course.id,
      title: course.title,
      generalInfo: course.generalInfo,
      stepByStepGuide: course.stepByStepGuide,
      importance: course.importance,
      whatYouWillLearn: course.whatYouWillLearn,
      levels: this.generateLevels(course.id, course.category)
    }));
  }

  private generateLevels(courseId: number, category: string): LevelContent[] {
    const levels: LevelContent[] = [];
    for (let l = 1; l <= 4; l++) {
      const lessons: LessonContent[] = [];
      for (let i = 1; i <= 5; i++) {
        lessons.push(this.generateLesson(courseId, category, l, i));
      }
      levels.push({ 
        level: l, 
        lessons,
        exam: this.examService.getQuestionsForCourse(courseId, l)
      });
    }
    return levels;
  }

  private generateLesson(courseId: number, category: string, level: number, lesson: number): LessonContent {
    let dynamicData = this.getDynamicData(courseId, category, level, lesson);
    let videoList = this.getLessonVideos(courseId, category, level, lesson);
    
    // Caso específico: Barbería Profesional - Degradado fade paso a paso
    if (courseId === 2 && level === 2 && lesson === 4) {
      dynamicData = {
        topic: 'Degradado fade paso a paso',
        important: 'La transición entre los diferentes niveles de corte debe ser suave y sin líneas marcadas. El uso del "cuchareo" es vital.',
        purpose: 'Dominar la técnica de degradado (fade) utilizando diferentes números de guía.',
        practice: 'Practica el borrado de líneas entre la guía 0.5 y la 1.5.',
        activity: 'Realiza un corte fade completo en un modelo o cabezal de práctica y verifica la limpieza del degradado.',
        reflection: '¿Qué guía consideras que es la más difícil de difuminar y por qué?'
      };
      videoList = ['https://www.youtube.com/embed/whdHP_urL7k', ...videoList];
    }

    const infographics = this.getInfographics(courseId, category, level, lesson, dynamicData.topic);

    return {
      title: `Lección ${lesson}: ${dynamicData.topic}`,
      topic: dynamicData.topic,
      important: dynamicData.important,
      purpose: dynamicData.purpose,
      practice: dynamicData.practice,
      activity: dynamicData.activity,
      reflection: dynamicData.reflection,
      video: videoList[0],
      fallbackVideos: videoList.slice(1),
      infographics
    };
  }

  private getInfographics(courseId: number, category: string, level: number, lesson: number, topic: string): Infographic[] {
    const infos: Infographic[] = [];
    
    // Primary Infographic based on Topic
    const mainInfo: Infographic = {
      title: `Infografía: ${topic}`,
      purpose: `Resumen visual sobre ${topic.toLowerCase()}`,
      items: this.getInfographicItems(courseId, category, level, lesson)
    };
    infos.push(mainInfo);

    // Secondary Infographic (Guía Rápida / TipSheet)
    if (lesson % 2 === 0) {
      infos.push({
        title: "Guía de Éxito Profesional",
        purpose: "Puntos clave para destacar en el área",
        items: [
          { icon: 'star', label: 'Excelencia', detail: 'Mantén siempre los más altos estándares de calidad.' },
          { icon: 'security', label: 'Seguridad', detail: 'Prioriza tu integridad y la de tus clientes.' },
          { icon: 'groups', label: 'Atención', detail: 'El servicio al cliente es la base del crecimiento.' }
        ]
      });
    }

    // Third Infographic: Topic-based specialized analysis
    infos.push({
      title: "Análisis de Conceptos Clave",
      purpose: `Profundización visual sobre: ${topic}`,
      items: this.getInfographicItems(courseId, category, level, lesson, topic)
    });

    return infos;
  }

  private getInfographicItems(courseId: number, category: string, level: number, lesson: number, topic?: string): InfographicItem[] {
    if (topic) {
      // Nueva sección: Infografía basada en el Tópico específico (Visual Aid for complex concepts)
      const topicLower = topic.toLowerCase();
      
      if (topicLower.includes('hardware') || topicLower.includes('mantenimiento') || topicLower.includes('arquitectura')) {
        return [
          { icon: 'settings_suggest', label: 'Configuración', detail: 'Ajustes óptimos para el rendimiento del equipo.' },
          { icon: 'build', label: 'Mantenimiento', detail: 'Acciones preventivas para alargar la vida útil.' },
          { icon: 'compress', label: 'Integridad', detail: 'Verificación de conexiones y estados físicos.' }
        ];
      }
      
      if (topicLower.includes('seguridad') || topicLower.includes('ético') || topicLower.includes('bioseguridad')) {
        return [
          { icon: 'policy', label: 'Normativa', detail: 'Regulaciones vigentes que rigen el ejercicio profesional.' },
          { icon: 'verified_user', label: 'Validación', detail: 'Protocolos de doble verificación para evitar errores.' },
          { icon: 'report_problem', label: 'Riesgos', detail: 'Identificación temprana de posibles amenazas o fallas.' }
        ];
      }

      if (topicLower.includes('técnica') || topicLower.includes('diseño') || topicLower.includes('estilo')) {
        return [
          { icon: 'brush', label: 'Estética', detail: 'Principios de composición y armonía visual aplicados.' },
          { icon: 'straighten', label: 'Proporción', detail: 'Cálculo de medidas exactas para resultados simétricos.' },
          { icon: 'auto_fix_normal', label: 'Acabado', detail: 'Detalles finales que otorgan el sello de calidad premium.' }
        ];
      }

      if (topicLower.includes('farmacia') || topicLower.includes('medicamento') || topicLower.includes('dosis')) {
        return [
          { icon: 'medication', label: 'Farmacología', detail: 'Estudio de la interacción química de los compuestos.' },
          { icon: 'inventory', label: 'Stock', detail: 'Gestión eficiente para evitar quiebres de inventario.' },
          { icon: 'receipt_long', label: 'Prescripción', detail: 'Validación técnica rigurosa de la orden médica.' }
        ];
      }

      if (topicLower.includes('enfermería') || topicLower.includes('paciente') || topicLower.includes('cuidados')) {
        return [
          { icon: 'monitor_heart', label: 'Monitoreo', detail: 'Vigilancia constante de parámetros fisiológicos.' },
          { icon: 'accessibility_new', label: 'Ergonomía', detail: 'Seguridad física para el paciente y el personal.' },
          { icon: 'healing', label: 'Recuperación', detail: 'Protocolos enfocados en la mejora clínica del usuario.' }
        ];
      }

      return [
        { icon: 'psychology', label: 'Teoría', detail: `Conceptos abstractos que fundamentan ${topic}.` },
        { icon: 'trending_up', label: 'Evolución', detail: 'Cómo ha progresado este campo en los últimos años.' },
        { icon: 'hub', label: 'Conectividad', detail: 'Relación de este tema con otros módulos del curso.' }
      ];
    }

    const items: Record<string, InfographicItem[][]> = {
      'Belleza': [
        [
          { icon: 'sanitizer', label: 'Barbicida (Higiene)', detail: 'Desinfectante de grado hospitalario obligatorio entre cada cliente.' },
          { icon: 'straighten', label: 'Ángulo 30°', detail: 'Inclinación correcta de la navaja sobre la piel para evitar cortes.' },
          { icon: 'palette', label: 'Visagismo', detail: 'Adaptar el diseño de barba o cejas a la morfología del rostro.' }
        ],
        [
          { icon: 'content_cut', label: 'Clipper over comb', detail: 'Técnica para unir laterales con zona superior usando peine.' },
          { icon: 'auto_fix_high', label: 'Difuminado 0.5-1.5', detail: 'La clave para borrar líneas marcadas en un degradado perfecto.' },
          { icon: 'shutter_speed', label: 'Trimmer', detail: 'Herramienta específica para marcar contornos, patillas y cuello.' }
        ]
      ],
      'Tecnología': [
        [
          { icon: 'memory', label: 'Procesador (CPU)', detail: 'El "cerebro" de la computadora; gestiona todas las operaciones.' },
          { icon: 'folder_special', label: 'Papelera', detail: 'Almacenamiento temporal de archivos borrados antes de eliminarlos.' },
          { icon: 'security', label: 'Phishing', detail: 'Suplantación de identidad para robo de datos. ¡No abras links sospechosos!' }
        ],
        [
          { icon: 'bolt', label: 'Memoria RAM', detail: 'Almacenamiento temporal y volátil que acelera los procesos activos.' },
          { icon: 'cloud_done', label: 'Backup (Nube)', detail: 'Copia de seguridad en servidores remotos para prevenir pérdida de datos.' },
          { icon: 'vpn_key', label: '2FA', detail: 'Autenticación de dos pasos: la mejor defensa contra accesos no autorizados.' }
        ]
      ],
      'Cocina': [
        [
          { icon: 'scale', label: 'Balanza Gramera', detail: 'El pesaje exacto es la base del éxito en repostería y pastelería.' },
          { icon: 'thermostat', label: 'Horno a 180°C', detail: 'Temperatura estándar para el horneado uniforme de bizcochos.' },
          { icon: 'assignment', label: 'Mise en place', detail: 'Organización previa de todos los insumos ante de empezar.' }
        ],
        [
          { icon: 'egg', label: 'Salmonella', detail: 'Riesgo biológico principal al manejar huevos. Mantener higiene estricta.' },
          { icon: 'cake', label: 'Gluten', detail: 'No batas demasiado la harina para evitar que el bizcocho quede duro.' },
          { icon: 'timer', label: 'Reposo', detail: 'Respetar el enfriamiento en rejilla evita la condensación en la base.' }
        ]
      ],
      'Salud': [
        [
          { icon: 'monitor_heart', label: 'PAS (Emergencia)', detail: 'Proteger, Avisar, Socorrer: protocolo mundial de primera respuesta.' },
          { icon: 'clean_hands', label: 'Lavado Clínico', detail: 'Técnica rigurosa de 11 pasos para eliminar carga bacteriana.' },
          { icon: 'emergency', label: 'Heimlich', detail: 'Maniobra vital para desobstruir vías aéreas por atragantamiento.' }
        ],
        [
          { icon: 'favorite', label: '5 Correctos', detail: 'Dosis, Vía, Hora, Paciente y Medicamento correctos. Regla de oro.' },
          { icon: 'medical_services', label: 'Triage de Color', detail: 'Clasificación de urgencia: Rojo (Inmediato) a Azul (No urgente).' },
          { icon: 'accessibility_new', label: 'Bioergo', detail: 'Postura correcta al movilizar pacientes para evitar lesiones lumbares.' }
        ]
      ],
      'Idiomas': [
        [
          { icon: 'record_voice_over', label: 'Pronunciación', detail: 'Uso de fonética para mejorar la claridad al hablar.' },
          { icon: 'translate', label: 'Cognados', detail: 'Palabras que suenan similar y significan lo mismo en ambos idiomas.' },
          { icon: 'spellcheck', label: 'Estructura SVO', detail: 'Sujeto + Verbo + Objeto: El orden básico de la oración inglesa.' }
        ],
        [
          { icon: 'hearing', label: 'Active Listening', detail: 'Escucha activa para identificar acentos y modismos.' },
          { icon: 'menu_book', label: 'Contexto', detail: 'No traduzcas palabra por palabra; busca el sentido de la frase.' },
          { icon: 'group', label: 'Inmersión', detail: 'Habla con otros aunque cometas errores, es la clave del progreso.' }
        ]
      ],
      'Ingeniería': [
        [
          { icon: 'architecture', label: 'BIM', detail: 'Building Information Modeling para diseño colaborativo en 3D.' },
          { icon: 'layers', label: 'Cimentación', detail: 'Análisis de carga y distribución de esfuerzos en el suelo.' },
          { icon: 'precision_manufacturing', label: 'Maquinaria', detail: 'Cálculo de eficiencia y rendimiento de equipos pesados.' }
        ],
        [
          { icon: 'water', label: 'Hidráulica', detail: 'Comportamiento de fluidos en tuberías y canales abiertos.' },
          { icon: 'landscape', label: 'Topografía', detail: 'Levantamiento preciso para alineamiento de estructuras.' },
          { icon: 'engineering', label: 'Civil 3D', detail: 'Software especializado para diseño de infraestructura lineal.' }
        ]
      ],
      'Finanzas': [
        [
          { icon: 'currency_exchange', label: 'Detección Billete', detail: 'Uso de luz UV y marca de agua para verificar autenticidad.' },
          { icon: 'security', label: 'Sigilo Bancario', detail: 'Protección absoluta de los datos y saldos de los clientes.' },
          { icon: 'calculate', label: 'Recuento Rápido', detail: 'Técnica de conteo por abanico para agilizar la atención.' }
        ],
        [
          { icon: 'account_balance', label: 'Lavado Activos', detail: 'Detección de transacciones sospechosas según normativa legal.' },
          { icon: 'receipt_long', label: 'Arqueo Caja', detail: 'Conciliación física del efectivo contra el reporte de sistema.' },
          { icon: 'support_agent', label: 'Venta Cruzada', detail: 'Ofrecer productos adicionales que agreguen valor al cliente.' }
        ]
      ]
    };

    let categoryKey = category;
    if (category === 'Salud' && courseId === 11) categoryKey = 'Salud-Farmacia';

    const categoryItems = items[categoryKey] || items['Tecnología'];
    return categoryItems[(lesson - 1) % categoryItems.length];
  }

  private getDynamicData(courseId: number, category: string, level: number, lesson: number): { topic: string, important: string, purpose: string, practice: string, activity: string, reflection: string } {
    const data: Record<string, { topic: string, important: string, purpose: string, practice: string, activity: string, reflection?: string }[]> = {
      'Belleza': [
        { topic: 'Fundamentos de Estética', important: 'La higiene es la base de todo servicio profesional.', purpose: 'Entender los conceptos básicos de belleza.', practice: 'Organiza tu estación de trabajo.', activity: 'Realiza una limpieza profunda de herramientas.' },
        { topic: 'Técnicas de Aplicación', important: 'La precisión evita desperdicio de material.', purpose: 'Dominar el uso de productos.', practice: 'Aplica producto en superficies de prueba.', activity: 'Demuestra la técnica correcta de aplicación.' },
        { topic: 'Diseño y Morfología', important: 'Cada rostro es único y requiere un diseño personalizado.', purpose: 'Aprender a diseñar según el cliente.', practice: 'Dibuja esquemas de diseño facial.', activity: 'Realiza un análisis morfológico a un compañero.' },
        { topic: 'Perfeccionamiento de Estilo', important: 'El detalle final marca la diferencia profesional.', purpose: 'Lograr acabados de alta calidad.', practice: 'Practica técnicas de difuminado.', activity: 'Crea un look completo de vanguardia.' },
        { topic: 'Atención al Cliente y Ética', important: 'La confianza del cliente es tu mayor activo.', purpose: 'Desarrollar habilidades blandas.', practice: 'Simula una consulta profesional.', activity: 'Redacta un protocolo de atención al cliente.' }
      ],
      'Tecnología': [
        { topic: 'Hardware y Arquitectura', important: 'Nunca manipules componentes internos con energía conectada.', purpose: 'Identificar componentes físicos.', practice: 'Desmonta y monta periféricos básicos.', activity: 'Crea un inventario de hardware.' },
        { topic: 'Software y Sistemas', important: 'Los antivirus son esenciales para la seguridad.', purpose: 'Entender el funcionamiento lógico.', practice: 'Configura opciones del sistema operativo.', activity: 'Instala y actualiza software esencial.' },
        { topic: 'Redes e Internet', important: 'Usa contraseñas seguras y autenticación 2FA.', purpose: 'Navegar y conectar de forma segura.', practice: 'Configura una conexión de red básica.', activity: 'Realiza una búsqueda avanzada de información.' },
        { topic: 'Herramientas de Productividad', important: 'Los atajos de teclado aumentan tu eficiencia.', purpose: 'Dominar suites de oficina.', practice: 'Crea documentos y hojas de cálculo complejas.', activity: 'Diseña una presentación profesional.' },
        { topic: 'Mantenimiento y Soporte', important: 'El mantenimiento preventivo evita fallas costosas.', purpose: 'Solucionar problemas comunes.', practice: 'Realiza limpieza de software y optimización.', activity: 'Diagnostica una falla común de sistema.' },
        { topic: 'Seguridad en la Nube', important: 'La redundancia de datos es clave.', purpose: 'Entender almacenamiento remoto.', practice: 'Configura una cuenta de Google Drive.', activity: 'Respaldo de archivos críticos.' },
        { topic: 'Domótica e IoT', important: 'La red debe ser estable para dispositivos inteligentes.', purpose: 'Automatización del hogar.', practice: 'Configura un foco inteligente.', activity: 'Crea una escena de automatización.' },
        { topic: 'Introducción a la IA', important: 'La IA es una herramienta de asistencia, no de reemplazo total.', purpose: 'Explorar modelos de lenguaje.', practice: 'Realiza prompts efectivos.', activity: 'Genera una solución con IA.' },
        { topic: 'Desarrollo Web II', important: 'El SEO ayuda a que tu sitio sea encontrado.', purpose: 'Publicación de sitios.', practice: 'Servidores y hosting.', activity: 'Despliega un sitio estático.' },
        { topic: 'Ética y Futuro Digital', important: 'El conocimiento conlleva responsabilidad.', purpose: 'Debate sobre tecnología.', practice: 'Análisis de casos éticos.', activity: 'Ensayo sobre el futuro.' }
      ],
      'Ingeniería': [
        { topic: 'Mecánica de Materiales', important: 'El coeficiente de seguridad previene colapsos.', purpose: 'Entender esfuerzos y deformaciones.', practice: 'Cálculo de tensiones.', activity: 'Prueba de carga virtual.' },
        { topic: 'Estática de Estructuras', important: 'La suma de fuerzas debe ser cero.', purpose: 'Equilibrio en construcciones.', practice: 'Diagramas de cuerpo libre.', activity: 'Análisis de armaduras.' },
        { topic: 'Topografía', important: 'La precisión en el campo evita errores en obra.', purpose: 'Mediciones de terreno.', practice: 'Planos de curvas de nivel.', activity: 'Levantamiento virtual.' },
        { topic: 'Hidráulica', important: 'El agua siempre busca su nivel.', purpose: 'Movimiento de fluidos.', practice: 'Cálculo de caudales.', activity: 'Diseño de tubería.' },
        { topic: 'Geotecnia', important: 'El suelo es el cimiento de todo.', purpose: 'Estudio de suelos.', practice: 'Clasificación de suelos.', activity: 'Ensayo de penetración.' },
        { topic: 'Instalaciones Eléctricas', important: 'Cumple siempre con la norma eléctrica.', purpose: 'Distribución de energía.', practice: 'Plano eléctrico de casa.', activity: 'Cálculo de cargas.' },
        { topic: 'Maquinaria Pesada', important: 'La seguridad es primero en la operación.', purpose: 'Conocer equipos de obra.', practice: 'Rendimiento de maquinaria.', activity: 'Plan de excavación.' },
        { topic: 'Gestión de Proyectos', important: 'El tiempo es dinero en ingeniería.', purpose: 'Planificación de obra.', practice: 'Cronograma en Gantt.', activity: 'Presupuesto de materiales.' },
        { topic: 'Impacto Ambiental', important: 'Construir sin destruir.', purpose: 'Sustentabilidad.', practice: 'Matriz de impacto.', activity: 'Plan de mitigación.' },
        { topic: 'Ética en Ingeniería', important: 'Firmamos bajo responsabilidad civil.', purpose: 'Responsabilidad profesional.', practice: 'Análisis de fallas famosas.', activity: 'Código de ética.' }
      ],
      'Cocina': [
        { topic: 'Seguridad Alimentaria', important: 'La temperatura de refrigeración debe ser constante.', purpose: 'Garantizar alimentos seguros.', practice: 'Etiqueta y organiza insumos.', activity: 'Realiza un control de temperatura.' },
        { topic: 'Técnicas de Repostería', important: 'La repostería es química; las medidas deben ser exactas.', purpose: 'Aprender métodos de mezcla.', practice: 'Pesa ingredientes con precisión milimétrica.', activity: 'Prepara una masa base perfecta.' },
        { topic: 'Horneado y Cocción', important: 'No abras el horno antes del tiempo indicado.', purpose: 'Dominar los puntos de cocción.', practice: 'Controla tiempos y temperaturas de horneado.', activity: 'Hornea un bizcocho con altura ideal.' },
        { topic: 'Rellenos y Coberturas', important: 'La consistencia debe ser firme pero suave.', purpose: 'Crear sabores y texturas.', practice: 'Elabora cremas y ganaches.', activity: 'Rellena y cubre un pastel de prueba.' },
        { topic: 'Decoración Avanzada', important: 'La estética es tan importante como el sabor.', purpose: 'Lograr presentaciones profesionales.', practice: 'Usa boquillas para diseños complejos.', activity: 'Decora un postre de vitrina.' }
      ],
      'Salud': [
        // Level 1: Fundamentos
        { topic: 'Ética y Bioseguridad', important: 'El lavado de manos salva vidas.', purpose: 'Establecer protocolos de seguridad.', practice: 'Demuestra el lavado de manos clínico.', activity: 'Colócate el equipo de protección personal.' },
        { topic: 'Fundamentos de Anatomía', important: 'Conocer la ubicación de órganos es vital para diagnósticos.', purpose: 'Identificar sistemas del cuerpo humano.', practice: 'Localiza puntos anatómicos clave.', activity: 'Dibuja un mapa de los sistemas principales.' },
        { topic: 'Terminología Médica', important: 'El lenguaje técnico evita ambigüedades en récords médicos.', purpose: 'Aprender prefijos y sufijos médicos.', practice: 'Decodifica 10 términos médicos complejos.', activity: 'Redacta un párrafo usando terminología técnica.' },
        { topic: 'Higiene del Paciente', important: 'La limpieza previene infecciones nosocomiales.', purpose: 'Aprender técnicas de aseo en cama.', practice: 'Simula el baño de un paciente postrado.', activity: 'Registra el procedimiento de higiene realizado.' },
        { topic: 'Mecánica Corporal', important: 'Protege tu espalda usando las piernas para levantar peso.', purpose: 'Evitar lesiones laborales.', practice: 'Realiza levantamientos con técnica ergonómica.', activity: 'Moviliza un simulador de paciente siguiendo protocolos.' },
        // Level 2: Signos y Primeros Auxilios
        { topic: 'Signos Vitales I: Presión', important: 'Cualquier alteración debe reportarse de inmediato.', purpose: 'Monitorear el estado hemodinámico.', practice: 'Toma la presión arterial (manual y digital).', activity: 'Registra tensiones en rangos normales y críticos.' },
        { topic: 'Signos Vitales II: Pulso y Resp.', important: 'La frecuencia rítmica indica estabilidad cardíaca.', purpose: 'Evaluar funciones vitales básicas.', practice: 'Mide el pulso radial y carotídeo.', activity: 'Analiza variaciones de pulso tras actividad física.' },
        { topic: 'Primeros Auxilios: Heridas', important: 'Nunca retires objetos empalados de una herida.', purpose: 'Controlar hemorragias y desinfectar.', practice: 'Coloca vendajes de compresión y torniquetes sim.', activity: 'Clasifica diferentes tipos de heridas y tratamiento.' },
        { topic: 'Maniobra de Heimlich', important: 'Identifica el signo universal de atragantamiento.', purpose: 'Desobstruir vías aéreas.', practice: 'Realiza la maniobra en un maniquí de práctica.', activity: 'Explica los pasos a seguir en infantes vs adultos.' },
        { topic: 'RCP Básico (BLS)', important: 'Inicia compresiones antes de 4 minutos de paro.', purpose: 'Mantener circulación en emergencias.', practice: 'Sincroniza compresiones y ventilaciones 30:2.', activity: 'Simula una cadena de supervivencia completa.' },
        // Level 3: Procedimientos
        { topic: 'Cuidados del Paciente Crítico', important: 'La vigilancia debe ser 24/7 sin distracciones.', purpose: 'Brindar confort en cuidados intensivos.', practice: 'Aprende el manejo de monitores multiparamétricos.', activity: 'Diseña una hoja de flujo de signos vitales.' },
        { topic: 'Canalización y Venoclisis', important: 'Mantener la esterilidad absoluta del catéter.', purpose: 'Inicia accesos venosos periféricos.', practice: 'Identifica venas aptas en el antebrazo.', activity: 'Simula la fijación de una vía venosa.' },
        { topic: 'Oxigenoterapia', important: 'El oxígeno es un medicamento; requiere dosis exacta.', purpose: 'Administrar soporte ventilatorio.', practice: 'Configura puntas nasales y mascarillas.', activity: 'Calcula litros por minuto según saturación.' },
        { topic: 'Sondaje y Drenajes', important: 'Evita el reflujo manteniendo la bolsa bajo el nivel.', purpose: 'Manejo de eliminación asistida.', practice: 'Aprende tipos de sondas vesicales y gástricas.', activity: 'Realiza el vaciado y registro de drenajes.' },
        { topic: 'Curación de Escaras', important: 'La rotación cada 2 horas previene úlceras.', purpose: 'Tratar lesiones por presión.', practice: 'Aplica parches hidrocoloides y limpieza.', activity: 'Protocoliza el cambio de postura de un piso.' },
        // Level 4: Especialización
        { topic: 'Administración de Medicamentos', important: 'Verifica siempre los "5 correctos".', purpose: 'Entender la farmacología clínica.', practice: 'Calcula dosis y prepara materiales.', activity: 'Simula la administración de una dosis IM.' },
        { topic: 'Salud Materno-Infantil', important: 'El bienestar del binomio es la prioridad.', purpose: 'Asistir en cuidados perinatales.', practice: 'Aprende el baño del recién nacido.', activity: 'Elabora una guía de lactancia materna.' },
        { topic: 'Enfermería Geriátrica', important: 'La paciencia es la herramienta principal.', purpose: 'Cuidados en el adulto mayor.', practice: 'Ejercicios de estimulación cognitiva.', activity: 'Adapta un entorno para prevenir caídas.' },
        { topic: 'Salud Mental y Ética', important: 'El secreto profesional es inviolable.', purpose: 'Manejo de crisis y apoyo emocional.', practice: 'Técnicas de comunicación terapéutica.', activity: 'Analiza un dilema ético en la práctica salud.' },
        { topic: 'Simulacro de Certificación', important: 'Revisa todos los módulos antes de este examen.', purpose: 'Validar competencias finales.', practice: 'Examen integrador de todas las técnicas.', activity: 'Presenta un caso clínico resuelto de principio a fin.' }
      ],
      'Salud-Farmacia': [
        // Level 1: Fundamentos
        { topic: 'Farmacología Fundamental', important: 'El índice terapéutico determina la seguridad del fármaco.', purpose: 'Comprender la farmacodinamia básica.', practice: 'Clasifica fármacos por su grupo terapéutico.', activity: 'Analiza una ficha técnica de medicamento.' },
        { topic: 'Formas Galénicas', important: 'La vía de administración afecta la biodisponibilidad.', purpose: 'Identificar tipos de medicamentos.', practice: 'Reconoce emulsiones, suspensiones y comprimidos.', activity: 'Prepara un simulacro de reconstitución.' },
        { topic: 'Lectura de Recetas', important: 'Ante duda en la caligrafía, consulta al médico.', purpose: 'Interpretar prescripciones médicas.', practice: 'Analiza 5 recetas con abreviaturas latinas.', activity: 'Valida una receta con error de dosis simulado.' },
        { topic: 'Atención farmacéutica', important: 'Escucha activa para detectar automedicación.', purpose: 'Guiar al usuario en su tratamiento.', practice: 'Simula una consulta de venta de OTC.', activity: 'Elabora un consejo de salud para un paciente hipertenso.' },
        { topic: 'Aseo y Orden Farmacéutico', important: 'Zonas limpias evitan contaminación cruzada.', purpose: 'Mantener estándares de sanidad.', practice: 'Organiza estanterías por orden alfabético.', activity: 'Audita la limpieza de la zona de pesaje.' },
        // Level 2: Gestión
        { topic: 'Gestión Farmacéutica: FEFO', important: 'El producto más próximo a vencer sale primero.', purpose: 'Aprender el control de inventarios.', practice: 'Simula una recepción técnica de pedido.', activity: 'Realiza un balance de stock y vencimientos.' },
        { topic: 'Cadena de Frío', important: 'La insulina debe mantenerse entre 2°C y 8°C.', purpose: 'Preservar medicamentos termolábiles.', practice: 'Monitorea la temperatura de un refrigerador.', activity: 'Actúa ante una falla eléctrica en la farmacia.' },
        { topic: 'Sustancias Controladas', important: 'Pérdida de un miligramo debe ser reportada.', purpose: 'Manejo de psicotrópicos y estupefacientes.', practice: 'Simula registro en el libro de control.', activity: 'Verifica requisitos legales para receta de control.' },
        { topic: 'Bioética Farmacéutica', important: 'El beneficio del paciente sobre el lucro comercial.', purpose: 'Desarrollar criterio profesional.', practice: 'Analiza casos de objeción de conciencia.', activity: 'Redacta un código de ética para tu farmacia.' },
        { topic: 'Farmacovigilancia', important: 'Reportar RAM (Reacción Adversa) salva vidas.', purpose: 'Detectar efectos inesperados.', practice: 'Llena un formulario de notificación de RAM.', activity: 'Investiga una alerta sanitaria reciente de la autoridad.' },
        // Level 3: Especialización I
        { topic: 'Farmacia Hospitalaria', important: 'La dosis unitaria reduce errores en un 40%.', purpose: 'Conocer el flujo en centros de salud.', practice: 'Prepara un carro de medicación por paciente.', activity: 'Diferencia farmacia clínica vs comunitaria.' },
        { topic: 'Productos Médicos e Insumos', important: 'Verifica siempre la fecha de esterilización.', purpose: 'Manejo de jeringas, gazas y equipos.', practice: 'Clasifica materiales de curación.', activity: 'Explica el uso de un nebulizador doméstico.' },
        { topic: 'Toxicología Básica', important: 'Identifica el antídoto específico para cada grupo.', purpose: 'Reaccionar ante intoxicaciones primarias.', practice: 'Manejo de hoja de seguridad de químicos.', activity: 'Protocolo ante derrame de sustancia corrosiva.' },
        { topic: 'Marketing Farmacéutico Ético', important: 'No prometas curas milagrosas no comprobadas.', purpose: 'Técnicas de venta responsable.', practice: 'Diseña un exhibidor para productos de higiene.', activity: 'Crea una campaña de prevención de gripe.' },
        { topic: 'Legislación Sanitaria II', important: 'La habilitación de salud debe estar visible.', purpose: 'Cumplimiento de normas ministeriales.', practice: 'Revisa check-list de auditoría sanitaria.', activity: 'Prepara expediente para apertura de nuevo local.' },
        // Level 4: Especialización Final
        { topic: 'Preparaciones Magistrales', important: 'La balanza debe estar nivelada antes del uso.', purpose: 'Elaborar fórmulas personalizadas.', practice: 'Pesaje exacto de polvos y bases.', activity: 'Simula mezcla de una crema dermatológica.' },
        { topic: 'Dermo-Farmacia', important: 'Identifica el tipo de piel antes de recomendar.', purpose: 'Cuidado estético y terapéutico cutáneo.', practice: 'Analiza componentes de protectores solares.', activity: 'Diseña una rutina de cuidado facial técnica.' },
        { topic: 'Fitoterapia y Naturales', important: 'Lo natural también puede tener efectos secundarios.', purpose: 'Conocer medicinas alternativas seguras.', practice: 'Clasifica 10 plantas medicinales comunes.', activity: 'Precauciones de interacción natural-sintético.' },
        { topic: 'Gestión de Residuos Bio-Sanitarios', important: 'Los cortopunzantes van siempre a envase rojo rígido.', purpose: 'Manejo seguro de desechos peligrosos.', practice: 'Diferencia clasificación de bolsas (roja/amarilla).', activity: 'Ruta crítica de retiro de basura especial.' },
        { topic: 'Simulacro Master Farmacia', important: 'Éxito en tu camino como Auxiliar Profesional.', purpose: 'Validación integral de conocimientos.', practice: 'Resolución de 30 casos de mostrador.', activity: 'Proyecto final: Optimización de una farmacia real.' }
      ]
    };

    let categoryKey = category;
    if (category === 'Salud' && courseId === 11) categoryKey = 'Salud-Farmacia';

    const categoryData = data[categoryKey] || data['Tecnología'];
    const index = ((level - 1) * 5 + (lesson - 1)) % categoryData.length;
    const base = categoryData[index];
    
    return {
      ...base,
      topic: `Nivel ${level} - ${base.topic}`,
      reflection: base.reflection || `¿De qué manera el conocimiento de "${base.topic}" te ayudará a resolver problemas reales en el ámbito de ${category}?`
    };
  }


private getLessonVideos(courseId: number, category: string, level: number, lesson: number): string[] {

  const videoLibrary: Record<number, string[]> = {

    // 1 - INFORMÁTICA
    1: [
      "https://www.youtube.com/embed/o_78Ue_EUeI",
      "https://www.youtube.com/embed/mTbC3NRz_7Q",
      "https://www.youtube.com/embed/Il74o5rUBb4",
      "https://www.youtube.com/embed/AjDA2wsfv-Q",
      "https://www.youtube.com/embed/uQYjGhF-o_s"
    ],

    // 2 - BARBERÍA
    2: [
      "https://www.youtube.com/embed/4ZBJe1SGSdQ",
      "https://www.youtube.com/embed/PRZNIQ4KU2I",
      "https://www.youtube.com/embed/aA9ZUeoPzF4",
      "https://www.youtube.com/embed/7yS1hMlBcHY",
      "https://www.youtube.com/embed/DMc9brVcKx0"
    ],

    // 3 - REPOSTERÍA
    3: [
      "https://www.youtube.com/embed/JxKguULhLXg",
      "https://www.youtube.com/embed/tT7XyW5udkU",
      "https://www.youtube.com/embed/wKIQWwDBqBQ",
      "https://www.youtube.com/embed/FHEjqeUIu2g",
      "https://www.youtube.com/embed/BFB8W36aBTc"
    ],

    // 5 - ENFERMERÍA
    5: [
      "https://www.youtube.com/embed/lpx0vdx_4tY",
      "https://www.youtube.com/embed/6R_uVtRQ-qc",
      "https://www.youtube.com/embed/ni94ROjkxsc",
      "https://www.youtube.com/embed/5G_lFVjagCQ",
      "https://www.youtube.com/embed/v3-8Fr7UJqI"
    ],

    // 6 - INGLÉS
    6: [
      "https://www.youtube.com/embed/PeXZktbTgLo",
      "https://www.youtube.com/embed/sOClBcjUHZ4",
      "https://www.youtube.com/embed/i8Y87y3pnmk",
      "https://www.youtube.com/embed/3UFEVOPgXwo",
      "https://www.youtube.com/embed/USqEnu73C38"
    ],

    // 7 - REPARACIÓN DE CELULARES
    7: [
      "https://www.youtube.com/embed/1SVYGJGxdGY",
      "https://www.youtube.com/embed/_KWIbH4rSvk",
      "https://www.youtube.com/embed/EHiYD3pL-9E",
      "https://www.youtube.com/embed/yon7z9RakYY",
      "https://www.youtube.com/embed/uN91HZUuX7I"
    ],

    // 8 - MAQUILLAJE / FACIAL
    8: [
      "https://www.youtube.com/embed/hNFCxTbrmEs",
      "https://www.youtube.com/embed/8iIUL6cfwYU",
      "https://www.youtube.com/embed/BUUKUQv3aAI",
      "https://www.youtube.com/embed/OnQal2_AvLc",
      "https://www.youtube.com/embed/u9AfHCl_KSY"
    ],

    // 9 - UÑAS ACRÍLICAS
    9: [
      "https://www.youtube.com/embed/zrSwJsQCXjA",
      "https://www.youtube.com/embed/zrSwJsQCXjA",
      "https://www.youtube.com/embed/hR_VG-ygLQQ",
      "https://www.youtube.com/embed/YYGQV4On6FU",
      "https://www.youtube.com/embed/6E28mvyF5XI"
    ],

    // 10 - ESTILISTA
    10: [
      "https://www.youtube.com/embed/hbPl__2_Z_w",
      "https://www.youtube.com/embed/4B6O8ONWJJs",
      "https://www.youtube.com/embed/GznaJAsQtB0",
      "https://www.youtube.com/embed/fOtDwoAfB1A",
      "https://www.youtube.com/embed/inFOups6QkE"
    ],

    // 11 - INGENIERÍA
    11: [
      "https://www.youtube.com/embed/k_lfzn7YSfI",
      "https://www.youtube.com/embed/JIMtSCIbkxA",
      "https://www.youtube.com/embed/Tos39foG5GU",
      "https://www.youtube.com/embed/Tos39foG5GU",
      "https://www.youtube.com/embed/X5a8ldbeLEM"
    ]
  };

  const videos = videoLibrary[courseId];

  if (!videos) {
    return ["https://www.youtube.com/embed/o_78Ue_EUeI"];
  }

  const index = ((level - 1) * 5 + (lesson - 1)) % videos.length;

  const primary = videos[index];

  const fallbacks = videos.filter(v => v !== primary);

  return [primary, ...fallbacks];
}

  getContentByCourseId(id: number): CourseDetail | undefined {
    return this.contents.find(c => c.id === id);
  }

  getAllContents(): CourseDetail[] {
    return this.contents;
  }

  updateLessonContent(courseId: number, levelNum: number, lessonTitle: string, updates: Partial<LessonContent>) {
    const course = this.contents.find(c => c.id === courseId);
    if (course) {
      const level = course.levels.find(l => l.level === levelNum);
      if (level) {
        const lesson = level.lessons.find(l => l.title === lessonTitle);
        if (lesson) {
          Object.assign(lesson, updates);
        }
      }
    }
  }
}
