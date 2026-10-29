import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Link } from "@/lib/router";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [{ title: "Reset password | ASEB Society" }, { name: "description", content: "Set a new password for your ASEB account." }, { property: "og:title", content: "Reset password | ASEB Society" }, { property: "og:description", content: "Securely reset your ASEB account password." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }),
  component: ResetPassword,
});
function ResetPassword() {
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  useEffect(() => { setValid(new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"); }, []);
  return <main className="wrap max-w-lg py-20"><Link to="/" className="font-display text-2xl">ASEB Society</Link><h1 className="mt-10 text-display-md">Set a new password.</h1>{saved ? <><p role="status" className="mt-6">Your password has been updated.</p><Link to="/app" className="tlink mt-6">Open the member app →</Link></> : !valid ? <p className="mt-6 text-stone">Open the password-reset link from your email. <Link to="/auth" className="underline">Request a new link</Link>.</p> : <form className="mt-8 space-y-6" onSubmit={async (event) => { event.preventDefault(); if (password !== confirm) { setError("The passwords do not match."); return; } setBusy(true); setError(""); try { const { error: saveError } = await supabase.auth.updateUser({ password }); if (saveError) setError(saveError.message); else setSaved(true); } catch { setError("Your password could not be updated. Please try again."); } finally { setBusy(false); } }}><label className="block"><span className="field-label">New password</span><input required type="password" minLength={8} maxLength={128} autoComplete="new-password" className="field-input" value={password} onChange={(event) => setPassword(event.target.value)} /></label><label className="block"><span className="field-label">Confirm password</span><input required type="password" minLength={8} maxLength={128} autoComplete="new-password" className="field-input" value={confirm} onChange={(event) => setConfirm(event.target.value)} /></label>{error && <p role="alert" className="text-sm text-ember">{error}</p>}<Button disabled={busy} className="btn btn-primary h-auto" type="submit">{busy ? "Saving…" : "Save new password"}</Button></form>}</main>;
}