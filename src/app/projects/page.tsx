"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Building2,
  CheckCircle2,
  MoreHorizontal,
  Trash2,
  Eye,
  Pause,
  Play,
  Clock,
  ArrowUpRight,
  Search,
  X,
  FolderKanban,
} from "lucide-react";
import { useProjectsStore, PHASES, type Project } from "@/lib/store/projects";
import { useAuthStore } from "@/lib/store/auth";
import Sidebar from "@/components/Sidebar";
import SearchInput from "@/components/SearchInput";
import ProjectFilters from "@/components/ProjectFilters";
import Pagination from "@/components/Pagination";
import { useFilters, paginate } from "@/hooks/useFilters";
import { formatRelativeTime } from "@/lib/utils";

function PhaseTracker({ project }: { project: Project }) {
  return (
    <div className="flex items-center gap-1">
      {PHASES.map((phase, index) => {
        const isCompleted = project.phaseNumber > phase.number;
        const isCurrent = project.currentPhase === phase.id;

        return (
          <div key={phase.id} className="relative group" title={phase.name}>
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                isCompleted
                  ? "bg-black text-white"
                  : isCurrent
                    ? "bg-black text-white ring-2 ring-gray-300 ring-offset-2"
                    : "bg-gray-100 text-gray-400"
              }`}
            >
              {isCompleted ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                phase.number
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg bg-gray-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
              {phase.name}
              {isCurrent && " (Actual)"}
            </div>

            {/* Connector line */}
            {index < PHASES.length - 1 && (
              <div
                className={`absolute top-1/2 left-full w-1 h-px -translate-y-1/2 ${
                  isCompleted ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ProjectCard({
  project,
  searchQuery,
}: {
  project: Project;
  searchQuery: string;
}) {
  const [showMenu, setShowMenu] = useState(false);
  const { updateProject, deleteProject } = useProjectsStore();

  const currentPhaseInfo = PHASES.find((p) => p.id === project.currentPhase);
  const progress = Math.round((project.phaseNumber / 9) * 100);

  const handleStatusToggle = () => {
    updateProject(project.id, {
      status: project.status === "active" ? "on-hold" : "active",
    });
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar este proyecto?")) {
      deleteProject(project.id);
    }
    setShowMenu(false);
  };

  // Highlight search matches
  const highlightMatch = (text: string) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="px-1 rounded bg-yellow-100 text-yellow-800">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="card-interactive group p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center text-white font-semibold text-xl">
            {project.phaseNumber}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-semibold text-lg text-black">
                {highlightMatch(project.clientName)}
              </h3>
              <span
                className={`badge ${
                  project.status === "active"
                    ? "badge-dark"
                    : project.status === "on-hold"
                      ? "bg-yellow-100 text-yellow-700"
                      : project.status === "completed"
                        ? "badge-success"
                        : "bg-gray-100 text-gray-600"
                }`}
              >
                {project.status === "active"
                  ? "Activo"
                  : project.status === "on-hold"
                    ? "Pausado"
                    : project.status === "completed"
                      ? "Completado"
                      : "Cancelado"}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate max-w-[220px]">
              {highlightMatch(project.oppName)}
            </p>
          </div>
        </div>

        {/* Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:bg-gray-100"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>

          {showMenu && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowMenu(false)}
              />
              <div className="absolute right-0 top-full mt-2 rounded-xl shadow-lg border border-gray-200 py-2 w-48 z-20 bg-white">
                <Link
                  href={`/projects/${project.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                  Ver detalles
                </Link>
                <button
                  onClick={handleStatusToggle}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 w-full text-left"
                >
                  {project.status === "active" ? (
                    <>
                      <Pause className="w-4 h-4" />
                      Pausar proyecto
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Reactivar proyecto
                    </>
                  )}
                </button>
                <hr className="my-2 border-gray-100" />
                <button
                  onClick={handleDelete}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash2 className="w-4 h-4" />
                  Eliminar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="space-y-3 mb-6">
        <div className="flex items-center justify-between text-small">
          <span className="text-gray-500">
            Fase {project.phaseNumber}: {currentPhaseInfo?.name}
          </span>
          <span className="font-medium text-black">{progress}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Phase Tracker */}
      <div className="p-4 rounded-xl bg-gray-50 mb-6">
        <PhaseTracker project={project} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-px bg-gray-200 rounded-lg overflow-hidden mb-6">
        {[
          { label: "RM", value: project.researchManager.split(" ")[0] },
          { label: "Costo", value: project.totalCost ? `$${project.totalCost}` : "-" },
          { label: "N", value: project.sampleSize || "-" },
          { label: "LOI", value: project.loi ? `${project.loi}m` : "-" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
            <p className="text-sm font-semibold text-black truncate">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <Link
        href={`/projects/${project.id}`}
        className="flex items-center justify-between pt-4 border-t border-gray-100"
      >
        <span className="flex items-center gap-2 text-small text-gray-400">
          <Clock className="w-4 h-4" />
          {formatRelativeTime(project.updatedAt)}
        </span>
        <span className="flex items-center gap-1 text-sm font-medium text-black group-hover:gap-2 transition-all">
          Ver proyecto
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </Link>
    </div>
  );
}

function ProjectsContent() {
  const router = useRouter();
  const { projects } = useProjectsStore();
  const { currentUser, isAuthenticated } = useAuthStore();
  const { filters, rawSearch, setFilter, resetFilters, hasActiveFilters } =
    useFilters();
  const [mounted, setMounted] = useState(false);

  // Auth check
  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Get unique RMs
  const researchManagers = useMemo(() => {
    const rms = new Set(projects.map((p) => p.researchManager));
    return Array.from(rms).sort();
  }, [projects]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesSearch =
          project.clientName.toLowerCase().includes(query) ||
          project.oppName.toLowerCase().includes(query) ||
          project.projectName?.toLowerCase().includes(query) ||
          project.researchManager.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== "all" && project.status !== filters.status) {
        return false;
      }

      // Phase filter
      if (filters.phase !== "all" && project.currentPhase !== filters.phase) {
        return false;
      }

      // RM filter
      if (filters.rm === "mine" && currentUser) {
        if (
          project.researchManager.toLowerCase() !==
          currentUser.name.toLowerCase()
        ) {
          return false;
        }
      } else if (filters.rm !== "all" && filters.rm !== "mine") {
        if (project.researchManager !== filters.rm) {
          return false;
        }
      }

      return true;
    });
  }, [projects, filters, currentUser]);

  // Paginate
  const paginatedData = useMemo(() => {
    return paginate(filteredProjects, filters.page, filters.perPage);
  }, [filteredProjects, filters.page, filters.perPage]);

  // Stats
  const stats = useMemo(() => {
    const myProjects = currentUser
      ? projects.filter(
          (p) =>
            p.researchManager.toLowerCase() === currentUser.name.toLowerCase()
        )
      : projects;

    return {
      total: myProjects.length,
      active: myProjects.filter((p) => p.status === "active").length,
      onHold: myProjects.filter((p) => p.status === "on-hold").length,
      completed: myProjects.filter((p) => p.status === "completed").length,
    };
  }, [projects, currentUser]);

  // Phase distribution
  const phaseDistribution = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status === "active");
    return PHASES.map((phase) => ({
      ...phase,
      count: activeProjects.filter((p) => p.currentPhase === phase.id).length,
    }));
  }, [projects]);

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main>
        {/* Header */}
        <section className="section border-b border-gray-200">
          <div className="container-wide">
            <div
              className={`flex items-end justify-between mb-12 transition-all duration-700 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div>
                <p className="text-caption text-gray-400 mb-4">Gestión</p>
                <h1 className="font-display text-display-lg text-black">
                  Proyectos
                </h1>
              </div>
              <Link href="/projects/new" className="btn-primary">
                <Plus className="w-4 h-4" />
                Nuevo Proyecto
              </Link>
            </div>

            {/* Stats Grid */}
            <div
              className={`grid grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden transition-all duration-700 delay-100 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              {[
                { number: stats.total, label: "Total" },
                { number: stats.active, label: "Activos" },
                { number: stats.onHold, label: "En Pausa" },
                { number: stats.completed, label: "Completados" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-8 text-center">
                  <p className="stat-number">{stat.number}</p>
                  <p className="text-small text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Phase Distribution */}
        <section className="section-lg bg-gray-50">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-caption text-gray-400 mb-2">Distribución</p>
                <h2 className="font-display text-display-md text-black">
                  Por Fase
                </h2>
              </div>
              {filters.phase !== "all" && (
                <button
                  onClick={() => setFilter("phase", "all")}
                  className="btn-secondary py-2 px-4 text-sm"
                >
                  <X className="w-4 h-4" />
                  Limpiar filtro
                </button>
              )}
            </div>

            <div className="grid grid-cols-9 gap-px bg-gray-200 rounded-2xl overflow-hidden">
              {phaseDistribution.map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => setFilter("phase", phase.id)}
                  className={`p-6 text-center transition-all duration-300 ${
                    filters.phase === phase.id
                      ? "bg-black text-white"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <p
                    className={`text-3xl font-display mb-2 ${
                      filters.phase === phase.id ? "text-white" : "text-black"
                    }`}
                  >
                    {phase.count}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      filters.phase === phase.id
                        ? "text-gray-300"
                        : "text-gray-500"
                    }`}
                  >
                    {phase.name.split(" ")[0]}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects List */}
        <section className="section">
          <div className="container-wide">
            {/* Search and Filters */}
            <div
              className={`flex flex-col gap-4 mb-10 transition-all duration-700 delay-200 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <SearchInput
                value={rawSearch}
                onChange={(value) => setFilter("search", value)}
                placeholder="Buscar por cliente, OPP o Research Manager..."
              />
              <ProjectFilters
                status={filters.status}
                rm={filters.rm}
                phase={filters.phase}
                researchManagers={researchManagers}
                onStatusChange={(value) => setFilter("status", value)}
                onRMChange={(value) => setFilter("rm", value)}
                onPhaseChange={(value) => setFilter("phase", value)}
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>

            {/* Results count */}
            {filteredProjects.length > 0 && (
              <p className="text-small text-gray-500 mb-8">
                <span className="font-semibold text-black">
                  {filteredProjects.length}
                </span>{" "}
                proyecto{filteredProjects.length !== 1 ? "s" : ""} encontrado
                {filteredProjects.length !== 1 ? "s" : ""}
              </p>
            )}

            {/* Projects Grid */}
            {paginatedData.items.length > 0 ? (
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  {paginatedData.items.map((project, i) => (
                    <div
                      key={project.id}
                      className={`transition-all duration-500 ${
                        mounted
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      }`}
                      style={{ transitionDelay: `${300 + i * 100}ms` }}
                    >
                      <ProjectCard
                        project={project}
                        searchQuery={filters.search}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Pagination
                    currentPage={filters.page}
                    totalPages={paginatedData.totalPages}
                    totalItems={paginatedData.totalItems}
                    startIndex={paginatedData.startIndex}
                    endIndex={paginatedData.endIndex}
                    perPage={filters.perPage}
                    onPageChange={(page) => setFilter("page", page)}
                    onPerPageChange={(perPage) => setFilter("perPage", perPage)}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  {projects.length === 0 ? (
                    <FolderKanban className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Search className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="font-display text-2xl text-black mb-2">
                  {projects.length === 0 ? "Sin proyectos" : "Sin resultados"}
                </h3>
                <p className="text-body text-gray-500 mb-8">
                  {projects.length === 0
                    ? "Crea tu primer proyecto para comenzar"
                    : "Intenta con otros filtros de búsqueda"}
                </p>
                {projects.length === 0 ? (
                  <Link href="/projects/new" className="btn-primary">
                    <Plus className="w-4 h-4" />
                    Crear Proyecto
                  </Link>
                ) : (
                  <button onClick={resetFilters} className="btn-secondary">
                    <X className="w-4 h-4" />
                    Limpiar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        </div>
      }
    >
      <ProjectsContent />
    </Suspense>
  );
}
