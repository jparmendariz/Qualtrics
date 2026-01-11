"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Users,
  Calendar,
  Target,
  FileText,
  CheckCircle2,
  Clock,
  ArrowRight,
  Mail,
  Phone,
  Building2,
  DollarSign,
  Timer,
  BarChart3,
} from "lucide-react";
import { useProjectsStore, PHASES, getIncludedPhases, type Project } from "@/lib/store/projects";
import { formatDate, formatRelativeTime } from "@/lib/utils";

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

export default function ProjectOverviewPage() {
  const params = useParams();
  const projectId = params.id as string;
  const { getProject } = useProjectsStore();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = getProject(projectId);
    if (p) setProject(p);
  }, [projectId, getProject]);

  useEffect(() => {
    const interval = setInterval(() => {
      const p = getProject(projectId);
      if (p) setProject(p);
    }, 1000);
    return () => clearInterval(interval);
  }, [projectId, getProject]);

  if (!project) return null;

  const includedPhaseIds = getIncludedPhases(project);
  const includedPhases = PHASES.filter((p) => includedPhaseIds.includes(p.id));
  const currentPhase = PHASES.find((p) => p.id === project.currentPhase);
  const completedActions = project.completedActions?.length || 0;
  const totalActions = includedPhases.reduce((acc, phase) => {
    // Approximate actions per phase
    const actionsPerPhase: Record<string, number> = {
      "pre-kickoff": 2,
      "kickoff-meeting": 3,
      "briefing-design": 4,
      "programming-qc": 4,
      "launch-monitoring": 5,
      "analysis-plan": 2,
      "analysis-insights": 2,
      "report-qc": 3,
    };
    return acc + (actionsPerPhase[phase.id] || 2);
  }, 0);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Continuar Trabajo</h3>
            <Link
              href={`/projects/${projectId}/phases/${project.currentPhase}`}
              className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-xl hover:bg-primary/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${
                    PHASE_COLORS[PHASES.findIndex((p) => p.id === project.currentPhase)]
                  } flex items-center justify-center text-white font-bold`}
                >
                  {project.phaseNumber}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{currentPhase?.name}</p>
                  <p className="text-sm text-gray-500">Fase actual</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-primary" />
            </Link>
          </div>

          {/* Phase Progress */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Progreso por Fase</h3>
            <div className="space-y-3">
              {includedPhases.map((phase, index) => {
                const isCompleted = project.phaseNumber > phase.number;
                const isCurrent = project.currentPhase === phase.id;
                const phaseIndex = PHASES.findIndex((p) => p.id === phase.id);

                return (
                  <Link
                    key={phase.id}
                    href={`/projects/${projectId}/phases/${phase.id}`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                        isCompleted
                          ? `${PHASE_COLORS[phaseIndex]} text-white`
                          : isCurrent
                          ? `${PHASE_COLORS[phaseIndex]} text-white`
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : phase.number}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${isCurrent ? "font-medium text-gray-900" : "text-gray-600"}`}>
                        {phase.name}
                      </p>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Actual
                      </span>
                    )}
                    {isCompleted && (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
            {project.completedActions && project.completedActions.length > 0 ? (
              <div className="space-y-3">
                {project.completedActions.slice(-5).reverse().map((action, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="text-gray-600">{action.description}</span>
                    <span className="text-gray-400 text-xs ml-auto">
                      {formatRelativeTime(action.completedAt)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">No hay actividad reciente</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Detalles</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Research Manager</p>
                  <p className="text-sm font-medium">{project.researchManager}</p>
                </div>
              </div>

              {project.methodology && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Metodologia</p>
                    <p className="text-sm font-medium">{project.methodology}</p>
                  </div>
                </div>
              )}

              {project.sampleSize && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Target className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Sample Size</p>
                    <p className="text-sm font-medium">n={project.sampleSize}</p>
                  </div>
                </div>
              )}

              {project.loi && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Timer className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">LOI</p>
                    <p className="text-sm font-medium">{project.loi} minutos</p>
                  </div>
                </div>
              )}

              {project.totalCost && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Costo Total</p>
                    <p className="text-sm font-medium">${project.totalCost}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Creado</p>
                  <p className="text-sm font-medium">{formatDate(project.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Target Audience */}
          {project.targetAudience && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Target Audience</h3>
              <p className="text-sm text-gray-600">{project.targetAudience}</p>
            </div>
          )}

          {/* Objectives */}
          {project.objectives && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Objetivos</h3>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{project.objectives}</p>
            </div>
          )}

          {/* Client Contacts */}
          {project.clientContacts && project.clientContacts.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contactos</h3>
              <div className="space-y-3">
                {project.clientContacts.map((contact, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-gray-900">{contact.name}</p>
                    {contact.role && (
                      <p className="text-gray-500 text-xs">{contact.role}</p>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-primary hover:underline text-xs"
                      >
                        {contact.email}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Stats */}
          <div className="bg-white rounded-xl border border-gray-100 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Estadisticas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Acciones completadas</span>
                <span className="text-sm font-medium">
                  {completedActions} / {totalActions}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Fases completadas</span>
                <span className="text-sm font-medium">
                  {project.phaseNumber - 1} / {includedPhases.length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Outputs guardados</span>
                <span className="text-sm font-medium">
                  {project.gemOutputs?.length || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
