"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, Clock, Users } from "lucide-react";
import { useProjectsStore, PHASES, getIncludedPhases, type Project } from "@/lib/store/projects";
import { useAuthStore } from "@/lib/store/auth";
import Sidebar from "@/components/Sidebar";
import Breadcrumbs from "@/components/Breadcrumbs";
import PhaseNavigation from "@/components/PhaseNavigation";
import { formatRelativeTime } from "@/lib/utils";

export default function ProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { getProject } = useProjectsStore();
  const { isAuthenticated } = useAuthStore();
  const [project, setProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    const p = getProject(projectId);
    if (p) {
      setProject(p);
    } else {
      router.push("/projects");
    }
  }, [projectId, getProject, isAuthenticated, router]);

  // Refresh project data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const p = getProject(projectId);
      if (p) {
        setProject(p);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [projectId, getProject]);

  if (!mounted || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const includedPhaseIds = getIncludedPhases(project);
  const includedPhases = PHASES.filter((p) => includedPhaseIds.includes(p.id));
  const currentPhaseInfo = PHASES.find((p) => p.id === project.currentPhase);
  const progress = Math.round((project.phaseNumber / includedPhases.length) * 100);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--gray-50)" }}>
      <Sidebar />

      {/* Project Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="px-6 py-4">
          {/* Breadcrumbs */}
          <Breadcrumbs
            items={[
              { label: "Proyectos", href: "/projects" },
              { label: project.clientName },
            ]}
          />

          {/* Project Info */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl"
                style={{
                  background: "linear-gradient(135deg, var(--rx-500), var(--rx-700))",
                }}
              >
                {project.clientName.charAt(0)}
              </div>

              {/* Info */}
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-gray-900">
                    {project.clientName}
                  </h1>
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      project.status === "active"
                        ? "bg-green-100 text-green-700"
                        : project.status === "on-hold"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {project.status === "active"
                      ? "Activo"
                      : project.status === "on-hold"
                      ? "Pausado"
                      : "Completado"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{project.oppName}</p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-500">Fase Actual</p>
                <p className="text-sm font-medium text-gray-900">
                  {project.phaseNumber}. {currentPhaseInfo?.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Progreso</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${progress}%`,
                        background: "linear-gradient(90deg, var(--rx-500), var(--rx-600))",
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{progress}%</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Actualizado</p>
                <p className="text-sm text-gray-600">
                  {formatRelativeTime(project.updatedAt)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Phase Navigation */}
        <PhaseNavigation
          projectId={projectId}
          project={project}
          includedPhases={includedPhases}
        />
      </header>

      {/* Main Content */}
      <main className="p-6">{children}</main>
    </div>
  );
}
