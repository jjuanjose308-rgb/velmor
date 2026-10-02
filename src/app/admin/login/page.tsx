"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-6">
      <div className="w-full max-w-md bg-white p-8 shadow-sm">

        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          VELMOR
        </p>

        <h1 className="mt-3 font-serif text-4xl">
          Administración
        </h1>

        <p className="mt-3 text-sm text-black/50">
          Inicia sesión para acceder al panel.
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="text-xs uppercase tracking-wider text-black/50">
              Correo electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="admin@velmor.com"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-black/50">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              className="mt-2 w-full border border-black/15 px-4 py-3 text-sm outline-none focus:border-black"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#111111] py-4 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-[#a88a4a] disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </button>
        </form>

      </div>
    </main>
  );
}