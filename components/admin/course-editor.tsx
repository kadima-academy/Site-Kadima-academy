"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getYoutubeId } from "@/lib/utils";
import { Plus, Trash2, ChevronDown, ChevronRight, Eye, EyeOff, Pencil, X, Check } from "lucide-react";

type Lesson = { id: string; title: string; youtubeUrl: string; duration: string | null; content: string | null; order: number };
type Module = { id: string; title: string; thumbnail: string | null; order: number; lessons: Lesson[] };
type Course = { id: string; title: string; description: string | null; thumbnail: string | null; published: boolean; modules: Module[] };

const textareaClass = "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(201,169,122,0.18)] rounded-xl px-4 py-3 text-sm text-white placeholder-[rgba(255,255,255,0.2)] outline-none resize-none focus:border-[rgba(201,169,122,0.5)] focus:bg-[rgba(255,255,255,0.06)] transition-all";
const labelClass = "text-[10px] tracking-[3px] uppercase text-[rgba(201,169,122,0.7)] font-medium mb-2 block";

export default function CourseEditor({ course: initial }: { course: Course }) {
  const router = useRouter();
  const [course, setCourse] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleThumbnail, setNewModuleThumbnail] = useState("");
  const [addingModule, setAddingModule] = useState(false);
  const [addingLesson, setAddingLesson] = useState<string | null>(null);
  const [newLesson, setNewLesson] = useState({ title: "", youtubeUrl: "", duration: "", content: "" });
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [editLesson, setEditLesson] = useState({ title: "", youtubeUrl: "", duration: "", content: "" });
  const [editSaving, setEditSaving] = useState(false);

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
      body: JSON.stringify({ title: newModuleTitle, thumbnail: newModuleThumbnail || undefined }),
    });
    const mod = await res.json();
    setCourse(c => ({ ...c, modules: [...c.modules, { ...mod, lessons: [] }] }));
    setNewModuleTitle("");
    setNewModuleThumbnail("");
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
    setNewLesson({ title: "", youtubeUrl: "", duration: "", content: "" });
    setAddingLesson(null);
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    if (!confirm("Excluir esta aula?")) return;
    await fetch(`/api/courses/${course.id}/modules/${moduleId}/lessons/${lessonId}`, { method: "DELETE" });
    setCourse(c => ({ ...c, modules: c.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) } : m) }));
  }

  function startEditLesson(lesson: Lesson) {
    setEditingLesson(lesson.id);
    setEditLesson({ title: lesson.title, youtubeUrl: lesson.youtubeUrl, duration: lesson.duration ?? "", content: lesson.content ?? "" });
  }

  async function saveEditLesson(moduleId: string, lessonId: string) {
    setEditSaving(true);
    const res = await fetch(`/api/courses/${course.id}/modules/${moduleId}/lessons/${lessonId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editLesson),
    });
    const updated = await res.json();
    setCourse(c => ({ ...c, modules: c.modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.map(l => l.id === lessonId ? { ...l, ...updated } : l) } : m) }));
    setEditingLesson(null);
    setEditSaving(false);
  }

  function toggleModule(id: string) {
    setOpenModules(s => ({ ...s, [id]: !s[id] }));
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-[11px] tracking-[5px] uppercase text-[#C9A97A] mb-2 font-medium">Editando Curso</p>
          <h1 className="text-3xl font-bold text-white">{course.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setCourse(c => ({ ...c, published: !c.published }))}
            className="flex items-center gap-2 text-xs px-4 py-2 rounded-xl border transition-all"
            style={course.published
              ? { color: "#6ee7b7", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }
              : { color: "rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
            {course.published ? <><Eye size={13} /> Publicado</> : <><EyeOff size={13} /> Rascunho</>}
          </button>
          <Button size="sm" loading={saving} onClick={saveCourse}>Salvar</Button>
        </div>
      </div>

      {/* Dados do curso */}
      <div className="rounded-2xl p-6 mb-6 grid gap-4" style={{ background: "rgba(15,26,61,0.4)", border: "1px solid rgba(201,169,122,0.1)" }}>
        <Input label="Título" value={course.title} onChange={e => setCourse(c => ({ ...c, title: e.target.value }))} />
        <div>
          <label className={labelClass}>Descrição</label>
          <textarea value={course.description ?? ""} onChange={e => setCourse(c => ({ ...c, description: e.target.value }))}
            className={textareaClass} rows={3} placeholder="Descreva o curso..." />
        </div>
        <Input label="URL da Capa" value={course.thumbnail ?? ""} onChange={e => setCourse(c => ({ ...c, thumbnail: e.target.value }))} placeholder="https://..." />
      </div>

      {/* Módulos */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-white">Módulos e Aulas</h2>
        <Button variant="ghost" size="sm" onClick={() => setAddingModule(true)}><Plus size={13} /> Módulo</Button>
      </div>

      {addingModule && (
        <div className="rounded-xl p-4 mb-4 flex flex-col gap-3" style={{ background: "rgba(15,26,61,0.6)", border: "1px solid rgba(201,169,122,0.2)" }}>
          <input value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)}
            placeholder="Nome do módulo *" onKeyDown={e => e.key === "Enter" && addModule()}
            className="w-full bg-transparent border-b border-[rgba(201,169,122,0.3)] text-sm text-white outline-none pb-1 placeholder-[rgba(255,255,255,0.3)]" />
          <input value={newModuleThumbnail} onChange={e => setNewModuleThumbnail(e.target.value)}
            placeholder="URL da capa do módulo (800×1000px recomendado)"
            className="w-full bg-transparent border-b border-[rgba(201,169,122,0.15)] text-sm text-white outline-none pb-1 placeholder-[rgba(255,255,255,0.2)]" />
          <div className="flex gap-2">
            <Button size="sm" onClick={addModule}>Adicionar</Button>
            <Button size="sm" variant="ghost" onClick={() => { setAddingModule(false); setNewModuleThumbnail(""); }}>Cancelar</Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {course.modules.map((mod, mi) => (
          <div key={mod.id} className="rounded-2xl overflow-hidden" style={{ background: "rgba(15,26,61,0.4)", border: "1px solid rgba(201,169,122,0.1)" }}>
            <div className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors" onClick={() => toggleModule(mod.id)}>
              {openModules[mod.id]
                ? <ChevronDown size={14} className="text-[#C9A97A]" />
                : <ChevronRight size={14} className="text-[rgba(255,255,255,0.4)]" />}
              {mod.thumbnail
                ? <img src={mod.thumbnail} alt="" className="w-8 h-10 object-contain rounded shrink-0" style={{ border: "1px solid rgba(201,169,122,0.15)" }} />
                : <span className="text-xs text-[rgba(201,169,122,0.5)] w-5 font-bold shrink-0">{mi + 1}.</span>}
              <span className="text-sm font-semibold text-white flex-1">{mod.title}</span>
              <span className="text-xs text-[rgba(255,255,255,0.3)]">{mod.lessons.length} aula(s)</span>
              <button onClick={e => { e.stopPropagation(); deleteModule(mod.id); }}
                className="text-[rgba(255,255,255,0.2)] hover:text-red-400 transition-colors ml-2 p-1">
                <Trash2 size={13} />
              </button>
            </div>

            {openModules[mod.id] && (
              <div style={{ borderTop: "1px solid rgba(201,169,122,0.07)" }} className="px-5 py-4">
                {/* Thumbnail do módulo */}
                <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid rgba(201,169,122,0.07)" }}>
                  <input
                    defaultValue={mod.thumbnail ?? ""}
                    placeholder="URL da capa do módulo (800×1000px)"
                    onBlur={async e => {
                      const val = e.target.value.trim();
                      if (val === (mod.thumbnail ?? "")) return;
                      await fetch(`/api/courses/${course.id}/modules/${mod.id}`, {
                        method: "PUT", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ thumbnail: val || null }),
                      });
                      setCourse(c => ({ ...c, modules: c.modules.map(m => m.id === mod.id ? { ...m, thumbnail: val || null } : m) }));
                    }}
                    className="flex-1 bg-transparent border-b border-[rgba(201,169,122,0.2)] text-xs text-white outline-none pb-1 placeholder-[rgba(255,255,255,0.25)]"
                  />
                  <span className="text-[10px] text-[rgba(201,169,122,0.5)] shrink-0">Capa do módulo</span>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  {mod.lessons.map((lesson, li) => {
                    const ytId = getYoutubeId(lesson.youtubeUrl);
                    const isEditing = editingLesson === lesson.id;

                    if (isEditing) {
                      return (
                        <div key={lesson.id} className="rounded-xl p-4 flex flex-col gap-3"
                          style={{ background: "rgba(6,13,31,0.6)", border: "1px solid rgba(201,169,122,0.2)" }}>
                          <Input label="Título" value={editLesson.title} onChange={e => setEditLesson(l => ({ ...l, title: e.target.value }))} />
                          <Input label="Link YouTube" value={editLesson.youtubeUrl} onChange={e => setEditLesson(l => ({ ...l, youtubeUrl: e.target.value }))} />
                          <Input label="Duração (opcional)" value={editLesson.duration} onChange={e => setEditLesson(l => ({ ...l, duration: e.target.value }))} placeholder="Ex: 45min" />
                          <div>
                            <label className={labelClass}>Conteúdo HTML da Aula (apostila)</label>
                            <textarea
                              value={editLesson.content}
                              onChange={e => setEditLesson(l => ({ ...l, content: e.target.value }))}
                              className={textareaClass}
                              rows={10}
                              placeholder={"Cole aqui o código HTML da apostila...\n\nExemplo:\n<h2>Introdução</h2>\n<p>Conteúdo da aula...</p>"}
                            />
                            <p className="text-[10px] text-[rgba(255,255,255,0.25)] mt-1.5">Aceita HTML completo — tags, estilos inline, tabelas, listas, etc.</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" loading={editSaving} onClick={() => saveEditLesson(mod.id, lesson.id)}><Check size={12} /> Salvar</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditingLesson(null)}><X size={12} /> Cancelar</Button>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl group transition-all"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid transparent" }}>
                        {ytId && (
                          <img src={`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`} alt=""
                            className="w-20 h-12 object-cover rounded-lg shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-white">{li + 1}. {lesson.title}</p>
                          <div className="flex items-center gap-3 mt-0.5">
                            {lesson.duration && <p className="text-[11px] text-[rgba(255,255,255,0.3)]">{lesson.duration}</p>}
                            {lesson.content && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                                style={{ background: "rgba(201,169,122,0.1)", color: "#C9A97A", border: "1px solid rgba(201,169,122,0.15)" }}>
                                HTML
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startEditLesson(lesson)}
                            className="p-1.5 rounded-lg text-[rgba(255,255,255,0.3)] hover:text-[#C9A97A] hover:bg-[rgba(201,169,122,0.08)] transition-all">
                            <Pencil size={12} />
                          </button>
                          <button onClick={() => deleteLesson(mod.id, lesson.id)}
                            className="p-1.5 rounded-lg text-[rgba(255,255,255,0.3)] hover:text-red-400 hover:bg-red-900/20 transition-all">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {addingLesson === mod.id ? (
                  <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "rgba(6,13,31,0.5)", border: "1px solid rgba(201,169,122,0.15)" }}>
                    <Input label="Título da aula" value={newLesson.title} onChange={e => setNewLesson(l => ({ ...l, title: e.target.value }))} placeholder="Ex: Introdução ao Módulo" />
                    <Input label="Link YouTube" value={newLesson.youtubeUrl} onChange={e => setNewLesson(l => ({ ...l, youtubeUrl: e.target.value }))} placeholder="https://youtu.be/..." />
                    <Input label="Duração (opcional)" value={newLesson.duration} onChange={e => setNewLesson(l => ({ ...l, duration: e.target.value }))} placeholder="Ex: 45min" />
                    <div>
                      <label className={labelClass}>Conteúdo HTML da Aula (apostila)</label>
                      <textarea
                        value={newLesson.content}
                        onChange={e => setNewLesson(l => ({ ...l, content: e.target.value }))}
                        className={textareaClass}
                        rows={8}
                        placeholder={"Cole aqui o código HTML da apostila...\n\nExemplo:\n<h2>Introdução</h2>\n<p>Conteúdo da aula...</p>"}
                      />
                      <p className="text-[10px] text-[rgba(255,255,255,0.25)] mt-1.5">Aceita HTML completo — tags, estilos inline, tabelas, listas, etc.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => addLesson(mod.id)}>Adicionar Aula</Button>
                      <Button size="sm" variant="ghost" onClick={() => setAddingLesson(null)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAddingLesson(mod.id)}
                    className="flex items-center gap-2 text-xs text-[rgba(201,169,122,0.5)] hover:text-[#C9A97A] transition-colors py-1">
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
