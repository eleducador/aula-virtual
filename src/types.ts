export type UserRole = 'estudiante' | 'docente' | 'admin';
export type EducationLevel = 'Inicial' | 'Primaria' | 'Secundaria';

export interface UserProfile {
  id: string;
  name: string;
  code: string;
  password?: string;
  role: UserRole;
  educationLevel?: EducationLevel;
  gradeId?: string; // Primary grade for students
  specialty?: string; // For teachers/admins
  email: string;
  avatarInitials: string;
  status?: 'Activo' | 'Inactivo';
  createdAt?: string;
}

export interface ConceptBlock {
  title: string;
  explanation: string;
  keyFormulaOrRule: string;
}

export interface WorkedExample {
  title: string;
  problemStatement: string;
  stepByStepSolution: string[];
  finalAnswer: string;
}

export interface PracticeExercise {
  question: string;
  difficulty: 'Básico' | 'Intermedio' | 'Avanzado' | string;
  options: string[];
  correctIndex: number;
  hint: string;
  explanation: string;
}

export type MaterialFileType = 'pdf' | 'pptx';

export interface CurricularMaterial {
  id: string;
  title: string;
  description: string;
  fileType: MaterialFileType;
  fileName: string;
  fileSize: string;
  fileUrl?: string;
  courseId: string;
  gradeId: string;
  unitName: string;
  bimestre: 'I Bimestre' | 'II Bimestre' | 'III Bimestre' | 'IV Bimestre';
  uploadedBy: string;
  uploadedAt: string;
  pageOrSlideCount: number;
  downloadCount: number;
  tags?: string[];
}

export interface TopicItem {
  id: string;
  courseId: string;
  gradeId: string;
  bimestre: 'I Bimestre' | 'II Bimestre' | 'III Bimestre' | 'IV Bimestre';
  unitName: string;
  orderIndex: number;
  title: string;
  summary: string;
  estimatedMinutes: number;
  publishedAt: string;
  authorName: string;
  status: 'Completado' | 'En Curso' | 'Programado';
  concepts: ConceptBlock[];
  examples: WorkedExample[];
  exercises: PracticeExercise[];
  attachedMaterials?: CurricularMaterial[];
}

export interface CourseItem {
  id: string;
  code: string;
  name: string;
  area: 'Ciencias y Matemática' | 'Humanidades y Letras' | 'Arte y Cultura Musical' | 'Tecnología e Idiomas';
  gradeIds: string[];
  teacherName: string;
  weeklyHours: number;
  description: string;
  accentColor: string;
}

export interface GradeLevel {
  id: string;
  name: string;
  level: EducationLevel;
  section: string;
  tutorName: string;
  studentCount: number;
}

export interface StudentProgressRecord {
  studentId: string;
  studentName: string;
  studentCode: string;
  gradeId: string;
  completedTopicIds: string[];
  exerciseScores: Record<string, { correct: number; total: number; lastAttempt: string }>; // keyed by topicId
  averageGrade: number; // Vigesimal scale 0 - 20 (Peru standard)
  attendanceRate: number; // Percentage 0 - 100
}

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  points: number;
}

export interface AssessmentItem {
  id: string;
  title: string;
  type: 'Examen en Tiempo Real' | 'Tarea Domiciliaria' | 'Práctica Calificada';
  courseId: string;
  gradeId: string;
  dueDate: string;
  durationMinutes: number;
  status: 'En Vivo' | 'Próximo' | 'Finalizado';
  totalPoints: number;
  questions: ExamQuestion[];
  submissionsCount: number;
  totalStudents: number;
}

export type AttendanceStatus = 'Presente' | 'Tardanza' | 'Falta' | 'Justificado';

export interface AttendanceEntry {
  studentId: string;
  studentCode: string;
  studentName: string;
  gradeId: string;
  status: AttendanceStatus;
  arrivalTime: string;
  observation: string;
}

export interface PushNotificationItem {
  id: string;
  title: string;
  message: string;
  category: 'Académico' | 'Examen en Vivo' | 'Asistencia' | 'Institucional';
  timestamp: string;
  targetRole: 'Todos' | UserRole;
  read: boolean;
}
