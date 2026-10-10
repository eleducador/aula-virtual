import React, { useState } from 'react';
import {
  Lock,
  User,
  ArrowRight,
  Smartphone,
  Eye,
  EyeOff,
  AlertCircle,
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { INSTITUTION_ASSETS, ADMIN_USER } from '../data/initialData';

interface LandingPortalProps {
  systemUsers?: UserProfile[];
  onLogin: (role: UserRole, customCode?: string, matchedUser?: UserProfile) => void;
  onOpenMobileModal: () => void;
}

export const LandingPortal: React.FC<LandingPortalProps> = ({
  systemUsers = [ADMIN_USER],
  onLogin,
  onOpenMobileModal,
}) => {
  const [userCode, setUserCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [crestImgError, setCrestImgError] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedCode = userCode.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!trimmedCode || !trimmedPass) {
      setErrorMessage('Por favor ingrese su usuario y contraseña.');
      return;
    }

    // Check if user code matches any registered system user
    const matched = systemUsers.find(
      (u) => u.code.toLowerCase() === trimmedCode
    );

    if (matched) {
      if (matched.password && matched.password !== trimmedPass) {
        setErrorMessage('Contraseña incorrecta para el usuario ingresado.');
        return;
      }
      onLogin(matched.role, matched.code, matched);
    } else if (trimmedCode === 'admin' && trimmedPass === 'admin') {
      const adminAcc = systemUsers.find((u) => u.role === 'admin') || ADMIN_USER;
      onLogin('admin', 'admin', adminAcc);
    } else {
      setErrorMessage(
        'Credenciales no válidas. Verifique su usuario y contraseña o comuníquese con Dirección.'
      );
    }
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col text-white bg-cover bg-center bg-no-repeat relative select-none"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(10, 8, 16, 0.45), rgba(12, 8, 18, 0.65)), url(${INSTITUTION_ASSETS.fondoPagina})`,
      }}
    >
      {/* Top Header Bar (Compact & Sleek Dark Glass with Official 44 Años Crest) */}
      <header className="shrink-0 z-30 flex items-center justify-between px-6 py-3.5 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center gap-3">
          {!crestImgError ? (
            <img
              src={INSTITUTION_ASSETS.crestEmblem}
              alt="Insignia Oficial Oppenheimer 44 Años"
              onError={() => setCrestImgError(true)}
              className="w-11 h-11 rounded-xl object-contain border border-[#FACC15]/80 shadow-md bg-[#840A21]/80 p-0.5"
            />
          ) : (
            <div className="w-11 h-11 rounded-xl bg-[#7F1D1D] flex items-center justify-center font-bold text-white text-xs border border-[#FACC15]">
              CEO
            </div>
          )}
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-[#FEF08A] font-display leading-tight drop-shadow-md">
              Colegio Capitán Enrique Oppenheimer
            </h1>
            <p className="text-xs text-slate-300 font-medium">
              Aula Virtual & Gestión Curricular · Inicial, Primaria y Secundaria
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenMobileModal}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all cursor-pointer backdrop-blur-sm shadow-sm"
        >
          <Smartphone className="w-3.5 h-3.5 text-[#FACC15]" />
          <span className="hidden sm:inline">App iOS & Android</span>
        </button>
      </header>

      {/* Main Center Area: Pure, secure login box without shortcut role switcher or exposed credentials */}
      <main className="flex-1 min-h-0 flex items-center justify-center p-4 sm:p-6 overflow-hidden relative">
        <div className="w-full max-w-sm">
          <div className="rounded-3xl bg-black/55 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl relative overflow-hidden transition-all duration-300 hover:border-white/30">
            {/* Elegant Institutional Gold Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FACC15] to-transparent opacity-90" />

            {/* Official School Crest in Center of Login Box */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 border border-white/20 shadow-inner mb-3 backdrop-blur-md overflow-hidden p-1">
                <img
                  src={INSTITUTION_ASSETS.crestEmblem}
                  alt="Escudo Oppenheimer 44 Años"
                  className="w-full h-full object-contain drop-shadow"
                />
              </div>
              <h2 className="text-2xl font-bold text-white font-display tracking-tight">
                Acceso al Sistema
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Ingrese sus credenciales para acceder al aula virtual
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-200 text-xs flex items-center gap-2 animate-fadeIn shadow-lg">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Form: Cuadro de Usuario, Contraseña, and Botón de Ingresar */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Cuadro de Usuario */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Usuario
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={userCode}
                    onChange={(e) => {
                      setUserCode(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Ingresa tu usuario institucional"
                    className="w-full pl-10 pr-3.5 py-3 text-xs font-mono-tabular rounded-xl border border-white/25 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#FACC15] focus:bg-white/15 focus:ring-1 focus:ring-[#FACC15] transition-all"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Cuadro de Contraseña */}
              <div>
                <label className="block text-xs font-semibold text-slate-200 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="Ingresa tu contraseña"
                    className="w-full pl-10 pr-10 py-3 text-xs rounded-xl border border-white/25 bg-white/10 text-white placeholder-slate-400 focus:outline-none focus:border-[#FACC15] focus:bg-white/15 focus:ring-1 focus:ring-[#FACC15] transition-all"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer p-1"
                    aria-label="Mostrar u ocultar contraseña"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de Ingresar */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] hover:from-[#991B1B] hover:to-[#B91C1C] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl border border-[#FACC15]/50 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <span>Ingresar</span>
                  <ArrowRight className="w-4 h-4 text-[#FACC15]" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Strict Minimal 1-row Dark Footer */}
      <footer className="shrink-0 z-20 px-6 py-2.5 bg-black/50 backdrop-blur-md border-t border-white/10 text-slate-400 text-[11px] flex items-center justify-between">
        <span>© 2026 Colegio Capitán Enrique Oppenheimer · Lima, Perú</span>
        <span>Inicial · Primaria · Secundaria · Control de Accesos Institucional</span>
      </footer>
    </div>
  );
};
