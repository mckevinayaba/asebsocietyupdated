<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Pages import Link/NavLink/useParams etc. from `@/lib/router`, a thin shim over TanStack Router kept from the React Router port; keep using it so page code stays simple.
- Public site pages live under the pathless `_site` layout (header/footer); `/app` sits outside it.
- Keep registry filtering in a pure shared module so directory behaviour can be tested independently of page rendering.
- Registry archive recognition and Society membership are distinct; never infer account membership from an awards listing.
- Public intake uses insert-only Cloud tables with pending status; never grant public reads of contact details or direct approval rights.
- Partnership interest forms share validation and one insert-only enquiry table, with explicit source-page/category mapping and database validation; this preserves private contact data and distinguishes commissioning requests from funder enquiries.
- Editorial pitches use the shared interest-form validation with a separate insert-only table so editorial and partnership review remain distinct.
- Member data is loaded and changed through authenticated server functions and owner-only RLS; editable profiles contain no authorization roles or membership approval status.
- Keep one root member-session subscriber; sign-out cancels queries, clears cached private data, clears the session and replaces navigation with the public auth page.
- `/app` is protected by the client-only `_authenticated` layout; public editorial and auth pages remain outside it.
- Keep public programme readiness and persona pathways in shared browser-safe content; homepage, programme pages and progress must use the same readiness source to avoid conflicting availability claims.
