"use client";

import { X } from "lucide-react";
import { PHASES } from "@/lib/store/projects";

interface ProjectFiltersProps {
  status: string;
  rm: string;
  phase: string;
  researchManagers: string[];
  onStatusChange: (value: string) => void;
  onRMChange: (value: string) => void;
  onPhaseChange: (value: string) => void;
  onReset?: () => void;
  hasActiveFilters?: boolean;
}

export default function ProjectFilters({
  status,
  rm,
  phase,
  researchManagers,
  onStatusChange,
  onRMChange,
  onPhaseChange,
  onReset,
  hasActiveFilters,
}: ProjectFiltersProps) {
  const selectClass =
    "px-5 py-3.5 rounded-xl bg-gray-50 border-0 hover:bg-gray-100 focus:bg-white focus:ring-2 focus:ring-black/5 transition-all text-sm font-medium text-gray-700 cursor-pointer min-w-[160px]";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* RM Filter */}
      <select
        value={rm}
        onChange={(e) => onRMChange(e.target.value)}
        className={selectClass}
      >
        <option value="mine">Mis proyectos</option>
        <option value="all">Todos los RMs</option>
        {researchManagers.map((rmName) => (
          <option key={rmName} value={rmName}>
            {rmName}
          </option>
        ))}
      </select>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        className={selectClass}
      >
        <option value="all">Todos los estados</option>
        <option value="active">Activos</option>
        <option value="on-hold">En pausa</option>
        <option value="completed">Completados</option>
      </select>

      {/* Phase Filter */}
      <select
        value={phase}
        onChange={(e) => onPhaseChange(e.target.value)}
        className={selectClass}
        style={{ minWidth: "200px" }}
      >
        <option value="all">Todas las fases</option>
        {PHASES.map((p) => (
          <option key={p.id} value={p.id}>
            {p.number}. {p.name}
          </option>
        ))}
      </select>

      {/* Reset Button */}
      {hasActiveFilters && onReset && (
        <button
          onClick={onReset}
          className="flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
        >
          <X className="w-4 h-4" />
          Limpiar
        </button>
      )}
    </div>
  );
}
