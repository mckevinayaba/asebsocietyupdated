import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    // Keep the intended destination through sign in. /auth validates it as a same-origin path.
    if (error || !data.user) throw redirect({ to: "/auth", search: { redirect: location.href } });
  },
  component: Outlet,
});