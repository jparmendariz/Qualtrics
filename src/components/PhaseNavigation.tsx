"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PHASES, type PhaseId, type Project } from "@/lib/store/projects";

interface PhaseNavigationProps {
  projectId: string;
  project: Project;
  includedPhases: (typeof PHASES)[number][];
}

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

export default function PhaseNavigation({
  projectId,
  project,
  includedPhases,
}: PhaseNavigationProps) {
  const pathname = usePathname();

  const isPhaseActive = (phaseId: PhaseId) => {
    return pathname.includes(`/phases/${phaseId}`);
  };

  const isPhaseCompleted = (phaseNumber: number) => {
    return project.phaseNumber > phaseNumber;
  };

  const isCurrentPhase = (phaseId: PhaseId) => {
    return project.currentPhase === phaseId;
  };

  return (
    <div className="bg-white border-b border-gray-100">
      <div className="px-6">
        <nav className="flex items-center gap-1 overflow-x-auto py-2 -mb-px">
          {/* Overview tab */}
          <Link
            href={`/projects/${projectId}`}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
              pathname === `/projects/${projectId}`
                ? "bg-gray-100 text-gray-900"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            Overview
          </Link>

          {/* Divider */}
          <div className="w-px h-6 bg-gray-200 mx-2" />

          {/* Phase tabs */}
          {includedPhases.map((phase, index) => {
            const completed = isPhaseCompleted(phase.number);
            const current = isCurrentPhase(phase.id);
            const active = isPhaseActive(phase.id);
            const phaseIndex = PHASES.findIndex((p) => p.id === phase.id);

            return (
              <Link
                key={phase.id}
                href={`/projects/${projectId}/phases/${phase.id}`}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all whitespace-nowrap ${
                  active
                    ? "bg-white text-gray-900 border-b-2 border-primary"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                {/* Phase number/status indicator */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    completed
                      ? `${PHASE_COLORS[phaseIndex]} text-white`
                      : current
                      ? `${PHASE_COLORS[phaseIndex]} text-white ring-2 ring-offset-1`
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {completed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    phase.number
                  )}
                </div>

                {/* Phase name */}
                <span className={current ? "font-semibold" : ""}>
                  {phase.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
