"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getYoutubeId } from "@/lib/utils";
import { Plus, Trash2, ChevronDown, ChevronRight, Eye, EyeOff } from "lucide-react";

type Lesson = { id: string; title: string; youtubeUrl: string; duration: string | null; order: number };
type Module = { id: string; title: string; order: number; lessons: Lesson[] };
type Course = { id: string; title: string; description: string | null; thumbnail: string | null; published: boolean; modules: Module[] };

export default function CourseEditor({ course: initial }: { course: Course }) {
  const router = useRouter();
  const [course, setCourse] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});

  // Inline forms state
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [addingLesson, setAddingLesson] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({ title: "", youtubeUrl: "", duration: "" });

  async function saveCourse() {
    setSaving(true);
    const res = await fetch(`/api/courses/${course.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: course.title, description: course.description, thumbnail: course.thumbnail, published: course.published }),
    });
    if (res.ok) router.refresh();
    setSaving(false);
  }

  async function addModule() {
    if (!newModuleTitle.trim()) return;
    const res = await fetch(`/api/courses/${course.id}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newModuleTitle }),
    });
    const mod = await res.json();
    setCourse(c => ({ ...c, modules: [...c.modules, { ...mod, lessons: [] }] }));
    setNewModuleTitle("");
    setAddingModule(false);
  }

  async function deleteModule(moduleId: string) {
    if (!confirm("Excluir módulo e todas as aulas?")) return;
    await fetch(`/api/courses/${course.id}/modules/${moduleId}`, { method: "DELETE" });
    setCourse(c => ({ ...c, modules: c.modules.filter(m => m.id !== moduleId) }));
  }

  async function addLesson(moduleId: string) {
    if (!newLesson.title.trim() || !newLesson.youtubeUrl.trim()) return;
    const res = await fetch(`/api/courses/${course.id}/modules/${moduleId}/lessons`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLesson),
    });
    const lesson = await res.json();
    setCourse(c => ({ ...c, modules: c.modules.map(m => m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m) }));
    setNewLesson({ title: "", youtubeUrl: "", duration: "" });
    setAddingLesson(null);
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    if (!confirm("Excluir esta aula?")) return;
    await fetch(`/api/courses/${course.id}/modules/${moduleId}/lessons/${lessonId}`, { method: "DELETE" });
    setCourse(c => ({ ...c, modules: c.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m) }));
  }

  function toggleModule(id: string) {
    setOpenModules(s => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs tracking-[3px] uppercase text-[#C9A97A] mb-1">Editando</p>
          <h1 className="text-2xl font-semibold text-white">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCourse(c => ({ ...c, published: !c.published }))}
            className="flex items-center gap-2 text-xs text-[rgba(255,255,255,0.45)] hover:text-white transition-colors px-3 py-2 rounded-lg border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)]">
            {course.published ? <><Eye size={13} className="text-emerald-400" /> Publicado</> : <><EyeOff size={13} /> Rascunho</>}
          </button>
          <Button size="sm" loading={saving} onClick={saveCourse}>Salvar</Button>
        </div>
      </div>

      {/* Dados do curso */}
      <div className="rounded-2xl border border-[rgba(201,169,122,0.12)] p-6 mb-6 grid gap-4"
        style={{ background: "rgba(15,26,61,0.4)" }}>
        <Input label="Título" value={course.title} onChange={e => setCourse(c => ({ ...c, title: e.target.value }))} />
        <div className="flex flex-col gap-1.5">
          <label className="text-xs tracking-widest uppercase text-[rgba(255,255,255,0.5)]">Descrição</label>
          <textarea value={course.description ?? ""} onChange={e => setCourse(c => ({ ...c, description: e.target.value }))}
            className="w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,122,0.2)] rounded-lg px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.25)] outline-none resize-none h-20 focus:border-[rgba(201,169,122,0.55)] transition-all" />
        </div>
        <Input label="URL da Capa" value={course.thumbnail ?? ""} onChange={e => setCourse(c => ({ ...c, thumbnail: e.target.value }))} placeholder="https://..." />
      </div>

      {/* Módulos */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-white tracking-wide">Módulos e Aulas</h2>
        <Button variant="ghost" size="sm" onClick={() => setAddingModule(true)}><Plus size={13} /> Módulo</Button>
      </div>

      {addingModule && (
        <div className="rounded-xl border border-[rgba(201,169,122,0.2)] p-4 mb-4 flex gap-3"
          style={{ background: "rgba(15,26,61,0.6)" }}>
          <input value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)}
            placeholder="Nome do módulo" onKeyDown={e => e.key === "Enter" && addModule()}
            className="flex-1 bg-transparent border-b border-[rgba(201,169,122,0.3)] text-sm text-white outline-none pb-1 placeholder-[rgba(255,255,255,0.3)]" />
          <Button size="sm" onClick={addModule}>Adicionar</Button>
          <Button size="sm" variant="ghost" onClick={() => setAddingModule(false)}>Cancelar</Button>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {course.modules.map((mod, mi) => (
          <div key={mod.id} className="rounded-2xl border border-[rgba(201,169,122,0.12)] overflow-hidden"
            style={{ background: "rgba(15,26,61,0.4)" }}>
            {/* Header do módulo */}
            <div className="flex items-center gap-3 px-5 py-4 cursor-pointer" onClick={() => toggleModule(mod.id)}>
              {openModules[mod.id] ? <ChevronDown size={14} className="text-[#C9A97A]" /> : <ChevronRight size={14} className="text-[rgba(255,255,255,0.4)]" />}
              <span className="text-xs text-[rgba(255,255,255,0.4)] w-5">{mi + 1}.</span>
              <span className="text-sm font-medium text-white flex-1">{mod.title}</span>
              <span className="text-xs text-[rgba(255,255,255,0.3)]">{mod.lessons.length} aula(s)</span>
              <button onClick={e => { e.stopPropagation(); deleteModule(mod.id); }}
                className="text-[rgba(255,255,255,0.2)] hover:text-red-400 transition-colors ml-2">
                <Trash2 size={13} />
              </button>
            </div>

            {openModules[mod.id] && (
              <div className="border-t border-[rgba(201,169,122,0.08)] px-5 py-4">
                {/* Aulas */}
                <div className="flex flex-col gap-2 mb-4">
                  {mod.lessons.map((lesson, li) => {
                    const ytId = getYoutubeId(lesson.youtubeUrl);
                    return (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all group">
                        {ytId && (
                          <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt=""
                            className="w-20 h-12 object-cover rounded-lg shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-white">{li + 1}. {lesson.title}</p>
                          {lesson.duration && <p className="text-[10px] text-[rgba(255,255,255,0.3)]">{lesson.duration}</p>}
                        </div>
                        <button onClick={() => deleteLesson(mod.id, lesson.id)}
                          className="text-[rgba(255,255,255,0.15)] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Form nova aula */}
                {addingLesson === mod.id ? (
                  <div className="rounded-xl border border-[rgba(201,169,122,0.15)] p-4 flex flex-col gap-3"
                    style={{ background: "rgba(6,13,31,0.5)" }}>
                    <Input label="Título da aula" value={newLesson.title} onChange={e => setNewLesson(l => ({ ...l, title: e.target.value }))} placeholder="Ex: Introdução ao Módulo" />
                    <Input label="Link YouTube" value={newLesson.youtubeUrl} onChange={e => setNewLesson(l => ({ ...l, youtubeUrl: e.target.value }))} placeholder="https://youtu.be/..." />
                    <Input label="Duração (opcional)" value={newLesson.duration} onChange={e => setNewLesson(l => ({ ...l, duration: e.target.value }))} placeholder="Ex: 45min" />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => addLesson(mod.id)}>Adicionar Aula</Button>
                      <Button size="sm" variant="ghost" onClick={() => setAddingLesson(null)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingLesson(mod.id)}
                    className="flex items-center gap-2 text-xs text-[rgba(201,169,122,0.5)] hover:text-[#C9A97A] transition-colors">
                    <Plus size={13} /> Adicionar aula
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
