import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/lib/theme";
import { useAuth } from "@/lib/auth-context";
import { getStoredUser } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  showPassword: boolean;
  togglePassword: () => void;
}

export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getStoredUser()) throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: "Sign in — Kaplan CFA Mock Portal" }] }),
  component: Login,
});

const DEMO = { email: "pawan@example.com", password: "password123", name: "Pawan Rayalu" };

function Login() {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Navigate once auth state confirms user is logged in
  useEffect(() => {
    if (user) navigate({ to: "/dashboard" });
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();
      setError("");
      setLoading(true);
      const result = await login(email, password);
      setLoading(false);
      if (result.error) setError(result.error);
    } catch (error) {
      setLoading(false);
      setError("An unexpected error occurred. Please try again.");
    }
  }

  function fillDemo() {
    setEmail(DEMO.email);
    setPassword(DEMO.password);
    setError("");
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue your CFA preparation.">
      {/* Demo account banner */}
      <div className="mb-5 rounded-xl border border-primary/25 bg-primary/8 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Demo account</div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{DEMO.name}</span>
            </div>
            <div className="mt-1 font-mono text-[11px] text-muted-foreground space-y-0.5">
              <div>{DEMO.email}</div>
              <div>{DEMO.password}</div>
            </div>
          </div>
          <button
            type="button"
            onClick={fillDemo}
            className="shrink-0 text-xs px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
          >
            Use demo
          </button>
        </div>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <PasswordField
          label="Password"
          value={password}
          placeholder="••••••••"
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          togglePassword={() => setShowPassword((prev) => !prev)}
          required
        />
        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center gap-2 text-muted-foreground">
            <input type="checkbox" className="accent-primary" /> Remember me
          </label>
          <Link to="/forgot-password" className="text-primary hover:underline">Forgot password?</Link>
        </div>
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
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="text-primary hover:underline">Create an account</Link>
      </p>
    </AuthLayout>
  );
}

export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-hero-grad flex items-center justify-center px-4 py-10 relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-3 justify-center mb-8">
          <div className="h-10 w-10 rounded-lg bg-primary/20 text-primary grid place-items-center font-bold">CFA</div>
          <div className="text-sm font-semibold">CFA Mock Portal</div>
        </Link>
        <div className="card-elevated rounded-2xl p-7">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Field({
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
  autoComplete,
}: {
  label: string;
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <div className="text-xs text-muted-foreground mb-1.5">{label}</div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm outline-none focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
      />
    </label>
  );
}

export function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  required,
  showPassword,
  togglePassword, 
}: PasswordFieldProps) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full h-10 px-3 rounded-lg bg-surface border border-border text-sm outline-none focus:ring-2 focus:ring-ring focus:border-ring placeholder:text-muted-foreground"
        />

        <button
          type="button"
          onClick={togglePassword}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          disabled={!value}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}