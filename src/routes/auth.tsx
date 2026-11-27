import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";
import { BackLink } from "@/components/BackLink";
import { useMember } from "@/hooks/use-member";
import { safeRedirect } from "@/content/navigation";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { mode?: "signup"; redirect?: string } => ({
    ...(search["mode"] === "signup" ? { mode: "signup" as const } : {}),
    ...(typeof search["redirect"] === "string" ? { redirect: safeRedirect(search["redirect"]) } : {}),
  }),
  head: () => ({ meta: [
    { title: "Member sign in | ASEB Society" },
    { name: "description", content: "Sign in or create your ASEB Society account to keep a personal profile and connect with Circles." },
    { property: "og:title", content: "Member sign in | ASEB Society" },
    { property: "og:description", content: "Your ASEB Society account for member profiles and Circles." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { user, ready } = useMember();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(search.mode === "signup" ? "signup" : "signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const destination = safeRedirect(search.redirect);
  useEffect(() => { if (ready && user) void navigate({ href: destination, replace: true }); }, [ready, user, navigate, destination]);
  useEffect(() => {
    const draft = sessionStorage.getItem("aseb-application-account");
    if (!draft) return;
    try { const data = JSON.parse(draft); setEmail(typeof data.email === "string" ? data.email : ""); setName(typeof data.name === "string" ? data.name : ""); } catch { /* Ignore an expired draft. */ }
    sessionStorage.removeItem("aseb-application-account");
  }, []);
  return <main className="min-h-screen bg-ivory"><div className="wrap flex items-center justify-between gap-4 py-10"><Link to="/" className="font-display text-2xl">ASEB Society</Link><BackLink fallback="/" label="Back to the website" /></div><div className="mx-auto w-full max-w-lg px-5 pb-20 pt-8"><p className="eyebrow">Your professional home</p><h1 className="mt-6 text-display-md">{mode === "signup" ? "Create your account." : mode === "forgot" ? "Reset your password." : "Welcome back."}</h1>
    <form className="mt-8 space-y-5" onSubmit={async (event) => {
      event.preventDefault(); if (busy) return; setBusy(true); setError(""); setNotice("");
      try {
        if (mode === "signup") {
          const { error: authError } = await supabase.auth.signUp({ email: email.trim(), password, options: { data: { name: name.trim() }, emailRedirectTo: `${window.location.origin}/auth` } });
          if (authError) setError(authError.message); else if (authError === null) setNotice("Check your email to confirm your account. Then sign in to see your application and manage your Circle preferences.");
        } else if (mode === "forgot") {
          const { error: authError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
          if (authError) setError(authError.message); else setNotice("If an account exists for that email, a password-reset link has been sent.");
        } else {
          const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
          if (authError) setError(authError.message); else await navigate({ href: destination, replace: true });
        }
      } catch { setError("Please check your connection and try again."); }
      finally { setBusy(false); }
    }}>
      {mode === "signup" && <label className="block"><span className="field-label">Full name</span><input required minLength={2} maxLength={200} autoComplete="name" className="field-input" value={name} onChange={(event) => setName(event.target.value)} /></label>}
      <label className="block"><span className="field-label">Email</span><input required type="email" maxLength={255} autoComplete="email" className="field-input" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
      {mode !== "forgot" && <label className="block"><span className="field-label">Password</span><input required type="password" minLength={8} maxLength={128} autoComplete={mode === "signup" ? "new-password" : "current-password"} className="field-input" value={password} onChange={(event) => setPassword(event.target.value)} /></label>}
      {error && <p className="text-sm text-ember" role="alert">{error}</p>}{notice && <p className="text-sm text-stone" role="status">{notice}</p>}
      <Button type="submit" disabled={busy} className="btn btn-primary h-auto w-full">{busy ? "Please wait…" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Sign in"} →</Button>
    </form>
    <div className="mt-6 flex flex-wrap justify-between gap-3"><Button variant="link" onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setError(""); setNotice(""); }}>{mode === "signup" ? "Already have an account? Sign in" : "Create an account"}</Button><Button variant="link" onClick={() => { setMode(mode === "forgot" ? "signin" : "forgot"); setError(""); setNotice(""); }}>{mode === "forgot" ? "Back to sign in" : "Forgot password?"}</Button></div>
    <p className="mt-8 text-sm text-stone">Use the same email as your membership application to see its review status. Membership approval remains with the Secretariat. <Link to="/join" className="underline underline-offset-4">Apply to join the Society</Link>.</p>
  </div></main>;
}