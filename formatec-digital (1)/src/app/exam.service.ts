import { Injectable } from '@angular/core';

export interface Option {
  id: string;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  options: Option[];
  correctOptionId: string;
}

// Interface for what CourseContentService expects
export interface CourseQuestion {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
}

export interface Exam {
  id: string;
  courseId: number;
  level: number;
  title: string;
  questions: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  
  public getQuestionsForCourse(courseId: number, level: number): CourseQuestion[] {
    const db = this.getGlobalQuestionDatabase();
    const courseQuestions = db[courseId.toString()];
    
    if (!courseQuestions) return [];

    const levelQuestions = courseQuestions[level as 1|2|3|4] || [];
    
    // Determine how many questions to pick based on level
    let count = 5;
    if (level === 2) count = 7;
    if (level === 3) count = 9;
    if (level === 4) count = 11;

    // Shuffle and pick
    return [...levelQuestions]
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.min(count, levelQuestions.length))
      .map((q, idx) => ({
        ...q,
        id: courseId * 10000 + level * 1000 + idx
      }));
  }

  public getExam(courseId: number, level: number, courseTitle = 'Curso'): Exam | undefined {
    const questions = this.getQuestionsForCourse(courseId, level);
    if (questions.length === 0) return undefined;

    const transformedQuestions: Question[] = questions.map(q => ({
      id: q.id,
      text: q.text,
      options: q.options.map((opt, oIdx) => ({
        id: oIdx.toString(),
        text: opt
      })),
      correctOptionId: q.correctAnswer.toString()
    }));

    return {
      id: `${courseId}-l${level}-${Date.now()}`,
      courseId,
      level,
      title: `${courseTitle} - Examen Nivel ${level}`,
      questions: transformedQuestions
    };
  }

  public getGlobalQuestionDatabase(): Record<string, Record<number, Omit<CourseQuestion, 'id'>[]>> {
    return {
      // 1. INFORMÁTICA
      "1": {
        1: [
          { text: "¿Cuál es el periférico principal para escribir texto?", options: ["Monitor", "Teclado", "Mouse", "Impresora"], correctAnswer: 1 },
          { text: "Componente físico que muestra las imágenes:", options: ["CPU", "Disco Duro", "Monitor", "RAM"], correctAnswer: 2 },
          { text: "El 'cerebro' de la computadora se llama:", options: ["Estómago", "Procesador (CPU)", "Memoria RAM", "Gabinete"], correctAnswer: 1 },
          { text: "Botón que inicia el sistema:", options: ["Reset", "Enter", "Encendido/Power", "Esc"], correctAnswer: 2 },
          { text: "¿Qué dispositivo usamos para mover el cursor?", options: ["Escáner", "Micrófono", "Mouse (Ratón)", "Altavoz"], correctAnswer: 2 },
          { text: "¿Para qué sirve el puerto USB?", options: ["Conectar dispositivos", "Beber agua", "Enfriar la PC", "Ninguna"], correctAnswer: 0 },
          { text: "Un ejemplo de hardware es:", options: ["Windows", "Excel", "El Monitor", "Chrome"], correctAnswer: 2 }
        ],
        2: [
          { text: "¿Cuál es el sistema operativo más usado en el mundo para PC?", options: ["Linux", "macOS", "Windows", "Android"], correctAnswer: 2 },
          { text: "¿Dónde se guardan los archivos borrados temporalmente?", options: ["Carpeta Mis Documentos", "Papelera de Reciclaje", "Descargas", "Disco C:"], correctAnswer: 1 },
          { text: "Atajo para copiar un elemento:", options: ["Ctrl + V", "Ctrl + X", "Ctrl + C", "Alt + F4"], correctAnswer: 2 },
          { text: "¿Qué es una carpeta?", options: ["Un archivo de texto", "Un contenedor de archivos", "Una aplicación de dibujo", "Un virus"], correctAnswer: 1 },
          { text: "¿Cuál es la extensión común de un documento de texto?", options: [".jpg", ".mp3", ".docx", ".exe"], correctAnswer: 2 },
          { text: "¿Cómo se llama la barra inferior en Windows?", options: ["Barra de Tareas", "Barra de Menú", "Barra de Desplazamiento", "Barra de Estado"], correctAnswer: 0 },
          { text: "Para cerrar una ventana usamos la X de color:", options: ["Verde", "Azul", "Rojo", "Amarillo"], correctAnswer: 2 },
          { text: "¿Qué significa formatear un disco?", options: ["Limpiar solo virus", "Borrar todo y preparar sistema", "Cambiarle el nombre", "Pintarlo"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Cuál es un navegador web?", options: ["Word", "Google Chrome", "Adobe Reader", "Skype"], correctAnswer: 1 },
          { text: "¿Qué significa las siglas WWW?", options: ["World Wide Web", "World Word Work", "Web Wide World", "Wide World Web"], correctAnswer: 0 },
          { text: "¿Cuál es un ejemplo de correo electrónico sólido?", options: ["www.google.com", "usuario@gmail.com", "http://facebook", "C:\\archivos"], correctAnswer: 1 },
          { text: "¿Qué es el WiFi?", options: ["Un cable largo", "Conexión inalámbrica a Internet", "Un tipo de monitor", "Un programa de oficina"], correctAnswer: 1 },
          { text: "Para buscar información usamos:", options: ["Calculadora", "Un motor de búsqueda (Google)", "Bloc de notas", "Paint"], correctAnswer: 1 },
          { text: "¿Qué es una contraseña segura?", options: ["123456", "password", "Abc#123_45", "mi nombre"], correctAnswer: 2 },
          { text: "Símbolo obligatorio en un e-mail:", options: ["#", "*", "@ (Arroba)", "&"], correctAnswer: 2 },
          { text: "¿Qué es una URL?", options: ["Una imagen", "La dirección de una web", "Un virus de internet", "Un archivo de Word"], correctAnswer: 1 },
          { text: "¿Qué significa 'Descargar'?", options: ["Subir un archivo a la red", "Bajar archivos de la red a tu PC", "Eliminar archivos", "Imprimir archivos"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es un Malware?", options: ["Software de oficina", "Software malicioso (Virus)", "Programa de diseño", "Hardware nuevo"], correctAnswer: 1 },
          { text: "Principal función de un Antivirus:", options: ["Acelerar internet", "Detectar y eliminar amenazas", "Limpiar el monitor", "Descargar juegos"], correctAnswer: 1 },
          { text: "¿Qué es la Nube (Cloud Storage)?", options: ["El clima", "Almacenamiento en servidores remotos", "Un satélite", "Un cable submarino"], correctAnswer: 1 },
          { text: "¿Qué es el Phishing?", options: ["Pescar en internet", "Suplantación de identidad para robo", "Un programa de dibujo", "Un tipo de WiFi"], correctAnswer: 1 },
          { text: "¿Para qué sirve un Backup?", options: ["Para nada", "Tener copia de seguridad ante fallas", "Borrar archivos viejos", "Comprar hardware"], correctAnswer: 1 },
          { text: "¿Qué es una dirección IP?", options: ["Una dirección postal", "Identificación única de un dispositivo en red", "Nombre del usuario", "Modelo del router"], correctAnswer: 1 },
          { text: "Si la PC no enciende, ¿qué es lo primero a revisar?", options: ["El ratón", "La conexión a corriente", "El teclado", "El fondo de pantalla"], correctAnswer: 1 },
          { text: "¿Qué es un Firewall?", options: ["Un muro de fuego real", "Barrera de seguridad de red", "Un ventilador", "Un extintor"], correctAnswer: 1 },
          { text: "Función de la memoria RAM:", options: ["Almacenar fotos", "Almacenamiento temporal de procesos", "Guardar info sin energía", "Enfriar el CPU"], correctAnswer: 1 },
          { text: "¿Qué es un Sistema de 64 bits?", options: ["Peso de la PC", "Arquitectura de procesamiento", "Cantidad de botones", "Ancho del monitor"], correctAnswer: 1 },
          { text: "Para comprimir archivos usamos:", options: ["WinRAR / WinZip", "Word", "Chrome", "Excel"], correctAnswer: 0 },
          { text: "¿Qué es el BIOS?", options: ["Un virus", "Sistema básico de entrada/salida", "Un juego", "Un navegador"], correctAnswer: 1 }
        ]
      },
      // 2. BARBERÍA
      "2": {
        1: [
          { text: "¿Cómo se llama la capa que protege al cliente?", options: ["Toalla", "Capa de corte", "Mantel", "Bata de baño"], correctAnswer: 1 },
          { text: "¿Qué peine es ideal para desenredar?", options: ["Peine de cola", "Peine de dientes anchos", "Cepillo redondo", "Peine fino"], correctAnswer: 1 },
          { text: "Elemento para enfriar la máquina:", options: ["Agua", "Sprays refrigerantes", "Aceite de cocina", "Ventilador"], correctAnswer: 1 },
          { text: "¿Qué es lo primero que se hace al recibir al cliente?", options: ["Cortar", "Consultoría y análisis", "Lavar", "Cobrar"], correctAnswer: 1 },
          { text: "Parte de la oreja que más cuidamos al cortar:", options: ["Lóbulo", "Hélix", "Trago", "Toda la oreja"], correctAnswer: 3 },
          { text: "¿Para qué sirve el bledo?", options: ["Cortar", "Limpiar pelos sueltos del cliente", "Lavar", "Peinar"], correctAnswer: 1 },
          { text: "¿Qué máquina es para contornos y patillas?", options: ["Clipper", "Trimmer", "Shaver", "Tijera"], correctAnswer: 1 }
        ],
        2: [
          { text: "¿En qué consiste la técnica del 'Fade'?", options: ["Corte rapado", "Degradado de oscuro a claro", "Tinte de pelo", "Alisado"], correctAnswer: 1 },
          { text: "¿Cuál es la palanca abierta en una Clipper?", options: ["Cuchillas juntas (corto)", "Cuchillas separadas (largo)", "Apagado", "Encendido"], correctAnswer: 1 },
          { text: "Peine guía número 1 equivale a:", options: ["1.5mm", "3mm", "4.5mm", "6mm"], correctAnswer: 1 },
          { text: "¿Qué es el 'Low Fade'?", options: ["Degradado alto", "Degradado bajo (nuca y patillas)", "Degradado medio", "Sombreado"], correctAnswer: 1 },
          { text: "Herramienta para borrar la línea de la 0:", options: ["Peine 1", "Palanca intermedia / Palanqueo", "Tijera", "Navaja"], correctAnswer: 1 },
          { text: "¿Para qué sirve la técnica 'Clipper over comb'?", options: ["Lavar", "Unir laterales con zona superior", "Rapado", "Delineado"], correctAnswer: 1 },
          { text: "La Shaver sirve para:", options: ["Degradar", "Afeitado al ras (piel)", "Cortar pelo largo", "Peinar"], correctAnswer: 1 },
          { text: "¿Qué es el sombreado?", options: ["Tinte oscuro", "Degradado pulido", "Corte con tijera", "Uso de gel"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Para qué se usa una toalla caliente en barba?", options: ["Limpiar", "Abrir poros y blandir vello", "Secar", "Enfriar"], correctAnswer: 1 },
          { text: "¿Hacia qué dirección se debe afeitar primero?", options: ["Contra pelo", "A favor del pelo", "Lateral", "Circular"], correctAnswer: 1 },
          { text: "Producto para deslizar la navaja:", options: ["Agua", "Gel de afeitar / Espuma", "Talco", "Alcohol"], correctAnswer: 1 },
          { text: "¿Qué es el perfilado de barba?", options: ["Limpiar pelos", "Delinear los bordes con navaja", "Cortar largo", "Teñir"], correctAnswer: 1 },
          { text: "Ángulo correcto de la navaja sobre la piel:", options: ["90 grados", "30 grados", "10 grados", "0 grados"], correctAnswer: 1 },
          { text: "¿Para qué sirve el aceite de barba?", options: ["Pegar", "Hidratar vello y piel", "Cortar", "Lavar"], correctAnswer: 1 },
          { text: "¿Qué zona es más sensible al afeitar?", options: ["Mejilla", "Cuello / Manzana de Adán", "Mentón", "Labio superior"], correctAnswer: 1 },
          { text: "¿Cómo estiramos la piel al usar navaja?", options: ["No se estira", "Con la mano libre", "Con la boca", "Con el peine"], correctAnswer: 1 },
          { text: "Después del afeitado aplicamos:", options: ["Talco", "Aftershave", "Gel fijador", "Agua caliente"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es el Barbicida?", options: ["Cuchilla", "Líquido desinfectante de grado hospitalario", "Un peine", "Una máquina"], correctAnswer: 1 },
          { text: "Frecuencia de desinfección de máquinas:", options: ["Una vez al día", "Entre cada cliente", "Semanal", "Mensual"], correctAnswer: 1 },
          { text: "¿Qué hacer ante un pequeño corte en la piel?", options: ["Nada", "Aplicar lápiz hemostático / gel antiséptico", "Poner alcohol 96%", "Tapar con el dedo"], correctAnswer: 1 },
          { text: "¿Qué es la colorimetría capilar?", options: ["Cortar pelo", "Ciencia del color y tintes", "Peinado", "Lavado"], correctAnswer: 1 },
          { text: "Para un cabello graso, ¿qué producto de fijación es mejor?", options: ["Cera brillante", "Pomada mate", "Aceite", "Crema"], correctAnswer: 1 },
          { text: "¿Cuál es la clave de un negocio de barbería exitoso?", options: ["Solo cortar bien", "Higiene, Servicio al cliente y Calidad", "Cobrar barato", "Tener tele"], correctAnswer: 1 },
          { text: "¿Qué es el Visagismo en barbería?", options: ["Diseño de uñas", "Adaptar el corte a la forma del rostro", "Tipo de tijera", "Masaje capilar"], correctAnswer: 1 },
          { text: "¿Por qué es vital cambiar la cuchilla en cada cliente?", options: ["Para que corte más", "Higiene y prevención de contagios", "Tradición", "Ahorro"], correctAnswer: 1 },
          { text: "¿Qué técnica se usa para quitar volumen sin quitar largo?", options: ["Rapado", "Tijera de entresacar / texturizar", "Clipper", "Navaja"], correctAnswer: 1 },
          { text: "¿Cómo se llama el corte con la parte superior muy larga y lados cortos?", options: ["Buzz cut", "Undercut", "Fade", "Mullet"], correctAnswer: 1 },
          { text: "Para un rostro redondo, se recomienda:", options: ["Corte redondo", "Volumen arriba y lados cortos para alargar", "Pelo largo parejo", "Flequillo"], correctAnswer: 1 },
          { text: "La ética profesional implica:", options: ["Llegar tarde", "Puntualidad, respeto y honestidad", "Hablar de otros clientes", "Subir precios"], correctAnswer: 1 }
        ]
      },
      // 3. REPOSTERÍA
      "3": {
        1: [
          { text: "¿Qué ingrediente aporta estructura al bizcocho?", options: ["Azúcar", "Grasa", "Harina", "Esencia"], correctAnswer: 2 },
          { text: "¿Para qué sirve el tamizado de la harina?", options: ["Dar color", "Quitar grumos e incorporar aire", "Endulzar", "Enfriar"], correctAnswer: 1 },
          { text: "¿Qué es el azúcar glass?", options: ["Azúcar en trozos", "Azúcar pulverizada", "Azúcar morena", "Líquido dulce"], correctAnswer: 1 },
          { text: "Función del agente leudante (polvo de hornear):", options: ["Sabor", "Hacer crecer la masa", "Espesar", "Grasa"], correctAnswer: 1 },
          { text: "¿Qué es la mantequilla sin sal?", options: ["Margarina", "Grasa láctea pura", "Aceite", "Manteca vegetal"], correctAnswer: 1 },
          { text: "Herramienta para batir a mano:", options: ["Cuchara", "Batidor de globo", "Cuchillo", "Espátula"], correctAnswer: 1 },
          { text: "¿Qué es el pesaje exacto?", options: ["Calcular al ojo", "Uso de balanza gramera", "Usar tazas", "Usar cucharas"], correctAnswer: 1 }
        ],
        2: [
          { text: "¿Qué es el cremado?", options: ["Llevar a hervor", "Batir grasa con azúcar hasta aclarar", "Mezclar harina", "Enfriar"], correctAnswer: 1 },
          { text: "¿Qué es el punto de letra?", options: ["Escribir", "Batido de huevos y azúcar espeso", "Masa dura", "Mezcla líquida"], correctAnswer: 1 },
          { text: "¿A qué temperatura promedio se hornea un bizcocho?", options: ["100°C", "180°C", "250°C", "300°C"], correctAnswer: 1 },
          { text: "¿Qué pasa si bates demasiado la harina?", options: ["Sabe mejor", "Se desarrolla gluten y queda duro", "Queda muy suave", "No pasa nada"], correctAnswer: 1 },
          { text: "Diferencia entre esencia y extracto:", options: ["Color", "Concentración y origen", "Precio", "Tamaño"], correctAnswer: 1 },
          { text: "¿Para qué sirve el almíbar?", options: ["Decorar", "Humedecer bizcochos", "Hornear", "Limpiar"], correctAnswer: 1 },
          { text: "El merengue francés se hace con:", options: ["Claras y azúcar", "Yemas y leche", "Harina", "Grasa"], correctAnswer: 0 },
          { text: "¿Qué es precalentar el horno?", options: ["Apagarlo", "Encenderlo antes de meter la mezcla", "Limpiarlo", "Abrir la puerta"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Qué es una ganache?", options: ["Un bizcocho", "Mezcla de chocolate y crema", "Un merengue", "Una fruta"], correctAnswer: 1 },
          { text: "¿Cómo se logra un brillo espejo?", options: ["Limpiando", "Glaseado de gelatina y chocolate", "Con aceite", "Con agua"], correctAnswer: 1 },
          { text: "¿Qué es el temperado de chocolate?", options: ["Calentarlo", "Curva de temperatura para brillo y chasquido", "Derretirlo", "Enfriarlo"], correctAnswer: 1 },
          { text: "Uso de la manga pastelera:", options: ["Guardar comida", "Decorar con precisión", "Batir", "Pesar"], correctAnswer: 1 },
          { text: "¿Qué es el fondant?", options: ["Plástico", "Pasta de azúcar extendible", "Chocolate", "Líquido"], correctAnswer: 1 },
          { text: "Para un bizcocho alto, usamos:", options: ["Mucho aire", "Moldes profundos y buena estructura", "Mucha harina", "Mucha azúcar"], correctAnswer: 1 },
          { text: "¿Qué es el merengue italiano?", options: ["Claras batidas con almíbar a punto de bola", "Claras y azúcar", "Yemas cocidas", "Queso dulce"], correctAnswer: 0 },
          { text: "La crema pastelera lleva obligatoriamente:", options: ["Agua", "Leche, yemas y fécula", "Chocolate", "Harina de fuerza"], correctAnswer: 1 },
          { text: "¿Para qué sirve el enfriamiento en rejilla?", options: ["Para que se moje", "Evitar condensación por debajo", "Para que no se parta", "Tradición"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es la repostería molecular?", options: ["Cocinar pequeño", "Uso de texturas y química avanzada", "Solo pasteles", "Comida de astronauta"], correctAnswer: 1 },
          { text: "Causa de un bizcocho hundido al centro:", options: ["Mucha azúcar", "Falta de cocción o abrir horno antes", "Falta de harina", "Horno muy caliente"], correctAnswer: 1 },
          { text: "Para postres de vitrina, el factor clave es:", options: ["El precio", "La estética y conservación", "El tamaño", "El plato"], correctAnswer: 1 },
          { text: "¿Qué es el 'Mise en place'?", options: ["Limpiar después", "Organización previa de todos los insumos", "Tipo de horno", "Un ingrediente"], correctAnswer: 1 },
          { text: "¿Cómo se calcula el costo de un pastel?", options: ["Por el peso", "Sumando materia prima, tiempo y gastos fijos", "Viendo al vecino", "Por el tamaño"], correctAnswer: 1 },
          { text: "Un pastel 'Naked' es el que:", options: ["No tiene bizcocho", "No tiene cobertura exterior completa", "Tiene mucha crema", "Es transparente"], correctAnswer: 1 },
          { text: "El porcentaje de grasa influye en:", options: ["El color", "La humedad y suavidad", "La altura", "La rapidez"], correctAnswer: 1 },
          { text: "¿Qué es la contaminación cruzada?", options: ["Mezclar sabores", "Paso de microbios entre alimentos", "Usar dos harinas", "Limpiar mal"], correctAnswer: 1 },
          { text: "Para equilibrar el sabor dulce, usamos:", options: ["Azúcar", "Pizca de sal o ácido (limón)", "Agua", "Harina"], correctAnswer: 1 },
          { text: "Principal riesgo en el manejo de huevos:", options: ["Que se rompan", "Salmonella", "Que huelan mal", "Que sean pequeños"], correctAnswer: 1 },
          { text: "El horno de convección se caracteriza por:", options: ["No calentar", "Circulación de aire caliente", "Ser de leña", "Ser muy pequeño"], correctAnswer: 1 },
          { text: "Para estabilizar el merengue usamos:", options: ["Sal", "Cremor tártaro o limón", "Harina", "Aceite"], correctAnswer: 1 }
        ]
      },
      // 4. UÑAS ACRÍLICAS
      "4": {
        1: [
          { text: "¿Qué es la queratina?", options: ["Un pegamento", "Proteína natural de la uña", "Un hongo", "Un líquido acrílico"], correctAnswer: 1 },
          { text: "¿Para qué sirve el empujador de cutícula?", options: ["Cortar", "Despejar la placa ungueal", "Limar", "Pintar"], correctAnswer: 1 },
          { text: "Elemento para dar forma al borde libre:", options: ["Pincel", "Lima", "Acetona", "Brillo"], correctAnswer: 1 },
          { text: "¿Qué es el borde libre?", options: ["La base", "La parte de la uña que sobresale del dedo", "La cutícula", "El lateral"], correctAnswer: 1 },
          { text: "¿Cómo se llama la zona blanca en forma de luna?", options: ["Lúnula", "Matriz", "Lecho", "Hiponiquio"], correctAnswer: 0 },
          { text: "¿Qué es el PH bond (Deshidratador)?", options: ["Color", "Balanceador de PH para mejor adherencia", "Pegamento", "Aceite"], correctAnswer: 1 },
          { text: "¿Para qué sirve el cepillo de uñas?", options: ["Lavar", "Retirar el polvo del limado", "Pintar", "Masaje"], correctAnswer: 1 }
        ],
        2: [
          { text: "¿Qué es el monómero?", options: ["Polvo", "Líquido activador", "Gel", "Limpiador"], correctAnswer: 1 },
          { text: "¿Qué es el polímero?", options: ["Líquido", "Polvo acrílico", "Pincel", "Molde"], correctAnswer: 1 },
          { text: "La mezcla equilibrada crea la:", options: ["Gota", "Perla", "Burbuja", "Mancha"], correctAnswer: 1 },
          { text: "¿Qué pincel es el estándar para acrílico?", options: ["Pelo sintético", "Kolinsky (pelo natural)", "Brocha gorda", "Abanico"], correctAnswer: 1 },
          { text: "¿Qué es un 'Tip'?", options: ["Un consejo", "Extensión plástica de la uña", "Un color", "Una lima"], correctAnswer: 1 },
          { text: "Función del 'Primer':", options: ["Dar brillo", "Promotor de adherencia", "Secado rápido", "Protección"], correctAnswer: 1 },
          { text: "¿Qué es el área de tensión (Ápex)?", options: ["La punta", "Punto más alto y fuerte de la estructura", "La cutícula", "Debajo de la uña"], correctAnswer: 1 },
          { text: "Para retirar el acrílico usamos:", options: ["Agua fría", "Acetona pura", "Aceite", "Jabón"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Qué es el Dril (Torno)?", options: ["Un pincel", "Lima eléctrica profesional", "Un molde", "Un tipo de uña"], correctAnswer: 1 },
          { text: "Técnica de 'Reversa' se usa en:", options: ["Uñas lisas", "Manicura francesa (técnica de corte)", "Pedicura", "Solo gel"], correctAnswer: 1 },
          { text: "¿Qué es el encapsulado?", options: ["Pintar encima", "Guardar decoraciones bajo el acrílico transparente", "Limpiar", "Secar"], correctAnswer: 1 },
          { text: "La estructura 'Coffin' es:", options: ["Puntiaguda", "Forma de ataúd (punta cuadrada y lados cerrados)", "Redonda", "Muy corta"], correctAnswer: 1 },
          { text: "¿Qué es el Onicomicosis?", options: ["Uña larga", "Infección por hongos", "Uña fuerte", "Esmalte"], correctAnswer: 1 },
          { text: "El limado en 'C' sirve para:", options: ["Dar brillo", "Crear la curvatura natural de la estructura", "Cortar", "Pintar"], correctAnswer: 1 },
          { text: "¿Para qué sirve el Cleanser?", options: ["Pegar", "Eliminar la capa de inhibición del gel", "Limar", "Remover cutícula"], correctAnswer: 1 },
          { text: "La técnica 'Baby Boomer' es:", options: ["Uñas rojas", "Difuminado de rosa y blanco", "Uñas con flores", "Uñas mate"], correctAnswer: 1 },
          { text: "Tiempo promedio de un retoque:", options: ["6 meses", "2 a 3 semanas", "Cada día", "Un año"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es el Polygel?", options: ["Acrílico líquido", "Híbrido entre acrílico y gel", "Solo esmalte", "Pegamento fuerte"], correctAnswer: 1 },
          { text: "Causa común del levantamiento prematuro:", options: ["Mucha agua", "Mala preparación de la placa ungueal", "Uso de guantes", "Uso de aceite"], correctAnswer: 1 },
          { text: "Señal de alerta de infección bacteriana:", options: ["Uña blanca", "Mancha verdosa ('Hongo' por humedad)", "Uña larga", "Uña roja"], correctAnswer: 1 },
          { text: "¿Para qué sirve el molde para escultura?", options: ["Pintar", "Extender la uña sin usar Tips", "Limpiar", "Sujetar el dedo"], correctAnswer: 1 },
          { text: "El 'Nail Art' 3D se hace con:", options: ["Esmalte", "Mezcla de acrílico de consistencia seca", "Agua", "Pegatinas"], correctAnswer: 1 },
          { text: "¿Qué es el Finish Gel?", options: ["Base", "Capa final de brillo extremo y sellado", "Color", "Aceite"], correctAnswer: 1 },
          { text: "Importancia de la bioseguridad:", options: ["Moda", "Prevenir enfermedades y proteger a cliente y técnico", "Gasto extra", "Tradición"], correctAnswer: 1 },
          { text: "La técnica de limado correcta es:", options: ["En todas direcciones", "Envolvente y direccional", "Muy fuerte", "Circular"], correctAnswer: 1 },
          { text: "¿Qué es la Onicofagia?", options: ["Uñas bonitas", "Hábito de morderse las uñas", "Uñas largas", "Uñas de pies"], correctAnswer: 1 },
          { text: "Para uñas débiles se recomienda:", options: ["Acrílico grueso", "Sistemas de refuerzo (Kapping)", "No hacer nada", "Limar mucho"], correctAnswer: 1 },
          { text: "El aceite de cutícula se aplica:", options: ["Antes del acrílico", "Al finalizar el servicio para hidratar", "Sobre el acrílico", "Nunca"], correctAnswer: 1 },
          { text: "Un set profesional debe durar:", options: ["1 hora", "Entre 1.5 a 2.5 horas", "5 horas", "10 minutos"], correctAnswer: 1 }
        ]
      },
      // 5. AUXILIAR DE ENFERMERÍA
      "5": {
        1: [
          { text: "¿Qué es la frecuencia respiratoria?", options: ["Latidos", "Número de respiraciones por minuto", "Presión", "Oxígeno"], correctAnswer: 1 },
          { text: "Valor normal de la temperatura corporal:", options: ["32°C", "36.5°C - 37.2°C", "40°C", "35°C"], correctAnswer: 1 },
          { text: "¿Cómo se llama la presión alta?", options: ["Hipotensión", "Hipertensión", "Normotensión", "Arritmia"], correctAnswer: 1 },
          { text: "Lugar común para tomar el pulso:", options: ["Oreja", "Arteria Radial (Muñeca)", "Espalda", "Dedo"], correctAnswer: 1 },
          { text: "¿Qué es un antiséptico?", options: ["Suciedad", "Sustancia que inhibe microbios en tejidos vivos", "Un virus", "Una venda"], correctAnswer: 1 },
          { text: "Función principal del auxiliar:", options: ["Operar", "Cuidado y confort del paciente", "Recetar", "Diagnosticar"], correctAnswer: 1 },
          { text: "¿Qué es el lavado clínico de manos?", options: ["Mojarse", "Técnica rigurosa para eliminar flora transitoria", "Usar solo alcohol", "Lavar con guantes"], correctAnswer: 1 }
        ],
        2: [
          { text: "¿Qué significa el acrónimo PAS en emergencias?", options: ["Pasar, Atender, Seguir", "Proteger, Avisar, Socorrer", "Parar, Analizar, Sentarse", "Pronto, Auxilio, Salud"], correctAnswer: 1 },
          { text: "Primer paso ante una herida sangrante:", options: ["Coser", "Presión directa sobre la herida", "Poner alcohol", "Lavar con cloro"], correctAnswer: 1 },
          { text: "¿Qué es una quemadura de primer grado?", options: ["Con ampollas", "Sola enrojecimiento y dolor", "Con piel negra", "Sin dolor"], correctAnswer: 1 },
          { text: "¿Para qué sirve el vendaje en espiral?", options: ["Decorar", "Sujeción de apósitos en extremidades", "Inmovilizar cuello", "Nada"], correctAnswer: 1 },
          { text: "Signo de atragantamiento total:", options: ["Tos fuerte", "Imposibilidad de hablar y manos al cuello", "Risas", "Gritos"], correctAnswer: 1 },
          { text: "La maniobra de Heimlich sirve para:", options: ["Reanimar corazón", "Desobstruir vías aéreas", "Bajar la fiebre", "Curar heridas"], correctAnswer: 1 },
          { text: "¿Qué es un esguince?", options: ["Hueso roto", "Lesión de ligamentos por torcedura", "Corte profundo", "Dolor de cabeza"], correctAnswer: 1 },
          { text: "Ante un desmayo, debemos:", options: ["Dar comida", "Elevar las piernas del paciente", "Sentarlo", "Echarle agua fría"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Qué es el decúbito supino?", options: ["Boca abajo", "Boca arriba", "De lado", "Sentado"], correctAnswer: 1 },
          { text: "¿Para qué sirven los cambios posturales?", options: ["Para que no se aburra", "Prevenir úlceras por presión", "Castigo", "Ejercicio"], correctAnswer: 1 },
          { text: "¿Qué es una úlcera por presión (Escara)?", options: ["Granito", "Lesión en la piel por presión prolongada", "Un hongo", "Una alergia"], correctAnswer: 1 },
          { text: "Significado de 'NPO' en dieta:", options: ["Nada Por Orina", "Nada Por boca (Ayuno)", "Nutrición Para Odontología", "Normal"], correctAnswer: 1 },
          { text: "¿Cómo se recogen muestras de orina estériles?", options: ["En cualquier vaso", "Frasco estéril y técnica de chorro medio", "De la bolsa", "Del suelo"], correctAnswer: 1 },
          { text: "La cama hospitalaria desocupada es:", options: ["Sin paciente", "Cerrada", "Abierta", "Ocupada"], correctAnswer: 0 },
          { text: "¿Qué es la higiene perineal?", options: ["Lavar manos", "Limpieza de órganos genitales y anal", "Lavar pies", "Lavar cara"], correctAnswer: 1 },
          { text: "¿Cómo se moviliza a un paciente con fractura de cadera?", options: ["Rápido", "Técnica de bloque con ayuda", "Solo por una persona", "No se mueve"], correctAnswer: 1 },
          { text: "Uso del cómodo/chata:", options: ["Para comer", "Para eliminación en cama (feces/orina)", "Para dormir", "Para lavar"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Cuáles son los '5 correctos' en medicación?", options: ["Dosis, Vía, Hora, Paciente, Medicamento", "Color, Sabor, Precio, Tamaño, Marca", "Día, Mes, Año, Hora, Lugar", "Poca, Mucha, Media, Nada, Todo"], correctAnswer: 0 },
          { text: "Vía de administración más rápida:", options: ["Oral", "Intravenosa", "Intramuscular", "Tópica"], correctAnswer: 1 },
          { text: "¿Qué es la ética profesional en salud?", options: ["Cobrar más", "Respeto a la dignidad y privacidad del paciente", "Ser famoso", "Saber mucho"], correctAnswer: 1 },
          { text: "El secreto profesional significa:", options: ["No decir el nombre", "No revelar información confidencial del paciente", "No hablar con médicos", "Guardar llaves"], correctAnswer: 1 },
          { text: "¿Qué es el triage en urgencias?", options: ["Limpieza", "Clasificación por gravedad del paciente", "Un remedio", "Una operación"], correctAnswer: 1 },
          { text: "Signo vital que indica paro cardíaco:", options: ["Fiebre", "Ausencia de pulso central", "Tos", "Hambre"], correctAnswer: 1 },
          { text: "La bioseguridad protege a:", options: ["Solo al paciente", "Paciente, personal y comunidad", "Solo al médico", "Al hospital"], correctAnswer: 1 },
          { text: "¿Qué hacer ante un paciente agresivo?", options: ["Gritar", "Mantener distancia y pedir ayuda", "Pelear", "Irme"], correctAnswer: 1 },
          { text: "Importancia de la hidratación en ancianos:", options: ["Menor sed", "Evitar desorientación y fallas orgánicas", "Para que no suden", "Tradición"], correctAnswer: 1 },
          { text: "Un auxiliar debe reportar hallazgos:", options: ["Tarde", "De forma clara, veraz e inmediata", "Por WhatsApp solo", "Nunca"], correctAnswer: 1 },
          { text: "¿Qué es la cadena de custodia?", options: ["Cárcel", "Garantía de integridad de muestras biológicas", "Un candado", "Un cinturón"], correctAnswer: 1 },
          { text: "La empatía en enfermería es:", options: ["Pena", "Entender el sufrimiento del otro y actuar", "Reírse", "Ignorar"], correctAnswer: 1 }
        ]
      },
      // 6. INGLÉS BÁSICO
      "6": {
        1: [
          { text: "How do you say 'Hola'?", options: ["Goodbye", "Hello", "Please", "Thanks"], correctAnswer: 1 },
          { text: "Which pronoun is for a man?", options: ["She", "It", "He", "They"], correctAnswer: 2 },
          { text: "What is the color of the sky (usually)?", options: ["Red", "Yellow", "Blue", "Black"], correctAnswer: 2 },
          { text: "Number after 'Two':", options: ["One", "Three", "Four", "Five"], correctAnswer: 1 },
          { text: "How do you say 'Gracias'?", options: ["Sorry", "Welcome", "Thank you", "Excuse me"], correctAnswer: 2 },
          { text: "What time is it if it's 'noon'?", options: ["12:00 AM", "12:00 PM", "6:00 PM", "8:00 AM"], correctAnswer: 1 },
          { text: "Correct greeting for the morning:", options: ["Good night", "Good morning", "Good afternoon", "Hi"], correctAnswer: 1 }
        ],
        2: [
          { text: "Correct conjugation: I ____ a student.", options: ["is", "are", "am", "be"], correctAnswer: 2 },
          { text: "Negative of 'He works':", options: ["He no work", "He doesn't work", "He don't work", "He not work"], correctAnswer: 1 },
          { text: "Plural of 'Child':", options: ["Childs", "Children", "Childrens", "Childes"], correctAnswer: 1 },
          { text: "Meaning of 'Breakfast':", options: ["Almuerzo", "Cena", "Desayuno", "Merienda"], correctAnswer: 2 },
          { text: "Day after Monday:", options: ["Wednesday", "Tuesday", "Sunday", "Friday"], correctAnswer: 1 },
          { text: "Which is a verb?", options: ["Apple", "Eat", "Table", "Happy"], correctAnswer: 1 },
          { text: "Question word for location:", options: ["When", "Who", "Where", "Why"], correctAnswer: 2 },
          { text: "How do you say 'Manzana'?", options: ["Pear", "Apple", "Orange", "Banana"], correctAnswer: 1 }
        ],
        3: [
          { text: "Past tense of 'Go':", options: ["Goed", "Went", "Gone", "Going"], correctAnswer: 1 },
          { text: "Comparative of 'Big':", options: ["Bigger", "More big", "Biggest", "Bigest"], correctAnswer: 0 },
          { text: "Which is an adjective?", options: ["Run", "Beautiful", "House", "Slowly"], correctAnswer: 1 },
          { text: "I _____ English right now.", options: ["study", "am studying", "studied", "studies"], correctAnswer: 1 },
          { text: "Opposite of 'Expensive':", options: ["Cheap", "Pricey", "Rich", "New"], correctAnswer: 0 },
          { text: "Where _____ you live?", options: ["does", "do", "are", "is"], correctAnswer: 1 },
          { text: "Past of 'See':", options: ["Seed", "Seen", "Saw", "Looking"], correctAnswer: 2 },
          { text: "I have _____ apple in my bag.", options: ["a", "an", "the", "any"], correctAnswer: 1 },
          { text: "Meaning of 'Reliable':", options: ["Rápido", "Confiable", "Ruidoso", "Viejo"], correctAnswer: 1 }
        ],
        4: [
          { text: "Condition: If it rains, I _____ stay home.", options: ["would", "will", "did", "was"], correctAnswer: 1 },
          { text: "Which sentence is correct?", options: ["I have 20 years", "I am 20 years old", "I am 20 years", "I has 20 years"], correctAnswer: 1 },
          { text: "Meaning of 'However':", options: ["Además", "Sin embargo", "Porque", "Entonces"], correctAnswer: 1 },
          { text: "She _____ (visit) London last year.", options: ["visits", "visited", "visiting", "visit"], correctAnswer: 1 },
          { text: "I _____ never been to Japan.", options: ["am", "have", "has", "do"], correctAnswer: 1 },
          { text: "Which is a professional closing?", options: ["Bye bye", "Sincerely", "See ya", "Hello"], correctAnswer: 1 },
          { text: "Meaning of 'Environment':", options: ["Empresa", "Medio ambiente", "Entrenamiento", "Equipo"], correctAnswer: 1 },
          { text: "Correct question: _____ you like coffee?", options: ["Are", "Do", "Is", "Does"], correctAnswer: 1 },
          { text: "Superlative of 'Good':", options: ["Goodest", "Better", "Best", "The bestest"], correctAnswer: 2 },
          { text: "I _____ to the gym every day.", options: ["go", "goes", "going", "gone"], correctAnswer: 0 },
          { text: "Meaning of 'Success':", options: ["Suceso", "Éxito", "Salida", "Siguiente"], correctAnswer: 1 },
          { text: "A person who cooks is a:", options: ["Cooker", "Chef", "Baker", "Doctor"], correctAnswer: 1 }
        ]
      },
      // 7. REPARACIÓN DE CELULARES
      "7": {
        1: [
          { text: "¿Qué herramienta abre la mayoría de celulares?", options: ["Martillo", "Destornillador Phillips/Torx", "Cuchillo", "Alicates"], correctAnswer: 1 },
          { text: "Herramienta para separar pantallas:", options: ["Pinzas", "Ventosa y espátulas de plástico", "Destornillador", "Agua calor"], correctAnswer: 1 },
          { text: "¿Qué evita la pulsera antiestática?", options: ["Sudor", "Descargas que dañan circuitos", "Manchar el celular", "Cansancio"], correctAnswer: 1 },
          { text: "Componente que almacena la energía:", options: ["Pantalla", "Batería", "Cámara", "Altavoz"], correctAnswer: 1 },
          { text: "¿Qué es el conector de carga?", options: ["Donde va la SIM", "Donde entra el cable de energía", "Botón Power", "Cámara front"], correctAnswer: 1 },
          { text: "¿De qué material deben ser las pinzas de precisión?", options: ["Madera", "Acero inoxidable / Antiestáticas", "Plomo", "Cobre"], correctAnswer: 1 },
          { text: "¿Para qué sirve el pegamento B-7000?", options: ["Pegar cables", "Sellar pantallas y tapas", "Limpiar", "Soldar"], correctAnswer: 1 }
        ],
        2: [
          { text: "Falla común: El celular no carga. ¿Qué revisar primero?", options: ["La pantalla", "El cable y el puerto de carga", "La cámara", "El WiFi"], correctAnswer: 1 },
          { text: "Señal de batería inflada:", options: ["Pantalla se levanta", "Celular pesado", "Mucha luz", "Software lento"], correctAnswer: 0 },
          { text: "¿Qué es un 'Hard Reset'?", options: ["Cargar al 100%", "Restauración de fábrica por botones", "Limpieza física", "Cambio de batería"], correctAnswer: 1 },
          { text: "Si el celular se mojó, ¿qué NUNCA hacer?", options: ["Llevar al técnico", "Encenderlo o cargarlo", "Secarlo con toalla", "Quitar la SIM"], correctAnswer: 1 },
          { text: "¿Qué componente permite ver la imagen?", options: ["Cristal", "Display LCD/OLED", "Táctil", "Placa"], correctAnswer: 1 },
          { text: "El táctil (Digitizer) sirve para:", options: ["Ver", "Detectar toques del dedo", "Escuchar", "Cargar"], correctAnswer: 1 },
          { text: "¿Para qué sirve el alcohol isopropílico?", options: ["Beber", "Limpiar circuitos sin dejar humedad", "Sellar", "Pintar"], correctAnswer: 1 },
          { text: "Componente que gestiona el WiFi:", options: ["Cámara", "Antena/IC de red", "Batería", "Vibrador"], correctAnswer: 1 }
        ],
        3: [
          { text: "Temperatura ideal para despegar pantallas:", options: ["400°C", "80°C - 100°C", "20°C", "500°C"], correctAnswer: 1 },
          { text: "¿Para qué sirve el multímetro?", options: ["Ver fotos", "Medir voltajes y continuidad", "Soldar", "Cortar"], correctAnswer: 1 },
          { text: "La 'Placa Base' es:", options: ["La tapa", "El circuito principal (Mainboard)", "La batería", "El protector"], correctAnswer: 1 },
          { text: "¿Qué es el estaño?", options: ["Pegamento", "Metal para soldar componentes", "Plástico", "Vidrio"], correctAnswer: 1 },
          { text: "Función del flux en soldadura:", options: ["Pegar", "Facilitar la fusión y limpieza del estaño", "Enfriar", "Dar color"], correctAnswer: 1 },
          { text: "¿Qué es un corto circuito?", options: ["Cable largo", "Conexión accidental entre positivo y negativo", "Falta de luz", "Software roto"], correctAnswer: 1 },
          { text: "Para diagnosticar si llega voltaje usamos:", options: ["Cámara", "Multímetro en escala de Volts DC", "Oído", "Lupa"], correctAnswer: 1 },
          { text: "¿Qué es la micro-soldadura?", options: ["Soldar cables", "Soldar componentes diminutos en la placa", "Soldar pantallas", "Ninguna"], correctAnswer: 1 },
          { text: "El 'Blindaje' sirve para:", options: ["Decorar", "Protección de interferencias y física", "Sujetar", "Ver"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es el JTAG / ISP?", options: ["Un juego", "Método de reparación de arranque y software profundo", "Un cargador", "Una batería"], correctAnswer: 1 },
          { text: "Un celular que se reinicia solo puede tener:", options: ["Mucha memoria", "Falla de software o botón power pegado", "Poca luz", "Funda rota"], correctAnswer: 1 },
          { text: "¿Qué es el IMEI?", options: ["Un nombre", "Identificador único internacional del equipo", "Un chip", "Una marca"], correctAnswer: 1 },
          { text: "Reparación de 'Falla de Táctil' en iPhone 6 Plus se conoce como:", options: ["Touch Disease", "Bad Battery", "No Signal", "Screen Burn"], correctAnswer: 0 },
          { text: "Para quitar pegamento fuerte usamos:", options: ["Martillo", "Calor y removedores cítricos", "Agua", "Gasolina"], correctAnswer: 1 },
          { text: "¿Qué es el Reballing?", options: ["Limpiar", "Cambio de esferas de soldadura en un chip IC", "Pintar", "Cambiar carcasa"], correctAnswer: 1 },
          { text: "Importancia de la hoja de servicio:", options: ["Ocupar papel", "Documentar estado inicial y final para garantía", "Moda", "Para el cliente solo"], correctAnswer: 1 },
          { text: "¿Qué es la 'Muerte Súbita' de un terminal?", options: ["Celular explota", "Falla crítica de hardware que no permite encendido", "Batería baja", "Pantalla rota"], correctAnswer: 1 },
          { text: "La estática daña principalmente a:", options: ["Pantalla", "Circuitos integrados (ICs)", "Carcasa", "Botones"], correctAnswer: 1 },
          { text: "Para recuperar fotos de un celular que no enciende:", options: ["Conectar a PC", "Reparar la placa hasta que encienda (encendido básico)", "Usar Bluetooth", "Mirar la SIM"], correctAnswer: 1 },
          { text: "Un buen técnico debe:", options: ["Ser rápido", "Ser honesto, ordenado y actualizado", "Cobrar mucho", "Usar solo pegamento"], correctAnswer: 1 },
          { text: "Herramienta Z3X / Octoplus sirve para:", options: ["Abrir", "Servicio técnico de software y liberación", "Cargar", "Soldar"], correctAnswer: 1 }
        ]
      },
      // 8. MAQUILLAJE PROFESIONAL
      "8": {
        1: [
          { text: "¿Qué es la piel grasa?", options: ["Piel con brillo y poros abiertos", "Piel descamada", "Piel roja", "Piel suave"], correctAnswer: 0 },
          { text: "Función del tónico:", options: ["Pintar", "Equilibrar el PH de la piel", "Desmaquillar", "Brillo"], correctAnswer: 1 },
          { text: "¿Qué brocha es para la base?", options: ["Lengua de gato o Kabuki", "Abanico", "Peine de cejas", "Fina lineal"], correctAnswer: 0 },
          { text: "¿Para qué sirve el bloqueador solar?", options: ["Dar color", "Protección UV", "Maquillar", "Limpiar"], correctAnswer: 1 },
          { text: "Elemento para rizar pestañas:", options: ["Brocha", "Rizador / Encrespador", "Delineador", "Pinza"], correctAnswer: 1 },
          { text: "¿Qué es una Beauty Blender?", options: ["Pincel", "Esponja de difuminado", "Crema", "Máquina"], correctAnswer: 1 },
          { text: "¿Cuál es el primer paso del maquillaje?", options: ["Base", "Limpieza e hidratación", "Labios", "Sombras"], correctAnswer: 1 }
        ],
        2: [
          { text: "Colores primarios en maquillaje:", options: ["Rosa, Celeste", "Rojo, Azul, Amarillo", "Verde, Naranja", "Blanco, Negro"], correctAnswer: 1 },
          { text: "¿Qué es el subtono?", options: ["Color de ojos", "Temperatura de la piel (Cálido, Frío, Neutro)", "Tipo de pelo", "Manchas"], correctAnswer: 1 },
          { text: "¿Para qué se usa el corrector naranja?", options: ["Iluminar", "Cancelar ojeras oscuras/azuladas", "Bajar rojeces", "Contorno"], correctAnswer: 1 },
          { text: "El corrector verde cancela:", options: ["Ojeras", "Rojeces o granitos rojos", "Manchas cafés", "Amarillo"], correctAnswer: 1 },
          { text: "¿Qué es el 'Baking'?", options: ["Cocinar", "Sellar con polvo translúcido grueso", "Delineado", "Sombra"], correctAnswer: 1 },
          { text: "Maquillaje de día se caracteriza por:", options: ["Mucha escarcha", "Look natural y tonos neutros", "Labios negros", "Pestañas 5D"], correctAnswer: 1 },
          { text: "¿Dónde se prueba el tono de la base?", options: ["En la mano", "En la mandíbula hacia el cuello", "En la frente", "En el brazo"], correctAnswer: 1 },
          { text: "Función del Primer de rostro:", options: ["Maquillar", "Alisar poros y fijar el maquillaje", "Limpiar", "Secar"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Qué es el Visagismo?", options: ["Limpieza", "Arte de corregir el rostro con luces y sombras", "Tipo de uña", "Corte"], correctAnswer: 1 },
          { text: "Para adelgazar la nariz se aplica:", options: ["Iluminador a los lados", "Sombra oscura a los lados", "Rubor", "Base clara"], correctAnswer: 1 },
          { text: "¿Qué es el 'Strobing'?", options: ["Mucho contorno", "Técnica basada solo en resaltar con iluminación", "Diseño de ojos", "Maquillaje de labios"], correctAnswer: 1 },
          { text: "El 'Smokey Eye' es un:", options: ["Delineado", "Ojo ahumado (difuminado oscuro)", "Maquillaje de cejas", "Corte de cuenca"], correctAnswer: 1 },
          { text: "¿Qué es el 'Cut Crease'?", options: ["Corte de ceja", "Técnica de ojo con cuenca marcada", "Maquillaje natural", "Labios"], correctAnswer: 1 },
          { text: "Para ojos pequeños conviene:", options: ["Mucho negro", "Colores claros e iluminador en lagrimal", "Pestañas muy pesadas", "No usar nada"], correctAnswer: 1 },
          { text: "Función del fijador (Setting Spray):", options: ["Maquillar", "Prolongar la duración y quitar aspecto polvoso", "Limpiar", "Secar"], correctAnswer: 1 },
          { text: "¿Qué es la colorimetría?", options: ["Pintar", "Estudio de armonía de colores según la persona", "Estudio facial", "Maquillaje"], correctAnswer: 1 },
          { text: "El contorno se aplica generalmente en:", options: ["Zonas que queremos resaltar", "Zonas que queremos profundizar/disimular", "Los ojos", "La boca"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es el maquillaje HD?", options: ["Cine antiguo", "Maquillaje de alta definición para cámaras", "Maquillaje casero", "Solo sombras"], correctAnswer: 1 },
          { text: "Para piel madura se recomienda:", options: ["Mucho polvo", "Productos hidratantes y ligeros", "Bases mates pesadas", "Colores neón"], correctAnswer: 1 },
          { text: "¿Qué es el maquillaje para novias?", options: ["Disfraz", "Look duradero, atemporal y fotogénico", "Solo blanco", "Muy llamativo"], correctAnswer: 1 },
          { text: "Causa de que la base se 'craquele':", options: ["Mucha agua", "Falta de hidratación previa o exceso de producto", "Base buena", "Sol"], correctAnswer: 1 },
          { text: "Para un rostro cuadrado buscamos:", options: ["Hacerlo más cuadrado", "Suavizar los ángulos de la mandíbula", "Marcar pómulos", "Nada"], correctAnswer: 1 },
          { text: "¿Qué es el maquillaje artístico?", options: ["Social", "Maquillaje de fantasía, teatro o efectos especiales", "Solo ojos", "Maquillaje rápido"], correctAnswer: 1 },
          { text: "Higiene profesional de brochas:", options: ["Cada mes", "Lavar y desinfectar regularmente (diario entre clientes)", "Nunca", "Solo con agua"], correctAnswer: 1 },
          { text: "Señal de maquillaje vencido:", options: ["Color bonito", "Cambio en olor, textura o irritación", "Cero olor", "Empaque nuevo"], correctAnswer: 1 },
          { text: "¿Qué es el 'Draping'?", options: ["Maquillar ojos", "Contornear el rostro usando rubor", "Labios ombré", "Delineado"], correctAnswer: 1 },
          { text: "La luz ideal para maquillar es:", options: ["Luz amarilla", "Luz blanca natural (fría/neutra)", "Oscuridad", "Luz de vela"], correctAnswer: 1 },
          { text: "¿Qué es el 'Overlining'?", options: ["Sombra", "Delinear labios por fuera de su contorno natural", "Cejas grandes", "Pestañas"], correctAnswer: 1 },
          { text: "Un maquillador debe tener:", options: ["Pocas brochas", "Kit versátil, ética y buena iluminación", "Miedo al color", "Solo una base"], correctAnswer: 1 }
        ]
      },
      // 9. CAJERO BANCARIO
      "9": {
        1: [
          { text: "Herramienta que facilita el conteo manual:", options: ["Calculadora", "Esponja humecedora", "Lápiz", "Regla"], correctAnswer: 1 },
          { text: "¿Qué es un billete auténtico?", options: ["Uno fotocopiado", "Uno emitido por el Banco Central con medidas de seguridad", "Cualquiera", "Uno de color"], correctAnswer: 1 },
          { text: "¿Para qué sirve la luz UV en caja?", options: ["Ver mejor", "Detectar marcas de seguridad fluorescentes", "Secar manos", "Decorar"], correctAnswer: 1 },
          { text: "El 'Arqueo de Caja' consiste en:", options: ["Cerrar el banco", "Contar efectivo para que coincida con sistema", "Abrir la bóveda", "Cobrar"], correctAnswer: 1 },
          { text: "¿Qué es un depósito?", options: ["Sacar dinero", "Entregar dinero para guardarlo en cuenta", "Pedir préstamo", "Pagar luz"], correctAnswer: 1 },
          { text: "¿Cuál es la moneda de curso legal en tu país?", options: ["Dólar", "Moneda local (Peso/Sol/Bolívar/etc)", "Bitcoin", "Euro"], correctAnswer: 1 },
          { text: "¿Qué es el recibo de caja?", options: ["Un regalo", "Comprobante legal de la transacción", "Un volante", "Papel basura"], correctAnswer: 1 }
        ],
        2: [
          { text: "¿Qué revisar primero en un billete sospechoso?", options: ["El color", "Textura (alto relieve) y marca de agua", "El tamaño", "El olor"], correctAnswer: 1 },
          { text: "Si falta dinero al cierre se llama:", options: ["Ganancia", "Faltante de caja", "Sobrante", "Ahorro"], correctAnswer: 1 },
          { text: "¿Qué es un 'Sobrante de caja'?", options: ["Éxito", "Dinero que excede al reporte de sistema", "Error de banco", "Regalo"], correctAnswer: 0 },
          { text: "¿Cómo se llama la acción de pedir identificación?", options: ["Molestar", "Protocolo KYC (Conoce a tu cliente)", "Burocracia", "Nada"], correctAnswer: 1 },
          { text: "Un retiro de efectivo requiere:", options: ["Solo el nombre", "ID vigente y verificación de firma/huella", "Confianza", "Un papel"], correctAnswer: 1 },
          { text: "¿Para qué sirve el detector de billetes electrónico?", options: ["Contar", "Verificar autenticidad por magnetismo e infrarrojo", "Imprimir", "Cargar"], correctAnswer: 1 },
          { text: "¿Qué es un cheque endosado?", options: ["Cheque roto", "Firmado al reverso para transferir propiedad", "Cheque nuevo", "Cheque de ahorro"], correctAnswer: 1 },
          { text: "El conteo manual debe ser:", options: ["Lento", "Frente al cliente y con seguridad", "Bajo la mesa", "Rápido sin ver"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Qué es el lavado de activos?", options: ["Lavar billetes con jabón", "Blanquear dinero de origen ilícito", "Limpiar el banco", "Un ahorro"], correctAnswer: 1 },
          { text: "¿Para qué sirve el reporte de transacciones sospechosas?", options: ["Chismean", "Cumplimiento legal y prevención de delitos", "Vender datos", "Nada"], correctAnswer: 1 },
          { text: "Un billete con el 50% o menos de su cuerpo es:", options: ["Válido", "Sujeto a canje según reglas del banco central", "Basura", "Total"], correctAnswer: 1 },
          { text: "¿Qué es el encaje legal?", options: ["Dinero en caja", "Reserva obligatoria que los bancos guardan", "Un préstamo", "Una comisión"], correctAnswer: 1 },
          { text: "Transacción en línea significa:", options: ["Lento", "Tiempo real conectado al sistema central", "Mañana", "Offline"], correctAnswer: 1 },
          { text: "¿Qué es el diferencial cambiario?", options: ["Diferencia entre compra y venta de moneda", "Precio del dólar", "Interés", "Impuesto"], correctAnswer: 0 },
          { text: "La bóveda de seguridad está protegida por:", options: ["Un candado", "Temporizadores y doble custodia", "Solo el gerente", "Nadie"], correctAnswer: 1 },
          { text: "¿Qué es un billete 'lava-dólar'?", options: ["Billete limpio", "Billete auténtico lavado con químicos para ocultar origen", "Falsificado", "Nuevo"], correctAnswer: 1 },
          { text: "El cajero debe ser:", options: ["Distraído", "Atento, ético y reservado", "Hablador", "Amigo"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es la ciberseguridad bancaria?", options: ["Cerrar puertas", "Protección de datos y transacciones digitales", "Guardias", "Cámaras"], correctAnswer: 1 },
          { text: "Ante un asalto, la regla de oro es:", options: ["Pelear", "Priorizar la vida y seguir protocolos de calma", "Gritar", "Esconderse"], correctAnswer: 1 },
          { text: "¿Qué es una transferencia interbancaria?", options: ["Mismo banco", "Envío de dinero entre bancos distintos", "Retiro", "Depósito"], correctAnswer: 1 },
          { text: "El oficial de cumplimiento se encarga de:", options: ["Limpiar", "Vigilar que se cumplan normas antilavado", "Cobrar", "Atender"], correctAnswer: 1 },
          { text: "Un error recurrente en el cajero causa:", options: ["Ascenso", "Sanción o despido por falta de integridad", "Risas", "Nada"], correctAnswer: 1 },
          { text: "¿Qué es el flujo de efectivo (Cash Flow)?", options: ["Gastar", "Entrada y salida neta de dinero", "Ahorro", "Préstamo"], correctAnswer: 1 },
          { text: "La ética bancaria prohíbe:", options: ["Atender bien", "Revelar saldos o info de clientes a terceros", "Llegar temprano", "Usar uniforme"], correctAnswer: 1 },
          { text: "¿Qué es un paraíso fiscal?", options: ["Lugar de playa", "País con baja o nula tributación y opacidad", "Un banco central", "Ahorro"], correctAnswer: 1 },
          { text: "El coneto por 'lotes' ayuda a:", options: ["Perder tiempo", "Evitar errores y organizar el efectivo", "Gastar", "Ensuciar"], correctAnswer: 1 },
          { text: "¿Qué es la firma autorizada?", options: ["Cualquier firma", "Firma registrada legalmente para validar documentos", "Garabato", "Dibujo"], correctAnswer: 1 },
          { text: "La atención al cliente busca:", options: ["Pelear", "Fidelización y resolución de necesidades", "Dinero", "Paciencia"], correctAnswer: 1 },
          { text: "Un cajero profesional debe:", options: ["Saber inglés", "Ser experto en seguridad, rapidez y trato amable", "Ser lento", "Ser guardián"], correctAnswer: 1 }
        ]
      },
      // 10. ESTILISMO (CEJAS Y PESTAÑAS)
      "10": {
        1: [
          { text: "¿Qué es el diseño de cejas?", options: ["Pintar cejas", "Dar forma estética según el rostro", "Depilar todo", "Lavar"], correctAnswer: 1 },
          { text: "Herramienta para depilar con precisión:", options: ["Cuchillo", "Pinza de cejas", "Tijera gorda", "Peine"], correctAnswer: 1 },
          { text: "¿Qué es el visagismo en cejas?", options: ["Uñas", "Estudio de las líneas del rostro para el diseño", "Corte", "Tinte"], correctAnswer: 1 },
          { text: "¿Se deben depilar las cejas por arriba?", options: ["Siempre", "Solo pelitos fuera de la línea natural", "Nunca", "Todo"], correctAnswer: 1 },
          { text: "¿Qué es la henna para cejas?", options: ["Tinte permanente", "Tinte natural temporal para vello y piel", "Maquillaje", "Pegamento"], correctAnswer: 1 },
          { text: "Elemento para marcar el diseño:", options: ["Labial", "Hilo o lápiz blanco", "Pluma", "Dedo"], correctAnswer: 1 },
          { text: "¿Para qué sirve el cepillo Spoolie?", options: ["Depilar", "Peinar y difuminar", "Lavar", "Cortar"], correctAnswer: 1 }
        ],
        2: [
          { text: "¿Qué es el lifting de pestañas?", options: ["Extensiones", "Curvatura natural de la propia pestaña", "Tinte", "Caída"], correctAnswer: 1 },
          { text: "El laminado de cejas sirve para:", options: ["Quitar pelos", "Direccionar y dar volumen a la ceja natural", "Pintar", "Limar"], correctAnswer: 1 },
          { text: "¿Qué es una extensión de pestañas pelo a pelo?", options: ["Pestañas postizas de tira", "Pegar una fibra sobre una pestaña natural", "Tinte", "Máscara"], correctAnswer: 1 },
          { text: "¿Cuánto dura aproximadamente el lifting?", options: ["1 día", "4 a 6 semanas", "Un año", "Para siempre"], correctAnswer: 1 },
          { text: "Producto para el lifting:", options: ["Agua", "Geles químicos (paso 1 y 2)", "Gelatina", "Pegamento blanco"], correctAnswer: 1 },
          { text: "Importancia de la prueba de alergia:", options: ["Gastar tiempo", "Evitar reacciones adversas a químicos", "Moda", "Nada"], correctAnswer: 1 },
          { text: "¿Qué es el mapeo de pestañas?", options: ["Un dibujo", "Diseño de longitudes para las extensiones", "Un mapa", "No existe"], correctAnswer: 1 },
          { text: "Para limpiar antes del servicio usamos:", options: ["Jabón normal", "Lash Shampoo / Limpiador específico", "Alcohol", "Agua sola"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Qué es el Microblading?", options: ["Maquillaje", "Tatuaje semipermanente pelo a pelo", "Tinte", "Depilación"], correctAnswer: 1 },
          { text: "Ángulo correcto de la pinza de extensión:", options: ["Cualquiera", "Preciso para aislamiento sin tocar piel", "90 grados siempre", "0 grados"], correctAnswer: 1 },
          { text: "¿Qué es el 'Volumen Ruso'?", options: ["Pestañas largas", "Múltiples fibras ultraligeras sobre una natural", "Pestañas de colores", "Pestañas de plástico"], correctAnswer: 1 },
          { text: "El adhesivo de pestañas seca por:", options: ["Calor", "Humedad y temperatura del ambiente", "Luz solar", "Viento"], correctAnswer: 1 },
          { text: "¿Qué es la tricología?", options: ["Uñas", "Estudio de la salud del pelo y vello", "Pies", "Piel"], correctAnswer: 1 },
          { text: "Para un ojo caído se recomienda:", options: ["Efecto gato (Cat Eye)", "Efecto muñeca (Dolly Eye) para abrir", "No poner nada", "Pestañas pesadas"], correctAnswer: 1 },
          { text: "¿Qué es la queratina líquida en lifting?", options: ["Pegamento", "Nutriente para fortalecer la pestaña", "Color", "Limpiador"], correctAnswer: 1 },
          { text: "Higiene de la camilla:", options: ["Cada mes", "Cambio de protector entre cada cliente", "Nunca", "Solo sacudir"], correctAnswer: 1 },
          { text: "¿Qué es el diseño de 'Sombreado' en cejas?", options: ["Peluquería", "Técnica de Powder Brows o sombreado", "Solo un lápiz", "Corte"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es el ciclo anágeno de la pestaña?", options: ["Caída", "Fase de crecimiento activo", "Descanso", "Muerte"], correctAnswer: 1 },
          { text: "Causa de la caída prematura de extensiones:", options: ["Mala aplicación, humedad incorrecta o aceites", "Mucha agua", "Dormir mucho", "Pestañas buenas"], correctAnswer: 0 },
          { text: "¿Qué es una reacción alérgica severa?", options: ["Un granito", "Edema, picazón y enrojecimiento extremo", "Risas", "Sueño"], correctAnswer: 1 },
          { text: "La bioseguridad en estilismo previene:", options: ["Olores", "Conjuntivitis, blefaritis e infecciones", "Moda", "Gasto"], correctAnswer: 1 },
          { text: "Para cejas muy pobladas se recomienda:", options: ["Quitar todo", "Perfilado y depilación con hilo", "Maquillar más", "Nada"], correctAnswer: 1 },
          { text: "¿Qué es la simetría facial?", options: ["Cara fea", "Equilibrio entre las dos mitades del rostro", "Solo un ojo", "Maquillaje"], correctAnswer: 1 },
          { text: "Instrumento 'Vernier' o Pie de Rey sirve para:", options: ["Cortar", "Medición exacta de las cejas", "Pegar", "Peinar"], correctAnswer: 1 },
          { text: "Un estilista debe explicar:", options: ["Nada", "Cuidados posteriores (Aftercare)", "Solo el precio", "Sus problemas"], correctAnswer: 1 },
          { text: "¿Qué es el 'Patch Test'?", options: ["Un juego", "Prueba de parche para sensibilidad", "Diseño", "Limpieza"], correctAnswer: 1 },
          { text: "El adhesivo NO debe tocar:", options: ["La pestaña", "El párpado / Piel", "La pinza", "El aire"], correctAnswer: 1 },
          { text: "Importancia de la luz lupa:", options: ["Ver viejo", "Precisión extrema en trabajos minuciosos", "Decoración", "Nada"], correctAnswer: 1 },
          { text: "La profesionalidad se demuestra con:", options: ["Mucho maquillaje", "Higiene, puntualidad y resultados impecables", "Hablar mucho", "Llegar tarde"], correctAnswer: 1 }
        ]
      },
      // 11. AUXILIAR DE FARMACIA
      "11": {
        1: [
          { text: "¿Cuál es la función principal de un auxiliar de farmacia?", options: ["Recetar medicamentos", "Asistir en la dispensación y atención al cliente", "Realizar cirugías", "Ninguna"], correctAnswer: 1 },
          { text: "¿Qué significa FEFO en inventarios?", options: ["First In, First Out", "First Expired, First Out", "Fast Entry, Fast Output", "No existe"], correctAnswer: 1 },
          { text: "¿Cómo deben almacenarse los medicamentos termolábiles?", options: ["Al sol", "En refrigeración (2°C a 8°C)", "En el congelador", "A temperatura ambiente"], correctAnswer: 1 },
          { text: "¿Qué es una forma galénica?", options: ["Una fórmula matemática", "La disposición externa que se da a las sustancias medicamentosas", "Un tipo de frasco", "Una bacteria"], correctAnswer: 1 },
          { text: "La bioseguridad en farmacia sirve para:", options: ["Vender más", "Evitar contaminación y proteger al personal", "Decorar", "Gastar dinero"], correctAnswer: 1 },
          { text: "¿Qué es la dispensación?", options: ["Vender dulces", "Entrega de medicamentos con información de uso", "Solo cobrar", "Limpiar"], correctAnswer: 1 },
          { text: "Un medicamento genérico es:", options: ["Uno falso", "Uno con el mismo principio activo que el de marca", "Uno más fuerte", "Uno caducado"], correctAnswer: 1 }
        ],
        2: [
          { text: "¿Qué datos son obligatorios en una receta médica?", options: ["Solo el nombre", "Nombre, dosis, firma del médico y fecha", "Nombre del paciente solamente", "Color favorito"], correctAnswer: 1 },
          { text: "¿Qué es la farmacodinámica?", options: ["Estudio del efecto del fármaco en el organismo", "Estudio de cómo el cuerpo absorbe el fármaco", "Venta de fármacos", "Transporte"], correctAnswer: 0 },
          { text: "¿Qué es la vía oral?", options: ["Inyectada", "Por la boca", "Por la piel", "En el ojo"], correctAnswer: 1 },
          { text: "Importancia de verificar la fecha de vencimiento:", options: ["Ninguna", "Seguridad del paciente y eficacia del tratamiento", "Para vender más rápido", "Por estética"], correctAnswer: 1 },
          { text: "¿Qué es un antibiótico?", options: ["Para virus", "Para combatir infecciones bacterianas", "Para el dolor", "Para dormir"], correctAnswer: 1 },
          { text: "¿Qué es la automedicación?", options: ["Ir al médico", "Tomar medicamentos sin prescripción médica", "Dormir mucho", "Comer sano"], correctAnswer: 1 },
          { text: "El símbolo de 'Receta Retenida' indica:", options: ["Venta libre", "Control estricto de estupefacientes o psicotrópicos", "Oferta", "Regalo"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Qué es la farmacovigilancia?", options: ["Seguridad en la puerta", "Detección y reporte de reacciones adversas", "Venta de vitaminas", "Inventario"], correctAnswer: 1 },
          { text: "Un efecto secundario es:", options: ["Siempre bueno", "Efecto no deseado derivado del uso del fármaco", "Un error médico", "Curación mágica"], correctAnswer: 1 },
          { text: "¿Qué es una interacción medicamentosa?", options: ["Pelea de doctores", "Alteración del efecto por otro fármaco o alimento", "Una receta nueva", "Una farmacia"], correctAnswer: 1 },
          { text: "La dosis pediátrica se calcula por:", options: ["Edad solamente", "Peso y superficie corporal", "Nombre", "Altura"], correctAnswer: 1 },
          { text: "¿Qué es la farmacocinética?", options: ["Movimiento del fármaco dentro del cuerpo (LADME)", "Efecto tóxico", "Farmacia rápida", "Publicidad"], correctAnswer: 0 },
          { text: "Un analgésico sirve para:", options: ["La tos", "Aliviar el dolor", "Infecciones", "La vista"], correctAnswer: 1 },
          { text: "La cadena de frío es crítica para:", options: ["Pastillas", "Vacunas e insulinas", "Jarabes", "Vendas"], correctAnswer: 1 }
        ],
        4: [
          { text: "Ética farmacéutica implica:", options: ["Vender lo más caro", "Respetar la receta y la confidencialidad", "No trabajar", "Hablar de los clientes"], correctAnswer: 1 },
          { text: "Un residuo sanitario sospechoso va en bolsa:", options: ["Negra", "Roja", "Verde", "Blanca"], correctAnswer: 1 },
          { text: "¿Qué es la atención farmacéutica?", options: ["Vender rápido", "Seguimiento del tratamiento para optimizar salud", "Limpiar vitrinas", "Contar dinero"], correctAnswer: 1 },
          { text: "El auxiliar debe conocer de leyes para:", options: ["Ser abogado", "Cumplir normativas sanitarias y evitar sanciones", "Gritar", "Dormir"], correctAnswer: 1 },
          { text: "Un error en la dispensación puede causar:", options: ["Nada", "Daño grave al paciente o incluso la muerte", "Risas", "Un descuento"], correctAnswer: 1 },
          { text: "La empatía con el paciente ayuda a:", options: ["Perder tiempo", "Mejor adherencia al tratamiento y confianza", "Vender menos", "Enojarlo"], correctAnswer: 1 },
          { text: "Proyecto Final de Farmacia consiste en:", options: ["Dormir", "Integración de conocimientos técnicos y éticos", "Un dibujo", "Nada"], correctAnswer: 1 }
        ]
      },
      // 12. INGENIERÍA CIVIL
      "12": {
        1: [
          { text: "¿Qué estudia la estática?", options: ["Movimiento de fluidos", "Cuerpos en reposo y equilibrio de fuerzas", "Electricidad", "Reacciones químicas"], correctAnswer: 1 },
          { text: "Ley fundamental de la ingeniería: F = m * a", options: ["Leyes de Ohm", "Leyes de Newton", "Leyes de Termodinámica", "Límites"], correctAnswer: 1 },
          { text: "Un vector tiene magnitud, sentido y:", options: ["Color", "Dirección", "Peso", "Volumen"], correctAnswer: 1 },
          { text: "Instrumento para medir ángulos en topografía:", options: ["Cinta métrica", "Teodolito", "Nivel", "Escuadra"], correctAnswer: 1 },
          { text: "¿Qué es el dibujo técnico?", options: ["Arte de pintar", "Representación gráfica precisa de objetos", "Escritura", "Cálculo"], correctAnswer: 1 },
          { text: "¿Cuál es la unidad de fuerza en el SI?", options: ["Kilogramo", "Newton", "Pascal", "Watt"], correctAnswer: 1 },
          { text: "¿Qué es una armadura en ingeniería?", options: ["Un escudo", "Estructura de barras unidas en nudos", "Tipo de cemento", "Ropa de obra"], correctAnswer: 1 },
          { text: "La suma de momentos en equilibrio debe ser:", options: ["Infinito", "Cero", "Diez", "Negativo"], correctAnswer: 1 }
        ],
        2: [
          { text: "Propiedad de un material de recuperar su forma:", options: ["Plasticidad", "Elasticidad", "Fragilidad", "Dureza"], correctAnswer: 1 },
          { text: "¿Qué mide un manómetro?", options: ["Temperatura", "Presión de fluidos", "Velocidad", "Distancia"], correctAnswer: 1 },
          { text: "El hormigón/concreto es bueno resistiendo:", options: ["Tracción", "Compresión", "Torsión", "Flexión"], correctAnswer: 1 },
          { text: "¿Qué es la entropía?", options: ["Energía útil", "Medida del desorden de un sistema", "Calor latente", "Masa"], correctAnswer: 1 },
          { text: "La ley de Ohm relaciona Voltaje, Corriente y:", options: ["Potencia", "Resistencia", "Frecuencia", "Tiempo"], correctAnswer: 1 },
          { text: "¿Qué estudia la geotecnia?", options: ["Las estrellas", "El comportamiento de los suelos", "Plantas", "Aguas profundas"], correctAnswer: 1 },
          { text: "Un fluido es:", options: ["Solo agua", "Sustancia que se deforma continuamente bajo esfuerzo", "Sólido blando", "Gas noble"], correctAnswer: 1 },
          { text: "¿Qué es el límite elástico?", options: ["Punto donde se rompe", "Máximo esfuerzo sin deformación permanente", "Mínimo esfuerzo", "Punto medio"], correctAnswer: 1 }
        ],
        3: [
          { text: "¿Para qué sirve un vertedero en hidráulica?", options: ["Lanzar basura", "Medir y regular caudales", "Almacenar agua", "Filtrar"], correctAnswer: 1 },
          { text: "¿Qué es el fraguado del cemento?", options: ["Derrumbamiento", "Proceso de endurecimiento", "Mojado", "Pintado"], correctAnswer: 1 },
          { text: "Herramienta Z para compactar suelos:", options: ["Rodillo vibratorio", "Martillo", "Trole", "Pala"], correctAnswer: 0 },
          { text: "¿Qué es un muro de contención?", options: ["Decoración", "Estructura para resistir empuje de tierras", "Techo", "Piso"], correctAnswer: 1 },
          { text: "La dotación de agua potable se mide en:", options: ["Kg/día", "Litros/habitante/día", "m/s", "Watts"], correctAnswer: 1 },
          { text: "¿Qué es el 'Caminamiento Crítico'?", options: ["Correr", "Secuencia de actividades que determina la duración", "Caminar en obra", "Error"], correctAnswer: 1 },
          { text: "El acero de refuerzo absorbe esfuerzos de:", options: ["Compresión", "Tracción", "Calor", "Humedad"], correctAnswer: 1 },
          { text: "¿Qué es el alcantarillado pluvial?", options: ["Aguas negras", "Drenaje de agua de lluvia", "Tubería de gas", "Pozos"], correctAnswer: 1 }
        ],
        4: [
          { text: "¿Qué es el Estudio de Impacto Ambiental (EIA)?", options: ["Un dibujo", "Evaluación de efectos de obra en el entorno", "Costo de materiales", "Seguro"], correctAnswer: 1 },
          { text: "Principal valor de la ética en ingeniería:", options: ["Ganar dinero", "Seguridad pública y honestidad técnica", "Ser famoso", "Hacer planos"], correctAnswer: 1 },
          { text: "¿Qué es un residuo peligroso en obra?", options: ["Tierra", "Aceites, solventes, químicos", "Madera", "Papel"], correctAnswer: 1 },
          { text: "¿Para qué sirve el seguro de responsabilidad civil?", options: ["Pagar multas", "Cubrir daños a terceros durante la obra", "Sueldos", "Vacaciones"], correctAnswer: 1 },
          { text: "¿Qué es la sustentabilidad en construcción?", options: ["Pintar verde", "Satisfacer necesidades presentes sin dañar futuros", "Usar piedras", "Construir rápido"], correctAnswer: 1 },
          { text: "Falla catastrófica por falta de mantenimiento:", options: ["Pintura pelada", "Colapso estructural", "Gotera", "Luz fundida"], correctAnswer: 1 },
          { text: "La bitácora de obra es:", options: ["Un cuento", "Libro legal de registro de incidencias", "Diccionario", "Agenda personal"], correctAnswer: 1 },
          { text: "¿Qué es el BIM (Building Information Modeling)?", options: ["Un juego", "Metodología de trabajo colaborativo y digital", "Un tipo de pala", "Muro"], correctAnswer: 1 }
        ]
      }
    };
  }
}

