"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  ArrowUpRight,
  Clock,
  FolderOpen,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useProjectsStore, PHASES } from "@/lib/store/projects";
import Sidebar from "@/components/Sidebar";
import { formatRelativeTime } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAuthStore();
  const { projects } = useProjectsStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  if (!currentUser) return null;

  const myProjects = projects.filter(
    (p) => p.researchManager.toLowerCase() === currentUser.name.toLowerCase()
  );
  const activeProjects = myProjects.filter((p) => p.status === "active");
  const completedProjects = myProjects.filter((p) => p.status === "completed");

  const recentProjects = [...myProjects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 6);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main>
        {/* Hero Header */}
        <section className="section border-b border-gray-200">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-end">
              <div
                className={`transition-all duration-700 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <p className="text-caption text-gray-400 mb-4">{greeting}</p>
                <h1 className="font-display text-display-lg text-black mb-4">
                  {currentUser.name.split(" ")[0]}
                </h1>
                <p className="text-body-lg text-gray-500">
                  {new Date().toLocaleDateString('es-MX', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>

              <div
                className={`flex justify-end transition-all duration-700 delay-200 ${
                  mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <Link href="/projects/new" className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Nuevo Proyecto
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div
              className={`grid grid-cols-4 gap-px bg-gray-200 rounded-2xl overflow-hidden mt-12 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {[
                { number: myProjects.length, label: "Total" },
                { number: activeProjects.length, label: "Activos" },
                { number: completedProjects.length, label: "Completados" },
                { number: `${Math.round((completedProjects.length / Math.max(myProjects.length, 1)) * 100)}%`, label: "Completion" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white p-8 text-center">
                  <p className="stat-number">{stat.number}</p>
                  <p className="text-small text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="section">
          <div className="container-wide">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-caption text-gray-400 mb-2">Proyectos</p>
                <h2 className="font-display text-display-md text-black">Recientes</h2>
              </div>
              <Link href="/projects" className="btn-link">
                Ver todos
              </Link>
            </div>

            {recentProjects.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recentProjects.map((project, i) => {
                  const currentPhase = PHASES.find((p) => p.id === project.currentPhase);
                  const progress = Math.round((project.phaseNumber / 9) * 100);

                  return (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className={`card-interactive p-6 transition-all duration-500 ${
                        mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                      }`}
                      style={{ transitionDelay: `${400 + i * 100}ms` }}
                    >
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white font-semibold text-lg">
                            {project.phaseNumber}
                          </div>
                          <div>
                            <h3 className="font-semibold text-black">
                              {project.clientName}
                            </h3>
                            <p className="text-small text-gray-500 truncate max-w-[160px]">
                              {project.projectName || project.oppName}
                            </p>
                          </div>
                        </div>
                        <ArrowUpRight className="w-5 h-5 text-gray-300" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-small">
                          <span className="text-gray-500">{currentPhase?.name}</span>
                          <span className="font-medium text-black">{progress}%</span>
                        </div>
                        <div className="progress-bar">
                          <div className="progress-fill" style={{ width: `${progress}%` }} />
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 text-small text-gray-400">
                        <Clock className="w-4 h-4" />
                        {formatRelativeTime(project.updatedAt)}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-2xl">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FolderOpen className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-display text-2xl text-black mb-2">
                  Sin proyectos
                </h3>
                <p className="text-body text-gray-500 mb-8">
                  Crea tu primer proyecto para comenzar
                </p>
                <Link href="/projects/new" className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Crear Proyecto
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* AI Feature */}
        <section className="section bg-black text-white">
          <div className="container-wide">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-caption text-gray-500 mb-4">Inteligencia Artificial</p>
                <h2 className="font-display text-display-md text-white mb-4">
                  Claude AI
                  <br />
                  <span className="italic text-gray-400">en cada fase</span>
                </h2>
                <p className="text-body-lg text-gray-400">
                  Genera dossiers, briefs, encuestas e insights automáticamente.
                </p>
              </div>
              <div className="flex justify-end">
                <div className="p-8 rounded-2xl bg-gray-900 text-center">
                  <Sparkles className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-xl font-display text-gray-400 italic">
                    "Genera un dossier"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
