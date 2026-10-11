import {
  UserProfile,
  GradeLevel,
  CourseItem,
  TopicItem,
  StudentProgressRecord,
  AssessmentItem,
  AttendanceEntry,
  PushNotificationItem,
  CurricularMaterial,
} from '../types';

import fondoPaginaImg from '../assets/images/fondo_institucional_oppenheimer.jpg';
import fondoInicialImg from '../assets/images/fondo_magico_inicial.svg';
import campusHeroImg from '../assets/images/colegio_oppenheimer_campus_1791666912151.jpg';
import awardsBannerImg from '../assets/images/colegio_oppenheimer_premios_1791666921941.jpg';
import compositePortalImg from '../assets/images/portada_acceso_oppenheimer_composite.jpg';
import blendedPortalImg from '../assets/images/portada_acceso_oppenheimer_blended.jpg';
import crestEmblemSvg from '../assets/images/escudo_oficial_oppenheimer_44.svg';
import crestEmblemInsignia from '../assets/images/colegio_oppenheimer_insignia_1791666931203.jpg';

export const INSTITUTION_ASSETS = {
  fondoPagina: fondoPaginaImg,
  fondoInicial: fondoInicialImg,
  campusHero: campusHeroImg,
  awardsBanner: awardsBannerImg,
  compositePortal: compositePortalImg,
  blendedPortal: blendedPortalImg,
  crestEmblem: crestEmblemInsignia,
  crestEmblemInsignia: crestEmblemInsignia,
  crestEmblemSvg: crestEmblemSvg,
};

// ============================================================================
// ÚNICO USUARIO INICIAL: ADMINISTRADOR
// Credenciales oficiales:
// Usuario: admin
// Contraseña: admin
// ============================================================================
export const ADMIN_USER: UserProfile = {
  id: 'usr-admin-root',
  name: 'Administrador General',
  code: 'admin',
  password: 'admin',
  role: 'admin',
  educationLevel: 'Secundaria',
  specialty: 'Dirección General y Administración Escolar',
  email: 'admin@colegiooppenheimer.edu.pe',
  avatarInitials: 'AD',
  status: 'Activo',
  createdAt: '10 Oct 2026',
};

export const DEMO_USERS: Record<string, UserProfile> = {
  admin: ADMIN_USER,
  docente: {
    ...ADMIN_USER,
    role: 'docente',
    code: 'admin',
    password: 'admin',
  },
  estudiante: {
    ...ADMIN_USER,
    role: 'estudiante',
    code: 'admin',
    password: 'admin',
  },
  estudiante_inicial: {
    ...ADMIN_USER,
    role: 'estudiante',
    educationLevel: 'Inicial',
    code: 'admin',
    password: 'admin',
  },
};

export const INITIAL_SYSTEM_USERS: UserProfile[] = [
  ADMIN_USER,
];

