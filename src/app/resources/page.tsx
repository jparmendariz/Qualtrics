"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  FileSpreadsheet,
  Presentation,
  Download,
  BookOpen,
  Calculator,
  BarChart3,
  CheckSquare,
  Package,
  Users,
  Type,
  ArrowUpRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import Sidebar from "@/components/Sidebar";

interface Resource {
  id: string;
  title: string;
  description: string;
  category: string;
  fileType: "pdf" | "xlsx" | "pptx";
  fileName: string;
  icon: React.ElementType;
}

const resources: Resource[] = [
  {
    id: "sample-size",
    title: "Determining Sample Size",
    description:
      "Guía para calcular el tamaño de muestra adecuado para estudios de investigación",
    category: "Metodología",
    fileType: "pdf",
    fileName: "Determining-Sample-Size.pdf",
    icon: Calculator,
  },
  {
    id: "displayr",
    title: "Guía DisplayR",
    description:
      "Manual completo para usar DisplayR en análisis de datos y visualización",
    category: "Herramientas",
    fileType: "pdf",
    fileName: "Guia-DisplayR.pdf",
    icon: BarChart3,
  },
  {
    id: "maxdiff",
    title: "MaxDiff Example Report",
    description:
      "Ejemplo de reporte de análisis MaxDiff para preferencias de consumidor",
    category: "Reportes",
    fileType: "pptx",
    fileName: "MaxDiff-Example-Report.pptx",
    icon: Presentation,
  },
  {
    id: "qc-template",
    title: "QC Template",
    description:
      "Plantilla estándar para Quality Control de encuestas y programación",
    category: "Templates",
    fileType: "xlsx",
    fileName: "QC-Template.xlsx",
    icon: CheckSquare,
  },
  {
    id: "services-catalog",
    title: "Services Catalog & Packages",
    description: "Catálogo completo de servicios y paquetes disponibles",
    category: "Referencia",
    fileType: "xlsx",
    fileName: "Services-Catalog.xlsx",
    icon: Package,
  },
  {
    id: "trustful-advisory",
    title: "Trustful Advisory Training",
    description:
      "Material de capacitación para Dynamic Growth y asesoría de clientes",
    category: "Capacitación",
    fileType: "pptx",
    fileName: "Trustful-Advisory-Training.pptx",
    icon: Users,
  },
  {
    id: "typing-tool",
    title: "Typing Tool Training",
    description:
      "Guía de entrenamiento para uso del Typing Tool en segmentación",
    category: "Capacitación",
    fileType: "pptx",
    fileName: "Typing-Tool-Training.pptx",
    icon: Type,
  },
];

const fileTypeConfig = {
  pdf: { label: "PDF", bgClass: "bg-red-50", textClass: "text-red-600" },
  xlsx: { label: "Excel", bgClass: "bg-green-50", textClass: "text-green-600" },
  pptx: {
    label: "PowerPoint",
    bgClass: "bg-orange-50",
    textClass: "text-orange-600",
  },
};

export default function ResourcesPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  const categories = Array.from(new Set(resources.map((r) => r.category)));

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main>
        {/* Header */}
        <section className="section border-b border-gray-200">
          <div className="container-wide">
            <div
              className={`transition-all duration-700 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-caption text-gray-400 mb-4">Biblioteca</p>
              <h1 className="font-display text-display-lg text-black mb-4">
                Recursos
              </h1>
              <p className="text-body-lg text-gray-500 max-w-xl">
                Material de referencia para proyectos de investigación.
                Templates, guías y documentación.
              </p>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="section">
          <div className="container-wide">
            {categories.map((category, catIndex) => (
              <div
                key={category}
                className={`mb-16 last:mb-0 transition-all duration-700 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${100 + catIndex * 100}ms` }}
              >
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-caption text-gray-400 mb-2">
                      0{catIndex + 1}
                    </p>
                    <h2 className="font-display text-display-md text-black">
                      {category}
                    </h2>
                  </div>
                  <span className="badge badge-dark">
                    {resources.filter((r) => r.category === category).length}{" "}
                    archivos
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resources
                    .filter((r) => r.category === category)
                    .map((resource, i) => {
                      const typeConfig = fileTypeConfig[resource.fileType];
                      const ResourceIcon = resource.icon;

                      return (
                        <a
                          key={resource.id}
                          href={`/resources/${resource.fileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-interactive p-6 group"
                          style={{
                            transitionDelay: `${200 + catIndex * 100 + i * 50}ms`,
                          }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-black transition-colors duration-300">
                              <ResourceIcon className="w-6 h-6 text-gray-600 group-hover:text-white transition-colors duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-black">
                                  {resource.title}
                                </h3>
                                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-black transition-colors flex-shrink-0" />
                              </div>
                              <p className="text-small text-gray-500 mb-4 line-clamp-2">
                                {resource.description}
                              </p>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${typeConfig.bgClass} ${typeConfig.textClass}`}
                                >
                                  {typeConfig.label}
                                </span>
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                  <Download className="w-3 h-3" />
                                  Descargar
                                </span>
                              </div>
                            </div>
                          </div>
                        </a>
                      );
                    })}
                </div>
              </div>
            ))}

            {/* Info Note */}
            <div
              className={`mt-16 p-8 rounded-2xl bg-gray-50 transition-all duration-700 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: "500ms" }}
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display text-xl text-black mb-2">
                    Material de Referencia
                  </h3>
                  <p className="text-body text-gray-500">
                    Estos recursos están disponibles para consulta y descarga.
                    Usa estos templates y guías como base para tus proyectos de
                    investigación.
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
