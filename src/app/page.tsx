"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  FileCheck,
  Clock,
  Target,
  ChevronDown,
  Play,
  CheckCircle2,
  ArrowUpRight,
  Menu,
  X,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

const phases = [
  { number: 1, name: "Pre-Kick Off", desc: "Dossier de contexto", icon: Target },
  { number: 2, name: "Post-Kick Off", desc: "Mapeo de contactos", icon: Target },
  { number: 3, name: "Kick Off Meeting", desc: "Agenda y presentación", icon: Play },
  { number: 4, name: "Briefing & Design", desc: "Brief y encuesta", icon: FileCheck },
  { number: 5, name: "Programming & QC", desc: "Código TXT", icon: Zap },
  { number: 6, name: "Launch & Monitor", desc: "Soft launch", icon: BarChart3 },
  { number: 7, name: "Analysis Plan", desc: "Plan de análisis", icon: Target },
  { number: 8, name: "Analysis & Insights", desc: "Key findings", icon: Sparkles },
  { number: 9, name: "Report QC", desc: "Validación final", icon: CheckCircle2 },
];

const features = [
  {
    icon: FileCheck,
    title: "DocuSign Parser",
    desc: "Extrae automáticamente cliente, costo, servicios y fechas del PDF firmado.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Sparkles,
    title: "Dossier con AI",
    desc: "Claude genera contexto de industria, hipótesis y análisis de competidores.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Phase Tracker",
    desc: "Visualiza el progreso de cada proyecto a través de las 9 fases.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "QC Automático",
    desc: "Validaciones inteligentes en cada entregable antes de avanzar.",
    color: "from-amber-500 to-orange-600",
  },
];

