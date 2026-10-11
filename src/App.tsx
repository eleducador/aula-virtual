import React, { useState } from 'react';
import {
  BellRing,
  X,
  Smartphone,
  GraduationCap,
  BookOpen,
  ShieldCheck,
  LogOut,
  Award,
  Clock,
  UserCheck,
  KeyRound,
  Sparkles,
} from 'lucide-react';
import {
  UserRole,
  UserProfile,
  TopicItem,
  AssessmentItem,
  AttendanceEntry,
  AttendanceStatus,
  PushNotificationItem,
  StudentProgressRecord,
  CurricularMaterial,
} from './types';
import {
  INSTITUTION_ASSETS,
  INITIAL_SYSTEM_USERS,
  GRADE_LEVELS,
  COURSES,
  INITIAL_TOPICS,
  INITIAL_STUDENTS,
  INITIAL_ASSESSMENTS,
  INITIAL_ATTENDANCE,
  INITIAL_NOTIFICATIONS,
  INITIAL_MATERIALS,
} from './data/initialData';
import { LandingPortal } from './components/LandingPortal';
import { InstitutionalDashboardHome } from './components/InstitutionalDashboardHome';
import { CurriculumStudio } from './components/CurriculumStudio';
import { LiveAssessmentsHub } from './components/LiveAssessmentsHub';
import { AttendanceAnalyticsView } from './components/AttendanceAnalyticsView';
import { UserManagementView } from './components/UserManagementView';
import { StudentAIChatGPTView } from './components/StudentAIChatGPTView';
import { InicialKidExperienceView } from './components/InicialKidExperienceView';
import { PWAInstallModal } from './components/PWAInstallModal';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [systemUsers, setSystemUsers] = useState<UserProfile[]>(INITIAL_SYSTEM_USERS);
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_SYSTEM_USERS[0]);
  const [activeTab, setActiveTab] = useState<
    'inicio' | 'curricular' | 'examenes' | 'asistencia' | 'usuarios' | 'consulta_ia'
  >('inicio');

  // Academic & Institutional State
  const [selectedGradeId, setSelectedGradeId] = useState<string>('sec-4');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('cur-mat');
  const [topics, setTopics] = useState<TopicItem[]>(INITIAL_TOPICS);
  const [curricularMaterials, setCurricularMaterials] =
    useState<CurricularMaterial[]>(INITIAL_MATERIALS);
  const [assessments, setAssessments] = useState<AssessmentItem[]>(INITIAL_ASSESSMENTS);
  const [attendance, setAttendance] = useState<AttendanceEntry[]>(INITIAL_ATTENDANCE);
  const [studentsProgress, setStudentsProgress] =
    useState<StudentProgressRecord[]>(INITIAL_STUDENTS);
  const [notifications, setNotifications] =
    useState<PushNotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Mobile PWA & Push Notification Toast State
  const [isMobileModalOpen, setIsMobileModalOpen] = useState<boolean>(false);
  const [pushPermission, setPushPermission] = useState<
    NotificationPermission | 'default'
  >(
    typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'default'
  );
  const [activeToast, setActiveToast] = useState<{
    title: string;
    message: string;
  } | null>(null);

  const triggerInstantPushNotification = (
    title: string,
    message: string,
    category: 'Académico' | 'Examen en Vivo' | 'Asistencia' | 'Institucional' = 'Académico',
    targetRole: 'Todos' | UserRole = 'Todos'
  ) => {
    const newNotif: PushNotificationItem = {
      id: `not-${Date.now()}`,
      title,
      message,
      category,
      timestamp: 'Ahora mismo',
      targetRole,
      read: false,
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setActiveToast({ title, message });

    if (
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted'
    ) {
      try {
        new Notification(title, {
          body: message,
          icon: '/icon.svg',
        });
      } catch {
        // Fallback to in-app toast banner
      }
    }
  };

  const handleRequestPushPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setPushPermission(perm);
        if (perm === 'granted') {
          triggerInstantPushNotification(
            'Notificaciones Push Activadas',
            'Tu dispositivo iOS/Android/Web recibirá avisos al instante del Colegio Capitán Enrique Oppenheimer.',
            'Institucional'
          );
        }
      } catch {
        setPushPermission('granted');
      }
    } else {
      setPushPermission('granted');
      triggerInstantPushNotification(
        'Alertas Instantáneas Activas',
        'Recibirás alertas académicas y de asistencia en tiempo real.',
        'Institucional'
      );
    }
  };

  const handleLogin = (
    role: UserRole,
    customCode?: string,
    matchedUser?: UserProfile
  ) => {
    if (matchedUser) {
      setCurrentUser(matchedUser);
    } else {
      const codeClean = (customCode || '').toLowerCase().trim();
      const found = systemUsers.find(
        (u) => u.code.toLowerCase() === codeClean
      );
      if (found) {
        setCurrentUser(found);
      } else {
        const fallback = systemUsers.find((u) => u.role === role) || systemUsers[0];
        setCurrentUser(fallback);
      }
    }
    setIsAuthenticated(true);
    setActiveTab('inicio');
  };

  // Admin user management handlers
  const handleAddUser = (newUser: UserProfile) => {
    setSystemUsers((prev) => [newUser, ...prev]);

    // If new user is a student, automatically prepare student progress and attendance
    if (newUser.role === 'estudiante') {
      const newProgress: StudentProgressRecord = {
        studentId: newUser.id,
        studentName: newUser.name,
        studentCode: newUser.code,
        gradeId: newUser.gradeId || 'sec-4',
        completedTopicIds: [],
        exerciseScores: {},
        averageGrade: 20.0,
        attendanceRate: 100.0,
      };
      setStudentsProgress((prev) => [newProgress, ...prev]);

      const newAttendance: AttendanceEntry = {
        studentId: newUser.id,
        studentCode: newUser.code,
        studentName: newUser.name,
        gradeId: newUser.gradeId || 'sec-4',
        status: 'Presente',
        arrivalTime: '07:45 AM',
        observation: 'Alumno registrado en el aula virtual',
      };
      setAttendance((prev) => [newAttendance, ...prev]);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setSystemUsers((prev) => prev.filter((u) => u.id !== userId));
    setStudentsProgress((prev) => prev.filter((s) => s.studentId !== userId));
    setAttendance((prev) => prev.filter((a) => a.studentId !== userId));
  };

  const handleAddTopic = (newTopic: TopicItem) => {
    setTopics((prev) => [newTopic, ...prev]);
    const course = COURSES.find((c) => c.id === newTopic.courseId);
    const grade = GRADE_LEVELS.find((g) => g.id === newTopic.gradeId);
    triggerInstantPushNotification(
      `Nuevo Tema y Ejercicios Publicados`,
      `${newTopic.authorName} subió "${newTopic.title}" en ${course?.name || 'el curso'} (${grade?.name || ''}).`,
      'Académico'
    );
  };

  const handleAddMaterial = (newMaterial: CurricularMaterial) => {
    setCurricularMaterials((prev) => [newMaterial, ...prev]);
    const course = COURSES.find((c) => c.id === newMaterial.courseId);
    triggerInstantPushNotification(
      `Nuevo Material ${newMaterial.fileType.toUpperCase()} Disponible`,
      `${newMaterial.uploadedBy} subió "${newMaterial.title}" (${newMaterial.fileType.toUpperCase()} · ${newMaterial.fileSize}) en ${course?.name || 'el curso'}.`,
      'Académico'
    );
  };

  const handleDeleteMaterial = (materialId: string) => {
    setCurricularMaterials((prev) => prev.filter((m) => m.id !== materialId));
  };

  const handleRecordExerciseScore = (
    topicId: string,
    correctCount: number,
    totalCount: number
  ) => {
    setStudentsProgress((prev) =>
      prev.map((student, idx) => {
        if (idx !== 0) return student;
        const completed = student.completedTopicIds.includes(topicId)
          ? student.completedTopicIds
          : [...student.completedTopicIds, topicId];
        return {
          ...student,
          completedTopicIds: completed,
          exerciseScores: {
            ...student.exerciseScores,
            [topicId]: {
              correct: correctCount,
              total: totalCount,
              lastAttempt: 'Hoy · Sincronizado',
            },
          },
        };
      })
    );

    if (correctCount === totalCount && totalCount > 0) {
      triggerInstantPushNotification(
        'Tema Dominado al 100%',
        `Progreso académico actualizado automáticamente: ${correctCount}/${totalCount} ejercicios resueltos con éxito.`,
        'Académico'
      );
    }
  };

  const handleAddAssessment = (newAssessment: AssessmentItem) => {
    setAssessments((prev) => [newAssessment, ...prev]);
    triggerInstantPushNotification(
      `${newAssessment.type} Habilitado`,
      `Se ha iniciado "${newAssessment.title}" con duración de ${newAssessment.durationMinutes} minutos.`,
      'Examen en Vivo'
    );
  };

  const handleCompleteAssessment = (assessmentId: string, scoreObtained: number) => {
    setAssessments((prev) =>
      prev.map((a) =>
        a.id === assessmentId
          ? { ...a, submissionsCount: Math.min(a.totalStudents, a.submissionsCount + 1) }
          : a
      )
    );
    triggerInstantPushNotification(
      'Evaluación Calificada en Tiempo Real',
      `Tu calificación obtenida es ${scoreObtained}/20. Registrada en el sistema académico.`,
      'Examen en Vivo'
    );
  };

  const handleUpdateAttendanceStatus = (
    studentId: string,
    status: AttendanceStatus
  ) => {
    const nowTime = new Date().toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
    });
    setAttendance((prev) =>
      prev.map((entry) =>
        entry.studentId === studentId
          ? {
              ...entry,
              status,
              arrivalTime: status === 'Falta' ? '--:--' : nowTime,
            }
          : entry
      )
    );
  };

  const handleMarkAllPresent = () => {
    setAttendance((prev) =>
      prev.map((entry) => ({
        ...entry,
        status: 'Presente',
        arrivalTime: entry.arrivalTime === '--:--' ? '07:45 AM' : entry.arrivalTime,
      }))
    );
    triggerInstantPushNotification(
      'Asistencia de Aula Completada',
      'Se ha registrado el 100% de asistencia presente en la sección actual.',
      'Asistencia'
    );
  };

  const handleNotifyAbsentParents = () => {
    const nonPresent = attendance.filter(
      (a) => a.status === 'Tardanza' || a.status === 'Falta'
    ).length;
    triggerInstantPushNotification(
      'Avisos de Asistencia Enviados (iOS y Android)',
      `Se enviaron notificaciones push instantáneas a ${nonPresent || 2} apoderados sobre el registro de ingreso escolar.`,
      'Asistencia'
    );
  };

  const isInicialProfile =
    currentUser.educationLevel === 'Inicial' ||
    (currentUser.gradeId && ['ini-3', 'ini-4', 'ini-5'].includes(currentUser.gradeId)) ||
    currentUser.code.toUpperCase().startsWith('INI');

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col text-slate-100 bg-cover bg-center bg-no-repeat relative select-none"
      style={{
        backgroundImage: isInicialProfile && isAuthenticated
          ? `url(${INSTITUTION_ASSETS.fondoInicial})`
          : `linear-gradient(to bottom, rgba(10, 8, 16, 0.65), rgba(14, 10, 22, 0.82)), url(${INSTITUTION_ASSETS.fondoPagina})`,
      }}
    >
      {/* Instant Push Notification Floating Toast (Dark Theme) */}
      {activeToast && (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl bg-black/90 text-white p-4 shadow-2xl border border-[#FACC15]/50 flex items-start gap-3 backdrop-blur-xl">
          <BellRing className="w-5 h-5 text-[#FACC15] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="font-bold text-[#FEF08A]">{activeToast.title}</div>
            <p className="text-slate-300 mt-0.5 leading-relaxed">
              {activeToast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveToast(null)}
            className="text-slate-400 hover:text-white cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* PWA iOS / Android & Push Settings Modal */}
      <PWAInstallModal
        isOpen={isMobileModalOpen}
        onClose={() => setIsMobileModalOpen(false)}
        pushPermission={pushPermission}
        onRequestPushPermission={handleRequestPushPermission}
        onTriggerTestPush={() =>
          triggerInstantPushNotification(
            'Alerta Push de Prueba · Colegio Oppenheimer',
            'Comunicación instantánea operativa en dispositivos iOS, Android y escritorio.',
            'Institucional'
          )
        }
      />

      {!isAuthenticated ? (
        <LandingPortal
          systemUsers={systemUsers}
          onLogin={handleLogin}
          onOpenMobileModal={() => setIsMobileModalOpen(true)}
        />
      ) : isInicialProfile ? (
        /* SPECIAL DISNEY / MAGICAL WONDERLAND INTERFACE ONLY FOR INICIAL */
        <InicialKidExperienceView
          currentUser={currentUser}
          courses={COURSES}
          materials={curricularMaterials}
          onLogout={() => setIsAuthenticated(false)}
          onOpenMobileModal={() => setIsMobileModalOpen(true)}
        />
      ) : (
        <>
          {/* Authenticated Full-Height No-Scroll Workspace with Lateral Tabs (Primaria & Secundaria) */}
          <div className="flex-1 min-h-0 flex overflow-hidden">
            {/* Lateral Tabs Sidebar (Strict Dark Theme, Exclusive Profile Access) */}
            <aside className="w-64 shrink-0 bg-black/65 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-4 z-20 text-white">
              <div className="space-y-4">
                {/* Header Brand within Sidebar */}
                <div className="flex items-center gap-2.5 px-2 pb-3 border-b border-white/10">
                  <img
                    src={INSTITUTION_ASSETS.crestEmblem}
                    alt="Emblema Oppenheimer"
                    className="w-9 h-9 rounded-lg object-contain border border-[#FACC15]/80 shadow-md bg-[#840A21]/80 p-0.5"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">
                      Colegio Oppenheimer
                    </p>
                    <p className="text-[11px] text-[#FEF08A] font-mono-tabular">
                      Aula Virtual 2026
                    </p>
                  </div>
                </div>

                {/* Lateral Navigation Tabs (Adapted to user role) */}
                <nav className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => setActiveTab('inicio')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      activeTab === 'inicio'
                        ? 'bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white shadow-lg border border-[#FACC15]/40'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Award className="w-4 h-4 shrink-0 text-[#FACC15]" />
                    <span>Inicio Institucional</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('curricular')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      activeTab === 'curricular'
                        ? 'bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white shadow-lg border border-[#FACC15]/40'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 shrink-0 text-[#FACC15]" />
                    <span>
                      {currentUser.role === 'estudiante'
                        ? 'Mis Temas y Ejercicios'
                        : 'Avance Curricular'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('examenes')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      activeTab === 'examenes'
                        ? 'bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white shadow-lg border border-[#FACC15]/40'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Clock className="w-4 h-4 shrink-0 text-[#FACC15]" />
                    <span>
                      {currentUser.role === 'estudiante'
                        ? 'Mis Exámenes en Vivo'
                        : 'Exámenes y Tareas'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTab('asistencia')}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                      activeTab === 'asistencia'
                        ? 'bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white shadow-lg border border-[#FACC15]/40'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 shrink-0 text-[#FACC15]" />
                    <span>
                      {currentUser.role === 'estudiante'
                        ? 'Mi Asistencia Escolar'
                        : 'Asistencia y Reportes'}
                    </span>
                  </button>

                  {/* STUDENT EXCLUSIVE: CONSULTA IA (TUTOR CHATGPT) */}
                  {currentUser.role === 'estudiante' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('consulta_ia')}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                        activeTab === 'consulta_ia'
                          ? 'bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white shadow-lg border border-[#FACC15]/40'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Sparkles className="w-4 h-4 shrink-0 text-[#FACC15]" />
                        <span>Consulta IA (ChatGPT)</span>
                      </div>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#FACC15]/20 text-[#FEF08A] border border-[#FACC15]/40">
                        IA
                      </span>
                    </button>
                  )}

                  {/* ADMIN EXCLUSIVE: GESTIÓN DE USUARIOS Y CONTRASEÑAS */}
                  {currentUser.role === 'admin' && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('usuarios')}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer ${
                        activeTab === 'usuarios'
                          ? 'bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white shadow-lg border border-[#FACC15]/40'
                          : 'text-slate-300 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <KeyRound className="w-4 h-4 shrink-0 text-[#FACC15]" />
                      <span>Gestión de Usuarios (Accesos)</span>
                    </button>
                  )}
                </nav>

                {/* Exclusive Profile Card */}
                <div className="pt-3 border-t border-white/10">
                  <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 shadow-inner">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-md bg-[#7F1D1D] text-[#FEF08A] border border-[#FACC15]/40">
                        {currentUser.role === 'estudiante' && <GraduationCap className="w-3.5 h-3.5" />}
                        {currentUser.role === 'docente' && <BookOpen className="w-3.5 h-3.5" />}
                        {currentUser.role === 'admin' && <ShieldCheck className="w-3.5 h-3.5" />}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FACC15]">
                        {currentUser.role === 'estudiante'
                          ? 'Perfil: Estudiante'
                          : currentUser.role === 'docente'
                          ? 'Perfil: Docente Titular'
                          : 'Perfil: Administrador'}
                      </span>
                    </div>
                    <p className="font-bold text-white text-xs truncate">
                      {currentUser.name}
                    </p>
                    <p className="text-slate-300 font-mono-tabular text-[11px]">
                      {currentUser.code}
                    </p>
                    <p className="text-[10px] text-slate-400 pt-0.5 border-t border-white/5">
                      Sesión exclusiva activa
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer Actions */}
              <div className="space-y-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsMobileModalOpen(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#FACC15]" />
                  <span>App iOS / Android</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsAuthenticated(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-950/60 text-slate-300 hover:text-red-200 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </aside>

            {/* Main Content Viewport */}
            <main className="flex-1 min-w-0 h-full overflow-y-auto p-5 lg:p-6 text-slate-100">
              <div className="max-w-[1340px] mx-auto space-y-6">
                {activeTab === 'inicio' && (
                  <InstitutionalDashboardHome
                    currentUser={currentUser}
                    courses={COURSES}
                    grades={GRADE_LEVELS}
                    topics={topics}
                    assessments={assessments}
                    notifications={notifications}
                    onNavigateTab={setActiveTab}
                    onSelectCourseAndOpen={(courseId) => {
                      setSelectedCourseId(courseId);
                      setActiveTab('curricular');
                    }}
                    onSendPushBroadcast={(title, message, targetRole) =>
                      triggerInstantPushNotification(
                        title,
                        message,
                        'Institucional',
                        targetRole
                      )
                    }
                    onOpenMobileModal={() => setIsMobileModalOpen(true)}
                  />
                )}

                {activeTab === 'curricular' && (
                  <CurriculumStudio
                    userRole={currentUser.role}
                    userName={currentUser.name}
                    courses={COURSES}
                    grades={GRADE_LEVELS}
                    topics={topics}
                    materials={curricularMaterials}
                    selectedGradeId={selectedGradeId}
                    selectedCourseId={selectedCourseId}
                    onSelectGrade={setSelectedGradeId}
                    onSelectCourse={setSelectedCourseId}
                    onAddTopic={handleAddTopic}
                    onAddMaterial={handleAddMaterial}
                    onDeleteMaterial={handleDeleteMaterial}
                    studentProgress={studentsProgress[0]}
                    onRecordExerciseScore={handleRecordExerciseScore}
                  />
                )}

                {activeTab === 'examenes' && (
                  <LiveAssessmentsHub
                    userRole={currentUser.role}
                    assessments={assessments}
                    courses={COURSES}
                    grades={GRADE_LEVELS}
                    onAddAssessment={handleAddAssessment}
                    onCompleteAssessment={handleCompleteAssessment}
                  />
                )}

                {activeTab === 'asistencia' && (
                  <AttendanceAnalyticsView
                    userRole={currentUser.role}
                    currentUser={currentUser}
                    attendance={attendance}
                    grades={GRADE_LEVELS}
                    studentsProgress={studentsProgress}
                    selectedGradeId={selectedGradeId}
                    onSelectGrade={setSelectedGradeId}
                    onUpdateAttendanceStatus={handleUpdateAttendanceStatus}
                    onMarkAllPresent={handleMarkAllPresent}
                    onNotifyAbsentParents={handleNotifyAbsentParents}
                  />
                )}

                {activeTab === 'usuarios' && currentUser.role === 'admin' && (
                  <UserManagementView
                    users={systemUsers}
                    grades={GRADE_LEVELS}
                    onAddUser={handleAddUser}
                    onDeleteUser={handleDeleteUser}
                    onSendNotification={(title, msg) =>
                      triggerInstantPushNotification(title, msg, 'Institucional')
                    }
                  />
                )}

                {activeTab === 'consulta_ia' && currentUser.role === 'estudiante' && (
                  <StudentAIChatGPTView
                    currentUser={currentUser}
                    courses={COURSES}
                  />
                )}
              </div>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
