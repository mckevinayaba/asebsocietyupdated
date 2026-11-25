import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Link } from "@/lib/router";
import { getNotifications, markNotificationsRead } from "@/lib/community.functions";
import { timeAgo } from "@/components/village/Primitives";
import { Sheet } from "./Sheet";
import { BellIcon } from "./Icons";

// In-app notifications. The unread count comes from real rows only. These are records inside the
// platform. No email or push message is sent yet, and the panel says so.
export function NotificationsButton({ clear = false }: { clear?: boolean }) {
  const fetchItems = useServerFn(getNotifications);
  const markRead = useServerFn(markNotificationsRead);
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const query = useQuery({ queryKey: ["notifications"], queryFn: () => fetchItems(), refetchInterval: 120_000, staleTime: 60_000 });
  if (!query.data?.available) return null;
  const items = query.data.items;
  const unread = items.filter((n) => !n.read_at).length;
  return (
    <>
      <button type="button" onClick={async () => { setOpen(true); if (unread) { await markRead(); void queryClient.invalidateQueries({ queryKey: ["notifications"] }); } }}
        className={`relative grid h-11 w-11 place-items-center rounded-full transition-colors hover:bg-current/10 ${clear ? "" : ""}`} aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}>
        <BellIcon filled={unread > 0} />
        {unread > 0 && <span aria-hidden="true" className="absolute right-2 top-2 grid h-4 min-w-4 place-items-center rounded-full bg-signal px-1 text-[0.625rem] font-bold text-ink">{unread > 9 ? "9+" : unread}</span>}
      </button>
      <Sheet open={open} onOpenChange={setOpen} title="Notifications" description="Activity on your contributions. Email notifications are not active yet.">
        {items.length ? (
          <ul>{items.map((n) => (
            <li key={n.id} className="border-b border-hairline py-3.5">
              <p className={`text-[0.9375rem] ${n.read_at ? "text-stone" : "font-semibold"}`}>{n.message}</p>
              <p className="mt-0.5 text-[0.8125rem] text-stone">{timeAgo(n.created_at)}{n.content_id && <> · <Link to="/you?tab=contributions" onClick={() => setOpen(false)} className="underline underline-offset-4">My contributions</Link></>}</p>
            </li>
          ))}</ul>
        ) : <p className="py-8 text-stone">No notifications yet.</p>}
      </Sheet>
    </>
  );
}