const stats = [
  { value: "9", label: "Fases" },
  { value: "60%", label: "Menos tiempo" },
  { value: "100%", label: "Automatizado" },
  { value: "AI", label: "Powered" },
];

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-gray-900">RX Hub</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8">
              <div className="nav-dropdown">
                <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Producto
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="nav-dropdown-content">
                  <a href="#features" className="nav-dropdown-item">
                    <Zap className="w-5 h-5" />
                    Features
                  </a>
                  <a href="#phases" className="nav-dropdown-item">
                    <Target className="w-5 h-5" />
                    Las 9 Fases
                  </a>
                  <a href="#ai" className="nav-dropdown-item">
                    <Sparkles className="w-5 h-5" />
                    Claude AI
                  </a>
                </div>
              </div>
              <a href="#phases" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Proceso
              </a>
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-2 transition-colors">
                Iniciar Sesión
              </Link>
              <Link href="/login" className="btn-primary">
                Comenzar Gratis
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 py-4">
            <div className="container flex flex-col gap-2">
              <a href="#features" className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700">
                Features
              </a>
              <a href="#phases" className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700">
                Proceso
              </a>
              <hr className="my-2" />
              <Link href="/login" className="px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-700">
                Iniciar Sesión
              </Link>
              <Link href="/login" className="btn-primary justify-center mt-2">
                Comenzar Gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 lg:pt-40 pb-20 relative">
        {/* Background decoration */}
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute top-40 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left - Content */}
            <div className={`${mounted ? 'animate-slide-up' : 'opacity-0'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 mb-6">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-semibold text-indigo-700">Powered by Claude AI</span>
              </div>

              <h1 className="text-hero text-gray-900 mb-6">
                Research automation
                <span className="text-gradient"> sin fricción</span>
              </h1>

              <p className="text-body-lg text-gray-600 mb-8 max-w-lg">
                La plataforma que automatiza tu proceso de investigación.
                9 fases, un flujo, resultados extraordinarios.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <Link href="/login" className="btn-primary text-base px-8 py-4">
                  Empezar ahora
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#phases" className="btn-outline text-base px-8 py-4">
                  <Play className="w-5 h-5" />
                  Ver el proceso
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={stat.label}
                    className={`stat-card ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${200 + i * 100}ms` }}
                  >
                    <p className="stat-number">{stat.value}</p>
                    <p className="text-small text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Visual */}
            <div className={`relative ${mounted ? 'animate-slide-in-right delay-200' : 'opacity-0'}`}>
              {/* Main Card */}
              <div className="card-gradient p-8 relative z-10">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <span className="badge-primary bg-white/10 text-white border border-white/20">
                      <Sparkles className="w-3 h-3" />
                      AI en acción
                    </span>
                    <span className="text-white/60 text-sm">Fase 1 de 9</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-2">Generando Dossier...</h3>
                  <p className="text-white/70 mb-6">Cliente: Coca-Cola México</p>

                  <div className="space-y-3">
                    {["Análisis de industria", "Competidores clave", "Hipótesis iniciales"].map((item, i) => (
                      <div key={item} className="flex items-center gap-3 text-white/80">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                    <div className="flex items-center gap-3 text-white/60">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Generando recomendaciones...</span>
                    </div>
                  </div>

                  <div className="mt-8">
                    <div className="flex justify-between text-sm text-white/60 mb-2">
                      <span>Progreso</span>
                      <span>78%</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-[78%] bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 card p-4 shadow-xl animate-float z-20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Proyecto creado</p>
                    <p className="text-xs text-gray-500">Hace 2 min</p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 card p-4 shadow-xl animate-float z-20" style={{ animationDelay: '1s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">5 insights</p>
                    <p className="text-xs text-gray-500">Generados con AI</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-caption text-indigo-600 mb-4 block">Features</span>
            <h2 className="text-display text-gray-900 mb-4">
              Todo lo que necesitas para investigar
            </h2>
            <p className="text-body-lg text-gray-600">
              Herramientas potentes diseñadas para Research Managers que valoran su tiempo.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className={`card-interactive p-8 ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-title text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-body text-gray-600 mb-4">{feature.desc}</p>
                <a href="#" className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:gap-3 transition-all">
                  Saber más
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases Section */}
      <section id="phases" className="py-24">
        <div className="container">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            {/* Left - Sticky Header */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-32">
                <span className="text-caption text-indigo-600 mb-4 block">El Proceso</span>
                <h2 className="text-display text-gray-900 mb-4">
                  La Brújula RX
                </h2>
                <p className="text-body-lg text-gray-600 mb-8">
                  Un flujo estructurado de 9 fases que guía cada proyecto desde el kick-off hasta la entrega final.
                </p>
                <Link href="/login" className="btn-primary">
                  Comenzar un proyecto
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right - Phases Grid */}
            <div className="lg:col-span-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {phases.map((phase, i) => (
                  <div
                    key={phase.number}
                    className={`card-interactive p-6 group ${mounted ? 'animate-slide-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                        {phase.number}
                      </div>
                      <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{phase.name}</h3>
                    <p className="text-small text-gray-500">{phase.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section id="ai" className="py-24 bg-gray-900 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl" />
        </div>

        <div className="container relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-caption text-indigo-400 mb-4 block">Inteligencia Artificial</span>
              <h2 className="text-display text-white mb-6">
                Claude AI en cada fase
              </h2>
              <p className="text-body-lg text-gray-400 mb-8">
                Generación automática de dossiers, briefs, encuestas, códigos TXT e insights.
                La IA que entiende research.
              </p>

              <div className="space-y-4 mb-8">
                {["Genera dossiers completos", "Crea briefs de investigación", "Diseña encuestas automáticas", "Extrae insights de datos"].map((item, i) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="/login" className="btn-primary bg-white text-gray-900 hover:bg-gray-100">
                Probar Claude AI
                <Sparkles className="w-4 h-4" />
              </Link>
            </div>

            <div className="relative">
              <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <div className="space-y-3 font-mono text-sm">
                  <p className="text-gray-400">
                    <span className="text-purple-400">{">"}</span> Generando dossier para Coca-Cola...
                  </p>
                  <p className="text-emerald-400">✓ Industria: Bebidas carbonatadas</p>
                  <p className="text-emerald-400">✓ Competidores: Pepsi, Dr Pepper</p>
                  <p className="text-emerald-400">✓ Tendencias: Salud, Zero azúcar</p>
                  <p className="text-indigo-400 animate-pulse">● Generando hipótesis...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 gradient-bg">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-display text-gray-900 mb-6">
              ¿Listo para transformar tu proceso?
            </h2>
            <p className="text-body-lg text-gray-600 mb-8">
              Únete a los Research Managers que ya están automatizando su trabajo con RX Hub.
            </p>
            <Link href="/login" className="btn-primary text-lg px-10 py-5">
              Comenzar gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="font-semibold text-gray-900">RX Hub</span>
            </div>
            <p className="text-small text-gray-500">
              Powered by Qualtrics + Claude AI
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
