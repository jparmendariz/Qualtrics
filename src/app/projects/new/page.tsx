"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Check,
  Loader2,
  AlertCircle,
  Building2,
  Users,
  Clock,
  Percent,
  DollarSign,
  Sparkles,
  UserPlus,
  Trash2,
  Mail,
  Briefcase,
} from "lucide-react";
import { useProjectsStore, PHASES, PhaseId } from "@/lib/store/projects";
import { useAuthStore } from "@/lib/store/auth";
import Sidebar from "@/components/Sidebar";

interface ExtractedData {
  projectId: string | null;
  clientName: string | null;
  projectName: string | null;
  totalCost: string | null;
  sampleSize: string | null;
  incidenceRate: string | null;
  loi: string | null;
  projectType: string | null;
  sampleType: string | null;
  targetAudience: string | null;
  screeners: string[];
  quotas: string[];
  serviceType: string | null;
  servicesIncluded: string[];
  contactName: string | null;
  contactEmail: string | null;
  deliveryDate: string | null;
  assumptions: string | null;
}

type Step = "upload" | "review" | "creating";

export default function NewProjectPage() {
  const router = useRouter();
  const { addProject } = useProjectsStore();
  const { currentUser, isAuthenticated } = useAuthStore();

  const [step, setStep] = useState<Step>("upload");
  const [isExtracting, setIsExtracting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Form data
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [oppName, setOppName] = useState("");
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [methodology, setMethodology] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [sampleSize, setSampleSize] = useState("");
  const [loi, setLoi] = useState("");
  const [incidenceRate, setIncidenceRate] = useState("");
  const [totalCost, setTotalCost] = useState("");
  const [selectedPhases, setSelectedPhases] = useState<PhaseId[]>(
    PHASES.map((p) => p.id)
  );
  const [servicesIncluded, setServicesIncluded] = useState<string[]>([]);
  const [clientContacts, setClientContacts] = useState<
    { name: string; email: string; role: string }[]
  >([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
    setMounted(true);
  }, [isAuthenticated, router]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);
      extractFromPDF(file);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      extractFromPDF(file);
    }
  };

  const extractFromPDF = async (file: File) => {
    setIsExtracting(true);
    setExtractionError(null);

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Data = result.split(",")[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch("/api/extract-docusign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pdfBase64: base64 }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Error al extraer datos");
      }

      const data: ExtractedData = await response.json();
      setExtractedData(data);

      setOppName(data.projectId || "");
      setClientName(data.clientName || "");
      setProjectName(data.projectName || "");
      setTargetAudience(data.targetAudience || "");
      setSampleSize(data.sampleSize || "");
      setLoi(data.loi || "");
      setIncidenceRate(data.incidenceRate || "");
      setTotalCost(data.totalCost || "");
      setServicesIncluded(data.servicesIncluded || "");

      if (data.serviceType) {
        const serviceKey = data.serviceType.toLowerCase();
        if (serviceKey.includes("full service")) {
          setSelectedPhases(PHASES.map((p) => p.id));
        } else if (serviceKey.includes("sample only")) {
          setSelectedPhases([
            "pre-kickoff",
            "kickoff-meeting",
            "briefing-design",
            "programming-qc",
            "launch-monitoring",
          ]);
        } else if (serviceKey.includes("reporting")) {
          setSelectedPhases(["analysis-plan", "analysis-insights", "report-qc"]);
        } else {
          setSelectedPhases(PHASES.map((p) => p.id));
        }
      }

      if (data.projectType) {
        if (data.projectType.toLowerCase().includes("qual")) {
          setMethodology("Qualitative");
        } else if (data.projectType.toLowerCase().includes("track")) {
          setMethodology("Tracker");
        } else {
          setMethodology("Quantitative");
        }
      }

      setStep("review");
    } catch (error) {
      console.error("Extraction error:", error);
      setExtractionError(
        error instanceof Error
          ? error.message
          : "Error al procesar el documento"
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCreateProject = async () => {
    if (!clientName.trim() || !currentUser) return;

    setIsCreating(true);
    setStep("creating");

    await new Promise((resolve) => setTimeout(resolve, 800));

    const firstPhase = PHASES.find((p) => selectedPhases.includes(p.id));

    const newProject = addProject({
      oppName: oppName || `OPP-${Date.now()}`,
      clientName: clientName.trim(),
      projectName: projectName || clientName.trim(),
      researchManager: currentUser.name,
      currentPhase: firstPhase?.id || "pre-kickoff",
      status: "active",
      methodology,
      targetAudience,
      sampleSize,
      loi,
      incidenceRate,
      totalCost,
      includedPhases: selectedPhases,
      servicesIncluded:
        servicesIncluded.length > 0 ? servicesIncluded : undefined,
      quotas: extractedData?.quotas?.length ? extractedData.quotas : undefined,
      screeners: extractedData?.screeners?.length
        ? extractedData.screeners
        : undefined,
      sampleType: extractedData?.sampleType || undefined,
      assumptions: extractedData?.assumptions || undefined,
      clientContacts: clientContacts.filter(
        (c) => c.name.trim() || c.email.trim()
      ),
    });

    router.push(`/projects/${newProject.id}`);
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setExtractedData(null);
    setExtractionError(null);
    setStep("upload");
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />

      <main>
        {/* Header */}
        <section className="section border-b border-gray-200">
          <div className="container-narrow">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Dashboard
            </Link>

            <div
              className={`text-center transition-all duration-700 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-caption text-gray-400 mb-4">Crear</p>
              <h1 className="font-display text-display-md text-black mb-4">
                Nuevo Proyecto
              </h1>
              <p className="text-body-lg text-gray-500">
                Sube el DocuSign y extraeremos la información automáticamente
              </p>
            </div>

            {/* Steps Indicator */}
            <div
              className={`flex items-center justify-center mt-12 transition-all duration-700 delay-100 ${
                mounted
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="flex items-center gap-4">
                {[
                  { num: 1, label: "Subir PDF", key: "upload" },
                  { num: 2, label: "Revisar Datos", key: "review" },
                  { num: 3, label: "Crear", key: "creating" },
                ].map((s, i) => (
                  <div key={s.key} className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                          step === s.key
                            ? "bg-black text-white"
                            : (step === "review" && s.key === "upload") ||
                                (step === "creating" &&
                                  (s.key === "upload" || s.key === "review"))
                              ? "bg-black text-white"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {(step === "review" && s.key === "upload") ||
                        (step === "creating" &&
                          (s.key === "upload" || s.key === "review")) ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          s.num
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          step === s.key ? "text-black" : "text-gray-400"
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div
                        className={`w-12 h-px ${
                          (step === "review" && s.key === "upload") ||
                          (step === "creating" &&
                            (s.key === "upload" || s.key === "review"))
                            ? "bg-black"
                            : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container-narrow">
            {/* Step 1: Upload */}
            {step === "upload" && (
              <div
                className={`transition-all duration-700 delay-200 ${
                  mounted
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <div
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${
                    isDragging
                      ? "border-black bg-gray-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isExtracting ? (
                    <div>
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Sparkles className="w-8 h-8 text-gray-600 animate-pulse" />
                      </div>
                      <h3 className="font-display text-2xl text-black mb-2">
                        Extrayendo información...
                      </h3>
                      <p className="text-body text-gray-500 mb-6">
                        Claude AI está analizando el documento
                      </p>
                      <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" />
                    </div>
                  ) : extractionError ? (
                    <div>
                      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <h3 className="font-display text-2xl text-black mb-2">
                        Error al procesar
                      </h3>
                      <p className="text-body text-red-500 mb-6">
                        {extractionError}
                      </p>
                      <button onClick={resetUpload} className="btn-primary">
                        Intentar de nuevo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Upload className="w-8 h-8 text-gray-600" />
                      </div>
                      <h3 className="font-display text-2xl text-black mb-2">
                        Arrastra tu DocuSign aquí
                      </h3>
                      <p className="text-body text-gray-500 mb-8 max-w-md mx-auto">
                        O haz clic para seleccionar el archivo PDF. La AI
                        extraerá automáticamente todos los datos.
                      </p>
                      <label className="btn-primary cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Seleccionar PDF
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>

                <div className="text-center mt-8">
                  <button
                    onClick={() => setStep("review")}
                    className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
                  >
                    O ingresa los datos manualmente
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Review */}
            {step === "review" && (
              <div className="space-y-8">
                {/* AI Extraction Badge */}
                {extractedData && (
                  <div className="flex items-center gap-4 p-5 rounded-2xl bg-gray-50">
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">
                        Datos extraídos con Claude AI
                      </p>
                      <p className="text-sm text-gray-500">
                        Revisa y ajusta si es necesario
                      </p>
                    </div>
                  </div>
                )}

                {/* Client & Project Info */}
                <div className="card p-8">
                  <h2 className="font-display text-xl text-black mb-6 flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-gray-400" />
                    Información del Proyecto
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="md:col-span-2">
                      <label className="label">
                        Nombre del Cliente{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="ej: Coca-Cola"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">Nombre del Proyecto</label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="ej: Brand Health Tracker Q1"
                        className="input"
                      />
                    </div>

                    <div>
                      <label className="label">OPP Name</label>
                      <input
                        type="text"
                        value={oppName}
                        onChange={(e) => setOppName(e.target.value)}
                        placeholder="ej: Qual5480-1119"
                        className="input"
                      />
                    </div>
                  </div>
                </div>

                {/* Client Contacts */}
                <div className="card p-8 bg-gray-50 border-0">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-display text-xl text-black flex items-center gap-3">
                      <UserPlus className="w-5 h-5 text-gray-400" />
                      Contactos del Cliente
                    </h2>
                    <span className="badge">Opcional</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    Si agregas contactos, la AI investigará sobre ellos para el
                    dossier.
                  </p>

                  {clientContacts.length > 0 && (
                    <div className="space-y-4 mb-6">
                      {clientContacts.map((contact, index) => (
                        <div
                          key={index}
                          className="p-5 rounded-xl bg-white border border-gray-200"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-gray-500">
                              Contacto {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                setClientContacts(
                                  clientContacts.filter((_, i) => i !== index)
                                )
                              }
                              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs text-gray-500 flex items-center gap-1 mb-1.5">
                                <Users className="w-3 h-3" /> Nombre
                              </label>
                              <input
                                type="text"
                                value={contact.name}
                                onChange={(e) => {
                                  const updated = [...clientContacts];
                                  updated[index].name = e.target.value;
                                  setClientContacts(updated);
                                }}
                                placeholder="ej: María García"
                                className="input py-2.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 flex items-center gap-1 mb-1.5">
                                <Mail className="w-3 h-3" /> Email
                              </label>
                              <input
                                type="email"
                                value={contact.email}
                                onChange={(e) => {
                                  const updated = [...clientContacts];
                                  updated[index].email = e.target.value;
                                  setClientContacts(updated);
                                }}
                                placeholder="ej: maria@empresa.com"
                                className="input py-2.5 text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 flex items-center gap-1 mb-1.5">
                                <Briefcase className="w-3 h-3" /> Cargo
                              </label>
                              <input
                                type="text"
                                value={contact.role}
                                onChange={(e) => {
                                  const updated = [...clientContacts];
                                  updated[index].role = e.target.value;
                                  setClientContacts(updated);
                                }}
                                placeholder="ej: Brand Manager"
                                className="input py-2.5 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setClientContacts([
                        ...clientContacts,
                        { name: "", email: "", role: "" },
                      ])
                    }
                    className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 text-sm font-medium text-gray-500 flex items-center justify-center gap-2 hover:border-black hover:text-black transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    {clientContacts.length === 0
                      ? "Agregar contacto del cliente"
                      : "Agregar otro contacto"}
                  </button>
                </div>

                {/* Research Details */}
                <div className="card p-8">
                  <h2 className="font-display text-xl text-black mb-6">
                    Detalles de Investigación
                  </h2>

                  {/* Methodology */}
                  <div className="mb-6">
                    <label className="label">Metodología</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {["Quantitative", "Qualitative", "Mixed", "Tracker"].map(
                        (m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setMethodology(m)}
                            className={`p-3 rounded-xl font-medium text-sm transition-all ${
                              methodology === m
                                ? "bg-black text-white"
                                : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                            }`}
                          >
                            {m}
                          </button>
                        )
                      )}
                    </div>
                  </div>

                  {/* Target Audience */}
                  <div className="mb-6">
                    <label className="label">Target Audience</label>
                    <textarea
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="ej: Adultos 25-54, decisores de compra del hogar"
                      rows={2}
                      className="input resize-none"
                    />
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      {
                        icon: Users,
                        label: "Sample (N)",
                        value: sampleSize,
                        setter: setSampleSize,
                        placeholder: "1000",
                      },
                      {
                        icon: Clock,
                        label: "LOI (min)",
                        value: loi,
                        setter: setLoi,
                        placeholder: "15",
                      },
                      {
                        icon: Percent,
                        label: "IR (%)",
                        value: incidenceRate,
                        setter: setIncidenceRate,
                        placeholder: "50%",
                      },
                      {
                        icon: DollarSign,
                        label: "Costo USD",
                        value: totalCost,
                        setter: setTotalCost,
                        placeholder: "50,000",
                      },
                    ].map((field) => (
                      <div key={field.label}>
                        <label className="text-xs text-gray-500 flex items-center gap-1 mb-1.5">
                          <field.icon className="w-3 h-3" />
                          {field.label}
                        </label>
                        <input
                          type="text"
                          value={field.value}
                          onChange={(e) => field.setter(e.target.value)}
                          placeholder={field.placeholder}
                          className="input text-center"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phases */}
                <div className="card p-8">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="font-display text-xl text-black">
                      Fases del Proyecto
                    </h2>
                    <span className="badge badge-dark">
                      {selectedPhases.length} de {PHASES.length}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-6">
                    Selecciona las fases que aplican a este proyecto
                  </p>

                  <div className="flex gap-4 mb-6">
                    <button
                      type="button"
                      onClick={() => setSelectedPhases(PHASES.map((p) => p.id))}
                      className="text-sm font-medium text-black hover:text-gray-600 transition-colors"
                    >
                      Seleccionar todas
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={() => setSelectedPhases([])}
                      className="text-sm font-medium text-gray-400 hover:text-black transition-colors"
                    >
                      Limpiar
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-3">
                    {PHASES.map((phase) => {
                      const isSelected = selectedPhases.includes(phase.id);
                      return (
                        <button
                          key={phase.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedPhases(
                                selectedPhases.filter((p) => p !== phase.id)
                              );
                            } else {
                              setSelectedPhases([...selectedPhases, phase.id]);
                            }
                          }}
                          className={`p-4 rounded-xl text-left transition-all ${
                            isSelected
                              ? "bg-black text-white"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                                isSelected
                                  ? "bg-white text-black"
                                  : "bg-gray-200 text-gray-600"
                              }`}
                            >
                              {isSelected ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                phase.number
                              )}
                            </div>
                            <span
                              className={`font-medium text-sm truncate ${
                                isSelected ? "text-white" : "text-gray-700"
                              }`}
                            >
                              {phase.name}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Services Included */}
                {servicesIncluded.length > 0 && (
                  <div className="card p-8">
                    <h2 className="font-display text-xl text-black mb-4">
                      Servicios Incluidos
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {servicesIncluded.map((service, i) => (
                        <span key={i} className="badge badge-success">
                          <Check className="w-3 h-3" />
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setStep("upload")}
                    className="btn-ghost"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Volver
                  </button>

                  <button
                    onClick={handleCreateProject}
                    disabled={!clientName.trim() || isCreating}
                    className="btn-primary"
                  >
                    Crear Proyecto
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Creating */}
            {step === "creating" && (
              <div className="text-center py-20">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
                  <Loader2 className="w-10 h-10 animate-spin text-black" />
                </div>
                <h2 className="font-display text-display-md text-black mb-4">
                  Creando proyecto...
                </h2>
                <p className="text-body-lg text-gray-500">
                  Configurando {clientName} en RX Hub
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
