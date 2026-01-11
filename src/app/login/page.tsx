"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@qualtrics.com")) {
      setError("Por favor usa tu correo de Qualtrics (@qualtrics.com)");
      return;
    }

    if (!name.trim()) {
      setError("Por favor ingresa tu nombre");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    login(email, name);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Branding */}
      <div className="hidden lg:flex bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 grid-lines opacity-10" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo Button */}
          <Link
            href="/"
            className={`inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all duration-300 hover:scale-105 w-fit ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-sm">R</span>
            </div>
            <span className="text-white font-semibold">RX Hub</span>
          </Link>

          {/* Center Content */}
          <div
            className={`transition-all duration-700 delay-200 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-caption text-gray-500 mb-6">Bienvenido</p>
            <h1 className="font-display text-display-lg text-white mb-8">
              Donde el
              <br />
              <span className="italic text-gray-400">research</span>
              <br />
              toca tierra
            </h1>
            <p className="text-body-lg text-gray-500 max-w-md">
              9 fases. Un flujo. Cero fricción.
              Automatiza tu proceso de investigación.
            </p>
          </div>

          {/* Stats */}
          <div
            className={`flex gap-12 transition-all duration-700 delay-400 ${
              mounted ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {[
              { number: "9", label: "Fases" },
              { number: "60%", label: "Menos tiempo" },
              { number: "AI", label: "Powered" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-display text-white">{stat.number}</p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex items-center justify-center p-8 lg:p-16 bg-white">
        <div
          className={`w-full max-w-md transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Header */}
          <div className="mb-10">
            <h2 className="font-display text-display-md text-black mb-3">
              Inicia sesión
            </h2>
            <p className="text-body text-gray-500">
              Ingresa con tu cuenta de Qualtrics para continuar.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="label">Nombre completo</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="input"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="label">Correo electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nombre@qualtrics.com"
                className="input"
                autoComplete="email"
              />
            </div>

            {error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Continuar
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-gray-200">
            <p className="text-small text-gray-500 text-center mb-6">
              Solo para personal autorizado de Qualtrics.
            </p>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
