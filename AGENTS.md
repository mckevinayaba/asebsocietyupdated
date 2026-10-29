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
