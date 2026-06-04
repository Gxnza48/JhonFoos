"use client";

import { useState } from "react";
import { signIn } from "@/lib/admin";

export default function LoginForm({ onLoggedIn }: { onLoggedIn: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signIn(email.trim(), password);
      onLoggedIn();
    } catch (err: any) {
      setError(
        err?.message === "Invalid login credentials"
          ? "Email o contraseña incorrectos."
          : err?.message || "No se pudo iniciar sesión."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-xl"
      >
        <h1 className="font-brand text-2xl font-700 uppercase tracking-widest text-ink">
          Panel Admin
        </h1>
        <p className="mt-1 text-sm text-neutral-500">Ingresá con tu cuenta de administrador.</p>

        <label className="mt-6 block text-xs font-600 uppercase tracking-wide text-neutral-500">
          Email
        </label>
        <input
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2.5 outline-none focus:border-ink"
          placeholder="rodriadmin@admin.com"
        />

        <label className="mt-4 block text-xs font-600 uppercase tracking-wide text-neutral-500">
          Contraseña
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2.5 outline-none focus:border-ink"
          placeholder="••••••••"
        />

        {error && <p className="mt-3 text-sm text-offer">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded bg-ink py-3 text-sm font-700 uppercase tracking-wider text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
