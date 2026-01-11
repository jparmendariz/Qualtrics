"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ChevronRight, Clock, Play } from "lucide-react";
import { useProjectsStore, PHASES, getIncludedPhases, type Project } from "@/lib/store/projects";

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

export default function PhasesListPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  const { getProject } = useProjectsStore();
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const p = getProject(projectId);
    if (p) {
      setProject(p);
    }
  }, [projectId, getProject]);

  if (!project) return null;

  const includedPhaseIds = getIncludedPhases(project);
  const includedPhases = PHASES.filter((p) => includedPhaseIds.includes(p.id));

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Fases del Proyecto</h2>

      <div className="space-y-4">
        {includedPhases.map((phase, index) => {
          const isCompleted = project.phaseNumber > phase.number;
          const isCurrent = project.currentPhase === phase.id;
          const isPending = project.phaseNumber < phase.number;
          const phaseIndex = PHASES.findIndex((p) => p.id === phase.id);

          return (
            <Link
              key={phase.id}
              href={`/projects/${projectId}/phases/${phase.id}`}
              className={`block bg-white rounded-xl border transition-all hover:shadow-md ${
                isCurrent
                  ? "border-primary ring-2 ring-primary/20"
                  : "border-gray-100"
              }`}
            >
              <div className="p-5 flex items-center gap-4">
                {/* Phase Number */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                    isCompleted
                      ? PHASE_COLORS[phaseIndex]
                      : isCurrent
                      ? PHASE_COLORS[phaseIndex]
                      : "bg-gray-200"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    phase.number
                  )}
                </div>

                {/* Phase Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Fase Actual
                      </span>
                    )}
                    {isCompleted && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Completada
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{phase.description}</p>
                </div>

                {/* Status Icon */}
                <div className="flex items-center gap-2">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : isCurrent ? (
                    <Play className="w-5 h-5 text-primary" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-300" />
                  )}
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
