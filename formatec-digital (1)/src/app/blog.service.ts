import { Injectable, signal } from '@angular/core';

export interface BlogSection {
  title: string;
  text: string;
  image?: string;
}

export interface BlogPostContent {
  introduction: string;
  sections: BlogSection[];
  tips: string[];
  tools: string[];
  commonErrors: string[];
  jobMarket: string;
  important: string;
  purpose: string;
  practicalActivity: string;
  reflectionQuestions: string[];
}

export interface BlogPost {
  id: number;
  courseId: number;
  title: string;
  excerpt: string;
  content: BlogPostContent;
  image: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private posts = signal<BlogPost[]>(this.generateDefaultPosts());

  getPosts() {
    return this.posts.asReadonly();
  }

  getPostsByCourseId(courseId: number) {
    return this.posts().filter(p => p.courseId === courseId);
  }

  getPostById(id: number) {
    return this.posts().find(p => p.id === id);
  }

  private generateDefaultPosts(): BlogPost[] {
    return [
      {
        id: 1,
        courseId: 1,
        title: 'Domina el Hardware y la Seguridad en Windows',
        excerpt: 'Una guía completa desde los componentes físicos hasta la protección digital avanzada.',
        content: {
          introduction: 'Entender cómo funciona tu computadora desde adentro hacia afuera es el primer paso para convertirte en un profesional de IT. En esta guía, exploraremos la relación entre el hardware y el sistema operativo Windows, centrándonos en la seguridad.',
          sections: [
            {
              title: 'Arquitectura de Hardware Moderna',
              text: 'La CPU, la RAM y el almacenamiento (SSD) son el corazón de tu sistema. Comprender cómo interactúan permite diagnosticar problemas de rendimiento antes de que afecten tu trabajo. Un sistema mal ventilado o con hardware fallido puede causar inestabilidad que a menudo se confunde con problemas de software.',
              image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'Seguridad basada en Capas',
              text: 'Windows 11 ha elevado el estándar con requisitos como TPM 2.0. La seguridad no es un solo programa, sino una estrategia. Debes configurar correctamente el firewall, usar Windows Hello para biometría y entender los privilegios de cuenta de usuario (UAC).',
              image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'Mantenimiento Preventivo',
              text: 'La limpieza física y lógica es vital. Eliminar el polvo de los ventiladores y usar herramientas como "Desfragmentar y optimizar unidades" (para HDD) o el comando TRIM (para SSD) asegura una vida útil prolongada.',
              image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=800&auto=format&fit=crop'
            }
          ],
          tips: [
            'Usa siempre un regulador de voltaje para proteger el hardware contra picos de luz.',
            'Mantén al menos el 15% de tu disco duro libre para que Windows pueda gestionar la memoria virtual.',
            'Crea puntos de restauración del sistema antes de instalar drivers nuevos.'
          ],
          tools: [
            'HWMonitor: Para monitorear temperaturas.',
            'Rufus: Para crear instaladores limpios de Windows.',
            'Malwarebytes: Como complemento de seguridad.'
          ],
          commonErrors: [
            'Ignorar las actualizaciones de BIOS/UEFI.',
            'Desactivar el Firewall por completo "por rendimiento".',
            'No respaldar la clave de recuperación de BitLocker.'
          ],
          jobMarket: 'Los Técnicos en Soporte IT son demandados en todas las industrias. Salarios iniciales varían entre $400 - $800 USD dependiendo de las certificaciones, con crecimiento hacia Administrador de Redes.',
          important: 'La seguridad es un proceso, no un producto. Ningún sistema es 100% infalible.',
          purpose: 'Empoderar al usuario para que gestione su propia infraestructura digital de manera segura.',
          practicalActivity: 'Abre el Administrador de Tareas (Ctrl+Shift+Esc), ve a la pestaña Rendimiento e identifica tu modelo de procesador y velocidad de RAM.',
          reflectionQuestions: ['¿Conozco los límites térmicos de mi PC?', '¿Sé cómo recuperar mi sistema si el disco principal falla?']
        },
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=1200&auto=format&fit=crop',
        date: '2024-05-10',
        author: 'Admin Formatec',
        category: 'Informática',
        readTime: '15 min'
      },
      {
        id: 2,
        courseId: 2,
        title: 'El Arte del Fade: Guía Maestra de Barbería',
        excerpt: 'De la historia de la barbería a las técnicas de difuminado más complejas para profesionales.',
        content: {
          introduction: 'La barbería ha pasado de ser un oficio tradicional a una forma de arte urbano. El "Fade" es el examen final de cualquier barbero, requiriendo precisión milimétrica y una visión clara de las sombras.',
          sections: [
            {
              title: 'Herramientas de Precisión',
              text: 'No todas las máquinas son iguales. Necesitas una "Clipper" potente para el bulto y una "Trimmer" para los detalles finos. Las cuchillas deben estar lubricadas y alineadas; una cuchilla mal puesta puede arruinar un degradado o lastimar la piel.',
              image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'La Técnica de la Palanca',
              text: 'Aprender a jugar con la palanca de tu máquina (abierta, media, cerrada) es lo que separa a un novato de un experto. El movimiento de "cuchareo" (flick motion) es esencial para no crear líneas difíciles de borrar en el cabello.',
              image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'Higiene y Servicio al Cliente',
              text: 'La barbería es un 50% corte y 50% experiencia. El uso de talco, alcohol e hidratantes post-afeitado es innegociable. Un barbero exitoso sabe escuchar a su cliente antes de encender la máquina.',
              image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop'
            }
          ],
          tips: [
            'Empieza el fade siempre un poco más abajo de lo que planeas, para tener espacio de corrección.',
            'Mantén los espejos limpios; te muestran sombras que tus ojos no ven de cerca.',
            'Cepilla constantemente el área para eliminar cabello suelto y ver el progreso real.'
          ],
          tools: [
            'Máquina Wahl Legend o similar.',
            'Patillera Andis Slimline Pro.',
            'Peine plano y cepillo de limpieza suave.'
          ],
          commonErrors: [
            'Hacer las líneas guía muy fuertes.',
            'No lavar el cabello antes del corte si está muy sucio.',
            'Cortar demasiado rápido sin revisar la simetría.'
          ],
          jobMarket: 'El sector de cuidado masculino está en auge. Un barbero con clientela establecida puede generar ingresos significativos, y existe la posibilidad de abrir tu propio negocio con baja inversión inicial.',
          important: 'La desinfección entre clientes es obligatoria para evitar enfermedades cutáneas.',
          purpose: 'Llevar tu técnica de corte al siguiente nivel profesional.',
          practicalActivity: 'Identifica los 3 tipos de fade: Low, Mid y High en fotos de celebridades para entender las alturas.',
          reflectionQuestions: ['¿Mis transiciones se ven limpias o con manchas?', '¿Cómo puedo mejorar la experiencia sensorial de mis clientes?']
        },
        image: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=1200&auto=format&fit=crop',
        date: '2024-05-12',
        author: 'Master Barbero',
        category: 'Barbería',
        readTime: '20 min'
      },
      {
        id: 3,
        courseId: 3,
        title: 'Química de la Repostería: Bizcochos Perfectos',
        excerpt: 'Aprende por qué suben tus pasteles y cómo controlar cada ingrediente.',
        content: {
          introduction: 'La repostería es ciencia exacta. Un gramo de más o un grado de menos puede cambiarlo todo. En este artículo profundizamos en la estructura de los bizcochos para que nunca más se te bajen.',
          sections: [
            {
              title: 'Función de los Ingredientes',
              text: 'La harina aporta estructura, los huevos son el aglutinante, el azúcar da humedad y la grasa (mantequilla o aceite) aporta suavidad. Saber cuándo usar cada uno determina si tendrás un bizcocho denso o una nube de algodón.',
              image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'El Batido y la Aireación',
              text: 'Existen dos métodos principales: el cremado (mantequilla + azúcar) y el espumado (huevos + azúcar). Entender el punto de letra es vital para bizcochos genoveses y esponjosos sin necesidad de polvos de hornear químicos.',
              image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop'
            },
            {
              title: 'Temperaturas de Horneado',
              text: 'Cada horno es un mundo. Un bizcocho horneado muy rápido tendrá una "panza" y se agrietará. Uno horneado muy lento quedará seco y plano. El precalentamiento es la regla de oro.',
              image: 'https://images.unsplash.com/photo-1581339399838-2a120c18bba3?q=80&w=800&auto=format&fit=crop'
            }
          ],
          tips: [
            'Usa todos los ingredientes a temperatura ambiente, especialmente huevos y mantequilla.',
            'Tamiza la harina al menos tres veces para incorporar aire.',
            'Nunca engrases las paredes del molde si quieres que tu bizcocho suba recto (método chiffon).'
          ],
          tools: [
            'Báscula digital (gramera).',
            'Termómetro de horno.',
            'Tamiz o colador fino.'
          ],
          commonErrors: [
            'Abrir el horno antes de tiempo.',
            'Sobremezclar la harina (desarrolla el gluten y endurece el pastel).',
            'No pesar los ingredientes (medir por tazas es impreciso).'
          ],
          jobMarket: 'Desde emprendimientos caseros hasta pastelerías gourmet. El mercado de eventos (bodas, cumpleaños) siempre requiere profesionales capaces de crear estructuras estables y deliciosas.',
          important: 'La repostería requiere paciencia. Respeta los tiempos de enfriado antes de decorar.',
          purpose: 'Dominar la base de toda la pastelería: el bizcocho.',
          practicalActivity: 'Haz la prueba del palillo: insértalo en el centro y debe salir limpio pero con un par de migas húmedas pegadas.',
          reflectionQuestions: ['¿Entiendo la diferencia entre levadura química y levadura biológica?', '¿Pesar mis ingredientes ha mejorado mi consistencia?']
        },
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1200&auto=format&fit=crop',
        date: '2024-05-15',
        author: 'Chef Pastelero',
        category: 'Repostería',
        readTime: '18 min'
      }
    ];
  }
}
