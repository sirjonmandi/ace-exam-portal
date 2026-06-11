import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { AuthLayout, Field } from "./login";
import { getStoredUser } from "@/lib/auth";

export const Route = createFileRoute("/forgot-password")({
  beforeLoad: () => {
    if (typeof window !== "undefined" && getStoredUser()) throw redirect({ to: "/dashboard" });
  },
  head: () => ({ meta: [{ title: "Forgot password — Kaplan CFA Mock Portal" }] }),
  component: Forgot,
});

function Forgot() {
  return (
    <AuthLayout title="Reset your password" subtitle="We'll send a recovery link to your email.">
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Field label="Email" type="email" placeholder="you@example.com" />
        <button
          type="submit"
          className="block w-full text-center text-sm py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90"
        >
          Send reset link
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-muted-foreground">
        <Link to="/login" className="text-primary hover:underline">Back to sign in</Link>
      </p>
    </AuthLayout>
  );
}