// Estructura oficial de los 3 niveles: Inicial, Primaria y Secundaria
export const GRADE_LEVELS: GradeLevel[] = [
  {
    id: 'ini-3',
    name: 'Inicial 3 Años',
    level: 'Inicial',
    section: 'Aula "Estrellitas Mágicas"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'ini-4',
    name: 'Inicial 4 Años',
    level: 'Inicial',
    section: 'Aula "Arcoíris Encantado"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'ini-5',
    name: 'Inicial 5 Años',
    level: 'Inicial',
    section: 'Aula "Castillo Mágico"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'pri-5',
    name: '5.° Grado de Primaria',
    level: 'Primaria',
    section: 'Sección A "Lira de Oro"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'pri-6',
    name: '6.° Grado de Primaria',
    level: 'Primaria',
    section: 'Sección Única "Bicentenario"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'sec-1',
    name: '1.° Año de Secundaria',
    level: 'Secundaria',
    section: 'Sección A "César Vallejo"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'sec-2',
    name: '2.° Año de Secundaria',
    level: 'Secundaria',
    section: 'Sección A "Jorge Basadre"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'sec-3',
    name: '3.° Año de Secundaria',
    level: 'Secundaria',
    section: 'Sección A "Pedro Paulet"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'sec-4',
    name: '4.° Año de Secundaria',
    level: 'Secundaria',
    section: 'Sección A "Capitán Oppenheimer"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
  {
    id: 'sec-5',
    name: '5.° Año de Secundaria',
    level: 'Secundaria',
    section: 'Promoción "Excelencia 2026"',
    tutorName: 'Por Asignar en Administración',
    studentCount: 0,
  },
];

// Catálogo curricular oficial de cursos por nivel educativo
export const COURSES: CourseItem[] = [
  // Inicial
  {
    id: 'cur-ini-art',
    code: 'INI-ART',
    name: 'Arte, Creatividad y Colores Mágicos',
    area: 'Arte y Cultura Musical',
    gradeIds: ['ini-3', 'ini-4', 'ini-5'],
    teacherName: 'Docente de Inicial',
    weeklyHours: 6,
    description: 'Estimulación sensorial, pintura con témperas, modelado en plastilina y expresión artística infantil.',
    accentColor: '#FF6B8B',
  },
  {
    id: 'cur-ini-cuen',
    code: 'INI-LIT',
    name: 'Cuentos Mágicos y Primeras Palabras',
    area: 'Humanidades y Letras',
    gradeIds: ['ini-3', 'ini-4', 'ini-5'],
    teacherName: 'Docente de Inicial',
    weeklyHours: 5,
    description: 'Cuentacuentos participativos, rimas divertidas, reconocimiento de vocales y estimulación del lenguaje.',
    accentColor: '#54A0FF',
  },
  {
    id: 'cur-ini-mat',
    code: 'INI-MAT',
    name: 'Números Traviesos y Formas Mágicas',
    area: 'Ciencias y Matemática',
    gradeIds: ['ini-3', 'ini-4', 'ini-5'],
    teacherName: 'Docente de Inicial',
    weeklyHours: 5,
    description: 'Juegos de conteo lúdico, reconocimiento de figuras y desarrollo del pensamiento lógico temprano.',
    accentColor: '#FECA57',
  },
  {
    id: 'cur-ini-psi',
    code: 'INI-PSI',
    name: 'Rondas Musicales y Psicomotricidad',
    area: 'Arte y Cultura Musical',
    gradeIds: ['ini-3', 'ini-4', 'ini-5'],
    teacherName: 'Docente de Música',
    weeklyHours: 4,
    description: 'Coordinación motriz, bailes infantiles, rondas rítmicas e iniciación con instrumentos de percusión.',
    accentColor: '#1DD1A1',
  },
  // Primaria y Secundaria
  {
    id: 'cur-mat',
    code: 'MAT-401',
    name: 'Matemática: Álgebra y Trigonometría',
    area: 'Ciencias y Matemática',
    gradeIds: ['pri-5', 'pri-6', 'sec-1', 'sec-2', 'sec-3', 'sec-4', 'sec-5'],
    teacherName: 'Docente Titular de Matemática',
    weeklyHours: 6,
    description: 'Modelamiento algebraico, funciones, razones trigonométricas y resolución analítica de problemas.',
    accentColor: '#7F1D1D',
  },
  {
    id: 'cur-cta',
    code: 'CYT-402',
    name: 'Ciencia y Tecnología: Física y Química',
    area: 'Ciencias y Matemática',
    gradeIds: ['pri-5', 'pri-6', 'sec-1', 'sec-2', 'sec-3', 'sec-4', 'sec-5'],
    teacherName: 'Docente Titular de Ciencias',
    weeklyHours: 5,
    description: 'Leyes de la física, indagación científica experimental, estructura molecular y balance químico.',
    accentColor: '#0F766E',
  },
  {
    id: 'cur-com',
    code: 'COM-403',
    name: 'Comunicación y Literatura Peruana',
    area: 'Humanidades y Letras',
    gradeIds: ['pri-5', 'pri-6', 'sec-1', 'sec-2', 'sec-3', 'sec-4', 'sec-5'],
    teacherName: 'Docente Titular de Comunicación',
    weeklyHours: 5,
    description: 'Comprensión lectora avanzada, redacción académica, oratoria y literatura hispanoamericana.',
    accentColor: '#B45309',
  },
  {
    id: 'cur-his',
    code: 'CCS-404',
    name: 'Ciencias Sociales, Historia y Economía',
    area: 'Humanidades y Letras',
    gradeIds: ['pri-5', 'pri-6', 'sec-1', 'sec-2', 'sec-3', 'sec-4', 'sec-5'],
    teacherName: 'Docente Titular de Ciencias Sociales',
    weeklyHours: 4,
    description: 'Historia del Perú y universal, formación ciudadana, geografía y economía aplicada.',
    accentColor: '#1E3A8A',
  },
  {
    id: 'cur-mus',
    code: 'ART-405',
    name: 'Arte y Cultura: Banda Sinfónica y Coro',
    area: 'Arte y Cultura Musical',
    gradeIds: ['pri-5', 'pri-6', 'sec-1', 'sec-2', 'sec-3', 'sec-4', 'sec-5'],
    teacherName: 'Director Musical Institucional',
    weeklyHours: 4,
    description: 'Programa de formación musical emblemática Oppenheimer: lectura de partituras, armonía y ensamble.',
    accentColor: '#991B1B',
  },
  {
    id: 'cur-ing',
    code: 'ING-406',
    name: 'Inglés Académico e Investigación Digital',
    area: 'Tecnología e Idiomas',
    gradeIds: ['pri-5', 'pri-6', 'sec-1', 'sec-2', 'sec-3', 'sec-4', 'sec-5'],
    teacherName: 'Docente de Idiomas',
    weeklyHours: 4,
    description: 'Habilidades comunicativas en inglés estándar, vocabulario técnico y preparación académica.',
    accentColor: '#3730A3',
  },
];

// ============================================================================
// DATOS LIMPIOS: Listos para comenzar a generar contenido y usuarios reales
// ============================================================================
export const INITIAL_TOPICS: TopicItem[] = [];

export const INITIAL_STUDENTS: StudentProgressRecord[] = [];

export const INITIAL_ASSESSMENTS: AssessmentItem[] = [];

export const INITIAL_ATTENDANCE: AttendanceEntry[] = [];

export const INITIAL_MATERIALS: CurricularMaterial[] = [];

export const INITIAL_NOTIFICATIONS: PushNotificationItem[] = [
  {
    id: 'not-01',
    title: 'Sistema Institucional Inicializado',
    message: 'Portal del Colegio Capitán Enrique Oppenheimer listo para la creación de usuarios, docentes y estudiantes desde el panel de administración.',
    category: 'Institucional',
    timestamp: 'Hoy',
    targetRole: 'Todos',
    read: false,
  },
];

export const INITIAL_AWARDS = [
  {
    year: '2024',
    title: 'Gran Premio Nacional de Música Escolar',
    issuer: 'Concurso Nacional de Bandas y Orquestas Escolares',
    category: 'Excelencia Musical',
  },
  {
    year: '2023',
    title: 'Medalla de Oro en Ciencias Experimentales',
    issuer: 'Feria Escolar Nacional de Ciencia y Tecnología (EUREKA)',
    category: 'Innovación Científica',
  },
  {
    year: '2022',
    title: 'Primer Puesto Departamental de Bandas Sinfónicas',
    issuer: 'Dirección Regional de Educación de Lima',
    category: 'Formación Artística',
  },
  {
    year: '2021',
    title: 'Placa de Honor al Desempeño Curricular Integral',
    issuer: 'Comité Educativo Nacional',
    category: 'Calidad Educativa',
  },
];

export const INSTITUTIONAL_AWARDS = INITIAL_AWARDS;
