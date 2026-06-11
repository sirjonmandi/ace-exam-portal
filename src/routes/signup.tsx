import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout, Field } from "./login";
import { useAuth } from "@/lib/auth-context";
import { getStoredUser } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getStoredUser()) throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: "Create account — Kaplan CFA Mock Portal" }] }),
  component: Signup,
});

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!agreed) {
      setError("Please agree to the Terms of Service.");
      return;
    }
    setLoading(true);
    const result = await signup(name, email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      navigate({ to: "/dashboard" });
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Start practicing with full-length CFA mocks.">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field
          label="Full name"
          type="text"
          placeholder="Jane Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Field
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="accent-primary mt-0.5"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I agree to the Terms of Service and Privacy Policy.
        </label>
        {error && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          className="block w-full text-center text-sm py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
