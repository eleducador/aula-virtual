import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Plus,
  MessageSquare,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  HelpCircle,
  Clock,
  Trash2,
  ChevronDown,
  GraduationCap,
  ArrowUp,
  Compass,
} from 'lucide-react';
import { UserProfile, CourseItem } from '../types';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  courseTag?: string;
  isStreaming?: boolean;
}

interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
  courseId?: string;
}

interface StudentAIChatGPTViewProps {
  currentUser: UserProfile;
  courses: CourseItem[];
}

const INITIAL_THREADS: ChatThread[] = [
  {
    id: 'thread-01',
    title: 'Nueva Consulta Académica',
    createdAt: 'Hoy',
    messages: [],
  },
];

export const StudentAIChatGPTView: React.FC<StudentAIChatGPTViewProps> = ({
  currentUser,
  courses,
}) => {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>(INITIAL_THREADS[0].id);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('todos');
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeThread =
    threads.find((t) => t.id === activeThreadId) || threads[0] || null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeThread?.messages, isLoading]);

  const handleCreateNewThread = () => {
    const newThreadId = `thread-${Date.now()}`;
    const newThread: ChatThread = {
      id: newThreadId,
      title: 'Nueva Consulta Académica',
      createdAt: 'Ahora mismo',
      courseId: selectedCourseFilter !== 'todos' ? selectedCourseFilter : undefined,
      messages: [],
    };
    setThreads([newThread, ...threads]);
    setActiveThreadId(newThreadId);
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 100);
  };

  const handleDeleteThread = (threadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = threads.filter((t) => t.id !== threadId);
    setThreads(filtered);
    if (activeThreadId === threadId && filtered.length > 0) {
      setActiveThreadId(filtered[0].id);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    setInputMessage('');

    const activeCourse = courses.find((c) => c.id === selectedCourseFilter);
    const userMsg: ChatMessage = {
      id: `usr-msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      courseTag: activeCourse?.name || 'Consulta General',
    };

    // Update thread title if first message
    const currentMsgs = activeThread ? activeThread.messages : [];
    const isFirstMessage = currentMsgs.length === 0;
    const computedTitle = isFirstMessage
      ? query.slice(0, 36) + (query.length > 36 ? '...' : '')
      : activeThread?.title || 'Consulta';

    const updatedMessages = [...currentMsgs, userMsg];

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              title: isFirstMessage ? computedTitle : t.title,
              messages: updatedMessages,
            }
          : t
      )
    );

    setIsLoading(true);

    try {
      const historyPayload = currentMsgs.slice(-4).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        text: m.text,
      }));

      const res = await fetch('/api/student-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: query,
          history: historyPayload,
          studentName: currentUser.name,
          courseContext: activeCourse?.name,
          gradeLevel: '4.° de Secundaria',
        }),
      });

      const data = await res.json();
      const assistantText =
        data.reply ||
        'Disculpa, no pude procesar la respuesta en este momento. Por favor intenta reformular tu pregunta.';

      const botMsg: ChatMessage = {
        id: `bot-msg-${Date.now()}`,
        sender: 'assistant',
        text: assistantText,
        timestamp: new Date().toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        courseTag: activeCourse?.name || 'Tutor Oppenheimer',
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: [...t.messages, botMsg] }
            : t
        )
      );
    } catch (err) {
      console.warn('Backend chat offline, using pedagogical tutor fallback:', err);
      const qLower = query.toLowerCase();
      let fallbackText = '';

      if (qLower.includes('pitagora') || qLower.includes('triangulo') || qLower.includes('hipotenusa')) {
        fallbackText = `### 📐 Teorema de Pitágoras — Fundamento y Aplicación Práctica

¡Hola! El **Teorema de Pitágoras** establece que en todo **triángulo rectángulo**:

> **$a^2 + b^2 = c^2$**

* Donde **$a$** y **$b$** son los catetos perpendiculares.
* Y **$c$** es la hipotenusa (el lado mayor opuesto a los 90°).

#### Ejemplo de Aplicación en la Vida Real:
Si colocamos una escalera con base a **3 metros** de la pared y altura de **4 metros**:
1. $3^2 + 4^2 = 9 + 16 = 25$
2. $\\sqrt{25} = 5$ metros de longitud.

*Recuerda la terna pitagórica clásica:* **3 - 4 - 5** y sus múltiplos (**6 - 8 - 10**). ¡Aparece en la mayoría de preguntas de admisión!`;
      } else if (qLower.includes('enlace') || qLower.includes('quimic') || qLower.includes('covalent')) {
        fallbackText = `### 🧪 Enlaces Químicos: Iónico vs Covalente

1. **Enlace Iónico:**
   * Ocurre entre un **Metal + No Metal** (ej. $\\text{NaCl}$, $\\text{MgO}$).
   * Hay **transferencia neta** de electrones con formación de iones.
   * Diferencia de electronegatividad: $\\Delta EN \\ge 1.7$.

2. **Enlace Covalente:**
   * Ocurre entre **No Metales** (ej. $\\text{H}_2\\text{O}$, $\\text{CO}_2$).
   * Se **comparten pares de electrones**.
   * Diferencia de electronegatividad: $\\Delta EN < 1.7$.`;
      } else if (qLower.includes('ensayo') || qLower.includes('redac') || qLower.includes('comunic')) {
        fallbackText = `### 📚 Estructura de un Ensayo Académico

1. **Introducción (15%):**
   * Contextualización del tema.
   * **Tesis clara:** Tu postura argumentativa central.
2. **Desarrollo Argumentativo (70%):**
   * Párrafos de argumento respaldados con evidencias, citas textuales y contraargumentación.
3. **Conclusión (15%):**
   * Síntesis de las ideas clave y reflexión final sin introducir datos nuevos.`;
      } else {
        fallbackText = `### 🎓 Tutor Académico Oppenheimer

¡Excelente pregunta sobre tus estudios!

Para abordar este tema con metodología de alto rendimiento:
1. **Identifica los conceptos clave y fórmulas involucradas.**
2. **Aplica un ejemplo modelo paso a paso** verificando cada operación.
3. **Comprueba las unidades y la coherencia del resultado.**

*¿Deseas profundizar en algún paso específico o ver un ejercicio resuelto tipo examen?*`;
      }

      const botMsg: ChatMessage = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'assistant',
        text: fallbackText,
        timestamp: new Date().toLocaleTimeString('es-PE', {
          hour: '2-digit',
          minute: '2-digit',
        }),
        courseTag: activeCourse?.name || 'Tutor Oppenheimer',
      };

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? { ...t, messages: [...t.messages, botMsg] }
            : t
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const promptSuggestions = [
    {
      title: 'Teorema de Pitágoras',
      prompt: 'Explícame el Teorema de Pitágoras con un ejemplo de la vida real paso a paso.',
      icon: '📐',
      course: 'Matemática',
    },
    {
      title: 'Enlaces Químicos',
      prompt: '¿Cuáles son las diferencias clave entre un enlace iónico y un enlace covalente?',
      icon: '🧪',
      course: 'Ciencias',
    },
    {
      title: 'Redacción de Ensayos',
      prompt: '¿Cómo estructurar la introducción y los argumentos de un ensayo escolar con citas?',
      icon: '📚',
      course: 'Comunicación',
    },
    {
      title: '3 Preguntas de Examen',
      prompt: 'Dame 3 ejercicios de práctica tipo examen de 4.° de secundaria con soluciones explicadas.',
      icon: '📝',
      course: 'Evaluaciones',
    },
  ];

  return (
    <div className="h-[calc(100vh-5rem)] rounded-2xl bg-black/75 backdrop-blur-2xl border border-white/15 shadow-2xl flex overflow-hidden text-slate-100">
      {/* ChatGPT-Style Left History Sidebar */}
      <div
        className={`${
          showSidebar ? 'w-64 sm:w-72' : 'w-0'
        } transition-all duration-300 shrink-0 bg-black/60 border-r border-white/10 flex flex-col justify-between overflow-hidden z-10`}
      >
        <div className="p-3.5 space-y-3 flex-1 flex flex-col min-h-0">
          {/* New Chat Button */}
          <button
            type="button"
            onClick={handleCreateNewThread}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] hover:from-[#991B1B] hover:to-[#B91C1C] border border-[#FACC15]/40 text-white font-bold text-xs shadow-lg cursor-pointer transition-all"
          >
            <div className="flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#FACC15]" />
              <span>Nueva Consulta</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-[#FEF08A]" />
          </button>

          {/* Subject Filter inside History */}
          <div className="pt-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 block">
              Materia de Consulta:
            </label>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full px-2.5 py-1.5 text-[11px] rounded-lg bg-slate-900 border border-white/15 text-slate-200 focus:outline-none focus:border-[#FACC15]"
            >
              <option value="todos">Todas las Asignaturas</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Thread List */}
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 mt-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
              Consultas Recientes
            </p>
            {threads.map((thread) => {
              const isActive = thread.id === activeThreadId;
              return (
                <div
                  key={thread.id}
                  onClick={() => setActiveThreadId(thread.id)}
                  className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                    isActive
                      ? 'bg-white/10 text-white border border-[#FACC15]/30 shadow-md font-semibold'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-[#FACC15]' : 'text-slate-400'
                      }`}
                    />
                    <div className="truncate text-left">
                      <p className="truncate text-xs">{thread.title}</p>
                      <p className="text-[10px] text-slate-400">{thread.createdAt}</p>
                    </div>
                  </div>

                  {threads.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => handleDeleteThread(thread.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-400 rounded transition-all"
                      title="Eliminar consulta"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer with Student ID */}
        <div className="p-3 border-t border-white/10 bg-black/40">
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-lg bg-[#7F1D1D] border border-[#FACC15]/40 flex items-center justify-center font-bold text-xs text-[#FEF08A]">
              {currentUser.avatarInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </p>
              <p className="text-[10px] text-slate-400 font-mono-tabular">
                4.° Secundaria · {currentUser.code}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ChatGPT-Style Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header Bar */}
        <div className="h-14 shrink-0 px-4 sm:px-6 border-b border-white/10 flex items-center justify-between bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowSidebar(!showSidebar)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 cursor-pointer"
              title={showSidebar ? 'Ocultar historial' : 'Ver historial'}
            >
              <MessageSquare className="w-4 h-4 text-[#FACC15]" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7F1D1D] to-[#991B1B] border border-[#FACC15]/60 flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-[#FACC15]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white font-display">
                    Tutor IA Oppenheimer
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#7F1D1D]/80 border border-[#FACC15]/40 text-[#FEF08A]">
                    Gemini 3.8 Flash
                  </span>
                </div>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>En línea · Tutoría Pedagógica Activa</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCreateNewThread}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-medium cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nueva Consulta</span>
            </button>
          </div>
        </div>

        {/* Message Viewport */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          {(!activeThread || activeThread.messages.length === 0) ? (
            /* Empty State / Welcome Screen like ChatGPT */
            <div className="max-w-2xl mx-auto py-8 sm:py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#7F1D1D] to-[#B91C1C] border-2 border-[#FACC15]/60 flex items-center justify-center mx-auto shadow-2xl">
                <Sparkles className="w-8 h-8 text-[#FACC15]" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                  ¿Qué deseas aprender hoy?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-lg mx-auto">
                  Soy tu tutor académico inteligente del Colegio Capitán Enrique Oppenheimer. Puedes hacerme preguntas sobre tus tareas, pedirme explicaciones paso a paso o generar ejercicios de práctica.
                </p>
              </div>

              {/* Prompt Suggestion Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2">
                {promptSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(item.prompt)}
                    className="p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FACC15]/40 transition-all text-left group cursor-pointer shadow-md"
                  >
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                      <span className="font-semibold text-[#FEF08A]">{item.course}</span>
                      <span className="text-base">{item.icon}</span>
                    </div>
                    <div className="text-xs font-bold text-white group-hover:text-[#FACC15] transition-colors">
                      {item.title}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                      {item.prompt}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Active Message Flow */
            <div className="max-w-3xl mx-auto space-y-6">
              {activeThread.messages.map((msg) => {
                const isUser = msg.sender === 'user';
                return (
                  <div
                    key={msg.id}
                    className={`flex gap-3 sm:gap-4 ${
                      isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7F1D1D] to-[#991B1B] border border-[#FACC15]/60 flex items-center justify-center shrink-0 shadow-md mt-1">
                        <Sparkles className="w-4 h-4 text-[#FACC15]" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 sm:p-5 shadow-lg ${
                        isUser
                          ? 'bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] text-white border border-[#FACC15]/40 rounded-tr-none'
                          : 'bg-black/65 backdrop-blur-xl border border-white/15 text-slate-100 rounded-tl-none'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3 text-[10px] text-slate-300 pb-2 mb-2 border-b border-white/10">
                        <div className="flex items-center gap-1.5 font-bold">
                          {isUser ? (
                            <>
                              <User className="w-3 h-3 text-[#FACC15]" />
                              <span className="text-[#FEF08A]">{currentUser.name}</span>
                            </>
                          ) : (
                            <>
                              <Bot className="w-3 h-3 text-[#FACC15]" />
                              <span className="text-[#FEF08A]">Tutor IA Oppenheimer</span>
                            </>
                          )}
                          {msg.courseTag && (
                            <span className="opacity-75">· {msg.courseTag}</span>
                          )}
                        </div>
                        <span className="font-mono-tabular text-[10px] opacity-75">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Content Body formatted */}
                      <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line font-sans space-y-2">
                        {msg.text}
                      </div>

                      {/* Assistant Bottom Action Bar */}
                      {!isUser && (
                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.text)}
                            className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-[#FEF08A] cursor-pointer transition-colors"
                          >
                            {copiedMsgId === msg.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copiado al portapapeles</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar respuesta</span>
                              </>
                            )}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleSendMessage('¿Podrías darme un ejemplo práctico adicional sobre esto?')
                              }
                              className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 cursor-pointer"
                            >
                              + Otro ejemplo
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleSendMessage('¿Cómo podría venir esto en una pregunta de examen?')
                              }
                              className="text-[10px] text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5 border border-white/10 cursor-pointer"
                            >
                              Ver tipo examen
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {isUser && (
                      <div className="w-8 h-8 rounded-xl bg-[#7F1D1D] border border-[#FACC15]/50 flex items-center justify-center font-bold text-xs text-[#FEF08A] shrink-0 mt-1 shadow-md">
                        {currentUser.avatarInitials}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Loading Thinking Indicator */}
              {isLoading && (
                <div className="flex gap-3 sm:gap-4 justify-start">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#7F1D1D] to-[#991B1B] border border-[#FACC15]/60 flex items-center justify-center shrink-0 shadow-md mt-1 animate-pulse">
                    <Sparkles className="w-4 h-4 text-[#FACC15]" />
                  </div>
                  <div className="rounded-2xl p-4 bg-black/65 backdrop-blur-xl border border-white/15 text-slate-200 rounded-tl-none flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#FACC15] animate-ping" />
                      <span className="w-2 h-2 rounded-full bg-[#FEF08A] animate-pulse" />
                      <span className="w-2 h-2 rounded-full bg-white/70" />
                    </div>
                    <span className="text-xs text-[#FEF08A] font-medium">
                      El Tutor IA Oppenheimer está analizando tu consulta...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* ChatGPT Bottom Floating Input Container */}
        <div className="p-4 sm:p-5 bg-gradient-to-t from-black/90 via-black/70 to-transparent shrink-0">
          <div className="max-w-3xl mx-auto space-y-2">
            <div className="relative rounded-2xl bg-black/80 backdrop-blur-2xl border border-white/20 focus-within:border-[#FACC15] shadow-2xl transition-all p-2 flex items-end gap-2">
              <textarea
                ref={textareaRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Escribe tu consulta escolar al tutor IA... (Ej. Explícame la fotosíntesis o resuelve este problema)"
                rows={1}
                className="w-full max-h-36 resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!inputMessage.trim() || isLoading}
                className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#7F1D1D] to-[#991B1B] hover:from-[#991B1B] hover:to-[#B91C1C] disabled:opacity-40 disabled:hover:from-[#7F1D1D] text-white flex items-center justify-center shrink-0 border border-[#FACC15]/40 shadow-md cursor-pointer transition-all"
                title="Enviar mensaje (Enter)"
              >
                <ArrowUp className="w-4 h-4 text-[#FACC15]" />
              </button>
            </div>

            <p className="text-[10px] text-center text-slate-400">
              Tutor IA del <strong className="text-slate-300">Colegio Capitán Enrique Oppenheimer</strong>. Diseñado para apoyar tu avance escolar con pedagogía y rigor.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
