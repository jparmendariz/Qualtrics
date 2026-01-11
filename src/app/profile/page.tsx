"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Calendar,
  TrendingUp,
  FolderKanban,
  CheckCircle2,
  Clock,
  Edit3,
  Save,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuthStore, getInitials } from "@/lib/store/auth";
import { useProjectsStore, PHASES } from "@/lib/store/projects";
import Sidebar from "@/components/Sidebar";
import { formatRelativeTime } from "@/lib/utils";

const PHASE_COLORS = [
  "bg-blue-500",
  "bg-cyan-500",
  "bg-teal-500",
  "bg-green-500",
  "bg-emerald-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-purple-500",
];

export default function ProfilePage() {
  const router = useRouter();
  const { currentUser, isAuthenticated, updateProfile } = useAuthStore();
  const { projects } = useProjectsStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTeam, setEditTeam] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditTeam(currentUser.team || "");
    }
  }, [currentUser]);

  if (!currentUser) return null;

  // Calculate user stats
  const myProjects = projects.filter(
    (p) => p.researchManager.toLowerCase() === currentUser.name.toLowerCase()
  );
  const activeProjects = myProjects.filter((p) => p.status === "active");
  const completedProjects = myProjects.filter((p) => p.status === "completed");
  const onHoldProjects = myProjects.filter((p) => p.status === "on-hold");

  // Phase stats
  const phaseStats = PHASES.map((phase, index) => ({
    ...phase,
    count: myProjects.filter((p) => p.currentPhase === phase.id).length,
    color: PHASE_COLORS[index],
  }));

  // Recent activity
  const recentActivity = myProjects
    .flatMap((p) =>
      p.completedActions.map((action) => ({
        ...action,
        projectName: p.clientName,
        projectId: p.id,
      }))
    )
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .slice(0, 10);

  const handleSave = () => {
    updateProfile({
      name: editName,
      team: editTeam || undefined,
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <main className="ml-64 p-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
          {/* Cover */}
          <div className="h-32 bg-gradient-to-r from-primary via-primary-dark to-secondary" />

          {/* Profile Info */}
          <div className="px-8 pb-8">
            <div className="flex items-end gap-6 -mt-12">
              <div
                className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${currentUser.avatar} flex items-center justify-center border-4 border-white shadow-lg`}
              >
                <span className="text-white font-bold text-3xl">
                  {getInitials(currentUser.name)}
                </span>
              </div>

              <div className="flex-1 pt-14">
                <div className="flex items-center justify-between">
                  <div>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="text-2xl font-bold text-secondary border-b-2 border-primary focus:outline-none bg-transparent"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-secondary">
                        {currentUser.name}
                      </h1>
                    )}
                    <p className="text-muted-foreground flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4" />
                      {currentUser.email}
                    </p>
                  </div>

                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="p-2 text-muted-foreground hover:text-secondary rounded-lg hover:bg-muted transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-secondary rounded-lg hover:bg-muted transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Editar
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-6 mt-4">
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        value={editTeam}
                        onChange={(e) => setEditTeam(e.target.value)}
                        placeholder="Equipo (opcional)"
                        className="text-sm border-b border-border focus:border-primary focus:outline-none bg-transparent"
                      />
                    </div>
                  ) : (
                    currentUser.team && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4" />
                        {currentUser.team}
                      </div>
                    )
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    Miembro desde{" "}
                    {new Date(currentUser.joinedAt).toLocaleDateString("es-MX", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold text-secondary">{myProjects.length}</p>
                <p className="text-sm text-muted-foreground">Total proyectos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-3xl font-bold text-accent">{activeProjects.length}</p>
                <p className="text-sm text-muted-foreground">Activos</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-yellow-600">{onHoldProjects.length}</p>
                <p className="text-sm text-muted-foreground">En pausa</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">{completedProjects.length}</p>
                <p className="text-sm text-muted-foreground">Completados</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phase Distribution */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-border shadow-sm">
            <div className="p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-secondary">
                Mis Proyectos por Fase
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4">
                {phaseStats.map((phase) => (
                  <div
                    key={phase.id}
                    className="text-center p-4 rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-14 h-14 ${phase.color} rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-3`}
                    >
                      {phase.count}
                    </div>
                    <p className="text-sm font-medium text-secondary">{phase.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-border shadow-sm">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-secondary">
                Actividad Reciente
              </h2>
            </div>
            <div className="max-h-[400px] overflow-y-auto">
              {recentActivity.length > 0 ? (
                <div className="divide-y divide-border">
                  {recentActivity.map((activity) => (
                    <Link
                      key={activity.id}
                      href={`/projects/${activity.projectId}`}
                      className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-secondary">{activity.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {activity.projectName} •{" "}
                          {formatRelativeTime(activity.completedAt)}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground text-sm">
                    No hay actividad reciente
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* My Projects List */}
        <div className="mt-8 bg-white rounded-2xl border border-border shadow-sm">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="text-lg font-semibold text-secondary">
              Todos Mis Proyectos
            </h2>
            <Link
              href="/projects"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver en tracker
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {myProjects.length > 0 ? (
            <div className="divide-y divide-border">
              {myProjects.map((project) => {
                const phaseIndex = PHASES.findIndex((p) => p.id === project.currentPhase);
                const phase = PHASES[phaseIndex];
                return (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${PHASE_COLORS[phaseIndex]} flex items-center justify-center text-white font-semibold`}
                    >
                      {project.phaseNumber}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-secondary truncate">
                        {project.clientName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {project.oppName}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          project.status === "active"
                            ? "bg-accent/10 text-accent"
                            : project.status === "on-hold"
                            ? "bg-yellow-100 text-yellow-700"
                            : project.status === "completed"
                            ? "bg-green-100 text-green-700"
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
                      <p className="text-xs text-muted-foreground mt-1">
                        {phase?.name}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-muted-foreground mb-4">
                Aun no tienes proyectos asignados
              </p>
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Crear Proyecto
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
