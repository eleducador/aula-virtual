import React, { useState } from 'react';
import {
  UserPlus,
  Users,
  Search,
  KeyRound,
  ShieldCheck,
  GraduationCap,
  BookOpen,
  Copy,
  Check,
  Eye,
  EyeOff,
  Trash2,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { UserProfile, UserRole, GradeLevel } from '../types';

interface UserManagementViewProps {
  users: UserProfile[];
  grades: GradeLevel[];
  onAddUser: (newUser: UserProfile) => void;
  onDeleteUser: (userId: string) => void;
  onSendNotification: (title: string, message: string) => void;
}

export const UserManagementView: React.FC<UserManagementViewProps> = ({
  users,
  grades,
  onAddUser,
  onDeleteUser,
  onSendNotification,
}) => {
  const [activeFilter, setActiveFilter] = useState<'Todos' | UserRole>('Todos');
  const [searchQuery, setSearchQuery] = useState('');
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [newRole, setNewRole] = useState<UserRole>('docente');
  const [newEducationLevel, setNewEducationLevel] = useState<'Inicial' | 'Primaria' | 'Secundaria'>('Secundaria');
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('DOC-CEO-101');
  const [newPassword, setNewPassword] = useState('docente2026');
  const [newEmail, setNewEmail] = useState('');
  const [newGradeId, setNewGradeId] = useState('sec-4');
  const [newSpecialty, setNewSpecialty] = useState('Docente de Asignatura Curricular');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Handle role change in form with smart auto-generated code and suggested password
  const handleFormRoleChange = (role: UserRole) => {
    setNewRole(role);
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    if (role === 'docente') {
      setNewCode(`DOC-CEO-${randomSuffix}`);
      setNewPassword(`docente${new Date().getFullYear()}`);
      setNewSpecialty('Docente de Asignatura Curricular');
    } else if (role === 'estudiante') {
      setNewCode(`CEO-2026-${randomSuffix}`);
      setNewPassword(`estudiante${new Date().getFullYear()}`);
    } else {
      setNewCode(`DIR-CEO-${randomSuffix}`);
      setNewPassword(`admin${new Date().getFullYear()}`);
      setNewSpecialty('Coordinación Académica y Dirección');
    }
  };

  const handleGenerateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
    let res = '';
    for (let i = 0; i < 8; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(`${newRole.substring(0, 3)}_${res}!`);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newCode.trim() || !newPassword.trim()) return;

    const initials = newName
      .trim()
      .split(' ')
      .slice(0, 2)
      .map((n) => n[0]?.toUpperCase() || '')
      .join('');

    const matchedGrade = grades.find((g) => g.id === newGradeId);
    const assignedLevel: 'Inicial' | 'Primaria' | 'Secundaria' =
      newRole === 'estudiante'
        ? matchedGrade?.level || newEducationLevel
        : newEducationLevel;

    const createdUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: newName.trim(),
      code: newCode.trim(),
      password: newPassword.trim(),
      role: newRole,
      educationLevel: assignedLevel,
      email:
        newEmail.trim() ||
        `${newCode.toLowerCase().replace(/[^a-z0-9]/g, '')}@colegiooppenheimer.edu.pe`,
      avatarInitials: initials || 'OP',
      gradeId: newRole === 'estudiante' ? newGradeId : undefined,
      specialty: newRole !== 'estudiante' ? newSpecialty.trim() : undefined,
      status: 'Activo',
      createdAt: new Date().toLocaleDateString('es-PE', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }),
    };

    onAddUser(createdUser);
    onSendNotification(
      'Nuevo Usuario y Contraseña Creados',
      `Se habilitó el acceso para ${createdUser.name} con código "${createdUser.code}" (${createdUser.role.toUpperCase()}) en nivel ${assignedLevel}.`
    );

    setSuccessMessage(`¡Usuario ${createdUser.code} creado exitosamente con contraseña activa!`);
    setTimeout(() => setSuccessMessage(''), 4000);

    // Reset form with new code
    setNewName('');
    handleFormRoleChange(newRole);
  };

  const handleCopyCredentials = (user: UserProfile) => {
    const text = `Colegio Capitán Enrique Oppenheimer\nRol: ${user.role.toUpperCase()}\nNombre: ${user.name}\nUsuario: ${user.code}\nContraseña: ${user.password || 'oppenheimer2026'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswordMap((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Filtered list
  const filteredUsers = users.filter((u) => {
    const matchesRole = activeFilter === 'Todos' || u.role === activeFilter;
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const studentsCount = users.filter((u) => u.role === 'estudiante').length;
  const teachersCount = users.filter((u) => u.role === 'docente').length;
  const adminsCount = users.filter((u) => u.role === 'admin').length;

  return (
    <div className="space-y-6 text-slate-100">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 shadow-xl flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#FEF08A] mb-1 font-semibold">
            <KeyRound className="w-4 h-4 text-[#FACC15]" />
            <span>Módulo de Administración de Accesos y Seguridad</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
            Gestión de Usuarios y Contraseñas
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Crea, administra y asigna credenciales institucionales para estudiantes y docentes del Colegio Capitán Enrique Oppenheimer.
          </p>
        </div>

        {/* Quick KPI stats */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-xs text-slate-400">Total</div>
            <div className="text-base font-bold text-white font-mono-tabular">
              {users.length}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-xs text-[#FEF08A]">Docentes</div>
            <div className="text-base font-bold text-[#FEF08A] font-mono-tabular">
              {teachersCount}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-xs text-emerald-300">Alumnos</div>
            <div className="text-base font-bold text-emerald-300 font-mono-tabular">
              {studentsCount}
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-center">
            <div className="text-xs text-amber-300">Admins</div>
            <div className="text-base font-bold text-amber-300 font-mono-tabular">
              {adminsCount}
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2 shadow-lg animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {/* Main Grid: Left Form to Create User (5 cols) + Right Directory of Users (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Create User & Password Form */}
        <div className="lg:col-span-5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 p-6 space-y-5 shadow-xl">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <UserPlus className="w-4 h-4 text-[#FACC15]" />
                <span>Crear Nuevo Usuario y Contraseña</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Genera la cuenta de acceso para un nuevo estudiante o profesor.
              </p>
            </div>
          </div>

          <form onSubmit={handleCreateUser} className="space-y-4">
            {/* Role Selector Pill */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Tipo de Rol Institucional *
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/15">
                <button
                  type="button"
                  onClick={() => handleFormRoleChange('estudiante')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    newRole === 'estudiante'
                      ? 'bg-[#7F1D1D] text-white shadow-md border border-[#FACC15]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Estudiante</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFormRoleChange('docente')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    newRole === 'docente'
                      ? 'bg-[#7F1D1D] text-white shadow-md border border-[#FACC15]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Docente</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleFormRoleChange('admin')}
                  className={`py-2 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    newRole === 'admin'
                      ? 'bg-[#7F1D1D] text-white shadow-md border border-[#FACC15]/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombres y Apellidos Completos *
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={
                  newRole === 'docente'
                    ? 'Ej. Lic. Roberto Carlos Espinoza Ramos'
                    : newRole === 'estudiante'
                    ? 'Ej. Andrea Belén Paredes Soto'
                    : 'Ej. Dra. Mónica Quispe Morales'
                }
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/20 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:border-[#FACC15]"
                required
              />
            </div>

            {/* User Code & Password in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* User Code */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Código / Usuario *
                </label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="Ej. DOC-CEO-108"
                  className="w-full px-3 py-2 text-xs font-mono-tabular rounded-xl border border-white/20 bg-slate-900 text-[#FEF08A] font-semibold focus:outline-none focus:border-[#FACC15]"
                  required
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-300">
                    Contraseña *
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateRandomPassword}
                    className="text-[10px] text-[#FEF08A] hover:underline cursor-pointer flex items-center gap-0.5"
                  >
                    <Sparkles className="w-3 h-3 text-[#FACC15]" />
                    <span>Auto</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="w-full pl-3 pr-8 py-2 text-xs font-mono-tabular rounded-xl border border-white/20 bg-slate-900 text-white focus:outline-none focus:border-[#FACC15]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                    aria-label="Ver u ocultar contraseña"
                  >
                    {showFormPassword ? (
                      <EyeOff className="w-3.5 h-3.5" />
                    ) : (
                      <Eye className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Role-Specific Field: Grade for Students, Specialty for Teachers */}
            {newRole === 'estudiante' ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Grado Escolar Asignado
                </label>
                <select
                  value={newGradeId}
                  onChange={(e) => setNewGradeId(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-white/20 bg-slate-900 text-white focus:outline-none focus:border-[#FACC15]"
                >
                  {grades.map((g) => (
                    <option key={g.id} value={g.id}>
                      [{g.level.toUpperCase()}] {g.name} · {g.section}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nivel Educativo Asignado
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-white/10 rounded-xl border border-white/15">
                    {(['Inicial', 'Primaria', 'Secundaria'] as const).map((lvl) => (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setNewEducationLevel(lvl)}
                        className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          newEducationLevel === lvl
                            ? 'bg-[#7F1D1D] text-white shadow border border-[#FACC15]/40'
                            : 'text-slate-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Especialidad / Asignatura Curricular
                  </label>
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    placeholder="Ej. Docente de Banda Sinfónica y Coro"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-white/20 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:border-[#FACC15]"
                  />
                </div>
              </div>
            )}

            {/* Institutional Email (Optional / Auto) */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Correo Electrónico Institucional (Opcional)
              </label>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="ejemplo@colegiooppenheimer.edu.pe"
                className="w-full px-3 py-2 text-xs rounded-xl border border-white/20 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:border-[#FACC15]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] hover:from-[#991B1B] hover:to-[#B91C1C] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-[#FACC15]/40 shadow-lg cursor-pointer transition-all active:scale-[0.98]"
              >
                <UserPlus className="w-4 h-4 text-[#FACC15]" />
                <span>Habilitar Acceso y Guardar Credenciales</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right: Directory and Management Table (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/15 p-6 space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                <Users className="w-4 h-4 text-[#FACC15]" />
                <span>Directorio de Usuarios y Claves Activas ({filteredUsers.length})</span>
              </h3>
              <p className="text-xs text-slate-300 mt-0.5">
                Visualiza, copia o gestiona las credenciales de cada perfil.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar usuario..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-white/20 bg-slate-900 text-white placeholder-slate-400 focus:outline-none focus:border-[#FACC15]"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-white/10 backdrop-blur-md rounded-xl border border-white/15 w-fit">
            {(['Todos', 'docente', 'estudiante', 'admin'] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setActiveFilter(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeFilter === r
                    ? 'bg-[#7F1D1D] text-white shadow-md border border-[#FACC15]/40'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {r === 'Todos'
                  ? 'Todos'
                  : r === 'docente'
                  ? 'Docentes'
                  : r === 'estudiante'
                  ? 'Estudiantes'
                  : 'Administradores'}
              </button>
            ))}
          </div>

          {/* User Cards / Rows */}
          <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
            {filteredUsers.map((user) => {
              const isRevealed = !!showPasswordMap[user.id];
              const isCopied = copiedId === user.id;

              return (
                <div
                  key={user.id}
                  className="p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7F1D1D] to-[#991B1B] text-[#FEF08A] flex items-center justify-center font-bold text-xs border border-[#FACC15]/40 shrink-0">
                      {user.avatarInitials}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{user.name}</h4>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            user.role === 'docente'
                              ? 'bg-amber-950/60 text-[#FEF08A] border border-amber-500/40'
                              : user.role === 'estudiante'
                              ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40'
                              : 'bg-purple-950/60 text-purple-300 border border-purple-500/40'
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-300 mt-1 font-mono-tabular">
                        <span className="text-white font-semibold">
                          Usuario: <span className="text-[#FACC15]">{user.code}</span>
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <span>Clave:</span>
                          <span className="font-mono text-white">
                            {isRevealed ? user.password || 'oppenheimer2026' : '••••••••'}
                          </span>
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(user.id)}
                            className="text-slate-400 hover:text-white cursor-pointer ml-0.5"
                            title="Ver u ocultar clave"
                          >
                            {isRevealed ? (
                              <EyeOff className="w-3 h-3" />
                            ) : (
                              <Eye className="w-3 h-3" />
                            )}
                          </button>
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {user.specialty ||
                          (user.gradeId
                            ? grades.find((g) => g.id === user.gradeId)?.name
                            : 'Colegio Oppenheimer')}
                      </p>
                    </div>
                  </div>

                  {/* Actions: Copy Credentials & Delete */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleCopyCredentials(user)}
                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-all cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-900/60 border-emerald-500 text-emerald-200'
                          : 'bg-white/10 hover:bg-white/20 border-white/20 text-slate-200'
                      }`}
                      title="Copiar credenciales para enviar al usuario"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#FACC15]" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>

                    {/* Allow deleting users created dynamically, except the main admin account */}
                    {user.code.toLowerCase() !== 'admin' && (
                      <button
                        type="button"
                        onClick={() => onDeleteUser(user.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-950/40 transition-colors cursor-pointer"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No se encontraron usuarios con el criterio de búsqueda.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
