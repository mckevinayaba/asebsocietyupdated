// Resolves files in /public so they work both at the domain root and in a sub-folder preview.
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
